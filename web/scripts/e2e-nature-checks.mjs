// Nature and own-sound checks (C8, C9). Each check runs in its own browser context.
// The engine state hook (window.__zonked, with ?e2e=1) reports the playing sound and the beat gain.
import { newSession, nav } from './e2e-helpers.mjs';


/** Small mono 16-bit PCM wav, built in the test. */
function wav(seconds, rate = 8000, hz = 440) {
  const n = Math.round(seconds * rate);
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(8000 * Math.sin((2 * Math.PI * hz * i) / rate)), 44 + i * 2);
  return buf;
}

/** Onboarding with Skip, accept the notice, then open the Nature screen from the Library. */
async function toNature(h) {
  const s = await newSession(h, { calm: true });
  await s.page.goto(`${h.origin}/?e2e=1`);
  await s.page.getByRole('button', { name: 'Skip, just play' }).click();
  await s.page.getByTestId('calm-safety-accept').click();
  await s.page.getByTestId('player-toggle').waitFor();
  await nav(s.page, 'Sounds').click();
  await s.page.getByTestId('open-nature').click();
  await s.page.getByTestId('nature-rain').waitFor();
  return s;
}

const natureState = (page) => page.evaluate(() => window.__zonked?.nature ?? null);

export async function runNatureChecks(h) {
  await h.check('C8 nature sound plays after the notice and the blend lowers the beat gain', async () => {
    const s = await toNature(h);
    try {
      await s.page.getByTestId('nature-rain').click();
      await s.page.waitForFunction(() => window.__zonked?.nature?.id === 'rain', null, { timeout: 20000 });
      await s.page.waitForTimeout(2500);
      const gentle = await natureState(s.page);
      h.assert(gentle.beatGain > 0.7 && gentle.beatGain < 0.95, `gentle beat gain ${gentle.beatGain}`);
      await s.page.locator('#c-blend').fill('1');
      await s.page.waitForTimeout(2500);
      const full = await natureState(s.page);
      h.assert(full.beatGain < gentle.beatGain - 0.2, `blend did not lower beat gain: ${gentle.beatGain} to ${full.beatGain}`);
      h.assert(full.beatGain >= 0.39, `beat ducked below the floor: ${full.beatGain}`);
      const stats = await s.page.evaluate(() => window.__zonked.getStats());
      h.assert(stats.peak <= 0.95 + 1e-6, `peak ${stats.peak}`);
      const level = await s.page.getByLabel('Nature volume').getAttribute('max');
      h.assert(Number(level) <= 0.85, `level max ${level}`);
      const saved = await s.page.evaluate(() => localStorage.getItem('zonked.nature.v1'));
      h.assert(saved !== null && saved.includes('"rain"'), `choice not remembered: ${saved}`);
      h.assert((await s.page.getByTestId('nature-message').innerText()) === '', 'error message shown');
      h.assert(s.errors.length === 0, `console errors: ${s.errors.join(' | ')}`);
    } finally {
      await s.context.close();
    }
  });

  await h.check('C9 own file: picked on the device, stored in IndexedDB, played, removed, no network', async () => {
    const s = await toNature(h);
    const outside = [];
    s.page.on('request', (r) => {
      if (!r.url().startsWith(h.origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) outside.push(r.url());
    });
    try {
      h.assert((await s.page.getByTestId('mine-stays').innerText()) === 'Stays on this device', 'stays text');
      const input = s.page.getByTestId('mine-file');
      await input.setInputFiles({ name: 'bad.wav', mimeType: 'audio/wav', buffer: Buffer.from('not audio at all') });
      await s.page.getByText(/not a sound this browser can read/).waitFor();
      await input.setInputFiles({ name: 'tone.wav', mimeType: 'audio/wav', buffer: wav(3) });
      await s.page.getByText('Added. It stays on this device.').waitFor();
      const rows = await s.page.evaluate(
        () =>
          new Promise((res) => {
            const r = indexedDB.open('zonked.mysounds.v1');
            r.onsuccess = () => {
              const all = r.result.transaction('sounds').objectStore('sounds').getAll();
              all.onsuccess = () => res(all.result.map((x) => ({ name: x.name, bytes: x.bytes.byteLength })));
            };
          }),
      );
      h.assert(rows.length === 1 && rows[0].name === 'tone.wav' && rows[0].bytes > 40000, `db rows ${JSON.stringify(rows)}`);
      await s.page.getByTestId('mine-play').click();
      await s.page.waitForFunction(() => window.__zonked?.nature?.id?.startsWith('own:'), null, { timeout: 20000 });
      const st = await natureState(s.page);
      h.assert(st.beatGain < 1, `no blend on own sound: ${st.beatGain}`);
      const stats = await s.page.evaluate(() => window.__zonked.getStats());
      h.assert(stats.peak <= 0.95 + 1e-6, `peak ${stats.peak}`);
      await s.page.getByTestId('mine-remove').click();
      await s.page.getByText('No sounds added yet.').waitFor();
      h.assert(outside.length === 0, `network outside the app: ${outside.join(', ')}`);
    } finally {
      await s.context.close();
    }
  });
}
