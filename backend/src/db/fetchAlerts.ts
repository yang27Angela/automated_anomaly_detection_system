import  db  from './db';

export async function fetchAlerts(limit = 100) {
  const [rows] = await db.query(
    'SELECT id, timestamp, alert_type, message, frame_url, created_at FROM alerts ORDER BY created_at DESC LIMIT ?',
    [limit]
  );
  return rows;
}