// Browser matrix: Chromium, Firefox and WebKit at three viewports, 18 checks each.
// Run: node web/scripts/browser-matrix.mjs   (exit code 1 when any check fails)
// It builds HEAD in a throwaway git worktree under the system temp dir, serves it with vite preview,
// then writes .work/matrix/results.json, .work/matrix/matrix.log, shots in .work/matrix/shots
// and refreshes the generated block of docs/BROWSER-MATRIX.md.
// Env: MATRIX_ONLY=chromium or chromium:phone-ios filters the run. MATRIX_KEEP=1 keeps the worktree.
// shortcut: WebKit here is Playwright's WebKit build, not iOS Safari. Real devices are listed in the doc.
import { spawn, spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, firefox, webkit } from '@playwright/test';
import { ROOT, WEB, freePort, sleep } from './e2e-lib.mjs';
import { newSession } from './e2e-helpers.mjs';

const OUT = join(ROOT, '.work', 'matrix');
const SHOTS = join(OUT, 'shots');
const DOC = join(ROOT, 'docs', 'BROWSER-MATRIX.md');
const ENGINES = { chromium, firefox, webkit };
const VIEWPORTS = {
  desktop: { viewport: { width: 1280, height: 800 }, touch: false },
  'phone-ios': { viewport: { width: 390, height: 844 }, touch: true },
  'phone-android': { viewport: { width: 412, height: 915 }, touch: true },
};
// Firefox does not support isMobile in Playwright. It gets hasTouch only.
const MOBILE_OK = new Set(['chromium', 'webkit']);
let HEAD = '';
const FIREFOX_ENV = { ...process.env, MOZ_DISABLE_CONTENT_SANDBOX: '1', MOZ_WEBRENDER: '0' };

const log = (m) => {
  console.log(m);
  appendFileSync(join(OUT, 'matrix.log'), `${m}\n`);
};

function sh(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed: ${(r.stderr || r.stdout).slice(-600)}`);
  return r.stdout.trim();
}

/** Builds HEAD in a throwaway worktree so the live tree is never touched. */
function buildWorktree() {
  const wt = join(tmpdir(), `zonked-matrix-${process.pid}`);
  sh('git', ['worktree', 'add', '--detach', wt, 'HEAD'], ROOT);
  symlinkSync(join(WEB, 'node_modules'), join(wt, 'web', 'node_modules'));
  HEAD = sh('git', ['rev-parse', '--short', 'HEAD'], ROOT);
  log(`worktree at HEAD ${HEAD}`);
  const env = { ...process.env, SKIP_WASM: '1' };
  const r = spawnSync(join(wt, 'web', 'node_modules', '.bin', 'vite'), ['build'], { cwd: join(wt, 'web'), env, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`vite build failed: ${(r.stderr || r.stdout).slice(-600)}`);
  return wt;
}

function removeWorktree(wt) {
  if (process.env.MATRIX_KEEP === '1') return;
  try {
    sh('git', ['worktree', 'remove', '--force', wt], ROOT);
  } catch (e) {
    log(`worktree removal failed: ${e.message}`);
  }
}

/** Serves the worktree build. ensure() restarts the server when it died, so one crash cannot fail every later check. */
async function startPreview(wt) {
  const bin = join(wt, 'web', 'node_modules', '.bin', 'vite');
  let proc = null;
  let origin = '';
  let restarts = 0;
  const stop = () => {
    try {
      if (proc) process.kill(-proc.pid, 'SIGTERM');
    } catch {
      /* already gone */
    }
  };
  const up = async () => {
    try {
      return (await fetch(`${origin}/`)).ok;
    } catch {
      return false;
    }
  };
  const start = async () => {
    stop();
    const port = await freePort();
    proc = spawn(bin, ['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: join(wt, 'web'), stdio: 'ignore', detached: true });
    origin = `http://127.0.0.1:${port}`;
    for (let i = 0; i < 120; i++) {
      if (await up()) return;
      await sleep(250);
    }
    throw new Error('vite preview did not start');
  };
  await start();
  return {
    stop,
    restarts: () => restarts,
    ensure: async () => {
      if (!(await up())) {
        log('preview server was down, restarting');
        restarts++;
        await start();
      }
      return origin;
    },
  };
}

