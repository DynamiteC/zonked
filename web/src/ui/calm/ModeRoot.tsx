import { Suspense, lazy } from 'react';
import type { AudioEngine } from '../../audio/types';
import type { Clock } from '../../app/player';
import type { Store } from '../../storage/db';
import { CALM } from './copy';

const CalmApp = lazy(() => import('./CalmApp').then((m) => ({ default: m.CalmApp })));

export interface ModeRootProps {
  engine: AudioEngine;
  clock?: Clock;
  store?: Store;
}

/** The one front door. Calm is the only shell; pro controls live in Options, Advanced. */
export function ModeRoot({ engine, clock, store }: ModeRootProps): React.JSX.Element {
  const extra = { ...(clock !== undefined ? { clock } : {}), ...(store !== undefined ? { store } : {}) };
  return (
    <Suspense
      fallback={
        <p className="c-loading" role="status">
          {CALM.loading}
        </p>
      }
    >
      <CalmApp engine={engine} {...extra} onStudio={() => undefined} />
    </Suspense>
  );
}
