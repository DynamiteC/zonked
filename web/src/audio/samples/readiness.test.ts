import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { SAMPLES, defaultSamples, moreSamples } from './catalog';
import { SAMPLE_CACHE_NAME, OLD_SAMPLE_CACHES, dropOldSampleCaches } from './cacheName';
import { createSampleInput } from './bus';
import { SAMPLE_REV } from './versions';
import {
  OUTPUT_CEILING, GUARD_KNEE, SAMPLE_HP_HZ, TARGET_LUFS, TONE_TRIM_DB, beatGain, duckGain, equalPowerCurve,
  guardCurve, natureScale, softKnee, trimGain, REF_BLEND,
} from './math';
import { hasSeamTick, stepP999 } from '../health';

const db = (g: number): number => 20 * Math.log10(g);

describe('trims table', () => {
  it('has a finite trim and measured loudness for every sound', () => {
    expect(SAMPLES.length).toBe(30);
    for (const s of SAMPLES) {
      expect(Number.isFinite(s.trimDb), s.id).toBe(true);
      expect(Number.isFinite(s.rawLufs), s.id).toBe(true);
    }
  });
  it('puts every sound within 1.5 dB of one target at level 0.4', () => {
    for (const s of SAMPLES) expect(Math.abs(s.rawLufs + s.trimDb - TARGET_LUFS), s.id).toBeLessThanOrEqual(1.5);
  });
  it('trimGain is linear gain and unity for NaN and infinity', () => {
    expect(trimGain(6.0206)).toBeCloseTo(2, 3);
    expect(trimGain(NaN)).toBe(1);
    expect(trimGain(Infinity)).toBe(1);
  });
});

describe('high-pass on the sample input', () => {
  it('is a 2nd order 40 Hz high-pass feeding the destination', () => {
    const hp = { type: '', frequency: { value: 0 }, Q: { value: 0 }, connect: vi.fn() };
    const dest = {} as AudioNode;
    const ctx = { createBiquadFilter: () => hp } as unknown as BaseAudioContext;
    createSampleInput(ctx, dest, SAMPLE_HP_HZ);
    expect(hp.type).toBe('highpass');
    expect(hp.frequency.value).toBe(40);
    expect(hp.Q.value).toBeCloseTo(-3.0103);
    expect(hp.connect).toHaveBeenCalledWith(dest);
  });
});

describe('duck and nature curves', () => {
  it('duck is 0, -10 and -20 dB at blend 0, 0.5 and 1', () => {
    expect(db(duckGain(0))).toBeCloseTo(0);
    expect(db(duckGain(0.5))).toBeCloseTo(-10);
    expect(db(duckGain(1))).toBeCloseTo(-20);
    expect(duckGain(NaN)).toBe(1);
    expect(duckGain(Infinity)).toBe(1);
  });
  it('beat gain adds the fixed tone trim and never exceeds unity', () => {
    expect(db(beatGain(0))).toBeCloseTo(TONE_TRIM_DB);
    expect(beatGain(1)).toBeLessThan(beatGain(0.5));
    for (let b = 0; b <= 1; b += 0.05) expect(beatGain(b)).toBeLessThanOrEqual(1);
  });
  it('nature scale is 0 at blend 0, 1 from the reference blend up, and rises smoothly', () => {
    expect(natureScale(0)).toBe(0);
    expect(natureScale(REF_BLEND)).toBeCloseTo(1);
    expect(natureScale(1)).toBe(1);
    expect(natureScale(NaN)).toBe(0);
    let prev = -1;
    for (let b = 0; b <= 1; b += 0.05) { const g = natureScale(b); expect(g).toBeGreaterThanOrEqual(prev); prev = g; }
  });
  it('equal-power fade curves keep power constant', () => {
    const up = equalPowerCurve(true);
    const down = equalPowerCurve(false);
    for (let i = 0; i < up.length; i++) expect((up[i] ?? 0) ** 2 + (down[i] ?? 0) ** 2).toBeCloseTo(1, 5);
  });
});

