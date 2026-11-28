import { describe, expect, it } from 'vitest';
import { BT_NOISE_GAIN, BT_XFADE_SEC, btNoiseLevel, createBtPath } from './btFilter';
import {
  HEALTH_WINDOW_MS, HealthLog, hasSeamJump, healthHint, healthLine, isLateJump, skippedQuanta,
} from './health';
import { BT_HISS_LIMIT, SAMPLES } from './samples/catalog';

class Param {
  value: number;
  calls: Array<[string, number, number]> = [];
  constructor(v = 0) { this.value = v; }
  setValueAtTime(v: number, t: number) { this.value = v; this.calls.push(['set', v, t]); return this; }
  linearRampToValueAtTime(v: number, t: number) { this.calls.push(['ramp', v, t]); return this; }
  cancelScheduledValues() { this.calls.push(['cancel', 0, 0]); return this; }
}
function node() {
  const n = { gain: new Param(), frequency: new Param(), type: '', connect: (d: unknown) => d };
  return n;
}
function fakeCtx() {
  const made: ReturnType<typeof node>[] = [];
  const ctx = { currentTime: 2, createGain: () => { const n = node(); made.push(n); return n; }, createBiquadFilter: () => { const n = node(); made.push(n); return n; } };
  return { ctx: ctx as unknown as BaseAudioContext, made };
}

describe('bluetooth filter path', () => {
  it('builds a high shelf at 6 kHz (-6 dB) and a low-pass at 9 kHz, off at first', () => {
    const { ctx, made } = fakeCtx();
    const io = node() as unknown as AudioNode;
    const path = createBtPath(ctx, io, io);
    const shelf = made.find((n) => n.type === 'highshelf');
    const lp = made.find((n) => n.type === 'lowpass');
    expect(shelf?.frequency.value).toBe(6000);
    expect(shelf?.gain.value).toBe(-6);
    expect(lp?.frequency.value).toBe(9000);
    expect(path.on()).toBe(false);
    const [dry, wet] = made.filter((n) => n.type === '');
    expect(dry?.gain.value).toBe(1);
    expect(wet?.gain.value).toBe(0);
  });

  it('switching on and off crossfades with gain ramps, never a jump', () => {
    const { ctx, made } = fakeCtx();
    const io = node() as unknown as AudioNode;
    const path = createBtPath(ctx, io, io);
    const [dry, wet] = made.filter((n) => n.type === '');
    path.setOn(true);
    expect(dry?.gain.calls).toEqual([['cancel', 0, 0], ['set', 1, 2], ['ramp', 0, 2 + BT_XFADE_SEC]]);
    expect(wet?.gain.calls).toEqual([['cancel', 0, 0], ['set', 0, 2], ['ramp', 1, 2 + BT_XFADE_SEC]]);
    expect(path.on()).toBe(true);
    path.setOn(true);
    expect(dry?.gain.calls).toHaveLength(3);
    path.setOn(false);
    expect(wet?.gain.calls.at(-1)).toEqual(['ramp', 0, 2 + BT_XFADE_SEC]);
    expect(BT_XFADE_SEC).toBeGreaterThanOrEqual(0.1);
  });

  it('lowers the noise level by 3 dB and never raises it', () => {
    expect(BT_NOISE_GAIN).toBeCloseTo(0.7079, 3);
    expect(btNoiseLevel(0.5, true)).toBeCloseTo(0.354, 3);
    expect(btNoiseLevel(0.5, false)).toBe(0.5);
    expect(btNoiseLevel(Number.NaN, true)).toBe(0);
    expect(btNoiseLevel(Infinity, true)).toBe(0);
  });
});

describe('glitch counter math', () => {
  it('counts skipped render quanta only for real gaps', () => {
    expect(skippedQuanta(0, 128)).toBe(0);
    expect(skippedQuanta(0, 255)).toBe(0);
    expect(skippedQuanta(0, 256)).toBe(1);
    expect(skippedQuanta(0, 128 * 5)).toBe(4);
    expect(skippedQuanta(500, 100)).toBe(0);
    expect(skippedQuanta(Number.NaN, 100)).toBe(0);
  });

  it('flags a late frame when the output delay jumps by more than 40 ms', () => {
    expect(isLateJump(0.02, 0.05)).toBe(false);
    expect(isLateJump(0.02, 0.09)).toBe(true);
    expect(isLateJump(0.09, 0.02)).toBe(false);
    expect(isLateJump(Number.NaN, 0.5)).toBe(false);
  });

  it('flags a loop seam that would click', () => {
    expect(hasSeamJump(0.01, -0.02, 0.8)).toBe(false);
    expect(hasSeamJump(0.7, -0.6, 0.8)).toBe(true);
    expect(hasSeamJump(0.7, -0.6, 0)).toBe(false);
  });

  it('keeps only the last 5 minutes and counts per kind', () => {
    const log = new HealthLog();
    log.record(0, 'underrun', 2);
    log.record(100_000, 'late');
    log.record(200_000, 'decode');
    log.record(Number.NaN, 'seam');
    expect(log.count(250_000)).toBe(4);
    expect(log.count(HEALTH_WINDOW_MS + 1)).toBe(2);
    expect(log.byKind(250_000)).toEqual({ underrun: 2, late: 1, decode: 1, seam: 0 });
    log.reset();
    expect(log.count(250_000)).toBe(0);
  });

  it('never stores more than the cap', () => {
    const log = new HealthLog();
    log.record(1, 'underrun', 1e9);
    log.record(1, 'late', 400);
    expect(log.count(2)).toBeLessThanOrEqual(500);
  });

  it('words the result plainly', () => {
    expect(healthLine(0)).toBe('Sound health: smooth');
    expect(healthLine(1)).toBe('1 hiccup in the last 5 minutes');
    expect(healthLine(7)).toBe('7 hiccups in the last 5 minutes');
    expect(healthHint(0)).toBe('');
    expect(healthHint(3)).toMatch(/Close heavy apps/);
  });
});

describe('sample catalog bluetooth tags', () => {
  const loops = SAMPLES.filter((s) => s.kind === 'loop');
  it('all 20 loops carry a hiss score and a btFriendly tag that agrees with it', () => {
    expect(loops).toHaveLength(20);
    for (const s of loops) {
      expect(typeof s.hiss).toBe('number');
      expect(s.btFriendly).toBe((s.hiss ?? 1) < BT_HISS_LIMIT);
    }
  });
  it('every sound has a boolean tag, and noisy synths are not friendly', () => {
    for (const s of SAMPLES) expect(typeof s.btFriendly).toBe('boolean');
    for (const id of ['rainroof', 'crackle', 'crickets']) expect(SAMPLES.find((s) => s.id === id)?.btFriendly).toBe(false);
    for (const id of ['bowl', 'brown', 'waterfall']) expect(SAMPLES.find((s) => s.id === id)?.btFriendly).toBe(true);
  });
});
