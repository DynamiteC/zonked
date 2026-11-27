import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Mix } from '../../app/mixes';
import type { Clock } from '../../app/player';
import type { AudioEngine } from '../../audio/types';
import { getTemplates } from '../../catalog';
import type { Template } from '../../catalog/types';
import type { Store } from '../../storage/db';
import type { BridgeDeps } from '../bridgeClient';
import { MiniPlayer, TabBar } from './CalmChrome';
import type { View } from './CalmChrome';
import { CALM } from './copy';
import { DEFAULT_PROFILE, clearAll, loadLast, saveLast } from './data';
import type { StorageLike } from './data';
import { EndCard, useEndCard } from './EndCard';
import type { JourneyProgress, Profile } from './data';
import { SafetyNotice } from './SafetyNotice';
import { Screens } from './CalmScreens';
import { useCalmData } from './useCalmData';
import { useCalmSession } from './useCalmSession';
import { useCrewBridge } from './useCrewBridge';
import { useFavorite } from './useFavorite';
import './calm.css';

const Onboarding = lazy(() => import('./Onboarding').then((m) => ({ default: m.Onboarding })));

export interface CalmAppProps {
  readonly engine: AudioEngine;
  readonly clock?: Clock;
  readonly store?: Store;
  readonly bridgeCreate?: BridgeDeps['create'];
  readonly onStudio: () => void;
}

interface ActiveDay {
  readonly id: string;
  readonly no: number;
  readonly needSec: number;
}

/** A journey day is done at 80 percent of its length or 3 minutes, whichever is greater (spec section d). */
export const doneAfterSec = (minutes: number): number => Math.max(180, minutes * 60 * 0.8);

export function CalmApp({ engine, clock, store, bridgeCreate, onStudio }: CalmAppProps): React.JSX.Element {
  const s = useCalmSession(engine, clock, store);
  const data = useCalmData(s.store, s.snap.playing);
  const crew = useCrewBridge(s.player, bridgeCreate);
  const [view, setView] = useState<View>('today');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const active = useRef<ActiveDay | null>(null);
  const fav = useFavorite(s.store, s.snap.templateId);
  const onboarding = data.profile.createdAt === 0;
  const last = useLastPlayed(data.storage);
  const end = useEndCard(s.snap, !onboarding);
  const still = s.reduced || data.profile.extraGentle;

  const go = useCallback((v: View) => setView(v), []);
  const { play, playDay, finish } = usePlayActions({ s, data, last, end, active, setView });
  useJourneyDone(s.snap.playing, s.snap.elapsedSec, active, data.progress, data.setJourney);
  const openJourney = (id: string): void => {
    setJourneyId(id);
    setView('journey');
  };
  const forget = (): void => {
    clearAll(data.storage);
    data.setProfile(DEFAULT_PROFILE);
    setView('today');
  };

  return (
    <div className="c-app" data-theme="auto" data-motion={still ? 'off' : 'on'} data-playing={s.snap.playing ? 'true' : 'false'}>
      <TopBar onStudio={onStudio} />
      <main id="c-main" className="c-main" tabIndex={-1}>
        <Suspense fallback={<p className="c-loading" role="status">{CALM.loading}</p>}>
          {onboarding ? (
            <Onboarding
              playing={s.snap.playing}
              reduced={still}
              initial={data.profile}
              onAccept={s.accept}
              onPreview={(t) => s.playTemplate(t, null)}
              onStop={() => void s.player.stop()}
              onFinish={finish}
            />
          ) : (
            <Screens
              view={view}
              journeyId={journeyId}
              s={s}
              data={data}
              crewInfo={crew}
              still={still}
              fav={fav}
              last={last.template}
              handlers={{ go, play, playDay, openJourney, forget, onStudio, onMix: (m: Mix) => s.guarded(() => s.player.playMix(m)) }}
            />
          )}
        </Suspense>
      </main>
      {!onboarding && view !== 'player' && <MiniPlayer snap={s.snap} onOpen={() => go('player')} onStop={() => void s.player.stop()} />}
      {!onboarding && <TabBar view={view} onGo={go} />}
      <p className="c-sr" role="status" data-testid="play-status">
        {s.snap.playing ? `Playing. ${CALM.volumeCapped}` : 'Stopped.'}
      </p>
      {end.card !== null && !s.snap.playing && <EndCard info={end.card} onAgain={() => replay(end.card?.id ?? null, play)} onClose={end.dismiss} />}
      {s.gate && <SafetyNotice onAccept={s.accept} onCancel={s.cancelGate} />}
    </div>
  );
}

