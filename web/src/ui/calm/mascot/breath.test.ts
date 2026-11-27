import { describe, expect, it } from 'vitest';
import { breathCurve, breathLabel } from './breath';

describe('breathCurve', () => {
  it('stays inside 0..1 for a whole cycle', () => {
    for (let t = -20; t < 40; t += 0.05) {
      const v = breathCurve(t);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('starts empty, peaks full at 4 s, is empty again at 8 s', () => {
    expect(breathCurve(0)).toBeCloseTo(0, 6);
    expect(breathCurve(4)).toBeCloseTo(1, 6);
    expect(breathCurve(8)).toBeCloseTo(0, 6);
    expect(breathCurve(16)).toBeCloseTo(0, 6);
  });

  it('starts slow, is fullest in the middle and gentle at the top', () => {
    const rise = (a: number, b: number): number => breathCurve(b) - breathCurve(a);
    expect(rise(0, 0.5)).toBeLessThan(rise(1.75, 2.25));
    expect(rise(3.5, 4)).toBeLessThan(rise(1.75, 2.25));
  });

  it('exhales faster early than late, with a short rest near empty', () => {
    const fall = (a: number, b: number): number => breathCurve(a) - breathCurve(b);
    expect(fall(4, 4.5)).toBeGreaterThan(0);
    expect(fall(4.5, 5)).toBeGreaterThan(fall(6.5, 7));
    expect(breathCurve(7.6)).toBeCloseTo(0, 6);
    expect(breathCurve(7.9)).toBeCloseTo(0, 6);
    expect(breathCurve(3.9)).toBeGreaterThan(0.99);
  });

  it('is a smooth path with no jumps', () => {
    let prev = breathCurve(0);
    for (let t = 0.01; t < 16; t += 0.01) {
      const v = breathCurve(t);
      expect(Math.abs(v - prev)).toBeLessThan(0.02);
      prev = v;
    }
  });

  it('handles NaN and infinity', () => {
    for (const bad of [Number.NaN, Infinity, -Infinity]) {
      const v = breathCurve(bad, bad, bad);
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(breathCurve(Number.NaN)).toBe(0);
  });

  it('respects custom phase lengths', () => {
    expect(breathCurve(2, 2, 6)).toBeCloseTo(1, 6);
    expect(breathCurve(8, 2, 6)).toBeCloseTo(0, 6);
  });
});

describe('breathLabel', () => {
  it('says in for 4 s then out for 4 s', () => {
    expect(breathLabel(0)).toBe('Breathe in');
    expect(breathLabel(3.99)).toBe('Breathe in');
    expect(breathLabel(4)).toBe('Breathe out');
    expect(breathLabel(7.99)).toBe('Breathe out');
    expect(breathLabel(8)).toBe('Breathe in');
    expect(breathLabel(Number.NaN)).toBe('Breathe in');
  });
});
