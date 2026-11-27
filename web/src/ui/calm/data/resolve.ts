import { getTemplates, recommendTemplates } from '../../../catalog';
import type { RecContext, Template } from '../../../catalog/types';
import { getJourney } from './journeys';
import { profileToRecommendation } from './recommendation';
import type { Journey, JourneyDay, Profile } from './types';

const MAX_GENTLE_INTENSITY = 3;
const EMPTY: readonly string[] = Object.freeze([]);

/** Catalog ids of a family, sorted, matching ^family-\d{2}$ (spec section d, step 1). */
function familyIds(family: string, pool: readonly Template[]): readonly Template[] {
  const re = new RegExp(`^${family.replace(/[^a-z0-9-]/g, '')}-\\d{2}$`);
  return pool.filter((t) => re.test(t.id)).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function fallbackId(journey: Journey, ctx: RecContext, pool: readonly Template[]): string | undefined {
  const rc: RecContext = { ...ctx, situation: journey.situation, vibe: journey.vibe, availableMinutes: journey.minutes };
  return recommendTemplates(rc, 1, pool)[0]?.template.id;
}

/** Steps 2 and 5: variants[k mod n], skipping intensity above 3 when extra gentle. */
function pickVariant(list: readonly Template[], k: number, gentle: boolean): string | undefined {
  const n = list.length;
  for (let i = 0; i < n; i += 1) {
    const t = list[(k + i) % n];
    if (t !== undefined && (!gentle || t.intensity <= MAX_GENTLE_INTENSITY)) return t.id;
  }
  return undefined;
}

function pickDay(d: JourneyDay, k: number, journey: Journey, profile: Profile, pool: readonly Template[]): string | undefined {
  const picked = pickVariant(familyIds(d.family, pool), k, profile.extraGentle);
  return picked ?? fallbackId(journey, profileToRecommendation(profile), pool);
}

/**
 * Resolves one template id per non-rest day, in order. Deterministic: no randomness, no clock.
 * `startedAtDay` does not change picks (the rule only counts session days); it is accepted so
 * callers can store it next to the result. Unknown journey ids give an empty list.
 * `pool` defaults to the full catalog and exists so tests can supply a small one.
 */
export function resolveJourney(
  profile: Profile,
  journeyId: string,
  startedAtDay: number,
  pool: readonly Template[] = getTemplates(),
): readonly string[] {
  void startedAtDay;
  const journey = getJourney(journeyId);
  if (journey === undefined) return EMPTY;
  const out: string[] = [];
  for (const d of journey.days) {
    if (d.kind === 'rest') continue;
    const id = pickDay(d, out.length, journey, profile, pool);
    if (id !== undefined) out.push(id);
  }
  return Object.freeze(out);
}
