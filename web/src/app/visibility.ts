import type { AudioEngine } from '../audio/types';

export interface VisibilityDeps {
  readonly engine: Pick<AudioEngine, 'contextState' | 'resume'>;
  /** True while the player is playing. A stopped player is never restarted from here. */
  readonly isPlaying: () => boolean;
  /** Optional hook for wake lock re-acquire and release. */
  readonly onVisibility?: (hidden: boolean) => void;
  readonly doc?: Pick<Document, 'addEventListener' | 'removeEventListener' | 'hidden'>;
  readonly win?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
}

/** Tries to resume a suspended or interrupted context. Returns true when a resume was attempted. */
export async function recoverAudio(deps: Pick<VisibilityDeps, 'engine' | 'isPlaying'>): Promise<boolean> {
  if (!deps.isPlaying()) return false;
  const state = deps.engine.contextState?.();
  if (state !== 'suspended' && state !== 'interrupted') return false;
  if (deps.engine.resume === undefined) return false;
  try {
    await deps.engine.resume();
  } catch {
    /* the next gesture or visibility change retries */
  }
  return true;
}

/** Binds visibilitychange, pageshow and the first user gesture. Returns a cleanup. */
export function bindVisibility(deps: VisibilityDeps): () => void {
  const doc = deps.doc ?? (typeof document === 'undefined' ? undefined : document);
  const win = deps.win ?? (typeof window === 'undefined' ? undefined : window);
  const onChange = (): void => {
    const hidden = doc?.hidden === true;
    deps.onVisibility?.(hidden);
    void recoverAudio(deps);
  };
  const onShow = (): void => void recoverAudio(deps);
  doc?.addEventListener('visibilitychange', onChange);
  win?.addEventListener('pageshow', onShow);
  win?.addEventListener('pointerdown', onShow);
  win?.addEventListener('keydown', onShow);
  return () => {
    doc?.removeEventListener('visibilitychange', onChange);
    win?.removeEventListener('pageshow', onShow);
    win?.removeEventListener('pointerdown', onShow);
    win?.removeEventListener('keydown', onShow);
  };
}
