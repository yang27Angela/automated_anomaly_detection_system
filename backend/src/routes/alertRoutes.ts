import express from 'express';
import * as alertController from '../controllers/alertController';

const router = express.Router();

router.post('/upload', alertController.uploadAlerts);
router.get('/', alertController.getAlerts);
router.put('/:id', alertController.updateAlert);
router.delete('/:id', alertController.deleteAlert);

export default router;
