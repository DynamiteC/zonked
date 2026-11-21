import { describe, expect, it } from 'vitest';
import {
  DEFAULT_REMINDER, MAX_REMINDER, NEW_STATE, computeStats, dayOf, dueReminder, evaluate, parseMilestoneState, resetMilestones, sessionMinutes, streaks,
} from './milestones';
import type { LogLike } from './milestones';

const DAY = 86_400_000;
const T0 = 20_000 * DAY; // a UTC midnight
const log = (day: number, min = 10, extra: Partial<LogLike> = {}): LogLike => ({
  startedAt: T0 + day * DAY + 3_600_000,
  endedAt: T0 + day * DAY + 3_600_000 + min * 60_000,
  ...extra,
});

describe('stats', () => {
  it('counts sessions and minutes, ignores under one minute and caps at 12 hours', () => {
    const s = computeStats([log(0, 10), log(0, 0.5), log(1, 5000)], T0 + 2 * DAY, 0);
    expect(s.sessions).toBe(2);
    expect(s.totalMinutes).toBe(730);
    expect(s.longestMinutes).toBe(720);
    expect(s.activeDays).toBe(2);
    expect(sessionMinutes({ startedAt: 5, endedAt: 1 })).toBe(0);
    expect(sessionMinutes({ startedAt: 0, endedAt: Number.NaN })).toBe(0);
  });

  it('streak: consecutive days, one gap forgiven, longer gap resets', () => {
    expect(streaks([1, 2, 3]).best).toBe(3);
    expect(streaks([1, 3, 4]).best).toBe(3);
    expect(streaks([1, 3, 5]).best).toBe(2);
    expect(streaks([1, 3, 5]).current).toBe(1);
    expect(streaks([1, 4, 5]).best).toBe(2);
    expect(streaks([]).last).toBeNull();
    const s = computeStats([log(0), log(1), log(2)], T0 + 2 * DAY, 0);
    expect(s.streak).toBe(3);
    expect(computeStats([log(0), log(2), log(3)], T0 + 3 * DAY, 0).bestStreak).toBe(3);
  });

  it('streak is quiet, not shown after a long break', () => {
    const s = computeStats([log(0), log(1)], T0 + 20 * DAY, 0);
    expect(s.streak).toBe(0);
    expect(s.bestStreak).toBe(2);
  });

  it('respects the time zone offset around midnight', () => {
    const l = { startedAt: T0 + 23 * 3_600_000, endedAt: T0 + 23 * 3_600_000 + 600_000 };
    expect(dayOf(l.startedAt, 0)).toBe(20_000);
    expect(dayOf(l.startedAt, -120)).toBe(20_001); // UTC+2 is already the next day
    expect(dayOf(l.startedAt, 300)).toBe(20_000); // UTC-5
    expect(computeStats([l, log(1)], T0 + 2 * DAY, -120).activeDays).toBe(1);
    expect(computeStats([l, log(1)], T0 + 2 * DAY, 0).activeDays).toBe(2);
  });

  it('counts sleep fades (10 min or more) and breaks', () => {
    const s = computeStats([log(0, 30, { endKind: 'sleep-fade' }), log(1, 3, { endKind: 'sleep-fade' }), log(2, 30, { breaks: 2 }), log(3, 30, { breaks: 0 })], T0 + 3 * DAY, 0);
    expect(s.sleepFades).toBe(1);
    expect(s.breaks).toBe(1);
    expect(s.firstSessionAt).toBe(T0 + 3_600_000);
    expect(computeStats([], T0, 0).firstSessionAt).toBeNull();
  });
});

describe('milestones', () => {
  it('earns each milestone once and never removes it', () => {
    const logs = Array.from({ length: 10 }, (_, i) => log(i, 30, i === 0 ? { endKind: 'sleep-fade', breaks: 1 } : {}));
    const stats = computeStats(logs, T0 + 9 * DAY, 0);
    const a = evaluate(NEW_STATE, stats, 111);
    expect([...a.added].sort()).toEqual(['first-session', 'first-sleep-fade', 'five-hours', 'one-hour', 'ten-sessions', 'three-days', 'took-a-break'].sort());
    const b = evaluate(a.state, stats, 222);
    expect(b.added).toEqual([]);
    expect(b.state).toBe(a.state);
    const empty = evaluate(a.state, computeStats([], 0, 0), 333);
    expect(Object.keys(empty.state.earned)).toHaveLength(7);
    expect(empty.state.earned['first-session']).toBe(111);
  });

  it('first session appears after one real session only', () => {
    expect(evaluate(NEW_STATE, computeStats([log(0, 0.2)], T0, 0), 1).added).toEqual([]);
    expect(evaluate(NEW_STATE, computeStats([log(0, 2)], T0, 0), 1).added).toEqual(['first-session']);
  });

  it('reset clears earned but keeps choices', () => {
    const s = { ...NEW_STATE, hidden: true, earned: { 'first-session': 1 } };
    const r = resetMilestones(s);
    expect(r.earned).toEqual({});
    expect(r.hidden).toBe(true);
  });

  it('parses stored state defensively', () => {
    expect(parseMilestoneState(undefined, 5)).toBe(NEW_STATE);
    expect(parseMilestoneState({ v: 9 }, 5)).toBe(NEW_STATE);
    const p = parseMilestoneState(
      JSON.parse('{"v":1,"hidden":true,"earned":{"first-session":3,"__proto__":{"x":1},"nope":4,"one-hour":"x"},"reminder":{"on":true,"text":"' + 'a'.repeat(300) + '","shownDay":4}}') as unknown,
      99,
    );
    expect(p.hidden).toBe(true);
    expect(p.earned).toEqual({ 'first-session': 3 });
    expect(p.reminder.text).toHaveLength(MAX_REMINDER);
    expect(p.reminder.on).toBe(true);
    expect(parseMilestoneState({ v: 1, reminder: { text: 5 } }, 5).reminder.text).toBe(DEFAULT_REMINDER);
    expect(parseMilestoneState({ v: 1, earned: 5, reminder: 7 }, 5).earned).toEqual({});
  });

  it('reminder shows once per local day, only when on', () => {
    const on = { ...NEW_STATE, reminder: { ...NEW_STATE.reminder, on: true } };
    expect(dueReminder(NEW_STATE, T0, 0).show).toBe(false);
    const a = dueReminder(on, T0 + 1000, 0);
    expect(a.show).toBe(true);
    expect(dueReminder(a.state, T0 + 5000, 0).show).toBe(false);
    expect(dueReminder(a.state, T0 + DAY + 5000, 0).show).toBe(true);
  });
});
