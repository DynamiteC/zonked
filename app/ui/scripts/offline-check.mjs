// Offline proof: loads the built Calm page from app/ui/dist in headless Chromium, blocks every
// request that is not to the page's own origin, accepts the safety notice, plays, and checks the
// engine runs. Reads dist, never rebuilds it. Needs web/node_modules (playwright, esbuild).
//
//   node app/ui/scripts/offline-check.mjs
import http from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync, statSync, mkdtempSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const uiDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const webRequire = createRequire(resolve(uiDir, '../../web/package.json'));
const { chromium } = webRequire('playwright');
const esbuild = webRequire('esbuild');
const reactRequire = createRequire(join(uiDir, 'package.json'));

const MIME = {
  '.mjs': 'application/javascript', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.map': 'application/json',
};
const shimDir = mkdtempSync(join(tmpdir(), 'zk-offline-'));
const reactNames = Object.keys(reactRequire('react')).filter((k) => /^[A-Za-z_$][\w$]*$/.test(k) && k !== 'default');
const build = (name, code) => esbuild.build({
  stdin: { contents: code, resolveDir: uiDir }, bundle: true, format: 'esm', outfile: join(shimDir, `${name}.mjs`),
  define: { 'process.env.NODE_ENV': '"production"' },
});
await build('all', `import R from 'react'; import * as J from 'react/jsx-runtime'; import * as C from 'react-dom/client'; export default R; export const {${reactNames.join(',')}}=R; export const {jsx,jsxs}=J; export const {createRoot}=C;`);
// The app SDK stand-in has no network: every API call fails, so the page must work without a backend.
await build('sdk', `export function useAppApi(){ return { get: () => Promise.reject(new Error('offline')) }; }`);

const HOST = `<!doctype html><html><head><meta charset="utf-8"><title>host</title>
<script type="importmap">{"imports":{"react":"/shims/all.mjs","react/jsx-runtime":"/shims/all.mjs","react-dom/client":"/shims/all.mjs","@kirocrew/app-sdk":"/shims/sdk.mjs"}}</script>
</head><body><div id="root" style="height:640px;overflow:auto"></div><div id="panel"></div>
<script type="module">
  const mod = await import('/apps/zonked/ui/dist/index.mjs');
  const { createRoot } = await import('react-dom/client');
  const { jsx } = await import('react/jsx-runtime');
  createRoot(document.getElementById('root')).render(jsx(mod.default, {}));
</script></body></html>`;

const server = http.createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  const send = (s, h, b) => { res.writeHead(s, h); res.end(b); };
  if (p === '/') return send(200, { 'Content-Type': 'text/html; charset=utf-8' }, HOST);
  const shim = p.startsWith('/shims/');
  const base = shim ? shimDir : p.startsWith('/apps/zonked/ui/') ? uiDir : null;
  if (!base) return send(404, {}, 'nf');
  const file = resolve(base, shim ? p.slice(7) : p.slice('/apps/zonked/ui/'.length));
  const ext = extname(file).toLowerCase();
  if (!file.startsWith(base) || !(ext in MIME)) return send(403, {}, 'no');
  try { statSync(file); } catch { return send(404, {}, 'nf'); }
  send(200, { 'Content-Type': MIME[ext], 'X-Content-Type-Options': 'nosniff' }, readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const outbound = [];
const seen = [];
await page.route('**/*', (route) => {
  const url = route.request().url();
  seen.push(url);
  if (url.startsWith(origin) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
  outbound.push(url);
  return route.abort();
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const out = { ok: false };
try {
  await page.goto(`${origin}/`);
  const skip = page.getByRole('button', { name: 'Skip, just play' });
  await skip.waitFor({ timeout: 15000 }).then(() => skip.click(), () => {});
  await page.waitForSelector('[data-testid=calm-safety-accept]', { timeout: 15000 });
  await page.click('[data-testid=calm-safety-accept]');
  await page.waitForSelector('[data-testid=mini-stop], [data-playing=true]', { timeout: 15000 });
  await page.waitForTimeout(2600);
  out.engine = await page.evaluate(async () => {
    const m = await import('/apps/zonked/ui/dist/panel.mjs');
    return { state: m.engineState(), ...(await m.engineStats()) };
  });
  out.ok = out.engine.state === 'running' && out.engine.peak > 0 && out.engine.peak <= 0.95 && outbound.length === 0 && errors.length === 0;
} catch (e) {
  out.error = String(e);
  out.body = (await page.evaluate(() => document.body.innerText).catch(() => '')).slice(0, 400);
  out.testids = await page.evaluate(() => [...document.querySelectorAll('[data-testid]')].map((x) => x.dataset.testid)).catch(() => []);
}
out.requests = seen.length;
out.outbound = outbound;
out.pageErrors = errors;
console.log(JSON.stringify(out, null, 2));
await browser.close();
server.close();
process.exit(out.ok ? 0 : 1);
