// Mascot checks: drag spin, audio-reactive depth, reduced-motion freeze, responsive layout.
// Usage from verify-e2e: await runMascotChecks(page, h, { viewport }) where h has check, assert and origin.
import { sleep, startPlaying, state } from './e2e-helpers.mjs';

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 720 },
  { width: 1600, height: 900 },
];

export async function runMascotChecks(page, h, { viewport = { width: 1280, height: 720 } } = {}) {
  const { check, assert } = h;
  const mascot = page.getByTestId('mascot');
  const vars = () =>
    mascot.evaluate((el) => ({
      rx: parseFloat(el.style.getPropertyValue('--rx') || '0'),
      ry: parseFloat(el.style.getPropertyValue('--ry') || '0'),
      depth: parseFloat(el.style.getPropertyValue('--depth') || '1'),
    }));
  const setReduced = async (on) => {
    const cb = page.getByLabel('Reduce motion');
    if (on) await cb.check();
    else await cb.uncheck();
  };

  for (const vp of VIEWPORTS) {
    await check(`M1 mascot layout ${vp.width}x${vp.height}`, async () => {
      await page.setViewportSize(vp);
      await sleep(250);
      const m = await page.evaluate(() => {
        const el = document.querySelector('[data-testid=mascot]');
        const r = el.getBoundingClientRect();
        const play = document.querySelector('[data-testid=play-button]');
        const pr = play.getBoundingClientRect();
        return {
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          innerH: window.innerHeight,
          box: { x: r.x, y: r.y, w: r.width, h: r.height },
          playVisible: pr.width > 0 && pr.height > 0,
        };
      });
      assert(m.scrollW <= vp.width, `horizontal overflow: scrollWidth ${m.scrollW} > ${vp.width}`);
      assert(m.box.x >= 0 && m.box.x + m.box.w <= vp.width, `mascot outside viewport horizontally: ${JSON.stringify(m.box)}`);
      assert(m.box.w >= 100 && m.box.w <= 281, `mascot size ${m.box.w}`);
      const cx = m.box.x + m.box.w / 2;
      const col = await page.evaluate(() => document.querySelector('[data-testid=mascot]').parentElement.getBoundingClientRect());
      assert(Math.abs(cx - (col.x + col.width / 2)) < 2, `mascot not centered: ${cx} vs ${col.x + col.width / 2}`);
      assert(m.playVisible, 'play button has no box');
      const play = page.getByTestId('play-button');
      await play.scrollIntoViewIfNeeded();
      assert(await play.isVisible(), 'play button not reachable');
      await mascot.scrollIntoViewIfNeeded();
      const after = await mascot.boundingBox();
      assert(after && after.x >= 0 && after.x + after.width <= vp.width, 'mascot clipped after scroll');
      return `box ${m.box.w.toFixed(0)}px scrollW=${m.scrollW}`;
    });
  }
  await page.setViewportSize(viewport);
  await sleep(200);

  await setReduced(false);
  await check('M2 drag spins the mascot, engine state unchanged, no toggle', async () => {
    const before = await state(page);
    const box = await mascot.boundingBox();
    assert(box, 'no mascot box');
    const y = box.y + box.height / 2;
    const x0 = box.x + box.width * 0.3;
    await page.mouse.move(x0, y);
    await sleep(200);
    const rest = await vars();
    await page.mouse.down();
    await page.mouse.move(x0 + box.width * 0.4, y, { steps: 8 });
    await sleep(350);
    const dragging = await vars();
    await page.mouse.up();
    assert(Math.abs(dragging.ry - rest.ry) > 5, `--ry did not change: ${rest.ry} -> ${dragging.ry}`);
    await sleep(500);
    assert((await state(page)) === before, `engine state changed by drag: ${before} -> ${await state(page)}`);
    await page.mouse.move(box.x - 60, box.y - 60);
    await page.waitForFunction(() => Math.abs(parseFloat(document.querySelector('[data-testid=mascot]').style.getPropertyValue('--ry') || '0')) < 1.5, null, { timeout: 5000 });
    return `ry ${rest.ry.toFixed(1)} -> ${dragging.ry.toFixed(1)}, state ${before}`;
  });

  await check('M3 audio-reactive depth while playing, near 1 when stopped', async () => {
    await page.evaluate(() => window.__zonked.setLayers({ lofiLevel: 0.7, padLevel: 0.7, instLevel: 0.5, chimeLevel: 0.5 }));
    await startPlaying(page);
    const box = await mascot.boundingBox();
    await page.mouse.move(box.x - 80, box.y - 80);
    let max = 1;
    const end = Date.now() + 6000;
    while (Date.now() < end) {
      max = Math.max(max, (await vars()).depth);
      if (max > 1.02) break;
      await sleep(100);
    }
    assert(max > 1.02, `depth never rose above 1 while playing (max ${max})`);
    assert(max <= 1.36, `depth over cap: ${max}`);
    await page.getByTestId('play-button').click();
    await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]').dataset.state !== 'running', null, { timeout: 20000 });
    await page.waitForFunction(() => Math.abs(parseFloat(document.querySelector('[data-testid=mascot]').style.getPropertyValue('--depth') || '1') - 1) < 0.03, null, { timeout: 8000 });
    return `max depth ${max.toFixed(3)}, stopped depth ${(await vars()).depth.toFixed(3)}`;
  });

  await check('M4 reduced motion freezes mascot while playing', async () => {
    await startPlaying(page);
    await setReduced(true);
    assert((await mascot.getAttribute('data-motion')) === 'frozen', 'not frozen');
    await sleep(300);
    const rest = await vars();
    const box = await mascot.boundingBox();
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1, { steps: 6 });
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.5, { steps: 6 });
    await page.mouse.up();
    await sleep(500);
    const moved = await vars();
    assert(JSON.stringify(rest) === JSON.stringify(moved), `vars changed: ${JSON.stringify(rest)} -> ${JSON.stringify(moved)}`);
    assert(Math.abs(moved.rx) < 0.01 && Math.abs(moved.ry) < 0.01 && moved.depth === 1, `not at rest ${JSON.stringify(moved)}`);
    await setReduced(false);
    await page.getByTestId('play-button').click();
    await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]').dataset.state !== 'running', null, { timeout: 20000 });
    return `frozen rx=${moved.rx} ry=${moved.ry} depth=${moved.depth}`;
  });
}
