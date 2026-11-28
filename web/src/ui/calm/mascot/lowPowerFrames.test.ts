import { describe, expect, it } from 'vitest';
import { SLOW_FRAME_MS, framesTooSlow, resetSlowDeviceForTests, slowDeviceSeen, watchFrames } from './lowPower';

const run = (gapMs: number, onSlow: () => void): void => {
  let t = 1000;
  const queue: FrameRequestCallback[] = [];
  const raf = ((cb: FrameRequestCallback) => (queue.push(cb), queue.length)) as typeof requestAnimationFrame;
  watchFrames(onSlow, raf);
  for (let i = 0; i < 400 && queue.length > 0; i += 1) {
    t += gapMs;
    queue.shift()?.(t);
  }
};

describe('frame watcher', () => {
  it('calls it slow when the mean gap is over 20 ms', () => {
    expect(framesTooSlow(Array.from({ length: 40 }, () => SLOW_FRAME_MS + 6))).toBe(true);
    expect(framesTooSlow(Array.from({ length: 40 }, () => 16.7))).toBe(false);
  });
  it('ignores paused gaps and too few samples', () => {
    expect(framesTooSlow([2000, 3000, 5000])).toBe(false);
    expect(framesTooSlow(Array.from({ length: 40 }, (_, i) => (i % 2 === 0 ? 16 : 5000)))).toBe(false);
    expect(framesTooSlow([Number.NaN, -3, 0])).toBe(false);
  });
  it('fires once on a slow device and remembers it', () => {
    resetSlowDeviceForTests();
    let n = 0;
    run(33, () => (n += 1));
    expect(n).toBe(1);
    expect(slowDeviceSeen()).toBe(true);
    resetSlowDeviceForTests();
  });
  it('stays quiet on a smooth device', () => {
    resetSlowDeviceForTests();
    let n = 0;
    run(16.7, () => (n += 1));
    expect(n).toBe(0);
    expect(slowDeviceSeen()).toBe(false);
  });
});
