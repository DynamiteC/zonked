import type { Voice } from '../sbg/types';
import { LAYER_BOUNDS, NO_LAYERS } from '../sbg/layers';
import type { Layers } from '../sbg/layers';

/** Safety bounds (standards section 2). Mirrors crates/dsp-core. */
export const BOUNDS = {
  carrierHz: { min: 20, max: 1500, def: 200 },
  beatHz: { min: 0.5, max: 40, def: 10 },
  gain: { min: 0, max: 0.85, def: 0 },
  noiseLevel: { min: 0, max: 1, def: 0 },
  beatLevel: { min: 0, max: 1, def: 1 },
  rampSec: { min: 0.05, max: 30, def: 0.05 },
} as const;

/** Param block size (contract C1). Slots 24..31: sound upgrade (see SLOT). */
export const PARAM_COUNT = 32;
/** Slot count of the original ABI. A wasm without zk_param_count exposes only these. */
export const LEGACY_PARAM_COUNT = 8;
export const SLOT = {
  carrierHz: 0,
  beatHz: 1,
  gain: 2,
  mode: 3,
  noiseKind: 4,
  noiseLevel: 5,
  rampSec: 6,
  /** Beat voice level, 0..1, default 1. Slot 7 was reserved (always 0) before the tone-off flag. */
  beatLevel: 7,
  lofiLevel: 8,
  lofiWarmth: 9,
  crackle: 10,
  instLevel: 11,
  instKind: 12,
  instRootHz: 13,
  instScale: 14,
  instBpm: 15,
  padLevel: 16,
  padChord: 17,
  padRootHz: 18,
  chimeLevel: 19,
  chimeRatePerMin: 20,
  percLevel: 21,
  percBpm: 22,
  percPattern: 23,
  lofiProgression: 24,
  tapeWow: 25,
  pianoPedal: 26,
  breathDepth: 27,
  breathRateHz: 28,
  stereoWidth: 29,
  panDepth: 30,
  panRateHz: 31,
} as const;

/** SAB layout: Int32 seq at byte 0, PARAM_COUNT floats at byte 4. */
export const PARAM_SAB_BYTES = 4 + PARAM_COUNT * 4;

export function clampFinite(v: number, min: number, max: number, fallback: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback;
  return v < min ? min : v > max ? max : v;
}

export const clampCarrier = (v: number, fb: number = BOUNDS.carrierHz.def): number =>
  clampFinite(v, BOUNDS.carrierHz.min, BOUNDS.carrierHz.max, fb);
export const clampBeat = (v: number, fb: number = BOUNDS.beatHz.def): number =>
  clampFinite(v, BOUNDS.beatHz.min, BOUNDS.beatHz.max, fb);
export const clampGain = (v: number, fb: number = 0): number =>
  clampFinite(v, BOUNDS.gain.min, BOUNDS.gain.max, fb);
export const clampNoiseLevel = (v: number, fb: number = 0): number =>
  clampFinite(v, BOUNDS.noiseLevel.min, BOUNDS.noiseLevel.max, fb);
export const clampBeatLevel = (v: number | undefined, fb: number = BOUNDS.beatLevel.def): number =>
  v === undefined ? fb : clampFinite(v, BOUNDS.beatLevel.min, BOUNDS.beatLevel.max, fb);
export const clampRamp = (v: number, fb: number = BOUNDS.rampSec.def): number =>
  clampFinite(v, BOUNDS.rampSec.min, BOUNDS.rampSec.max, fb);

const L = LAYER_BOUNDS;
const clampLevel = (v: number, fb: number): number => clampFinite(v, L.level.min, L.level.max, fb);
/** Integer enum 0..7: rounds, clamps, NaN falls back. */
export const clampEnum = (v: number, fb = 0): number =>
  clampFinite(typeof v === 'number' ? Math.round(v) : v, 0, L.enumMax, fb);
const clampBpm = (v: number, fb: number): number => clampFinite(v, L.bpm.min, L.bpm.max, fb);

