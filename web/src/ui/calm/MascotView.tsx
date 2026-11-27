import { Suspense, lazy } from 'react';
import type { MascotMood } from './mascot';

const CalmMascot = lazy(() => import('./mascot').then((m) => ({ default: m.CalmMascot })));

/** One size scale for the whole app: 120 hero, 72 inline, 40 rail. */
export type MascotSize = 120 | 72 | 40;

interface Props {
  readonly size: MascotSize;
  readonly mood?: MascotMood;
  readonly reduced: boolean;
}

export function Mascot({ size, mood = 'idle', reduced }: Props): React.JSX.Element {
  return (
    <Suspense fallback={<span className="c-mascot-gap" style={{ width: size, height: size }} />}>
      <CalmMascot mood={mood} size={size} reducedMotion={reduced} />
    </Suspense>
  );
}

/** Header for a screen: the 72 px mascot next to the page title. */
export function PageHead({ title, reduced }: { readonly title: string; readonly reduced: boolean }): React.JSX.Element {
  return (
    <header className="c-pagehead">
      <Mascot size={72} reduced={reduced} />
      <h1 className="c-h1">{title}</h1>
    </header>
  );
}
