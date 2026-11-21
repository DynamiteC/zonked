/** Catalog contract C3 (see .kiro/specs/zonked-library/contracts.md). Pure TypeScript, no DOM. */
import type { Layers } from '../sbg/layers';
import type { NoiseKind, ToneMode } from '../sbg/types';

export type Category =
  | 'vibes'
  | 'healing'
  | 'lucid-dreams'
  | 'meditation'
  | 'sleep'
  | 'adhd-control'
  | 'focus'
  | 'work-recovery';
export type Situation =
  | 'adhd-focus'
  | 'cant-sleep'
  | 'lucid-dream'
  | 'meditate'
  | 'heal-stress'
  | 'ai-burnout'
  | 'deep-work'
  | 'quick-reset';
export type Vibe =
  | 'calm'
  | 'warm'
  | 'dreamy'
  | 'bright'
  | 'deep'
  | 'energized'
  | 'grounded'
  | 'ethereal'
  | 'lofi'
  | 'minimal';
export type LayerTag =
  | 'binaural'
  | 'isochronic'
  | 'monaural'
  | 'noise'
  | 'lofi'
  | 'instrument'
  | 'pad'
  | 'chimes'
  | 'percussion';

export interface Stage {
  readonly atMin: number;
  readonly beatHz: number;
  readonly carrierHz: number;
  readonly gain: number;
  readonly mode: ToneMode;
  readonly noise: NoiseKind;
  readonly noiseLevel: number;
  readonly layers?: Partial<Layers>;
  readonly ramp: boolean;
}

export type Intensity = 1 | 2 | 3 | 4 | 5;

export interface Template {
  readonly id: string;
  readonly name: string;
  readonly category: Category;
  readonly vibe: Vibe;
  readonly tags: readonly string[];
  readonly layerTags: readonly LayerTag[];
  readonly situations: readonly Situation[];
  readonly recommendedMinutes: number;
  readonly intensity: Intensity;
  readonly adhdFriendly: boolean;
  readonly stages: readonly Stage[];
  readonly reasonTemplate: string;
  readonly source?: 'android' | 'gnaural' | 'original';
  readonly breath?: { readonly inSec: number; readonly outSec: number };
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type Sensitivity = 'low' | 'medium' | 'high';
export type DeviceType = 'headphones' | 'bluetooth' | 'speaker';

export interface RecContext {
  readonly situation: Situation;
  readonly vibe?: Vibe;
  readonly availableMinutes: number;
  readonly timeOfDay: TimeOfDay;
  readonly sensorySensitivity: Sensitivity;
  readonly deviceType: DeviceType;
}

export interface Recommendation {
  readonly template: Template;
  readonly score: number;
  readonly reasons: string[];
}

export interface SearchQuery {
  readonly text?: string;
  readonly category?: Category;
  readonly vibe?: Vibe;
  readonly adhdFriendly?: boolean;
  readonly layerTags?: readonly LayerTag[];
}

export const CATEGORIES: readonly Category[] = [
  'vibes', 'healing', 'lucid-dreams', 'meditation', 'sleep', 'adhd-control', 'focus', 'work-recovery',
];
export const SITUATIONS: readonly Situation[] = [
  'adhd-focus', 'cant-sleep', 'lucid-dream', 'meditate', 'heal-stress', 'ai-burnout', 'deep-work', 'quick-reset',
];
export const VIBES: readonly Vibe[] = [
  'calm', 'warm', 'dreamy', 'bright', 'deep', 'energized', 'grounded', 'ethereal', 'lofi', 'minimal',
];
export const LAYER_TAGS: readonly LayerTag[] = [
  'binaural', 'isochronic', 'monaural', 'noise', 'lofi', 'instrument', 'pad', 'chimes', 'percussion',
];
