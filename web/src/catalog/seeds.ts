/**
 * Seed templates derived from legacy sources (reference only, nothing is copied as code):
 *  - 21 from legacy/android/DefaultProgramsBuilder.java (GPLv3, BBT by Giorgio Regni). Only the
 *    published numbers (beat frequencies, durations, noise use) are re-expressed here.
 *    17 map one program each, 4 are shortened variants of an existing program.
 *  - 3 from legacy/gnaural/*.xml (Power Nap, Airplane travel aid, Arrive sharp).
 * Android "BinauralBeatVoice(start, end, volume)" values map to beat Hz. The carrier is a fixed 200 Hz
 * (the Android default), clamped by templateToEvents. Beats above 40 Hz are clamped to 40 Hz here.
 */
import { deriveLayerTags, isAdhdFriendly } from './dsl';
import type { Category, Intensity, Situation, Stage, Template, Vibe } from './types';
import type { NoiseKind, ToneMode } from '../sbg/types';

/** Segment: [seconds, beatStart, beatEnd]. */
type Seg = readonly [number, number, number];

interface SeedSpec {
  readonly id: string;
  readonly name: string;
  readonly category: Category;
  readonly vibe: Vibe;
  readonly situations: readonly Situation[];
  readonly intensity: Intensity;
  readonly source: 'android' | 'gnaural';
  readonly segs: readonly Seg[];
  readonly carrier?: number;
  readonly carrierEnd?: number;
  readonly noise?: readonly [NoiseKind, number];
  readonly mode?: ToneMode;
  readonly gain?: number;
  readonly tags: readonly string[];
  readonly reason: string;
  readonly scale?: number;
}

const r3 = (n: number): number => Math.round(n * 1000) / 1000;
const cb = (n: number): number => Math.min(40, Math.max(0.5, n));
const totalSec = (s: SeedSpec): number => s.segs.reduce((a, g) => a + g[0], 0) * (s.scale ?? 1);

function carrierAt(s: SeedSpec, t: number): number {
  const c0 = s.carrier ?? 200;
  if (s.carrierEnd === undefined) return c0;
  return Math.round(c0 + ((s.carrierEnd - c0) * t) / Math.max(totalSec(s), 1));
}

function stagesFrom(s: SeedSpec): Stage[] {
  const out: Stage[] = [];
  const [nz, nl] = s.noise ?? ['off', 0];
  let t = 0;
  s.segs.forEach((g, k) => {
    const moving = g[1] !== g[2];
    const next = s.segs[k + 1];
    out.push({
      atMin: r3(t / 60), beatHz: r3(cb(g[1])), carrierHz: carrierAt(s, t), gain: s.gain ?? 0.5,
      mode: s.mode ?? 'binaural', noise: nz, noiseLevel: nl, ramp: moving,
    });
    t += g[0] * (s.scale ?? 1);
    if (moving && (next === undefined || cb(next[1]) !== cb(g[2]))) {
      out.push({ ...(out[out.length - 1] as Stage), atMin: r3(t / 60), beatHz: r3(cb(g[2])), carrierHz: carrierAt(s, t), ramp: false });
    }
  });
  return out;
}

function toTemplate(s: SeedSpec): Template {
  const stages = stagesFrom(s);
  return {
    id: s.id, name: s.name, category: s.category, vibe: s.vibe, tags: [...s.tags, s.source],
    layerTags: deriveLayerTags(stages), situations: s.situations, recommendedMinutes: Math.max(1, Math.round(totalSec(s) / 60)),
    intensity: s.intensity, adhdFriendly: isAdhdFriendly(stages, s.intensity), stages, reasonTemplate: s.reason, source: s.source,
  };
}

const W: readonly [NoiseKind, number] = ['white', 0.3];
const P: readonly [NoiseKind, number] = ['pink', 0.3];
const B: readonly [NoiseKind, number] = ['brown', 0.3];

