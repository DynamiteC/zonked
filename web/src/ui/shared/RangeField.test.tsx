// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { RangeField, fraction, levelTicks } from './RangeField';

afterEach(cleanup);

function Harness({ bands = false }: { bands?: boolean }): React.JSX.Element {
  const [v, setV] = useState(0.5);
  return (
    <RangeField
      id="r"
      testId="r"
      min={0}
      max={1}
      step={0.25}
      value={v}
      valueText={`${Math.round(v * 100)} percent`}
      bubbleText={`${Math.round(v * 100)}`}
      ticks={levelTicks()}
      {...(bands
        ? {
            bands: [
              { from: 0, to: 0.5, label: 'Low', active: v < 0.5 },
              { from: 0.5, to: 1, label: 'High', active: v >= 0.5 },
            ],
          }
        : {})}
      onChange={setV}
    />
  );
}

describe('RangeField', () => {
  it('renders five ticks with Off and Max labels', () => {
    render(<Harness />);
    const labels = screen.getAllByTestId('rf-tick').map((t) => t.textContent);
    expect(labels).toEqual(['Off', '25', '50', '75', 'Max']);
  });

  it('exposes the human value as aria-valuetext', () => {
    render(<Harness />);
    expect(screen.getByTestId('r').getAttribute('aria-valuetext')).toBe('50 percent');
  });

  it('shows the value bubble on focus and hides it on blur', () => {
    render(<Harness />);
    expect(screen.queryByTestId('rf-bubble')).toBeNull();
    fireEvent.focus(screen.getByTestId('r'));
    expect(screen.getByTestId('rf-bubble').textContent).toBe('50');
    fireEvent.blur(screen.getByTestId('r'));
    expect(screen.queryByTestId('rf-bubble')).toBeNull();
  });

  it('shows the bubble while dragging', () => {
    render(<Harness />);
    fireEvent.pointerDown(screen.getByTestId('r'));
    expect(screen.getByTestId('rf-bubble')).toBeTruthy();
    fireEvent.pointerUp(screen.getByTestId('r'));
    expect(screen.queryByTestId('rf-bubble')).toBeNull();
  });

  it('updates the value and fill share on change (arrow keys fire native change events)', () => {
    render(<Harness />);
    const input = screen.getByTestId('r') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0.75' } });
    expect(input.getAttribute('aria-valuetext')).toBe('75 percent');
    expect((screen.getByTestId('r-field') as HTMLElement).style.getPropertyValue('--f')).toBe('0.75');
  });

  it('is a native range input with the step set, so the browser handles arrow keys', () => {
    render(<Harness />);
    const input = screen.getByTestId('r') as HTMLInputElement;
    expect(input.type).toBe('range');
    expect(input.step).toBe('0.25');
  });

  it('draws bands and marks the active one', () => {
    render(<Harness bands />);
    const bands = screen.getAllByTestId('rf-band');
    expect(bands.map((b) => b.textContent)).toEqual(['Low', 'High']);
    expect(bands.map((b) => b.getAttribute('data-active'))).toEqual(['false', 'true']);
    fireEvent.change(screen.getByTestId('r'), { target: { value: '0' } });
    expect(screen.getAllByTestId('rf-band').map((b) => b.getAttribute('data-active'))).toEqual(['true', 'false']);
  });
});

describe('fraction and levelTicks', () => {
  it('clamps and survives NaN', () => {
    expect(fraction(5, 0, 1)).toBe(1);
    expect(fraction(-1, 0, 1)).toBe(0);
    expect(fraction(Number.NaN, 0, 1)).toBe(0);
    expect(fraction(1, 1, 1)).toBe(0);
  });

  it('stops ticks at a lower max', () => {
    expect(levelTicks(0.6).map((t) => t.label)).toEqual(['Off', '25', '50', 'Max']);
    expect(levelTicks(0.6).at(-1)?.value).toBe(0.6);
  });
});