async function launch(name) {
  const opts = name === 'firefox' ? { env: FIREFOX_ENV, firefoxUserPrefs: { 'security.sandbox.content.level': 0 } } : {};
  return ENGINES[name].launch(opts);
}

const CHECK_LIMIT_MS = 90000;
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });
const AC_COUNT = () => {
  window.__acCount = 0;
  const Base = window.AudioContext || window.webkitAudioContext;
  if (Base) {
    window.AudioContext = class extends Base {
      constructor(...a) {
        super(...a);
        window.__acCount++;
      }
    };
  }
};
const assert = (c, m) => {
  if (!c) throw new Error(m);
};
const engineState = (page) => page.evaluate(() => window.__zonked?.status?.state ?? 'no-hook');

/** Opens a fresh context and page. env.cur points at it so a failure can screenshot it. */
async function open(env, { init, ctxOpts = {}, url = '/?e2e=1' } = {}) {
  const s = await env.newSession(env.h, { calm: true, ...env.extra, ...ctxOpts });
  await s.page.addInitScript(AC_COUNT);
  if (init) await s.page.addInitScript(init);
  s.outside = [];
  s.page.on('request', (r) => {
    const u = r.url();
    if (/^(https?|wss?|ftp):/.test(u) && new URL(u).origin !== new URL(env.origin).origin) s.outside.push(u);
  });
  s.page.setDefaultTimeout(20000);
  env.cur = s;
  env.opened.push(s);
  await s.page.goto(`${env.origin}${url}`);
  return s;
}

async function waitRunning(page) {
  await page.waitForFunction(() => window.__zonked?.status?.state === 'running', null, { timeout: 25000 });
  await page.waitForFunction(async () => (await window.__zonked.getStats()).peak > 0.001, null, { timeout: 25000 });
}

async function skipAndAccept(page) {
  await page.getByRole('button', { name: 'Skip, just play' }).click();
  await page.getByTestId('calm-safety-accept').click();
  await page.getByTestId('player-toggle').waitFor();
}

const pageErrors = (s) => s.errors.filter((e) => e.startsWith('pageerror'));

/** Sound plays with a browser feature removed before any page script runs. */
async function playsWithout(env, init, extra) {
  const s = await open(env, { init });
  {
    await s.page.getByText('1 of 3').first().waitFor();
    await skipAndAccept(s.page);
    await waitRunning(s.page);
    const state = await s.page.evaluate(() => window.__zonked.status);
    const sab = await s.page.evaluate(() => `typeof SharedArrayBuffer ${typeof SharedArrayBuffer}`);
    if (extra) assert(extra(state), `status ${JSON.stringify(state)}, ${sab}`);
    assert(pageErrors(s).length === 0, `uncaught: ${pageErrors(s).join(' | ')}`);
    return `state ${state.state}`;
  }
}

async function noWorklet(env) {
  const s = await open(env, {
    init: () => {
      delete window.AudioWorkletNode;
      delete window.AudioWorklet;
      for (const C of [window.BaseAudioContext, window.AudioContext, window.webkitAudioContext]) {
        if (C) Object.defineProperty(C.prototype, 'audioWorklet', { get: () => undefined, configurable: true });
      }
    },
  });
  {
    await s.page.getByText('1 of 3').first().waitFor();
    await skipAndAccept(s.page);
    await s.page.waitForTimeout(4000);
    const body = (await s.page.evaluate(() => document.body.innerText)).trim();
    const notes = await s.page.evaluate(() => [...document.querySelectorAll('[role=status],[role=alert]')].map((e) => e.textContent.trim()).filter(Boolean));
    assert(body.length > 40, 'blank screen');
    assert(pageErrors(s).length === 0, `uncaught: ${pageErrors(s).join(' | ')}`);
    const state = await engineState(s.page);
    const plain = /support|browser|cannot|can't|couldn|unable|problem|not available|didn't|did not/i;
    assert(state === 'running' || notes.some((n) => plain.test(n)), `engine ${state}, no plain message, status text: ${notes.join(' / ').slice(0, 80)}`);
    return `engine ${state}, message: ${notes.join(' / ').slice(0, 120)}`;
  }
}

