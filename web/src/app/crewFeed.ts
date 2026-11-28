import type { CrewState } from './crew';
import type { Player } from './player';

/** What the Crew screen shows. One module store, so the website and the Kiro Crew app share it. */
export type CrewSource = 'none' | 'bridge' | 'demo';

export interface CrewView {
  readonly state: CrewState | null;
  readonly source: CrewSource;
  /** Wall time of the last change of target, for the earliest next change. 0 when unknown. */
  readonly changedAtMs: number;
  /** Following is paused until this wall time. 0 when not paused. */
  readonly snoozeUntilMs: number;
  /** Demo only: wall time of the next simulated step, or null after the last one. */
  readonly demoNextAtMs: number | null;
}

/** Real crew keeps this gap between changes. The bridge enforces it; the screen only reports it. */
export const CREW_MIN_GAP_MS = 30_000;
export const SNOOZE_MS = 30 * 60_000;

const EMPTY: CrewView = { state: null, source: 'none', changedAtMs: 0, snoozeUntilMs: 0, demoNextAtMs: null };

let view: CrewView = EMPTY;
let snoozeTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

export const getCrewView = (): CrewView => view;

export function subscribeCrew(fn: () => void): () => void {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

/** Replaces the view and tells every listener. Used by the demo runner too. */
export function setCrewView(next: CrewView): void {
  view = next;
  for (const fn of [...listeners]) fn();
}

const sameTarget = (a: CrewState | null, b: CrewState): boolean =>
  a !== null && a.target.beatHz === b.target.beatHz && a.target.carrierHz === b.target.carrierHz && a.target.gain === b.target.gain;

/**
 * A validated state from the bridge or the app backend. Remembered for the screen, and sent to
 * the player unless following is paused or the simulated demo owns the sound.
 */
export function ingestCrew(player: Player, state: CrewState, now: number = Date.now()): void {
  if (view.source === 'demo') return;
  const changed = !sameTarget(view.state, state);
  setCrewView({ ...view, state, source: 'bridge', changedAtMs: changed ? now : view.changedAtMs });
  if (now >= view.snoozeUntilMs) player.applyCrew(state);
}

/** The feed dropped. A running demo is not affected. */
export function lostCrew(): void {
  if (view.source === 'bridge') setCrewView({ ...view, state: null, source: 'none', changedAtMs: 0 });
}

/** Not now: stop following for 30 minutes. The sound stays where it is. */
export function snoozeCrew(player: Player, now: number = Date.now(), ms: number = SNOOZE_MS): void {
  if (snoozeTimer !== null) clearTimeout(snoozeTimer);
  setCrewView({ ...view, snoozeUntilMs: now + ms });
  snoozeTimer = setTimeout(() => resumeCrew(player), ms);
}

/** Follow again, now. Applies the latest state when one is known. */
export function resumeCrew(player: Player): void {
  if (snoozeTimer !== null) clearTimeout(snoozeTimer);
  snoozeTimer = null;
  setCrewView({ ...view, snoozeUntilMs: 0 });
  if (view.source === 'bridge' && view.state !== null) player.applyCrew(view.state);
}

/** Test helper: back to the empty view with no timers. */
export function resetCrewFeed(): void {
  if (snoozeTimer !== null) clearTimeout(snoozeTimer);
  snoozeTimer = null;
  view = EMPTY;
}
