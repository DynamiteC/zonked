// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CREW_KEY, isCrewEnabled, onCrewChange } from './bridgeClient';
import { CrewToggle } from './CrewToggle';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('CrewToggle', () => {
  it('is off by default and shows the plain-English copy', () => {
    render(<CrewToggle />);
    const box = screen.getByTestId('crew-toggle') as HTMLInputElement;
    expect(box.checked).toBe(false);
    expect(screen.getByText('Connect to Kiro Crew on this computer')).toBeTruthy();
    expect(screen.getByText('Only if you run the Zonked crew bridge here. Nothing leaves your computer.')).toBeTruthy();
  });

  it('writes the key and notifies subscribers on change', () => {
    const seen: boolean[] = [];
    const off = onCrewChange((v) => seen.push(v));
    render(<CrewToggle />);
    fireEvent.click(screen.getByTestId('crew-toggle'));
    expect(localStorage.getItem(CREW_KEY)).toBe('1');
    expect(isCrewEnabled()).toBe(true);
    fireEvent.click(screen.getByTestId('crew-toggle'));
    expect(localStorage.getItem(CREW_KEY)).toBe('0');
    expect(seen).toEqual([true, false]);
    off();
  });

  it('starts checked when already enabled and follows outside changes', () => {
    localStorage.setItem(CREW_KEY, '1');
    render(<CrewToggle />);
    expect((screen.getByTestId('crew-toggle') as HTMLInputElement).checked).toBe(true);
    act(() => {
      localStorage.setItem(CREW_KEY, '0');
    });
  });
});