const LUCID1: readonly Seg[] = [
  [60, 10, 8], [60, 8, 8], [60, 8, 6], [60, 6, 6], [120, 6, 5], [360, 5, 5],
  [10, 5, 8], [10, 8, 5], [180, 5, 5], [10, 5, 8], [10, 8, 5], [90, 5, 5],
  [10, 5, 8], [10, 8, 5], [240, 5, 5], [10, 5, 8], [10, 8, 5], [480, 5, 5],
  [10, 5, 8], [10, 8, 5], [360, 5, 5], [480, 5, 12],
];
const LUCID2_TAIL: readonly Seg[] = [
  [120, 10, 8], [120, 8, 8], [120, 8, 6], [240, 6, 6], [240, 6, 5], [420, 5, 5],
  [20, 5, 8], [20, 8, 5], [360, 5, 5], [20, 5, 8], [20, 8, 5], [180, 5, 5],
  [900, 5, 5], [900, 5, 5], [360, 5, 5], [360, 5, 12],
];
const CREATIVITY: readonly Seg[] = [
  [15, 10, 8], [240, 8, 8], [15, 8, 6], [240, 6, 6], [15, 6, 8], [555, 8, 8],
  [15, 8, 6], [75, 6, 6], [15, 6, 8], [45, 8, 8],
];
const SMR: readonly Seg[] = [
  [333, 8, 8], [333, 8, 10], [333, 10, 12], [333, 12, 12], [333, 12, 10], [333, 10, 8], [333, 8, 10],
];
const HIIT: readonly Seg[] = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, (): Seg[] => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10],
];

const A = (o: Omit<SeedSpec, 'source' | 'carrier'>): SeedSpec => ({ ...o, source: 'android', carrier: 200 });

