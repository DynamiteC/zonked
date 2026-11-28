import type { TelemetryReader } from '../../audio/types';
import { Scope } from '../Scope';

/** Live wave view of the left and right channels. Reads telemetry only. */
export function ScopePanel({ telemetry }: { telemetry: TelemetryReader }): React.JSX.Element {
  return (
    <div className="adv-panel adv-scope" data-testid="adv-scope">
      <Scope telemetry={telemetry} />
    </div>
  );
}
