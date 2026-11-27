import { useEffect, useMemo, useState } from 'react';
import type { Mix } from '../../app/mixes';
import { NO_FAVORITES, parseFavorites } from '../../app/favorites';
import type { Favorites } from '../../app/favorites';
import { getTemplates, searchTemplates } from '../../catalog';
import { SOUND_MENU } from '../../catalog/soundMenu';
import type { Template } from '../../catalog/types';
import type { LogRecord, Store } from '../../storage/db';
import { CALM, EVIDENCE, FEELINGS } from './copy';
import { Icon } from './icons';
import { PageHead } from './MascotView';

interface Props {
  readonly store: Store;
  readonly logs: readonly LogRecord[];
  readonly reduced?: boolean;
  /** Opens the Nature and My sounds screen. */
  readonly onNature?: () => void;
  readonly onPlay: (t: Template) => void;
  readonly onPlayMix: (m: Mix) => void;
}

const PAGE = 10;

function TemplateRows({ list, onPlay }: { readonly list: readonly Template[]; readonly onPlay: (t: Template) => void }): React.JSX.Element {
  return (
    <ul className="c-list">
      {list.map((t) => (
        <li key={t.id}>
          <button type="button" className="c-row-card" onClick={() => onPlay(t)}>
            <b>{t.name}</b>
            <small>{`${t.recommendedMinutes} min`}</small>
          </button>
        </li>
      ))}
    </ul>
  );
}

const Empty = ({ text }: { readonly text: string }): React.JSX.Element => <p className="c-empty">{text}</p>;

function Feeling({ onPlay }: { readonly onPlay: (t: Template) => void }): React.JSX.Element {
  const [sit, setSit] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of getTemplates()) for (const s of t.situations) c[s] = (c[s] ?? 0) + 1;
    return c;
  }, []);
  const all = useMemo(() => getTemplates().filter((t) => sit !== null && (t.situations as readonly string[]).includes(sit)), [sit]);
  return (
    <>
      <ul className="c-tiles">
        {FEELINGS.map((f, i) => (
          <li key={f.id}>
            <button type="button" className={`c-tile c-g${(i % 6) + 1}`} aria-pressed={sit === f.id} onClick={() => { setSit(f.id); setPage(0); }}>
              <Icon name={f.icon} />
              <span className="c-tile-name">{f.label}</span>
              <span className="c-tile-mood">{f.mood}</span>
              <span className="c-tile-count">{CALM.sounds(counts[f.id] ?? 0)}</span>
            </button>
          </li>
        ))}
      </ul>
      {sit !== null && <TemplateRows list={all.slice(page * PAGE, page * PAGE + PAGE)} onPlay={onPlay} />}
      {sit !== null && all.length > PAGE && (
        <div className="c-actions c-row">
          <button type="button" className="c-btn c-small" disabled={page === 0} onClick={() => setPage(page - 1)}>
            {CALM.back}
          </button>
          <button type="button" className="c-btn c-small" disabled={(page + 1) * PAGE >= all.length} onClick={() => setPage(page + 1)}>
            {CALM.next}
          </button>
        </div>
      )}
    </>
  );
}

function Sounds({ onPlay }: { readonly onPlay: (t: Template) => void }): React.JSX.Element {
  const pool = getTemplates();
  return (
    <ul className="c-list">
      {SOUND_MENU.map((s) => {
        const t = pool.find((x) => x.id === s.templateId);
        return (
          <li key={s.id}>
            <button type="button" className="c-row-card" disabled={t === undefined} onClick={() => t !== undefined && onPlay(t)}>
              <b>{s.name}</b>
              <small>{s.blurb}</small>
              <small>{s.id === 'violet' ? 'Start very quiet.' : EVIDENCE[s.evidence]}</small>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function useStored(store: Store): { readonly favs: Favorites; readonly mixes: readonly Mix[] } {
  const [favs, setFavs] = useState<Favorites>(NO_FAVORITES);
  const [mixes, setMixes] = useState<readonly Mix[]>([]);
  useEffect(() => {
    let live = true;
    store.getRecord('favorites').then((r) => live && setFavs(parseFavorites(r, Date.now()))).catch(() => undefined);
    store.listMixes().then((m) => live && setMixes(m)).catch(() => undefined);
    return () => {
      live = false;
    };
  }, [store]);
  return { favs, mixes };
}

export function Library({ store, logs, reduced = false, onNature, onPlay, onPlayMix }: Props): React.JSX.Element {
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState('');
  const { favs, mixes } = useStored(store);
  const text = q.trim().slice(0, 80);
  const found = useMemo(() => (text === '' ? [] : searchTemplates({ text }).slice(0, 20)), [text]);
  const pool = useMemo(() => getTemplates(), []);
  const favTemplates = favs.items.filter((f) => f.kind === 'template').map((f) => pool.find((t) => t.id === f.id)).filter((t): t is Template => t !== undefined);
  const recent = logs.slice(0, 10);
  return (
    <div>
      <PageHead title={CALM.libraryTitle} reduced={reduced} />
      {onNature !== undefined && (
        <button type="button" className="c-card c-link-card c-nature-link" data-testid="open-nature" onClick={onNature}>
          <b>{CALM.natureTitle}</b>
          <span className="c-muted">{CALM.natureLine}</span>
        </button>
      )}
      <div className="c-search">
        <label htmlFor="c-search-in" className="c-sr">
          {CALM.searchLabel}
        </label>
        <input id="c-search-in" type="search" placeholder={CALM.searchLabel} value={q} maxLength={80} onChange={(e) => setQ(e.target.value)} />
      </div>
      {text !== '' ? (
        found.length === 0 ? <Empty text={CALM.searchEmpty} /> : <TemplateRows list={found} onPlay={onPlay} />
      ) : (
        <>
          <div className="c-tabs" role="tablist" aria-label={CALM.libraryTitle}>
            {CALM.tabs.map((name, i) => (
              <button key={name} type="button" role="tab" id={`c-tab-${i}`} aria-selected={tab === i} aria-controls="c-tabpanel" className="c-tab" onClick={() => setTab(i)}>
                {name}
              </button>
            ))}
          </div>
          <div id="c-tabpanel" role="tabpanel" aria-labelledby={`c-tab-${tab}`}>
            {tab === 0 && <Feeling onPlay={onPlay} />}
            {tab === 1 && <Sounds onPlay={onPlay} />}
            {tab === 2 && (favTemplates.length === 0 ? <Empty text={CALM.emptyFavorites} /> : <TemplateRows list={favTemplates} onPlay={onPlay} />)}
            {tab === 3 &&
              (mixes.length === 0 ? (
                <Empty text={CALM.emptyMixes} />
              ) : (
                <ul className="c-list">
                  {mixes.map((m) => (
                    <li key={m.id}>
                      <button type="button" className="c-row-card" onClick={() => onPlayMix(m)}>
                        <b>{m.name}</b>
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            {tab === 4 &&
              (recent.length === 0 ? (
                <Empty text={CALM.emptyRecent} />
              ) : (
                <ul className="c-list">
                  {recent.map((l) => (
                    <li key={l.id} className="c-row-card">
                      <b>{new Date(l.startedAt).toLocaleDateString()}</b>
                      <small>{`${Math.max(1, Math.round((l.endedAt - l.startedAt) / 60000))} min`}</small>
                    </li>
                  ))}
                </ul>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
