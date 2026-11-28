import { useEffect, useState } from 'react';
import { HEALTH_WINDOW_MS, healthHint, healthLine, healthLog } from '../../audio/health';

/** Counts hiccups on this device only. Nothing is sent anywhere. Updates every 2 seconds. */
export function HealthPanel(): React.JSX.Element {
  const [count, setCount] = useState(() => healthLog.count(Date.now(), HEALTH_WINDOW_MS));
  useEffect(() => {
    const id = setInterval(() => setCount(healthLog.count(Date.now(), HEALTH_WINDOW_MS)), 2000);
    return () => clearInterval(id);
  }, []);
  const hint = healthHint(count);
  return (
    <div data-testid="sound-health">
      <p role="status" data-testid="sound-health-line">{healthLine(count)}</p>
      {hint !== '' && <p className="meta" data-testid="sound-health-hint">{hint}</p>}
      <p className="meta">Counted on this device only. Never sent anywhere.</p>
    </div>
  );
}
