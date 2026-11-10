import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Relative base so the app works from any folder (GitHub Pages sub-path, a school server, a USB stick).
export default defineConfig({
  base: './',
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
  plugins: [
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: 'SayMaCoder',
        short_name: 'SayMaCoder',
        description: 'Learn to code on your phone with no data and no subscription.',
        theme_color: '#0b6b4f',
        background_color: '#f6f5f1',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell, workers and the C interpreter are cached on first visit (small).
        // The big Python runtime is NOT precached: students download it on purpose from Settings,
        // and it is then served from the "saymacoder-packs" cache by pack-sw.js.
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        globIgnores: ['pyodide/**'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // Runtime packs are served by public/pack-sw.js (registered synchronously inside the service worker).
        importScripts: ['pack-sw.js'],
      },
    }),
  ],
});
