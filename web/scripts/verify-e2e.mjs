#!/usr/bin/env node
// End-to-end verification of the production build served by wrangler dev (assets mode).
// Prints PASS/FAIL per check and exits nonzero on any FAIL.
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { BRIDGE_PORT, WEB, assertBridgePortFree, ensureBuilt, sleep, startBridge, startServer } from './e2e-lib.mjs';
import { newSession, openAdvanced, openMore } from './e2e-helpers.mjs';
import { runLibraryChecks, runMixedContent } from './e2e-library-checks.mjs';
import { runUiChecks } from './e2e-ui-checks.mjs';
import { runUxChecks } from './e2e-ux-checks.mjs';
import { runSoundChecks } from './e2e-sound-checks.mjs';
import { runSanctuaryChecks } from './e2e-sanctuary-checks.mjs';
import { runCalmChecks } from './e2e-calm-checks.mjs';
import { runCrewChecks } from './e2e-crew-checks.mjs';
import { runNatureChecks } from './e2e-nature-checks.mjs';
import { runResetChecks } from './e2e-reset-checks.mjs';
import { runGrowthChecks } from './e2e-growth-checks.mjs';

const results = [];
const info = [];
async function check(name, fn) {
  try {
    const detail = await fn();
    results.push({ name, ok: true });
    console.log(`PASS ${name}${detail ? `: ${detail}` : ''}`);
  } catch (e) {
    results.push({ name, ok: false });
    console.log(`FAIL ${name}: ${e instanceof Error ? e.message : String(e)}`);
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

function parseHeadersFile(text) {
  const blocks = [];
  let cur = null;
  for (const raw of text.split('\n')) {
    if (raw.trim() === '') continue;
    if (!/^\s/.test(raw)) {
      cur = { path: raw.trim(), headers: {} };
      blocks.push(cur);
    } else if (cur) {
      const i = raw.indexOf(':');
      cur.headers[raw.slice(0, i).trim().toLowerCase()] = raw.slice(i + 1).trim();
    }
  }
  return blocks;
}

const tmp = mkdtempSync(join(tmpdir(), 'zonked-e2e-'));
const statePath = join(tmp, '.zonked-state.json');
const noise = [];
let server;
let bridge;
let browser;

function writeState(score, level, preset, beat, carrier, breathe) {
  const state = {
    version: 1,
    at: Math.floor(Date.now() / 1000),
    burnout: { score, level },
    target: { presetId: preset, beatHz: beat, carrierHz: carrier, gain: 0.5, transitionSec: 30, breathe },
    sbg: null,
  };
  const t = `${statePath}.tmp`;
  writeFileSync(t, JSON.stringify(state));
  renameSync(t, statePath);
}

const num = async (page, id) => parseFloat(await page.getByTestId(id).innerText());
const stats = (page) => page.evaluate(() => window.__zonked.getStats());
// getStats() reports a window since the previous call, so sample for a short window and keep the max peak.
const sample = (page, ms = 600) =>
  page.evaluate(async (dur) => {
    let peak = 0;
    let nonZero = 0;
    const end = performance.now() + dur;
    do {
      const s = await window.__zonked.getStats();
      peak = Math.max(peak, s.peak);
      nonZero += s.nonZero;
      await new Promise((r) => setTimeout(r, 100));
    } while (performance.now() < end);
    return { peak, nonZero };
  }, ms);

try {
  await assertBridgePortFree();
  ensureBuilt();
  server = await startServer();
  console.log(`server: ${server.kind} at ${server.origin}`);
  const origin = server.origin;

  // 1. headers
  await check('1 headers match _headers', async () => {
    const blocks = parseHeadersFile(readFileSync(join(WEB, 'public', '_headers'), 'utf8'));
    const all = blocks.find((b) => b.path === '/*').headers;
    const assets = blocks.find((b) => b.path === '/assets/*').headers;
    const index = blocks.find((b) => b.path === '/index.html').headers;
    const files = readdirSync(join(WEB, 'dist', 'assets'));
    const js = files.find((f) => f.startsWith('index-') && f.endsWith('.js'));
    const wasm = files.find((f) => f.endsWith('.wasm'));
    const targets = [
      ['/', { ...all, ...index }],
      ['/index.html', { ...all, ...index }],
      [`/assets/${js}`, { ...all, ...assets }],
      [`/assets/${wasm}`, { ...all, ...assets }],
    ];
    const problems = [];
    for (const [path, expected] of targets) {
      let res = await fetch(origin + path, { redirect: 'manual' });
      if (res.status >= 300 && res.status < 400) res = await fetch(new URL(res.headers.get('location'), origin));
      for (const [k, v] of Object.entries(expected)) {
        const got = res.headers.get(k);
        if (k === 'cache-control' && v === 'no-cache' && /max-age=0, must-revalidate/.test(got ?? '')) {
          if (!info.some((i) => i.startsWith('cache-control'))) info.push(`cache-control for ${path}: platform emits "${got}" instead of "no-cache" (equivalent revalidation); accepted`);
          continue;
        }
        if (got !== v) problems.push(`${path} ${k}: expected "${v}" got "${got}"`);
      }
      if (path.endsWith('.wasm') && !(res.headers.get('content-type') ?? '').includes('wasm'))
        problems.push(`${path} content-type ${res.headers.get('content-type')}`);
    }
    assert(problems.length === 0, problems.join(' | '));
    return '4 URLs';
  });

  browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await context.addInitScript(() => {
    localStorage.setItem('zonked.safety.v1', '1');
    if (localStorage.getItem('zonked.theme.v1') === null) localStorage.setItem('zonked.theme.v1', 'studio');
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) =>
      window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
    );
  });
  const page = await context.newPage();
  let phase = 'online';
  page.on('console', (m) => {
    if (m.type() === 'error') noise.push({ phase, text: `${m.text()} @ ${m.location().url}` });
  });
  page.on('pageerror', (e) => noise.push({ phase, text: `pageerror ${e.message}` }));

  await page.goto(`${origin}/?e2e=1`);
  await page.getByTestId('play-button').waitFor();
  await openAdvanced(page);

  // 2. isolation
  await check('2 crossOriginIsolated and SharedArrayBuffer', async () => {
    const r = await page.evaluate(() => ({
      iso: crossOriginIsolated,
      sab: typeof SharedArrayBuffer === 'function',
    }));
    assert(r.iso && r.sab, JSON.stringify(r));
  });

  // 4. playback
  await check('4 playback peak/nonZero', async () => {
    await page.getByTestId('play-button').click();
    await page.waitForFunction(
      () => document.querySelector('[data-testid=engine-status]')?.getAttribute('data-state') === 'running',
    );
    await page.waitForFunction(async () => (await window.__zonked.getStats()).nonZero > 0);
    await page.waitForFunction(async () => (await window.__zonked.getStats()).peak > 0.05);
    await page.waitForFunction(async () => (await window.__zonked.getStats()).peak > 0.05);
    const s = await sample(page, 1000);
    assert(s.peak > 0 && s.nonZero > 0 && s.peak <= 0.95, JSON.stringify(s));
    const sab = await page.evaluate(() => window.__zonked.status.usesSharedMemory);
    return `peak=${s.peak.toFixed(3)} nonZero=${s.nonZero} sharedMemory=${sab}`;
  });

  // 5. presets
  const expectBeat = {
    'deep-focus': 40,
    'flow-state': 18,
    'burnout-reset': 10,
    'breathwork-sync': 5.5,
    'deep-rest': 2.5,
    'classic-1998': 10,
  };
  await check('5 all six presets converge', async () => {
    const out = [];
    for (const [id, beat] of Object.entries(expectBeat)) {
      await page.getByTestId('preset-select').selectOption(id);
      await page.waitForFunction(
        ([b]) => Math.abs(parseFloat(document.querySelector('[data-testid=hud-beat]').textContent) - b) < 0.3,
        [beat],
        { timeout: 15000 },
      );
      const l = await num(page, 'hz-left');
      const r = await num(page, 'hz-right');
      const hb = await num(page, 'hud-beat');
      assert(Math.abs(Math.abs(r - l) - hb) < 0.05, `${id}: L=${l} R=${r} beat=${hb}`);
      const s = await sample(page, 400);
      assert(s.peak <= 0.95, `${id}: peak ${s.peak}`);
      out.push(`${id}=${hb}`);
    }
    return out.join(' ');
  });

  // 6a. Standalone first load: the crew opt-in key is unset, so nothing may touch the bridge port.
  await check('6a standalone first load: zero bridge requests, zero console errors or warnings in 20 s', async () => {
    const s = await newSession({ browser, origin });
    const msgs = [];
    const bridgeReqs = [];
    s.page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') msgs.push(`${m.type()}: ${m.text()}`);
    });
    s.page.on('pageerror', (e) => msgs.push(`pageerror: ${e.message}`));
    s.context.on('request', (r) => {
      if (new URL(r.url()).port === String(BRIDGE_PORT)) bridgeReqs.push(r.url());
    });
    try {
      await s.page.goto(`${origin}/`);
      await s.page.getByTestId('play-button').waitFor();
      assert(!(await s.page.evaluate(() => localStorage.getItem('zonked.crew.v1'))), 'crew key set on first load');
      await sleep(20000); // shortcut: a fixed observation window, there is no event to wait for
      assert(bridgeReqs.length === 0, `requests to port ${BRIDGE_PORT}: ${bridgeReqs.join(', ')}`);
      assert(msgs.length === 0, msgs.join(' | '));
    } finally {
      await s.context.close().catch(() => {});
    }
  });

  // 6. Crew
  await check('6 Crew sync, then bridge stop keeps audio', async () => {
    writeState(20, 'focus', 'deep-focus', 40, 200, false);
    bridge = await startBridge(statePath, origin);
    // opt in to the bridge, then reload so the client starts connecting
    await page.evaluate(() => localStorage.setItem('zonked.crew.v1', '1'));
    await page.reload();
    await page.getByTestId('crew-badge').waitFor();
    // the client reconnects on its own; reload if it does not within the wait
    try {
      await page.waitForFunction(
        () => document.querySelector('[data-testid=crew-badge]').textContent === 'Crew Synced',
        null,
        { timeout: 20000 },
      );
    } catch {
      await page.reload();
      await page.getByTestId('crew-badge').waitFor();
      await page.waitForFunction(
        () => document.querySelector('[data-testid=crew-badge]').textContent === 'Crew Synced',
        null,
        { timeout: 20000 },
      );
    }
    await page.waitForFunction(() => document.querySelector('[data-testid=burnout-meter]').dataset.score === '20');
    writeState(90, 'decompress', 'burnout-reset', 6, 180, true);
    await page.waitForFunction(() => document.querySelector('[data-testid=burnout-meter]').dataset.score === '90', null, {
      timeout: 15000,
    });
    // ensure audio is running (reload loses it)
    const st = await page.getByTestId('engine-status').getAttribute('data-state');
    if (st !== 'running') {
      await page.getByTestId('play-button').click();
      await page.waitForFunction(
        () => document.querySelector('[data-testid=engine-status]').dataset.state === 'running',
      );
    }
    await bridge.stop();
    await page.waitForFunction(
      () => document.querySelector('[data-testid=crew-badge]').textContent === 'Standalone',
      null,
      { timeout: 30000 },
    );
    const a = await stats(page);
    await page.waitForFunction(async (f) => (await window.__zonked.getStats()).frames > f, a.frames);
    assert((await page.getByTestId('engine-status').getAttribute('data-state')) === 'running', 'engine stopped');
  });

  // 8. import
  await check('8 import oversized and malformed .sbg', async () => {
    await openMore(page, 'editor-toggle');
    await page.getByTestId('editor').waitFor();
    const before = noise.length;
    await page.getByTestId('import-input').setInputFiles({
      name: 'big.sbg',
      mimeType: 'text/plain',
      buffer: Buffer.from('# x\n'.repeat(70000)),
    });
    await page.waitForFunction(() => /limit is 262144/.test(document.querySelector('.note')?.textContent ?? ''));
    const bigNote = await page.locator('.note').innerText();
    const bad = ['# bad', 'mode: nonsense', 'a: 9999+999/9', 'zz: ???', '00:00:00 nothere', '99:99:99 a'].join('\n');
    await page.getByTestId('import-input').setInputFiles({
      name: 'bad.sbg',
      mimeType: 'text/plain',
      buffer: Buffer.from(bad),
    });
    await page.waitForFunction(() => /Imported bad.sbg/.test(document.querySelector('.note')?.textContent ?? ''));
    const diag = await page.getByTestId('diagnostics').innerText();
    assert(/Line \d+:/.test(diag), `no line numbers in diagnostics: ${diag}`);
    assert(await page.getByTestId('play-button').isVisible(), 'app gone');
    assert(noise.length === before, 'console errors during import');
    info.push(`oversized file handled by note ("${bigNote}"), not by line diagnostics`);
    return `diagnostics: ${diag.split('\n').slice(0, 2).join(' / ')}`;
  });

  // 9. accessible names
  await check('9 every button has an accessible name', async () => {
    const unnamed = () => page.evaluate(() => {
      const out = [];
      for (const b of document.querySelectorAll('button, [role=button]')) {
        const labelled = b.getAttribute('aria-labelledby');
        const name =
          b.getAttribute('aria-label') ||
          (labelled ? document.getElementById(labelled)?.textContent : '') ||
          b.textContent.trim() ||
          b.getAttribute('title') ||
          '';
        if (!name.trim()) out.push(b.outerHTML.slice(0, 120));
      }
      return out;
    });
    const bad = await unnamed();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Help', exact: true }).click();
    await page.locator('#help-pop').waitFor();
    bad.push(...(await unnamed()));
    assert(bad.length === 0, bad.join(' | '));
  });

  // 3. CSP and console
  await check('3 no CSP violations or console errors', async () => {
    const csp = await page.evaluate(() => window.__csp);
    // The loopback bridge being down is expected (Standalone), not an app error.
    const real = noise.filter((n) => !/43210/.test(n.text) && !/ERR_CONNECTION_REFUSED|ERR_CONNECTION_RESET/.test(n.text));
    assert(csp.length === 0, `CSP: ${csp.join(', ')}`);
    assert(real.length === 0, real.map((n) => n.text).join(' | '));
    return `${noise.length - real.length} bridge-connection messages ignored`;
  });

  // 7. offline
  await check('7 offline reload plays', async () => {
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(
      async () => {
        const keys = await caches.keys();
        for (const k of keys) {
          const reqs = await (await caches.open(k)).keys();
          const hasWasm = reqs.some((r) => r.url.endsWith('.wasm'));
          const hasJs = reqs.some((r) => /worklet-.*\.js$/.test(r.url));
          if (hasWasm && hasJs) return true;
        }
        return false;
      },
      null,
      { timeout: 30000 },
    );
    phase = 'offline';
    await context.setOffline(true);
    await page.reload();
    await page.getByTestId('play-button').waitFor();
    assert((await page.title()) === 'Zonked', `title ${await page.title()}`);
    const iso = await page.evaluate(() => crossOriginIsolated);
    info.push(`offline crossOriginIsolated after reload: ${iso}`);
    await page.getByTestId('play-button').click();
    await page.waitForFunction(
      () => document.querySelector('[data-testid=engine-status]').dataset.state === 'running',
      null,
      { timeout: 15000 },
    );
    await page.waitForFunction(async () => (await window.__zonked.getStats()).nonZero > 0);
    const sab = await page.evaluate(() => window.__zonked.status.usesSharedMemory);
    info.push(`offline usesSharedMemory: ${sab}`);
    return `crossOriginIsolated=${iso} sharedMemory=${sab}`;
  });

  // 10 to 19: library checks, each in an isolated browser context
  const harness = { check, assert, info, browser, origin, noise, tmp, statePath, writeState };
  await runLibraryChecks(harness);
  // 20+: UI v2 checks (mascot, mobile, tooltips, Quick Start)
  await runUiChecks(harness);
  await runUxChecks(page, harness);
  await runSoundChecks(page, harness);
  await runSanctuaryChecks(harness);
  await runCalmChecks(harness);
  await runNatureChecks(harness);
  await runCrewChecks(harness);
  await runResetChecks(harness);
  await runGrowthChecks(harness);
  // mixed content against the hosted https page (ZONKED_SITE_URL) (informational only)
  await runMixedContent(harness);
} catch (e) {
  results.push({ name: 'harness', ok: false });
  console.log(`FAIL harness: ${e instanceof Error ? e.stack : e}`);
} finally {
  if (browser) await browser.close().catch(() => {});
  if (bridge) await bridge.stop().catch(() => {});
  if (server) server.stop();
  rmSync(tmp, { recursive: true, force: true });
}

for (const line of info) console.log(`INFO ${line}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed (server: ${server?.kind ?? 'none'})`);
process.exit(failed === 0 ? 0 : 1);
