// Generates PWA icons from public/logo.svg using sharp.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const svg = readFileSync(join(pub, 'logo.svg'));
const BG = '#0A0B0F';

const render = (size) => sharp(svg, { density: (72 * size) / 512 }).resize(size, size);

for (const [name, size] of [['pwa-192x192.png', 192], ['pwa-512x512.png', 512], ['apple-touch-icon.png', 180]]) {
  await render(size).png().toFile(join(pub, name));
}

// Maskable: logo at 80% on a full-bleed dark square.
const inner = await render(410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: BG } })
  .composite([{ input: inner, gravity: 'centre' }])
  .png()
  .toFile(join(pub, 'maskable-512x512.png'));

// Simplified favicon: drop glow filter and fine details.
const fav = svg.toString()
  .replace(/ filter="url\(#glow\)"/, '')
  .replace(/<circle cx="256" cy="256" r="251"[^>]*\/>\n/, '')
  .replace(/<rect x="(35|463)"[^>]*\/>\n\s*/g, '')
  .replace(/<circle cx="(178|334)" cy="150" r="7"[^>]*\/>\n\s*/g, '');
writeFileSync(join(pub, 'favicon.svg'), fav);
console.log('icons written');
