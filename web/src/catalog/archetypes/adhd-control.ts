import { arch, type CategorySpec } from '../dsl';

/** All ADHD archetypes are steady and low surprise: isochronic or beta/SMR, slow ramps, gentle percussion at 60-100 bpm. */
export const ADHD_CONTROL: CategorySpec = {
  category: 'adhd-control',
  prefix: 'adhd',
  adjectives: ['Steady', 'Anchored', 'Level', 'Even', 'Tidy', 'Calm', 'Focused', 'Plain', 'Settled', 'Patient', 'Smooth', 'Constant'],
  nouns: ['Anchor', 'Rail', 'Tracks', 'Rhythm', 'Metronome', 'Lane', 'Thread', 'Pulse', 'Desk', 'Checklist', 'Runway', 'Keel'],
  archs: [
    arch({
      slug: 'smr-steady', shape: 'plateau', from: 12, to: 13.5, mins: [20, 30, 45], carriers: [200, 220, 240],
      modes: ['isochronic', 'isochronic', 'monaural'], noises: [['pink', 0.18], ['brown', 0.2]], layers: [[], ['lofi']],
      vibes: ['minimal', 'grounded'], situations: ['adhd-focus', 'deep-work'], intensity: 2, gain: 0.42, count: 5, jitter: 0.4,
      reason: 'Steady SMR-range pulse with no changes to track, for {minutes} minutes.',
    }),
    arch({
      slug: 'beta-anchor', shape: 'plateau', from: 14, to: 16, mins: [25, 30, 45, 50], carriers: [210, 230, 250],
      modes: ['isochronic', 'monaural'], noises: [['pink', 0.15], ['off', 0]], layers: [[], ['lofi']], vibes: ['grounded', 'bright', 'minimal'],
      situations: ['adhd-focus', 'deep-work'], intensity: 3, gain: 0.42, count: 5, jitter: 0.5,
      reason: 'A constant low-beta pulse that never changes.',
    }),
    arch({
      slug: 'cadence-pulse', shape: 'plateau', from: 14, to: 15, mins: [20, 25, 30], carriers: [200, 220], modes: ['isochronic'],
      noises: [['pink', 0.12]], layers: [['perc'], ['perc', 'lofi']], vibes: ['energized', 'grounded'], situations: ['adhd-focus', 'deep-work'],
      intensity: 3, gain: 0.4, count: 4, reason: 'Gentle soft percussion at a fixed 60 to 100 bpm cadence keeps tempo without surprises.',
    }),
    arch({
      slug: 'quiet-bed', shape: 'plateau', from: 13, to: 13, mins: [30, 45, 60], carriers: [190, 210], modes: ['isochronic', 'monaural'],
      noises: [['brown', 0.3], ['pink', 0.25]], layers: [['lofi'], ['lofi', 'piano']], vibes: ['lofi', 'minimal', 'warm'], situations: ['adhd-focus', 'deep-work'],
      intensity: 2, gain: 0.4, count: 4, jitter: 0, reason: 'A fixed warm bed with nothing that changes, so it fades into the background.',
    }),
    arch({
      slug: 'start-ramp', shape: 'ramp-up', from: 11, to: 15, mins: [15, 20, 25], carriers: [200, 220], modes: ['isochronic', 'monaural'],
      noises: [['pink', 0.15]], layers: [[], ['pluck']], vibes: ['bright', 'energized'], situations: ['adhd-focus', 'quick-reset'],
      intensity: 2, gain: 0.42, count: 4, jitter: 0.2, reason: 'A slow climb from 4 Hz with no sudden steps.',
    }),
    arch({
      slug: 'sprint-steps', shape: 'ladder', from: 13, to: 16, mins: [20, 25, 30], carriers: [210, 230], modes: ['isochronic'],
      noises: [['off', 0], ['pink', 0.12]], layers: [['perc'], []], vibes: ['energized', 'grounded'], situations: ['adhd-focus', 'deep-work'],
      intensity: 3, gain: 0.4, count: 4, jitter: 0.2, reason: 'Four small, announced steps through the beta band for a structured work block.',
    }),
  ],
};
