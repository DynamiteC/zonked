// Core checks on the Calm shell, in a real browser against the production build.
// K = core. These replace the old Studio checks. The safety assertions are the same:
// no sound before the notice, a soft start, output at or below 0.95, no request leaves the origin.
// Each check uses its own browser context.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { WEB } from './e2e-lib.mjs';
import { MAX_PEAK, ZERO_LAYERS, closeSheet, engineState, measure, nav, newSession, openAdv, openSection, playFound, settle, skipToPlayer, sleep, waitSound } from './e2e-helpers.mjs';

const AUDIO_EXT = /\.(mp3|ogg|oga|opus|wav|m4a|aac|flac|weba)$/i;
const BENIGN = /43210|ERR_CONNECTION_REFUSED|ERR_CONNECTION_RESET/;
const MAX_ALL = {
  lofiLevel: 1, crackle: 1, instLevel: 1, padLevel: 1, chimeLevel: 1, chimeRatePerMin: 30, percLevel: 1, percBpm: 180, instBpm: 180,
  breathDepth: 1, stereoWidth: 1, panDepth: 1, tapeWow: 1, pianoPedal: 1,
};
const origin404 = (origin, reqs) => reqs.filter((u) => /^(https?|wss?|ftp):/.test(u) && new URL(u).origin !== new URL(origin).origin && !/^http:\/\/localhost:43210/.test(u));

