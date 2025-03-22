
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Simplified configuration that doesn't attempt to modify tsconfig.node.json
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  plugins: [
    react(),
    // Remove the component tagger that might be causing issues
  ],
  define: {
    'import.meta.env': process.env,
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
      'buffer': 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
    }
  },
  optimizeDeps: {
    include: ['@solana/web3.js', '@radix-ui/react-*', 'sonner', 'three']
  }
}));
