/**
 * Old seed ids (android- and gnaural- prefixes) mapped to the original replacements.
 * Saved favorites that hold an old id are moved to the new id when they are read.
 * Kept tiny and free of catalog imports so the first load bundle stays small.
 */
export const LEGACY_TEMPLATE_IDS: Readonly<Record<string, string>> = {
  'android-self-hypnosis': 'seed-slow-settle',
  'android-highest-mental-activity': 'seed-bright-run',
  'android-unity': 'seed-low-hour',
  'android-morphine': 'seed-warm-hum',
  'android-learning': 'seed-reading-room',
  'android-creativity': 'seed-idea-drift',
  'android-wakeful-relax': 'seed-gentle-landing',
  'android-schumann': 'seed-quiet-ground',
  'android-astral-relax': 'seed-evening-slope',
  'android-interval-pulse': 'seed-pace-steps',
  'android-hallucination': 'seed-soft-fade',
  'android-sleep-induction': 'seed-night-descent',
  'android-lucid-dreams': 'seed-dream-hour',
  'android-shamanic-rhythm': 'seed-campfire-hush',
  'android-smr-sleep': 'seed-light-sleep-weave',
  'android-lucid-dreams-2': 'seed-long-night',
  'android-adhd-cycle': 'seed-steady-blocks',
  'android-self-hypnosis-short': 'seed-short-settle',
  'android-wakeful-relax-5': 'seed-pause-five',
  'android-schumann-short': 'seed-ground-reset',
  'android-lucid-dreams-short': 'seed-nap-window',
  'gnaural-power-nap': 'seed-midday-rest',
  'gnaural-airplane-aid': 'seed-long-trip',
  'gnaural-arrive-sharp': 'seed-morning-lift',
};

/** The current id for a saved template id. Unknown ids come back unchanged. */
export const currentTemplateId = (id: string): string => LEGACY_TEMPLATE_IDS[id] ?? id;
