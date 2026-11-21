// Sound upgrade checks (violet, new layers, breathing, no audio downloads).
// runSoundChecks(page, helpers): `helpers` is the e2e harness object ({ check, assert, info, ... }).
import { settle, MAX_PEAK, measure, sleep, startPlaying } from './e2e-helpers.mjs';

const ZERO = {
  lofiLevel: 0, crackle: 0, instLevel: 0, padLevel: 0, chimeLevel: 0, percLevel: 0,
  breathDepth: 0, stereoWidth: 0, panDepth: 0, pianoPedal: 0, tapeWow: 0, lofiProgression: 0,
};

const MAX_ALL = {
  lofiLevel: 1, crackle: 1, lofiProgression: 2, tapeWow: 1, instLevel: 1, instKind: 3, instBpm: 180, pianoPedal: 1,
  padLevel: 1, chimeLevel: 1, chimeRatePerMin: 30, percLevel: 1, percBpm: 180, breathDepth: 1, stereoWidth: 1, panDepth: 1,
};

export async function runSoundChecks(page, helpers) {
  const { check, assert, info } = helpers;
  const downloads = [];
  const onResponse = (r) => {
    const ct = r.headers()['content-type'] ?? '';
    if (/^(audio|video)\//i.test(ct) || /ogg|mpeg|wav/i.test(ct) || /\.(mp3|wav|ogg|flac|m4a)(\?|$)/i.test(r.url())) downloads.push(r.url());
  };
  page.on('response', onResponse);

  await check('A1 violet is selectable and audible, peak <= 0.95', async () => {
    const card = page.getByTestId('sound-card-violet');
    await card.waitFor({ timeout: 15000 });
    await card.getByTestId('sound-card-play').click();
    await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]')?.dataset.state === 'running', null, { timeout: 20000 });
    await settle(page);
    const m = await measure(page, 3000);
    assert(m.rms > 0.01, `violet rms ${m.rms}`);
    assert(m.peak <= MAX_PEAK, `violet peak ${m.peak}`);
    return `rms=${m.rms.toFixed(3)} peak=${m.peak.toFixed(3)}`;
  });

  await check('A2 new layers are audible and every new sound at max stays <= 0.95', async () => {
    await startPlaying(page);
    await page.evaluate((z) => window.__zonked.setLayers(z), ZERO);
    await settle(page);
    const base = await measure(page, 2500);
    const cases = {
      'lofi chords': { lofiLevel: 1, lofiProgression: 2, tapeWow: 0.6 },
      piano: { instLevel: 1, instKind: 3, instBpm: 120, pianoPedal: 0.7 },
      chimes: { chimeLevel: 1, chimeRatePerMin: 30 },
    };
    const out = [];
    for (const [name, p] of Object.entries(cases)) {
      await page.evaluate((z) => window.__zonked.setLayers(z), { ...ZERO, ...p });
      await sleep(600);
      const m = await measure(page, 5000);
      assert(m.peak <= MAX_PEAK, `${name}: peak ${m.peak}`);
      const added = Math.sqrt(Math.max(0, m.rms * m.rms - (0.7 * base.rms) ** 2));
      assert(added > 0.002, `${name}: adds only ${added.toFixed(5)} rms`);
      out.push(`${name}=+${added.toFixed(3)}`);
    }
    await page.evaluate((z) => window.__zonked.setLayers(z), MAX_ALL);
    await sleep(600);
    const all = await measure(page, 6000);
    assert(all.peak <= MAX_PEAK, `all new sounds at max: peak ${all.peak}`);
    await page.evaluate((z) => window.__zonked.setLayers(z), ZERO);
    return `${out.join(' ')} maxPeak=${all.peak.toFixed(3)}`;
  });

  await check('A3 level moves over 20 s with breathing on', async () => {
    const mix = { lofiLevel: 0.8, lofiProgression: 2, padLevel: 0.5, breathDepth: 0.8, breathRateHz: 0.2 };
    const swing = async (p) => {
      await page.evaluate((z) => window.__zonked.setLayers(z), { ...ZERO, ...p });
      await sleep(1500);
      const r = [];
      for (let i = 0; i < 10; i++) r.push((await measure(page, 2000)).rms);
      return { hi: Math.max(...r), lo: Math.min(...r) };
    };
    const flat = await swing({ ...mix, breathDepth: 0 });
    const live = await swing(mix);
    const db = (s) => 20 * Math.log10(s.hi / Math.max(s.lo, 1e-9));
    assert(db(live) > db(flat) + 1, `breathing swing ${db(live).toFixed(2)} dB vs flat ${db(flat).toFixed(2)} dB`);
    info.push(`breathing swing ${db(live).toFixed(2)} dB, flat ${db(flat).toFixed(2)} dB over 20 s`);
    await page.evaluate((z) => window.__zonked.setLayers(z), ZERO);
    return `${db(live).toFixed(2)} dB vs ${db(flat).toFixed(2)} dB`;
  });

  await check('A4 no audio file request', async () => {
    assert(downloads.length === 0, `audio downloads: ${downloads.join(', ')}`);
    page.off('response', onResponse);
    return 'none';
  });
}
