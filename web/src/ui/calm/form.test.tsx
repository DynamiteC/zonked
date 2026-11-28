// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AudioEngine, EngineStatus } from '../../audio/types';
import { createStore } from '../../storage/db';
import { CALM } from './copy';
import { ModeRoot } from './ModeRoot';
import { Painted, skyFor } from './Painted';
import { CalmMascot } from './mascot';
import type { MascotMood } from './mascot';

function engine(): AudioEngine {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status,
    telemetry: { read: () => 0 },
    start: vi.fn(async () => void (status.state = 'running')),
    stop: vi.fn(async () => void (status.state = 'stopped')),
    setVoice: vi.fn(),
    getStats: vi.fn(async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 })),
    onStatus: () => () => undefined,
  } as unknown as AudioEngine;
}

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

const here = (f: string): string => readFileSync(join(__dirname, f), 'utf8');

describe('one form template', () => {
  it('keeps the footer in the same place and Next at one class on steps 1 to 3 and the safety step', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
    const shape = (): readonly string[] => {
      const foot = screen.getByTestId('form-foot');
      return [foot.children.length.toString(), foot.lastElementChild?.className ?? '', screen.getByTestId('form-head').children.length.toString()];
    };
    const first = shape();
    expect(screen.getByRole('button', { name: CALM.skip }).parentElement?.firstElementChild?.textContent).toBe(CALM.skip);
    fireEvent.click(screen.getByRole('button', { name: CALM.next }));
    await screen.findByText(CALM.whenTitle, { selector: 'h1' });
    expect(shape()).toEqual(first);
    expect(screen.getByTestId('form-foot').firstElementChild?.textContent).toBe(CALM.back);
    fireEvent.click(screen.getByRole('button', { name: CALM.next }));
    await screen.findByText(CALM.listenTitle, { selector: 'h1' });
    expect(shape()).toEqual(first);
    fireEvent.click(screen.getByRole('button', { name: CALM.next }));
    expect(shape()[1]).toBe(first[1]);
    expect(screen.getByTestId('calm-safety-accept').className).toContain('c-next-btn');
  });

  it('uses one yellow token and no second yellow in the normal themes', () => {
    const css = here('calm-tokens.css') + here('form.css') + here('painted.css');
    expect(css).not.toMatch(/#EDBB37/i);
    const tokens = here('calm-tokens.css');
    const normal = tokens.slice(0, tokens.indexOf('data-contrast'));
    const yellows = new Set(normal.match(/--c-accent: #[0-9A-F]{6}/gi));
    expect([...yellows]).toEqual(['--c-accent: #FFC93C']);
  });

  it('draws no Selected word on rows', async () => {
    render(<ModeRoot engine={engine()} store={createStore(undefined)} />);
    await screen.findByText(CALM.goalTitle, { selector: 'h1' });
    expect(screen.queryByText(CALM.selected)).toBeNull();
  });
});

describe('painted canvas and mascot', () => {
  it('maps hours to the four skies', () => {
    expect([4, 6, 12, 18, 21, Number.NaN].map(skyFor)).toEqual(['night', 'dawn', 'day', 'dusk', 'night', 'day']);
    render(<Painted hour={6} />);
    expect(screen.getByTestId('painted').getAttribute('data-tod')).toBe('dawn');
  });

  it('stills the clouds when motion is off', () => {
    const css = here('calm.css');
    expect(css).toContain('data-motion="off"');
    expect(here('painted.css')).toContain('prefers-reduced-motion');
  });

  it.each(['idle', 'happy', 'sleepy', 'listening', 'breathing'] as MascotMood[])('draws mood %s as a head with headphones and no body', (mood) => {
    const { container } = render(<CalmMascot mood={mood} reducedMotion />);
    expect(container.querySelector('.cm-bodyl')).toBeNull();
    expect(container.querySelector('.cm-face')).not.toBeNull();
    expect(container.querySelector('.cm-band')).not.toBeNull();
    expect(container.querySelector('.cm-still')).not.toBeNull();
  });
});
