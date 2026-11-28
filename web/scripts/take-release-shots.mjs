#!/usr/bin/env node
// Release review shots: /tmp/zk-rel/docs/ux-shots/release-<screen>-<d|m>-<light|dark>.png
// d = 1280x800, m = 390x844. Serves the build in /tmp/zk-rel/web/dist (run npm run build there first).
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const REL = '/tmp/zk-rel';
const { chromium } = await import(`file://${REL}/web/node_modules/@playwright/test/index.mjs`);
const { assertBridgePortFree, startServer } = await import(`file://${REL}/web/scripts/e2e-lib.mjs`);
const { nav } = await import(`file://${REL}/web/scripts/e2e-helpers.mjs`);

const OUT = join(REL, 'docs', 'ux-shots');
const SIZES = { d: { width: 1280, height: 800 }, m: { width: 390, height: 844 } };

async function walk(page, tag) {
  const snap = async (name) => {
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(OUT, `release-${name}-${tag}.png`) });
  };
  await page.getByText('1 of 3').first().waitFor();
  await snap('onboarding');
  await page.getByRole('button', { name: 'Skip, just play' }).click();
  await page.getByTestId('calm-safety-accept').waitFor();
  await snap('safety');
  await page.getByTestId('calm-safety-accept').click();
  await page.getByTestId('player-toggle').waitFor();
  await page.waitForFunction(() => window.__zonked?.status.state === 'running', null, { timeout: 20000 });
  await page.waitForTimeout(2500);
  await snap('player');
  await page.getByTestId('player-options').click();
  await page.getByTestId('options-sheet').waitFor();
  await snap('options');
  await page.getByTestId('options-advanced').click();
  await page.getByTestId('advanced-panels').waitFor();
  await snap('advanced');
  await page.keyboard.press('Escape');
  await page.getByTestId('options-sheet').waitFor({ state: 'detached' });
  for (const name of ['Today', 'Sounds', 'Crew', 'You']) {
    await nav(page, name).click();
    await snap(name === 'Crew' ? 'coding' : name === 'You' ? 'settings' : name.toLowerCase());
  }
  await page.getByTestId('privacy-link').click();
  await snap('privacy');
  await page.getByTestId('settings-guide').click();
  await page.getByTestId('guide').waitFor();
  await snap('guide');
  await page.getByTestId('guide-skip').click();
  await nav(page, 'Sounds').click();
  await page.getByTestId('open-nature').click();
  await page.getByTestId('nature-rain').waitFor();
  await snap('nature');
}

mkdirSync(OUT, { recursive: true });
await assertBridgePortFree();
const { origin, stop } = await startServer();
const browser = await chromium.launch();
try {
  for (const theme of ['light', 'dark']) {
    for (const [k, viewport] of Object.entries(SIZES)) {
      const context = await browser.newContext({ viewport, colorScheme: theme });
      await context.addInitScript((t) => localStorage.setItem('zonked.theme.v2', JSON.stringify({ choice: t, dim: false, announce: true })), theme);
      const page = await context.newPage();
      await page.goto(`${origin}/?e2e=1`);
      try {
        await walk(page, `${k}-${theme}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  await stop();
}
console.log('shots written to', OUT);
