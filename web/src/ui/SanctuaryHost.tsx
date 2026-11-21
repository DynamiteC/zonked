import { Suspense, lazy, useMemo } from 'react';
import type { ComponentType } from 'react';
import { COPY } from './copy';
import type { SanctuaryProps } from './sanctuary/types';

type Loader = () => Promise<{ default: ComponentType<SanctuaryProps> }>;

/** The folder is built by another worker. Until index.tsx exists the glob is empty and a calm note shows. */
const found = import.meta.glob('./sanctuary/index.tsx') as Record<string, Loader>;
const loader: Loader | undefined = Object.values(found)[0];
const Sanctuary = loader === undefined ? null : lazy(loader);

const TITLES: Record<SanctuaryProps['section'], string> = {
  mission: COPY.more.mission,
  guide: COPY.more.guide,
  favorites: COPY.more.favorites,
  mixes: COPY.more.mixes,
  milestones: COPY.more.milestones,
  data: COPY.more.data,
};

/** Hosts the lazy sanctuary section inside a drawer. */
export function SanctuaryHost(props: SanctuaryProps): React.JSX.Element {
  const title = TITLES[props.section];
  const body = useMemo(
    () =>
      Sanctuary === null ? (
        <p className="meta">{COPY.more.missing}</p>
      ) : (
        <Suspense fallback={<p className="meta" role="status">{COPY.more.loading}</p>}>
          <Sanctuary {...props} />
        </Suspense>
      ),
    [props],
  );
  return (
    <aside
      className="drawer"
      id="sanctuary-panel"
      aria-label={title}
      data-testid="sanctuary-drawer"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          props.onClose();
        }
      }}
    >
      {body}
    </aside>
  );
}
