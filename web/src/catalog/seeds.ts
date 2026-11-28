/**
 * Seed templates. Every schedule here is original work, written from general published beat bands
 * (delta 0.5-4 Hz, theta 4-8 Hz, alpha 8-13 Hz, beta 13-30 Hz) and plain shapes such as a slow settle,
 * a steady hold or a gentle lift. No step table, name or number sequence is taken from another app or file.
 * Segments are [seconds, beatStart, beatEnd]. Beats are clamped to 0.5-40 Hz, carriers stay inside 20-1500 Hz.
 * The 24 ids below replace the old android- and gnaural- ids. LEGACY_TEMPLATE_IDS maps saved references.
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

/** Added to every seed longer than 60 minutes. */
const LONG_NOTE = ' This is a long session. Take a break if you need one.';

const r3 = (n: number): number => Math.round(n * 1000) / 1000;
const cb = (n: number): number => Math.min(40, Math.max(0.5, n));
const totalSec = (s: SeedSpec): number => s.segs.reduce((a, g) => a + g[0], 0) * (s.scale ?? 1);

function carrierAt(s: SeedSpec, t: number): number {
  const c0 = s.carrier ?? 210;
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
      atMin: r3(t / 60), beatHz: r3(cb(g[1])), carrierHz: carrierAt(s, t), gain: s.gain ?? 0.45,
      mode: s.mode ?? 'binaural', noise: nz, noiseLevel: nl, ramp: moving,
    });
    t += g[0] * (s.scale ?? 1);
    if (moving && (next === undefined || cb(next[1]) !== cb(g[2]))) {
      out.push({ ...(out[out.length - 1] as Stage), atMin: r3(t / 60), beatHz: r3(cb(g[2])), carrierHz: carrierAt(s, t), ramp: false });
    }
  });
  return out;
}

/** Fills {minutes} and {duration} from the data, so the words never disagree with the length. */
const withLength = (reason: string, min: number): string => reason.replaceAll('{minutes}', String(min)).replaceAll('{duration}', `${min} minutes`);

function toTemplate(s: SeedSpec): Template {
  const stages = stagesFrom(s);
  const minutes = Math.max(1, Math.round(totalSec(s) / 60));
  return {
    id: s.id, name: s.name, category: s.category, vibe: s.vibe, tags: [...s.tags, 'original'],
    layerTags: deriveLayerTags(stages), situations: s.situations, recommendedMinutes: minutes,
    intensity: s.intensity, adhdFriendly: isAdhdFriendly(stages, s.intensity), stages, reasonTemplate: withLength(s.reason, minutes) + (minutes > 60 ? LONG_NOTE : ''), source: 'original',
  };
}

const W: readonly [NoiseKind, number] = ['white', 0.3];
const P: readonly [NoiseKind, number] = ['pink', 0.3];
const B: readonly [NoiseKind, number] = ['brown', 0.3];

/** A slow wave: `n` swings between two beats, each swing `sec` seconds long. */
const swings = (n: number, sec: number, lo: number, hi: number): readonly Seg[] =>
  Array.from({ length: n }, (_, i): Seg => (i % 2 === 0 ? [sec, lo, hi] : [sec, hi, lo]));

const S = (o: SeedSpec): SeedSpec => o;

