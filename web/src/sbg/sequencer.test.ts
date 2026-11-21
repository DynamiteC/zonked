import { describe, expect, it } from 'vitest';
import { NO_LAYERS } from './layers';
import type { Layers } from './layers';
import { voiceAt } from './sequencer';
import type { SbgEvent, Voice } from './types';

const v = (layers?: Layers): Voice => ({
  carrierHz: 200, beatHz: 10, noise: 'off', noiseLevel: 0, mode: 'binaural', gain: 0.3,
  ...(layers ? { layers } : {}),
});
const ev = (tSec: number, voice: Voice, ramp = true): SbgEvent => ({ tSec, voice, ramp, line: 1 });

describe('voiceAt layers', () => {
  const a: Layers = { ...NO_LAYERS, lofiLevel: 0, padLevel: 0.2, instKind: 0, padChord: 1 };
  const b: Layers = { ...NO_LAYERS, lofiLevel: 1, padLevel: 0.6, instKind: 2, padChord: 5 };

  it('interpolates numeric fields linearly', () => {
    const r = voiceAt([ev(0, v(a)), ev(100, v(b))], 25);
    expect(r.layers?.lofiLevel).toBeCloseTo(0.25);
    expect(r.layers?.padLevel).toBeCloseTo(0.3);
  });
  it('snaps integer fields at the earlier event until the next event time', () => {
    const events = [ev(0, v(a)), ev(100, v(b))];
    expect(voiceAt(events, 99).layers?.instKind).toBe(0);
    expect(voiceAt(events, 99).layers?.padChord).toBe(1);
    expect(voiceAt(events, 100).layers?.instKind).toBe(2);
  });
  it('omits layers when neither event has them', () => {
    const r = voiceAt([ev(0, v()), ev(100, v())], 50);
    expect('layers' in r).toBe(false);
  });
  it('blends toward NO_LAYERS when only one side has layers', () => {
    const r = voiceAt([ev(0, v()), ev(100, v(b))], 50);
    expect(r.layers?.lofiLevel).toBeCloseTo(0.5);
    expect(r.layers?.instKind).toBe(NO_LAYERS.instKind);
  });
  it('returns the event voice unchanged when not ramping', () => {
    const r = voiceAt([ev(0, v(a), false), ev(100, v(b))], 50);
    expect(r.layers).toEqual(a);
  });
});
