/** Single source of Calm text. Wording follows docs/UX-SPEC.md section i (copy deck). */
import type { CrewState } from '../../app/crew';
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
  feelQuestion: 'How was that?',
  feelCalmer: 'Calmer',
  feelSame: 'Same',
  feelNot: 'Not for me',
  feelSaved: 'Noted. This stays on this device.',
  starterTitle: 'Pick a starter sound',
  preview: 'Hear 10 s',
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
  safetyLimits: 'Built-in limits: carrier tone 20 to 1500 Hz, beat at most 40 Hz, volume always capped.',
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
  libraryTitle: 'Sounds',
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
  timerChips: ['15 min', '30 min', '60 min', 'Until I stop', 'Sleep fade', 'Focus sprint'],
  sprintName: 'Focus sprint',
  sprintTitle: 'Focus sprint',
  sprintLine: '25 minutes of sound, a soft chime, then a 5 minute break on a calmer sound.',
  sprintStart: 'Start a sprint',
  sprintFocusLeft: 'Focus',
  sprintBreakLeft: 'Break',
  sprintWhy: 'The timed break is the likely help here, more than the beat.',
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
  crewWhyOff: 'Crew is not connected because the local feed is not running, or the Crew switch on this page is off. Zonked works fully without it.',
  crewStep1: 'Start the local feed on your computer: run the crew bridge in your project folder.',
  crewStep2: 'Turn on the Crew switch on this page.',
  crewDisabled: 'The switch is on, but no feed answers yet. Crew stays off until step 1 is done.',
  crewOn: 'Connected',
  crewBreak: 'Time for a break',
  crewPrivacy: 'Nothing leaves your computer.',
  crewOptional: 'Crew is optional. Zonked works fully without it.',
  crewScore: 'Load score',
  crewBeat: 'Beat now',
  crewNext: 'Next change',
  crewWhyTitle: 'Why',
  crewReads: 'Reads only git log and git status counts. Never file names, messages or paths.',
  crewNotNow: 'Not now',
  crewFollowAgain: 'Follow again',
  crewPaused: (clock: string) => `Paused until ${clock}`,
  crewFollowing: 'Following the Crew',
  crewOverridden: 'You picked a sound yourself, so the Crew is not steering it.',
  crewFollowNow: 'Let the Crew steer',
  crewNextReal: (clock: string) => `Not before ${clock}, and only if your load moves to another band.`,
  crewNextWait: 'Waiting for the first change.',
  crewNextDemo: (sec: number) => `in ${sec} s`,
  crewNextDemoLast: (sec: number) => `none, the demo ends in ${sec} s`,
  crewDemo: 'Watch the crew work',
  crewDemoHint: 'A 60 second pretend session. Nothing is read from your computer.',
  crewDemoEnd: 'That was pretend. Real mode reads git counts only.',
  crewDemoStop: 'Stop the demo',
  crewDemoBadge: 'Simulated session',
  settingsTitle: 'Settings',
  gentle: 'Keep sounds extra gentle',
  gentleHint: 'Picks softer sounds and keeps the screen still.',
  reduceMotion: 'Reduce motion',
  themeTitle: 'Look',
  themeChoices: { system: 'System', light: 'Light', dark: 'Dark', contrast: 'High contrast' },
  dimLabel: 'Dim screen while playing',
  dimHint: 'On by default from 19:00 to 07:00.',
  announceLabel: 'Say Breathe in and Breathe out to screen readers',
  announceHint: 'Speaks only when the phase changes.',
  resetEntry: 'A short pause, 90 seconds',
  resetEntryHint: 'Slow breathing with soft sound.',
  resetTitle: 'A short pause',
  resetIntro: 'Ninety seconds of slow breathing with a soft sound. Stop any time.',
  breatheEntry: 'Breathe, 5 minutes',
  breatheEntryHint: 'Many people find slow breathing calming.',
  breatheTitle: 'Breathe, 5 minutes',
  breatheIntro: 'Many people find slow breathing calming. Soft noise, nothing to follow. Stop any time.',
  breatheDoneLine: 'That was 5 minutes of slow breathing.',
  breatheAgain: 'Breathe again',
  breatheLeft: (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} left`,
  resetStart: 'Begin',
  resetLeft: (sec: number) => `${sec} s left`,
  resetDoneLine: 'That was 90 seconds of slow breathing.',
  resetAgain: 'Pause again',
  resetBack: 'Back to Today',
  counterIn: (n: number) => `Breathe in, ${n}`,
  counterOut: (n: number) => `Breathe out, ${n}`,
  demoSteering: 'Demo is steering the sound',
  demoSteeringHint: 'The simulated session controls the sound until you stop the demo, so this switch waits.',
  crewBeatHint: 'Higher beats feel alert, lower beats feel calm.',
  weekOf: (n: number) => `${n} of 7 days`,
  forget: 'Forget my data',
  forgetHint: 'Removes your answers, how-it-felt notes, nature choice and your own sounds from this device.',
  natureHead: 'Nature sounds',
  natureIntro: 'Add a recording of nature under your session. Pick one, then use the slider to set the mix.',
  natureFree: 'Free to use, public domain',
  natureMade: 'Made by Zonked in code. No recording is used.',
  natureCredits: 'Credits',
  natureCreditsPick: 'Pick a sound',
  natureBlend: 'More nature, softer beats',
  natureLevel: 'Nature volume',
  natureAdd: 'Add nature sound',
  natureOff: 'Stop nature sound',
  natureOn: 'Playing now',
  natureNote: 'Nature sounds can feel calming for many people. Zonked makes no health claims and is not a medical device.',
  natureBack: 'Back to Library',
  natureQuick: 'Nature',
  mineTitle: 'My sounds',
  mineStays: 'Stays on this device',
  mineNote: 'Pick an audio file from your own device. It stays in this browser, is never uploaded and uses no network. Only add files you own or have the right to use.',
  mineChoose: 'Choose an audio file',
  mineLimits: 'Up to 5 sounds, 8 MB each, 20 MB in all, 10 minutes long. Files under 20 seconds play once.',
  mineEmpty: 'No sounds added yet.',
  mineRemove: 'Remove',
  mineRemoveAll: 'Remove all my sounds',
  mineAdded: 'Added. It stays on this device.',
  offline: 'Zonked works offline. Nothing to do.',
  unsupported: 'This browser cannot play Zonked sound. Try a recent Chrome, Edge, Firefox or Safari.',
  errorAudio: 'Sound could not start. Tap Play to try again.',
  errorStorage: 'We could not save this on your device. Your session still works.',
  loading: 'Loading',
  nav: ['Today', 'Sounds', 'Crew', 'You'],
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

const LEVEL_LINE: Readonly<Record<CrewState['burnout']['level'], string>> = {
  focus: 'Your load looks light',
  flow: 'Your load is building',
  recovery: 'Your load is high',
  decompress: 'Your load is very high',
};

/** Beat as a short string: 10, 7.5. */
export const hzText = (hz: number): string => (Number.isInteger(hz) ? String(hz) : hz.toFixed(1));

/** The sentence under Why: the sender's own text when present, else one built from level, score, beat and transition. */
export function crewWhy(state: CrewState): string {
  if (state.why !== undefined) return state.why;
  const { level, score } = state.burnout;
  const { beatHz, transitionSec } = state.target;
  const over = transitionSec < 90 ? `${Math.round(transitionSec)} s` : `${Math.round(transitionSec / 60)} min`;
  const move = level === 'focus' ? `holds a steady ${hzText(beatHz)} Hz beat` : `eases the beat to ${hzText(beatHz)} Hz over about ${over}`;
  return `${LEVEL_LINE[level]} (score ${Math.round(score)}), so the sound ${move}.`;
}

/** First sentence only. The detail line (tone, carrier, layers) stays in the catalog. */
export const briefReason = (text: string): string => {
  const i = text.indexOf('. ');
  return i < 0 ? text : text.slice(0, i + 1);
};
