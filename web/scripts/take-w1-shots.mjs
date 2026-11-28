// Takes the after-w1-* screenshots at 1280x800 (d) and 375x812 (m), dark and light:
// Today, Player, Crew idle, Crew with the demo running, Crew with a later why text.
// Usage: node web/scripts/take-w1-shots.mjs [out dir]  (needs web/dist)
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { startServer } from './e2e-lib.mjs';

const out = resolve(process.argv[2] ?? 'docs/ux-shots');
mkdirSync(out, { recursive: true });
const SIZES = { d: { width: 1280, height: 800 }, m: { width: 375, height: 812 } };
const LOOKS = { dark: { theme: 'dark', highContrast: false }, light: { theme: 'light', highContrast: false } };
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });

async function run(browser, origin, size, look) {
  const context = await browser.newContext({ viewport: SIZES[size], reducedMotion: 'reduce' });
  await context.addInitScript((l) => window.localStorage.setItem('zonked.look.v1', JSON.stringify(l)), LOOKS[look]);
  const page = await context.newPage();
  const shot = (name) => page.screenshot({ path: join(out, `after-w1-${name}-${look}-${size}.png`) });
  try {
    await page.goto(`${origin}/`);
    await page.getByRole('button', { name: 'Skip, just play' }).click();
    await page.getByTestId('calm-safety-accept').click();
    await page.getByTestId('player-toggle').waitFor();
    await sleep(600);
    await shot('player');
    await nav(page, 'Today').click();
    await page.getByTestId('greeting').waitFor();
    await sleep(300);
    await shot('today');
    await nav(page, 'Crew').click();
    await page.getByTestId('crew-demo').waitFor();
    await shot('crew-idle');
    await page.getByTestId('crew-demo').click();
    await page.getByTestId('crew-beat').waitFor();
    await sleep(800);
    await shot('crew-demo');
    await sleep(17_000);
    await shot('crew-why');
  } finally {
    await context.close();
  }
}

const server = await startServer();
const browser = await chromium.launch();
try {
  for (const size of Object.keys(SIZES)) for (const look of Object.keys(LOOKS)) await run(browser, server.origin, size, look);
} finally {
  await browser.close();
  server.stop();
}
console.log(`wrote screenshots to ${out}`);
