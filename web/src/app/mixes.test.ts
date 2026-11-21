import { describe, expect, it } from 'vitest';
import { MAX_NAME, cleanName, cleanDraft, makeMix, parseMix, renameMix, uniqueName } from './mixes';
import type { MixDraft } from './mixes';

const NOW = 1_700_000_000_000;
const draft: MixDraft = {
  source: { kind: 'template', id: 'focus-01' },
  voice: { carrierHz: 200, beatHz: 10, mode: 'binaural', noise: 'pink', noiseLevel: 0.3, gain: 0.4 },
  layers: { lofiLevel: 0.5, padRootHz: 110 },
  timer: { kind: 'countdown', minutes: 30 },
};

describe('mix validation', () => {
  it('round trips a valid mix', () => {
    const m = makeMix(draft, 'Evening calm', NOW, () => 0.5);
    expect(parseMix(JSON.parse(JSON.stringify(m)) as unknown, NOW)).toEqual(m);
  });

  it('clamps hearing-safety bounds, including NaN and Infinity', () => {
    const bad = { ...draft, voice: { ...draft.voice, carrierHz: 5, beatHz: 99, gain: 9, noiseLevel: -3 } };
    const m = makeMix(bad, 'x', NOW);
    expect(m.voice).toMatchObject({ carrierHz: 20, beatHz: 40, gain: 0.85, noiseLevel: 0 });
    const odd = cleanDraft({ ...draft, voice: { ...draft.voice, carrierHz: Number.NaN, beatHz: Infinity, gain: -Infinity } });
    expect(odd?.voice).toMatchObject({ carrierHz: 200, beatHz: 10, gain: 0.3 });
    const hi = cleanDraft({ ...draft, voice: { ...draft.voice, carrierHz: 1e9 } });
    expect(hi?.voice.carrierHz).toBe(1500);
  });

  it('clamps layers, drops unknown keys and non-numbers', () => {
    const d = cleanDraft({ ...draft, layers: { lofiLevel: 7, padRootHz: 9999, instKind: 99, evil: 1, crackle: 'x', stereoWidth: Number.NaN, panRateHz: 5 } });
    expect(d?.layers).toEqual({ lofiLevel: 1, padRootHz: 440, instKind: 3, panRateHz: 0.2 });
  });

  it('rejects unknown or missing versions and non-objects', () => {
    const m = makeMix(draft, 'a', NOW);
    expect(parseMix({ ...m, v: 2 }, NOW)).toBeNull();
    const { v: _v, ...nov } = m;
    expect(parseMix(nov, NOW)).toBeNull();
    expect(parseMix(null, NOW)).toBeNull();
    expect(parseMix([m], NOW)).toBeNull();
    expect(parseMix('x', NOW)).toBeNull();
    expect(parseMix({ ...m, id: '../evil id' }, NOW)).toBeNull();
    expect(parseMix({ ...m, voice: 5 }, NOW)).toBeNull();
  });

  it('does not pollute prototypes from hostile JSON', () => {
    const hostile = JSON.parse(
      '{"v":1,"id":"a1","name":"x","__proto__":{"polluted":1},"voice":{"__proto__":{"polluted":2},"carrierHz":200},"layers":{"__proto__":{"polluted":3},"constructor":{"prototype":{"polluted":4}}}}',
    ) as unknown;
    const m = parseMix(hostile, NOW);
    expect(m).not.toBeNull();
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
    expect(Object.keys(m?.layers ?? {})).toEqual([]);
    expect(Object.getPrototypeOf(m?.voice)).toBe(Object.prototype);
  });

  it('inherited fields are ignored', () => {
    const proto = { v: 1, id: 'a1', voice: { carrierHz: 300 } };
    const o = Object.create(proto) as unknown;
    expect(parseMix(o, NOW)).toBeNull();
  });

  it('cleans names, ids, timers and sources', () => {
    expect(cleanName('  a\u0000\n b  ', 'f')).toBe('a b');
    expect(cleanName('x'.repeat(500), 'f')).toHaveLength(MAX_NAME);
    expect(cleanName(5, 'f')).toBe('f');
    expect(cleanName('   ', 'f')).toBe('f');
    const t = cleanDraft({ ...draft, timer: { kind: 'pomodoro', focusMin: 9999, breakMin: 0 }, source: { kind: 'x', id: '<b>' } });
    expect(t?.timer).toEqual({ kind: 'pomodoro', focusMin: 240, breakMin: 1 });
    expect(t?.source).toEqual({ kind: 'custom', id: 'custom' });
    expect(cleanDraft({ ...draft, timer: { kind: 'bogus' } })?.timer).toEqual({ kind: 'none' });
    expect(cleanDraft({ ...draft, timer: 4 })?.timer).toEqual({ kind: 'none' });
    expect(cleanDraft({ ...draft, source: 4 })?.source.kind).toBe('custom');
    expect(cleanDraft({ ...draft, timer: { kind: 'sleep-fade', minutes: 500 } })?.timer).toEqual({ kind: 'sleep-fade', minutes: 240 });
    expect(cleanDraft('x')).toBeNull();
    expect(cleanDraft({ ...draft, voice: null })).toBeNull();
    expect(() => makeMix({ ...draft, voice: null } as unknown as MixDraft, 'a', NOW)).toThrow(RangeError);
  });

  it('renames and keeps names unique', () => {
    const m = makeMix(draft, 'a', NOW);
    expect(renameMix(m, ' New ', NOW + 5)).toMatchObject({ name: 'New', updatedAt: NOW + 5 });
    expect(renameMix(m, '', NOW + 5).name).toBe('a');
    expect(uniqueName('Calm', ['Calm', 'Calm (2)'])).toBe('Calm (3)');
    expect(uniqueName('Calm', [])).toBe('Calm');
  });

  it('caps future timestamps', () => {
    const m = makeMix(draft, 'a', NOW);
    const p = parseMix({ ...m, createdAt: 9e15, updatedAt: -5 }, NOW);
    expect(p?.createdAt).toBeLessThanOrEqual(NOW + 86_400_000);
    expect(p?.updatedAt).toBe(0);
  });
});
