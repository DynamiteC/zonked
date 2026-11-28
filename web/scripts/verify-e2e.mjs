#!/usr/bin/env node
// End-to-end verification of the production build served by wrangler dev (assets mode).
// Prints PASS/FAIL per check and exits nonzero on any FAIL.
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { BRIDGE_PORT, WEB, assertBridgePortFree, ensureBuilt, sleep, startBridge, startServer } from './e2e-lib.mjs';
import { nav, newSession, skipToPlayer, waitSound } from './e2e-helpers.mjs';
import { bundleCheck, runCoreChecks } from './e2e-core-checks.mjs';
import { runMixedContent } from './e2e-mixed-content.mjs';
import { runCalmChecks } from './e2e-calm-checks.mjs';
import { runCrewChecks } from './e2e-crew-checks.mjs';
import { runNatureChecks } from './e2e-nature-checks.mjs';
import { runResetChecks } from './e2e-reset-checks.mjs';
import { runGrowthChecks } from './e2e-growth-checks.mjs';
import { runReleaseChecks } from './e2e-release-checks.mjs';
import { runFeatureChecks } from './e2e-features-checks.mjs';

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
  const harness = { check, assert, info, browser, origin, noise, tmp, statePath, writeState };

  // S1. First load with the crew opt-in unset: nothing may touch the bridge port.
  await check('S1 standalone first load: zero bridge requests, zero console errors or warnings in 20 s', async () => {
    const s = await newSession(harness);
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
      await s.page.getByRole('button', { name: 'Skip, just play' }).waitFor();
      assert(!(await s.page.evaluate(() => localStorage.getItem('zonked.crew.v1'))), 'crew key set on first load');
      await sleep(20000); // shortcut: a fixed observation window, there is no event to wait for
      assert(bridgeReqs.length === 0, `requests to port ${BRIDGE_PORT}: ${bridgeReqs.join(', ')}`);
      assert(msgs.length === 0, msgs.join(' | '));
    } finally {
      await s.context.close().catch(() => {});
    }
  });

  // S2. Real bridge: the Crew screen follows the state file, and stopping the bridge keeps the audio.
  await check('S2 Crew sync with a real bridge, then bridge stop keeps audio', async () => {
    writeState(20, 'focus', 'deep-focus', 40, 200, false);
    bridge = await startBridge(statePath, origin);
    const s = await newSession(harness, { crew: true });
    try {
      await skipToPlayer(s.page, origin);
      await waitSound(s.page);
      await nav(s.page, 'Crew').click();
      await s.page.getByTestId('crew-score').waitFor({ timeout: 30000 });
      await s.page.waitForFunction(() => document.querySelector('[data-testid=crew-score]').textContent === '20', null, { timeout: 20000 });
      writeState(90, 'decompress', 'burnout-reset', 6, 180, true);
      await s.page.waitForFunction(() => document.querySelector('[data-testid=crew-score]').textContent === '90', null, { timeout: 20000 });
      await bridge.stop();
      bridge = null;
      await sleep(3000);
      const a = await s.page.evaluate(() => window.__zonked.getStats());
      await s.page.waitForFunction(async (f) => (await window.__zonked.getStats()).frames > f, a.frames);
      assert((await s.page.evaluate(() => window.__zonked.status.state)) === 'running', 'engine stopped');
    } finally {
      await s.context.close().catch(() => {});
    }
  });

  await runCoreChecks(harness);
  await bundleCheck(harness);
  await runCalmChecks(harness);
  await runNatureChecks(harness);
  await runCrewChecks(harness);
  await runResetChecks(harness);
  await runGrowthChecks(harness);
  await runReleaseChecks(harness);
  await runFeatureChecks(harness);
  await runMixedContent(harness);
  await check('Z1 no CSP violation in any browser context of this run', async () => {
    const v = harness.cspViolations ?? [];
    assert(v.length === 0, `${v.length} violations: ${v.slice(0, 5).join(' | ')}`);
  });
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
