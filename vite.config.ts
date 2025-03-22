
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Fixed TypeScript configuration for vite.config.ts
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
    // @ts-ignore - componentTagger may not be available or have type issues
    mode === 'development' ? require("lovable-tagger").componentTagger() : undefined,
  ].filter(Boolean),
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
    include: ['@solana/web3.js', '@radix-ui/react-*', 'sonner']
  }
}));