/** Returns a fully clamped Layers (non-finite fields fall back to NO_LAYERS). */
export function clampLayers(l: Layers | undefined): Layers {
  const d = NO_LAYERS;
  const s = l ?? d;
  return {
    lofiLevel: clampLevel(s.lofiLevel, d.lofiLevel),
    lofiWarmth: clampLevel(s.lofiWarmth, d.lofiWarmth),
    crackle: clampLevel(s.crackle, d.crackle),
    instLevel: clampLevel(s.instLevel, d.instLevel),
    instKind: clampFinite(typeof s.instKind === 'number' ? Math.round(s.instKind) : s.instKind, 0, L.instKindMax, d.instKind),
    instRootHz: clampFinite(s.instRootHz, L.instRootHz.min, L.instRootHz.max, d.instRootHz),
    instScale: clampEnum(s.instScale, d.instScale),
    instBpm: clampBpm(s.instBpm, d.instBpm),
    padLevel: clampLevel(s.padLevel, d.padLevel),
    padChord: clampEnum(s.padChord, d.padChord),
    padRootHz: clampFinite(s.padRootHz, L.padRootHz.min, L.padRootHz.max, d.padRootHz),
    chimeLevel: clampLevel(s.chimeLevel, d.chimeLevel),
    chimeRatePerMin: clampFinite(s.chimeRatePerMin, L.chimeRatePerMin.min, L.chimeRatePerMin.max, d.chimeRatePerMin),
    percLevel: clampLevel(s.percLevel, d.percLevel),
    percBpm: clampBpm(s.percBpm, d.percBpm),
    percPattern: clampEnum(s.percPattern, d.percPattern),
    lofiProgression: clampEnum(s.lofiProgression, d.lofiProgression),
    tapeWow: clampLevel(s.tapeWow, d.tapeWow),
    pianoPedal: clampLevel(s.pianoPedal, d.pianoPedal),
    breathDepth: clampLevel(s.breathDepth, d.breathDepth),
    breathRateHz: clampFinite(s.breathRateHz, L.breathRateHz.min, L.breathRateHz.max, d.breathRateHz),
    stereoWidth: clampLevel(s.stereoWidth, d.stereoWidth),
    panDepth: clampLevel(s.panDepth, d.panDepth),
    panRateHz: clampFinite(s.panRateHz, L.panRateHz.min, L.panRateHz.max, d.panRateHz),
  };
}

const MODE_INDEX: Record<string, number> = { binaural: 0, monaural: 1, isochronic: 2 };
const NOISE_INDEX: Record<string, number> = { off: 0, white: 1, pink: 2, brown: 3, violet: 4 };

function writeLayers(l: Layers, out: Float32Array): void {
  out[SLOT.lofiLevel] = l.lofiLevel;
  out[SLOT.lofiWarmth] = l.lofiWarmth;
  out[SLOT.crackle] = l.crackle;
  out[SLOT.instLevel] = l.instLevel;
  out[SLOT.instKind] = l.instKind;
  out[SLOT.instRootHz] = l.instRootHz;
  out[SLOT.instScale] = l.instScale;
  out[SLOT.instBpm] = l.instBpm;
  out[SLOT.padLevel] = l.padLevel;
  out[SLOT.padChord] = l.padChord;
  out[SLOT.padRootHz] = l.padRootHz;
  out[SLOT.chimeLevel] = l.chimeLevel;
  out[SLOT.chimeRatePerMin] = l.chimeRatePerMin;
  out[SLOT.percLevel] = l.percLevel;
  out[SLOT.percBpm] = l.percBpm;
  out[SLOT.percPattern] = l.percPattern;
  out[SLOT.lofiProgression] = l.lofiProgression;
  out[SLOT.tapeWow] = l.tapeWow;
  out[SLOT.pianoPedal] = l.pianoPedal;
  out[SLOT.breathDepth] = l.breathDepth;
  out[SLOT.breathRateHz] = l.breathRateHz;
  out[SLOT.stereoWidth] = l.stereoWidth;
  out[SLOT.panDepth] = l.panDepth;
  out[SLOT.panRateHz] = l.panRateHz;
}

