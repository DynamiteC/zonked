// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SampleBus } from './bus';
import { DECODE_TIMEOUT_MS, SYNTH_FALLBACK, createSampleLayer } from './layer';
import { SAMPLES } from './catalog';

const built = vi.fn();
vi.mock('./synth/graph', () => ({
  buildSynth: (_ctx: unknown, id: string) => {
    built(id);
    return { connect: vi.fn(), disconnect: vi.fn(), stop: vi.fn(), onended: null };
  },
}));

const param = () => ({ setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), cancelScheduledValues: vi.fn(), value: 0 });

function rig(decode: () => Promise<unknown>) {
  const ctx = { currentTime: 1, decodeAudioData: vi.fn(decode), createGain: () => ({ gain: param(), connect: vi.fn(), disconnect: vi.fn() }), createBufferSource: () => ({ buffer: null, loop: false, connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null }) };
  const bus = { ctx, input: {}, duck: { gain: param() } } as unknown as SampleBus;
  const layer = createSampleLayer({ getBus: () => bus, fetchBytes: async () => new ArrayBuffer(8), baseUrl: '/', origin: 'http://localhost/' });
  return { layer, ctx };
}

beforeEach(() => {
  vi.useFakeTimers();
  built.mockClear();
});
afterEach(() => vi.useRealTimers());

describe('decode timeout', () => {
  it('falls back to the closest made-in-code sound after 8 s, with one note', async () => {
    const { layer } = rig(() => new Promise(() => undefined));
    const p = layer.start('rain', 0.5);
    await vi.advanceTimersByTimeAsync(DECODE_TIMEOUT_MS - 1);
    expect(built).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2);
    const r = await p;
    expect(r).toMatchObject({ ok: true });
    expect(r.ok && r.note).toMatch(/could not load in this browser.*rain on a roof/);
    expect(built).toHaveBeenCalledWith('rainroof');
    expect(layer.playing()).toBe('rainroof');
  });

  it('maps water to the waterfall', async () => {
    const { layer } = rig(() => new Promise(() => undefined));
    const p = layer.start('stream', 0.5);
    await vi.advanceTimersByTimeAsync(DECODE_TIMEOUT_MS + 1);
    await p;
    expect(built).toHaveBeenCalledWith('waterfall');
  });

  it('a decode that finishes in time plays the recording with no note', async () => {
    const { layer } = rig(async () => ({ duration: 30 }));
    const r = layer.start('rain', 0.5);
    await vi.advanceTimersByTimeAsync(10);
    const out = await r;
    expect(built).not.toHaveBeenCalled();
    expect(out).toEqual({ ok: true });
    expect(layer.playing()).toBe('rain');
  });

  it('a decode that fails fast keeps the plain error and does not fall back', async () => {
    const { layer } = rig(() => Promise.reject(new Error('bad data')));
    const r = await layer.start('rain', 0.5);
    expect(r).toEqual({ ok: false, error: 'sample unavailable: check the connection or reinstall the app files' });
    expect(built).not.toHaveBeenCalled();
  });

  it('every recording has a synth fallback that exists', () => {
    const synths = new Set(SAMPLES.filter((s) => s.kind === 'synth').map((s) => s.id));
    for (const s of SAMPLES.filter((x) => x.kind === 'loop')) expect(synths.has(SYNTH_FALLBACK[s.id] ?? '')).toBe(true);
  });
});
