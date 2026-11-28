// Takes the after-* screenshots for docs/UX-BEFORE-AFTER.md at 1280x800 (d) and 375x812 (m).
// Usage: node web/scripts/take-ux-shots.mjs <out dir>   (needs a built web/dist)
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { startServer } from './e2e-lib.mjs';

const out = resolve(process.argv[2] ?? 'docs/ux-shots');
mkdirSync(out, { recursive: true });
const SIZES = { d: { width: 1280, height: 800 }, m: { width: 375, height: 812 } };
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });

async function run(browser, origin, key) {
  const context = await browser.newContext({ viewport: SIZES[key], reducedMotion: 'reduce' });
  const page = await context.newPage();
  const shot = async (name) => {
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(out, `after-${name}-${key}.png`) });
  };
  await page.goto(`${origin}/`);
  await page.getByText('1 of 3').first().waitFor();
  await shot('calm-first');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await shot('calm-step2');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await shot('calm-step3');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByTestId('calm-safety-accept').waitFor();
  await shot('calm-safety');
  await page.getByTestId('calm-safety-accept').click();
  await page.getByRole('heading', { name: 'Pick a starter sound' }).waitFor();
  await shot('calm-starter');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByTestId('player-toggle').waitFor();
  await shot('calm-player');
  await nav(page, 'Today').click();
  await page.getByTestId('greeting').waitFor();
  await shot('calm-today');
  await nav(page, 'Journeys').click();
  await shot('calm-journeys');
  await nav(page, 'Library').click();
  await page.getByTestId('open-nature').waitFor();
  await shot('calm-library');
  await page.getByTestId('open-nature').click();
  await page.getByTestId('nature-rain').waitFor();
  await shot('calm-nature');
  await page.getByTestId('my-sounds').scrollIntoViewIfNeeded();
  await shot('calm-mysounds');
  await nav(page, 'Crew').click();
  await shot('calm-crew');
  await nav(page, 'Settings').click();
  await shot('calm-settings');
  await page.getByTestId('studio-switch').click();
  await page.getByTestId('play-button').waitFor();
  await shot('calm-studio');
  await context.close();
}

const server = await startServer();
const browser = await chromium.launch();
try {
  for (const key of Object.keys(SIZES)) await run(browser, server.origin, key);
  console.log(`shots written to ${out}`);
} finally {
  await browser.close();
  server.stop();
}
