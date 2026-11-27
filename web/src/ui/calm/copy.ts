/** Single source of Calm text. Wording follows docs/UX-SPEC.md section i (copy deck). */
import type { Device, Goal, TimeOfDay } from './data';

export const CALM = {
  brand: 'Zonked',
  promise: 'Free. Private. No account.',
  welcomeTitle: 'Calm sound, made for you.',
  welcomeBody: 'A few quick questions. Then your first sound.',
  skip: 'Skip, just play',
  back: 'Back',
  next: 'Next',
  start: 'Start',
  stop: 'Stop',
  pause: 'Pause',
  play: 'Play',
  done: 'Done',
  notThisOne: 'Not this one',
  goalTitle: 'What brings you here?',
  whenTitle: 'When do you need it most?',
  listenTitle: 'How do you listen?',
  listenNote: 'Headphones suit two-tone beats best, and speakers suit gentle pulses and noise.',
  stepOf: (n: number) => `${n} of 3`,
  selected: 'Selected',
  playAgain: 'Play again',
  close: 'Close',
  endTitle: 'Done for now.',
  endLine: (name: string, min: number) => `${name} played for ${min < 1 ? 'under a minute' : min === 1 ? '1 minute' : `${min} minutes`}.`,
  endNote: 'Go at your own pace.',
  starterTitle: 'Pick a starter sound',
  preview: 'Preview',
  previewing: 'Playing a short preview',
  safetyTitle: 'Before you start',
  safetyLines: [
    'Use stereo headphones for the best effect.',
    'Keep the volume low.',
    'Zonked fades in slowly.',
    'Zonked is not a medical device.',
    'Stop any time.',
    'Stop if anything feels uncomfortable.',
  ],
  safetyAccept: 'I understand, start',
  notMedical: 'Zonked is not a medical device.',
  dailyEyebrow: 'Your session for today',
  suggested: 'Suggested for you',
  forYou: 'For you',
  journeysTitle: 'Journeys',
  journeysEmpty: 'Pick a journey to begin. Go at your own pace.',
  restDay: 'Rest day',
  restart: 'Restart journey',
  startJourney: 'Start this journey',
  libraryTitle: 'Library',
  searchLabel: 'Search sounds',
  searchEmpty: 'Nothing matched. Try fewer words.',
  tabs: ['Feeling', 'Sound', 'Favorites', 'My mixes', 'Recent'],
  emptyFavorites: 'Tap the heart on any sound to keep it here.',
  emptyMixes: 'Make a mix in the player, then save it here.',
  emptyRecent: 'Your recent sessions show up here.',
  welcomeBack: 'Welcome back. Pick up where you like.',
  firstWeek: 'Your week starts here. Rest days count too.',
  natureTitle: 'Nature sounds and my sounds',
  natureLine: 'Add rain, streams or birds under your session, or your own file.',
  joinedToday: 'You joined today',
  joinedLine: 'You joined today. Your week starts here. Rest days count too.',
  dayZero: (total: number) => `Day 0 of ${total}, you are ready`,
  infoTitle: 'Today',
  panelOpenFirst: 'Open Zonked once to read the headphone note.',
  panelPickFirst: 'Open Zonked and pick a sound first.',
  panelCrewLabel: 'Let the Crew steer my sound',
  panelCrewOff: 'Crew is off.',
  panelCrewOn: 'Crew is steering.',
  panelCrewLost: 'Crew backend not reachable. Playing on your own.',
  panelPlaying: 'Playing.',
  panelStopped: 'Stopped.',
  panelOpenPage: 'Zonked is open on the page. Use Stop there.',
  restCount: 'Rest days count too.',
  timerChips: ['15 min', '30 min', '60 min', 'Until I stop', 'Sleep fade'],
  breathe: 'Breathe in, breathe out',
  breatheIn: 'Breathe in',
  breatheOut: 'Breathe out',
  whyTitle: 'What the research says',
  whyBody:
    'Some small studies suggest slow beats may help people relax. Results vary and may not happen for you. Zonked is not a medical device.',
  volumeCapped: 'Volume is capped for your safety.',
  favorite: 'Favorite',
  saved: 'Saved',
  studio: 'Studio mode',
  studioLink: 'Open Studio mode',
  studioHint: 'For advanced controls. Shortcut: Alt+Shift+S.',
  studioNote: 'Advanced controls live in Settings, or press Alt+Shift+S for Studio mode.',
  backToCalm: 'Back to Calm',
  crewTitle: 'Crew',
  crewIntro:
    'Your coding session can watch itself and ease the sound. When you have been working hard, Zonked slowly moves toward calmer sound. You stay in control.',
  crewSwitch: 'Let Crew ease the sound',
  crewOff: 'Not connected',
  crewOn: 'Connected',
  crewBreak: 'Time for a break',
  crewPrivacy: 'Nothing leaves your computer.',
  crewOptional: 'Crew is optional. Zonked works fully without it.',
  settingsTitle: 'Settings',
  gentle: 'Keep sounds extra gentle',
  gentleHint: 'Picks softer sounds and keeps the screen still.',
  reduceMotion: 'Reduce motion',
  forget: 'Forget my answers',
  offline: 'Zonked works offline. Nothing to do.',
  errorAudio: 'Sound could not start. Tap Play to try again.',
  errorStorage: 'We could not save this on your device. Your session still works.',
  loading: 'Loading',
  nav: ['Today', 'Journeys', 'Library', 'Crew', 'Settings'],
  sounds: (n: number) => `${n} ${n === 1 ? 'sound' : 'sounds'}`,
} as const;

