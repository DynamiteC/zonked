/**
 * Applies a waiting service worker only while nothing is playing.
 * A new worker waits. It is applied (once) the first time playback is stopped,
 * and is otherwise picked up on the next load. Playback is never interrupted.
 */
export interface UpdateGate {
  needRefresh(): void;
  setPlaying(playing: boolean): void;
}

export function createUpdateGate(apply: () => void): UpdateGate {
  let waiting = false;
  let playing = false;
  let applied = false;
  const maybeApply = (): void => {
    if (!waiting || playing || applied) return;
    applied = true;
    apply();
  };
  return {
    needRefresh: () => {
      waiting = true;
      maybeApply();
    },
    setPlaying: (p) => {
      playing = p;
      maybeApply();
    },
  };
}

let gate: UpdateGate | null = null;

/** Called once from main.tsx. */
export function installUpdateGate(g: UpdateGate): void {
  gate = g;
}

/** Called by the app whenever playback state changes. No-op before install (tests, dev). */
export function reportPlaying(playing: boolean): void {
  gate?.setPlaying(playing);
}
