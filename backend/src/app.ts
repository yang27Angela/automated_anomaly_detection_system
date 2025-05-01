import express from 'express';
import alertRoutes from './routes/alertRoutes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // ✅ 放大限制

app.use('/api/alerts', alertRoutes);

export default app;
