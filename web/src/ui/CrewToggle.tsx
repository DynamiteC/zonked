import { useEffect, useState } from 'react';
import { isCrewEnabled, onCrewChange, setCrewEnabled } from './bridgeClient';

/** Opt-in switch for the local Kiro Crew bridge. Off by default: no network until it is on. */
export function CrewToggle(): React.JSX.Element {
  const [on, setOn] = useState<boolean>(() => isCrewEnabled());
  useEffect(() => onCrewChange(setOn), []);
  return (
    <div className="crew-toggle">
      <label>
        <input
          type="checkbox"
          role="switch"
          data-testid="crew-toggle"
          checked={on}
          onChange={(e) => setCrewEnabled(e.currentTarget.checked)}
          aria-describedby="crew-toggle-help"
        />{' '}
        Connect to Kiro Crew on this computer
      </label>
      <p id="crew-toggle-help">Only if you run the Zonked crew bridge here. Nothing leaves your computer.</p>
    </div>
  );
}
