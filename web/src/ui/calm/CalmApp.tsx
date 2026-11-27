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
import type { EndInfo } from './EndCard';
import type { JourneyProgress, Profile } from './data';
import { SafetyNotice } from './SafetyNotice';
import { Screens } from './CalmScreens';
import { useLook } from './look';
import { useNature } from './nature/useNature';
import { forgetNature } from './nature/forget';
import { toDayNumber } from './data';
import { today, useCalmData } from './useCalmData';
import { useCalmSession } from './useCalmSession';
import { useCrewBridge } from './useCrewBridge';
import { useFeel } from './useFeel';
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
  const nature = useNature(s);
  const [view, setView] = useState<View>('today');
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const active = useRef<ActiveDay | null>(null);
  const fav = useFavorite(s.store, s.snap.templateId);
  const feel = useFeel(data.storage);
  const onboarding = data.profile.createdAt === 0;
  const last = useLastPlayed(data.storage);
  const end = useEndCard(s.snap, !onboarding && view !== 'reset');
  const still = s.reduced || data.profile.extraGentle;
  const { look, prefs, dim, setPrefs } = useLook();

  useStudioShortcut(onStudio);
  const go = useCallback((v: View) => setView(v), []);
  const { play, playDay, finish } = usePlayActions({ s, data, last, end, active, setView });
  useJourneyDone(s.snap.playing, s.snap.elapsedSec, active, data.progress, data.setJourney);
  const openJourney = (id: string): void => {
    setJourneyId(id);
    setView('journey');
  };
  const forget = (): void => {
    clearAll(data.storage);
    feel.clear();
    nature.stop();
    void forgetNature();
    data.setProfile(DEFAULT_PROFILE);
    setView('today');
  };

  return (
    <div className="c-app" data-theme={look.theme} data-contrast={look.highContrast ? 'high' : 'normal'} data-view={view} data-dim={dim ? 'true' : 'false'} data-motion={still ? 'off' : 'on'} data-playing={s.snap.playing ? 'true' : 'false'}>
      <TopBar />
      {crew.view.source === 'demo' && <p className="c-badge-sim" role="status" data-testid="demo-badge">{CALM.crewDemoBadge}</p>}
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
              nature={nature}
              still={still}
              fav={fav}
              last={last.template}
              look={look}
              prefs={prefs}
              onPrefs={setPrefs}
              feel={feel.entries}
              handlers={{ go, play, playDay, openJourney, forget, onStudio, onMix: (m: Mix) => s.guarded(() => s.player.playMix(m)) }}
            />
          )}
        </Suspense>
      </main>
      {!onboarding && view !== 'player' && view !== 'reset' && <MiniPlayer snap={s.snap} crewPresetId={crew.view.state?.target.presetId ?? null} onOpen={() => go('player')} onStop={() => void s.player.stop()} />}
      {!onboarding && <TabBar view={view} onGo={go} reduced={still} />}
      <p className="c-sr" role="status" data-testid="play-status">
        {s.snap.playing ? `Playing. ${CALM.volumeCapped}` : 'Stopped.'}
      </p>
      {end.card !== null && !s.snap.playing && <EndCardHost card={end.card} play={play} dismiss={end.dismiss} feel={feel} firstRun={toDayNumber(data.profile.createdAt) === today()} />}
      {s.gate && <SafetyNotice onAccept={s.accept} onCancel={s.cancelGate} />}
    </div>
  );
}

interface HostProps {
  readonly card: EndInfo;
  readonly play: (t: Template) => void;
  readonly dismiss: () => void;
  readonly feel: ReturnType<typeof useFeel>;
  readonly firstRun: boolean;
}

function EndCardHost({ card, play, dismiss, feel, firstRun }: HostProps): React.JSX.Element {
  return <EndCard info={card} onAgain={() => replay(card.id, play)} onClose={dismiss} firstRun={firstRun} onFeel={(a) => feel.answer(card.id, a)} />;
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

/** Alt+Shift+S opens Studio mode. A modifier is required so a single key never fires it. */
function useStudioShortcut(onStudio: () => void): void {
  useEffect(() => {
    const on = (e: KeyboardEvent): void => {
      if (e.altKey && e.shiftKey && e.code === 'KeyS') {
        e.preventDefault();
        onStudio();
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [onStudio]);
}

function TopBar(): React.JSX.Element {
  return (
    <>
      <a className="c-skip" href="#c-main">
        Skip to content
      </a>
      <header className="c-topbar">
        <span className="c-brand">{CALM.brand}</span>
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
