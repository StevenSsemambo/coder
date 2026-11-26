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
        background_color: '#06261d',
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
        // App shell, workers, the C interpreter and SQLite (sql.js, wasm) are cached on first visit (small).
        // The big Python, PHP and Java runtimes are NOT precached: students download them on purpose from Settings,
        // and it is then served from the "saymacoder-packs" cache by pack-sw.js.
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest,wasm}'],
        globIgnores: ['pyodide/**', 'php/**', 'java/**'],
        // All courses live in one JavaScript file, which grew past the 2 MiB default when the PHP lessons were added.
        // A file over the limit is silently NOT precached, which would break offline use. The main file was 3.8 MiB on 2026-11-21 (4 MiB was almost used up),
        // so the limit is now 8 MiB. The "Show a solution" answers already load as their own chunk. Longer term: load each course on demand.
        // Longer term: load each course on demand (dynamic import) instead of bundling all of them together.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: 'index.html',
        // The C++ phone test page (public/cpp-test/) is its own page: never answer it with the app shell.
        navigateFallbackDenylist: [/\/cpp-test\//],
        cleanupOutdatedCaches: true,
        // Runtime packs are served by public/pack-sw.js (registered synchronously inside the service worker).
        importScripts: ['pack-sw.js'],
      },
    }),
  ],
});
