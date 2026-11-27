// Web Audio graphs for the made-by-Zonked sounds. Each build returns a handle shaped like a buffer source,
// so the sample layer can fade it, stop it and clean it up in the same way as a loop.
import { clampFinite, makeRng, whiteNoise } from './dsp';
import {
  ATTACK_SEC, BREATH, HARMONIC, RELEASE_SEC, makePlanner, noteLength,
} from './flute';
import type { Note } from './flute';
import { BED_SECONDS } from './render';
import { renderAnyBed } from './beds';
import type { AnyBedKind } from './beds';
import { strikeHandle } from './strikes-graph';
import type { StrikeKind } from './strikes';

export type SynthId = AnyBedKind | StrikeKind | 'flute';

export interface SynthHandle {
  connect(dest: AudioNode): unknown;
  disconnect(): void;
  stop(when?: number): void;
  onended: (() => void) | null;
}

/** Mix gain for the two bed loops: 2 * 0.25 * 0.7 = 0.35 worst case, under -6 dBFS. */
const BED_MIX = 0.7;
/** How far ahead the flute scheduler books notes, and how often it wakes, in seconds. */
const LOOKAHEAD_SEC = 4;
const TICK_MS = 1000;
/** Breath filter output is quiet, so lift it to match the offline model. */
const BREATH_LIFT = 8;

function bufferOf(ctx: BaseAudioContext, data: Float32Array): AudioBuffer {
  const buf = ctx.createBuffer(1, data.length, ctx.sampleRate);
  buf.getChannelData(0).set(data);
  return buf;
}

function loopSource(ctx: BaseAudioContext, data: Float32Array): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = bufferOf(ctx, data);
  src.loop = true;
  return src;
}

function bedHandle(ctx: BaseAudioContext, kind: AnyBedKind, seed: number): SynthHandle {
  const mix = ctx.createGain();
  mix.gain.value = BED_MIX;
  const sources = BED_SECONDS.map((secs, i) => {
    const src = loopSource(ctx, renderAnyBed(kind, ctx.sampleRate, seed + i * 7919, secs));
    src.connect(mix);
    src.start();
    return src;
  });
  const first = sources[0];
  const handle: SynthHandle = {
    connect: (d) => mix.connect(d),
    disconnect: () => mix.disconnect(),
    stop: (when) => { for (const s of sources) { try { s.stop(when); } catch { /* already stopped */ } } },
    onended: null,
  };
  if (first) first.onended = () => { handle.onended?.(); };
  return handle;
}

function playNote(ctx: BaseAudioContext, note: Note, at: number, breath: AudioNode, out: AudioNode, live: Set<AudioScheduledSourceNode>): void {
  const end = at + noteLength(note);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(note.amp, at + ATTACK_SEC);
  env.gain.setValueAtTime(note.amp, at + ATTACK_SEC + note.hold);
  env.gain.linearRampToValueAtTime(0, at + ATTACK_SEC + note.hold + RELEASE_SEC);
  env.connect(out);
  const tones: Array<[number, number]> = [[note.hz, 1], [note.hz * 2, HARMONIC]];
  for (const [hz, mul] of tones) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = clampFinite(hz, 20, 2000, 440);
    g.gain.value = mul;
    osc.connect(g);
    g.connect(env);
    osc.start(at);
    osc.stop(end);
    live.add(osc);
    osc.onended = () => { live.delete(osc); osc.disconnect(); g.disconnect(); };
  }
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = clampFinite(note.hz * 2, 40, 4000, 880);
  band.Q.value = 2;
  const bg = ctx.createGain();
  bg.gain.value = BREATH * BREATH_LIFT;
  breath.connect(band);
  band.connect(bg);
  bg.connect(env);
  setTimeoutSafe(() => { band.disconnect(); bg.disconnect(); env.disconnect(); }, (end - ctx.currentTime + 0.5) * 1000);
}

const setTimeoutSafe = (fn: () => void, ms: number): void => {
  setTimeout(fn, clampFinite(ms, 0, 30000, 5000));
};

/** Slow flute: a planner books notes a few seconds ahead. Stop clears the timer and ends open notes. */
function fluteHandle(ctx: BaseAudioContext, seed: number): SynthHandle {
  const out = ctx.createGain();
  const breathSrc = loopSource(ctx, whiteNoise(Math.round(ctx.sampleRate * 4), makeRng(seed ^ 0x5bd1e995)));
  breathSrc.start();
  const live = new Set<AudioScheduledSourceNode>();
  const next = makePlanner(seed);
  const origin = ctx.currentTime;
  let pending = next();
  const tick = (): void => {
    while (pending.at < ctx.currentTime - origin + LOOKAHEAD_SEC) {
      playNote(ctx, pending, origin + pending.at, breathSrc, out, live);
      pending = next();
    }
  };
  tick();
  const timer = setInterval(tick, TICK_MS);
  const handle: SynthHandle = {
    connect: (d) => out.connect(d),
    disconnect: () => out.disconnect(),
    stop: (when) => {
      clearInterval(timer);
      for (const o of live) { try { o.stop(when); } catch { /* already stopped */ } }
      try { breathSrc.stop(when); } catch { /* already stopped */ }
    },
    onended: null,
  };
  breathSrc.onended = () => { clearInterval(timer); handle.onended?.(); };
  return handle;
}

export function buildSynth(ctx: BaseAudioContext, id: SynthId, seed: number): SynthHandle {
  const s = Math.trunc(clampFinite(seed, 0, 2 ** 31, 1));
  if (id === 'flute') return fluteHandle(ctx, s);
  if (id === 'bowl' || id === 'softchimes') return strikeHandle(ctx, id, s);
  return bedHandle(ctx, id, s);
}
