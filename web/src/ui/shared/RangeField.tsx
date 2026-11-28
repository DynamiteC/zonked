import { useState } from 'react';
import './range-field.css';

export interface RangeTick {
  readonly value: number;
  readonly label: string;
}

/** A soft segment drawn under the track, in slider units (from inclusive, to exclusive; the last one reaches max). */
export interface RangeBand {
  readonly from: number;
  readonly to: number;
  readonly label: string;
  readonly active?: boolean;
}

export interface RangeFieldProps {
  id: string;
  testId?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  /** Human text for assistive tech, for example "8 hertz, Alpha, relaxed". */
  valueText: string;
  onChange: (value: number) => void;
  /** Short text in the bubble while dragging or focused. Defaults to the number. */
  bubbleText?: string;
  ticks?: readonly RangeTick[];
  bands?: readonly RangeBand[];
  disabled?: boolean;
}

/** Share of the track (0 to 1) for a value. NaN and out of range clamp. */
export function fraction(value: number, min: number, max: number): number {
  if (!Number.isFinite(value) || max <= min) return 0;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

/** Ticks for a 0 to max level slider: Off, 25, 50, 75, then Max at the top end. */
export function levelTicks(max = 1): RangeTick[] {
  const marks: RangeTick[] = [
    { value: 0, label: 'Off' },
    { value: 0.25, label: '25' },
    { value: 0.5, label: '50' },
    { value: 0.75, label: '75' },
  ];
  return [...marks.filter((t) => t.value < max - 0.01), { value: max, label: 'Max' }];
}

const at = (f: number): React.CSSProperties => ({ ['--f' as string]: f });

/**
 * A native range input with a filled track, a value bubble, tick marks and named bands.
 * The input stays native so keyboard and screen readers work as usual.
 */
export function RangeField(p: RangeFieldProps): React.JSX.Element {
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const f = fraction(p.value, p.min, p.max);
  const showBubble = focused || dragging;
  return (
    <div className="rf" style={at(f)} data-testid={p.testId ? `${p.testId}-field` : undefined}>
      <div className="rf-top">
        {showBubble && (
          <span className="rf-bubble" aria-hidden="true" data-testid="rf-bubble">
            {p.bubbleText ?? String(p.value)}
          </span>
        )}
      </div>
      <input
        id={p.id}
        data-testid={p.testId}
        className="rf-input"
        type="range"
        min={p.min}
        max={p.max}
        step={p.step}
        value={p.value}
        disabled={p.disabled}
        aria-valuetext={p.valueText}
        onChange={(e) => p.onChange(Number(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setDragging(false);
        }}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      />
      {p.bands && p.bands.length > 0 && (
        <div className="rf-bands" aria-hidden="true">
          {p.bands.map((b) => (
            <span
              key={`${b.label}-${b.from}`}
              className="rf-band"
              data-active={b.active ? 'true' : 'false'}
              data-testid="rf-band"
              style={{ left: `${fraction(b.from, p.min, p.max) * 100}%`, width: `${(fraction(b.to, p.min, p.max) - fraction(b.from, p.min, p.max)) * 100}%` }}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
      {p.ticks && p.ticks.length > 0 && (
        <div className="rf-ticks" aria-hidden="true">
          {p.ticks.map((t) => (
            <span key={`${t.value}-${t.label}`} className="rf-tick" data-testid="rf-tick" style={at(fraction(t.value, p.min, p.max))}>
              <i />
              <b>{t.label}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
