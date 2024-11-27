import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@api': path.resolve(__dirname, './src/api'),
      '@config': path.resolve(__dirname, './src/config'),
      '@menu-items': path.resolve(__dirname, './src/menu-items'),
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensures proper chunking and asset loading
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
      },
    },
    // Generates sourcemaps for debugging
    sourcemap: true,
    // Ensures proper asset handling
    assetsInlineLimit: 4096,
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  // Add base URL if you're not deploying to root
  // base: '/',
  server: {
    port: 3000,
    host: true,
    strictPort: true,
  },
})