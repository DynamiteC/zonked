import { describe, expect, it } from 'vitest';
import { getTemplates } from '../../../catalog';
import type { Template } from '../../../catalog/types';
import {
  DEFAULT_PROFILE, JOURNEYS, MAX_PAYLOAD_BYTES, clearAll, createLocalStorage, createMemoryStorage,
  getJourney, loadLast, saveLast, loadProfile, loadProgress, needsHeadphoneNotice, profileToRecommendation, resolveJourney,
  saveProfile, saveProgress, timeOfDayFromHour, toDayNumber, weekStats,
} from './index';
import type { Profile, SessionDay, StorageLike } from './index';

const P: Profile = { goal: 'sleep', timeOfDay: 'night', device: 'wired', extraGentle: false, createdAt: 1000 };
const ids = new Set(getTemplates().map((t) => t.id));

describe('journeys', () => {
  it('has the 6 journeys with spec day counts', () => {
    expect(JOURNEYS.map((j) => j.days.length)).toEqual([7, 5, 14, 7, 5, 7]);
    expect(Object.isFrozen(JOURNEYS)).toBe(true);
    expect(getJourney('nope')).toBeUndefined();
  });

  it('every variant id exists in the catalog and counts match', () => {
    for (const j of JOURNEYS) {
      for (const d of j.days) {
        if (d.kind === 'rest') expect(d.variants).toEqual([]);
        else {
          expect(d.variants.length).toBeGreaterThan(0);
          d.variants.forEach((v) => expect(ids.has(v)).toBe(true));
          const fromCatalog = [...ids].filter((i) => new RegExp(`^${d.family}-\\d{2}$`).test(i)).length;
          expect(fromCatalog).toBe(d.variants.length);
        }
      }
    }
  });

  it('all 6 journeys resolve to existing catalog ids, one per session day', () => {
    for (const j of JOURNEYS) {
      const out = resolveJourney(P, j.id, 100);
      expect(out.length).toBe(j.days.filter((d) => d.kind === 'session').length);
      out.forEach((id) => expect(ids.has(id)).toBe(true));
      expect(Object.isFrozen(out)).toBe(true);
    }
  });

  it('is deterministic across 1000 runs', () => {
    const first = resolveJourney(P, 'easier-sleep', 5).join(',');
    for (let i = 0; i < 1000; i += 1) expect(resolveJourney(P, 'easier-sleep', i).join(',')).toBe(first);
  });

  it('wraps variants by k mod n (sleep-drift-theta has 5, days 1-4 pick 01..04)', () => {
    const out = resolveJourney(P, 'easier-sleep', 0);
    expect(out.slice(0, 4)).toEqual(['sleep-drift-theta-01', 'sleep-drift-theta-02', 'sleep-drift-theta-03', 'sleep-drift-theta-04']);
    expect(out[4]).toBe('sleep-onset-delta-05');
    expect(out[8]).toBe('sleep-deep-delta-04');
    expect(resolveJourney(P, 'focus-mornings', 0)[1]).toBe('focus-alpha-beta-02');
  });

  it('unknown journey gives an empty frozen list', () => {
    const out = resolveJourney(P, 'x', 0);
    expect(out).toEqual([]);
    expect(Object.isFrozen(out)).toBe(true);
  });

  it('extra gentle skips intensity above 3, then falls back to the recommender', () => {
    const pool = getTemplates().map((t) => (t.id === 'focus-alpha-beta-01' ? { ...t, intensity: 5 as const } : t));
    const gentle = { ...P, extraGentle: true };
    expect(resolveJourney(gentle, 'focus-mornings', 0, pool)[0]).toBe('focus-alpha-beta-02');
    const loud = getTemplates().map((t): Template => (t.id.startsWith('focus-alpha-beta-') ? { ...t, intensity: 5 } : t));
    const out = resolveJourney(gentle, 'focus-mornings', 0, loud);
    expect(out[0]).toBeDefined();
    expect(out[0]?.startsWith('focus-alpha-beta-')).toBe(false);
  });

  it('falls back to the recommender when a family is missing', () => {
    const pool = getTemplates().filter((t) => !t.id.startsWith('healing-soothe-glide-'));
    const out = resolveJourney(P, 'calm-evenings', 0, pool);
    expect(out.length).toBe(6);
    expect(out[0]?.startsWith('healing-soothe-glide-')).toBe(false);
  });

  it('skips days entirely when the pool is empty', () => {
    expect(resolveJourney(P, 'calm-evenings', 0, [])).toEqual([]);
  });
});

