import { jsx as e, jsxs as c } from "react/jsx-runtime";
import { useRef as g, useEffect as w, useId as k } from "react";
const d = "0 0 512 512", f = "#2A2433";
function $() {
  return /* @__PURE__ */ e("svg", { className: "cm-layer cm-shadow", viewBox: d, "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("ellipse", { cx: "256", cy: "476", rx: "150", ry: "22", fill: "#6B3A12", opacity: "0.2", filter: "blur(6px)" }) });
}
function v({ id: t }) {
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-ears", viewBox: d, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ c("g", { className: "cm-ear-glow", fill: `url(#${t}-gold)`, stroke: "#9A5416", strokeWidth: "5", children: [
      /* @__PURE__ */ e("rect", { x: "14", y: "206", width: "52", height: "100", rx: "24" }),
      /* @__PURE__ */ e("rect", { x: "446", y: "206", width: "52", height: "100", rx: "24" })
    ] }),
    /* @__PURE__ */ c("g", { fill: f, opacity: "0.7", children: [
      /* @__PURE__ */ e("rect", { x: "32", y: "236", width: "16", height: "10", rx: "5" }),
      /* @__PURE__ */ e("rect", { x: "32", y: "266", width: "16", height: "10", rx: "5" }),
      /* @__PURE__ */ e("rect", { x: "464", y: "236", width: "16", height: "10", rx: "5" }),
      /* @__PURE__ */ e("rect", { x: "464", y: "266", width: "16", height: "10", rx: "5" })
    ] })
  ] });
}
function N({ id: t }) {
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-face", viewBox: d, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ c("g", { filter: `url(#${t}-paint)`, children: [
      /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204", fill: `url(#${t}-gold)` }),
      /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204", fill: `url(#${t}-shade)` })
    ] }),
    /* @__PURE__ */ e("path", { clipPath: `url(#${t}-disc)`, fillRule: "evenodd", fill: "#C8731F", opacity: "0.26", d: "M0 0H512V512H0ZM40 238a196 196 0 1 0 392 0a196 196 0 1 0 -392 0Z" }),
    /* @__PURE__ */ e("rect", { x: "52", y: "52", width: "408", height: "408", fill: "#000", filter: `url(#${t}-grain)`, opacity: "0.1", clipPath: `url(#${t}-disc)` }),
    /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "198", fill: "none", stroke: "#FFF3D0", strokeOpacity: "0.55", strokeWidth: "5", strokeDasharray: "280 1000", strokeLinecap: "round", transform: "rotate(-150 256 256)" })
  ] });
}
function M({ id: t }) {
  const r = (i) => /* @__PURE__ */ c("g", { className: "cm-eye", children: [
    /* @__PURE__ */ e("circle", { cx: i, cy: "172", r: "34", fill: "#FFF6DC" }),
    /* @__PURE__ */ e("circle", { cx: i, cy: "174", r: "21", fill: f }),
    /* @__PURE__ */ e("circle", { cx: i, cy: "174", r: "21", fill: "none", stroke: "#B4531A", strokeWidth: "3", opacity: "0.6" }),
    /* @__PURE__ */ e("circle", { cx: i - 8, cy: "164", r: "7", fill: "#FFFFFF", opacity: "0.9" }),
    /* @__PURE__ */ e("circle", { cx: i + 9, cy: "184", r: "3", fill: "#FFFFFF", opacity: "0.6" })
  ] });
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-eyes", viewBox: d, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("g", { filter: `url(#${t}-paint)`, children: /* @__PURE__ */ e("path", { d: "M92 170Q92 112 168 114L344 114Q420 112 420 170Q420 230 346 230L300 230Q276 214 256 214Q236 214 212 230L166 230Q92 230 92 170Z", fill: f, stroke: "#8A4A12", strokeWidth: "4", strokeLinejoin: "round" }) }),
    /* @__PURE__ */ e("path", { d: "M118 126Q256 104 394 126", fill: "none", stroke: "#FFFFFF", strokeOpacity: "0.14", strokeWidth: "6", strokeLinecap: "round" }),
    r(178),
    r(334),
    /* @__PURE__ */ e("polygon", { points: "256,142 268,158 256,174 244,158", fill: "#00E5A8", stroke: "#E8B04A", strokeWidth: "4", strokeLinejoin: "round" })
  ] });
}
function b({ id: t, mood: r }) {
  const i = { fill: "none", stroke: f, strokeWidth: 7, strokeLinecap: "round" };
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-plates", viewBox: d, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("circle", { cx: "132", cy: "276", r: "38", fill: `url(#${t}-blush)` }),
    /* @__PURE__ */ e("circle", { cx: "380", cy: "276", r: "38", fill: `url(#${t}-blush)` }),
    r === "happy" && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M214 292Q256 340 298 292", ...i }),
    r === "sleepy" && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M236 304Q256 310 276 304", ...i, strokeWidth: 6 }),
    r === "breathing" && /* @__PURE__ */ e("ellipse", { className: "cm-mouth", cx: "256", cy: "308", rx: "12", ry: "15", fill: f }),
    (r === "idle" || r === "listening") && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M228 296Q256 322 284 296", ...i })
  ] });
}
function L() {
  return /* @__PURE__ */ e("svg", { className: "cm-layer cm-motes", viewBox: d, "aria-hidden": "true", focusable: "false", children: [
    [70, 110, 4],
    [440, 90, 3],
    [400, 430, 4],
    [90, 410, 3],
    [256, 40, 3],
    [470, 300, 2]
  ].map(([r, i, l], o) => /* @__PURE__ */ e("circle", { className: "cm-mote", style: { animationDelay: `${o * -1.3}s` }, cx: r, cy: i, r: l, fill: "#FFF3C9" }, `${r}-${i}`)) });
}
function A({ id: t }) {
  return /* @__PURE__ */ e("svg", { className: "cm-defs", width: "0", height: "0", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ c("defs", { children: [
    /* @__PURE__ */ c("linearGradient", { id: `${t}-gold`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ e("stop", { offset: "0", stopColor: "#FFE9A8" }),
      /* @__PURE__ */ e("stop", { offset: "0.5", stopColor: "#F6C255" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "#DE9530" })
    ] }),
    /* @__PURE__ */ c("radialGradient", { id: `${t}-shade`, cx: "0.35", cy: "0.3", r: "0.85", children: [
      /* @__PURE__ */ e("stop", { offset: "0.5", stopColor: "#B4531A", stopOpacity: "0" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "#B4531A", stopOpacity: "0.35" })
    ] }),
    /* @__PURE__ */ c("radialGradient", { id: `${t}-blush`, children: [
      /* @__PURE__ */ e("stop", { offset: "0", stopColor: "#F0788A", stopOpacity: "0.6" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "#F0788A", stopOpacity: "0" })
    ] }),
    /* @__PURE__ */ c("filter", { id: `${t}-paint`, x: "-5%", y: "-5%", width: "110%", height: "110%", children: [
      /* @__PURE__ */ e("feTurbulence", { type: "fractalNoise", baseFrequency: "0.035", numOctaves: "2", seed: "3", result: "t" }),
      /* @__PURE__ */ e("feDisplacementMap", { in: "SourceGraphic", in2: "t", scale: "5", xChannelSelector: "R", yChannelSelector: "G" })
    ] }),
    /* @__PURE__ */ e("clipPath", { id: `${t}-disc`, children: /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204" }) }),
    /* @__PURE__ */ c("filter", { id: `${t}-grain`, x: "0", y: "0", width: "100%", height: "100%", children: [
      /* @__PURE__ */ e("feTurbulence", { type: "fractalNoise", baseFrequency: "0.9", numOctaves: "2", seed: "7" }),
      /* @__PURE__ */ e("feColorMatrix", { values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.2 -0.1", result: "n" }),
      /* @__PURE__ */ e("feComposite", { in: "n", in2: "SourceAlpha", operator: "in" })
    ] })
  ] }) });
}
const u = "0 0 512 512", B = "#2A2433", C = "#6E8C9A";
function Q({ id: t }) {
  return /* @__PURE__ */ e("svg", { className: "cm-layer cm-bodyl", viewBox: u, "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ c("g", { className: "cm-chest", filter: `url(#${t}-paint)`, children: [
    /* @__PURE__ */ e("path", { d: "M30 520Q36 410 140 392Q256 372 372 392Q476 410 482 520Z", fill: C, stroke: "#3F5662", strokeWidth: "5", strokeLinejoin: "round" }),
    /* @__PURE__ */ e("path", { d: "M30 520Q36 440 96 410Q70 450 78 520Z", fill: "#E7B36A", opacity: "0.28" }),
    /* @__PURE__ */ e("path", { d: "M482 520Q476 430 410 402Q448 450 440 520Z", fill: "#2A3F4B", opacity: "0.3" }),
    /* @__PURE__ */ e("path", { d: "M206 384Q256 420 306 384", fill: "none", stroke: "#3F5662", strokeWidth: "6", strokeLinecap: "round" })
  ] }) });
}
function W() {
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-band", viewBox: u, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("path", { d: "M40 236C34 -96 478 -96 472 236", fill: "none", stroke: B, strokeWidth: "24", strokeLinecap: "round" }),
    /* @__PURE__ */ e("path", { d: "M62 190C80 20 432 20 450 190", fill: "none", stroke: "#FFF3D0", strokeOpacity: "0.16", strokeWidth: "5", strokeLinecap: "round" })
  ] });
}
function E() {
  const t = (r, i, l) => /* @__PURE__ */ e(
    "path",
    {
      className: "cm-ripple",
      style: { animationDelay: `${l * -1.6}s` },
      d: `M${r + i * 14} 206Q${r + i * 54} 256 ${r + i * 14} 306`,
      fill: "none",
      stroke: "#8FE3D0",
      strokeWidth: "6",
      strokeLinecap: "round"
    },
    `${r}-${l}`
  );
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-ripples", viewBox: u, "aria-hidden": "true", focusable: "false", children: [
    [0, 1, 2].map((r) => t(14, -1, r)),
    [0, 1, 2].map((r) => t(498, 1, r))
  ] });
}
const y = 8, D = 40, F = (t) => Number.isFinite(t) ? Math.max(-1, Math.min(1, t)) : 0;
function O(t, r) {
  const i = g(0);
  w(() => {
    const l = t.current;
    if (!r || !l) return;
    const o = (s, a) => {
      const n = Date.now();
      n - i.current < D || (i.current = n, l.style.setProperty("--ry", `${(F(s) * y).toFixed(2)}deg`), l.style.setProperty("--rx", `${(-F(a) * y).toFixed(2)}deg`));
    }, h = (s) => {
      const a = window.innerWidth || 1, n = window.innerHeight || 1;
      o(s.clientX / a * 2 - 1, s.clientY / n * 2 - 1);
    };
    return window.addEventListener("pointermove", h, { passive: !0 }), () => {
      window.removeEventListener("pointermove", h);
    };
  }, [t, r]);
}
function P() {
  return typeof window < "u" && typeof window.matchMedia == "function" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : !1;
}
const x = (t) => t !== void 0 && Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0;
function S({ mood: t = "idle", size: r = 220, reducedMotion: i, label: l = "Zonked mascot", breathPhase: o, level: h, situation: s }) {
  const a = `cm${k().replace(/[^a-zA-Z0-9]/g, "")}`, n = g(null), p = i ?? P();
  O(n, !p);
  const m = Number.isFinite(r) ? Math.max(48, Math.min(640, r)) : 220;
  return /* @__PURE__ */ c(
    "div",
    {
      ref: n,
      className: `cm-stage cm-${t}${s ? ` cm-s-${s}` : ""}${p ? " cm-still" : ""}${o !== void 0 ? " cm-driven" : ""}`,
      style: { width: m, height: m, "--bp": x(o), "--lv": h === void 0 && t === "listening" ? 0.35 : x(h) },
      role: "img",
      "aria-label": l,
      "data-mood": t,
      "data-situation": s,
      children: [
        /* @__PURE__ */ e(A, { id: a }),
        /* @__PURE__ */ c("div", { className: "cm-body", children: [
          /* @__PURE__ */ e($, {}),
          /* @__PURE__ */ e(Q, { id: a }),
          /* @__PURE__ */ e("div", { className: "cm-sway", children: /* @__PURE__ */ c("div", { className: "cm-head", children: [
            /* @__PURE__ */ e(E, {}),
            /* @__PURE__ */ e(v, { id: a }),
            /* @__PURE__ */ e(N, { id: a }),
            /* @__PURE__ */ e(M, { id: a }),
            /* @__PURE__ */ e(b, { id: a, mood: t }),
            /* @__PURE__ */ e(W, {}),
            /* @__PURE__ */ e(L, {})
          ] }) }),
          /* @__PURE__ */ e("span", { className: "cm-z", "aria-hidden": "true", children: "z" })
        ] })
      ]
    }
  );
}
export {
  S as CalmMascot
};
