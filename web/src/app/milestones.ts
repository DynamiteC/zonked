/**
 * Gentle milestones. Everything is computed on this device from the listening log.
 * No guilt: nothing is ever taken away, a missed day is forgiven, and the whole panel can be hidden or reset.
 */
import { field, isRecord, num } from './mixes';

export const MIN_SESSION_MIN = 1;
export const MAX_SESSION_MIN = 720;
export const GRACE_WINDOW_DAYS = 7;
const DAY_MS = 86_400_000;

export interface LogLike {
  readonly startedAt: number;
  readonly endedAt: number;
  readonly endKind?: 'manual' | 'countdown' | 'sleep-fade';
  readonly breaks?: number;
}

export interface Stats {
  readonly sessions: number;
  readonly totalMinutes: number;
  readonly activeDays: number;
  /** Calm streak in days: one missed day per 7 is forgiven. 0 when the last session was more than 2 days ago. */
  readonly streak: number;
  readonly bestStreak: number;
  readonly longestMinutes: number;
  readonly firstSessionAt: number | null;
  readonly sleepFades: number;
  readonly breaks: number;
}

export type MilestoneId =
  | 'first-session'
  | 'three-days'
  | 'ten-sessions'
  | 'one-hour'
  | 'five-hours'
  | 'first-sleep-fade'
  | 'took-a-break';

export interface MilestoneDef {
  readonly id: MilestoneId;
  readonly met: (s: Stats) => boolean;
}

export const MILESTONES: readonly MilestoneDef[] = [
  { id: 'first-session', met: (s) => s.sessions >= 1 },
  { id: 'three-days', met: (s) => s.bestStreak >= 3 },
  { id: 'ten-sessions', met: (s) => s.sessions >= 10 },
  { id: 'one-hour', met: (s) => s.totalMinutes >= 60 },
  { id: 'five-hours', met: (s) => s.totalMinutes >= 300 },
  { id: 'first-sleep-fade', met: (s) => s.sleepFades >= 1 },
  { id: 'took-a-break', met: (s) => s.breaks >= 1 },
];

/** Local calendar day number. tzOffsetMin follows Date.getTimezoneOffset(): minutes behind UTC. */
export function dayOf(ms: number, tzOffsetMin: number): number {
  return Math.floor((ms - tzOffsetMin * 60_000) / DAY_MS);
}

export function sessionMinutes(l: LogLike): number {
  const m = (l.endedAt - l.startedAt) / 60_000;
  return Number.isFinite(m) && m >= MIN_SESSION_MIN ? Math.min(MAX_SESSION_MIN, m) : 0;
}

/** Walks the sorted active days. One single-day gap is forgiven when none was forgiven in the last 7 days. */
export function streaks(days: readonly number[]): { readonly current: number; readonly best: number; readonly last: number | null } {
  let run = 0;
  let best = 0;
  let prev: number | null = null;
  let graceDay = -Infinity;
  for (const d of days) {
    if (prev === null) run = 1;
    else if (d - prev === 1) run += 1;
    else if (d - prev === 2 && prev + 1 - graceDay > GRACE_WINDOW_DAYS) {
      graceDay = prev + 1;
      run += 1;
    } else run = 1;
    best = Math.max(best, run);
    prev = d;
  }
  return { current: run, best, last: prev };
}

export function computeStats(logs: readonly LogLike[], now: number, tzOffsetMin: number): Stats {
  const valid = logs.filter((l) => sessionMinutes(l) > 0);
  const days = [...new Set(valid.map((l) => dayOf(l.startedAt, tzOffsetMin)))].sort((a, b) => a - b);
  const st = streaks(days);
  const alive = st.last !== null && dayOf(now, tzOffsetMin) - st.last <= 2;
  const mins = valid.map(sessionMinutes);
  return {
    sessions: valid.length,
    totalMinutes: Math.round(mins.reduce((a, b) => a + b, 0)),
    activeDays: days.length,
    streak: alive ? st.current : 0,
    bestStreak: st.best,
    longestMinutes: Math.round(mins.reduce((a, b) => Math.max(a, b), 0)),
    firstSessionAt: valid.reduce<number | null>((a, l) => (a === null || l.startedAt < a ? l.startedAt : a), null),
    sleepFades: valid.filter((l) => l.endKind === 'sleep-fade' && sessionMinutes(l) >= 10).length,
    breaks: valid.reduce((a, l) => a + (typeof l.breaks === 'number' && l.breaks > 0 ? 1 : 0), 0),
  };
}

export interface Reminder {
  readonly on: boolean;
  /** Shown only inside the app, once per local day. Never a system notification. */
  readonly text: string;
  readonly shownDay: number;
}

export interface MilestoneState {
  readonly v: 1;
  readonly hidden: boolean;
  readonly earned: Readonly<Record<string, number>>;
  readonly reminder: Reminder;
}

export const MAX_REMINDER = 80;
export const DEFAULT_REMINDER = 'Take a slow breath.';
export const NEW_STATE: MilestoneState = {
  v: 1,
  hidden: false,
  earned: {},
  reminder: { on: false, text: DEFAULT_REMINDER, shownDay: -1 },
};

export function cleanReminderText(x: unknown): string {
  if (typeof x !== 'string') return DEFAULT_REMINDER;
  // eslint-disable-next-line no-control-regex
  const t = x.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_REMINDER);
  return t.length > 0 ? t : DEFAULT_REMINDER;
}

export function parseMilestoneState(x: unknown, now: number): MilestoneState {
  if (!isRecord(x) || field(x, 'v') !== 1) return NEW_STATE;
  const earned: Record<string, number> = {};
  const raw = field(x, 'earned');
  if (isRecord(raw)) {
    for (const m of MILESTONES) {
      const at = field(raw, m.id);
      if (typeof at === 'number' && Number.isFinite(at)) earned[m.id] = num(at, 0, now + DAY_MS, now);
    }
  }
  const r = field(x, 'reminder');
  const rem = isRecord(r) ? r : {};
  return {
    v: 1,
    hidden: field(x, 'hidden') === true,
    earned,
    reminder: {
      on: field(rem, 'on') === true,
      text: cleanReminderText(field(rem, 'text')),
      shownDay: Math.round(num(field(rem, 'shownDay'), -1, 1_000_000, -1)),
    },
  };
}

export interface Evaluation {
  readonly state: MilestoneState;
  readonly added: readonly MilestoneId[];
}

/** Adds newly met milestones. Earned ones are never removed by new data. */
export function evaluate(state: MilestoneState, stats: Stats, now: number): Evaluation {
  const added = MILESTONES.filter((m) => state.earned[m.id] === undefined && m.met(stats)).map((m) => m.id);
  if (added.length === 0) return { state, added };
  const earned: Record<string, number> = { ...state.earned };
  for (const id of added) earned[id] = now;
  return { state: { ...state, earned }, added };
}

/** Clears earned milestones but keeps the user's visibility and reminder choices. */
export function resetMilestones(state: MilestoneState): MilestoneState {
  return { ...state, earned: {} };
}

/** True once per local day when the reminder is on. The caller stores the returned state. */
export function dueReminder(state: MilestoneState, now: number, tzOffsetMin: number): { readonly show: boolean; readonly state: MilestoneState } {
  const day = dayOf(now, tzOffsetMin);
  if (!state.reminder.on || state.reminder.shownDay === day) return { show: false, state };
  return { show: true, state: { ...state, reminder: { ...state.reminder, shownDay: day } } };
}