const gone = (name) => () => Object.defineProperty(Navigator.prototype, name, { value: undefined, configurable: true });

/** Checks that share one session, in order. A failed step makes later steps fail on their own wait. */
function flowChecks(env) {
  let s;
  const page = () => s.page;
  const steps = [
    ['load', async () => {
      s = await open(env);
      await page().getByText('1 of 3').first().waitFor();
      await page().waitForTimeout(1500);
      assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    }],
    ['skip', async () => {
      await page().getByRole('button', { name: 'Skip, just play' }).click();
      await page().getByTestId('calm-safety-accept').waitFor();
    }],
    ['no-audio-before-notice', async () => {
      await page().waitForTimeout(1500);
      const n = await page().evaluate(() => window.__acCount);
      assert(n === 0, `AudioContext created before accept: ${n}`);
    }],
    ['sound-starts', async () => {
      await page().getByTestId('calm-safety-accept').click();
      await page().getByTestId('player-toggle').waitFor();
      await waitRunning(page());
      const st = await page().evaluate(() => window.__zonked.getStats());
      return `peak ${st.peak.toFixed(3)}`;
    }],
    ['stop-ramps-down', async () => {
      const t0 = Date.now();
      await page().getByTestId('player-toggle').click();
      await page().waitForFunction(() => ['stopped', 'idle'].includes(window.__zonked.status.state), null, { timeout: 15000 });
      const ms = Date.now() - t0;
      assert(ms >= 250, `stopped after ${ms} ms, under the 250 ms ramp`);
      return `${ms} ms`;
    }],
    ['nature-loop-mp3', async () => {
      await page().getByTestId('player-toggle').click();
      await waitRunning(page());
      await nav(page(), 'Sounds').click();
      await page().getByTestId('open-nature').click();
      await page().getByTestId('nature-rain').click();
      try {
        await page().waitForFunction(() => window.__zonked?.nature?.id === 'rain', null, { timeout: 25000 });
      } catch (e) {
        const msg = await page().getByTestId('nature-message').innerText().catch(() => '?');
        const probe = await page().evaluate(async () => {
          try {
            const r = await fetch('/samples/rain.mp3.json');
            const b = await r.arrayBuffer();
            const head = [...new Uint8Array(b.slice(0, 4))].join(',');
            const t0 = performance.now();
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const d = await Promise.race([ctx.decodeAudioData(b.slice(0)), new Promise((_, j) => setTimeout(() => j(new Error('decode timeout 10 s')), 10000))]);
            return `fetch ${r.status} ${b.byteLength} bytes head ${head}, decoded ${d.duration.toFixed(1)} s in ${Math.round(performance.now() - t0)} ms`;
          } catch (err) {
            return `probe failed: ${err.name} ${err.message}`;
          }
        });
        throw new Error(`rain never started, nature-message: "${msg}", probe: ${probe}`);
      }
      await page().waitForTimeout(1500);
      const msg = (await page().getByTestId('nature-message').innerText()).trim();
      // Two valid paths: the MP3 decodes (no message), or the 8 s decode timeout fell back to the
      // made-in-code sound and the note is shown. A hang with no sound or no note still fails.
      assert((await engineState(page())) === 'running', 'engine not running');
      const st = await page().evaluate(() => window.__zonked.getStats());
      assert(st.peak > 0, `no sound, peak ${st.peak}, message: "${msg}"`);
      return msg === '' ? 'path: mp3' : `path: fallback (note: ${msg.slice(0, 100)})`;
    }],
    ['synth-sound', async () => {
      await page().getByTestId('nature-waterfall').click();
      await page().waitForFunction(() => window.__zonked?.nature?.id === 'waterfall', null, { timeout: 25000 });
      await page().waitForTimeout(1500);
      const msg = await page().getByTestId('nature-message').innerText();
      assert(msg === '', `message: ${msg}`);
      assert((await engineState(page())) === 'running', 'engine not running');
    }],
    ['crew-demo-beat-changes', async () => {
      await nav(page(), 'Crew').click();
      await page().getByTestId('crew-demo').click();
      await page().getByTestId('crew-beat').waitFor();
      const beats = [];
      const end = Date.now() + 50000;
      while (Date.now() < end && beats.length < 2) {
        const b = await page().getByTestId('crew-beat').textContent();
        if (beats.at(-1) !== b) beats.push(b);
        await sleep(400);
      }
      assert(beats.length >= 2, `beat never changed: ${beats.join(' > ')}`);
      return beats.join(' > ');
    }],
    ['theme-switch', async () => {
      await nav(page(), 'You').click();
      await page().getByTestId('studio-switch').click();
      await page().getByTestId('play-button').waitFor();
      assert((await page().evaluate(() => localStorage.getItem('zonked.theme.v1'))) === 'studio', 'theme key not studio');
      await page().getByTestId('back-to-calm').click();
      await page().getByTestId('greeting').waitFor();
      assert((await page().evaluate(() => localStorage.getItem('zonked.theme.v1'))) === 'calm', 'theme key not calm');
    }],
    ['reload-keeps-state', async () => {
      await page().reload();
      await page().getByTestId('greeting').waitFor();
      assert((await page().getByText('1 of 3').count()) === 0, 'onboarding shown again');
      assert((await page().evaluate(() => localStorage.getItem('zonked.safety.v1'))) !== null, 'safety flag lost');
    }],
    ['service-worker', async () => {
      const ok = async () => page().evaluate(async () => (await navigator.serviceWorker.getRegistration())?.active?.state ?? null);
      let state = null;
      for (let i = 0; i < 40 && state !== 'activated'; i++) {
        state = await ok();
        if (state !== 'activated') await sleep(500);
      }
      assert(state === 'activated', `worker state ${state}`);
      await page().reload();
      await page().getByTestId('greeting').waitFor();
      return 'activated';
    }],
    ['offline-reload', async () => {
      await s.context.setOffline(true);
      try {
        await page().reload();
        await page().getByTestId('greeting').waitFor({ timeout: 15000 });
      } finally {
        await s.context.setOffline(false);
      }
    }],
    ['no-request-leaves-origin', async () => {
      assert(s.outside.length === 0, `requests: ${s.outside.join(', ')}`);
    }],
  ];
  return { steps, current: () => s, close: () => s?.context.close().catch(() => {}) };
}

