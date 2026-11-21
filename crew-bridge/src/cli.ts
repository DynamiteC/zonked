#!/usr/bin/env node
import { parseArgs, UsageError, USAGE } from "./args.js";
import { Bridge } from "./server.js";

async function main(): Promise<void> {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    if (err instanceof UsageError) {
      process.stderr.write(`zonked-bridge: ${err.message}\n\n${USAGE}`);
      process.exit(2);
    }
    throw err;
  }
  if (opts === "help") {
    process.stdout.write(USAGE);
    return;
  }
  const bridge = new Bridge({
    statePath: opts.statePath,
    signalsPath: opts.signalsPath,
    port: opts.port,
    origins: opts.origins,
    minTransitionSec: opts.minTransitionSec,
    log: (line) => process.stdout.write(`${new Date().toISOString()} ${line}\n`),
  });
  const port = await bridge.start();
  process.stdout.write(`zonked-bridge allowed origins: ${bridge.allowedOrigins.join(", ")}\n`);
  if (opts.minTransitionSec < 30) {
    process.stdout.write(`zonked-bridge: DEMO MODE, min transition ${opts.minTransitionSec} s (policy is 30)\n`);
  }
  process.stdout.write(`zonked-bridge listening on http://127.0.0.1:${port} (state: ${opts.statePath})\n`);

  let stopping = false;
  const shutdown = (signal: string): void => {
    if (stopping) return;
    stopping = true;
    process.stdout.write(`${signal} received, shutting down\n`);
    const force = setTimeout(() => process.exit(1), 3000);
    force.unref();
    void bridge.stop().then(() => process.exit(0));
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err: NodeJS.ErrnoException) => {
  process.stderr.write(`zonked-bridge: ${err.code === "EADDRINUSE" ? "port already in use" : err.message}\n`);
  process.exit(1);
});
