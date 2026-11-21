import { useEffect } from 'react';
import type { MutableRefObject } from 'react';
import type { AudioEngine } from '../audio/types';
import { bindMediaSession, setMediaMetadata, setPlaybackState, setPositionState } from './mediaSession';
import type { Player, PlayerSnapshot } from './player';
import type { ActionId } from './shortcuts';
import { bindVisibility } from './visibility';
import type { WakeLockController } from './wakeLock';

interface Args {
  player: Player;
  engine: AudioEngine;
  wake: WakeLockController;
  snap: PlayerSnapshot;
  snapRef: MutableRefObject<PlayerSnapshot>;
  actions: MutableRefObject<Partial<Record<ActionId, () => void>>>;
}

/** Media Session, wake lock and page visibility bindings. */
export function useSessionPlumbing({ player, engine, wake, snap, snapRef, actions }: Args): void {
  useEffect(
    () =>
      bindMediaSession({
        play: () => {
          if (!snapRef.current.playing) actions.current['play-pause']?.();
        },
        pause: () => void player.stop(),
        stop: () => void player.stop(),
        next: () => actions.current.next?.(),
        prev: () => actions.current.prev?.(),
        seekBy: (d) => player.seekBy(d),
      }),
    [player],
  );
  useEffect(() => setPlaybackState(snap.playing), [snap.playing]);
  useEffect(
    () => setMediaMetadata(snap.templateName === null ? null : { name: snap.templateName, category: snap.templateCategory ?? '' }),
    [snap.templateName, snap.templateCategory],
  );
  const posBucket = Math.floor(snap.elapsedSec / 5);
  useEffect(() => {
    const p = player.positionState();
    if (p === null) setPositionState(0, 0);
    else setPositionState(p.durationSec, p.positionSec);
  }, [player, posBucket, snap.playing, snap.templateId, snap.timer.kind, snap.timer.phase]);

  useEffect(() => {
    void wake.setPlaying(snap.playing);
  }, [wake, snap.playing]);
  useEffect(
    () =>
      bindVisibility({
        engine,
        isPlaying: () => snapRef.current.playing,
        onVisibility: (hidden) => void wake.setHidden(hidden),
      }),
    [engine, wake],
  );
  useEffect(() => () => void wake.dispose(), [wake]);
}
