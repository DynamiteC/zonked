// Reset and theme checks (C12, C13). Each check runs in its own browser context.
// C12: the guided 90 second pause completes on a mocked clock and shows its end card.
// C13: the theme choice persists across a reload and high contrast applies.
import { newSession } from './e2e-helpers.mjs';

const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });

/** Skip onboarding, accept the notice, and stop the default session so the page starts quiet. */
async function ready(h) {
  const s = await newSession(h, { calm: true });
  await s.page.goto(`${h.origin}/`);
  await s.page.getByRole('button', { name: 'Skip, just play' }).click();
  await s.page.getByTestId('calm-safety-accept').click();
  await s.page.getByTestId('player-toggle').waitFor();
  return s;
}

export async function runResetChecks(h) {
  await h.check('C12 the 90 second pause runs, keeps Stop visible, then shows its own end card', async () => {
    const s = await newSession(h, { calm: true });
    try {
      await s.page.clock.install();
      await s.page.goto(`${h.origin}/`);
      await s.page.getByRole('button', { name: 'Skip, just play' }).click();
      await s.page.getByTestId('calm-safety-accept').click();
      await s.page.getByTestId('player-toggle').click();
      await nav(s.page, 'Today').click();
      await s.page.getByTestId('today-reset').click();
      await s.page.getByTestId('reset-begin').click();
      await s.page.getByTestId('reset-stop').waitFor();
      await s.page.clock.runFor(60_000);
      h.assert((await s.page.getByTestId('reset-stop').count()) === 1, 'Stop not visible mid-pause');
      h.assert((await s.page.getByTestId('reset-end').count()) === 0, 'end card too early');
      await s.page.clock.runFor(31_000);
      await s.page.getByTestId('reset-end').waitFor();
      const text = await s.page.getByTestId('reset-end').innerText();
      h.assert(/Done for now\./.test(text) && /90 seconds/.test(text), `end text: ${text}`);
      h.assert(!/cure|treat|heal|anxiety|medical/i.test(text), 'health claim on end card');
      h.assert((await s.page.getByTestId('end-card').count()) === 0, 'the generic end card also showed');
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('C13 theme choice persists across a reload and high contrast applies', async () => {
    const s = await ready(h);
    try {
      await nav(s.page, 'You').click();
      await s.page.getByTestId('theme-contrast').check();
      const app = s.page.locator('.c-app');
      h.assert((await app.getAttribute('data-contrast')) === 'high', 'high contrast not applied');
      const bw = await app.evaluate((el) => getComputedStyle(el).getPropertyValue('--c-bw').trim());
      h.assert(bw === '2px', `border width ${bw}`);
      const saved = await s.page.evaluate(() => localStorage.getItem('zonked.theme.v2'));
      h.assert(/"choice":"contrast"/.test(saved ?? ''), `saved: ${saved}`);
      await s.page.reload();
      await s.page.locator('.c-app[data-contrast="high"]').waitFor();
      await nav(s.page, 'You').click();
      h.assert(await s.page.getByTestId('theme-contrast').isChecked(), 'choice not shown after reload');
      await s.page.getByTestId('theme-light').check();
      h.assert((await s.page.locator('.c-app').getAttribute('data-theme')) === 'light', 'light not applied');
    } finally {
      await s.context.close();
    }
  });
}
