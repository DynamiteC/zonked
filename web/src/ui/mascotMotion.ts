/** Pure motion math for the 3D mascot. No DOM, deterministic, unit tested. */

export const MAX_TILT_DEG = 12;
export const MAX_SPIN_DEG = 180;
export const AUDIO_DEPTH_CAP = 0.35;
const DRAG_DEG_PER_PX = 0.8;

const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

export interface MascotPose {
  /** Eased tilt in degrees about X and Y. */
  rx: number;
  ry: number;
  /** Eased pointer offset in -1..1, drives SVG parallax. */
  px: number;
  py: number;
  /** Drag spin about Y in degrees and its angular velocity. */
  spin: number;
  spinV: number;
  /** Hover depth 0..1 and audio depth 0..AUDIO_DEPTH_CAP. */
  hover: number;
  audio: number;
}

export interface MascotTarget {
  nx: number;
  ny: number;
  hover: boolean;
  dragging: boolean;
  /** Dragged spin in degrees while the pointer is down. */
  dragSpin: number;
  /** 0..1 level, capped by AUDIO_DEPTH_CAP. */
  level: number;
}

export const initialPose = (): MascotPose => ({ rx: 0, ry: 0, px: 0, py: 0, spin: 0, spinV: 0, hover: 0, audio: 0 });

/** Pointer position to -1..1 offsets from the center of a rect. */
export function pointerOffset(
  x: number,
  y: number,
  rect: { left: number; top: number; width: number; height: number },
): { nx: number; ny: number } {
  if (rect.width <= 0 || rect.height <= 0) return { nx: 0, ny: 0 };
  return {
    nx: clamp(((x - rect.left) / rect.width) * 2 - 1, -1, 1),
    ny: clamp(((y - rect.top) / rect.height) * 2 - 1, -1, 1),
  };
}

/** Maps horizontal drag distance to a spin angle (degrees), clamped. */
export const dragToSpin = (dxPx: number): number => clamp(dxPx * DRAG_DEG_PER_PX, -MAX_SPIN_DEG, MAX_SPIN_DEG);

/** Frame-rate independent exponential easing factor. */
export const easeFactor = (dt: number, rate: number): number => 1 - Math.exp(-Math.max(0, dt) * rate);

export function isSettled(p: MascotPose, t: MascotTarget): boolean {
  return (
    Math.abs(p.ry - t.nx * MAX_TILT_DEG) < 0.02 &&
    Math.abs(p.rx + t.ny * MAX_TILT_DEG) < 0.02 &&
    Math.abs(p.spin) < 0.05 &&
    Math.abs(p.spinV) < 0.05 &&
    Math.abs(p.hover - (t.hover ? 1 : 0)) < 0.005 &&
    Math.abs(p.audio - clamp(t.level, 0, 1) * AUDIO_DEPTH_CAP) < 0.002
  );
}

/** Advances the pose by dt seconds toward the target. Returns true while still moving. */
export function stepPose(p: MascotPose, t: MascotTarget, dt: number): boolean {
  const d = Math.min(0.05, Math.max(0, dt));
  const k = easeFactor(d, 10);
  p.ry += (t.nx * MAX_TILT_DEG - p.ry) * k;
  p.rx += (-t.ny * MAX_TILT_DEG - p.rx) * k;
  p.px += (t.nx - p.px) * k;
  p.py += (t.ny - p.py) * k;
  p.hover += ((t.hover ? 1 : 0) - p.hover) * easeFactor(d, 8);
  const level = clamp(t.level, 0, 1) * AUDIO_DEPTH_CAP;
  p.audio += (level - p.audio) * easeFactor(d, 6);
  if (t.dragging) {
    p.spin += (t.dragSpin - p.spin) * easeFactor(d, 25);
    p.spinV = 0;
  } else {
    // Damped spring back to zero (semi-implicit Euler).
    p.spinV += (-70 * p.spin - 9 * p.spinV) * d;
    p.spin += p.spinV * d;
  }
  return !isSettled(p, t);
}

/** Parallax depths in SVG user units at full pointer offset, per logo group. */
export const PARALLAX_DEPTH = { ring: 4, plates: 12, eyes: 20, diamond: 28 } as const;
