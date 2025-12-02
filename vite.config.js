import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Use relative base so built assets load correctly when served via file:// in Electron.
  base: './',
  plugins: [react(), 
     VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'favicon.svg'],
      manifest: {
        name: 'Halifax',
        short_name: 'Halifax',
        description: 'Halifax inventory and sale management system',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    }),
  ],
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
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
 
})
