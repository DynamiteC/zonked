import { useState } from 'react';
import { MAX_NAME } from '../../app/mixes';
import type { Mix } from '../../app/mixes';
import { SX } from './copy';
import type { SanctuaryData } from './useSanctuaryData';
import type { SanctuaryProps } from './types';

type Props = Pick<SanctuaryProps, 'nowPlaying' | 'currentMix' | 'onLoadMix'> & { data: SanctuaryData };

function summary(m: Mix): string {
  const t = m.timer;
  const c = SX.mixes;
  const timer =
    t.kind === 'countdown' ? `${c.timerCountdown} ${t.minutes ?? 0} min`
    : t.kind === 'sleep-fade' ? `${c.timerSleep} ${t.minutes ?? 0} min`
    : t.kind === 'pomodoro' ? `${c.timerPomodoro} ${t.focusMin ?? 0}/${t.breakMin ?? 0} min`
    : c.timerNone;
  return `${m.voice.mode}, ${m.voice.beatHz.toFixed(1)} Hz, ${timer}`;
}

function MixRow({ mix, data, playing, onLoad }: { mix: Mix; data: SanctuaryData; playing: boolean; onLoad: (m: Mix) => void }): React.JSX.Element {
  const [mode, setMode] = useState<'view' | 'rename' | 'delete'>('view');
  const [name, setName] = useState(mix.name);
  const fav = data.favorites.items.some((i) => i.kind === 'mix' && i.id === mix.id);
  const c = SX.mixes;
  return (
    <li className="sx-row sx-wrap" data-testid={`sanctuary-mix-${mix.id}`} aria-current={playing ? 'true' : undefined}>
      {mode === 'rename' ? (
        <>
          <label className="sx-label" htmlFor={`sx-rn-${mix.id}`}>{c.renameLabel}</label>
          <input id={`sx-rn-${mix.id}`} data-testid="sanctuary-rename-input" className="sx-input" maxLength={MAX_NAME} value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" className="btn" data-testid="sanctuary-rename-ok" onClick={() => void data.renameMix(mix.id, name).then(() => setMode('view'))}>{c.confirmRename}</button>
          <button type="button" className="btn" onClick={() => setMode('view')}>{c.cancel}</button>
        </>
      ) : (
        <>
          <span className="sx-grow">
            <strong>{mix.name}</strong>
            <span className="sx-muted sx-block">{summary(mix)}</span>
          </span>
          <button type="button" className="btn" data-testid="sanctuary-mix-play" onClick={() => onLoad(mix)}>{c.load}</button>
          <button type="button" className="btn" aria-pressed={fav} aria-label={`${fav ? SX.favorites.remove : SX.favorites.add}: ${mix.name}`} data-testid="sanctuary-mix-fav" onClick={() => void data.toggleFavorite('mix', mix.id)}>
            {fav ? SX.favorites.favorited : SX.favorites.add}
          </button>
          <button type="button" className="btn" data-testid="sanctuary-mix-rename" onClick={() => { setName(mix.name); setMode('rename'); }}>{c.rename}</button>
          {mode === 'delete' ? (
            <>
              <button type="button" className="btn" data-testid="sanctuary-mix-delete-yes" onClick={() => void data.deleteMix(mix.id)}>{c.confirmRemove}</button>
              <button type="button" className="btn" onClick={() => setMode('view')}>{c.cancel}</button>
            </>
          ) : (
            <button type="button" className="btn" data-testid="sanctuary-mix-delete" onClick={() => setMode('delete')}>{c.remove}</button>
          )}
        </>
      )}
    </li>
  );
}

export function MixesPanel({ data, nowPlaying, currentMix, onLoadMix }: Props): React.JSX.Element {
  const [name, setName] = useState('');
  const draft = currentMix();
  const c = SX.mixes;
  return (
    <div className="sx-stack" data-testid="sanctuary-mixes">
      <p className="sx-muted">{c.help}</p>
      <form
        className="sx-card"
        onSubmit={(e) => {
          e.preventDefault();
          void data.saveMix(currentMix(), name).then((ok) => ok && setName(''));
        }}
      >
        <label className="sx-label" htmlFor="sx-mix-name">{c.nameLabel}</label>
        <input id="sx-mix-name" data-testid="sanctuary-mix-name" className="sx-input" maxLength={MAX_NAME} value={name} placeholder={c.namePlaceholder} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="btn sx-primary" data-testid="sanctuary-mix-save" disabled={draft === null}>{c.save}</button>
        {draft === null ? <p className="sx-muted">{c.nothing}</p> : null}
      </form>
      {data.mixes.length === 0 ? (
        <p data-testid="sanctuary-mixes-empty">{c.empty}</p>
      ) : (
        <ul className="sx-rows" data-testid="sanctuary-mixes-list">
          {data.mixes.map((m) => (
            <MixRow key={m.id} mix={m} data={data} playing={nowPlaying?.kind === 'mix' && nowPlaying.id === m.id} onLoad={onLoadMix} />
          ))}
        </ul>
      )}
    </div>
  );
}
