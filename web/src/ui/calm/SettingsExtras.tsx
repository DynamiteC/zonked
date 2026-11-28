import { useState } from 'react';
import { getTemplates } from '../../catalog';
import { CALM } from './copy';
import { UX } from './copy-ux';
import { helpedCounts } from './data';
import type { FeelEntry } from './data';

/** A short in-app privacy notice. The full text is docs/PRIVACY.md in the project. */
export function PrivacyNote(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div className="c-privacy">
      <button type="button" className="c-btn c-link" data-testid="privacy-link" aria-expanded={open} aria-controls="c-privacy-text" onClick={() => setOpen(!open)}>
        {UX.privacyLink}
      </button>
      {open && (
        <section id="c-privacy-text" aria-labelledby="c-privacy-h" data-testid="privacy-text">
          <h2 id="c-privacy-h" className="c-h3">{UX.privacyTitle}</h2>
          {UX.privacyLines.map((l) => (
            <p key={l} className="c-muted">{l}</p>
          ))}
          <p className="c-muted" data-testid="adults-note">{CALM.adultsNote}</p>
          <p className="c-muted" data-testid="help-line">{CALM.helpLine}</p>
        </section>
      )}
    </div>
  );
}

const nameOf = (id: string): string => getTemplates().find((t) => t.id === id)?.name ?? id;

/** "What helped": counts of your own answers by sound. Local only. No scores. */
export function Helped({ feel }: { readonly feel: readonly FeelEntry[] }): React.JSX.Element {
  const rows = helpedCounts(feel).slice(0, 5);
  return (
    <section aria-labelledby="c-helped-h" data-testid="helped">
      <h2 id="c-helped-h" className="c-h3">{UX.helped.title}</h2>
      {rows.length === 0 ? (
        <p className="c-muted">{UX.helped.empty}</p>
      ) : (
        <ul className="c-rows">
          {rows.map((r) => (
            <li key={r.id} className="c-muted">{UX.helped.row(nameOf(r.id), r.calmer, r.same, r.not)}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
