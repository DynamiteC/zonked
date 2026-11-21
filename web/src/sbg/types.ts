import type { Layers } from './layers';

export type NoiseKind = 'off' | 'white' | 'pink' | 'brown' | 'violet';
export type ToneMode = 'binaural' | 'monaural' | 'isochronic';

export interface Voice {
  readonly carrierHz: number;
  readonly beatHz: number;
  readonly noise: NoiseKind;
  readonly noiseLevel: number;
  readonly mode: ToneMode;
  readonly gain: number;
  /** Optional synthesized layers. Absent means all layers off. */
  readonly layers?: Layers;
}

export interface SbgEvent {
  readonly tSec: number;
  readonly voice: Voice;
  /** True when the voice ramps linearly from this event to the next one (SBaGen "->"). */
  readonly ramp: boolean;
  readonly line: number;
}

export interface Diagnostic {
  readonly line: number;
  readonly severity: 'error' | 'warning';
  readonly message: string;
}

export interface ParseResult {
  readonly events: SbgEvent[];
  readonly durationSec: number;
  readonly diagnostics: Diagnostic[];
  readonly ok: boolean;
}

export interface Preset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly sbg: string;
  readonly breath?: { readonly inSec: number; readonly outSec: number };
}
