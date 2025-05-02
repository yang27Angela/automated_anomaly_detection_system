import React, { useState } from 'react';
import {
  Typography,
  CircularProgress,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Button,
  Alert as MuiAlert
} from '@mui/material';
import AlertTable, { Alert } from '../components/AlertTable';
import AlertDetailDialog from '../components/AlertDetailDialog';
import { extractFramesFromVideo } from '../utils/frameExtractor';
import { runYOLOOnFrames } from '../utils/runYOLOOnFrames';

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
      const frames = await extractFramesFromVideo(file);
      const generated = await runYOLOOnFrames(frames);

      const alertsWithTimestamps = generated.map((alert: any): Alert => ({
        ...alert,
        created_at: new Date().toISOString()
      }));

      const res = await fetch(`${API_BASE_URL}/api/alerts/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alerts: alertsWithTimestamps })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setAlerts(alertsWithTimestamps);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchSearch =
      !search ||
      a.message?.toLowerCase().includes(search.toLowerCase()) ||
      a.alertType?.toLowerCase().includes(search.toLowerCase());

    const hasPerson = a.details?.some((d) => d.object?.toLowerCase() === 'person') ?? false;
    const hasCar = a.details?.some((d) => d.object?.toLowerCase() === 'car') ?? false;

    return matchSearch &&
      (!requirePerson || hasPerson) &&
      (!requireCar || hasCar);
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
        disabled={loading}
        style={{ marginBottom: 16 }}
      />
      {loading && <CircularProgress />}

      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
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

      <Button
        variant="outlined"
        style={{ margin: '16px 0' }}
        onClick={() => window.location.href = '/history'}
      >
        View History
      </Button>

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
