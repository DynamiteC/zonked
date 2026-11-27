export type MascotMood = 'idle' | 'happy' | 'sleepy' | 'listening' | 'breathing';

export interface CalmMascotProps {
  readonly mood?: MascotMood;
  readonly size?: number;
  readonly reducedMotion?: boolean;
  readonly label?: string;
}
