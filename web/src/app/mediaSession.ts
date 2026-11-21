export const SEEK_STEP_SEC = 15;

export interface MediaHandlers {
  play(): void;
  pause(): void;
  stop(): void;
  next?(): void;
  prev?(): void;
  /** Moves by deltaSec within the current template timeline or timer. The player clamps. */
  seekBy?(deltaSec: number): void;
}

export interface MediaTemplateInfo {
  readonly name: string;
  readonly category: string;
}

type MediaNav = Navigator & { mediaSession?: MediaSession };

const sessionOf = (nav: Navigator): MediaSession | undefined => {
  const ms = (nav as MediaNav).mediaSession;
  return ms === undefined || ms === null ? undefined : ms;
};

const ARTWORK: MediaImage[] = [
  { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
  { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
];

const ACTIONS: readonly MediaSessionAction[] = [
  'play', 'pause', 'stop', 'nexttrack', 'previoustrack', 'seekforward', 'seekbackward',
];

function handlerFor(action: MediaSessionAction, h: MediaHandlers): MediaSessionActionHandler | null {
  switch (action) {
    case 'play': return () => h.play();
    case 'pause': return () => h.pause();
    case 'stop': return () => h.stop();
    case 'nexttrack': return h.next ? () => h.next?.() : null;
    case 'previoustrack': return h.prev ? () => h.prev?.() : null;
    case 'seekforward': return h.seekBy ? () => h.seekBy?.(SEEK_STEP_SEC) : null;
    case 'seekbackward': return h.seekBy ? () => h.seekBy?.(-SEEK_STEP_SEC) : null;
    default: return null;
  }
}

/** Sets lock-screen metadata for a template (or the generic app card when null). */
export function setMediaMetadata(t: MediaTemplateInfo | null, nav: Navigator = navigator): void {
  const ms = sessionOf(nav);
  if (ms === undefined || typeof MediaMetadata === 'undefined') return;
  try {
    ms.metadata = new MediaMetadata({
      title: t?.name ?? 'Zonked',
      artist: 'Zonked',
      album: t?.category ?? 'Acoustic recovery',
      artwork: ARTWORK,
    });
  } catch {
    /* metadata is cosmetic */
  }
}

/** Syncs the lock-screen scrubber. Invalid durations clear the position state. */
export function setPositionState(durationSec: number, positionSec: number, nav: Navigator = navigator): void {
  const ms = sessionOf(nav);
  if (ms === undefined || typeof ms.setPositionState !== 'function') return;
  try {
    if (!Number.isFinite(durationSec) || durationSec <= 0 || !Number.isFinite(positionSec)) {
      ms.setPositionState();
      return;
    }
    const pos = Math.min(Math.max(0, positionSec), durationSec);
    ms.setPositionState({ duration: durationSec, position: pos, playbackRate: 1 });
  } catch {
    /* some browsers reject the call; ignore */
  }
}

/** Binds OS media keys. Returns a cleanup. No-op when the API is missing. */
export function bindMediaSession(h: MediaHandlers, nav: Navigator = navigator): () => void {
  const ms = sessionOf(nav);
  if (ms === undefined) return () => undefined;
  setMediaMetadata(null, nav);
  for (const a of ACTIONS) {
    try {
      ms.setActionHandler(a, handlerFor(a, h));
    } catch {
      /* some browsers reject unsupported actions */
    }
  }
  return () => {
    for (const a of ACTIONS) {
      try {
        ms.setActionHandler(a, null);
      } catch {
        /* ignore */
      }
    }
    try {
      ms.metadata = null;
      ms.setPositionState?.();
    } catch {
      /* ignore */
    }
  };
}

export function setPlaybackState(playing: boolean, nav: Navigator = navigator): void {
  const ms = sessionOf(nav);
  if (ms !== undefined) ms.playbackState = playing ? 'playing' : 'paused';
}
