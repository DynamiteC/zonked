// UI v2 checks: mascot (viewports), mobile layout, tooltips, Quick Start. Checks 20 and up.
import { runMascotChecks } from './e2e-mascot-checks.mjs';
import { newSession, openAdvanced, sleep, state } from './e2e-helpers.mjs';

const MOBILE = { width: 390, height: 844 };

async function openFresh(h, opts, url) {
  const s = await newSession(h, opts);
  await s.page.goto(`${h.origin}${url}`);
  await s.page.getByTestId('play-button').waitFor();
  return s;
}

async function mascotRuns(h) {
  for (const viewport of [{ width: 1280, height: 720 }, MOBILE]) {
    const s = await openFresh(h, { viewport }, '/?e2e=1');
    try {
      await openAdvanced(s.page);
      await runMascotChecks(s.page, h, { viewport });
    } finally {
      await s.context.close().catch(() => {});
    }
  }
}

async function mobileLayout(h) {
  await h.check('U1 mobile layout 390x844', async () => {
    const s = await openFresh(h, { viewport: MOBILE }, '/?e2e=1');
    try {
      const { page } = s;
      await openAdvanced(page);
      const m = await page.evaluate(() => {
        const box = (id) => document.querySelector(`[data-testid=${id}]`)?.getBoundingClientRect();
        const mascot = box('mascot');
        const scope = box('scope-canvas');
        return { sw: document.documentElement.scrollWidth, mascot, scopeW: scope?.width ?? 0 };
      });
      h.assert(m.sw <= 390, `scrollWidth ${m.sw}`);
      h.assert(m.mascot && m.mascot.x >= 0 && m.mascot.x + m.mascot.width <= 390, `mascot box ${JSON.stringify(m.mascot)}`);
      h.assert(m.mascot.y >= 0, `mascot above viewport ${m.mascot.y}`);
      h.assert(m.scopeW > 0, 'scope canvas width 0');
      for (const id of ['play-button', 'advanced-toggle']) {
        const loc = page.getByTestId(id);
        await loc.scrollIntoViewIfNeeded();
        const b = await loc.boundingBox();
        h.assert(b && b.x >= 0 && b.x + b.width <= 390 && b.width > 0, `${id} not reachable ${JSON.stringify(b)}`);
      }
      return `scrollW=${m.sw} scopeW=${m.scopeW.toFixed(0)}`;
    } finally {
      await s.context.close().catch(() => {});
    }
  });
}

const tooltips = (page) => page.getByRole('tooltip');

async function tooltipChecks(h) {
  const s = await openFresh(h, { viewport: { width: 1280, height: 720 } }, '/?e2e=1');
  const { page } = s;
  try {
    const play = page.getByTestId('play-button');
    await h.check('T1 hover on play shows a tooltip with text', async () => {
      await play.hover();
      await tooltips(page).first().waitFor();
      const t = (await tooltips(page).first().innerText()).trim();
      h.assert(t.length > 3, `empty tooltip "${t}"`);
      return t.slice(0, 40);
    });
    await h.check('T2 keyboard focus shows it and aria-describedby is set', async () => {
      await page.mouse.move(5, 5);
      await tooltips(page).first().waitFor({ state: 'detached' });
      await play.focus();
      await tooltips(page).first().waitFor();
      const id = await tooltips(page).first().getAttribute('id');
      const d = (await play.getAttribute('aria-describedby')) ?? '';
      h.assert(id && d.split(' ').includes(id), `aria-describedby "${d}" lacks ${id}`);
    });
    await h.check('T3 Escape closes the tooltip and removes aria-describedby', async () => {
      await page.keyboard.press('Escape');
      await tooltips(page).first().waitFor({ state: 'detached' });
      h.assert(!(await play.getAttribute('aria-describedby')), 'aria-describedby still set');
    });
    await h.check('T4 reduced motion removes the animation class', async () => {
      const cls = async () => {
        await page.mouse.move(5, 5);
        await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
        await play.focus();
        const id = await page.waitForFunction(() => document.querySelector('[data-testid=play-button]').getAttribute('aria-describedby'));
        return page.locator(`[id="${await id.jsonValue()}"]`).getAttribute('class');
      };
      const before = await cls();
      await page.getByLabel('Reduce motion').check();
      const after = await cls();
      h.assert(/tip-anim/.test(before ?? '') && !/tip-anim/.test(after ?? ''), `before "${before}" after "${after}"`);
    });
  } finally {
    await s.context.close().catch(() => {});
  }
  await h.check('T5 tap on "?" at 390x844 shows tooltip inside viewport', async () => {
    const t = await openFresh(h, { viewport: MOBILE, hasTouch: true, isMobile: true }, '/?e2e=1');
    try {
      const btn = t.page.getByRole('button', { name: 'About Play and Stop' });
      await btn.scrollIntoViewIfNeeded();
      await btn.tap();
      const tip = tooltips(t.page).first();
      await tip.waitFor();
      const b = await tip.boundingBox();
      h.assert(b && b.x >= 0 && b.y >= 0 && b.x + b.width <= 390 && b.y + b.height <= 844, `tooltip box ${JSON.stringify(b)}`);
      h.assert(!!(await btn.getAttribute('aria-describedby')) || !!(await t.page.getByTestId('play-button').getAttribute('aria-describedby')), 'no aria-describedby while open');
      return `box x=${b.x.toFixed(0)} w=${b.width.toFixed(0)}`;
    } finally {
      await t.context.close().catch(() => {});
    }
  });
}

