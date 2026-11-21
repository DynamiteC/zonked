// Checks 16 (MediaSession), 17 (background), 18 (reduced motion), 11 (no audio files),
// 14 (timers on a fake clock), 19 (bundle) and 20 (mixed content, informational).
import { spawnSync } from 'node:child_process';
import { WEB, startBridge } from './e2e-lib.mjs';
import { measure, newSession, nowPlaying, num, openAdvanced, playLabel, press, sleep, startPlaying, state } from './e2e-helpers.mjs';

const AUDIO_EXT = /\.(mp3|ogg|oga|opus|wav|m4a|aac|flac|weba)$/i;

export async function checksB(h, lib, reqs, audioTypes) {
  const { check, assert, info } = h;
  const page = lib.page;
  const label = (l) => playLabel(page, l);

  await check('16 MediaSession handlers and per-template metadata', async () => {
    if ((await state(page)) !== 'running') await startPlaying(page);
    await press(page, '1');
    await page.waitForFunction(() => window.__zonked.queueIndex === 0);
    const handlers = await page.evaluate(() => Object.fromEntries(Object.entries(window.__msh).map(([k, v]) => [k, typeof v])));
    const need = ['play', 'pause', 'stop', 'nexttrack', 'previoustrack', 'seekforward', 'seekbackward'];
    const missing = need.filter((a) => handlers[a] !== 'function');
    assert(missing.length === 0, `missing handlers: ${missing.join(',')} got ${JSON.stringify(handlers)}`);
    const meta = () =>
      page.evaluate(() => ({ title: navigator.mediaSession.metadata?.title ?? null, artwork: navigator.mediaSession.metadata?.artwork?.length ?? 0, state: navigator.mediaSession.playbackState }));
    await page.waitForFunction(() => navigator.mediaSession.metadata?.title && navigator.mediaSession.metadata.title !== 'Zonked');
    const m1 = await meta();
    assert(m1.title === (await nowPlaying(page)).trim(), `title "${m1.title}" != now playing`);
    assert(m1.artwork > 0, 'no artwork');
    assert(m1.state === 'playing', `playbackState ${m1.state}`);
    await page.evaluate(() => window.__msh.nexttrack());
    await page.waitForFunction((t) => navigator.mediaSession.metadata.title !== t, m1.title);
    const m2 = await meta();
    assert(m2.title === (await nowPlaying(page)).trim(), 'title not in sync after nexttrack');
    await page.evaluate(() => window.__msh.previoustrack());
    await page.waitForFunction((t) => navigator.mediaSession.metadata.title === t, m1.title);
    await page.evaluate(() => {
      window.__msh.seekforward({ seekOffset: 15 });
      window.__msh.seekbackward({ seekOffset: 15 });
    });
    await page.evaluate(() => window.__msh.pause());
    await label('Play');
    assert((await meta()).state === 'paused', 'playbackState not paused');
    await page.evaluate(() => window.__msh.play());
    await label('Stop');
    await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]').dataset.state === 'running');
    await page.evaluate(() => window.__msh.stop());
    await label('Play');
    await press(page, ' ');
    await label('Stop');
    await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]').dataset.state === 'running');
    return `"${m1.title}" -> "${m2.title}"`;
  });

  await check('17 hidden then visible keeps audio; wake lock toggle does not error', async () => {
    if ((await state(page)) !== 'running') await startPlaying(page);
    const benign = (e) => /43210|ERR_CONNECTION_REFUSED|ERR_CONNECTION_RESET/.test(e);
    const errBefore = lib.errors.length;
    const toggle = page.getByTestId('wakelock-toggle');
    const supported = !(await toggle.isDisabled());
    if (supported) {
      await toggle.click();
      assert((await toggle.getAttribute('aria-pressed')) === 'true', 'wake lock not on');
    } else info.push('wake lock unsupported in this browser: toggle is disabled');
    const setHidden = (v) =>
      page.evaluate((hidden) => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
        Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (hidden ? 'hidden' : 'visible') });
        document.dispatchEvent(new Event('visibilitychange'));
      }, v);
    await setHidden(true);
    await sleep(800);
    const hid = await measure(page, 800);
    assert(hid.rms > 0, 'audio stopped while hidden');
    await setHidden(false);
    await sleep(800);
    const after = await measure(page, 1000);
    assert(after.rms > 0, 'audio silent after visible');
    assert((await state(page)) === 'running', `engine ${await state(page)}`);
    if (supported) {
      await toggle.click();
      assert((await toggle.getAttribute('aria-pressed')) === 'false', 'wake lock did not turn off');
    }
    const newErrs = lib.errors.slice(errBefore).filter((e) => !benign(e));
    assert(newErrs.length === 0, `errors: ${newErrs.join(' | ')}`);
    return `rms hidden=${hid.rms.toFixed(4)} visible=${after.rms.toFixed(4)} wakeLock=${supported}`;
  });

  await check('18 reduced motion freezes mascot tilt, off tilts', async () => {
    await page.keyboard.press('Escape');
    const mascot = page.getByTestId('mascot');
    const box = await mascot.boundingBox();
    assert(box, 'no mascot box');
    const style = () => mascot.evaluate((el) => ({ rx: el.style.getPropertyValue('--rx'), ry: el.style.getPropertyValue('--ry'), depth: el.style.getPropertyValue('--depth') }));
    const cb = page.getByLabel('Reduce motion');
    await cb.check();
    assert((await mascot.getAttribute('data-motion')) === 'frozen', 'not frozen');
    await sleep(300);
    const rest = await style();
    await page.mouse.move(box.x - 40, box.y - 40);
    for (const [fx, fy] of [[0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.15, 0.85], [0.5, 0.5]]) {
      await page.mouse.move(box.x + box.width * fx, box.y + box.height * fy, { steps: 6 });
      await sleep(120);
    }
    const moved = await style();
    assert(JSON.stringify(rest) === JSON.stringify(moved), `style changed while reduced: ${JSON.stringify(rest)} -> ${JSON.stringify(moved)}`);
    assert(Math.abs(parseFloat(moved.rx || '0')) < 0.01 && Math.abs(parseFloat(moved.ry || '0')) < 0.01, `not at rest: ${JSON.stringify(moved)}`);
    await cb.uncheck();
    assert((await mascot.getAttribute('data-motion')) === 'live', 'not live');
    await page.mouse.move(box.x - 40, box.y - 40);
    await sleep(300);
    const base = await style();
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.15, { steps: 8 });
    await sleep(700);
    const live = await style();
    assert(live.ry !== base.ry || live.rx !== base.rx, `tilt did not change: ${JSON.stringify(base)} -> ${JSON.stringify(live)}`);
    assert(Math.abs(parseFloat(live.ry)) > 0.5 || Math.abs(parseFloat(live.rx)) > 0.5, `tilt too small ${JSON.stringify(live)}`);
    const os = await newSession(h, { reducedMotion: 'reduce' });
    try {
      await os.page.goto(`${h.origin}/?e2e=1`);
      const m2 = os.page.getByTestId('mascot');
      await m2.waitFor();
      assert((await m2.getAttribute('data-motion')) === 'frozen', 'prefers-reduced-motion not honoured');
      const b2 = await m2.boundingBox();
      await os.page.mouse.move(b2.x + 5, b2.y + 5, { steps: 6 });
      await sleep(400);
      const s2 = await m2.evaluate((el) => el.style.getPropertyValue('--ry'));
      assert(Math.abs(parseFloat(s2 || '0')) < 0.01, `OS reduced motion tilt ${s2}`);
    } finally {
      await os.context.close();
    }
    return `reduced rest=${rest.ry || '0'} moved=${moved.ry || '0'}; live ry=${live.ry} rx=${live.rx}`;
  });

  await check('11 no audio file requests or audio/* responses during the session', async () => {
    const audioReq = reqs.filter((u) => AUDIO_EXT.test(new URL(u).pathname));
    assert(audioReq.length === 0, `audio requests: ${audioReq.join(', ')}`);
    assert(audioTypes.length === 0, `audio content types: ${audioTypes.join(', ')}`);
    const cached = await page.evaluate(async () => {
      const out = [];
      for (const k of await caches.keys()) for (const r of await (await caches.open(k)).keys()) out.push(r.url);
      return out;
    });
    const cachedAudio = cached.filter((u) => AUDIO_EXT.test(new URL(u).pathname));
    assert(cachedAudio.length === 0, `cached audio: ${cachedAudio.join(', ')}`);
    const real = lib.errors.filter((e) => !/43210|ERR_CONNECTION_REFUSED|ERR_CONNECTION_RESET/.test(e));
    assert(real.length === 0, `console errors in library session: ${real.join(' | ')}`);
    const csp = await page.evaluate(() => window.__csp);
    assert(csp.length === 0, `CSP: ${csp.join(', ')}`);
    return `${reqs.length} requests, 0 audio, ${cached.length} cache entries`;
  });
  // Informational probe: rapid stop then play (double Space) must not leave the UI playing with a stopped engine.
  try {
    if ((await state(page)) !== 'running') await startPlaying(page);
    await page.keyboard.press(' ');
    await page.keyboard.press(' ');
    await sleep(2500);
    const label = await page.getByTestId('play-button').innerText();
    const eng = await state(page);
    const ok = (label === 'Stop') === (eng === 'running');
    info.push(`rapid double Space: button "${label}", engine "${eng}"${ok ? ' (consistent)' : ' (BUG: UI and engine disagree, stop/play race in Player)'}`);
  } catch (e) {
    info.push(`rapid double Space probe failed: ${String(e).split('\n')[0]}`);
  }
}

