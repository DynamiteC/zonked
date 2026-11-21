import type { Clock } from './player';

export type TimerKind = 'none' | 'countdown' | 'sleep-fade' | 'pomodoro';

export interface TimerState {
  readonly kind: TimerKind;
  readonly running: boolean;
  readonly remainingSec: number;
  readonly totalSec: number;
  readonly phase?: 'focus' | 'break';
  readonly cycle?: number;
  readonly focusMin?: number;
  readonly breakMin?: number;
  /** Sleep fade only: true during the final fade after the main glide. */
  readonly finalFade?: boolean;
}

export type TimerSpec =
  | { readonly kind: 'countdown'; readonly minutes: number }
  | { readonly kind: 'sleep-fade'; readonly minutes: number }
  | {
      readonly kind: 'pomodoro';
      readonly focusMin?: number;
      readonly breakMin?: number;
      /** Optional long break after every `longEvery` focus phases. */
      readonly longBreakMin?: number;
      readonly longEvery?: number;
    };

export interface TimerEffects {
  /** Multiplier on gain, 0..1. */
  readonly gainScale: number;
  /** 0..1 weight of the glide toward SLEEP_TARGET_BEAT_HZ. */
  readonly beatMix: number;
}

export interface TimerStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const TIMER_STORAGE_KEY = 'zonked.timer.v1';
export const SLEEP_TARGET_BEAT_HZ = 2.5;
/** Gain scale reached at the end of the main sleep glide, before the final fade. */
export const SLEEP_FLOOR_SCALE = 0.1;
export const FINAL_FADE_SEC = 6;
export const DEFAULTS = { countdownMin: 30, sleepMin: 30, focusMin: 25, breakMin: 5 } as const;
const MIN_MIN = 1;
const MAX_MIN = 720;
const POLL_MS = 500;
const CYCLE_ORDER: readonly TimerKind[] = ['none', 'countdown', 'sleep-fade', 'pomodoro'];

const NONE: TimerState = { kind: 'none', running: false, remainingSec: 0, totalSec: 0 };

