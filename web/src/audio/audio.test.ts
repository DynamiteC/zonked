import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Voice } from '../sbg/types';
import {
  PARAM_COUNT, PARAM_SAB_BYTES, ParamReader, ParamWriter, SLOT,
  clampBeat, clampCarrier, clampGain, clampNoiseLevel, clampRamp, clampVoice, voiceToParams,
} from './params';
import {
  DECIMATION, RING_FRAMES, RingTelemetryReader, TelemetryWriter, createTelemetryBuffer,
} from './telemetry';
import { WasmDsp } from './dsp-wasm';
import { DspProcessorCore } from './worklet-core';

const voice: Voice = { carrierHz: 200, beatHz: 10, noise: 'pink', noiseLevel: 0.3, mode: 'binaural', gain: 0.5 };
const wasmBytes = readFileSync(fileURLToPath(new URL('../wasm/dsp_core.wasm', import.meta.url)));
const wasmModule = new WebAssembly.Module(wasmBytes);
const SR = 48000;

describe('seqlock', () => {
  it('round-trips a block', () => {
    const buf = new SharedArrayBuffer(PARAM_SAB_BYTES);
    const w = new ParamWriter(buf), r = new ParamReader(buf);
    const src = new Float32Array(PARAM_COUNT);
    for (let i = 0; i < PARAM_COUNT; i++) src[i] = i + 1;
    w.write(src);
    const out = new Float32Array(PARAM_COUNT);
    expect(r.read(out)).toBe(true);
    expect(Array.from(out)).toEqual(Array.from(src));
  });
  it('rejects a read while the writer is mid-write (odd seq)', () => {
    const buf = new SharedArrayBuffer(PARAM_SAB_BYTES);
    const r = new ParamReader(buf);
    Atomics.add(new Int32Array(buf, 0, 1), 0, 1);
    const out = new Float32Array(PARAM_COUNT).fill(-1);
    expect(r.read(out)).toBe(false);
    expect(out[0]).toBe(-1);
  });
  it('rejects a torn read when seq changes during the copy', () => {
    const buf = new SharedArrayBuffer(PARAM_SAB_BYTES);
    const w = new ParamWriter(buf), r = new ParamReader(buf);
    w.write(new Float32Array(PARAM_COUNT).fill(1));
    r.midReadHook = () => w.write(new Float32Array(PARAM_COUNT).fill(2));
    const out = new Float32Array(PARAM_COUNT).fill(-1);
    expect(r.read(out)).toBe(false);
    expect(out[0]).toBe(-1);
    r.midReadHook = null;
    expect(r.read(out)).toBe(true);
    expect(out[7]).toBe(2);
    expect(out[31]).toBe(2);
  });
});

describe('clamps', () => {
  it('clamp ranges', () => {
    expect(clampCarrier(5)).toBe(20);
    expect(clampCarrier(9999)).toBe(1500);
    expect(clampBeat(0)).toBe(0.5);
    expect(clampBeat(100)).toBe(40);
    expect(clampGain(2)).toBe(0.85);
    expect(clampGain(-1)).toBe(0);
    expect(clampNoiseLevel(3)).toBe(1);
    expect(clampRamp(0)).toBe(0.05);
    expect(clampRamp(999)).toBe(30);
  });
  it('non-finite inputs use the fallback', () => {
    for (const bad of [NaN, Infinity, -Infinity]) {
      expect(clampCarrier(bad, 300)).toBe(300);
      expect(clampBeat(bad, 7)).toBe(7);
      expect(clampGain(bad, 0.2)).toBe(0.2);
      expect(clampNoiseLevel(bad)).toBe(0);
      expect(clampRamp(bad)).toBe(0.05);
    }
  });
  it('clampVoice keeps previous values for NaN and bad enums', () => {
    const bad = { ...voice, carrierHz: NaN, gain: Infinity, mode: 'x' as never, noise: 'y' as never };
    const c = clampVoice(bad, voice);
    expect(c.carrierHz).toBe(200);
    expect(c.gain).toBe(0.5);
    expect(c.mode).toBe('binaural');
    expect(c.noise).toBe('pink');
  });
});

