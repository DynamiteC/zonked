import type { PlayerSnapshot } from '../../app/player';
import { formatClock } from '../recContext';
import { CALM } from './copy';

export type View = 'today' | 'journeys' | 'journey' | 'library' | 'player' | 'crew' | 'settings';

const TABS: readonly { readonly view: View; readonly label: string }[] = [
  { view: 'today', label: CALM.nav[0] },
  { view: 'journeys', label: CALM.nav[1] },
  { view: 'library', label: CALM.nav[2] },
  { view: 'crew', label: CALM.nav[3] },
  { view: 'settings', label: CALM.nav[4] },
];

export function TabBar({ view, onGo }: { readonly view: View; readonly onGo: (v: View) => void }): React.JSX.Element {
  const current: View = view === 'journey' ? 'journeys' : view;
  return (
    <nav className="c-tabbar" aria-label="Main">
      {TABS.map((t) => (
        <button key={t.view} type="button" className="c-nav" aria-current={current === t.view ? 'page' : undefined} onClick={() => onGo(t.view)}>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

interface MiniProps {
  readonly snap: PlayerSnapshot;
  readonly onOpen: () => void;
  readonly onStop: () => void;
}

/** Visible on every tab while a session runs. Stop is one tap. */
export function MiniPlayer({ snap, onOpen, onStop }: MiniProps): React.JSX.Element | null {
  if (!snap.playing) return null;
  const left = snap.timer.kind !== 'none' && snap.timer.running ? ` ${formatClock(snap.timer.remainingSec)}` : '';
  return (
    <div className="c-mini" role="group" aria-label="Now playing">
      <button type="button" className="c-btn c-link c-mini-open" onClick={onOpen}>
        {`${snap.templateName ?? CALM.brand}${left}`}
      </button>
      <button type="button" className="c-btn c-small" data-testid="mini-stop" onClick={onStop}>
        {CALM.stop}
      </button>
    </div>
  );
}
