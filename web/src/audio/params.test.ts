import { describe, expect, it } from 'vitest';
import { NO_LAYERS } from '../sbg/layers';
import type { Voice } from '../sbg/types';
import {
  LEGACY_PARAM_COUNT, PARAM_COUNT, PARAM_SAB_BYTES, SLOT, clampEnum, clampLayers, clampVoice, voiceToParams,
} from './params';
import { WasmDsp } from './dsp-wasm';

const voice: Voice = { carrierHz: 200, beatHz: 10, noise: 'off', noiseLevel: 0, mode: 'binaural', gain: 0.3 };
const out = () => new Float32Array(PARAM_COUNT);

describe('32-slot param block', () => {
  it('has the C1 size and layout', () => {
    expect(PARAM_COUNT).toBe(32);
    expect(PARAM_SAB_BYTES).toBe(4 + 32 * 4);
    expect(SLOT.lofiLevel).toBe(8);
    expect(SLOT.percPattern).toBe(23);
  });
  it('writes NO_LAYERS defaults when the voice has no layers, reserved slots 0', () => {
    const b = voiceToParams(voice, 1, out());
    expect(b[SLOT.lofiLevel]).toBe(0);
    expect(b[SLOT.instRootHz]).toBe(220);
    expect(b[SLOT.padRootHz]).toBe(110);
    for (const k of ['lofiProgression', 'tapeWow', 'pianoPedal', 'breathDepth', 'stereoWidth', 'panDepth'] as const) expect(b[SLOT[k]]).toBe(0);
    expect(b[SLOT.breathRateHz]).toBeCloseTo(NO_LAYERS.breathRateHz, 6);
    expect(b[SLOT.panRateHz]).toBeCloseTo(NO_LAYERS.panRateHz, 6);
  });
  it('maps every layer field to its slot', () => {
    const layers = {
      lofiLevel: 0.1, lofiWarmth: 0.2, crackle: 0.3, instLevel: 0.4, instKind: 2, instRootHz: 300, instScale: 5,
      instBpm: 90, padLevel: 0.5, padChord: 3, padRootHz: 120, chimeLevel: 0.6, chimeRatePerMin: 12,
      percLevel: 0.7, percBpm: 100, percPattern: 6,
      lofiProgression: 3, tapeWow: 0.4, pianoPedal: 0.5, breathDepth: 0.6, breathRateHz: 0.1,
      stereoWidth: 0.7, panDepth: 0.2, panRateHz: 0.05,
    };
    const b = voiceToParams({ ...voice, layers }, 1, out());
    const expected = [0.1, 0.2, 0.3, 0.4, 2, 300, 5, 90, 0.5, 3, 120, 0.6, 12, 0.7, 100, 6, 3, 0.4, 0.5, 0.6, 0.1, 0.7, 0.2, 0.05];
    expected.forEach((v, i) => expect(b[8 + i]).toBeCloseTo(v, 5));
  });
  it('clamps out-of-range, NaN and infinity layer values', () => {
    const bad = {
      ...NO_LAYERS, lofiLevel: 5, lofiWarmth: -1, crackle: NaN, instLevel: Infinity, instKind: 9.7, instRootHz: 1,
      instScale: -3, instBpm: 1e6, padLevel: -Infinity, padChord: 2.4, padRootHz: 9999, chimeLevel: 2,
      chimeRatePerMin: 0, percLevel: NaN, percBpm: NaN, percPattern: 100,
    };
    const b = voiceToParams({ ...voice, layers: bad }, 1, out());
    expect(b[SLOT.lofiLevel]).toBe(1);
    expect(b[SLOT.lofiWarmth]).toBe(0);
    expect(b[SLOT.crackle]).toBe(NO_LAYERS.crackle);
    expect(b[SLOT.instLevel]).toBe(NO_LAYERS.instLevel);
    expect(b[SLOT.instKind]).toBe(3);
    expect(b[SLOT.instRootHz]).toBe(55);
    expect(b[SLOT.instScale]).toBe(0);
    expect(b[SLOT.instBpm]).toBe(180);
    expect(b[SLOT.padLevel]).toBe(NO_LAYERS.padLevel);
    expect(b[SLOT.padChord]).toBe(2);
    expect(b[SLOT.padRootHz]).toBe(440);
    expect(b[SLOT.chimeLevel]).toBe(1);
    expect(b[SLOT.chimeRatePerMin]).toBe(1);
    expect(b[SLOT.percLevel]).toBe(NO_LAYERS.percLevel);
    expect(b[SLOT.percBpm]).toBe(NO_LAYERS.percBpm);
    expect(b[SLOT.percPattern]).toBe(7);
    for (const v of b) expect(Number.isFinite(v)).toBe(true);
  });
  it('rounds integer enums and clamps', () => {
    expect(clampEnum(2.5)).toBe(3);
    expect(clampEnum(-1)).toBe(0);
    expect(clampEnum(NaN, 4)).toBe(4);
    expect(clampLayers(undefined)).toEqual(NO_LAYERS);
  });
  it('clampVoice keeps layers clamped and omits them when absent', () => {
    expect(clampVoice(voice).layers).toBeUndefined();
    expect(clampVoice({ ...voice, layers: { ...NO_LAYERS, lofiLevel: 9 } }).layers?.lofiLevel).toBe(1);
  });
});