describe('voice mapping', () => {
  it('maps to the C1 slots', () => {
    const out = voiceToParams({ ...voice, mode: 'isochronic', noise: 'brown' }, 2, new Float32Array(PARAM_COUNT));
    expect(out[SLOT.carrierHz]).toBe(200);
    expect(out[SLOT.beatHz]).toBe(10);
    expect(out[SLOT.gain]).toBeCloseTo(0.5);
    expect(out[SLOT.mode]).toBe(2);
    expect(out[SLOT.noiseKind]).toBe(3);
    expect(out[SLOT.noiseLevel]).toBeCloseTo(0.3);
    expect(out[SLOT.rampSec]).toBe(2);
    expect(out[SLOT.reserved]).toBe(0);
  });
  it('clamps out-of-range voices', () => {
    const out = voiceToParams({ ...voice, carrierHz: 1e9, beatHz: NaN, gain: 5 }, 100, new Float32Array(PARAM_COUNT));
    expect(out[0]).toBe(1500);
    expect(out[1]).toBe(10);
    expect(out[2]).toBeCloseTo(0.85);
    expect(out[6]).toBe(30);
  });
});

describe('telemetry ring', () => {
  const mk = () => {
    const b = createTelemetryBuffer(true);
    return { w: new TelemetryWriter(b), r: new RingTelemetryReader(b) };
  };
  const ramp = (n: number, start = 0) => {
    const l = new Float32Array(n), r = new Float32Array(n);
    for (let i = 0; i < n; i++) { l[i] = start + i; r[i] = -(start + i); }
    return { l, r };
  };
  it('decimates by 4 and keeps phase across calls', () => {
    const { w, r } = mk();
    const a = ramp(128, 0), b = ramp(128, 128);
    w.push(a.l, a.r, 128);
    w.push(b.l, b.r, 128);
    const out = new Float32Array(1024);
    const n = r.read(out);
    expect(n).toBe(256 / DECIMATION);
    expect(out[0]).toBe(0);
    expect(out[2]).toBe(4);
    expect(out[3]).toBe(-4);
    expect(out[(n - 1) * 2]).toBe(252);
  });
  it('returns 0 when empty and consumes on read', () => {
    const { w, r } = mk();
    const out = new Float32Array(64);
    expect(r.read(out)).toBe(0);
    const a = ramp(16);
    w.push(a.l, a.r, 16);
    expect(r.read(out)).toBe(4);
    expect(r.read(out)).toBe(0);
  });
  it('returns only the newest frames when out is small', () => {
    const { w, r } = mk();
    const a = ramp(64);
    w.push(a.l, a.r, 64);
    const out = new Float32Array(8);
    expect(r.read(out)).toBe(4);
    expect(out[0]).toBe(48);
  });
  it('drops on overflow and wraps correctly', () => {
    const { w, r } = mk();
    const big = ramp(128);
    for (let i = 0; i < (RING_FRAMES * DECIMATION) / 128 + 8; i++) w.push(big.l, big.r, 128);
    expect(w.dropped).toBeGreaterThan(0);
    const out = new Float32Array(RING_FRAMES * 2);
    expect(r.read(out)).toBe(RING_FRAMES);
    for (let k = 0; k < 100; k++) {
      const a = ramp(128, k * 1000);
      w.push(a.l, a.r, 128);
      const m = r.read(out);
      expect(m).toBe(32);
      expect(out[0]).toBe(k * 1000);
      expect(out[62]).toBe(k * 1000 + 124);
    }
  });
});

function goertzel(x: Float32Array, hz: number): number {
  const w = (2 * Math.PI * hz) / SR, c = 2 * Math.cos(w);
  let s1 = 0, s2 = 0;
  for (let i = 0; i < x.length; i++) { const s = (x[i] ?? 0) + c * s1 - s2; s2 = s1; s1 = s; }
  return Math.sqrt(s1 * s1 + s2 * s2 - c * s1 * s2);
}
function dominant(x: Float32Array, lo: number, hi: number): number {
  let best = lo, bm = -1;
  for (let f = lo; f <= hi; f += 0.5) { const m = goertzel(x, f); if (m > bm) { bm = m; best = f; } }
  return best;
}
function renderN(dsp: WasmDsp, frames: number, L: Float32Array, R: Float32Array, at = 0): void {
  for (let off = 0; off < frames; off += 128) {
    dsp.render(128);
    L.set(dsp.left, at + off);
    R.set(dsp.right, at + off);
  }
}
const block = (v: Voice, ramp: number) => voiceToParams(v, ramp, new Float32Array(PARAM_COUNT));

