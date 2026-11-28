import { describe, it, expect, vi } from 'vitest';
import { SAMPLES } from './catalog';
import type { SampleBus } from './bus';
import { XFADE_SEC, createSampleLayer } from './layer';
import { SAMPLE_REV } from './versions';
import {
  DUCK_DEPTH_DB, FADE_IN_SEC, FADE_OUT_SEC, MAX_SAMPLE_LEVEL, OUTPUT_CEILING,
  blendFromLevel, clampBlend, clampLevel, duckGain, guardCurve, trimGain,
} from './math';

class FakeParam {
  value = 0;
  calls: Array<[string, number, number]> = [];
  setValueAtTime(v: number, t: number) { this.value = v; this.calls.push(['set', v, t]); return this; }
  setValueCurveAtTime(c: Float32Array, t: number, d: number) { this.calls.push(['curve', c[c.length - 1] ?? 0, d]); void t; return this; }
  linearRampToValueAtTime(v: number, t: number) { this.calls.push(['ramp', v, t]); return this; }
  setTargetAtTime(v: number, t: number, tau: number) { this.calls.push(['target', v, tau]); void t; return this; }
  cancelScheduledValues() { this.calls.push(['cancel', 0, 0]); return this; }
}
const makeBus = () => {
  const made: Array<{ src: Record<string, unknown>; gain: { gain: FakeParam; connect: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> } }> = [];
  const duck = { gain: new FakeParam() };
  const ctx = {
    currentTime: 1,
    decodeAudioData: vi.fn(async () => ({ duration: 30 })),
    createBufferSource: () => {
      const src = { buffer: null, loop: false, connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null };
      const gain = { gain: new FakeParam(), connect: vi.fn(), disconnect: vi.fn() };
      made.push({ src, gain });
      return src;
    },
    createGain: () => made[made.length - 1]?.gain,
  };
  return { bus: { ctx, input: {}, duck } as unknown as SampleBus, ctx, duck, made };
};
const deps = (bus: SampleBus | null, fetchBytes: (u: string) => Promise<ArrayBuffer> = async () => new ArrayBuffer(8)) => ({
  getBus: () => bus, fetchBytes, baseUrl: '/', origin: 'http://localhost/',
});

describe('math', () => {
  it('clamps level and falls back on NaN and infinity', () => {
    expect(clampLevel(-1)).toBe(0);
    expect(clampLevel(5)).toBe(MAX_SAMPLE_LEVEL);
    expect(clampLevel(NaN, 0.3)).toBe(0.3);
    expect(clampLevel(Infinity, 0.3)).toBe(0.3);
    expect(clampLevel(-Infinity, 9)).toBe(MAX_SAMPLE_LEVEL);
    expect(clampLevel(NaN, NaN)).toBe(0);
  });
  it('clamps blend', () => {
    expect(clampBlend(-2)).toBe(0);
    expect(clampBlend(2)).toBe(1);
    expect(clampBlend(NaN, 0.5)).toBe(0.5);
    expect(clampBlend(Infinity)).toBe(0);
  });
  it('duck gain is 0, -10 and -20 dB at blend 0, 0.5 and 1, monotonic', () => {
    expect(duckGain(0)).toBe(1);
    expect(duckGain(0.5)).toBeCloseTo(10 ** (-10 / 20));
    expect(duckGain(1)).toBeCloseTo(10 ** (DUCK_DEPTH_DB / 20));
    expect(duckGain(NaN)).toBe(1);
    let prev = 2;
    for (let b = 0; b <= 1; b += 0.1) { const g = duckGain(b); expect(g).toBeLessThanOrEqual(prev); prev = g; }
  });
  it('blend follows level', () => {
    expect(blendFromLevel(MAX_SAMPLE_LEVEL)).toBe(1);
    expect(blendFromLevel(0)).toBe(0);
    expect(blendFromLevel(NaN)).toBe(0);
  });
  it('guard curve never exceeds the ceiling', () => {
    const c = guardCurve();
    expect(Math.max(...c)).toBeLessThanOrEqual(OUTPUT_CEILING);
    expect(Math.min(...c)).toBeGreaterThanOrEqual(-OUTPUT_CEILING);
    expect(guardCurve(1).length).toBe(3);
  });
  it('fade constants meet the safety rules', () => {
    expect(FADE_IN_SEC).toBeGreaterThanOrEqual(2);
    expect(FADE_OUT_SEC).toBeGreaterThanOrEqual(0.25);
  });
});

