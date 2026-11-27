export type MascotMood = 'idle' | 'happy' | 'sleepy' | 'listening' | 'breathing';
export type MascotSituation = 'focus' | 'calm' | 'sleep' | 'nature';

export interface CalmMascotProps {
  readonly mood?: MascotMood;
  readonly size?: number;
  readonly reducedMotion?: boolean;
  readonly label?: string;
  /** Breath amount 0..1 (0 empty, 1 full), driven from outside. Chest and shoulders rise with it. */
  readonly breathPhase?: number;
  /** Smoothed audio level 0..1. Drives cup glow and sound ripples. */
  readonly level?: number;
  /** Sets how closed the eyes are, the mote colour and the sway speed. */
  readonly situation?: MascotSituation;
}
