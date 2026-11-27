import type { DayState, SessionDay, WeekStats } from './types';

/** A day counts when 3 or more minutes of sound played (spec section c). */
export const MIN_DAY_MINUTES = 3;
const MS_PER_DAY = 86_400_000;
const DEFAULT_GOAL_DAYS = 4;

/**
 * Local integer day number for an instant. Uses the offset in force at that instant,
 * so DST changes never move a session to the wrong day.
 */
export function toDayNumber(epochMs: number): number {
  if (!Number.isFinite(epochMs)) return 0;
  const offsetMs = new Date(epochMs).getTimezoneOffset() * 60_000;
  return Math.floor((epochMs - offsetMs) / MS_PER_DAY);
}

const isDay = (n: number): boolean => Number.isInteger(n) && n >= 0 && n < 10_000_000;

function clampGoal(goalDays: number): number {
  if (!Number.isFinite(goalDays)) return DEFAULT_GOAL_DAYS;
  return Math.min(7, Math.max(1, Math.floor(goalDays)));
}

/** Monday of the week holding `day`. Day 0 (1970-01-01) was a Thursday. */
function weekStart(day: number): number {
  return day - ((day + 3) % 7);
}

function listenedDays(sessions: readonly SessionDay[], start: number, end: number): ReadonlySet<number> {
  const minutes = new Map<number, number>();
  for (const s of sessions) {
    if (!isDay(s.day) || s.day < start || s.day > end) continue;
    const m = Number.isFinite(s.minutes) && s.minutes > 0 ? s.minutes : 0;
    minutes.set(s.day, (minutes.get(s.day) ?? 0) + m);
  }
  const out = new Set<number>();
  minutes.forEach((m, d) => {
    if (m >= MIN_DAY_MINUTES) out.add(d);
  });
  return out;
}

function dotFor(day: number, today: number, heard: ReadonlySet<number>): DayState {
  if (heard.has(day)) return 'listened';
  if (day === today) return 'today';
  return day > today ? 'upcoming' : 'rest';
}

/**
 * Days this week out of 7, Monday to Sunday. Not a chain: a missed day is a rest day
 * and no value is ever negative. Sessions dated after `nowDay` are ignored.
 * An invalid `nowDay` gives an empty, all-upcoming week.
 */
export function weekStats(sessions: readonly SessionDay[], nowDay: number, goalDays: number = DEFAULT_GOAL_DAYS): WeekStats {
  const goal = clampGoal(goalDays);
  if (!isDay(nowDay)) {
    const dots: readonly DayState[] = Object.freeze(Array.from({ length: 7 }, () => 'upcoming' as const));
    return Object.freeze({ daysListened: 0, goalDays: goal, goalMet: false, quietWeek: true, dots });
  }
  const start = weekStart(nowDay);
  const heard = listenedDays(sessions, start, nowDay);
  const dots = Object.freeze(Array.from({ length: 7 }, (_, i) => dotFor(start + i, nowDay, heard)));
  return Object.freeze({
    daysListened: heard.size,
    goalDays: goal,
    goalMet: heard.size >= goal,
    quietWeek: heard.size === 0,
    dots,
  });
}
