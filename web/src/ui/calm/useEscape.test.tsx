// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useEscape } from './useEscape';

afterEach(cleanup);

function Box({ onClose, active = true }: { onClose: () => void; active?: boolean }): null {
  useEscape(onClose, active);
  return null;
}

describe('useEscape', () => {
  it('closes from the page body, where Safari leaves focus after a tap', () => {
    const close = vi.fn();
    render(<Box onClose={close} />);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(close).toHaveBeenCalledTimes(1);
  });
  it('lets only the topmost dialog answer, and ignores other keys', () => {
    const under = vi.fn();
    const top = vi.fn();
    render(<><Box onClose={under} /><Box onClose={top} /></>);
    fireEvent.keyDown(document.body, { key: 'a' });
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(top).toHaveBeenCalledTimes(1);
    expect(under).not.toHaveBeenCalled();
  });
  it('does nothing when inactive', () => {
    const close = vi.fn();
    render(<Box onClose={close} active={false} />);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(close).not.toHaveBeenCalled();
  });
});
