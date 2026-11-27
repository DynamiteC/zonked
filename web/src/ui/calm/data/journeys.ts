import type { Journey, JourneyDay } from './types';

/** Variant counts per family, from docs/UX-SPEC.md section d. Verified against the catalog by tests. */
const FAMILY_COUNTS: Readonly<Record<string, number>> = {
  'sleep-onset-delta': 6,
  'sleep-drift-theta': 5,
  'sleep-deep-delta': 5,
  'recovery-lofi-unwind': 5,
  'recovery-post-sprint': 4,
  'recovery-micro-break': 4,
  'focus-alpha-beta': 5,
  'focus-sprint-pulse': 4,
  'focus-deep-beta': 5,
  'adhd-smr-steady': 5,
  'adhd-beta-anchor': 5,
  'vibe-warm-glow': 4,
  'healing-soothe-glide': 4,
  'meditation-alpha-sit': 5,
  'meditation-breath-pacer': 4,
};

const REST: JourneyDay = Object.freeze({ kind: 'rest', family: '', variants: Object.freeze([]) });

function variantsOf(family: string): readonly string[] {
  const n = FAMILY_COUNTS[family] ?? 0;
  const ids: string[] = [];
  for (let i = 1; i <= n; i += 1) ids.push(`${family}-${String(i).padStart(2, '0')}`);
  return Object.freeze(ids);
}

function day(family: string): JourneyDay {
  return Object.freeze({ kind: 'session', family, variants: variantsOf(family) });
}

/** Plan string: family names, with "rest" for a rest day. */
function plan(...items: readonly string[]): readonly JourneyDay[] {
  return Object.freeze(items.map((f) => (f === 'rest' ? REST : day(f))));
}

const rep = (family: string, n: number): readonly string[] => Array.from({ length: n }, () => family);

const make = (j: Journey): Journey => Object.freeze(j);

export const JOURNEYS: readonly Journey[] = Object.freeze([
  make({
    id: 'calm-evenings',
    title: '7 Calm Evenings',
    blurb: '7 short evenings of slow sound. About 20 minutes each.',
    situation: 'heal-stress',
    vibe: 'calm',
    minutes: 20,
    days: plan('healing-soothe-glide', 'meditation-breath-pacer', 'vibe-warm-glow', 'rest',
      'meditation-alpha-sit', 'recovery-lofi-unwind', 'healing-soothe-glide'),
  }),
  make({
    id: 'focus-mornings',
    title: '5 Focus Mornings',
    blurb: '5 mornings of steady sound to start work. About 30 minutes each.',
    situation: 'deep-work',
    vibe: 'bright',
    minutes: 30,
    days: plan('focus-alpha-beta', 'focus-alpha-beta', 'focus-sprint-pulse', 'rest', 'focus-deep-beta'),
  }),
  make({
    id: 'easier-sleep',
    title: '14 Nights to Easier Sleep',
    blurb: '14 nights of slow sound for winding down. Rest nights included.',
    situation: 'cant-sleep',
    vibe: 'dreamy',
    minutes: 45,
    days: plan(...rep('sleep-drift-theta', 4), 'rest', ...rep('sleep-onset-delta', 4), 'rest',
      ...rep('sleep-deep-delta', 3), 'sleep-onset-delta'),
  }),
  make({
    id: 'study-sprint',
    title: 'Study Sprint Week',
    blurb: 'A week of short study blocks with breaks. About 25 minutes each.',
    situation: 'deep-work',
    vibe: 'minimal',
    minutes: 25,
    days: plan('focus-sprint-pulse', 'focus-alpha-beta', 'recovery-micro-break', 'focus-sprint-pulse',
      'rest', 'focus-alpha-beta', 'meditation-alpha-sit'),
  }),
  make({
    id: 'after-work-reset',
    title: 'After-Work Reset',
    blurb: '5 evenings to step out of work mode. About 20 minutes each.',
    situation: 'ai-burnout',
    vibe: 'warm',
    minutes: 20,
    days: plan('recovery-post-sprint', 'recovery-lofi-unwind', 'recovery-micro-break', 'rest', 'recovery-lofi-unwind'),
  }),
  make({
    id: 'gentle-routine',
    title: 'Gentle Routine',
    blurb: 'Gentle routine for steady attention. About 25 minutes each.',
    situation: 'adhd-focus',
    vibe: 'grounded',
    minutes: 25,
    days: plan('adhd-smr-steady', 'recovery-micro-break', 'adhd-smr-steady', 'rest', 'adhd-beta-anchor',
      'recovery-micro-break', 'adhd-smr-steady'),
  }),
]);

export function getJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}
