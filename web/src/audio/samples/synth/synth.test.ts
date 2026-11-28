import { describe, it, expect } from 'vitest';
import { clampFinite, makeRng, safeRate } from './dsp';
import { BED_PEAK, renderBed } from './render';
import type { BedKind } from './render';
import {
  FLUTE_PEAK_BOUND, MAX_GAP_SEC, MIN_GAP_SEC, SCALE_HZ, envelope, makePlanner, noteLength, renderFlute,
} from './flute';
import { SAMPLES } from '../catalog';

const SR = 8000;
const stats = (x: Float32Array) => {
  let peak = 0, sum = 0;
  for (const v of x) { peak = Math.max(peak, Math.abs(v)); sum += v; }
  return { peak, mean: sum / x.length, finite: x.every(Number.isFinite) };
};
const HALF_SCALE = 0.5;

describe('dsp helpers', () => {
  it('rng is deterministic and in range', () => {
    const a = makeRng(7), b = makeRng(7);
    for (let i = 0; i < 100; i++) { const v = a(); expect(v).toBe(b()); expect(v >= 0 && v < 1).toBe(true); }
    expect(makeRng(NaN)()).toBe(makeRng(0)());
  });
  it('clamps NaN and infinity', () => {
    expect(clampFinite(NaN, 1, 5, 3)).toBe(3);
    expect(clampFinite(Infinity, 1, 5)).toBe(1);
    expect(clampFinite(-Infinity, 1, 5)).toBe(1);
    expect(clampFinite(NaN, 1, 5, NaN)).toBe(1);
    expect(safeRate(NaN)).toBe(48000);
    expect(safeRate(1)).toBe(8000);
  });
});

describe.each<BedKind>(['wind', 'waterfall'])('%s bed', (kind) => {
  it('is finite, under -6 dBFS, no DC, and repeatable', () => {
    const x = renderBed(kind, SR, 1, 20);
    const s = stats(x);
    expect(s.finite).toBe(true);
    expect(s.peak).toBeLessThanOrEqual(BED_PEAK + 1e-6);
    expect(s.peak).toBeLessThan(HALF_SCALE);
    expect(Math.abs(s.mean)).toBeLessThan(1e-4);
    expect(renderBed(kind, SR, 1, 20)).toEqual(x);
    expect(renderBed(kind, SR, 2, 20)).not.toEqual(x);
  });
  it('two loops summed stay under -6 dBFS even at worst case', () => {
    const a = renderBed(kind, SR, 1, 20), b = renderBed(kind, SR, 2, 14);
    expect(0.7 * (stats(a).peak + stats(b).peak)).toBeLessThan(HALF_SCALE);
  });
  it('seam has no jump', () => {
    const x = renderBed(kind, SR, 3, 20);
    const jump = Math.abs((x[0] ?? 0) - (x[x.length - 1] ?? 0));
    expect(jump).toBeLessThan(BED_PEAK);
  });
  it('survives bad inputs', () => {
    expect(stats(renderBed(kind, NaN, NaN, NaN)).finite).toBe(true);
    expect(stats(renderBed(kind, Infinity, -Infinity, Infinity)).finite).toBe(true);
  });
});

describe('wind and waterfall shape', () => {
  it('waterfall has little energy above 6 kHz, wind has none above 2 kHz', () => {
    const sr = 48000;
    const energy = (x: Float32Array, hz: number) => {
      let re = 0, im = 0;
      for (let i = 0; i < x.length; i += 1) { const p = (2 * Math.PI * hz * i) / sr; re += (x[i] ?? 0) * Math.cos(p); im += (x[i] ?? 0) * Math.sin(p); }
      return (re * re + im * im) / x.length;
    };
    const w = renderBed('waterfall', sr, 4, 5).subarray(0, 24000);
    expect(energy(w, 10000)).toBeLessThan(energy(w, 1000) * 0.05);
    const wind = renderBed('wind', sr, 4, 5).subarray(0, 24000);
    expect(energy(wind, 6000)).toBeLessThan(energy(wind, 500) * 0.05);
  });
});

describe('flute', () => {
  it('uses the scale and spaces onsets by at least 3 s', () => {
    const next = makePlanner(11);
    let prev = next();
    for (let i = 0; i < 200; i++) {
      const n = next();
      expect(n.at - prev.at).toBeGreaterThanOrEqual(MIN_GAP_SEC);
      expect(n.at - prev.at).toBeLessThanOrEqual(MAX_GAP_SEC);
      expect(SCALE_HZ).toContain(n.hz);
      expect(n.hz).toBeGreaterThanOrEqual(220);
      expect(n.hz).toBeLessThanOrEqual(880);
      expect(noteLength(n) * 2).toBeLessThan(MIN_GAP_SEC * 3 + 4);
      prev = n;
    }
    expect(MIN_GAP_SEC).toBeGreaterThanOrEqual(3);
  });
  it('envelope is soft: 400 ms attack, 1.2 s release, bad input gives 0', () => {
    expect(envelope(0, 1)).toBe(0);
    expect(envelope(0.2, 1)).toBeCloseTo(0.5);
    expect(envelope(0.4, 1)).toBe(1);
    expect(envelope(0.4 + 1 + 0.6, 1)).toBeCloseTo(0.5);
    expect(envelope(0.4 + 1 + 1.2, 1)).toBeCloseTo(0, 9);
    expect(envelope(NaN, 1)).toBe(0);
    expect(envelope(1, NaN)).toBe(1);
  });
  it('rendered phrase is finite, quiet, no DC, same each time, and ends silent', () => {
    const x = renderFlute(SR, 5, 120);
    const s = stats(x);
    expect(s.finite).toBe(true);
    expect(s.peak).toBeLessThanOrEqual(FLUTE_PEAK_BOUND);
    expect(s.peak).toBeLessThan(HALF_SCALE);
    expect(Math.abs(s.mean)).toBeLessThan(1e-3);
    expect(renderFlute(SR, 5, 120)).toEqual(x);
    expect(x[0]).toBe(0);
  });
  it('survives bad inputs', () => {
    expect(stats(renderFlute(NaN, NaN, NaN)).finite).toBe(true);
  });
});

describe('catalog', () => {
  it('lists the synths next to the loops with plain names', () => {
    const synth = SAMPLES.filter((s) => s.kind === 'synth');
    expect(synth.map((s) => s.id)).toEqual(['wind', 'waterfall', 'flute', 'rainroof', 'bowl', 'softchimes', 'crackle', 'brown', 'swell', 'crickets']);
    expect(synth.find((s) => s.id === 'flute')?.label).toBe('Soft flute (synth)');
    for (const s of synth) expect((s.note ?? '').length).toBeGreaterThan(5);
  });
});
