// MOCKED: the audio engine is a stub in this file. Real output is read by verify:e2e (web/scripts/e2e-core-checks.mjs).
import { describe, expect, it, vi } from 'vitest';
import type { Voice } from '../sbg';
import type { CrewState } from './crew';
import { Player, TICK_MS } from './player';
import type { Clock, SessionLog } from './player';

function fakeClock(): Clock & { advance(ms: number): void } {
  let t = 1_000_000;
  let id = 0;
  const timers = new Map<number, { fn: () => void; ms: number; next: number }>();
  return {
    now: () => t,
    setInterval(fn, ms) {
      id += 1;
      timers.set(id, { fn, ms, next: t + ms });
      return id;
    },
    clearInterval: (i) => void timers.delete(i),
    advance(ms) {
      const end = t + ms;
      for (;;) {
        let due: { fn: () => void; ms: number; next: number } | undefined;
        for (const tm of timers.values()) if (tm.next <= end && (!due || tm.next < due.next)) due = tm;
        if (!due) break;
        t = due.next;
        due.next += due.ms;
        due.fn();
      }
      t = end;
    },
  };
}

function fakeEngine() {
  const calls: Voice[] = [];
  return {
    calls,
    start: vi.fn(async (_v: Voice) => undefined),
    stop: vi.fn(async () => undefined),
    setVoice: vi.fn((v: Voice) => void calls.push(v)),
  };
}

const crew = (over: Partial<CrewState['target']> = {}, sbg: string | null = null): CrewState => ({
  version: 1,
  at: 1,
  burnout: { score: 70, level: 'recovery' },
  target: { beatHz: 6, carrierHz: 180, gain: 0.3, transitionSec: 10, breathe: true, ...over },
  sbg,
});

describe('Player', () => {
  it('starts the engine with the first preset and ticks at 10 Hz', async () => {
    const clock = fakeClock();
    const eng = fakeEngine();
    const p = new Player(eng, clock);
    await p.play();
    expect(eng.start).toHaveBeenCalledTimes(1);
    clock.advance(1000);
    expect(eng.setVoice).toHaveBeenCalledTimes(1000 / TICK_MS);
    expect(p.snapshot().elapsedSec).toBeCloseTo(1, 5);
    expect(eng.calls[0]?.beatHz).toBe(40);
  });

  it('moves a crew state to the target over transitionSec', async () => {
    const clock = fakeClock();
    const eng = fakeEngine();
    const p = new Player(eng, clock);
    await p.play();
    p.applyCrew(crew({ beatHz: 6, carrierHz: 180, transitionSec: 10 }));
    clock.advance(5000);
    const mid = p.snapshot().voice;
    expect(mid.beatHz).toBeGreaterThan(6);
    expect(mid.beatHz).toBeLessThan(40);
    expect(mid.carrierHz).toBeCloseTo(190, 0);
    clock.advance(6000);
    const end = p.snapshot().voice;
    expect(end.beatHz).toBe(6);
    expect(end.carrierHz).toBe(180);
    expect(p.snapshot().source).toBe('crew');
    expect(p.snapshot().burnout).toBe(70);
  });

  it('plays the crew sbg when it parses cleanly', async () => {
    const clock = fakeClock();
    const eng = fakeEngine();
    const p = new Player(eng, clock);
    await p.play();
    p.applyCrew(crew({}, 'mode: bin\nx: 300+8/0.3\n00:00:00 x\n'));
    clock.advance(200);
    expect(p.snapshot().voice.carrierHz).toBe(300);
  });

  it('ignores a crew sbg with errors and falls back to the target', async () => {
    const clock = fakeClock();
    const p = new Player(fakeEngine(), clock);
    await p.play();
    p.applyCrew(crew({ transitionSec: 5 }, 'this is not valid @@@ ???\n00:00:00 nope\n'));
    clock.advance(6000);
    expect(p.snapshot().voice.carrierHz).toBe(180);
  });

  it('manual preset overrides crew until followCrew', async () => {
    const clock = fakeClock();
    const eng = fakeEngine();
    const p = new Player(eng, clock);
    await p.play();
    p.selectPreset('flow-state');
    p.applyCrew(crew({ transitionSec: 5 }));
    clock.advance(6000);
    expect(p.snapshot().voice.beatHz).toBe(18);
    expect(p.snapshot().overridden).toBe(true);
    p.followCrew();
    clock.advance(6000);
    expect(p.snapshot().voice.beatHz).toBe(6);
    expect(p.snapshot().overridden).toBe(false);
  });

  it('playCustom reports errors without playing', async () => {
    const eng = fakeEngine();
    const p = new Player(eng, fakeClock());
    const d = await p.playCustom('x'.repeat(600));
    expect(d.some((x) => x.severity === 'error')).toBe(true);
    expect(eng.start).not.toHaveBeenCalled();
  });

  it('playCustom starts playback for valid text', async () => {
    const eng = fakeEngine();
    const p = new Player(eng, fakeClock());
    await p.playCustom('x: 250+9/0.3\n00:00:00 x\n');
    expect(eng.start).toHaveBeenCalledTimes(1);
    expect(p.snapshot().source).toBe('custom');
  });

  it('logs a session on stop with the peak score and stops ticking', async () => {
    const clock = fakeClock();
    const eng = fakeEngine();
    const logs: SessionLog[] = [];
    const p = new Player(eng, clock, (l) => logs.push(l));
    await p.play();
    p.applyCrew({ ...crew(), burnout: { score: 88, level: 'decompress' } });
    clock.advance(2000);
    await p.stop();
    expect(eng.stop).toHaveBeenCalled();
    expect(logs).toHaveLength(1);
    expect(logs[0]?.peakScore).toBe(88);
    expect(logs[0]?.endedAt).toBeGreaterThan(logs[0]?.startedAt ?? 0);
    const n = eng.setVoice.mock.calls.length;
    clock.advance(1000);
    expect(eng.setVoice.mock.calls.length).toBe(n);
  });

  it('survives an engine start failure', async () => {
    const eng = fakeEngine();
    eng.start.mockRejectedValueOnce(new Error('boom'));
    const p = new Player(eng, fakeClock());
    await p.play();
    expect(p.snapshot().playing).toBe(false);
  });

  it('crewLost clears burnout but keeps playing', async () => {
    const p = new Player(fakeEngine(), fakeClock());
    await p.play();
    p.applyCrew(crew());
    p.crewLost();
    expect(p.snapshot().burnout).toBeNull();
    expect(p.snapshot().playing).toBe(true);
  });
});