export const GOAL_LABEL: Readonly<Record<Goal, string>> = {
  focus: 'Focus',
  calm: 'Calm down',
  sleep: 'Sleep',
  study: 'Study',
  recover: 'Recover after work',
  curious: 'Just curious',
};

export const TIME_LABEL: Readonly<Record<TimeOfDay, string>> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
  anytime: 'Anytime',
};

export const DEVICE_LABEL: Readonly<Record<Device, string>> = {
  headphones: 'Headphones',
  speakers: 'Speakers',
  bluetooth: 'Bluetooth',
  unsure: 'Not sure',
};

export interface Feeling {
  readonly id: string;
  readonly label: string;
  /** One short line about the mood of the sounds. No health claims. */
  readonly mood: string;
  readonly icon: string;
}

export const FEELINGS: readonly Feeling[] = [
  { id: 'deep-work', label: 'Focus', mood: 'Steady and quiet', icon: 'target' },
  { id: 'adhd-focus', label: 'Steady attention', mood: 'Even and plain', icon: 'wave' },
  { id: 'ai-burnout', label: 'Recover', mood: 'Slow and soft', icon: 'leaf' },
  { id: 'heal-stress', label: 'Calm down', mood: 'Warm and gentle', icon: 'heart' },
  { id: 'cant-sleep', label: 'Sleep', mood: 'Dim and slow', icon: 'moon' },
  { id: 'lucid-dream', label: 'Dream', mood: 'Drifting', icon: 'cloud' },
  { id: 'meditate', label: 'Meditate', mood: 'Open and still', icon: 'lotus' },
  { id: 'quick-reset', label: 'Quick reset', mood: 'Short and light', icon: 'bolt' },
];

export const EVIDENCE: Readonly<Record<string, string>> = {
  strong: 'Several studies exist.',
  mixed: 'Studies disagree.',
  preliminary: 'Early, small studies.',
  limited: 'Very little research.',
  preference: 'People simply like it.',
};

/** Spec section c: before 12 morning, 12-17 afternoon, 17-21 evening, else night. */
export function greeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning.';
  if (hour >= 12 && hour < 17) return 'Good afternoon.';
  if (hour >= 17 && hour < 21) return 'Good evening.';
  return 'Hello, night owl.';
}
