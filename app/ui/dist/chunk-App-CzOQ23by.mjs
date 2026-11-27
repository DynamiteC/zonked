import { jsx as l, jsxs as y, Fragment as Ce } from "react/jsx-runtime";
import { lazy as D, Suspense as Pe, useRef as C, useState as M, useEffect as T, useCallback as S, useMemo as P } from "react";
import { C as h, g as ct, G as ut, a as Ie, i as dt, u as mt, w as ht, S as pt, b as ft, o as gt, B as yt, c as be, f as x, d as je, n as bt, e as vt, h as wt, s as ve } from "./chunk-crewLink-Cq0htOCx.mjs";
function d(e) {
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
const g = (e, t) => e[(t % e.length + e.length) % e.length], kt = [98, 110, 123.5, 87.3, 103.8, 130.8], St = [196, 220, 247, 175, 165, 262], Mt = {
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
}, At = (e) => [...e].reduce((t, n) => (t * 31 + n.charCodeAt(0)) % 9973, 7);
function Nt(e, t, n) {
  const a = At(e) + n;
  return { prog: g(Mt[t], a), key: g(kt, a), pianoRoot: g(St, a >> 1) };
}
function Et(e, t, n) {
  const a = e === "dreamy" || e === "ethereal" || e === "calm";
  return {
    breathDepth: g([0.45, 0.4, 0.3, 0.2, 0.1], t - 1),
    breathRateHz: 0.06 + 0.02 * (n % 5),
    stereoWidth: 0.3 + 0.1 * (n % 4),
    panDepth: a ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (n % 4)
  };
}
const Lt = {
  lofi: (e, t) => ({
    lofiLevel: 0.45,
    lofiWarmth: g([0.5, 0.6, 0.7], e),
    lofiProgression: t.prog,
    tapeWow: g([0.25, 0.35, 0.45], e),
    padRootHz: t.key
  }),
  piano: (e, t) => ({
    instLevel: 0.35,
    instKind: 3,
    instRootHz: t.pianoRoot,
    instScale: g([2, 0, 1, 4, 3], e),
    instBpm: g([40, 46, 52], e),
    pianoPedal: g([0.4, 0.55, 0.7], e)
  }),
  crackle: () => ({ crackle: 0.12 }),
  drone: (e) => ({ instLevel: 0.35, instKind: 1, instRootHz: g([55, 62, 73, 82], e), instScale: 7, instBpm: 40 }),
  pluck: (e) => ({
    instLevel: 0.3,
    instKind: 0,
    instRootHz: g([196, 220, 247, 262], e),
    instScale: g([0, 2, 4, 1], e),
    instBpm: g([48, 56, 64, 72], e)
  }),
  bell: (e) => ({
    instLevel: 0.28,
    instKind: 2,
    instRootHz: g([262, 294, 330, 349], e),
    instScale: 4,
    instBpm: 40
  }),
  pad: (e, t) => ({ padLevel: 0.4, padChord: g([0, 2, 4, 6], e), padRootHz: t.key }),
  chimes: (e) => ({ chimeLevel: 0.25, chimeRatePerMin: g([3, 4, 6, 8], e) }),
  perc: (e) => ({
    percLevel: 0.2,
    percBpm: g([64, 72, 80, 92], e),
    percPattern: g([0, 3, 4, 7], e)
  })
};
function Tt(e, t, n = { prog: 0, key: 110, pianoRoot: 220 }) {
  return e.reduce((a, s) => ({ ...a, ...Lt[s](t, n) }), {});
}
const we = (e) => Math.round(e * 1e3) / 1e3, Z = (e) => Math.min(40, Math.max(0.5, e));
function Ot(e, t, n, a, s) {
  const i = Math.min(5, Math.max(1, t * 0.15));
  if (e === "plateau") {
    const o = [{ t: 0, beat: n, ramp: !0 }, { t: i, beat: a, ramp: s !== void 0 }];
    return s !== void 0 && o.push({ t: t - i, beat: a, ramp: !0 }, { t, beat: s, ramp: !1 }), o;
  }
  if (e === "ramp-down" || e === "ramp-up")
    return [{ t: 0, beat: n, ramp: !0 }, { t: t * 0.7, beat: a, ramp: !1 }];
  if (e === "wave")
    return Array.from({ length: 7 }, (o, c) => ({ t: t * c / 6, beat: c % 2 === 0 ? n : a, ramp: c < 6 }));
  const r = t / 4;
  return Array.from({ length: 4 }, (o, c) => {
    const u = n + (a - n) * c / 3;
    return c < 3 ? [{ t: c * r, beat: u, ramp: !1 }, { t: c * r + r * 0.75, beat: u, ramp: !0 }] : [{ t: c * r, beat: u, ramp: !1 }];
  }).flat();
}
function zt(e, t, n, a, s) {
  const i = (t % 3 - 1) * e.jitter, r = Z(e.to + i), o = g(e.noises, t >> 1), c = g(e.layers, t * 2 + (t >> 1)), u = g(e.vibes, t), p = Tt(c, t, Nt(e.slug, u, t)), A = Object.keys(p).length > 0, E = A ? { ...p, ...Et(u, e.intensity, t) } : p;
  return Ot(e.shape, n, Z(e.from), r, e.ret).map((b) => ({
    atMin: we(b.t),
    beatHz: we(Z(b.beat)),
    carrierHz: a,
    gain: e.gain,
    mode: s,
    noise: o[0],
    noiseLevel: o[1],
    ...A ? { layers: E } : {},
    ramp: b.ramp
  }));
}
function re(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    t.add(n.mode);
    const a = n.layers;
    n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), a !== void 0 && (((a.lofiLevel ?? 0) > 0 || (a.crackle ?? 0) > 0) && t.add("lofi"), (a.instLevel ?? 0) > 0 && t.add("instrument"), (a.padLevel ?? 0) > 0 && t.add("pad"), (a.chimeLevel ?? 0) > 0 && t.add("chimes"), (a.percLevel ?? 0) > 0 && t.add("percussion"));
  }
  return [...t];
}
function oe(e, t) {
  if (t > 3) return !1;
  const n = e.every((i, r) => {
    var o;
    return r === 0 || Math.abs(i.beatHz - (((o = e[r - 1]) == null ? void 0 : o.beatHz) ?? i.beatHz)) <= 4;
  }), a = e.every((i) => i.mode === "isochronic" || i.beatHz >= 12 && i.beatHz <= 20), s = e.every((i) => {
    var r, o;
    return (((r = i.layers) == null ? void 0 : r.crackle) ?? 0) === 0 && (((o = i.layers) == null ? void 0 : o.percBpm) ?? 0) <= 100;
  });
  return n && a && s;
}
function Rt(e, t) {
  const n = e.adjectives.length, a = t * 7 % (n * e.nouns.length);
  return `${g(e.adjectives, a)} ${g(e.nouns, Math.floor(a / n))}`;
}
const Dt = (e) => String(e).padStart(2, "0");
function Ct(e, t, n, a) {
  const s = g(t.mins, n), i = g(t.carriers, n * 3 + 1), r = g(t.modes, n + (n >> 2)), o = zt(t, n, s, i, r), c = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
  return {
    id: `${e.prefix}-${t.slug}-${Dt(n + 1)}`,
    name: Rt(e, a),
    category: e.category,
    vibe: g(t.vibes, n),
    tags: [t.slug, c, r, ...t.tags],
    layerTags: re(o),
    situations: t.situations,
    recommendedMinutes: s,
    intensity: t.intensity,
    adhdFriendly: oe(o, t.intensity),
    stages: o,
    reasonTemplate: t.reason,
    source: "original",
    ...t.breath !== void 0 ? { breath: t.breath } : {}
  };
}
function Pt(e) {
  let t = 0;
  return e.archs.flatMap((n) => Array.from({ length: n.count }, (a, s) => Ct(e, n, s, t++)));
}
const It = {
  category: "adhd-control",
  prefix: "adhd",
  adjectives: ["Steady", "Anchored", "Level", "Even", "Tidy", "Calm", "Focused", "Plain", "Settled", "Patient", "Smooth", "Constant"],
  nouns: ["Anchor", "Rail", "Tracks", "Rhythm", "Metronome", "Lane", "Thread", "Pulse", "Desk", "Checklist", "Runway", "Keel"],
  archs: [
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
}, jt = {
  category: "focus",
  prefix: "focus",
  adjectives: ["Sharp", "Deep", "Clear", "Lucid", "Bright", "Keen", "Locked", "Precise", "Crisp", "Direct", "Tuned", "Honed"],
  nouns: ["Beam", "Signal", "Compass", "Engine", "Vector", "Prism", "Forge", "Spire", "Circuit", "Current", "Summit", "Scope"],
  archs: [
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
}, Ht = {
  category: "lucid-dreams",
  prefix: "lucid",
  adjectives: ["Waking", "Silver", "Nebula", "Astral", "Twilight", "Aware", "Hollow", "Starlit", "Liminal", "Vivid", "Opal", "Drifting"],
  nouns: ["Gate", "Compass", "Mirror", "Skyway", "Threshold", "Door", "Voyage", "Lens", "Bridge", "Beacon", "Garden", "Orbit"],
  archs: [
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
}, Ft = {
  category: "meditation",
  prefix: "meditation",
  adjectives: ["Open", "Rooted", "Sacred", "Luminous", "Patient", "Clear", "Boundless", "Inner", "Mindful", "Sunlit", "Hallowed", "Silent"],
  nouns: ["Cushion", "Temple", "Breath", "Mountain", "Lotus", "Stillpoint", "Horizon", "Sanctuary", "River", "Candle", "Grove", "Bowl"],
  archs: [
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
}, Bt = {
  category: "sleep",
  prefix: "sleep",
  adjectives: ["Quiet", "Slow", "Velvet", "Hushed", "Moonlit", "Soft", "Drowsy", "Still", "Dim", "Gentle", "Fading", "Lulled"],
  nouns: ["Harbor", "Tide", "Pillow", "Lantern", "Blanket", "Meadow", "Lullaby", "Cabin", "Drift", "Hearth", "Cove", "Evening"],
  archs: [
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
}, xt = {
  category: "vibes",
  prefix: "vibe",
  adjectives: ["Neon", "Cozy", "Mellow", "Golden", "Hazy", "Crisp", "Cloudy", "Dusty", "Amber", "Breezy", "Sleepy", "Plush"],
  nouns: ["Cafe", "Rooftop", "Cassette", "Window", "Terrace", "Playlist", "Sunday", "Skyline", "Studio", "Porch", "Alley", "Lounge"],
  archs: [
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
}, $t = {
  category: "work-recovery",
  prefix: "recovery",
  adjectives: ["Unplugged", "Offline", "Cooled", "Rested", "Idle", "Paused", "Unwound", "Mellow", "Eased", "Reset", "Spare", "Soft"],
  nouns: ["Break", "Commit", "Cooldown", "Terminal", "Standup", "Branch", "Window", "Stretch", "Merge", "Buffer", "Release", "Cache"],
  archs: [
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
    d({
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
}, q = (e) => Math.round(e * 1e3) / 1e3, W = (e) => Math.min(40, Math.max(0.5, e)), _e = (e) => e.segs.reduce((t, n) => t + n[0], 0) * (e.scale ?? 1);
function ke(e, t) {
  const n = e.carrier ?? 200;
  return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(_e(e), 1));
}
function Gt(e) {
  const t = [], [n, a] = e.noise ?? ["off", 0];
  let s = 0;
  return e.segs.forEach((i, r) => {
    const o = i[1] !== i[2], c = e.segs[r + 1];
    t.push({
      atMin: q(s / 60),
      beatHz: q(W(i[1])),
      carrierHz: ke(e, s),
      gain: e.gain ?? 0.5,
      mode: e.mode ?? "binaural",
      noise: n,
      noiseLevel: a,
      ramp: o
    }), s += i[0] * (e.scale ?? 1), o && (c === void 0 || W(c[1]) !== W(i[2])) && t.push({ ...t[t.length - 1], atMin: q(s / 60), beatHz: q(W(i[2])), carrierHz: ke(e, s), ramp: !1 });
  }), t;
}
function qt(e) {
  const t = Gt(e);
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    vibe: e.vibe,
    tags: [...e.tags, e.source],
    layerTags: re(t),
    situations: e.situations,
    recommendedMinutes: Math.max(1, Math.round(_e(e) / 60)),
    intensity: e.intensity,
    adhdFriendly: oe(t, e.intensity),
    stages: t,
    reasonTemplate: e.reason,
    source: e.source
  };
}
const K = ["white", 0.3], te = ["pink", 0.3], ne = ["brown", 0.3], Se = [
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
], Wt = [
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
], Kt = [
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
], Yt = [
  [333, 8, 8],
  [333, 8, 10],
  [333, 10, 12],
  [333, 12, 12],
  [333, 12, 10],
  [333, 10, 8],
  [333, 8, 10]
], Ut = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, () => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10]
], w = (e) => ({ ...e, source: "android", carrier: 200 }), Jt = [
  w({
    id: "android-self-hypnosis",
    name: "Mind Bridge",
    category: "meditation",
    vibe: "deep",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: K,
    tags: ["theta", "hypnosis"],
    reason: "Five minutes down to 4 Hz, ten minutes holding there, five minutes back up."
  }),
  w({
    id: "android-highest-mental-activity",
    name: "Spark Burst",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: [[120, 12, 40], [600, 40, 40], [120, 40, 12]],
    noise: K,
    tags: ["gamma", "boost"],
    reason: "Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz."
  }),
  w({
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
  w({
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
  w({
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
  w({
    id: "android-creativity",
    name: "Creative Waves",
    category: "vibes",
    vibe: "bright",
    situations: ["quick-reset", "deep-work"],
    intensity: 2,
    segs: Kt,
    noise: ["white", 0.4],
    tags: ["alpha", "theta", "creative"],
    reason: "Twenty minutes that drift back and forth between 10 and 6 Hz for loose ideas."
  }),
  w({
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
  w({
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
  w({
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
  w({
    id: "android-interval-pulse",
    name: "Interval Pulse",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: Ut,
    tags: ["beta", "gamma", "interval"],
    reason: "Eight short high and low rounds between a warm up and a cool down."
  }),
  w({
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
  w({
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
  w({
    id: "android-lucid-dreams",
    name: "Lucid Dream Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream"],
    intensity: 2,
    segs: Se,
    gain: 0.5,
    tags: ["theta", "lucid"],
    reason: "A theta bed with brief alpha lifts and a soft ending."
  }),
  w({
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
  w({
    id: "android-smr-sleep",
    name: "SMR Sleep Weave",
    category: "sleep",
    vibe: "minimal",
    situations: ["cant-sleep", "heal-stress"],
    intensity: 2,
    segs: Yt,
    tags: ["alpha", "smr"],
    reason: "Forty minutes of beats crossing between alpha and the low SMR band."
  }),
  w({
    id: "android-lucid-dreams-2",
    name: "Long Lucid Night",
    category: "lucid-dreams",
    vibe: "deep",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...Wt],
    noise: te,
    gain: 0.5,
    tags: ["delta", "theta", "lucid"],
    reason: "A delta fall followed by a long night plan with timed theta pulses."
  }),
  w({
    id: "android-adhd-cycle",
    name: "Focus Cycle",
    category: "adhd-control",
    vibe: "energized",
    situations: ["adhd-focus", "deep-work"],
    intensity: 3,
    segs: [[300, 40, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20]],
    noise: K,
    tags: ["beta", "cycle"],
    reason: "Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener."
  }),
  // Shortened variants of existing Android programs.
  w({
    id: "android-self-hypnosis-short",
    name: "Quick Mind Bridge",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: K,
    scale: 0.5,
    tags: ["theta", "short"],
    reason: "The Mind Bridge shape squeezed into ten minutes."
  }),
  w({
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
  w({
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
  w({
    id: "android-lucid-dreams-short",
    name: "Lucid Nap Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: Se.slice(0, 12),
    gain: 0.5,
    tags: ["theta", "lucid", "short"],
    reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
  })
], X = (e) => ({ ...e, source: "gnaural" }), Vt = [
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
function Zt() {
  return [...Jt, ...Vt].map(qt);
}
const Xt = [
  { id: "lofi", name: "Lo-fi", blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.", mood: "warm", defaultLevel: 0.5, layerKeys: ["lofiLevel", "lofiProgression", "tapeWow", "crackle"], templateId: "starter-lofi", evidence: "preference" },
  { id: "piano", name: "Soft piano", blurb: "A soft piano playing gentle, slow phrases with long ringing notes.", mood: "calm", defaultLevel: 0.45, layerKeys: ["instLevel", "instKind", "pianoPedal"], templateId: "starter-piano", evidence: "preference" },
  { id: "violet", name: "Violet hiss", blurb: "A thin, bright hiss, like gentle static. Keep it quiet.", mood: "bright", defaultLevel: 0.3, layerKeys: [], templateId: "starter-violet", evidence: "limited" },
  { id: "rain", name: "Rain hush", blurb: "A steady rain-like hush, even across the pitches (pink noise).", mood: "calm", defaultLevel: 0.4, layerKeys: [], templateId: "starter-rain", evidence: "mixed" },
  { id: "deep", name: "Deep rumble", blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).", mood: "deep", defaultLevel: 0.4, layerKeys: [], templateId: "starter-deep", evidence: "preference" },
  { id: "chimes", name: "Soft chimes", blurb: "Soft bells that ring now and then at uneven gaps.", mood: "dreamy", defaultLevel: 0.3, layerKeys: ["chimeLevel", "chimeRatePerMin"], templateId: "starter-chimes", evidence: "preference" },
  { id: "beats", name: "Beats only", blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.", mood: "neutral", defaultLevel: 0, layerKeys: [], templateId: "starter-beats", evidence: "mixed" }
], Qt = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function en(e, t) {
  const n = Qt(t);
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
const tn = { warm: "warm", calm: "calm", bright: "bright", deep: "deep", dreamy: "dreamy", neutral: "minimal" };
function nn(e) {
  const t = en(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, s = [{
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
    vibe: tn[e.mood] ?? "calm",
    tags: ["starter", "sound-first", e.id],
    layerTags: re(s),
    situations: ["quick-reset", "heal-stress"],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: oe(s, 1),
    stages: s,
    reasonTemplate: e.blurb,
    source: "original"
  };
}
function an() {
  return Xt.map(nn);
}
function sn() {
  return [
    ...an(),
    ...Zt(),
    ...[xt, _t, Ht, Ft, Bt, It, jt, $t].flatMap(Pt)
  ];
}
let Me;
function H() {
  return Me ?? (Me = sn()), Me;
}
new Proxy([], {
  get: (e, t) => Reflect.get(H(), t),
  has: (e, t) => Reflect.has(H(), t),
  ownKeys: () => Reflect.ownKeys(H()),
  getOwnPropertyDescriptor: (e, t) => {
    const n = Reflect.getOwnPropertyDescriptor(H(), t);
    return n === void 0 || t === "length" ? n : { ...n, configurable: !0 };
  }
});
function rn(e) {
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
function Ae(e) {
  return e.stages.some((t) => t.mode === "binaural");
}
const ln = {
  focus: [1, 1, 0.5, 0.1],
  "adhd-control": [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  "work-recovery": [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  "lucid-dreams": [0, 0.1, 0.6, 1]
}, cn = { morning: 0, afternoon: 1, evening: 2, night: 3 }, un = (e) => Math.round(e * 10) / 10;
function dn(e, t, n) {
  const a = Math.max(1, t);
  if (e <= a)
    return n.push(`Fits your ${a} minutes (${e} min).`), 15 * (0.6 + 0.4 * (e / a));
  const s = (e - a) / a;
  return n.push(`Runs ${e} min, longer than your ${a}; you can stop any time.`), Math.max(0, 15 * (1 - s * 1.5)) - (s > 0.5 ? 5 : 0);
}
function mn(e, t, n) {
  return t.deviceType === "speaker" ? Ae(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), Ae(e) ? 10 : 8);
}
function hn(e, t, n) {
  const a = e.intensity > 3 || rn(e) || on(e), s = t.sensorySensitivity;
  return s === "low" ? { pts: 10, sensitive: !1 } : s === "medium" ? { pts: e.intensity <= 3 ? a ? 7 : 10 : 4, sensitive: !1 } : a ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), { pts: 0, sensitive: !0 }) : (n.push("Gentle: low intensity, no percussion or crackle."), { pts: e.intensity <= 2 ? 10 : 7, sensitive: !1 });
}
function pn(e, t) {
  const n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], a = e.situations.includes(t.situation);
  let s = 0;
  a ? (s += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? s += 7 : t.vibe === e.vibe && (s += 15, n.push(`Matches your ${t.vibe} vibe.`)), s += dn(e.recommendedMinutes, t.availableMinutes, n);
  const i = (ln[e.category][cn[t.timeOfDay]] ?? 0) * 10;
  s += i, i >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (s -= 5), s += mn(e, t, n);
  const r = hn(e, t, n);
  return s += r.pts, { template: e, score: Math.max(0, un(s)), reasons: n, sensitive: r.sensitive, onSituation: a };
}
const fn = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : e.template.id > t.template.id ? 1 : 0);
function He(e, t = 5, n = H()) {
  const a = Math.max(1, Math.floor(t)), s = n.map((c) => pn(c, e)).sort(fn), i = [
    s.filter((c) => c.onSituation && !c.sensitive),
    s.filter((c) => !c.sensitive),
    s
  ], r = i.find((c) => c.length >= a) ?? s, o = r.slice(0, a);
  return r !== i[0] && o.forEach((c) => {
    c.onSituation || c.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
  }), o.map((c) => ({ template: c.template, score: c.score, reasons: c.reasons }));
}
function gn(e) {
  const t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), a = Math.floor(n / 60), s = (i) => String(i).padStart(2, "0");
  return a > 0 ? `${a}:${s(n % 60)}:${s(t % 60)}` : `${s(n)}:${s(t % 60)}`;
}
const Ne = {
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
function Fe({ name: e, size: t = 22 }) {
  return /* @__PURE__ */ l("svg", { className: "c-icon", width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ l("path", { d: Ne[e] ?? Ne.wave }) });
}
const yn = D(() => import("./chunk-mascot-gE-i7l4L.mjs").then((e) => ({ default: e.CalmMascot })));
function le({ size: e, mood: t = "idle", reduced: n }) {
  return /* @__PURE__ */ l(Pe, { fallback: /* @__PURE__ */ l("span", { className: "c-mascot-gap", style: { width: e, height: e } }), children: /* @__PURE__ */ l(yn, { mood: t, size: e, reducedMotion: n }) });
}
function cs({ title: e, reduced: t }) {
  return /* @__PURE__ */ y("header", { className: "c-pagehead", children: [
    /* @__PURE__ */ l(le, { size: 72, reduced: t }),
    /* @__PURE__ */ l("h1", { className: "c-h1", children: e })
  ] });
}
const bn = [
  { view: "today", label: h.nav[0], icon: "today" },
  { view: "journeys", label: h.nav[1], icon: "journeys" },
  { view: "library", label: h.nav[2], icon: "library" },
  { view: "crew", label: h.nav[3], icon: "crew" },
  { view: "settings", label: h.nav[4], icon: "settings" }
];
function vn({ view: e, onGo: t, reduced: n = !1 }) {
  const a = e === "journey" ? "journeys" : e === "nature" ? "library" : e;
  return /* @__PURE__ */ y("nav", { className: "c-tabbar", "aria-label": "Main", children: [
    /* @__PURE__ */ y("div", { className: "c-rail-brand", "aria-hidden": "true", children: [
      /* @__PURE__ */ l(le, { size: 40, reduced: n }),
      /* @__PURE__ */ l("span", { className: "c-brand", children: h.brand })
    ] }),
    bn.map((s) => /* @__PURE__ */ y("button", { type: "button", className: "c-nav", "aria-current": a === s.view ? "page" : void 0, onClick: () => t(s.view), children: [
      /* @__PURE__ */ l(Fe, { name: s.icon }),
      /* @__PURE__ */ l("span", { children: s.label })
    ] }, s.view))
  ] });
}
function wn({ snap: e, onOpen: t, onStop: n }) {
  if (!e.playing) return null;
  const a = e.timer.kind !== "none" && e.timer.running ? ` ${gn(e.timer.remainingSec)}` : "";
  return /* @__PURE__ */ y("div", { className: "c-mini", role: "group", "aria-label": "Now playing", children: [
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
function En(e) {
  const t = An[e] ?? 0, n = [];
  for (let a = 1; a <= t; a += 1) n.push(`${e}-${String(a).padStart(2, "0")}`);
  return Object.freeze(n);
}
function Ln(e) {
  return Object.freeze({ kind: "session", family: e, variants: En(e) });
}
function j(...e) {
  return Object.freeze(e.map((t) => t === "rest" ? Nn : Ln(t)));
}
const Q = (e, t) => Array.from({ length: t }, () => e), _ = (e) => Object.freeze(e), ce = Object.freeze([
  _({
    id: "calm-evenings",
    title: "7 Calm Evenings",
    blurb: "7 short evenings of slow sound. About 20 minutes each.",
    situation: "heal-stress",
    vibe: "calm",
    minutes: 20,
    days: j(
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
    days: j("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
  }),
  _({
    id: "easier-sleep",
    title: "14 Nights of Wind-Down Sound",
    blurb: "14 nights of slow sound for winding down. Rest nights included.",
    situation: "cant-sleep",
    vibe: "dreamy",
    minutes: 45,
    days: j(
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
    days: j(
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
    days: j("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
  }),
  _({
    id: "gentle-routine",
    title: "Gentle Routine",
    blurb: "Gentle routine for steady attention. About 25 minutes each.",
    situation: "adhd-focus",
    vibe: "grounded",
    minutes: 25,
    days: j(
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
function us(e) {
  return ce.find((t) => t.id === e);
}
const Tn = {
  focus: { situation: "deep-work", vibe: "bright", minutes: 25 },
  calm: { situation: "heal-stress", vibe: "calm", minutes: 15 },
  sleep: { situation: "cant-sleep", vibe: "dreamy", minutes: 45 },
  study: { situation: "deep-work", vibe: "minimal", minutes: 30 },
  recover: { situation: "ai-burnout", vibe: "warm", minutes: 15 },
  curious: { situation: "quick-reset", minutes: 10 }
}, On = {
  headphones: "headphones",
  bluetooth: "bluetooth",
  speakers: "speaker",
  unsure: "headphones"
};
function zn(e) {
  return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function Be(e, t = /* @__PURE__ */ new Date()) {
  const n = Tn[e.goal], a = e.timeOfDay === "anytime" ? zn(t.getHours()) : e.timeOfDay, s = {
    situation: n.situation,
    availableMinutes: n.minutes,
    timeOfDay: a,
    sensorySensitivity: e.extraGentle ? "high" : "medium",
    deviceType: On[e.device]
  };
  return Object.freeze(n.vibe === void 0 ? s : { ...s, vibe: n.vibe });
}
const Rn = 3, Dn = 864e5, xe = 4;
function B(e) {
  if (!Number.isFinite(e)) return 0;
  const t = new Date(e).getTimezoneOffset() * 6e4;
  return Math.floor((e - t) / Dn);
}
const $e = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function Cn(e) {
  return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : xe;
}
function Pn(e) {
  return e - (e + 3) % 7;
}
function In(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const i of e) {
    if (!$e(i.day) || i.day < t || i.day > n) continue;
    const r = Number.isFinite(i.minutes) && i.minutes > 0 ? i.minutes : 0;
    a.set(i.day, (a.get(i.day) ?? 0) + r);
  }
  const s = /* @__PURE__ */ new Set();
  return a.forEach((i, r) => {
    i >= Rn && s.add(r);
  }), s;
}
function jn(e, t, n) {
  return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function _n(e, t, n = xe) {
  const a = Cn(n);
  if (!$e(t)) {
    const o = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
    return Object.freeze({ daysListened: 0, goalDays: a, goalMet: !1, quietWeek: !0, dots: o });
  }
  const s = Pn(t), i = In(e, s, t), r = Object.freeze(Array.from({ length: 7 }, (o, c) => jn(s + c, t, i)));
  return Object.freeze({
    daysListened: i.size,
    goalDays: a,
    goalMet: i.size >= a,
    quietWeek: i.size === 0,
    dots: r
  });
}
const ue = "zonked.profile.v1", de = "zonked.journeys.v1", me = "zonked.last.v1", Ge = 32 * 1024, qe = 1, Hn = 1e7, Fn = /^[a-z0-9-]{1,64}$/, We = Object.freeze({
  goal: "curious",
  timeOfDay: "anytime",
  device: "unsure",
  extraGentle: !1,
  createdAt: 0
}), Bn = Object.freeze({}), he = (e) => typeof e == "object" && e !== null && !Array.isArray(e), ae = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, ee = (e, t) => e.some((n) => n === t);
function Ke(e, t) {
  try {
    const n = e.get(t);
    if (n === null || n.length > Ge) return;
    const a = JSON.parse(n);
    return he(a) && a.v === qe ? a : void 0;
  } catch {
    return;
  }
}
function Ye(e, t, n) {
  try {
    const a = JSON.stringify({ v: qe, ...n });
    return a.length > Ge ? !1 : (e.set(t, a), !0);
  } catch {
    return !1;
  }
}
function Ue(e) {
  const { goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: i } = e;
  if (!(!ee(kn, t) || !ee(Sn, n) || !ee(Mn, a)) && !(typeof s != "boolean" || !ae(i, Number.MAX_SAFE_INTEGER)))
    return Object.freeze({ goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: i });
}
function xn(e) {
  const t = Ke(e, ue);
  return (t && Ue(t)) ?? We;
}
function $n(e, t) {
  const n = Ue({ ...t });
  return n !== void 0 && Ye(e, ue, { ...n });
}
function Je(e, t) {
  const n = ce.find((c) => c.id === e);
  if (n === void 0 || !he(t) || !ae(t.startedAt, Hn)) return;
  const { doneDays: a, pickedIds: s } = t;
  if (!Array.isArray(a) || !Array.isArray(s) || s.length > n.days.length) return;
  const i = a, r = s;
  if (!i.every((c) => ae(c, n.days.length) && c >= 1) || !r.every((c) => typeof c == "string" && Fn.test(c))) return;
  const o = [...new Set(i)].sort((c, u) => c - u);
  return Object.freeze({
    startedAt: t.startedAt,
    doneDays: Object.freeze(o),
    pickedIds: Object.freeze([...r])
  });
}
function Gn(e) {
  const t = Ke(e, de), n = t == null ? void 0 : t.journeys;
  if (!he(n)) return Bn;
  const a = {};
  for (const [s, i] of Object.entries(n)) {
    const r = Je(s, i);
    r !== void 0 && (a[s] = r);
  }
  return Object.freeze(a);
}
function qn(e, t) {
  const n = {};
  for (const [a, s] of Object.entries(t)) {
    const i = Je(a, s);
    i !== void 0 && (n[a] = i);
  }
  return Ye(e, de, { journeys: n });
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
function Kn(e) {
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
const Ve = /^[a-z0-9-]{1,80}$/;
function Yn(e) {
  try {
    const t = e.get(me);
    return t !== null && Ve.test(t) ? t : null;
  } catch {
    return null;
  }
}
function Un(e, t) {
  try {
    Ve.test(t) && e.set(me, t);
  } catch {
  }
}
const Jn = 60, Vn = 400;
function Zn(e, t) {
  const n = C(null), [a, s] = M(null);
  T(() => {
    if (e.playing) {
      s(null), n.current = e.templateId === null ? null : { id: e.templateId, name: e.templateName ?? h.brand, minutes: e.elapsedSec / 60 };
      return;
    }
    const r = n.current;
    if (n.current = null, !t || r === null || r.minutes * 60 < Jn) return;
    const o = window.setTimeout(() => s({ ...r, minutes: Math.round(r.minutes) }), Vn);
    return () => window.clearTimeout(o);
  }, [e.playing, e.templateId, e.templateName, e.elapsedSec, t]);
  const i = S(() => s(null), []);
  return P(() => ({ card: a, dismiss: i }), [a, i]);
}
function Xn({ info: e, onAgain: t, onClose: n }) {
  const a = C(null);
  return T(() => {
    var s;
    return (s = a.current) == null ? void 0 : s.focus();
  }, []), /* @__PURE__ */ l("div", { className: "c-overlay", onKeyDown: (s) => s.key === "Escape" && n(), children: /* @__PURE__ */ y("div", { className: "c-dialog c-end", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-end-title", "data-testid": "end-card", children: [
    /* @__PURE__ */ l("h2", { id: "c-end-title", className: "c-h1", children: h.endTitle }),
    /* @__PURE__ */ l("p", { children: h.endLine(e.name, e.minutes) }),
    /* @__PURE__ */ l("p", { className: "c-muted", children: h.endNote }),
    /* @__PURE__ */ y("div", { className: "c-actions", children: [
      /* @__PURE__ */ l("button", { ref: a, type: "button", className: "c-btn c-primary", "data-testid": "end-again", onClick: t, children: h.playAgain }),
      /* @__PURE__ */ l("button", { type: "button", className: "c-btn", "data-testid": "end-close", onClick: n, children: h.close })
    ] })
  ] }) });
}
function Qn({ onAccept: e, onCancel: t }) {
  const n = C(null), a = C(null);
  T(() => {
    var r;
    return (r = n.current) == null ? void 0 : r.focus();
  }, []);
  const i = /* @__PURE__ */ y("div", { className: "c-safety", onKeyDown: (r) => {
    var o;
    if (t !== void 0) {
      if (r.key === "Escape")
        r.stopPropagation(), t();
      else if (r.key === "Tab") {
        const c = r.shiftKey ? a.current : n.current;
        document.activeElement === c && (r.preventDefault(), (o = r.shiftKey ? n.current : a.current) == null || o.focus());
      }
    }
  }, children: [
    /* @__PURE__ */ l("h2", { id: "c-safety-title", children: h.safetyTitle }),
    /* @__PURE__ */ l("ul", { className: "c-safe-list", children: h.safetyLines.map((r) => /* @__PURE__ */ l("li", { children: r }, r)) }),
    /* @__PURE__ */ y("div", { className: "c-actions c-row", children: [
      t !== void 0 && /* @__PURE__ */ l("button", { ref: a, type: "button", className: "c-btn", onClick: t, children: h.back }),
      /* @__PURE__ */ l("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "calm-safety-accept", onClick: e, children: h.safetyAccept })
    ] })
  ] });
  return t === void 0 ? i : /* @__PURE__ */ l("div", { className: "c-overlay", children: /* @__PURE__ */ l("div", { className: "c-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-safety-title", children: i }) });
}
const ea = 1, ta = 720;
function na(e) {
  const t = (e.endedAt - e.startedAt) / 6e4;
  return Number.isFinite(t) && t >= ea ? Math.min(ta, t) : 0;
}
const aa = 200, F = (e = Date.now) => B(e());
function sa(e, t) {
  const n = P(() => Kn(), []), [a, s] = M(() => xn(n)), [i, r] = M(() => Gn(n)), [o, c] = M([]), [u, p] = M(0);
  T(() => {
    let f = !0;
    return e.listLogs(aa).then((m) => f && c(m)).catch(() => {
    }), () => {
      f = !1;
    };
  }, [e, u, t]);
  const A = P(() => {
    const f = o.map((m) => ({ day: B(m.startedAt), minutes: na(m) }));
    return _n(f, F());
  }, [o]), E = S(
    (f) => {
      s(f), $n(n, f);
    },
    [n]
  ), b = S(
    (f, m) => {
      r((k) => {
        const { [f]: v, ...R } = k, I = m === null ? R : { ...R, [f]: m };
        return qn(n, I), I;
      });
    },
    [n]
  ), O = S(() => p((f) => f + 1), []);
  return { storage: n, profile: a, progress: i, week: A, logs: o, setProfile: E, setJourney: b, refresh: O };
}
const ia = ["M", "T", "W", "T", "F", "S", "S"], Le = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], ra = { listened: "listened", rest: "rest day", today: "today", upcoming: "coming up" };
function oa(e, t = !0, n = !1) {
  if (e.quietWeek && n && !t) return h.joinedLine;
  if (e.quietWeek) return t ? h.welcomeBack : h.firstWeek;
  const a = e.daysListened;
  return `${a} ${a === 1 ? "day" : "days"} this week. ${h.restCount}`;
}
function Ze({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: a = !1 }) {
  const s = n && !t && e.quietWeek;
  return /* @__PURE__ */ y("div", { className: a ? "c-week c-week-compact" : "c-week", children: [
    /* @__PURE__ */ l("ul", { className: "c-dots", "aria-label": "This week", children: e.dots.map((i, r) => {
      const o = s && i === "today";
      return /* @__PURE__ */ y("li", { className: `c-dot c-dot-${i}${o ? " c-dot-joined" : ""}`, "data-state": i, children: [
        /* @__PURE__ */ l("span", { className: "c-mark", "aria-hidden": "true", children: o ? /* @__PURE__ */ l(Fe, { name: "check", size: 16 }) : ia[r] }),
        /* @__PURE__ */ l("span", { className: "c-sr", children: `${Le[r]}, ${o ? h.joinedToday : ra[i]}` })
      ] }, Le[r]);
    }) }),
    /* @__PURE__ */ l("p", { className: "c-muted", "data-testid": a ? void 0 : "week-text", children: oa(e, t, s) })
  ] });
}
const la = () => /* @__PURE__ */ new Date();
function ca(e, t, n) {
  var s;
  const a = ((s = e[t]) == null ? void 0 : s.doneDays.length) ?? 0;
  return a === 0 ? h.dayZero(n) : `Day ${Math.min(n, a + 1)} of ${n}`;
}
function ua({ profile: e, week: t, progress: n, reduced: a, crewConnected: s, hasHistory: i = !0, joinedToday: r = !1, now: o = la, last: c = null, onPlay: u, onOpenJourney: p, onGo: A }) {
  const [E, b] = M(0), O = P(() => He(Be(e, o()), 5), [e, o]), f = O[E % Math.max(1, O.length)];
  return /* @__PURE__ */ y("div", { className: "c-today", children: [
    /* @__PURE__ */ y("header", { className: "c-pagehead", children: [
      /* @__PURE__ */ l(le, { size: 72, reduced: a }),
      /* @__PURE__ */ l("h1", { className: "c-greet", "data-testid": "greeting", children: ct(o().getHours()) })
    ] }),
    r && /* @__PURE__ */ l("p", { className: "c-note", "data-testid": "first-run-note", children: h.studioNote }),
    c !== null && /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-primary c-wide c-again", "data-testid": "play-again", onClick: () => u(c), children: `${h.playAgain}: ${c.name}` }),
    f !== void 0 && /* @__PURE__ */ y("section", { className: "c-card c-daily", "aria-labelledby": "c-daily-h", children: [
      /* @__PURE__ */ l("p", { className: "c-eyebrow", children: h.dailyEyebrow }),
      /* @__PURE__ */ l("h2", { id: "c-daily-h", children: f.template.name }),
      /* @__PURE__ */ l("p", { className: "c-muted", children: `${f.template.recommendedMinutes} min. ${f.reasons[0] ?? h.suggested}` }),
      /* @__PURE__ */ y("div", { className: "c-actions", children: [
        /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-primary", "data-testid": "today-play", onClick: () => u(f.template), children: h.start }),
        /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-link", onClick: () => b((m) => m + 1), children: h.notThisOne })
      ] })
    ] }),
    /* @__PURE__ */ y("section", { className: "c-card", "aria-labelledby": "c-goal-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-goal-h", className: "c-h3", children: `Your goal: ${ut[e.goal]}` }),
      /* @__PURE__ */ l(Ze, { week: t, hasHistory: i, joinedToday: r })
    ] }),
    /* @__PURE__ */ y("section", { "aria-labelledby": "c-for-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-for-h", className: "c-h3", children: h.forYou }),
      /* @__PURE__ */ l("ul", { className: "c-hscroll", children: O.map((m, k) => /* @__PURE__ */ l("li", { children: /* @__PURE__ */ y("button", { type: "button", className: `c-mini-card c-g${k % 6 + 1}`, onClick: () => u(m.template), children: [
        /* @__PURE__ */ l("b", { children: m.template.name }),
        /* @__PURE__ */ l("small", { children: m.reasons[0] ?? h.suggested }),
        /* @__PURE__ */ l("em", { children: `${m.template.recommendedMinutes} min` })
      ] }) }, m.template.id)) })
    ] }),
    /* @__PURE__ */ y("section", { "aria-labelledby": "c-jr-h", children: [
      /* @__PURE__ */ l("h2", { id: "c-jr-h", className: "c-h3", children: h.journeysTitle }),
      /* @__PURE__ */ l("ul", { className: "c-hscroll", children: ce.map((m, k) => /* @__PURE__ */ l("li", { children: /* @__PURE__ */ y("button", { type: "button", className: `c-journey-card c-j${k % 6 + 1}`, onClick: () => p(m.id), children: [
        /* @__PURE__ */ l("b", { children: m.title }),
        /* @__PURE__ */ l("small", { children: m.blurb }),
        /* @__PURE__ */ l("em", { children: ca(n, m.id, m.days.length) })
      ] }) }, m.id)) })
    ] }),
    /* @__PURE__ */ y("button", { type: "button", className: "c-card c-link-card", onClick: () => A("library"), children: [
      /* @__PURE__ */ l("b", { children: "Browse all sounds" }),
      /* @__PURE__ */ l("span", { className: "c-muted", children: h.libraryTitle })
    ] }),
    s && /* @__PURE__ */ l("p", { className: "c-card c-crew-chip", role: "status", children: "Crew connected: easing the sound" })
  ] });
}
const da = D(() => import("./chunk-Journeys-BC1HDsMM.mjs").then((e) => ({ default: e.JourneyList }))), ma = D(() => import("./chunk-Journeys-BC1HDsMM.mjs").then((e) => ({ default: e.JourneyDetail }))), ha = D(() => import("./chunk-Library-B7B_w16w.mjs").then((e) => ({ default: e.Library }))), pa = D(() => import("./chunk-PlayerScreen-BP_CpIQl.mjs").then((e) => ({ default: e.PlayerScreen }))), fa = D(() => import("./chunk-CrewScreen-CFQJTezI.mjs").then((e) => ({ default: e.CrewScreen }))), ga = D(() => import("./chunk-NatureScreen-BgfpiPcA.mjs").then((e) => ({ default: e.NatureScreen }))), ya = D(() => import("./chunk-SettingsScreen-C-1DmmRt.mjs").then((e) => ({ default: e.SettingsScreen })));
function ba({ view: e, journeyId: t, s: n, data: a, crewInfo: s, nature: i, still: r, fav: o, last: c, handlers: u }) {
  switch (e) {
    case "journeys":
      return /* @__PURE__ */ l(da, { progress: a.progress, onOpen: u.openJourney, reduced: r });
    case "journey":
      return /* @__PURE__ */ l(
        ma,
        {
          id: t ?? "",
          profile: a.profile,
          progress: a.progress,
          todayDay: F(),
          onBack: () => u.go("journeys"),
          onStartJourney: a.setJourney,
          onRestart: (p) => a.setJourney(p, null),
          onPlayDay: u.playDay
        }
      );
    case "library":
      return /* @__PURE__ */ l(ha, { store: n.store, logs: a.logs, reduced: r, onNature: () => u.go("nature"), onPlay: u.play, onPlayMix: u.onMix });
    case "nature":
      return /* @__PURE__ */ l(ga, { nature: i, reduced: r, onBack: () => u.go("library") });
    case "player":
      return /* @__PURE__ */ l(pa, { player: n.player, snap: n.snap, still: r, favorite: o.on, onToggle: n.toggle, onFavorite: o.toggle, nature: i });
    case "crew":
      return /* @__PURE__ */ l(fa, { crew: s, burnout: n.snap.burnout });
    case "settings":
      return /* @__PURE__ */ l(
        ya,
        {
          gentle: a.profile.extraGentle,
          reduceMotion: n.userReduced,
          reduced: r,
          onGentle: (p) => a.setProfile({ ...a.profile, extraGentle: p }),
          onReduceMotion: n.setReduced,
          onStudio: u.onStudio,
          onForget: u.forget
        }
      );
    default:
      return /* @__PURE__ */ l(
        ua,
        {
          profile: a.profile,
          week: a.week,
          progress: a.progress,
          reduced: r,
          hasHistory: a.logs.some((p) => B(p.startedAt) < F()),
          joinedToday: B(a.profile.createdAt) === F(),
          crewConnected: s.enabled && s.status === "connected",
          last: c,
          onPlay: u.play,
          onOpenJourney: u.openJourney,
          onGo: u.go
        }
      );
  }
}
function va({ profile: e, week: t, joinedToday: n, hasHistory: a, onPlay: s }) {
  const i = P(() => He(Be(e, /* @__PURE__ */ new Date()), 1)[0], [e]);
  return /* @__PURE__ */ y("aside", { className: "c-info c-card", "aria-label": h.infoTitle, children: [
    /* @__PURE__ */ l("p", { className: "c-eyebrow", children: h.dailyEyebrow }),
    i !== void 0 && /* @__PURE__ */ y(Ce, { children: [
      /* @__PURE__ */ l("b", { children: i.template.name }),
      /* @__PURE__ */ l("span", { className: "c-muted", children: `${i.template.recommendedMinutes} min` }),
      /* @__PURE__ */ l("button", { type: "button", className: "c-btn c-small", onClick: () => s(i.template), children: h.start })
    ] }),
    /* @__PURE__ */ l(Ze, { week: t, hasHistory: a, joinedToday: n, compact: !0 })
  ] });
}
let U = null;
const Te = () => U, Oe = (e) => void (U = e);
function wa() {
  U !== null && (U = null, import("./chunk-samples-C3n2Kj1F.mjs").then((e) => e.stopSample()).catch(() => {
  }));
}
const Xe = 8 * 1024 * 1024, Qe = 600, ka = 20, Sa = 2, Ma = 0.45, Aa = 1e-4;
function Na(e) {
  var s;
  const t = ((s = e[0]) == null ? void 0 : s.length) ?? 0, n = new Float32Array(t), a = Math.max(1, e.length);
  for (const i of e) {
    const r = Math.min(t, i.length);
    for (let o = 0; o < r; o++) {
      const c = i[o] ?? 0;
      n[o] = (n[o] ?? 0) + (Number.isFinite(c) ? c : 0) / a;
    }
  }
  return n;
}
function Ea(e, t) {
  const n = e.length - t, a = e.slice(0, n);
  for (let s = 0; s < t; s++) {
    const i = (s + 0.5) / t * (Math.PI / 2);
    a[s] = (e[s] ?? 0) * Math.sin(i) + (e[n + s] ?? 0) * Math.cos(i);
  }
  return a;
}
function La(e, t) {
  if (!Number.isFinite(t) || t <= 0 || e.length === 0) return { ok: !1, error: "This file has no sound in it." };
  const n = Na(e), a = n.length / t;
  if (a > Qe) return { ok: !1, error: "This file is longer than 10 minutes." };
  let s = 0;
  for (const o of n) s = Math.max(s, Math.abs(o));
  if (s < Aa) return { ok: !1, error: "This file is silent." };
  const i = Ma / s;
  for (let o = 0; o < n.length; o++) n[o] = (n[o] ?? 0) * i;
  if (a < ka) return { ok: !0, data: n, loop: !1 };
  const r = Math.min(Math.round(Sa * t), Math.floor(n.length / 4));
  return { ok: !0, data: Ea(n, r), loop: !0 };
}
const Ta = "zonked.mysounds.v1", Oa = 5, za = 20 * 1024 * 1024, N = "sounds", Ra = 60, z = (e) => ({ ok: !1, error: e }), Da = "Your device could not store this sound. Remove one and try again.", et = (e) => /^own:[a-z0-9]{6,40}$/.test(e);
function Ca(e) {
  const t = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, Ra);
  return t === "" ? "My sound" : t;
}
function Pa(e) {
  return new Promise((t, n) => {
    const a = e.open(Ta, 1);
    a.onupgradeneeded = () => void a.result.createObjectStore(N, { keyPath: "id" }), a.onsuccess = () => t(a.result), a.onerror = () => n(a.error ?? new Error("open failed")), a.onblocked = () => n(new Error("blocked"));
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
const $ = () => typeof indexedDB > "u" ? null : indexedDB;
async function G(e, t, n) {
  if (e === null) return z("This browser cannot keep sounds on your device.");
  let a = null;
  try {
    return a = await Pa(e), { ok: !0, value: await t(a) };
  } catch (s) {
    if (s instanceof RangeError) return z(s.message === "count" ? "You can keep 5 sounds. Remove one first." : "Your sounds would use more than 20 MB. Remove one first.");
    const i = s instanceof DOMException && s.name === "QuotaExceededError";
    return z(i ? Da : n);
  } finally {
    a == null || a.close();
  }
}
async function ds(e = $()) {
  return G(e, async (t) => (await pe(t.transaction(N).objectStore(N).getAll())).map((a) => ({ id: a.id, name: a.name, size: a.size })), "Your sounds could not be read.");
}
async function Ia(e, t = $()) {
  if (!et(e)) return z("Unknown sound.");
  const n = await G(t, async (a) => await pe(a.transaction(N).objectStore(N).get(e)), "Your sound could not be read.");
  return n.ok ? n.value === void 0 ? z("That sound is gone.") : { ok: !0, value: n.value.bytes } : n;
}
async function ms(e, t, n = $()) {
  if (t.byteLength > Xe) return z("This file is bigger than 8 MB.");
  const s = { id: `own:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, name: Ca(e), size: t.byteLength, bytes: t };
  return G(n, async (i) => {
    const r = await pe(i.transaction(N).objectStore(N).getAll());
    if (r.length >= Oa) throw new RangeError("count");
    if (r.reduce((c, u) => c + u.size, 0) + s.size > za) throw new RangeError("total");
    const o = i.transaction(N, "readwrite");
    return o.objectStore(N).put(s), await fe(o), { id: s.id, name: s.name, size: s.size };
  }, "Your sound could not be saved.");
}
async function hs(e, t = $()) {
  return G(t, async (n) => {
    const a = n.transaction(N, "readwrite");
    return a.objectStore(N).delete(e), await fe(a), !0;
  }, "That sound could not be removed.");
}
async function ja(e = $()) {
  return G(e, async (t) => {
    const n = t.transaction(N, "readwrite");
    return n.objectStore(N).clear(), await fe(n), !0;
  }, "Your sounds could not be removed.");
}
const _a = async (e) => {
  const t = typeof OfflineAudioContext > "u" ? void 0 : OfflineAudioContext;
  if (t === void 0) throw new Error("no decoder");
  const n = await new t(1, 1, 44100).decodeAudioData(e.slice(0));
  return { channels: Array.from({ length: n.numberOfChannels }, (a, s) => n.getChannelData(s)), sampleRate: n.sampleRate };
};
async function ps(e, t = _a) {
  var i;
  if (e.byteLength > Xe) return z("This file is bigger than 8 MB.");
  if (e.byteLength === 0) return z("This file is empty.");
  let n;
  try {
    n = await t(e);
  } catch {
    return z("This file is not a sound this browser can read.");
  }
  if ((((i = n.channels[0]) == null ? void 0 : i.length) ?? 0) / n.sampleRate > Qe) return z("This file is longer than 10 minutes.");
  const s = La(n.channels, n.sampleRate);
  return s.ok ? { ok: !0, value: !0 } : z(s.error);
}
const ge = "zonked.nature.v1", tt = 0.3, nt = 0.4, Ha = 0.85, ze = { id: null, blend: tt, level: nt }, Re = (e, t, n, a) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : a;
function Fa(e) {
  if (e === null || e.length > 400) return ze;
  try {
    const t = JSON.parse(e);
    return { id: typeof t.id == "string" && /^(own:)?[a-z0-9]{3,40}$/.test(t.id) ? t.id : null, blend: Re(t.blend, 0, 1, tt), level: Re(t.level, 0, Ha, nt) };
  } catch {
    return ze;
  }
}
const ye = () => {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}, Ba = () => {
  var e;
  return Fa(((e = ye()) == null ? void 0 : e.getItem(ge)) ?? null);
};
function De(e) {
  var t;
  try {
    (t = ye()) == null || t.setItem(ge, JSON.stringify(e));
  } catch {
  }
}
function xa() {
  var e;
  try {
    (e = ye()) == null || e.removeItem(ge);
  } catch {
  }
}
const Y = () => import("./chunk-samples-C3n2Kj1F.mjs");
async function $a(e, t) {
  const n = await Y();
  if (!et(e)) return n.startSample(e, t);
  const a = await Ia(e);
  return a.ok ? n.startOwn(e, a.value, t) : { ok: !1, error: a.error };
}
function Ga(e) {
  const [t, n] = M(Ba), [a, s] = M(Te), [i, r] = M(""), o = C(t);
  o.current = t;
  const { player: c, guarded: u } = e;
  T(() => {
    e.snap.playing || (wa(), s(null));
  }, [e.snap.playing]);
  const p = S(
    async (m) => {
      if (r(""), c.snapshot().playing || await c.play(), !c.snapshot().playing) return void r(h.errorAudio);
      (await Y()).setBlend(o.current.blend);
      const v = await $a(m, o.current.level);
      if (!v.ok) return void r(v.error);
      Oe(m), s(m);
      const R = { ...o.current, id: m };
      n(R), De(R);
    },
    [c]
  ), A = S((m) => u(() => void p(m)), [u, p]), E = S(() => {
    Oe(null), s(null), Y().then((m) => m.stopSample());
  }, []), b = S((m, k) => {
    const v = { ...o.current, ...m };
    n(v), De(v), Te() !== null && Y().then(k);
  }, []), O = S((m) => b({ blend: m }, (k) => k.setBlend(m)), [b]), f = S((m) => b({ level: m }, (k) => k.setSampleLevel(m)), [b]);
  return { prefs: t, on: a, message: i, start: A, stop: E, setBlend: O, setLevel: f };
}
async function qa() {
  xa(), await ja();
}
function Wa() {
  const { player: e, store: t } = Ie(), [n, a] = M(() => e.snapshot()), [s, i] = M(dt), [r, o] = M(!1), [c, u, p] = mt(), A = C(null), E = C(s);
  T(() => (a(e.snapshot()), e.subscribe(a)), [e]);
  const b = S(
    (v) => {
      E.current ? v() : (A.current = v, o(!0));
    },
    []
  ), O = S(() => {
    ht(pt, !0), E.current = !0, i(!0), o(!1);
    const v = A.current;
    A.current = null, v == null || v();
  }, []), f = S(() => {
    A.current = null, o(!1);
  }, []), m = S(
    (v, R) => b(() => {
      e.setQueue([v]), e.playTemplate(v).then((I) => {
        I && R !== null && e.startTimer({ kind: "countdown", minutes: R });
      });
    }),
    [e, b]
  ), k = S(() => {
    e.snapshot().playing ? e.stop() : b(() => void e.play());
  }, [e, b]);
  return { player: e, store: t, snap: n, accepted: s, gate: r, reduced: c, setReduced: u, userReduced: p, guarded: b, accept: O, cancelGate: f, playTemplate: m, toggle: k };
}
function Ka(e, t) {
  const [n, a] = M("standalone"), [s, i] = M(() => ft());
  return T(() => gt(i), []), T(() => {
    const r = new yt({
      ...t !== void 0 ? { create: t } : {},
      onStatus: (o) => {
        a(o), o === "standalone" && e.crewLost();
      },
      onState: (o) => e.applyCrew(o)
    });
    return r.start(), () => r.stop();
  }, [e, t]), { enabled: s, status: n };
}
const se = 500, ie = { v: 1, items: [] };
function Ya(e, t) {
  if (!be(e) || x(e, "v") !== 1) return ie;
  const n = x(e, "items");
  if (!Array.isArray(n)) return ie;
  const a = [], s = /* @__PURE__ */ new Set();
  for (const i of n.slice(0, se * 2)) {
    if (!be(i)) continue;
    const r = x(i, "kind"), o = je(x(i, "id"));
    if (r !== "template" && r !== "mix" || o === null) continue;
    const c = `${r}:${o}`;
    if (!s.has(c) && (s.add(c), a.push({ kind: r, id: o, at: bt(x(i, "at"), 0, t + 864e5, t) }), a.length >= se))
      break;
  }
  return { v: 1, items: a };
}
function at(e, t, n) {
  return e.items.some((a) => a.kind === t && a.id === n);
}
function Ua(e, t, n, a) {
  return at(e, t, n) ? { v: 1, items: e.items.filter((s) => !(s.kind === t && s.id === n)) } : je(n) === null || e.items.length >= se ? e : { v: 1, items: [{ kind: t, id: n, at: a }, ...e.items] };
}
function Ja(e, t) {
  const [n, a] = M(ie);
  T(() => {
    let i = !0;
    return e.getRecord("favorites").then((r) => i && a(Ya(r, Date.now()))).catch(() => {
    }), () => {
      i = !1;
    };
  }, [e]);
  const s = S(() => {
    if (t === null) return;
    const i = Ua(n, "template", t, Date.now());
    a(i), e.setRecord("favorites", i).catch(() => {
    });
  }, [n, t, e]);
  return { on: t !== null && at(n, "template", t), toggle: s };
}
const Va = D(() => import("./chunk-Onboarding-Fby0mfLp.mjs").then((e) => ({ default: e.Onboarding }))), Za = (e) => Math.max(180, e * 60 * 0.8);
function Xa({ engine: e, clock: t, store: n, bridgeCreate: a, onStudio: s }) {
  const i = Wa(), r = sa(i.store, i.snap.playing), o = Ka(i.player, a), c = Ga(i), [u, p] = M("today"), [A, E] = M(null), b = C(null), O = Ja(i.store, i.snap.templateId), f = r.profile.createdAt === 0, m = ts(r.storage), k = Zn(i.snap, !f), v = i.reduced || r.profile.extraGentle;
  ns(s);
  const R = r.logs.some((L) => B(L.startedAt) < F()), I = B(r.profile.createdAt) === F(), J = S((L) => p(L), []), { play: V, playDay: it, finish: rt } = Qa({ s: i, data: r, last: m, end: k, active: b, setView: p });
  ss(i.snap.playing, i.snap.elapsedSec, b, r.progress, r.setJourney);
  const ot = (L) => {
    E(L), p("journey");
  }, lt = () => {
    Wn(r.storage), c.stop(), qa(), r.setProfile(We), p("today");
  };
  return /* @__PURE__ */ y("div", { className: "c-app", "data-theme": "auto", "data-motion": v ? "off" : "on", "data-playing": i.snap.playing ? "true" : "false", children: [
    /* @__PURE__ */ l(as, {}),
    /* @__PURE__ */ l("main", { id: "c-main", className: "c-main", tabIndex: -1, children: /* @__PURE__ */ l(Pe, { fallback: /* @__PURE__ */ l("p", { className: "c-loading", role: "status", children: h.loading }), children: f ? /* @__PURE__ */ l(
      Va,
      {
        playing: i.snap.playing,
        reduced: v,
        initial: r.profile,
        onAccept: i.accept,
        onPreview: (L) => i.playTemplate(L, null),
        onStop: () => void i.player.stop(),
        onFinish: rt
      }
    ) : /* @__PURE__ */ l(
      ba,
      {
        view: u,
        journeyId: A,
        s: i,
        data: r,
        crewInfo: o,
        nature: c,
        still: v,
        fav: O,
        last: m.template,
        handlers: { go: J, play: V, playDay: it, openJourney: ot, forget: lt, onStudio: s, onMix: (L) => i.guarded(() => i.player.playMix(L)) }
      }
    ) }) }),
    !f && u !== "player" && /* @__PURE__ */ l(wn, { snap: i.snap, onOpen: () => J("player"), onStop: () => void i.player.stop() }),
    !f && /* @__PURE__ */ l(vn, { view: u, onGo: J, reduced: v }),
    !f && u !== "player" && /* @__PURE__ */ l(va, { profile: r.profile, week: r.week, joinedToday: I, hasHistory: R, onPlay: V }),
    /* @__PURE__ */ l("p", { className: "c-sr", role: "status", "data-testid": "play-status", children: i.snap.playing ? `Playing. ${h.volumeCapped}` : "Stopped." }),
    k.card !== null && !i.snap.playing && /* @__PURE__ */ l(Xn, { info: k.card, onAgain: () => {
      var L;
      return es(((L = k.card) == null ? void 0 : L.id) ?? null, V);
    }, onClose: k.dismiss }),
    i.gate && /* @__PURE__ */ l(Qn, { onAccept: i.accept, onCancel: i.cancelGate })
  ] });
}
function Qa({ s: e, data: t, last: n, end: a, active: s, setView: i }) {
  const r = S(
    (u, p = u.recommendedMinutes) => {
      s.current = null, n.remember(u.id), a.dismiss(), e.playTemplate(u, p), i("player");
    },
    [e, n, a, s, i]
  );
  return { play: r, playDay: (u, p, A) => {
    r(A), s.current = { id: u, no: p, needSec: Za(A.recommendedMinutes) };
  }, finish: (u, p) => {
    if (t.setProfile(u), !e.snap.playing || e.snap.templateId !== p.id) return r(p);
    n.remember(p.id), e.player.startTimer({ kind: "countdown", minutes: p.recommendedMinutes }), i("player");
  } };
}
const st = (e) => e === null ? null : H().find((t) => t.id === e) ?? null;
function es(e, t) {
  const n = st(e);
  n !== null && t(n);
}
function ts(e) {
  const [t, n] = M(() => Yn(e)), a = P(() => st(t), [t]), s = S(
    (i) => {
      Un(e, i), n(i);
    },
    [e]
  );
  return P(() => ({ template: a, remember: s }), [a, s]);
}
function ns(e) {
  T(() => {
    const t = (n) => {
      n.altKey && n.shiftKey && n.code === "KeyS" && (n.preventDefault(), e());
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [e]);
}
function as() {
  return /* @__PURE__ */ y(Ce, { children: [
    /* @__PURE__ */ l("a", { className: "c-skip", href: "#c-main", children: "Skip to content" }),
    /* @__PURE__ */ l("header", { className: "c-topbar", children: /* @__PURE__ */ l("span", { className: "c-brand", children: h.brand }) })
  ] });
}
function ss(e, t, n, a, s) {
  T(() => {
    const i = n.current, r = i === null ? void 0 : a[i.id];
    !e || i === null || r === void 0 || t < i.needSec || (n.current = null, r.doneDays.includes(i.no) || s(i.id, { ...r, doneDays: [...r.doneDays, i.no].sort((o, c) => o - c) }));
  }, [e, t, n, a, s]);
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
function fs() {
  vt(import.meta.url), wt();
  const { engine: e, store: t } = Ie();
  T(() => (ve(!0), () => ve(!1)), []);
  const [n, a] = M(!1);
  return /* @__PURE__ */ y("div", { "data-testid": "zonked-app", style: { height: "100%", minHeight: 0, overflow: "hidden", position: "relative", transform: "translateZ(0)" }, children: [
    /* @__PURE__ */ l("div", { style: { height: "100%", overflowY: "auto" }, children: /* @__PURE__ */ l(Xa, { engine: e, store: t, onStudio: () => a(!0) }) }),
    n && /* @__PURE__ */ l("p", { role: "status", style: is, "data-testid": "studio-note", onClick: () => a(!1), children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close." })
  ] });
}
export {
  We as D,
  kn as G,
  Fe as I,
  ce as J,
  Ha as M,
  ie as N,
  cs as P,
  Qn as S,
  Sn as T,
  fs as Z,
  Mn as a,
  H as b,
  Ya as c,
  Xt as d,
  La as e,
  gn as f,
  us as g,
  ds as h,
  ms as i,
  hs as j,
  ja as k,
  Ba as l,
  Xe as m,
  Be as p,
  He as r,
  ps as v
};
