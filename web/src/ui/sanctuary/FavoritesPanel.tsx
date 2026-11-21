import { useEffect, useMemo, useState } from 'react';
import type { Template } from '../../catalog/types';
import { loadCatalog } from '../catalogLoader';
import { SX } from './copy';
import type { SanctuaryData } from './useSanctuaryData';
import type { SanctuaryProps } from './types';

type Props = Pick<SanctuaryProps, 'nowPlaying' | 'onLoadMix' | 'onPlayTemplate'> & { data: SanctuaryData };
const MAX_HITS = 8;

export function FavoritesPanel({ data, nowPlaying, onLoadMix, onPlayTemplate }: Props): React.JSX.Element {
  const [templates, setTemplates] = useState<readonly Template[]>([]);
  const [q, setQ] = useState('');
  useEffect(() => {
    let live = true;
    void loadCatalog().then((c) => live && setTemplates(c.getTemplates()), () => undefined);
    return () => {
      live = false;
    };
  }, []);
  const byId = useMemo(() => new Map(templates.map((t) => [t.id, t])), [templates]);
  const hits = useMemo(() => {
    const tokens = q.toLowerCase().split(/\s+/).filter((x) => x.length > 0);
    if (tokens.length === 0) return [];
    return templates.filter((t) => tokens.every((k) => `${t.name} ${t.category} ${t.vibe}`.toLowerCase().includes(k))).slice(0, MAX_HITS);
  }, [q, templates]);
  const isFav = (kind: 'template' | 'mix', id: string): boolean => data.favorites.items.some((i) => i.kind === kind && i.id === id);
  const playingTemplate = nowPlaying?.kind === 'template' ? nowPlaying.id : null;
  const f = SX.favorites;

  return (
    <div className="sx-stack" data-testid="sanctuary-favorites">
      <p className="sx-muted">{f.help}</p>
      {data.favorites.items.length === 0 ? (
        <p data-testid="sanctuary-favorites-empty">{f.empty}</p>
      ) : (
        <ul className="sx-rows" data-testid="sanctuary-favorites-list">
          {data.favorites.items.map((i) => {
            const t = i.kind === 'template' ? byId.get(i.id) : undefined;
            const mix = i.kind === 'mix' ? data.mixes.find((m) => m.id === i.id) : undefined;
            const name = t?.name ?? mix?.name ?? (i.kind === 'template' ? f.gone : f.mixMissing);
            const canPlay = t !== undefined || mix !== undefined;
            return (
              <li key={`${i.kind}:${i.id}`} className="sx-row">
                <span className="sx-grow">{name}</span>
                <button type="button" className="btn" disabled={!canPlay} onClick={() => (t ? onPlayTemplate(t.id) : mix && onLoadMix(mix))}>
                  {f.play}
                </button>
                <button type="button" className="btn" aria-label={`${f.remove}: ${name}`} onClick={() => void data.toggleFavorite(i.kind, i.id)}>
                  {SX.favorites.remove}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="sx-card">
        <button
          type="button"
          className="btn"
          data-testid="sanctuary-fav-playing"
          disabled={playingTemplate === null}
          aria-pressed={playingTemplate !== null && isFav('template', playingTemplate)}
          onClick={() => playingTemplate !== null && void data.toggleFavorite('template', playingTemplate)}
        >
          {f.addPlaying}
        </button>
        {playingTemplate === null ? <p className="sx-muted">{f.nothingPlaying}</p> : null}
        <label className="sx-label" htmlFor="sx-fav-search">
          {f.searchLabel}
        </label>
        <input id="sx-fav-search" data-testid="sanctuary-fav-search" className="sx-input" type="search" maxLength={40} value={q} placeholder={f.searchHint} onChange={(e) => setQ(e.target.value)} />
        <ul className="sx-rows">
          {hits.map((t) => (
            <li key={t.id} className="sx-row">
              <span className="sx-grow">{t.name}</span>
              <button
                type="button"
                className="btn"
                data-testid={`sanctuary-fav-toggle-${t.id}`}
                aria-pressed={isFav('template', t.id)}
                aria-label={`${isFav('template', t.id) ? f.remove : f.add}: ${t.name}`}
                onClick={() => void data.toggleFavorite('template', t.id)}
              >
                {isFav('template', t.id) ? SX.favorites.favorited : f.add}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
