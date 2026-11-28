import workletUrl from './worklet.ts?worker&url';
import wasmUrl from '../wasm/dsp_core.wasm?url';
import type { Voice } from '../sbg/types';
import { AUDIO_UNSUPPORTED } from './types';
import type { AudioContextStateLike, AudioEngine, EngineStats, EngineStatus, TelemetryReader } from './types';
import {
  PARAM_COUNT, PARAM_SAB_BYTES, ParamWriter, clampRamp, clampVoice, voiceToParams,
} from './params';
import { setSampleBus } from './samples/bus';
import { guardCurve } from './samples/math';
import { btNoiseLevel, createBtPath } from './btFilter';
import type { BtPath, ListenDevice } from './btFilter';
import { healthLog, isLateJump } from './health';
import { RingTelemetryReader, createTelemetryBuffer, emptyTelemetry } from './telemetry';

const START_RAMP_SEC = 2;
const STOP_RAMP_SEC = 0.3;
const STATS_TIMEOUT_MS = 1000;

type Pending = { resolve: (s: EngineStats) => void; timer: ReturnType<typeof setTimeout> };

export class ZonkedAudioEngine implements AudioEngine {
  private _status: EngineStatus;
  private readonly listeners = new Set<(s: EngineStatus) => void>();
  private ctx: AudioContext | null = null;
  private node: AudioWorkletNode | null = null;
  private master: GainNode | null = null;
  private writer: ParamWriter | null = null;
  private tele: TelemetryReader = emptyTelemetry;
  private voice: Voice | null = null;
  private startedAt = 0;
  private statsId = 0;
  private readonly pending = new Map<number, Pending>();
  private pendingStart: Promise<void> | null = null;
  private pendingStop: Promise<void> | null = null;
  private readonly block = new Float32Array(PARAM_COUNT);
  private listening: ListenDevice = 'wired';
  private bt: BtPath | null = null;
  private analyser: AnalyserNode | null = null;
  private freq: Float32Array<ArrayBuffer> | null = null;
  private watchTimer: ReturnType<typeof setInterval> | null = null;
  private lastLatency = 0;
  private lastUnderruns = 0;

  constructor() {
    this._status = {
      state: 'idle', sampleRate: 0, usesSharedMemory: false,
      crossOriginIsolated: typeof crossOriginIsolated === 'boolean' && crossOriginIsolated,
    };
  }

  get status(): EngineStatus { return this._status; }
  get telemetry(): TelemetryReader { return this.tele; }

