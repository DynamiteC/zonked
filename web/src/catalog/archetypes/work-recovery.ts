import { arch, type CategorySpec } from '../dsl';

/** Recovery from long AI-assisted coding sessions and screen fatigue. */
export const WORK_RECOVERY: CategorySpec = {
  category: 'work-recovery',
  prefix: 'recovery',
  adjectives: ['Unplugged', 'Offline', 'Cooled', 'Rested', 'Idle', 'Paused', 'Unwound', 'Mellow', 'Eased', 'Reset', 'Spare', 'Soft'],
  nouns: ['Break', 'Commit', 'Cooldown', 'Terminal', 'Standup', 'Branch', 'Window', 'Stretch', 'Merge', 'Buffer', 'Release', 'Cache'],
  archs: [
    arch({
      slug: 'screen-down', shape: 'ramp-down', from: 18, to: 8, mins: [10, 15, 20], carriers: [200, 220], modes: ['binaural', 'monaural', 'isochronic'],
      noises: [['pink', 0.2]], layers: [['lofi', 'pad'], ['pad'], ['lofi']], vibes: ['calm', 'lofi', 'warm'], situations: ['ai-burnout', 'quick-reset'],
      intensity: 2, gain: 0.42, count: 5, reason: 'Steps your brain down from beta to alpha after a long review or generation run.',
    }),
    arch({
      slug: 'micro-break', shape: 'plateau', from: 11, to: 8.5, ret: 11, mins: [5, 8, 10], carriers: [190, 210], modes: ['isochronic', 'binaural'],
      noises: [['off', 0], ['pink', 0.15]], layers: [['chimes'], ['pad', 'chimes']], vibes: ['bright', 'calm'], situations: ['quick-reset', 'ai-burnout'],
      intensity: 2, gain: 0.4, count: 4, reason: 'A {minutes} minute reset that lowers tension and brings you back alert.',
    }),
    arch({
      slug: 'post-sprint', shape: 'ramp-down', from: 20, to: 6, mins: [15, 20, 30], carriers: [200, 220], modes: ['binaural', 'monaural'],
      noises: [['brown', 0.25]], layers: [['pad'], ['drone', 'chimes']], vibes: ['deep', 'grounded'], situations: ['ai-burnout', 'heal-stress'],
      intensity: 2, gain: 0.4, count: 4, reason: 'A long fall from high beta to theta after an intense push.',
    }),
    arch({
      slug: 'eye-rest', shape: 'plateau', from: 10, to: 8, mins: [5, 10, 15], carriers: [180, 200], modes: ['monaural', 'isochronic'],
      noises: [['pink', 0.2]], layers: [['pad'], ['chimes']], vibes: ['calm', 'minimal'], situations: ['ai-burnout', 'quick-reset'],
      intensity: 1, gain: 0.38, count: 4, breath: { inSec: 4, outSec: 6 }, reason: 'Close your eyes and follow a slow 4-in, 6-out breath.',
    }),
    arch({
      slug: 'lofi-unwind', shape: 'plateau', from: 10, to: 9, mins: [15, 25, 40], carriers: [180, 200, 220], modes: ['isochronic', 'binaural', 'monaural'],
      noises: [['pink', 0.1]], layers: [['lofi', 'crackle', 'pluck'], ['lofi', 'pad']], vibes: ['lofi', 'warm'], situations: ['ai-burnout', 'heal-stress', 'quick-reset'],
      intensity: 1, gain: 0.4, count: 5, reason: 'Slow lo-fi bed to decompress while you do something light.',
    }),
    arch({
      slug: 'commute-decompress', shape: 'ramp-down', from: 14, to: 9, mins: [15, 20, 30], carriers: [200, 230], modes: ['isochronic', 'monaural'],
      noises: [['pink', 0.15]], layers: [['pluck'], ['lofi', 'pluck']], vibes: ['grounded', 'warm', 'minimal'], situations: ['ai-burnout', 'quick-reset', 'heal-stress'],
      intensity: 2, gain: 0.42, count: 4, reason: 'Closes the work day with a calm descent that works over speakers.',
    }),
  ],
};
