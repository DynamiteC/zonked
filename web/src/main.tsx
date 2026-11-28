import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { createEngine } from './audio';
import { ModeRoot } from './ui/calm/ModeRoot';
import { createUpdateGate, installUpdateGate } from './app/swUpdate';
import './styles/index.css';

const root = document.getElementById('root');
if (root !== null) {
  const engine = createEngine();
  createRoot(root).render(
    <StrictMode>
      <ModeRoot engine={engine} />
    </StrictMode>,
  );
}

const updateGate = createUpdateGate(() => void updateSW(true));
installUpdateGate(updateGate);
const updateSW = registerSW({ immediate: true, onNeedRefresh: () => updateGate.needRefresh() });
