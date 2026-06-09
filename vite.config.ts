import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

const MANIFEST = {
  name: 'Learn Phrases',
  short_name: 'LP',
  description: 'Приложение для изучения и повторения фраз',
  start_url: '/?source=pwa',
  scope: '/',
  display: 'standalone' as const,
  orientation: 'portrait-primary' as const,
  background_color: '#f3f3f3',
  theme_color: '#007bff',
  lang: 'ru',
  categories: ['education', 'utilities'],
  icons: [
    { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
    { src: '/pwa-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' as const },
  ],
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: MANIFEST,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
})
