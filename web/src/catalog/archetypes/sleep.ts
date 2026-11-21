import { arch, type CategorySpec } from '../dsl';

export const SLEEP: CategorySpec = {
  category: 'sleep',
  prefix: 'sleep',
  adjectives: ['Quiet', 'Slow', 'Velvet', 'Hushed', 'Moonlit', 'Soft', 'Drowsy', 'Still', 'Dim', 'Gentle', 'Fading', 'Lulled'],
  nouns: ['Harbor', 'Tide', 'Pillow', 'Lantern', 'Blanket', 'Meadow', 'Lullaby', 'Cabin', 'Drift', 'Hearth', 'Cove', 'Evening'],
  archs: [
    arch({
      slug: 'onset-delta', shape: 'ramp-down', from: 9, to: 2.5, mins: [30, 45, 60, 90], carriers: [120, 140, 150, 160, 180],
      modes: ['binaural', 'monaural', 'binaural', 'isochronic'], noises: [['brown', 0.25], ['pink', 0.2]],
      layers: [[], ['pad'], ['drone']], vibes: ['calm', 'deep', 'dreamy'], situations: ['cant-sleep', 'heal-stress'],
      intensity: 1, gain: 0.4, count: 6, reason: 'Glides from alpha to delta over {minutes} minutes to ease sleep onset.',
    }),
    arch({
      slug: 'drift-theta', shape: 'ramp-down', from: 8, to: 4.5, mins: [20, 30, 45], carriers: [130, 150, 170],
      modes: ['binaural', 'monaural'], noises: [['pink', 0.2], ['brown', 0.3]], layers: [['piano', 'pad'], ['pad', 'chimes'], []],
      vibes: ['dreamy', 'calm', 'ethereal'], situations: ['cant-sleep', 'lucid-dream'], intensity: 1, gain: 0.4, count: 5,
      reason: 'A slow theta drift with a soft pad to quiet racing thoughts.',
    }),
    arch({
      slug: 'deep-delta', shape: 'plateau', from: 6, to: 2.5, mins: [60, 90, 120], carriers: [110, 130, 150],
      modes: ['monaural', 'binaural', 'isochronic'], noises: [['brown', 0.3]], layers: [['drone'], []], vibes: ['deep', 'calm'],
      situations: ['cant-sleep'], intensity: 1, gain: 0.38, count: 5, jitter: 0.2,
      reason: 'Holds steady delta for deep, unbroken rest.',
    }),
    arch({
      slug: 'nap-reset', shape: 'plateau', from: 10, to: 5, ret: 12, mins: [15, 20, 25], carriers: [150, 170],
      modes: ['binaural', 'isochronic'], noises: [['pink', 0.2]], layers: [['pad']], vibes: ['warm', 'calm'],
      situations: ['cant-sleep', 'quick-reset', 'ai-burnout'], intensity: 2, gain: 0.42, count: 4,
      reason: 'A short nap that sinks to theta and wakes you gently after {minutes} minutes.',
    }),
    arch({
      slug: 'breath-down', shape: 'ramp-down', from: 7, to: 3, mins: [20, 30], carriers: [140, 160], modes: ['isochronic', 'monaural'],
      noises: [['brown', 0.2]], layers: [['pad', 'chimes']], vibes: ['calm', 'dreamy'], situations: ['cant-sleep', 'heal-stress'],
      intensity: 1, gain: 0.4, count: 3, breath: { inSec: 4, outSec: 6 }, reason: 'Pair slow 4-in, 6-out breathing with a falling beat.',
    }),
    arch({
      slug: 'rain-bed', shape: 'plateau', from: 5, to: 3, mins: [45, 60, 90], carriers: [120, 140], modes: ['isochronic', 'binaural'],
      noises: [['brown', 0.5], ['pink', 0.45]], layers: [['lofi'], []], vibes: ['lofi', 'warm', 'calm'], situations: ['cant-sleep', 'heal-stress'],
      intensity: 1, gain: 0.35, count: 3, reason: 'A soft noise bed with a faint low-end hum, easy to sleep under.',
    }),
  ],
};