describe('profileToRecommendation', () => {
  const at = (h: number): Date => new Date(2026, 0, 1, h);
  it('maps every goal per the spec table', () => {
    const rows: Array<[Profile['goal'], string, string | undefined, number]> = [
      ['focus', 'deep-work', 'bright', 25], ['calm', 'heal-stress', 'calm', 15],
      ['sleep', 'cant-sleep', 'dreamy', 45], ['study', 'deep-work', 'minimal', 30],
      ['recover', 'ai-burnout', 'warm', 15], ['curious', 'quick-reset', undefined, 10],
    ];
    for (const [goal, sit, vibe, min] of rows) {
      const r = profileToRecommendation({ ...P, goal }, at(9));
      expect([r.situation, r.vibe, r.availableMinutes]).toEqual([sit, vibe, min]);
      expect('vibe' in r).toBe(vibe !== undefined);
    }
  });
  it('maps devices and sensitivity', () => {
    expect(profileToRecommendation({ ...P, device: 'speakers' }).deviceType).toBe('speaker');
    expect(profileToRecommendation({ ...P, device: 'bluetooth' }).deviceType).toBe('bluetooth');
    expect(profileToRecommendation({ ...P, device: 'wired' }).deviceType).toBe('headphones');
    expect(profileToRecommendation(P).sensorySensitivity).toBe('medium');
    expect(profileToRecommendation({ ...P, extraGentle: true }).sensorySensitivity).toBe('high');
  });
  it('reads the clock only for anytime', () => {
    const any = { ...P, timeOfDay: 'anytime' as const };
    expect(profileToRecommendation(any, at(8)).timeOfDay).toBe('morning');
    expect(profileToRecommendation(any, at(13)).timeOfDay).toBe('afternoon');
    expect(profileToRecommendation(any, at(18)).timeOfDay).toBe('evening');
    expect(profileToRecommendation(any, at(23)).timeOfDay).toBe('night');
    expect(profileToRecommendation(any).timeOfDay).toBe(timeOfDayFromHour(new Date().getHours()));
    expect(profileToRecommendation({ ...P, timeOfDay: 'morning' }, at(23)).timeOfDay).toBe('morning');
  });
  it('flags the headphone notice', () => {
    expect(needsHeadphoneNotice({ ...P, device: 'bluetooth' })).toBe(false);
    expect(needsHeadphoneNotice({ ...P, device: 'speakers' })).toBe(true);
    expect(needsHeadphoneNotice(P)).toBe(false);
  });
});

