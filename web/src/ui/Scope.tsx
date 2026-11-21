import { useRef } from 'react';
import type { TelemetryReader } from '../audio/types';
import { useFrame } from './useFrame';

const W = 1000;
const H = 300;
const FRAMES = 512;
const SCOPE_W = 660;
const LISSA_X = 700;
const LISSA_S = 300;
const COLOR_L = '#FFE600';
const COLOR_R = '#00E5A8';

/** Draws one frame. Allocation-free: only numeric work and canvas calls. */
export function drawFrame(ctx: CanvasRenderingContext2D, buf: Float32Array, frames: number): void {
  ctx.clearRect(0, 0, W, H);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(SCOPE_W, H / 2);
  ctx.rect(LISSA_X, 0, LISSA_S, LISSA_S);
  ctx.moveTo(LISSA_X + LISSA_S / 2, 0);
  ctx.lineTo(LISSA_X + LISSA_S / 2, LISSA_S);
  ctx.moveTo(LISSA_X, LISSA_S / 2);
  ctx.lineTo(LISSA_X + LISSA_S, LISSA_S / 2);
  ctx.stroke();
  if (frames < 2) return;
  const amp = H * 0.45;
  const step = SCOPE_W / (frames - 1);
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLOR_L;
  ctx.beginPath();
  for (let i = 0; i < frames; i++) {
    const y = H / 2 - (buf[i * 2] ?? 0) * amp;
    if (i === 0) ctx.moveTo(0, y);
    else ctx.lineTo(i * step, y);
  }
  ctx.stroke();
  ctx.strokeStyle = COLOR_R;
  ctx.beginPath();
  for (let i = 0; i < frames; i++) {
    const y = H / 2 - (buf[i * 2 + 1] ?? 0) * amp;
    if (i === 0) ctx.moveTo(0, y);
    else ctx.lineTo(i * step, y);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,184,0,0.8)';
  ctx.beginPath();
  const c = LISSA_S / 2;
  for (let i = 0; i < frames; i++) {
    const x = LISSA_X + c + (buf[i * 2] ?? 0) * c * 0.9;
    const y = c - (buf[i * 2 + 1] ?? 0) * c * 0.9;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/** Root-mean-square of the interleaved stereo frames. */
export function rmsOf(buf: Float32Array, frames: number): number {
  if (frames <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < frames * 2; i++) sum += (buf[i] ?? 0) ** 2;
  return Math.sqrt(sum / (frames * 2));
}

export function Scope({ telemetry, onLevel }: { telemetry: TelemetryReader; onLevel?: (rms: number) => void }): React.JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null);
  const buf = useRef(new Float32Array(FRAMES * 2));

  useFrame(() => {
    const ctx = canvas.current?.getContext('2d');
    const frames = telemetry.read(buf.current);
    onLevel?.(rmsOf(buf.current, frames));
    if (ctx !== null && ctx !== undefined) drawFrame(ctx, buf.current, frames);
  }, true);

  return (
    <canvas
      ref={canvas}
      className="scope"
      data-testid="scope-canvas"
      width={W}
      height={H}
      role="img"
      aria-label="Left and right channel oscilloscope and stereo Lissajous plot"
    />
  );
}
