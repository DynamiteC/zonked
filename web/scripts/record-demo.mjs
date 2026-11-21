#!/usr/bin/env node
// Records the Zonked demo (docs/DEMO-SCRIPT.md) against a local static server in a headless page.
// Headless Chromium has no audio device, so the soundtrack is rendered offline from the real dsp-core
// WebAssembly module (layers included), driven by the live 32-slot parameter block that the page's
// engine writes into its SharedArrayBuffer, sampled every 0.25 s, then muxed with ffmpeg.
// DEMO_DRY=1 runs the same story at 0.3x speed, writes frames to the scratch dir and skips encoding.
import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { FAKE_CREW, ROOT, ensureBuilt, sleep, startBridge, startServer } from './e2e-lib.mjs';
import { CAPTION_HTML, MEDIA, TOTAL, assertClean, captureText, overlayInit, panesOf, redact, renderWav, run, statePath, tmp, writeState } from './demo-lib.mjs';

const DRY = process.env.DEMO_DRY === '1';
const K = DRY ? 0.3 : 1;
const SHOTS = DRY ? '/tmp/zk-dry' : MEDIA;
mkdirSync(SHOTS, { recursive: true });
const FFMPEG = existsSync('/opt/homebrew/bin/ffmpeg') ? '/opt/homebrew/bin/ffmpeg' : 'ffmpeg';
const FFPROBE = FFMPEG.replace(/ffmpeg$/, 'ffprobe');
const MP4_MAX = 4.6 * 1024 * 1024;
const WEBM_MAX = 5.4 * 1024 * 1024;
const APP_H = 660;
const CAP_H = 60;
const warnings = [];

function captureParams() {
  const Orig = window.SharedArrayBuffer;
  if (typeof Orig !== 'function') return;
  window.SharedArrayBuffer = new Proxy(Orig, {
    construct(target, args) {
      const o = Reflect.construct(target, args);
      if (args[0] === 132) window.__psab = o;
      return o;
    },
  });
}

ensureBuilt();
let server;
let bridge;
let fake;
let browser;
const samples = [];
const timeline = [];

/** Plays lo-fi chords once in a throwaway page and returns the live parameter block (the soundtrack bed). */
async function captureBed(origin) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: APP_H } });
  await ctx.addInitScript(captureParams);
  const p = await ctx.newPage();
  try {
    await p.goto(`${origin}/`);
    await p.getByTestId('sound-card-lofi').getByTestId('sound-card-play').click({ timeout: 20000 });
    await p.getByTestId('safety-accept').click({ timeout: 10000 });
    await p.waitForFunction(() => document.querySelector('[data-testid=play-button]')?.textContent !== 'Play', null, { timeout: 30000 });
    await sleep(6000);
    const blk = await p.evaluate(() => (window.__psab ? Array.from(new Float32Array(window.__psab, 4, 32)) : null));
    if (!blk) throw new Error('no parameter block');
    return blk;
  } finally {
    await ctx.close();
  }
}

