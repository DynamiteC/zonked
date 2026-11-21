import { parseCrewState } from '../app/crew';
import type { CrewState } from '../app/crew';
import { readFlag, writeFlag } from '../storage/prefs';

export const BRIDGE_URL = 'http://localhost:43210/events';
export const MAX_EVENT_BYTES = 70000;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

export const CREW_KEY = 'zonked.crew.v1';

const crewListeners = new Set<(on: boolean) => void>();

/**
 * Crew is opt-in. True when the stored flag is '1', or when the page URL has ?crew=1
 * (which also persists the flag). With neither, nothing may touch the network.
 */
export function isCrewEnabled(): boolean {
  try {
    if (typeof location !== 'undefined' && new URLSearchParams(location.search).get('crew') === '1') {
      writeFlag(CREW_KEY, true);
      return true;
    }
  } catch {
    /* no usable location: fall back to the stored flag */
  }
  return readFlag(CREW_KEY);
}

/** Stores the choice and tells every running client to connect or disconnect at once. */
export function setCrewEnabled(on: boolean): void {
  writeFlag(CREW_KEY, on);
  for (const fn of [...crewListeners]) {
    try {
      fn(on);
    } catch {
      /* a listener fault must not block the others */
    }
  }
}

export function onCrewChange(fn: (on: boolean) => void): () => void {
  crewListeners.add(fn);
  return () => {
    crewListeners.delete(fn);
  };
}

export type BridgeStatus = 'connected' | 'standalone';

export interface EventSourceLike {
  addEventListener(type: string, listener: (ev: { data?: unknown }) => void): void;
  close(): void;
}

export interface BridgeDeps {
  readonly url?: string;
  /** Opt-in check. Default: true when `create` is injected (tests), else isCrewEnabled(). */
  readonly enabled?: () => boolean;
  readonly create?: (url: string) => EventSourceLike | null;
  readonly setTimer?: (fn: () => void, ms: number) => unknown;
  readonly clearTimer?: (handle: unknown) => void;
  readonly onState: (state: CrewState) => void;
  readonly onStatus: (status: BridgeStatus) => void;
}

export function backoffDelay(attempt: number): number {
  const a = Number.isFinite(attempt) ? Math.max(0, Math.floor(attempt)) : 0;
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** Math.min(a, 10));
}

function defaultCreate(url: string): EventSourceLike | null {
  return typeof EventSource === 'undefined' ? null : new EventSource(url);
}

/** Loopback SSE client. Never throws; falls back silently to standalone. */
export class BridgeClient {
  private es: EventSourceLike | null = null;
  private timer: unknown = null;
  private attempt = 0;
  private stopped = true;
  private wanted = false;
  private unsub: (() => void) | null = null;
  private status: BridgeStatus = 'standalone';

  constructor(private readonly deps: BridgeDeps) {}

  getStatus(): BridgeStatus {
    return this.status;
  }

  /** Marks the client as running. It connects only while crew is enabled. */
  start(): void {
    if (this.wanted) return;
    this.wanted = true;
    this.unsub = onCrewChange(() => this.sync());
    this.sync();
  }

  stop(): void {
    this.wanted = false;
    this.unsub?.();
    this.unsub = null;
    this.sync();
  }

  private isEnabled(): boolean {
    if (this.deps.enabled) return this.deps.enabled();
    return this.deps.create !== undefined || isCrewEnabled();
  }

  private sync(): void {
    const run = this.wanted && this.isEnabled();
    if (run && this.stopped) {
      this.stopped = false;
      this.attempt = 0;
      this.connect();
    } else if (!run && !this.stopped) {
      this.stopped = true;
      this.clearTimer();
      this.closeSource();
      this.setStatus('standalone');
    }
  }

  private connect(): void {
    if (this.stopped) return;
    const create = this.deps.create ?? defaultCreate;
    let es: EventSourceLike | null = null;
    try {
      es = create(this.deps.url ?? BRIDGE_URL);
    } catch {
      es = null;
    }
    if (es === null) {
      this.scheduleRetry();
      return;
    }
    this.es = es;
    es.addEventListener('open', () => {
      if (this.es !== es) return;
      this.attempt = 0;
      this.setStatus('connected');
    });
    es.addEventListener('state', (ev) => {
      if (this.es === es) this.handleState(ev.data);
    });
    es.addEventListener('error', () => {
      if (this.es !== es) return;
      this.closeSource();
      this.setStatus('standalone');
      this.scheduleRetry();
    });
  }

  private handleState(data: unknown): void {
    if (typeof data !== 'string' || data.length > MAX_EVENT_BYTES) return;
    let raw: unknown;
    try {
      raw = JSON.parse(data);
    } catch {
      return;
    }
    const state = parseCrewState(raw);
    if (state === null) return;
    try {
      this.deps.onState(state);
    } catch {
      /* a consumer fault must not break the connection */
    }
  }

  private scheduleRetry(): void {
    if (this.stopped) return;
    const delay = backoffDelay(this.attempt);
    this.attempt += 1;
    const set = this.deps.setTimer ?? ((fn: () => void, ms: number): unknown => setTimeout(fn, ms));
    this.timer = set(() => {
      this.timer = null;
      this.connect();
    }, delay);
  }

  private clearTimer(): void {
    if (this.timer === null) return;
    const clear = this.deps.clearTimer ?? ((h: unknown): void => clearTimeout(h as number));
    clear(this.timer);
    this.timer = null;
  }

  private closeSource(): void {
    const es = this.es;
    this.es = null;
    try {
      es?.close();
    } catch {
      /* already closed */
    }
  }

  private setStatus(next: BridgeStatus): void {
    if (this.status === next) return;
    this.status = next;
    try {
      this.deps.onStatus(next);
    } catch {
      /* consumer fault */
    }
  }
}
