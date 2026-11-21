import { SX } from './copy';
import { DataPanel } from './DataPanel';
import { FavoritesPanel } from './FavoritesPanel';
import { MilestonesPanel } from './MilestonesPanel';
import { MixesPanel } from './MixesPanel';
import { Guide, Mission } from './Mission';
import type { SanctuaryProps } from './types';
import { useSanctuaryData } from './useSanctuaryData';
import './sanctuary.css';

export type { SanctuaryProps, SanctuarySection } from './types';

/** Free-mission layer: why Zonked is free, how it works, favorites, saved mixes, milestones and the user's own data. Local only. */
export default function Sanctuary(props: SanctuaryProps): React.JSX.Element {
  const { section, store, now, nowPlaying, currentMix, onLoadMix, onPlayTemplate, reducedMotion, onClose } = props;
  const data = useSanctuaryData(store, now);
  return (
    <section
      className="sx-root"
      role="region"
      aria-label={`${SX.title}: ${SX.sections[section]}`}
      data-testid="sanctuary"
      data-section={section}
      data-reduced={reducedMotion ? 'true' : 'false'}
    >
      <header className="sx-head">
        <h2 className="sx-title">{SX.sections[section]}</h2>
        <button type="button" className="btn" data-testid="sanctuary-close" onClick={onClose}>{SX.close}</button>
      </header>
      <div role="status" aria-live="polite" className="sx-notice" data-testid="sanctuary-notice">{data.notice}</div>
      {data.reminder !== null ? <p className="sx-card" data-testid="sanctuary-reminder">{data.reminder}</p> : null}
      {!data.ready ? (
        <p className="sx-muted">{SX.common.loading}</p>
      ) : section === 'mission' ? (
        <Mission />
      ) : section === 'guide' ? (
        <Guide />
      ) : section === 'favorites' ? (
        <FavoritesPanel data={data} nowPlaying={nowPlaying} onLoadMix={onLoadMix} onPlayTemplate={onPlayTemplate} />
      ) : section === 'mixes' ? (
        <MixesPanel data={data} nowPlaying={nowPlaying} currentMix={currentMix} onLoadMix={onLoadMix} />
      ) : section === 'milestones' ? (
        <MilestonesPanel data={data} />
      ) : (
        <DataPanel data={data} now={now} />
      )}
    </section>
  );
}
