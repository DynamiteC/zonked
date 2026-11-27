// Pure preparation of a person's own sound: mono mix down, peak normalise, 2 s crossfade loop.
// No Web Audio here, so every rule is unit tested.

export const MAX_OWN_BYTES = 8 * 1024 * 1024;
export const MAX_OWN_SECONDS = 600;
/** Under this length a sound plays once instead of looping. */
export const ONCE_UNDER_SECONDS = 20;
export const CROSSFADE_SEC = 2;
/** Same peak as the shipped loops, so level and blend feel the same for every sound. */
export const TARGET_PEAK = 0.45;
const MIN_PEAK = 1e-4;

export type OwnPrepared =
  | { readonly ok: true; readonly data: Float32Array; readonly loop: boolean }
  | { readonly ok: false; readonly error: string };

/** Average all channels. Non-finite samples count as silence. */
export function mixToMono(channels: readonly Float32Array[]): Float32Array {
  const n = channels[0]?.length ?? 0;
  const out = new Float32Array(n);
  const k = Math.max(1, channels.length);
  for (const ch of channels) {
    const len = Math.min(n, ch.length);
    for (let i = 0; i < len; i++) {
      const v = ch[i] ?? 0;
      out[i] = (out[i] ?? 0) + (Number.isFinite(v) ? v : 0) / k;
    }
  }
  return out;
}

/** Equal-power crossfade: the tail fades into the head, so the end flows into the start. */
export function crossfadeLoop(mono: Float32Array, xf: number): Float32Array {
  const m = mono.length - xf;
  const out = mono.slice(0, m);
  for (let i = 0; i < xf; i++) {
    const t = ((i + 0.5) / xf) * (Math.PI / 2);
    out[i] = (mono[i] ?? 0) * Math.sin(t) + (mono[m + i] ?? 0) * Math.cos(t);
  }
  return out;
}

export function prepareOwn(channels: readonly Float32Array[], sampleRate: number): OwnPrepared {
  if (!Number.isFinite(sampleRate) || sampleRate <= 0 || channels.length === 0) return { ok: false, error: 'This file has no sound in it.' };
  const mono = mixToMono(channels);
  const seconds = mono.length / sampleRate;
  if (seconds > MAX_OWN_SECONDS) return { ok: false, error: 'This file is longer than 10 minutes.' };
  let peak = 0;
  for (const v of mono) peak = Math.max(peak, Math.abs(v));
  if (peak < MIN_PEAK) return { ok: false, error: 'This file is silent.' };
  const gain = TARGET_PEAK / peak;
  for (let i = 0; i < mono.length; i++) mono[i] = (mono[i] ?? 0) * gain;
  if (seconds < ONCE_UNDER_SECONDS) return { ok: true, data: mono, loop: false };
  const xf = Math.min(Math.round(CROSSFADE_SEC * sampleRate), Math.floor(mono.length / 4));
  return { ok: true, data: crossfadeLoop(mono, xf), loop: true };
}
