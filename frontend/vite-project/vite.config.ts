import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInclude: ['**/*.wasm'],
    outDir: 'dist', // 默认即可
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      // 将以 /api 开头的请求代理到你的后端 API 地址
      '/api': {
        target: 'http://54.163.38.226:3000',  // 你的后端地址
        changeOrigin: true,  // 如果需要改变请求的 Origin
        rewrite: (path) => path.replace(/^\/api/, ''),  // 可选，重写路径，如果后端没有 `/api` 前缀
      },
    },
  },
});
