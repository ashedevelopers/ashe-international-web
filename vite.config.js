import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: {
    port: 5173,
    // Proxy API calls to `wrangler pages dev` (Pages Functions) during local development
    proxy: { '/api': 'http://localhost:8788' },
  },
  // Used by the build-time prerender (scripts/prerender.mjs): bundle these so Node never has to resolve their ESM/CJS entry points
  ssr: { noExternal: ['framer-motion', 'react-router-dom', 'react-router', '@remix-run/router'] },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild ? undefined : {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
}));
