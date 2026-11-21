// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Mascot } from './Mascot';

const voice = { carrierHz: 200, beatHz: 10, noise: 'off', noiseLevel: 0, mode: 'binaural', gain: 0.3 } as const;
let now = 0;
let queue: FrameRequestCallback[] = [];

/** Runs n animation frames of 16 ms each. */
const frames = (n: number): void => {
  for (let i = 0; i < n; i++) {
    const run = queue;
    queue = [];
    now += 16;
    act(() => run.forEach((cb) => cb(now)));
  }
};
const v = (el: HTMLElement, k: string): number => parseFloat(el.style.getPropertyValue(k) || '0');

beforeEach(() => {
  now = 1000;
  queue = [];
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => queue.push(cb));
  vi.stubGlobal('cancelAnimationFrame', () => undefined);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const setup = (p: { playing?: boolean; reduced?: boolean; getLevel?: () => number; onToggle?: () => void }) => {
  render(
    <Mascot playing={p.playing ?? false} synced={false} reduced={p.reduced ?? false} getVoice={() => voice} onToggle={p.onToggle ?? (() => undefined)} getLevel={p.getLevel} />,
  );
  const m = screen.getByTestId('mascot');
  m.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200, x: 0, y: 0, toJSON: () => ({}) });
  return m;
};

describe('Mascot interaction', () => {
  it('drag changes --ry and the click after it is suppressed', () => {
    const onToggle = vi.fn();
    const m = setup({ onToggle });
    frames(2);
    fireEvent.pointerDown(m, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(m, { pointerId: 1, clientX: 160, clientY: 100 });
    frames(40);
    expect(Math.abs(v(m, '--ry'))).toBeGreaterThan(5);
    fireEvent.pointerUp(m, { pointerId: 1, clientX: 160, clientY: 100 });
    fireEvent.click(m);
    expect(onToggle).not.toHaveBeenCalled();
    fireEvent.click(m);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('spins back after release', () => {
    const m = setup({});
    frames(1);
    fireEvent.pointerDown(m, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(m, { pointerId: 1, clientX: 100 + 90, clientY: 100 });
    frames(60);
    fireEvent.pointerUp(m, { pointerId: 1 });
    fireEvent.pointerLeave(m);
    frames(400);
    expect(Math.abs(v(m, '--ry'))).toBeLessThan(0.5);
  });

  it('a plain click without a drag toggles', () => {
    const onToggle = vi.fn();
    const m = setup({ onToggle });
    fireEvent.pointerDown(m, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerUp(m, { pointerId: 1 });
    fireEvent.click(m);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('pointerleave and pointercancel reset the tilt', () => {
    const m = setup({});
    frames(1);
    fireEvent.pointerEnter(m, { clientX: 190, clientY: 100 });
    frames(80);
    expect(Math.abs(v(m, '--ry'))).toBeGreaterThan(5);
    fireEvent.pointerLeave(m);
    frames(120);
    expect(Math.abs(v(m, '--ry'))).toBeLessThan(0.2);
    fireEvent.pointerEnter(m, { clientX: 190, clientY: 100 });
    frames(80);
    fireEvent.pointerCancel(m);
    frames(120);
    expect(Math.abs(v(m, '--ry'))).toBeLessThan(0.2);
    expect(v(m, '--hover')).toBeLessThan(0.05);
  });
});

describe('Mascot audio depth', () => {
  it('level raises --depth while playing, capped, and settles back', () => {
    let level = 0.9;
    const m = setup({ playing: true, getLevel: () => level });
    frames(120);
    const d = v(m, '--depth');
    expect(d).toBeGreaterThan(1.1);
    expect(d).toBeLessThanOrEqual(1.36);
    level = 0;
    frames(200);
    expect(v(m, '--depth')).toBeLessThan(1.02);
  });

  it('a level spike moves --depth smoothly (no flash faster than the low-pass)', () => {
    let level = 0;
    const m = setup({ playing: true, getLevel: () => level });
    frames(30);
    level = 1;
    frames(1);
    expect(v(m, '--depth') - 1).toBeLessThan(0.1);
  });

  it('ignores NaN levels', () => {
    const m = setup({ playing: true, getLevel: () => Number.NaN });
    frames(30);
    expect(v(m, '--depth')).toBe(1);
  });
});

describe('Mascot reduced motion', () => {
  it('never reads the level and freezes every var', () => {
    const getLevel = vi.fn(() => 0.8);
    const m = setup({ playing: true, reduced: true, getLevel });
    frames(30);
    fireEvent.pointerEnter(m, { clientX: 190, clientY: 190 });
    fireEvent.pointerMove(m, { clientX: 10, clientY: 10 });
    fireEvent.pointerDown(m, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(m, { pointerId: 1, clientX: 190, clientY: 100 });
    frames(30);
    expect(getLevel).not.toHaveBeenCalled();
    expect(m.getAttribute('data-motion')).toBe('frozen');
    expect(Math.abs(v(m, '--rx'))).toBeLessThan(0.01);
    expect(Math.abs(v(m, '--ry'))).toBeLessThan(0.01);
    expect(v(m, '--depth')).toBe(1);
  });
});