const standalone = (env) => [
  ['reduced-motion', async () => {
    const s = await open(env, { ctxOpts: { reducedMotion: 'reduce' } });
    {
      await s.page.getByText('1 of 3').first().waitFor();
      const modes = await s.page.evaluate(() => [...document.querySelectorAll('[data-motion]')].map((e) => e.dataset.motion));
      assert(modes.length > 0 && modes.every((m) => m === 'off'), `data-motion ${JSON.stringify(modes)}`);
    }
  }],
  ['fallback-no-audioworklet', () => noWorklet(env)],
  ['fallback-no-wakelock', () => playsWithout(env, gone('wakeLock'))],
  ['fallback-no-mediasession', () => playsWithout(env, gone('mediaSession'))],
  ['fallback-no-sharedarraybuffer', () => playsWithout(env, () => { Object.defineProperty(window, 'SharedArrayBuffer', { value: undefined, configurable: true, writable: true }); }, (st) => st.usesSharedMemory === false)],
];

export const CHECK_LABELS = {
  load: 'first load, no console errors',
  skip: 'onboarding skip path',
  'no-audio-before-notice': 'no AudioContext before safety notice',
  'sound-starts': 'accept, sound starts (running, peak above 0)',
  'stop-ramps-down': 'Stop ramps down (250 ms or more)',
  'nature-loop-mp3': 'nature loop decodes and plays (MP3)',
  'synth-sound': 'synth sound plays',
  'crew-demo-beat-changes': 'Crew demo runs, beat changes',
  'theme-switch': 'theme switch persists',
  'reload-keeps-state': 'reload keeps state',
  'service-worker': 'service worker registers and activates',
  'offline-reload': 'offline reload works',
  'no-request-leaves-origin': 'no request leaves the origin',
  'reduced-motion': 'reduced motion turns motion off',
  'fallback-no-audioworklet': 'fallback: no AudioWorklet',
  'fallback-no-wakelock': 'fallback: no wake lock',
  'fallback-no-mediasession': 'fallback: no MediaSession',
  'fallback-no-sharedarraybuffer': 'fallback: no SharedArrayBuffer',
};

