import type { SbgEvent, Voice } from './types';
import { BOUNDS } from './limits';
import { NO_LAYERS } from './layers';
import type { Layers } from './layers';

export const SILENT_VOICE: Voice = {
  carrierHz: 200,
  beatHz: 10,
  noise: 'off',
  noiseLevel: 0,
  mode: 'binaural',
  gain: 0,
};

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/** Index of the last event with tSec <= t, or -1 when t precedes every event. */
export function eventIndexAt(events: readonly SbgEvent[], tSec: number): number {
  const t = Number.isFinite(tSec) ? tSec : 0;
  let lo = 0;
  let hi = events.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const e = events[mid];
    if (e !== undefined && e.tSec <= t) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

/** The event whose voice is active at tSec. Before the first event the first event is returned. */
export function eventAt(events: readonly SbgEvent[], tSec: number): SbgEvent | undefined {
  if (events.length === 0) return undefined;
  return events[Math.max(0, eventIndexAt(events, tSec))];
}

export function totalDuration(events: readonly SbgEvent[]): number {
  const last = events[events.length - 1];
  return last === undefined ? 0 : last.tSec;
}

function lerp(a: number, b: number, f: number): number {
  return a + (b - a) * f;
}

const INTEGER_LAYER_KEYS: ReadonlySet<string> = new Set(['instKind', 'instScale', 'padChord', 'percPattern', 'lofiProgression']);

/** Linear for numeric fields; integer fields snap at the earlier event until the next event time. */
function blendLayers(a: Layers | undefined, b: Layers | undefined, f: number): Layers | undefined {
  if (a === undefined && b === undefined) return undefined;
  const x = a ?? NO_LAYERS;
  const y = b ?? NO_LAYERS;
  const out: Record<string, number> = {};
  for (const k of Object.keys(NO_LAYERS) as (keyof Layers)[]) {
    out[k] = INTEGER_LAYER_KEYS.has(k) ? (f >= 1 ? y[k] : x[k]) : lerp(x[k], y[k], f);
  }
  return out as unknown as Layers;
}

function blend(a: Voice, b: Voice, f: number): Voice {
  const layers = blendLayers(a.layers, b.layers, f);
  return {
    carrierHz: clamp(lerp(a.carrierHz, b.carrierHz, f), BOUNDS.carrierMin, BOUNDS.carrierMax),
    beatHz: clamp(lerp(a.beatHz, b.beatHz, f), BOUNDS.beatMin, BOUNDS.beatMax),
    noise: a.noise === 'off' ? b.noise : a.noise,
    noiseLevel: clamp(lerp(a.noiseLevel, b.noiseLevel, f), BOUNDS.noiseMin, BOUNDS.noiseMax),
    mode: a.mode,
    gain: clamp(lerp(a.gain, b.gain, f), BOUNDS.gainMin, BOUNDS.gainMax),
    ...(layers !== undefined ? { layers } : {}),
  };
}

/**
 * Voice at time tSec. Before the first event the first voice holds; after the
 * last event the last voice holds. An event with ramp=true interpolates
 * linearly to the next event's voice, reaching it at the next event's time.
 */
export function voiceAt(events: readonly SbgEvent[], tSec: number): Voice {
  const i = eventIndexAt(events, tSec);
  const cur = events[Math.max(0, i)];
  if (cur === undefined) return SILENT_VOICE;
  const next = events[i + 1];
  if (i < 0 || !cur.ramp || next === undefined) return cur.voice;
  const t = Number.isFinite(tSec) ? tSec : 0;
  const span = next.tSec - cur.tSec;
  if (!(span > 0)) return next.voice;
  return blend(cur.voice, next.voice, clamp((t - cur.tSec) / span, 0, 1));
}
