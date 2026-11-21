/**
 * Synthesized layer parameters shared by the catalog, the player and the audio layer.
 * Mirrors DSP param block slots 8 to 31 (see .kiro/specs/zonked-library/contracts.md C1).
 * All layers are synthesized inside dsp-core. No audio files are ever loaded.
 */

export interface Layers {
  /** Warm low-passed harmonic bed with tape saturation. 0 turns it off. */
  readonly lofiLevel: number; // 0..1
  readonly lofiWarmth: number; // 0..1 (low-pass openness, high is darker)
  readonly crackle: number; // 0..1 sparse vinyl crackle density
  /** Single instrument voice: plucks and drones. */
  readonly instLevel: number; // 0..1
  readonly instKind: number; // integer 0 pluck, 1 drone, 2 fm bell-pluck, 3 piano
  readonly instRootHz: number; // 55..880
  readonly instScale: number; // integer 0..7 (see SCALES)
  readonly instBpm: number; // 30..180 note rate
  /** Multi-instrument chordal pad. */
  readonly padLevel: number; // 0..1
  readonly padChord: number; // integer 0..7 (see CHORDS)
  readonly padRootHz: number; // 55..440
  /** Chimes with bell partials and decay. */
  readonly chimeLevel: number; // 0..1
  readonly chimeRatePerMin: number; // 1..30
  /** Snare and percussion. */
  readonly percLevel: number; // 0..1
  readonly percBpm: number; // 30..180
  readonly percPattern: number; // integer 0..7 (see PERC_PATTERNS)
  /** Slots 24..31 (sound upgrade). */
  readonly lofiProgression: number; // integer 0..7, 0 = static legacy bed (see PROGRESSIONS)
  readonly tapeWow: number; // 0..1 tape wow and flutter depth
  readonly pianoPedal: number; // 0..1 sustain wash (instKind 3)
  readonly breathDepth: number; // 0..1 slow level movement, 0 = off
  readonly breathRateHz: number; // 0.05..0.2
  readonly stereoWidth: number; // 0..1, 0 = mono layer bus
  readonly panDepth: number; // 0..1 slow auto-pan, 0 = off
  readonly panRateHz: number; // 0.02..0.2
}

export const SCALES = ['major-pentatonic', 'minor-pentatonic', 'dorian', 'aeolian', 'lydian', 'whole-tone', 'hirajoshi', 'drone-fifths'] as const;
export const CHORDS = ['maj7', 'min7', 'sus2', 'sus4', 'add9', 'min9', 'maj-open', 'fifths'] as const;
export const PERC_PATTERNS = ['soft-pulse', 'heartbeat', 'backbeat', 'brush-shuffle', 'rim-click', 'sparse-snare', 'double-time', 'half-time'] as const;

export const PROGRESSIONS = ['static', 'minor-lofi', 'major-jazz', 'dorian', 'dream-sus', 'rain-minor', 'warm-major', 'deep-minor'] as const;

export const LAYER_BOUNDS = {
  level: { min: 0, max: 1 },
  instRootHz: { min: 55, max: 880 },
  padRootHz: { min: 55, max: 440 },
  bpm: { min: 30, max: 180 },
  chimeRatePerMin: { min: 1, max: 30 },
  breathRateHz: { min: 0.05, max: 0.2 },
  panRateHz: { min: 0.02, max: 0.2 },
  enumMax: 7,
  instKindMax: 3,
} as const;

export const NO_LAYERS: Layers = Object.freeze({
  lofiLevel: 0,
  lofiWarmth: 0.5,
  crackle: 0,
  instLevel: 0,
  instKind: 0,
  instRootHz: 220,
  instScale: 0,
  instBpm: 60,
  padLevel: 0,
  padChord: 0,
  padRootHz: 110,
  chimeLevel: 0,
  chimeRatePerMin: 6,
  percLevel: 0,
  percBpm: 70,
  percPattern: 0,
  lofiProgression: 0,
  tapeWow: 0,
  pianoPedal: 0,
  breathDepth: 0,
  breathRateHz: 0.1,
  stereoWidth: 0,
  panDepth: 0,
  panRateHz: 0.05,
});

export type LayerKey = keyof Layers;
