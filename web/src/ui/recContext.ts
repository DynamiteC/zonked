import type { RecContext, TimeOfDay } from '../catalog/types';

export function timeOfDayFor(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}

export function defaultRecContext(now: Date = new Date()): RecContext {
  return {
    situation: 'deep-work',
    availableMinutes: 30,
    timeOfDay: timeOfDayFor(now),
    sensorySensitivity: 'medium',
    deviceType: 'headphones',
  };
}

export const SITUATION_LABELS: Readonly<Record<string, string>> = {
  'adhd-focus': 'Steady focus',
  'cant-sleep': "Can't sleep",
  'lucid-dream': 'Dreamy night',
  meditate: 'Meditate',
  'heal-stress': 'Calm down',
  'ai-burnout': 'After a long coding session',
  'deep-work': 'Deep work',
  'quick-reset': 'Quick reset',
};

/** Minutes remaining announcement bucket: coarse when far, finer near the end. Pure. */
export function announceBucketSec(remainingSec: number): number {
  const r = Math.max(0, Math.ceil(remainingSec));
  if (r > 600) return Math.ceil(r / 300) * 300;
  if (r > 60) return Math.ceil(r / 60) * 60;
  if (r > 30) return 60;
  if (r > 10) return 30;
  return r > 0 ? 10 : 0;
}

export function formatClock(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m % 60)}:${pad(s % 60)}` : `${pad(m)}:${pad(s % 60)}`;
}

export function announceText(kind: string, remainingSec: number, phase?: string, finalFade?: boolean): string {
  if (kind === 'none') return '';
  if (finalFade === true) return 'Fading out';
  const b = announceBucketSec(remainingSec);
  const what = b >= 60 ? `${Math.round(b / 60)} minute${b === 60 ? '' : 's'}` : `${b} seconds`;
  const label = kind === 'pomodoro' ? (phase === 'break' ? 'Break' : 'Focus') : kind === 'sleep-fade' ? 'Sleep fade' : 'Timer';
  return `${label}: about ${what} left`;
}
