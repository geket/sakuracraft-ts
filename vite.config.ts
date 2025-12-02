import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SakuraCraft',
      fileName: (format) => `sakuracraft.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    },
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
