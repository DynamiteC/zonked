// Takes the after-w2-* screenshots at 1280x800 (d) and 375x812 (m): Today, reset running, reset end card,
// Settings theme, high contrast Player, Crew demo, and the mini player at the end of a long list.
// Usage: node web/scripts/take-w2-shots.mjs [out dir]  (needs web/dist)
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { startServer } from './e2e-lib.mjs';

const out = resolve(process.argv[2] ?? 'docs/ux-shots');
mkdirSync(out, { recursive: true });
const SIZES = { d: { width: 1280, height: 800 }, m: { width: 375, height: 812 } };
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });

async function run(browser, origin, size) {
  const context = await browser.newContext({ viewport: SIZES[size] });
  const page = await context.newPage();
  await page.clock.install();
  const shot = (name) => page.screenshot({ path: join(out, `after-w2-${name}-${size}.png`) });
  const wait = async (ms) => {
    await page.clock.runFor(ms);
    await sleep(150);
  };
  try {
    await page.goto(`${origin}/`);
    await page.getByRole('button', { name: 'Skip, just play' }).click();
    await page.getByTestId('calm-safety-accept').click();
    await page.getByTestId('player-toggle').waitFor();
    await wait(1500);
    await nav(page, 'Today').click();
    await page.getByTestId('greeting').waitFor();
    await wait(500);
    await shot('today');
    await nav(page, 'Sounds').click();
    await wait(500);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await wait(300);
    await shot('mini-end-of-list');
    await nav(page, 'Today').click();
    await page.getByTestId('today-reset').click();
    await page.getByTestId('reset-begin').click();
    await page.getByTestId('reset-stop').waitFor();
    await wait(2500);
    await shot('reset-running');
    await wait(90_000);
    await page.getByTestId('reset-end').waitFor();
    await wait(300);
    await shot('reset-end');
    await page.getByTestId('reset-back').click();
    await nav(page, 'You').click();
    await wait(400);
    await shot('settings-theme');
    await page.getByTestId('theme-contrast').check();
    await wait(300);
    await shot('settings-contrast');
    await nav(page, 'Today').click();
    await page.getByTestId('today-play').click();
    await page.getByTestId('player-toggle').waitFor();
    await wait(2500);
    await shot('player-contrast');
    await nav(page, 'Crew').click();
    await page.getByTestId('crew-demo').click();
    await page.getByTestId('crew-beat').waitFor();
    await wait(1000);
    await shot('crew-demo');
  } finally {
    await context.close();
  }
}

const server = await startServer();
const browser = await chromium.launch();
try {
  for (const size of Object.keys(SIZES)) await run(browser, server.origin, size);
} finally {
  await browser.close();
  server.stop();
}
console.log(`wrote screenshots to ${out}`);
