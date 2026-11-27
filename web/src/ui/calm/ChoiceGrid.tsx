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

/** One big radio group. Native inputs keep the arrow keys and screen reader names. */
export function ChoiceGrid<T extends string>({ legend, options, value, onChange }: Props<T>): React.JSX.Element {
  const name = useId();
  return (
    <fieldset className="c-choices">
      <legend className="c-sr">{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className="c-choice">
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
