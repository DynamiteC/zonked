// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SafetyGate } from './SafetyGate';

afterEach(cleanup);

describe('SafetyGate', () => {
  it('states the headphones and not-a-medical-device notice', () => {
    render(<SafetyGate onAccept={vi.fn()} onCancel={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toMatch(/stereo headphones/i);
    expect(dialog.textContent).toMatch(/not a medical device/i);
    expect(dialog.textContent).toMatch(/volume low/i);
  });

  it('starts nothing until accepted, and Cancel or Escape never accepts', () => {
    const accept = vi.fn();
    const cancel = vi.fn();
    render(<SafetyGate onAccept={accept} onCancel={cancel} />);
    expect(accept).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Not now'));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(cancel).toHaveBeenCalledTimes(2);
    expect(accept).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('safety-accept'));
    expect(accept).toHaveBeenCalledTimes(1);
  });

  it('keeps Tab focus inside the dialog', () => {
    render(<SafetyGate onAccept={vi.fn()} onCancel={vi.fn()} />);
    const ok = screen.getByTestId('safety-accept');
    expect(document.activeElement).toBe(ok);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByText('Not now'));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(ok);
  });
});
