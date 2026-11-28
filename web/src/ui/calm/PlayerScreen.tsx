import type { Device, Goal } from './data';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { Player, PlayerSnapshot } from '../../app/player';
import type { AudioEngine } from '../../audio/types';
import { getTemplates } from '../../catalog';
import { SOUND_MENU } from '../../catalog/soundMenu';
import { CALM } from './copy';
import { OptionsSheet } from './OptionsSheet';
import { BreathLive, counterText, useBreathCounter } from './BreathLive';
import { useBreath } from './mascot/useBreath';
import { TimeLeft } from './TimerChips';
import type { Nature } from './nature/useNature';
import { sceneFor, useLevel } from './playerScene';
import type { Sprint } from './useSprint';
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
  readonly device?: Device;
  readonly goal?: Goal;
  readonly theme: 'light' | 'dark';
  readonly announce?: boolean;
  readonly sprint?: Sprint;
  /** Opens the Options sheet at once with Advanced expanded. Used by the Studio switch and shortcut. */
  readonly openAdvanced?: boolean;
  readonly onAdvancedShown?: () => void;
}

export function PlayerScreen({ engine, device, goal, theme, announce = true, sprint, openAdvanced = false, onAdvancedShown, player, snap, still, favorite, onToggle, onFavorite, nature }: Props): React.JSX.Element {
  const [open, setOpen] = useState(openAdvanced);
  const [adv, setAdv] = useState(openAdvanced);
  useEffect(() => {
    if (!openAdvanced) return;
    setOpen(true);
    setAdv(true);
    onAdvancedShown?.();
  }, [openAdvanced, onAdvancedShown]);
  const opener = useRef<HTMLButtonElement>(null);
  const close = (): void => {
    setOpen(false);
    setAdv(false);
    opener.current?.focus();
  };
  const level = useLevel(engine, snap.playing);
  const sound = SOUND_MENU.find((s) => s.templateId === snap.templateId);
  const evidence = sound?.evidence ?? 'mixed';
  // The scene follows the focus sound for the whole sprint, so the switch to the break changes nothing on screen.
  const situation = sceneFor(sprint?.focus?.id ?? snap.templateId, nature.on !== null);
  const current = getTemplates().find((t) => t.id === (sprint?.focus?.id ?? snap.templateId));
  return (
    <div className="c-player">
      <h1 className="c-h1">{snap.templateName ?? CALM.brand}</h1>
      <Stage still={still} playing={snap.playing} situation={situation} theme={theme} level={level} announce={announce} />
      <TimeLeft timer={snap.timer} />
      <div className="c-controls">
        <button type="button" className="c-btn c-primary c-big c-round" data-testid="player-toggle" onClick={onToggle}>
          {snap.playing ? CALM.stop : CALM.play}
        </button>
      </div>
      <button ref={opener} type="button" className="c-btn c-ghost c-options-btn" data-testid="player-options" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {CALM.optionsBtn}
      </button>
      {open && (
        <OptionsSheet
          player={player}
          snap={snap}
          nature={nature}
          favorite={favorite}
          evidence={evidence}
          onFavorite={onFavorite}
          onClose={close}
          engine={engine}
          {...(device !== undefined ? { device } : {})}
          {...(goal !== undefined ? { goal } : {})}
          advancedOpen={adv}
          {...(sprint !== undefined && current !== undefined ? { sprint: { onSprint: () => sprint.start(current), onSprintEnd: sprint.cancel } } : {})}
        />
      )}
    </div>
  );
}
