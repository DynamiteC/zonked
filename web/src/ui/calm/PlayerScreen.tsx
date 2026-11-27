import { Suspense, lazy, useEffect, useState } from 'react';
import { breathTimings } from '../../app/neuro';
import type { Player, PlayerSnapshot } from '../../app/player';
import { SOUND_MENU } from '../../catalog/soundMenu';
import { CALM, EVIDENCE } from './copy';
import { TimerChips } from './TimerChips';
import { NatureControls } from './nature/NatureScreen';
import { loadPrefs } from './nature/prefs';
import type { Nature } from './nature/useNature';

const CalmMascot = lazy(() => import('./mascot').then((m) => ({ default: m.CalmMascot })));

interface RingProps {
  readonly still: boolean;
  readonly playing: boolean;
}

/** Ring grows on the in-breath and shrinks on the out-breath. Static when motion is reduced or gentle. */
export function BreathRing({ still, playing }: RingProps): React.JSX.Element {
  const { inSec, outSec } = breathTimings();
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const dur = phase === 'in' ? inSec : outSec;
  useEffect(() => {
    if (still || !playing) return undefined;
    const id = window.setTimeout(() => setPhase((p) => (p === 'in' ? 'out' : 'in')), Math.max(1, dur) * 1000);
    return () => window.clearTimeout(id);
  }, [phase, dur, still, playing]);
  const scale = still || !playing ? 0.9 : phase === 'in' ? 1 : 0.78;
  return (
    <div className="c-stage" data-testid="breath-ring" data-still={still ? 'true' : 'false'}>
      <span className="c-ring" style={{ transform: `scale(${scale})`, transition: still ? 'none' : `transform ${dur}s ease-in-out` }} aria-hidden="true" />
      <Suspense fallback={null}>
        <CalmMascot mood={playing ? 'breathing' : 'idle'} size={120} reducedMotion={still} />
      </Suspense>
    </div>
  );
}

interface Props {
  readonly player: Player;
  readonly snap: PlayerSnapshot;
  readonly still: boolean;
  readonly favorite: boolean;
  readonly onToggle: () => void;
  readonly onFavorite: () => void;
  readonly nature: Nature;
}

export function PlayerScreen({ player, snap, still, favorite, onToggle, onFavorite, nature }: Props): React.JSX.Element {
  const [why, setWhy] = useState(false);
  const sound = SOUND_MENU.find((s) => s.templateId === snap.templateId);
  const evidence = sound?.evidence ?? 'mixed';
  return (
    <div className="c-player">
      <h1 className="c-h1">{snap.templateName ?? CALM.brand}</h1>
      <BreathRing still={still} playing={snap.playing} />
      {still && <p className="c-muted">{CALM.breathe}</p>}
      <div className="c-controls">
        <button type="button" className="c-btn c-round c-big" data-testid="player-toggle" onClick={onToggle}>
          {snap.playing ? CALM.stop : CALM.play}
        </button>
        <button type="button" className="c-btn c-round" aria-pressed={favorite} onClick={onFavorite}>
          {favorite ? CALM.saved : CALM.favorite}
        </button>
      </div>
      <TimerChips timer={snap.timer} player={player} />
      <NatureQuick nature={nature} />
      <p className="c-muted">{CALM.volumeCapped}</p>
      <section className="c-why">
        <button type="button" className="c-btn c-link" aria-expanded={why} aria-controls="c-why-box" onClick={() => setWhy((v) => !v)}>
          {CALM.whyTitle}
        </button>
        <div id="c-why-box" hidden={!why}>
          <p>{CALM.whyBody}</p>
          <p>{`Evidence: ${evidence}. ${EVIDENCE[evidence] ?? ''}`}</p>
        </div>
      </section>
    </div>
  );
}

/** One tap adds the remembered nature sound (rain at first). Blend and level show once it is on. */
function NatureQuick({ nature }: { readonly nature: Nature }): React.JSX.Element {
  const remembered = nature.prefs.id ?? loadPrefs().id ?? 'rain';
  return (
    <section className="c-card c-nature-quick" aria-label={CALM.natureHead}>
      <button type="button" className="c-btn" data-testid="player-nature" aria-pressed={nature.on !== null} onClick={() => (nature.on === null ? nature.start(remembered) : nature.stop())}>
        {nature.on === null ? `${CALM.natureAdd}: ${remembered.startsWith('own:') ? CALM.mineTitle : remembered}` : CALM.natureOff}
      </button>
      {nature.on !== null && <NatureControls nature={nature} />}
      <p className="c-status" role="status">{nature.message}</p>
    </section>
  );
}
