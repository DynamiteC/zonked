import { DspProcessorCore } from './worklet-core';

// AudioWorkletGlobalScope declarations (not in lib.dom).
declare const sampleRate: number;
declare class AudioWorkletProcessor {
  readonly port: MessagePort;
  constructor();
}
declare function registerProcessor(name: string, ctor: new () => AudioWorkletProcessor): void;

interface InitMsg {
  type: 'init';
  wasm: ArrayBuffer | WebAssembly.Module;
  sab?: SharedArrayBuffer;
  tele?: SharedArrayBuffer;
}

class ZonkedDsp extends AudioWorkletProcessor {
  private core: DspProcessorCore | null = null;

  constructor() {
    super();
    this.port.onmessage = (e: MessageEvent): void => this.onMessage(e.data as Record<string, unknown>);
  }

  private onMessage(m: Record<string, unknown>): void {
    const type = m['type'];
    if (type === 'init') {
      const init = m as unknown as InitMsg;
      try {
        this.core = new DspProcessorCore(init.wasm, sampleRate, init.sab, init.tele);
        this.port.postMessage({ type: 'ready' });
      } catch (err) {
        this.port.postMessage({ type: 'error', message: String(err) });
      }
    } else if (type === 'params' && this.core !== null) {
      this.core.setParamsFromMessage(m['p'] as ArrayLike<number>);
    } else if (type === 'stats-request') {
      const s = this.core?.stats() ?? { peak: 0, rms: 0, frames: 0, nonZero: 0 };
      this.port.postMessage({ type: 'stats', id: m['id'], ...s });
    }
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const out = outputs[0];
    const l = out?.[0];
    if (this.core === null || l === undefined) return true;
    const r = out?.[1] ?? l;
    this.core.process(l, r);
    return true;
  }
}

registerProcessor('zonked-dsp', ZonkedDsp as unknown as new () => AudioWorkletProcessor);
