import { Suspense, lazy, useState } from 'react';
import type { Player, PlayerSnapshot } from '../../app/player';
import type { AudioEngine } from '../../audio/types';
import { SOUND_MENU } from '../../catalog/soundMenu';
import { CALM, EVIDENCE } from './copy';
import { BreathLive, counterText, useBreathCounter } from './BreathLive';
import { useBreath } from './mascot/useBreath';
import { TimerChips } from './TimerChips';
import { NatureControls } from './nature/NatureScreen';
import { loadPrefs } from './nature/prefs';
import type { Nature } from './nature/useNature';
import { sceneFor, useLevel } from './playerScene';
import type { SceneSituation } from './visuals';

const CalmMascot = lazy(() => import('./mascot').then((m) => ({ default: m.CalmMascot })));
const SceneLoop = lazy(() => import('./visuals').then((m) => ({ default: m.SceneLoop })));
const BreathCue = lazy(() => import('./mascot').then((m) => ({ default: m.BreathCue })));

interface StageProps {
  readonly still: boolean;
  readonly playing: boolean;
  readonly situation: SceneSituation;
  readonly theme: 'light' | 'dark';
  readonly level: number;
  /** Speak the phase to screen readers. On by default. */
  readonly announce?: boolean;
}

/** Scene behind the mascot. Breath is 4 s in and 4 s out. Reduced motion shows still frames. */
export function Stage({ still, playing, situation, theme, level, announce = true }: StageProps): React.JSX.Element {
  const breath = useBreath(playing && !still);
  const counter = useBreathCounter(playing && still);
  const moving = playing && !still;
  return (
    <>
      <div className="c-stage" data-testid="breath-ring" data-still={still ? 'true' : 'false'} data-situation={situation}>
        <Suspense fallback={null}>
          <div className="c-stage-scene">
            <SceneLoop situation={situation} reducedMotion={still} theme={theme} />
          </div>
          <div className="c-stage-mascot">
            <CalmMascot
              mood={playing ? 'breathing' : 'idle'}
              size={190}
              reducedMotion={still}
              situation={situation}
              breathPhase={moving ? breath.phase : undefined}
              level={playing ? level : 0}
            />
          </div>
        </Suspense>
      </div>
      <div className="c-cue">
        {moving ? (
          <Suspense fallback={null}>
            <BreathCue label={breath.label} className="c-cue-text" live={false} />
          </Suspense>
        ) : playing ? (
          <p className="c-cue-text" data-testid="breath-counter">{counterText(counter)}</p>
        ) : (
          <p className="c-cue-text">{CALM.breathe}</p>
        )}
        <BreathLive label={moving ? breath.label : counter.label} on={playing} announce={announce} />
      </div>
    </>
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
  readonly engine: AudioEngine;
  readonly theme: 'light' | 'dark';
  readonly announce?: boolean;
}

export function PlayerScreen({ engine, theme, announce = true, player, snap, still, favorite, onToggle, onFavorite, nature }: Props): React.JSX.Element {
  const [why, setWhy] = useState(false);
  const level = useLevel(engine, snap.playing);
  const sound = SOUND_MENU.find((s) => s.templateId === snap.templateId);
  const evidence = sound?.evidence ?? 'mixed';
  const situation = sceneFor(snap.templateId, nature.on !== null);
  return (
    <div className="c-player">
      <h1 className="c-h1">{snap.templateName ?? CALM.brand}</h1>
      <Stage still={still} playing={snap.playing} situation={situation} theme={theme} level={level} announce={announce} />
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
