import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./visuals.css', import.meta.url), 'utf8');

type Frames = Record<string, Record<string, string>>;

function keyframes(): Record<string, Frames> {
  const out: Record<string, Frames> = {};
  for (const m of css.matchAll(/@keyframes ([\w-]+)\{((?:[^{}]|\{[^{}]*\})*)\}/g)) {
    const frames: Frames = {};
    for (const f of (m[2] ?? '').matchAll(/([\d.%,]+)\{([^}]*)\}/g)) {
      const decls: Record<string, string> = {};
      for (const d of (f[2] ?? '').split(';').filter(Boolean)) {
        const [k, v] = d.split(/:(.*)/s);
        decls[(k ?? '').trim()] = (v ?? '').trim();
      }
      for (const key of (f[1] ?? '').split(',')) frames[key] = { ...frames[key], ...decls };
    }
    out[m[1] ?? ''] = frames;
  }
  return out;
}

/** Value of one property at time t of a 3 s loop, taken from the nearest earlier keyframe. */
function valueAt(frames: Frames, prop: string, tSec: number, period = 3): string | undefined {
  const pct = ((tSec % period) / period) * 100 + (tSec > 0 && tSec % period === 0 ? 100 : 0);
  const keys = Object.keys(frames).map((k) => parseFloat(k)).sort((a, b) => a - b).filter((k) => k <= pct);
  for (let i = keys.length - 1; i >= 0; i -= 1) {
    const v = frames[`${keys[i]}%`]?.[prop];
    if (v !== undefined) return v;
  }
  return undefined;
}

const all = keyframes();

describe('scene loop keyframes', () => {
  it('finds the keyframes', () => {
    expect(Object.keys(all).length).toBeGreaterThanOrEqual(8);
  });

  it.each(Object.entries(all))('%s: frame at t=0 equals frame at t=3 s', (_name, frames) => {
    const props = new Set(Object.values(frames).flatMap((f) => Object.keys(f)));
    for (const p of props) {
      expect(valueAt(frames, p, 3), p).toBe(valueAt(frames, p, 0));
    }
  });

  it('every animation is infinite and runs 3 s or 1.5 s (under 1 Hz)', () => {
    const uses = [...css.matchAll(/animation:([\w-]+) ([\d.]+)s [\w-]+ infinite/g)];
    expect(uses.length).toBeGreaterThanOrEqual(9);
    for (const u of uses) {
      const dur = Number(u[2]);
      expect([3, 1.5]).toContain(dur);
      expect(3 / dur).toBe(Math.round(3 / dur));
      expect(1 / dur).toBeLessThan(1);
    }
  });

  it('wide-area keyframes change opacity by at most 0.1', () => {
    const wide = Object.entries(all).filter(([n]) => n.startsWith('vl-w'));
    expect(wide.length).toBeGreaterThan(0);
    for (const [, frames] of wide) {
      const ops = Object.values(frames).map((f) => Number(f['opacity']));
      expect(ops.every(Number.isFinite)).toBe(true);
      expect(Math.max(...ops) - Math.min(...ops)).toBeLessThanOrEqual(0.1);
    }
  });

  it('keeps every other opacity swing on small elements only (halo under 0.1)', () => {
    const halo = all['vl-halo'] ?? {};
    const ops = Object.values(halo).map((f) => Number(f['opacity']));
    expect(Math.max(...ops) - Math.min(...ops)).toBeLessThanOrEqual(0.1);
  });

  it('has a reduced-motion still frame and a hidden-tab pause', () => {
    expect(css).toContain('.vl-still');
    expect(css).toContain('animation-play-state:paused');
  });

  it('uses no url(), no @import, no remote data', () => {
    expect(css).not.toMatch(/url\(|@import|https?:/);
  });
});
