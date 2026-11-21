import { PRESETS, parseSbg, voiceAt } from '../sbg';
import { totalDuration } from '../sbg/sequencer';
import type { Diagnostic, Preset, SbgEvent, Voice } from '../sbg';
import type { NoiseKind } from '../sbg/types';
import { LAYER_BOUNDS, NO_LAYERS } from '../sbg/layers';
import type { LayerKey, Layers } from '../sbg/layers';
import type { AudioEngine } from '../audio/types';
import type { CrewState } from './crew';
import type { Mix, MixDraft } from './mixes';
import { SLEEP_TARGET_BEAT_HZ, TimerController } from './timers';
import type { TimerSpec, TimerState, TimerStorage } from './timers';

export interface Clock {
  /** Epoch milliseconds. */
  now(): number;
  setInterval(fn: () => void, ms: number): number;
  clearInterval(id: number): void;
}

export const realClock: Clock = {
  now: () => Date.now(),
  setInterval: (fn, ms) => window.setInterval(fn, ms),
  clearInterval: (id) => window.clearInterval(id),
};

export interface SessionLog {
  readonly startedAt: number;
  readonly endedAt: number;
  readonly peakScore: number;
  readonly presetId: string;
  /** How the session ended. Absent on logs written before storage v2. */
  readonly endKind?: 'manual' | 'countdown' | 'sleep-fade';
  /** Pomodoro breaks that began during the session. */
  readonly breaks?: number;
}

export type PlayerSource = 'preset' | 'crew' | 'custom' | 'template';

/** Structural subset of catalog Template, so the player does not depend on the catalog at runtime. */
export interface TemplateLike {
  readonly id: string;
  readonly name: string;
  readonly recommendedMinutes: number;
  readonly category: string;
  readonly vibe: string;
}

export interface PlayerOptions {
  /** Converts a template to sequencer events (catalog templateToEvents). Required for playTemplate. */
  readonly toEvents?: (t: TemplateLike) => SbgEvent[];
  /** Timer persistence. Defaults to window.localStorage when available. Pass null to disable. */
  readonly storage?: TimerStorage | null;
}

export interface PositionState {
  readonly durationSec: number;
  readonly positionSec: number;
}

export interface NoiseOverride {
  readonly noise?: NoiseKind;
  readonly noiseLevel?: number;
}

export const NOISE_KINDS: readonly NoiseKind[] = ['off', 'white', 'pink', 'brown', 'violet'];

/** Hearing-safety cap on the final gain (standards section 2). */
export const MAX_GAIN = 0.85;
export const GAIN_STEP = 0.05;
/** Calm target for pomodoro breaks: the voice glides to at most this beat (alpha/theta border). */
export const BREAK_BEAT_HZ = 8;
const BREAK_GLIDE_SEC = 3;

export interface PlayerSnapshot {
  readonly playing: boolean;
  readonly source: PlayerSource;
  readonly presetId: string;
  readonly overridden: boolean;
  readonly voice: Voice;
  readonly elapsedSec: number;
  readonly burnout: number | null;
  readonly breathe: boolean;
  readonly templateId: string | null;
  readonly templateName: string | null;
  readonly templateCategory: string | null;
  readonly queueIndex: number;
  readonly queueLength: number;
  readonly muted: boolean;
  /** Timer gain multiplier 0..1 (sleep fade). */
  readonly gainScale: number;
  /** User volume offset added to the voice gain, within the safe cap. */
  readonly gainTrim: number;
  readonly timer: TimerState;
  /** Mixer overrides applied over the voice layers (empty when none). */
  readonly layerOverrides: Partial<Layers>;
  /** Beat frequency forced by the listener (Hz), or null. */
  readonly beatOverride: number | null;
  /** Noise kind or level forced by the listener, or null. */
  readonly noiseOverride: NoiseOverride | null;
}