describe('weekStats', () => {
  const MON = 20_000 - ((20_000 + 3) % 7); // a Monday
  const s = (day: number, minutes = 10): SessionDay => ({ day, minutes });
  it('is empty and quiet with no sessions', () => {
    const w = weekStats([], MON + 2);
    expect(w).toMatchObject({ daysListened: 0, goalDays: 4, goalMet: false, quietWeek: true });
    expect(w.dots).toEqual(['rest', 'rest', 'today', 'upcoming', 'upcoming', 'upcoming', 'upcoming']);
  });
  it('counts days, merges minutes per day and applies the 3 minute rule', () => {
    const w = weekStats([s(MON), s(MON + 1, 1), s(MON + 1, 2), s(MON + 2, 2.9)], MON + 3);
    expect(w.daysListened).toBe(2);
    expect(w.dots.slice(0, 4)).toEqual(['listened', 'listened', 'rest', 'today']);
  });
  it('meets the goal and ignores older weeks, future days and junk', () => {
    const list = [s(MON), s(MON + 1), s(MON + 2), s(MON + 3), s(MON - 1), s(MON + 5), s(-5), s(1.5), s(MON, Number.NaN), s(MON, -4)];
    const w = weekStats(list, MON + 3);
    expect(w.daysListened).toBe(4);
    expect(w.goalMet).toBe(true);
    expect(w.quietWeek).toBe(false);
    expect(w.dots[3]).toBe('listened');
    expect(w.dots[5]).toBe('upcoming');
  });
  it('clamps goal and survives an invalid now', () => {
    expect(weekStats([], MON, 99).goalDays).toBe(7);
    expect(weekStats([], MON, 0).goalDays).toBe(1);
    expect(weekStats([], MON, Number.NaN).goalDays).toBe(4);
    const bad = weekStats([s(MON)], Number.NaN);
    expect(bad.dots.every((d) => d === 'upcoming')).toBe(true);
    expect(bad.daysListened).toBe(0);
    expect(weekStats([], -1).quietWeek).toBe(true);
  });
  it('never yields negative values', () => {
    const w = weekStats([s(MON, -100)], MON + 6, -3);
    expect(w.daysListened).toBeGreaterThanOrEqual(0);
    expect(w.goalDays).toBeGreaterThanOrEqual(1);
  });
  it('Monday starts the week and the Sunday dot is last', () => {
    const w = weekStats([s(MON + 6)], MON + 6);
    expect(w.dots[6]).toBe('listened');
    expect(w.dots[0]).toBe('rest');
  });
  it('maps instants to local day numbers across a DST shift', () => {
    const before = new Date(2026, 2, 7, 23, 30).getTime();
    const after = new Date(2026, 2, 8, 0, 30).getTime();
    const springNoon = new Date(2026, 2, 8, 12).getTime();
    const nextDay = new Date(2026, 2, 9, 0, 5).getTime();
    expect(toDayNumber(after) - toDayNumber(before)).toBe(1);
    expect(toDayNumber(nextDay) - toDayNumber(springNoon)).toBe(1);
    expect(toDayNumber(Number.NaN)).toBe(0);
  });
});

