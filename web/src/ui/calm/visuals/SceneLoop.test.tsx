// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SceneLoop, type SceneSituation } from './index';

const SITUATIONS: readonly SceneSituation[] = ['focus', 'calm', 'sleep', 'nature'];
afterEach(cleanup);

const svg = (c: HTMLElement): SVGElement => c.querySelector('svg') as unknown as SVGElement;

describe('SceneLoop', () => {
  it.each(SITUATIONS)('renders %s as decorative svg with shapes', (s) => {
    const { container } = render(<SceneLoop situation={s} reducedMotion={false} />);
    expect(svg(container).getAttribute('aria-hidden')).toBe('true');
    expect(svg(container).getAttribute('class')).toContain(`vl-${s}`);
    expect(container.querySelectorAll('path,circle,ellipse,rect,line').length).toBeGreaterThan(8);
  });

  it('renders a still frame with reducedMotion', () => {
    const { container } = render(<SceneLoop situation="sleep" reducedMotion />);
    expect(svg(container).getAttribute('class')).toContain('vl-still');
  });

  it('pauses while the tab is hidden and resumes after', () => {
    const { container } = render(<SceneLoop situation="calm" reducedMotion={false} />);
    expect(svg(container).getAttribute('class')).not.toContain('vl-paused');
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(svg(container).getAttribute('class')).toContain('vl-paused');
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(svg(container).getAttribute('class')).not.toContain('vl-paused');
  });

  it('forces a theme when asked', () => {
    const { container } = render(<SceneLoop situation="focus" theme="dark" reducedMotion />);
    expect(svg(container).getAttribute('data-vl')).toBe('dark');
  });
});
