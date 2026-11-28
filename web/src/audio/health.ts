// Sound health: counts hiccups (render underruns, late frames, decode and loop-seam failures).
// Pure counting and wording. Everything stays in memory on this device. Nothing is sent anywhere.

export type HiccupKind = 'underrun' | 'late' | 'decode' | 'seam';

/** The window shown in Advanced: the last 5 minutes. */
export const HEALTH_WINDOW_MS = 5 * 60 * 1000;
/** Stored events never exceed this, so a bad device cannot grow memory. */
const MAX_EVENTS = 500;
/** Frames in one render quantum of the AudioWorklet. */
export const QUANTUM = 128;
/** The output delay may grow by this much between two checks before a frame counts as late. */
export const LATE_JUMP_SEC = 0.04;
/** A loop whose ends differ by more than this share of its peak would click at the seam. */
export const SEAM_LIMIT = 0.5;

/** Render quanta the browser skipped between two process() calls. 0 when none. */
export function skippedQuanta(lastFrame: number, frame: number, quantum = QUANTUM): number {
  if (!Number.isFinite(lastFrame) || !Number.isFinite(frame) || frame <= lastFrame) return 0;
  const gap = frame - lastFrame - quantum;
  return gap >= quantum ? Math.floor(gap / quantum) : 0;
}

/** True when the output delay grew by more than the allowed jump. NaN and negative values never count. */
export function isLateJump(prevSec: number, curSec: number, limit = LATE_JUMP_SEC): boolean {
  if (!Number.isFinite(prevSec) || !Number.isFinite(curSec) || prevSec < 0 || curSec < 0) return false;
  return curSec - prevSec > limit;
}

/** True when the first and last samples of a loop jump by more than SEAM_LIMIT of its peak. */
export function hasSeamJump(first: number, last: number, peak: number): boolean {
  if (!Number.isFinite(first) || !Number.isFinite(last) || !Number.isFinite(peak) || peak <= 0) return false;
  return Math.abs(first - last) > SEAM_LIMIT * peak;
}

interface Hiccup {
  readonly at: number;
  readonly kind: HiccupKind;
}

export class HealthLog {
  private events: Hiccup[] = [];

  /** Adds `n` hiccups at time `at` (milliseconds). Bad numbers are ignored. */
  record(at: number, kind: HiccupKind, n = 1): void {
    if (!Number.isFinite(at) || !Number.isFinite(n)) return;
    const count = Math.min(Math.max(0, Math.floor(n)), MAX_EVENTS);
    for (let i = 0; i < count; i++) this.events.push({ at, kind });
    if (this.events.length > MAX_EVENTS) this.events = this.events.slice(this.events.length - MAX_EVENTS);
  }

  /** Hiccups in the window that ends at `now`. */
  count(now: number, windowMs = HEALTH_WINDOW_MS): number {
    return this.events.filter((e) => e.at <= now && now - e.at < windowMs).length;
  }

  /** Counts per kind in the window. */
  byKind(now: number, windowMs = HEALTH_WINDOW_MS): Readonly<Record<HiccupKind, number>> {
    const out: Record<HiccupKind, number> = { underrun: 0, late: 0, decode: 0, seam: 0 };
    for (const e of this.events) if (e.at <= now && now - e.at < windowMs) out[e.kind]++;
    return out;
  }

  reset(): void {
    this.events = [];
  }
}

/** One shared log for the page. */
export const healthLog = new HealthLog();

/** The line shown in Advanced. */
export function healthLine(count: number): string {
  if (count <= 0) return 'Sound health: smooth';
  return `${count} ${count === 1 ? 'hiccup' : 'hiccups'} in the last 5 minutes`;
}

/** Plain advice. Empty when the sound is smooth. */
export function healthHint(count: number): string {
  return count > 0 ? 'Close heavy apps and move closer to your device. If it keeps happening, try wired headphones.' : '';
}
