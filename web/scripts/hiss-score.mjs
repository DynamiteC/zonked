#!/usr/bin/env node
// Offline tool. Scores every recorded loop by its hiss: the share of energy above 6 kHz.
// Run once when a loop is added or changed, then copy the printed numbers into
// web/src/audio/samples/catalog.ts (field "hiss"). Never runs in the app or in CI.
// Needs ffmpeg on PATH to decode the mp3 files. Prints a table, writes nothing.
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'samples');
const RATE = 44100;
const WIN = 4096;
export const HISS_HZ = 6000;
/** A loop with less than this share above 6 kHz is btFriendly. */
export const FRIENDLY_BELOW = 0.04;

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < len / 2; k++) {
        const wr = Math.cos(ang * k), wi = Math.sin(ang * k);
        const a = i + k, b = i + k + len / 2;
        const xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
        re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
      }
    }
  }
}

/** Share of spectral energy at or above hz, averaged over Hann windows (Welch). */
export function hissShare(samples, rate = RATE, hz = HISS_HZ) {
  const cut = Math.round((hz / rate) * WIN);
  let hi = 0, all = 0;
  const hop = WIN * 2;
  for (let s = 0; s + WIN <= samples.length; s += hop) {
    const re = new Float64Array(WIN), im = new Float64Array(WIN);
    for (let i = 0; i < WIN; i++) re[i] = samples[s + i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / WIN));
    fft(re, im);
    for (let k = 1; k < WIN / 2; k++) {
      const p = re[k] * re[k] + im[k] * im[k];
      all += p;
      if (k >= cut) hi += p;
    }
  }
  return all > 0 ? hi / all : 0;
}

function decode(file) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-f', 'mp3', '-i', 'pipe:0', '-ac', '1', '-ar', String(RATE), '-f', 'f32le', 'pipe:1'],
    { input: readFileSync(file), maxBuffer: 1 << 29 });
  if (r.status !== 0) throw new Error(`ffmpeg failed on ${file}: ${String(r.stderr)}`);
  const b = r.stdout;
  return new Float32Array(b.buffer, b.byteOffset, Math.floor(b.byteLength / 4));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.mp3.json')).sort();
  for (const f of files) {
    const share = hissShare(decode(join(DIR, f)));
    console.log(`${f.replace('.mp3.json', '').padEnd(10)} hiss ${share.toFixed(4)}  btFriendly ${share < FRIENDLY_BELOW}`);
  }
}
