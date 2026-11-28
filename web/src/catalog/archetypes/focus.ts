import { arch, type CategorySpec } from '../dsl';

export const FOCUS: CategorySpec = {
  category: 'focus',
  prefix: 'focus',
  adjectives: ['Sharp', 'Deep', 'Clear', 'Limpid', 'Bright', 'Keen', 'Locked', 'Precise', 'Crisp', 'Direct', 'Tuned', 'Honed'],
  nouns: ['Beam', 'Signal', 'Compass', 'Engine', 'Vector', 'Prism', 'Forge', 'Spire', 'Circuit', 'Current', 'Summit', 'Scope'],
  archs: [
    arch({
      slug: 'alpha-beta', shape: 'plateau', from: 11, to: 14, mins: [25, 45, 60], carriers: [200, 220, 240], modes: ['binaural', 'isochronic', 'monaural'],
      noises: [['pink', 0.15]], layers: [[], ['lofi'], ['pluck']], vibes: ['bright', 'minimal', 'grounded'], situations: ['deep-work', 'adhd-focus'],
      intensity: 2, gain: 0.42, count: 5, reason: 'A pulse on the alpha-beta border for {minutes} minutes.',
    }),
    arch({
      slug: 'deep-beta', shape: 'plateau', from: 15, to: 18, mins: [30, 45, 60, 90], carriers: [220, 240, 260], modes: ['binaural', 'isochronic'],
      noises: [['pink', 0.15], ['off', 0]], layers: [[], ['perc']], vibes: ['energized', 'bright'], situations: ['deep-work'],
      intensity: 3, gain: 0.42, count: 5, reason: 'A steady beta-band pulse for long work blocks.',
    }),
    arch({
      slug: 'gamma-edge', shape: 'ramp-up', from: 18, to: 35, mins: [10, 15, 20], carriers: [240, 260, 280], modes: ['isochronic', 'binaural'],
      noises: [['off', 0]], layers: [[]], vibes: ['energized', 'bright'], situations: ['deep-work'],
      intensity: 4, gain: 0.4, count: 4, reason: 'A short climb to the high-beta and low-gamma edge.',
    }),
    arch({
      slug: 'flow-ramp', shape: 'ramp-up', from: 10, to: 16, mins: [30, 45, 60], carriers: [210, 230], modes: ['binaural', 'monaural'],
      noises: [['pink', 0.12]], layers: [['pluck'], ['lofi', 'pluck']], vibes: ['warm', 'bright', 'lofi'], situations: ['deep-work', 'adhd-focus'],
      intensity: 2, gain: 0.42, count: 4, reason: 'A slow glide from alpha into beta.',
    }),
    arch({
      slug: 'reading-calm', shape: 'plateau', from: 10, to: 12, mins: [30, 45, 60], carriers: [190, 210], modes: ['binaural', 'monaural'],
      noises: [['brown', 0.2]], layers: [['piano'], []], vibes: ['calm', 'deep', 'warm'], situations: ['deep-work', 'meditate'],
      intensity: 1, gain: 0.4, count: 4, reason: 'Gentle alpha for reading and study.',
    }),
    arch({
      slug: 'sprint-pulse', shape: 'ladder', from: 12, to: 20, mins: [20, 25, 30], carriers: [220, 240], modes: ['isochronic', 'binaural'],
      noises: [['off', 0]], layers: [['perc'], ['perc', 'pluck']], vibes: ['energized', 'bright'], situations: ['deep-work', 'adhd-focus'],
      intensity: 3, gain: 0.4, count: 4, reason: 'Four rising steps with soft percussion.',
    }),
  ],
};
