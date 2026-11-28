import { SAMPLES } from './catalog';
import { hasSeamTick, healthLog, stepP999 } from '../health';
import { SAMPLE_REV } from './versions';
import type { SampleInfo } from './catalog';
import type { SampleBus } from './bus';
import type { SynthHandle, SynthId } from './synth/graph';
import {
  DUCK_TAU_SEC, FADE_IN_SEC, FADE_OUT_SEC, LEVEL_TAU_SEC,
  beatGain, blendFromLevel, clampBlend, clampLevel, equalPowerCurve, natureScale, trimGain,
} from './math';

/** Switching from one nature sound to another: the old one falls and the new one rises over this long, equal power. */
export const XFADE_SEC = 1.5;

/** Plain result. The layer never throws. */
export type SampleResult = { ok: true; note?: string } | { ok: false; error: string };

/** Firefox can leave decodeAudioData unsettled for some MP3s. Past this, a made-in-code sound plays instead. */
export const DECODE_TIMEOUT_MS = 8000;
const DECODE_TIMEOUT = 'decode timeout';

/** Closest made-in-code sound for each recording. */
export const SYNTH_FALLBACK: Readonly<Record<string, SynthId>> = {
  rain: 'rainroof', lightrain: 'rainroof', thunder: 'rainroof', veranda: 'rainroof', window: 'rainroof', storm: 'rainroof', fire: 'rainroof',
  stream: 'waterfall', waves: 'waterfall', pebbles: 'waterfall', creek: 'waterfall', trickle: 'waterfall', fountain: 'waterfall',
  forest: 'wind', birds: 'wind', breeze: 'wind', hum: 'wind',
  chimes: 'bowl', koshi: 'bowl', gong: 'bowl',
};

function decodeWithin(ctx: BaseAudioContext, bytes: ArrayBuffer, ms: number): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(DECODE_TIMEOUT)), ms);
    ctx.decodeAudioData(bytes).then(
      (b) => { clearTimeout(timer); resolve(b); },
      (e: unknown) => { clearTimeout(timer); reject(e instanceof Error ? e : new Error(String(e))); },
    );
  });
}

/** A loop whose two ends differ a lot would click every time it repeats. Counted as a hiccup, never blocks playback. */
function checkSeam(buf: AudioBuffer): void {
  if (typeof buf.getChannelData !== 'function' || !(buf.length >= 2)) return;
  const d = buf.getChannelData(0);
  if (hasSeamTick(d[0] ?? 0, d[d.length - 1] ?? 0, stepP999(d))) healthLog.record(Date.now(), 'seam');
}

export interface LayerDeps {
  getBus: () => SampleBus | null;
  fetchBytes: (url: string) => Promise<ArrayBuffer>;
  baseUrl: string;
  origin: string;
  /** Test hook. Defaults to DECODE_TIMEOUT_MS. */
  decodeTimeoutMs?: number;
  /** Day number added to the synth seed, so the first minute differs from day to day. Defaults to the UTC day. */
  dayNumber?: () => number;
}

