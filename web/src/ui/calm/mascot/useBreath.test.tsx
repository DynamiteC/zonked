// @vitest-environment jsdom
import type { JSX } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BreathCue, useBreath } from './useBreath';
import { CalmMascot } from './index';

function Probe({ running }: { readonly running: boolean }): JSX.Element {
  const b = useBreath(running);
  return <><BreathCue label={b.label} /><i data-testid="p">{b.phase.toFixed(3)}</i></>;
}

let now = 0;
let queue: Array<(t: number) => void> = [];
beforeEach(() => {
  now = 0;
  queue = [];
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => queue.push(cb));
  vi.stubGlobal('cancelAnimationFrame', () => { queue = []; });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const step = (ms: number): void => {
  now += ms;
  const cbs = queue;
  queue = [];
  act(() => { cbs.forEach((cb) => cb(now)); });
};

describe('useBreath', () => {
  it('shows a polite live cue that flips at 4 s', () => {
    render(<Probe running />);
    const cue = screen.getByRole('status');
    expect(cue.getAttribute('aria-live')).toBe('polite');
    step(2000);
    expect(cue.textContent).toBe('Breathe in');
    expect(Number(screen.getByTestId('p').textContent)).toBeGreaterThan(0.4);
    step(2100);
    expect(cue.textContent).toBe('Breathe out');
  });

  it('stays at rest when not running and stops its frame loop on unmount', () => {
    const { unmount } = render(<Probe running={false} />);
    expect(queue).toHaveLength(0);
    expect(screen.getByTestId('p').textContent).toBe('0.000');
    unmount();
  });

  it('cancels the frame request on unmount', () => {
    const { unmount } = render(<Probe running />);
    expect(queue).toHaveLength(1);
    unmount();
    expect(queue).toHaveLength(0);
  });
});

describe('CalmMascot new props', () => {
  it('writes clamped breath and level and the situation class', () => {
    render(<CalmMascot reducedMotion breathPhase={2} level={Number.NaN} situation="sleep" />);
    const el = screen.getByRole('img');
    expect(el.style.getPropertyValue('--bp')).toBe('1');
    expect(el.style.getPropertyValue('--lv')).toBe('0');
    expect(el.className).toContain('cm-s-sleep');
    expect(el.className).toContain('cm-driven');
  });
});
