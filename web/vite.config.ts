import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Required for SharedArrayBuffer in dev and preview. Mirrors public/_headers.
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'logo.svg', 'apple-touch-icon.png'],
      workbox: {
        // Only the 6 starter loops are precached (about 1.2 MB). The other loops are cached on first play by the
        // runtime rule below, same origin and samples path only, so first load and install size stay small.
        globPatterns: ['**/*.{html,js,css,wasm,svg,png,webmanifest,ico,woff2}', 'samples/{rain,stream,ocean,forest,birds,breeze}.mp3.json'],
        runtimeCaching: [{
          urlPattern: ({ url, sameOrigin }) => sameOrigin && /^\/samples\/[a-z]+\.mp3\.json$/.test(url.pathname),
          handler: 'CacheFirst',
          options: { cacheName: 'zonked-samples', cacheableResponse: { statuses: [200] }, expiration: { maxEntries: 40 } },
        }],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Zonked',
        short_name: 'Zonked',
        description: 'Calm sound for tired minds. Free, private, works offline.',
        theme_color: '#0A0B0F',
        background_color: '#0A0B0F',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  worker: {
    format: 'es',
    rollupOptions: {
      output: { entryFileNames: 'assets/[name]-[hash].js' },
    },
  },
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders },
});
