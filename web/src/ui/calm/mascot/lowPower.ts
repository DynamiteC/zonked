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
