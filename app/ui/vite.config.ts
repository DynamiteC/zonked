import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
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

// The app build swaps the Calm session hook for one backed by the module singleton, so the
// player, timers and MediaSession outlive the page. web/ itself is not touched.
const calmHook = fileURLToPath(new URL('../../web/src/ui/calm/useCalmSession.ts', import.meta.url));
const appHook = fileURLToPath(new URL('./src/engine/useSession.ts', import.meta.url));
function swapSessionHook(): Plugin {
  return {
    name: 'zonked-swap-session-hook',
    enforce: 'pre',
    async resolveId(id, importer, opts) {
      if (!importer || !id.endsWith('useCalmSession')) return null;
      const r = await this.resolve(id, importer, { ...opts, skipSelf: true });
      return r?.id === calmHook ? appHook : null;
    },
  };
}

// Lib mode also inlines the fonts into the css as data: URIs. This plugin moves them out into
// real .woff2 files (the dashboard serves .woff2) and points the css at them.
function fontsAsFiles(): Plugin {
  return {
    name: 'zonked-fonts-as-files',
    enforce: 'post',
    generateBundle: {
      order: 'post',
      handler(_o, bundle) {
      // The OFL text must travel with the font files.
      this.emitFile({ type: 'asset', fileName: 'assets/OFL.txt', source: readFileSync(fileURLToPath(new URL('../../web/public/fonts/OFL.txt', import.meta.url))) });
      for (const item of Object.values(bundle)) {
        if (item.type !== 'asset' || !item.fileName.endsWith('.css')) continue;
        let css = String(item.source);
        css = css.replace(/url\(["']?data:font\/woff2;base64,([A-Za-z0-9+/=]+)["']?\)/g, (_m, b64: string) => {
          const bytes = Buffer.from(b64, 'base64');
          const name = `assets/atkinson-${createHash('sha256').update(bytes).digest('hex').slice(0, 8)}.woff2`;
          this.emitFile({ type: 'asset', fileName: name, source: bytes });
          return `url("./${name}")`;
        });
        item.source = css;
      }
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [wasmAsFile(), swapSessionHook(), fontsAsFiles(), react()],
  resolve: { alias: { '@zonked-web': webSrc } },
  server: { fs: { allow: ['..', '../..'] } },
  build: {
    lib: {
      // Two entries share one chunk (engine singleton), so page and panel tab see the same player.
      entry: { index: 'src/App.tsx', panel: 'src/Panel.tsx' },
      formats: ['es'],
      fileName: (_fmt, name) => `${name}.mjs`,
    },
    cssCodeSplit: false,
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: { chunkFileNames: 'chunk-[name]-[hash].mjs', assetFileNames: (a) => (a.name?.endsWith('.css') ? 'zonked.css' : 'assets/[name]-[hash][extname]') },
      external: ['react', 'react-dom', 'react/jsx-runtime', '@kirocrew/app-sdk', '@kirocrew/app-sdk/ui', 'lucide-react', '@tanstack/react-query'],
    },
  },
});
