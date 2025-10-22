import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const normalizeBasePath = (value?: string) => {
  if (!value?.trim()) {
    return '/';
  }

  let normalized = value.trim();
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
};

export default defineConfig(() => ({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
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
}));
