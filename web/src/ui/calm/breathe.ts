import { deriveLayerTags, isAdhdFriendly } from '../../catalog/dsl';
import type { Stage, Template } from '../../catalog/types';

export const BREATHE_ID = 'calm-breathe-5';
export const BREATHE_MINUTES = 5;
/** The lowest beat and the lowest carrier the engine allows. */
const BEAT_FLOOR_HZ = 0.5;
const CARRIER_FLOOR_HZ = 20;

/**
 * Soft pink noise and nothing to follow. beatLevel 0 silences the binaural voice in dsp-core
 * (param slot 7), so no tone plays. The carrier and beat stay at the engine floor and are never heard.
 */
const STAGE: Stage = {
  atMin: 0,
  beatHz: BEAT_FLOOR_HZ,
  carrierHz: CARRIER_FLOOR_HZ,
  gain: 0.32,
  mode: 'binaural',
  noise: 'pink',
  noiseLevel: 0.45,
  beatLevel: 0,
  ramp: false,
};

/** The 5 minute breathing sound. Built in Calm, so it never joins the recommender pool. */
export const BREATHE_TEMPLATE: Template = {
  id: BREATHE_ID,
  name: 'Breathe, 5 minutes',
  category: 'meditation',
  vibe: 'calm',
  tags: ['breathing', 'no-beat'],
  layerTags: deriveLayerTags([STAGE]),
  situations: ['meditate', 'quick-reset'],
  recommendedMinutes: BREATHE_MINUTES,
  intensity: 1,
  adhdFriendly: isAdhdFriendly([STAGE], 1),
  stages: [STAGE],
  reasonTemplate: 'Soft pink noise, paced 4 seconds in and 4 seconds out.',
  source: 'original',
  breath: { inSec: 4, outSec: 4 },
};

/** True when any stage carries a beat above the floor. The breathing sound has none. */
export const hasBeat = (t: Template): boolean => t.stages.some((s) => s.beatHz > BEAT_FLOOR_HZ);
