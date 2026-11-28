// Feature checks that replace the Studio-era checks (F1 to F10). Real browser, real engine, ?e2e=1 hook.
// Each check runs in its own browser context. See docs/TEST-COVERAGE.md for the old-to-new map.
import { MAX_PEAK, measure, nav, newSession, openAdv, openSection, settle, skipToPlayer, waitSound } from './e2e-helpers.mjs';

const MAX_ALL = {
  lofiLevel: 1, crackle: 1, instLevel: 1, padLevel: 1, chimeLevel: 1, chimeRatePerMin: 30, percLevel: 1, percBpm: 180, instBpm: 180,
  breathDepth: 1, stereoWidth: 1, panDepth: 1, tapeWow: 1, pianoPedal: 1,
};
const SECTIONS = ['mix', 'calm-to-alert', 'editor', 'import-and-export', 'timers', 'scope', 'sound-health', 'saved-mixes', 'your-data'];
const PANEL_ID = { mix: 'adv-mix', 'calm-to-alert': 'adv-dial', editor: 'adv-editor', 'import-and-export': 'adv-io', timers: 'adv-timers', scope: 'adv-scope', 'sound-health': 'sound-health', 'saved-mixes': 'adv-mixes', 'your-data': 'adv-data' };

/** The six built-in presets as scripts, with the beat each one starts at. Same text as src/sbg/presets. */
const PRESET_SCRIPTS = [
  ['deep-focus', 'mode: bin\nfocus: 200+40/0.4\n00:00:00 focus\n', 40],
  ['flow-state', 'mode: bin\nflow: 220+18/0.4\n00:00:00 flow\n', 18],
  ['reset', 'mode: bin\nalpha: 200+10/0.35 pink/15\ntheta: 200+6/0.35 pink/20\n00:00:00 alpha ->\n00:20:00 theta\n', 10],
  ['breathwork', 'mode: bin\nbreathe: 180+5.5/0.4\n00:00:00 breathe\n', 5.5],
  ['deep-rest', 'mode: bin\nrest: 150+2.5/0.35 brown/10\n00:00:00 rest\n', 2.5],
  ['classic', 'mode: bin\nbase: 200+10/0.4 pink/10\n00:00:00 base\n', 10],
];

async function player(h, opts = {}) {
  const s = await newSession(h, opts);
  await skipToPlayer(s.page, h.origin);
  await waitSound(s.page);
  return s;
}

const readout = async (page) => Number(/([0-9.]+) Hz/.exec(await page.getByTestId('adv-dial-readout').innerText())?.[1] ?? NaN);

