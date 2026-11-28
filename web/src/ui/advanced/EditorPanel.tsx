import { useMemo } from 'react';
import { parseSbg } from '../../sbg';

export interface EditorPanelProps {
  text: string;
  onText: (t: string) => void;
  /** Plays the script. The player parses and clamps it again. */
  onPlay: (text: string) => void;
}

const MAX_SHOWN = 50;

/** The .sbg text editor with line-numbered diagnostics. Play is off while the script has errors. */
export function EditorPanel({ text, onText, onPlay }: EditorPanelProps): React.JSX.Element {
  const diag = useMemo(() => parseSbg(text), [text]);
  return (
    <div className="adv-panel" data-testid="adv-editor">
      <label htmlFor="adv-sbg-text">.sbg script</label>
      <textarea id="adv-sbg-text" className="adv-text" data-testid="adv-editor-text" spellCheck={false} value={text} onChange={(e) => onText(e.target.value)} aria-describedby="adv-sbg-diag" />
      <div id="adv-sbg-diag" role="status" aria-live="polite" data-testid="adv-diagnostics">
        {diag.diagnostics.length === 0 ? (
          <p className="adv-note">No problems.</p>
        ) : (
          <ul className="adv-diag">
            {diag.diagnostics.slice(0, MAX_SHOWN).map((d, i) => (
              <li key={`${d.line}-${i}`} data-severity={d.severity}>
                Line {d.line}: {d.severity}: {d.message}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" className="adv-btn adv-primary" data-testid="adv-editor-play" disabled={!diag.ok} onClick={() => onPlay(text)}>
        Play this script
      </button>
    </div>
  );
}
