import type { PlayerSnapshot } from '../../app/player';
import { PRESETS } from '../../sbg';
import { formatClock } from '../recContext';
import { CALM } from './copy';
import { Icon } from './icons';
import { Mascot } from './MascotView';

export type View = 'today' | 'journeys' | 'journey' | 'library' | 'player' | 'crew' | 'settings' | 'nature' | 'reset';

const TABS: readonly { readonly view: View; readonly label: string; readonly icon: string }[] = [
  { view: 'today', label: CALM.nav[0], icon: 'today' },
  { view: 'library', label: CALM.nav[1], icon: 'library' },
  { view: 'crew', label: CALM.nav[2], icon: 'crew' },
  { view: 'settings', label: CALM.nav[3], icon: 'settings' },
];

interface TabProps {
  readonly view: View;
  readonly onGo: (v: View) => void;
  readonly reduced?: boolean;
}

export function TabBar({ view, onGo, reduced = false }: TabProps): React.JSX.Element {
  const current: View = view === 'journey' || view === 'journeys' ? 'today' : view === 'nature' ? 'library' : view === 'reset' ? 'today' : view;
  return (
    <nav className="c-tabbar" aria-label="Main">
      <div className="c-rail-brand" aria-hidden="true">
        <Mascot size={40} reduced={reduced} />
        <span className="c-brand">{CALM.brand}</span>
      </div>
      {TABS.map((t) => (
        <button key={t.view} type="button" className="c-nav" aria-current={current === t.view ? 'page' : undefined} onClick={() => onGo(t.view)}>
          <Icon name={t.icon} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/** The name a person would call this session: the template, or the preset the Crew chose, or the preset picked in Studio. */
export function sessionName(snap: PlayerSnapshot, crewPresetId: string | null = null): string {
  if (snap.templateName !== null) return snap.templateName;
  const crew = snap.source === 'crew';
  const id = crew ? (crewPresetId ?? snap.presetId) : snap.presetId;
  const name = PRESETS.find((p) => p.id === id)?.name;
  return name === undefined ? CALM.brand : crew ? `Crew: ${name}` : name;
}

interface MiniProps {
  readonly crewPresetId?: string | null;
  readonly snap: PlayerSnapshot;
  readonly onOpen: () => void;
  readonly onStop: () => void;
}

/** Visible on every tab while a session runs. Stop is one tap. On desktop it docks to the rail bottom. */
export function MiniPlayer({ snap, crewPresetId = null, onOpen, onStop }: MiniProps): React.JSX.Element | null {
  if (!snap.playing) return null;
  const left = snap.timer.kind !== 'none' && snap.timer.running ? formatClock(snap.timer.remainingSec) : '';
  return (
    <div className="c-mini" role="group" aria-label="Now playing">
      <button type="button" className="c-btn c-link c-mini-open" onClick={onOpen}>
        {sessionName(snap, crewPresetId)}
        {left !== '' && <span className="c-digits">{` ${left}`}</span>}
      </button>
      <button type="button" className="c-btn c-small" data-testid="mini-stop" onClick={onStop}>
        {CALM.stop}
      </button>
    </div>
  );
}
