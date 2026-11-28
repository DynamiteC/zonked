import { usesCrackle, usesPercussion } from '../../../catalog/features';
import { recommendTemplates } from '../../../catalog/recommend';
import type { DeviceType, RecContext, Recommendation, Situation, Template, Vibe } from '../../../catalog/types';
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
  wired: 'headphones',
  bluetooth: 'bluetooth',
  speakers: 'speaker',
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

/** True when the headphone notice must show (speakers). */
export function needsHeadphoneNotice(profile: Profile): boolean {
  return profile.device === 'speakers';
}

/** How far each Bluetooth signal moves a score. The base scores run from 0 to about 100. */
const BT_TONAL_BONUS = 6;
const BT_TONAL_MAX = 12;
const BT_HARSH_NOISE = 12;
const BT_PINK_NOISE = 3;
const BT_CRACKLE = 6;
/** How many candidates are rescored before the top picks are cut. */
const WIDE = 24;

/** Tonal layers (pads, soft notes, chimes) stay clear over lossy Bluetooth codecs. */
const TONAL: readonly string[] = ['pad', 'instrument', 'chimes'];

/** Score change for one template over Bluetooth. Positive for tonal, negative for white or violet hiss. */
export function bluetoothDelta(t: Template): number {
  const tonal = Math.min(BT_TONAL_MAX, t.layerTags.filter((l) => TONAL.includes(l)).length * BT_TONAL_BONUS);
  const harsh = t.stages.some((s) => s.noiseLevel > 0 && (s.noise === 'white' || s.noise === 'violet'));
  const pink = t.stages.some((s) => s.noiseLevel > 0 && s.noise === 'pink');
  return tonal - (harsh ? BT_HARSH_NOISE : 0) - (pink ? BT_PINK_NOISE : 0) - (usesCrackle(t) ? BT_CRACKLE : 0);
}

/**
 * Picks for a context and a listening device. Wired is exactly today's picks. Speakers keep the existing
 * speaker scoring (no binaural reliance). Bluetooth rescales a wider list toward tonal, low-hiss templates.
 * Intensity never goes above the ceiling of today's picks, and gentle settings still keep percussion and crackle out.
 */
export function recommendForDevice(ctx: RecContext, device: Device, limit: number, pool?: readonly Template[]): Recommendation[] {
  const base = recommendTemplates(ctx, limit, pool);
  if (device !== 'bluetooth') return base;
  const ceiling = Math.max(0, ...base.map((r) => r.template.intensity));
  const gentle = ctx.sensorySensitivity === 'high';
  const wide = recommendTemplates(ctx, Math.max(WIDE, limit), pool)
    .filter((r) => r.template.intensity <= ceiling && !(gentle && (usesPercussion(r.template) || usesCrackle(r.template))))
    .map((r, i) => {
      const d = bluetoothDelta(r.template);
      const reasons = d > 0 ? [...r.reasons, 'Clear and soft over Bluetooth.'] : r.reasons;
      return { r: { ...r, score: Math.max(0, Math.round((r.score + d) * 10) / 10), reasons }, i };
    });
  wide.sort((a, b) => b.r.score - a.r.score || a.i - b.i);
  const out = wide.slice(0, limit).map((x) => x.r);
  return out.length >= limit ? out : base;
}

/** Same sounds, device-aware order. Bluetooth puts btFriendly sounds first. Others keep the list as it is. */
export function orderForDevice<T extends { readonly btFriendly: boolean }>(list: readonly T[], device: Device): readonly T[] {
  if (device !== 'bluetooth') return list;
  return [...list.filter((s) => s.btFriendly), ...list.filter((s) => !s.btFriendly)];
}
