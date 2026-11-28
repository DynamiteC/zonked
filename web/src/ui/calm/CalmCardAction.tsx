import { useState } from 'react';
import { UX } from './copy-ux';
import { canShareCard, downloadCard, makeCalmCard, shareCard } from './calmCard';
import type { CardInfo } from './calmCard';

type Phase = 'idle' | 'making' | 'ready' | 'failed';

/** Optional, on the end card. Makes the PNG on this device after a tap, then offers download or share. */
export function CalmCardAction({ info }: { readonly info: CardInfo }): React.JSX.Element {
  const [phase, setPhase] = useState<Phase>('idle');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [note, setNote] = useState('');
  const make = (): void => {
    setPhase('making');
    makeCalmCard(info).then(
      (b) => {
        setBlob(b);
        setPhase('ready');
      },
      () => setPhase('failed'),
    );
  };
  const share = (b: Blob): void => {
    shareCard(b).then(
      (ok) => setNote(ok ? UX.card.shared : ''),
      () => setNote(UX.card.failed),
    );
  };
  return (
    <div className="c-card-action" data-testid="calm-card">
      {phase !== 'ready' && (
        <button type="button" className="c-btn c-link" data-testid="calm-card-make" disabled={phase === 'making'} onClick={make}>
          {phase === 'making' ? UX.card.making : UX.card.save}
        </button>
      )}
      {phase === 'ready' && blob !== null && (
        <>
          <p className="c-muted" role="status">{UX.card.ready}</p>
          <div className="c-chips">
            <button type="button" className="c-tchip" data-testid="calm-card-download" onClick={() => downloadCard(blob)}>{UX.card.download}</button>
            {canShareCard(blob) && (
              <button type="button" className="c-tchip" data-testid="calm-card-share" onClick={() => share(blob)}>{UX.card.share}</button>
            )}
          </div>
        </>
      )}
      {phase === 'failed' && <p className="c-muted" role="status">{UX.card.failed}</p>}
      {note !== '' && <p className="c-muted" role="status">{note}</p>}
    </div>
  );
}
