import { CALM } from '../copy';
import credits from './credits.json';

interface Credit {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly source: string;
  readonly licence: string;
}

/** Author and licence for one loop. The data ships in the app as JSON and holds no links. */
export function Credits({ id, synth = false }: { readonly id: string; readonly synth?: boolean }): React.JSX.Element {
  if (synth) return <p className="c-credit" data-testid={`credit-${id}`}>{CALM.natureMade}</p>;
  const c = (credits as readonly Credit[]).find((x) => x.id === id);
  if (c === undefined) return <p className="c-muted">Credit details are missing for this sound.</p>;
  return (
    <dl className="c-credit" data-testid={`credit-${id}`}>
      <dt>Title</dt>
      <dd>{c.title}</dd>
      <dt>Author</dt>
      <dd>{c.author}</dd>
      <dt>Licence</dt>
      <dd>{c.licence}</dd>
      <dt>Source</dt>
      <dd>{c.source}</dd>
    </dl>
  );
}
