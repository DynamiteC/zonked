// Calm front door checks (C1 to C7, L1): safety before sound, onboarding, theme switch, week wording,
// reduced motion, 375 px layout. Each check runs in its own browser context with no pre-set keys.
import { newSession } from './e2e-helpers.mjs';

const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });
const CHAIN = /streak|chain|lost|broke|miss(ed)?\b/i;

const open = async (h, opts = {}) => {
  const s = await newSession(h, { calm: true, ...opts });
  await s.page.addInitScript(() => {
    window.__acCount = 0;
    const Base = window.AudioContext;
    window.AudioContext = class extends Base {
      constructor(...a) {
        super(...a);
        window.__acCount++;
      }
    };
  });
  await s.page.goto(`${h.origin}/`);
  await s.page.getByText('1 of 3').first().waitFor();
  return s;
};

/** Walks steps 1 to 3. The caller is left on step 4, the safety notice. */
async function toNotice(page) {
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByTestId('calm-safety-accept').waitFor();
}

async function finishOnboarding(page) {
  await toNotice(page);
  await page.getByTestId('calm-safety-accept').click();
  await page.getByRole('heading', { name: 'Pick a starter sound' }).waitFor();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByTestId('player-toggle').waitFor();
}

export async function runCalmChecks(h) {
  await h.check('C1 calm is the default and no sound starts before the safety notice is accepted', async () => {
    const s = await open(h);
    try {
      h.assert((await s.page.evaluate(() => localStorage.getItem('zonked.safety.v1'))) === null, 'safety flag preset');
      await toNotice(s.page);
      await s.page.waitForTimeout(1500);
      const before = await s.page.evaluate(() => window.__acCount);
      h.assert(before === 0, `AudioContext created before accept: ${before}`);
      h.assert((await s.page.getByRole('button', { name: /preview/i }).count()) === 0, 'preview shown before accept');
      h.assert((await s.page.getByTestId('player-toggle').count()) === 0, 'player shown before accept');
      await s.page.getByTestId('calm-safety-accept').click();
      await s.page.getByRole('heading', { name: 'Pick a starter sound' }).waitFor();
      h.assert((await s.page.evaluate(() => window.__acCount)) === 0, 'sound started by accept alone');
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
    const k = await open(h);
    try {
      await k.page.getByRole('button', { name: 'Skip, just play' }).click();
      await k.page.getByTestId('calm-safety-accept').waitFor();
      await k.page.waitForTimeout(1500);
      h.assert((await k.page.evaluate(() => window.__acCount)) === 0, 'sound before notice on skip path');
      h.assert((await k.page.getByText(/of 3/).count()) === 0, 'notice is numbered');
      await k.page.getByTestId('calm-safety-accept').click();
      await k.page.getByTestId('player-toggle').waitFor();
      h.assert((await k.page.getByRole('heading', { name: 'Pick a starter sound' }).count()) === 0, 'starter screen shown on skip path');
      await k.page.waitForFunction(() => window.__acCount === 1);
    } finally {
      await k.context.close();
    }
  });

  await h.check('C2 onboarding completes in 5 steps and lands on the player with sound', async () => {
    const s = await open(h);
    try {
      await finishOnboarding(s.page);
      await s.page.waitForFunction(() => window.__acCount === 1);
      await nav(s.page, 'Today').click();
      await s.page.getByTestId('greeting').waitFor();
      await s.page.reload();
      await s.page.getByTestId('greeting').waitFor();
      h.assert((await s.page.getByText('1 of 3').count()) === 0, 'onboarding shown again after reload');
    } finally {
      await s.context.close();
    }
  });

  await h.check('C3 week display has no chain wording', async () => {
    const s = await open(h);
    try {
      await finishOnboarding(s.page);
      await nav(s.page, 'Today').click();
      const text = await s.page.getByTestId('week-text').innerText();
      h.assert(!CHAIN.test(text), `week text: ${text}`);
      const dots = await s.page.locator('.c-main .c-dots').innerText();
      h.assert(!CHAIN.test(dots), `dots text: ${dots}`);
      h.assert((await s.page.locator('.c-main .c-dots li').count()) === 7, 'not 7 dots');
    } finally {
      await s.context.close();
    }
  });

  await h.check('C4 theme switch to Studio and back persists across reload', async () => {
    const s = await open(h);
    try {
      await finishOnboarding(s.page);
      await nav(s.page, 'You').click();
      await s.page.getByTestId('studio-switch').click();
      await s.page.getByTestId('play-button').waitFor();
      h.assert((await s.page.evaluate(() => localStorage.getItem('zonked.theme.v1'))) === 'studio', 'key not studio');
      await s.page.reload();
      await s.page.getByTestId('play-button').waitFor();
      await s.page.getByTestId('back-to-calm').click();
      await s.page.getByTestId('greeting').waitFor();
      await s.page.reload();
      await s.page.getByTestId('greeting').waitFor();
      h.assert((await s.page.evaluate(() => localStorage.getItem('zonked.theme.v1'))) === 'calm', 'key not calm');
    } finally {
      await s.context.close();
    }
  });

  await h.check('C5 reduced-motion emulation turns calm motion off', async () => {
    const s = await open(h, { reducedMotion: 'reduce' });
    try {
      const modes = await s.page.evaluate(() => [...document.querySelectorAll('[data-motion]')].map((e) => e.dataset.motion));
      h.assert(modes.length > 0 && modes.every((m) => m === 'off'), `data-motion ${JSON.stringify(modes)}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('C6 375 px width: no sideways scroll on onboarding, Today, Sounds, Crew, You', async () => {
    const s = await open(h, { viewport: { width: 375, height: 740 } });
    try {
      const wide = () => s.page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      h.assert((await wide()) <= 0, 'onboarding overflows');
      await finishOnboarding(s.page);
      for (const n of ['Today', 'Sounds', 'Crew', 'You']) {
        await nav(s.page, n).click();
        await s.page.waitForTimeout(300);
        h.assert((await wide()) <= 0, `${n} overflows`);
      }
    } finally {
      await s.context.close();
    }
  });

  await h.check('C7 done-for-now card after a session, Play again and Close work, Today never shows two buttons for one session', async () => {
    const s = await open(h);
    try {
      await s.page.clock.install();
      await s.page.getByRole('button', { name: 'Skip, just play' }).click();
      await s.page.getByTestId('calm-safety-accept').click();
      await s.page.getByTestId('player-toggle').waitFor();
      await s.page.clock.runFor(90_000);
      await s.page.getByTestId('player-toggle').click();
      await s.page.clock.runFor(2000);
      await s.page.getByTestId('end-card').waitFor();
      const text = await s.page.getByTestId('end-card').innerText();
      h.assert(/Done for now\./.test(text) && /played for/.test(text), `card text: ${text}`);
      h.assert(!/tomorrow|streak|missed/i.test(text), 'pressure wording on end card');
      await s.page.getByTestId('end-close').click();
      h.assert((await s.page.getByTestId('end-card').count()) === 0, 'card still shown after Close');
      await nav(s.page, 'Today').click();
      // Play again shows only when the last session differs from today's pick; otherwise one Start.
      await s.page.getByTestId('today-play').waitFor();
      const again = await s.page.getByTestId('play-again').count();
      const pick = await s.page.locator('#c-daily-h').textContent();
      const label = again > 0 ? await s.page.getByTestId('play-again').textContent() : '';
      h.assert(again === 0 || !label.includes(pick ?? '?'), `two buttons for one session: ${label} / ${pick}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('L1 walk 2 layout: Skip above the fold, Add nature clears the tab bar, Why box readable on Crew, Nature sliders on top', async () => {
    const top = async (loc) => (await loc.boundingBox())?.y ?? -1;
    const bottom = async (loc) => {
      const b = await loc.boundingBox();
      return b === null ? 1e9 : b.y + b.height;
    };
    const a = await open(h, { viewport: { width: 390, height: 844 } });
    try {
      h.assert((await bottom(a.page.getByRole('button', { name: 'Skip, just play' }))) <= 844, 'Skip below the fold at 390x844');
    } finally {
      await a.context.close();
    }
    const b = await open(h, { viewport: { width: 360, height: 740 } });
    try {
      await b.page.getByRole('button', { name: 'Skip, just play' }).click();
      await b.page.getByTestId('calm-safety-accept').click();
      await b.page.getByTestId('player-nature').waitFor();
      const tab = await top(b.page.locator('.c-tabbar'));
      h.assert((await bottom(b.page.getByTestId('player-nature'))) <= tab, 'Add nature sound sits under the tab bar at 360x740');
      h.assert((await b.page.getByRole('button', { name: '30 min' }).getAttribute('aria-pressed')) === 'false', 'timer chip has no aria-pressed');
      await nav(b.page, 'Sounds').click();
      await b.page.getByTestId('open-nature').click();
      await b.page.getByTestId('nature-rain').waitFor();
      await b.page.mouse.wheel(0, 900);
      await b.page.waitForTimeout(200);
      h.assert((await top(b.page.locator('#c-blend'))) < 200, 'blend slider scrolled away');
      h.assert((await b.page.getByRole('combobox', { name: 'Credits' }).count()) === 1, 'not one credits footer');
    } finally {
      await b.context.close();
    }
    const c = await open(h, { viewport: { width: 1280, height: 720 } });
    try {
      await c.page.getByRole('button', { name: 'Skip, just play' }).click();
      await c.page.getByTestId('calm-safety-accept').click();
      await c.page.getByTestId('player-toggle').waitFor();
      await nav(c.page, 'Crew').click();
      await c.page.getByTestId('crew-demo').click();
      await c.page.getByTestId('crew-why').waitFor();
      h.assert((await c.page.locator('.c-mini').count()) === 0, 'mini player shown on Crew');
      h.assert((await bottom(c.page.getByTestId('crew-why'))) <= 720, 'Why box cut at 1280x720');
    } finally {
      await c.context.close();
    }
  });
}