/** Clamps one layer override to the contract bounds (integers for enum fields). */
export function clampLayerValue(key: LayerKey, v: number): number {
  const n = Number.isFinite(v) ? v : NO_LAYERS[key];
  const B = LAYER_BOUNDS;
  switch (key) {
    case 'instRootHz': return clampNum(n, B.instRootHz.min, B.instRootHz.max);
    case 'padRootHz': return clampNum(n, B.padRootHz.min, B.padRootHz.max);
    case 'instBpm':
    case 'percBpm': return clampNum(n, B.bpm.min, B.bpm.max);
    case 'chimeRatePerMin': return clampNum(n, B.chimeRatePerMin.min, B.chimeRatePerMin.max);
    case 'breathRateHz': return clampNum(n, B.breathRateHz.min, B.breathRateHz.max);
    case 'panRateHz': return clampNum(n, B.panRateHz.min, B.panRateHz.max);
    case 'instKind': return Math.round(clampNum(n, 0, B.instKindMax));
    case 'instScale':
    case 'padChord':
    case 'lofiProgression':
    case 'percPattern': return Math.round(clampNum(n, 0, B.enumMax));
    default: return clampNum(n, B.level.min, B.level.max);
  }
}

type Mode =
  | { kind: 'script'; events: readonly SbgEvent[]; startMs: number }
  | { kind: 'transition'; from: Voice; to: Voice; startMs: number; durMs: number }
  | { kind: 'hold'; voice: Voice };

type EnginePort = Pick<AudioEngine, 'start' | 'stop' | 'setVoice'> & Partial<Pick<AudioEngine, 'status'>>;

export const TICK_MS = 100;
const TICK_RAMP_SEC = 0.25;
const SWITCH_RAMP_SEC = 3;
/** Maximum rise of crew-driven gain (per second) in tick. */
export const CREW_GAIN_SLEW_PER_SEC = 0.02;

const lerp = (a: number, b: number, f: number): number => a + (b - a) * f;

const clampNum = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);
const finiteOr = (v: number, fb: number): number => (Number.isFinite(v) ? v : fb);

function defaultStorage(): TimerStorage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function blend(a: Voice, b: Voice, f: number): Voice {
  return {
    ...b,
    carrierHz: lerp(a.carrierHz, b.carrierHz, f),
    beatHz: lerp(a.beatHz, b.beatHz, f),
    gain: lerp(a.gain, b.gain, f),
  };
}

export function presetById(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? (PRESETS[0] as Preset);
}

export class Player {
  private readonly listeners = new Set<(s: PlayerSnapshot) => void>();
  private mode: Mode;
  private base: Voice;
  private current: Voice;
  private template: TemplateLike | null = null;
  private queue: readonly TemplateLike[] = [];
  private queueIndex = -1;
  private muted = false;
  private gainTrim = 0;
  /** Effective gain (before timer scale) at the last user action; crew-driven gain never exceeds it. */
  private userCeiling = 0;
  /** Slew-limited crew gain level (before timer scale). */
  private crewLevel = 0;
  /** Last raw gain the listener was given (before mute and timer scale). */
  private heardRaw = 0;
  private wantPlaying = false;
  private opTail: Promise<void> = Promise.resolve();
  private opCount = 0;
  private layerOverrides: Partial<Layers> = {};
  private gainScale = 1;
  private beatOverride: number | null = null;
  private noiseOverride: NoiseOverride | null = null;
  private breakMix = 0;
  private lastTickMs = 0;
  private readonly toEvents: ((t: TemplateLike) => SbgEvent[]) | undefined;
  private readonly timers: TimerController;
  private presetId: string;
  private source: PlayerSource = 'preset';
  private overridden = false;
  private latestCrew: CrewState | null = null;
  private burnout: number | null = null;
  private breathe = false;
  private peak = 0;
  private endKind: 'manual' | 'countdown' | 'sleep-fade' = 'manual';
  private breakCount = 0;
  private lastPhase: string | undefined;
  private playing = false;
  private startedAt = 0;
  private timer: number | null = null;

