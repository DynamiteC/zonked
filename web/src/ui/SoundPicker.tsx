import { useState } from 'react';
import { COPY } from './copy';

export type CardId = (typeof COPY.cards)[number][0];
export type PlayableId = 'lofi' | 'piano' | 'violet' | 'rain' | 'deep' | 'chimes' | 'beats';

interface Props {
  /** Template id now playing (starter-<id>) or null. */
  templateId: string | null;
  playing: boolean;
  reduced: boolean;
  onPlay: (id: PlayableId) => void;
  /** Best match from the starter: highlights one card with a one-line reason. */
  suggest?: { id: string; reason: string } | null;
}

const BARS = [0, 1, 2, 3, 4, 5, 6] as const;

/** Small live picture of a sound. It moves only for the sound that is playing, and never under reduced motion. */
export function MiniVisual({ kind, live }: { kind: string; live: boolean }): React.JSX.Element {
  return (
    <span className={`mini mini-${kind}`} data-live={live ? 'true' : 'false'} data-testid="sound-mini-visual" aria-hidden="true">
      {BARS.map((i) => (
        <i key={i} style={{ '--i': i } as React.CSSProperties} />
      ))}
    </span>
  );
}

export function SoundPicker({ templateId, playing, reduced, onPlay, suggest = null }: Props): React.JSX.Element {
  const [rain, setRain] = useState<'rain' | 'deep'>('rain');
  const sid = suggest?.id === 'deep' ? 'rain' : suggest?.id;
  const activeId = templateId?.startsWith('starter-') ? templateId.slice(8) : null;
  return (
    <section className="picker" aria-labelledby="picker-title" data-testid="sound-picker">
      <h2 id="picker-title" className="picker-title">
        {COPY.picker.title}
      </h2>
      <p className="meta">{COPY.picker.intro}</p>
      <ul className="cards">
        {COPY.cards.map(([cardId, name, blurb, kind]) => {
          const id: PlayableId = cardId === 'rain' ? rain : (cardId as PlayableId);
          const active = activeId === id;
          const live = active && playing && !reduced;
          return (
            <li key={cardId} className="card" data-suggested={sid === cardId ? 'true' : 'false'} data-active={active ? 'true' : 'false'} data-testid={`sound-card-${cardId}`}>
              <MiniVisual kind={cardId === 'rain' && rain === 'deep' ? 'deep' : kind} live={live} />
              <h3 className="card-name">{name}</h3>
              <p className="card-blurb">{blurb}</p>
              {suggest !== null && sid === cardId && (
                <p className="card-reason" data-testid="sound-suggested">
                  {COPY.picker.suggested}: {suggest.reason}
                </p>
              )}
              {cardId === 'violet' && (
                <p className="card-note" data-testid="violet-note">
                  {COPY.picker.violetNote}
                </p>
              )}
              {cardId === 'rain' && (
                <div className="card-switch" role="group" aria-label={COPY.picker.rainSwitchLabel}>
                  <button type="button" className="chip" aria-pressed={rain === 'rain'} data-testid="sound-switch-rain" onClick={() => setRain('rain')}>
                    {COPY.picker.rain}
                  </button>
                  <button type="button" className="chip" aria-pressed={rain === 'deep'} data-testid="sound-switch-deep" onClick={() => setRain('deep')}>
                    {COPY.picker.deep}
                  </button>
                </div>
              )}
              <div className="card-foot">
                <button type="button" className="btn btn-primary" data-testid="sound-card-play" aria-label={`${COPY.picker.play}: ${name}`} onClick={() => onPlay(id)}>
                  {active && playing ? COPY.picker.now : COPY.picker.play}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
