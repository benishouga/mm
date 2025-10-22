import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
  ],
  server: {
    port: 8080,
    open: true,
  },
  envPrefix: ['VITE_'],
});
