import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** FUTURE: Proxy API in dev, bundle analyzer, env-specific builds */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
