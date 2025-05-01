import db from './db';

export async function insertAlerts(alerts: any[]) {
  const values = alerts.map((a) => [
    a.timestamp,
    a.alertType,
    a.message,
    a.frame
  ]);

  const [result] = await db.query(
    'INSERT INTO alerts (timestamp, alert_type, message, frame_url) VALUES ?',
    [values]
  );

  return (result as any).affectedRows;
}
