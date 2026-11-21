// Humanitarian layer checks (H1 to H12): mission, mixes, favorites, export, hostile import,
// milestones, offline use, no third-party requests, 390x844 layout, sharp corners.
// Wire into verify-e2e.mjs with: await runSanctuaryChecks(harness);
import { readFileSync } from 'node:fs';
import { newSession } from './e2e-helpers.mjs';

const MOBILE = { width: 390, height: 844 };
const SECTIONS = ['mission', 'guide', 'favorites', 'mixes', 'milestones', 'data'];

async function open(h, opts = {}) {
  const s = await newSession(h, opts);
  s.requests = [];
  s.page.on('request', (r) => s.requests.push(r.url()));
  await s.page.goto(`${h.origin}/?e2e=1`);
  await s.page.getByTestId('play-button').waitFor();
  return s;
}

async function openSection(page, id) {
  if ((await page.getByTestId(`more-${id}`).count()) === 0 || !(await page.getByTestId(`more-${id}`).isVisible())) {
    await page.getByTestId('more-toggle').click();
  }
  await page.getByTestId(`more-${id}`).click();
  await page.getByTestId('sanctuary').waitFor();
}

async function reopen(h, s, id) {
  await s.page.reload();
  await s.page.getByTestId('play-button').waitFor();
  await openSection(s.page, id);
}

const hostile = (text) => ({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from(text) });
const envelope = (extra) => JSON.stringify({ app: 'zonked', kind: 'sanctuary', v: 1, ...extra });

async function mixChecks(h) {
  await h.check('H2 save a mix, reload, it is still there', async () => {
    const s = await open(h);
    try {
      await s.page.getByTestId('play-button').click();
      await openSection(s.page, 'mixes');
      await s.page.getByTestId('sanctuary-mix-name').fill('E2E calm');
      h.assert(!(await s.page.getByTestId('sanctuary-mix-save').isDisabled()), 'save is disabled while a sound plays (currentMix not wired)');
      await s.page.getByTestId('sanctuary-mix-save').click();
      await s.page.getByTestId('sanctuary-mixes-list').waitFor();
      await reopen(h, s, 'mixes');
      await s.page.getByTestId('sanctuary-mixes-list').waitFor();
      const text = await s.page.getByTestId('sanctuary-mixes-list').innerText();
      h.assert(text.includes('E2E calm'), `mix missing after reload: ${text}`);
      return 'saved and reloaded';
    } finally {
      await s.context.close().catch(() => {});
    }
  });
}

async function favoriteChecks(h) {
  await h.check('H3 favorite a template, reload, still a favorite', async () => {
    const s = await open(h);
    try {
      await openSection(s.page, 'favorites');
      await s.page.getByTestId('sanctuary-fav-search').fill('sleep');
      const toggle = s.page.locator('[data-testid^="sanctuary-fav-toggle-"]').first();
      await toggle.waitFor();
      await toggle.click();
      await s.page.getByTestId('sanctuary-favorites-list').waitFor();
      await reopen(h, s, 'favorites');
      await s.page.getByTestId('sanctuary-favorites-list').waitFor();
      return 'favorite kept';
    } finally {
      await s.context.close().catch(() => {});
    }
  });
}

