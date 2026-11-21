import type { AudioEngine, EngineStats, EngineStatus } from '../audio/types';
import type { Layers } from '../sbg/layers';
import type { TimerState } from './timers';

export interface ZonkedE2E {
  getStats(): Promise<EngineStats>;
  readonly status: EngineStatus;
  readonly presetId: string;
  setLayers(partial: Partial<Layers>): void;
  readonly templateId: string | null;
  readonly timer: TimerState | null;
  readonly queueIndex: number;
}

/** Subset of the player the e2e hook reads. */
export interface E2EPlayer {
  setLayerOverride(p: Partial<Layers>): void;
  snapshot(): { templateId: string | null; timer: TimerState; queueIndex: number };
}

declare global {
  interface Window {
    __zonked?: ZonkedE2E;
  }
}

/** Exposes test hooks only when the URL has ?e2e=1. Returns true when installed. */
export function installE2E(
  win: Window,
  engine: Pick<AudioEngine, 'status' | 'getStats'>,
  getPresetId: () => string,
  player?: E2EPlayer,
): boolean {
  if (new URLSearchParams(win.location.search).get('e2e') !== '1') return false;
  win.__zonked = {
    getStats: () => engine.getStats(),
    get status() {
      return engine.status;
    },
    get presetId() {
      return getPresetId();
    },
    setLayers: (p) => player?.setLayerOverride(p),
    get templateId() {
      return player?.snapshot().templateId ?? null;
    },
    get timer() {
      return player?.snapshot().timer ?? null;
    },
    get queueIndex() {
      return player?.snapshot().queueIndex ?? -1;
    },
  };
  return true;
}
