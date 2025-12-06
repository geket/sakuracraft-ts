import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path - must match GitHub deployment location
  base: '/games/sakuracraft/',
  
  // Build configuration for GAME APPLICATION (not library!)
  build: {
    outDir: 'dist',
    
    // Production optimizations
    minify: 'terser',
    sourcemap: false,  // Disable in production for security
    
    terser: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
        passes: 2
      },
      format: {
        comments: false
      }
    },
    
    // Rollup options for optimization
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')  // Entry point
      },
      output: {
        // Hash-based filenames for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        
        // Chunk splitting for better caching
        manualChunks(id) {
          // Separate vendor code
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('cannon')) return 'physics';
            return 'vendor';
          }
        }
      }
    },
    
    // Chunk size warning (increase for game assets)
    chunkSizeWarningLimit: 1500,
    
    // Modern target for smaller bundles
    target: 'esnext',
    
    // Asset inlining threshold
    assetsInlineLimit: 4096,  // 4kb
    
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Path resolution with aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@game': resolve(__dirname, 'src/game'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  
  // Development server
  server: {
    port: 3000,
    open: true,
    cors: true,
    strictPort: false,
    host: true  // Listen on all addresses
  },
  
  // Preview server (test production build)
  preview: {
    port: 4173,
    open: true,
    host: true
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['three', 'cannon-es'],  // Pre-bundle large deps
    exclude: []
  },
  
  // Global constants injected at build time
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
  }
});
