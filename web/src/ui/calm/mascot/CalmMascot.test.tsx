// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CalmMascot, type MascotMood } from './index';

const MOODS: readonly MascotMood[] = ['idle', 'happy', 'sleepy', 'listening', 'breathing', 'focus', 'steering', 'tired', 'done', 'offline', 'error', 'loading'];
const SIZES = [24, 40, 72, 120, 190, 400] as const;
const css = readFileSync(join(__dirname, 'mascot.css'), 'utf8');
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('CalmMascot', () => {
  it.each(MOODS)('renders mood %s', (mood) => {
    render(<CalmMascot mood={mood} />);
    expect(screen.getByRole('img').getAttribute('data-mood')).toBe(mood);
  });

  it('uses default and custom labels', () => {
    const { rerender } = render(<CalmMascot />);
    expect(screen.getByLabelText('Zonked mascot')).toBeTruthy();
    rerender(<CalmMascot label="Hello" />);
    expect(screen.getByLabelText('Hello')).toBeTruthy();
  });

  it('adds no listeners when reducedMotion is set', () => {
    const add = vi.spyOn(window, 'addEventListener');
    render(<CalmMascot reducedMotion />);
    expect(add.mock.calls.filter(([t]) => t === 'pointermove' || t === 'deviceorientation')).toHaveLength(0);
    expect(screen.getByRole('img').className).toContain('cm-still');
  });

  it('adds listeners and removes them on unmount', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const del = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<CalmMascot reducedMotion={false} />);
    expect(add.mock.calls.some(([t]) => t === 'pointermove')).toBe(true);
    unmount();
    expect(del.mock.calls.some(([t]) => t === 'pointermove')).toBe(true);
    expect(add.mock.calls.some(([t]) => t === 'deviceorientation')).toBe(false);
  });

  it('turns the head on pointer move', () => {
    render(<CalmMascot reducedMotion={false} />);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: window.innerWidth, clientY: 0 }));
    expect(screen.getByRole('img').style.getPropertyValue('--ry')).toBe('8.00deg');
  });

  it.each(SIZES)('renders every mood at size %i with role img and a label', (size) => {
    for (const mood of MOODS) {
      const { unmount } = render(<CalmMascot mood={mood} size={size} label={`m-${mood}`} reducedMotion />);
      const el = screen.getByRole('img', { name: `m-${mood}` });
      expect(el.style.width).toBe(`${size}px`);
      expect(el.querySelectorAll('.cm-bar')).toHaveLength(4);
      unmount();
    }
  });

  it('draws the head only at small sizes and the body and hill at large sizes', () => {
    const small = render(<CalmMascot size={40} />);
    expect(small.container.querySelector('.cm-bodyl')).toBeNull();
    expect(small.container.querySelector('.cm-compact')).not.toBeNull();
    small.unmount();
    const big = render(<CalmMascot size={120} />);
    expect(big.container.querySelector('.cm-bodyl')).not.toBeNull();
    expect(big.container.querySelector('.cm-compact')).toBeNull();
  });

  it('keeps the original parts: ring eyes, two plates, four slits, two ear pods, gem', () => {
    const { container } = render(<CalmMascot size={200} />);
    expect(container.querySelectorAll('.cm-eye')).toHaveLength(2);
    expect(container.querySelectorAll('.cm-bar')).toHaveLength(4);
    expect(container.querySelectorAll('.cm-pod')).toHaveLength(2);
    expect(container.querySelectorAll('polygon.cm-f-mask')).toHaveLength(2);
    expect(container.querySelectorAll('.cm-gem')).toHaveLength(1);
  });

  it('clamps size to 24..640 and survives bad numbers', () => {
    const a = render(<CalmMascot size={2} />);
    expect(screen.getByRole('img').style.width).toBe('24px');
    a.unmount();
    const b = render(<CalmMascot size={Number.NaN} breathPhase={Number.NaN} level={9} />);
    expect(screen.getByRole('img').style.width).toBe('220px');
    expect(screen.getByRole('img').style.getPropertyValue('--lv')).toBe('1');
    b.unmount();
  });

  it('has no animation under reduced motion: still class and css switch every animation off', () => {
    render(<CalmMascot mood="loading" reducedMotion />);
    expect(screen.getByRole('img').className).toContain('cm-still');
    expect(css).toMatch(/\.cm-still \.cm-body[^{]*\.cm-ring\{animation:none\}/);
    expect(css).toContain('@media (prefers-reduced-motion:reduce)');
    expect(css).toContain('@media (forced-colors:active)');
    expect(css).toContain("[data-theme='dark']");
  });

  it('never flashes: no animation shorter than 1 second', () => {
    const times = [...css.matchAll(/animation:[^;}]*?\s(\d*\.?\d+)s\s/g)].map((m) => Number(m[1]));
    expect(times.length).toBeGreaterThan(5);
    expect(Math.min(...times)).toBeGreaterThanOrEqual(1);
  });
});