/** Runs one check. A failure keeps the message, the console text and a screenshot path. */
async function runCheck(env, id, fn, base) {
  const t0 = Date.now();
  env.cur = base ? base() ?? null : null;
  try {
    const limit = new Promise((_, rej) => setTimeout(() => rej(new Error(`check hung for ${CHECK_LIMIT_MS / 1000} s`)), CHECK_LIMIT_MS));
    const note = await Promise.race([fn(), limit]);
    return { id, ok: true, note: note ?? '', ms: Date.now() - t0 };
  } catch (e) {
    let shot = '(no page)';
    try {
      const file = `${env.tag}-${id}.png`;
      if (env.cur?.page) await env.cur.page.screenshot({ path: join(SHOTS, file), timeout: 8000 });
      shot = `.work/matrix/shots/${file}`;
    } catch {
      shot = '(screenshot failed)';
    }
    const consoleText = (env.cur?.errors ?? []).slice(0, 3).join(' | ').slice(0, 400);
    return { id, ok: false, error: String(e.message ?? e).split('\n')[0].slice(0, 300), consoleText, shot, ms: Date.now() - t0 };
  }
}

async function runCombo(browser, engine, vpName, origin) {
  const vp = VIEWPORTS[vpName];
  const extra = { viewport: vp.viewport, hasTouch: vp.touch };
  if (vp.touch && MOBILE_OK.has(engine)) extra.isMobile = true;
  const env = { h: { browser, origin }, origin, extra, tag: `${engine}-${vpName}`, newSession, cur: null, opened: [] };
  const flow = flowChecks(env);
  const results = [];
  const run = async (id, fn, base) => {
    const r = await runCheck(env, id, fn, base);
    results.push(r);
    for (const c of env.opened.splice(0)) if (c !== flow.current()) await c.context.close().catch(() => {});
    log(`${env.tag} ${r.ok ? 'PASS' : 'FAIL'} ${id}${r.ok ? '' : ` :: ${r.error}`}`);
  };
  for (const [id, fn] of flow.steps) await run(id, fn, flow.current);
  await flow.close();
  for (const [id, fn] of standalone(env)) await run(id, fn);
  return { engine, viewport: vpName, results };
}

// ---- report ----
const START = '<!-- matrix:start -->';
const END = '<!-- matrix:end -->';

