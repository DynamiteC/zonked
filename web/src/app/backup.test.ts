import { describe, expect, it } from 'vitest';
import { MAX_FILE_BYTES, exportBackup, parseBackup, planImport } from './backup';
import { NO_FAVORITES, toggleFavorite } from './favorites';
import { NEW_STATE } from './milestones';
import { MAX_MIXES, makeMix } from './mixes';
import type { MixDraft } from './mixes';

const NOW = 1_700_000_000_000;
const draft: MixDraft = {
  source: { kind: 'preset', id: 'calm' },
  voice: { carrierHz: 200, beatHz: 6, mode: 'binaural', noise: 'brown', noiseLevel: 0.2, gain: 0.3 },
  layers: {},
  timer: { kind: 'none' },
};
const mix = (n: string) => makeMix(draft, n, NOW);
const file = (o: unknown): string => JSON.stringify(o);
const env = (extra: Record<string, unknown>) => ({ app: 'zonked', kind: 'sanctuary', v: 1, ...extra });

describe('backup file', () => {
  it('round trips mixes, template favorites and milestones', () => {
    let fav = toggleFavorite(NO_FAVORITES, 'template', 't1', 1);
    fav = toggleFavorite(fav, 'mix', 'm1', 2);
    const text = exportBackup([mix('a'), mix('b')], fav, { ...NEW_STATE, earned: { 'first-session': 5 } }, NOW);
    const r = parseBackup(text, NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.mixes.map((m) => m.name)).toEqual(['a', 'b']);
    expect(r.favorites.items.map((i) => i.id)).toEqual(['t1']);
    expect(r.milestones?.earned).toEqual({ 'first-session': 5 });
    expect(text).not.toMatch(/https?:/);
  });

  it('rejects hostile files with a clear reason', () => {
    expect(parseBackup('x'.repeat(MAX_FILE_BYTES + 1), NOW)).toEqual({ ok: false, error: 'too-big' });
    expect(parseBackup('{not json', NOW)).toEqual({ ok: false, error: 'not-json' });
    expect(parseBackup('[]', NOW)).toEqual({ ok: false, error: 'not-zonked' });
    expect(parseBackup(file({ app: 'other', kind: 'sanctuary', v: 1 }), NOW)).toEqual({ ok: false, error: 'not-zonked' });
    expect(parseBackup(file(env({ v: 2 })), NOW)).toEqual({ ok: false, error: 'unknown-version' });
    expect(parseBackup(file({ app: 'zonked', kind: 'sanctuary' }), NOW)).toEqual({ ok: false, error: 'unknown-version' });
    const many = Array.from({ length: MAX_MIXES + 1 }, (_, i) => mix(`m${i}`));
    expect(parseBackup(file(env({ mixes: many })), NOW)).toEqual({ ok: false, error: 'too-many' });
  });

  it('clamps out-of-range values in imported mixes and skips broken ones', () => {
    const evil = { ...mix('evil'), voice: { ...draft.voice, gain: 9, carrierHz: 1, beatHz: 500 } };
    const r = parseBackup(file(env({ mixes: [evil, { v: 7 }, 'x', null] })), NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.mixes).toHaveLength(1);
    expect(r.mixes[0]?.voice).toMatchObject({ gain: 0.85, carrierHz: 20, beatHz: 40 });
    expect(r.skipped).toBe(3);
  });

  it('survives prototype pollution keys', () => {
    const text = '{"app":"zonked","kind":"sanctuary","v":1,"__proto__":{"polluted":true},"mixes":[],"favorites":{"v":1,"__proto__":{"polluted":true},"items":[]},"milestones":{"__proto__":{"polluted":1},"v":1}}';
    const r = parseBackup(text, NOW);
    expect(r.ok).toBe(true);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('missing optional parts import cleanly', () => {
    const r = parseBackup(file(env({})), NOW);
    expect(r).toMatchObject({ ok: true, mixes: [], milestones: null });
  });

  it('carries how-it-felt answers and validates them on import', () => {
    const text = exportBackup([], NO_FAVORITES, NEW_STATE, NOW, [{ id: 'starter-rain', a: 'calmer', day: 5 }]);
    const r = parseBackup(text, NOW);
    expect(r).toMatchObject({ ok: true, feel: [{ id: 'starter-rain', a: 'calmer', day: 5 }] });
    expect(exportBackup([], NO_FAVORITES, NEW_STATE, NOW)).not.toContain('"feel"');
    const bad = parseBackup(file(env({ feel: [{ id: 'x', a: 'great', day: 1 }, { id: 'ok', a: 'not', day: 2 }, 7] })), NOW);
    expect(bad).toMatchObject({ ok: true, feel: [{ id: 'ok', a: 'not', day: 2 }] });
    expect(parseBackup(file(env({})), NOW)).toMatchObject({ ok: true, feel: null });
  });

  it('plans merge and replace with new ids and unique names', () => {
    const a = mix('Calm');
    const imported = [mix('Calm'), mix('Calm')];
    const merged = planImport([a], imported, 'merge', NOW, () => 0.1);
    expect(merged.map((m) => m.name)).toEqual(['Calm (2)', 'Calm (3)']);
    expect(new Set(merged.map((m) => m.id)).size).toBe(2);
    expect(merged.every((m) => m.id !== a.id)).toBe(true);
    expect(planImport([a], imported, 'replace', NOW).map((m) => m.name)).toEqual(['Calm', 'Calm (2)']);
    const full = Array.from({ length: MAX_MIXES }, (_, i) => mix(`x${i}`));
    expect(planImport(full, imported, 'merge', NOW)).toEqual([]);
  });
});