async function quickStartChecks(h) {
  // No ?e2e=1 and no INIT script: flags unset, safety gate not yet accepted.
  const context = await h.browser.newContext({ viewport: MOBILE });
  const page = await context.newPage();
  try {
    await page.goto(`${h.origin}/`);
    await page.getByTestId('play-button').waitFor();
    const qs = page.getByTestId('quickstart');
    await h.check('Q1 Quick Start shows as a region, not a dialog, and is not clipped', async () => {
      await qs.waitFor();
      h.assert((await qs.getAttribute('role')) === 'region', 'role is not region');
      h.assert((await page.getByRole('dialog').count()) === 0, 'a dialog is open');
      const b = await qs.boundingBox();
      h.assert(b && b.x >= 0 && b.x + b.width <= 390, `card box ${JSON.stringify(b)}`);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      h.assert(sw <= 390, `scrollWidth ${sw}`);
    });
    await h.check('Q2 situation plus 15 minutes gives at least 5 results with reasons', async () => {
      await page.getByTestId('qs-situation-deep-work').click();
      await page.getByTestId('qs-minutes-15').click();
      await page.getByTestId('qs-item').first().waitFor({ timeout: 15000 });
      const n = await page.getByTestId('qs-item').count();
      h.assert(n >= 5, `only ${n} results`);
      const texts = await page.getByTestId('qs-item').allInnerTexts();
      h.assert(texts.every((t) => t.split('\n').filter((l) => l.trim()).length >= 3), `missing reason: ${texts[0]}`);
      return `${n} results`;
    });
    await h.check('Q3 Play shows the safety dialog and the engine waits for accept', async () => {
      await page.getByTestId('qs-play').first().click();
      await page.getByRole('dialog').waitFor();
      await sleep(800);
      h.assert((await state(page)) !== 'running', 'engine running before accept');
      await page.getByTestId('safety-accept').click();
      await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]')?.dataset.state === 'running', null, { timeout: 20000 });
      await page.getByTestId('play-button').click();
    });
    await h.check('Q4 Skip works, Dont show again persists across reload', async () => {
      await page.evaluate(() => localStorage.removeItem('zonked.quickstart.v1'));
      await page.reload();
      await qs.waitFor();
      await page.getByTestId('qs-skip').click();
      await qs.waitFor({ state: 'detached' });
      await page.reload();
      await qs.waitFor();
      await page.getByTestId('qs-never').click();
      await qs.waitFor({ state: 'detached' });
      await page.reload();
      await page.getByTestId('play-button').waitFor();
      await sleep(500);
      h.assert((await qs.count()) === 0, 'Quick Start came back');
    });
  } finally {
    await context.close().catch(() => {});
  }
}

export async function runUiChecks(h) {
  await mascotRuns(h);
  await mobileLayout(h);
  await tooltipChecks(h);
  await quickStartChecks(h);
}
