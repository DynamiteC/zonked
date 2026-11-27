import { lazy } from 'react';
import type { Mix } from '../../app/mixes';
import type { Template } from '../../catalog/types';
import type { View } from './CalmChrome';
import type { CalmData } from './useCalmData';
import { today } from './useCalmData';
import { toDayNumber } from './data';
import type { CalmSession } from './useCalmSession';
import type { CrewInfo } from './useCrewBridge';
import { Today } from './Today';

const JourneyList = lazy(() => import('./Journeys').then((m) => ({ default: m.JourneyList })));
const JourneyDetail = lazy(() => import('./Journeys').then((m) => ({ default: m.JourneyDetail })));
const Library = lazy(() => import('./Library').then((m) => ({ default: m.Library })));
const PlayerScreen = lazy(() => import('./PlayerScreen').then((m) => ({ default: m.PlayerScreen })));
const CrewScreen = lazy(() => import('./CrewScreen').then((m) => ({ default: m.CrewScreen })));
const SettingsScreen = lazy(() => import('./SettingsScreen').then((m) => ({ default: m.SettingsScreen })));

export interface Handlers {
  readonly go: (v: View) => void;
  readonly play: (t: Template) => void;
  readonly playDay: (id: string, no: number, t: Template) => void;
  readonly openJourney: (id: string) => void;
  readonly forget: () => void;
  readonly onStudio: () => void;
  readonly onMix: (m: Mix) => void;
}

interface Props {
  readonly view: View;
  readonly journeyId: string | null;
  readonly s: CalmSession;
  readonly data: CalmData;
  readonly crewInfo: CrewInfo;
  readonly still: boolean;
  readonly fav: { readonly on: boolean; readonly toggle: () => void };
  readonly handlers: Handlers;
}

/** Picks the screen for the current view. Only Today is in the first chunk. */
export function Screens({ view, journeyId, s, data, crewInfo, still, fav, handlers: h }: Props): React.JSX.Element {
  switch (view) {
    case 'journeys':
      return <JourneyList progress={data.progress} onOpen={h.openJourney} />;
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
      return <Library store={s.store} logs={data.logs} onPlay={h.play} onPlayMix={h.onMix} />;
    case 'player':
      return <PlayerScreen player={s.player} snap={s.snap} still={still} favorite={fav.on} onToggle={s.toggle} onFavorite={fav.toggle} />;
    case 'crew':
      return <CrewScreen crew={crewInfo} burnout={s.snap.burnout} />;
    case 'settings':
      return (
        <SettingsScreen
          gentle={data.profile.extraGentle}
          reduceMotion={s.userReduced}
          onGentle={(v) => data.setProfile({ ...data.profile, extraGentle: v })}
          onReduceMotion={s.setReduced}
          onStudio={h.onStudio}
          onForget={h.forget}
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
          crewConnected={crewInfo.enabled && crewInfo.status === 'connected'}
          onPlay={h.play}
          onOpenJourney={h.openJourney}
          onGo={h.go}
        />
      );
  }
}
