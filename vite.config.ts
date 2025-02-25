
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  define: {
    'import.meta.env': process.env,
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['@solana/web3.js', '@radix-ui/react-*', 'sonner']
  }
});
