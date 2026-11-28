// Growth checks (C14, C15, C16). Each check runs in its own browser context.
// C14: the "How was that?" answer is stored on this device and survives a reload.
// C15: a focus sprint switches to a quieter break on a mocked clock, then ends with the end card.
// C16: the 5 minute breathing session plays soft noise and shows the breath ring.
import { newSession } from './e2e-helpers.mjs';

const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });

/** Skip onboarding with a mocked clock and land on the player with sound playing. */
async function playing(h) {
  const s = await newSession(h, { calm: true });
  await s.page.clock.install();
  await s.page.goto(`${h.origin}/?e2e=1`);
  await s.page.getByRole('button', { name: 'Skip, just play' }).click();
  await s.page.getByTestId('calm-safety-accept').click();
  await s.page.getByTestId('player-toggle').waitFor();
  return s;
}

export async function runGrowthChecks(h) {
  await h.check('C14 the how-was-that answer is stored on this device and survives a reload', async () => {
    const s = await playing(h);
    try {
      await s.page.clock.runFor(90_000);
      await s.page.getByTestId('player-toggle').click();
      await s.page.clock.runFor(2000);
      await s.page.getByTestId('end-card').waitFor();
      const text = await s.page.getByTestId('end-card').innerText();
      h.assert(/How was that\?/.test(text) && /Calmer/.test(text) && /Same/.test(text) && /Not for me/.test(text), `row text: ${text}`);
      await s.page.getByTestId('feel-calmer').click();
      await s.page.getByTestId('feel-saved').waitFor();
      const saved = await s.page.evaluate(() => localStorage.getItem('zonked.feel.v1'));
      h.assert(/"a":"calmer"/.test(saved ?? ''), `saved: ${saved}`);
      await s.page.reload();
      const again = await s.page.evaluate(() => localStorage.getItem('zonked.feel.v1'));
      h.assert(again === saved, 'answer lost after reload');
      h.assert(!/score|streak/i.test(text), 'score wording on the end card');
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('C15 a focus sprint switches to a quieter break and then ends', async () => {
    const s = await playing(h);
    try {
      await s.page.getByRole('button', { name: 'Focus sprint' }).click();
      const focusId = await s.page.evaluate(() => window.__zonked.templateId);
      const t0 = await s.page.evaluate(() => window.__zonked.timer);
      h.assert(t0.kind === 'pomodoro' && t0.phase === 'focus', `timer: ${JSON.stringify(t0)}`);
      await s.page.clock.runFor(24 * 60_000);
      h.assert((await s.page.evaluate(() => window.__zonked.templateId)) === focusId, 'switched too early');
      await s.page.clock.runFor(62_000);
      await s.page.waitForFunction(() => window.__zonked.timer?.phase === 'break');
      await s.page.clock.runFor(2000);
      const breakId = await s.page.evaluate(() => window.__zonked.templateId);
      h.assert(breakId !== focusId && /^starter-(rain|deep)$/.test(breakId ?? ''), `break sound: ${breakId}`);
      const label = await s.page.getByTestId('time-left').innerText();
      h.assert(/^Break /.test(label), `label: ${label}`);
      await s.page.clock.runFor(5 * 60_000);
      await s.page.getByTestId('end-card').waitFor();
      const text = await s.page.getByTestId('end-card').innerText();
      h.assert(/Focus sprint played for/.test(text), `end text: ${text}`);
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('C16 the 5 minute breathing session plays soft noise with the breath ring', async () => {
    const s = await playing(h);
    try {
      await s.page.getByTestId('player-toggle').click();
      await nav(s.page, 'Sounds').click();
      await s.page.getByRole('tab', { name: 'Sound', exact: true }).click();
      await s.page.getByTestId('sounds-breathe').click();
      h.assert((await s.page.getByTestId('reset-screen').getAttribute('data-kind')) === 'breathe', 'not the breathing screen');
      await s.page.getByTestId('reset-begin').click();
      await s.page.getByTestId('reset-stop').waitFor();
      await s.page.clock.runFor(3000);
      h.assert((await s.page.evaluate(() => window.__zonked.templateId)) === 'calm-breathe-5', 'wrong sound');
      h.assert((await s.page.getByTestId('breath-ring').count()) === 1, 'no breath ring');
      const left = await s.page.getByTestId('reset-left').textContent();
      h.assert(/^4:5\d left$/.test(left ?? ''), `left: ${left}`);
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });
}
