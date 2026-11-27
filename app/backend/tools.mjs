// The two agent tools, shared by the HTTP route (agentTools in app.json) and the stdio MCP server.
// Tool arguments are flat (the manifest allows only string, number, boolean and simple arrays).

export const TOOL_NAMES = Object.freeze(['zonked_report_intensity', 'zonked_get_suggestion']);

const INT = (description, minimum, maximum) => ({ type: 'integer', description, minimum, maximum });

export const TOOL_DEFS = Object.freeze([
  {
    name: 'zonked_report_intensity',
    title: 'Report session intensity',
    description: 'Burnout sentinel only. Report the 0-100 burnout score and the signals behind it. The backend clamps every value and decides if the sound should change.',
    inputSchema: {
      type: 'object',
      properties: {
        score: INT('Burnout score, 0 to 100.', 0, 100),
        at: INT('Epoch seconds of the reading.', 0, 4102444800),
        commitsPerHour: INT('Commits in the last hour.', 0, 120),
        sessionMinutes: INT('Minutes since the session began.', 0, 720),
        buildFailures: INT('Consecutive failed builds or tests.', 0, 10),
        dirtyFiles: INT('Uncommitted files.', 0, 200),
        degraded: { type: 'boolean', description: 'True when a signal could not be read.' },
      },
      required: ['score', 'at'],
      additionalProperties: false,
    },
  },
  {
    name: 'zonked_get_suggestion',
    title: 'Get the sound suggestion',
    description: 'Acoustic sequencer. Returns the current safe sound target and why the backend holds or changes it. Read only.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
]);

const SIGNAL_KEYS = ['commitsPerHour', 'sessionMinutes', 'buildFailures', 'dirtyFiles'];

function toIntensity(args) {
  const signals = {};
  for (const k of SIGNAL_KEYS) if (args[k] !== undefined) signals[k] = args[k];
  return {
    version: 1, at: args.at, score: args.score,
    ...(Object.keys(signals).length > 0 ? { signals } : {}),
    ...(args.degraded === undefined ? {} : { degraded: args.degraded }),
  };
}

/** Runs one tool call: { tool, arguments }. Never throws. Unknown input yields { ok: false }. */
export function runTool(store, call) {
  if (typeof call !== 'object' || call === null || Array.isArray(call)) return { ok: false, error: 'call must be an object' };
  const args = Object.hasOwn(call, 'arguments') && typeof call.arguments === 'object' && call.arguments !== null && !Array.isArray(call.arguments) ? call.arguments : {};
  if (call.tool === 'zonked_get_suggestion') return { ok: true, ...store.suggestion() };
  if (call.tool !== 'zonked_report_intensity') return { ok: false, error: 'unknown tool' };
  const r = store.report(toIntensity(args));
  return r.ok ? { ok: true, crew: r.state, warnings: r.warnings } : { ok: false, error: r.error };
}
