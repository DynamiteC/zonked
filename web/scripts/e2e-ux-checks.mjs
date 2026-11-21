// Sanctuary UX checks: first screen, sound cards, mix view, calm dial, Inspect, More menu, reduced motion.
import { newSession, num, openAdvanced, openMore, sleep } from './e2e-helpers.mjs';

const MOBILE = { width: 390, height: 844 };

async function fresh(h, viewport, url = '/?e2e=1') {
  const s = await newSession(h, { viewport });
  await s.page.goto(`${h.origin}${url}`);
  await s.page.getByTestId('play-button').waitFor();
  return s;
}

export async function runUxChecks(_page, h) {
  await h.check('S1 mobile first screen shows Play without scrolling, no overflow', async () => {
    const s = await fresh(h, MOBILE, '/');
    try {
      const b = await s.page.getByTestId('play-button').boundingBox();
      h.assert(b && b.y >= 0 && b.y + b.height <= 844, `play box ${JSON.stringify(b)}`);
      const sw = await s.page.evaluate(() => document.documentElement.scrollWidth);
      h.assert(sw <= 390, `scrollWidth ${sw}`);
      return `play y=${b.y.toFixed(0)}`;
    } finally {
      await s.context.close().catch(() => {});
    }
  });

  const s = await fresh(h, { width: 1280, height: 720 });
  const { page } = s;
  try {
    await h.check('S2 six sound cards with name and one sentence', async () => {
      const cards = page.locator('[data-testid^=sound-card-]:not([data-testid=sound-card-play])');
      await cards.first().waitFor();
      h.assert((await cards.count()) === 6, `cards ${await cards.count()}`);
      for (const t of await cards.allInnerTexts()) h.assert(/\w+[\s\S]+\./.test(t), `card text "${t}"`);
    });
    await h.check('S3 card Play starts that sound; its mini visual is live', async () => {
      await page.getByTestId('sound-card-lofi').getByTestId('sound-card-play').click();
      await page.waitForFunction(() => window.__zonked.templateId === 'starter-lofi', null, { timeout: 20000 });
      const live = await page.getByTestId('sound-card-lofi').getByTestId('sound-mini-visual').getAttribute('data-live');
      h.assert(live === 'true', `data-live ${live}`);
    });
    await h.check('S4 mix slider changes the layer level and stays in 0..1', async () => {
      await page.getByTestId('mix-slider-piano').fill('0.6');
      await sleep(300);
      const v = await page.getByTestId('mix-slider-piano').inputValue();
      h.assert(Math.abs(Number(v) - 0.6) < 0.01, `value ${v}`);
    });
    await h.check('S5 calm dial keeps the pulse readout inside 0.5-40 Hz', async () => {
      await page.getByTestId('calm-dial').fill('0');
      const a = await page.getByTestId('dial-readout').innerText();
      await page.getByTestId('calm-dial').fill('1');
      const b = await page.getByTestId('dial-readout').innerText();
      const hz = Number(/([\d.]+) Hz/.exec(b)?.[1]);
      h.assert(hz >= 0.5 && hz <= 40, `readout "${b}"`);
      return `${a} -> ${b}`;
    });
    await h.check('W1 dial moves the real beat (hud-beat) inside 0.5-40 Hz and the hearing note is absent at the dial maximum and visible above 25 Hz', async () => {
      await openAdvanced(page);
      await page.getByTestId('calm-dial').fill('0');
      await sleep(400);
      const a = await num(page, 'hud-beat');
      await page.getByTestId('calm-dial').fill('1');
      await sleep(400);
      const b = await num(page, 'hud-beat');
      h.assert(a >= 0.5 && b <= 40 && Math.abs(a - b) > 3, `beat ${a} -> ${b}`);
      const shown = () => page.getByTestId('hearing-note').isVisible().catch(() => false);
      h.assert(b <= 25 && !(await shown()), `hearing note must be absent at the dial maximum (beat ${b})`);
      // A 40 Hz preset puts the real beat above 25 Hz: the note must appear.
      await page.getByTestId('preset-select').selectOption('deep-focus');
      await page.waitForFunction(() => parseFloat(document.querySelector('[data-testid=hud-beat]').textContent) > 25, null, { timeout: 15000 });
      await page.getByTestId('hearing-note').waitFor({ state: 'visible', timeout: 5000 });
      return `${a} -> ${b} Hz, note absent; note visible at 40 Hz`;
    });
    await h.check('W2 violet card: visible note, slider changes the noise level', async () => {
      h.assert(await page.getByTestId('violet-note').isVisible(), 'violet note hidden');
      await page.getByTestId('sound-card-violet').getByTestId('sound-card-play').click();
      await page.waitForFunction(() => window.__zonked.templateId === 'starter-violet', null, { timeout: 20000 });
      const sl = page.getByTestId('mix-slider-noise');
      await sl.waitFor();
      await sl.fill('0.2');
      await sleep(300);
      const v = Number(await sl.inputValue());
      const max = Number(await sl.getAttribute('max'));
      h.assert(Math.abs(v - 0.2) < 0.01 && max <= 0.6, `value ${v} max ${max}`);
    });
    await h.check('W3 save a mix in Sanctuary, change the sound, load it back', async () => {
      await openMore(page, 'more-mixes');
      await page.getByTestId('sanctuary-mixes').waitFor();
      h.assert(!(await page.getByTestId('sanctuary-mix-save').isDisabled()), 'save disabled while a sound plays');
      await page.getByTestId('sanctuary-mix-name').fill('UX violet');
      await page.getByTestId('sanctuary-mix-save').click();
      await page.getByTestId('sanctuary-mixes-list').waitFor();
      await page.getByRole('button', { name: 'Close' }).first().click();
      await page.getByTestId('sound-card-lofi').getByTestId('sound-card-play').click();
      await page.waitForFunction(() => window.__zonked.templateId === 'starter-lofi', null, { timeout: 20000 });
      await openMore(page, 'more-mixes');
      await page.getByTestId('sanctuary-mix-play').first().click();
      await page.waitForFunction(() => document.querySelector('[data-testid=now-playing]')?.textContent !== '', null, { timeout: 20000 });
      await page.getByRole('button', { name: 'Close' }).first().click();
      const noise = await page.getByTestId('mix-slider-noise').count();
      h.assert(noise === 1, 'loaded mix did not restore the violet noise slider');
    });
    await h.check('S6 Inspect lists five bands and marks one as current', async () => {
      await openMore(page, 'inspect-toggle');
      await page.getByTestId('inspect-panel').waitFor();
      for (const n of ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma']) await page.getByTestId(`band-row-${n}`).waitFor();
      h.assert((await page.getByTestId('inspect-panel').locator('a').count()) === 0, 'Inspect renders links');
      const cur = await page.locator('[data-testid^=band-row-][data-current=true]').count();
      h.assert(cur === 1, `current rows ${cur}`);
    });
    await h.check('S7 More menu lists sanctuary entries and closes on Escape', async () => {
      await page.getByTestId('more-toggle').click();
      for (const id of ['mission', 'guide', 'favorites', 'mixes', 'milestones', 'data']) await page.getByTestId(`more-${id}`).waitFor();
      await page.keyboard.press('Escape');
      await page.getByTestId('more-menu').waitFor({ state: 'detached' });
    });
    await h.check('S8 reduced motion stops the stage and card animations', async () => {
      await page.getByLabel('Reduce motion').check();
      const names = await page.evaluate(() => document.getAnimations().map((a) => a.animationName).filter((x) => x));
      h.assert(names.length === 0, `running animations ${names.join(',')}`);
    });
    await h.check('S9 footer shows the mission line', async () => {
      const t = await page.getByTestId('mission-line').innerText();
      h.assert(/Free\. Private\. No account\./.test(t), t);
    });
  } finally {
    await s.context.close().catch(() => {});
  }
  await h.check('W4 starter: feel card then time then picker suggests a sound with a reason', async () => {
    const t = await fresh(h, { width: 1280, height: 720 }, '/');
    try {
      await t.page.getByTestId('qs-situation-cant-sleep').click();
      await t.page.getByTestId('qs-minutes-30').click();
      await t.page.getByTestId('sound-suggested').waitFor();
      const txt = await t.page.getByTestId('sound-suggested').innerText();
      h.assert(/Suggested for you: .{8,}/.test(txt), txt);
    } finally {
      await t.context.close().catch(() => {});
    }
  });
  await h.check('T6 pinned tooltip stays after the mouse leaves', async () => {
    const t = await fresh(h, { width: 1280, height: 720 });
    try {
      await t.page.getByRole('button', { name: 'About Play and Stop' }).click();
      await t.page.mouse.move(600, 400);
      await sleep(1000);
      h.assert((await t.page.getByRole('tooltip').count()) === 1, 'tooltip closed');
    } finally {
      await t.context.close().catch(() => {});
    }
  });
}
