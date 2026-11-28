import { useId } from 'react';

export interface ChoiceOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface Props<T extends string> {
  readonly legend: string;
  readonly options: readonly ChoiceOption<T>[];
  readonly value: T;
  readonly onChange: (v: T) => void;
}

/** One radio group. Native inputs keep the arrow keys and screen reader names. The picked row shows a yellow radio, not a word. */
export function ChoiceGrid<T extends string>({ legend, options, value, onChange }: Props<T>): React.JSX.Element {
  const name = useId();
  return (
    <fieldset className="c-choices">
      <legend className="c-sr">{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className="c-choice" data-on={value === o.value ? 'true' : 'false'}>
          <input type="radio" name={name} value={o.value} aria-label={o.label} checked={value === o.value} onChange={() => onChange(o.value)} />
          <span className="c-radio" aria-hidden="true" />
          <span className="c-opt" aria-hidden="true">
            {o.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
