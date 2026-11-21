import { LEGACY_PARAM_COUNT, PARAM_COUNT } from './params';

interface DspExports {
  memory: WebAssembly.Memory;
  zk_init(sampleRate: number): void;
  zk_param_block(): number;
  zk_apply_params(): void;
  zk_render(frames: number): void;
  zk_out_left(): number;
  zk_out_right(): number;
  zk_reset_phase(): void;
  /** Absent in the original 8-slot ABI. */
  zk_param_count?: () => number;
}

export const FRAME = 128;

/** Pure wrapper over the dsp-core C ABI (contract C1). No imports, no allocation per render. */
export class WasmDsp {
  private readonly ex: DspExports;
  private readonly last = new Float32Array(PARAM_COUNT);
  private hasParams = false;
  /** Slots the loaded wasm actually owns (8 for an older module, up to 32). */
  readonly slots: number;
  private buf: ArrayBufferLike;
  private paramView: Float32Array;
  private lView: Float32Array;
  private rView: Float32Array;

  constructor(module: WebAssembly.Module, sampleRate: number) {
    const inst = new WebAssembly.Instance(module, {});
    this.ex = inst.exports as unknown as DspExports;
    this.ex.zk_init(sampleRate);
    const n = typeof this.ex.zk_param_count === 'function' ? Number(this.ex.zk_param_count()) : LEGACY_PARAM_COUNT;
    this.slots = Number.isFinite(n) ? Math.max(LEGACY_PARAM_COUNT, Math.min(PARAM_COUNT, Math.floor(n))) : LEGACY_PARAM_COUNT;
    this.buf = this.ex.memory.buffer;
    this.paramView = new Float32Array(this.buf, this.ex.zk_param_block(), this.slots);
    this.lView = new Float32Array(this.buf, this.ex.zk_out_left(), FRAME);
    this.rView = new Float32Array(this.buf, this.ex.zk_out_right(), FRAME);
  }

  private refresh(): void {
    if (this.ex.memory.buffer === this.buf) return;
    this.buf = this.ex.memory.buffer;
    this.paramView = new Float32Array(this.buf, this.ex.zk_param_block(), this.slots);
    this.lView = new Float32Array(this.buf, this.ex.zk_out_left(), FRAME);
    this.rView = new Float32Array(this.buf, this.ex.zk_out_right(), FRAME);
  }

  /** Writes the block and applies it only when it differs from the last applied one. */
  setParams(block: Float32Array): boolean {
    let changed = !this.hasParams;
    for (let i = 0; i < this.slots; i++) {
      if (block[i] !== this.last[i]) { changed = true; break; }
    }
    if (!changed) return false;
    this.refresh();
    for (let i = 0; i < this.slots; i++) {
      const v = block[i] ?? 0;
      this.last[i] = v;
      this.paramView[i] = v;
    }
    this.hasParams = true;
    this.ex.zk_apply_params();
    return true;
  }

  render(frames: number = FRAME): void {
    this.ex.zk_render(frames);
    this.refresh();
  }

  get left(): Float32Array { return this.lView; }
  get right(): Float32Array { return this.rView; }
  resetPhase(): void { this.ex.zk_reset_phase(); }
}
