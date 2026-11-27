import type { Situation, Vibe } from '../../../catalog/types';

export type Goal = 'focus' | 'calm' | 'sleep' | 'study' | 'recover' | 'curious';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
export type Device = 'headphones' | 'speakers' | 'bluetooth' | 'unsure';

export const GOALS: readonly Goal[] = ['focus', 'calm', 'sleep', 'study', 'recover', 'curious'];
export const TIMES_OF_DAY: readonly TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night', 'anytime'];
export const DEVICES: readonly Device[] = ['headphones', 'speakers', 'bluetooth', 'unsure'];

/** Onboarding answers. No name, no account. */
export interface Profile {
  readonly goal: Goal;
  readonly timeOfDay: TimeOfDay;
  readonly device: Device;
  /** Settings switch "Keep sounds extra gentle": sets sensitivity high. */
  readonly extraGentle: boolean;
  /** Epoch milliseconds. */
  readonly createdAt: number;
}

export interface JourneyDay {
  readonly kind: 'session' | 'rest';
  /** Template id prefix without the final -NN. Empty on rest days. */
  readonly family: string;
  /** Catalog ids for the family, sorted. Empty on rest days. */
  readonly variants: readonly string[];
}

export interface Journey {
  readonly id: string;
  readonly title: string;
  readonly blurb: string;
  readonly days: readonly JourneyDay[];
  /** Fallback recommender inputs when a family has no variants (spec step 3). */
  readonly situation: Situation;
  readonly vibe: Vibe;
  readonly minutes: number;
}

/** Local state per journey. Day numbers are 1-based positions in Journey.days. */
export interface JourneyProgress {
  /** Integer day number (days since epoch, local). */
  readonly startedAt: number;
  readonly doneDays: readonly number[];
  /** Resolved template ids frozen at start, one per non-rest day. */
  readonly pickedIds: readonly string[];
}

export type ProgressMap = Readonly<Record<string, JourneyProgress>>;

/** One listening session reduced to a local day number and minutes played. */
export interface SessionDay {
  readonly day: number;
  readonly minutes: number;
}

export type DayState = 'listened' | 'rest' | 'today' | 'upcoming';

export interface WeekStats {
  /** Days with at least 3 minutes, 0 to 7. */
  readonly daysListened: number;
  readonly goalDays: number;
  readonly goalMet: boolean;
  /** True when nothing was heard yet this week. UI shows the welcome-back line. */
  readonly quietWeek: boolean;
  /** Monday to Sunday. */
  readonly dots: readonly DayState[];
}

/** Minimal string storage, a subset of the Web Storage API. */
export interface StorageLike {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}