/** The 21 seeds that replace the old android- ids. */
const SET_A: readonly SeedSpec[] = [
  S({ id: 'seed-slow-settle', name: 'Slow Settle', category: 'meditation', vibe: 'deep', situations: ['meditate'], intensity: 2,
    segs: [[480, 10, 6], [720, 6, 6], [240, 6, 9]], carrier: 210, noise: P, tags: ['alpha', 'theta'], reason: 'Eight minutes sliding from 10 to 6 Hz, twelve minutes steady, then a short lift.' }),
  S({ id: 'seed-bright-run', name: 'Bright Run', category: 'focus', vibe: 'energized', situations: ['deep-work'], intensity: 4,
    segs: [[180, 14, 20], [900, 20, 20], [180, 20, 14]], carrier: 240, noise: ['white', 0.2], tags: ['beta', 'work'], reason: 'A three minute climb to 20 Hz, a fifteen minute hold, then a three minute return.' }),
  S({ id: 'seed-low-hour', name: 'Low Hour', category: 'meditation', vibe: 'ethereal', situations: ['meditate', 'cant-sleep'], intensity: 1,
    segs: [[900, 5, 3], [2700, 3, 2]], carrier: 190, noise: B, gain: 0.4, tags: ['delta', 'long'], reason: 'A slow slide to very low beats under brown noise, then a long quiet stretch.' }),
  S({ id: 'seed-warm-hum', name: 'Warm Hum', category: 'healing', vibe: 'warm', situations: ['heal-stress', 'quick-reset'], intensity: 2,
    segs: [[600, 9.5, 9], [1200, 9, 8.5]], carrier: 200, noise: P, tags: ['alpha', 'warm'], reason: 'Half an hour of an almost still 9 Hz beat under pink noise.' }),
  S({ id: 'seed-reading-room', name: 'Reading Room', category: 'focus', vibe: 'bright', situations: ['deep-work'], intensity: 3,
    segs: [[300, 12, 16], [3300, 16, 16]], carrier: 230, tags: ['beta', 'study'], reason: 'A five minute lift to 16 Hz, then a steady hour for reading or writing.' }),
  S({ id: 'seed-idea-drift', name: 'Idea Drift', category: 'vibes', vibe: 'bright', situations: ['quick-reset', 'deep-work'], intensity: 2,
    segs: swings(6, 240, 9, 11.5), carrier: 220, noise: ['white', 0.25], tags: ['alpha', 'wave'], reason: 'A slow wave between 9 and 11.5 Hz, one swing every four minutes.' }),
  S({ id: 'seed-gentle-landing', name: 'Gentle Landing', category: 'meditation', vibe: 'calm', situations: ['meditate', 'quick-reset'], intensity: 1,
    segs: [[180, 11, 9], [720, 9, 8]], carrier: 205, noise: W, tags: ['alpha', 'short'], reason: 'Three minutes settling from 11 Hz, then a calm stretch near 8 Hz.' }),
  S({ id: 'seed-quiet-ground', name: 'Quiet Ground', category: 'healing', vibe: 'grounded', situations: ['heal-stress', 'meditate'], intensity: 2,
    segs: [[420, 10, 7], [600, 7, 7], [420, 7, 10]], carrier: 175, noise: B, tags: ['alpha', 'theta'], reason: 'Seven minutes down to 7 Hz, ten minutes steady, seven minutes back up.' }),
  S({ id: 'seed-evening-slope', name: 'Evening Slope', category: 'lucid-dreams', vibe: 'ethereal', situations: ['lucid-dream', 'meditate'], intensity: 2,
    segs: [[900, 12, 8], [2400, 8, 6]], carrier: 195, noise: ['pink', 0.25], tags: ['alpha', 'theta'], reason: 'Fifteen minutes from 12 to 8 Hz, then a long slow slope toward 6 Hz.' }),
  S({ id: 'seed-pace-steps', name: 'Pace Steps', category: 'focus', vibe: 'energized', situations: ['deep-work'], intensity: 4,
    segs: [[180, 14, 22], ...Array.from({ length: 5 }, (): Seg[] => [[150, 22, 22], [90, 14, 14]]).flat(), [180, 22, 12]], carrier: 235,
    tags: ['beta', 'interval'], reason: 'Five rounds of a brisk 22 Hz step and a short easy 14 Hz step, with a warm up and a cool down.' }),
  S({ id: 'seed-soft-fade', name: 'Soft Fade', category: 'vibes', vibe: 'ethereal', situations: ['quick-reset'], intensity: 2,
    segs: [[720, 12, 8]], carrier: 215, noise: ['white', 0.2], tags: ['alpha', 'glide'], reason: 'One {minutes} minute glide from 12 to 8 Hz.' }),
  S({ id: 'seed-night-descent', name: 'Night Descent', category: 'sleep', vibe: 'calm', situations: ['cant-sleep'], intensity: 1,
    segs: [[900, 10, 5], [1500, 5, 2.5], [1200, 2.5, 1.5]], carrier: 185, noise: B, gain: 0.42, tags: ['delta', 'theta'], reason: 'A long staircase from 10 Hz down to 1.5 Hz over {minutes} minutes.' }),
  S({ id: 'seed-dream-hour', name: 'Dream Hour', category: 'lucid-dreams', vibe: 'dreamy', situations: ['lucid-dream'], intensity: 2,
    segs: [[600, 9, 6], [1500, 6, 5.5], [60, 5.5, 7], [1500, 5.5, 5], [60, 5, 7], [900, 5, 4.5]], carrier: 200, noise: ['pink', 0.2], tags: ['theta'],
    reason: 'A theta bed with two small lifts, about an hour in all.' }),
  S({ id: 'seed-campfire-hush', name: 'Campfire Hush', category: 'meditation', vibe: 'grounded', situations: ['meditate'], intensity: 2,
    segs: [[600, 8, 5.5], [1800, 5.5, 5], [600, 5, 8]], carrier: 170, noise: ['white', 0.35], tags: ['theta'], reason: 'Ten minutes down to 5.5 Hz, half an hour of slow theta, ten minutes back.' }),
  S({ id: 'seed-light-sleep-weave', name: 'Light Sleep Weave', category: 'sleep', vibe: 'minimal', situations: ['cant-sleep'], intensity: 2,
    segs: [[600, 7, 4], [600, 4, 6], [600, 6, 3.5], [600, 3.5, 5], [600, 5, 2.5]], carrier: 195, tags: ['theta', 'delta'], reason: 'Five ten-minute weaves that each end a little lower than the last.' }),
  S({ id: 'seed-long-night', name: 'Long Night', category: 'lucid-dreams', vibe: 'deep', situations: ['lucid-dream', 'cant-sleep'], intensity: 2,
    segs: [[900, 8, 4], [3600, 4, 3], [1800, 3, 2], [1800, 2, 3], [900, 3, 6]], carrier: 180, noise: P, gain: 0.4, tags: ['delta', 'long'], reason: 'A two hour night plan: a slow fall, a deep middle and a soft rise.' }),
  S({ id: 'seed-steady-blocks', name: 'Steady Blocks', category: 'adhd-control', vibe: 'energized', situations: ['adhd-focus', 'deep-work'], intensity: 3,
    segs: [[240, 14, 16], [300, 16, 16], [300, 13, 13], [300, 16, 16], [300, 13, 13]], carrier: 225, noise: ['white', 0.25], tags: ['beta', 'blocks'],
    reason: 'Five minute blocks that alternate between 16 and 13 Hz.' }),
  S({ id: 'seed-short-settle', name: 'Short Settle', category: 'meditation', vibe: 'calm', situations: ['meditate', 'quick-reset'], intensity: 2,
    segs: [[240, 10, 6], [240, 6, 6], [120, 6, 9]], carrier: 210, noise: W, tags: ['alpha', 'short'], reason: 'The slow settle shape in {minutes} minutes.' }),
  S({ id: 'seed-pause-five', name: 'Five Minute Pause', category: 'work-recovery', vibe: 'calm', situations: ['quick-reset', 'ai-burnout'], intensity: 1,
    segs: [[100, 11, 8], [200, 8, 8]], carrier: 205, noise: ['white', 0.25], tags: ['alpha', 'short'], reason: 'A {minutes} minute pause between tasks.' }),
  S({ id: 'seed-ground-reset', name: 'Ground Reset', category: 'healing', vibe: 'grounded', situations: ['heal-stress', 'quick-reset'], intensity: 2,
    segs: [[360, 10, 7], [240, 7, 7]], carrier: 175, noise: ['brown', 0.25], tags: ['alpha', 'short'], reason: 'A {minutes} minute version of a slow slide to 7 Hz.' }),
  S({ id: 'seed-nap-window', name: 'Nap Window', category: 'lucid-dreams', vibe: 'dreamy', situations: ['lucid-dream', 'cant-sleep'], intensity: 2,
    segs: [[480, 9, 6], [1080, 6, 5], [60, 5, 7], [420, 5, 4.5]], carrier: 200, tags: ['theta', 'short'], reason: 'A theta bed sized for a short rest, with one small lift.' }),
];

