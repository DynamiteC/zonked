import { Suspense, lazy, useCallback, useState } from 'react';
import type { AudioEngine } from '../../audio/types';
import type { Clock } from '../../app/player';
import type { Store } from '../../storage/db';
import { CALM } from './copy';
import { Mascot } from './MascotView';
import { readMode, writeMode } from './mode';
import type { UiMode } from './mode';

const CalmApp = lazy(() => import('./CalmApp').then((m) => ({ default: m.CalmApp })));
const StudioApp = lazy(() => import('../../app/App').then((m) => ({ default: m.App })));

/** Inline so Studio needs no Calm css: a 44px exit door back to Calm. In flow at the page end, never fixed: a fixed button covered Studio controls (found in e2e). */
const BACK_STYLE: React.CSSProperties = {
  display: 'block',
  margin: '16px auto',
  minHeight: 44,
  minWidth: 44,
  padding: '0 16px',
  font: 'inherit',
  cursor: 'pointer',
};

/** Studio keeps its sharp look but shares the Calm mascot and the system body font. */
const BAR_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 16px',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  fontWeight: 700,
};

export interface ModeRootProps {
  engine: AudioEngine;
  clock?: Clock;
  store?: Store;
  /** Test seam: starting mode. Defaults to the stored choice. */
  initialMode?: UiMode;
}

/** Picks Calm or Studio. Only one is mounted, so only one Player talks to the engine. */
export function ModeRoot({ engine, clock, store, initialMode }: ModeRootProps): React.JSX.Element {
  const [mode, setMode] = useState<UiMode>(() => initialMode ?? readMode());
  const choose = useCallback((m: UiMode) => {
    writeMode(m);
    setMode(m);
  }, []);
  const loading = (
    <p className="c-loading" role="status">
      {CALM.loading}
    </p>
  );
  const extra = { ...(clock !== undefined ? { clock } : {}), ...(store !== undefined ? { store } : {}) };
  return (
    <Suspense fallback={loading}>
      {mode === 'calm' ? (
        <CalmApp engine={engine} {...extra} onStudio={() => choose('studio')} />
      ) : (
        <>
          <div style={BAR_STYLE} data-testid="studio-bar">
            <Mascot size={40} reduced />
            <span>{`${CALM.brand} Studio`}</span>
          </div>
          <StudioApp engine={engine} {...extra} />
          <button type="button" style={BACK_STYLE} data-testid="back-to-calm" onClick={() => choose('calm')}>
            {CALM.backToCalm}
          </button>
        </>
      )}
    </Suspense>
  );
}