export async function timersCheck(h) {
  const { check, assert } = h;
  await check('14 timers: countdown ends, sleep fade lowers gain and stops, Pomodoro phases, restore paused', async () => {
    const t = await newSession(h);
    const p = t.page;
    try {
      await p.clock.install();
      await p.goto(`${h.origin}/?e2e=1`);
      await p.getByTestId('play-button').waitFor();
      await openAdvanced(p);
      await startPlaying(p);
      await p.getByTestId('timer-toggle').click();
      await p.getByTestId('timer-panel').waitFor();
      await p.getByTestId('timer-cd-custom').fill('1');
      await p.getByTestId('timer-countdown').click();
      await p.waitForFunction(() => window.__zonked.timer?.kind === 'countdown' && window.__zonked.timer.running);
      const rem = await p.evaluate(() => window.__zonked.timer.remainingSec);
      assert(rem > 0 && rem <= 60, `countdown remaining ${rem}`);
      await p.clock.fastForward(61000);
      await playLabel(p, 'Play');
      assert((await p.evaluate(() => window.__zonked.timer.kind)) === 'none', 'countdown did not reset');
      await startPlaying(p);
      await p.getByTestId('timer-sl-15').click();
      await p.getByTestId('timer-sleep').click();
      await p.waitForFunction(() => window.__zonked.timer?.kind === 'sleep-fade');
      await sleep(1500);
      const start = await measure(p, 1500);
      const beat0 = await num(p, 'hud-beat');
      await p.clock.fastForward(12 * 60 * 1000);
      await sleep(4000);
      const mid = await measure(p, 1500);
      const beat1 = await num(p, 'hud-beat');
      assert(mid.rms < start.rms * 0.6, `sleep fade rms ${mid.rms.toFixed(5)} not below 0.6x ${start.rms.toFixed(5)}`);
      assert(beat1 < beat0 - 5, `sleep fade beat ${beat0} -> ${beat1}`);
      assert((await state(p)) === 'running', 'stopped too early');
      await p.clock.fastForward(3 * 60 * 1000);
      await sleep(300);
      await p.clock.fastForward(20000);
      await sleep(300);
      await p.clock.fastForward(20000);
      await playLabel(p, 'Play');
      assert((await p.evaluate(() => window.__zonked.timer.kind)) === 'none', 'sleep timer did not reset');
      await startPlaying(p);
      await p.getByTestId('timer-focus-min').fill('1');
      await p.getByTestId('timer-break-min').fill('1');
      await p.getByTestId('timer-pomodoro').click();
      await p.waitForFunction(() => window.__zonked.timer?.kind === 'pomodoro' && window.__zonked.timer.phase === 'focus');
      await p.clock.fastForward(61000);
      await p.waitForFunction(() => window.__zonked.timer?.phase === 'break', null, { timeout: 15000 });
      assert(/break/.test(await p.getByTestId('timer-remaining').innerText()), 'pill does not show break');
      const stored = await p.evaluate(() => localStorage.getItem('zonked.timer.v1'));
      assert(stored && stored.length > 5, 'timer not persisted');
      await p.reload();
      await p.getByTestId('play-button').waitFor();
      await p.waitForFunction(() => window.__zonked?.timer?.kind === 'pomodoro');
      const restored = await p.evaluate(() => window.__zonked.timer);
      assert(restored.running === false, 'restored timer is running');
      assert(restored.remainingSec > 0, 'restored timer has no time left');
      assert((await p.getByTestId('play-button').innerText()) === 'Play', 'playback auto-started after reload');
      const errs = t.errors.filter((e) => !/43210|ERR_CONNECTION/.test(e));
      assert(errs.length === 0, errs.join(' | '));
      return `countdown ended; sleep rms ${start.rms.toFixed(4)}->${mid.rms.toFixed(4)}, beat ${beat0}->${beat1}, stopped; pomodoro focus->break; restored paused (${Math.round(restored.remainingSec)}s left)`;
    } finally {
      await t.context.close();
    }
  });
}

