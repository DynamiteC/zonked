import { useEffect, useMemo, useState } from 'react';
import { Player, realClock } from '../../app/player';
import type { AudioEngine } from '../../audio/types';
import { PRESETS } from '../../sbg';
import { CalmAlertPanel } from './CalmAlertPanel';
import { EditorPanel } from './EditorPanel';
import { ImportExportPanel } from './ImportExportPanel';
import { MixPanel } from './MixPanel';
import { ScopePanel } from './ScopePanel';
import { TimersPanel } from './TimersPanel';
import { usePlayerSnapshot } from './usePlayerSnapshot';
import './advanced.css';

export interface AdvancedPanelsProps {
  /** The real audio engine. Used for the live scope, and to build a Player when none is given. */
  engine: AudioEngine;
  /**
   * The Player that already drives the sound. Pass the host's Player so the panels change what is playing.
   * When omitted, the panels build their own Player on the engine (stand-alone use and tests).
   */
  player?: Player;
  /** Called by the Close button. When omitted no Close button is drawn. */
  onClose?: () => void;
}

const SECTIONS = ['Mix', 'Calm to Alert', 'Editor', 'Import and export', 'Timers', 'Scope'] as const;

/**
 * The pro options as plain panels: Mix, Calm to Alert, Editor, Import and export, Timers, Scope.
 * Each sits in a closed-by-default disclosure except Mix. No page chrome. Styled with the Calm tokens only.
 * Load with React.lazy so it stays out of first load.
 */
export function AdvancedPanels({ engine, player: given, onClose }: AdvancedPanelsProps): React.JSX.Element {
  const own = useMemo(() => given ?? new Player(engine, realClock, () => undefined), [given, engine]);
  useEffect(() => {
    if (given !== undefined) return undefined;
    return () => void own.stop();
  }, [given, own]);
  const snap = usePlayerSnapshot(own);
  const [text, setText] = useState(PRESETS[0]?.sbg ?? '');
  const [name, setName] = useState('script');
  const panels: Readonly<Record<(typeof SECTIONS)[number], React.JSX.Element>> = {
    Mix: <MixPanel snap={snap} player={own} />,
    'Calm to Alert': <CalmAlertPanel snap={snap} player={own} />,
    Editor: <EditorPanel text={text} onText={setText} onPlay={(t) => void own.playCustom(t)} />,
    'Import and export': (
      <ImportExportPanel
        text={text}
        name={name}
        onImport={(t, n) => {
          setText(t);
          setName(n);
        }}
      />
    ),
    Timers: <TimersPanel timer={snap.timer} player={own} />,
    Scope: <ScopePanel telemetry={engine.telemetry} />,
  };
  return (
    <div className="adv-panels" data-testid="advanced-panels">
      {SECTIONS.map((s, i) => (
        <details key={s} className="adv-section" open={i === 0} data-testid={`adv-section-${s.toLowerCase().replace(/ /g, '-')}`}>
          <summary>{s}</summary>
          {panels[s]}
        </details>
      ))}
      {onClose !== undefined && (
        <button type="button" className="adv-btn" data-testid="adv-close" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
}
