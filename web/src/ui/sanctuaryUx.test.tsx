// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tintForHour } from './useTimeTint';
import { SoundPicker } from './SoundPicker';
import { COPY } from './copy';

afterEach(cleanup);

describe('SoundPicker', () => {
  it('renders six cards and plays the rain switch choice', () => {
    const onPlay = vi.fn();
    render(<SoundPicker templateId={null} playing={false} reduced={false} onPlay={onPlay} />);
    expect(COPY.cards).toHaveLength(6);
    fireEvent.click(screen.getByTestId('sound-switch-deep'));
    fireEvent.click(screen.getByTestId('sound-card-rain').querySelector('[data-testid=sound-card-play]') as HTMLElement);
    expect(onPlay).toHaveBeenCalledWith('deep');
  });

  it('marks only the playing card live, and none when motion is reduced', () => {
    const { rerender } = render(<SoundPicker templateId="starter-lofi" playing reduced={false} onPlay={() => undefined} />);
    expect(screen.getByTestId('sound-card-lofi').querySelector('[data-live=true]')).not.toBeNull();
    expect(screen.getByTestId('sound-card-piano').querySelector('[data-live=true]')).toBeNull();
    rerender(<SoundPicker templateId="starter-lofi" playing reduced onPlay={() => undefined} />);
    expect(document.querySelector('[data-live=true]')).toBeNull();
  });
});

describe('tintForHour', () => {
  it('maps hours to four tints', () => {
    expect([4, 6, 12, 18, 22].map(tintForHour)).toEqual(['night', 'dawn', 'day', 'dusk', 'night']);
  });
});