/** The 3 seeds that replace the old gnaural- ids. */
const SET_B: readonly SeedSpec[] = [
  S({ id: 'seed-midday-rest', name: 'Midday Rest', category: 'sleep', vibe: 'warm', situations: ['quick-reset', 'cant-sleep', 'ai-burnout'], intensity: 1,
    segs: [[240, 10, 6], [720, 6, 3.5], [360, 3.5, 3.5], [240, 3.5, 8]], carrier: 180, carrierEnd: 145, noise: P, tags: ['delta', 'rest'], reason: 'A short rest: settle, hold low, then a gentle rise at the end.' }),
  S({ id: 'seed-long-trip', name: 'Long Trip', category: 'meditation', vibe: 'calm', situations: ['meditate', 'quick-reset'], intensity: 1,
    segs: [[300, 10, 7], [1500, 7, 5.5], [1500, 5.5, 4.5], [1500, 4.5, 6]], carrier: 250, carrierEnd: 160, noise: B, tags: ['theta', 'long'], reason: 'A tone that slowly lowers over theta beats, sized for a long sit or ride.' }),
  S({ id: 'seed-morning-lift', name: 'Morning Lift', category: 'focus', vibe: 'bright', situations: ['deep-work'], intensity: 3,
    segs: [[300, 9, 12], [600, 12, 15], [900, 15, 18], [300, 18, 12]], carrier: 220, tags: ['alpha', 'beta'], reason: 'Three steps up from 9 to 18 Hz over {minutes} minutes, then an easy return.' }),
];

/** 21 plus 3 original seed templates, in stable order. */
export function buildSeeds(): Template[] {
  return [...SET_A, ...SET_B].map(toTemplate);
}
