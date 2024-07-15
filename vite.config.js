import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'frontend/dist', // This should match the directory from where you are serving static files
    assetsDir: 'assets', // Where to place the static assets (relative to `outDir`)
  },
  server: {
    port: 3001, // Ensure this matches your backend server port if needed
  },
});
