// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CALM } from './copy';
import { DEFAULT_PREFS, LOOK_KEY_V1, PREFS_KEY, dimOn, isNight, migrateV1, readPrefs, resolveLook, useLook } from './look';
import { SettingsScreen } from './SettingsScreen';

function Probe(): React.JSX.Element {
  const { look, prefs, setPrefs } = useLook();
  return (
    <>
      <p data-testid="look">{`${look.theme}-${look.highContrast ? 'high' : 'normal'}`}</p>
      <SettingsScreen gentle={false} reduceMotion={false} reduced onGentle={() => undefined} onReduceMotion={() => undefined} onStudio={() => undefined} onForget={() => undefined} prefs={prefs} onPrefs={setPrefs} />
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});
afterEach(() => cleanup());

describe('theme prefs', () => {
  it('reads v2 and falls back on junk', () => {
    expect(readPrefs(JSON.stringify({ choice: 'contrast', dim: false, announce: false }))).toEqual({ choice: 'contrast', dim: false, announce: false });
    expect(readPrefs('{"choice":"neon","dim":"x"}')).toEqual(DEFAULT_PREFS);
    expect(readPrefs('not json')).toEqual(DEFAULT_PREFS);
    expect(readPrefs(null)).toEqual(DEFAULT_PREFS);
  });

  it('migrates v1: high contrast wins, then the saved theme', () => {
    expect(migrateV1('{"theme":"light","highContrast":true}').choice).toBe('contrast');
    expect(migrateV1('{"theme":"light","highContrast":false}').choice).toBe('light');
    expect(migrateV1('{"theme":"dark","highContrast":false}').choice).toBe('dark');
    expect(migrateV1(null)).toEqual(DEFAULT_PREFS);
  });

  it('resolves system and contrast against the system theme', () => {
    expect(resolveLook({ ...DEFAULT_PREFS, choice: 'system' }, 'light')).toEqual({ theme: 'light', highContrast: false });
    expect(resolveLook({ ...DEFAULT_PREFS, choice: 'contrast' }, 'dark')).toEqual({ theme: 'dark', highContrast: true });
    expect(resolveLook({ ...DEFAULT_PREFS, choice: 'light' }, 'dark').theme).toBe('light');
  });

  it('dim is automatic from 19:00 to 07:00 unless the person chose', () => {
    const at = (h: number): Date => new Date(2026, 0, 5, h, 0, 0);
    expect([6, 7, 18, 19, 23, 0].map((h) => isNight(at(h)))).toEqual([true, false, false, true, true, true]);
    expect(dimOn(DEFAULT_PREFS, at(21))).toBe(true);
    expect(dimOn(DEFAULT_PREFS, at(12))).toBe(false);
    expect(dimOn({ ...DEFAULT_PREFS, dim: false }, at(21))).toBe(false);
    expect(dimOn({ ...DEFAULT_PREFS, dim: true }, at(12))).toBe(true);
  });
});

describe('theme switch in Settings', () => {
  it('persists across a remount and applies high contrast', () => {
    const first = render(<Probe />);
    expect(screen.getByTestId('look').textContent).toBe('dark-normal');
    fireEvent.click(screen.getByTestId('theme-contrast'));
    expect(screen.getByTestId('look').textContent).toBe('dark-high');
    expect(JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}').choice).toBe('contrast');
    first.unmount();
    render(<Probe />);
    expect(screen.getByTestId('look').textContent).toBe('dark-high');
    expect((screen.getByTestId('theme-contrast') as HTMLInputElement).checked).toBe(true);
  });

  it('migrates a v1 look on first load and then writes v2', () => {
    localStorage.setItem(LOOK_KEY_V1, JSON.stringify({ theme: 'light', highContrast: false }));
    render(<Probe />);
    expect(screen.getByTestId('look').textContent).toBe('light-normal');
    expect((screen.getByTestId('theme-light') as HTMLInputElement).checked).toBe(true);
    act(() => void fireEvent.click(screen.getByTestId('theme-dark')));
    expect(JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}').choice).toBe('dark');
  });

  it('offers all four choices, a dim switch and the announce switch', () => {
    render(<Probe />);
    for (const c of ['system', 'light', 'dark', 'contrast'] as const) expect(screen.getByText(CALM.themeChoices[c])).toBeTruthy();
    fireEvent.click(screen.getByTestId('dim-switch'));
    expect(JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}').dim).not.toBeNull();
    fireEvent.click(screen.getByTestId('announce-switch'));
    expect(JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}').announce).toBe(false);
  });
});