const CAPTIONS = [];
try {
  console.log('capturing real agent output');
  writeState(10, 'focus', 'deep-focus', 40, 200, false);
  const cap = await startBridge(statePath, 'http://127.0.0.1:1');
  const bridgeLog = cap.log().trim().split('\n').slice(0, 3);
  await cap.stop();
  const text = captureText(bridgeLog);
  const panes = panesOf(text);
  redact(JSON.stringify(panes)); // aborts the run when anything personal is left

  server = await startServer();
  const origin = server.origin;
  browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  console.log('capturing the lo-fi bed');
  const bed = await captureBed(origin);

  writeState(10, 'focus', 'deep-focus', 40, 200, false);
  bridge = await startBridge(statePath, origin);

  // caption strip: its own page and video, stacked above the app at encode time
  const capCtx = await browser.newContext({ viewport: { width: 1280, height: CAP_H }, recordVideo: { dir: join(tmp, 'cap'), size: { width: 1280, height: CAP_H } } });
  const capPage = await capCtx.newPage();
  const tCap = Date.now();
  await capPage.setContent(CAPTION_HTML);

  const context = await browser.newContext({
    viewport: { width: 1280, height: APP_H },
    recordVideo: { dir: join(tmp, 'app'), size: { width: 1280, height: APP_H } },
    acceptDownloads: true,
  });
  await context.addInitScript(captureParams);
  await context.addInitScript(overlayInit);
  const page = await context.newPage();
  const tApp = Date.now();
  await page.clock.install();
  let t0 = Date.now();
  const now = () => ((Date.now() - t0) / 1000) / K;
  const until = async (s) => {
    const d = s * K - (Date.now() - t0) / 1000;
    if (d > 0) await sleep(d * 1000);
  };
  const nap = (ms) => sleep(ms * K);
  const cap2 = async (t) => {
    assertClean(t);
    CAPTIONS.push(`${now().toFixed(1).padStart(6)} s  ${t}`);
    await capPage.evaluate((x) => window.__cap(x), t).catch(() => {});
  };
  const title = (t, steps, n, foot) => page.evaluate(([a, b, c, d]) => window.__demoTitle?.(a, b, c, d), [t, steps, n, foot]).catch(() => {});
  const hl = (s) => page.evaluate((x) => window.__demoHighlight?.(x), s).catch(() => {});
  const shot = (n) => page.screenshot({ path: join(SHOTS, `shot-${n}.png`), scale: 'css' });
  const el = (id) => page.getByTestId(id);
  const mark = async (name) => {
    timeline.push(`${now().toFixed(1).padStart(6)} s  ${name}`);
    if (DRY) {
      await page.screenshot({ path: join(SHOTS, `dry-${timeline.length}-app.png`) }).catch(() => {});
      await capPage.screenshot({ path: join(SHOTS, `dry-${timeline.length}-cap.png`) }).catch(() => {});
    }
  };
  const step = async (name, fn) => {
    try {
      await fn();
    } catch (e) {
      if (/redaction failed/.test(String(e.message))) throw e;
      warnings.push(`${name}: ${String(e.message).split('\n')[0]}`);
      console.log(`WARN ${name}: ${String(e.message).split('\n')[0]}`);
    }
  };
  const more = async (id) => {
    if (!(await el(id).isVisible().catch(() => false))) await el('more-toggle').click();
    await el(id).click();
  };
  const isPlaying = () => page.waitForFunction(() => document.querySelector('[data-testid=play-button]')?.textContent !== 'Play', null, { timeout: 30000 });
  const advanced = async () => {
    const t = el('advanced-toggle');
    if ((await t.getAttribute('aria-expanded')) !== 'true') await t.click();
  };
  const playCard = async (id, caption, extra) => {
    await page.locator(`[data-testid=sound-card-${id}]`).scrollIntoViewIfNeeded();
    await hl(`[data-testid=sound-card-${id}]`);
    await cap2(caption);
    await el(`sound-card-${id}`).getByTestId('sound-card-play').click();
    if (extra) await extra();
  };

  // 1. Lineage beat (0:00 to 0:12): the app loads behind a dimmed card
  await page.goto(`${origin}/`);
  await page.getByTestId('quickstart').waitFor();
  const STEPS = [
    ['1998', 'SBaGen scripts'],
    ['2018', "Web app, research and mascot (inspired by Giorgio Regni's GPLv3 Android app)"],
    ['2026', 'Rust and WebAssembly in your browser'],
  ];
  await title('Zonked', STEPS, 0, null);
  await cap2('Zonked: calming binaural and soothing sounds, free and private');
  t0 = Date.now();
  let sampling = true;
  const sampler = (async () => {
    while (sampling) {
      let s = { t: now(), running: false, p: null };
      try {
        const r = await page.evaluate(() => {
          if (!window.__psab) return null;
          const b = document.querySelector('[data-testid=play-button]');
          return { running: !!b && b.textContent !== 'Play', p: Array.from(new Float32Array(window.__psab, 4, 32)) };
        });
        if (r) s = { t: now(), ...r };
      } catch {
        /* page busy */
      }
      samples.push(s);
      await sleep(250 * K);
    }
  })();
  await mark('lineage: 1998 SBaGen, 2018 web app, 2026 Rust and WebAssembly');
  await until(1.2);
  await page.evaluate(() => window.__demoSteps?.(1));
  await until(3.8);
  await page.evaluate(() => window.__demoSteps?.(2));
  await until(7);
  await page.evaluate(() => window.__demoSteps?.(3));
  await until(8.6);
  await cap2('Resurrected');
  await title('Zonked', STEPS, 3, 'Free. Private. No account.');
  await until(9.5);
  await page.screenshot({ path: join(SHOTS, 'poster.png'), scale: 'css' });
  await until(12);

  // 2. First screen (0:12 to 0:31)
  await title(null);
  await mark('first screen: feeling cards, 15 minutes, suggested sound with reason, Play, safety');
  await cap2('Step 1: pick how you feel');
  await hl('[data-testid=quickstart]');
  await until(15);
  await el('qs-situation-ai-burnout').click();
  await cap2('Step 2: how long do you want to listen?');
  await until(18);
  await el('qs-minutes-15').click();
  await cap2('Zonked ranks calm sounds for you and gives a reason for each');
  await until(21);
  await el('qs-skip').click();
  await hl(null);
  await step('suggested card', async () => {
    await el('sound-suggested').waitFor({ timeout: 5000 });
    await el('sound-suggested').scrollIntoViewIfNeeded();
    await hl('[data-suggested=true]');
    await cap2('The suggested sound says why it fits. Press Play.');
  });
  await until(24.5);
  await page.locator('[data-suggested=true]').getByTestId('sound-card-play').click();
  await cap2('First, a headphone and volume notice. Not a medical device.');
  await hl('[data-testid=safety-accept]');
  await until(28);
  await el('safety-accept').click();
  await isPlaying();
  await hl(null);
  await cap2('Sound starts with a slow fade-in');
  await until(31);
  await shot(1);

  // 3. Sound picker (0:31 to 1:02)
  await mark('sound picker: lo-fi chords, soft piano, violet noise, rain, chimes');
  await step('lofi', () => playCard('lofi', 'Lo-fi chords: a slow, warm chord loop'));
  await until(37);
  await step('piano', () => playCard('piano', 'Soft piano: gentle notes, one at a time'));
  await until(43);
  await shot(2);
  await step('violet', () =>
    playCard('violet', 'Violet noise: a quiet hiss. Keep it low. The note stays visible.', async () => {
      await el('violet-note').scrollIntoViewIfNeeded();
    }),
  );
  await until(50);
  await step('rain', () => playCard('rain', 'Rain: soft and steady'));
  await until(56);
  await step('chimes', () => playCard('chimes', 'Chimes: a few light bells'));
  await until(62);
  await hl(null);

  // 4. Calm to Alert dial (1:02 to 1:14)
  await mark('Calm to Alert dial moves the real beat');
  await step('dial', async () => {
    await advanced();
    await el('calm-dial-wrap').scrollIntoViewIfNeeded();
    await hl('[data-testid=calm-dial-wrap]');
    for (const v of ['0', '0.25', '0.5', '0.75', '1', '0.2']) {
      await el('calm-dial').fill(v);
      await nap(1600);
      const hz = await el('hud-beat').innerText().catch(() => '');
      const band = await el('hud-band').innerText().catch(() => '');
      await cap2(`Calm to Alert dial: beat ${hz.replace(/\s+/g, ' ')}, ${band.replace(/\s+/g, ' ')} band`);
    }
    await shot(3);
  });
  await until(74);
  await hl(null);

  // 5. Inspect (1:14 to 1:24)
  await mark('Inspect panel: Delta to Gamma with evidence labels');
  await step('inspect', async () => {
    await more('inspect-toggle');
    await el('inspect-panel').waitFor();
    await cap2('Inspect: five brain-wave bands and how strong the evidence is');
    await shot(4);
    await el('band-row-Gamma').scrollIntoViewIfNeeded();
    await nap(2500);
    await el('band-row-Delta').scrollIntoViewIfNeeded();
  });
  await until(84);
  await page.keyboard.press('Escape');

  // 6. Sanctuary (1:24 to 1:44)
  await mark('Sanctuary: save mix, favorite, milestones, privacy, export');
  await step('mixes', async () => {
    await more('more-mixes');
    await el('sanctuary-mixes').waitFor();
    await cap2('Sanctuary: save what you like as a mix');
    await el('sanctuary-mix-name').fill('Evening calm');
    await nap(600);
    await el('sanctuary-mix-save').click();
    await el('sanctuary-mixes-list').waitFor();
    await shot(5);
  });
  await until(89);
  await step('favorites', async () => {
    await more('more-favorites');
    await el('sanctuary-favorites').waitFor();
    await el('sanctuary-fav-playing').click().catch(() => {});
    await cap2('Favorites: one tap on the sound you are hearing');
  });
  await until(94);
  await step('milestones', async () => {
    await more('more-milestones');
    await el('sanctuary-milestones').waitFor();
    await cap2('Milestones: kept on this device only');
  });
  await until(99);
  await step('privacy', async () => {
    await more('more-mission');
    await el('sanctuary-privacy').waitFor();
    await cap2('Free. Private. No account. Nothing leaves your device.');
  });
  await until(104);
  await step('export', async () => {
    await more('more-data');
    await el('sanctuary-data').waitFor();
    await cap2('Export: take your mixes with you as one file');
    await hl('[data-testid=sanctuary-export]');
    await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => {}), el('sanctuary-export').click()]);
  });
  await until(108);
  await hl(null);
  await step('close sanctuary', async () => {
    await el('sanctuary-close').click();
  });

  // 7. Kiro Crew (1:48 to 2:18)
  await mark('Kiro Crew: three agents from crew.yaml, real output, switch on, focus, recovery, decompress');
  await page.evaluate((p) => window.__demoTerm?.(p, 380), panes);
  await cap2('Three Kiro Crew agents, each with a write_allow and shell_allow list');
  await until(115);
  await cap2('Real output: git log, cargo test and the bridge start line');
  await until(122);
  await page.evaluate(() => window.__demoTerm?.(null));
  await step('crew switch', async () => {
    await advanced();
    await el('crew-toggle').scrollIntoViewIfNeeded();
    await hl('[data-testid=crew-toggle]');
    await cap2('Connect to Kiro Crew is a switch in Advanced. It is off by default.');
    await until(125);
    await el('crew-toggle').click();
    await page.waitForFunction(() => document.querySelector('[data-testid=crew-badge]')?.textContent === 'Crew Synced', null, { timeout: 15000 });
    await hl('[data-testid=crew-badge]');
    await cap2('Crew Synced. Demo feed: fake-crew writes the same file the sequencer agent writes');
    await until(127);
    if (await el('follow-crew').isVisible().catch(() => false)) await el('follow-crew').click();
    await until(129);
    await hl('[data-testid=burnout-meter]');
    fake = spawn(process.execPath, [FAKE_CREW, '--state', statePath, '--step-sec', '4', '--count', '4', '--transition-sec', '5'], { stdio: 'ignore', cwd: ROOT });
    await until(130);
    await cap2('Score 10: focus. The beat sits at 40 Hz.');
    await until(134);
    await cap2('Score 50: flow. The beat starts to glide down.');
    await until(138);
    await cap2('Score 70: recovery. About 10 Hz, slower and calmer.');
    await until(142);
    await cap2('Score 90: decompress. 6 Hz, breathing guide on.');
    await el('crew-badge').scrollIntoViewIfNeeded();
    await shot(6);
  });
  await until(146);
  fake?.kill();
  await hl(null);

  // 8. Sleep-fade timer (2:26 to 2:36)
  await mark('sleep-fade timer time-lapse');
  await step('timer', async () => {
    await more('timer-toggle');
    await el('timer-panel').waitFor();
    await cap2('Sleep fade timer: the volume falls slowly, then stops');
    await el('timer-sl-15').click();
    await el('timer-sleep').click();
    await nap(1200);
    await hl('[data-testid=timer-remaining]');
    for (let i = 0; i < 4; i++) {
      await page.clock.fastForward(3.5 * 60 * 1000);
      await nap(1300);
    }
    await cap2('Time-lapse: 14 minutes in, the sound is almost gone');
  });
  await until(156);
  await step('timer end', async () => {
    await page.clock.fastForward(70 * 1000);
    await nap(500);
    await el('timer-stop').click({ timeout: 1500 }).catch(() => {});
    await page.keyboard.press('Escape');
  });
  await hl(null);

  // 9. Offline (2:36 to 2:50 of the script)
  await mark('airplane mode: reload and keep playing');
  await step('offline', async () => {
    await bridge.stop();
    bridge = undefined;
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(
      async () => {
        for (const k of await caches.keys()) {
          const reqs = await (await caches.open(k)).keys();
          if (reqs.some((r) => r.url.endsWith('.wasm'))) return true;
        }
        return false;
      },
      null,
      { timeout: 30000 },
    );
    await page.evaluate(() => localStorage.setItem('zonked.quickstart.v1', '1'));
    await cap2('Airplane mode: the network is off');
    await context.setOffline(true);
    await until(159);
    await page.reload();
    await el('play-button').waitFor();
    await cap2('Reloaded with no network: the app, the engine and the sound still work');
    await until(161.5);
    await el('play-button').click();
    await isPlaying();
    await hl('[data-testid=scope-canvas]');
  });
  await until(165);
  await hl(null);

  // 10. Mascot and end card
  await mark('3D mascot tilt and drag, end card');
  await step('mascot', async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    const box = await el('mascot').boundingBox();
    await cap2('The 3D mascot tilts with your pointer and spins when you drag it');
    await page.mouse.move(box.x - 30, box.y - 30);
    for (const [fx, fy] of [[0.1, 0.1], [0.9, 0.15], [0.9, 0.85], [0.1, 0.9]]) {
      await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy, { steps: 10 });
      await nap(300);
    }
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx - 60, cy, { steps: 4 });
    await page.mouse.down();
    await page.mouse.move(cx + 120, cy, { steps: 18 });
    await page.mouse.up();
  });
  await until(TOTAL - 6);
  await cap2('Use stereo headphones at low volume. Zonked is not a medical device.');
  await title('Zonked', null, 0, 'Use stereo headphones at low volume. Zonked is not a medical device.');
  await until(TOTAL - 0.2);
  sampling = false;
  await sampler;
  const offApp = (t0 - tApp) / 1000;
  const offCap = (t0 - tCap) / 1000;
  const appVideo = page.video();
  const capVideo = capPage.video();
  await context.close();
  await capCtx.close();
  const appWebm = await appVideo.path();
  const capWebm = await capVideo.path();

  if (DRY) {
    console.log(`DRY RUN done; frames in ${SHOTS}\n${timeline.join('\n')}\ncaptions:\n${CAPTIONS.join('\n')}\nwarnings: ${warnings.length}`);
    warnings.forEach((w) => console.log(`  ${w}`));
  } else {
    console.log(`rendering soundtrack from ${samples.filter((s) => s.running).length} running samples`);
    const wav = join(tmp, 'demo.wav');
    await renderWav(samples, bed, wav);
    const strip = ['-map_metadata', '-1', '-fflags', '+bitexact', '-flags:v', '+bitexact', '-flags:a', '+bitexact'];
    const graph = `[0:v]setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[c];[c][a]vstack=inputs=2,fps=25,format=yuv420p[v];[2:a]afade=t=in:st=0:d=2,afade=t=out:st=${TOTAL - 5}:d=5[au]`;
    const inputs = ['-y', '-ss', offApp.toFixed(3), '-i', appWebm, '-ss', offCap.toFixed(3), '-i', capWebm, '-i', wav];
    const common = [...inputs, '-filter_complex', graph, '-map', '[v]', '-map', '[au]', '-t', String(TOTAL), ...strip];
    const mp4 = join(MEDIA, 'zonked-demo.mp4');
    const webm = join(MEDIA, 'zonked-demo.webm');
    const encode = (args, out, max, crf0) => {
      for (let crf = crf0; crf <= crf0 + 12; crf += 2) {
        const r = spawnSync(FFMPEG, [...common, ...args(crf), out], { stdio: 'ignore' });
        if (r.status !== 0) throw new Error(`${out} encode failed`);
        if (statSync(out).size <= max) return crf;
      }
      throw new Error(`${out} stays over its size budget`);
    };
    const c1 = encode((crf) => ['-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-c:a', 'aac', '-b:a', '112k', '-movflags', '+faststart'], mp4, MP4_MAX, 30);
    const c2 = encode((crf) => ['-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', '-c:a', 'libopus', '-b:a', '80k'], webm, WEBM_MAX, 40);
    console.log(`crf mp4 ${c1}, webm ${c2}`);
    for (const f of [mp4, webm]) {
      const d = run(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration,size', '-of', 'csv=p=0', f]).trim();
      console.log(`${f.split('/').pop()}: duration,size = ${d}`);
    }
    // small PNGs: reduce colors
    for (const n of ['poster', 'shot-1', 'shot-2', 'shot-3', 'shot-4', 'shot-5', 'shot-6']) {
      const p = join(MEDIA, `${n}.png`);
      const q = join(tmp, `${n}-q.png`);
      const r = spawnSync(FFMPEG, ['-y', '-i', p, '-vf', 'split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=none', '-map_metadata', '-1', q], { stdio: 'ignore' });
      if (r.status === 0 && statSync(q).size < statSync(p).size) copyFileSync(q, p);
    }
    console.log(`timeline\n${timeline.join('\n')}\ncaptions\n${CAPTIONS.join('\n')}\nwarnings: ${warnings.length}`);
    warnings.forEach((w) => console.log(`  ${w}`));
    writeFileSync(join(ROOT, '.work', 'w-demo-timeline.txt'), `${timeline.join('\n')}\n${CAPTIONS.join('\n')}\n${warnings.join('\n')}\n`);
  }
} finally {
  fake?.kill();
  if (bridge) await bridge.stop().catch(() => {});
  if (browser) await browser.close().catch(() => {});
  if (server) server.stop();
  rmSync(tmp, { recursive: true, force: true });
}
