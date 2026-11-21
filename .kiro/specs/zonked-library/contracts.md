# Zonked Library: Contracts

## C1. DSP ABI extension (crates/dsp-core)

Existing exports stay unchanged. Param block grows from 8 to 32 f32 slots. Slots 0 to 7 are unchanged. `zk_param_block()` still returns the pointer. A host that only writes slots 0 to 7 keeps working (new slots default to 0, layers off). Add export `zk_param_count() -> u32` returning 32.

| Slot | Name | Range |
|---|---|---|
| 8 | lofi_level | 0..1 |
| 9 | lofi_warmth | 0..1 |
| 10 | crackle | 0..1 |
| 11 | inst_level | 0..1 |
| 12 | inst_kind | int 0 pluck, 1 drone, 2 fm bell-pluck |
| 13 | inst_root_hz | 55..880 |
| 14 | inst_scale | int 0..7 |
| 15 | inst_bpm | 30..180 |
| 16 | pad_level | 0..1 |
| 17 | pad_chord | int 0..7 |
| 18 | pad_root_hz | 55..440 |
| 19 | chime_level | 0..1 |
| 20 | chime_rate_per_min | 1..30 |
| 21 | perc_level | 0..1 |
| 22 | perc_bpm | 30..180 |
| 23 | perc_pattern | int 0..7 |
| 24..31 | reserved | 0 |

Names and enum orders match `web/src/sbg/layers.ts` exactly. All layer levels are smoothed per sample. Note and hit scheduling is deterministic (seeded Xoshiro, fixed tables), no allocation, O(1) per sample. Layers sum with the tone and noise bed before the master gain and limiter. Layer budgets are tuned so layers are clearly audible; with all layers and no noise bed the worst case is (0.4 + 0.7) x 0.85 = 0.935, and a single loud layer plus the full tone can reach about 1.18 before the limiter, which always guarantees [-0.95, 0.95]. Layers are silent when levels are 0 and cost a constant number of operations regardless.

## C2. Voice type

`Voice` gains optional `layers?: Layers` (done in web/src/sbg/types.ts, defaults in `NO_LAYERS`). `voiceAt` interpolates numeric layer fields linearly and snaps integer fields (kind, scale, chord, pattern) at the event boundary. Param block mapping writes slots 8 to 23 from `voice.layers ?? NO_LAYERS`, with clamps.

## C3. Catalog (web/src/catalog, pure TypeScript, no DOM)

```ts
export type Category = 'vibes'|'healing'|'lucid-dreams'|'meditation'|'sleep'|'adhd-control'|'focus'|'work-recovery';
export type Situation = 'adhd-focus'|'cant-sleep'|'lucid-dream'|'meditate'|'heal-stress'|'ai-burnout'|'deep-work'|'quick-reset';
export type Vibe = 'calm'|'warm'|'dreamy'|'bright'|'deep'|'energized'|'grounded'|'ethereal'|'lofi'|'minimal';
export type LayerTag = 'binaural'|'isochronic'|'monaural'|'noise'|'lofi'|'instrument'|'pad'|'chimes'|'percussion';
export interface Stage { atMin: number; beatHz: number; carrierHz: number; gain: number; mode: ToneMode; noise: NoiseKind; noiseLevel: number; layers?: Partial<Layers>; ramp: boolean }
export interface Template {
  id: string; name: string; category: Category; vibe: Vibe; tags: readonly string[]; layerTags: readonly LayerTag[];
  situations: readonly Situation[]; recommendedMinutes: number; intensity: 1|2|3|4|5; adhdFriendly: boolean;
  stages: readonly Stage[]; reasonTemplate: string; source?: 'android'|'gnaural'|'original'; breath?: {inSec:number;outSec:number};
}
export const TEMPLATES: readonly Template[];            // >= 210, unique ids, deterministic order
export function templateToEvents(t: Template): SbgEvent[]; // for the existing sequencer, safety clamped
export interface RecContext { situation: Situation; vibe?: Vibe; availableMinutes: number; timeOfDay: 'morning'|'afternoon'|'evening'|'night'; sensorySensitivity: 'low'|'medium'|'high'; deviceType: 'headphones'|'bluetooth'|'speaker' }
export interface Recommendation { template: Template; score: number; reasons: string[] }
export function recommendTemplates(ctx: RecContext, limit?: number): Recommendation[]; // pure, >= 5 by default (limit default 5)
export function searchTemplates(q: { text?: string; category?: Category; vibe?: Vibe; adhdFriendly?: boolean; layerTags?: LayerTag[] }): Template[];
```
Binaural templates for speaker device get a monaural or isochronic swap warning in reasons (binaural needs headphones). High sensory sensitivity caps intensity at 3 and avoids percussion and crackle.

## C4. Player and timers (web/src/app, pure, fake-clock testable)

```ts
export type TimerKind = 'none'|'countdown'|'sleep-fade'|'pomodoro';
export interface TimerState { kind: TimerKind; running: boolean; remainingSec: number; totalSec: number; phase?: 'focus'|'break'; cycle?: number; focusMin?: number; breakMin?: number }
Player additions: playTemplate(t: Template), nextTemplate(), prevTemplate(), setQueue(ts: Template[]), startTimer(spec), stopTimer(), cycleTimer(), setMuted(b), nudgeGain(delta), snapshot() gains {templateId, timer: TimerState, muted, gainScale, queueIndex}.
```
Gain scale never exceeds 0.85 total. Timer state persists in localStorage (`zonked.timer.v1`) and restores paused. Sleep fade: over N minutes, beat glides toward 2.5 Hz (delta) and gain scale to 0, then stop with a final fade of at least 5 s.

## C5. Shortcuts (web/src/app/shortcuts.ts)

`export const SHORTCUTS: readonly { keys: string[]; label: string; action: ActionId }[]`, `resolveShortcut(e: {key:string; ctrlKey..}): ActionId | undefined`, help renders from the same array. Ignored when focus is in input, select, textarea.
