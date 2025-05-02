import express from 'express';
import alertRoutes from './routes/alertRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ 配置 CORS —— 指定前端 Tunnel 地址
app.use(cors({
  origin: 'https://circumstances-diagnostic-review-creek.trycloudflare.com',
  credentials: true
}));

// ✅ JSON payload 限制加在 cors 之后
app.use(express.json({ limit: '10mb' }));

app.use('/api/alerts', alertRoutes);

export default app;
