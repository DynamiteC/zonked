// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from '../app/App';
import { createStore } from '../storage/db';
import type { AudioEngine, EngineStatus } from '../audio/types';
import { QUICKSTART_KEY } from './QuickStart';

function engine(): AudioEngine {
  const status: EngineStatus = { state: 'idle', sampleRate: 48000, usesSharedMemory: false, crossOriginIsolated: false };
  return {
    status,
    telemetry: { read: () => 0 },
    start: async () => undefined,
    stop: async () => undefined,
    setVoice: () => undefined,
    getStats: async () => ({ peak: 0, rms: 0, frames: 0, nonZero: 0 }),
    onStatus: () => () => undefined,
  } as unknown as AudioEngine;
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(QUICKSTART_KEY, '1');
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

const mount = (): void => void render(<App engine={engine()} store={createStore(undefined)} bridgeCreate={() => null} />);

describe('polish', () => {
  it('prints the safety line once and hides Output when the device is unknown', () => {
    mount();
    expect(document.body.textContent?.match(/not a medical device/gi)?.length).toBe(1);
    expect(screen.queryByTestId('device-status')).toBeNull();
    expect(document.body.textContent).not.toMatch(/Output: unknown/);
  });

  it('shows the fast-pulse note only above 25 Hz', () => {
    mount();
    expect(screen.queryByTestId('hearing-note')).toBeNull();
  });

  it('a click on Play does not leave its tooltip open, keyboard focus does', () => {
    mount();
    const btn = screen.getByTestId('play-button');
    fireEvent.pointerDown(btn);
    fireEvent.focus(btn);
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.keyDown(btn, { key: 'Tab' });
    fireEvent.focus(btn);
    expect(screen.getByRole('tooltip')).toBeTruthy();
  });

  it('mounts the crew switch inside Advanced, off by default', () => {
    mount();
    const sw = screen.getByTestId('crew-toggle') as HTMLInputElement;
    expect(sw.checked).toBe(false);
  });
});