const ANDROID: readonly SeedSpec[] = [
  A({ id: 'android-self-hypnosis', name: 'Mind Bridge', category: 'meditation', vibe: 'deep', situations: ['meditate', 'heal-stress'], intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]], noise: W, tags: ['theta', 'hypnosis'], reason: 'Five minutes down to 4 Hz, ten minutes holding there, five minutes back up.' }),
  A({ id: 'android-highest-mental-activity', name: 'Spark Burst', category: 'focus', vibe: 'energized', situations: ['deep-work'], intensity: 5,
    segs: [[120, 12, 40], [600, 40, 40], [120, 40, 12]], noise: W, tags: ['gamma', 'boost'], reason: 'Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz.' }),
  A({ id: 'android-unity', name: 'Unity Delta', category: 'meditation', vibe: 'ethereal', situations: ['meditate', 'cant-sleep'], intensity: 1,
    segs: [[3600, 3.7, 3.7]], noise: B, gain: 0.45, tags: ['delta', 'long'], reason: 'A flat 3.7 Hz hour under brown noise for a wide, quiet mind.' }),
  A({ id: 'android-morphine', name: 'Morphine Ease', category: 'healing', vibe: 'warm', situations: ['heal-stress'], intensity: 2,
    segs: [[3600, 10, 10]], noise: P, tags: ['alpha', 'pain'], reason: 'An hour at a steady 10 Hz under pink noise to loosen the body.' }),
  A({ id: 'android-learning', name: 'Long Study Bed', category: 'focus', vibe: 'bright', situations: ['deep-work'], intensity: 3,
    segs: [[120, 40, 14], [7080, 14, 14]], gain: 0.5, tags: ['beta', 'study'], reason: 'A two minute lift, then two hours at 14 Hz for long reading blocks.' }),
  A({ id: 'android-creativity', name: 'Creative Waves', category: 'vibes', vibe: 'bright', situations: ['quick-reset', 'deep-work'], intensity: 2,
    segs: CREATIVITY, noise: ['white', 0.4], tags: ['alpha', 'theta', 'creative'], reason: 'Twenty minutes that drift back and forth between 10 and 6 Hz for loose ideas.' }),
  A({ id: 'android-wakeful-relax', name: 'Quiet Alert', category: 'meditation', vibe: 'calm', situations: ['meditate', 'quick-reset'], intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]], noise: ['white', 0.4], tags: ['alpha', 'zen'], reason: 'Fifteen minutes parked at 7.83 Hz with white noise, calm but awake.' }),
  A({ id: 'android-schumann', name: 'Earth Hum', category: 'healing', vibe: 'grounded', situations: ['heal-stress', 'meditate'], intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]], noise: ['white', 0.4], tags: ['alpha', 'earth'], reason: 'Ramps to 7.83 Hz, holds there ten minutes, then climbs back to 12 Hz.' }),
  A({ id: 'android-astral-relax', name: 'Dream Gate Relax', category: 'lucid-dreams', vibe: 'ethereal', situations: ['lucid-dream', 'meditate'], intensity: 2,
    segs: [[600, 15, 10], [4800, 10, 10]], noise: ['white', 0.4], tags: ['alpha', 'astral'], reason: 'A ten minute slide from 15 to 10 Hz, then a long steady alpha rest.' }),
  A({ id: 'android-interval-pulse', name: 'Interval Pulse', category: 'focus', vibe: 'energized', situations: ['deep-work'], intensity: 5,
    segs: HIIT, tags: ['beta', 'gamma', 'interval'], reason: 'Eight short high and low rounds between a warm up and a cool down.' }),
  A({ id: 'android-hallucination', name: 'Hazy Visions', category: 'vibes', vibe: 'ethereal', situations: ['quick-reset'], intensity: 3,
    segs: [[600, 15, 10]], noise: ['white', 0.2], tags: ['alpha', 'trippy'], reason: 'A single ten minute slide from 15 to 10 Hz for a soft, dreamy mood.' }),
  A({ id: 'android-sleep-induction', name: 'Drift Down', category: 'sleep', vibe: 'calm', situations: ['cant-sleep'], intensity: 1,
    segs: [[360, 9.7, 3.4], [1620, 3.4, 2.4], [1620, 2.4, 3.4]], noise: B, gain: 0.5, tags: ['delta', 'induction'], reason: 'A six minute fall to delta, then a long gentle rise and dip for the rest of the hour.' }),
  A({ id: 'android-lucid-dreams', name: 'Lucid Dream Cycle', category: 'lucid-dreams', vibe: 'dreamy', situations: ['lucid-dream'], intensity: 2,
    segs: LUCID1, gain: 0.5, tags: ['theta', 'lucid'], reason: 'A theta bed with brief alpha lifts and a soft ending.' }),
  A({ id: 'android-shamanic-rhythm', name: 'Ember Circle', category: 'meditation', vibe: 'grounded', situations: ['meditate', 'heal-stress'], intensity: 2,
    segs: [[300, 9, 4.5], [3000, 4.5, 4.5], [300, 4.5, 9]], noise: ['white', 0.4], tags: ['theta', 'journey'], reason: 'Five minutes down to 4.5 Hz, fifty minutes of hold, five minutes back up.' }),
  A({ id: 'android-smr-sleep', name: 'SMR Sleep Weave', category: 'sleep', vibe: 'minimal', situations: ['cant-sleep', 'heal-stress'], intensity: 2,
    segs: SMR, tags: ['alpha', 'smr'], reason: 'Forty minutes of beats crossing between alpha and the low SMR band.' }),
  A({ id: 'android-lucid-dreams-2', name: 'Long Lucid Night', category: 'lucid-dreams', vibe: 'deep', situations: ['lucid-dream', 'cant-sleep'], intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...LUCID2_TAIL], noise: P, gain: 0.5, tags: ['delta', 'theta', 'lucid'], reason: 'A delta fall followed by a long night plan with timed theta pulses.' }),
  A({ id: 'android-adhd-cycle', name: 'Focus Cycle', category: 'adhd-control', vibe: 'energized', situations: ['adhd-focus', 'deep-work'], intensity: 3,
    segs: [[300, 40, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20]], noise: W, tags: ['beta', 'cycle'],
    reason: 'Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener.' }),
  // Shortened variants of existing Android programs.
  A({ id: 'android-self-hypnosis-short', name: 'Quick Mind Bridge', category: 'meditation', vibe: 'calm', situations: ['meditate', 'quick-reset'], intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]], noise: W, scale: 0.5, tags: ['theta', 'short'], reason: 'The Mind Bridge shape squeezed into ten minutes.' }),
  A({ id: 'android-wakeful-relax-5', name: 'Five Minute Calm', category: 'work-recovery', vibe: 'calm', situations: ['quick-reset', 'ai-burnout'], intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]], noise: ['white', 0.3], scale: 1 / 3, tags: ['alpha', 'short'], reason: 'A five minute Quiet Alert between tasks.' }),
  A({ id: 'android-schumann-short', name: 'Earth Reset', category: 'healing', vibe: 'grounded', situations: ['heal-stress', 'quick-reset'], intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]], noise: ['white', 0.3], scale: 0.5, tags: ['alpha', 'short'], reason: 'A ten minute version of the Earth Hum shape.' }),
  A({ id: 'android-lucid-dreams-short', name: 'Lucid Nap Cycle', category: 'lucid-dreams', vibe: 'dreamy', situations: ['lucid-dream', 'cant-sleep'], intensity: 2,
    segs: LUCID1.slice(0, 12), gain: 0.5, tags: ['theta', 'lucid', 'short'], reason: 'The opening stretch of the Lucid Dream Cycle, sized for naps.' }),
];

