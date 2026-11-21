import { LAYER_BOUNDS, NO_LAYERS, type Layers } from '../sbg/layers';
import { BOUNDS } from '../sbg/limits';
import type { SbgEvent } from '../sbg/types';
import type { Stage, Template } from './types';

const clamp = (v: number, lo: number, hi: number): number => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : lo);
const lvl = (v: number): number => clamp(v, LAYER_BOUNDS.level.min, LAYER_BOUNDS.level.max);
const en = (v: number, max: number): number => Math.round(clamp(v, 0, max));

/** Merge a partial layer set over NO_LAYERS and clamp every field to LAYER_BOUNDS. */
export function resolveLayers(p: Partial<Layers> | undefined): Layers {
  const l: Layers = { ...NO_LAYERS, ...p };
  const B = LAYER_BOUNDS;
  return {
    lofiLevel: lvl(l.lofiLevel), lofiWarmth: lvl(l.lofiWarmth), crackle: lvl(l.crackle),
    instLevel: lvl(l.instLevel), instKind: en(l.instKind, B.instKindMax), instRootHz: clamp(l.instRootHz, B.instRootHz.min, B.instRootHz.max),
    instScale: en(l.instScale, B.enumMax), instBpm: clamp(l.instBpm, B.bpm.min, B.bpm.max),
    padLevel: lvl(l.padLevel), padChord: en(l.padChord, B.enumMax), padRootHz: clamp(l.padRootHz, B.padRootHz.min, B.padRootHz.max),
    chimeLevel: lvl(l.chimeLevel), chimeRatePerMin: clamp(l.chimeRatePerMin, B.chimeRatePerMin.min, B.chimeRatePerMin.max),
    percLevel: lvl(l.percLevel), percBpm: clamp(l.percBpm, B.bpm.min, B.bpm.max), percPattern: en(l.percPattern, B.enumMax),
    lofiProgression: en(l.lofiProgression, B.enumMax), tapeWow: lvl(l.tapeWow), pianoPedal: lvl(l.pianoPedal),
    breathDepth: lvl(l.breathDepth), breathRateHz: clamp(l.breathRateHz, B.breathRateHz.min, B.breathRateHz.max),
    stereoWidth: lvl(l.stereoWidth), panDepth: lvl(l.panDepth), panRateHz: clamp(l.panRateHz, B.panRateHz.min, B.panRateHz.max),
  };
}

function stageEvent(s: Stage, tSec: number, line: number): SbgEvent {
  return {
    tSec,
    voice: {
      carrierHz: clamp(s.carrierHz, BOUNDS.carrierMin, BOUNDS.carrierMax),
      beatHz: clamp(s.beatHz, BOUNDS.beatMin, BOUNDS.beatMax),
      noise: s.noise,
      noiseLevel: clamp(s.noiseLevel, BOUNDS.noiseMin, BOUNDS.noiseMax),
      mode: s.mode,
      gain: clamp(s.gain, BOUNDS.gainMin, BOUNDS.gainMax),
      layers: resolveLayers(s.layers),
    },
    ramp: s.ramp,
    line,
  };
}

/**
 * Convert a template to sequencer events. Every value is clamped, times never decrease,
 * and a final event at the recommended duration (or the last stage) holds the end.
 */
export function templateToEvents(t: Template): SbgEvent[] {
  const maxEvents = 499;
  let prev = 0;
  const events = t.stages.slice(0, maxEvents).map((s, i) => {
    const raw = Number.isFinite(s.atMin) ? s.atMin * 60 : 0;
    prev = clamp(Math.max(prev, raw), 0, BOUNDS.maxTimeSec);
    return stageEvent(s, prev, i + 1);
  });
  const last = t.stages[Math.min(t.stages.length, maxEvents) - 1];
  if (last === undefined) return events;
  const endSec = clamp(Math.max(prev, t.recommendedMinutes * 60), 0, BOUNDS.maxTimeSec);
  events.push(stageEvent({ ...last, ramp: false }, endSec, events.length + 1));
  return events;
}
