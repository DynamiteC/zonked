import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

// The audio engine, the AudioWorklet and dsp_core.wasm are imported straight from
// ../../web/src (alias below). Vite emits the worklet and the wasm into dist/assets,
// so no second copy of either file is committed.
const webSrc = fileURLToPath(new URL('../../web/src', import.meta.url));

// Vite lib mode inlines every ?url asset as a data: URI, and the dashboard CSP blocks
// fetch(data:) (connect-src has no data:). This plugin emits the wasm as a real file and
// resolves its URL against the bundle with import.meta.url. The dashboard serves app files
// only for a fixed extension list (.mjs .js .css .json .svg .png ... , no .wasm), so the file
// is named .wasm.json. The engine fetches bytes and instantiates from an ArrayBuffer, so the
// served MIME type (application/json) does not matter.
function wasmAsFile(): Plugin {
  return {
    name: 'zonked-wasm-as-file',
    enforce: 'pre',
    resolveId(id, importer) {
      if (!id.endsWith('.wasm?url') || !importer) return null;
      return `\0wasm:${fileURLToPath(new URL(id.slice(0, -4), `file://${importer}`))}`;
    },
    load(id) {
      if (!id.startsWith('\0wasm:')) return null;
      const file = id.slice(6);
      const ref = this.emitFile({ type: 'asset', fileName: 'assets/dsp_core.wasm.json', source: readFileSync(file) });
      return `export default new URL(import.meta.ROLLUP_FILE_URL_${ref}).href;`;
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [wasmAsFile(), react()],
  resolve: { alias: { '@zonked-web': webSrc } },
  server: { fs: { allow: ['..', '../..'] } },
  build: {
    lib: { entry: 'src/App.tsx', formats: ['es'], fileName: () => 'index.mjs' },
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@kirocrew/app-sdk', '@kirocrew/app-sdk/ui', 'lucide-react', '@tanstack/react-query'],
    },
  },
});
