import { Request, Response } from 'express';
import * as alertService from '../services/alertService';
export const uploadAlerts = async (req: Request, res: Response) => {
  const alerts = req.body.alerts;

  if (!Array.isArray(alerts)) {
    return res.status(400).json({ message: 'alerts must be an array' });
  }

  // 简单字段校验（可用 Joi 替代）
  for (const alert of alerts) {
    if (
      typeof alert.timestamp !== 'string' ||
      typeof alert.alertType !== 'string' ||
      !Array.isArray(alert.details)
    ) {
      return res.status(400).json({ message: 'Invalid alert structure' });
    }

    for (const d of alert.details) {
      if (
        typeof d.object !== 'string' ||
        typeof d.confidence !== 'number'
      ) {
        return res.status(400).json({ message: 'Invalid detail structure' });
      }
    }
  }

  try {
    await alertService.createAlerts(alerts);
    return res.status(201).json({ message: 'Alerts uploaded successfully' });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Failed to upload alerts" });
  }
};



export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await alertService.getAllAlerts();  // ✅ 调用 service
    res.json({ alerts });
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};


export const updateAlert = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { message } = req.body;

  try {
    await alertService.updateAlert(id, { message });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update alert:", err);
    res.status(500).json({ message: 'Failed to update alert' });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await alertService.deleteAlert(id);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete alert:", err);
    res.status(500).json({ message: 'Failed to delete alert' });
  }
};


