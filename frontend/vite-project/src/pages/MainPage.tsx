import React, { useState } from 'react';
import AlertTable, { Alert } from '../components/AlertTable';
import AlertDetailDialog from '../components/AlertDetailDialog';
import {
  Typography,
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';

export default function MainPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [requirePerson, setRequirePerson] = useState(true);
  const [requireCar, setRequireCar] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setAlerts(data.alerts || []);
    } catch (err: unknown) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchSearch =
      !search ||
      a.message?.toLowerCase().includes(search.toLowerCase()) ||
      a.alertType?.toLowerCase().includes(search.toLowerCase());
    const hasPerson = a.details?.some((d) => d.class === 'person') ?? false;
    const hasCar = a.details?.some((d) => d.class === 'car') ?? false;
    return matchSearch && (!requirePerson || hasPerson) && (!requireCar || hasCar);
  });

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Automated Anomaly Detection
      </Typography>
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        style={{ marginBottom: 16 }}
      />
      {loading && <CircularProgress />}
      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={requirePerson}
            onChange={(e) => setRequirePerson(e.target.checked)}
          />
        }
        label="Require Person"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={requireCar}
            onChange={(e) => setRequireCar(e.target.checked)}
          />
        }
        label="Require Car"
      />
      <AlertTable alerts={filteredAlerts} onRowClick={setSelectedAlert} />
      <AlertDetailDialog
        open={!!selectedAlert}
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        readOnly
      />
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <MuiAlert severity="error">{error}</MuiAlert>
      </Snackbar>
    </div>
  );
}
