import { describe, expect, it } from 'vitest';
import { getTemplates, recommendTemplates } from '../../../catalog';
import { profileToRecommendation } from './recommendation';
import { clearAll, createMemoryStorage } from './storage';
import {
  FEEL_KEY, MAX_FEEL_BYTES, MAX_FEEL_ENTRIES, addFeel, feelBias, loadFeel, nudgeRecs, parseFeel, saveFeel,
} from './feel';
import type { FeelEntry } from './feel';
import type { Profile } from './types';

const e = (id: string, a: FeelEntry['a'], day = 100): FeelEntry => ({ id, a, day });

describe('feel storage', () => {
  it('round trips and keeps order', () => {
    const st = createMemoryStorage();
    expect(saveFeel(st, [e('a-1', 'calmer'), e('b-2', 'not', 101)])).toBe(true);
    expect(loadFeel(st)).toEqual([e('a-1', 'calmer'), e('b-2', 'not', 101)]);
  });
  it('drops the oldest past 500 entries', () => {
    let list: readonly FeelEntry[] = [];
    for (let i = 0; i < MAX_FEEL_ENTRIES + 20; i++) list = addFeel(list, e(`t-${i}`, 'same', i));
    expect(list).toHaveLength(MAX_FEEL_ENTRIES);
    expect(list[0]?.id).toBe('t-20');
    expect(list.at(-1)?.id).toBe(`t-${MAX_FEEL_ENTRIES + 19}`);
  });
  it('treats corrupt, wrong-version and oversize payloads as empty', () => {
    const st = createMemoryStorage();
    st.set(FEEL_KEY, '{not json');
    expect(loadFeel(st)).toEqual([]);
    st.set(FEEL_KEY, JSON.stringify({ v: 2, entries: [e('a', 'same')] }));
    expect(loadFeel(st)).toEqual([]);
    st.set(FEEL_KEY, JSON.stringify({ v: 1, entries: 'x' }));
    expect(loadFeel(st)).toEqual([]);
    st.set(FEEL_KEY, 'x'.repeat(MAX_FEEL_BYTES + 1));
    expect(loadFeel(st)).toEqual([]);
  });
  it('drops bad rows and unknown answers', () => {
    const rows = [e('ok-1', 'calmer'), { id: 'Bad Id', a: 'same', day: 1 }, { id: 'x', a: 'great', day: 1 }, { id: 'x', a: 'same', day: -1 }, null, 4, { id: 'y', a: 'same', day: 1.5 }];
    expect(parseFeel(rows)).toEqual([e('ok-1', 'calmer')]);
    expect(parseFeel('nope')).toEqual([]);
  });
  it('stays under the byte cap by dropping the oldest', () => {
    const st = createMemoryStorage();
    const long = 'a'.repeat(80);
    const list = Array.from({ length: MAX_FEEL_ENTRIES }, (_, i) => e(`${long.slice(0, 60)}-${i}`, 'calmer', i));
    expect(saveFeel(st, list)).toBe(true);
    expect((st.get(FEEL_KEY) ?? '').length).toBeLessThanOrEqual(MAX_FEEL_BYTES);
  });
  it('reports a refusing store without throwing', () => {
    const boom = (): never => { throw new Error('full'); };
    expect(saveFeel({ get: boom, set: boom, remove: boom }, [e('a', 'same')])).toBe(false);
    expect(loadFeel({ get: boom, set: boom, remove: boom })).toEqual([]);
  });
  it('Forget my data removes it', () => {
    const st = createMemoryStorage();
    saveFeel(st, [e('a', 'calmer')]);
    clearAll(st);
    expect(st.get(FEEL_KEY)).toBeNull();
  });
});

describe('feel nudge', () => {
  it('moves Calmer up and Not for me down, capped', () => {
    expect(feelBias([e('a', 'calmer')], 'a')).toBeGreaterThan(0);
    expect(feelBias([e('a', 'not')], 'a')).toBeLessThan(0);
    expect(feelBias([e('a', 'same')], 'a')).toBe(0);
    expect(feelBias(Array.from({ length: 50 }, () => e('a', 'calmer')), 'a')).toBe(12);
  });
  const gentle: Profile = { goal: 'focus', timeOfDay: 'morning', device: 'headphones', extraGentle: true, createdAt: 1 };
  it('never lets a Calmer answer raise intensity above what the sensitivity setting allowed', () => {
    for (const p of [gentle, { ...gentle, extraGentle: false, goal: 'sleep' as const }]) {
      const ctx = profileToRecommendation(p, new Date(2026, 0, 5, 9));
      const top = recommendTemplates(ctx, 5);
      const wide = recommendTemplates(ctx, 12);
      const ceiling = Math.max(...top.map((r) => r.template.intensity));
      // Praise every sound, including the strongest in the catalog.
      const loud = [...getTemplates()].sort((a, b) => b.intensity - a.intensity).slice(0, 40);
      const entries = loud.flatMap((t) => [e(t.id, 'calmer'), e(t.id, 'calmer'), e(t.id, 'calmer')]);
      const out = nudgeRecs(top, wide, entries);
      expect(out).toHaveLength(top.length);
      for (const r of out) expect(r.template.intensity).toBeLessThanOrEqual(ceiling);
    }
  });
  it('pushes a disliked first pick down and returns the input when there are no answers', () => {
    const ctx = profileToRecommendation(gentle, new Date(2026, 0, 5, 9));
    const top = recommendTemplates(ctx, 5);
    const wide = recommendTemplates(ctx, 12);
    expect(nudgeRecs(top, wide, [])).toBe(top);
    const first = top[0]?.template.id ?? '';
    const out = nudgeRecs(top, wide, Array.from({ length: 4 }, () => e(first, 'not')));
    expect(out[0]?.template.id).not.toBe(first);
  });
});
