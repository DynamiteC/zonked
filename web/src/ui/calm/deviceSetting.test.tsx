// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CALM, DEVICE_LABEL } from './copy';
import { DEFAULT_PREFS } from './look';
import { SettingsScreen } from './SettingsScreen';

afterEach(cleanup);

describe('listening device setting', () => {
  it('shows Wired, Bluetooth and Speakers in Settings and reports a change', () => {
    const onDevice = vi.fn();
    render(
      <SettingsScreen device="wired" onDevice={onDevice} gentle={false} reduceMotion={false} reduced onGentle={() => undefined} onReduceMotion={() => undefined} onStudio={() => undefined} onForget={() => undefined} prefs={DEFAULT_PREFS} onPrefs={() => undefined} />,
    );
    expect(Object.values(DEVICE_LABEL)).toEqual(['Wired headphones', 'Bluetooth headphones', 'Speakers']);
    expect((screen.getByTestId('device-wired') as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByTestId('device-bluetooth'));
    expect(onDevice).toHaveBeenCalledWith('bluetooth');
  });

  it('the Bluetooth tip is one plain line about the sound input', () => {
    expect(CALM.btTip).toBe("If it sounds swooshy, set your computer's sound input to its own microphone so the headphones stay in music mode. In-ear and Bluetooth headphones can sound louder than you expect, so start very quiet.");
  });
});