function fakeModule(count: number | null) {
  const memory = new WebAssembly.Memory({ initial: 1 });
  const PB = 1024;
  const guard = new Float32Array(memory.buffer, PB, 40).fill(-7);
  const applied: number[][] = [];
  const exports: Record<string, unknown> = {
    memory,
    zk_init: () => undefined,
    zk_param_block: () => PB,
    zk_apply_params: () => void applied.push(Array.from(new Float32Array(memory.buffer, PB, 32))),
    zk_render: () => undefined,
    zk_out_left: () => 4096,
    zk_out_right: () => 8192,
    zk_reset_phase: () => undefined,
  };
  if (count !== null) exports['zk_param_count'] = () => count;
  return { exports, applied, guard };
}

describe('backward compatibility with an 8-slot wasm', () => {
  const orig = WebAssembly.Instance;
  const stub = (exports: Record<string, unknown>) => {
    (WebAssembly as unknown as { Instance: unknown }).Instance = class { exports = exports; };
  };
  const restore = () => { (WebAssembly as unknown as { Instance: unknown }).Instance = orig; };

  it('writes only 8 slots when zk_param_count is absent', () => {
    const f = fakeModule(null);
    stub(f.exports);
    try {
      const dsp = new WasmDsp({} as WebAssembly.Module, 48000);
      expect(dsp.slots).toBe(LEGACY_PARAM_COUNT);
      dsp.setParams(voiceToParams({ ...voice, layers: { ...NO_LAYERS, lofiLevel: 1 } }, 1, out()));
      const a = f.applied[0] ?? [];
      expect(a[2]).toBeCloseTo(0.3);
      expect(a[8]).toBe(-7);
    } finally { restore(); }
  });
  it('writes all 32 slots when zk_param_count reports 32, and caps larger counts', () => {
    for (const reported of [32, 64]) {
      const f = fakeModule(reported);
      stub(f.exports);
      try {
        const dsp = new WasmDsp({} as WebAssembly.Module, 48000);
        expect(dsp.slots).toBe(32);
        dsp.setParams(voiceToParams({ ...voice, layers: { ...NO_LAYERS, lofiLevel: 1 } }, 1, out()));
        expect(f.applied[0]?.[8]).toBe(1);
      } finally { restore(); }
    }
  });
  it('treats a garbage count as legacy', () => {
    const f = fakeModule(NaN);
    stub(f.exports);
    try {
      expect(new WasmDsp({} as WebAssembly.Module, 48000).slots).toBe(8);
    } finally { restore(); }
  });
});

describe('WasmDsp slot detection', () => {
  it('uses only the slots the module owns', async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const mod = new WebAssembly.Module(readFileSync(fileURLToPath(new URL('../wasm/dsp_core.wasm', import.meta.url))));
    const ex = WebAssembly.Module.exports(mod).map((e) => e.name);
    const dsp = new WasmDsp(mod, 48000);
    expect(dsp.slots).toBe(ex.includes('zk_param_count') ? PARAM_COUNT : LEGACY_PARAM_COUNT);
    const b = voiceToParams({ ...voice, gain: 0.5, layers: { ...NO_LAYERS, lofiLevel: 1 } }, 0.05, out());
    expect(dsp.setParams(b)).toBe(true);
    for (let i = 0; i < 50; i++) dsp.render(128);
    for (const v of dsp.left) expect(Math.abs(v)).toBeLessThanOrEqual(0.95);
  });
});
