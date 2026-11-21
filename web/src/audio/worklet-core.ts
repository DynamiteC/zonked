import { WasmDsp, FRAME } from './dsp-wasm';
import { ParamReader, PARAM_COUNT } from './params';
import { TelemetryWriter } from './telemetry';
import type { EngineStats } from './types';

export const OUT_LIMIT = 0.95;

/** Worklet logic without AudioWorklet globals, so node tests can drive it. */
export class DspProcessorCore {
  private readonly dsp: WasmDsp;
  private readonly block = new Float32Array(PARAM_COUNT);
  private readonly pending = new Float32Array(PARAM_COUNT);
  private pendingDirty = false;
  private reader: ParamReader | null = null;
  private tele: TelemetryWriter | null = null;
  private peak = 0;
  private sumSq = 0;
  private samples = 0;
  private frames = 0;
  private nonZero = 0;

  constructor(wasm: ArrayBuffer | WebAssembly.Module, sampleRate: number,
              sab?: SharedArrayBuffer | ArrayBuffer, tele?: SharedArrayBuffer | ArrayBuffer) {
    const mod = wasm instanceof WebAssembly.Module ? wasm : new WebAssembly.Module(wasm);
    this.dsp = new WasmDsp(mod, sampleRate);
    if (sab) this.reader = new ParamReader(sab);
    if (tele) this.tele = new TelemetryWriter(tele);
  }

  /** postMessage fallback: copy into preallocated storage, applied at next process(). */
  setParamsFromMessage(p: ArrayLike<number>): void {
    for (let i = 0; i < PARAM_COUNT; i++) this.pending[i] = p[i] ?? 0;
    this.pendingDirty = true;
  }

  /** Renders one block (any length up to 128 per call, chunked). Allocation-free. */
  process(outL: Float32Array, outR: Float32Array): void {
    if (this.reader !== null && this.reader.read(this.block)) this.dsp.setParams(this.block);
    else if (this.pendingDirty) { this.pendingDirty = false; this.dsp.setParams(this.pending); }
    const n = Math.min(outL.length, outR.length);
    for (let off = 0; off < n; off += FRAME) {
      const len = Math.min(FRAME, n - off);
      this.dsp.render(len);
      this.copyOut(outL, outR, off, len);
    }
    this.frames += n;
    if (this.tele !== null) this.tele.push(outL, outR, n);
  }

  private copyOut(outL: Float32Array, outR: Float32Array, off: number, len: number): void {
    const l = this.dsp.left, r = this.dsp.right;
    for (let i = 0; i < len; i++) {
      let a = l[i] ?? 0, b = r[i] ?? 0;
      if (!(a === a) || a > OUT_LIMIT || a < -OUT_LIMIT) a = a > OUT_LIMIT ? OUT_LIMIT : a < -OUT_LIMIT ? -OUT_LIMIT : 0;
      if (!(b === b) || b > OUT_LIMIT || b < -OUT_LIMIT) b = b > OUT_LIMIT ? OUT_LIMIT : b < -OUT_LIMIT ? -OUT_LIMIT : 0;
      outL[off + i] = a;
      outR[off + i] = b;
      this.account(a);
      this.account(b);
    }
  }

  private account(v: number): void {
    const m = v < 0 ? -v : v;
    if (m > this.peak) this.peak = m;
    if (m !== 0) this.nonZero++;
    this.sumSq += v * v;
    this.samples++;
  }

  stats(): EngineStats {
    return {
      peak: this.peak,
      rms: this.samples > 0 ? Math.sqrt(this.sumSq / this.samples) : 0,
      frames: this.frames,
      nonZero: this.nonZero,
    };
  }
}
