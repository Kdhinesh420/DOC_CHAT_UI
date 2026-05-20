import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/webhook-test': {
        target: 'https://devakavi.app.n8n.cloud',
        changeOrigin: true,
        secure: false,
      },
      '/webhook': {
        target: 'https://devakavi.app.n8n.cloud',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
