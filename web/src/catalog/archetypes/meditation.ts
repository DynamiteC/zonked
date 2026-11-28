import { arch, type CategorySpec } from '../dsl';

export const MEDITATION: CategorySpec = {
  category: 'meditation',
  prefix: 'meditation',
  adjectives: ['Open', 'Rooted', 'Sacred', 'Luminous', 'Patient', 'Clear', 'Boundless', 'Inner', 'Mindful', 'Sunlit', 'Hallowed', 'Silent'],
  nouns: ['Cushion', 'Temple', 'Breath', 'Mountain', 'Lotus', 'Stillpoint', 'Horizon', 'Sanctuary', 'River', 'Candle', 'Grove', 'Bowl'],
  archs: [
    arch({
      slug: 'alpha-sit', shape: 'plateau', from: 12, to: 9.5, ret: 11, mins: [10, 15, 20, 30], carriers: [180, 200, 220],
      modes: ['binaural', 'monaural', 'isochronic'], noises: [['pink', 0.15], ['off', 0]], layers: [['chimes'], ['bell'], []],
      vibes: ['calm', 'grounded', 'warm'], situations: ['meditate', 'quick-reset', 'heal-stress'], intensity: 2, gain: 0.42, count: 5,
      reason: '{tone} calm and wide awake for a {minutes} minute seated sit.',
    }),
    arch({
      slug: 'theta-descent', shape: 'ramp-down', from: 10, to: 5, mins: [20, 30, 45], carriers: [160, 180], modes: ['binaural', 'monaural'],
      noises: [['brown', 0.2]], layers: [['drone'], ['drone', 'chimes']], vibes: ['deep', 'ethereal'], situations: ['meditate'],
      intensity: 2, gain: 0.4, count: 5, reason: 'Glides from alpha to theta.',
    }),
    arch({
      slug: 'schumann-hold', shape: 'plateau', from: 12, to: 7.83, ret: 12, mins: [20, 30], carriers: [180, 200], modes: ['binaural', 'monaural'],
      noises: [['pink', 0.15]], layers: [['piano'], ['bell']], vibes: ['grounded', 'deep'], situations: ['meditate', 'heal-stress'],
      intensity: 2, gain: 0.42, count: 4, jitter: 0, reason: 'Rests on the 7.83 Hz Schumann resonance, then returns to wakefulness.',
    }),
    arch({
      slug: 'breath-pacer', shape: 'plateau', from: 9, to: 6.5, mins: [10, 15, 20], carriers: [170, 190], modes: ['isochronic', 'monaural'],
      noises: [['off', 0]], layers: [['chimes'], ['pad']], vibes: ['calm', 'minimal'], situations: ['meditate', 'quick-reset'],
      intensity: 2, gain: 0.4, count: 4, breath: { inSec: 5.45, outSec: 5.45 }, reason: 'Pair the 5.5 breaths per minute pacer with a slow theta pulse.',
    }),
    arch({
      slug: 'bell-silence', shape: 'plateau', from: 10, to: 8, mins: [15, 20, 30], carriers: [190, 210], modes: ['binaural', 'monaural'],
      noises: [['off', 0]], layers: [['chimes'], ['bell'], ['pluck', 'chimes']], vibes: ['ethereal', 'bright', 'calm'], situations: ['meditate', 'heal-stress'],
      intensity: 1, gain: 0.4, count: 4, reason: 'Sparse chimes over a quiet alpha-theta border.',
    }),
    arch({
      slug: 'delta-glide', shape: 'ramp-down', from: 6, to: 3, mins: [30, 45, 60], carriers: [130, 150], modes: ['binaural', 'monaural'],
      noises: [['brown', 0.25]], layers: [['drone']], vibes: ['deep', 'minimal'], situations: ['meditate', 'heal-stress'],
      intensity: 2, gain: 0.38, count: 4, reason: 'A long fall into delta.',
    }),
  ],
};
