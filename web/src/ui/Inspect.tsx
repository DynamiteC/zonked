import { BAND_GUIDE, bandForHz } from '../catalog/bands';
import { COPY } from './copy';
import { Drawer } from './Drawer';

interface Props {
  beatHz: number;
  onClose: () => void;
}

export function Inspect({ beatHz, onClose }: Props): React.JSX.Element {
  const current = bandForHz(beatHz).name;
  return (
    <Drawer id="inspect-panel" title={COPY.inspect.title} help={COPY.inspect.help} testId="inspect-panel" onClose={onClose}>
      <p className="meta">{COPY.inspect.intro}</p>
      <ul className="bands">
        {BAND_GUIDE.map((b) => (
          <li key={b.name} className="band" data-current={b.name === current ? 'true' : 'false'} data-testid={`band-row-${b.name}`}>
            <h3>
              {b.name} <span className="meta">{b.minHz} to {b.maxHz} Hz</span>
              {b.name === current && <strong className="band-here"> {COPY.inspect.current}</strong>}
            </h3>
            <p>May support {b.mayHelp}.</p>
            <p className="meta">
              {COPY.inspect.evidence}: {b.evidence}. {b.note}
            </p>
            <p className="meta">
              {COPY.inspect.sources}: {b.sources.join(', ')} ({COPY.inspect.seeDocs})
            </p>
          </li>
        ))}
      </ul>
    </Drawer>
  );
}
