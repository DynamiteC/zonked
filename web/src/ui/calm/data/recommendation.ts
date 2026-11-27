import type { DeviceType, RecContext, Situation, Vibe } from '../../../catalog/types';
import type { Device, Goal, Profile, TimeOfDay } from './types';

interface GoalMap {
  readonly situation: Situation;
  readonly vibe?: Vibe;
  readonly minutes: number;
}

/** Spec section b, "Answer mapping to the existing recommender". */
const GOAL_MAP: Readonly<Record<Goal, GoalMap>> = {
  focus: { situation: 'deep-work', vibe: 'bright', minutes: 25 },
  calm: { situation: 'heal-stress', vibe: 'calm', minutes: 15 },
  sleep: { situation: 'cant-sleep', vibe: 'dreamy', minutes: 45 },
  study: { situation: 'deep-work', vibe: 'minimal', minutes: 30 },
  recover: { situation: 'ai-burnout', vibe: 'warm', minutes: 15 },
  curious: { situation: 'quick-reset', minutes: 10 },
};

const DEVICE_MAP: Readonly<Record<Device, DeviceType>> = {
  headphones: 'headphones',
  bluetooth: 'bluetooth',
  speakers: 'speaker',
  unsure: 'headphones',
};

/** Spec section c: before 12 morning, 12-17 afternoon, 17-21 evening, else night. */
export function timeOfDayFromHour(hour: number): Exclude<TimeOfDay, 'anytime'> {
  if (hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Builds the recommender input from onboarding answers. "Anytime" reads the clock
 * passed in `now`. Sensitivity is medium unless the user chose extra gentle.
 */
export function profileToRecommendation(profile: Profile, now: Date = new Date()): RecContext {
  const g = GOAL_MAP[profile.goal];
  const timeOfDay = profile.timeOfDay === 'anytime' ? timeOfDayFromHour(now.getHours()) : profile.timeOfDay;
  const base = {
    situation: g.situation,
    availableMinutes: g.minutes,
    timeOfDay,
    sensorySensitivity: profile.extraGentle ? ('high' as const) : ('medium' as const),
    deviceType: DEVICE_MAP[profile.device],
  };
  return Object.freeze(g.vibe === undefined ? base : { ...base, vibe: g.vibe });
}

/** True when the headphone notice must show (spec: "Not sure" and speakers). */
export function needsHeadphoneNotice(profile: Profile): boolean {
  return profile.device === 'unsure' || profile.device === 'speakers';
}
