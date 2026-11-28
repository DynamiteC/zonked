/** Favorites: templates and mixes the listener wants close at hand. Pure, immutable, local only. */
import { currentTemplateId } from '../catalog/legacyIds';
import { cleanId, field, isRecord, num } from './mixes';

export const MAX_FAVORITES = 500;

export type FavoriteKind = 'template' | 'mix';

export interface Favorite {
  readonly kind: FavoriteKind;
  readonly id: string;
  readonly at: number;
}

export interface Favorites {
  readonly v: 1;
  readonly items: readonly Favorite[];
}

export const NO_FAVORITES: Favorites = { v: 1, items: [] };

export function parseFavorites(x: unknown, now: number): Favorites {
  if (!isRecord(x) || field(x, 'v') !== 1) return NO_FAVORITES;
  const raw = field(x, 'items');
  if (!Array.isArray(raw)) return NO_FAVORITES;
  const items: Favorite[] = [];
  const seen = new Set<string>();
  for (const r of raw.slice(0, MAX_FAVORITES * 2)) {
    if (!isRecord(r)) continue;
    const kind = field(r, 'kind');
    const rawId = cleanId(field(r, 'id'));
    const id = rawId !== null && kind === 'template' ? currentTemplateId(rawId) : rawId;
    if ((kind !== 'template' && kind !== 'mix') || id === null) continue;
    const key = `${kind}:${id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ kind, id, at: num(field(r, 'at'), 0, now + 86_400_000, now) });
    if (items.length >= MAX_FAVORITES) break;
  }
  return { v: 1, items };
}

export function isFavorite(f: Favorites, kind: FavoriteKind, id: string): boolean {
  return f.items.some((i) => i.kind === kind && i.id === id);
}

/** Adds or removes one favorite and returns a new list. The newest favorite comes first. */
export function toggleFavorite(f: Favorites, kind: FavoriteKind, id: string, now: number): Favorites {
  if (isFavorite(f, kind, id)) return { v: 1, items: f.items.filter((i) => !(i.kind === kind && i.id === id)) };
  if (cleanId(id) === null || f.items.length >= MAX_FAVORITES) return f;
  return { v: 1, items: [{ kind, id, at: now }, ...f.items] };
}

export function removeKind(f: Favorites, kind: FavoriteKind, id: string): Favorites {
  return isFavorite(f, kind, id) ? toggleFavorite(f, kind, id, 0) : f;
}