  onStatus(listener: (s: EngineStatus) => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private setStatus(patch: Partial<EngineStatus>): void {
    this._status = { ...this._status, ...patch };
    for (const l of this.listeners) l(this._status);
  }

  async start(initial: Voice): Promise<void> {
    if (this.pendingStop !== null) await this.pendingStop;
    if (this._status.state === 'running') return;
    if (this.pendingStart !== null) return this.pendingStart;
    const run = this.doStart(initial);
    this.pendingStart = run.finally(() => { this.pendingStart = null; });
    return this.pendingStart;
  }

  private async doStart(initial: Voice): Promise<void> {
    this.setStatus({ state: 'starting', error: undefined });
    try {
      if (this.ctx === null) await this.build();
      const ctx = this.ctx;
      if (ctx === null || this.master === null) throw new Error('audio graph missing');
      this.voice = clampVoice(initial);
      this.pushVoice(this.voice, START_RAMP_SEC);
      this.startedAt = ctx.currentTime;
      const g = this.master.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(0, ctx.currentTime);
      g.linearRampToValueAtTime(1, ctx.currentTime + START_RAMP_SEC);
      await ctx.resume();
      this.startWatch(ctx);
      this.setStatus({ state: 'running' });
    } catch (err) {
      this.setStatus({ state: 'error', error: err instanceof Error ? err.message : String(err) });
    }
  }

  private async build(): Promise<void> {
    const ctx = new AudioContext({ latencyHint: 'interactive' });
    this.ctx = ctx;
    if (typeof AudioWorkletNode === 'undefined' || ctx.audioWorklet === undefined) throw new Error(AUDIO_UNSUPPORTED);
    await ctx.audioWorklet.addModule(workletUrl);
    const res = await fetch(wasmUrl);
    if (!res.ok) throw new Error(`wasm fetch failed: ${res.status}`);
    const bytes = await res.arrayBuffer();
    const shared = typeof SharedArrayBuffer !== 'undefined' && this._status.crossOriginIsolated;
    const sab = shared ? new SharedArrayBuffer(PARAM_SAB_BYTES) : undefined;
    const teleBuf = shared ? createTelemetryBuffer(true) : undefined;
    const node = new AudioWorkletNode(ctx, 'zonked-dsp', { numberOfInputs: 0, outputChannelCount: [2] });
    const ready = new Promise<void>((resolve, reject) => {
      node.port.onmessage = (e: MessageEvent): void => {
        const d = e.data as { type?: string; message?: string };
        if (d.type === 'ready') resolve();
        else if (d.type === 'error') reject(new Error(d.message ?? 'worklet init failed'));
        else this.onWorkletMessage(e.data as Record<string, unknown>);
      };
    });
    node.port.postMessage({ type: 'init', wasm: bytes, sab, tele: teleBuf, sampleRate: ctx.sampleRate });
    await ready;
    node.port.onmessage = (e: MessageEvent): void => this.onWorkletMessage(e.data as Record<string, unknown>);
    const master = ctx.createGain();
    master.gain.value = 0;
    // Beat path goes through a duck gain, nature samples join at master, a clip guard ends the chain.
    const duck = ctx.createGain();
    const guard = ctx.createWaveShaper();
    guard.curve = guardCurve();
    // Bluetooth path sits between master and the clip guard: dsp-core and its limits are not touched.
    const bt = createBtPath(ctx, master, guard);
    node.connect(duck).connect(master);
    guard.connect(ctx.destination);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0;
    guard.connect(analyser);
    this.bt = bt;
    this.analyser = analyser;
    this.freq = new Float32Array(analyser.frequencyBinCount);
    bt.setOn(this.listening === 'bluetooth');
    setSampleBus({ ctx, input: master, duck });
    this.node = node;
    this.master = master;
    this.writer = sab ? new ParamWriter(sab) : null;
    this.tele = teleBuf ? new RingTelemetryReader(teleBuf) : emptyTelemetry;
    this.setStatus({ sampleRate: ctx.sampleRate, usesSharedMemory: shared });
  }

  private onWorkletMessage(m: Record<string, unknown>): void {
    if (m['type'] === 'stats') {
      const id = m['id'] as number;
      const p = this.pending.get(id);
      if (!p) return;
      clearTimeout(p.timer);
      this.pending.delete(id);
      const hi = this.hiDb();
      p.resolve({
        peak: Number(m['peak']), rms: Number(m['rms']),
        frames: Number(m['frames']), nonZero: Number(m['nonZero']),
        hiccups: healthLog.count(Date.now()),
        hiccupKinds: healthLog.byKind(Date.now()),
        ...(hi === null ? {} : { hiDb: hi }),
      });
    } else if (m['type'] === 'health') {
      healthLog.record(Date.now(), 'underrun', Number(m['skipped']));
    } else if (m['type'] === 'error') {
      this.setStatus({ state: 'error', error: String(m['message']) });
    }
  }

  setListening(device: ListenDevice): void {
    if (this.listening === device) return;
    this.listening = device;
    this.bt?.setOn(device === 'bluetooth');
    if (this.voice !== null) this.pushVoice(this.voice, 0.5);
  }

  private pushVoice(voice: Voice, rampSec: number): void {
    const level = btNoiseLevel(voice.noiseLevel, this.listening === 'bluetooth');
    voiceToParams(level === voice.noiseLevel ? voice : { ...voice, noiseLevel: level }, rampSec, this.block);
    if (this.writer !== null) this.writer.write(this.block);
    else this.node?.port.postMessage({ type: 'params', p: new Float32Array(this.block) });
  }

  setVoice(voice: Voice, rampSec?: number): void {
    this.voice = clampVoice(voice, this.voice ?? undefined);
    let ramp = clampRamp(rampSec ?? 0.05);
    if (this.ctx !== null && this.ctx.currentTime - this.startedAt < 2 * START_RAMP_SEC) {
      ramp = Math.max(ramp, START_RAMP_SEC);
    }
    this.pushVoice(this.voice, ramp);
  }

  stop(): Promise<void> {
    if (this.pendingStop !== null) return this.pendingStop;
    if (this.pendingStart !== null) {
      const waitStart = this.pendingStart;
      this.pendingStop = waitStart.then(() => this.doStop()).finally(() => { this.pendingStop = null; });
      return this.pendingStop;
    }
    if (this.ctx === null || this._status.state !== 'running') return Promise.resolve();
    this.pendingStop = this.doStop().finally(() => { this.pendingStop = null; });
    return this.pendingStop;
  }

  private async doStop(): Promise<void> {
    const ctx = this.ctx;
    if (ctx === null || this._status.state !== 'running') return;
    this.setStatus({ state: 'stopping' });
    this.stopWatch();
    if (this.voice !== null) this.pushVoice({ ...this.voice, gain: 0 }, 0.1);
    const g = this.master?.gain;
    if (g) {
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(g.value, ctx.currentTime);
      g.linearRampToValueAtTime(0, ctx.currentTime + STOP_RAMP_SEC);
    }
    await new Promise<void>((r) => setTimeout(r, STOP_RAMP_SEC * 1000 + 50));
    try {
      await ctx.suspend();
      this.setStatus({ state: 'stopped' });
    } catch (err) {
      this.setStatus({ state: 'error', error: err instanceof Error ? err.message : String(err) });
    }
  }

  /** Once a second: a jump in output delay counts as a late frame, and the browser's own underrun count (where it has one) is added. */
  private startWatch(ctx: AudioContext): void {
    this.stopWatch();
    this.lastLatency = ctx.baseLatency + (ctx.outputLatency || 0);
    const stats = (ctx as unknown as { playbackStats?: { underrunEvents?: number } }).playbackStats;
    this.lastUnderruns = stats?.underrunEvents ?? 0;
    this.watchTimer = setInterval(() => {
      const now = Date.now();
      const cur = ctx.baseLatency + (ctx.outputLatency || 0);
      if (isLateJump(this.lastLatency, cur)) healthLog.record(now, 'late');
      this.lastLatency = cur;
      const u = stats?.underrunEvents;
      if (typeof u === 'number' && u > this.lastUnderruns) healthLog.record(now, 'underrun', u - this.lastUnderruns);
      if (typeof u === 'number') this.lastUnderruns = u;
    }, 1000);
  }

  private stopWatch(): void {
    if (this.watchTimer !== null) clearInterval(this.watchTimer);
    this.watchTimer = null;
  }

  /** Power above 6 kHz in dB, from the output tap. Null before the graph exists. */
  private hiDb(): number | null {
    const a = this.analyser;
    const f = this.freq;
    if (a === null || f === null) return null;
    a.getFloatFrequencyData(f);
    const first = Math.round((6000 / (a.context.sampleRate / 2)) * f.length);
    let sum = 0;
    for (let i = first; i < f.length; i++) sum += 10 ** ((f[i] ?? -200) / 10);
    return sum > 0 ? 10 * Math.log10(sum) : -200;
  }

  contextState(): AudioContextStateLike {
    return this.ctx === null ? 'none' : (this.ctx.state as AudioContextStateLike);
  }

  async resume(): Promise<boolean> {
    const ctx = this.ctx;
    if (ctx === null || this._status.state !== 'running') return false;
    if (ctx.state === 'running') return true;
    try {
      await ctx.resume();
    } catch {
      return false;
    }
    return (ctx.state as string) === 'running';
  }

  getStats(): Promise<EngineStats> {
    const zero: EngineStats = { peak: 0, rms: 0, frames: 0, nonZero: 0 };
    const node = this.node;
    if (node === null) return Promise.resolve(zero);
    return new Promise<EngineStats>((resolve) => {
      const id = ++this.statsId;
      const timer = setTimeout(() => { this.pending.delete(id); resolve(zero); }, STATS_TIMEOUT_MS);
      this.pending.set(id, { resolve, timer });
      node.port.postMessage({ type: 'stats-request', id });
    });
  }
}
