import type { TelemetryReader } from './types';

export const RING_FRAMES = 8192;
export const DECIMATION = 4;
const MASK = RING_FRAMES - 1;
const HEADER_BYTES = 8; // Int32Array(2): write index, read index
export const TELEMETRY_BYTES = HEADER_BYTES + RING_FRAMES * 2 * 4;

export function createTelemetryBuffer(shared: boolean): SharedArrayBuffer | ArrayBuffer {
  return shared ? new SharedArrayBuffer(TELEMETRY_BYTES) : new ArrayBuffer(TELEMETRY_BYTES);
}

/** SPSC ring writer. Counters are free-running int32; slot = counter & MASK. Drops on overflow. */
export class TelemetryWriter {
  private readonly idx: Int32Array;
  private readonly ring: Float32Array;
  private phase = 0;
  dropped = 0;
  constructor(buffer: SharedArrayBuffer | ArrayBuffer) {
    this.idx = new Int32Array(buffer, 0, 2);
    this.ring = new Float32Array(buffer, HEADER_BYTES, RING_FRAMES * 2);
  }
  /** Pushes every DECIMATION-th frame of (left, right)[0..n). */
  push(left: Float32Array, right: Float32Array, n: number): void {
    let w = Atomics.load(this.idx, 0);
    const r = Atomics.load(this.idx, 1);
    let phase = this.phase;
    for (let i = 0; i < n; i++) {
      if (phase === 0) {
        if (((w - r) | 0) >= RING_FRAMES) {
          this.dropped++;
        } else {
          const o = (w & MASK) * 2;
          this.ring[o] = left[i] ?? 0;
          this.ring[o + 1] = right[i] ?? 0;
          w = (w + 1) | 0;
        }
      }
      phase = (phase + 1) % DECIMATION;
    }
    this.phase = phase;
    Atomics.store(this.idx, 0, w);
  }
}

/** Consumer. read() copies the newest frames and marks everything consumed. */
export class RingTelemetryReader implements TelemetryReader {
  private readonly idx: Int32Array;
  private readonly ring: Float32Array;
  constructor(buffer: SharedArrayBuffer | ArrayBuffer) {
    this.idx = new Int32Array(buffer, 0, 2);
    this.ring = new Float32Array(buffer, HEADER_BYTES, RING_FRAMES * 2);
  }
  read(out: Float32Array): number {
    const w = Atomics.load(this.idx, 0);
    const r = Atomics.load(this.idx, 1);
    let avail = (w - r) | 0;
    if (avail <= 0) return 0;
    if (avail > RING_FRAMES) avail = RING_FRAMES;
    const n = Math.min(avail, out.length >> 1);
    let start = (w - n) | 0;
    for (let i = 0; i < n; i++) {
      const o = (start & MASK) * 2;
      out[i * 2] = this.ring[o] ?? 0;
      out[i * 2 + 1] = this.ring[o + 1] ?? 0;
      start = (start + 1) | 0;
    }
    Atomics.store(this.idx, 1, w);
    return n;
  }
}

/** Reader used when no shared memory exists. */
export const emptyTelemetry: TelemetryReader = { read: () => 0 };
