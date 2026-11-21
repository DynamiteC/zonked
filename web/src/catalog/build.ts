import { buildCategory } from './dsl';
import { ADHD_CONTROL } from './archetypes/adhd-control';
import { FOCUS } from './archetypes/focus';
import { HEALING } from './archetypes/healing';
import { LUCID_DREAMS } from './archetypes/lucid-dreams';
import { MEDITATION } from './archetypes/meditation';
import { SLEEP } from './archetypes/sleep';
import { VIBES } from './archetypes/vibes';
import { WORK_RECOVERY } from './archetypes/work-recovery';
import { buildSeeds } from './seeds';
import { buildStarters } from './starters';
import type { Template } from './types';

/** Build the full catalog from scratch. Pure and deterministic: seeds first, then categories in fixed order. */
export function buildTemplates(): Template[] {
  return [
    ...buildStarters(),
    ...buildSeeds(),
    ...[VIBES, HEALING, LUCID_DREAMS, MEDITATION, SLEEP, ADHD_CONTROL, FOCUS, WORK_RECOVERY].flatMap(buildCategory),
  ];
}
