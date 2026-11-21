/** Seven sound-first starter templates, one per sound menu item. Deterministic. */
import { deriveLayerTags, isAdhdFriendly } from './dsl';
import { SOUND_MENU, soundVoice } from './soundMenu';
import type { SoundMenuItem } from './soundMenu';
import type { Stage, Template, Vibe } from './types';

const VIBE: Record<string, Vibe> = { warm: 'warm', calm: 'calm', bright: 'bright', deep: 'deep', dreamy: 'dreamy', neutral: 'minimal' };

function starter(item: SoundMenuItem): Template {
  const v = soundVoice(item.id, item.defaultLevel);
  const hasLayers = Object.keys(v.layers).length > 0;
  const stage: Stage = {
    atMin: 0,
    beatHz: 8,
    carrierHz: 200,
    gain: 0.4,
    mode: 'binaural',
    noise: v.noise,
    noiseLevel: v.noiseLevel,
    ...(hasLayers ? { layers: v.layers } : {}),
    ramp: false,
  };
  const stages = [stage];
  return {
    id: item.templateId,
    name: item.name,
    category: 'vibes',
    vibe: VIBE[item.mood] ?? 'calm',
    tags: ['starter', 'sound-first', item.id],
    layerTags: deriveLayerTags(stages),
    situations: ['quick-reset', 'heal-stress'],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: isAdhdFriendly(stages, 1),
    stages,
    reasonTemplate: item.blurb,
    source: 'original',
  };
}

export function buildStarters(): Template[] {
  return SOUND_MENU.map(starter);
}