describe('layer', () => {
  it('lists the catalog', () => {
    expect(createSampleLayer(deps(null)).list()).toBe(SAMPLES);
    expect(SAMPLES.length).toBeGreaterThanOrEqual(6);
  });
  it('returns an error value when the engine has no bus', async () => {
    const r = await createSampleLayer(deps(null)).start('rain', 0.5);
    expect(r.ok).toBe(false);
  });
  it('rejects unknown ids without fetching', async () => {
    const { bus } = makeBus();
    const f = vi.fn(async (u: string) => { void u; return new ArrayBuffer(1); });
    const r = await createSampleLayer(deps(bus, f)).start('../evil', 0.5);
    expect(r).toEqual({ ok: false, error: 'unknown sample' });
    expect(f).not.toHaveBeenCalled();
  });
  it('reports fetch and decode failures as values', async () => {
    const m = makeBus();
    const bad = createSampleLayer(deps(m.bus, async () => { throw new Error('offline'); }));
    expect((await bad.start('rain', 0.5)).ok).toBe(false);
    m.ctx.decodeAudioData.mockRejectedValueOnce(new Error('bad data'));
    expect((await createSampleLayer(deps(m.bus)).start('rain', 0.5)).ok).toBe(false);
  });
  it('fetches the same origin only, once, then caches the buffer', async () => {
    const m = makeBus();
    const f = vi.fn(async (u: string) => { void u; return new ArrayBuffer(8); });
    const layer = createSampleLayer(deps(m.bus, f));
    await layer.start('rain', 0.4);
    await layer.start('rain', 0.4);
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0]?.[0]).toBe(`http://localhost/samples/rain.mp3.json?v=${SAMPLE_REV['rain']}`);
  });
  it('loops, fades in over 2 s and ducks the beat', async () => {
    const m = makeBus();
    const layer = createSampleLayer(deps(m.bus));
    expect((await layer.start('ocean', 0.85)).ok).toBe(true);
    const h = m.made[0];
    expect(h?.src['loop']).toBe(true);
    expect(h?.gain.gain.calls).toContainEqual(['ramp', 0.85 * trimGain(2.5), 1 + FADE_IN_SEC]);
    expect(m.duck.gain.calls.at(-1)?.[1]).toBeCloseTo(trimGain(-8) * 0.1);
  });
  it('clamps hostile levels', async () => {
    const m = makeBus();
    const layer = createSampleLayer(deps(m.bus));
    await layer.start('rain', Infinity);
    expect(m.made[0]?.gain.gain.calls).toContainEqual(['ramp', 0, 1 + FADE_IN_SEC]);
    layer.setLevel(99);
    expect(m.made[0]?.gain.gain.calls.filter((c) => c[0] === 'target').at(-1)?.[1]).toBeCloseTo(MAX_SAMPLE_LEVEL * trimGain(2));
    layer.setLevel(NaN);
    expect(m.made[0]?.gain.gain.calls.filter((c) => c[0] === 'target').at(-1)?.[1]).toBeCloseTo(MAX_SAMPLE_LEVEL * trimGain(2));
  });
  it('explicit blend wins and NaN keeps the last value', async () => {
    const m = makeBus();
    const layer = createSampleLayer(deps(m.bus));
    await layer.start('rain', 0.85);
    layer.setBlend(0.5);
    expect(m.duck.gain.calls.at(-1)?.[1]).toBeCloseTo(trimGain(-8) * trimGain(-10));
    layer.setBlend(NaN);
    expect(m.duck.gain.calls.at(-1)?.[1]).toBeCloseTo(trimGain(-8) * trimGain(-10));
  });
  it('stop fades out over at least 250 ms and restores the beat', async () => {
    const m = makeBus();
    const layer = createSampleLayer(deps(m.bus));
    await layer.start('rain', 0.5);
    layer.stop();
    const g = m.made[0]?.gain.gain;
    expect(g?.calls).toContainEqual(['ramp', 0, 1 + FADE_OUT_SEC]);
    expect(m.duck.gain.calls.at(-1)?.[1]).toBeCloseTo(trimGain(-8));
    expect(layer.playing()).toBeNull();
    layer.stop();
  });
  it('a second sample fades the first out', async () => {
    const m = makeBus();
    const layer = createSampleLayer(deps(m.bus));
    await layer.start('rain', 0.5);
    await layer.start('birds', 0.5);
    expect(m.made).toHaveLength(2);
    expect(m.made[0]?.gain.gain.calls).toContainEqual(['curve', 0, XFADE_SEC]);
    expect(layer.playing()).toBe('birds');
  });
  it('setLevel and setBlend are safe with no bus or no sample', () => {
    const layer = createSampleLayer(deps(null));
    expect(() => { layer.setLevel(0.5); layer.setBlend(0.5); layer.stop(); }).not.toThrow();
  });
});
