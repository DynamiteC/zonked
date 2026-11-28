// Crew demo checks (C10, C11). One 60 second simulated session is watched once and both checks read it.
// C10: the Simulated session badge shows, the beat changes at least 3 times, nothing leaves the origin.
// C11: the why text updates with the steps and stays plain text.
import { setTimeout as sleep } from 'node:timers/promises';
import { newSession, nav } from './e2e-helpers.mjs';


/** Watches the demo from the tap to the end. Returns what the two checks need. */
async function watchDemo(h) {
  const s = await newSession(h, { calm: true });
  const outside = [];
  s.page.on('request', (r) => {
    const u = r.url();
    if (/^(https?|wss?|ftp):/.test(u) && new URL(u).origin !== new URL(h.origin).origin) outside.push(u);
  });
  try {
    await s.page.goto(`${h.origin}/`);
    await s.page.getByRole('button', { name: 'Skip, just play' }).click();
    await s.page.getByTestId('calm-safety-accept').click();
    await s.page.getByTestId('player-toggle').waitFor();
    await nav(s.page, 'Crew').click();
    await s.page.getByTestId('crew-demo').click();
    await s.page.getByTestId('crew-beat').waitFor();
    const beats = [];
    const whys = [];
    let badge = false;
    let status = '';
    const end = Date.now() + 52_000;
    while (Date.now() < end) {
      const beat = await s.page.getByTestId('crew-beat').textContent();
      const why = await s.page.getByTestId('crew-why').textContent();
      badge = badge || (await s.page.getByTestId('demo-badge').count()) > 0;
      status = (await s.page.getByTestId('crew-status').textContent()) ?? status;
      if (beats.at(-1) !== beat) beats.push(beat);
      if (whys.at(-1) !== why) whys.push(why);
      await sleep(400);
    }
    const html = await s.page.getByTestId('crew-why').evaluate((el) => el.innerHTML);
    return { beats, whys, badge, status, outside, html, errors: s.errors };
  } finally {
    await s.context.close();
  }
}

export async function runCrewChecks(h) {
  let run = null;
  const watched = () => (run ??= watchDemo(h));
  await h.check('C10 judge demo: Simulated session badge, beat changes at least 3 times, no request leaves the origin', async () => {
    const r = await watched();
    h.assert(r.badge && r.status === 'Simulated session', `badge=${r.badge} status=${r.status}`);
    h.assert(r.beats.length >= 4, `beat changed ${r.beats.length - 1} times: ${r.beats.join(' > ')}`);
    h.assert(r.outside.length === 0, `requests left the origin: ${r.outside.join(', ')}`);
    h.assert(r.errors.length === 0, `console errors: ${r.errors.join(' | ')}`);
    return `beats ${r.beats.join(' > ')}`;
  });
  await h.check('C11 why text updates with each step and is plain text', async () => {
    const r = await watched();
    h.assert(r.whys.length >= 4, `why changed ${r.whys.length - 1} times`);
    h.assert(r.whys.every((t) => /^Simulated/.test(t) && t.length <= 160), `why texts: ${r.whys.join(' | ')}`);
    h.assert(!/[<>]/.test(r.html), `why markup: ${r.html}`);
    h.assert(!r.whys.some((t) => /[\\/]\w+\.\w+|commit [0-9a-f]{7}/.test(t)), 'why shows a file name or commit');
  });
}
