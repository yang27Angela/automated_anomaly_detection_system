import express from 'express';
import alertRoutes from './routes/alertRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

// ✅ 加载 .env 文件
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/alerts', alertRoutes);

export default app;
