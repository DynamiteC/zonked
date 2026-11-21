import { resolve } from "node:path";
import { DEFAULT_MIN_TRANSITION_SEC, FLOOR_TRANSITION_SEC, MAX_TRANSITION_SEC } from "./validate.js";
import { DEFAULT_PORT } from "./server.js";

export interface CliOptions {
  statePath: string;
  signalsPath?: string;
  port: number;
  origins: string[];
  minTransitionSec: number;
}

export class UsageError extends Error {}

export const USAGE = `Usage: zonked-bridge --state <path> [--signals <path>] [--port ${DEFAULT_PORT}] [--origin <url> ...] [--min-transition <sec>]

  --state <path>    .zonked-state.json to watch (required)
  --signals <path>  .zonked-signals.json, summarised on /health (optional)
  --port <n>        loopback port, 1-65535 (default ${DEFAULT_PORT})
  --origin <url>    extra allowed browser Origin, repeatable (http or https)
  --min-transition <sec>
                    DEMO ONLY. Lowest accepted transitionSec, ${FLOOR_TRANSITION_SEC}-${MAX_TRANSITION_SEC}
                    (default ${DEFAULT_MIN_TRANSITION_SEC}). Never use in real sessions.
  -h, --help        show this help
`;

export function normalizeOrigin(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new UsageError(`invalid --origin: ${value}`);
  }
  if ((url.protocol !== "http:" && url.protocol !== "https:") || url.origin === "null") {
    throw new UsageError(`--origin must be an http or https URL: ${value}`);
  }
  return url.origin;
}

export function parseArgs(argv: readonly string[]): CliOptions | "help" {
  let statePath: string | undefined;
  let signalsPath: string | undefined;
  let port = DEFAULT_PORT;
  const origins: string[] = [];
  let minTransitionSec = DEFAULT_MIN_TRANSITION_SEC;
  const need = (i: number, flag: string): string => {
    const v = argv[i + 1];
    if (v === undefined || v.startsWith("--")) throw new UsageError(`${flag} needs a value`);
    return v;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i] as string;
    const eq = arg.startsWith("--") ? arg.indexOf("=") : -1;
    const flag = eq > 0 ? arg.slice(0, eq) : arg;
    const inline = eq > 0 ? arg.slice(eq + 1) : undefined;
    const value = (): string => {
      if (inline !== undefined) return inline;
      const v = need(i, flag);
      i += 1;
      return v;
    };
    switch (flag) {
      case "-h":
      case "--help":
        return "help";
      case "--state":
        statePath = resolve(value());
        break;
      case "--signals":
        signalsPath = resolve(value());
        break;
      case "--port": {
        const raw = value();
        if (!/^\d{1,5}$/.test(raw)) throw new UsageError(`invalid --port: ${raw}`);
        port = Number(raw);
        if (port < 1 || port > 65535) throw new UsageError(`--port out of range: ${raw}`);
        break;
      }
      case "--origin":
        origins.push(normalizeOrigin(value()));
        break;
      case "--min-transition": {
        const raw = value();
        const n = /^\d{1,3}$/.test(raw) ? Number(raw) : NaN;
        if (!(n >= FLOOR_TRANSITION_SEC && n <= MAX_TRANSITION_SEC)) {
          throw new UsageError(`--min-transition must be ${FLOOR_TRANSITION_SEC}-${MAX_TRANSITION_SEC}: ${raw}`);
        }
        minTransitionSec = n;
        break;
      }
      default:
        throw new UsageError(`unknown argument: ${arg}`);
    }
  }
  if (!statePath) throw new UsageError("--state is required");
  return { statePath, ...(signalsPath ? { signalsPath } : {}), port, origins, minTransitionSec };
}
