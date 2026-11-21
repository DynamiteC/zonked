#!/usr/bin/env node
// Demo stand-in for the acoustic-sequencer agent. Writes .zonked-state.json
// atomically (temp file, then rename), cycling the burnout score 10 -> 50 -> 70 -> 90.
// Mapping mirrors .kiro/crew/agents/acoustic-sequencer.md.
import { renameSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const BANDS = [
  { score: 10, level: "focus", presetId: "deep-focus", beatHz: 40, carrierHz: 200, breathe: false },
  { score: 50, level: "flow", presetId: "flow-state", beatHz: 18, carrierHz: 220, breathe: false },
  { score: 70, level: "recovery", presetId: "burnout-reset", beatHz: 10, carrierHz: 200, breathe: true },
  { score: 90, level: "decompress", presetId: "burnout-reset", beatHz: 6, carrierHz: 180, breathe: true },
];

function parse(argv) {
  const out = { state: ".zonked-state.json", stepSec: 20, count: Infinity, transitionSec: 60 };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === "--state") out.state = value;
    else if (flag === "--step-sec") out.stepSec = Number(value);
    else if (flag === "--transition-sec") out.transitionSec = Number(value);
    else if (flag === "--count") out.count = Number(value);
    else {
      console.error("usage: fake-crew.mjs [--state <path>] [--step-sec <n>] [--transition-sec <n>] [--count <n>]");
      process.exit(2);
    }
    i += 1;
  }
  if (!out.state || !Number.isFinite(out.stepSec) || out.stepSec < 0.05 || !(out.count >= 1) || !Number.isFinite(out.transitionSec)) {
    console.error("fake-crew: invalid arguments");
    process.exit(2);
  }
  return { ...out, state: resolve(out.state) };
}

// Values below 30 need the bridge started with --min-transition (demo only).
function buildState(band, transitionSec) {
  return {
    version: 1,
    at: Math.floor(Date.now() / 1000),
    burnout: { score: band.score, level: band.level },
    target: {
      presetId: band.presetId,
      beatHz: band.beatHz,
      carrierHz: band.carrierHz,
      gain: 0.5,
      transitionSec,
      breathe: band.breathe,
    },
    sbg: null,
  };
}

function writeAtomic(path, state) {
  const tmp = join(dirname(path), `.${basename(path)}.${process.pid}.tmp`);
  writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o644 });
  renameSync(tmp, path);
}

const opts = parse(process.argv.slice(2));
let n = 0;
const tick = () => {
  const index = n % BANDS.length;
  const band = BANDS[index];
  writeAtomic(opts.state, buildState(band, opts.transitionSec));
  console.log(`fake-crew: wrote ${band.level} (score ${band.score}, ${band.beatHz} Hz @ ${band.carrierHz} Hz)`);
  n += 1;
  if (n >= opts.count) clearInterval(timer);
};
const timer = setInterval(tick, opts.stepSec * 1000);
tick();
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => process.exit(0));
