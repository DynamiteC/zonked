import type { Template } from './types';

/** True when any stage plays the percussion layer. */
export function usesPercussion(t: Template): boolean {
  return t.stages.some((s) => (s.layers?.percLevel ?? 0) > 0);
}

/** True when any stage plays vinyl crackle. */
export function usesCrackle(t: Template): boolean {
  return t.stages.some((s) => (s.layers?.crackle ?? 0) > 0);
}

/** True when any stage is binaural (needs headphones). */
export function usesBinaural(t: Template): boolean {
  return t.stages.some((s) => s.mode === 'binaural');
}

export function maxBpmOfPercussion(t: Template): number {
  return t.stages.reduce((m, s) => ((s.layers?.percLevel ?? 0) > 0 ? Math.max(m, s.layers?.percBpm ?? 0) : m), 0);
}
