import { createEngine } from '@zonked-web/audio';
import type { AudioEngine } from '@zonked-web/audio';
import { Player, realClock } from '@zonked-web/app/player';
import type { PlayerSnapshot } from '@zonked-web/app/player';
import { bindMediaSession, setMediaMetadata, setPlaybackState, setPositionState } from '@zonked-web/app/mediaSession';
import { bindVisibility } from '@zonked-web/app/visibility';
import { WakeLockController } from '@zonked-web/app/wakeLock';
import { safeStorage } from '@zonked-web/app/useReducedMotion';
import { templateToEvents } from '@zonked-web/catalog/events';
import type { Template } from '@zonked-web/catalog/types';
import { createStore } from '@zonked-web/storage/db';
import type { Store } from '@zonked-web/storage/db';
import { SAFETY_KEY, readFlag } from '@zonked-web/storage/prefs';

/**
 * Everything that must outlive the page component: the audio engine, the player with its
 * timers, the MediaSession handlers, the wake lock and the visibility recovery. The dashboard
 * unmounts a page on navigation, so none of this may be owned by a React component.
 * The panel tab imports the same chunk, so both surfaces share one instance.
 */
export interface Session {
  readonly engine: AudioEngine;
  readonly player: Player;
  readonly store: Store;
}

const POSITION_BUCKET_SEC = 5;
const toEvents = (t: { id: string }): ReturnType<typeof templateToEvents> => templateToEvents(t as Template);

let session: Session | null = null;

/** True once the person accepted the hearing and headphone notice on this device. */
export const isSafetyAccepted = (): boolean => readFlag(SAFETY_KEY);

function bindPlumbing(player: Player, engine: AudioEngine, wake: WakeLockController): void {
  bindMediaSession({
    // A lock-screen play only resumes after the notice was accepted once.
    play: () => { if (isSafetyAccepted() && !player.snapshot().playing) void player.play(); },
    pause: () => void player.stop(),
    stop: () => void player.stop(),
    seekBy: (d) => player.seekBy(d),
  });
  bindVisibility({
    engine,
    isPlaying: () => player.snapshot().playing,
    onVisibility: (hidden) => void wake.setHidden(hidden),
  });
  let lastKey = '';
  player.subscribe((s: PlayerSnapshot) => {
    const bucket = Math.floor(s.elapsedSec / POSITION_BUCKET_SEC);
    const key = `${String(s.playing)}|${s.templateId ?? ''}|${s.timer.kind}|${s.timer.phase}|${String(bucket)}`;
    if (key === lastKey) return;
    lastKey = key;
    setPlaybackState(s.playing);
    setMediaMetadata(s.templateName === null ? null : { name: s.templateName, category: s.templateCategory ?? '' });
    const p = player.positionState();
    if (p === null) setPositionState(0, 0);
    else setPositionState(p.durationSec, p.positionSec);
    void wake.setPlaying(s.playing);
  });
}

export function getSession(): Session {
  if (session !== null) return session;
  const engine = createEngine();
  const store = createStore();
  const player = new Player(engine, realClock, (log) => void store.addLog(log).catch(() => undefined), { toEvents });
  const wake = new WakeLockController(undefined, safeStorage());
  bindPlumbing(player, engine, wake);
  session = { engine, player, store };
  return session;
}

/** Read-only probes for the offline harness. They change nothing. */
export const engineStats = (): ReturnType<AudioEngine['getStats']> => getSession().engine.getStats();
export const engineState = (): string => getSession().engine.status.state;