describe('WasmDsp with the real module', () => {
  it('renders 1 s finite, bounded, non-zero, with L/R differing by beatHz', () => {
    const dsp = new WasmDsp(wasmModule, SR);
    dsp.setParams(block({ ...voice, noise: 'off', noiseLevel: 0, gain: 0.8 }, 0.05));
    const n = SR - (SR % 128);
    const L = new Float32Array(SR), R = new Float32Array(SR);
    renderN(dsp, n, L, R);
    let nz = 0;
    for (let i = 0; i < n; i++) {
      expect(Number.isFinite(L[i])).toBe(true);
      expect(Math.abs(L[i] ?? 0)).toBeLessThanOrEqual(0.95);
      expect(Math.abs(R[i] ?? 0)).toBeLessThanOrEqual(0.95);
      if (L[i] !== 0) nz++;
    }
    expect(nz).toBeGreaterThan(SR / 2);
    const fl = dominant(L.subarray(SR / 2, n), 150, 250);
    const fr = dominant(R.subarray(SR / 2, n), 150, 250);
    expect(Math.abs(fl - fr)).toBeCloseTo(10, 0);
  });
  it('applies params only on change', () => {
    const dsp = new WasmDsp(wasmModule, SR);
    const b = block(voice, 0.05);
    expect(dsp.setParams(b)).toBe(true);
    expect(dsp.setParams(b)).toBe(false);
    b[0] = 300;
    expect(dsp.setParams(b)).toBe(true);
  });
  it('has no discontinuity on a carrier step', () => {
    const dsp = new WasmDsp(wasmModule, SR);
    const v = { ...voice, noise: 'off' as const, noiseLevel: 0, gain: 0.8 };
    dsp.setParams(block(v, 0.05));
    const n2 = SR / 2 - ((SR / 2) % 128);
    const L = new Float32Array(n2 * 2), R = new Float32Array(n2 * 2);
    renderN(dsp, n2, L, R);
    dsp.setParams(block({ ...v, carrierHz: 400 }, 0.05));
    renderN(dsp, n2, L, R, n2);
    let maxStep = 0;
    for (let i = 1; i < n2 * 2; i++) maxStep = Math.max(maxStep, Math.abs((L[i] ?? 0) - (L[i - 1] ?? 0)));
    expect(maxStep).toBeLessThan(0.1);
  });
});

describe('DspProcessorCore', () => {
  it('renders via SAB params, pushes telemetry, tracks stats', () => {
    const sab = new SharedArrayBuffer(PARAM_SAB_BYTES);
    const tele = createTelemetryBuffer(true);
    const core = new DspProcessorCore(wasmModule, SR, sab, tele);
    new ParamWriter(sab).write(block({ ...voice, gain: 0.8 }, 0.05));
    const L = new Float32Array(128), R = new Float32Array(128);
    for (let i = 0; i < 200; i++) core.process(L, R);
    const s = core.stats();
    expect(s.frames).toBe(200 * 128);
    expect(s.peak).toBeGreaterThan(0.01);
    expect(s.peak).toBeLessThanOrEqual(0.95);
    expect(s.rms).toBeGreaterThan(0);
    expect(s.nonZero).toBeGreaterThan(0);
    expect(new RingTelemetryReader(tele).read(new Float32Array(RING_FRAMES * 2))).toBeGreaterThan(0);
  });
  it('accepts postMessage fallback params', () => {
    const core = new DspProcessorCore(wasmModule, SR);
    core.setParamsFromMessage(block({ ...voice, gain: 0.8 }, 0.05));
    const L = new Float32Array(128), R = new Float32Array(128);
    for (let i = 0; i < 100; i++) core.process(L, R);
    expect(core.stats().peak).toBeGreaterThan(0.01);
  });
});

describe('WasmDsp memory growth and phase reset', () => {
  it('rebuilds its views when wasm memory grows and keeps rendering finite output', () => {
    const dsp = new WasmDsp(wasmModule, 48000);
    const block = new Float32Array(32);
    block[0] = 200;
    block[1] = 10;
    block[5] = 0.5;
    dsp.setParams(block);
    const mem = (dsp as unknown as { ex: { memory: WebAssembly.Memory } }).ex.memory;
    const before = dsp.left;
    mem.grow(1);
    dsp.render();
    expect(dsp.left).not.toBe(before);
    expect(dsp.left.every((x) => Number.isFinite(x) && Math.abs(x) <= 0.95)).toBe(true);
    block[1] = 12;
    mem.grow(1);
    expect(dsp.setParams(block)).toBe(true);
    dsp.resetPhase();
    dsp.render();
    expect(dsp.right.every((x) => Number.isFinite(x) && Math.abs(x) <= 0.95)).toBe(true);
  });
});
