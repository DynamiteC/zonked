// Takes the after-r1-* screenshots for docs/UX-BEFORE-AFTER.md at 1280x800 (d) and 375x812 (m).
// Looks: dark (default), light, high contrast. Usage: node web/scripts/take-r1-shots.mjs [out dir]  (needs web/dist)
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { startServer } from './e2e-lib.mjs';

const out = resolve(process.argv[2] ?? 'docs/ux-shots');
mkdirSync(out, { recursive: true });
const SIZES = { d: { width: 1280, height: 800 }, m: { width: 375, height: 812 } };
const LOOKS = { dark: { theme: 'dark', highContrast: false }, light: { theme: 'light', highContrast: false }, hc: { theme: 'dark', highContrast: true } };
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });

async function setup(browser, origin, size, look) {
  const context = await browser.newContext({ viewport: SIZES[size], reducedMotion: 'reduce' });
  await context.addInitScript((l) => window.localStorage.setItem('zonked.look.v1', JSON.stringify(l)), LOOKS[look]);
  const page = await context.newPage();
  await page.goto(`${origin}/`);
  return { context, page };
}

async function onboard(page, shot) {
  await page.getByText('1 of 3').first().waitFor();
  await shot('onboarding');
  for (let i = 0; i < 3; i += 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByTestId('calm-safety-accept').waitFor();
  await shot('safety');
  await page.getByTestId('calm-safety-accept').click();
  await page.getByRole('heading', { name: 'Pick a starter sound' }).waitFor();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByTestId('player-toggle').waitFor();
}

async function playFeeling(page, label) {
  await nav(page, 'Sounds').click();
  await page.getByText(label, { exact: true }).first().click();
  await page.locator('.c-row-play').first().click();
  await page.getByTestId('player-toggle').waitFor();
}

async function full(page, shot) {
  await shot('player-calm');
  await nav(page, 'Today').click();
  await page.getByTestId('greeting').waitFor();
  await shot('today');
  await playFeeling(page, 'Sleep');
  await shot('player-sleep');
  await playFeeling(page, 'Focus');
  await shot('player-focus');
  await page.getByTestId('player-nature').click();
  await shot('player-nature');
  await nav(page, 'Sounds').click();
  await page.getByTestId('open-nature').waitFor();
  await shot('sounds');
  await page.getByTestId('open-nature').click();
  await page.getByTestId('nature-rain').waitFor();
  await shot('nature');
  await nav(page, 'Crew').click();
  await shot('crew');
  await nav(page, 'You').click();
  await shot('settings');
  await page.getByTestId('studio-switch').click();
  await page.getByTestId('play-button').waitFor();
  await shot('studio');
}

async function brief(page, shot) {
  await shot('player-calm');
  await nav(page, 'Today').click();
  await page.getByTestId('greeting').waitFor();
  await shot('today');
  await nav(page, 'You').click();
  await shot('settings');
}

const server = await startServer();
const browser = await chromium.launch();
try {
  for (const size of Object.keys(SIZES)) {
    for (const look of Object.keys(LOOKS)) {
      const { context, page } = await setup(browser, server.origin, size, look);
      const shot = async (name) => {
        await page.waitForTimeout(450);
        await page.screenshot({ path: join(out, `after-r1-${name}-${look}-${size}.png`) });
      };
      await onboard(page, look === 'dark' ? shot : async () => undefined);
      await (look === 'dark' ? full : brief)(page, shot);
      await context.close();
    }
  }
  console.log(`shots written to ${out}`);
} finally {
  await browser.close();
  server.stop();
}
