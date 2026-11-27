import { jsxs as l, Fragment as o, jsx as e } from "react/jsx-runtime";
import { useId as h, useState as p, useEffect as y } from "react";
const f = "0 0 320 200", a = (c) => ({ "--dl": `${c}s` }), v = (c, t, s) => ({ "--dl": `${c}s`, "--dx": t, "--dy": s }), m = [
  [70, 70, 1.6, -0.2],
  [118, 112, 1.2, -1.1],
  [150, 56, 1.4, -2.1],
  [196, 98, 1.8, -0.7],
  [222, 64, 1.2, -1.6],
  [248, 124, 1.5, -2.5],
  [102, 140, 1.1, -0.4],
  [176, 134, 1.3, -1.9]
];
function x({ id: c }) {
  return /* @__PURE__ */ l(o, { children: [
    /* @__PURE__ */ e("defs", { children: /* @__PURE__ */ l("radialGradient", { id: `${c}-g`, cx: "0.5", cy: "0.5", r: "0.5", children: [
      /* @__PURE__ */ e("stop", { offset: "0", stopColor: "var(--e)", stopOpacity: "0.8" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "var(--e)", stopOpacity: "0" })
    ] }) }),
    /* @__PURE__ */ e("rect", { width: "320", height: "200", className: "va" }),
    /* @__PURE__ */ e("rect", { y: "110", width: "320", height: "90", className: "vb" }),
    /* @__PURE__ */ l("g", { className: "vc", children: [
      /* @__PURE__ */ e("rect", { x: "26", y: "40", width: "96", height: "5" }),
      /* @__PURE__ */ e("rect", { x: "26", y: "78", width: "96", height: "5" }),
      /* @__PURE__ */ e("rect", { x: "32", y: "22", width: "9", height: "18" }),
      /* @__PURE__ */ e("rect", { x: "44", y: "26", width: "7", height: "14" }),
      /* @__PURE__ */ e("rect", { x: "54", y: "20", width: "10", height: "20" }),
      /* @__PURE__ */ e("rect", { x: "34", y: "60", width: "12", height: "18" }),
      /* @__PURE__ */ e("rect", { x: "50", y: "64", width: "8", height: "14" }),
      /* @__PURE__ */ e("rect", { x: "86", y: "58", width: "22", height: "20", rx: "3" })
    ] }),
    /* @__PURE__ */ e("circle", { className: "vl-wglow", cx: "214", cy: "104", r: "86", fill: `url(#${c}-g)` }),
    /* @__PURE__ */ l("g", { className: "vd", children: [
      /* @__PURE__ */ e("rect", { x: "0", y: "152", width: "320", height: "48" }),
      /* @__PURE__ */ e("rect", { x: "190", y: "150", width: "46", height: "4", rx: "2", opacity: "0.6" })
    ] }),
    /* @__PURE__ */ e("path", { className: "vc", d: "M213 150L215 114L209 114L207 150Z" }),
    /* @__PURE__ */ e("path", { className: "ve", d: "M196 114L204 90Q214 82 224 90L232 114Z" }),
    /* @__PURE__ */ e("rect", { className: "vd", x: "196", y: "148", width: "34", height: "5", rx: "2" }),
    m.map(([t, s, r, i]) => /* @__PURE__ */ e("circle", { className: "vf vl-drift", style: v(i, 4 + r, -6 - r), cx: t, cy: s, r }, `${t}-${s}`))
  ] });
}
function u({ id: c }) {
  const t = [20, 52, 84, 116, 148, 180, 212, 244, 276, 300];
  return /* @__PURE__ */ l(o, { children: [
    /* @__PURE__ */ l("defs", { children: [
      /* @__PURE__ */ l("radialGradient", { id: `${c}-cg`, cx: "0.5", cy: "0.5", r: "0.5", children: [
        /* @__PURE__ */ e("stop", { offset: "0", stopColor: "var(--e)", stopOpacity: "0.55" }),
        /* @__PURE__ */ e("stop", { offset: "1", stopColor: "var(--e)", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ l("radialGradient", { id: `${c}-cd`, cx: "0.38", cy: "0.34", r: "0.8", children: [
        /* @__PURE__ */ e("stop", { offset: "0", stopColor: "#FFFFFF", stopOpacity: "0.9" }),
        /* @__PURE__ */ e("stop", { offset: "0.45", stopColor: "var(--e)" }),
        /* @__PURE__ */ e("stop", { offset: "1", stopColor: "var(--e)", stopOpacity: "0.7" })
      ] })
    ] }),
    /* @__PURE__ */ e("rect", { width: "320", height: "200", className: "va" }),
    /* @__PURE__ */ e("circle", { className: "vl-halo", cx: "238", cy: "62", r: "60", fill: `url(#${c}-cg)` }),
    /* @__PURE__ */ e("circle", { cx: "238", cy: "62", r: "22", fill: `url(#${c}-cd)` }),
    /* @__PURE__ */ l("g", { className: "vf vl-cloud", style: a(0), children: [
      /* @__PURE__ */ e("ellipse", { cx: "70", cy: "48", rx: "34", ry: "9", opacity: "0.7" }),
      /* @__PURE__ */ e("ellipse", { cx: "92", cy: "42", rx: "22", ry: "8", opacity: "0.7" })
    ] }),
    /* @__PURE__ */ l("g", { className: "vf vl-cloud", style: a(-1.5), children: [
      /* @__PURE__ */ e("ellipse", { cx: "190", cy: "30", rx: "28", ry: "7", opacity: "0.6" }),
      /* @__PURE__ */ e("ellipse", { cx: "206", cy: "26", rx: "16", ry: "6", opacity: "0.6" })
    ] }),
    /* @__PURE__ */ e("path", { className: "vb", d: "M0 132Q70 96 150 122T320 108V200H0Z" }),
    /* @__PURE__ */ e("path", { className: "vc", d: "M0 150Q90 116 180 146T320 134V200H0Z" }),
    /* @__PURE__ */ e("path", { className: "vd", d: "M0 176Q110 142 220 172T320 164V200H0Z" }),
    t.map((s, r) => /* @__PURE__ */ e("path", { className: "vd vl-sway", style: a(-(r % 5) * 0.6), d: `M${s} 200Q${s - 2} 188 ${s + 3} 178`, fill: "none", stroke: "var(--d)", strokeWidth: "3", strokeLinecap: "round" }, s))
  ] });
}
const g = [
  [40, 30, 1.4, 0],
  [84, 58, 1, -1],
  [128, 24, 1.2, -2],
  [168, 52, 1, -0.5],
  [206, 20, 1.3, -1.5],
  [284, 40, 1.2, -2.5],
  [60, 96, 1, -1.2],
  [150, 88, 1.2, -0.3],
  [262, 92, 1, -2.2],
  [300, 70, 1, -0.8]
];
function N({ id: c }) {
  return /* @__PURE__ */ l(o, { children: [
    /* @__PURE__ */ l("defs", { children: [
      /* @__PURE__ */ l("radialGradient", { id: `${c}-mg`, cx: "0.5", cy: "0.5", r: "0.5", children: [
        /* @__PURE__ */ e("stop", { offset: "0", stopColor: "var(--e)", stopOpacity: "0.55" }),
        /* @__PURE__ */ e("stop", { offset: "1", stopColor: "var(--e)", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ l("radialGradient", { id: `${c}-md`, cx: "0.38", cy: "0.34", r: "0.8", children: [
        /* @__PURE__ */ e("stop", { offset: "0", stopColor: "#FFFFFF", stopOpacity: "0.9" }),
        /* @__PURE__ */ e("stop", { offset: "0.45", stopColor: "var(--e)" }),
        /* @__PURE__ */ e("stop", { offset: "1", stopColor: "var(--e)", stopOpacity: "0.7" })
      ] })
    ] }),
    /* @__PURE__ */ e("rect", { width: "320", height: "200", className: "va" }),
    /* @__PURE__ */ e("rect", { y: "90", width: "320", height: "110", className: "vb", opacity: "0.5" }),
    /* @__PURE__ */ e("circle", { className: "vl-halo", cx: "232", cy: "62", r: "56", fill: `url(#${c}-mg)` }),
    /* @__PURE__ */ e("circle", { cx: "232", cy: "62", r: "19", fill: `url(#${c}-md)` }),
    /* @__PURE__ */ l("g", { className: "va", opacity: "0.14", children: [
      /* @__PURE__ */ e("circle", { cx: "226", cy: "68", r: "4" }),
      /* @__PURE__ */ e("circle", { cx: "238", cy: "56", r: "3" }),
      /* @__PURE__ */ e("circle", { cx: "233", cy: "72", r: "2" })
    ] }),
    g.map(([t, s, r, i], d) => /* @__PURE__ */ e("circle", { className: `vf ${d % 2 ? "vl-twinkle" : "vl-twinkle2"}`, style: a(i), cx: t, cy: s, r }, `${t}-${s}`)),
    /* @__PURE__ */ e("g", { className: "vf vl-cloud", style: a(-0.8), children: /* @__PURE__ */ e("ellipse", { cx: "110", cy: "110", rx: "46", ry: "6", opacity: "0.18" }) }),
    /* @__PURE__ */ e("path", { className: "vc", d: "M0 150Q60 118 130 140T250 130T320 144V200H0Z" }),
    /* @__PURE__ */ e("path", { className: "vd", d: "M0 176Q80 150 170 172T320 160V200H0Z" })
  ] });
}
const w = [
  [44, 20, 0],
  [90, 40, -1.1],
  [140, 14, -2.2],
  [190, 34, -0.6],
  [236, 18, -1.7],
  [282, 44, -2.6]
], $ = [[80, 170, 0], [150, 182, -1], [226, 168, -2], [270, 186, -0.5]];
function F() {
  return /* @__PURE__ */ l(o, { children: [
    /* @__PURE__ */ e("rect", { width: "320", height: "200", className: "va" }),
    /* @__PURE__ */ e("rect", { y: "120", width: "320", height: "80", className: "vb" }),
    /* @__PURE__ */ l("g", { className: "vc", children: [
      /* @__PURE__ */ e("ellipse", { cx: "40", cy: "20", rx: "70", ry: "30" }),
      /* @__PURE__ */ e("ellipse", { cx: "250", cy: "10", rx: "90", ry: "34" })
    ] }),
    /* @__PURE__ */ l("g", { className: "vd", children: [
      /* @__PURE__ */ e("g", { transform: "rotate(-16 52 76)", children: /* @__PURE__ */ e("ellipse", { className: "vl-sway", style: a(0), cx: "52", cy: "76", rx: "44", ry: "13" }) }),
      /* @__PURE__ */ e("g", { transform: "rotate(14 262 64)", children: /* @__PURE__ */ e("ellipse", { className: "vl-sway", style: a(-1.2), cx: "262", cy: "64", rx: "48", ry: "14" }) })
    ] }),
    w.map(([c, t, s]) => /* @__PURE__ */ e("line", { className: "vf vl-fall", style: a(s), x1: c, y1: t, x2: c - 2, y2: t + 10, stroke: "var(--f)", strokeWidth: "1.4", strokeLinecap: "round" }, c)),
    [136, 150, 164, 178].map((c, t) => /* @__PURE__ */ e("path", { className: "vl-shimmer", style: a(-t * 0.7), d: `M${30 + t * 20} ${c}Q${90 + t * 10} ${c - 6} ${150 + t * 14} ${c}T290 ${c}`, fill: "none", stroke: "var(--f)", strokeWidth: "1.6", strokeLinecap: "round" }, c)),
    $.map(([c, t, s]) => /* @__PURE__ */ e("ellipse", { className: "vl-ring", style: a(s), cx: c, cy: t, rx: "12", ry: "3", fill: "none", stroke: "var(--f)", strokeWidth: "1.2" }, c))
  ] });
}
const k = () => typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function C() {
  const [c, t] = p(typeof document < "u" && document.hidden);
  return y(() => {
    const s = () => t(document.hidden);
    return document.addEventListener("visibilitychange", s), () => {
      document.removeEventListener("visibilitychange", s);
    };
  }, []), c;
}
function L({ situation: c, reducedMotion: t, theme: s }) {
  const r = `sl${h().replace(/[^a-zA-Z0-9]/g, "")}`, i = C(), d = t ?? k(), n = `vl vl-${c}${d ? " vl-still" : ""}${i ? " vl-paused" : ""}`;
  return /* @__PURE__ */ l("svg", { className: n, "data-vl": s, "data-situation": c, viewBox: f, preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true", focusable: "false", children: [
    c === "focus" && /* @__PURE__ */ e(x, { id: r }),
    c === "calm" && /* @__PURE__ */ e(u, { id: r }),
    c === "sleep" && /* @__PURE__ */ e(N, { id: r }),
    c === "nature" && /* @__PURE__ */ e(F, {})
  ] });
}
export {
  L as SceneLoop
};
