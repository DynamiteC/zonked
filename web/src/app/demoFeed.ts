import { parseCrewState } from './crew';
import type { CrewState } from './crew';
import { setCrewView } from './crewFeed';
import type { Player } from './player';

/**
 * A pretend 60 second session for the one-tap demo. It builds the same state objects the bridge
 * sends and runs each one through the same validator. It reads nothing from the viewer's machine
 * and makes no request. Real crew keeps a 30 s gap between changes; this demo uses 15 s steps
 * and the validator's hard 5 s transition floor, so a short clip can show the whole arc.
 */
export const DEMO_STEP_MS = 15_000;
export const DEMO_TOTAL_MS = 60_000;

interface DemoStep {
  readonly score: number;
  readonly level: string;
  readonly beatHz: number;
  readonly carrierHz: number;
  readonly gain: number;
  readonly transitionSec: number;
  readonly why: string;
}

/** Fresh, warming up, strained, burned out. The beats follow the real bands: 40, 18, 10 and 6 Hz. */
export const DEMO_STEPS: readonly DemoStep[] = [
  { score: 22, level: 'focus', beatHz: 40, carrierHz: 200, gain: 0.45, transitionSec: 5, why: 'Simulated: a fresh start. The pretend load is low, so the sound stays steady.' },
  { score: 48, level: 'flow', beatHz: 18, carrierHz: 220, gain: 0.4, transitionSec: 8, why: 'Simulated: the pretend load is building. The beat eases down to 18 Hz.' },
  { score: 70, level: 'recovery', beatHz: 10, carrierHz: 200, gain: 0.32, transitionSec: 8, why: 'Simulated: the pretend load is high. The beat slows to 10 Hz and the sound softens.' },
  { score: 88, level: 'decompress', beatHz: 6, carrierHz: 180, gain: 0.25, transitionSec: 8, why: 'Simulated: burned out. The beat settles to 6 Hz and the sound goes quiet.' },
];

/** The raw object a bridge would send for one step. Untrusted by design: it still goes through parseCrewState. */
export function demoRaw(step: number, atSec: number): unknown {
  const s = DEMO_STEPS[Math.min(Math.max(0, Math.trunc(step)), DEMO_STEPS.length - 1)];
  if (s === undefined) return null;
  return {
    version: 1,
    at: atSec,
    burnout: { score: s.score, level: s.level },
    target: { presetId: 'burnout-reset', beatHz: s.beatHz, carrierHz: s.carrierHz, gain: s.gain, transitionSec: s.transitionSec, breathe: s.score >= 60 },
    sbg: null,
    why: s.why,
  };
}

/** One step as a validated state, or null if the validator refuses it. */
export function demoState(step: number, atSec: number): CrewState | null {
  return parseCrewState(JSON.parse(JSON.stringify(demoRaw(step, atSec))));
}

export interface DemoDeps {
  readonly now: () => number;
  readonly setTimer: (fn: () => void, ms: number) => unknown;
  readonly clearTimer: (h: unknown) => void;
}

const realDeps: DemoDeps = {
  now: () => Date.now(),
  setTimer: (fn, ms) => setTimeout(fn, ms),
  clearTimer: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
};

let handles: unknown[] = [];
let activeDeps: DemoDeps = realDeps;

function clearAll(): void {
  for (const h of handles) activeDeps.clearTimer(h);
  handles = [];
}

function apply(player: Player, step: number, t0: number, deps: DemoDeps): void {
  const now = deps.now();
  const state = demoState(step, Math.trunc(now / 1000));
  if (state === null) return;
  const last = step >= DEMO_STEPS.length - 1;
  setCrewView({ state, source: 'demo', changedAtMs: now, snoozeUntilMs: 0, demoNextAtMs: t0 + (last ? DEMO_TOTAL_MS : (step + 1) * DEMO_STEP_MS) });
  player.applyCrew(state);
  player.followCrew();
}

/** Ends the demo. The sound keeps playing at its last gentle level; the person stops it as usual. */
export function stopDemo(player: Player): void {
  clearAll();
  setCrewView({ state: null, source: 'none', changedAtMs: 0, snoozeUntilMs: 0, demoNextAtMs: null });
  player.crewLost();
}

/** Starts the simulated session. The caller must have the safety notice accepted first. */
export function startDemo(player: Player, deps: DemoDeps = realDeps): void {
  clearAll();
  activeDeps = deps;
  const t0 = deps.now();
  apply(player, 0, t0, deps);
  if (!player.snapshot().playing) void player.play();
  for (let i = 1; i < DEMO_STEPS.length; i += 1) handles.push(deps.setTimer(() => apply(player, i, t0, deps), i * DEMO_STEP_MS));
  handles.push(deps.setTimer(() => stopDemo(player), DEMO_TOTAL_MS));
}
