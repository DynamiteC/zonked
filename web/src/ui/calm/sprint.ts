import type { Player } from '../../app/player';
import type { TimerSpec, TimerState } from '../../app/timers';
import type { Template } from '../../catalog/types';

/** 25 minutes of the session sound, then a 5 minute break. Same numbers as the Studio focus and break timer. */
export const SPRINT_SPEC: TimerSpec = { kind: 'pomodoro', focusMin: 25, breakMin: 5 };
/** Calmer sounds for the break, in order of preference. The first one that differs from the focus sound wins. */
export const BREAK_IDS: readonly string[] = ['starter-rain', 'starter-deep'];
/** The break plays at no more than this share of the focus gain. */
export const BREAK_GAIN_RATIO = 0.8;
/** How long the soft chime layer rings at the switch. */
export const CHIME_MS = 6000;
/** Chime layer level and rate. The layer sits inside the voice, so the gain cap and limiter still apply. */
export const CHIME_LAYER = { chimeLevel: 0.25, chimeRatePerMin: 10 } as const;

export type SprintPhase = 'focus' | 'break';
export type SprintAction = 'break' | 'finish' | 'cancel' | null;

export interface SprintStep {
  readonly phase: SprintPhase | 'end';
  readonly action: SprintAction;
}

/**
 * Pure step of the sprint: reads the Studio pomodoro timer and says what to do next.
 * Focus then break ends the sprint. Any other timer (the person picked one) cancels it quietly.
 */
export function nextSprint(phase: SprintPhase, timer: TimerState): SprintStep {
  if (timer.kind !== 'pomodoro') return { phase: 'end', action: 'cancel' };
  if (phase === 'focus' && timer.phase === 'break') return { phase: 'break', action: 'break' };
  if (phase === 'break' && timer.phase === 'focus') return { phase: 'end', action: 'finish' };
  return { phase, action: null };
}

/** The calmer sound for the break: never the focus sound itself. */
export function breakTemplate(focusId: string, pool: readonly Template[]): Template | undefined {
  const id = BREAK_IDS.find((x) => x !== focusId);
  return pool.find((t) => t.id === id);
}

/** Gain offset that puts the break at or below BREAK_GAIN_RATIO of the focus gain. Never positive. */
export function breakTrim(focusGain: number, breakGain: number): number {
  if (!Number.isFinite(focusGain) || !Number.isFinite(breakGain)) return 0;
  return Math.round(Math.min(0, focusGain * BREAK_GAIN_RATIO - breakGain) * 1000) / 1000;
}

type Later = (fn: () => void, ms: number) => unknown;

/** Switches to the break sound with a soft chime. The break is always quieter than the focus. */
export async function enterBreak(player: Player, brk: Template, later: Later = (fn, ms) => window.setTimeout(fn, ms)): Promise<void> {
  const before = player.snapshot().voice.gain;
  player.setLayerOverride(CHIME_LAYER);
  later(() => player.clearLayerOverrides(), CHIME_MS);
  if (!(await player.playTemplate(brk))) return;
  player.nudgeGain(breakTrim(before, player.snapshot().voice.gain));
}
