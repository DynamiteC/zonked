/**
 * Saved personal mixes: types and strict validation. Pure TypeScript, no DOM.
 * Every value that comes from a file or from storage is untrusted: fields are read by
 * known key only, copied into fresh objects (no prototype pollution), and clamped to the
 * hearing-safety bounds.
 */
import { BOUNDS } from '../sbg/limits';
import { NO_LAYERS } from '../sbg/layers';
import type { LayerKey, Layers } from '../sbg/layers';
import type { NoiseKind, ToneMode } from '../sbg/types';
import { clampLayerValue } from './player';

export const MIX_VERSION = 1;
export const MAX_MIXES = 200;
export const MAX_NAME = 60;
export const MAX_ID = 64;
export const MAX_TIMER_MIN = 240;

export const NOISE_KINDS: readonly NoiseKind[] = ['off', 'white', 'pink', 'brown', 'violet'];
export const TONE_MODES: readonly ToneMode[] = ['binaural', 'monaural', 'isochronic'];
export const SOURCE_KINDS = ['template', 'preset', 'custom', 'mix'] as const;
export const TIMER_KINDS = ['none', 'countdown', 'sleep-fade', 'pomodoro'] as const;

export interface MixVoice {
  readonly carrierHz: number;
  readonly beatHz: number;
  readonly mode: ToneMode;
  readonly noise: NoiseKind;
  readonly noiseLevel: number;
  readonly gain: number;
}

export interface MixTimer {
  readonly kind: (typeof TIMER_KINDS)[number];
  /** Countdown and sleep fade minutes. */
  readonly minutes?: number;
  readonly focusMin?: number;
  readonly breakMin?: number;
}

export interface MixSource {
  readonly kind: (typeof SOURCE_KINDS)[number];
  readonly id: string;
}

/** What the player can report about what is playing right now. */
export interface MixDraft {
  readonly source: MixSource;
  readonly voice: MixVoice;
  readonly layers: Partial<Layers>;
  readonly timer: MixTimer;
  /** Listener's forced beat (Hz), when one was set. */
  readonly beatOverride?: number;
  /** Listener's forced noise kind or level, when set. */
  readonly noiseOverride?: { readonly noise?: NoiseKind; readonly noiseLevel?: number };
}

