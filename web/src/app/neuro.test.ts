import { describe, expect, it } from 'vitest';
import { PRESETS } from '../sbg';
import { parseCrewState } from './crew';
import { bandName, breathTimings, channelHz, formatElapsed, pulseAt, visibleHz } from './neuro';

describe('neuro helpers', () => {
  it('maps audio frequency to at most 3 Hz', () => {
    for (const f of [0.5, 2.5, 3, 10, 177.25, 220, 1500]) expect(visibleHz(f)).toBeLessThanOrEqual(3);
    expect(visibleHz(40)).toBeCloseTo(40 / 14, 6);
    expect(visibleHz(NaN)).toBe(0);
    expect(visibleHz(-1)).toBe(0);
  });
  it('names bands', () => {
    expect(['2.5', '6', '10', '18', '40'].map((b) => bandName(Number(b)))).toEqual([
      'delta', 'theta', 'alpha', 'beta', 'gamma',
    ]);
    expect(bandName(NaN)).toBe('unknown');
  });
  it('computes channel frequencies', () => {
    const v = { carrierHz: 200, beatHz: 10, noise: 'off', noiseLevel: 0, mode: 'binaural', gain: 0.3 } as const;
    expect(channelHz(v)).toEqual({ l: 195, r: 205 });
  });
  it('pulses in 0..1', () => {
    expect(pulseAt(0)).toBeCloseTo(0);
    expect(pulseAt(0.5)).toBeCloseTo(1);
  });
  it('formats elapsed time', () => {
    expect(formatElapsed(65)).toBe('01:05');
    expect(formatElapsed(3725)).toBe('1:02:05');
    expect(formatElapsed(NaN)).toBe('00:00');
  });
  it('defaults to 5.5 breaths per minute and honours preset breath', () => {
    const t = breathTimings();
    expect(t.inSec + t.outSec).toBeCloseTo(60 / 5.5, 6);
    const bw = PRESETS.find((p) => p.breath !== undefined);
    if (bw?.breath) expect(breathTimings(bw)).toEqual(bw.breath);
  });
});

describe('parseCrewState', () => {
  const ok = {
    version: 1,
    at: 5,
    burnout: { score: 55, level: 'flow' },
    target: { beatHz: 10, carrierHz: 200, gain: 0.4, transitionSec: 30, breathe: false },
    sbg: null,
  };
  it('accepts a valid state', () => {
    expect(parseCrewState(ok)?.burnout.level).toBe('flow');
  });
  it('clamps out-of-range values', () => {
    const s = parseCrewState({
      ...ok,
      burnout: { score: 500, level: 'weird' },
      target: { beatHz: 999, carrierHz: 1, gain: 5, transitionSec: 1, breathe: 'yes' },
    });
    expect(s?.burnout.score).toBe(100);
    expect(s?.burnout.level).toBe('decompress');
    expect(s?.target).toMatchObject({ beatHz: 40, carrierHz: 20, gain: 0.85, transitionSec: 5, breathe: false });
  });
  it('rejects wrong version, NaN and non-objects', () => {
    expect(parseCrewState({ ...ok, version: 2 })).toBeNull();
    expect(parseCrewState({ ...ok, target: { ...ok.target, gain: NaN } })).toBeNull();
    expect(parseCrewState(null)).toBeNull();
    expect(parseCrewState('x')).toBeNull();
    expect(parseCrewState([])).toBeNull();
  });
});
