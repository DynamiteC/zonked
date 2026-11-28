import { useEffect, useState } from 'react';
import './fonts.css';
import { CalmApp } from '@zonked-web/ui/calm/CalmApp';
import { getSession, setPageMounted } from './engine/session';
import { ensureStyles } from './engine/styles';
import { useCrewLink } from './engine/crewLink';

const NOTE_STYLE = {
  position: 'fixed', left: 12, right: 12, bottom: 84, zIndex: 70, padding: '10px 14px',
  borderRadius: 12, background: 'rgba(30,30,40,0.92)', color: '#fff', fontSize: 14, textAlign: 'center',
} as const;

/** The routed page. The dashboard mounts the default export and unmounts it on navigation. */
// translateZ(0) makes the Calm app's position:fixed bars (tab bar, mini player) sit inside this
// box instead of covering the dashboard sidebar.
export default function Zonked(): React.JSX.Element {
  ensureStyles(import.meta.url);
  useCrewLink();
  const { engine, store } = getSession();
  useEffect(() => {
    setPageMounted(true);
    return () => setPageMounted(false);
  }, []);
  const [note, setNote] = useState(false);
  return (
    <div data-testid="zonked-app" style={{ height: '100%', minHeight: 0, overflow: 'hidden', position: 'relative', transform: 'translateZ(0)' }}>
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <CalmApp engine={engine} store={store} onStudio={() => setNote(true)} />
      </div>
      {note && (
        <p role="status" style={NOTE_STYLE} data-testid="studio-note" onClick={() => setNote(false)}>
          Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close.
        </p>
      )}
    </div>
  );
}
