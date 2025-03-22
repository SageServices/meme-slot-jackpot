
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
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
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  define: {
    'import.meta.env': process.env,
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
      'buffer': 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
    },
    // Add specific resolution for issue with rollup/parseAst
    dedupe: ['three']
  },
  optimizeDeps: {
    include: ['@solana/web3.js', '@radix-ui/react-*', 'sonner', 'three']
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'solana': ['@solana/web3.js'],
        }
      }
    }
  }
}));
