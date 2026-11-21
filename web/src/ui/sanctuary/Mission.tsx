import { SX } from './copy';

export function Mission(): React.JSX.Element {
  const m = SX.mission;
  return (
    <div className="sx-stack" data-testid="sanctuary-mission">
      <h3 className="sx-h">{m.heading}</h3>
      <p>{m.body}</p>
      <div className="sx-card" data-testid="sanctuary-privacy">
        <h4 className="sx-h4">{m.privacyHeading}</h4>
        <ul className="sx-list">
          {m.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="sx-muted">{m.privacyBody}</p>
      </div>
      <p className="sx-note">{m.notMedical}</p>
    </div>
  );
}

export function Guide(): React.JSX.Element {
  const g = SX.guide;
  return (
    <div className="sx-stack" data-testid="sanctuary-guide">
      <h3 className="sx-h">{g.heading}</h3>
      {g.items.map((it) => (
        <section key={it.title} className="sx-card">
          <h4 className="sx-h4">{it.title}</h4>
          <p>{it.body}</p>
        </section>
      ))}
    </div>
  );
}
