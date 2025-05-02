import React, { useEffect, useState } from 'react';
import {
  Typography, TextField, Checkbox, FormControlLabel,
  Snackbar, Alert as MuiAlert, Button, CircularProgress
} from '@mui/material';
import AlertTable, { Alert } from '../components/AlertTable';
import AlertDetailDialog from '../components/AlertDetailDialog';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function HistoryPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [search, setSearch] = useState('');
  const [requirePerson, setRequirePerson] = useState(false);
  const [requireCar, setRequireCar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/alerts`);
        const data = await res.json();

        const normalized: Alert[] = data.alerts.map((a: any) => ({
          ...a,
          alertType: a.alertType || a.alert_type,
          details: typeof a.details === 'string' ? JSON.parse(a.details) : a.details,
          created_at: a.created_at || a.createdAt,
        }));

        setAlerts(normalized);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
        setSnackbarMessage("❌ Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleUpdateAlert = async (updated: Alert) => {
    try {
      await fetch(`${API_BASE_URL}/api/alerts/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setSnackbarMessage('✅ Alert updated');
    } catch (err) {
      console.error("Update failed", err);
      setSnackbarMessage('❌ Update failed');
    } finally {
      setSelectedAlert(null);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/alerts/${id}`, { method: 'DELETE' });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      setSnackbarMessage('🗑️ Alert deleted');
    } catch (err) {
      console.error("Delete failed", err);
      setSnackbarMessage('❌ Delete failed');
    } finally {
      setSelectedAlert(null);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchSearch = !search ||
      a.message?.toLowerCase().includes(search.toLowerCase()) ||
      a.alertType?.toLowerCase().includes(search.toLowerCase());
    const hasPerson = a.details?.some((d) => d.class === 'person') ?? false;
    const hasCar = a.details?.some((d) => d.class === 'car') ?? false;
    return matchSearch && (!requirePerson || hasPerson) && (!requireCar || hasCar);
  });

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Alert History</Typography>
      {loading && <CircularProgress />}
      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <FormControlLabel
        control={<Checkbox checked={requirePerson} onChange={(e) => setRequirePerson(e.target.checked)} />}
        label="Require Person"
      />
      <FormControlLabel
        control={<Checkbox checked={requireCar} onChange={(e) => setRequireCar(e.target.checked)} />}
        label="Require Car"
      />
      <Button onClick={() => window.location.href = '/'} style={{ marginBottom: 8 }}>
        ← Back to Upload
      </Button>
      <AlertTable alerts={filteredAlerts} onRowClick={setSelectedAlert} />
      <AlertDetailDialog
        open={!!selectedAlert}
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onUpdate={handleUpdateAlert}
        onDelete={handleDeleteAlert}
        readOnly={false}
      />
      <Snackbar open={!!snackbarMessage} autoHideDuration={4000} onClose={() => setSnackbarMessage('')}>
        <MuiAlert severity="info">{snackbarMessage}</MuiAlert>
      </Snackbar>
    </div>
  );
}
