import { describe, expect, it } from 'vitest';
import { MAX_FAVORITES, NO_FAVORITES, isFavorite, parseFavorites, removeKind, toggleFavorite } from './favorites';

describe('favorites', () => {
  it('toggles without mutating', () => {
    const a = toggleFavorite(NO_FAVORITES, 'template', 't1', 10);
    expect(NO_FAVORITES.items).toHaveLength(0);
    expect(isFavorite(a, 'template', 't1')).toBe(true);
    const b = toggleFavorite(a, 'mix', 'm1', 20);
    expect(b.items[0]?.id).toBe('m1');
    expect(toggleFavorite(b, 'template', 't1', 30).items).toHaveLength(1);
    expect(removeKind(b, 'mix', 'm1').items).toHaveLength(1);
    expect(removeKind(b, 'mix', 'zz')).toBe(b);
  });

  it('rejects bad ids and respects the cap', () => {
    expect(toggleFavorite(NO_FAVORITES, 'template', '<x>', 1)).toBe(NO_FAVORITES);
    let f = NO_FAVORITES;
    for (let i = 0; i < MAX_FAVORITES + 5; i += 1) f = toggleFavorite(f, 'template', `t${i}`, i);
    expect(f.items).toHaveLength(MAX_FAVORITES);
  });

  it('parses hostile data safely', () => {
    expect(parseFavorites(null, 5)).toBe(NO_FAVORITES);
    expect(parseFavorites({ v: 2, items: [] }, 5)).toBe(NO_FAVORITES);
    expect(parseFavorites({ v: 1, items: 'x' }, 5)).toBe(NO_FAVORITES);
    const p = parseFavorites({ v: 1, items: [{ kind: 'template', id: 'a', at: 1 }, { kind: 'template', id: 'a', at: 2 }, { kind: 'bad', id: 'b' }, 7, { kind: 'mix', id: '<>' }, { kind: 'mix', id: 'm', at: 'x' }] }, 50);
    expect(p.items.map((i) => `${i.kind}:${i.id}`)).toEqual(['template:a', 'mix:m']);
    expect(p.items[1]?.at).toBe(50);
    const many = parseFavorites({ v: 1, items: Array.from({ length: 2000 }, (_, i) => ({ kind: 'template', id: `t${i}`, at: 1 })) }, 5);
    expect(many.items).toHaveLength(MAX_FAVORITES);
  });

  it('moves a saved old seed id to its original replacement and drops the duplicate', () => {
    const p = parseFavorites({ v: 1, items: [{ kind: 'template', id: 'android-morphine', at: 1 }, { kind: 'template', id: 'seed-warm-hum', at: 2 }, { kind: 'mix', id: 'android-morphine', at: 3 }] }, 50);
    expect(p.items.map((i) => `${i.kind}:${i.id}`)).toEqual(['template:seed-warm-hum', 'mix:android-morphine']);
  });
});