/** Maps a voice to the C1 param block. Clamps every field; unknown enums fall back to 0. */
export function voiceToParams(voice: Voice, rampSec: number, out: Float32Array): Float32Array {
  out[SLOT.carrierHz] = clampCarrier(voice.carrierHz);
  out[SLOT.beatHz] = clampBeat(voice.beatHz);
  out[SLOT.gain] = clampGain(voice.gain);
  out[SLOT.mode] = MODE_INDEX[voice.mode] ?? 0;
  out[SLOT.noiseKind] = NOISE_INDEX[voice.noise] ?? 0;
  out[SLOT.noiseLevel] = clampNoiseLevel(voice.noiseLevel);
  out[SLOT.rampSec] = clampRamp(rampSec);
  out[SLOT.beatLevel] = clampBeatLevel(voice.beatLevel);
  writeLayers(clampLayers(voice.layers), out);
  return out;
}

/** Returns a clamped copy of the voice (non-finite values fall back to `prev` or defaults). */
export function clampVoice(voice: Voice, prev?: Voice): Voice {
  return {
    carrierHz: clampCarrier(voice.carrierHz, prev?.carrierHz),
    beatHz: clampBeat(voice.beatHz, prev?.beatHz),
    noise: voice.noise in NOISE_INDEX ? voice.noise : (prev?.noise ?? 'off'),
    noiseLevel: clampNoiseLevel(voice.noiseLevel, prev?.noiseLevel),
    mode: voice.mode in MODE_INDEX ? voice.mode : (prev?.mode ?? 'binaural'),
    gain: clampGain(voice.gain, prev?.gain),
    ...(voice.beatLevel !== undefined ? { beatLevel: clampBeatLevel(voice.beatLevel, prev?.beatLevel) } : {}),
    ...(voice.layers !== undefined ? { layers: clampLayers(voice.layers) } : {}),
  };
}

/** Seqlock writer (main thread). seq odd while writing. */
export class ParamWriter {
  private readonly seq: Int32Array;
  private readonly data: Float32Array;
  constructor(buffer: SharedArrayBuffer | ArrayBuffer) {
    this.seq = new Int32Array(buffer, 0, 1);
    this.data = new Float32Array(buffer, 4, PARAM_COUNT);
  }
  write(block: Float32Array): void {
    Atomics.add(this.seq, 0, 1);
    for (let i = 0; i < PARAM_COUNT; i++) this.data[i] = block[i] ?? 0;
    Atomics.add(this.seq, 0, 1);
  }
}

/** Seqlock reader (audio thread). Wait-free, allocation-free. */
export class ParamReader {
  private readonly seq: Int32Array;
  private readonly data: Float32Array;
  /** Test hook: runs between the copy and the second seq load. */
  midReadHook: (() => void) | null = null;
  private readonly scratch = new Float32Array(PARAM_COUNT);
  constructor(buffer: SharedArrayBuffer | ArrayBuffer) {
    this.seq = new Int32Array(buffer, 0, 1);
    this.data = new Float32Array(buffer, 4, PARAM_COUNT);
  }
  /** Copies a consistent block into out. Returns false (out untouched) if torn or mid-write. */
  read(out: Float32Array): boolean {
    const s1 = Atomics.load(this.seq, 0);
    if ((s1 & 1) !== 0) return false;
    const d = this.data;
    const t = this.scratch;
    for (let i = 0; i < PARAM_COUNT; i++) t[i] = d[i] ?? 0;
    if (this.midReadHook !== null) this.midReadHook();
    if (Atomics.load(this.seq, 0) !== s1) return false;
    for (let i = 0; i < PARAM_COUNT; i++) out[i] = t[i] ?? 0;
    return true;
  }
}
