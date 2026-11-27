/**
 * Catalog DSL: archetype x parameter grid generator.
 * Fully deterministic: no randomness, no clock. Variant i of an archetype is a pure function of i.
 */
import type { Layers } from '../sbg/layers';
import type { NoiseKind, ToneMode } from '../sbg/types';
import type { Category, Intensity, LayerTag, Situation, Stage, Template, Vibe } from './types';

export type Shape = 'plateau' | 'ramp-down' | 'ramp-up' | 'wave' | 'ladder';
export type LayerName = 'lofi' | 'crackle' | 'drone' | 'pluck' | 'bell' | 'pad' | 'chimes' | 'perc' | 'piano';

export interface Arch {
  readonly slug: string;
  readonly shape: Shape;
  /** Entry beat and target beat (Hz). */
  readonly from: number;
  readonly to: number;
  /** Optional return beat for a gentle wake-up at the end of a plateau. */
  readonly ret?: number;
  readonly mins: readonly number[];
  readonly carriers: readonly number[];
  readonly modes: readonly ToneMode[];
  readonly noises: readonly (readonly [NoiseKind, number])[];
  readonly layers: readonly (readonly LayerName[])[];
  readonly vibes: readonly Vibe[];
  readonly situations: readonly Situation[];
  readonly intensity: Intensity;
  readonly gain: number;
  readonly count: number;
  readonly tags: readonly string[];
  readonly reason: string;
  readonly jitter: number;
  readonly breath?: { readonly inSec: number; readonly outSec: number };
}

export interface CategorySpec {
  readonly category: Category;
  readonly prefix: string;
  readonly adjectives: readonly string[];
  readonly nouns: readonly string[];
  readonly archs: readonly Arch[];
}

type ArchInput = Omit<Arch, 'modes' | 'noises' | 'layers' | 'intensity' | 'gain' | 'jitter' | 'tags'> &
  Partial<Pick<Arch, 'modes' | 'noises' | 'layers' | 'intensity' | 'gain' | 'jitter' | 'tags'>>;

/** Fill defaults so category files stay compact. */
export function arch(a: ArchInput): Arch {
  return {
    modes: ['binaural'],
    noises: [['off', 0]],
    layers: [[]],
    intensity: 2,
    gain: 0.45,
    jitter: 0.3,
    tags: [],
    ...a,
  };
}

const at = <T>(xs: readonly T[], i: number): T => xs[((i % xs.length) + xs.length) % xs.length] as T;

/** Per-template mood: key, progression and piano root so templates differ in harmony. */
export interface Mood {
  readonly prog: number;
  readonly key: number;
  readonly pianoRoot: number;
}

const KEYS = [98, 110, 123.5, 87.3, 103.8, 130.8] as const;
const PIANO_ROOTS = [196, 220, 247, 175, 165, 262] as const;
const PROG_BY_VIBE: Record<Vibe, readonly number[]> = {
  calm: [4, 3], warm: [6, 2], dreamy: [4, 3], bright: [2, 5], deep: [7, 5],
  energized: [2, 3], grounded: [6, 1], ethereal: [4, 3], lofi: [1, 2, 5], minimal: [7, 4],
};

const hashSlug = (s: string): number => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7);

export function moodFor(slug: string, vibe: Vibe, i: number): Mood {
  const h = hashSlug(slug) + i;
  return { prog: at(PROG_BY_VIBE[vibe], h), key: at(KEYS, h), pianoRoot: at(PIANO_ROOTS, h >> 1) };
}

/** Slow movement settings shared by every layered template (breathing, width, pan). */
export function motionFor(vibe: Vibe, intensity: Intensity, i: number): Partial<Layers> {
  const soft = vibe === 'dreamy' || vibe === 'ethereal' || vibe === 'calm';
  return {
    breathDepth: at([0.45, 0.4, 0.3, 0.2, 0.1], intensity - 1),
    breathRateHz: 0.06 + 0.02 * (i % 5),
    stereoWidth: 0.3 + 0.1 * (i % 4),
    panDepth: soft ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (i % 4),
  };
}

