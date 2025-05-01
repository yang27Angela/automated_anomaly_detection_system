import db from '../db/db';

// 获取所有 alerts（可按时间排序）
export const getAllAlerts = async () => {
  const [rows] = await db.query("SELECT * FROM alerts ORDER BY timestamp DESC");
  return rows;
};

// 批量创建 alerts
export const createAlerts = async (alerts: any[]) => {
    const values = alerts.map((a) => [
      a.timestamp,
      a.alertType || a.alert_type,
      a.message,
      a.frame || a.frame_url,
      JSON.stringify(a.details || []),
    ]);
  
    const query = `
      INSERT INTO alerts (timestamp, alert_type, message, frame_url, details)
      VALUES ?
    `;
  
    await db.query(query, [values]);
  };
  

// 更新 alert message
export const updateAlert = async (id: string, newData: any) => {
  await db.query(
    "UPDATE alerts SET message = ? WHERE id = ?",
    [newData.message, id]
  );
};

// 删除 alert by ID
export const deleteAlert = async (id: string) => {
  await db.query("DELETE FROM alerts WHERE id = ?", [id]);
};