interface Active { id: string; src: AudioBufferSourceNode | SynthHandle; gain: GainNode; trim: number }

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
    bus.duck.gain.setTargetAtTime(beatGain(effectiveBlend()), bus.ctx.currentTime, DUCK_TAU_SEC);
  }

  /** Level slider times the sound's trim times the blend scale. The scale is 1 until a blend is set. */
  function targetGain(a: Active): number {
    return level * a.trim * (blend === null ? 1 : natureScale(blend));
  }

  const trimOf = (id: string): number => trimGain(SAMPLES.find((s) => s.id === id)?.trimDb ?? 0);

  /** Fade a new sound in. Plain ramp on a first start, equal-power curve when it replaces another sound. */
  function fadeIn(a: Active, bus: SampleBus, crossfade: boolean): void {
    const t = bus.ctx.currentTime;
    const g = a.gain.gain;
    const to = targetGain(a);
    g.setValueAtTime(0, t);
    if (!crossfade) { g.linearRampToValueAtTime(to, t + FADE_IN_SEC); return; }
    const curve = equalPowerCurve(true);
    for (let i = 0; i < curve.length; i++) curve[i] = (curve[i] ?? 0) * to;
    g.setValueCurveAtTime(curve, t, XFADE_SEC);
  }

  function urlFor(id: string): string | null {
    if (!ID_OK.test(id) || !SAMPLES.some((s) => s.id === id)) return null;
    try {
      const rev = SAMPLE_REV[id];
      const url = new URL(`${deps.baseUrl}samples/${id}.mp3.json${rev === undefined ? '' : `?v=${rev}`}`, deps.origin);
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
      const buf = await decodeWithin(bus.ctx, bytes, deps.decodeTimeoutMs ?? DECODE_TIMEOUT_MS);
      buffers.set(id, buf);
      checkSeam(buf);
      return { ok: true };
    } catch (e) {
      healthLog.record(Date.now(), 'decode');
      if (e instanceof Error && e.message === DECODE_TIMEOUT) return fail(DECODE_TIMEOUT);
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

  function fadeOut(a: Active, bus: SampleBus, crossfade = false): void {
    const t = bus.ctx.currentTime;
    const g = a.gain.gain;
    const from = g.value;
    const sec = crossfade ? XFADE_SEC : FADE_OUT_SEC;
    g.cancelScheduledValues(t);
    g.setValueAtTime(from, t);
    if (crossfade) {
      const curve = equalPowerCurve(false);
      for (let i = 0; i < curve.length; i++) curve[i] = (curve[i] ?? 0) * from;
      g.setValueCurveAtTime(curve, t, sec);
    } else g.linearRampToValueAtTime(0, t + sec);
    try { a.src.stop(t + sec + 0.05); } catch { /* already stopped */ }
    a.src.onended = () => { a.src.disconnect(); a.gain.disconnect(); };
  }

  function begin(bus: SampleBus, id: string, buffer: AudioBuffer, lvl: number, loop: boolean): SampleResult {
    const switching = active !== null;
    if (active !== null) fadeOut(active, bus, true);
    level = clampLevel(lvl, level);
    const src = bus.ctx.createBufferSource();
    const gain = bus.ctx.createGain();
    src.buffer = buffer;
    src.loop = loop;
    const mine: Active = { id, src, gain, trim: trimOf(id) };
    fadeIn(mine, bus, switching);
    src.connect(gain);
    gain.connect(bus.input);
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
    const switching = active !== null;
    if (active !== null) fadeOut(active, bus, true);
    level = clampLevel(lvl, level);
    const day = Math.trunc(deps.dayNumber?.() ?? Date.now() / 86400000);
    const src = build(bus.ctx, id, SESSION_SEED + (Number.isFinite(day) ? Math.abs(day) % 100000 : 0) * 31 + starts++);
    const gain = bus.ctx.createGain();
    const cur: Active = { id, src, gain, trim: trimOf(id) };
    fadeIn(cur, bus, switching);
    src.connect(gain);
    gain.connect(bus.input);
    active = cur;
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
      const alt = SYNTH_FALLBACK[id];
      if (!loaded.ok && loaded.error === DECODE_TIMEOUT && alt !== undefined && mine === token) {
        const r = await startSynth(bus, alt, lvl, mine);
        const name = (SAMPLES.find((x) => x.id === alt)?.label ?? alt).replace(' (synth)', '').toLowerCase();
        return r.ok ? { ok: true, note: `The recording could not load in this browser, so a made-in-code sound (${name}) plays instead.` } : r;
      }
      if (!loaded.ok) return loaded.error === DECODE_TIMEOUT ? fail('sample unavailable: this browser could not decode it') : loaded;
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
      g.setTargetAtTime(targetGain(active), bus.ctx.currentTime, LEVEL_TAU_SEC);
      applyDuck(bus);
    },

    setBlend(b: number): void {
      blend = clampBlend(b, blend ?? 0);
      const bus = deps.getBus();
      if (bus === null) return;
      if (active !== null) active.gain.gain.setTargetAtTime(targetGain(active), bus.ctx.currentTime, LEVEL_TAU_SEC);
      applyDuck(bus);
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