/** Layer presets. v tunes root notes, chords, tempo so variants differ. */
const PRESETS: Record<LayerName, (v: number, m: Mood) => Partial<Layers>> = {
  lofi: (v, m) => ({
    lofiLevel: 0.45, lofiWarmth: at([0.5, 0.6, 0.7], v), lofiProgression: m.prog, tapeWow: at([0.25, 0.35, 0.45], v),
    padRootHz: m.key,
  }),
  piano: (v, m) => ({
    instLevel: 0.35, instKind: 3, instRootHz: m.pianoRoot, instScale: at([2, 0, 1, 4, 3], v), instBpm: at([40, 46, 52], v),
    pianoPedal: at([0.4, 0.55, 0.7], v),
  }),
  crackle: () => ({ crackle: 0.12 }),
  drone: (v) => ({ instLevel: 0.35, instKind: 1, instRootHz: at([55, 62, 73, 82], v), instScale: 7, instBpm: 40 }),
  pluck: (v) => ({
    instLevel: 0.3, instKind: 0, instRootHz: at([196, 220, 247, 262], v),
    instScale: at([0, 2, 4, 1], v), instBpm: at([48, 56, 64, 72], v),
  }),
  bell: (v) => ({
    instLevel: 0.28, instKind: 2, instRootHz: at([262, 294, 330, 349], v), instScale: 4, instBpm: 40,
  }),
  pad: (v, m) => ({ padLevel: 0.4, padChord: at([0, 2, 4, 6], v), padRootHz: m.key }),
  chimes: (v) => ({ chimeLevel: 0.25, chimeRatePerMin: at([3, 4, 6, 8], v) }),
  perc: (v) => ({
    percLevel: 0.2, percBpm: at([64, 72, 80, 92], v), percPattern: at([0, 3, 4, 7], v),
  }),
};

export function mergeLayerNames(names: readonly LayerName[], v: number, m: Mood = { prog: 0, key: 110, pianoRoot: 220 }): Partial<Layers> {
  return names.reduce<Partial<Layers>>((acc, n) => ({ ...acc, ...PRESETS[n](v, m) }), {});
}

const r3 = (n: number): number => Math.round(n * 1000) / 1000;
const clampBeat = (n: number): number => Math.min(40, Math.max(0.5, n));

interface Point {
  readonly t: number;
  readonly beat: number;
  readonly ramp: boolean;
}

/** Beat contour for a shape over M minutes. */
export function contour(shape: Shape, m: number, a: number, b: number, ret?: number): Point[] {
  const r = Math.min(5, Math.max(1, m * 0.15));
  if (shape === 'plateau') {
    const p: Point[] = [{ t: 0, beat: a, ramp: true }, { t: r, beat: b, ramp: ret !== undefined }];
    if (ret !== undefined) p.push({ t: m - r, beat: b, ramp: true }, { t: m, beat: ret, ramp: false });
    return p;
  }
  if (shape === 'ramp-down' || shape === 'ramp-up') {
    return [{ t: 0, beat: a, ramp: true }, { t: m * 0.7, beat: b, ramp: false }];
  }
  if (shape === 'wave') {
    return Array.from({ length: 7 }, (_, k) => ({ t: (m * k) / 6, beat: k % 2 === 0 ? a : b, ramp: k < 6 }));
  }
  const step = m / 4;
  return Array.from({ length: 4 }, (_, k) => {
    const beat = a + ((b - a) * k) / 3;
    return k < 3
      ? [{ t: k * step, beat, ramp: false }, { t: k * step + step * 0.75, beat, ramp: true }]
      : [{ t: k * step, beat, ramp: false }];
  }).flat();
}

function buildStages(a: Arch, i: number, m: number, carrier: number, mode: ToneMode): Stage[] {
  const jit = ((i % 3) - 1) * a.jitter;
  const to = clampBeat(a.to + jit);
  const noise = at(a.noises, i >> 1);
  const names = at(a.layers, i * 2 + (i >> 1));
  const vibe = at(a.vibes, i);
  const base = mergeLayerNames(names, i, moodFor(a.slug, vibe, i));
  const hasLayers = Object.keys(base).length > 0;
  const lay = hasLayers ? { ...base, ...motionFor(vibe, a.intensity, i) } : base;
  return contour(a.shape, m, clampBeat(a.from), to, a.ret).map((p) => ({
    atMin: r3(p.t),
    beatHz: r3(clampBeat(p.beat)),
    carrierHz: carrier,
    gain: a.gain,
    mode,
    noise: noise[0],
    noiseLevel: noise[1],
    ...(hasLayers ? { layers: lay } : {}),
    ramp: p.ramp,
  }));
}

/** Layer tags derived from the stages actually used (truthful by construction). */
export function deriveLayerTags(stages: readonly Stage[]): LayerTag[] {
  const tags = new Set<LayerTag>();
  for (const s of stages) {
    tags.add(s.mode);
    const l = s.layers;
    if (s.noise !== 'off' && s.noiseLevel > 0) tags.add('noise');
    if (l === undefined) continue;
    if ((l.lofiLevel ?? 0) > 0 || (l.crackle ?? 0) > 0) tags.add('lofi');
    if ((l.instLevel ?? 0) > 0) tags.add('instrument');
    if ((l.padLevel ?? 0) > 0) tags.add('pad');
    if ((l.chimeLevel ?? 0) > 0) tags.add('chimes');
    if ((l.percLevel ?? 0) > 0) tags.add('percussion');
  }
  return [...tags];
}

