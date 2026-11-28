// Opens the Player Options sheet at 390x844 and fails on sideways scroll or clipped chips.
// Usage: node web/scripts/check-sheet-fit.mjs  (needs web/dist)
import { chromium } from '@playwright/test';
import { startServer } from './e2e-lib.mjs';

const server = await startServer();
const browser = await chromium.launch();
let bad = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    localStorage.setItem('zonked.safety.v1', '1');
    localStorage.setItem('zonked.profile.v1', JSON.stringify({ v: 1, goal: 'calm', timeOfDay: 'evening', device: 'headphones', extraGentle: false, createdAt: 1_700_000_000_000 }));
  });
  const page = await context.newPage();
  await page.goto(`${server.origin}/?e2e=1`);
  await page.getByTestId('today-play').click();
  await page.getByTestId('player-toggle').waitFor();
  await page.getByRole('button', { name: 'Options' }).click();
  const sheet = page.getByTestId('options-sheet');
  await sheet.waitFor();
  await page.waitForTimeout(600);
  bad = await sheet.evaluate((el) => {
    const out = [];
    if (el.scrollWidth > el.clientWidth) out.push(`sheet scrollWidth ${el.scrollWidth} > ${el.clientWidth}`);
    const box = el.getBoundingClientRect();
    for (const b of el.querySelectorAll('button, input')) {
      const r = b.getBoundingClientRect();
      if (r.width > 0 && (r.left < box.left - 0.5 || r.right > box.right + 0.5)) out.push(`${b.textContent || b.id} outside (${Math.round(r.left)}..${Math.round(r.right)})`);
      if (b.scrollWidth > b.clientWidth + 1) out.push(`${b.textContent} text clipped`);
    }
    return out;
  });
  await page.screenshot({ path: process.env['SHEET_SHOT'] ?? '/tmp/zk-sheet-390.png' });
  await context.close();
} finally {
  await browser.close();
  server.stop();
}
if (bad.length > 0) {
  console.error(bad.join('\n'));
  process.exit(1);
}
console.log('options sheet fits at 390 px');
