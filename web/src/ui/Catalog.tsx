import { useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_LABEL, LAYER_TAGS, VIBES, searchTemplates } from '../catalog';
import type { Category, LayerTag, Template, Vibe } from '../catalog/types';
import { COPY } from './copy';
import { Drawer } from './Drawer';

export const PAGE_SIZE = 24;

interface Props {
  currentId: string | null;
  onPlay: (queue: readonly Template[], t: Template) => void;
  onClose: () => void;
}

export function Catalog({ currentId, onPlay, onClose }: Props): React.JSX.Element {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [vibe, setVibe] = useState<Vibe | ''>('');
  const [adhd, setAdhd] = useState(false);
  const [tags, setTags] = useState<readonly LayerTag[]>([]);
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () =>
      searchTemplates({
        text,
        ...(category !== '' ? { category } : {}),
        ...(vibe !== '' ? { vibe } : {}),
        ...(adhd ? { adhdFriendly: true } : {}),
        layerTags: tags,
      }),
    [text, category, vibe, adhd, tags],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(page, pages - 1);
  const slice = filtered.slice(cur * PAGE_SIZE, (cur + 1) * PAGE_SIZE);
  const reset = <T,>(set: (v: T) => void) => (v: T): void => {
    set(v);
    setPage(0);
  };

  return (
    <Drawer id="catalog-panel" title="Catalog" help={COPY.tips.catalog} testId="catalog-panel" onClose={onClose}>
      <label htmlFor="catalog-search">Search</label>
      <input
        id="catalog-search"
        data-testid="catalog-search"
        type="search"
        value={text}
        maxLength={80}
        placeholder="name, tag, mood"
        onChange={(e) => reset(setText)(e.target.value)}
      />
      <div className="form-grid">
        <label htmlFor="cat-category">Category</label>
        <select id="cat-category" value={category} onChange={(e) => reset(setCategory)(e.target.value as Category | '')}>
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
        <label htmlFor="cat-vibe">Vibe</label>
        <select id="cat-vibe" value={vibe} onChange={(e) => reset(setVibe)(e.target.value as Vibe | '')}>
          <option value="">All</option>
          {VIBES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <label className="check">
        <input
          type="checkbox"
          data-testid="catalog-adhd"
          checked={adhd}
          onChange={(e) => reset(setAdhd)(e.target.checked)}
        />
        Steady sounds only
      </label>
      <div className="chips" role="group" aria-label="Layer tags">
        {LAYER_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className="chip"
            aria-pressed={tags.includes(t)}
            data-testid={`catalog-tag-${t}`}
            onClick={() => reset(setTags)(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="meta" role="status" data-testid="catalog-count">
        {filtered.length} templates, page {cur + 1} of {pages}
      </p>
      <ul className="catalog-list" aria-label="Templates">
        {slice.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="catalog-item"
              data-testid="catalog-item"
              aria-current={t.id === currentId ? 'true' : undefined}
              onClick={() => onPlay(filtered, t)}
            >
              <span className="catalog-name">{t.name}</span>
              <span className="meta">
                {CATEGORY_LABEL[t.category]}, {t.vibe}, {t.recommendedMinutes} min
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="pager">
        <button type="button" className="btn" disabled={cur === 0} onClick={() => setPage(cur - 1)} data-testid="catalog-prev">
          Previous page
        </button>
        <button
          type="button"
          className="btn"
          disabled={cur >= pages - 1}
          onClick={() => setPage(cur + 1)}
          data-testid="catalog-next"
        >
          Next page
        </button>
      </div>
    </Drawer>
  );
}
