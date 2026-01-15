import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/webhook': {
            target: 'https://cloud.1c.fitness/api/hs/lead/Webhook/86c0fd3d-e370-4499-9ed2-e032832de2dc',
            changeOrigin: true,
            rewrite: (path) => '',
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, req, res) => {
                // Убедимся, что Content-Type правильный
                if (req.headers['content-type']) {
                  proxyReq.setHeader('Content-Type', req.headers['content-type']);
                }
              });
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
