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
const reactNames = Object.keys(reactRequire('react')).filter((k) => /^[A-Za-z_$][\w$]*$/.test(k) && k !== 'default');
await shim('all', `import R from 'react'; import * as J from 'react/jsx-runtime'; import * as C from 'react-dom/client'; export default R; export const {${reactNames.join(',')}}=R; export const {jsx,jsxs}=J; export const {createRoot}=C;`);

// Stand-in for the dashboard's /apps/<name>/api reverse proxy: forwards to the real backend handler
// (unsigned, temp data dir) with the prefix rewritten, so the UI is tested against the real routes.
const { createHandler } = await import('../../backend/server.mjs');
const { createStore } = await import('../../backend/store.mjs');
const backend = createHandler({ store: createStore(mkdtempSync(join(tmpdir(), 'zk-crew-'))), allowUnsigned: true });
await shim('sdk', `export function useAppApi(){ return { get: (p) => fetch(p).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }) }; }`);

const HOST = `<!doctype html><html><head><meta charset="utf-8"><title>host</title>
<script type="importmap">{"imports":{"react":"/shims/all.mjs","react/jsx-runtime":"/shims/all.mjs","react-dom/client":"/shims/all.mjs","@kirocrew/app-sdk":"/shims/sdk.mjs"}}</script>
</head><body><div id="root" style="height:640px;overflow:auto"></div><div id="panel" style="border-top:1px solid #888"></div>
<script type="module">
  const mod = await import('/apps/zonked/ui/dist/index.mjs');
  const panel = await import('/apps/zonked/ui/dist/panel.mjs');
  const { createRoot } = await import('react-dom/client');
  const { jsx } = await import('react/jsx-runtime');
  window.__root = createRoot(document.getElementById('root'));
  window.__panelRoot = createRoot(document.getElementById('panel'));
  window.__mount = () => window.__root.render(jsx(mod.default, {}));
  window.__unmount = () => window.__root.render(null);
  window.__panelRoot.render(jsx(panel.default, {}));
  window.__mount();
</script></body></html>`;

function send(res, status, headers, body) { res.writeHead(status, headers); res.end(body); }
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  if (p.startsWith('/apps/zonked/api/')) {
    req.url = `/api/${p.slice('/apps/zonked/api/'.length)}`;
    return void backend(req, res);
  }
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

// Reads engine stats through the page's own singleton (same module instance the panel uses).
async function measure(pg) {
  return pg.evaluate(async () => {
    const m = await import('/apps/zonked/ui/dist/panel.mjs');
    return { ...(await m.engineStats()), state: m.engineState() };
  });
}
const out = { ok: false };
try {
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.getByRole('button', { name: 'Skip, just play' }).click();
  await page.waitForSelector('[data-testid=calm-safety-accept]');
  if (shots) await page.screenshot({ path: join(shots, 'gate.png') });
  await page.click('[data-testid=calm-safety-accept]');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForSelector('[data-testid=mini-stop], [data-playing=true]', { timeout: 15000 });
  await page.waitForFunction(() => document.querySelector('[data-testid=panel-stop]') !== null, null, { timeout: 15000 });
  await page.waitForTimeout(2600); // finish the 2 s ramp
  out.panelWhilePlaying = (await page.textContent('[data-testid=panel-hint]'))?.trim();
  out.statsPlaying = await measure(page);
  if (shots) await page.screenshot({ path: join(shots, 'calm-playing.png') });
  // Leave the page (route change). The sound must keep playing, the panel must still say so.
  await page.evaluate(() => window.__unmount());
  await page.waitForTimeout(1200);
  out.afterUnmountPanel = (await page.textContent('[data-testid=panel-hint]'))?.trim();
  out.statsAfterUnmount = await measure(page);
  await page.evaluate(() => window.__mount());
  await page.waitForSelector('[data-testid=play-status]');
  out.afterRemountStatus = (await page.textContent('[data-testid=play-status]'))?.trim();
  // Panel stop ends the sound, panel play restarts it.
  await page.click('[data-testid=panel-stop]');
  await page.waitForSelector('[data-testid=panel-play]');
  await page.waitForTimeout(600);
  out.afterPanelStop = (await measure(page)).state;
  await page.click('[data-testid=panel-play]');
  await page.waitForSelector('[data-testid=panel-stop]');
  out.stylesheet = await page.evaluate(() => document.querySelectorAll('link[data-zonked-css]').length);
  out.noSAB = await page.evaluate(() => typeof SharedArrayBuffer === 'undefined' || !self.crossOriginIsolated);
  if (shots) await page.screenshot({ path: join(shots, 'after-remount.png') });
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
  // Crew link: off by default, standalone while the backend has no report, steering after one.
  const crewStatus = async () => (await page.textContent('[data-testid=panel-crew-status]'))?.trim();
  out.crewDefault = await crewStatus();
  await page.check('[data-testid=panel-crew]');
  await page.waitForFunction(() => /not reachable/.test(document.querySelector('[data-testid=panel-crew-status]')?.textContent ?? ''), null, { timeout: 5000 });
  out.crewNoReport = await crewStatus();
  const sent = await fetch(`http://127.0.0.1:${port}/apps/zonked/api/intensity`, { method: 'POST', body: JSON.stringify({ version: 1, at: 1790000000, score: 70 }) });
  out.crewReportStatus = sent.status;
  await page.uncheck('[data-testid=panel-crew]');
  await page.check('[data-testid=panel-crew]');
  await page.waitForFunction(() => /steering/.test(document.querySelector('[data-testid=panel-crew-status]')?.textContent ?? ''), null, { timeout: 5000 });
  out.crewSteering = await crewStatus();
  await page.uncheck('[data-testid=panel-crew]');
  out.crewOff = await crewStatus();
  out.crewOk = out.crewDefault === 'Crew is off.' && /not reachable/.test(out.crewNoReport) && out.crewSteering === 'Crew is steering.' && out.crewOff === 'Crew is off.';
  out.ok = out.crewOk && out.statsPlaying.peak > 0 && out.statsPlaying.peak <= 0.95 && out.statsAfterUnmount.peak > 0 && out.afterPanelStop !== 'running';
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