export function renderBlock(combos) {
  const cols = combos.filter((c) => !c.launchError);
  const head = `| Check | ${cols.map((c) => `${c.engine} ${c.viewport}`).join(' | ')} |`;
  const sep = `|---|${cols.map(() => '---').join('|')}|`;
  const rows = Object.entries(CHECK_LABELS).map(([id, label]) => {
    const cells = cols.map((c) => {
      const r = c.results.find((x) => x.id === id);
      return r ? (r.ok ? (/^path: fallback/.test(r.note) ? 'pass (fallback)' : 'pass') : 'FAIL') : '-';
    });
    return `| ${label} | ${cells.join(' | ')} |`;
  });
  const total = Object.keys(CHECK_LABELS).length;
  const sums = cols.map((c) => `| ${c.engine} ${c.viewport} | ${c.version ?? ''} | ${c.results.filter((r) => r.ok).length} of ${total} |`);
  const fails = cols.flatMap((c) => c.results.filter((r) => !r.ok).map((r) => `- ${c.engine} ${c.viewport}, ${CHECK_LABELS[r.id]}: ${r.error}${r.consoleText ? ` Console: ${r.consoleText}` : ''} Screenshot: ${r.shot}`));
  const launch = combos.filter((c) => c.launchError).map((c) => `- ${c.engine} did not launch: ${c.launchError}`);
  return [
    START,
    `Generated by web/scripts/browser-matrix.mjs from HEAD ${HEAD}.`,
    '',
    '| Run | Version | Passed |',
    '|---|---|---|',
    ...sums,
    '',
    head,
    sep,
    ...rows,
    '',
    '### Failures from the last run',
    '',
    ...(fails.length + launch.length === 0 ? ['None.'] : [...launch, ...fails]),
    END,
  ].join('\n');
}

export function spliceDoc(doc, block) {
  const a = doc.indexOf(START);
  const b = doc.indexOf(END);
  if (a >= 0 && b > a) return `${doc.slice(0, a)}${block}${doc.slice(b + END.length)}`;
  return `${doc}${doc.endsWith('\n') || doc === '' ? '' : '\n'}\n${block}\n`;
}


/** Something outside this script may kill the preview server. A combo that saw a restart runs once more. */
async function runComboChecked(browser, engine, vp, server) {
  for (let attempt = 1; ; attempt++) {
    const before = server.restarts();
    const origin = await server.ensure();
    const out = await runCombo(browser, engine, vp, origin);
    const hurt = server.restarts() !== before;
    const down = out.results.some((r) => !r.ok && /Could not connect|CONNECTION_REFUSED|ERR_CONNECTION/.test(r.error));
    if (!(down || hurt) || attempt >= 2) return out;
    log(`${engine} ${vp}: server trouble, running the combo again`);
  }
}

function selected() {
  const only = process.env.MATRIX_ONLY;
  const [e, v] = only ? only.split(':') : [];
  const engines = Object.keys(ENGINES).filter((n) => !e || n === e);
  const vps = Object.keys(VIEWPORTS).filter((n) => !v || n === v);
  return { engines, vps };
}

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(SHOTS, { recursive: true });
  const wt = buildWorktree();
  const server = await startPreview(wt);
  const combos = [];
  try {
    const { engines, vps } = selected();
    for (const engine of engines) {
      let browser;
      try {
        browser = await launch(engine);
        log(`${engine} ${browser.version()}`);
        for (const vp of vps) combos.push({ ...(await runComboChecked(browser, engine, vp, server)), version: browser.version() });
      } catch (e) {
        log(`${engine} could not run: ${e.message}`);
        combos.push({ engine, viewport: 'all', launchError: e.message, results: [] });
      } finally {
        await browser?.close().catch(() => {});
      }
    }
  } finally {
    server.stop();
    removeWorktree(wt);
  }
  writeFileSync(join(OUT, 'results.json'), `${JSON.stringify(combos, null, 2)}\n`);
  const doc = existsSync(DOC) ? readFileSync(DOC, 'utf8') : '';
  writeFileSync(DOC, spliceDoc(doc, renderBlock(combos)));
  const failed = combos.flatMap((c) => (c.launchError ? [c] : c.results.filter((r) => !r.ok)));
  log(`done: ${failed.length} failing`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(2);
});