/**
 * ADHD friendly = steady and low surprise: gentle intensity, no consecutive stage jump above 4 Hz,
 * every stage either isochronic or in the beta/SMR band (12-20 Hz), no fast percussion, no crackle.
 */
export function isAdhdFriendly(stages: readonly Stage[], intensity: number): boolean {
  if (intensity > 3) return false;
  const jumps = stages.every((s, k) => k === 0 || Math.abs(s.beatHz - (stages[k - 1]?.beatHz ?? s.beatHz)) <= 4);
  const bandOk = stages.every((s) => s.mode === 'isochronic' || (s.beatHz >= 12 && s.beatHz <= 20));
  const calm = stages.every((s) => (s.layers?.crackle ?? 0) === 0 && (s.layers?.percBpm ?? 0) <= 100);
  return jumps && bandOk && calm;
}

function nameFor(spec: CategorySpec, j: number): string {
  const na = spec.adjectives.length;
  const p = (j * 7) % (na * spec.nouns.length);
  return `${at(spec.adjectives, p)} ${at(spec.nouns, Math.floor(p / na))}`;
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

const MODE_WORD: Record<ToneMode, string> = { binaural: 'Binaural', monaural: 'Monaural', isochronic: 'Isochronic' };
const EXTRA_TAG: readonly LayerTag[] = ['lofi', 'instrument', 'pad', 'chimes', 'percussion'];

/** What differs between sibling cards: tone type, carrier, noise and layers, read from the data. */
function variantNote(mode: ToneMode, carrier: number, minutes: number, vibe: Vibe, stages: readonly Stage[]): string {
  const first = stages[0];
  const parts = [`${MODE_WORD[mode]}, ${carrier} Hz carrier, ${minutes} minutes, ${vibe} mood`];
  if (first !== undefined && first.noise !== 'off' && first.noiseLevel > 0) parts.push(`${first.noise} noise`);
  const last = stages[stages.length - 1];
  if (first !== undefined && last !== undefined && first.beatHz !== last.beatHz) parts.push(`beat ${first.beatHz} to ${last.beatHz} Hz`);
  const extras = deriveLayerTags(stages).filter((t) => EXTRA_TAG.includes(t));
  if (extras.length > 0) parts.push(extras.join(' and '));
  return `${parts.join(', ')}.`;
}

function buildOne(spec: CategorySpec, a: Arch, i: number, j: number): Template {
  const m = at(a.mins, i);
  const carrier = at(a.carriers, i * 3 + 1);
  const mode = at(a.modes, i + (i >> 2));
  const stages = buildStages(a, i, m, carrier, mode);
  const band = a.to < 4 ? 'delta' : a.to < 8 ? 'theta' : a.to < 12 ? 'alpha' : a.to < 30 ? 'beta' : 'gamma';
  return {
    id: `${spec.prefix}-${a.slug}-${pad2(i + 1)}`,
    name: nameFor(spec, j),
    category: spec.category,
    vibe: at(a.vibes, i),
    tags: [a.slug, band, mode, ...a.tags],
    layerTags: deriveLayerTags(stages),
    situations: a.situations,
    recommendedMinutes: m,
    intensity: a.intensity,
    adhdFriendly: isAdhdFriendly(stages, a.intensity),
    stages,
    reasonTemplate: `${a.reason} ${variantNote(mode, carrier, m, at(a.vibes, i), stages)}`,
    source: 'original',
    ...(a.breath !== undefined ? { breath: a.breath } : {}),
  };
}

/** Expand one category spec into templates in stable order. */
export function buildCategory(spec: CategorySpec): Template[] {
  let j = 0;
  const list = spec.archs.flatMap((a) => Array.from({ length: a.count }, (_, i) => buildOne(spec, a, i, j++)));
  return uniqueReasons(list);
}

/** Cards must not repeat a sentence. Siblings with the very same data get a numbered take. */
function uniqueReasons(list: Template[]): Template[] {
  const seen = new Map<string, number>();
  return list.map((t) => {
    const key = t.reasonTemplate.replaceAll('{minutes}', String(t.recommendedMinutes));
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    return n === 1 ? t : { ...t, reasonTemplate: `${t.reasonTemplate} Alternate take ${n}.` };
  });
}
