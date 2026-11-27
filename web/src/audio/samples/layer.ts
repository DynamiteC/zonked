import { SAMPLES } from './catalog';
import type { SampleInfo } from './catalog';
import type { SampleBus } from './bus';
import type { SynthHandle, SynthId } from './synth/graph';
import {
  DUCK_TAU_SEC, FADE_IN_SEC, FADE_OUT_SEC, LEVEL_TAU_SEC,
  blendFromLevel, clampBlend, clampLevel, duckGain,
} from './math';

/** Plain result. The layer never throws. */
export type SampleResult = { ok: true } | { ok: false; error: string };

export interface LayerDeps {
  getBus: () => SampleBus | null;
  fetchBytes: (url: string) => Promise<ArrayBuffer>;
  baseUrl: string;
  origin: string;
}

interface Active { id: string; src: AudioBufferSourceNode | SynthHandle; gain: GainNode }

const fail = (error: string): SampleResult => ({ ok: false, error });
/** Fixed base seed. Each start adds one, so a session is repeatable and starts differ. */
const SESSION_SEED = 20261128;
const ID_OK = /^[a-z]+$/;

export function createSampleLayer(deps: LayerDeps) {
  const buffers = new Map<string, AudioBuffer>();
  const inflight = new Map<string, Promise<SampleResult>>();
  let active: Active | null = null;
  let level = 0;
  let blend: number | null = null;
  let token = 0;
  let starts = 0;

  const effectiveBlend = (): number => (active === null ? 0 : blend ?? blendFromLevel(level));

  function applyDuck(bus: SampleBus): void {
    bus.duck.gain.setTargetAtTime(duckGain(effectiveBlend()), bus.ctx.currentTime, DUCK_TAU_SEC);
  }

  function urlFor(id: string): string | null {
    if (!ID_OK.test(id) || !SAMPLES.some((s) => s.id === id)) return null;
    try {
      const url = new URL(`${deps.baseUrl}samples/${id}.mp3.json`, deps.origin);
      return url.origin === new URL(deps.origin).origin ? url.href : null;
    } catch {
      return null;
    }
  }

  async function load(bus: SampleBus, id: string): Promise<SampleResult> {
    if (buffers.has(id)) return { ok: true };
    const url = urlFor(id);
    if (url === null) return fail('unknown sample');
    try {
      const bytes = await deps.fetchBytes(url);
      const buf = await bus.ctx.decodeAudioData(bytes);
      buffers.set(id, buf);
      return { ok: true };
    } catch {
      return fail('sample unavailable: check the connection or reinstall the app files');
    }
  }

  function ensureLoaded(bus: SampleBus, id: string): Promise<SampleResult> {
    const pending = inflight.get(id);
    if (pending !== undefined) return pending;
    const run = load(bus, id).finally(() => { inflight.delete(id); });
    inflight.set(id, run);
    return run;
  }

  function fadeOut(a: Active, bus: SampleBus): void {
    const t = bus.ctx.currentTime;
    const g = a.gain.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(0, t + FADE_OUT_SEC);
    try { a.src.stop(t + FADE_OUT_SEC + 0.05); } catch { /* already stopped */ }
    a.src.onended = () => { a.src.disconnect(); a.gain.disconnect(); };
  }

  function begin(bus: SampleBus, id: string, buffer: AudioBuffer, lvl: number, loop: boolean): SampleResult {
    if (active !== null) fadeOut(active, bus);
    level = clampLevel(lvl, level);
    const src = bus.ctx.createBufferSource();
    const gain = bus.ctx.createGain();
    src.buffer = buffer;
    src.loop = loop;
    gain.gain.setValueAtTime(0, bus.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(level, bus.ctx.currentTime + FADE_IN_SEC);
    src.connect(gain);
    gain.connect(bus.input);
    const mine: Active = { id, src, gain };
    if (!loop) {
      src.onended = () => {
        src.disconnect();
        gain.disconnect();
        if (active === mine) { active = null; applyDuck(bus); }
      };
    }
    src.start();
    active = mine;
    applyDuck(bus);
    return { ok: true };
  }

  /** Synth sounds skip the fetch. The code loads on first use, so first load stays small. */
  async function startSynth(bus: SampleBus, id: SynthId, lvl: number, mine: number): Promise<SampleResult> {
    let build: typeof import('./synth/graph').buildSynth;
    try {
      build = (await import('./synth/graph')).buildSynth;
    } catch {
      return fail('sample unavailable: reinstall the app files');
    }
    if (mine !== token) return { ok: true };
    if (active !== null) fadeOut(active, bus);
    level = clampLevel(lvl, level);
    const src = build(bus.ctx, id, SESSION_SEED + starts++);
    const gain = bus.ctx.createGain();
    gain.gain.setValueAtTime(0, bus.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(level, bus.ctx.currentTime + FADE_IN_SEC);
    src.connect(gain);
    gain.connect(bus.input);
    active = { id, src, gain };
    applyDuck(bus);
    return { ok: true };
  }

  return {
    list: (): readonly SampleInfo[] => SAMPLES,

    async start(id: string, lvl: number): Promise<SampleResult> {
      const bus = deps.getBus();
      if (bus === null) return fail('start the sound first');
      const mine = ++token;
      if (SAMPLES.some((s) => s.id === id && s.kind === 'synth')) return startSynth(bus, id as SynthId, lvl, mine);
      const loaded = await ensureLoaded(bus, id);
      if (!loaded.ok) return loaded;
      const buffer = buffers.get(id);
      if (buffer === undefined || mine !== token) return buffer === undefined ? fail('sample unavailable') : { ok: true };
      return begin(bus, id, buffer, lvl, true);
    },

    /** Plays a ready buffer (a person's own sound). Loops, or plays once when `loop` is false. */
    startBuffer(id: string, buffer: AudioBuffer, lvl: number, loop: boolean): SampleResult {
      const bus = deps.getBus();
      if (bus === null) return fail('start the sound first');
      token++;
      return begin(bus, id, buffer, lvl, loop);
    },

    setLevel(lvl: number): void {
      level = clampLevel(lvl, level);
      const bus = deps.getBus();
      if (bus === null || active === null) return;
      const g = active.gain.gain;
      g.cancelScheduledValues(bus.ctx.currentTime);
      g.setTargetAtTime(level, bus.ctx.currentTime, LEVEL_TAU_SEC);
      applyDuck(bus);
    },

    setBlend(b: number): void {
      blend = clampBlend(b, blend ?? 0);
      const bus = deps.getBus();
      if (bus !== null) applyDuck(bus);
    },

    stop(): void {
      token++;
      const bus = deps.getBus();
      const a = active;
      active = null;
      if (bus === null || a === null) return;
      fadeOut(a, bus);
      applyDuck(bus);
    },

    playing: (): string | null => active?.id ?? null,
  };
}
