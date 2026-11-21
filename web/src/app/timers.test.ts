import { describe, expect, it, vi } from 'vitest';
import { fakeClock, memoryStorage } from './fakeClock.testutil';
import { FINAL_FADE_SEC, SLEEP_FLOOR_SCALE, SLEEP_TARGET_BEAT_HZ, TIMER_STORAGE_KEY, TimerController } from './timers';

describe('countdown', () => {
  it('counts down, notifies and ends', () => {
    const c = fakeClock();
    const t = new TimerController(c);
    const end = vi.fn();
    t.onEnd = end;
    const seen: number[] = [];
    t.subscribe((s) => seen.push(s.remainingSec));
    expect(t.start({ kind: 'countdown', minutes: 1 }).remainingSec).toBe(60);
    c.advance(30_000);
    expect(t.state().remainingSec).toBe(30);
    expect(t.state().running).toBe(true);
    c.advance(30_000);
    expect(end).toHaveBeenCalledWith('countdown');
    expect(t.state().kind).toBe('none');
    expect(seen.length).toBeGreaterThan(5);
  });
  it('pause holds the remaining time and resume continues', () => {
    const c = fakeClock();
    const t = new TimerController(c);
    t.start({ kind: 'countdown', minutes: 2 });
    c.advance(20_000);
    t.pause();
    c.advance(60_000);
    expect(t.state().remainingSec).toBe(100);
    t.resume();
    c.advance(10_000);
    expect(t.state().remainingSec).toBe(90);
  });
  it('clamps absurd minutes', () => {
    const t = new TimerController(fakeClock());
    expect(t.start({ kind: 'countdown', minutes: NaN }).totalSec).toBe(30 * 60);
    expect(t.start({ kind: 'countdown', minutes: 1e9 }).totalSec).toBe(720 * 60);
    expect(t.start({ kind: 'countdown', minutes: -5 }).totalSec).toBe(60);
  });
});

describe('sleep fade', () => {
  it('glides monotonically toward delta and zero gain, then ends after the final fade', () => {
    const c = fakeClock();
    const t = new TimerController(c);
    const end = vi.fn();
    t.onEnd = end;
    t.start({ kind: 'sleep-fade', minutes: 10 });
    let prevGain = 2;
    let prevMix = -1;
    const first = t.effects();
    expect(first.gainScale).toBe(1);
    expect(first.beatMix).toBe(0);
    for (let s = 0; s < 600 + FINAL_FADE_SEC - 1; s++) {
      c.advance(1000);
      const fx = t.effects();
      expect(fx.gainScale).toBeLessThanOrEqual(prevGain);
      expect(fx.beatMix).toBeGreaterThanOrEqual(prevMix);
      prevGain = fx.gainScale;
      prevMix = fx.beatMix;
    }
    expect(end).not.toHaveBeenCalled();
    expect(prevGain).toBeLessThan(SLEEP_FLOOR_SCALE);
    expect(prevMix).toBe(1);
    expect(t.state().finalFade).toBe(true);
    c.advance(1000);
    expect(end).toHaveBeenCalledWith('sleep-fade');
    expect(t.state().kind).toBe('none');
  });
  it('final fade lasts at least 5 seconds', () => {
    expect(FINAL_FADE_SEC).toBeGreaterThanOrEqual(5);
    expect(SLEEP_TARGET_BEAT_HZ).toBe(2.5);
  });
});

describe('pomodoro', () => {
  it('cycles focus and break with a cycle counter and 25/5 defaults', () => {
    const c = fakeClock();
    const t = new TimerController(c);
    const s0 = t.start({ kind: 'pomodoro' });
    expect(s0).toMatchObject({ phase: 'focus', cycle: 1, totalSec: 1500, focusMin: 25, breakMin: 5 });
    c.advance(25 * 60_000);
    expect(t.state()).toMatchObject({ phase: 'break', cycle: 1, totalSec: 300 });
    c.advance(5 * 60_000);
    expect(t.state()).toMatchObject({ phase: 'focus', cycle: 2, totalSec: 1500 });
    c.advance(25 * 60_000 + 5 * 60_000);
    expect(t.state()).toMatchObject({ phase: 'focus', cycle: 3 });
  });
  it('supports a long break every N cycles', () => {
    const c = fakeClock();
    const t = new TimerController(c);
    t.start({ kind: 'pomodoro', focusMin: 1, breakMin: 1, longBreakMin: 3, longEvery: 2 });
    c.advance(60_000 + 60_000);
    expect(t.state()).toMatchObject({ phase: 'focus', cycle: 2 });
    c.advance(60_000);
    expect(t.state()).toMatchObject({ phase: 'break', totalSec: 180 });
  });
});

describe('cycle and seek', () => {
  it('cycles none, countdown, sleep-fade, pomodoro, none', () => {
    const t = new TimerController(fakeClock());
    expect(t.cycleNext().kind).toBe('countdown');
    expect(t.cycleNext().kind).toBe('sleep-fade');
    expect(t.cycleNext().kind).toBe('pomodoro');
    expect(t.cycleNext().kind).toBe('none');
  });
  it('seekBy moves within the segment and clamps', () => {
    const c = fakeClock();
    const t = new TimerController(c);
    t.start({ kind: 'countdown', minutes: 1 });
    expect(t.seekBy(15).remainingSec).toBe(45);
    expect(t.seekBy(-100).remainingSec).toBe(60);
    expect(t.seekBy(1000).remainingSec).toBe(1);
    expect(t.seekBy(NaN).remainingSec).toBe(1);
  });
});

describe('persistence', () => {
  it('restores paused with the elapsed time', () => {
    const c = fakeClock();
    const store = memoryStorage();
    const a = new TimerController(c, store);
    a.start({ kind: 'pomodoro', focusMin: 2, breakMin: 1 });
    c.advance(130_000);
    a.state();
    a.pause();
    expect(store.data.has(TIMER_STORAGE_KEY)).toBe(true);
    const b = new TimerController(fakeClock(), store);
    expect(b.state()).toMatchObject({ kind: 'pomodoro', running: false, phase: 'break' });
  });
  it('ignores corrupt storage and clears on stop', () => {
    const store = memoryStorage();
    store.setItem(TIMER_STORAGE_KEY, '{bad json');
    expect(new TimerController(fakeClock(), store).state().kind).toBe('none');
    store.setItem(TIMER_STORAGE_KEY, JSON.stringify({ v: 2, spec: { kind: 'countdown', minutes: 3 } }));
    expect(new TimerController(fakeClock(), store).state().kind).toBe('none');
    store.setItem(TIMER_STORAGE_KEY, JSON.stringify({ v: 1, spec: { kind: 'evil' }, elapsedMs: 1 }));
    expect(new TimerController(fakeClock(), store).state().kind).toBe('none');
    const t = new TimerController(fakeClock(), store);
    t.start({ kind: 'countdown', minutes: 1 });
    t.stop();
    expect(store.data.has(TIMER_STORAGE_KEY)).toBe(false);
  });
});
