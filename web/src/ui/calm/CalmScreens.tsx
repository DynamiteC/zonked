import { lazy } from 'react';
import type { Mix } from '../../app/mixes';
import type { Template } from '../../catalog/types';
import type { View } from './CalmChrome';
import type { FeelEntry, Goal } from './data';
import type { CalmData } from './useCalmData';
import { today } from './useCalmData';
import { toDayNumber } from './data';
import { sessionMinutes } from '../../app/milestones';
import type { CalmSession } from './useCalmSession';
import type { CrewInfo } from './useCrewBridge';
import { resumeCrew, snoozeCrew } from '../../app/crewFeed';
import { startDemo, stopDemo } from '../../app/demoFeed';
import type { Look, Prefs } from './look';
import type { Nature } from './nature/useNature';
import { Today } from './Today';
import type { Sprint } from './useSprint';
import { BREATHE_PLAN, ResetScreen } from './ResetScreen';

const JourneyList = lazy(() => import('./Journeys').then((m) => ({ default: m.JourneyList })));
const JourneyDetail = lazy(() => import('./Journeys').then((m) => ({ default: m.JourneyDetail })));
const Library = lazy(() => import('./Library').then((m) => ({ default: m.Library })));
const PlayerScreen = lazy(() => import('./PlayerScreen').then((m) => ({ default: m.PlayerScreen })));
const CrewScreen = lazy(() => import('./CrewScreen').then((m) => ({ default: m.CrewScreen })));
const NatureScreen = lazy(() => import('./nature/NatureScreen').then((m) => ({ default: m.NatureScreen })));
const SettingsScreen = lazy(() => import('./SettingsScreen').then((m) => ({ default: m.SettingsScreen })));

export interface Handlers {
  readonly go: (v: View) => void;
  readonly play: (t: Template, minutes?: number | null, goal?: Goal) => void;
  readonly playDay: (id: string, no: number, t: Template) => void;
  readonly openJourney: (id: string) => void;
  readonly forget: () => void;
  readonly onStudio: () => void;
  readonly onMix: (m: Mix) => void;
  readonly openGuide: () => void;
  readonly advancedPending: boolean;
  readonly advancedShown: () => void;
}

interface Props {
  readonly view: View;
  readonly journeyId: string | null;
  readonly s: CalmSession;
  readonly data: CalmData;
  readonly crewInfo: CrewInfo;
  readonly nature: Nature;
  readonly still: boolean;
  readonly fav: { readonly on: boolean; readonly toggle: () => void };
  readonly last: Template | null;
  readonly look: Look;
  readonly prefs: Prefs;
  readonly onPrefs: (p: Prefs) => void;
  readonly feel: readonly FeelEntry[];
  readonly sprint: Sprint;
  readonly handlers: Handlers;
}

/** Picks the screen for the current view. Only Today is in the first chunk. */
export function Screens({ view, journeyId, s, data, crewInfo, nature, still, fav, last, look, prefs, onPrefs, feel, sprint, handlers: h }: Props): React.JSX.Element {
  switch (view) {
    case 'journeys':
      return <JourneyList progress={data.progress} onOpen={h.openJourney} reduced={still} />;
    case 'journey':
      return (
        <JourneyDetail
          id={journeyId ?? ''}
          profile={data.profile}
          progress={data.progress}
          todayDay={today()}
          onBack={() => h.go('journeys')}
          onStartJourney={data.setJourney}
          onRestart={(id) => data.setJourney(id, null)}
          onPlayDay={h.playDay}
        />
      );
    case 'library':
      return <Library store={s.store} logs={data.logs} reduced={still} onNature={() => h.go('nature')} onPlay={h.play} onPlayMix={h.onMix} onBreathe={() => h.go('breathe')} />;
    case 'nature':
      return <NatureScreen nature={nature} device={data.profile.device} reduced={still} onBack={() => h.go('library')} />;
    case 'player':
      return <PlayerScreen player={s.player} snap={s.snap} still={still} favorite={fav.on} onToggle={s.toggle} onFavorite={fav.toggle} nature={nature} engine={s.engine} device={data.profile.device} goal={data.profile.goal} theme={look.theme} announce={prefs.announce} sprint={sprint} openAdvanced={h.advancedPending} onAdvancedShown={h.advancedShown} />;
    case 'reset':
      return <ResetScreen s={s} still={still} theme={look.theme} announce={prefs.announce} onBack={() => h.go('today')} />;
    case 'breathe':
      return <ResetScreen s={s} still={still} theme={look.theme} announce={prefs.announce} onBack={() => h.go('today')} plan={BREATHE_PLAN} />;
    case 'crew':
      return (
        <CrewScreen
          crew={crewInfo}
          overridden={s.snap.overridden}
          onDemo={() => s.guarded(() => startDemo(s.player))}
          onStopDemo={() => stopDemo(s.player)}
          onNotNow={() => snoozeCrew(s.player)}
          onResume={() => resumeCrew(s.player)}
          onFollow={() => s.player.followCrew()}
        />
      );
    case 'settings':
      return (
        <SettingsScreen
          gentle={data.profile.extraGentle}
          reduceMotion={s.userReduced}
          reduced={still}
          device={data.profile.device}
          onDevice={(device) => data.setProfile({ ...data.profile, device })}
          onGentle={(v) => data.setProfile({ ...data.profile, extraGentle: v })}
          onReduceMotion={s.setReduced}
          onStudio={h.onStudio}
          onForget={h.forget}
          prefs={prefs}
          onPrefs={onPrefs}
          onGuide={h.openGuide}
          feel={feel}
        />
      );
    default:
      return (
        <Today
          profile={data.profile}
          week={data.week}
          progress={data.progress}
          reduced={still}
          hasHistory={data.logs.some((l) => toDayNumber(l.startedAt) < today())}
          joinedToday={toDayNumber(data.profile.createdAt) === today()}
          crewConnected={crewInfo.enabled && crewInfo.status === 'connected'}
          last={last}
          feel={feel}
          todayMinutes={data.logs.filter((l) => toDayNumber(l.startedAt) === today()).reduce((n, l) => n + sessionMinutes(l), 0)}
          onSprint={(t) => {
            sprint.start(t);
            h.go('player');
          }}
          onPlay={h.play}
          onOpenJourney={h.openJourney}
          onGo={h.go}
          onReset={() => h.go('reset')}
          onBreathe={() => h.go('breathe')}
          onGuide={h.openGuide}
        />
      );
  }
}
