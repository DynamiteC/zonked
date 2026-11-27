import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanWhy, parseCrewState } from './crew';
import type { CrewState } from './crew';
import { getCrewView, ingestCrew, lostCrew, resetCrewFeed, resumeCrew, SNOOZE_MS, snoozeCrew } from './crewFeed';
import { DEMO_STEPS, DEMO_STEP_MS, DEMO_TOTAL_MS, demoState, startDemo, stopDemo } from './demoFeed';
import type { DemoDeps } from './demoFeed';
import type { Player } from './player';
import { CALM, crewWhy } from '../ui/calm/copy';

const raw = (score: number, extra: Record<string, unknown> = {}) => ({
  version: 1, at: 1, burnout: { score, level: 'focus' },
  target: { beatHz: 10, carrierHz: 200, gain: 0.4, transitionSec: 60, breathe: false }, sbg: null, ...extra,
});
const state = (score: number, extra: Record<string, unknown> = {}): CrewState => {
  const s = parseCrewState(raw(score, extra));
  if (s === null) throw new Error('bad fixture');
  return s;
};

function fakePlayer() {
  const p = { applyCrew: vi.fn(), followCrew: vi.fn(), crewLost: vi.fn(), play: vi.fn(async () => undefined), snapshot: vi.fn(() => ({ playing: false })) };
  return { p, player: p as unknown as Player };
}

beforeEach(() => resetCrewFeed());
afterEach(() => vi.useRealTimers());

describe('why sanitising', () => {
  it('strips control and bidi characters, caps at 160, drops empty text', () => {
    const t = cleanWhy('Load high.\u0000\n\u202Eevil\u0007 ' + 'x'.repeat(400));
    expect(t).not.toBeNull();
    expect(t?.length ?? 0).toBeLessThanOrEqual(160);
    expect(t).not.toMatch(/[\u0000-\u001f\u202e]/);
    expect(t?.startsWith('Load high. evil')).toBe(true);
    for (const bad of ['', '  ', '\u0000\u0001', 5, null, {}, undefined]) expect(cleanWhy(bad)).toBeNull();
  });
  it('the parser keeps a clean why and omits a bad one', () => {
    expect(state(30, { why: 'Easing down.' }).why).toBe('Easing down.');
    expect('why' in state(30, { why: '\u0000' })).toBe(false);
  });
});

describe('crewWhy sentence', () => {
  it.each([
    [10, 'focus', 'light', 'holds a steady'],
    [50, 'flow', 'building', 'eases the beat'],
    [70, 'recovery', 'is high', 'eases the beat'],
    [90, 'decompress', 'very high', 'eases the beat'],
  ])('score %i builds a %s sentence', (score, _level, word, move) => {
    const s = crewWhy(state(score));
    expect(s).toContain(word);
    expect(s).toContain(move);
    expect(s).toContain(`score ${score}`);
    expect(s).toContain('10 Hz');
  });
  it('prefers the sender sentence', () => {
    expect(crewWhy(state(90, { why: 'Because.' }))).toBe('Because.');
  });
});

describe('Not now', () => {
  it('pauses following for 30 minutes, then follows again', () => {
    vi.useFakeTimers();
    const { p, player } = fakePlayer();
    ingestCrew(player, state(30), 1000);
    expect(p.applyCrew).toHaveBeenCalledTimes(1);
    snoozeCrew(player, 1000);
    ingestCrew(player, state(70), 2000);
    expect(p.applyCrew).toHaveBeenCalledTimes(1);
    expect(getCrewView().state?.burnout.score).toBe(70);
    vi.advanceTimersByTime(SNOOZE_MS + 1);
    expect(p.applyCrew).toHaveBeenCalledTimes(2);
    expect(getCrewView().snoozeUntilMs).toBe(0);
  });
  it('Follow again resumes at once, and a lost feed clears the view', () => {
    vi.useFakeTimers();
    const { p, player } = fakePlayer();
    ingestCrew(player, state(30), 1000);
    snoozeCrew(player, 1000);
    resumeCrew(player);
    expect(p.applyCrew).toHaveBeenCalledTimes(2);
    lostCrew();
    expect(getCrewView().state).toBeNull();
  });
});

describe('demo feed', () => {
  it('every step passes the validator with a 5 s floor and a why text', () => {
    DEMO_STEPS.forEach((_, i) => {
      const s = demoState(i, 1);
      expect(s).not.toBeNull();
      expect(s?.target.transitionSec ?? 0).toBeGreaterThanOrEqual(5);
      expect(s?.target.beatHz ?? 0).toBeGreaterThanOrEqual(0.5);
      expect(s?.target.gain ?? 1).toBeLessThanOrEqual(0.85);
      expect(s?.why).toMatch(/^Simulated/);
    });
    const beats = DEMO_STEPS.map((_, i) => demoState(i, 1)?.target.beatHz);
    expect(new Set(beats).size).toBe(4);
    expect(DEMO_STEPS.map((_, i) => demoState(i, 1)?.burnout.level)).toEqual(['focus', 'flow', 'recovery', 'decompress']);
  });
  it('runs four steps over 60 s, blocks the bridge, then ends', () => {
    vi.useFakeTimers();
    const { p, player } = fakePlayer();
    const deps: DemoDeps = { now: () => Date.now(), setTimer: (f, ms) => setTimeout(f, ms), clearTimer: (h) => clearTimeout(h as ReturnType<typeof setTimeout>) };
    startDemo(player, deps);
    expect(p.play).toHaveBeenCalled();
    expect(getCrewView().source).toBe('demo');
    ingestCrew(player, state(10), Date.now());
    expect(getCrewView().state?.why).toMatch(/^Simulated/);
    vi.advanceTimersByTime(DEMO_STEP_MS * 3 + 1);
    expect(p.applyCrew).toHaveBeenCalledTimes(4);
    expect(getCrewView().state?.burnout.level).toBe('decompress');
    vi.advanceTimersByTime(DEMO_TOTAL_MS);
    expect(getCrewView().source).toBe('none');
    expect(p.crewLost).toHaveBeenCalled();
  });
  it('stopDemo clears timers', () => {
    vi.useFakeTimers();
    const { p, player } = fakePlayer();
    startDemo(player, { now: () => Date.now(), setTimer: (f, ms) => setTimeout(f, ms), clearTimer: (h) => clearTimeout(h as ReturnType<typeof setTimeout>) });
    stopDemo(player);
    vi.advanceTimersByTime(DEMO_TOTAL_MS);
    expect(p.applyCrew).toHaveBeenCalledTimes(1);
    expect(CALM.crewDemoBadge).toBe('Simulated session');
  });
});