export async function bundleCheck(h) {
  await h.check('19 npm run check:bundle passes', async () => {
    const r = spawnSync('npm', ['run', 'check:bundle'], { cwd: WEB, encoding: 'utf8' });
    const out = `${r.stdout}${r.stderr}`;
    h.assert(r.status === 0 && /^PASS/m.test(out), `exit ${r.status}: ${out.slice(-300)}`);
    return /JS [\d.]+ KB \+ CSS [\d.]+ KB = [\d.]+ KB gzip[^\n]*/.exec(out)?.[0] ?? 'PASS';
  });
}

/** 20. Hosted https page (URL from ZONKED_SITE_URL) against the loopback bridge. Informational only. */
export async function runMixedContent(h) {
  const { info } = h;
  const site = process.env.ZONKED_SITE_URL;
  if (!site) {
    info.push('mixed content: ZONKED_SITE_URL not set; skipped');
    return;
  }
  let bridge;
  try {
    const res = await fetch(`${site}/`, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    info.push(`mixed content: ${site} not reachable from this machine (${e.cause?.code ?? e.message}); not tested`);
    return;
  }
  try {
    h.writeState(40, 'flow', 'flow-state', 18, 220, false);
    bridge = await startBridge(h.statePath, site);
    const s = await newSession(h, { crew: true });
    try {
      try {
        await s.context.grantPermissions(['local-network-access'], { origin: site });
      } catch {
        /* permission name unknown to this Chromium build */
      }
      await s.page.goto(site, { timeout: 30000 });
      await s.page.getByTestId('crew-badge').waitFor({ timeout: 15000 });
      let badge;
      try {
        await s.page.waitForFunction(() => document.querySelector('[data-testid=crew-badge]').textContent === 'Crew Synced', null, { timeout: 15000 });
        badge = 'Crew Synced';
      } catch {
        badge = await s.page.getByTestId('crew-badge').innerText();
      }
      const blocked = s.errors.filter((e) => /43210/.test(e)).slice(0, 2).join(' | ');
      info.push(
        `mixed content (Chromium, ${site} -> http://localhost:43210): badge "${badge}"${badge === 'Crew Synced' ? ', loopback allowed from https' : `, not synced${blocked ? ` (${blocked})` : ''}`}`,
      );
    } finally {
      await s.context.close();
    }
    info.push('mixed content (Firefox): not installed in the Playwright cache, skipped; Safari blocks loopback from https by design');
  } catch (e) {
    info.push(`mixed content test could not complete: ${e instanceof Error ? e.message.split('\n')[0] : e}`);
  } finally {
    if (bridge) await bridge.stop().catch(() => {});
  }
}
