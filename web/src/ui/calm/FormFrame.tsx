import { Mascot } from './MascotView';
import type { MascotMood } from './mascot';

/** The one form template: header row, title, helper line, options, and a footer that never moves. */
interface HeadProps {
  /** 1 to 3 fills that many segments of the bar. */
  readonly step: 1 | 2 | 3;
  readonly text: string;
  readonly mood?: MascotMood;
  readonly reduced: boolean;
}

export function FormHead({ step, text, mood = 'idle', reduced }: HeadProps): React.JSX.Element {
  return (
    <div className="c-fhead" data-testid="form-head">
      <Mascot size={72} mood={mood} reduced={reduced} />
      <div className="c-fhead-text">
        <p className="c-step">{text}</p>
        <div className="c-bar" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <i key={n} data-on={n <= step ? 'true' : 'false'} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FootProps {
  /** Left slot. Null keeps the space, so Next never moves. */
  readonly left: { readonly label: string; readonly onClick: () => void; readonly testid?: string } | null;
  readonly next: { readonly label: string; readonly onClick: () => void; readonly testid?: string; readonly disabled?: boolean };
}

export function FormFoot({ left, next }: FootProps): React.JSX.Element {
  return (
    <div className="c-foot" data-testid="form-foot">
      {left === null ? (
        <span className="c-foot-gap" aria-hidden="true" />
      ) : (
        <button type="button" className="c-btn c-ghost" data-testid={left.testid} onClick={left.onClick}>
          {left.label}
        </button>
      )}
      <button type="button" className="c-btn c-primary c-next-btn" data-testid={next.testid} disabled={next.disabled} onClick={next.onClick}>
        {next.label}
      </button>
    </div>
  );
}

interface FrameProps {
  readonly title: string;
  readonly helper?: string;
  readonly children: React.ReactNode;
}

export function FormBody({ title, helper, children }: FrameProps): React.JSX.Element {
  return (
    <>
      <h1 className="c-h1 c-ftitle">{title}</h1>
      {helper !== undefined && <p className="c-helper">{helper}</p>}
      {children}
    </>
  );
}
