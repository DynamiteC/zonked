import { arch, type CategorySpec } from '../dsl';

export const VIBES: CategorySpec = {
  category: 'vibes',
  prefix: 'vibe',
  adjectives: ['Neon', 'Cozy', 'Mellow', 'Golden', 'Hazy', 'Crisp', 'Cloudy', 'Dusty', 'Amber', 'Breezy', 'Sleepy', 'Plush'],
  nouns: ['Cafe', 'Rooftop', 'Cassette', 'Window', 'Terrace', 'Playlist', 'Sunday', 'Skyline', 'Studio', 'Porch', 'Alley', 'Lounge'],
  archs: [
    arch({
      slug: 'lofi-study', shape: 'plateau', from: 12, to: 10, mins: [25, 45, 60], carriers: [180, 200, 220],
      modes: ['isochronic', 'monaural', 'binaural'], noises: [['pink', 0.1]], layers: [['lofi', 'crackle', 'pluck'], ['lofi', 'pluck'], ['lofi', 'pad']],
      vibes: ['lofi', 'warm'], situations: ['deep-work', 'ai-burnout', 'quick-reset'], intensity: 2, gain: 0.42, count: 6,
      reason: 'Warm lo-fi bed with a soft pluck for easy, steady company.',
    }),
    arch({
      slug: 'warm-glow', shape: 'plateau', from: 11, to: 9, mins: [20, 30, 45], carriers: [170, 190], modes: ['binaural', 'monaural'],
      noises: [['pink', 0.12], ['off', 0]], layers: [['pad', 'lofi'], ['pad']], vibes: ['warm', 'calm'], situations: ['quick-reset', 'ai-burnout'],
      intensity: 1, gain: 0.4, count: 4, reason: 'A warm pad and a gentle alpha pulse for a soft landing.',
    }),
    arch({
      slug: 'bright-air', shape: 'plateau', from: 13, to: 12, mins: [20, 30], carriers: [210, 240], modes: ['isochronic', 'binaural'],
      noises: [['off', 0]], layers: [['chimes', 'pluck'], ['bell']], vibes: ['bright', 'energized'], situations: ['deep-work', 'quick-reset'],
      intensity: 3, gain: 0.42, count: 4, reason: 'Airy bells over a light alpha-beta border.',
    }),
    arch({
      slug: 'ether-float', shape: 'wave', from: 10, to: 6, mins: [20, 30, 45], carriers: [160, 190], modes: ['binaural', 'monaural'],
      noises: [['pink', 0.15]], layers: [['pad', 'chimes'], ['bell', 'pad']], vibes: ['ethereal', 'dreamy', 'deep'], situations: ['quick-reset', 'heal-stress'],
      intensity: 2, gain: 0.4, count: 4, reason: 'Slow swells with chimes for a floating, spacious mood.',
    }),
    arch({
      slug: 'minimal-hum', shape: 'plateau', from: 10, to: 10, mins: [15, 30, 60], carriers: [200, 220], modes: ['isochronic', 'monaural'],
      noises: [['pink', 0.3], ['brown', 0.3]], layers: [[]], vibes: ['minimal', 'grounded'], situations: ['deep-work', 'ai-burnout'],
      intensity: 1, gain: 0.4, count: 4, jitter: 0, reason: 'Just a pulse and a noise bed, nothing to attend to.',
    }),
    arch({
      slug: 'spark-groove', shape: 'plateau', from: 14, to: 16, mins: [20, 25, 30], carriers: [220, 240, 260], modes: ['isochronic', 'binaural'],
      noises: [['off', 0]], layers: [['perc', 'pluck'], ['perc', 'lofi']], vibes: ['energized', 'bright'], situations: ['deep-work', 'quick-reset'],
      intensity: 3, gain: 0.42, count: 4, reason: 'A light groove with soft percussion for a bright, steady lift.',
    }),
  ],
};
