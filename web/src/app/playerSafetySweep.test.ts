// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { describe, expect, it, vi } from 'vitest';
import type { Voice } from '../sbg';
import { voiceToParams } from '../audio/params';
import { fakeClock } from './fakeClock.testutil';
import { parseBackup } from './backup';
import { Player } from './player';

const bad = [Number.NaN, Infinity, -Infinity, 1e9, -1e9, 5, -5];
describe('player safety sweep (hostile values through every API)', () => {
  it('no API reaches the engine outside bounds', async () => {
    const seen: Voice[] = [];
    const eng = { start: vi.fn(async (v: Voice) => void seen.push(v)), stop: vi.fn(async () => undefined), setVoice: vi.fn((v: Voice) => void seen.push(v)) };
    const clock = fakeClock();
    const p = new Player(eng, clock, undefined, { storage: null });
    await p.play();
    for (const x of bad) {
      p.setBeatOverride(x); p.setNoiseOverride({ noiseLevel: x }); p.nudgeGain(x); p.setLayerOverride({ lofiLevel: x, padRootHz: x, breathRateHz: x });
      for (let i = 0; i < 30; i++) p.nudgeGain(0.05);
      p.applyCrew({ v: 1, updatedAt: 1, burnout: { score: 0.9 }, target: { carrierHz: x, beatHz: x, gain: x, transitionSec: x, presetId: 'p', breathe: false }, sbg: null } as never);
      clock.advance(2000);
      const r = parseBackup(JSON.stringify({ app: 'zonked', kind: 'sanctuary', v: 1, mixes: [{ v: 1, id: 'a', name: 'x', voice: { carrierHz: x, beatHz: x, gain: x, noiseLevel: x }, beatOverride: x, timer: {} }] }), 1);
      if (r.ok && r.mixes[0]) p.playMix({ ...r.mixes[0] });
      clock.advance(500);
    }
    const raw: Voice[] = [];
    expect(seen.length).toBeGreaterThan(10);
    for (const v of seen) {
      expect(v.gain).toBeLessThanOrEqual(0.85);
      expect(v.gain).toBeGreaterThanOrEqual(0);
      const params = voiceToParams(v, 0.1, new Float32Array(32));
      raw.push(v);
      expect(params[0]).toBeGreaterThanOrEqual(20);
      expect(params[0]).toBeLessThanOrEqual(1500);
      expect(params[1]).toBeGreaterThanOrEqual(0.5);
      expect(params[1]).toBeLessThanOrEqual(40);
    }
    const out = raw.filter((v) => !(v.beatHz >= 0.5 && v.beatHz <= 40 && v.carrierHz >= 20 && v.carrierHz <= 1500 && v.noiseLevel >= 0 && v.noiseLevel <= 1));
    expect(out).toEqual([]);
  });
});
