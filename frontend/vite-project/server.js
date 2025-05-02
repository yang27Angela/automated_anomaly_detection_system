const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

// ✅ 中间件：为所有 HTML 请求添加安全头
app.get('/', (req, res) => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});

// ✅ 提供静态文件（除了 / 本身）
app.use(express.static(distPath));

// ✅ 其他 SPA 路由 fallback
app.get('*', (req, res) => {
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`✅ Frontend running at http://localhost:${PORT}`);
});