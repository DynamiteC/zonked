// Checks 10 (layers), 12 (recommender), 13 (catalog), 15 (shortcuts).
import { settle, MAX_PEAK, playLabel, SITUATIONS, ZERO_LAYERS, measure, num, openPanel, press, sleep, startPlaying, state, tid } from './e2e-helpers.mjs';

export async function checksA(h, page) {
  const { check, assert, info } = h;

  await check('10 each synthesized layer is audible, peak <= 0.95', async () => {
    await startPlaying(page);
    await page.evaluate((z) => window.__zonked.setLayers(z), ZERO_LAYERS);
    await settle(page); // let the tone ramp settle so the baseline is stationary
    const base = await measure(page, 2500);
    assert(base.rms > 0, 'no tone baseline');
    // dsp-core ducks the tone bed by 1 - 0.6 * min(1, sum(levels) / 2). With one layer at 1.0 that is 0.7, so total
    // rms can fall below the tone-only baseline. Audibility is the layer power added on top of the ducked tone.
    const duck = 0.7;
    const cases = {
      lofi: { lofiLevel: 1, crackle: 0.5 },
      instrument: { instLevel: 1, instKind: 0, instBpm: 140 },
      pad: { padLevel: 1 },
      chimes: { chimeLevel: 1, chimeRatePerMin: 30 },
      perc: { percLevel: 1, percBpm: 150, percPattern: 6 },
    };
    const out = [];
    for (const [name, p] of Object.entries(cases)) {
      await page.evaluate((z) => window.__zonked.setLayers(z), { ...ZERO_LAYERS, ...p });
      await sleep(600);
      const m = await measure(page, 5000);
      assert(m.peak <= MAX_PEAK, `${name}: peak ${m.peak}`);
      const added = Math.sqrt(Math.max(0, m.rms * m.rms - (duck * base.rms) ** 2));
      assert(added > 0.002, `${name}: layer adds only ${added.toFixed(5)} rms (total ${m.rms.toFixed(4)}, tone-only ${base.rms.toFixed(4)})`);
      out.push(`${name}=+${added.toFixed(3)}`);
      if (m.rms < base.rms) info.push(`${name} layer at 1.0: total rms ${m.rms.toFixed(3)} is below tone-only ${base.rms.toFixed(3)} (tone duck, by design)`);
    }
    await page.evaluate((z) => window.__zonked.setLayers(z), {
      lofiLevel: 1, crackle: 1, instLevel: 1, padLevel: 1, chimeLevel: 1, chimeRatePerMin: 30, percLevel: 1, percBpm: 180, instBpm: 180,
    });
    await sleep(600);
    const all = await measure(page, 5000);
    assert(all.peak <= MAX_PEAK, `all layers: peak ${all.peak}`);
    await page.evaluate((z) => window.__zonked.setLayers(z), ZERO_LAYERS);
    return `tone rms=${base.rms.toFixed(4)} added rms ${out.join(' ')} allLayers peak=${all.peak.toFixed(3)} rms=${all.rms.toFixed(3)}`;
  });

  await check('12 recommender: 8 situations, >= 5 items with reasons, keys 1-5 launch', async () => {
    await press(page, 'r');
    await page.getByTestId('recommender-panel').waitFor();
    const seen = new Set();
    const out = [];
    let i = 0;
    for (const sit of SITUATIONS) {
      await page.getByTestId('rec-situation').selectOption(sit);
      const items = page.getByTestId('rec-item');
      await page.waitForFunction((s) => document.querySelector('[data-testid=rec-situation]').value === s, sit);
      const n = await items.count();
      assert(n >= 5, `${sit}: ${n} items`);
      for (let k = 0; k < n; k++) {
        assert((await items.nth(k).locator('.reasons li').count()) >= 1, `${sit} item ${k + 1}: no reasons`);
        assert((await items.nth(k).getByTestId('rec-score').innerText()).trim() !== '', `${sit} item ${k + 1}: no score`);
      }
      const key = (i % 5) + 1;
      i += 1;
      const expected = (await items.nth(key - 1).locator('strong').innerText()).trim();
      await press(page, String(key));
      await page.waitForFunction(
        (name) => document.querySelector('[data-testid=now-playing]').textContent.trim() === name && window.__zonked.templateId !== null,
        expected,
        { timeout: 15000 },
      );
      await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]').dataset.state === 'running');
      const id = await tid(page);
      assert(id, `${sit}: no templateId`);
      seen.add(id);
      await page.waitForFunction(() => parseFloat(document.querySelector('[data-testid=hud-carrier]').textContent) > 0);
      const l = await num(page, 'hz-left');
      const r = await num(page, 'hz-right');
      const beat = await num(page, 'hud-beat');
      const carrier = await num(page, 'hud-carrier');
      assert(l >= 19 && l <= 1545 && r >= 19 && r <= 1545, `${sit}: hz L=${l} R=${r}`);
      assert(carrier >= 20 && carrier <= 1500, `${sit}: carrier ${carrier}`);
      assert(beat >= 0.5 && beat <= 40.05, `${sit}: beat ${beat}`);
      out.push(`${sit}:${n}`);
    }
    assert(seen.size >= 5, `only ${seen.size} distinct templates launched`);
    return `${out.join(' ')} distinct=${seen.size}`;
  });

  await check('13 catalog: >= 210 items reachable by paging, search and filters work', async () => {
    await page.keyboard.press('Escape');
    await openPanel(page, 'catalog-toggle', 'catalog-panel');
    const count = async () => Number(/^(\d+) templates/.exec(await page.getByTestId('catalog-count').innerText())?.[1] ?? NaN);
    const total = await count();
    assert(total >= 210, `catalog reports ${total}`);
    let seen = 0;
    const names = new Set();
    for (let guard = 0; guard < 40; guard++) {
      const items = page.getByTestId('catalog-item');
      const n = await items.count();
      for (let k = 0; k < n; k++) names.add((await items.nth(k).locator('.catalog-name').innerText()).trim());
      seen += n;
      if (await page.getByTestId('catalog-next').isDisabled()) break;
      await page.getByTestId('catalog-next').click();
    }
    assert(seen === total, `paged ${seen} of ${total}`);
    assert(names.size >= 200, `only ${names.size} unique names`);
    const search = page.getByTestId('catalog-search');
    await search.fill('sleep');
    const sleepN = await count();
    assert(sleepN > 0 && sleepN < total, `search sleep: ${sleepN}`);
    await search.fill('zzzqqqxx');
    assert((await count()) === 0, 'nonsense search returned items');
    await search.fill('');
    assert((await count()) === total, 'clearing search did not restore');
    await page.locator('#cat-category').selectOption('sleep');
    const catN = await count();
    assert(catN >= 15 && catN < total, `category sleep: ${catN}`);
    const metas = await page.getByTestId('catalog-item').locator('.meta').allInnerTexts();
    assert(metas.every((t) => t.startsWith('sleep,')), 'category filter leaked other categories');
    await page.locator('#cat-category').selectOption('');
    await page.getByTestId('catalog-adhd').check();
    const adhdN = await count();
    assert(adhdN > 0 && adhdN < total, `adhd filter: ${adhdN}`);
    await page.getByTestId('catalog-adhd').uncheck();
    assert((await page.locator('[data-testid^=catalog-tag-]').count()) >= 4, 'layer tag chips missing');
    const firstTag = page.locator('[data-testid^=catalog-tag-]').first();
    await firstTag.click();
    const tagN = await count();
    assert(tagN > 0 && tagN < total, `tag filter: ${tagN}`);
    await firstTag.click();
    await page.getByTestId('catalog-item').first().click();
    await page.waitForFunction(() => window.__zonked.templateId !== null);
    return `total=${total} unique=${names.size} sleep=${sleepN} category=${catN} adhd=${adhdN} tag=${tagN}`;
  });

  await check('15 shortcuts do the documented thing and are ignored while typing', async () => {
    await page.keyboard.press('Escape');
    const out = [];
    const label = (l) => playLabel(page, l);
    if ((await state(page)) !== 'running') await startPlaying(page);
    await press(page, ' ');
    await label('Play');
    await press(page, ' ');
    await label('Stop');
    await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]').dataset.state === 'running');
    out.push('Space');
    await press(page, '1');
    await page.waitForFunction(() => window.__zonked.queueIndex === 0);
    const t0 = await tid(page);
    await press(page, 'n');
    await page.waitForFunction(() => window.__zonked.queueIndex === 1);
    assert((await tid(page)) !== t0, 'N did not change template');
    await press(page, 'p');
    await page.waitForFunction(() => window.__zonked.queueIndex === 0);
    assert((await tid(page)) === t0, 'P did not return');
    await press(page, 'ArrowRight');
    await page.waitForFunction(() => window.__zonked.queueIndex === 1);
    await press(page, 'ArrowLeft');
    await page.waitForFunction(() => window.__zonked.queueIndex === 0);
    out.push('N P Arrows');
    for (const k of ['2', '3', '4', '5']) {
      await press(page, k);
      await page.waitForFunction((q) => window.__zonked.queueIndex === q, Number(k) - 1);
    }
    out.push('1-5');
    await press(page, 'r');
    await page.getByTestId('recommender-panel').waitFor();
    await press(page, 'r');
    await page.getByTestId('recommender-panel').waitFor({ state: 'detached' });
    out.push('R');
    const kind = () => page.getByTestId('timer-remaining').getAttribute('data-kind');
    const order = ['none', 'countdown', 'sleep-fade', 'pomodoro'];
    let cur = await kind();
    for (let s = 0; s < 4; s++) {
      const want = order[(order.indexOf(cur) + 1) % 4];
      await press(page, 't');
      await page.waitForFunction((w) => document.querySelector('[data-testid=timer-remaining]').dataset.kind === w, want);
      cur = want;
    }
    if (cur !== 'none') {
      await press(page, 't');
      await page.waitForFunction(() => document.querySelector('[data-testid=timer-remaining]').dataset.kind === 'none');
    }
    out.push('T');
    const pressed = (v) => page.waitForFunction((x) => document.querySelector('[data-testid=mute-button]').getAttribute('aria-pressed') === x, v);
    await press(page, 'm');
    await pressed('true');
    await press(page, 'm');
    await pressed('false');
    out.push('M');
    await openPanel(page, 'mixer-toggle', 'mixer-panel');
    const gain = async () => parseFloat(/Master gain ([\d.]+)/.exec(await page.getByTestId('master-gain').innerText())[1]);
    const g0 = await gain();
    await press(page, '-');
    await press(page, '-');
    await page.waitForFunction((g) => parseFloat(/Master gain ([\d.]+)/.exec(document.querySelector('[data-testid=master-gain]').textContent)[1]) < g, g0);
    const g1 = await gain();
    for (let s = 0; s < 3; s++) await press(page, '+');
    await page.waitForFunction((g) => parseFloat(/Master gain ([\d.]+)/.exec(document.querySelector('[data-testid=master-gain]').textContent)[1]) > g, g1);
    for (let s = 0; s < 12; s++) await press(page, '+');
    await sleep(300);
    const g2 = await gain();
    assert(g2 <= 0.85, `gain ${g2} above cap`);
    out.push(`+/- (${g0}>${g1}>${g2})`);
    await press(page, '?');
    await page.locator('#help-pop').waitFor();
    assert((await page.locator('#help-pop li').count()) >= 10, 'help rows');
    await press(page, 'Escape');
    await page.locator('#help-pop').waitFor({ state: 'detached' });
    assert(!(await page.getByTestId('mixer-panel').isVisible().catch(() => false)), 'Escape did not close drawers');
    out.push('? Esc');
    await press(page, 'e');
    await page.getByTestId('editor').waitFor();
    await press(page, 'Escape');
    await press(page, 'b');
    await page.getByTestId('pacer').waitFor();
    await press(page, 'b');
    out.push('E B');
    await openPanel(page, 'catalog-toggle', 'catalog-panel');
    const idBefore = await tid(page);
    const playBefore = await page.getByTestId('play-button').innerText();
    const search = page.getByTestId('catalog-search');
    await search.click();
    await page.keyboard.type('rnpmt 12345?+-');
    assert((await search.inputValue()) === 'rnpmt 12345?+-', 'search did not receive the typed text');
    assert((await tid(page)) === idBefore, 'a shortcut changed the template inside the search input');
    assert((await page.getByTestId('play-button').innerText()) === playBefore, 'Space toggled playback inside the input');
    assert(!(await page.getByTestId('recommender-panel').isVisible().catch(() => false)), 'R opened recommender inside the input');
    assert((await page.getByTestId('timer-remaining').getAttribute('data-kind')) === 'none', 'T changed the timer inside the input');
    assert((await page.getByTestId('mute-button').getAttribute('aria-pressed')) === 'false', 'M muted inside the input');
    assert((await page.locator('#help-pop').count()) === 0, '? opened help inside the input');
    await search.fill('');
    await page.keyboard.press('Escape');
    out.push('typing guard');
    return out.join(', ');
  });
}
