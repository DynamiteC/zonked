// Offline proof: serves the built app bundle the way the Kiro Crew dashboard does
// (same document CSP, same per-file headers, same extension allow-list) and runs it in
// headless Chromium. Needs web/node_modules (playwright, esbuild). No network use.
//
//   node app/ui/scripts/csp-harness.mjs [--shots <dir>]
import http from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync, statSync, mkdirSync, mkdtempSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const uiDir = resolve(here, '..');
const webRequire = createRequire(resolve(uiDir, '../../web/package.json'));
const { chromium } = webRequire('playwright');
const esbuild = webRequire('esbuild');
const reactRequire = createRequire(join(uiDir, 'package.json'));

// Copied from the running dashboard (GET /): the document CSP, minus nothing.
const DASH_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://esm.sh; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://esm.sh; img-src 'self' data: blob: https:; font-src 'self' data: https://esm.sh; connect-src 'self' ws://localhost:* ws://127.0.0.1:* https://esm.sh http://127.0.0.1:* http://localhost:* http://0.0.0.0:* https://127.0.0.1:* https://localhost:* https://0.0.0.0:* http://*.apps.localhost:*; media-src 'self' blob:; worker-src 'self' blob:; frame-src 'self' blob: https://*.cloudfront.net http://127.0.0.1:* http://localhost:* http://0.0.0.0:* https://127.0.0.1:* https://localhost:* https://0.0.0.0:* http://*.apps.localhost:*; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'";
// Allow-list and MIME map copied from the gateway's app UI route (apps/routes_static.py).
const MIME = {
  '.mjs': 'application/javascript', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json',
};

const shimDir = mkdtempSync(join(tmpdir(), 'zk-shim-'));
async function shim(name, code, external = []) {
  await esbuild.build({
    stdin: { contents: code, resolveDir: reactRequire.resolve('react/package.json').replace(/package\.json$/, '..') },
    bundle: true, format: 'esm', external, outfile: join(shimDir, `${name}.mjs`), define: { 'process.env.NODE_ENV': '"production"' },
  });
}
await shim('all', "import R from 'react'; import * as J from 'react/jsx-runtime'; import * as C from 'react-dom/client'; export default R; export const {useState,useEffect,useRef,useMemo,useCallback,createElement,Fragment,StrictMode}=R; export const {jsx,jsxs}=J; export const {createRoot}=C;");

const HOST = `<!doctype html><html><head><meta charset="utf-8"><title>host</title>
<script type="importmap">{"imports":{"react":"/shims/all.mjs","react/jsx-runtime":"/shims/all.mjs","react-dom/client":"/shims/all.mjs"}}</script>
</head><body><div id="root"></div>
<script type="module">
  const mod = await import('/apps/zonked/ui/dist/index.mjs');
  const { createRoot } = await import('react-dom/client');
  const { jsx } = await import('react/jsx-runtime');
  window.__root = createRoot(document.getElementById('root'));
  window.__mount = () => window.__root.render(jsx(mod.default, {}));
  window.__unmount = () => window.__root.render(null);
  window.__mount();
</script></body></html>`;

function send(res, status, headers, body) { res.writeHead(status, headers); res.end(body); }
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  if (p === '/') return send(res, 200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': DASH_CSP, 'Cache-Control': 'no-store' }, HOST);
  const base = p.startsWith('/shims/') ? shimDir : p.startsWith('/apps/zonked/ui/') ? join(uiDir) : null;
  if (!base) return send(res, 404, {}, 'nf');
  const rel = p.startsWith('/shims/') ? p.slice(7) : p.slice('/apps/zonked/ui/'.length);
  const file = resolve(base, rel);
  if (!file.startsWith(base)) return send(res, 400, {}, 'bad');
  const ext = extname(file).toLowerCase();
  if (!(ext in MIME)) return send(res, 403, { 'Content-Type': 'application/json' }, JSON.stringify({ error: `file type '${ext}' not allowed` }));
  try { statSync(file); } catch { return send(res, 404, {}, 'nf'); }
  send(res, 200, {
    'Content-Type': MIME[ext], 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  }, readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const shotsIdx = process.argv.indexOf('--shots');
const shots = shotsIdx > 0 ? resolve(process.argv[shotsIdx + 1]) : null;
if (shots) mkdirSync(shots, { recursive: true });

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const logs = [];
page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`));
page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
const failed = [];
page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

const out = { ok: false };
try {
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForSelector('[data-testid=start]');
  await page.click('[data-testid=start]');
  await page.waitForSelector('[data-testid=safety]');
  if (shots) await page.screenshot({ path: join(shots, 'gate.png') });
  await page.click('[data-testid=safety-accept]');
  await page.waitForFunction(() => /"state": "(running|error)"/.test(document.querySelector('[data-testid=status]')?.textContent ?? ''), null, { timeout: 15000 });
  await page.waitForTimeout(2600); // finish the 2 s ramp
  await page.click('[data-testid=measure]');
  await page.waitForFunction(() => /peak=/.test(document.querySelector('[data-testid=stats]')?.textContent ?? ''));
  out.status = JSON.parse(await page.textContent('[data-testid=status]'));
  out.stats = (await page.textContent('[data-testid=stats]')).trim();
  out.caps = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-testid=caps] tr')].map((tr) => [tr.children[0].textContent, tr.children[1].textContent])));
  if (shots) await page.screenshot({ path: join(shots, 'running.png') });
  // Unmount the page (route change) and check the engine singleton keeps running.
  await page.evaluate(() => window.__unmount());
  await page.waitForTimeout(500);
  await page.evaluate(() => window.__mount());
  await page.waitForSelector('[data-testid=status]');
  out.afterRemount = JSON.parse(await page.textContent('[data-testid=status]')).state;
  await page.click('[data-testid=measure]');
  await page.waitForTimeout(400);
  out.statsAfterRemount = (await page.textContent('[data-testid=stats]')).trim();
  // Blob URL worklet under this CSP (script-src has no blob:).
  out.blobWorklet = await page.evaluate(async () => {
    try {
      const ctx = new AudioContext();
      const u = URL.createObjectURL(new Blob(['registerProcessor("x",class extends AudioWorkletProcessor{process(){return true}})'], { type: 'text/javascript' }));
      await ctx.audioWorklet.addModule(u);
      return 'allowed';
    } catch (e) { return `blocked: ${e.name}`; }
  });
  // Data-less wasm fetch: data: URL under connect-src.
  out.dataUrlFetch = await page.evaluate(async () => {
    try { await fetch('data:application/wasm;base64,AGFzbQEAAAA='); return 'allowed'; } catch (e) { return `blocked: ${e.name}`; }
  });
  out.wasmDirect = await page.evaluate(async () => (await fetch('/apps/zonked/ui/dist/assets/dsp_core.wasm')).status);
  out.ok = out.status.state === 'running';
} catch (e) {
  out.error = String(e);
  if (shots) await page.screenshot({ path: join(shots, 'error.png') }).catch(() => {});
}
out.failedRequests = failed;
out.console = logs.slice(0, 20);
console.log(JSON.stringify(out, null, 2));
await browser.close();
server.close();
process.exit(out.ok ? 0 : 1);