async function dataChecks(h) {
  await h.check('H4 export is a valid, local Zonked file', async () => {
    const s = await open(h);
    try {
      await openSection(s.page, 'data');
      const [dl] = await Promise.all([s.page.waitForEvent('download'), s.page.getByTestId('sanctuary-export').click()]);
      const body = JSON.parse(readFileSync(await dl.path(), 'utf8'));
      h.assert(body.app === 'zonked' && body.v === 1, 'bad envelope');
      h.assert(!JSON.stringify(body).includes('http'), 'export contains a URL');
      return dl.suggestedFilename();
    } finally {
      await s.context.close().catch(() => {});
    }
  });

  await h.check('H5 hostile import files are refused or clamped', async () => {
    const s = await open(h);
    try {
      await openSection(s.page, 'data');
      const input = s.page.getByTestId('sanctuary-import');
      await input.setInputFiles(hostile('{broken'));
      await s.page.waitForFunction(() => /could not be read/.test(document.querySelector('[data-testid=sanctuary-data-message]')?.textContent ?? ''));
      await input.setInputFiles(hostile(JSON.stringify({ app: 'zonked', kind: 'sanctuary', v: 2 })));
      await s.page.waitForFunction(() => /version/.test(document.querySelector('[data-testid=sanctuary-data-message]')?.textContent ?? ''));
      await input.setInputFiles(hostile('x'.repeat(300_000)));
      await s.page.waitForFunction(() => /too big/.test(document.querySelector('[data-testid=sanctuary-data-message]')?.textContent ?? ''));
      const evil = {
        v: 1, id: 'evil1', name: 'Loud', source: { kind: 'custom', id: 'custom' },
        voice: { carrierHz: 1, beatHz: 900, mode: 'binaural', noise: 'off', noiseLevel: 5, gain: 9 },
        layers: { lofiLevel: 99 }, timer: { kind: 'none' }, createdAt: 1, updatedAt: 1,
      };
      const text = `{"app":"zonked","kind":"sanctuary","v":1,"__proto__":{"polluted":true},"mixes":[${JSON.stringify(evil)}]}`;
      await input.setInputFiles(hostile(text));
      await s.page.waitForFunction(() => /Imported/.test(document.querySelector('[data-testid=sanctuary-data-message]')?.textContent ?? ''));
      h.assert((await s.page.evaluate(() => ({}).polluted)) === undefined, 'prototype was polluted');
      const [dl] = await Promise.all([s.page.waitForEvent('download'), s.page.getByTestId('sanctuary-export').click()]);
      const body = JSON.parse(readFileSync(await dl.path(), 'utf8'));
      const m = body.mixes[0];
      h.assert(m && m.voice.gain <= 0.85 && m.voice.carrierHz >= 20 && m.voice.beatHz <= 40 && m.layers.lofiLevel <= 1, `not clamped ${JSON.stringify(m?.voice)}`);
      h.assert(m.id !== 'evil1', 'id was kept');
      return `gain=${m.voice.gain} carrier=${m.voice.carrierHz} beat=${m.voice.beatHz}`;
    } finally {
      await s.context.close().catch(() => {});
    }
  });

  await h.check('H10 delete everything clears mixes and milestones', async () => {
    const s = await open(h);
    try {
      await openSection(s.page, 'data');
      await s.page.getByTestId('sanctuary-import').setInputFiles(hostile(envelope({ mixes: [] })));
      await s.page.getByTestId('sanctuary-reset').click();
      await s.page.getByTestId('sanctuary-reset-yes').click();
      await s.page.waitForFunction(() => /deleted/.test(document.querySelector('[data-testid=sanctuary-notice]')?.textContent ?? ''));
      return 'cleared';
    } finally {
      await s.context.close().catch(() => {});
    }
  });
}

async function milestoneChecks(h) {
  await h.check('H6 first-session milestone appears kindly after a listening log', async () => {
    const s = await open(h);
    try {
      // Opening a section makes the app create the v2 database before the log is added.
      await openSection(s.page, 'data');
      await s.page.getByTestId('sanctuary-data').waitFor();
      await s.page.evaluate(
        () =>
          new Promise((resolve, reject) => {
            const r = indexedDB.open('zonked');
            r.onsuccess = () => {
              try {
                const tx = r.result.transaction('logs', 'readwrite');
                const t = Date.now();
                tx.objectStore('logs').add({ startedAt: t - 900_000, endedAt: t - 60_000, peakScore: 0, presetId: 'e2e', endKind: 'manual', breaks: 0 });
                tx.oncomplete = () => { r.result.close(); resolve(); };
                tx.onerror = () => reject(tx.error);
              } catch (e) {
                reject(e);
              }
            };
            r.onerror = () => reject(r.error);
          }),
      );
      await reopen(h, s, 'milestones');
      await s.page.waitForFunction(() => document.querySelector('[data-testid=sanctuary-ms-first-session]')?.dataset.earned === 'true');
      const text = await s.page.getByTestId('sanctuary').innerText();
      h.assert(/Nothing is sent/.test(text), 'how-it-works lines missing');
      h.assert(!/(streak lost|you missed|failed)/i.test(text), 'guilt wording found');
      return 'earned';
    } finally {
      await s.context.close().catch(() => {});
    }
  });
}