  constructor(
    private readonly engine: EnginePort,
    private readonly clock: Clock,
    private readonly onSession?: (log: SessionLog) => void,
    opts: PlayerOptions = {},
  ) {
    this.toEvents = opts.toEvents;
    this.timers = new TimerController(clock, opts.storage === undefined ? defaultStorage() : opts.storage);
    this.timers.subscribe(() => {
      const phase = this.timers.state().phase;
      if (this.playing && phase === 'break' && this.lastPhase !== 'break') this.breakCount += 1;
      this.lastPhase = phase;
      this.emit();
    });
    this.timers.onEnd = (kind) => {
      this.endKind = kind;
      void this.stop();
    };
    const first = presetById(PRESETS[0]?.id ?? '');
    this.presetId = first.id;
    const events = parseSbg(first.sbg).events;
    this.base = voiceAt(events, 0);
    this.current = this.base;
    this.userCeiling = clampNum(this.base.gain, 0, MAX_GAIN);
    this.crewLevel = this.userCeiling;
    this.heardRaw = this.userCeiling;
    this.mode = { kind: 'script', events, startMs: clock.now() };
  }

  subscribe(fn: (s: PlayerSnapshot) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  snapshot(): PlayerSnapshot {
    return {
      playing: this.playing,
      source: this.source,
      presetId: this.presetId,
      overridden: this.overridden,
      voice: this.current,
      elapsedSec: this.playing ? (this.clock.now() - this.startedAt) / 1000 : 0,
      burnout: this.burnout,
      breathe: this.breathe,
      templateId: this.template?.id ?? null,
      templateName: this.template?.name ?? null,
      templateCategory: this.template?.category ?? null,
      queueIndex: this.queueIndex,
      queueLength: this.queue.length,
      muted: this.muted,
      gainScale: this.gainScale,
      gainTrim: this.gainTrim,
      timer: this.timers.state(),
      layerOverrides: this.layerOverrides,
      beatOverride: this.beatOverride,
      noiseOverride: this.noiseOverride,
    };
  }

  // ---- queue and templates ----

  setQueue(ts: readonly TemplateLike[]): void {
    this.queue = [...ts];
    const id = this.template?.id;
    this.queueIndex = id === undefined ? -1 : this.queue.findIndex((t) => t.id === id);
    this.emit();
  }

  /** Plays a template through the injected toEvents. Resolves false when it cannot be played. */
  async playTemplate(t: TemplateLike): Promise<boolean> {
    const i = this.queue.findIndex((q) => q.id === t.id);
    return this.playAt(t, i);
  }

  async nextTemplate(): Promise<boolean> {
    return this.step(1);
  }

  async prevTemplate(): Promise<boolean> {
    return this.step(-1);
  }

  private async step(dir: 1 | -1): Promise<boolean> {
    const n = this.queue.length;
    if (n === 0) return false;
    const from = this.queueIndex < 0 ? (dir === 1 ? -1 : 0) : this.queueIndex;
    const i = (from + dir + n) % n;
    const t = this.queue[i];
    return t === undefined ? false : this.playAt(t, i);
  }

  private async playAt(t: TemplateLike, index: number): Promise<boolean> {
    const events = this.toEvents?.(t) ?? [];
    if (events.length === 0) return false;
    this.overridden = true;
    this.source = 'template';
    this.template = t;
    this.queueIndex = index;
    this.gainTrim = 0;
    this.clearVoiceOverrides();
    this.startScript(events);
    if (!this.playing) await this.play();
    return true;
  }

  // ---- gain ----

  setMuted(muted: boolean): void {
    if (muted && !this.muted) this.captureUserLevel(0);
    this.muted = muted;
    this.applyNow();
  }

  toggleMute(): void {
    this.setMuted(!this.muted);
  }

  /** Adds delta (use +/- GAIN_STEP) to the user volume offset. Final gain never exceeds MAX_GAIN. */
  nudgeGain(delta: number): void {
    if (!Number.isFinite(delta)) return;
    const baseGain = this.base.gain;
    const t = Math.round((this.gainTrim + delta) * 1000) / 1000;
    const before = this.gainTrim;
    this.gainTrim = clampNum(t, -baseGain, Math.max(0, MAX_GAIN - baseGain));
    this.captureUserLevel(this.gainTrim - before);
    this.applyNow();
  }

  /** Records the level the user is hearing (plus the delta they just applied) as the new crew ceiling. */
  private captureUserLevel(delta: number): void {
    const level = clampNum(this.heardRaw + delta, 0, MAX_GAIN);
    this.userCeiling = level;
    this.crewLevel = level;
  }

  /** Sets the ceiling from a freshly chosen script or play start (the gain the user will hear). */
  private captureFromBase(): void {
    const level = clampNum(this.base.gain + this.gainTrim, 0, MAX_GAIN);
    this.userCeiling = level;
    this.crewLevel = level;
    this.heardRaw = level;
  }

  // ---- layer mixer ----

  /** Overrides layer fields (levels, tempo, etc.) over whatever the script plays. Values are clamped. */
  setLayerOverride(partial: Partial<Layers>): void {
    const next: Partial<Record<LayerKey, number>> = { ...this.layerOverrides };
    for (const [k, v] of Object.entries(partial)) {
      if (Object.hasOwn(NO_LAYERS, k) && typeof v === 'number') next[k as LayerKey] = clampLayerValue(k as LayerKey, v);
    }
    this.layerOverrides = next;
    this.applyNow();
  }

  /** Forces the beat frequency (0.5 to 40 Hz). Non-finite values are ignored. null clears. */
  setBeatOverride(hz: number | null): void {
    if (hz === null) this.beatOverride = null;
    else if (Number.isFinite(hz)) this.beatOverride = clampNum(hz, 0.5, 40);
    else return;
    this.applyNow();
  }

  /** Forces the noise kind and or level. Bad fields are ignored. null clears. */
  setNoiseOverride(o: NoiseOverride | null): void {
    if (o === null) {
      this.noiseOverride = null;
    } else {
      const kind = typeof o.noise === 'string' && NOISE_KINDS.includes(o.noise) ? o.noise : undefined;
      const level = typeof o.noiseLevel === 'number' && Number.isFinite(o.noiseLevel) ? clampNum(o.noiseLevel, 0, 1) : undefined;
      if (kind === undefined && level === undefined) return;
      this.noiseOverride = { ...(kind !== undefined ? { noise: kind } : {}), ...(level !== undefined ? { noiseLevel: level } : {}) };
    }
    this.applyNow();
  }

  private clearVoiceOverrides(): void {
    this.beatOverride = null;
    this.noiseOverride = null;
  }

  clearLayerOverrides(): void {
    this.layerOverrides = {};
    this.applyNow();
  }

  // ---- saved mixes ----

  /** What is playing now as a savable mix. Values are re-clamped by makeMix when saved. */
  getMixDraft(): MixDraft | null {
    const v = this.base;
    const ts = this.timers.state();
    const source =
      this.source === 'template' && this.template !== null
        ? { kind: 'template' as const, id: this.template.id }
        : this.source === 'preset'
          ? { kind: 'preset' as const, id: this.presetId }
          : { kind: 'custom' as const, id: 'custom' };
    const timer: MixDraft['timer'] =
      ts.kind === 'countdown' || ts.kind === 'sleep-fade'
        ? { kind: ts.kind, minutes: Math.max(1, Math.round(ts.totalSec / 60)) }
        : ts.kind === 'pomodoro'
          ? { kind: 'pomodoro', focusMin: ts.focusMin ?? 25, breakMin: ts.breakMin ?? 5 }
          : { kind: 'none' };
    return {
      source,
      voice: {
        carrierHz: v.carrierHz,
        beatHz: v.beatHz,
        mode: v.mode,
        noise: v.noise,
        noiseLevel: v.noiseLevel,
        gain: clampNum(v.gain + this.gainTrim, 0, MAX_GAIN),
      },
      layers: { ...(v.layers ?? {}), ...this.layerOverrides },
      timer,
      ...(this.beatOverride !== null ? { beatOverride: this.beatOverride } : {}),
      ...(this.noiseOverride !== null ? { noiseOverride: this.noiseOverride } : {}),
    };
  }

  /** Plays a mix that was already validated by parseMix or makeMix. The caller shows the safety gate first. */
  playMix(mix: Mix): void {
    const v = mix.voice;
    const voice: Voice = {
      carrierHz: clampNum(v.carrierHz, 20, 1500),
      beatHz: clampNum(v.beatHz, 0.5, 40),
      mode: v.mode,
      noise: v.noise,
      noiseLevel: clampNum(v.noiseLevel, 0, 1),
      gain: clampNum(v.gain, 0, MAX_GAIN),
      layers: { ...NO_LAYERS, ...mix.layers },
    };
    this.overridden = true;
    this.source = 'custom';
    this.presetId = `mix:${mix.id}`.slice(0, 80);
    this.template = null;
    this.queueIndex = -1;
    this.gainTrim = 0;
    this.clearVoiceOverrides();
    this.layerOverrides = {};
    if (mix.beatOverride !== undefined) this.beatOverride = clampNum(mix.beatOverride, 0.5, 40);
    const no = mix.noiseOverride;
    if (no !== undefined) {
      const kind = no.noise !== undefined && NOISE_KINDS.includes(no.noise) ? no.noise : undefined;
      const level = no.noiseLevel !== undefined && Number.isFinite(no.noiseLevel) ? clampNum(no.noiseLevel, 0, 1) : undefined;
      this.noiseOverride = { ...(kind !== undefined ? { noise: kind } : {}), ...(level !== undefined ? { noiseLevel: level } : {}) };
    }
    this.startScript([{ tSec: 0, voice, ramp: false, line: 0 }]);
    const t = mix.timer;
    if (t.kind === 'countdown' || t.kind === 'sleep-fade') this.startTimer({ kind: t.kind, minutes: t.minutes ?? 30 });
    else if (t.kind === 'pomodoro') this.startTimer({ kind: 'pomodoro', focusMin: t.focusMin ?? 25, breakMin: t.breakMin ?? 5 });
    else this.stopTimer();
    void this.play();
  }

  // ---- timers ----

  startTimer(spec: TimerSpec): TimerState {
    const st = this.timers.start(spec);
    if (!this.playing) this.timers.pause();
    this.emit();
    return st;
  }

  stopTimer(): void {
    this.timers.stop();
    this.gainScale = 1;
    this.applyNow();
  }

  cycleTimer(): TimerState {
    const st = this.timers.cycleNext();
    if (!this.playing) this.timers.pause();
    this.applyNow();
    return st;
  }

  /** Timer position when a timer is active, else the template timeline. Null when neither applies. */
  positionState(): PositionState | null {
    const ts = this.timers.state();
    if (ts.kind !== 'none') {
      const dur = ts.totalSec;
      return { durationSec: dur, positionSec: ts.finalFade === true ? dur : Math.max(0, dur - ts.remainingSec) };
    }
    const m = this.mode;
    if (this.template === null || m.kind !== 'script') return null;
    const dur = this.scriptDuration(m.events);
    const pos = this.playing ? (this.clock.now() - m.startMs) / 1000 : 0;
    return { durationSec: dur, positionSec: clampNum(pos, 0, dur) };
  }

  /** Seeks within the active timer, or the template timeline. Clamped to its bounds. */
  seekBy(deltaSec: number): void {
    if (!Number.isFinite(deltaSec)) return;
    if (this.timers.state().kind !== 'none') {
      this.timers.seekBy(deltaSec);
    } else if (this.mode.kind === 'script' && this.template !== null) {
      const m = this.mode;
      const dur = this.scriptDuration(m.events);
      const pos = clampNum((this.clock.now() - m.startMs) / 1000 + deltaSec, 0, dur);
      this.mode = { ...m, startMs: this.clock.now() - pos * 1000 };
    }
    this.applyNow();
  }

  private scriptDuration(events: readonly SbgEvent[]): number {
    const d = totalDuration(events);
    return d > 0 ? d : Math.max(60, (this.template?.recommendedMinutes ?? 1) * 60);
  }

  /** Recomputes the effective voice and pushes it to the engine when playing. */
  private applyNow(): void {
    this.current = this.effective(this.base);
    if (this.playing) this.engine.setVoice(this.current, TICK_RAMP_SEC);
    this.emit();
  }

  private effective(v: Voice): Voice {
    const fx = this.timers.effects();
    this.gainScale = fx.gainScale;
    const glided = v.beatHz + (SLEEP_TARGET_BEAT_HZ - v.beatHz) * fx.beatMix;
    const calm = Math.min(glided, BREAK_BEAT_HZ);
    const biased = clampNum(glided + (calm - glided) * this.breakMix, 0.5, 40);
    const beatHz = this.beatOverride ?? biased;
    const noiseO = this.noiseOverride;
    const wanted = clampNum(v.gain + this.gainTrim, 0, MAX_GAIN);
    const heard = this.source === 'crew' ? Math.min(wanted, this.crewLevel, this.userCeiling) : wanted;
    this.heardRaw = heard;
    const raw = this.muted ? 0 : heard;
    const hasOverrides = Object.keys(this.layerOverrides).length > 0;
    const layers = hasOverrides ? { ...(v.layers ?? NO_LAYERS), ...this.layerOverrides } : v.layers;
    return {
      ...v,
      beatHz,
      ...(noiseO?.noise !== undefined ? { noise: noiseO.noise } : {}),
      ...(noiseO?.noiseLevel !== undefined ? { noiseLevel: noiseO.noiseLevel } : {}),
      // Defense in depth: a non-finite gain (forged crew state) is silence, never NaN.
      gain: finiteOr(Math.min(MAX_GAIN, raw * fx.gainScale), 0),
      ...(layers !== undefined ? { layers } : {}),
    };
  }

  private slewBreak(now: number): void {
    const dt = Math.max(0, now - this.lastTickMs);
    this.lastTickMs = now;
    if (this.source === 'crew') {
      const target = Math.min(clampNum(this.base.gain + this.gainTrim, 0, MAX_GAIN), this.userCeiling);
      this.crewLevel = target > this.crewLevel ? Math.min(target, this.crewLevel + (CREW_GAIN_SLEW_PER_SEC * dt) / 1000) : target;
    }
    const target = this.timers.state().phase === 'break' ? 1 : 0;
    const step = dt / (BREAK_GLIDE_SEC * 1000);
    this.breakMix = target > this.breakMix ? Math.min(target, this.breakMix + step) : Math.max(target, this.breakMix - step);
  }

  /** Manual preset choice. Overrides the crew until followCrew(). */
  selectPreset(id: string): void {
    const preset = presetById(id);
    this.overridden = true;
    this.presetId = preset.id;
    this.source = 'preset';
    this.template = null;
    this.queueIndex = -1;
    this.gainTrim = 0;
    this.clearVoiceOverrides();
    this.startScript(parseSbg(preset.sbg).events);
  }

  /** Parses and plays custom text. Returns diagnostics; nothing plays when it has errors. */
  async playCustom(text: string): Promise<readonly Diagnostic[]> {
    const res = parseSbg(text);
    if (!res.ok || res.events.length === 0) return res.diagnostics;
    this.overridden = true;
    this.source = 'custom';
    this.template = null;
    this.queueIndex = -1;
    this.gainTrim = 0;
    this.clearVoiceOverrides();
    this.startScript(res.events);
    if (!this.playing) await this.play();
    return res.diagnostics;
  }

  followCrew(): void {
    this.overridden = false;
    if (this.latestCrew !== null) this.enterCrew(this.latestCrew);
    else this.emit();
  }

  applyCrew(state: CrewState): void {
    this.latestCrew = state;
    this.burnout = state.burnout.score;
    this.breathe = state.target.breathe;
    this.peak = Math.max(this.peak, state.burnout.score);
    if (this.overridden) this.emit();
    else this.enterCrew(state);
  }

  /** Clears the crew data after the bridge drops (the sound keeps playing). */
  crewLost(): void {
    this.burnout = null;
    this.emit();
  }

  /** Runs op after every earlier play/stop op has finished; runs synchronously when none is pending. */
  private enqueue(op: () => Promise<void>): Promise<void> {
    const p = this.opCount === 0 ? op() : this.opTail.then(op);
    this.opCount += 1;
    this.opTail = p.then(
      () => void (this.opCount -= 1),
      () => void (this.opCount -= 1),
    );
    return p;
  }

  play(): Promise<void> {
    this.wantPlaying = true;
    return this.enqueue(() => this.doPlay());
  }

  stop(): Promise<void> {
    this.wantPlaying = false;
    return this.enqueue(() => this.doStop());
  }

  private async doPlay(): Promise<void> {
    if (this.playing || !this.wantPlaying) return;
    const now = this.clock.now();
    this.restartModeClock(now);
    this.lastTickMs = now;
    this.captureFromBase();
    this.current = this.effective(this.base);
    try {
      await this.engine.start(this.current);
    } catch {
      this.emit();
      return;
    }
    const st = this.engine.status?.state;
    if (st !== undefined && st !== 'running') {
      this.emit();
      return;
    }
    this.playing = true;
    this.startedAt = now;
    this.peak = this.burnout ?? 0;
    this.endKind = 'manual';
    this.breakCount = 0;
    this.lastPhase = this.timers.state().phase;
    this.timer = this.clock.setInterval(() => this.tick(), TICK_MS);
    this.timers.resume();
    this.emit();
  }

  private async doStop(): Promise<void> {
    if (!this.playing) return;
    this.playing = false;
    this.timers.pause();
    if (this.timer !== null) this.clock.clearInterval(this.timer);
    this.timer = null;
    this.onSession?.({
      startedAt: this.startedAt,
      endedAt: this.clock.now(),
      peakScore: this.peak,
      presetId: this.source === 'crew' ? (this.latestCrew?.target.presetId ?? this.presetId) : this.presetId,
      endKind: this.endKind,
      breaks: this.breakCount,
    });
    this.emit();
    try {
      await this.engine.stop();
    } catch {
      /* the engine reports its own error status */
    }
  }

  tick(): void {
    if (!this.playing) return;
    const now = this.clock.now();
    this.base = this.voiceNow(now);
    this.slewBreak(now);
    this.current = this.effective(this.base);
    if (!this.playing) return;
    this.engine.setVoice(this.current, TICK_RAMP_SEC);
    this.emit();
  }

  private voiceNow(now: number): Voice {
    const m = this.mode;
    if (m.kind === 'hold') return m.voice;
    if (m.kind === 'script') return voiceAt(m.events, (now - m.startMs) / 1000);
    const f = Math.min(1, Math.max(0, (now - m.startMs) / m.durMs));
    if (f >= 1) {
      this.mode = { kind: 'hold', voice: m.to };
      return m.to;
    }
    return blend(m.from, m.to, f);
  }

  private restartModeClock(now: number): void {
    const m = this.mode;
    if (m.kind !== 'hold') this.mode = { ...m, startMs: now };
  }

  private startScript(events: readonly SbgEvent[]): void {
    this.mode = { kind: 'script', events, startMs: this.clock.now() };
    this.base = voiceAt(events, 0);
    this.captureFromBase();
    this.current = this.effective(this.base);
    if (this.playing) this.engine.setVoice(this.current, SWITCH_RAMP_SEC);
    this.emit();
  }

  private enterCrew(state: CrewState): void {
    const now = this.clock.now();
    this.source = 'crew';
    this.template = null;
    this.queueIndex = -1;
    this.gainTrim = 0;
    this.clearVoiceOverrides();
    this.crewLevel = Math.min(this.heardRaw, this.userCeiling);
    const res = state.sbg === null ? null : parseSbg(state.sbg);
    if (res !== null && res.ok && res.events.length > 0) {
      this.mode = { kind: 'script', events: res.events, startMs: now };
    } else {
      const t = state.target;
      // crew.ts already validates; clamp again so a forged state cannot carry NaN or out-of-range values.
      const to: Voice = {
        ...this.base,
        carrierHz: clampNum(finiteOr(t.carrierHz, this.base.carrierHz), 20, 1500),
        beatHz: clampNum(finiteOr(t.beatHz, this.base.beatHz), 0.5, 40),
        gain: clampNum(finiteOr(t.gain, 0), 0, MAX_GAIN),
      };
      this.mode = { kind: 'transition', from: this.base, to, startMs: now, durMs: clampNum(finiteOr(t.transitionSec, 5), 0.1, 600) * 1000 };
    }
    this.emit();
  }

  private emit(): void {
    const s = this.snapshot();
    for (const l of this.listeners) l(s);
  }
}
