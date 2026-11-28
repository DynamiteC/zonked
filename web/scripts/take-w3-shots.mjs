// Takes the after-w3-* screenshots at 1280x800 (d) and 375x812 (m): end card with the feel row, sprint running
// and on break, breathing session, and Today for a Focus goal and a Calm goal.
// Usage: node web/scripts/take-w3-shots.mjs [out dir]  (needs web/dist)
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { startServer } from './e2e-lib.mjs';

const out = resolve(process.argv[2] ?? 'docs/ux-shots');
mkdirSync(out, { recursive: true });
const SIZES = { d: { width: 1280, height: 800 }, m: { width: 375, height: 812 } };
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });

const seed = (goal) => ({ goal, createdAt: 1_700_000_000_000 });
const INIT = ({ goal, createdAt }) => {
  localStorage.setItem('zonked.safety.v1', '1');
  localStorage.setItem('zonked.profile.v1', JSON.stringify({ v: 1, goal, timeOfDay: 'morning', device: 'headphones', extraGentle: false, createdAt }));
};

async function open(browser, origin, size, goal) {
  const context = await browser.newContext({ viewport: SIZES[size] });
  await context.addInitScript(INIT, seed(goal));
  const page = await context.newPage();
  await page.clock.install();
  const wait = async (ms) => {
    await page.clock.runFor(ms);
    await sleep(150);
  };
  await page.goto(`${origin}/?e2e=1`);
  await page.getByTestId('greeting').waitFor();
  return { context, page, wait };
}

async function focusFlow(browser, origin, size) {
  const { context, page, wait } = await open(browser, origin, size, 'focus');
  const shot = (name) => page.screenshot({ path: join(out, `after-w3-${name}-${size}.png`) });
  try {
    await wait(500);
    await shot('today-focus');
    await page.getByTestId('today-sprint').click();
    await page.getByTestId('player-toggle').waitFor();
    await wait(3000);
    await shot('sprint-running');
    await wait(25 * 60_000 + 2000);
    await shot('sprint-break');
    await wait(5 * 60_000 + 2000);
    await page.getByTestId('end-card').waitFor();
    await wait(300);
    await shot('end-card-feel');
    await page.getByTestId('feel-calmer').click();
    await wait(300);
    await shot('end-card-feel-saved');
  } finally {
    await context.close();
  }
}

async function calmFlow(browser, origin, size) {
  const { context, page, wait } = await open(browser, origin, size, 'calm');
  const shot = (name) => page.screenshot({ path: join(out, `after-w3-${name}-${size}.png`) });
  try {
    await wait(500);
    await shot('today-calm');
    await page.getByTestId('today-breathe').click();
    await page.getByTestId('reset-begin').waitFor();
    await shot('breathe-intro');
    await page.getByTestId('reset-begin').click();
    await page.getByTestId('reset-stop').waitFor();
    await wait(6000);
    await shot('breathe-running');
  } finally {
    await context.close();
  }
}

const server = await startServer();
const browser = await chromium.launch();
try {
  for (const size of Object.keys(SIZES)) {
    await focusFlow(browser, server.origin, size);
    await calmFlow(browser, server.origin, size);
  }
} finally {
  await browser.close();
  server.stop();
}
console.log(`wrote screenshots to ${out}`);
