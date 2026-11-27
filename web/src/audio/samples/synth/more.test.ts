import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderAnyBed, CRICKET_PEAK } from './beds';
import type { ExtraBedKind } from './beds';
import { BED_PEAK } from './render';
import { SPECS, makeStrikePlanner, peakBound, renderStrikes, strikeEnv, strikeLength } from './strikes';
import type { StrikeKind } from './strikes';
import { SAMPLES } from '../catalog';

const SR = 8000;
const HALF = 0.5;
const stats = (x: Float32Array) => {
  let peak = 0, sum = 0;
  for (const v of x) { peak = Math.max(peak, Math.abs(v)); sum += v; }
  return { peak, mean: sum / x.length, finite: x.every(Number.isFinite) };
};

describe.each<ExtraBedKind>(['rainroof', 'brown', 'swell', 'crackle', 'crickets'])('%s bed', (kind) => {
  const limit = kind === 'crickets' ? CRICKET_PEAK : BED_PEAK;
  it('is finite, under -6 dBFS, no DC, repeatable and seeded', () => {
    const x = renderAnyBed(kind, SR, 1, 20);
    const s = stats(x);
    expect(s.finite).toBe(true);
    expect(s.peak).toBeLessThanOrEqual(limit + 1e-6);
    expect(Math.abs(s.mean)).toBeLessThan(1e-4);
    expect(renderAnyBed(kind, SR, 1, 20)).toEqual(x);
    expect(renderAnyBed(kind, SR, 2, 20)).not.toEqual(x);
  });
  it('two loops summed with the mix gain stay under -6 dBFS', () => {
    const a = renderAnyBed(kind, SR, 1, 20), b = renderAnyBed(kind, SR, 2, 14);
    expect(0.7 * (stats(a).peak + stats(b).peak)).toBeLessThan(HALF);
  });
  it('loop seam has no jump bigger than the bed peak', () => {
    const x = renderAnyBed(kind, SR, 3, 20);
    expect(Math.abs((x[0] ?? 0) - (x[x.length - 1] ?? 0))).toBeLessThan(limit);
  });
  it('survives NaN and infinity inputs', () => {
    expect(stats(renderAnyBed(kind, NaN, NaN, NaN)).finite).toBe(true);
    expect(stats(renderAnyBed(kind, Infinity, -Infinity, Infinity)).finite).toBe(true);
  });
});

describe('bed shapes', () => {
  it('brown noise has much more low than high energy', () => {
    const x = renderAnyBed('brown', 16000, 4, 10);
    const band = (lo: number, hi: number) => {
      let e = 0;
      for (let f = lo; f < hi; f += 50) {
        let re = 0, im = 0;
        for (let i = 0; i < 16000; i++) { const p = (2 * Math.PI * f * i) / 16000; re += (x[i] ?? 0) * Math.cos(p); im += (x[i] ?? 0) * Math.sin(p); }
        e += re * re + im * im;
      }
      return e;
    };
    expect(band(50, 250)).toBeGreaterThan(band(1000, 1200) * 10);
  });
  it.each([1, 2, 3, 4])('swell level rises and falls (loudest second at least 2 times the quietest), seed %i', (seed) => {
    const x = renderAnyBed('swell', SR, seed, 20);
    const sec: number[] = [];
    for (let s = 0; s < 20; s++) {
      let e = 0;
      for (let i = s * SR; i < (s + 1) * SR; i++) e += (x[i] ?? 0) ** 2;
      sec.push(Math.sqrt(e / SR));
    }
    expect(Math.max(...sec)).toBeGreaterThan(2 * Math.min(...sec));
  });
});

describe.each<StrikeKind>(['bowl', 'softchimes'])('%s strikes', (kind) => {
  it('keeps the minimum gap and the scale', () => {
    const next = makeStrikePlanner(kind, 9);
    let prev = next();
    for (let i = 0; i < 200; i++) {
      const s = next();
      expect(s.at - prev.at).toBeGreaterThanOrEqual(SPECS[kind].minGap);
      expect(s.at - prev.at).toBeLessThanOrEqual(SPECS[kind].maxGap);
      expect(SPECS[kind].scale).toContain(s.hz);
      prev = s;
    }
  });
  it('partial shares add up to 1 and strikes end', () => {
    expect(SPECS[kind].partials.reduce((a, p) => a + p.amp, 0)).toBeCloseTo(1);
    const s = makeStrikePlanner(kind, 1)();
    expect(strikeLength(s)).toBeGreaterThan(5);
  });
  it('rendered sound is finite, under its bound and under -6 dBFS, repeatable', () => {
    const x = renderStrikes(kind, SR, 7, 240);
    const s = stats(x);
    expect(s.finite).toBe(true);
    expect(s.peak).toBeLessThanOrEqual(peakBound(kind));
    expect(peakBound(kind)).toBeLessThan(HALF);
    expect(renderStrikes(kind, SR, 7, 240)).toEqual(x);
    expect(renderStrikes(kind, SR, 8, 240)).not.toEqual(x);
  });
  it('survives bad inputs', () => {
    expect(stats(renderStrikes(kind, NaN, NaN, NaN)).finite).toBe(true);
    expect(stats(renderStrikes(kind, Infinity, 1, -Infinity)).finite).toBe(true);
  });
});

describe('strike envelope', () => {
  it('rises, then decays, and bad input gives 0', () => {
    expect(strikeEnv(0, 0.05, 2)).toBe(0);
    expect(strikeEnv(0.025, 0.05, 2)).toBeCloseTo(0.5);
    expect(strikeEnv(0.05, 0.05, 2)).toBe(1);
    expect(strikeEnv(2.05, 0.05, 2)).toBeCloseTo(Math.exp(-1));
    expect(strikeEnv(NaN, 0.05, 2)).toBe(0);
  });
  it('a bowl never strikes more than once per 8 s', () => {
    expect(SPECS.bowl.minGap).toBeGreaterThanOrEqual(8);
  });
});

describe('catalog', () => {
  it('gives every entry a note, a kind and at least one mood, with unique ids', () => {
    const ids = new Set<string>();
    for (const s of SAMPLES) {
      expect(ids.has(s.id)).toBe(false);
      ids.add(s.id);
      expect(s.kind === 'loop' || s.kind === 'synth').toBe(true);
      expect((s.note ?? '').length).toBeGreaterThan(5);
      expect((s.moods ?? []).length).toBeGreaterThan(0);
    }
  });
  it('has a file for every loop and no file without an entry', () => {
    const dir = join(process.cwd(), 'public', 'samples');
    const files = readdirSync(dir).filter((f) => f.endsWith('.mp3.json')).map((f) => f.replace('.mp3.json', '')).sort();
    const loops = SAMPLES.filter((s) => s.kind === 'loop').map((s) => s.id).sort();
    expect(loops).toEqual(files);
  });
});
