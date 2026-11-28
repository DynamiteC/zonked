// Shared helpers for the e2e checks.
import { setTimeout as sleep } from 'node:timers/promises';

export { sleep };
export const MAX_PEAK = 0.95 + 1e-6;
export const SITUATIONS = ['adhd-focus', 'cant-sleep', 'lucid-dream', 'meditate', 'heal-stress', 'ai-burnout', 'deep-work', 'quick-reset'];
export const ZERO_LAYERS = { lofiLevel: 0, crackle: 0, instLevel: 0, padLevel: 0, chimeLevel: 0, percLevel: 0 };

const INIT = ({ crew, accepted }) => {
  // accepted pre-sets the safety notice flag for checks about sound, never for the safety checks themselves.
  if (accepted) localStorage.setItem('zonked.safety.v1', '1');
  if (crew) localStorage.setItem('zonked.crew.v1', '1');
  window.__csp = [];
  document.addEventListener('securitypolicyviolation', (e) => {
    const line = `${e.violatedDirective} ${e.blockedURI || 'inline'} ${(e.sample || '').slice(0, 60)}`;
    window.__csp.push(line);
    if (typeof window.__cspReport === 'function') window.__cspReport(line);
  });
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

/**
 * New browser context. By default the safety notice is pre-accepted so sound checks can start fast.
 * opts.calm leaves storage empty (the safety checks use it), opts.crew sets the crew opt-in key.
 */
export async function newSession(h, { crew, calm, ...opts } = {}) {
  const context = await h.browser.newContext({ viewport: { width: 1280, height: 720 }, ...opts });
  await context.exposeFunction('__cspReport', (line) => (h.cspViolations ??= []).push(line));
  await context.addInitScript(INIT, { crew: Boolean(crew), accepted: !calm });
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
/** Tab button by name. The Crew tab may be labelled Coding, so both are accepted. */
export const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: name === 'Crew' ? /^(Crew|Coding)$/ : name });
/** Engine state from the e2e hook: idle, running, stopped, failed. */
export const engineState = (page) => page.evaluate(() => window.__zonked?.status.state);

/** Opens the app (with the e2e hook), takes the skip path and waits until the Player shows. The safety notice is accepted when it shows. */
export async function skipToPlayer(page, origin) {
  await page.goto(`${origin}/?e2e=1`);
  await page.getByRole('button', { name: 'Skip, just play' }).click();
  const accept = page.getByTestId('calm-safety-accept');
  if (await accept.isVisible({ timeout: 1500 }).catch(() => false)) await accept.click();
  await page.getByTestId('player-toggle').waitFor();
}

/** Waits until sound is really running: engine state and a non-silent peak. */
export async function waitSound(page) {
  await page.waitForFunction(() => window.__zonked?.status.state === 'running', null, { timeout: 20000 });
  await page.waitForFunction(async () => (await window.__zonked.getStats()).peak > 0.02, null, { timeout: 20000 });
}

/** Sounds tab, search, play the first result. */
export async function playFound(page, text) {
  await nav(page, 'Sounds').click();
  await page.locator('#c-search-in').fill(text);
  await page.locator('.c-row-play').first().click();
  await page.getByTestId('player-toggle').waitFor();
}

/** Opens the Advanced section of Options, from any screen, through You > Open more controls. */
export async function openAdv(page) {
  if (!(await page.getByTestId('advanced-panels').isVisible().catch(() => false))) {
    await nav(page, 'You').click();
    await page.getByTestId('studio-switch').click();
    await page.getByTestId('advanced-panels').waitFor();
  }
}

/** Closes the Options sheet so the next step starts on a clean screen. */
export async function closeSheet(page) {
  await page.keyboard.press('Escape');
  await page.getByTestId('options-sheet').waitFor({ state: 'detached' }).catch(() => undefined);
}

/** Opens one Advanced section (details) by its label. */
export async function openSection(page, label) {
  const d = page.getByTestId(`adv-section-${label.toLowerCase().replace(/ /g, '-')}`);
  if ((await d.getAttribute('open')) === null) await d.locator('summary').click();
}

/** Closes the help Guide with its own Skip button when it is open. Keeps the real flow: no flag, no storage seed. */
export async function dismissGuide(page) {
  const skip = page.getByTestId('guide-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
}