export interface Mix extends MixDraft {
  readonly v: 1;
  readonly id: string;
  readonly name: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

export function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/** Own-property read: never walks the prototype chain. */
export function field(o: Record<string, unknown>, key: string): unknown {
  return Object.hasOwn(o, key) ? o[key] : undefined;
}

export function num(x: unknown, lo: number, hi: number, fallback: number): number {
  return typeof x === 'number' && Number.isFinite(x) ? clamp(x, lo, hi) : fallback;
}

export function cleanName(x: unknown, fallback: string): string {
  if (typeof x !== 'string') return fallback;
  // eslint-disable-next-line no-control-regex
  const t = x.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
  return t.length > 0 ? t : fallback;
}

export function cleanId(x: unknown): string | null {
  return typeof x === 'string' && /^[A-Za-z0-9_.:-]{1,64}$/.test(x) ? x : null;
}

function oneOf<T extends string>(x: unknown, list: readonly T[], fallback: T): T {
  return typeof x === 'string' && (list as readonly string[]).includes(x) ? (x as T) : fallback;
}

export function cleanVoice(x: unknown): MixVoice | null {
  if (!isRecord(x)) return null;
  return {
    carrierHz: num(field(x, 'carrierHz'), BOUNDS.carrierMin, BOUNDS.carrierMax, 200),
    beatHz: num(field(x, 'beatHz'), BOUNDS.beatMin, BOUNDS.beatMax, 10),
    mode: oneOf(field(x, 'mode'), TONE_MODES, 'binaural'),
    noise: oneOf(field(x, 'noise'), NOISE_KINDS, 'off'),
    noiseLevel: num(field(x, 'noiseLevel'), BOUNDS.noiseMin, BOUNDS.noiseMax, 0),
    gain: num(field(x, 'gain'), BOUNDS.gainMin, BOUNDS.gainMax, 0.3),
  };
}

/** Keeps only known layer keys, clamps each with the player's own bounds. */
export function cleanLayers(x: unknown): Partial<Layers> {
  const out: Partial<Record<LayerKey, number>> = {};
  if (!isRecord(x)) return out;
  for (const k of Object.keys(NO_LAYERS) as LayerKey[]) {
    const v = field(x, k);
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = clampLayerValue(k, v);
  }
  return out;
}

export function cleanTimer(x: unknown): MixTimer {
  if (!isRecord(x)) return { kind: 'none' };
  const kind = oneOf(field(x, 'kind'), TIMER_KINDS, 'none');
  if (kind === 'countdown' || kind === 'sleep-fade') return { kind, minutes: Math.round(num(field(x, 'minutes'), 1, MAX_TIMER_MIN, 30)) };
  if (kind === 'pomodoro') {
    return {
      kind,
      focusMin: Math.round(num(field(x, 'focusMin'), 1, MAX_TIMER_MIN, 25)),
      breakMin: Math.round(num(field(x, 'breakMin'), 1, MAX_TIMER_MIN, 5)),
    };
  }
  return { kind: 'none' };
}

export function cleanSource(x: unknown): MixSource {
  if (!isRecord(x)) return { kind: 'custom', id: 'custom' };
  return { kind: oneOf(field(x, 'kind'), SOURCE_KINDS, 'custom'), id: cleanId(field(x, 'id')) ?? 'custom' };
}

export function cleanDraft(x: unknown): MixDraft | null {
  if (!isRecord(x)) return null;
  const voice = cleanVoice(field(x, 'voice'));
  if (voice === null) return null;
  const beat = field(x, 'beatOverride');
  const no = field(x, 'noiseOverride');
  const noise = isRecord(no) ? field(no, 'noise') : undefined;
  const level = isRecord(no) ? field(no, 'noiseLevel') : undefined;
  const noiseOverride = {
    ...(typeof noise === 'string' && (NOISE_KINDS as readonly string[]).includes(noise) ? { noise: noise as NoiseKind } : {}),
    ...(typeof level === 'number' && Number.isFinite(level) ? { noiseLevel: clamp(level, BOUNDS.noiseMin, BOUNDS.noiseMax) } : {}),
  };
  return {
    source: cleanSource(field(x, 'source')),
    voice,
    layers: cleanLayers(field(x, 'layers')),
    timer: cleanTimer(field(x, 'timer')),
    ...(typeof beat === 'number' && Number.isFinite(beat) ? { beatOverride: clamp(beat, BOUNDS.beatMin, BOUNDS.beatMax) } : {}),
    ...(Object.keys(noiseOverride).length > 0 ? { noiseOverride } : {}),
  };
}

/** Validates one stored or imported mix. Returns null when it cannot be repaired. */
export function parseMix(x: unknown, now: number): Mix | null {
  if (!isRecord(x) || field(x, 'v') !== MIX_VERSION) return null;
  const id = cleanId(field(x, 'id'));
  const draft = cleanDraft(x);
  if (id === null || draft === null) return null;
  const created = num(field(x, 'createdAt'), 0, now + 86_400_000, now);
  const updated = num(field(x, 'updatedAt'), 0, now + 86_400_000, created);
  return { ...draft, v: 1, id, name: cleanName(field(x, 'name'), 'My mix'), createdAt: created, updatedAt: updated };
}

export function newMixId(now: number, rand: () => number = Math.random): string {
  return `m${now.toString(36)}${Math.floor(rand() * 36 ** 4).toString(36).padStart(4, '0')}`;
}

export function makeMix(draft: MixDraft, name: string, now: number, rand?: () => number): Mix {
  const clean = cleanDraft(draft);
  if (clean === null) throw new RangeError('Invalid mix');
  return { ...clean, v: 1, id: newMixId(now, rand), name: cleanName(name, 'My mix'), createdAt: now, updatedAt: now };
}

export function renameMix(mix: Mix, name: string, now: number): Mix {
  return { ...mix, name: cleanName(name, mix.name), updatedAt: now };
}

/** Gives a mix a name that no other mix uses: "Calm", "Calm (2)", ... */
export function uniqueName(name: string, taken: readonly string[]): string {
  const set = new Set(taken);
  if (!set.has(name)) return name;
  for (let i = 2; i < 1000; i += 1) {
    const cand = `${name.slice(0, MAX_NAME - 6)} (${i})`;
    if (!set.has(cand)) return cand;
  }
  return name;
}
