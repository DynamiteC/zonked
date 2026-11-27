import { jsxs as g, jsx as l, Fragment as De } from "react/jsx-runtime";
import { useRef as z, useState as k, useEffect as T, useCallback as M, useMemo as H, lazy as C, Suspense as pe } from "react";
import { g as he, i as Oe, u as Ie, w as Pe, S as He, a as je, o as Fe, B as Be, b as ie, f as j, c as fe, n as _e, d as xe } from "./chunk-crewLink-CNIjqEIV.mjs";
function u(e) {
  return {
    modes: ["binaural"],
    noises: [["off", 0]],
    layers: [[]],
    intensity: 2,
    gain: 0.45,
    jitter: 0.3,
    tags: [],
    ...e
  };
}
const h = (e, t) => e[(t % e.length + e.length) % e.length], Ge = [98, 110, 123.5, 87.3, 103.8, 130.8], $e = [196, 220, 247, 175, 165, 262], qe = {
  calm: [4, 3],
  warm: [6, 2],
  dreamy: [4, 3],
  bright: [2, 5],
  deep: [7, 5],
  energized: [2, 3],
  grounded: [6, 1],
  ethereal: [4, 3],
  lofi: [1, 2, 5],
  minimal: [7, 4]
}, We = (e) => [...e].reduce((t, n) => (t * 31 + n.charCodeAt(0)) % 9973, 7);
function Ke(e, t, n) {
  const s = We(e) + n;
  return { prog: h(qe[t], s), key: h(Ge, s), pianoRoot: h($e, s >> 1) };
}
function Ye(e, t, n) {
  const s = e === "dreamy" || e === "ethereal" || e === "calm";
  return {
    breathDepth: h([0.45, 0.4, 0.3, 0.2, 0.1], t - 1),
    breathRateHz: 0.06 + 0.02 * (n % 5),
    stereoWidth: 0.3 + 0.1 * (n % 4),
    panDepth: s ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (n % 4)
  };
}
const Je = {
  lofi: (e, t) => ({
    lofiLevel: 0.45,
    lofiWarmth: h([0.5, 0.6, 0.7], e),
    lofiProgression: t.prog,
    tapeWow: h([0.25, 0.35, 0.45], e),
    padRootHz: t.key
  }),
  piano: (e, t) => ({
    instLevel: 0.35,
    instKind: 3,
    instRootHz: t.pianoRoot,
    instScale: h([2, 0, 1, 4, 3], e),
    instBpm: h([40, 46, 52], e),
    pianoPedal: h([0.4, 0.55, 0.7], e)
  }),
  crackle: () => ({ crackle: 0.12 }),
  drone: (e) => ({ instLevel: 0.35, instKind: 1, instRootHz: h([55, 62, 73, 82], e), instScale: 7, instBpm: 40 }),
  pluck: (e) => ({
    instLevel: 0.3,
    instKind: 0,
    instRootHz: h([196, 220, 247, 262], e),
    instScale: h([0, 2, 4, 1], e),
    instBpm: h([48, 56, 64, 72], e)
  }),
  bell: (e) => ({
    instLevel: 0.28,
    instKind: 2,
    instRootHz: h([262, 294, 330, 349], e),
    instScale: 4,
    instBpm: 40
  }),
  pad: (e, t) => ({ padLevel: 0.4, padChord: h([0, 2, 4, 6], e), padRootHz: t.key }),
  chimes: (e) => ({ chimeLevel: 0.25, chimeRatePerMin: h([3, 4, 6, 8], e) }),
  perc: (e) => ({
    percLevel: 0.2,
    percBpm: h([64, 72, 80, 92], e),
    percPattern: h([0, 3, 4, 7], e)
  })
};
function Ve(e, t, n = { prog: 0, key: 110, pianoRoot: 220 }) {
  return e.reduce((s, i) => ({ ...s, ...Je[i](t, n) }), {});
}
const oe = (e) => Math.round(e * 1e3) / 1e3, x = (e) => Math.min(40, Math.max(0.5, e));
function Ue(e, t, n, s, i) {
  const a = Math.min(5, Math.max(1, t * 0.15));
  if (e === "plateau") {
    const c = [{ t: 0, beat: n, ramp: !0 }, { t: a, beat: s, ramp: i !== void 0 }];
    return i !== void 0 && c.push({ t: t - a, beat: s, ramp: !0 }, { t, beat: i, ramp: !1 }), c;
  }
  if (e === "ramp-down" || e === "ramp-up")
    return [{ t: 0, beat: n, ramp: !0 }, { t: t * 0.7, beat: s, ramp: !1 }];
  if (e === "wave")
    return Array.from({ length: 7 }, (c, r) => ({ t: t * r / 6, beat: r % 2 === 0 ? n : s, ramp: r < 6 }));
  const o = t / 4;
  return Array.from({ length: 4 }, (c, r) => {
    const d = n + (s - n) * r / 3;
    return r < 3 ? [{ t: r * o, beat: d, ramp: !1 }, { t: r * o + o * 0.75, beat: d, ramp: !0 }] : [{ t: r * o, beat: d, ramp: !1 }];
  }).flat();
}
function Ze(e, t, n, s, i) {
  const a = (t % 3 - 1) * e.jitter, o = x(e.to + a), c = h(e.noises, t >> 1), r = h(e.layers, t * 2 + (t >> 1)), d = h(e.vibes, t), y = Ve(r, t, Ke(e.slug, d, t)), w = Object.keys(y).length > 0, L = w ? { ...y, ...Ye(d, e.intensity, t) } : y;
  return Ue(e.shape, n, x(e.from), o, e.ret).map((v) => ({
    atMin: oe(v.t),
    beatHz: oe(x(v.beat)),
    carrierHz: s,
    gain: e.gain,
    mode: i,
    noise: c[0],
    noiseLevel: c[1],
    ...w ? { layers: L } : {},
    ramp: v.ramp
  }));
}
function Z(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    t.add(n.mode);
    const s = n.layers;
    n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), s !== void 0 && (((s.lofiLevel ?? 0) > 0 || (s.crackle ?? 0) > 0) && t.add("lofi"), (s.instLevel ?? 0) > 0 && t.add("instrument"), (s.padLevel ?? 0) > 0 && t.add("pad"), (s.chimeLevel ?? 0) > 0 && t.add("chimes"), (s.percLevel ?? 0) > 0 && t.add("percussion"));
  }
  return [...t];
}
function Q(e, t) {
  if (t > 3) return !1;
  const n = e.every((a, o) => {
    var c;
    return o === 0 || Math.abs(a.beatHz - (((c = e[o - 1]) == null ? void 0 : c.beatHz) ?? a.beatHz)) <= 4;
  }), s = e.every((a) => a.mode === "isochronic" || a.beatHz >= 12 && a.beatHz <= 20), i = e.every((a) => {
    var o, c;
    return (((o = a.layers) == null ? void 0 : o.crackle) ?? 0) === 0 && (((c = a.layers) == null ? void 0 : c.percBpm) ?? 0) <= 100;
  });
  return n && s && i;
}
function Qe(e, t) {
  const n = e.adjectives.length, s = t * 7 % (n * e.nouns.length);
  return `${h(e.adjectives, s)} ${h(e.nouns, Math.floor(s / n))}`;
}
const Xe = (e) => String(e).padStart(2, "0");
function et(e, t, n, s) {
  const i = h(t.mins, n), a = h(t.carriers, n * 3 + 1), o = h(t.modes, n + (n >> 2)), c = Ze(t, n, i, a, o), r = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
  return {
    id: `${e.prefix}-${t.slug}-${Xe(n + 1)}`,
    name: Qe(e, s),
    category: e.category,
    vibe: h(t.vibes, n),
    tags: [t.slug, r, o, ...t.tags],
    layerTags: Z(c),
    situations: t.situations,
    recommendedMinutes: i,
    intensity: t.intensity,
    adhdFriendly: Q(c, t.intensity),
    stages: c,
    reasonTemplate: t.reason,
    source: "original",
    ...t.breath !== void 0 ? { breath: t.breath } : {}
  };
}
function tt(e) {
  let t = 0;
  return e.archs.flatMap((n) => Array.from({ length: n.count }, (s, i) => et(e, n, i, t++)));
}
const nt = {
  category: "adhd-control",
  prefix: "adhd",
  adjectives: ["Steady", "Anchored", "Level", "Even", "Tidy", "Calm", "Focused", "Plain", "Settled", "Patient", "Smooth", "Constant"],
  nouns: ["Anchor", "Rail", "Tracks", "Rhythm", "Metronome", "Lane", "Thread", "Pulse", "Desk", "Checklist", "Runway", "Keel"],
  archs: [
    u({
      slug: "smr-steady",
      shape: "plateau",
      from: 12,
      to: 13.5,
      mins: [20, 30, 45],
      carriers: [200, 220, 240],
      modes: ["isochronic", "isochronic", "monaural"],
      noises: [["pink", 0.18], ["brown", 0.2]],
      layers: [[], ["lofi"]],
      vibes: ["minimal", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      jitter: 0.4,
      reason: "Steady SMR-range pulse with no changes to track, for {minutes} minutes of low-surprise focus."
    }),
    u({
      slug: "beta-anchor",
      shape: "plateau",
      from: 14,
      to: 16,
      mins: [25, 30, 45, 50],
      carriers: [210, 230, 250],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [[], ["lofi"]],
      vibes: ["grounded", "bright", "minimal"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.42,
      count: 5,
      jitter: 0.5,
      reason: "A constant low-beta pulse to anchor attention."
    }),
    u({
      slug: "cadence-pulse",
      shape: "plateau",
      from: 14,
      to: 15,
      mins: [20, 25, 30],
      carriers: [200, 220],
      modes: ["isochronic"],
      noises: [["pink", 0.12]],
      layers: [["perc"], ["perc", "lofi"]],
      vibes: ["energized", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      reason: "Gentle soft percussion at a fixed 60 to 100 bpm cadence keeps tempo without surprises."
    }),
    u({
      slug: "quiet-bed",
      shape: "plateau",
      from: 13,
      to: 13,
      mins: [30, 45, 60],
      carriers: [190, 210],
      modes: ["isochronic", "monaural"],
      noises: [["brown", 0.3], ["pink", 0.25]],
      layers: [["lofi"], ["lofi", "piano"]],
      vibes: ["lofi", "minimal", "warm"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      jitter: 0,
      reason: "A fixed warm bed with nothing that changes, so it fades into the background."
    }),
    u({
      slug: "start-ramp",
      shape: "ramp-up",
      from: 11,
      to: 15,
      mins: [15, 20, 25],
      carriers: [200, 220],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [[], ["pluck"]],
      vibes: ["bright", "energized"],
      situations: ["adhd-focus", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      jitter: 0.2,
      reason: "A slow 4 Hz climb to help you get started without a jolt."
    }),
    u({
      slug: "sprint-steps",
      shape: "ladder",
      from: 13,
      to: 16,
      mins: [20, 25, 30],
      carriers: [210, 230],
      modes: ["isochronic"],
      noises: [["off", 0], ["pink", 0.12]],
      layers: [["perc"], []],
      vibes: ["energized", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      jitter: 0.2,
      reason: "Four small, announced steps through the beta band for a structured work block."
    })
  ]
}, st = {
  category: "focus",
  prefix: "focus",
  adjectives: ["Sharp", "Deep", "Clear", "Lucid", "Bright", "Keen", "Locked", "Precise", "Crisp", "Direct", "Tuned", "Honed"],
  nouns: ["Beam", "Signal", "Compass", "Engine", "Vector", "Prism", "Forge", "Spire", "Circuit", "Current", "Summit", "Scope"],
  archs: [
    u({
      slug: "alpha-beta",
      shape: "plateau",
      from: 11,
      to: 14,
      mins: [25, 45, 60],
      carriers: [200, 220, 240],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [[], ["lofi"], ["pluck"]],
      vibes: ["bright", "minimal", "grounded"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Relaxed focus on the alpha-beta border for {minutes} minutes."
    }),
    u({
      slug: "deep-beta",
      shape: "plateau",
      from: 15,
      to: 18,
      mins: [30, 45, 60, 90],
      carriers: [220, 240, 260],
      modes: ["binaural", "isochronic"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [[], ["perc"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work"],
      intensity: 3,
      gain: 0.42,
      count: 5,
      reason: "Beta band for sustained analytical work."
    }),
    u({
      slug: "gamma-edge",
      shape: "ramp-up",
      from: 18,
      to: 35,
      mins: [10, 15, 20],
      carriers: [240, 260, 280],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [[]],
      vibes: ["energized", "bright"],
      situations: ["deep-work"],
      intensity: 4,
      gain: 0.4,
      count: 4,
      reason: "A short climb to a high-beta and low-gamma edge for a quick push."
    }),
    u({
      slug: "flow-ramp",
      shape: "ramp-up",
      from: 10,
      to: 16,
      mins: [30, 45, 60],
      carriers: [210, 230],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.12]],
      layers: [["pluck"], ["lofi", "pluck"]],
      vibes: ["warm", "bright", "lofi"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "Eases from alpha into beta so you drift into flow."
    }),
    u({
      slug: "reading-calm",
      shape: "plateau",
      from: 10,
      to: 12,
      mins: [30, 45, 60],
      carriers: [190, 210],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["piano"], []],
      vibes: ["calm", "deep", "warm"],
      situations: ["deep-work", "meditate"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "Gentle alpha for reading and study."
    }),
    u({
      slug: "sprint-pulse",
      shape: "ladder",
      from: 12,
      to: 20,
      mins: [20, 25, 30],
      carriers: [220, 240],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["perc"], ["perc", "pluck"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      reason: "Four rising steps with soft percussion for a focused sprint."
    })
  ]
}, at = {
  category: "healing",
  prefix: "healing",
  adjectives: ["Mending", "Tender", "Restoring", "Kind", "Balmy", "Soothing", "Renewing", "Warming", "Settled", "Easing", "Gentle", "Whole"],
  nouns: ["Balm", "Spring", "Embrace", "Garden", "Shelter", "Glow", "Rain", "Hearth", "Sunrise", "Quilt", "Oasis", "Haven"],
  archs: [
    u({
      slug: "tension-release",
      shape: "ramp-down",
      from: 14,
      to: 8,
      mins: [15, 20, 30],
      carriers: [180, 200, 220],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["pink", 0.2]],
      layers: [["piano", "pad"], ["pluck"], ["pad", "chimes"]],
      vibes: ["warm", "calm"],
      situations: ["heal-stress", "ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Eases beta tension down to alpha over {minutes} minutes."
    }),
    u({
      slug: "restore-theta",
      shape: "plateau",
      from: 9,
      to: 6,
      mins: [20, 30, 45],
      carriers: [160, 180],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["drone"], ["pad"], ["bell"]],
      vibes: ["deep", "warm", "ethereal"],
      situations: ["heal-stress", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Steady theta with a soft drone for emotional recovery."
    }),
    u({
      slug: "heart-calm",
      shape: "plateau",
      from: 10,
      to: 7.5,
      ret: 10,
      mins: [10, 15, 20],
      carriers: [190, 210],
      modes: ["binaural", "isochronic"],
      noises: [["off", 0], ["pink", 0.15]],
      layers: [["pad", "pluck"], ["pad"]],
      vibes: ["warm", "grounded"],
      situations: ["heal-stress", "quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      breath: { inSec: 5, outSec: 5 },
      reason: "A slow 6 breaths per minute rhythm to settle heart and mind."
    }),
    u({
      slug: "ache-ease",
      shape: "wave",
      from: 10,
      to: 7,
      mins: [30, 45, 60],
      carriers: [150, 170],
      modes: ["monaural", "binaural"],
      noises: [["brown", 0.3]],
      layers: [["pad"], []],
      vibes: ["calm", "warm"],
      situations: ["heal-stress"],
      intensity: 1,
      gain: 0.38,
      count: 4,
      reason: "Slow alpha-theta swells that feel like a rocking tide."
    }),
    u({
      slug: "soothe-glide",
      shape: "ramp-down",
      from: 12,
      to: 6,
      mins: [20, 30],
      carriers: [170, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.25]],
      layers: [["pad", "chimes"], ["bell"]],
      vibes: ["ethereal", "calm"],
      situations: ["heal-stress", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A soft pad and a gliding beat for gentle emotional unwinding."
    }),
    u({
      slug: "sunrise-lift",
      shape: "ramp-up",
      from: 7,
      to: 11,
      mins: [15, 20, 30],
      carriers: [190, 210, 230],
      modes: ["binaural", "isochronic"],
      noises: [["off", 0]],
      layers: [["pluck", "pad"], ["bell"]],
      vibes: ["bright", "warm"],
      situations: ["heal-stress", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "A brightening ramp that lifts mood without pushing alertness."
    })
  ]
}, it = {
  category: "lucid-dreams",
  prefix: "lucid",
  adjectives: ["Waking", "Silver", "Nebula", "Astral", "Twilight", "Aware", "Hollow", "Starlit", "Liminal", "Vivid", "Opal", "Drifting"],
  nouns: ["Gate", "Compass", "Mirror", "Skyway", "Threshold", "Door", "Voyage", "Lens", "Bridge", "Beacon", "Garden", "Orbit"],
  archs: [
    u({
      slug: "wbtb-theta",
      shape: "plateau",
      from: 9,
      to: 5,
      ret: 8,
      mins: [90, 120, 180],
      carriers: [160, 180, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["piano", "pad"], ["pad", "chimes"]],
      vibes: ["dreamy", "ethereal", "deep"],
      situations: ["lucid-dream", "cant-sleep"],
      intensity: 2,
      gain: 0.4,
      count: 6,
      reason: "Theta plateau with a light return, built for wake-back-to-bed lucid practice."
    }),
    u({
      slug: "rem-ladder",
      shape: "ladder",
      from: 8,
      to: 4,
      mins: [60, 90, 120],
      carriers: [150, 170],
      modes: ["binaural", "isochronic"],
      noises: [["brown", 0.2]],
      layers: [["pad"], ["drone"]],
      vibes: ["deep", "dreamy"],
      situations: ["lucid-dream"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Steps down through theta in four stages to meet REM gently."
    }),
    u({
      slug: "aware-wave",
      shape: "wave",
      from: 5,
      to: 8,
      mins: [60, 90],
      carriers: [160, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pad", "chimes"], ["bell"]],
      vibes: ["ethereal", "dreamy"],
      situations: ["lucid-dream"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Slow swings between theta and alpha keep a thread of awareness while the body sleeps."
    }),
    u({
      slug: "dream-drift",
      shape: "ramp-down",
      from: 10,
      to: 4.5,
      mins: [30, 45, 60],
      carriers: [140, 160, 180],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["brown", 0.2], ["pink", 0.2]],
      layers: [["pad"], []],
      vibes: ["dreamy", "calm", "ethereal"],
      situations: ["lucid-dream", "cant-sleep"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "A slow descent into dream sleep over {minutes} minutes."
    }),
    u({
      slug: "astral-calm",
      shape: "plateau",
      from: 10,
      to: 6,
      mins: [30, 45, 60],
      carriers: [170, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.2]],
      layers: [["drone"], ["bell"]],
      vibes: ["ethereal", "deep"],
      situations: ["lucid-dream", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Relaxed theta with a slow instrument drone, a calm body-aware launch pad."
    })
  ]
}, ot = {
  category: "meditation",
  prefix: "meditation",
  adjectives: ["Open", "Rooted", "Sacred", "Luminous", "Patient", "Clear", "Boundless", "Inner", "Mindful", "Sunlit", "Hallowed", "Silent"],
  nouns: ["Cushion", "Temple", "Breath", "Mountain", "Lotus", "Stillpoint", "Horizon", "Sanctuary", "River", "Candle", "Grove", "Bowl"],
  archs: [
    u({
      slug: "alpha-sit",
      shape: "plateau",
      from: 12,
      to: 9.5,
      ret: 11,
      mins: [10, 15, 20, 30],
      carriers: [180, 200, 220],
      modes: ["binaural", "monaural", "isochronic"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [["chimes"], ["bell"], []],
      vibes: ["calm", "grounded", "warm"],
      situations: ["meditate", "quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Wakeful alpha for a {minutes} minute seated sit."
    }),
    u({
      slug: "theta-descent",
      shape: "ramp-down",
      from: 10,
      to: 5,
      mins: [20, 30, 45],
      carriers: [160, 180],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["drone"], ["drone", "chimes"]],
      vibes: ["deep", "ethereal"],
      situations: ["meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Glides from alpha to theta for deeper inward attention."
    }),
    u({
      slug: "schumann-hold",
      shape: "plateau",
      from: 12,
      to: 7.83,
      ret: 12,
      mins: [20, 30],
      carriers: [180, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["piano"], ["bell"]],
      vibes: ["grounded", "deep"],
      situations: ["meditate", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      jitter: 0,
      reason: "Rests on the 7.83 Hz Schumann resonance, then returns to wakefulness."
    }),
    u({
      slug: "breath-pacer",
      shape: "plateau",
      from: 9,
      to: 6.5,
      mins: [10, 15, 20],
      carriers: [170, 190],
      modes: ["isochronic", "monaural"],
      noises: [["off", 0]],
      layers: [["chimes"], ["pad"]],
      vibes: ["calm", "minimal"],
      situations: ["meditate", "quick-reset"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      breath: { inSec: 5.45, outSec: 5.45 },
      reason: "Pair the 5.5 breaths per minute pacer with a slow theta pulse."
    }),
    u({
      slug: "bell-silence",
      shape: "plateau",
      from: 10,
      to: 8,
      mins: [15, 20, 30],
      carriers: [190, 210],
      modes: ["binaural", "monaural"],
      noises: [["off", 0]],
      layers: [["chimes"], ["bell"], ["pluck", "chimes"]],
      vibes: ["ethereal", "bright", "calm"],
      situations: ["meditate", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "Sparse chimes over a quiet alpha-theta border."
    }),
    u({
      slug: "delta-glide",
      shape: "ramp-down",
      from: 6,
      to: 3,
      mins: [30, 45, 60],
      carriers: [130, 150],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.25]],
      layers: [["drone"]],
      vibes: ["deep", "minimal"],
      situations: ["meditate", "heal-stress"],
      intensity: 2,
      gain: 0.38,
      count: 4,
      reason: "A long fall into delta for dissolving, open awareness."
    })
  ]
}, rt = {
  category: "sleep",
  prefix: "sleep",
  adjectives: ["Quiet", "Slow", "Velvet", "Hushed", "Moonlit", "Soft", "Drowsy", "Still", "Dim", "Gentle", "Fading", "Lulled"],
  nouns: ["Harbor", "Tide", "Pillow", "Lantern", "Blanket", "Meadow", "Lullaby", "Cabin", "Drift", "Hearth", "Cove", "Evening"],
  archs: [
    u({
      slug: "onset-delta",
      shape: "ramp-down",
      from: 9,
      to: 2.5,
      mins: [30, 45, 60, 90],
      carriers: [120, 140, 150, 160, 180],
      modes: ["binaural", "monaural", "binaural", "isochronic"],
      noises: [["brown", 0.25], ["pink", 0.2]],
      layers: [[], ["pad"], ["drone"]],
      vibes: ["calm", "deep", "dreamy"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 6,
      reason: "Glides from alpha to delta over {minutes} minutes to ease sleep onset."
    }),
    u({
      slug: "drift-theta",
      shape: "ramp-down",
      from: 8,
      to: 4.5,
      mins: [20, 30, 45],
      carriers: [130, 150, 170],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.2], ["brown", 0.3]],
      layers: [["piano", "pad"], ["pad", "chimes"], []],
      vibes: ["dreamy", "calm", "ethereal"],
      situations: ["cant-sleep", "lucid-dream"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "A slow theta drift with a soft pad to quiet racing thoughts."
    }),
    u({
      slug: "deep-delta",
      shape: "plateau",
      from: 6,
      to: 2.5,
      mins: [60, 90, 120],
      carriers: [110, 130, 150],
      modes: ["monaural", "binaural", "isochronic"],
      noises: [["brown", 0.3]],
      layers: [["drone"], []],
      vibes: ["deep", "calm"],
      situations: ["cant-sleep"],
      intensity: 1,
      gain: 0.38,
      count: 5,
      jitter: 0.2,
      reason: "Holds steady delta for deep, unbroken rest."
    }),
    u({
      slug: "nap-reset",
      shape: "plateau",
      from: 10,
      to: 5,
      ret: 12,
      mins: [15, 20, 25],
      carriers: [150, 170],
      modes: ["binaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["pad"]],
      vibes: ["warm", "calm"],
      situations: ["cant-sleep", "quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "A short nap that sinks to theta and wakes you gently after {minutes} minutes."
    }),
    u({
      slug: "breath-down",
      shape: "ramp-down",
      from: 7,
      to: 3,
      mins: [20, 30],
      carriers: [140, 160],
      modes: ["isochronic", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["pad", "chimes"]],
      vibes: ["calm", "dreamy"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 3,
      breath: { inSec: 4, outSec: 6 },
      reason: "Pair slow 4-in, 6-out breathing with a falling beat."
    }),
    u({
      slug: "rain-bed",
      shape: "plateau",
      from: 5,
      to: 3,
      mins: [45, 60, 90],
      carriers: [120, 140],
      modes: ["isochronic", "binaural"],
      noises: [["brown", 0.5], ["pink", 0.45]],
      layers: [["lofi"], []],
      vibes: ["lofi", "warm", "calm"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.35,
      count: 3,
      reason: "A soft noise bed with a faint low-end hum, easy to sleep under."
    })
  ]
}, lt = {
  category: "vibes",
  prefix: "vibe",
  adjectives: ["Neon", "Cozy", "Mellow", "Golden", "Hazy", "Crisp", "Cloudy", "Dusty", "Amber", "Breezy", "Sleepy", "Plush"],
  nouns: ["Cafe", "Rooftop", "Cassette", "Window", "Terrace", "Playlist", "Sunday", "Skyline", "Studio", "Porch", "Alley", "Lounge"],
  archs: [
    u({
      slug: "lofi-study",
      shape: "plateau",
      from: 12,
      to: 10,
      mins: [25, 45, 60],
      carriers: [180, 200, 220],
      modes: ["isochronic", "monaural", "binaural"],
      noises: [["pink", 0.1]],
      layers: [["lofi", "crackle", "pluck"], ["lofi", "pluck"], ["lofi", "pad"]],
      vibes: ["lofi", "warm"],
      situations: ["deep-work", "ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 6,
      reason: "Warm lo-fi bed with a soft pluck for easy, steady company."
    }),
    u({
      slug: "warm-glow",
      shape: "plateau",
      from: 11,
      to: 9,
      mins: [20, 30, 45],
      carriers: [170, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.12], ["off", 0]],
      layers: [["pad", "lofi"], ["pad"]],
      vibes: ["warm", "calm"],
      situations: ["quick-reset", "ai-burnout"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "A warm pad and a gentle alpha pulse for a soft landing."
    }),
    u({
      slug: "bright-air",
      shape: "plateau",
      from: 13,
      to: 12,
      mins: [20, 30],
      carriers: [210, 240],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["chimes", "pluck"], ["bell"]],
      vibes: ["bright", "energized"],
      situations: ["deep-work", "quick-reset"],
      intensity: 3,
      gain: 0.42,
      count: 4,
      reason: "Airy bells over a light alpha-beta border."
    }),
    u({
      slug: "ether-float",
      shape: "wave",
      from: 10,
      to: 6,
      mins: [20, 30, 45],
      carriers: [160, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pad", "chimes"], ["bell", "pad"]],
      vibes: ["ethereal", "dreamy", "deep"],
      situations: ["quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "Slow swells with chimes for a floating, spacious mood."
    }),
    u({
      slug: "minimal-hum",
      shape: "plateau",
      from: 10,
      to: 10,
      mins: [15, 30, 60],
      carriers: [200, 220],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.3], ["brown", 0.3]],
      layers: [[]],
      vibes: ["minimal", "grounded"],
      situations: ["deep-work", "ai-burnout"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      jitter: 0,
      reason: "Just a pulse and a noise bed, nothing to attend to."
    }),
    u({
      slug: "spark-groove",
      shape: "plateau",
      from: 14,
      to: 16,
      mins: [20, 25, 30],
      carriers: [220, 240, 260],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["perc", "pluck"], ["perc", "lofi"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work", "quick-reset"],
      intensity: 3,
      gain: 0.42,
      count: 4,
      reason: "A light groove with soft percussion for a bright, steady lift."
    })
  ]
}, ct = {
  category: "work-recovery",
  prefix: "recovery",
  adjectives: ["Unplugged", "Offline", "Cooled", "Rested", "Idle", "Paused", "Unwound", "Mellow", "Eased", "Reset", "Spare", "Soft"],
  nouns: ["Break", "Commit", "Cooldown", "Terminal", "Standup", "Branch", "Window", "Stretch", "Merge", "Buffer", "Release", "Cache"],
  archs: [
    u({
      slug: "screen-down",
      shape: "ramp-down",
      from: 18,
      to: 8,
      mins: [10, 15, 20],
      carriers: [200, 220],
      modes: ["binaural", "monaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["lofi", "pad"], ["pad"], ["lofi"]],
      vibes: ["calm", "lofi", "warm"],
      situations: ["ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Steps your brain down from beta to alpha after a long review or generation run."
    }),
    u({
      slug: "micro-break",
      shape: "plateau",
      from: 11,
      to: 8.5,
      ret: 11,
      mins: [5, 8, 10],
      carriers: [190, 210],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0], ["pink", 0.15]],
      layers: [["chimes"], ["pad", "chimes"]],
      vibes: ["bright", "calm"],
      situations: ["quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A {minutes} minute reset that lowers tension and brings you back alert."
    }),
    u({
      slug: "post-sprint",
      shape: "ramp-down",
      from: 20,
      to: 6,
      mins: [15, 20, 30],
      carriers: [200, 220],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.25]],
      layers: [["pad"], ["drone", "chimes"]],
      vibes: ["deep", "grounded"],
      situations: ["ai-burnout", "heal-stress"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A long fall from high beta to theta after an intense push."
    }),
    u({
      slug: "eye-rest",
      shape: "plateau",
      from: 10,
      to: 8,
      mins: [5, 10, 15],
      carriers: [180, 200],
      modes: ["monaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["pad"], ["chimes"]],
      vibes: ["calm", "minimal"],
      situations: ["ai-burnout", "quick-reset"],
      intensity: 1,
      gain: 0.38,
      count: 4,
      breath: { inSec: 4, outSec: 6 },
      reason: "Close your eyes and follow a slow 4-in, 6-out breath."
    }),
    u({
      slug: "lofi-unwind",
      shape: "plateau",
      from: 10,
      to: 9,
      mins: [15, 25, 40],
      carriers: [180, 200, 220],
      modes: ["isochronic", "binaural", "monaural"],
      noises: [["pink", 0.1]],
      layers: [["lofi", "crackle", "pluck"], ["lofi", "pad"]],
      vibes: ["lofi", "warm"],
      situations: ["ai-burnout", "heal-stress", "quick-reset"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "Slow lo-fi bed to decompress while you do something light."
    }),
    u({
      slug: "commute-decompress",
      shape: "ramp-down",
      from: 14,
      to: 9,
      mins: [15, 20, 30],
      carriers: [200, 230],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pluck"], ["lofi", "pluck"]],
      vibes: ["grounded", "warm", "minimal"],
      situations: ["ai-burnout", "quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "Closes the work day with a calm descent that works over speakers."
    })
  ]
}, F = (e) => Math.round(e * 1e3) / 1e3, B = (e) => Math.min(40, Math.max(0.5, e)), ye = (e) => e.segs.reduce((t, n) => t + n[0], 0) * (e.scale ?? 1);
function re(e, t) {
  const n = e.carrier ?? 200;
  return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(ye(e), 1));
}
function ut(e) {
  const t = [], [n, s] = e.noise ?? ["off", 0];
  let i = 0;
  return e.segs.forEach((a, o) => {
    const c = a[1] !== a[2], r = e.segs[o + 1];
    t.push({
      atMin: F(i / 60),
      beatHz: F(B(a[1])),
      carrierHz: re(e, i),
      gain: e.gain ?? 0.5,
      mode: e.mode ?? "binaural",
      noise: n,
      noiseLevel: s,
      ramp: c
    }), i += a[0] * (e.scale ?? 1), c && (r === void 0 || B(r[1]) !== B(a[2])) && t.push({ ...t[t.length - 1], atMin: F(i / 60), beatHz: F(B(a[2])), carrierHz: re(e, i), ramp: !1 });
  }), t;
}
function dt(e) {
  const t = ut(e);
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    vibe: e.vibe,
    tags: [...e.tags, e.source],
    layerTags: Z(t),
    situations: e.situations,
    recommendedMinutes: Math.max(1, Math.round(ye(e) / 60)),
    intensity: e.intensity,
    adhdFriendly: Q(t, e.intensity),
    stages: t,
    reasonTemplate: e.reason,
    source: e.source
  };
}
const _ = ["white", 0.3], W = ["pink", 0.3], K = ["brown", 0.3], le = [
  [60, 10, 8],
  [60, 8, 8],
  [60, 8, 6],
  [60, 6, 6],
  [120, 6, 5],
  [360, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [180, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [90, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [240, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [480, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [360, 5, 5],
  [480, 5, 12]
], mt = [
  [120, 10, 8],
  [120, 8, 8],
  [120, 8, 6],
  [240, 6, 6],
  [240, 6, 5],
  [420, 5, 5],
  [20, 5, 8],
  [20, 8, 5],
  [360, 5, 5],
  [20, 5, 8],
  [20, 8, 5],
  [180, 5, 5],
  [900, 5, 5],
  [900, 5, 5],
  [360, 5, 5],
  [360, 5, 12]
], pt = [
  [15, 10, 8],
  [240, 8, 8],
  [15, 8, 6],
  [240, 6, 6],
  [15, 6, 8],
  [555, 8, 8],
  [15, 8, 6],
  [75, 6, 6],
  [15, 6, 8],
  [45, 8, 8]
], ht = [
  [333, 8, 8],
  [333, 8, 10],
  [333, 10, 12],
  [333, 12, 12],
  [333, 12, 10],
  [333, 10, 8],
  [333, 8, 10]
], ft = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, () => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10]
], f = (e) => ({ ...e, source: "android", carrier: 200 }), yt = [
  f({
    id: "android-self-hypnosis",
    name: "Mind Bridge",
    category: "meditation",
    vibe: "deep",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: _,
    tags: ["theta", "hypnosis"],
    reason: "Five minutes down to 4 Hz, ten minutes holding there, five minutes back up."
  }),
  f({
    id: "android-highest-mental-activity",
    name: "Spark Burst",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: [[120, 12, 40], [600, 40, 40], [120, 40, 12]],
    noise: _,
    tags: ["gamma", "boost"],
    reason: "Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz."
  }),
  f({
    id: "android-unity",
    name: "Unity Delta",
    category: "meditation",
    vibe: "ethereal",
    situations: ["meditate", "cant-sleep"],
    intensity: 1,
    segs: [[3600, 3.7, 3.7]],
    noise: K,
    gain: 0.45,
    tags: ["delta", "long"],
    reason: "A flat 3.7 Hz hour under brown noise for a wide, quiet mind."
  }),
  f({
    id: "android-morphine",
    name: "Morphine Ease",
    category: "healing",
    vibe: "warm",
    situations: ["heal-stress"],
    intensity: 2,
    segs: [[3600, 10, 10]],
    noise: W,
    tags: ["alpha", "pain"],
    reason: "An hour at a steady 10 Hz under pink noise to loosen the body."
  }),
  f({
    id: "android-learning",
    name: "Long Study Bed",
    category: "focus",
    vibe: "bright",
    situations: ["deep-work"],
    intensity: 3,
    segs: [[120, 40, 14], [7080, 14, 14]],
    gain: 0.5,
    tags: ["beta", "study"],
    reason: "A two minute lift, then two hours at 14 Hz for long reading blocks."
  }),
  f({
    id: "android-creativity",
    name: "Creative Waves",
    category: "vibes",
    vibe: "bright",
    situations: ["quick-reset", "deep-work"],
    intensity: 2,
    segs: pt,
    noise: ["white", 0.4],
    tags: ["alpha", "theta", "creative"],
    reason: "Twenty minutes that drift back and forth between 10 and 6 Hz for loose ideas."
  }),
  f({
    id: "android-wakeful-relax",
    name: "Quiet Alert",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]],
    noise: ["white", 0.4],
    tags: ["alpha", "zen"],
    reason: "Fifteen minutes parked at 7.83 Hz with white noise, calm but awake."
  }),
  f({
    id: "android-schumann",
    name: "Earth Hum",
    category: "healing",
    vibe: "grounded",
    situations: ["heal-stress", "meditate"],
    intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]],
    noise: ["white", 0.4],
    tags: ["alpha", "earth"],
    reason: "Ramps to 7.83 Hz, holds there ten minutes, then climbs back to 12 Hz."
  }),
  f({
    id: "android-astral-relax",
    name: "Dream Gate Relax",
    category: "lucid-dreams",
    vibe: "ethereal",
    situations: ["lucid-dream", "meditate"],
    intensity: 2,
    segs: [[600, 15, 10], [4800, 10, 10]],
    noise: ["white", 0.4],
    tags: ["alpha", "astral"],
    reason: "A ten minute slide from 15 to 10 Hz, then a long steady alpha rest."
  }),
  f({
    id: "android-interval-pulse",
    name: "Interval Pulse",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: ft,
    tags: ["beta", "gamma", "interval"],
    reason: "Eight short high and low rounds between a warm up and a cool down."
  }),
  f({
    id: "android-hallucination",
    name: "Hazy Visions",
    category: "vibes",
    vibe: "ethereal",
    situations: ["quick-reset"],
    intensity: 3,
    segs: [[600, 15, 10]],
    noise: ["white", 0.2],
    tags: ["alpha", "trippy"],
    reason: "A single ten minute slide from 15 to 10 Hz for a soft, dreamy mood."
  }),
  f({
    id: "android-sleep-induction",
    name: "Drift Down",
    category: "sleep",
    vibe: "calm",
    situations: ["cant-sleep"],
    intensity: 1,
    segs: [[360, 9.7, 3.4], [1620, 3.4, 2.4], [1620, 2.4, 3.4]],
    noise: K,
    gain: 0.5,
    tags: ["delta", "induction"],
    reason: "A six minute fall to delta, then a long gentle rise and dip for the rest of the hour."
  }),
  f({
    id: "android-lucid-dreams",
    name: "Lucid Dream Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream"],
    intensity: 2,
    segs: le,
    gain: 0.5,
    tags: ["theta", "lucid"],
    reason: "A theta bed with brief alpha lifts and a soft ending."
  }),
  f({
    id: "android-shamanic-rhythm",
    name: "Ember Circle",
    category: "meditation",
    vibe: "grounded",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 9, 4.5], [3e3, 4.5, 4.5], [300, 4.5, 9]],
    noise: ["white", 0.4],
    tags: ["theta", "journey"],
    reason: "Five minutes down to 4.5 Hz, fifty minutes of hold, five minutes back up."
  }),
  f({
    id: "android-smr-sleep",
    name: "SMR Sleep Weave",
    category: "sleep",
    vibe: "minimal",
    situations: ["cant-sleep", "heal-stress"],
    intensity: 2,
    segs: ht,
    tags: ["alpha", "smr"],
    reason: "Forty minutes of beats crossing between alpha and the low SMR band."
  }),
  f({
    id: "android-lucid-dreams-2",
    name: "Long Lucid Night",
    category: "lucid-dreams",
    vibe: "deep",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...mt],
    noise: W,
    gain: 0.5,
    tags: ["delta", "theta", "lucid"],
    reason: "A delta fall followed by a long night plan with timed theta pulses."
  }),
  f({
    id: "android-adhd-cycle",
    name: "Focus Cycle",
    category: "adhd-control",
    vibe: "energized",
    situations: ["adhd-focus", "deep-work"],
    intensity: 3,
    segs: [[300, 40, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20]],
    noise: _,
    tags: ["beta", "cycle"],
    reason: "Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener."
  }),
  // Shortened variants of existing Android programs.
  f({
    id: "android-self-hypnosis-short",
    name: "Quick Mind Bridge",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: _,
    scale: 0.5,
    tags: ["theta", "short"],
    reason: "The Mind Bridge shape squeezed into ten minutes."
  }),
  f({
    id: "android-wakeful-relax-5",
    name: "Five Minute Calm",
    category: "work-recovery",
    vibe: "calm",
    situations: ["quick-reset", "ai-burnout"],
    intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]],
    noise: ["white", 0.3],
    scale: 1 / 3,
    tags: ["alpha", "short"],
    reason: "A five minute Quiet Alert between tasks."
  }),
  f({
    id: "android-schumann-short",
    name: "Earth Reset",
    category: "healing",
    vibe: "grounded",
    situations: ["heal-stress", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]],
    noise: ["white", 0.3],
    scale: 0.5,
    tags: ["alpha", "short"],
    reason: "A ten minute version of the Earth Hum shape."
  }),
  f({
    id: "android-lucid-dreams-short",
    name: "Lucid Nap Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: le.slice(0, 12),
    gain: 0.5,
    tags: ["theta", "lucid", "short"],
    reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
  })
], G = (e) => ({ ...e, source: "gnaural" }), gt = [
  G({
    id: "gnaural-power-nap",
    name: "Midday Nap",
    category: "sleep",
    vibe: "warm",
    situations: ["quick-reset", "cant-sleep", "ai-burnout"],
    intensity: 1,
    segs: [[13, 11, 8.8], [17, 8.8, 7], [29, 7, 5.2], [38, 5.2, 4.4], [50, 4.4, 4.2], [68, 4.2, 4], [877, 4, 4], [37, 4, 4.2], [32, 4.2, 5.1], [20, 5.1, 6.8], [15, 6.8, 9.8], [4, 9.8, 9.8]],
    carrier: 164,
    carrierEnd: 110,
    noise: W,
    gain: 0.5,
    tags: ["delta", "nap", "schedule"],
    reason: "A fast fall to 4 Hz, a long hold, then a slow climb. Twenty minutes in all."
  }),
  G({
    id: "gnaural-airplane-aid",
    name: "Long Haul Calm",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset", "heal-stress"],
    intensity: 1,
    segs: [[9, 0.5, 12], [45, 12, 8], [60, 8, 6], [120, 6, 5], [180, 5, 4.3], [180, 4.3, 4], [900, 4, 4], [900, 4, 4.2], [900, 4.2, 3.9], [900, 3.9, 3.9], [400, 3.9, 4.3]],
    carrier: 280,
    carrierEnd: 140,
    noise: K,
    gain: 0.5,
    tags: ["theta", "travel", "schedule"],
    reason: "A falling carrier tone over theta beats, built for long seated trips."
  }),
  G({
    id: "gnaural-arrive-sharp",
    name: "Arrive Sharp",
    category: "focus",
    vibe: "bright",
    situations: ["deep-work"],
    intensity: 4,
    segs: [[236, 10.1, 10.1], [132, 12.1, 12.1], [661, 28.5, 28.5], [209, 5.4, 5.4], [73, 7.3, 7.3]],
    carrier: 200,
    gain: 0.5,
    tags: ["beta", "gamma", "schedule"],
    reason: "Five steps from alpha up to a 28.5 Hz middle, then back down, in twenty two minutes."
  })
];
function bt() {
  return [...yt, ...gt].map(dt);
}
const vt = [
  { id: "lofi", name: "Lo-fi", blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.", mood: "warm", defaultLevel: 0.5, layerKeys: ["lofiLevel", "lofiProgression", "tapeWow", "crackle"], templateId: "starter-lofi", evidence: "preference" },
  { id: "piano", name: "Soft piano", blurb: "A soft piano playing gentle, slow phrases with long ringing notes.", mood: "calm", defaultLevel: 0.45, layerKeys: ["instLevel", "instKind", "pianoPedal"], templateId: "starter-piano", evidence: "preference" },
  { id: "violet", name: "Violet hiss", blurb: "A thin, bright hiss, like gentle static. Keep it quiet.", mood: "bright", defaultLevel: 0.3, layerKeys: [], templateId: "starter-violet", evidence: "limited" },
  { id: "rain", name: "Rain hush", blurb: "A steady rain-like hush, even across the pitches (pink noise).", mood: "calm", defaultLevel: 0.4, layerKeys: [], templateId: "starter-rain", evidence: "mixed" },
  { id: "deep", name: "Deep rumble", blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).", mood: "deep", defaultLevel: 0.4, layerKeys: [], templateId: "starter-deep", evidence: "preference" },
  { id: "chimes", name: "Soft chimes", blurb: "Soft bells that ring now and then at uneven gaps.", mood: "dreamy", defaultLevel: 0.3, layerKeys: ["chimeLevel", "chimeRatePerMin"], templateId: "starter-chimes", evidence: "preference" },
  { id: "beats", name: "Beats only", blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.", mood: "neutral", defaultLevel: 0, layerKeys: [], templateId: "starter-beats", evidence: "mixed" }
], wt = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function kt(e, t) {
  const n = wt(t);
  switch (e) {
    case "lofi":
      return { noise: "off", noiseLevel: 0, layers: { lofiLevel: n, lofiWarmth: 0.6, lofiProgression: 2, tapeWow: 0.35, crackle: 0.12, breathDepth: 0.4, breathRateHz: 0.08, stereoWidth: 0.5 } };
    case "piano":
      return { noise: "off", noiseLevel: 0, layers: { instLevel: n, instKind: 3, instRootHz: 220, instScale: 2, instBpm: 46, pianoPedal: 0.5, breathDepth: 0.3, breathRateHz: 0.07, stereoWidth: 0.4 } };
    case "violet":
      return { noise: "violet", noiseLevel: n, layers: {} };
    case "rain":
      return { noise: "pink", noiseLevel: n, layers: {} };
    case "deep":
      return { noise: "brown", noiseLevel: n, layers: {} };
    case "chimes":
      return { noise: "off", noiseLevel: 0, layers: { chimeLevel: n, chimeRatePerMin: 5, breathDepth: 0.2, breathRateHz: 0.06 } };
    default:
      return { noise: "off", noiseLevel: 0, layers: {} };
  }
}
const St = { warm: "warm", calm: "calm", bright: "bright", deep: "deep", dreamy: "dreamy", neutral: "minimal" };
function At(e) {
  const t = kt(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, i = [{
    atMin: 0,
    beatHz: 8,
    carrierHz: 200,
    gain: 0.4,
    mode: "binaural",
    noise: t.noise,
    noiseLevel: t.noiseLevel,
    ...n ? { layers: t.layers } : {},
    ramp: !1
  }];
  return {
    id: e.templateId,
    name: e.name,
    category: "vibes",
    vibe: St[e.mood] ?? "calm",
    tags: ["starter", "sound-first", e.id],
    layerTags: Z(i),
    situations: ["quick-reset", "heal-stress"],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: Q(i, 1),
    stages: i,
    reasonTemplate: e.blurb,
    source: "original"
  };
}
function Mt() {
  return vt.map(At);
}
function Lt() {
  return [
    ...Mt(),
    ...bt(),
    ...[lt, at, it, ot, rt, nt, st, ct].flatMap(tt)
  ];
}
let ce;
function P() {
  return ce ?? (ce = Lt()), ce;
}
new Proxy([], {
  get: (e, t) => Reflect.get(P(), t),
  has: (e, t) => Reflect.has(P(), t),
  ownKeys: () => Reflect.ownKeys(P()),
  getOwnPropertyDescriptor: (e, t) => {
    const n = Reflect.getOwnPropertyDescriptor(P(), t);
    return n === void 0 || t === "length" ? n : { ...n, configurable: !0 };
  }
});
function Nt(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.percLevel) ?? 0) > 0;
  });
}
function Tt(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.crackle) ?? 0) > 0;
  });
}
function ue(e) {
  return e.stages.some((t) => t.mode === "binaural");
}
const Et = {
  focus: [1, 1, 0.5, 0.1],
  "adhd-control": [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  "work-recovery": [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  "lucid-dreams": [0, 0.1, 0.6, 1]
}, Ct = { morning: 0, afternoon: 1, evening: 2, night: 3 }, Rt = (e) => Math.round(e * 10) / 10;
function zt(e, t, n) {
  const s = Math.max(1, t);
  if (e <= s)
    return n.push(`Fits your ${s} minutes (${e} min).`), 15 * (0.6 + 0.4 * (e / s));
  const i = (e - s) / s;
  return n.push(`Runs ${e} min, longer than your ${s}; you can stop any time.`), Math.max(0, 15 * (1 - i * 1.5)) - (i > 0.5 ? 5 : 0);
}
function Dt(e, t, n) {
  return t.deviceType === "speaker" ? ue(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), ue(e) ? 10 : 8);
}
function Ot(e, t, n) {
  const s = e.intensity > 3 || Nt(e) || Tt(e), i = t.sensorySensitivity;
  return i === "low" ? { pts: 10, sensitive: !1 } : i === "medium" ? { pts: e.intensity <= 3 ? s ? 7 : 10 : 4, sensitive: !1 } : s ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), { pts: 0, sensitive: !0 }) : (n.push("Gentle: low intensity, no percussion or crackle."), { pts: e.intensity <= 2 ? 10 : 7, sensitive: !1 });
}
function It(e, t) {
  const n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], s = e.situations.includes(t.situation);
  let i = 0;
  s ? (i += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? i += 7 : t.vibe === e.vibe && (i += 15, n.push(`Matches your ${t.vibe} vibe.`)), i += zt(e.recommendedMinutes, t.availableMinutes, n);
  const a = (Et[e.category][Ct[t.timeOfDay]] ?? 0) * 10;
  i += a, a >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (i -= 5), i += Dt(e, t, n);
  const o = Ot(e, t, n);
  return i += o.pts, { template: e, score: Math.max(0, Rt(i)), reasons: n, sensitive: o.sensitive, onSituation: s };
}
const Pt = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : e.template.id > t.template.id ? 1 : 0);
function Ht(e, t = 5, n = P()) {
  const s = Math.max(1, Math.floor(t)), i = n.map((r) => It(r, e)).sort(Pt), a = [
    i.filter((r) => r.onSituation && !r.sensitive),
    i.filter((r) => !r.sensitive),
    i
  ], o = a.find((r) => r.length >= s) ?? i, c = o.slice(0, s);
  return o !== a[0] && c.forEach((r) => {
    r.onSituation || r.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
  }), c.map((r) => ({ template: r.template, score: r.score, reasons: r.reasons }));
}
function jt(e) {
  const t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), s = Math.floor(n / 60), i = (a) => String(a).padStart(2, "0");
  return s > 0 ? `${s}:${i(n % 60)}:${i(t % 60)}` : `${i(n)}:${i(t % 60)}`;
}
const m = {
  brand: "Zonked",
  promise: "Free. Private. No account.",
  welcomeTitle: "Calm sound, made for you.",
  welcomeBody: "A few quick questions. Then your first sound.",
  skip: "Skip, just play",
  back: "Back",
  next: "Next",
  start: "Start",
  stop: "Stop",
  pause: "Pause",
  play: "Play",
  done: "Done",
  notThisOne: "Not this one",
  goalTitle: "What brings you here?",
  whenTitle: "When do you need it most?",
  listenTitle: "How do you listen?",
  listenNote: "Headphones suit two-tone beats best, and speakers suit gentle pulses and noise.",
  stepOf: (e) => `${e} of 3`,
  selected: "Selected",
  playAgain: "Play again",
  close: "Close",
  endTitle: "Done for now.",
  endLine: (e, t) => `${e} played for ${t < 1 ? "under a minute" : t === 1 ? "1 minute" : `${t} minutes`}.`,
  endNote: "Go at your own pace.",
  starterTitle: "Pick a starter sound",
  preview: "Preview",
  previewing: "Playing a short preview",
  safetyTitle: "Before you start",
  safetyLines: [
    "Use stereo headphones for the best effect.",
    "Keep the volume low.",
    "Zonked fades in slowly.",
    "Zonked is not a medical device.",
    "Stop any time.",
    "Stop if anything feels uncomfortable."
  ],
  safetyAccept: "I understand, start",
  notMedical: "Zonked is not a medical device.",
  dailyEyebrow: "Your session for today",
  suggested: "Suggested for you",
  forYou: "For you",
  journeysTitle: "Journeys",
  journeysEmpty: "Pick a journey to begin. Go at your own pace.",
  restDay: "Rest day",
  restart: "Restart journey",
  startJourney: "Start this journey",
  libraryTitle: "Library",
  searchLabel: "Search sounds",
  searchEmpty: "Nothing matched. Try fewer words.",
  tabs: ["Feeling", "Sound", "Favorites", "My mixes", "Recent"],
  emptyFavorites: "Tap the heart on any sound to keep it here.",
  emptyMixes: "Make a mix in the player, then save it here.",
  emptyRecent: "Your recent sessions show up here.",
  welcomeBack: "Welcome back. Pick up where you like.",
  firstWeek: "Your week starts here. Rest days count too.",
  restCount: "Rest days count too.",
  timerChips: ["15 min", "30 min", "60 min", "Until I stop", "Sleep fade"],
  breathe: "Breathe in, breathe out",
  breatheIn: "Breathe in",
  breatheOut: "Breathe out",
  whyTitle: "What the research says",
  whyBody: "Some small studies suggest slow beats may help people relax. Results vary and may not happen for you. Zonked is not a medical device.",
  volumeCapped: "Volume is capped for your safety.",
  favorite: "Favorite",
  saved: "Saved",
  studio: "Studio mode",
  studioHint: "For advanced controls.",
  backToCalm: "Back to Calm",
  crewTitle: "Crew",
  crewIntro: "Your coding session can watch itself and ease the sound. When you have been working hard, Zonked slowly moves toward calmer sound. You stay in control.",
  crewSwitch: "Let Crew ease the sound",
  crewOff: "Not connected",
  crewOn: "Connected",
  crewBreak: "Time for a break",
  crewPrivacy: "Nothing leaves your computer.",
  crewOptional: "Crew is optional. Zonked works fully without it.",
  settingsTitle: "Settings",
  gentle: "Keep sounds extra gentle",
  gentleHint: "Picks softer sounds and keeps the screen still.",
  reduceMotion: "Reduce motion",
  forget: "Forget my answers",
  offline: "Zonked works offline. Nothing to do.",
  errorAudio: "Sound could not start. Tap Play to try again.",
  errorStorage: "We could not save this on your device. Your session still works.",
  loading: "Loading",
  nav: ["Today", "Journeys", "Library", "Crew", "Settings"]
}, Ft = {
  focus: "Focus",
  calm: "Calm down",
  sleep: "Sleep",
  study: "Study",
  recover: "Recover after work",
  curious: "Just curious"
}, cs = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
  anytime: "Anytime"
}, us = {
  headphones: "Headphones",
  speakers: "Speakers",
  bluetooth: "Bluetooth",
  unsure: "Not sure"
}, ds = [
  { id: "deep-work", label: "Focus" },
  { id: "adhd-focus", label: "Steady attention" },
  { id: "ai-burnout", label: "Recover" },
  { id: "heal-stress", label: "Calm down" },
  { id: "cant-sleep", label: "Sleep" },
  { id: "lucid-dream", label: "Dream" },
  { id: "meditate", label: "Meditate" },
  { id: "quick-reset", label: "Quick reset" }
], ms = {
  strong: "Several studies exist.",
  mixed: "Studies disagree.",
  preliminary: "Early, small studies.",
  limited: "Very little research.",
  preference: "People simply like it."
};
function Bt(e) {
  return e >= 5 && e < 12 ? "Good morning." : e >= 12 && e < 17 ? "Good afternoon." : e >= 17 && e < 21 ? "Good evening." : "Hello, night owl.";
}
const _t = [
  { view: "today", label: m.nav[0] },
  { view: "journeys", label: m.nav[1] },
  { view: "library", label: m.nav[2] },
  { view: "crew", label: m.nav[3] },
  { view: "settings", label: m.nav[4] }
];
function xt({ view: e, onGo: t }) {
  const n = e === "journey" ? "journeys" : e;
  return /* @__PURE__ */ l("nav", { className: "c-tabbar", "aria-label": "Main", children: _t.map((s) => /* @__PURE__ */ l("button", { type: "button", className: "c-nav", "aria-current": n === s.view ? "page" : void 0, onClick: () => t(s.view), children: s.label }, s.view)) });
}
function Gt({ snap: e, onOpen: t, onStop: n }) {
  if (!e.playing) return null;
  const s = e.timer.kind !== "none" && e.timer.running ? ` ${jt(e.timer.remainingSec)}` : "";
  return /* @__PURE__ */ g("div", { className: "c-mini", role: "group", "aria-label": "Now playing", children: [
    /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-link c-mini-open", onClick: t, children: `${e.templateName ?? m.brand}${s}` }),
    /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-small", "data-testid": "mini-stop", onClick: n, children: m.stop })
  ] });
}
const $t = ["focus", "calm", "sleep", "study", "recover", "curious"], qt = ["morning", "afternoon", "evening", "night", "anytime"], Wt = ["headphones", "speakers", "bluetooth", "unsure"], Kt = {
  "sleep-onset-delta": 6,
  "sleep-drift-theta": 5,
  "sleep-deep-delta": 5,
  "recovery-lofi-unwind": 5,
  "recovery-post-sprint": 4,
  "recovery-micro-break": 4,
  "focus-alpha-beta": 5,
  "focus-sprint-pulse": 4,
  "focus-deep-beta": 5,
  "adhd-smr-steady": 5,
  "adhd-beta-anchor": 5,
  "vibe-warm-glow": 4,
  "healing-soothe-glide": 4,
  "meditation-alpha-sit": 5,
  "meditation-breath-pacer": 4
}, Yt = Object.freeze({ kind: "rest", family: "", variants: Object.freeze([]) });
function Jt(e) {
  const t = Kt[e] ?? 0, n = [];
  for (let s = 1; s <= t; s += 1) n.push(`${e}-${String(s).padStart(2, "0")}`);
  return Object.freeze(n);
}
function Vt(e) {
  return Object.freeze({ kind: "session", family: e, variants: Jt(e) });
}
function O(...e) {
  return Object.freeze(e.map((t) => t === "rest" ? Yt : Vt(t)));
}
const $ = (e, t) => Array.from({ length: t }, () => e), I = (e) => Object.freeze(e), X = Object.freeze([
  I({
    id: "calm-evenings",
    title: "7 Calm Evenings",
    blurb: "7 short evenings of slow sound. About 20 minutes each.",
    situation: "heal-stress",
    vibe: "calm",
    minutes: 20,
    days: O(
      "healing-soothe-glide",
      "meditation-breath-pacer",
      "vibe-warm-glow",
      "rest",
      "meditation-alpha-sit",
      "recovery-lofi-unwind",
      "healing-soothe-glide"
    )
  }),
  I({
    id: "focus-mornings",
    title: "5 Focus Mornings",
    blurb: "5 mornings of steady sound to start work. About 30 minutes each.",
    situation: "deep-work",
    vibe: "bright",
    minutes: 30,
    days: O("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
  }),
  I({
    id: "easier-sleep",
    title: "14 Nights of Wind-Down Sound",
    blurb: "14 nights of slow sound for winding down. Rest nights included.",
    situation: "cant-sleep",
    vibe: "dreamy",
    minutes: 45,
    days: O(
      ...$("sleep-drift-theta", 4),
      "rest",
      ...$("sleep-onset-delta", 4),
      "rest",
      ...$("sleep-deep-delta", 3),
      "sleep-onset-delta"
    )
  }),
  I({
    id: "study-sprint",
    title: "Study Sprint Week",
    blurb: "A week of short study blocks with breaks. About 25 minutes each.",
    situation: "deep-work",
    vibe: "minimal",
    minutes: 25,
    days: O(
      "focus-sprint-pulse",
      "focus-alpha-beta",
      "recovery-micro-break",
      "focus-sprint-pulse",
      "rest",
      "focus-alpha-beta",
      "meditation-alpha-sit"
    )
  }),
  I({
    id: "after-work-reset",
    title: "After-Work Reset",
    blurb: "5 evenings to step out of work mode. About 20 minutes each.",
    situation: "ai-burnout",
    vibe: "warm",
    minutes: 20,
    days: O("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
  }),
  I({
    id: "gentle-routine",
    title: "Gentle Routine",
    blurb: "Gentle routine for steady attention. About 25 minutes each.",
    situation: "adhd-focus",
    vibe: "grounded",
    minutes: 25,
    days: O(
      "adhd-smr-steady",
      "recovery-micro-break",
      "adhd-smr-steady",
      "rest",
      "adhd-beta-anchor",
      "recovery-micro-break",
      "adhd-smr-steady"
    )
  })
]);
function ps(e) {
  return X.find((t) => t.id === e);
}
const Ut = {
  focus: { situation: "deep-work", vibe: "bright", minutes: 25 },
  calm: { situation: "heal-stress", vibe: "calm", minutes: 15 },
  sleep: { situation: "cant-sleep", vibe: "dreamy", minutes: 45 },
  study: { situation: "deep-work", vibe: "minimal", minutes: 30 },
  recover: { situation: "ai-burnout", vibe: "warm", minutes: 15 },
  curious: { situation: "quick-reset", minutes: 10 }
}, Zt = {
  headphones: "headphones",
  bluetooth: "bluetooth",
  speakers: "speaker",
  unsure: "headphones"
};
function Qt(e) {
  return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function Xt(e, t = /* @__PURE__ */ new Date()) {
  const n = Ut[e.goal], s = e.timeOfDay === "anytime" ? Qt(t.getHours()) : e.timeOfDay, i = {
    situation: n.situation,
    availableMinutes: n.minutes,
    timeOfDay: s,
    sensorySensitivity: e.extraGentle ? "high" : "medium",
    deviceType: Zt[e.device]
  };
  return Object.freeze(n.vibe === void 0 ? i : { ...i, vibe: n.vibe });
}
const en = 3, tn = 864e5, ge = 4;
function ee(e) {
  if (!Number.isFinite(e)) return 0;
  const t = new Date(e).getTimezoneOffset() * 6e4;
  return Math.floor((e - t) / tn);
}
const be = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function nn(e) {
  return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : ge;
}
function sn(e) {
  return e - (e + 3) % 7;
}
function an(e, t, n) {
  const s = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!be(a.day) || a.day < t || a.day > n) continue;
    const o = Number.isFinite(a.minutes) && a.minutes > 0 ? a.minutes : 0;
    s.set(a.day, (s.get(a.day) ?? 0) + o);
  }
  const i = /* @__PURE__ */ new Set();
  return s.forEach((a, o) => {
    a >= en && i.add(o);
  }), i;
}
function on(e, t, n) {
  return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function rn(e, t, n = ge) {
  const s = nn(n);
  if (!be(t)) {
    const c = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
    return Object.freeze({ daysListened: 0, goalDays: s, goalMet: !1, quietWeek: !0, dots: c });
  }
  const i = sn(t), a = an(e, i, t), o = Object.freeze(Array.from({ length: 7 }, (c, r) => on(i + r, t, a)));
  return Object.freeze({
    daysListened: a.size,
    goalDays: s,
    goalMet: a.size >= s,
    quietWeek: a.size === 0,
    dots: o
  });
}
const te = "zonked.profile.v1", ne = "zonked.journeys.v1", se = "zonked.last.v1", ve = 32 * 1024, we = 1, ln = 1e7, cn = /^[a-z0-9-]{1,64}$/, ke = Object.freeze({
  goal: "curious",
  timeOfDay: "anytime",
  device: "unsure",
  extraGentle: !1,
  createdAt: 0
}), un = Object.freeze({}), ae = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Y = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, q = (e, t) => e.some((n) => n === t);
function Se(e, t) {
  try {
    const n = e.get(t);
    if (n === null || n.length > ve) return;
    const s = JSON.parse(n);
    return ae(s) && s.v === we ? s : void 0;
  } catch {
    return;
  }
}
function Ae(e, t, n) {
  try {
    const s = JSON.stringify({ v: we, ...n });
    return s.length > ve ? !1 : (e.set(t, s), !0);
  } catch {
    return !1;
  }
}
function Me(e) {
  const { goal: t, timeOfDay: n, device: s, extraGentle: i, createdAt: a } = e;
  if (!(!q($t, t) || !q(qt, n) || !q(Wt, s)) && !(typeof i != "boolean" || !Y(a, Number.MAX_SAFE_INTEGER)))
    return Object.freeze({ goal: t, timeOfDay: n, device: s, extraGentle: i, createdAt: a });
}
function dn(e) {
  const t = Se(e, te);
  return (t && Me(t)) ?? ke;
}
function mn(e, t) {
  const n = Me({ ...t });
  return n !== void 0 && Ae(e, te, { ...n });
}
function Le(e, t) {
  const n = X.find((r) => r.id === e);
  if (n === void 0 || !ae(t) || !Y(t.startedAt, ln)) return;
  const { doneDays: s, pickedIds: i } = t;
  if (!Array.isArray(s) || !Array.isArray(i) || i.length > n.days.length) return;
  const a = s, o = i;
  if (!a.every((r) => Y(r, n.days.length) && r >= 1) || !o.every((r) => typeof r == "string" && cn.test(r))) return;
  const c = [...new Set(a)].sort((r, d) => r - d);
  return Object.freeze({
    startedAt: t.startedAt,
    doneDays: Object.freeze(c),
    pickedIds: Object.freeze([...o])
  });
}
function pn(e) {
  const t = Se(e, ne), n = t == null ? void 0 : t.journeys;
  if (!ae(n)) return un;
  const s = {};
  for (const [i, a] of Object.entries(n)) {
    const o = Le(i, a);
    o !== void 0 && (s[i] = o);
  }
  return Object.freeze(s);
}
function hn(e, t) {
  const n = {};
  for (const [s, i] of Object.entries(t)) {
    const a = Le(s, i);
    a !== void 0 && (n[s] = a);
  }
  return Ae(e, ne, { journeys: n });
}
function fn(e) {
  for (const t of [te, ne, se])
    try {
      e.remove(t);
    } catch {
    }
}
function de() {
  const e = /* @__PURE__ */ new Map();
  return {
    get: (t) => e.get(t) ?? null,
    set: (t, n) => void e.set(t, n),
    remove: (t) => void e.delete(t)
  };
}
function yn(e) {
  try {
    const t = e ?? globalThis.localStorage;
    if (t === void 0) return de();
    const n = "zonked.probe";
    return t.setItem(n, "1"), t.removeItem(n), {
      get: (s) => t.getItem(s),
      set: (s, i) => t.setItem(s, i),
      remove: (s) => t.removeItem(s)
    };
  } catch {
    return de();
  }
}
const Ne = /^[a-z0-9-]{1,80}$/;
function gn(e) {
  try {
    const t = e.get(se);
    return t !== null && Ne.test(t) ? t : null;
  } catch {
    return null;
  }
}
function bn(e, t) {
  try {
    Ne.test(t) && e.set(se, t);
  } catch {
  }
}
const vn = 60, wn = 400;
function kn(e, t) {
  const n = z(null), [s, i] = k(null);
  T(() => {
    if (e.playing) {
      i(null), n.current = e.templateId === null ? null : { id: e.templateId, name: e.templateName ?? m.brand, minutes: e.elapsedSec / 60 };
      return;
    }
    const o = n.current;
    if (n.current = null, !t || o === null || o.minutes * 60 < vn) return;
    const c = window.setTimeout(() => i({ ...o, minutes: Math.round(o.minutes) }), wn);
    return () => window.clearTimeout(c);
  }, [e.playing, e.templateId, e.templateName, e.elapsedSec, t]);
  const a = M(() => i(null), []);
  return H(() => ({ card: s, dismiss: a }), [s, a]);
}
function Sn({ info: e, onAgain: t, onClose: n }) {
  const s = z(null);
  return T(() => {
    var i;
    return (i = s.current) == null ? void 0 : i.focus();
  }, []), /* @__PURE__ */ l("div", { className: "c-overlay", onKeyDown: (i) => i.key === "Escape" && n(), children: /* @__PURE__ */ g("div", { className: "c-dialog c-end", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-end-title", "data-testid": "end-card", children: [
    /* @__PURE__ */ l("h2", { id: "c-end-title", className: "c-h1", children: m.endTitle }),
    /* @__PURE__ */ l("p", { children: m.endLine(e.name, e.minutes) }),
    /* @__PURE__ */ l("p", { className: "c-muted", children: m.endNote }),
    /* @__PURE__ */ g("div", { className: "c-actions", children: [
      /* @__PURE__ */ l("button", { ref: s, type: "button", className: "c-btn c-primary", "data-testid": "end-again", onClick: t, children: m.playAgain }),
      /* @__PURE__ */ l("button", { type: "button", className: "c-btn", "data-testid": "end-close", onClick: n, children: m.close })
    ] })
  ] }) });
}
function An({ onAccept: e, onCancel: t }) {
  const n = z(null), s = z(null);
  T(() => {
    var o;
    return (o = n.current) == null ? void 0 : o.focus();
  }, []);
  const a = /* @__PURE__ */ g("div", { className: "c-safety", onKeyDown: (o) => {
    var c;
    if (t !== void 0) {
      if (o.key === "Escape")
        o.stopPropagation(), t();
      else if (o.key === "Tab") {
        const r = o.shiftKey ? s.current : n.current;
        document.activeElement === r && (o.preventDefault(), (c = o.shiftKey ? n.current : s.current) == null || c.focus());
      }
    }
  }, children: [
    /* @__PURE__ */ l("h2", { id: "c-safety-title", children: m.safetyTitle }),
    /* @__PURE__ */ l("ul", { className: "c-safe-list", children: m.safetyLines.map((o) => /* @__PURE__ */ l("li", { children: o }, o)) }),
    /* @__PURE__ */ g("div", { className: "c-actions c-row", children: [
      t !== void 0 && /* @__PURE__ */ l("button", { ref: s, type: "button", className: "c-btn", onClick: t, children: m.back }),
      /* @__PURE__ */ l("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "calm-safety-accept", onClick: e, children: m.safetyAccept })
    ] })
  ] });
  return t === void 0 ? a : /* @__PURE__ */ l("div", { className: "c-overlay", children: /* @__PURE__ */ l("div", { className: "c-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-safety-title", children: a }) });
}
const Mn = 1, Ln = 720;
function Nn(e) {
  const t = (e.endedAt - e.startedAt) / 6e4;
  return Number.isFinite(t) && t >= Mn ? Math.min(Ln, t) : 0;
}
const Tn = 200, J = (e = Date.now) => ee(e());
function En(e, t) {
  const n = H(() => yn(), []), [s, i] = k(() => dn(n)), [a, o] = k(() => pn(n)), [c, r] = k([]), [d, y] = k(0);
  T(() => {
    let p = !0;
    return e.listLogs(Tn).then((b) => p && r(b)).catch(() => {
    }), () => {
      p = !1;
    };
  }, [e, d, t]);
  const w = H(() => {
    const p = c.map((b) => ({ day: ee(b.startedAt), minutes: Nn(b) }));
    return rn(p, J());
  }, [c]), L = M(
    (p) => {
      i(p), mn(n, p);
    },
    [n]
  ), v = M(
    (p, b) => {
      o((R) => {
        const { [p]: A, ...E } = R, D = b === null ? E : { ...E, [p]: b };
        return hn(n, D), D;
      });
    },
    [n]
  ), S = M(() => y((p) => p + 1), []);
  return { storage: n, profile: s, progress: a, week: w, logs: c, setProfile: L, setJourney: v, refresh: S };
}
const Cn = ["M", "T", "W", "T", "F", "S", "S"], me = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], Rn = { listened: "listened", rest: "rest day", today: "today", upcoming: "coming up" };
function zn(e, t = !0) {
  if (e.quietWeek) return t ? m.welcomeBack : m.firstWeek;
  const n = e.daysListened;
  return `${n} ${n === 1 ? "day" : "days"} this week. ${m.restCount}`;
}
function Dn({ week: e, hasHistory: t = !0 }) {
  return /* @__PURE__ */ g("div", { className: "c-week", children: [
    /* @__PURE__ */ l("ul", { className: "c-dots", "aria-label": "This week", children: e.dots.map((n, s) => /* @__PURE__ */ g("li", { className: `c-dot c-dot-${n}`, "data-state": n, children: [
      /* @__PURE__ */ l("span", { className: "c-mark", "aria-hidden": "true", children: Cn[s] }),
      /* @__PURE__ */ l("span", { className: "c-sr", children: `${me[s]}, ${Rn[n]}` })
    ] }, me[s])) }),
    /* @__PURE__ */ l("p", { className: "c-muted", "data-testid": "week-text", children: zn(e, t) })
  ] });
}
const On = C(() => import("./chunk-mascot-BtlVTBkR.mjs").then((e) => ({ default: e.CalmMascot }))), In = () => /* @__PURE__ */ new Date();
function Pn(e, t, n) {
  var i;
  const s = ((i = e[t]) == null ? void 0 : i.doneDays.length) ?? 0;
  return s === 0 ? "Not started" : `Day ${Math.min(n, s + 1)} of ${n}`;
}
function Hn({ profile: e, week: t, progress: n, reduced: s, crewConnected: i, hasHistory: a = !0, now: o = In, last: c = null, onPlay: r, onOpenJourney: d, onGo: y }) {
  const [w, L] = k(0), v = H(() => Ht(Xt(e, o()), 5), [e, o]), S = v[w % Math.max(1, v.length)];
  return /* @__PURE__ */ g("div", { className: "c-today", children: [
    /* @__PURE__ */ l("div", { className: "c-hero c-hero-sm", children: /* @__PURE__ */ l(pe, { fallback: null, children: /* @__PURE__ */ l(On, { mood: "idle", size: 128, reducedMotion: s }) }) }),
    /* @__PURE__ */ l("h1", { className: "c-greet", "data-testid": "greeting", children: Bt(o().getHours()) }),
    c !== null && /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-primary c-wide c-again", "data-testid": "play-again", onClick: () => r(c), children: `${m.playAgain}: ${c.name}` }),
    S !== void 0 && /* @__PURE__ */ g("section", { className: "c-card c-daily", "aria-labelledby": "c-daily-h", children: [
      /* @__PURE__ */ l("p", { className: "c-eyebrow", children: m.dailyEyebrow }),
      /* @__PURE__ */ l("h2", { id: "c-daily-h", children: S.template.name }),
      /* @__PURE__ */ l("p", { className: "c-muted", children: `${S.template.recommendedMinutes} min. ${S.reasons[0] ?? m.suggested}` }),
      /* @__PURE__ */ g("div", { className: "c-actions", children: [
        /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-primary", "data-testid": "today-play", onClick: () => r(S.template), children: m.start }),
        /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-link", onClick: () => L((p) => p + 1), children: m.notThisOne })
      ] })
    ] }),
    /* @__PURE__ */ g("section", { className: "c-card", "aria-labelledby": "c-goal-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-goal-h", className: "c-h3", children: `Your goal: ${Ft[e.goal]}` }),
      /* @__PURE__ */ l(Dn, { week: t, hasHistory: a })
    ] }),
    /* @__PURE__ */ g("section", { "aria-labelledby": "c-for-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-for-h", className: "c-h3", children: m.forYou }),
      /* @__PURE__ */ l("ul", { className: "c-hscroll", children: v.map((p, b) => /* @__PURE__ */ l("li", { children: /* @__PURE__ */ g("button", { type: "button", className: `c-mini-card c-g${b % 6 + 1}`, onClick: () => r(p.template), children: [
        /* @__PURE__ */ l("b", { children: p.template.name }),
        /* @__PURE__ */ l("small", { children: p.reasons[0] ?? m.suggested }),
        /* @__PURE__ */ l("em", { children: `${p.template.recommendedMinutes} min` })
      ] }) }, p.template.id)) })
    ] }),
    /* @__PURE__ */ g("section", { "aria-labelledby": "c-jr-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-jr-h", className: "c-h3", children: m.journeysTitle }),
      /* @__PURE__ */ l("ul", { className: "c-hscroll", children: X.map((p, b) => /* @__PURE__ */ l("li", { children: /* @__PURE__ */ g("button", { type: "button", className: `c-journey-card c-j${b % 6 + 1}`, onClick: () => d(p.id), children: [
        /* @__PURE__ */ l("b", { children: p.title }),
        /* @__PURE__ */ l("small", { children: p.blurb }),
        /* @__PURE__ */ l("em", { children: Pn(n, p.id, p.days.length) })
      ] }) }, p.id)) })
    ] }),
    /* @__PURE__ */ g("button", { type: "button", className: "c-card c-link-card", onClick: () => y("library"), children: [
      /* @__PURE__ */ l("b", { children: "Browse all sounds" }),
      /* @__PURE__ */ l("span", { className: "c-muted", children: m.libraryTitle })
    ] }),
    i && /* @__PURE__ */ l("p", { className: "c-card c-crew-chip", role: "status", children: "Crew connected: easing the sound" })
  ] });
}
const jn = C(() => import("./chunk-Journeys-C-SGozK7.mjs").then((e) => ({ default: e.JourneyList }))), Fn = C(() => import("./chunk-Journeys-C-SGozK7.mjs").then((e) => ({ default: e.JourneyDetail }))), Bn = C(() => import("./chunk-Library-BX3c_pDq.mjs").then((e) => ({ default: e.Library }))), _n = C(() => import("./chunk-PlayerScreen-B__avaq8.mjs").then((e) => ({ default: e.PlayerScreen }))), xn = C(() => import("./chunk-CrewScreen-H9-jHgCL.mjs").then((e) => ({ default: e.CrewScreen }))), Gn = C(() => import("./chunk-SettingsScreen-CLqFGdu9.mjs").then((e) => ({ default: e.SettingsScreen })));
function $n({ view: e, journeyId: t, s: n, data: s, crewInfo: i, still: a, fav: o, last: c, handlers: r }) {
  switch (e) {
    case "journeys":
      return /* @__PURE__ */ l(jn, { progress: s.progress, onOpen: r.openJourney });
    case "journey":
      return /* @__PURE__ */ l(
        Fn,
        {
          id: t ?? "",
          profile: s.profile,
          progress: s.progress,
          todayDay: J(),
          onBack: () => r.go("journeys"),
          onStartJourney: s.setJourney,
          onRestart: (d) => s.setJourney(d, null),
          onPlayDay: r.playDay
        }
      );
    case "library":
      return /* @__PURE__ */ l(Bn, { store: n.store, logs: s.logs, onPlay: r.play, onPlayMix: r.onMix });
    case "player":
      return /* @__PURE__ */ l(_n, { player: n.player, snap: n.snap, still: a, favorite: o.on, onToggle: n.toggle, onFavorite: o.toggle });
    case "crew":
      return /* @__PURE__ */ l(xn, { crew: i, burnout: n.snap.burnout });
    case "settings":
      return /* @__PURE__ */ l(
        Gn,
        {
          gentle: s.profile.extraGentle,
          reduceMotion: n.userReduced,
          onGentle: (d) => s.setProfile({ ...s.profile, extraGentle: d }),
          onReduceMotion: n.setReduced,
          onStudio: r.onStudio,
          onForget: r.forget
        }
      );
    default:
      return /* @__PURE__ */ l(
        Hn,
        {
          profile: s.profile,
          week: s.week,
          progress: s.progress,
          reduced: a,
          hasHistory: s.logs.some((d) => ee(d.startedAt) < J()),
          crewConnected: i.enabled && i.status === "connected",
          last: c,
          onPlay: r.play,
          onOpenJourney: r.openJourney,
          onGo: r.go
        }
      );
  }
}
function qn() {
  const { player: e, store: t } = he(), [n, s] = k(() => e.snapshot()), [i, a] = k(Oe), [o, c] = k(!1), [r, d, y] = Ie(), w = z(null), L = z(i);
  T(() => (s(e.snapshot()), e.subscribe(s)), [e]);
  const v = M(
    (A) => {
      L.current ? A() : (w.current = A, c(!0));
    },
    []
  ), S = M(() => {
    Pe(He, !0), L.current = !0, a(!0), c(!1);
    const A = w.current;
    w.current = null, A == null || A();
  }, []), p = M(() => {
    w.current = null, c(!1);
  }, []), b = M(
    (A, E) => v(() => {
      e.setQueue([A]), e.playTemplate(A).then((D) => {
        D && E !== null && e.startTimer({ kind: "countdown", minutes: E });
      });
    }),
    [e, v]
  ), R = M(() => {
    e.snapshot().playing ? e.stop() : v(() => void e.play());
  }, [e, v]);
  return { player: e, store: t, snap: n, accepted: i, gate: o, reduced: r, setReduced: d, userReduced: y, guarded: v, accept: S, cancelGate: p, playTemplate: b, toggle: R };
}
function Wn(e, t) {
  const [n, s] = k("standalone"), [i, a] = k(() => je());
  return T(() => Fe(a), []), T(() => {
    const o = new Be({
      ...t !== void 0 ? { create: t } : {},
      onStatus: (c) => {
        s(c), c === "standalone" && e.crewLost();
      },
      onState: (c) => e.applyCrew(c)
    });
    return o.start(), () => o.stop();
  }, [e, t]), { enabled: i, status: n };
}
const V = 500, U = { v: 1, items: [] };
function Kn(e, t) {
  if (!ie(e) || j(e, "v") !== 1) return U;
  const n = j(e, "items");
  if (!Array.isArray(n)) return U;
  const s = [], i = /* @__PURE__ */ new Set();
  for (const a of n.slice(0, V * 2)) {
    if (!ie(a)) continue;
    const o = j(a, "kind"), c = fe(j(a, "id"));
    if (o !== "template" && o !== "mix" || c === null) continue;
    const r = `${o}:${c}`;
    if (!i.has(r) && (i.add(r), s.push({ kind: o, id: c, at: _e(j(a, "at"), 0, t + 864e5, t) }), s.length >= V))
      break;
  }
  return { v: 1, items: s };
}
function Te(e, t, n) {
  return e.items.some((s) => s.kind === t && s.id === n);
}
function Yn(e, t, n, s) {
  return Te(e, t, n) ? { v: 1, items: e.items.filter((i) => !(i.kind === t && i.id === n)) } : fe(n) === null || e.items.length >= V ? e : { v: 1, items: [{ kind: t, id: n, at: s }, ...e.items] };
}
function Jn(e, t) {
  const [n, s] = k(U);
  T(() => {
    let a = !0;
    return e.getRecord("favorites").then((o) => a && s(Kn(o, Date.now()))).catch(() => {
    }), () => {
      a = !1;
    };
  }, [e]);
  const i = M(() => {
    if (t === null) return;
    const a = Yn(n, "template", t, Date.now());
    s(a), e.setRecord("favorites", a).catch(() => {
    });
  }, [n, t, e]);
  return { on: t !== null && Te(n, "template", t), toggle: i };
}
const Vn = C(() => import("./chunk-Onboarding-158C0F1h.mjs").then((e) => ({ default: e.Onboarding }))), Un = (e) => Math.max(180, e * 60 * 0.8);
function Zn({ engine: e, clock: t, store: n, bridgeCreate: s, onStudio: i }) {
  const a = qn(), o = En(a.store, a.snap.playing), c = Wn(a.player, s), [r, d] = k("today"), [y, w] = k(null), L = z(null), v = Jn(a.store, a.snap.templateId), S = o.profile.createdAt === 0, p = es(o.storage), b = kn(a.snap, !S), R = a.reduced || o.profile.extraGentle, A = M((N) => d(N), []), { play: E, playDay: D, finish: Ce } = Qn({ s: a, data: o, last: p, end: b, active: L, setView: d });
  ns(a.snap.playing, a.snap.elapsedSec, L, o.progress, o.setJourney);
  const Re = (N) => {
    w(N), d("journey");
  }, ze = () => {
    fn(o.storage), o.setProfile(ke), d("today");
  };
  return /* @__PURE__ */ g("div", { className: "c-app", "data-theme": "auto", "data-motion": R ? "off" : "on", "data-playing": a.snap.playing ? "true" : "false", children: [
    /* @__PURE__ */ l(ts, { onStudio: i }),
    /* @__PURE__ */ l("main", { id: "c-main", className: "c-main", tabIndex: -1, children: /* @__PURE__ */ l(pe, { fallback: /* @__PURE__ */ l("p", { className: "c-loading", role: "status", children: m.loading }), children: S ? /* @__PURE__ */ l(
      Vn,
      {
        playing: a.snap.playing,
        reduced: R,
        initial: o.profile,
        onAccept: a.accept,
        onPreview: (N) => a.playTemplate(N, null),
        onStop: () => void a.player.stop(),
        onFinish: Ce
      }
    ) : /* @__PURE__ */ l(
      $n,
      {
        view: r,
        journeyId: y,
        s: a,
        data: o,
        crewInfo: c,
        still: R,
        fav: v,
        last: p.template,
        handlers: { go: A, play: E, playDay: D, openJourney: Re, forget: ze, onStudio: i, onMix: (N) => a.guarded(() => a.player.playMix(N)) }
      }
    ) }) }),
    !S && r !== "player" && /* @__PURE__ */ l(Gt, { snap: a.snap, onOpen: () => A("player"), onStop: () => void a.player.stop() }),
    !S && /* @__PURE__ */ l(xt, { view: r, onGo: A }),
    /* @__PURE__ */ l("p", { className: "c-sr", role: "status", "data-testid": "play-status", children: a.snap.playing ? `Playing. ${m.volumeCapped}` : "Stopped." }),
    b.card !== null && !a.snap.playing && /* @__PURE__ */ l(Sn, { info: b.card, onAgain: () => {
      var N;
      return Xn(((N = b.card) == null ? void 0 : N.id) ?? null, E);
    }, onClose: b.dismiss }),
    a.gate && /* @__PURE__ */ l(An, { onAccept: a.accept, onCancel: a.cancelGate })
  ] });
}
function Qn({ s: e, data: t, last: n, end: s, active: i, setView: a }) {
  const o = M(
    (d, y = d.recommendedMinutes) => {
      i.current = null, n.remember(d.id), s.dismiss(), e.playTemplate(d, y), a("player");
    },
    [e, n, s, i, a]
  );
  return { play: o, playDay: (d, y, w) => {
    o(w), i.current = { id: d, no: y, needSec: Un(w.recommendedMinutes) };
  }, finish: (d, y) => {
    if (t.setProfile(d), !e.snap.playing || e.snap.templateId !== y.id) return o(y);
    n.remember(y.id), e.player.startTimer({ kind: "countdown", minutes: y.recommendedMinutes }), a("player");
  } };
}
const Ee = (e) => e === null ? null : P().find((t) => t.id === e) ?? null;
function Xn(e, t) {
  const n = Ee(e);
  n !== null && t(n);
}
function es(e) {
  const [t, n] = k(() => gn(e)), s = H(() => Ee(t), [t]), i = M(
    (a) => {
      bn(e, a), n(a);
    },
    [e]
  );
  return H(() => ({ template: s, remember: i }), [s, i]);
}
function ts({ onStudio: e }) {
  return /* @__PURE__ */ g(De, { children: [
    /* @__PURE__ */ l("a", { className: "c-skip", href: "#c-main", children: "Skip to content" }),
    /* @__PURE__ */ g("header", { className: "c-topbar", children: [
      /* @__PURE__ */ l("span", { className: "c-brand", children: m.brand }),
      /* @__PURE__ */ l("button", { type: "button", className: "c-chip-btn", "data-testid": "studio-top", "aria-pressed": "false", onClick: e, children: m.studio })
    ] })
  ] });
}
function ns(e, t, n, s, i) {
  T(() => {
    const a = n.current, o = a === null ? void 0 : s[a.id];
    !e || a === null || o === void 0 || t < a.needSec || (n.current = null, o.doneDays.includes(a.no) || i(a.id, { ...o, doneDays: [...o.doneDays, a.no].sort((c, r) => c - r) }));
  }, [e, t, n, s, i]);
}
const ss = "zonked.css";
function as(e) {
  const t = new URL(ss, e).href;
  if ([...document.querySelectorAll("link[data-zonked-css]")].some((i) => i.getAttribute("href") === t)) return;
  const s = document.createElement("link");
  s.rel = "stylesheet", s.href = t, s.setAttribute("data-zonked-css", "1"), document.head.appendChild(s);
}
const is = {
  position: "fixed",
  left: 12,
  right: 12,
  bottom: 84,
  zIndex: 70,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(30,30,40,0.92)",
  color: "#fff",
  fontSize: 14,
  textAlign: "center"
};
function hs() {
  as(import.meta.url), xe();
  const { engine: e, store: t } = he(), [n, s] = k(!1);
  return /* @__PURE__ */ g("div", { "data-testid": "zonked-app", style: { height: "100%", minHeight: 0, overflow: "hidden", position: "relative", transform: "translateZ(0)" }, children: [
    /* @__PURE__ */ l("div", { style: { height: "100%", overflowY: "auto" }, children: /* @__PURE__ */ l(Zn, { engine: e, store: t, onStudio: () => s(!0) }) }),
    n && /* @__PURE__ */ l("p", { role: "status", style: is, "data-testid": "studio-note", onClick: () => s(!1), children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close." })
  ] });
}
export {
  m as C,
  ke as D,
  ms as E,
  ds as F,
  Ft as G,
  X as J,
  U as N,
  An as S,
  cs as T,
  hs as Z,
  $t as a,
  qt as b,
  us as c,
  Wt as d,
  P as e,
  Kn as f,
  ps as g,
  vt as h,
  jt as i,
  Xt as p,
  Ht as r
};
