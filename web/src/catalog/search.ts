import { getTemplates } from './registry';
import type { SearchQuery, Template } from './types';

/** Case-insensitive search. Text tokens must all match name, id, tags, category or vibe. Catalog order is kept. */
export function searchTemplates(q: SearchQuery, pool: readonly Template[] = getTemplates()): Template[] {
  const tokens = (q.text ?? '').toLowerCase().split(/\s+/).filter((x) => x.length > 0);
  const need = q.layerTags ?? [];
  return pool.filter((t) => {
    if (q.category !== undefined && t.category !== q.category) return false;
    if (q.vibe !== undefined && t.vibe !== q.vibe) return false;
    if (q.adhdFriendly !== undefined && t.adhdFriendly !== q.adhdFriendly) return false;
    if (!need.every((tag) => t.layerTags.includes(tag))) return false;
    const hay = `${t.name} ${t.id} ${t.category} ${t.vibe} ${t.tags.join(' ')}`.toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  });
}