describe('storage', () => {
  const PROG = { 'easier-sleep': { startedAt: 100, doneDays: [3, 1, 1], pickedIds: ['sleep-drift-theta-01'] } };
  it('round-trips profile and progress, frozen, without a name field', () => {
    const st = createMemoryStorage();
    expect(saveProfile(st, P)).toBe(true);
    const back = loadProfile(st);
    expect(back).toEqual(P);
    expect(Object.isFrozen(back)).toBe(true);
    expect(st.get('zonked.profile.v1')).not.toContain('name');
    expect(saveProgress(st, PROG)).toBe(true);
    const prog = loadProgress(st);
    expect(prog['easier-sleep']?.doneDays).toEqual([1, 3]);
    expect(Object.isFrozen(prog)).toBe(true);
  });
  it('returns defaults when nothing is stored', () => {
    const st = createMemoryStorage();
    expect(loadProfile(st)).toEqual(DEFAULT_PROFILE);
    expect(loadProgress(st)).toEqual({});
  });
  it('survives corrupted, wrong-shape and unknown-version data', () => {
    const st = createMemoryStorage();
    for (const raw of ['{not json', '[]', '"x"', 'null', '{"v":2,"goal":"sleep"}', '{"v":1}', '{"v":1,"goal":"zzz"}']) {
      st.set('zonked.profile.v1', raw);
      st.set('zonked.journeys.v1', raw);
      expect(loadProfile(st)).toEqual(DEFAULT_PROFILE);
      expect(loadProgress(st)).toEqual({});
    }
  });
  it('rejects bad profile fields', () => {
    const st = createMemoryStorage();
    st.set('zonked.profile.v1', JSON.stringify({ v: 1, ...P, extraGentle: 'yes' }));
    expect(loadProfile(st)).toEqual(DEFAULT_PROFILE);
    st.set('zonked.profile.v1', JSON.stringify({ v: 1, ...P, createdAt: -1 }));
    expect(loadProfile(st)).toEqual(DEFAULT_PROFILE);
    expect(saveProfile(st, { ...P, goal: 'bad' as never })).toBe(false);
  });
  it('drops bad journey entries and keeps good ones', () => {
    const st = createMemoryStorage();
    const good = { startedAt: 5, doneDays: [2], pickedIds: ['a-01'] };
    const journeys = {
      'easier-sleep': good,
      'unknown-id': good,
      'focus-mornings': { ...good, doneDays: [99] },
      'calm-evenings': { ...good, doneDays: [0] },
      'study-sprint': { ...good, pickedIds: ['Bad Id!'] },
      'after-work-reset': { ...good, pickedIds: new Array(99).fill('a-01') },
      'gentle-routine': { ...good, startedAt: -1 },
    };
    st.set('zonked.journeys.v1', JSON.stringify({ v: 1, journeys }));
    expect(Object.keys(loadProgress(st))).toEqual(['easier-sleep']);
    st.set('zonked.journeys.v1', JSON.stringify({ v: 1, journeys: [1] }));
    expect(loadProgress(st)).toEqual({});
    st.set('zonked.journeys.v1', JSON.stringify({ v: 1, journeys: { 'easier-sleep': { startedAt: 1, doneDays: 'x', pickedIds: [] } } }));
    expect(loadProgress(st)).toEqual({});
  });
  it('rejects oversized payloads on read and write', () => {
    const st = createMemoryStorage();
    st.set('zonked.profile.v1', ' '.repeat(MAX_PAYLOAD_BYTES + 1));
    expect(loadProfile(st)).toEqual(DEFAULT_PROFILE);
    const huge = { 'easier-sleep': { startedAt: 1, doneDays: [], pickedIds: [] } };
    expect(saveProgress(st, huge)).toBe(true);
    const okStore: StorageLike = { get: () => null, set: () => undefined, remove: () => undefined };
    expect(saveProfile(okStore, { ...P, createdAt: 1 })).toBe(true);
  });
  it('never throws when the store throws', () => {
    const boom = (): never => { throw new Error('blocked'); };
    const bad: StorageLike = { get: boom, set: boom, remove: boom };
    expect(loadProfile(bad)).toEqual(DEFAULT_PROFILE);
    expect(loadProgress(bad)).toEqual({});
    expect(saveProfile(bad, P)).toBe(false);
    expect(saveProgress(bad, {})).toBe(false);
    expect(() => clearAll(bad)).not.toThrow();
  });
  it('clearAll removes both keys', () => {
    const st = createMemoryStorage();
    saveProfile(st, P);
    saveProgress(st, PROG);
    clearAll(st);
    expect(st.get('zonked.profile.v1')).toBeNull();
    expect(st.get('zonked.journeys.v1')).toBeNull();
  });
  it('memory storage works and localStorage factory falls back when blocked', () => {
    const m = createMemoryStorage();
    m.set('a', '1');
    expect(m.get('a')).toBe('1');
    m.remove('a');
    expect(m.get('a')).toBeNull();
    const blocked = { setItem: () => { throw new Error('denied'); }, getItem: () => null, removeItem: () => undefined } as unknown as Storage;
    const fb = createLocalStorage(blocked);
    fb.set('k', 'v');
    expect(fb.get('k')).toBe('v');
    expect(createLocalStorage().get('zonked.nothing')).toBeNull();
  });
  it('wraps a working Storage', () => {
    const data = new Map<string, string>();
    const ls = {
      setItem: (k: string, v: string) => void data.set(k, v),
      getItem: (k: string) => data.get(k) ?? null,
      removeItem: (k: string) => void data.delete(k),
    } as unknown as Storage;
    const st = createLocalStorage(ls);
    st.set('x', '1');
    expect(data.get('x')).toBe('1');
    expect(st.get('x')).toBe('1');
    st.remove('x');
    expect(data.has('x')).toBe(false);
  });
});

describe('last session id', () => {
  it('round trips a valid id and rejects a bad one', () => {
    const st = createMemoryStorage();
    expect(loadLast(st)).toBeNull();
    saveLast(st, 'deep-work-1');
    expect(loadLast(st)).toBe('deep-work-1');
    saveLast(st, '<script>');
    expect(loadLast(st)).toBe('deep-work-1');
    clearAll(st);
    expect(loadLast(st)).toBeNull();
  });
});