describe('soft knee guard', () => {
  it('is the identity below the knee and never passes the hard limit', () => {
    for (const x of [0, 0.3, -0.5, GUARD_KNEE, -GUARD_KNEE]) expect(softKnee(x)).toBeCloseTo(x, 9);
    for (const x of [0.81, 0.9, 1, 2, 10, 1e9, -3, -1e9]) expect(Math.abs(softKnee(x))).toBeLessThanOrEqual(OUTPUT_CEILING);
  });
  it('is monotonic and odd', () => {
    let prev = -1;
    for (let x = 0; x <= 5; x += 0.01) { const y = softKnee(x); expect(y).toBeGreaterThanOrEqual(prev); prev = y; }
    expect(softKnee(-0.9)).toBe(-softKnee(0.9));
  });
  it('maps NaN to 0 and infinity to the ceiling', () => {
    expect(softKnee(NaN)).toBe(0);
    expect(softKnee(Infinity)).toBe(OUTPUT_CEILING);
    expect(softKnee(-Infinity)).toBe(-OUTPUT_CEILING);
  });
  it('the guard curve stays inside the hard limit', () => {
    const c = guardCurve();
    expect(Math.max(...c)).toBeLessThanOrEqual(OUTPUT_CEILING);
    expect(Math.min(...c)).toBeGreaterThanOrEqual(-OUTPUT_CEILING);
  });
});

describe('seam tick check', () => {
  it('flags a step above 2 times the 99.9th percentile step and passes a smooth wrap', () => {
    const sine = Float32Array.from({ length: 4800 }, (_, i) => 0.3 * Math.sin((2 * Math.PI * 100 * i) / 4800));
    const p = stepP999(sine);
    expect(hasSeamTick(sine[0] ?? 0, sine[sine.length - 1] ?? 0, p)).toBe(false);
    expect(hasSeamTick(0, 0.114, 0.0126)).toBe(true);
  });
  it('ignores NaN and infinity', () => {
    expect(hasSeamTick(NaN, 0, 1)).toBe(false);
    expect(hasSeamTick(0, Infinity, 1)).toBe(false);
    expect(hasSeamTick(0, 1, 0)).toBe(false);
    expect(stepP999([1])).toBe(0);
    expect(Number.isFinite(stepP999([0, NaN, 1, Infinity]))).toBe(true);
  });
});

describe('sample cache version', () => {
  const dir = join(process.cwd(), 'public', 'samples');
  it('every loop has a content version equal to its file hash', () => {
    for (const s of SAMPLES.filter((x) => x.kind === 'loop')) {
      const sha = createHash('sha256').update(readFileSync(join(dir, `${s.id}.mp3.json`))).digest('hex');
      expect(SAMPLE_REV[s.id], s.id).toBe(sha.slice(0, 10));
    }
    expect(Object.keys(SAMPLE_REV)).toHaveLength(20);
  });
  it('the runtime cache name moved past the old one, and the build config uses it', () => {
    expect(SAMPLE_CACHE_NAME).not.toBe('zonked-samples');
    expect(OLD_SAMPLE_CACHES).toContain('zonked-samples');
    expect(readFileSync(join(process.cwd(), 'vite.config.ts'), 'utf8')).toContain('cacheName: SAMPLE_CACHE_NAME');
  });
  it('deletes old caches and survives a storage error', async () => {
    const del = vi.fn(async () => true);
    dropOldSampleCaches({ delete: del });
    expect(del).toHaveBeenCalledWith('zonked-samples');
    expect(() => dropOldSampleCaches({ delete: () => { throw new Error('blocked'); } })).not.toThrow();
    expect(() => dropOldSampleCaches({ delete: () => Promise.reject(new Error('x')) })).not.toThrow();
  });
});

describe('default lists', () => {
  it('keep crickets, fire, birds and gong under More sounds, reachable', () => {
    const more = moreSamples().map((s) => s.id);
    for (const id of ['crickets', 'fire', 'birds', 'gong']) expect(more).toContain(id);
    expect(defaultSamples().length + more.length).toBe(SAMPLES.length);
    expect(defaultSamples().some((s) => s.id === 'rain')).toBe(true);
  });
  it('keeps hard sounds out of sleep', () => {
    for (const id of ['crickets', 'fire', 'gong', 'thunder']) {
      expect(SAMPLES.find((s) => s.id === id)?.moods).not.toContain('sleep');
    }
  });
});
