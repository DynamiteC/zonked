interface Hints {
  readonly deviceMemory?: number;
  readonly hardwareConcurrency?: number;
}

/** At or below these counts the device counts as low power. */
const LOW_MEMORY_GB = 2;
const LOW_CORES = 2;

/**
 * True when the mascot should skip the paint filter and the pointer parallax: the person asked for
 * less data or less motion, or the device reports little memory or few cores. Missing hints never count as low.
 */
export function isLowPower(): boolean {
  if (typeof window === 'undefined') return false;
  const q = (m: string): boolean => typeof window.matchMedia === 'function' && window.matchMedia(m).matches;
  if (q('(prefers-reduced-data: reduce)') || q('(prefers-reduced-motion: reduce)')) return true;
  const n: Hints = typeof navigator === 'undefined' ? {} : navigator;
  const mem = n.deviceMemory;
  const cores = n.hardwareConcurrency;
  return (typeof mem === 'number' && mem > 0 && mem <= LOW_MEMORY_GB) || (typeof cores === 'number' && cores > 0 && cores <= LOW_CORES);
}

/** A frame slower than this on average means the device cannot keep the paint filter and parallax going. */
export const SLOW_FRAME_MS = 20;
const WINDOW_FRAMES = 40;
const SKIP_FRAMES = 8;
const MAX_WINDOWS = 4;
/** A gap this long is a hidden tab or a pause, not a slow frame. */
const PAUSE_GAP_MS = 250;

/** True when the mean of the frame gaps is over the limit. Gaps from a paused tab are left out. */
export function framesTooSlow(gaps: readonly number[], limit: number = SLOW_FRAME_MS): boolean {
  const live = gaps.filter((g) => Number.isFinite(g) && g > 0 && g < PAUSE_GAP_MS);
  if (live.length < WINDOW_FRAMES / 2) return false;
  return live.reduce((a, b) => a + b, 0) / live.length > limit;
}

let sawSlow = false;
/** The decision lasts for the page visit, so a slow phone is not asked to try again on every screen. */
export const slowDeviceSeen = (): boolean => sawSlow;
export const resetSlowDeviceForTests = (): void => {
  sawSlow = false;
};

/**
 * Times the first few windows of animation frames. When a window averages over 20 ms it calls onSlow once and stops.
 * Stops after a few good windows. Returns a function that cancels it. Does nothing without requestAnimationFrame.
 */
export function watchFrames(onSlow: () => void, raf: typeof requestAnimationFrame | undefined = typeof window === 'undefined' ? undefined : window.requestAnimationFrame?.bind(window)): () => void {
  if (raf === undefined || sawSlow) return () => undefined;
  let gaps: number[] = [];
  let prev = 0;
  let seen = 0;
  let windows = 0;
  let stopped = false;
  let handle = 0;
  const tick = (t: number): void => {
    if (stopped) return;
    if (prev > 0) {
      seen += 1;
      if (seen > SKIP_FRAMES) gaps.push(t - prev);
    }
    prev = t;
    if (gaps.length >= WINDOW_FRAMES) {
      if (framesTooSlow(gaps)) {
        sawSlow = true;
        stopped = true;
        onSlow();
        return;
      }
      gaps = [];
      windows += 1;
      if (windows >= MAX_WINDOWS) return;
    }
    handle = raf(tick);
  };
  handle = raf(tick);
  return () => {
    stopped = true;
    if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(handle);
  };
}