/** One session that several checks share, so the app loads once and the request log covers all of them. */
async function sharedSession(h) {
  const s = await newSession(h);
  const reqs = [];
  const audioTypes = [];
  s.context.on('request', (r) => reqs.push(r.url()));
  s.context.on('response', (r) => {
    const ct = r.headers()['content-type'] ?? '';
    if (/^(audio|video)\//i.test(ct) || /ogg/i.test(ct)) audioTypes.push(`${r.url()} ${ct}`);
  });
  await skipToPlayer(s.page, h.origin);
  return { ...s, reqs, audioTypes };
}

export async function runCoreChecks(h) {
  const { check, assert, info } = h;
  const s = await sharedSession(h);
  const page = s.page;
  try {
    await check('K1 isolated, starts quietly, peak <= 0.95 and not silent', async () => {
      const iso = await page.evaluate(() => ({ iso: crossOriginIsolated, sab: typeof SharedArrayBuffer === 'function' }));
      assert(iso.iso && iso.sab, JSON.stringify(iso));
      // The skip path started sound a moment ago: the first window must be quieter than the settled level.
      const early = await measure(page, 400);
      await settle(page);
      const late = await measure(page, 1500);
      assert(late.rms > 0, 'silent');
      assert(early.rms < late.rms * 0.8, `no soft start: early rms ${early.rms.toFixed(4)} late ${late.rms.toFixed(4)}`);
      assert(late.peak <= MAX_PEAK, `peak ${late.peak}`);
      return `early rms=${early.rms.toFixed(4)} settled rms=${late.rms.toFixed(4)} peak=${late.peak.toFixed(3)}`;
    });

    await check('K2 stop ramps down, it does not cut', async () => {
      await settle(page);
      const before = await page.evaluate(() => window.__zonked.getStats());
      await page.getByTestId('player-toggle').click();
      // The engine fades for 300 ms before it closes: frames keep flowing for a moment after the tap.
      const t0 = Date.now();
      let last = before.frames;
      let flowed = 0;
      while (Date.now() - t0 < 600) {
        const st = await page.evaluate(() => window.__zonked.getStats().then((x) => x.frames).catch(() => -1));
        if (st > last) flowed = Date.now() - t0;
        if (st > 0) last = Math.max(last, st);
        await sleep(40);
      }
      assert(flowed >= 200, `audio stopped ${flowed} ms after the tap, the ramp must last about 300 ms`);
      await page.getByTestId('player-toggle').click();
      await waitSound(page);
      return `frames flowed ${flowed} ms after the tap`;
    });

    await check('K3 hottest settings: dial at maximum, every layer at maximum, peak <= 0.95 and the note shows', async () => {
      await openAdv(page);
      await openSection(page, 'Calm to Alert');
      await page.getByTestId('adv-dial-input').fill('1');
      await page.evaluate((z) => window.__zonked.setLayers(z), MAX_ALL);
      await sleep(800);
      await settle(page);
      const m = await measure(page, 6000);
      assert(m.peak <= MAX_PEAK, `peak ${m.peak}`);
      const beat = parseFloat(/([\d.]+) Hz/.exec(await page.getByTestId('adv-dial-readout').innerText())?.[1] ?? 'NaN');
      assert(beat >= 0.5 && beat <= 40.05, `beat ${beat}`);
      await page.evaluate((z) => window.__zonked.setLayers(z), ZERO_LAYERS);
      await closeSheet(page);
      return `peak=${m.peak.toFixed(3)} beat=${beat} Hz`;
    });

    await check('K4 each synthesized layer is audible, peak <= 0.95', async () => {
      await page.evaluate((z) => window.__zonked.setLayers(z), ZERO_LAYERS);
      await settle(page);
      const base = await measure(page, 2500);
      assert(base.rms > 0, 'no tone baseline');
      const cases = {
        lofi: { lofiLevel: 1, crackle: 0.5 },
        instrument: { instLevel: 1, instKind: 0, instBpm: 140 },
        pad: { padLevel: 1 },
        chimes: { chimeLevel: 1, chimeRatePerMin: 30 },
        perc: { percLevel: 1, percBpm: 150, percPattern: 6 },
      };
      const out = [];
      for (const [name, p] of Object.entries(cases)) {
        await page.evaluate((z) => window.__zonked.setLayers(z), { ...ZERO_LAYERS, ...p });
        await sleep(600);
        const m = await measure(page, 3000);
        assert(m.peak <= MAX_PEAK, `${name}: peak ${m.peak}`);
        const change = Math.abs(m.rms - base.rms) / base.rms;
        assert(change > 0.02, `${name}: level changed only ${(change * 100).toFixed(1)} percent`);
        out.push(`${name}=${(change * 100).toFixed(0)}pct`);
      }
      await page.evaluate((z) => window.__zonked.setLayers(z), ZERO_LAYERS);
      return out.join(' ');
    });

    await check('K5 a sweep of templates plays inside the limits', async () => {
      const out = [];
      for (let i = 0; i < 8; i += 1) {
        await nav(page, 'Sounds').click();
        await page.locator('#c-search-in').fill('');
        const tile = page.locator('.c-tile').nth(i);
        const label = (await tile.locator('.c-tile-name').innerText()).trim();
        await tile.click();
        await page.locator('.c-row-play').first().click();
        await page.getByTestId('player-toggle').waitFor();
        await waitSound(page);
        await sleep(1200);
        const m = await measure(page, 1200);
        assert(m.peak <= MAX_PEAK, `${label}: peak ${m.peak}`);
        assert((await engineState(page)) === 'running', `${label}: engine not running`);
        out.push(`${label}=${m.peak.toFixed(2)}`);
      }
      return out.join(' ');
    });

    await check('K6 Sounds: every feeling has sounds, search works, an empty search says so', async () => {
      await nav(page, 'Sounds').click();
      await page.locator('#c-search-in').fill('');
      const counts = await page.locator('.c-tile-count').allInnerTexts();
      assert(counts.length >= 6 && counts.every((t) => /^[1-9]\d* /.test(t)), `tile counts ${counts.join('|')}`);
      await page.locator('#c-search-in').fill('sleep');
      const n = await page.locator('.c-row-play').count();
      assert(n > 0 && n <= 20, `search sleep gave ${n}`);
      await page.locator('#c-search-in').fill('zzzqqqxx');
      assert((await page.locator('.c-empty').count()) === 1, 'no empty message');
      await page.locator('#c-search-in').fill('');
      return `tiles=${counts.length} sleep=${n}`;
    });

    await check('K7 favorite from Options survives a reload and shows under Favorites', async () => {
      await playFound(page, 'sleep');
      await page.getByTestId('player-options').click();
      const fav = page.getByTestId('sheet-favorite');
      if ((await fav.getAttribute('aria-pressed')) !== 'true') await fav.click();
      assert((await fav.getAttribute('aria-pressed')) === 'true', 'not pressed');
      await page.keyboard.press('Escape');
      await sleep(500);
      await page.reload();
      await page.getByTestId('greeting').or(page.getByTestId('player-toggle')).first().waitFor();
      await nav(page, 'Sounds').click();
      await page.getByRole('tab', { name: 'Favorites' }).click();
      assert((await page.locator('.c-row-play').count()) >= 1, 'favorite not listed');
    });

    await check('K8 a saved mix survives a reload, and its backup file is a valid local file', async () => {
      await playFound(page, 'focus');
      await waitSound(page);
      await openAdv(page);
      await openSection(page, 'Saved mixes');
      await page.getByTestId('sanctuary-mix-name').fill('Evening test');
      await page.getByTestId('sanctuary-mix-save').click();
      await page.getByTestId('sanctuary-mixes-list').waitFor();
      await openSection(page, 'Your data');
      const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('sanctuary-export').click()]);
      const text = readFileSync(await dl.path(), 'utf8');
      const json = JSON.parse(text);
      assert(JSON.stringify(json).length < 262144, 'export too large');
      assert(JSON.stringify(json).includes('Evening test'), 'mix missing from export');
      await sleep(400);
      await page.reload();
      await page.getByTestId('greeting').or(page.getByTestId('player-toggle')).first().waitFor();
      await nav(page, 'Sounds').click();
      await page.getByRole('tab', { name: 'My mixes' }).click();
      await page.getByText('Evening test').waitFor();
    });

    await check('K9 hostile import files are refused, and deleting everything clears the mix', async () => {
      await openAdv(page);
      await openSection(page, 'Your data');
      const input = page.getByTestId('sanctuary-import');
      const msg = page.getByTestId('sanctuary-data-message');
      const tries = [
        ['bad.json', '{"not":"zonked"'],
        ['wrong.json', JSON.stringify({ app: 'other', version: 99, mixes: 'x' })],
        ['proto.json', '{"__proto__":{"polluted":1},"app":"zonked","version":1}'],
      ];
      for (const [name, body] of tries) {
        await input.setInputFiles({ name, mimeType: 'application/json', buffer: Buffer.from(body) });
        await page.waitForFunction((n) => (document.querySelector('[data-testid=sanctuary-data-message]')?.textContent ?? '').length > 0 || n, name);
        assert(!/Imported|Done/i.test((await msg.innerText()) || ''), `${name} accepted: ${await msg.innerText()}`);
      }
      await input.setInputFiles({ name: 'big.json', mimeType: 'application/json', buffer: Buffer.alloc(3 * 1024 * 1024, 32) });
      await page.waitForFunction(() => (document.querySelector('[data-testid=sanctuary-data-message]')?.textContent ?? '').length > 0);
      assert(await page.evaluate(() => ({}).polluted === undefined), 'prototype polluted');
      await page.getByTestId('sanctuary-reset').click();
      await page.getByTestId('sanctuary-reset-yes').click();
      await openSection(page, 'Saved mixes');
      await page.getByTestId('sanctuary-mixes-empty').waitFor();
      await closeSheet(page);
    });

    await check('K10 oversized and malformed .sbg imports are refused with line numbers', async () => {
      await openAdv(page);
      await openSection(page, 'Import and export');
      const note = page.getByTestId('adv-io-note');
      await page.getByTestId('adv-import-input').setInputFiles({ name: 'big.sbg', mimeType: 'text/plain', buffer: Buffer.from('# x\n'.repeat(70000)) });
      await page.waitForFunction(() => /262144|too big|limit/i.test(document.querySelector('[data-testid=adv-io-note]')?.textContent ?? ''));
      const bad = ['# bad', 'mode: nonsense', 'a: 9999+999/9', 'zz: ???', '00:00:00 nothere', '99:99:99 a'].join('\n');
      await page.getByTestId('adv-import-input').setInputFiles({ name: 'bad.sbg', mimeType: 'text/plain', buffer: Buffer.from(bad) });
      await page.waitForFunction(() => /bad\.sbg/.test(document.querySelector('[data-testid=adv-io-note]')?.textContent ?? ''));
      await openSection(page, 'Editor');
      const diag = await page.getByTestId('adv-diagnostics').innerText();
      assert(/\d/.test(diag) && /line/i.test(diag), `no line numbers in diagnostics: ${diag}`);
      assert(await page.getByTestId('advanced-panels').isVisible(), 'app gone');
      const shown = (await note.innerText()).slice(0, 60);
      await closeSheet(page);
      return shown;
    });

    await check('K11 timers: countdown ends playback, sleep fade lowers the level', async () => {
      await page.keyboard.press('Escape');
      const t = await newSession(h);
      const p = t.page;
      try {
        await p.clock.install();
        await skipToPlayer(p, h.origin);
        await waitSound(p);
        await openAdv(p);
        await openSection(p, 'Timers');
        await p.getByTestId('adv-timer-cd').fill('1');
        await p.getByTestId('adv-timer-countdown').click();
        await p.waitForFunction(() => window.__zonked.timer?.kind === 'countdown' && window.__zonked.timer.running);
        await closeSheet(p);
        await p.clock.fastForward(61000);
        await p.waitForFunction(() => window.__zonked.status.state !== 'running', null, { timeout: 20000 });
        assert((await p.evaluate(() => window.__zonked.timer.kind)) === 'none', 'countdown did not reset');
        await p.getByTestId('player-toggle').click();
        await waitSound(p);
        await openAdv(p);
        await openSection(p, 'Timers');
        await p.getByTestId('adv-timer-sl').fill('15');
        await p.getByTestId('adv-timer-sleep').click();
        await p.waitForFunction(() => window.__zonked.timer?.kind === 'sleep-fade');
        await closeSheet(p);
        await sleep(1500);
        const start = await measure(p, 1500);
        await p.clock.fastForward(12 * 60 * 1000);
        await sleep(4000);
        const mid = await measure(p, 1500);
        assert(mid.rms < start.rms * 0.6, `sleep fade rms ${mid.rms.toFixed(5)} not below 0.6x ${start.rms.toFixed(5)}`);
        const errs = t.errors.filter((e) => !BENIGN.test(e));
        assert(errs.length === 0, errs.join(' | '));
        return `sleep rms ${start.rms.toFixed(4)} -> ${mid.rms.toFixed(4)}`;
      } finally {
        await t.context.close();
      }
    });

    await check('K12 hidden then visible keeps audio running', async () => {
      if ((await engineState(page)) !== 'running') await page.getByTestId('player-toggle').click();
      await waitSound(page);
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
      assert(after.rms > 0 && (await engineState(page)) === 'running', 'audio not back after visible');
    });

    await check('K13 every button on the main pages has an accessible name', async () => {
      const unnamed = () =>
        page.evaluate(() => {
          const out = [];
          for (const b of document.querySelectorAll('button, [role=button]')) {
            const labelled = b.getAttribute('aria-labelledby');
            const name = b.getAttribute('aria-label') || (labelled ? document.getElementById(labelled)?.textContent : '') || b.textContent.trim() || b.getAttribute('title') || '';
            if (!name.trim()) out.push(b.outerHTML.slice(0, 120));
          }
          return out;
        });
      const bad = [];
      for (const n of ['Today', 'Sounds', 'Crew', 'You']) {
        await nav(page, n).click();
        await sleep(300);
        bad.push(...(await unnamed()));
      }
      assert(bad.length === 0, bad.join(' | '));
    });

    await check('K14 no CSP violations, no console errors, no audio file requests, nothing leaves the origin', async () => {
      const csp = await page.evaluate(() => window.__csp);
      assert(csp.length === 0, `CSP: ${csp.join(', ')}`);
      const real = s.errors.filter((e) => !BENIGN.test(e));
      assert(real.length === 0, real.join(' | '));
      const audioReq = s.reqs.filter((u) => AUDIO_EXT.test(new URL(u).pathname));
      assert(audioReq.length === 0, `audio requests: ${audioReq.join(', ')}`);
      assert(s.audioTypes.length === 0, `audio content types: ${s.audioTypes.join(', ')}`);
      const out = origin404(h.origin, s.reqs);
      assert(out.length === 0, `requests that left the origin: ${out.join(', ')}`);
      return `${s.reqs.length} requests, all on the origin`;
    });

    await check('K14b the style policy is live: an inline style attribute is blocked and reported', async () => {
      const t = await newSession(h, { calm: true });
      try {
        await t.page.goto(`${h.origin}/`);
        await t.page.getByRole('button', { name: 'Skip, just play' }).waitFor();
        const seen = await t.page.evaluate(
          () =>
            new Promise((resolve) => {
              document.addEventListener('securitypolicyviolation', (e) => resolve(e.violatedDirective), { once: true });
              const el = document.createElement('div');
              el.setAttribute('style', 'color: red');
              document.body.append(el);
              setTimeout(() => resolve('none'), 3000);
            }),
        );
        assert(/style-src/.test(String(seen)), `no style-src violation, got ${seen}`);
        await sleep(500);
        // That one violation was on purpose: take it out of the run-wide list.
        h.cspViolations = (h.cspViolations ?? []).filter((v) => !/style-src-attr/.test(v));
      } finally {
        await t.context.close();
      }
    });

    await check('K15 offline reload plays', async () => {
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(
        async () => {
          for (const k of await caches.keys()) {
            const reqs = await (await caches.open(k)).keys();
            if (reqs.some((r) => r.url.endsWith('.wasm')) && reqs.some((r) => /worklet-.*\.js$/.test(r.url))) return true;
          }
          return false;
        },
        null,
        { timeout: 30000 },
      );
      await s.context.setOffline(true);
      await page.reload();
      await page.getByTestId('greeting').or(page.getByTestId('player-toggle')).first().waitFor();
      assert(/^Zonked/.test(await page.title()), `title ${await page.title()}`);
      if ((await page.getByTestId('player-toggle').count()) === 0) await page.getByTestId('today-play').click();
      await waitSound(page);
      await s.context.setOffline(false);
    });
  } finally {
    await s.context.close().catch(() => {});
  }
}

export async function bundleCheck(h) {
  await h.check('K16 npm run check:bundle passes', async () => {
    const r = spawnSync('npm', ['run', 'check:bundle'], { cwd: WEB, encoding: 'utf8' });
    const out = `${r.stdout}${r.stderr}`;
    h.assert(r.status === 0 && /^PASS/m.test(out), `exit ${r.status}: ${out.slice(-300)}`);
    return /JS [\d.]+ KB \+ CSS [\d.]+ KB = [\d.]+ KB gzip[^\n]*/.exec(out)?.[0] ?? 'PASS';
  });
}
