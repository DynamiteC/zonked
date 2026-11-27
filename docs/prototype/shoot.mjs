// Serves the prototype on loopback, captures every screen, and runs a quick accessibility check.
// Usage: node docs/prototype/shoot.mjs   (needs Playwright from web/node_modules)
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, '../../web/package.json'));
const { chromium } = require('playwright');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
const shots = join(here, 'shots');
mkdirSync(shots, { recursive: true });

const server = createServer((req, res) => {
  const p = req.url.split('?')[0];
  const f = join(here, p === '/' ? 'index.html' : p.replace(/\.\./g, ''));
  if (!existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const SCREENS = ['onb1', 'onb2', 'onb3', 'onb4', 'onb5', 'safety', 'today', 'journeys', 'jday', 'library', 'player', 'crew', 'studio'];
const SIZES = [[390, 844, 'm'], [1280, 720, 'd']];
const problems = [];

async function audit(page, name, tag) {
  const found = await page.evaluate(() => {
    const out = [];
    const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden'; };
    const cur = document.querySelector('.screen.on');
    const scope = [...(cur ? cur.querySelectorAll('button,a,input,select,textarea') : []), ...document.querySelectorAll('.topbar button,.tabbar button')];
    for (const e of scope) {
      const isHiddenInput = e.matches('input[type=radio],input[type=checkbox]');
      const label = e.getAttribute('aria-label') || (e.labels && e.labels[0] && e.labels[0].textContent.trim()) || e.textContent.trim() || e.getAttribute('aria-labelledby');
      if (!label) out.push('no name: ' + e.outerHTML.slice(0, 80));
      if (isHiddenInput) continue;
      if (!vis(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 43.5 || r.height < 43.5) out.push(`small target ${Math.round(r.width)}x${Math.round(r.height)}: ${(label || '').slice(0, 30)}`);
    }
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth + 1) out.push('horizontal overflow ' + doc.scrollWidth + ' > ' + doc.clientWidth);
    return out;
  });
  for (const f of found) problems.push(`${name} ${tag}: ${f}`);
}

const browser = await chromium.launch();
for (const [w, h, tag] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', colorScheme: 'light' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const s of SCREENS) {
    await page.goto(`${base}?greet=fixed${s === 'studio' ? '&studio=1' : ''}#${s}`);
    await page.waitForTimeout(120);
    await audit(page, s, tag);
    await page.screenshot({ path: join(shots, `${s}-${tag}.png`) });
  }
  // sheet, dark, scale, library tab
  await page.goto(`${base}?greet=fixed#player`);
  await page.click('#mixBtn');
  await page.waitForTimeout(100);
  await page.screenshot({ path: join(shots, `mix-${tag}.png`) });
  await page.keyboard.press('Escape');
  await page.click('#whyBtn');
  await page.screenshot({ path: join(shots, `why-${tag}.png`) });
  await page.goto(`${base}?greet=fixed&theme=dark#today`);
  await page.screenshot({ path: join(shots, `today-dark-${tag}.png`) });
  await page.goto(`${base}?greet=fixed&scale=200#today`);
  await page.screenshot({ path: join(shots, `today-200-${tag}.png`) });
  if (errors.length) problems.push(`console errors ${tag}: ${errors.join(' | ')}`);
  await ctx.close();
}
await browser.close();
server.close();
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'a11y quick check: clean');
