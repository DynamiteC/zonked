import { arch, type CategorySpec } from '../dsl';

export const LUCID_DREAMS: CategorySpec = {
  category: 'lucid-dreams',
  prefix: 'lucid',
  adjectives: ['Waking', 'Silver', 'Nebula', 'Astral', 'Twilight', 'Aware', 'Hollow', 'Starlit', 'Liminal', 'Vivid', 'Opal', 'Drifting'],
  nouns: ['Gate', 'Compass', 'Mirror', 'Skyway', 'Threshold', 'Door', 'Voyage', 'Lens', 'Bridge', 'Beacon', 'Garden', 'Orbit'],
  archs: [
    arch({
      slug: 'wbtb-theta', shape: 'plateau', from: 9, to: 5, ret: 8, mins: [90, 120, 180], carriers: [160, 180, 200],
      modes: ['binaural', 'monaural'], noises: [['pink', 0.15]], layers: [['piano', 'pad'], ['pad', 'chimes']], vibes: ['dreamy', 'ethereal', 'deep'],
      situations: ['lucid-dream', 'cant-sleep'], intensity: 2, gain: 0.4, count: 6, reason: 'Theta plateau with a light return, built for wake-back-to-bed lucid practice.',
    }),
    arch({
      slug: 'rem-ladder', shape: 'ladder', from: 8, to: 4, mins: [60, 90, 120], carriers: [150, 170],
      modes: ['binaural', 'isochronic'], noises: [['brown', 0.2]], layers: [['pad'], ['drone']], vibes: ['deep', 'dreamy'],
      situations: ['lucid-dream'], intensity: 2, gain: 0.4, count: 5, reason: 'Steps down through theta in four stages.',
    }),
    arch({
      slug: 'aware-wave', shape: 'wave', from: 5, to: 8, mins: [60, 90], carriers: [160, 190], modes: ['binaural', 'monaural'],
      noises: [['pink', 0.15]], layers: [['pad', 'chimes'], ['bell']], vibes: ['ethereal', 'dreamy'], situations: ['lucid-dream'],
      intensity: 2, gain: 0.4, count: 5, reason: 'Slow swings between theta and alpha.',
    }),
    arch({
      slug: 'dream-drift', shape: 'ramp-down', from: 10, to: 4.5, mins: [30, 45, 60], carriers: [140, 160, 180],
      modes: ['binaural', 'isochronic', 'monaural'], noises: [['brown', 0.2], ['pink', 0.2]], layers: [['pad'], []],
      vibes: ['dreamy', 'calm', 'ethereal'], situations: ['lucid-dream', 'cant-sleep'], intensity: 1, gain: 0.4, count: 5,
      reason: 'A slow descent over {minutes} minutes.',
    }),
    arch({
      slug: 'astral-calm', shape: 'plateau', from: 10, to: 6, mins: [30, 45, 60], carriers: [170, 200], modes: ['binaural', 'monaural'],
      noises: [['pink', 0.2]], layers: [['drone'], ['bell']], vibes: ['ethereal', 'deep'], situations: ['lucid-dream', 'meditate'],
      intensity: 2, gain: 0.4, count: 5, reason: 'Relaxed theta with a slow instrument drone.',
    }),
  ],
};