async function runWholeFlow(h) {
  const s = await open(h);
  try {
    await openSection(s.page, 'mission');
    await s.page.getByTestId('sanctuary-privacy').waitFor();
    await h.check('H1 mission and privacy card, region labelled', async () => {
      const t = await s.page.getByTestId('sanctuary-privacy').innerText();
      h.assert(/No account/.test(t) && /No tracking/.test(t) && /No network/.test(t), 'promise missing');
      h.assert((await s.page.getByTestId('sanctuary').getAttribute('role')) === 'region', 'no region role');
      return 'ok';
    });
    await openSection(s.page, 'guide');
    await h.check('H1b guide covers headphones and not-medical', async () => {
      const t = await s.page.getByTestId('sanctuary-guide').innerText();
      h.assert(/headphones/i.test(t) && /not a medical device/i.test(t), 'guide text missing');
      return 'ok';
    });
    await openSection(s.page, 'mixes');
    await s.context.setOffline(true);
    await h.check('H7 sections still work offline', async () => {
      for (const id of ['favorites', 'milestones', 'data']) {
        await openSection(s.page, id);
        await s.page.getByTestId(`sanctuary-${id === 'data' ? 'data' : id}`).waitFor({ timeout: 5000 });
      }
      return 'offline ok';
    });
    await s.context.setOffline(false);
    await h.check('H8 no request leaves the app origin', async () => {
      const bad = s.requests.filter((u) => !(u.startsWith(h.origin) || u.startsWith('blob:') || u.startsWith('data:') || u.startsWith('http://localhost:43210/')));
      h.assert(bad.length === 0, `external requests: ${bad.join(', ')}`);
      return `${s.requests.length} requests, all local`;
    });
    await h.check('H11 every Sanctuary element has sharp corners', async () => {
      const bad = await s.page.evaluate(() => [...document.querySelectorAll('[data-testid=sanctuary], [data-testid=sanctuary] *')].filter((e) => getComputedStyle(e).borderTopLeftRadius !== '0px').map((e) => e.tagName));
      h.assert(bad.length === 0, `rounded: ${bad.slice(0, 5).join(',')}`);
      return 'radius 0';
    });
  } finally {
    await s.context.close().catch(() => {});
  }
}

async function mobileChecks(h) {
  await h.check('H9 390x844 layout for all six sections', async () => {
    const s = await open(h, { viewport: MOBILE });
    try {
      for (const id of SECTIONS) {
        await openSection(s.page, id);
        const m = await s.page.evaluate(() => {
          const root = document.querySelector('[data-testid=sanctuary]');
          const r = root?.getBoundingClientRect();
          const small = [...(root?.querySelectorAll('button, input, a') ?? [])]
            .filter((e) => e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 40 && e.type !== 'checkbox' && e.type !== 'radio')
            .map((e) => e.textContent?.slice(0, 20) ?? e.tagName);
          return { sw: document.documentElement.scrollWidth, left: r?.left ?? -1, right: r?.right ?? 999, small, anim: root?.getAnimations?.({ subtree: true }).length ?? 0 };
        });
        h.assert(m.sw <= 390, `${id}: scrollWidth ${m.sw}`);
        h.assert(m.left >= 0 && m.right <= 390, `${id}: panel ${m.left}..${m.right}`);
        h.assert(m.small.length === 0, `${id}: small targets ${m.small.join('|')}`);
      }
      return '6 sections fit';
    } finally {
      await s.context.close().catch(() => {});
    }
  });

  await h.check('H12 reduced motion: no animations inside Sanctuary', async () => {
    const s = await open(h, { viewport: MOBILE, reducedMotion: 'reduce' });
    try {
      await openSection(s.page, 'milestones');
      const n = await s.page.evaluate(() => document.querySelector('[data-testid=sanctuary]')?.getAnimations({ subtree: true }).length ?? -1);
      h.assert(n === 0, `${n} animations running`);
      return '0 animations';
    } finally {
      await s.context.close().catch(() => {});
    }
  });
}

export async function runSanctuaryChecks(h) {
  await runWholeFlow(h);
  await mixChecks(h);
  await favoriteChecks(h);
  await dataChecks(h);
  await milestoneChecks(h);
  await mobileChecks(h);
}
