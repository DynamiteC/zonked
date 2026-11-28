// Shared helpers for the library-era e2e checks (10 to 20).
import { setTimeout as sleep } from 'node:timers/promises';

export { sleep };
export const MAX_PEAK = 0.95 + 1e-6;
export const SITUATIONS = ['adhd-focus', 'cant-sleep', 'lucid-dream', 'meditate', 'heal-stress', 'ai-burnout', 'deep-work', 'quick-reset'];
export const ZERO_LAYERS = { lofiLevel: 0, crackle: 0, instLevel: 0, padLevel: 0, chimeLevel: 0, percLevel: 0 };

const INIT = ({ crew, studio }) => {
  if (studio) localStorage.setItem('zonked.safety.v1', '1');
  if (studio && localStorage.getItem('zonked.theme.v1') === null) localStorage.setItem('zonked.theme.v1', 'studio');
  if (crew) localStorage.setItem('zonked.crew.v1', '1');
  window.__csp = [];
  document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  window.__msh = {};
  const proto = window.MediaSession && window.MediaSession.prototype;
  if (proto) {
    const orig = proto.setActionHandler;
    proto.setActionHandler = function (a, h) {
      window.__msh[a] = h;
      return orig.call(this, a, h);
    };
  }
};

/** opts.crew sets the crew opt-in key before any page script runs. Studio is the default front door here, opts.calm leaves the app on its own default (Calm) and does not pre-accept the safety notice. */
export async function newSession(h, { crew, calm, ...opts } = {}) {
  const context = await h.browser.newContext({ viewport: { width: 1280, height: 720 }, ...opts });
  await context.addInitScript(INIT, { crew: Boolean(crew), studio: !calm });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${m.text()} @ ${m.location().url}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror ${e.message}`));
  return { context, page, errors };
}

/**
 * Worklet stats are cumulative since the worklet started (peak is a running max, rms is a running mean).
 * This returns the max peak seen so far and the rms of just the sampled window, recovered from the
 * cumulative sum of squares (samples = 2 * frames for stereo).
 */
export const measure = (page, ms) =>
  page.evaluate(async (dur) => {
    const a = await window.__zonked.getStats();
    await new Promise((r) => setTimeout(r, dur));
    const b = await window.__zonked.getStats();
    const n1 = a.frames * 2;
    const n2 = b.frames * 2;
    const sq = b.rms * b.rms * n2 - a.rms * a.rms * n1;
    const rms = n2 > n1 && sq > 0 ? Math.sqrt(sq / (n2 - n1)) : 0;
    return { peak: b.peak, rms };
  }, ms);

/** Polls until the rms of two successive 500 ms windows agrees within 2 percent (ramp settled), at most 20 s. */
export async function settle(page) {
  let prev = -1;
  for (let i = 0; i < 40; i++) {
    const { rms } = await measure(page, 500);
    if (prev > 0 && rms > 0 && Math.abs(rms - prev) / prev < 0.02) return;
    prev = rms;
  }
}

export const blur = (page) => page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
export const press = async (page, key) => {
  await blur(page);
  await page.keyboard.press(key);
};
export const state = (page) => page.getByTestId('engine-status').getAttribute('data-state');
export const num = async (page, id) => parseFloat(await page.getByTestId(id).innerText());
export const tid = (page) => page.evaluate(() => window.__zonked.templateId);
export const nowPlaying = (page) => page.getByTestId('now-playing').innerText();
/** Waits for the play button label; for 'Play' also waits until the engine has fully stopped. */
export const playLabel = async (page, l) => {
  await page.waitForFunction((x) => document.querySelector('[data-testid=play-button]').textContent === x, l, { timeout: 20000 });
  if (l === 'Play') await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]').dataset.state !== 'running', null, { timeout: 20000 });
};

export async function startPlaying(page) {
  if ((await page.getByTestId('play-button').innerText()) === 'Play') await page.getByTestId('play-button').click();
  await page.waitForFunction(() => document.querySelector('[data-testid=engine-status]')?.dataset.state === 'running');
  await page.waitForFunction(async () => (await window.__zonked.getStats()).peak > 0.02);
}

/** Opens the Advanced section once. The open state is persisted, so one click per browser context is enough. */
export async function openAdvanced(page) {
  const t = page.getByTestId('advanced-toggle');
  await t.waitFor();
  if ((await t.getAttribute('aria-expanded')) !== 'true') await t.click();
}

/** Clicks a menu item that lives in the More menu (opens the menu first when the item is not shown). */
export async function openMore(page, testId) {
  if (!(await page.getByTestId(testId).isVisible().catch(() => false))) await page.getByTestId('more-toggle').click();
  await page.getByTestId(testId).click();
}

export async function openPanel(page, toggle, panel) {
  if (!(await page.getByTestId(panel).isVisible().catch(() => false))) await openMore(page, toggle);
  await page.getByTestId(panel).waitFor();
}