const clampMin = (v: number | undefined, fb: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(MAX_MIN, Math.max(MIN_MIN, v)) : fb;

interface Persisted {
  v: 1;
  spec: TimerSpec;
  elapsedMs: number;
  phase: 'focus' | 'break';
  cycle: number;
}

export type TimerEndKind = 'countdown' | 'sleep-fade';

/** Pure timer state machine on an injected Clock. Persists to storage and restores paused. */
export class TimerController {
  private readonly listeners = new Set<(s: TimerState) => void>();
  private spec: TimerSpec | null = null;
  private running = false;
  private elapsedMs = 0;
  private lastMs = 0;
  private phase: 'focus' | 'break' = 'focus';
  private cycle = 1;
  private poll: number | null = null;
  private lastKey = '';
  /** Called once when a countdown or sleep fade completes (state is already reset to none). */
  onEnd: ((kind: TimerEndKind) => void) | null = null;

  constructor(private readonly clock: Clock, private readonly storage: TimerStorage | null = null) {
    this.restore();
  }

  subscribe(fn: (s: TimerState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  state(): TimerState {
    this.advance();
    return this.build();
  }

  start(spec: TimerSpec): TimerState {
    this.spec = this.normalize(spec);
    this.elapsedMs = 0;
    this.phase = 'focus';
    this.cycle = 1;
    this.run();
    return this.changed();
  }

  stop(): TimerState {
    this.spec = null;
    this.running = false;
    this.elapsedMs = 0;
    this.stopPoll();
    return this.changed();
  }

  pause(): TimerState {
    this.advance();
    if (this.spec !== null && this.running) {
      this.running = false;
      this.stopPoll();
    }
    return this.changed();
  }

  resume(): TimerState {
    if (this.spec !== null && !this.running) this.run();
    return this.changed();
  }

  /** none, countdown, sleep-fade, pomodoro, none... Starts the next kind with default minutes. */
  cycleNext(): TimerState {
    const cur = this.spec?.kind ?? 'none';
    const next = CYCLE_ORDER[(CYCLE_ORDER.indexOf(cur) + 1) % CYCLE_ORDER.length] ?? 'none';
    if (next === 'none') return this.stop();
    if (next === 'countdown') return this.start({ kind: 'countdown', minutes: DEFAULTS.countdownMin });
    if (next === 'sleep-fade') return this.start({ kind: 'sleep-fade', minutes: DEFAULTS.sleepMin });
    return this.start({ kind: 'pomodoro' });
  }

  /** Moves within the current segment by deltaSec (negative rewinds). Clamps to [0, total). */
  seekBy(deltaSec: number): TimerState {
    this.advance();
    if (this.spec === null || !Number.isFinite(deltaSec)) return this.build();
    const total = this.segmentMs();
    this.elapsedMs = Math.min(Math.max(0, this.elapsedMs + deltaSec * 1000), Math.max(0, total - 1));
    return this.changed();
  }

  /** Gain scale and beat glide for the current moment. Advances the timer first. */
  effects(): TimerEffects {
    this.advance();
    const s = this.spec;
    if (s === null || s.kind !== 'sleep-fade') return { gainScale: 1, beatMix: 0 };
    const mainMs = this.segmentMs();
    const p = Math.min(1, this.elapsedMs / mainMs);
    if (this.elapsedMs <= mainMs) return { gainScale: 1 - (1 - SLEEP_FLOOR_SCALE) * p, beatMix: p };
    const q = Math.min(1, (this.elapsedMs - mainMs) / (FINAL_FADE_SEC * 1000));
    return { gainScale: SLEEP_FLOOR_SCALE * (1 - q), beatMix: 1 };
  }

  private normalize(spec: TimerSpec): TimerSpec {
    if (spec.kind === 'pomodoro') {
      const longEvery = spec.longEvery !== undefined && Number.isFinite(spec.longEvery) ? Math.max(2, Math.floor(spec.longEvery)) : undefined;
      return {
        kind: 'pomodoro',
        focusMin: clampMin(spec.focusMin, DEFAULTS.focusMin),
        breakMin: clampMin(spec.breakMin, DEFAULTS.breakMin),
        ...(spec.longBreakMin !== undefined && longEvery !== undefined
          ? { longBreakMin: clampMin(spec.longBreakMin, 15), longEvery }
          : {}),
      };
    }
    return { kind: spec.kind, minutes: clampMin(spec.minutes, spec.kind === 'countdown' ? DEFAULTS.countdownMin : DEFAULTS.sleepMin) };
  }

  /** Length of the current segment in ms (phase length for pomodoro, N minutes otherwise). */
  private segmentMs(): number {
    const s = this.spec;
    if (s === null) return 0;
    if (s.kind !== 'pomodoro') return s.minutes * 60_000;
    if (this.phase === 'focus') return (s.focusMin ?? DEFAULTS.focusMin) * 60_000;
    const long = s.longBreakMin !== undefined && s.longEvery !== undefined && this.cycle % s.longEvery === 0;
    return (long ? s.longBreakMin ?? 0 : s.breakMin ?? DEFAULTS.breakMin) * 60_000;
  }

  private run(): void {
    this.running = true;
    this.lastMs = this.clock.now();
    this.startPoll();
  }

  private startPoll(): void {
    if (this.poll === null) this.poll = this.clock.setInterval(() => void this.changed(), POLL_MS);
  }

  private stopPoll(): void {
    if (this.poll !== null) this.clock.clearInterval(this.poll);
    this.poll = null;
  }

  private advance(): void {
    if (!this.running || this.spec === null) return;
    const now = this.clock.now();
    const dt = Math.max(0, now - this.lastMs);
    this.lastMs = now;
    this.elapsedMs += dt;
    const s = this.spec;
    if (s.kind === 'pomodoro') this.rollPomodoro();
    else if (s.kind === 'countdown' && this.elapsedMs >= this.segmentMs()) this.finish('countdown');
    else if (s.kind === 'sleep-fade' && this.elapsedMs >= this.segmentMs() + FINAL_FADE_SEC * 1000) this.finish('sleep-fade');
  }

  private rollPomodoro(): void {
    for (let guard = 0; guard < 1000; guard++) {
      const seg = this.segmentMs();
      if (this.elapsedMs < seg) return;
      this.elapsedMs -= seg;
      if (this.phase === 'focus') this.phase = 'break';
      else {
        this.phase = 'focus';
        this.cycle += 1;
      }
    }
    this.elapsedMs = 0;
  }

  private finish(kind: TimerEndKind): void {
    this.spec = null;
    this.running = false;
    this.elapsedMs = 0;
    this.stopPoll();
    this.persist();
    this.notify(this.build());
    this.onEnd?.(kind);
  }

  private build(): TimerState {
    const s = this.spec;
    if (s === null) return NONE;
    const total = this.segmentMs() / 1000;
    const remaining = Math.max(0, Math.ceil(total - this.elapsedMs / 1000));
    if (s.kind === 'pomodoro') {
      return {
        kind: 'pomodoro', running: this.running, remainingSec: remaining, totalSec: total,
        phase: this.phase, cycle: this.cycle, focusMin: s.focusMin, breakMin: s.breakMin,
      };
    }
    const base: TimerState = { kind: s.kind, running: this.running, remainingSec: remaining, totalSec: total };
    return s.kind === 'sleep-fade' && this.elapsedMs > this.segmentMs() ? { ...base, finalFade: true } : base;
  }

  /** Advances, persists and notifies when the visible state changed. */
  private changed(): TimerState {
    this.advance();
    const st = this.build();
    const key = `${st.kind}|${st.running}|${st.remainingSec}|${st.phase ?? ''}|${st.cycle ?? 0}|${st.finalFade === true}`;
    if (key !== this.lastKey) {
      this.lastKey = key;
      this.persist();
      this.notify(st);
    }
    return st;
  }

  private notify(st: TimerState): void {
    for (const l of this.listeners) l(st);
  }

  private persist(): void {
    if (this.storage === null) return;
    try {
      if (this.spec === null) {
        this.storage.removeItem(TIMER_STORAGE_KEY);
        return;
      }
      const p: Persisted = { v: 1, spec: this.spec, elapsedMs: this.elapsedMs, phase: this.phase, cycle: this.cycle };
      this.storage.setItem(TIMER_STORAGE_KEY, JSON.stringify(p));
    } catch {
      /* storage may be full or blocked; the timer still works in memory */
    }
  }

  private restore(): void {
    if (this.storage === null) return;
    try {
      const raw = this.storage.getItem(TIMER_STORAGE_KEY);
      if (raw === null) return;
      const p = JSON.parse(raw) as Partial<Persisted>;
      if (p.v !== 1 || p.spec === undefined || p.spec === null || typeof p.spec !== 'object') return;
      if (!['countdown', 'sleep-fade', 'pomodoro'].includes(p.spec.kind)) return;
      this.spec = this.normalize(p.spec);
      this.phase = p.phase === 'break' ? 'break' : 'focus';
      this.cycle = typeof p.cycle === 'number' && Number.isFinite(p.cycle) ? Math.max(1, Math.floor(p.cycle)) : 1;
      const e = typeof p.elapsedMs === 'number' && Number.isFinite(p.elapsedMs) ? p.elapsedMs : 0;
      this.elapsedMs = Math.min(Math.max(0, e), Math.max(0, this.segmentMs() - 1));
      this.running = false;
    } catch {
      this.spec = null;
    }
  }
}
