// Web Audio graph for the struck sounds (singing bowl, soft chimes). The handle is shaped like a buffer
// source, so the sample layer fades, stops and cleans it up the same way as a loop.
import { clampFinite } from './dsp';
import { makeStrikePlanner, strikeLength } from './strikes';
import type { Strike, StrikeKind } from './strikes';
import type { SynthHandle } from './graph';

/** How far ahead strikes are booked, and how often the scheduler wakes. */
const LOOKAHEAD_SEC = 4;
const TICK_MS = 1000;
/** Gain nodes are freed a little after the last voice has ended. */
const FREE_DELAY_MS = 500;

function voice(ctx: BaseAudioContext, hz: number, amp: number, at: number, s: Strike, tau: number, out: AudioNode, live: Set<AudioScheduledSourceNode>): void {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(amp, at + s.attack);
  g.gain.setTargetAtTime(0, at + s.attack, tau);
  g.connect(out);
  const osc = ctx.createOscillator();
  osc.frequency.value = clampFinite(hz, 20, 12000, 440);
  osc.connect(g);
  osc.start(at);
  osc.stop(at + strikeLength(s));
  live.add(osc);
  osc.onended = () => { live.delete(osc); osc.disconnect(); g.disconnect(); };
}

function playStrike(ctx: BaseAudioContext, s: Strike, at: number, out: AudioNode, live: Set<AudioScheduledSourceNode>): void {
  for (const p of s.partials) {
    const hz = s.hz * p.ratio;
    const level = s.amp * p.amp;
    if (p.beat > 0) {
      voice(ctx, hz, level / 2, at, s, p.tau, out, live);
      voice(ctx, hz + p.beat, level / 2, at, s, p.tau, out, live);
    } else voice(ctx, hz, level, at, s, p.tau, out, live);
  }
}

/** A planner books strikes a few seconds ahead. Stop clears the timer and ends open voices. */
export function strikeHandle(ctx: BaseAudioContext, kind: StrikeKind, seed: number): SynthHandle {
  const out = ctx.createGain();
  // A silent looping buffer keeps the handle alive and gives it an end event, like a loop source.
  const keep = ctx.createBufferSource();
  keep.buffer = ctx.createBuffer(1, 2, ctx.sampleRate);
  keep.loop = true;
  keep.start();
  const live = new Set<AudioScheduledSourceNode>();
  const next = makeStrikePlanner(kind, seed);
  const origin = ctx.currentTime;
  let pending = next();
  const tick = (): void => {
    while (pending.at < ctx.currentTime - origin + LOOKAHEAD_SEC) {
      playStrike(ctx, pending, origin + pending.at, out, live);
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
      try { keep.stop(when); } catch { /* already stopped */ }
    },
    onended: null,
  };
  keep.onended = () => { clearInterval(timer); setTimeout(() => out.disconnect(), FREE_DELAY_MS); handle.onended?.(); };
  return handle;
}