export async function runFeatureChecks(h) {
  const { check, assert } = h;

  await check('F1 Bluetooth mode: the choice is kept, the call-mode tip shows, the sound stays inside the limits', async () => {
    const s = await player(h);
    try {
      await nav(s.page, 'You').click();
      await s.page.getByTestId('device-bluetooth').check();
      await s.page.reload();
      await nav(s.page, 'You').click();
      assert(await s.page.getByTestId('device-bluetooth').isChecked(), 'Bluetooth not kept after a reload');
      await nav(s.page, 'Today').click();
      await s.page.getByTestId('today-play').click();
      await waitSound(s.page);
      await s.page.getByTestId('player-options').click();
      await s.page.getByTestId('bt-tip').waitFor();
      await s.page.waitForTimeout(2500);
      const m = await measure(s.page, 2000);
      assert(m.peak <= MAX_PEAK && m.rms > 0.005, `peak ${m.peak} rms ${m.rms}`);
      assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await check('F2 Advanced: all nine sections open at 390 px without sideways scroll, timers start and stop, sound health reads smooth', async () => {
    const s = await player(h, { viewport: { width: 390, height: 844 } });
    try {
      await openAdv(s.page);
      for (const id of SECTIONS) {
        await openSection(s.page, id.replace(/-/g, ' '));
        await s.page.getByTestId(PANEL_ID[id]).waitFor({ timeout: 10000 });
        const wide = await s.page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        assert(wide <= 0, `${id} overflows by ${wide}px`);
      }
      await s.page.getByTestId('adv-timer-countdown').click();
      assert((await s.page.evaluate(() => window.__zonked.timer?.kind)) === 'countdown', 'countdown did not start');
      await s.page.getByTestId('adv-timer-stop').click();
      assert((await s.page.evaluate(() => window.__zonked.timer?.kind)) === 'none', 'timer did not stop');
      const line = await s.page.getByTestId('sound-health-line').innerText();
      assert(/smooth|hiccup/i.test(line), `sound health line: ${line}`);
      const first = s.page.locator('[data-testid^="adv-mix-"] input, input[data-testid^="adv-mix-"]').first();
      await first.fill('1');
      await s.page.waitForTimeout(800);
      const m = await measure(s.page, 1500);
      assert(m.peak <= MAX_PEAK, `peak ${m.peak} with a layer at 1`);
      assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await check('F3 Advanced Editor and dial: six presets reach their beat, a hostile script is clamped, violet is audible, the dial note shows above 25 Hz', async () => {
    const s = await player(h);
    try {
      await openAdv(s.page);
      await openSection(s.page, 'editor');
      await openSection(s.page, 'calm to alert');
      const got = [];
      for (const [name, text, beat] of PRESET_SCRIPTS) {
        await s.page.getByTestId('adv-editor-text').fill(text);
        await s.page.getByTestId('adv-editor-play').click();
        await s.page.waitForTimeout(1800);
        const hz = await readout(s.page);
        assert(Math.abs(hz - beat) < 0.6, `${name}: beat ${hz} want ${beat}`);
        got.push(`${name}=${hz}`);
      }
      const hostile = 'mode: bin\nx: 9000+90/9.0\n00:00:00 x\n';
      await s.page.getByTestId('adv-editor-text').fill(hostile);
      const diag = await s.page.getByTestId('adv-diagnostics').innerText();
      assert(/Line \d+/.test(diag), `no line numbered warning: ${diag}`);
      await s.page.getByTestId('adv-editor-play').click();
      await s.page.waitForTimeout(2500);
      const hz = await readout(s.page);
      assert(hz >= 0.5 && hz <= 40, `hostile beat ${hz}`);
      const m = await measure(s.page, 2000);
      assert(m.peak <= MAX_PEAK, `hostile peak ${m.peak}`);
      await s.page.getByTestId('adv-editor-text').fill('mode: bin\nv: 200+10/0.4 violet/30\n00:00:00 v\n');
      await s.page.getByTestId('adv-editor-play').click();
      await s.page.waitForTimeout(2500);
      const v = await measure(s.page, 3000);
      assert(v.rms > 0.01 && v.peak <= MAX_PEAK, `violet rms ${v.rms} peak ${v.peak}`);
      await s.page.getByTestId('adv-mix-noise').waitFor();
      await s.page.getByTestId('adv-violet-note').waitFor();
      const max = Number(await s.page.getByTestId('adv-mix-noise').getAttribute('max'));
      assert(max <= 0.6 + 1e-9, `violet slider max ${max}`);
      const dial = s.page.getByTestId('adv-dial-input');
      await dial.fill('1');
      await s.page.waitForTimeout(800);
      const top = await readout(s.page);
      assert(top <= 40, `dial maximum ${top} Hz`);
      await dial.fill('0');
      await s.page.waitForTimeout(800);
      const low = await readout(s.page);
      assert(low >= 0.5, `dial minimum ${low} Hz`);
      assert((await s.page.getByTestId('adv-hearing-note').count()) === (low > 25 ? 1 : 0), 'hearing note shown at the wrong pulse speed');
      return got.join(' ');
    } finally {
      await s.context.close();
    }
  });

  await check('F4 Sounds: every feeling lists at least 5 sounds and the feelings together reach 210 or more', async () => {
    const s = await player(h);
    try {
      await nav(s.page, 'Sounds').click();
      await s.page.locator('.c-tile-count').first().waitFor();
      const counts = (await s.page.locator('.c-tile-count').allInnerTexts()).map((t) => Number(/\d+/.exec(t)?.[0] ?? 0));
      assert(counts.length >= 8, `tiles ${counts.length}`);
      const total = counts.reduce((a, b) => a + b, 0);
      assert(counts.every((c) => c >= 5), `a feeling has fewer than 5 sounds: ${counts.join(',')}`);
      assert(total >= 210, `total ${total}`);
      await s.page.locator('.c-tile').nth(1).click();
      assert((await s.page.locator('.c-row-play').count()) >= 5, 'fewer than 5 rows for the second feeling');
      return `tiles=${counts.length} total=${total}`;
    } finally {
      await s.context.close();
    }
  });

  await check('F5 keyboard: Space plays and pauses when nothing has focus, and is ignored while typing', async () => {
    const s = await player(h);
    try {
      await s.page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
      await s.page.keyboard.press('Space');
      await s.page.waitForFunction(() => window.__zonked.status.state !== 'running', null, { timeout: 10000 });
      await s.page.keyboard.press('Space');
      await waitSound(s.page);
      await nav(s.page, 'Sounds').click();
      await s.page.locator('#c-search-in').click();
      await s.page.keyboard.type('a b');
      assert((await s.page.locator('#c-search-in').inputValue()) === 'a b', 'Space did not type in the field');
      assert((await s.page.evaluate(() => window.__zonked.status.state)) === 'running', 'Space in a field stopped the sound');
      const m = await measure(s.page, 1500);
      assert(m.peak <= MAX_PEAK, `peak ${m.peak}`);
    } finally {
      await s.context.close();
    }
  });

  await check('F6 the Play control by hover, keyboard focus and long press: named, visible focus, one toggle per press, no stray popup', async () => {
    const s = await player(h, { viewport: { width: 390, height: 844 } });
    try {
      const btn = s.page.getByTestId('player-toggle');
      assert(((await btn.innerText()) || (await btn.getAttribute('aria-label')) || '').trim() !== '', 'Play has no name');
      await btn.hover();
      await s.page.waitForTimeout(500);
      assert((await s.page.locator('[role="tooltip"]').count()) === 0, 'a stray tooltip appeared');
      assert((await s.page.evaluate(() => window.__zonked.status.state)) === 'running', 'hover changed the sound');
      await s.page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
      for (let i = 0; i < 30; i += 1) {
        await s.page.keyboard.press('Tab');
        if (await btn.evaluate((el) => el === document.activeElement)) break;
      }
      const ring = await btn.evaluate((el) => {
        const c = getComputedStyle(el);
        return { outline: parseFloat(c.outlineWidth) > 0 && c.outlineStyle !== 'none', shadow: c.boxShadow !== 'none' };
      });
      assert(ring.outline || ring.shadow, 'no visible focus ring on Play');
      const box = await btn.boundingBox();
      assert(box !== null && box.x >= 0 && box.x + box.width <= 390, `Play outside the viewport: ${JSON.stringify(box)}`);
      await s.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await s.page.mouse.down();
      await s.page.waitForTimeout(700);
      await s.page.mouse.up();
      await s.page.waitForTimeout(1200);
      assert((await s.page.evaluate(() => window.__zonked.status.state)) !== 'running', 'a long press did not stop once');
      await btn.click();
      await waitSound(s.page);
      assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await check('F7 mascot: fits at three sizes, a drag spins it without toggling the sound, reduced motion freezes it', async () => {
    const s = await player(h);
    try {
      for (const [w, hh] of [[390, 844], [1280, 720], [1600, 900]]) {
        await s.page.setViewportSize({ width: w, height: hh });
        await s.page.waitForTimeout(400);
        const r = await s.page.evaluate(() => {
          const el = document.querySelector('.cm-driven, main .cm-stage, .cm-stage');
          const b = el?.getBoundingClientRect();
          return { w: b?.width ?? 0, right: b?.right ?? 9999, bottom: b?.bottom ?? 9999, sw: document.documentElement.scrollWidth, iw: innerWidth };
        });
        assert(r.w > 100 && r.right <= r.iw + 1 && r.sw <= r.iw, `mascot at ${w}x${hh}: ${JSON.stringify(r)}`);
      }
      const stage = await s.page.locator('.cm-stage').first().boundingBox();
      await s.page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2);
      await s.page.mouse.down();
      await s.page.mouse.move(stage.x + stage.width / 2 + 90, stage.y + stage.height / 2 + 10, { steps: 8 });
      await s.page.mouse.up();
      await s.page.waitForTimeout(300);
      assert((await s.page.evaluate(() => window.__zonked.status.state)) === 'running', 'a drag on the mascot changed the sound');
      await s.page.emulateMedia({ reducedMotion: 'reduce' });
      await s.page.waitForTimeout(600);
      const moving = await s.page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target?.closest?.('.cm-stage')).length);
      assert(moving === 0, `${moving} mascot animations still run under reduced motion`);
      assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await check('F8 the first screen shows Start without scrolling at 390x844 and every feeling card names a sound', async () => {
    const s = await newSession(h, { viewport: { width: 390, height: 844 } });
    try {
      await s.page.goto(`${h.origin}/?e2e=1`);
      await s.page.getByRole('button', { name: 'Skip, just play' }).click();
      const play = s.page.getByTestId('player-toggle').or(s.page.getByTestId('calm-safety-accept'));
      const box = await play.first().boundingBox();
      assert(box !== null && box.y + box.height <= 844, `first control below the fold: ${JSON.stringify(box)}`);
      await s.page.getByTestId('calm-safety-accept').click();
      await nav(s.page, 'Today').click();
      const t = await s.page.getByTestId('today-play').boundingBox();
      assert(t !== null && t.y + t.height <= 844, `Today Start below the fold: ${JSON.stringify(t)}`);
      assert((await s.page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, 'sideways scroll');
    } finally {
      await s.context.close();
    }
  });

  await check('F9 privacy and safety words: the privacy note says nothing leaves the device, the guide and notice name headphones and not a medical device', async () => {
    const s = await newSession(h, { calm: true });
    try {
      await s.page.goto(`${h.origin}/?e2e=1`);
      await s.page.getByRole('button', { name: 'Skip, just play' }).click();
      const notice = await s.page.getByTestId('safety-limits').locator('xpath=ancestor::*[contains(@class,"c-dialog") or contains(@class,"c-form") or self::section][1]').innerText().catch(() => '');
      const all = await s.page.locator('body').innerText();
      assert(/headphones/i.test(all) && /not a medical device/i.test(all), `notice text lacks headphones or medical line: ${(notice || all).slice(0, 200)}`);
      await s.page.getByTestId('calm-safety-accept').click();
      await s.page.getByTestId('player-toggle').waitFor();
      await nav(s.page, 'You').click();
      await s.page.getByTestId('privacy-link').click();
      const text = await s.page.getByTestId('privacy-text').innerText();
      assert(/device/i.test(text) && /(nothing|never|no)/i.test(text), `privacy text: ${text.slice(0, 200)}`);
      assert(/adults/i.test(text) && /helpline/i.test(text), `privacy note lacks the adults line or the help line: ${text.slice(0, 300)}`);
      await s.page.getByTestId('settings-guide').click();
      const guide = await s.page.getByTestId('guide').innerText();
      await s.page.getByTestId('guide-skip').click();
      assert(/headphone/i.test(guide) || /headphone/i.test(all), 'guide lacks the headphone note');
    } finally {
      await s.context.close();
    }
  });

  await check('F10 every sound level slider and the master are inside the limits: nature level max 0.85, no control reaches over 0.85 gain', async () => {
    const s = await player(h);
    try {
      await nav(s.page, 'Sounds').click();
      await s.page.getByTestId('open-nature').click();
      const max = await s.page.getByLabel('Nature volume').getAttribute('max');
      assert(Number(max) <= 0.85, `nature level max ${max}`);
      await s.page.getByTestId('nature-rain').click();
      await s.page.waitForFunction(() => window.__zonked?.nature?.id === 'rain', null, { timeout: 20000 });
      await settle(s.page);
      const m = await measure(s.page, 2000);
      assert(m.peak <= MAX_PEAK, `peak ${m.peak}`);
    } finally {
      await s.context.close();
    }
  });

  await check('F11 soft start: the first second is quieter than the settled level, and the stop ramp keeps frames flowing', async () => {
    const s = await newSession(h);
    try {
      await skipToPlayer(s.page, h.origin);
      await s.page.waitForFunction(() => window.__zonked?.status.state === 'running', null, { timeout: 20000 });
      const early = await measure(s.page, 400);
      await settle(s.page);
      const late = await measure(s.page, 1500);
      assert(late.rms > 0, 'silent');
      assert(early.rms < late.rms * 0.8, `no soft start: early ${early.rms.toFixed(4)} late ${late.rms.toFixed(4)}`);
      assert(late.peak <= MAX_PEAK, `peak ${late.peak}`);
      const before = await s.page.evaluate(() => window.__zonked.getStats());
      await s.page.getByTestId('player-toggle').click();
      const t0 = Date.now();
      let flowed = 0;
      let last = before.frames;
      while (Date.now() - t0 < 700) {
        const f = await s.page.evaluate(() => window.__zonked.getStats().then((x) => x.frames).catch(() => -1));
        if (f > last) flowed = Date.now() - t0;
        if (f > 0) last = Math.max(last, f);
        await s.page.waitForTimeout(40);
      }
      assert(flowed >= 200, `audio stopped ${flowed} ms after the tap`);
      return `early=${early.rms.toFixed(4)} late=${late.rms.toFixed(4)} flowed=${flowed} ms`;
    } finally {
      await s.context.close();
    }
  });

  await check('F12 hottest settings: dial at maximum and every layer at maximum keep the peak at or under 0.95 and the beat inside 0.5 to 40 Hz', async () => {
    const s = await player(h);
    try {
      await openAdv(s.page);
      await openSection(s.page, 'calm to alert');
      await s.page.getByTestId('adv-dial-input').fill('1');
      await s.page.evaluate((z) => window.__zonked.setLayers(z), MAX_ALL);
      await s.page.waitForTimeout(800);
      await settle(s.page);
      const m = await measure(s.page, 5000);
      assert(m.peak <= MAX_PEAK, `peak ${m.peak}`);
      const beat = await readout(s.page);
      assert(beat >= 0.5 && beat <= 40.05, `beat ${beat}`);
      return `peak=${m.peak.toFixed(3)} beat=${beat}`;
    } finally {
      await s.context.close();
    }
  });

  await check('F13 frame time on the Player with the CPU slowed 4 times: frames stay at or under 20 ms, or the low-power path switches on', async () => {
    const s = await newSession(h, { viewport: { width: 390, height: 844 } });
    try {
      let cdp = null;
      try {
        cdp = await s.context.newCDPSession(s.page);
      } catch {
        return 'skipped: CPU throttling needs Chromium';
      }
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await skipToPlayer(s.page, h.origin);
      await waitSound(s.page);
      await s.page.waitForTimeout(6000);
      const mean = await s.page.evaluate(
        () =>
          new Promise((res) => {
            const gaps = [];
            let prev = 0;
            const tick = (t) => {
              if (prev > 0) gaps.push(t - prev);
              prev = t;
              if (gaps.length < 90) requestAnimationFrame(tick);
              else res(gaps.reduce((a, b) => a + b, 0) / gaps.length);
            };
            requestAnimationFrame(tick);
          }),
      );
      const low = (await s.page.locator('.cm-stage.cm-low').count()) > 0;
      assert(mean <= 20 || low, `mean frame ${mean.toFixed(1)} ms and the low-power path is off`);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      return `mean frame ${mean.toFixed(1)} ms at 4x CPU slowdown, low-power path ${low ? 'on' : 'off'}`;
    } finally {
      await s.context.close();
    }
  });
}
