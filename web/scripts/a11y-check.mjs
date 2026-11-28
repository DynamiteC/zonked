#!/usr/bin/env node
// Automated accessibility pass (R38): axe-core on every main screen, light and dark, phone and desktop,
// plus a scripted keyboard pass (focus order reaches every control, each has a name, focus is visible).
// Fails on any axe violation of any impact. Writes docs/ACCESSIBILITY-RUN.md-style output to stdout.
// This is an automated check. It is not a screen reader test and it is not a WCAG conformance claim.
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertBridgePortFree, ensureBuilt, startServer } from './e2e-lib.mjs';
import { nav } from './e2e-helpers.mjs';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const THEMES = ['light', 'dark'];
const SIZES = { phone: { width: 390, height: 844 }, desktop: { width: 1280, height: 800 } };

async function scan(page, label, out) {
  const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  for (const v of r.violations) out.push({ label, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) });
  return r.passes.length;
}

/** Tab through the page. Every stop must have a name and a visible focus ring, and the walk must not get stuck. */
async function keyboardPass(page, label, out) {
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  const seen = new Set();
  for (let i = 0; i < 60; i += 1) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const c = getComputedStyle(el);
      const name = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || el.getAttribute('placeholder') || el.labels?.[0]?.innerText || '').trim();
      const ring = (parseFloat(c.outlineWidth) > 0 && c.outlineStyle !== 'none') || c.boxShadow !== 'none';
      return { key: `${el.tagName}|${el.getAttribute('data-testid') ?? ''}|${name.slice(0, 30)}`, name, ring, tag: el.tagName };
    });
    if (f === null) continue;
    if (seen.has(f.key)) break;
    seen.add(f.key);
    if (f.name === '') out.push({ label, id: 'keyboard-name', impact: 'serious', help: 'a focus stop has no name', nodes: [f.key] });
    if (!f.ring) out.push({ label, id: 'keyboard-ring', impact: 'serious', help: 'a focus stop has no visible focus ring', nodes: [f.key] });
  }
  if (seen.size < 2) out.push({ label, id: 'keyboard-reach', impact: 'serious', help: 'Tab reaches fewer than 2 controls', nodes: [] });
  return seen.size;
}

async function session(browser, origin, theme, size) {
  const context = await browser.newContext({ viewport: SIZES[size], colorScheme: theme });
  await context.addInitScript((t) => {
    localStorage.setItem('zonked.theme.v2', JSON.stringify({ choice: t, dim: false, announce: true }));
  }, theme);
  const page = await context.newPage();
  await page.goto(`${origin}/?e2e=1`);
  return { context, page };
}

async function walk(page, tag, out, stats) {
  const step = async (name, fn) => {
    await fn();
    await page.waitForTimeout(500);
    stats.passes += await scan(page, `${tag} ${name}`, out);
    stats.stops += await keyboardPass(page, `${tag} ${name}`, out);
    stats.screens += 1;
  };
  await step('onboarding', async () => {
    await page.getByText('1 of 3').first().waitFor();
  });
  await page.getByRole('button', { name: 'Skip, just play' }).click();
  await step('safety notice', async () => {
    await page.getByTestId('calm-safety-accept').waitFor();
  });
  await page.getByTestId('calm-safety-accept').click();
  await page.getByTestId('player-toggle').waitFor();
  await step('player', async () => {
    await page.waitForFunction(() => window.__zonked?.status.state === 'running', null, { timeout: 20000 });
  });
  await step('options sheet', async () => {
    await page.getByTestId('player-options').click();
    await page.getByTestId('options-sheet').waitFor();
  });
  await step('advanced panels', async () => {
    await page.getByTestId('options-advanced').click();
    await page.getByTestId('advanced-panels').waitFor();
  });
  await page.keyboard.press('Escape');
  await page.getByTestId('options-sheet').waitFor({ state: 'detached' });
  for (const name of ['Today', 'Sounds', 'Crew', 'You']) await step(name, () => nav(page, name).click());
  await step('privacy note', async () => {
    await page.getByTestId('privacy-link').click();
    await page.getByTestId('privacy-text').waitFor();
  });
  await step('guide', async () => {
    await page.getByTestId('settings-guide').or(page.getByTestId('today-guide')).first().click();
    await page.getByTestId('guide').waitFor();
  });
}

async function main() {
  ensureBuilt();
  await assertBridgePortFree();
  const { origin, stop } = await startServer();
  const browser = await chromium.launch();
  const out = [];
  const stats = { passes: 0, stops: 0, screens: 0 };
  try {
    for (const theme of THEMES) {
      for (const size of Object.keys(SIZES)) {
        const { context, page } = await session(browser, origin, theme, size);
        try {
          await walk(page, `${theme} ${size}`, out, stats);
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
    await stop();
  }
  const seen = new Map();
  for (const v of out) {
    const k = `${v.id}|${v.nodes[0] ?? ''}`;
    if (!seen.has(k)) seen.set(k, { ...v, where: [v.label] });
    else seen.get(k).where.push(v.label);
  }
  console.log(`axe-core pass: ${stats.screens} screen views, ${stats.passes} rule passes, ${stats.stops} keyboard stops`);
  for (const v of seen.values()) console.log(`VIOLATION [${v.impact}] ${v.id}: ${v.help} | ${v.nodes.join(' ; ')} | ${v.where.slice(0, 4).join(', ')}`);
  console.log(`${seen.size === 0 ? 'PASS' : 'FAIL'}: ${seen.size} distinct violations`);
  process.exit(seen.size === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
