import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();

// ✅ 用 ES Module 方式获取 __dirname
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

// 静态资源
app.use(express.static(distPath));

// HTML fallback + 安全头
app.get('*', (req, res) => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.send(html);
});

// 启动服务
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`✅ Frontend running at http://localhost:${PORT}`);
});