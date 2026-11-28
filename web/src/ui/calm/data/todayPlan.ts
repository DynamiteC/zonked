import type { RecContext, Template } from '../../../catalog/types';
import { UX } from '../copy-ux';
import type { FeelEntry } from './feel';
import { profileToRecommendation } from './recommendation';
import type { Profile } from './types';

/** What Today offers first. It follows the goal, the time of day and the listening device. */
export type PlanKind = 'sprint' | 'winddown' | 'focus' | 'calm' | 'reset';

export interface TodayPlan {
  readonly kind: PlanKind;
  /** Session length in minutes. The Start button uses it, not the length stored on the sound. */
  readonly minutes: number;
  readonly ctx: RecContext;
  /** True when the Sleep fade timer runs instead of a plain countdown. */
  readonly fade: boolean;
}

const EVENING: readonly string[] = ['evening', 'night'];

/** Goal and time of day decide the first pick (P1 MUST 3). Study gets the 25 plus 5 sprint. Sleep at night gets a wind down. */
export function todayPlan(profile: Profile, now: Date): TodayPlan {
  const base = profileToRecommendation(profile, now);
  const late = EVENING.includes(base.timeOfDay);
  const calm = (kind: PlanKind, minutes: number): TodayPlan => ({ kind, minutes, fade: false, ctx: { ...base, situation: 'heal-stress', vibe: 'calm', availableMinutes: minutes } });
  switch (profile.goal) {
    case 'study':
      return { kind: 'sprint', minutes: 25, fade: false, ctx: { ...base, availableMinutes: 25 } };
    case 'sleep':
      return { kind: 'winddown', minutes: 30, fade: true, ctx: { ...base, availableMinutes: 30 } };
    case 'focus':
      return late ? calm('winddown', 15) : { kind: 'focus', minutes: 25, fade: false, ctx: base };
    case 'calm':
      return late ? calm('winddown', 15) : calm('calm', 15);
    case 'recover':
      return { kind: 'calm', minutes: 15, fade: false, ctx: base };
    default:
      return { kind: 'reset', minutes: 10, fade: false, ctx: base };
  }
}

export type UseCase = 'winddown' | 'sleep' | 'focus';
export const USE_CASES: readonly UseCase[] = ['winddown', 'sleep', 'focus'];

/** The three lead uses on Today, in this order. Each starts one sound for that use. */
export function useCasePlan(profile: Profile, now: Date, u: UseCase): TodayPlan {
  const base = profileToRecommendation(profile, now);
  if (u === 'sleep') return { kind: 'winddown', minutes: 30, fade: true, ctx: { ...base, situation: 'cant-sleep', vibe: 'dreamy', availableMinutes: 30 } };
  if (u === 'focus') return { kind: 'focus', minutes: 25, fade: false, ctx: { ...base, situation: 'deep-work', vibe: 'bright', availableMinutes: 25 } };
  return { kind: 'winddown', minutes: 15, fade: false, ctx: { ...base, situation: 'heal-stress', vibe: 'calm', availableMinutes: 15 } };
}

/** One plain line about what the sound is made of. No jargon. */
export function plainLine(t: Template): string {
  const noisy = t.stages.some((s) => s.noiseLevel > 0 && s.noise !== 'off');
  const keys = [...new Set([...t.layerTags.filter((l) => l !== 'noise'), ...(noisy ? ['noise' as const] : [])])];
  const words = keys.slice(0, 3).map((k) => UX.hearParts[k]);
  return `${UX.hearIntro} ${UX.hearJoin(words)}.`;
}

export interface Echo {
  readonly id: string;
  readonly a: 'calmer' | 'same';
  readonly daysAgo: number;
}

/** The newest feel answer that was not "not for me", if it is from the last 7 days. Never shows a negative answer back. */
export function feelEcho(entries: readonly FeelEntry[], todayNo: number): Echo | null {
  const e = entries[entries.length - 1];
  if (e === undefined || e.a === 'not') return null;
  const daysAgo = todayNo - e.day;
  return daysAgo < 0 || daysAgo > 7 ? null : { id: e.id, a: e.a, daysAgo };
}

export function echoLine(name: string, e: Echo): string {
  const when = UX.echo.when(e.daysAgo);
  return e.a === 'same' ? UX.echo.same(when, name) : UX.echo.calmer(when, name);
}

/** Counts of each answer by sound, newest first by total. For the local "what helped" list. */
export function helpedCounts(entries: readonly FeelEntry[]): readonly { readonly id: string; readonly calmer: number; readonly same: number; readonly not: number }[] {
  const m = new Map<string, { id: string; calmer: number; same: number; not: number }>();
  for (const e of entries) {
    const r = m.get(e.id) ?? { id: e.id, calmer: 0, same: 0, not: 0 };
    r[e.a] += 1;
    m.set(e.id, r);
  }
  return [...m.values()].sort((a, b) => b.calmer - a.calmer || b.calmer + b.same + b.not - (a.calmer + a.same + a.not));
}
