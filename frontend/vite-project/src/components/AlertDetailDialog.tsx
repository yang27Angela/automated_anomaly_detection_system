import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from '@mui/material';

type AlertDetail = {
  object: string;
  confidence: number;
};

type Alert = {
  id?: string;
  timestamp: string;
  alertType: string;
  message: string;
  frame: string;
  details?: AlertDetail[];
};

export default function AlertDetailDialog({
  open,
  alert,
  onClose,
  onUpdate,
  onDelete,
  readOnly = false,
}: {
  open: boolean;
  alert: Alert | null;
  onClose: () => void;
  onUpdate?: (a: Alert) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}) {
  const [edited, setEdited] = useState<Alert | null>(null);

  useEffect(() => {
    if (alert) {
      setEdited({ ...alert });
    }
  }, [alert]);

  if (!edited) return null;

  const handleUpdate = () => {
    if (onUpdate) onUpdate(edited);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && edited.id) onDelete(edited.id);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Alert Detail</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Timestamp"
          fullWidth
          margin="dense"
          value={edited.timestamp}
          disabled
        />
        <TextField
          label="Type"
          fullWidth
          margin="dense"
          value={edited.alertType}
          disabled
        />
        <TextField
          label="Message"
          fullWidth
          margin="dense"
          value={edited.message}
          disabled={readOnly}
          onChange={(e) => setEdited({ ...edited, message: e.target.value })}
        />
        {edited.frame && (
          <img
            src={edited.frame}
            alt="frame"
            style={{ width: '100%', marginTop: 12, borderRadius: 4 }}
          />
        )}
        {edited.details?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <Typography variant="subtitle2">Details:</Typography>
            {edited.details.map((d, i) => (
              <Typography key={i} variant="body2">
                • {d.object} (conf: {d.confidence.toFixed(2)})
              </Typography>
            ))}
          </div>
        )}
      </DialogContent>
      {!readOnly && (
        <DialogActions>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            Save
          </Button>
          <Button onClick={handleDelete} color="error" variant="outlined">
            Delete
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