interface PlayDeps {
  readonly s: ReturnType<typeof useCalmSession>;
  readonly data: ReturnType<typeof useCalmData>;
  readonly last: ReturnType<typeof useLastPlayed>;
  readonly end: { readonly dismiss: () => void };
  readonly active: React.MutableRefObject<ActiveDay | null>;
  readonly setView: (v: View) => void;
}

/** Play, play a journey day, and finish onboarding. Every new start goes through the safety gate. */
function usePlayActions({ s, data, last, end, active, setView }: PlayDeps) {
  const play = useCallback(
    (t: Template, minutes: number | null = t.recommendedMinutes) => {
      active.current = null;
      last.remember(t.id);
      end.dismiss();
      s.playTemplate(t, minutes);
      setView('player');
    },
    [s, last, end, active, setView],
  );
  const playDay = (id: string, no: number, t: Template): void => {
    play(t);
    active.current = { id, no, needSec: doneAfterSec(t.recommendedMinutes) };
  };
  const finish = (profile: Profile, t: Template): void => {
    data.setProfile(profile);
    if (!s.snap.playing || s.snap.templateId !== t.id) return play(t);
    // The preview keeps playing into the session: no gap and no second fade-in.
    last.remember(t.id);
    s.player.startTimer({ kind: 'countdown', minutes: t.recommendedMinutes });
    setView('player');
  };
  return { play, playDay, finish };
}

const findTemplate = (id: string | null): Template | null => (id === null ? null : (getTemplates().find((t) => t.id === id) ?? null));

function replay(id: string | null, play: (t: Template) => void): void {
  const t = findTemplate(id);
  if (t !== null) play(t);
}

/** The last template played on this device, for Play again on Today and the end card. */
function useLastPlayed(storage: StorageLike): { readonly template: Template | null; readonly remember: (id: string) => void } {
  const [id, setId] = useState<string | null>(() => loadLast(storage));
  const template = useMemo(() => findTemplate(id), [id]);
  const remember = useCallback(
    (next: string) => {
      saveLast(storage, next);
      setId(next);
    },
    [storage],
  );
  return useMemo(() => ({ template, remember }), [template, remember]);
}

function TopBar({ onStudio }: { readonly onStudio: () => void }): React.JSX.Element {
  return (
    <>
      <a className="c-skip" href="#c-main">
        Skip to content
      </a>
      <header className="c-topbar">
        <span className="c-brand">{CALM.brand}</span>
        <button type="button" className="c-chip-btn" data-testid="studio-top" aria-pressed="false" onClick={onStudio}>
          {CALM.studio}
        </button>
      </header>
    </>
  );
}

function useJourneyDone(
  playing: boolean,
  elapsedSec: number,
  active: React.MutableRefObject<ActiveDay | null>,
  progress: Readonly<Record<string, JourneyProgress>>,
  setJourney: (id: string, p: JourneyProgress | null) => void,
): void {
  useEffect(() => {
    const a = active.current;
    const p = a === null ? undefined : progress[a.id];
    if (!playing || a === null || p === undefined || elapsedSec < a.needSec) return;
    active.current = null;
    if (!p.doneDays.includes(a.no)) setJourney(a.id, { ...p, doneDays: [...p.doneDays, a.no].sort((x, y) => x - y) });
  }, [playing, elapsedSec, active, progress, setJourney]);
}
