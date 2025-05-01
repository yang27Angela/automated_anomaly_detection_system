import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

// 🔒 自定义插件，强制安全响应头
function securityHeadersPlugin() {
  return {
    name: 'html-security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
    fs: {
      allow: [
        '/Users/angelayang/ML interview assignment/frontend/vite-project/src',
        '/Users/angelayang/ML interview assignment/frontend/vite-project/public',
      ]
    },
  },
  build: {
    assetsInclude: ['**/*.wasm'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    dedupe: ['react', 'react-dom'], // ✅ 关键解决 hook 冲突、版本冲突
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude, 'dist/**'],
  }
});
