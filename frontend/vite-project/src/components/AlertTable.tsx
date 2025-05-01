import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@mui/material';

export interface AlertDetail {
  object: string;
  confidence: number;
}

export interface Alert {
  id?: string;
  timestamp: string;
  created_at?: string;
  alertType: string;
  message?: string;
  frame_url?: string;
  details?: AlertDetail[];
}

export default function AlertTable({
  alerts,
  onRowClick,
}: {
  alerts: Alert[];
  onRowClick: (alert: Alert) => void;
}) {
  console.log('[UI] Rendering table with', alerts.length, 'alerts');

  return (
    <>
      {alerts.length === 0 ? (
        <Typography>No alerts</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((a, i) => (
              <TableRow
                key={i}
                hover
                onClick={() => onRowClick(a)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{a.timestamp}</TableCell>
                <TableCell>{a.created_at}</TableCell>
                <TableCell>{a.alertType}</TableCell>
                <TableCell>{a.message}</TableCell>
                <TableCell>
                  {a.frame_url ? (
                    <img src={a.frame_url} alt="frame" style={{ height: '60px' }} />
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
