import type { Voice } from '../sbg/types';

/** Snapshot of the audio graph health, shown in the HUD and used by E2E. */
export interface EngineStatus {
  state: 'idle' | 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
  sampleRate: number;
  usesSharedMemory: boolean;
  crossOriginIsolated: boolean;
  error?: string;
}

/** Output statistics measured inside the AudioWorklet (for E2E and the HUD). */
export interface EngineStats {
  peak: number;
  rms: number;
  frames: number;
  nonZero: number;
}

/** Copy-out view of the telemetry ring: interleaved stereo float32. */
export interface TelemetryReader {
  /** Copies up to out.length/2 newest frames into out. Returns frames copied. Never allocates. */
  read(out: Float32Array): number;
}

/** AudioContext states plus Safari's 'interrupted' and 'none' before creation. */
export type AudioContextStateLike = 'none' | 'suspended' | 'running' | 'closed' | 'interrupted';

/** Public surface of the audio layer. The UI depends only on this. */
export interface AudioEngine {
  readonly status: EngineStatus;
  readonly telemetry: TelemetryReader;
  /** Must be called from a user gesture. Ramps gain up over at least 2 s. */
  start(initial: Voice): Promise<void>;
  /** Ramps down over at least 250 ms, then suspends. */
  stop(): Promise<void>;
  /** Sets the target voice. rampSec is the smoothing scale (0.05 to 30). Clamps all values. */
  setVoice(voice: Voice, rampSec?: number): void;
  /** Asks the worklet for output statistics. */
  getStats(): Promise<EngineStats>;
  /** Raw AudioContext state ('none' before the graph exists). Optional: older engines omit it. */
  contextState?(): AudioContextStateLike;
  /**
   * Resumes a context the browser suspended or interrupted while the engine is running.
   * Never starts a stopped engine. Resolves true when the context is running afterwards.
   */
  resume?(): Promise<boolean>;
  /** Called whenever status changes. Returns an unsubscribe function. */
  onStatus(listener: (s: EngineStatus) => void): () => void;
}
