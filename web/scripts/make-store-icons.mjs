// Makes the Kiro Crew listing icon and hero in light and dark versions from the shipped build.
// Usage: node web/scripts/make-store-icons.mjs [out dir]  (needs web/dist). Default out dir: app/assets.
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { startServer } from './e2e-lib.mjs';

const out = resolve(process.argv[2] ?? 'app/assets');
const server = await startServer();
const browser = await chromium.launch();
let mascot;
try {
  const context = await browser.newContext({ viewport: { width: 900, height: 900 }, reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    localStorage.setItem('zonked.safety.v1', '1');
    localStorage.setItem('zonked.profile.v1', JSON.stringify({ v: 1, goal: 'calm', timeOfDay: 'evening', device: 'headphones', extraGentle: false, createdAt: 1_700_000_000_000 }));
  });
  const page = await context.newPage();
  await page.goto(`${server.origin}/?e2e=1`);
  await page.getByTestId('today-play').click();
  await page.getByTestId('player-toggle').waitFor();
  await page.evaluate(() => {
    const stage = document.querySelector('.cm-stage');
    document.querySelectorAll('.cm-stage *').forEach((e) => { e.style.animation = 'none'; });
    stage.querySelectorAll('[data-prop], .cm-ripples, .cm-motes').forEach((e) => e.remove());
    document.body.replaceChildren(stage);
    document.body.style.cssText = 'margin:0;background:transparent';
    document.documentElement.style.background = 'transparent';
    stage.style.cssText = 'width:800px;height:800px;position:fixed;left:0;top:0;transform:none';
  });
  mascot = await page.locator('.cm-stage').first().screenshot({ omitBackground: true });
  await context.close();
} finally {
  await browser.close();
  server.stop();
}
const trimmed = await sharp(mascot).trim().toBuffer();
const make = async (size, pad, bg) => {
  const inner = await sharp(trimmed).resize(Math.round(size * (1 - pad * 2)), Math.round(size * (1 - pad * 2)), { fit: 'inside' }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background: bg } }).composite([{ input: inner, gravity: 'centre' }]);
};
await (await make(512, 0.08, '#FFF3D6')).png().toFile(join(out, 'icon.png'));
await (await make(512, 0.08, '#0A0B0F')).png().toFile(join(out, 'icon-dark.png'));

// Detail banner, 25:6 (2500x600): mascot left, the promise right. Plain text, no personal data.
const W = 2500;
const H = 600;
const face = await sharp(trimmed).resize(480, 480, { fit: 'inside' }).toBuffer();
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3D6"/><stop offset="1" stop-color="#F6D9E0"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/><text x="900" y="270" font-family="system-ui, sans-serif" font-size="120" font-weight="700" fill="#2B2233">Zonked</text><text x="900" y="370" font-family="system-ui, sans-serif" font-size="62" fill="#4C4256">Calm sound for tired minds.</text><text x="900" y="450" font-family="system-ui, sans-serif" font-size="46" fill="#6B6075">Free, private, works offline.</text></svg>`);
await sharp(svg).composite([{ input: face, left: 300, top: 60 }]).flatten({ background: '#FFF3D6' }).png().toFile(join(out, 'hero-detail.png'));
console.log('icons and banner written to', out);
