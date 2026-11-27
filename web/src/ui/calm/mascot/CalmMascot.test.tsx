// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CalmMascot, type MascotMood } from './index';

const MOODS: readonly MascotMood[] = ['idle', 'happy', 'sleepy', 'listening', 'breathing'];
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
});
