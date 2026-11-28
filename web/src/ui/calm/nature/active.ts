// Tiny, always loaded. Tracks which nature or own sound is on, so the app can stop it when the
// session stops without loading the sample code first. The e2e hook reads it too.

let current: string | null = null;

export const activeNature = (): string | null => current;
export const setActiveNature = (id: string | null): void => void (current = id);

/** Stops the layer if one is on. The sample module loads only when something was started. */
export function stopNatureIfActive(): void {
  if (current === null) return;
  current = null;
  void import('../../../audio/samples').then((m) => m.stopSample()).catch(() => undefined);
}
