#!/usr/bin/env node
// Glitch check. Plays 3 sounds at the Wired and the Bluetooth setting in headless Chromium
// (30 s each, about 3 minutes in all), and reports hiccups, peak, RMS and the level above 6 kHz.
// Fails when a hiccup is counted, the peak passes 0.95, or Bluetooth mode lowers the energy above 6 kHz
// by less than 4 dB on the two noise sounds (rain, fountain).
// Uses the app's own e2e hook (?e2e=1). Nothing leaves this machine. Set GLITCH_SECONDS to shorten a run.
import { chromium } from '@playwright/test';
import { ensureBuilt, startServer } from './e2e-lib.mjs';
import { newSession, nav } from './e2e-helpers.mjs';

const SECONDS = Number(process.env.GLITCH_SECONDS ?? 30);
const MIN_DROP_DB = 4;
const PEAK_MAX = 0.95 + 1e-6;
const SOUNDS = [
  { id: 'beat', label: 'default session', nature: null, noise: false },
  { id: 'rain', label: 'rain', nature: 'rain', noise: true },
  { id: 'fountain', label: 'fountain', nature: 'fountain', noise: true },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function play(h, sound, device) {
  const s = await newSession(h, { calm: true });
  await s.context.addInitScript((d) => localStorage.setItem('zonked.device.v1', JSON.stringify({ v: 1, device: d })), device);
  await s.page.goto(`${h.origin}/?e2e=1`);
  await s.page.getByRole('button', { name: 'Skip, just play' }).click();
  await s.page.getByTestId('calm-safety-accept').click();
  await s.page.getByTestId('player-toggle').waitFor();
  if (sound.nature !== null) {
    await nav(s.page, 'Sounds').click();
    await s.page.getByTestId('open-nature').click();
    await s.page.getByTestId(`nature-${sound.nature}`).click();
    await s.page.waitForFunction((id) => window.__zonked?.nature?.id === id, sound.nature, { timeout: 30000 });
  }
  // Skip the 2 s fade-in and the nature fade-in before measuring.
  await sleep(4000);
  const powers = [];
  let last = null;
  for (let t = 0; t < SECONDS; t++) {
    last = await s.page.evaluate(() => window.__zonked.getStats());
    if (Number.isFinite(last.hiDb)) powers.push(10 ** (last.hiDb / 10));
    await sleep(1000);
  }
  await s.context.close().catch(() => {});
  const mean = powers.reduce((a, b) => a + b, 0) / Math.max(1, powers.length);
  return { hiDb: 10 * Math.log10(Math.max(mean, 1e-20)), peak: last.peak, rms: last.rms, hiccups: last.hiccups ?? 0, kinds: last.hiccupKinds ?? {} };
}

async function main() {
  ensureBuilt();
  const server = await startServer();
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const h = { browser, origin: server.origin };
  const failures = [];
  console.log(`glitch-check: ${SOUNDS.length} sounds x 2 settings x ${SECONDS} s`);
  try {
    for (const sound of SOUNDS) {
      const r = {};
      for (const device of ['wired', 'bluetooth']) {
        r[device] = await play(h, sound, device);
        const x = r[device];
        console.log(`${sound.label.padEnd(16)} ${device.padEnd(9)} hiccups ${x.hiccups} ${JSON.stringify(x.kinds)}  peak ${x.peak.toFixed(3)}  rms ${x.rms.toFixed(4)}  above6k ${x.hiDb.toFixed(1)} dB`);
        if (x.hiccups > 0) failures.push(`${sound.label} ${device}: ${x.hiccups} hiccups`);
        if (!(x.peak <= PEAK_MAX)) failures.push(`${sound.label} ${device}: peak ${x.peak}`);
      }
      const drop = r.wired.hiDb - r.bluetooth.hiDb;
      console.log(`${sound.label.padEnd(16)} Bluetooth mode change above 6 kHz: ${(-drop).toFixed(1)} dB`);
      if (sound.noise && drop < MIN_DROP_DB) failures.push(`${sound.label}: only ${drop.toFixed(1)} dB lower above 6 kHz, need ${MIN_DROP_DB}`);
    }
  } finally {
    await browser.close().catch(() => {});
    server.stop();
  }
  if (failures.length > 0) {
    console.log(`FAIL\n${failures.join('\n')}`);
    process.exit(1);
  }
  console.log('PASS');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