const G = (o: Omit<SeedSpec, 'source'>): SeedSpec => ({ ...o, source: 'gnaural' });

/** Gnaural schedules, beats and durations read from the xml entries; base frequency maps to the carrier. */
const GNAURAL: readonly SeedSpec[] = [
  G({ id: 'gnaural-power-nap', name: 'Midday Nap', category: 'sleep', vibe: 'warm', situations: ['quick-reset', 'cant-sleep', 'ai-burnout'], intensity: 1,
    segs: [[13, 11, 8.8], [17, 8.8, 7], [29, 7, 5.2], [38, 5.2, 4.4], [50, 4.4, 4.2], [68, 4.2, 4], [877, 4, 4], [37, 4, 4.2], [32, 4.2, 5.1], [20, 5.1, 6.8], [15, 6.8, 9.8], [4, 9.8, 9.8]],
    carrier: 164, carrierEnd: 110, noise: P, gain: 0.5, tags: ['delta', 'nap', 'schedule'], reason: 'A fast fall to 4 Hz, a long hold, then a slow climb. Twenty minutes in all.' }),
  G({ id: 'gnaural-airplane-aid', name: 'Long Haul Calm', category: 'meditation', vibe: 'calm', situations: ['meditate', 'quick-reset', 'heal-stress'], intensity: 1,
    segs: [[9, 0.5, 12], [45, 12, 8], [60, 8, 6], [120, 6, 5], [180, 5, 4.3], [180, 4.3, 4], [900, 4, 4], [900, 4, 4.2], [900, 4.2, 3.9], [900, 3.9, 3.9], [400, 3.9, 4.3]],
    carrier: 280, carrierEnd: 140, noise: B, gain: 0.5, tags: ['theta', 'travel', 'schedule'], reason: 'A falling carrier tone over theta beats, built for long seated trips.' }),
  G({ id: 'gnaural-arrive-sharp', name: 'Arrive Sharp', category: 'focus', vibe: 'bright', situations: ['deep-work'], intensity: 4,
    segs: [[236, 10.1, 10.1], [132, 12.1, 12.1], [661, 28.5, 28.5], [209, 5.4, 5.4], [73, 7.3, 7.3]],
    carrier: 200, gain: 0.5, tags: ['beta', 'gamma', 'schedule'], reason: 'Five steps from alpha up to a 28.5 Hz middle, then back down, in twenty two minutes.' }),
];

/** 21 android-derived and 3 gnaural-derived templates, in stable order. */
export function buildSeeds(): Template[] {
  return [...ANDROID, ...GNAURAL].map(toTemplate);
}
