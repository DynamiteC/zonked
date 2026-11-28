// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EYES } from './eyes';
import { PROP_NAME } from './props';
import { blinkGap, seeded } from './useLife';
import { CalmMascot, type MascotMood } from './index';

const MOODS: readonly MascotMood[] = ['idle', 'happy', 'sleepy', 'listening', 'breathing', 'focus', 'steering', 'tired', 'done', 'offline', 'error', 'loading'];
const SIZES = [24, 40, 72, 120, 190, 400] as const;
const css = readFileSync(join(__dirname, 'mascot.css'), 'utf8');
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

/** Stubs matchMedia so only the listed queries match. */
function media(on: readonly string[]): void {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: on.some((k) => q.includes(k)), media: q, addEventListener: () => undefined, removeEventListener: () => undefined }));
}

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
    media(['pointer: fine']);
    const { unmount } = render(<CalmMascot reducedMotion={false} />);
    expect(add.mock.calls.some(([t]) => t === 'pointermove')).toBe(true);
    unmount();
    expect(del.mock.calls.some(([t]) => t === 'pointermove')).toBe(true);
    expect(add.mock.calls.some(([t]) => t === 'deviceorientation')).toBe(false);
  });

  it('turns the head on pointer move', () => {
    media(['pointer: fine']);
    render(<CalmMascot reducedMotion={false} />);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: window.innerWidth, clientY: 0 }));
    expect(screen.getByRole('img').style.getPropertyValue('--ry')).toBe('6.00deg');
  });

  it('adds no pointer listener on a coarse pointer and never asks for tilt permission', () => {
    media(['pointer: coarse']);
    const add = vi.spyOn(window, 'addEventListener');
    const ask = vi.fn();
    vi.stubGlobal('DeviceOrientationEvent', Object.assign(function Dev() { return undefined; }, { requestPermission: ask }));
    render(<CalmMascot reducedMotion={false} />);
    expect(add.mock.calls.some(([t]) => t === 'pointermove')).toBe(false);
    expect(ask).not.toHaveBeenCalled();
  });

  it('draws filters only from 72 px: none at 24 and 40, one grain filter above', () => {
    for (const size of [24, 40]) {
      const { container, unmount } = render(<CalmMascot size={size} reducedMotion />);
      expect(container.querySelectorAll('filter')).toHaveLength(0);
      expect(container.querySelector('.cm-grain')).toBeNull();
      expect(container.querySelector('[filter]')).toBeNull();
      unmount();
    }
    for (const size of [72, 120, 200]) {
      const { container, unmount } = render(<CalmMascot size={size} reducedMotion />);
      expect(container.querySelectorAll('filter')).toHaveLength(1);
      expect(container.querySelectorAll('[filter]')).toHaveLength(1);
      unmount();
    }
  });

  it('uses no filter in css and no body part in any size', () => {
    expect(css).not.toMatch(/drop-shadow|filter\s*:\s*blur/);
    const { container } = render(<CalmMascot size={200} reducedMotion />);
    expect(container.querySelector('.cm-bodyl')).toBeNull();
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

  it('draws the head only: no body, hoodie, arms, feet or hill at any size or mood', () => {
    for (const size of SIZES) for (const mood of MOODS) {
      const { container, unmount } = render(<CalmMascot size={size} mood={mood} />);
      for (const c of ['cm-bodyl', 'cm-hood', 'cm-trim', 'cm-pocket', 'cm-cord', 'cm-chest', 'cm-hill-a', 'cm-hill-b']) expect(container.querySelector(`.${c}`)).toBeNull();
      expect(container.querySelector('.cm-compact') !== null).toBe(size <= 96);
      expect(container.querySelector('.cm-gshadow') !== null).toBe(size > 96);
      unmount();
    }
    expect(css).not.toMatch(/hill|chest|bodyl/);
  });

  it('breathes on the head: scale about 3 percent and a lift follow breathPhase', () => {
    const inhale = render(<CalmMascot mood="breathing" breathPhase={1} reducedMotion={false} />);
    const sway = inhale.container.querySelector<HTMLElement>('.cm-sway');
    expect(Number(sway?.style.scale)).toBeCloseTo(1.03, 3);
    expect(sway?.style.translate).toMatch(/^0px? -1\.2\d*%$|^0 -1\.20%$/);
    inhale.rerender(<CalmMascot mood="breathing" breathPhase={0} reducedMotion={false} />);
    expect(Number(sway?.style.scale)).toBe(1);
    inhale.unmount();
    const still = render(<CalmMascot mood="breathing" breathPhase={1} reducedMotion />);
    expect(still.container.querySelector<HTMLElement>('.cm-sway')?.style.scale).toBe('');
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
    expect(css).toMatch(/\.cm-still \*\{animation:none!important/);
    expect(css).toMatch(/@media \(prefers-reduced-motion:reduce\)\{\s*\.cm-stage \*\{animation:none!important/);
    expect(css).toContain('@media (prefers-reduced-motion:reduce)');
    expect(css).toContain('@media (forced-colors:active)');
    expect(css).toContain("[data-theme='dark']");
  });

  it('never flashes: no animation shorter than 1 second', () => {
    const times = [...css.matchAll(/animation:[^;}]*?\s(\d*\.?\d+)s\s/g)].map((m) => Number(m[1]));
    expect(times.length).toBeGreaterThan(5);
    expect(Math.min(...times)).toBeGreaterThanOrEqual(1);
  });

  it('gives every mood its own marker: eye shapes plus one prop', () => {
    const seen = new Set<string>();
    for (const mood of MOODS) {
      const { container, unmount } = render(<CalmMascot mood={mood} size={200} reducedMotion />);
      const eyes = [...container.querySelectorAll('.cm-eye')].map((e) => e.getAttribute('data-eye'));
      expect(eyes).toEqual([...EYES[mood]]);
      const prop = container.querySelector('[data-prop]')?.getAttribute('data-prop') ?? 'none';
      if (mood === 'listening') expect(prop).toBe('ripples');
      else expect(prop).toBe(PROP_NAME[mood] ?? 'none');
      seen.add(`${eyes.join('/')}|${prop}`);
      unmount();
    }
    expect(seen.size).toBe(MOODS.length);
  });

  it('keeps the prop at 72 px and draws it only for its mood', () => {
    const a = render(<CalmMascot mood="sleepy" size={72} reducedMotion />);
    expect(a.container.querySelector('[data-prop="zzz"]')).not.toBeNull();
    a.unmount();
    const b = render(<CalmMascot mood="idle" size={72} reducedMotion />);
    expect(b.container.querySelector('.cm-props')).toBeNull();
  });

  it('blinks on a seeded 4 to 7 s timer and clears it on unmount', () => {
    vi.useFakeTimers();
    try {
      const { unmount } = render(<CalmMascot mood="idle" reducedMotion={false} />);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(7001);
      expect(vi.getTimerCount()).toBe(1);
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally { vi.useRealTimers(); }
    const a = seeded(5); const b = seeded(5);
    expect([a(), a()]).toEqual([b(), b()]);
    for (let i = 0; i < 50; i += 1) {
      const g = blinkGap(a(), false);
      expect(g).toBeGreaterThanOrEqual(4000);
      expect(g).toBeLessThanOrEqual(7000);
    }
  });

  it('starts no timer under reduced motion or for moods that do not blink', () => {
    vi.useFakeTimers();
    try {
      render(<CalmMascot mood="idle" reducedMotion />);
      expect(vi.getTimerCount()).toBe(0);
      cleanup();
      render(<CalmMascot mood="sleepy" reducedMotion={false} />);
      expect(vi.getTimerCount()).toBe(0);
    } finally { vi.useRealTimers(); }
  });

  it('pauses animations while the tab is hidden and removes the listener', () => {
    const del = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<CalmMascot reducedMotion={false} />);
    const el = screen.getByRole('img');
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(el.classList.contains('cm-paused')).toBe(true);
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(el.classList.contains('cm-paused')).toBe(false);
    unmount();
    expect(del.mock.calls.some(([t]) => t === 'visibilitychange')).toBe(true);
  });
});
