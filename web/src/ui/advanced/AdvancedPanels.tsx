import { useEffect, useMemo, useState } from 'react';
import { Player, realClock } from '../../app/player';
import type { AudioEngine } from '../../audio/types';
import { PRESETS } from '../../sbg';
import { SAFETY_KEY, readFlag } from '../../storage/prefs';
import { createStore } from '../../storage/db';
import type { Store } from '../../storage/db';
import { DataPanel } from '../sanctuary/DataPanel';
import { MixesPanel } from '../sanctuary/MixesPanel';
import { useSanctuaryData } from '../sanctuary/useSanctuaryData';
import '../sanctuary/sanctuary.css';
import { CalmAlertPanel } from './CalmAlertPanel';
import { EditorPanel } from './EditorPanel';
import { ImportExportPanel } from './ImportExportPanel';
import { MixPanel } from './MixPanel';
import { HealthPanel } from './HealthPanel';
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
  /** Where favorites, mixes and history live. Defaults to the app database. */
  store?: Store;
}

const SECTIONS = ['Mix', 'Calm to Alert', 'Editor', 'Import and export', 'Timers', 'Scope', 'Sound health', 'Saved mixes', 'Your data'] as const;

/**
 * The pro options as plain panels: Mix, Calm to Alert, Editor, Import and export, Timers, Scope.
 * Each sits in a closed-by-default disclosure except Mix. No page chrome. Styled with the Calm tokens only.
 * Load with React.lazy so it stays out of first load.
 */
export function AdvancedPanels({ engine, player: given, onClose, store: givenStore }: AdvancedPanelsProps): React.JSX.Element {
  const own = useMemo(() => given ?? new Player(engine, realClock, () => undefined), [given, engine]);
  useEffect(() => {
    if (given !== undefined) return undefined;
    return () => void own.stop();
  }, [given, own]);
  const snap = usePlayerSnapshot(own);
  const store = useMemo(() => givenStore ?? createStore(), [givenStore]);
  const data = useSanctuaryData(store, Date.now);
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
    'Sound health': <HealthPanel />,
    'Saved mixes': (
      <div className="adv-panel sx-root" data-testid="adv-mixes">
        {data.ready ? (
          <MixesPanel
            data={data}
            nowPlaying={snap.templateId !== null ? { kind: 'template', id: snap.templateId } : null}
            currentMix={() => own.getMixDraft()}
            onLoadMix={(m) => readFlag(SAFETY_KEY) && own.playMix(m)}
          />
        ) : null}
      </div>
    ),
    'Your data': (
      <div className="adv-panel sx-root" data-testid="adv-data">
        {data.ready ? <DataPanel data={data} now={Date.now} /> : null}
      </div>
    ),
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
