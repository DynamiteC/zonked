import { ZonkedAudioEngine } from './engine';
import type { AudioEngine } from './types';

export function createEngine(): AudioEngine {
  return new ZonkedAudioEngine();
}
export type { AudioEngine, EngineStatus, EngineStats, TelemetryReader } from './types';
