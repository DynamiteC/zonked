// Release checks (G1, X1, X2): the help guide, the mix code and the calm card, in a real browser.
// Each check runs in its own browser context. The engine state hook (window.__zonked, with ?e2e=1) is used for state.
import { newSession, nav, dismissGuide, skipToPlayer, waitSound } from './e2e-helpers.mjs';

/** Skip onboarding with a mocked clock, accept the notice, land on the player. */
async function playing(h, extra = {}) {
  const s = await newSession(h, { calm: true, ...extra });
  await s.page.clock.install();
  await s.page.goto(`${h.origin}/?e2e=1`);
  await s.page.getByRole('button', { name: 'Skip, just play' }).click();
  await s.page.getByTestId('calm-safety-accept').click();
  await s.page.getByTestId('player-toggle').waitFor();
  return s;
}

/** Plays 90 s, stops, and waits for the end card. */
async function toEndCard(s) {
  await s.page.clock.runFor(90_000);
  await s.page.getByTestId('player-toggle').click();
  await s.page.clock.runFor(2000);
  await s.page.getByTestId('end-card').waitFor();
}

export async function runReleaseChecks(h) {
  await h.check('G1 the help guide waits until the end card is closed, closes with Skip and stays closed after a reload', async () => {
    const s = await playing(h);
    try {
      h.assert((await s.page.getByTestId('guide').count()) === 0, 'guide open before any session');
      await toEndCard(s);
      h.assert((await s.page.getByTestId('guide').count()) === 0, 'guide opened over the end card');
      await s.page.clock.runFor(1500);
      await s.page.getByTestId('end-close').click();
      await s.page.getByTestId('guide-skip').waitFor();
      await dismissGuide(s.page);
      await s.page.getByTestId('guide').waitFor({ state: 'detached' });
      const stored = await s.page.evaluate(() => localStorage.getItem('zonked.guide.v1'));
      h.assert(stored !== null, 'guide choice not stored');
      await s.page.clock.resume();
      await s.page.reload();
      await nav(s.page, 'Today').waitFor();
      await s.page.waitForTimeout(1500);
      h.assert((await s.page.getByTestId('guide').count()) === 0, 'guide came back after a reload');
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('X1 mix code: a good code applies, bad and over-limit codes are refused, the level never passes 0.85', async () => {
    const s = await newSession(h, { calm: true });
    try {
      await s.page.goto(`${h.origin}/?e2e=1`);
      await s.page.getByRole('button', { name: 'Skip, just play' }).click();
      await s.page.getByTestId('calm-safety-accept').click();
      await s.page.getByTestId('player-toggle').waitFor();
      await s.page.getByTestId('player-options').click();
      const note = () => s.page.getByTestId('mix-note').innerText();
      const apply = async (code) => {
        await s.page.getByTestId('mix-input').fill(code);
        await s.page.getByTestId('mix-apply').click();
        await s.page.waitForTimeout(300);
      };
      await apply('ZK1-nope-60-30');
      h.assert((await note()) !== '' && (await note()) !== 'Mix applied.', `unknown sound accepted: ${await note()}`);
      await apply('ZK2-rain-60-30');
      h.assert((await note()) !== 'Mix applied.', 'unknown version accepted');
      await apply('ZK1-rain-101-30');
      h.assert((await note()) !== 'Mix applied.', 'value above 100 accepted');
      await apply('<img src=x onerror=alert(1)>');
      h.assert((await note()) !== 'Mix applied.', 'markup accepted');
      h.assert((await s.page.evaluate(() => window.__zonked?.nature?.id ?? null)) === null, 'a refused code started a sound');
      await apply('ZK1-rain-60-30');
      h.assert((await note()) === 'Mix applied.', `good code refused: ${await note()}`);
      await s.page.waitForFunction(() => window.__zonked?.nature?.id === 'rain', null, { timeout: 20000 });
      await apply('ZK1-rain-100-100');
      await s.page.waitForTimeout(1500);
      const stats = await s.page.evaluate(() => window.__zonked.getStats());
      h.assert(stats.peak <= 0.95 + 1e-6, `peak ${stats.peak}`);
      const saved = await s.page.evaluate(() => localStorage.getItem('zonked.nature.v1') ?? '');
      const level = Number(/"level":\s*([0-9.]+)/.exec(saved)?.[1] ?? NaN);
      h.assert(Number.isFinite(level) && level <= 0.85 + 1e-9, `level ${level} in ${saved}`);
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('X2 calm card: made on the device, downloads a PNG, no request leaves the origin', async () => {
    const s = await playing(h, { acceptDownloads: true });
    const outside = [];
    s.page.on('request', (r) => {
      const u = r.url();
      if (!u.startsWith(h.origin) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u);
    });
    try {
      await toEndCard(s);
      await s.page.clock.runFor(1000);
      await s.page.getByTestId('calm-card-make').click();
      await s.page.clock.runFor(1000);
      await s.page.getByTestId('calm-card-download').waitFor();
      const dl = s.page.waitForEvent('download');
      await s.page.getByTestId('calm-card-download').click();
      const file = await (await dl).createReadStream();
      const chunks = [];
      for await (const c of file) chunks.push(c);
      const head = Buffer.concat(chunks).subarray(0, 8);
      h.assert(head.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), `not a PNG: ${head.toString('hex')}`);
      h.assert(outside.length === 0, `requests left the origin: ${outside.join(', ')}`);
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('M1 media keys: the lock screen handlers exist and pause and play really stop and start the sound', async () => {
    const s = await newSession(h);
    try {
      await skipToPlayer(s.page, h.origin);
      await waitSound(s.page);
      const names = await s.page.evaluate(() => Object.keys(window.__msh).sort());
      h.assert(['pause', 'play', 'stop'].every((n) => names.includes(n)), `handlers: ${names.join(',')}`);
      await s.page.evaluate(() => window.__msh.pause());
      await s.page.waitForFunction(() => window.__zonked.status.state !== 'running', null, { timeout: 10000 });
      await s.page.evaluate(() => window.__msh.play());
      await waitSound(s.page);
      const stats = await s.page.evaluate(() => window.__zonked.getStats());
      h.assert(stats.peak <= 0.95 + 1e-6, `peak ${stats.peak}`);
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });
}
