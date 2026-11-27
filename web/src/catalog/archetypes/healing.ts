import { arch, type CategorySpec } from '../dsl';

export const HEALING: CategorySpec = {
  category: 'healing',
  prefix: 'healing',
  adjectives: ['Mending', 'Tender', 'Restoring', 'Kind', 'Balmy', 'Soothing', 'Renewing', 'Warming', 'Settled', 'Easing', 'Gentle', 'Whole'],
  nouns: ['Balm', 'Spring', 'Embrace', 'Garden', 'Shelter', 'Glow', 'Rain', 'Hearth', 'Sunrise', 'Quilt', 'Oasis', 'Haven'],
  archs: [
    arch({
      slug: 'tension-release', shape: 'ramp-down', from: 14, to: 8, mins: [15, 20, 30], carriers: [180, 200, 220],
      modes: ['binaural', 'isochronic', 'monaural'], noises: [['pink', 0.2]], layers: [['piano', 'pad'], ['pluck'], ['pad', 'chimes']],
      vibes: ['warm', 'calm'], situations: ['heal-stress', 'ai-burnout', 'quick-reset'], intensity: 2, gain: 0.42, count: 5,
      reason: 'Starts at a busier pace and slows to a relaxed one over {minutes} minutes.',
    }),
    arch({
      slug: 'restore-theta', shape: 'plateau', from: 9, to: 6, mins: [20, 30, 45], carriers: [160, 180], modes: ['binaural', 'monaural'],
      noises: [['brown', 0.2]], layers: [['drone'], ['pad'], ['bell']], vibes: ['deep', 'warm', 'ethereal'], situations: ['heal-stress', 'meditate'],
      intensity: 2, gain: 0.4, count: 5, reason: 'Steady theta with a soft drone.',
    }),
    arch({
      slug: 'heart-calm', shape: 'plateau', from: 10, to: 7.5, ret: 10, mins: [10, 15, 20], carriers: [190, 210], modes: ['binaural', 'isochronic'],
      noises: [['off', 0], ['pink', 0.15]], layers: [['pad', 'pluck'], ['pad']], vibes: ['warm', 'grounded'], situations: ['heal-stress', 'quick-reset', 'ai-burnout'],
      intensity: 2, gain: 0.42, count: 4, breath: { inSec: 5, outSec: 5 }, reason: 'A slow rhythm of 6 breaths per minute to follow.',
    }),
    arch({
      slug: 'ache-ease', shape: 'wave', from: 10, to: 7, mins: [30, 45, 60], carriers: [150, 170], modes: ['monaural', 'binaural'],
      noises: [['brown', 0.3]], layers: [['pad'], []], vibes: ['calm', 'warm'], situations: ['heal-stress'],
      intensity: 1, gain: 0.38, count: 4, reason: 'Slow alpha-theta swells that feel like a rocking tide.',
    }),
    arch({
      slug: 'soothe-glide', shape: 'ramp-down', from: 12, to: 6, mins: [20, 30], carriers: [170, 190], modes: ['binaural', 'monaural'],
      noises: [['pink', 0.25]], layers: [['pad', 'chimes'], ['bell']], vibes: ['ethereal', 'calm'], situations: ['heal-stress', 'meditate'],
      intensity: 2, gain: 0.4, count: 4, reason: 'A soft pad with a gliding beat.',
    }),
    arch({
      slug: 'sunrise-lift', shape: 'ramp-up', from: 7, to: 11, mins: [15, 20, 30], carriers: [190, 210, 230], modes: ['binaural', 'isochronic'],
      noises: [['off', 0]], layers: [['pluck', 'pad'], ['bell']], vibes: ['bright', 'warm'], situations: ['heal-stress', 'quick-reset'],
      intensity: 2, gain: 0.42, count: 4, reason: 'A gentle brightening ramp that stays soft.',
    }),
  ],
};
