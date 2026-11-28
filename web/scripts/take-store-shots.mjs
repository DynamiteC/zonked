// Takes the Kiro Crew store art from the shipped build: three screenshots at 1280x720 and the hero at 1200x675.
// Usage: node web/scripts/take-store-shots.mjs [out dir]  (needs web/dist). Default out dir: app/assets.
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { startServer } from './e2e-lib.mjs';

const out = resolve(process.argv[2] ?? 'app/assets');
mkdirSync(join(out, 'screenshots'), { recursive: true });

const INIT = ({ safety }) => {
  if (safety) localStorage.setItem('zonked.safety.v1', '1');
  localStorage.setItem('zonked.profile.v1', JSON.stringify({ v: 1, goal: 'calm', timeOfDay: 'evening', device: 'headphones', extraGentle: false, createdAt: 1_700_000_000_000 }));
};

async function open(browser, origin, size, safety) {
  const context = await browser.newContext({ viewport: size, reducedMotion: 'no-preference' });
  await context.addInitScript(INIT, { safety });
  const page = await context.newPage();
  await page.goto(`${origin}/?e2e=1`);
  await page.getByTestId('greeting').waitFor();
  await sleep(1500);
  return { context, page };
}

const PROMISE = 'Calm sound for tired minds. Free, private, works offline.';

async function addPromise(page) {
  await page.evaluate((text) => {
    const bar = document.createElement('p');
    bar.textContent = text;
    bar.setAttribute('style', 'position:fixed;left:0;right:0;bottom:0;margin:0;padding:14px 24px;text-align:center;font:600 22px system-ui,sans-serif;color:#1d2433;background:rgba(255,248,225,0.92);z-index:99');
    document.body.appendChild(bar);
  }, PROMISE);
}

const server = await startServer();
const browser = await chromium.launch();
try {
  const wide = { width: 1280, height: 720 };
  {
    const { context, page } = await open(browser, server.origin, wide, true);
    await page.screenshot({ path: join(out, 'screenshots', 'screenshot-today.png') });
    await page.getByTestId('today-play').click();
    await page.getByTestId('player-toggle').waitFor();
    await sleep(4000);
    await page.screenshot({ path: join(out, 'screenshots', 'screenshot-player.png') });
    await context.close();
  }
  {
    const { context, page } = await open(browser, server.origin, wide, false);
    await page.getByTestId('today-play').click();
    await page.getByTestId('calm-safety-accept').waitFor();
    await sleep(600);
    await page.screenshot({ path: join(out, 'screenshots', 'screenshot-safety.png') });
    await context.close();
  }
  {
    const { context, page } = await open(browser, server.origin, { width: 1200, height: 675 }, true);
    await addPromise(page);
    await page.screenshot({ path: join(out, 'hero.png') });
    await context.close();
  }
} finally {
  await browser.close();
  server.stop();
}
console.log(`wrote store art to ${out}`);
