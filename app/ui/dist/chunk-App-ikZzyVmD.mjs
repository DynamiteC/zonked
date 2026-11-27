import { jsx as l, jsxs as b, Fragment as rt } from "react/jsx-runtime";
import { lazy as D, Suspense as Ie, useRef as C, useState as S, useEffect as T, useCallback as k, useMemo as H } from "react";
import { C as h, g as lt, G as ct, a as Pe, i as ut, u as dt, w as mt, S as ht, b as pt, o as ft, B as gt, c as ve, f as B, d as _e, n as yt, e as bt, h as vt, s as we } from "./chunk-crewLink-Br6qeo5M.mjs";
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
const y = (e, t) => e[(t % e.length + e.length) % e.length], wt = [98, 110, 123.5, 87.3, 103.8, 130.8], kt = [196, 220, 247, 175, 165, 262], St = {
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
}, Mt = (e) => [...e].reduce((t, n) => (t * 31 + n.charCodeAt(0)) % 9973, 7);
function At(e, t, n) {
  const a = Mt(e) + n;
  return { prog: y(St[t], a), key: y(wt, a), pianoRoot: y(kt, a >> 1) };
}
function Nt(e, t, n) {
  const a = e === "dreamy" || e === "ethereal" || e === "calm";
  return {
    breathDepth: y([0.45, 0.4, 0.3, 0.2, 0.1], t - 1),
    breathRateHz: 0.06 + 0.02 * (n % 5),
    stereoWidth: 0.3 + 0.1 * (n % 4),
    panDepth: a ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (n % 4)
  };
}
const Lt = {
  lofi: (e, t) => ({
    lofiLevel: 0.45,
    lofiWarmth: y([0.5, 0.6, 0.7], e),
    lofiProgression: t.prog,
    tapeWow: y([0.25, 0.35, 0.45], e),
    padRootHz: t.key
  }),
  piano: (e, t) => ({
    instLevel: 0.35,
    instKind: 3,
    instRootHz: t.pianoRoot,
    instScale: y([2, 0, 1, 4, 3], e),
    instBpm: y([40, 46, 52], e),
    pianoPedal: y([0.4, 0.55, 0.7], e)
  }),
  crackle: () => ({ crackle: 0.12 }),
  drone: (e) => ({ instLevel: 0.35, instKind: 1, instRootHz: y([55, 62, 73, 82], e), instScale: 7, instBpm: 40 }),
  pluck: (e) => ({
    instLevel: 0.3,
    instKind: 0,
    instRootHz: y([196, 220, 247, 262], e),
    instScale: y([0, 2, 4, 1], e),
    instBpm: y([48, 56, 64, 72], e)
  }),
  bell: (e) => ({
    instLevel: 0.28,
    instKind: 2,
    instRootHz: y([262, 294, 330, 349], e),
    instScale: 4,
    instBpm: 40
  }),
  pad: (e, t) => ({ padLevel: 0.4, padChord: y([0, 2, 4, 6], e), padRootHz: t.key }),
  chimes: (e) => ({ chimeLevel: 0.25, chimeRatePerMin: y([3, 4, 6, 8], e) }),
  perc: (e) => ({
    percLevel: 0.2,
    percBpm: y([64, 72, 80, 92], e),
    percPattern: y([0, 3, 4, 7], e)
  })
};
function Et(e, t, n = { prog: 0, key: 110, pianoRoot: 220 }) {
  return e.reduce((a, s) => ({ ...a, ...Lt[s](t, n) }), {});
}
const ke = (e) => Math.round(e * 1e3) / 1e3, Z = (e) => Math.min(40, Math.max(0.5, e));
function Ot(e, t, n, a, s) {
  const i = Math.min(5, Math.max(1, t * 0.15));
  if (e === "plateau") {
    const r = [{ t: 0, beat: n, ramp: !0 }, { t: i, beat: a, ramp: s !== void 0 }];
    return s !== void 0 && r.push({ t: t - i, beat: a, ramp: !0 }, { t, beat: s, ramp: !1 }), r;
  }
  if (e === "ramp-down" || e === "ramp-up")
    return [{ t: 0, beat: n, ramp: !0 }, { t: t * 0.7, beat: a, ramp: !1 }];
  if (e === "wave")
    return Array.from({ length: 7 }, (r, c) => ({ t: t * c / 6, beat: c % 2 === 0 ? n : a, ramp: c < 6 }));
  const o = t / 4;
  return Array.from({ length: 4 }, (r, c) => {
    const m = n + (a - n) * c / 3;
    return c < 3 ? [{ t: c * o, beat: m, ramp: !1 }, { t: c * o + o * 0.75, beat: m, ramp: !0 }] : [{ t: c * o, beat: m, ramp: !1 }];
  }).flat();
}
function Tt(e, t, n, a, s) {
  const i = (t % 3 - 1) * e.jitter, o = Z(e.to + i), r = y(e.noises, t >> 1), c = y(e.layers, t * 2 + (t >> 1)), m = y(e.vibes, t), p = Et(c, t, At(e.slug, m, t)), f = Object.keys(p).length > 0, w = f ? { ...p, ...Nt(m, e.intensity, t) } : p;
  return Ot(e.shape, n, Z(e.from), o, e.ret).map((A) => ({
    atMin: ke(A.t),
    beatHz: ke(Z(A.beat)),
    carrierHz: a,
    gain: e.gain,
    mode: s,
    noise: r[0],
    noiseLevel: r[1],
    ...f ? { layers: w } : {},
    ramp: A.ramp
  }));
}
function oe(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    t.add(n.mode);
    const a = n.layers;
    n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), a !== void 0 && (((a.lofiLevel ?? 0) > 0 || (a.crackle ?? 0) > 0) && t.add("lofi"), (a.instLevel ?? 0) > 0 && t.add("instrument"), (a.padLevel ?? 0) > 0 && t.add("pad"), (a.chimeLevel ?? 0) > 0 && t.add("chimes"), (a.percLevel ?? 0) > 0 && t.add("percussion"));
  }
  return [...t];
}
function re(e, t) {
  if (t > 3) return !1;
  const n = e.every((i, o) => {
    var r;
    return o === 0 || Math.abs(i.beatHz - (((r = e[o - 1]) == null ? void 0 : r.beatHz) ?? i.beatHz)) <= 4;
  }), a = e.every((i) => i.mode === "isochronic" || i.beatHz >= 12 && i.beatHz <= 20), s = e.every((i) => {
    var o, r;
    return (((o = i.layers) == null ? void 0 : o.crackle) ?? 0) === 0 && (((r = i.layers) == null ? void 0 : r.percBpm) ?? 0) <= 100;
  });
  return n && a && s;
}
function zt(e, t) {
  const n = e.adjectives.length, a = t * 7 % (n * e.nouns.length);
  return `${y(e.adjectives, a)} ${y(e.nouns, Math.floor(a / n))}`;
}
const Rt = (e) => String(e).padStart(2, "0");
function Dt(e, t, n, a) {
  const s = y(t.mins, n), i = y(t.carriers, n * 3 + 1), o = y(t.modes, n + (n >> 2)), r = Tt(t, n, s, i, o), c = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
  return {
    id: `${e.prefix}-${t.slug}-${Rt(n + 1)}`,
    name: zt(e, a),
    category: e.category,
    vibe: y(t.vibes, n),
    tags: [t.slug, c, o, ...t.tags],
    layerTags: oe(r),
    situations: t.situations,
    recommendedMinutes: s,
    intensity: t.intensity,
    adhdFriendly: re(r, t.intensity),
    stages: r,
    reasonTemplate: t.reason,
    source: "original",
    ...t.breath !== void 0 ? { breath: t.breath } : {}
  };
}
function Ct(e) {
  let t = 0;
  return e.archs.flatMap((n) => Array.from({ length: n.count }, (a, s) => Dt(e, n, s, t++)));
}
const It = {
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
}, Pt = {
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
}, _t = {
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
}, jt = {
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
}, Ht = {
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
}, Ft = {
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
}, Bt = {
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
}, xt = {
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
}, G = (e) => Math.round(e * 1e3) / 1e3, K = (e) => Math.min(40, Math.max(0.5, e)), je = (e) => e.segs.reduce((t, n) => t + n[0], 0) * (e.scale ?? 1);
function Se(e, t) {
  const n = e.carrier ?? 200;
  return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(je(e), 1));
}
function $t(e) {
  const t = [], [n, a] = e.noise ?? ["off", 0];
  let s = 0;
  return e.segs.forEach((i, o) => {
    const r = i[1] !== i[2], c = e.segs[o + 1];
    t.push({
      atMin: G(s / 60),
      beatHz: G(K(i[1])),
      carrierHz: Se(e, s),
      gain: e.gain ?? 0.5,
      mode: e.mode ?? "binaural",
      noise: n,
      noiseLevel: a,
      ramp: r
    }), s += i[0] * (e.scale ?? 1), r && (c === void 0 || K(c[1]) !== K(i[2])) && t.push({ ...t[t.length - 1], atMin: G(s / 60), beatHz: G(K(i[2])), carrierHz: Se(e, s), ramp: !1 });
  }), t;
}
function Gt(e) {
  const t = $t(e);
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    vibe: e.vibe,
    tags: [...e.tags, e.source],
    layerTags: oe(t),
    situations: e.situations,
    recommendedMinutes: Math.max(1, Math.round(je(e) / 60)),
    intensity: e.intensity,
    adhdFriendly: re(t, e.intensity),
    stages: t,
    reasonTemplate: e.reason,
    source: e.source
  };
}
const q = ["white", 0.3], te = ["pink", 0.3], ne = ["brown", 0.3], Me = [
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
], Kt = [
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
], qt = [
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
], Wt = [
  [333, 8, 8],
  [333, 8, 10],
  [333, 10, 12],
  [333, 12, 12],
  [333, 12, 10],
  [333, 10, 8],
  [333, 8, 10]
], Yt = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, () => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10]
], v = (e) => ({ ...e, source: "android", carrier: 200 }), Jt = [
  v({
    id: "android-self-hypnosis",
    name: "Mind Bridge",
    category: "meditation",
    vibe: "deep",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: q,
    tags: ["theta", "hypnosis"],
    reason: "Five minutes down to 4 Hz, ten minutes holding there, five minutes back up."
  }),
  v({
    id: "android-highest-mental-activity",
    name: "Spark Burst",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: [[120, 12, 40], [600, 40, 40], [120, 40, 12]],
    noise: q,
    tags: ["gamma", "boost"],
    reason: "Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz."
  }),
  v({
    id: "android-unity",
    name: "Unity Delta",
    category: "meditation",
    vibe: "ethereal",
    situations: ["meditate", "cant-sleep"],
    intensity: 1,
    segs: [[3600, 3.7, 3.7]],
    noise: ne,
    gain: 0.45,
    tags: ["delta", "long"],
    reason: "A flat 3.7 Hz hour under brown noise for a wide, quiet mind."
  }),
  v({
    id: "android-morphine",
    name: "Morphine Ease",
    category: "healing",
    vibe: "warm",
    situations: ["heal-stress"],
    intensity: 2,
    segs: [[3600, 10, 10]],
    noise: te,
    tags: ["alpha", "pain"],
    reason: "An hour at a steady 10 Hz under pink noise to loosen the body."
  }),
  v({
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
  v({
    id: "android-creativity",
    name: "Creative Waves",
    category: "vibes",
    vibe: "bright",
    situations: ["quick-reset", "deep-work"],
    intensity: 2,
    segs: qt,
    noise: ["white", 0.4],
    tags: ["alpha", "theta", "creative"],
    reason: "Twenty minutes that drift back and forth between 10 and 6 Hz for loose ideas."
  }),
  v({
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
  v({
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
  v({
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
  v({
    id: "android-interval-pulse",
    name: "Interval Pulse",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: Yt,
    tags: ["beta", "gamma", "interval"],
    reason: "Eight short high and low rounds between a warm up and a cool down."
  }),
  v({
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
  v({
    id: "android-sleep-induction",
    name: "Drift Down",
    category: "sleep",
    vibe: "calm",
    situations: ["cant-sleep"],
    intensity: 1,
    segs: [[360, 9.7, 3.4], [1620, 3.4, 2.4], [1620, 2.4, 3.4]],
    noise: ne,
    gain: 0.5,
    tags: ["delta", "induction"],
    reason: "A six minute fall to delta, then a long gentle rise and dip for the rest of the hour."
  }),
  v({
    id: "android-lucid-dreams",
    name: "Lucid Dream Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream"],
    intensity: 2,
    segs: Me,
    gain: 0.5,
    tags: ["theta", "lucid"],
    reason: "A theta bed with brief alpha lifts and a soft ending."
  }),
  v({
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
  v({
    id: "android-smr-sleep",
    name: "SMR Sleep Weave",
    category: "sleep",
    vibe: "minimal",
    situations: ["cant-sleep", "heal-stress"],
    intensity: 2,
    segs: Wt,
    tags: ["alpha", "smr"],
    reason: "Forty minutes of beats crossing between alpha and the low SMR band."
  }),
  v({
    id: "android-lucid-dreams-2",
    name: "Long Lucid Night",
    category: "lucid-dreams",
    vibe: "deep",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...Kt],
    noise: te,
    gain: 0.5,
    tags: ["delta", "theta", "lucid"],
    reason: "A delta fall followed by a long night plan with timed theta pulses."
  }),
  v({
    id: "android-adhd-cycle",
    name: "Focus Cycle",
    category: "adhd-control",
    vibe: "energized",
    situations: ["adhd-focus", "deep-work"],
    intensity: 3,
    segs: [[300, 40, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20]],
    noise: q,
    tags: ["beta", "cycle"],
    reason: "Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener."
  }),
  // Shortened variants of existing Android programs.
  v({
    id: "android-self-hypnosis-short",
    name: "Quick Mind Bridge",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: q,
    scale: 0.5,
    tags: ["theta", "short"],
    reason: "The Mind Bridge shape squeezed into ten minutes."
  }),
  v({
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
  v({
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
  v({
    id: "android-lucid-dreams-short",
    name: "Lucid Nap Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: Me.slice(0, 12),
    gain: 0.5,
    tags: ["theta", "lucid", "short"],
    reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
  })
], X = (e) => ({ ...e, source: "gnaural" }), Ut = [
  X({
    id: "gnaural-power-nap",
    name: "Midday Nap",
    category: "sleep",
    vibe: "warm",
    situations: ["quick-reset", "cant-sleep", "ai-burnout"],
    intensity: 1,
    segs: [[13, 11, 8.8], [17, 8.8, 7], [29, 7, 5.2], [38, 5.2, 4.4], [50, 4.4, 4.2], [68, 4.2, 4], [877, 4, 4], [37, 4, 4.2], [32, 4.2, 5.1], [20, 5.1, 6.8], [15, 6.8, 9.8], [4, 9.8, 9.8]],
    carrier: 164,
    carrierEnd: 110,
    noise: te,
    gain: 0.5,
    tags: ["delta", "nap", "schedule"],
    reason: "A fast fall to 4 Hz, a long hold, then a slow climb. Twenty minutes in all."
  }),
  X({
    id: "gnaural-airplane-aid",
    name: "Long Haul Calm",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset", "heal-stress"],
    intensity: 1,
    segs: [[9, 0.5, 12], [45, 12, 8], [60, 8, 6], [120, 6, 5], [180, 5, 4.3], [180, 4.3, 4], [900, 4, 4], [900, 4, 4.2], [900, 4.2, 3.9], [900, 3.9, 3.9], [400, 3.9, 4.3]],
    carrier: 280,
    carrierEnd: 140,
    noise: ne,
    gain: 0.5,
    tags: ["theta", "travel", "schedule"],
    reason: "A falling carrier tone over theta beats, built for long seated trips."
  }),
  X({
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
function Vt() {
  return [...Jt, ...Ut].map(Gt);
}
const Zt = [
  { id: "lofi", name: "Lo-fi", blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.", mood: "warm", defaultLevel: 0.5, layerKeys: ["lofiLevel", "lofiProgression", "tapeWow", "crackle"], templateId: "starter-lofi", evidence: "preference" },
  { id: "piano", name: "Soft piano", blurb: "A soft piano playing gentle, slow phrases with long ringing notes.", mood: "calm", defaultLevel: 0.45, layerKeys: ["instLevel", "instKind", "pianoPedal"], templateId: "starter-piano", evidence: "preference" },
  { id: "violet", name: "Violet hiss", blurb: "A thin, bright hiss, like gentle static. Keep it quiet.", mood: "bright", defaultLevel: 0.3, layerKeys: [], templateId: "starter-violet", evidence: "limited" },
  { id: "rain", name: "Rain hush", blurb: "A steady rain-like hush, even across the pitches (pink noise).", mood: "calm", defaultLevel: 0.4, layerKeys: [], templateId: "starter-rain", evidence: "mixed" },
  { id: "deep", name: "Deep rumble", blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).", mood: "deep", defaultLevel: 0.4, layerKeys: [], templateId: "starter-deep", evidence: "preference" },
  { id: "chimes", name: "Soft chimes", blurb: "Soft bells that ring now and then at uneven gaps.", mood: "dreamy", defaultLevel: 0.3, layerKeys: ["chimeLevel", "chimeRatePerMin"], templateId: "starter-chimes", evidence: "preference" },
  { id: "beats", name: "Beats only", blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.", mood: "neutral", defaultLevel: 0, layerKeys: [], templateId: "starter-beats", evidence: "mixed" }
], Xt = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function Qt(e, t) {
  const n = Xt(t);
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
const en = { warm: "warm", calm: "calm", bright: "bright", deep: "deep", dreamy: "dreamy", neutral: "minimal" };
function tn(e) {
  const t = Qt(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, s = [{
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
    vibe: en[e.mood] ?? "calm",
    tags: ["starter", "sound-first", e.id],
    layerTags: oe(s),
    situations: ["quick-reset", "heal-stress"],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: re(s, 1),
    stages: s,
    reasonTemplate: e.blurb,
    source: "original"
  };
}
function nn() {
  return Zt.map(tn);
}
function an() {
  return [
    ...nn(),
    ...Vt(),
    ...[Bt, _t, jt, Ht, Ft, It, Pt, xt].flatMap(Ct)
  ];
}
let Ae;
function j() {
  return Ae ?? (Ae = an()), Ae;
}
new Proxy([], {
  get: (e, t) => Reflect.get(j(), t),
  has: (e, t) => Reflect.has(j(), t),
  ownKeys: () => Reflect.ownKeys(j()),
  getOwnPropertyDescriptor: (e, t) => {
    const n = Reflect.getOwnPropertyDescriptor(j(), t);
    return n === void 0 || t === "length" ? n : { ...n, configurable: !0 };
  }
});
function sn(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.percLevel) ?? 0) > 0;
  });
}
function on(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.crackle) ?? 0) > 0;
  });
}
function Ne(e) {
  return e.stages.some((t) => t.mode === "binaural");
}
const rn = {
  focus: [1, 1, 0.5, 0.1],
  "adhd-control": [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  "work-recovery": [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  "lucid-dreams": [0, 0.1, 0.6, 1]
}, ln = { morning: 0, afternoon: 1, evening: 2, night: 3 }, cn = (e) => Math.round(e * 10) / 10;
function un(e, t, n) {
  const a = Math.max(1, t);
  if (e <= a)
    return n.push(`Fits your ${a} minutes (${e} min).`), 15 * (0.6 + 0.4 * (e / a));
  const s = (e - a) / a;
  return n.push(`Runs ${e} min, longer than your ${a}; you can stop any time.`), Math.max(0, 15 * (1 - s * 1.5)) - (s > 0.5 ? 5 : 0);
}
function dn(e, t, n) {
  return t.deviceType === "speaker" ? Ne(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), Ne(e) ? 10 : 8);
}
function mn(e, t, n) {
  const a = e.intensity > 3 || sn(e) || on(e), s = t.sensorySensitivity;
  return s === "low" ? { pts: 10, sensitive: !1 } : s === "medium" ? { pts: e.intensity <= 3 ? a ? 7 : 10 : 4, sensitive: !1 } : a ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), { pts: 0, sensitive: !0 }) : (n.push("Gentle: low intensity, no percussion or crackle."), { pts: e.intensity <= 2 ? 10 : 7, sensitive: !1 });
}
function hn(e, t) {
  const n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], a = e.situations.includes(t.situation);
  let s = 0;
  a ? (s += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? s += 7 : t.vibe === e.vibe && (s += 15, n.push(`Matches your ${t.vibe} vibe.`)), s += un(e.recommendedMinutes, t.availableMinutes, n);
  const i = (rn[e.category][ln[t.timeOfDay]] ?? 0) * 10;
  s += i, i >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (s -= 5), s += dn(e, t, n);
  const o = mn(e, t, n);
  return s += o.pts, { template: e, score: Math.max(0, cn(s)), reasons: n, sensitive: o.sensitive, onSituation: a };
}
const pn = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : e.template.id > t.template.id ? 1 : 0);
function fn(e, t = 5, n = j()) {
  const a = Math.max(1, Math.floor(t)), s = n.map((c) => hn(c, e)).sort(pn), i = [
    s.filter((c) => c.onSituation && !c.sensitive),
    s.filter((c) => !c.sensitive),
    s
  ], o = i.find((c) => c.length >= a) ?? s, r = o.slice(0, a);
  return o !== i[0] && r.forEach((c) => {
    c.onSituation || c.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
  }), r.map((c) => ({ template: c.template, score: c.score, reasons: c.reasons }));
}
function gn(e) {
  const t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), a = Math.floor(n / 60), s = (i) => String(i).padStart(2, "0");
  return a > 0 ? `${a}:${s(n % 60)}:${s(t % 60)}` : `${s(n)}:${s(t % 60)}`;
}
const Le = {
  today: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  journeys: "M5 19c0-6 14-4 14-14M5 19a1.5 1.5 0 1 0 0-.01M19 5a1.5 1.5 0 1 0 0-.01",
  library: "M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.6 13.2-3-.8",
  crew: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c0-3 3-5 6-5s6 2 6 5M16 11a2.5 2.5 0 1 0 0-5M17 14c2 .3 4 1.6 4 5",
  settings: "M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4",
  target: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  wave: "M3 12c3-6 6-6 9 0s6 6 9 0",
  leaf: "M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19c3-4 6-7 10-9",
  heart: "M12 20S4 15 4 9.5A4 4 0 0 1 12 8a4 4 0 0 1 8 1.5C20 15 12 20 12 20Z",
  moon: "M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10Z",
  cloud: "M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 9a4.5 4.5 0 0 1 0 9Z",
  lotus: "M12 5c3 3 3 9 0 13-3-4-3-10 0-13ZM4 10c4 0 7 3 8 8M20 10c-4 0-7 3-8 8",
  bolt: "M13 3 5 13h6l-1 8 8-10h-6Z",
  rain: "M7 14a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 5a4.5 4.5 0 0 1 0 9ZM8 17v3M12 17v3M16 17v3",
  stream: "M3 8c3-3 6 3 9 0s6 3 9 0M3 14c3-3 6 3 9 0s6 3 9 0",
  ocean: "M3 16c3-5 6-5 9 0 3-5 6-5 9 0M3 20h18M12 6v3",
  rapids: "M4 7c4-2 6 2 10 0M4 12c4-2 6 2 10 0M4 17c4-2 6 2 10 0M18 6l2 2-2 2",
  forest: "M12 3 6 12h4l-4 6h12l-4-6h4ZM12 18v3",
  birds: "M3 11c3-3 6-3 9 1 3-4 6-4 9-1M8 16l2 3M16 16l-2 3",
  breeze: "M3 9h10a3 3 0 1 0-3-3M3 14h14a3 3 0 1 1-3 3M3 19h6",
  check: "M5 12.5l4.5 4.5L19 7",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 14l2 2 4-4"
};
function He({ name: e, size: t = 22 }) {
  return /* @__PURE__ */ l("svg", { className: "c-icon", width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ l("path", { d: Le[e] ?? Le.wave }) });
}
const yn = D(() => import("./chunk-mascot-BnpJf37G.mjs").then((e) => ({ default: e.CalmMascot })));
function le({ size: e, mood: t = "idle", reduced: n }) {
  return /* @__PURE__ */ l(Ie, { fallback: /* @__PURE__ */ l("span", { className: "c-mascot-gap", style: { width: e, height: e } }), children: /* @__PURE__ */ l(yn, { mood: t, size: e, reducedMotion: n }) });
}
function hs({ title: e, reduced: t }) {
  return /* @__PURE__ */ b("header", { className: "c-pagehead", children: [
    /* @__PURE__ */ l(le, { size: 72, reduced: t }),
    /* @__PURE__ */ l("h1", { className: "c-h1", children: e })
  ] });
}
const bn = [
  { view: "today", label: h.nav[0], icon: "today" },
  { view: "library", label: h.nav[1], icon: "library" },
  { view: "crew", label: h.nav[2], icon: "crew" },
  { view: "settings", label: h.nav[3], icon: "settings" }
];
function vn({ view: e, onGo: t, reduced: n = !1 }) {
  const a = e === "journey" || e === "journeys" ? "today" : e === "nature" ? "library" : e;
  return /* @__PURE__ */ b("nav", { className: "c-tabbar", "aria-label": "Main", children: [
    /* @__PURE__ */ b("div", { className: "c-rail-brand", "aria-hidden": "true", children: [
      /* @__PURE__ */ l(le, { size: 40, reduced: n }),
      /* @__PURE__ */ l("span", { className: "c-brand", children: h.brand })
    ] }),
    bn.map((s) => /* @__PURE__ */ b("button", { type: "button", className: "c-nav", "aria-current": a === s.view ? "page" : void 0, onClick: () => t(s.view), children: [
      /* @__PURE__ */ l(He, { name: s.icon }),
      /* @__PURE__ */ l("span", { children: s.label })
    ] }, s.view))
  ] });
}
function wn({ snap: e, onOpen: t, onStop: n }) {
  if (!e.playing) return null;
  const a = e.timer.kind !== "none" && e.timer.running ? ` ${gn(e.timer.remainingSec)}` : "";
  return /* @__PURE__ */ b("div", { className: "c-mini", role: "group", "aria-label": "Now playing", children: [
    /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-link c-mini-open", onClick: t, children: `${e.templateName ?? h.brand}${a}` }),
    /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-small", "data-testid": "mini-stop", onClick: n, children: h.stop })
  ] });
}
const kn = ["focus", "calm", "sleep", "study", "recover", "curious"], Sn = ["morning", "afternoon", "evening", "night", "anytime"], Mn = ["headphones", "speakers", "bluetooth", "unsure"], An = {
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
}, Nn = Object.freeze({ kind: "rest", family: "", variants: Object.freeze([]) });
function Ln(e) {
  const t = An[e] ?? 0, n = [];
  for (let a = 1; a <= t; a += 1) n.push(`${e}-${String(a).padStart(2, "0")}`);
  return Object.freeze(n);
}
function En(e) {
  return Object.freeze({ kind: "session", family: e, variants: Ln(e) });
}
function P(...e) {
  return Object.freeze(e.map((t) => t === "rest" ? Nn : En(t)));
}
const Q = (e, t) => Array.from({ length: t }, () => e), _ = (e) => Object.freeze(e), ce = Object.freeze([
  _({
    id: "calm-evenings",
    title: "7 Calm Evenings",
    blurb: "7 short evenings of slow sound. About 20 minutes each.",
    situation: "heal-stress",
    vibe: "calm",
    minutes: 20,
    days: P(
      "healing-soothe-glide",
      "meditation-breath-pacer",
      "vibe-warm-glow",
      "rest",
      "meditation-alpha-sit",
      "recovery-lofi-unwind",
      "healing-soothe-glide"
    )
  }),
  _({
    id: "focus-mornings",
    title: "5 Focus Mornings",
    blurb: "5 mornings of steady sound to start work. About 30 minutes each.",
    situation: "deep-work",
    vibe: "bright",
    minutes: 30,
    days: P("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
  }),
  _({
    id: "easier-sleep",
    title: "14 Nights of Wind-Down Sound",
    blurb: "14 nights of slow sound for winding down. Rest nights included.",
    situation: "cant-sleep",
    vibe: "dreamy",
    minutes: 45,
    days: P(
      ...Q("sleep-drift-theta", 4),
      "rest",
      ...Q("sleep-onset-delta", 4),
      "rest",
      ...Q("sleep-deep-delta", 3),
      "sleep-onset-delta"
    )
  }),
  _({
    id: "study-sprint",
    title: "Study Sprint Week",
    blurb: "A week of short study blocks with breaks. About 25 minutes each.",
    situation: "deep-work",
    vibe: "minimal",
    minutes: 25,
    days: P(
      "focus-sprint-pulse",
      "focus-alpha-beta",
      "recovery-micro-break",
      "focus-sprint-pulse",
      "rest",
      "focus-alpha-beta",
      "meditation-alpha-sit"
    )
  }),
  _({
    id: "after-work-reset",
    title: "After-Work Reset",
    blurb: "5 evenings to step out of work mode. About 20 minutes each.",
    situation: "ai-burnout",
    vibe: "warm",
    minutes: 20,
    days: P("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
  }),
  _({
    id: "gentle-routine",
    title: "Gentle Routine",
    blurb: "Gentle routine for steady attention. About 25 minutes each.",
    situation: "adhd-focus",
    vibe: "grounded",
    minutes: 25,
    days: P(
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
  return ce.find((t) => t.id === e);
}
const On = {
  focus: { situation: "deep-work", vibe: "bright", minutes: 25 },
  calm: { situation: "heal-stress", vibe: "calm", minutes: 15 },
  sleep: { situation: "cant-sleep", vibe: "dreamy", minutes: 45 },
  study: { situation: "deep-work", vibe: "minimal", minutes: 30 },
  recover: { situation: "ai-burnout", vibe: "warm", minutes: 15 },
  curious: { situation: "quick-reset", minutes: 10 }
}, Tn = {
  headphones: "headphones",
  bluetooth: "bluetooth",
  speakers: "speaker",
  unsure: "headphones"
};
function zn(e) {
  return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function Rn(e, t = /* @__PURE__ */ new Date()) {
  const n = On[e.goal], a = e.timeOfDay === "anytime" ? zn(t.getHours()) : e.timeOfDay, s = {
    situation: n.situation,
    availableMinutes: n.minutes,
    timeOfDay: a,
    sensorySensitivity: e.extraGentle ? "high" : "medium",
    deviceType: Tn[e.device]
  };
  return Object.freeze(n.vibe === void 0 ? s : { ...s, vibe: n.vibe });
}
const Dn = 3, Cn = 864e5, Fe = 4;
function U(e) {
  if (!Number.isFinite(e)) return 0;
  const t = new Date(e).getTimezoneOffset() * 6e4;
  return Math.floor((e - t) / Cn);
}
const Be = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function In(e) {
  return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : Fe;
}
function Pn(e) {
  return e - (e + 3) % 7;
}
function _n(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const i of e) {
    if (!Be(i.day) || i.day < t || i.day > n) continue;
    const o = Number.isFinite(i.minutes) && i.minutes > 0 ? i.minutes : 0;
    a.set(i.day, (a.get(i.day) ?? 0) + o);
  }
  const s = /* @__PURE__ */ new Set();
  return a.forEach((i, o) => {
    i >= Dn && s.add(o);
  }), s;
}
function jn(e, t, n) {
  return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function Hn(e, t, n = Fe) {
  const a = In(n);
  if (!Be(t)) {
    const r = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
    return Object.freeze({ daysListened: 0, goalDays: a, goalMet: !1, quietWeek: !0, dots: r });
  }
  const s = Pn(t), i = _n(e, s, t), o = Object.freeze(Array.from({ length: 7 }, (r, c) => jn(s + c, t, i)));
  return Object.freeze({
    daysListened: i.size,
    goalDays: a,
    goalMet: i.size >= a,
    quietWeek: i.size === 0,
    dots: o
  });
}
const ue = "zonked.profile.v1", de = "zonked.journeys.v1", me = "zonked.last.v1", xe = 32 * 1024, $e = 1, Fn = 1e7, Bn = /^[a-z0-9-]{1,64}$/, Ge = Object.freeze({
  goal: "curious",
  timeOfDay: "anytime",
  device: "unsure",
  extraGentle: !1,
  createdAt: 0
}), xn = Object.freeze({}), he = (e) => typeof e == "object" && e !== null && !Array.isArray(e), ae = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, ee = (e, t) => e.some((n) => n === t);
function Ke(e, t) {
  try {
    const n = e.get(t);
    if (n === null || n.length > xe) return;
    const a = JSON.parse(n);
    return he(a) && a.v === $e ? a : void 0;
  } catch {
    return;
  }
}
function qe(e, t, n) {
  try {
    const a = JSON.stringify({ v: $e, ...n });
    return a.length > xe ? !1 : (e.set(t, a), !0);
  } catch {
    return !1;
  }
}
function We(e) {
  const { goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: i } = e;
  if (!(!ee(kn, t) || !ee(Sn, n) || !ee(Mn, a)) && !(typeof s != "boolean" || !ae(i, Number.MAX_SAFE_INTEGER)))
    return Object.freeze({ goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: i });
}
function $n(e) {
  const t = Ke(e, ue);
  return (t && We(t)) ?? Ge;
}
function Gn(e, t) {
  const n = We({ ...t });
  return n !== void 0 && qe(e, ue, { ...n });
}
function Ye(e, t) {
  const n = ce.find((c) => c.id === e);
  if (n === void 0 || !he(t) || !ae(t.startedAt, Fn)) return;
  const { doneDays: a, pickedIds: s } = t;
  if (!Array.isArray(a) || !Array.isArray(s) || s.length > n.days.length) return;
  const i = a, o = s;
  if (!i.every((c) => ae(c, n.days.length) && c >= 1) || !o.every((c) => typeof c == "string" && Bn.test(c))) return;
  const r = [...new Set(i)].sort((c, m) => c - m);
  return Object.freeze({
    startedAt: t.startedAt,
    doneDays: Object.freeze(r),
    pickedIds: Object.freeze([...o])
  });
}
function Kn(e) {
  const t = Ke(e, de), n = t == null ? void 0 : t.journeys;
  if (!he(n)) return xn;
  const a = {};
  for (const [s, i] of Object.entries(n)) {
    const o = Ye(s, i);
    o !== void 0 && (a[s] = o);
  }
  return Object.freeze(a);
}
function qn(e, t) {
  const n = {};
  for (const [a, s] of Object.entries(t)) {
    const i = Ye(a, s);
    i !== void 0 && (n[a] = i);
  }
  return qe(e, de, { journeys: n });
}
function Wn(e) {
  for (const t of [ue, de, me])
    try {
      e.remove(t);
    } catch {
    }
}
function Ee() {
  const e = /* @__PURE__ */ new Map();
  return {
    get: (t) => e.get(t) ?? null,
    set: (t, n) => void e.set(t, n),
    remove: (t) => void e.delete(t)
  };
}
function Yn(e) {
  try {
    const t = e ?? globalThis.localStorage;
    if (t === void 0) return Ee();
    const n = "zonked.probe";
    return t.setItem(n, "1"), t.removeItem(n), {
      get: (a) => t.getItem(a),
      set: (a, s) => t.setItem(a, s),
      remove: (a) => t.removeItem(a)
    };
  } catch {
    return Ee();
  }
}
const Je = /^[a-z0-9-]{1,80}$/;
function Jn(e) {
  try {
    const t = e.get(me);
    return t !== null && Je.test(t) ? t : null;
  } catch {
    return null;
  }
}
function Un(e, t) {
  try {
    Je.test(t) && e.set(me, t);
  } catch {
  }
}
const Vn = 60, Zn = 400;
function Xn(e, t) {
  const n = C(null), [a, s] = S(null);
  T(() => {
    if (e.playing) {
      s(null), n.current = e.templateId === null ? null : { id: e.templateId, name: e.templateName ?? h.brand, minutes: e.elapsedSec / 60 };
      return;
    }
    const o = n.current;
    if (n.current = null, !t || o === null || o.minutes * 60 < Vn) return;
    const r = window.setTimeout(() => s({ ...o, minutes: Math.round(o.minutes) }), Zn);
    return () => window.clearTimeout(r);
  }, [e.playing, e.templateId, e.templateName, e.elapsedSec, t]);
  const i = k(() => s(null), []);
  return H(() => ({ card: a, dismiss: i }), [a, i]);
}
function Qn({ info: e, onAgain: t, onClose: n }) {
  const a = C(null);
  return T(() => {
    var s;
    return (s = a.current) == null ? void 0 : s.focus();
  }, []), /* @__PURE__ */ l("div", { className: "c-overlay", onKeyDown: (s) => s.key === "Escape" && n(), children: /* @__PURE__ */ b("div", { className: "c-dialog c-end", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-end-title", "data-testid": "end-card", children: [
    /* @__PURE__ */ l("h2", { id: "c-end-title", className: "c-h1", children: h.endTitle }),
    /* @__PURE__ */ l("p", { children: h.endLine(e.name, e.minutes) }),
    /* @__PURE__ */ l("p", { className: "c-muted", children: h.endNote }),
    /* @__PURE__ */ b("div", { className: "c-actions", children: [
      /* @__PURE__ */ l("button", { ref: a, type: "button", className: "c-btn c-primary", "data-testid": "end-again", onClick: t, children: h.playAgain }),
      /* @__PURE__ */ l("button", { type: "button", className: "c-btn", "data-testid": "end-close", onClick: n, children: h.close })
    ] })
  ] }) });
}
function ea({ onAccept: e, onCancel: t }) {
  const n = C(null), a = C(null);
  T(() => {
    var o;
    return (o = n.current) == null ? void 0 : o.focus();
  }, []);
  const i = /* @__PURE__ */ b("div", { className: "c-safety", onKeyDown: (o) => {
    var r;
    if (t !== void 0) {
      if (o.key === "Escape")
        o.stopPropagation(), t();
      else if (o.key === "Tab") {
        const c = o.shiftKey ? a.current : n.current;
        document.activeElement === c && (o.preventDefault(), (r = o.shiftKey ? n.current : a.current) == null || r.focus());
      }
    }
  }, children: [
    /* @__PURE__ */ l("h2", { id: "c-safety-title", children: h.safetyTitle }),
    /* @__PURE__ */ l("ul", { className: "c-safe-list", children: h.safetyLines.map((o) => /* @__PURE__ */ l("li", { children: o }, o)) }),
    /* @__PURE__ */ b("div", { className: "c-actions c-row", children: [
      t !== void 0 && /* @__PURE__ */ l("button", { ref: a, type: "button", className: "c-btn", onClick: t, children: h.back }),
      /* @__PURE__ */ l("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "calm-safety-accept", onClick: e, children: h.safetyAccept })
    ] })
  ] });
  return t === void 0 ? i : /* @__PURE__ */ l("div", { className: "c-overlay", children: /* @__PURE__ */ l("div", { className: "c-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-safety-title", children: i }) });
}
const ta = 1, na = 720;
function aa(e) {
  const t = (e.endedAt - e.startedAt) / 6e4;
  return Number.isFinite(t) && t >= ta ? Math.min(na, t) : 0;
}
const sa = 200, W = (e = Date.now) => U(e());
function ia(e, t) {
  const n = H(() => Yn(), []), [a, s] = S(() => $n(n)), [i, o] = S(() => Kn(n)), [r, c] = S([]), [m, p] = S(0);
  T(() => {
    let g = !0;
    return e.listLogs(sa).then((d) => g && c(d)).catch(() => {
    }), () => {
      g = !1;
    };
  }, [e, m, t]);
  const f = H(() => {
    const g = r.map((d) => ({ day: U(d.startedAt), minutes: aa(d) }));
    return Hn(g, W());
  }, [r]), w = k(
    (g) => {
      s(g), Gn(n, g);
    },
    [n]
  ), A = k(
    (g, d) => {
      o((N) => {
        const { [g]: E, ...M } = N, I = d === null ? M : { ...M, [g]: d };
        return qn(n, I), I;
      });
    },
    [n]
  ), L = k(() => p((g) => g + 1), []);
  return { storage: n, profile: a, progress: i, week: f, logs: r, setProfile: w, setJourney: A, refresh: L };
}
const oa = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Oe = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], ra = { listened: "listened", rest: "rest day", today: "today", upcoming: "coming up" };
function la(e, t = !0, n = !1) {
  return e.quietWeek && n && !t ? h.joinedLine : e.quietWeek ? t ? h.welcomeBack : h.firstWeek : `${h.weekOf(e.daysListened)}. ${h.restCount}`;
}
function ca({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: a = !1 }) {
  const s = n && !t && e.quietWeek;
  return /* @__PURE__ */ b("div", { className: a ? "c-week c-week-compact" : "c-week", children: [
    /* @__PURE__ */ l("ul", { className: "c-dots", "aria-label": "This week", children: e.dots.map((i, o) => {
      const r = s && i === "today";
      return /* @__PURE__ */ b("li", { className: `c-dot c-dot-${i}${r ? " c-dot-joined" : ""}`, "data-state": i, children: [
        /* @__PURE__ */ l("span", { className: "c-mark", "aria-hidden": "true", children: r || i === "listened" ? /* @__PURE__ */ l(He, { name: "check", size: 16 }) : "" }),
        /* @__PURE__ */ l("span", { className: "c-dayname", "aria-hidden": "true", children: oa[o] }),
        /* @__PURE__ */ l("span", { className: "c-sr", children: `${Oe[o]}, ${r ? h.joinedToday : ra[i]}` })
      ] }, Oe[o]);
    }) }),
    /* @__PURE__ */ l("p", { className: "c-muted", "data-testid": a ? void 0 : "week-text", children: la(e, t, s) })
  ] });
}
const ua = () => /* @__PURE__ */ new Date();
function da(e, t, n) {
  var s;
  const a = ((s = e[t]) == null ? void 0 : s.doneDays.length) ?? 0;
  return a === 0 ? h.dayZero(n) : `Day ${Math.min(n, a + 1)} of ${n}`;
}
function ma({ profile: e, week: t, progress: n, reduced: a, crewConnected: s, hasHistory: i = !0, joinedToday: o = !1, now: r = ua, last: c = null, onPlay: m, onOpenJourney: p, onGo: f }) {
  const [w, A] = S(0), L = H(() => fn(Rn(e, r()), 5), [e, r]), g = L[w % Math.max(1, L.length)];
  return /* @__PURE__ */ b("div", { className: "c-today", children: [
    /* @__PURE__ */ b("header", { className: "c-pagehead", children: [
      /* @__PURE__ */ l(le, { size: 72, reduced: a }),
      /* @__PURE__ */ l("h1", { className: "c-greet", "data-testid": "greeting", children: lt(r().getHours()) })
    ] }),
    o && /* @__PURE__ */ l("p", { className: "c-note", "data-testid": "first-run-note", children: h.studioNote }),
    c !== null && /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-wide c-again", "data-testid": "play-again", onClick: () => m(c), children: `${h.playAgain}: ${c.name}` }),
    g !== void 0 && /* @__PURE__ */ b("section", { className: "c-daily", "aria-labelledby": "c-daily-h", children: [
      /* @__PURE__ */ l("p", { className: "c-eyebrow", children: h.dailyEyebrow }),
      /* @__PURE__ */ l("h2", { id: "c-daily-h", children: g.template.name }),
      /* @__PURE__ */ l("p", { className: "c-muted", children: `${g.template.recommendedMinutes} min. ${g.reasons[0] ?? h.suggested}` }),
      /* @__PURE__ */ b("div", { className: "c-actions", children: [
        /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-primary", "data-testid": "today-play", onClick: () => m(g.template), children: h.start }),
        /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-link", onClick: () => A((d) => d + 1), children: h.notThisOne })
      ] })
    ] }),
    /* @__PURE__ */ b("section", { "aria-labelledby": "c-goal-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-goal-h", className: "c-h3", children: `Your goal: ${ct[e.goal]}` }),
      /* @__PURE__ */ l(ca, { week: t, hasHistory: i, joinedToday: o })
    ] }),
    /* @__PURE__ */ b("section", { "aria-labelledby": "c-for-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-for-h", className: "c-h3", children: h.forYou }),
      /* @__PURE__ */ l("ul", { className: "c-rows", children: L.map((d) => /* @__PURE__ */ l("li", { children: /* @__PURE__ */ b("button", { type: "button", className: "c-mini-card", onClick: () => m(d.template), children: [
        /* @__PURE__ */ l("b", { children: d.template.name }),
        /* @__PURE__ */ l("small", { children: d.reasons[0] ?? h.suggested }),
        /* @__PURE__ */ l("em", { children: `${d.template.recommendedMinutes} min` })
      ] }) }, d.template.id)) })
    ] }),
    /* @__PURE__ */ b("section", { "aria-labelledby": "c-jr-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-jr-h", className: "c-h3", children: h.journeysTitle }),
      /* @__PURE__ */ l("ul", { className: "c-rows", children: ce.map((d) => /* @__PURE__ */ l("li", { children: /* @__PURE__ */ b("button", { type: "button", className: "c-journey-card", onClick: () => p(d.id), children: [
        /* @__PURE__ */ l("b", { children: d.title }),
        /* @__PURE__ */ l("small", { children: d.blurb }),
        /* @__PURE__ */ l("em", { children: da(n, d.id, d.days.length) })
      ] }) }, d.id)) })
    ] }),
    /* @__PURE__ */ l("button", { type: "button", className: "c-link-card", onClick: () => f("library"), children: /* @__PURE__ */ l("b", { children: "Browse all sounds" }) }),
    s && /* @__PURE__ */ l("p", { className: "c-crew-chip", role: "status", children: "Crew connected: easing the sound" })
  ] });
}
const ha = D(() => import("./chunk-Journeys-B53R45Ye.mjs").then((e) => ({ default: e.JourneyList }))), pa = D(() => import("./chunk-Journeys-B53R45Ye.mjs").then((e) => ({ default: e.JourneyDetail }))), fa = D(() => import("./chunk-Library-D9hARmHR.mjs").then((e) => ({ default: e.Library }))), ga = D(() => import("./chunk-PlayerScreen-DEen_Ki2.mjs").then((e) => ({ default: e.PlayerScreen }))), ya = D(() => import("./chunk-CrewScreen-DEYLgNqt.mjs").then((e) => ({ default: e.CrewScreen }))), ba = D(() => import("./chunk-NatureScreen-D8F4LJsu.mjs").then((e) => ({ default: e.NatureScreen }))), va = D(() => import("./chunk-SettingsScreen-Bz6rHoED.mjs").then((e) => ({ default: e.SettingsScreen })));
function wa({ view: e, journeyId: t, s: n, data: a, crewInfo: s, nature: i, still: o, fav: r, last: c, look: m, onLook: p, handlers: f }) {
  switch (e) {
    case "journeys":
      return /* @__PURE__ */ l(ha, { progress: a.progress, onOpen: f.openJourney, reduced: o });
    case "journey":
      return /* @__PURE__ */ l(
        pa,
        {
          id: t ?? "",
          profile: a.profile,
          progress: a.progress,
          todayDay: W(),
          onBack: () => f.go("journeys"),
          onStartJourney: a.setJourney,
          onRestart: (w) => a.setJourney(w, null),
          onPlayDay: f.playDay
        }
      );
    case "library":
      return /* @__PURE__ */ l(fa, { store: n.store, logs: a.logs, reduced: o, onNature: () => f.go("nature"), onPlay: f.play, onPlayMix: f.onMix });
    case "nature":
      return /* @__PURE__ */ l(ba, { nature: i, reduced: o, onBack: () => f.go("library") });
    case "player":
      return /* @__PURE__ */ l(ga, { player: n.player, snap: n.snap, still: o, favorite: r.on, onToggle: n.toggle, onFavorite: r.toggle, nature: i, engine: n.engine, theme: m.theme });
    case "crew":
      return /* @__PURE__ */ l(ya, { crew: s, burnout: n.snap.burnout });
    case "settings":
      return /* @__PURE__ */ l(
        va,
        {
          gentle: a.profile.extraGentle,
          reduceMotion: n.userReduced,
          reduced: o,
          onGentle: (w) => a.setProfile({ ...a.profile, extraGentle: w }),
          onReduceMotion: n.setReduced,
          onStudio: f.onStudio,
          onForget: f.forget,
          look: m,
          onLook: p
        }
      );
    default:
      return /* @__PURE__ */ l(
        ma,
        {
          profile: a.profile,
          week: a.week,
          progress: a.progress,
          reduced: o,
          hasHistory: a.logs.some((w) => U(w.startedAt) < W()),
          joinedToday: U(a.profile.createdAt) === W(),
          crewConnected: s.enabled && s.status === "connected",
          last: c,
          onPlay: f.play,
          onOpenJourney: f.openJourney,
          onGo: f.go
        }
      );
  }
}
const Ue = "zonked.look.v1", Y = { theme: "dark", highContrast: !1 };
function ka(e) {
  if (e === null) return Y;
  try {
    const t = JSON.parse(e.slice(0, 200));
    if (typeof t != "object" || t === null) return Y;
    const n = t;
    return { theme: n.theme === "light" ? "light" : "dark", highContrast: n.highContrast === !0 };
  } catch {
    return Y;
  }
}
function Sa() {
  try {
    return ka(window.localStorage.getItem(Ue));
  } catch {
    return Y;
  }
}
function Ma() {
  const [e, t] = S(Sa), n = k((a) => {
    t(a);
    try {
      window.localStorage.setItem(Ue, JSON.stringify(a));
    } catch {
    }
  }, []);
  return { look: e, setLook: n };
}
let V = null;
const Te = () => V, ze = (e) => void (V = e);
function Aa() {
  V !== null && (V = null, import("./chunk-samples-DyHOIbNK.mjs").then((e) => e.stopSample()).catch(() => {
  }));
}
const Ve = 8 * 1024 * 1024, Ze = 600, Na = 20, La = 2, Ea = 0.45, Oa = 1e-4;
function Ta(e) {
  var s;
  const t = ((s = e[0]) == null ? void 0 : s.length) ?? 0, n = new Float32Array(t), a = Math.max(1, e.length);
  for (const i of e) {
    const o = Math.min(t, i.length);
    for (let r = 0; r < o; r++) {
      const c = i[r] ?? 0;
      n[r] = (n[r] ?? 0) + (Number.isFinite(c) ? c : 0) / a;
    }
  }
  return n;
}
function za(e, t) {
  const n = e.length - t, a = e.slice(0, n);
  for (let s = 0; s < t; s++) {
    const i = (s + 0.5) / t * (Math.PI / 2);
    a[s] = (e[s] ?? 0) * Math.sin(i) + (e[n + s] ?? 0) * Math.cos(i);
  }
  return a;
}
function Ra(e, t) {
  if (!Number.isFinite(t) || t <= 0 || e.length === 0) return { ok: !1, error: "This file has no sound in it." };
  const n = Ta(e), a = n.length / t;
  if (a > Ze) return { ok: !1, error: "This file is longer than 10 minutes." };
  let s = 0;
  for (const r of n) s = Math.max(s, Math.abs(r));
  if (s < Oa) return { ok: !1, error: "This file is silent." };
  const i = Ea / s;
  for (let r = 0; r < n.length; r++) n[r] = (n[r] ?? 0) * i;
  if (a < Na) return { ok: !0, data: n, loop: !1 };
  const o = Math.min(Math.round(La * t), Math.floor(n.length / 4));
  return { ok: !0, data: za(n, o), loop: !0 };
}
const Da = "zonked.mysounds.v1", Ca = 5, Ia = 20 * 1024 * 1024, O = "sounds", Pa = 60, z = (e) => ({ ok: !1, error: e }), _a = "Your device could not store this sound. Remove one and try again.", Xe = (e) => /^own:[a-z0-9]{6,40}$/.test(e);
function ja(e) {
  const t = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, Pa);
  return t === "" ? "My sound" : t;
}
function Ha(e) {
  return new Promise((t, n) => {
    const a = e.open(Da, 1);
    a.onupgradeneeded = () => void a.result.createObjectStore(O, { keyPath: "id" }), a.onsuccess = () => t(a.result), a.onerror = () => n(a.error ?? new Error("open failed")), a.onblocked = () => n(new Error("blocked"));
  });
}
function pe(e) {
  return new Promise((t, n) => {
    e.onsuccess = () => t(e.result), e.onerror = () => n(e.error ?? new Error("request failed"));
  });
}
function fe(e) {
  return new Promise((t, n) => {
    e.oncomplete = () => t(), e.onerror = () => n(e.error ?? new Error("write failed")), e.onabort = () => n(e.error ?? new Error("write aborted"));
  });
}
const x = () => typeof indexedDB > "u" ? null : indexedDB;
async function $(e, t, n) {
  if (e === null) return z("This browser cannot keep sounds on your device.");
  let a = null;
  try {
    return a = await Ha(e), { ok: !0, value: await t(a) };
  } catch (s) {
    if (s instanceof RangeError) return z(s.message === "count" ? "You can keep 5 sounds. Remove one first." : "Your sounds would use more than 20 MB. Remove one first.");
    const i = s instanceof DOMException && s.name === "QuotaExceededError";
    return z(i ? _a : n);
  } finally {
    a == null || a.close();
  }
}
async function fs(e = x()) {
  return $(e, async (t) => (await pe(t.transaction(O).objectStore(O).getAll())).map((a) => ({ id: a.id, name: a.name, size: a.size })), "Your sounds could not be read.");
}
async function Fa(e, t = x()) {
  if (!Xe(e)) return z("Unknown sound.");
  const n = await $(t, async (a) => await pe(a.transaction(O).objectStore(O).get(e)), "Your sound could not be read.");
  return n.ok ? n.value === void 0 ? z("That sound is gone.") : { ok: !0, value: n.value.bytes } : n;
}
async function gs(e, t, n = x()) {
  if (t.byteLength > Ve) return z("This file is bigger than 8 MB.");
  const s = { id: `own:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, name: ja(e), size: t.byteLength, bytes: t };
  return $(n, async (i) => {
    const o = await pe(i.transaction(O).objectStore(O).getAll());
    if (o.length >= Ca) throw new RangeError("count");
    if (o.reduce((c, m) => c + m.size, 0) + s.size > Ia) throw new RangeError("total");
    const r = i.transaction(O, "readwrite");
    return r.objectStore(O).put(s), await fe(r), { id: s.id, name: s.name, size: s.size };
  }, "Your sound could not be saved.");
}
async function ys(e, t = x()) {
  return $(t, async (n) => {
    const a = n.transaction(O, "readwrite");
    return a.objectStore(O).delete(e), await fe(a), !0;
  }, "That sound could not be removed.");
}
async function Ba(e = x()) {
  return $(e, async (t) => {
    const n = t.transaction(O, "readwrite");
    return n.objectStore(O).clear(), await fe(n), !0;
  }, "Your sounds could not be removed.");
}
const xa = async (e) => {
  const t = typeof OfflineAudioContext > "u" ? void 0 : OfflineAudioContext;
  if (t === void 0) throw new Error("no decoder");
  const n = await new t(1, 1, 44100).decodeAudioData(e.slice(0));
  return { channels: Array.from({ length: n.numberOfChannels }, (a, s) => n.getChannelData(s)), sampleRate: n.sampleRate };
};
async function bs(e, t = xa) {
  var i;
  if (e.byteLength > Ve) return z("This file is bigger than 8 MB.");
  if (e.byteLength === 0) return z("This file is empty.");
  let n;
  try {
    n = await t(e);
  } catch {
    return z("This file is not a sound this browser can read.");
  }
  if ((((i = n.channels[0]) == null ? void 0 : i.length) ?? 0) / n.sampleRate > Ze) return z("This file is longer than 10 minutes.");
  const s = Ra(n.channels, n.sampleRate);
  return s.ok ? { ok: !0, value: !0 } : z(s.error);
}
const ge = "zonked.nature.v1", Qe = 0.3, et = 0.4, $a = 0.85, Re = { id: null, blend: Qe, level: et }, De = (e, t, n, a) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : a;
function Ga(e) {
  if (e === null || e.length > 400) return Re;
  try {
    const t = JSON.parse(e);
    return { id: typeof t.id == "string" && /^(own:)?[a-z0-9]{3,40}$/.test(t.id) ? t.id : null, blend: De(t.blend, 0, 1, Qe), level: De(t.level, 0, $a, et) };
  } catch {
    return Re;
  }
}
const ye = () => {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}, Ka = () => {
  var e;
  return Ga(((e = ye()) == null ? void 0 : e.getItem(ge)) ?? null);
};
function Ce(e) {
  var t;
  try {
    (t = ye()) == null || t.setItem(ge, JSON.stringify(e));
  } catch {
  }
}
function qa() {
  var e;
  try {
    (e = ye()) == null || e.removeItem(ge);
  } catch {
  }
}
const J = () => import("./chunk-samples-DyHOIbNK.mjs");
async function Wa(e, t) {
  const n = await J();
  if (!Xe(e)) return n.startSample(e, t);
  const a = await Fa(e);
  return a.ok ? n.startOwn(e, a.value, t) : { ok: !1, error: a.error };
}
function Ya(e) {
  const [t, n] = S(Ka), [a, s] = S(Te), [i, o] = S(""), r = C(t);
  r.current = t;
  const { player: c, guarded: m } = e;
  T(() => {
    e.snap.playing || (Aa(), s(null));
  }, [e.snap.playing]);
  const p = k(
    async (d) => {
      if (o(""), c.snapshot().playing || await c.play(), !c.snapshot().playing) return void o(h.errorAudio);
      (await J()).setBlend(r.current.blend);
      const E = await Wa(d, r.current.level);
      if (!E.ok) return void o(E.error);
      ze(d), s(d);
      const M = { ...r.current, id: d };
      n(M), Ce(M);
    },
    [c]
  ), f = k((d) => m(() => void p(d)), [m, p]), w = k(() => {
    ze(null), s(null), J().then((d) => d.stopSample());
  }, []), A = k((d, N) => {
    const E = { ...r.current, ...d };
    n(E), Ce(E), Te() !== null && J().then(N);
  }, []), L = k((d) => A({ blend: d }, (N) => N.setBlend(d)), [A]), g = k((d) => A({ level: d }, (N) => N.setSampleLevel(d)), [A]);
  return { prefs: t, on: a, message: i, start: f, stop: w, setBlend: L, setLevel: g };
}
async function Ja() {
  qa(), await Ba();
}
function Ua() {
  const { player: e, store: t, engine: n } = Pe(), [a, s] = S(() => e.snapshot()), [i, o] = S(ut), [r, c] = S(!1), [m, p, f] = dt(), w = C(null), A = C(i);
  T(() => (s(e.snapshot()), e.subscribe(s)), [e]);
  const L = k(
    (M) => {
      A.current ? M() : (w.current = M, c(!0));
    },
    []
  ), g = k(() => {
    mt(ht, !0), A.current = !0, o(!0), c(!1);
    const M = w.current;
    w.current = null, M == null || M();
  }, []), d = k(() => {
    w.current = null, c(!1);
  }, []), N = k(
    (M, I) => L(() => {
      e.setQueue([M]), e.playTemplate(M).then((F) => {
        F && I !== null && e.startTimer({ kind: "countdown", minutes: I });
      });
    }),
    [e, L]
  ), E = k(() => {
    e.snapshot().playing ? e.stop() : L(() => void e.play());
  }, [e, L]);
  return { engine: n, player: e, store: t, snap: a, accepted: i, gate: r, reduced: m, setReduced: p, userReduced: f, guarded: L, accept: g, cancelGate: d, playTemplate: N, toggle: E };
}
function Va(e, t) {
  const [n, a] = S("standalone"), [s, i] = S(() => pt());
  return T(() => ft(i), []), T(() => {
    const o = new gt({
      ...t !== void 0 ? { create: t } : {},
      onStatus: (r) => {
        a(r), r === "standalone" && e.crewLost();
      },
      onState: (r) => e.applyCrew(r)
    });
    return o.start(), () => o.stop();
  }, [e, t]), { enabled: s, status: n };
}
const se = 500, ie = { v: 1, items: [] };
function Za(e, t) {
  if (!ve(e) || B(e, "v") !== 1) return ie;
  const n = B(e, "items");
  if (!Array.isArray(n)) return ie;
  const a = [], s = /* @__PURE__ */ new Set();
  for (const i of n.slice(0, se * 2)) {
    if (!ve(i)) continue;
    const o = B(i, "kind"), r = _e(B(i, "id"));
    if (o !== "template" && o !== "mix" || r === null) continue;
    const c = `${o}:${r}`;
    if (!s.has(c) && (s.add(c), a.push({ kind: o, id: r, at: yt(B(i, "at"), 0, t + 864e5, t) }), a.length >= se))
      break;
  }
  return { v: 1, items: a };
}
function tt(e, t, n) {
  return e.items.some((a) => a.kind === t && a.id === n);
}
function Xa(e, t, n, a) {
  return tt(e, t, n) ? { v: 1, items: e.items.filter((s) => !(s.kind === t && s.id === n)) } : _e(n) === null || e.items.length >= se ? e : { v: 1, items: [{ kind: t, id: n, at: a }, ...e.items] };
}
function Qa(e, t) {
  const [n, a] = S(ie);
  T(() => {
    let i = !0;
    return e.getRecord("favorites").then((o) => i && a(Za(o, Date.now()))).catch(() => {
    }), () => {
      i = !1;
    };
  }, [e]);
  const s = k(() => {
    if (t === null) return;
    const i = Xa(n, "template", t, Date.now());
    a(i), e.setRecord("favorites", i).catch(() => {
    });
  }, [n, t, e]);
  return { on: t !== null && tt(n, "template", t), toggle: s };
}
const es = D(() => import("./chunk-Onboarding-P80SqVRv.mjs").then((e) => ({ default: e.Onboarding }))), ts = (e) => Math.max(180, e * 60 * 0.8);
function ns({ engine: e, clock: t, store: n, bridgeCreate: a, onStudio: s }) {
  const i = Ua(), o = ia(i.store, i.snap.playing), r = Va(i.player, a), c = Ya(i), [m, p] = S("today"), [f, w] = S(null), A = C(null), L = Qa(i.store, i.snap.templateId), g = o.profile.createdAt === 0, d = is(o.storage), N = Xn(i.snap, !g), E = i.reduced || o.profile.extraGentle, { look: M, setLook: I } = Ma();
  os(s);
  const F = k((R) => p(R), []), { play: be, playDay: at, finish: st } = as({ s: i, data: o, last: d, end: N, active: A, setView: p });
  ls(i.snap.playing, i.snap.elapsedSec, A, o.progress, o.setJourney);
  const it = (R) => {
    w(R), p("journey");
  }, ot = () => {
    Wn(o.storage), c.stop(), Ja(), o.setProfile(Ge), p("today");
  };
  return /* @__PURE__ */ b("div", { className: "c-app", "data-theme": M.theme, "data-contrast": M.highContrast ? "high" : "normal", "data-view": m, "data-motion": E ? "off" : "on", "data-playing": i.snap.playing ? "true" : "false", children: [
    /* @__PURE__ */ l(rs, {}),
    /* @__PURE__ */ l("main", { id: "c-main", className: "c-main", tabIndex: -1, children: /* @__PURE__ */ l(Ie, { fallback: /* @__PURE__ */ l("p", { className: "c-loading", role: "status", children: h.loading }), children: g ? /* @__PURE__ */ l(
      es,
      {
        playing: i.snap.playing,
        reduced: E,
        initial: o.profile,
        onAccept: i.accept,
        onPreview: (R) => i.playTemplate(R, null),
        onStop: () => void i.player.stop(),
        onFinish: st
      }
    ) : /* @__PURE__ */ l(
      wa,
      {
        view: m,
        journeyId: f,
        s: i,
        data: o,
        crewInfo: r,
        nature: c,
        still: E,
        fav: L,
        last: d.template,
        look: M,
        onLook: I,
        handlers: { go: F, play: be, playDay: at, openJourney: it, forget: ot, onStudio: s, onMix: (R) => i.guarded(() => i.player.playMix(R)) }
      }
    ) }) }),
    !g && m !== "player" && /* @__PURE__ */ l(wn, { snap: i.snap, onOpen: () => F("player"), onStop: () => void i.player.stop() }),
    !g && /* @__PURE__ */ l(vn, { view: m, onGo: F, reduced: E }),
    /* @__PURE__ */ l("p", { className: "c-sr", role: "status", "data-testid": "play-status", children: i.snap.playing ? `Playing. ${h.volumeCapped}` : "Stopped." }),
    N.card !== null && !i.snap.playing && /* @__PURE__ */ l(Qn, { info: N.card, onAgain: () => {
      var R;
      return ss(((R = N.card) == null ? void 0 : R.id) ?? null, be);
    }, onClose: N.dismiss }),
    i.gate && /* @__PURE__ */ l(ea, { onAccept: i.accept, onCancel: i.cancelGate })
  ] });
}
function as({ s: e, data: t, last: n, end: a, active: s, setView: i }) {
  const o = k(
    (m, p = m.recommendedMinutes) => {
      s.current = null, n.remember(m.id), a.dismiss(), e.playTemplate(m, p), i("player");
    },
    [e, n, a, s, i]
  );
  return { play: o, playDay: (m, p, f) => {
    o(f), s.current = { id: m, no: p, needSec: ts(f.recommendedMinutes) };
  }, finish: (m, p) => {
    if (t.setProfile(m), !e.snap.playing || e.snap.templateId !== p.id) return o(p);
    n.remember(p.id), e.player.startTimer({ kind: "countdown", minutes: p.recommendedMinutes }), i("player");
  } };
}
const nt = (e) => e === null ? null : j().find((t) => t.id === e) ?? null;
function ss(e, t) {
  const n = nt(e);
  n !== null && t(n);
}
function is(e) {
  const [t, n] = S(() => Jn(e)), a = H(() => nt(t), [t]), s = k(
    (i) => {
      Un(e, i), n(i);
    },
    [e]
  );
  return H(() => ({ template: a, remember: s }), [a, s]);
}
function os(e) {
  T(() => {
    const t = (n) => {
      n.altKey && n.shiftKey && n.code === "KeyS" && (n.preventDefault(), e());
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [e]);
}
function rs() {
  return /* @__PURE__ */ b(rt, { children: [
    /* @__PURE__ */ l("a", { className: "c-skip", href: "#c-main", children: "Skip to content" }),
    /* @__PURE__ */ l("header", { className: "c-topbar", children: /* @__PURE__ */ l("span", { className: "c-brand", children: h.brand }) })
  ] });
}
function ls(e, t, n, a, s) {
  T(() => {
    const i = n.current, o = i === null ? void 0 : a[i.id];
    !e || i === null || o === void 0 || t < i.needSec || (n.current = null, o.doneDays.includes(i.no) || s(i.id, { ...o, doneDays: [...o.doneDays, i.no].sort((r, c) => r - c) }));
  }, [e, t, n, a, s]);
}
const cs = {
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
function vs() {
  bt(import.meta.url), vt();
  const { engine: e, store: t } = Pe();
  T(() => (we(!0), () => we(!1)), []);
  const [n, a] = S(!1);
  return /* @__PURE__ */ b("div", { "data-testid": "zonked-app", style: { height: "100%", minHeight: 0, overflow: "hidden", position: "relative", transform: "translateZ(0)" }, children: [
    /* @__PURE__ */ l("div", { style: { height: "100%", overflowY: "auto" }, children: /* @__PURE__ */ l(ns, { engine: e, store: t, onStudio: () => a(!0) }) }),
    n && /* @__PURE__ */ l("p", { role: "status", style: cs, "data-testid": "studio-note", onClick: () => a(!1), children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close." })
  ] });
}
export {
  Ge as D,
  kn as G,
  He as I,
  ce as J,
  $a as M,
  ie as N,
  hs as P,
  ea as S,
  Sn as T,
  vs as Z,
  Mn as a,
  j as b,
  Za as c,
  Zt as d,
  Ra as e,
  gn as f,
  ps as g,
  fs as h,
  gs as i,
  ys as j,
  Ba as k,
  Ka as l,
  Ve as m,
  Rn as p,
  fn as r,
  bs as v
};
