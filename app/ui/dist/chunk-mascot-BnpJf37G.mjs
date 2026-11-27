import { jsx as e, jsxs as l } from "react/jsx-runtime";
import { useRef as g, useEffect as $, useId as w } from "react";
import { B as Z } from "./chunk-useBreath-g1tM8NNc.mjs";
import { b as I, a as H, u as V } from "./chunk-useBreath-g1tM8NNc.mjs";
const h = "0 0 512 512", p = "#2A2433";
function C() {
  return /* @__PURE__ */ e("svg", { className: "cm-layer cm-shadow", viewBox: h, "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("ellipse", { cx: "256", cy: "476", rx: "150", ry: "22", fill: "#6B3A12", opacity: "0.2", filter: "blur(6px)" }) });
}
function v({ id: t }) {
  return /* @__PURE__ */ l("svg", { className: "cm-layer cm-face", viewBox: h, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ l("g", { filter: `url(#${t}-paint)`, children: [
      /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204", fill: `url(#${t}-gold)` }),
      /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204", fill: `url(#${t}-shade)` })
    ] }),
    /* @__PURE__ */ e("path", { clipPath: `url(#${t}-disc)`, fillRule: "evenodd", fill: "#C8731F", opacity: "0.26", d: "M0 0H512V512H0ZM40 238a196 196 0 1 0 392 0a196 196 0 1 0 -392 0Z" }),
    /* @__PURE__ */ e("rect", { x: "52", y: "52", width: "408", height: "408", fill: "#000", filter: `url(#${t}-grain)`, opacity: "0.1", clipPath: `url(#${t}-disc)` }),
    /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "198", fill: "none", stroke: "#FFF3D0", strokeOpacity: "0.55", strokeWidth: "5", strokeDasharray: "280 1000", strokeLinecap: "round", transform: "rotate(-150 256 256)" })
  ] });
}
function N({ id: t }) {
  const r = (i) => /* @__PURE__ */ l("g", { className: "cm-eye", children: [
    /* @__PURE__ */ e("circle", { cx: i, cy: "172", r: "34", fill: "#FFF6DC" }),
    /* @__PURE__ */ e("circle", { cx: i, cy: "174", r: "21", fill: p }),
    /* @__PURE__ */ e("circle", { cx: i, cy: "174", r: "21", fill: "none", stroke: "#B4531A", strokeWidth: "3", opacity: "0.6" }),
    /* @__PURE__ */ e("circle", { cx: i - 8, cy: "164", r: "7", fill: "#FFFFFF", opacity: "0.9" }),
    /* @__PURE__ */ e("circle", { cx: i + 9, cy: "184", r: "3", fill: "#FFFFFF", opacity: "0.6" })
  ] });
  return /* @__PURE__ */ l("svg", { className: "cm-layer cm-eyes", viewBox: h, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("g", { filter: `url(#${t}-paint)`, children: /* @__PURE__ */ e("path", { d: "M92 170Q92 112 168 114L344 114Q420 112 420 170Q420 230 346 230L300 230Q276 214 256 214Q236 214 212 230L166 230Q92 230 92 170Z", fill: p, stroke: "#8A4A12", strokeWidth: "4", strokeLinejoin: "round" }) }),
    /* @__PURE__ */ e("path", { d: "M118 126Q256 104 394 126", fill: "none", stroke: "#FFFFFF", strokeOpacity: "0.14", strokeWidth: "6", strokeLinecap: "round" }),
    r(178),
    r(334),
    /* @__PURE__ */ e("polygon", { points: "256,142 268,158 256,174 244,158", fill: "#00E5A8", stroke: "#E8B04A", strokeWidth: "4", strokeLinejoin: "round" })
  ] });
}
function M({ id: t, mood: r }) {
  const i = { fill: "none", stroke: p, strokeWidth: 7, strokeLinecap: "round" };
  return /* @__PURE__ */ l("svg", { className: "cm-layer cm-plates", viewBox: h, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("circle", { cx: "132", cy: "276", r: "38", fill: `url(#${t}-blush)` }),
    /* @__PURE__ */ e("circle", { cx: "380", cy: "276", r: "38", fill: `url(#${t}-blush)` }),
    r === "happy" && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M214 292Q256 340 298 292", ...i }),
    r === "sleepy" && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M236 304Q256 310 276 304", ...i, strokeWidth: 6 }),
    r === "breathing" && /* @__PURE__ */ e("ellipse", { className: "cm-mouth", cx: "256", cy: "308", rx: "12", ry: "15", fill: p }),
    (r === "idle" || r === "listening") && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M228 296Q256 322 284 296", ...i })
  ] });
}
function b() {
  return /* @__PURE__ */ e("svg", { className: "cm-layer cm-motes", viewBox: h, "aria-hidden": "true", focusable: "false", children: [
    [70, 110, 4],
    [440, 90, 3],
    [400, 430, 4],
    [90, 410, 3],
    [256, 40, 3],
    [470, 300, 2]
  ].map(([r, i, s], n) => /* @__PURE__ */ e("circle", { className: "cm-mote", style: { animationDelay: `${n * -1.3}s` }, cx: r, cy: i, r: s, fill: "#FFF3C9" }, `${r}-${i}`)) });
}
function A({ id: t }) {
  return /* @__PURE__ */ e("svg", { className: "cm-defs", width: "0", height: "0", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ l("defs", { children: [
    /* @__PURE__ */ l("linearGradient", { id: `${t}-gold`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ e("stop", { offset: "0", stopColor: "#FFE9A8" }),
      /* @__PURE__ */ e("stop", { offset: "0.5", stopColor: "#F6C255" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "#DE9530" })
    ] }),
    /* @__PURE__ */ l("radialGradient", { id: `${t}-shade`, cx: "0.35", cy: "0.3", r: "0.85", children: [
      /* @__PURE__ */ e("stop", { offset: "0.5", stopColor: "#B4531A", stopOpacity: "0" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "#B4531A", stopOpacity: "0.35" })
    ] }),
    /* @__PURE__ */ l("radialGradient", { id: `${t}-blush`, children: [
      /* @__PURE__ */ e("stop", { offset: "0", stopColor: "#F0788A", stopOpacity: "0.6" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "#F0788A", stopOpacity: "0" })
    ] }),
    /* @__PURE__ */ l("filter", { id: `${t}-paint`, x: "-5%", y: "-5%", width: "110%", height: "110%", children: [
      /* @__PURE__ */ e("feTurbulence", { type: "fractalNoise", baseFrequency: "0.035", numOctaves: "2", seed: "3", result: "t" }),
      /* @__PURE__ */ e("feDisplacementMap", { in: "SourceGraphic", in2: "t", scale: "5", xChannelSelector: "R", yChannelSelector: "G" })
    ] }),
    /* @__PURE__ */ e("clipPath", { id: `${t}-disc`, children: /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204" }) }),
    /* @__PURE__ */ l("filter", { id: `${t}-grain`, x: "0", y: "0", width: "100%", height: "100%", children: [
      /* @__PURE__ */ e("feTurbulence", { type: "fractalNoise", baseFrequency: "0.9", numOctaves: "2", seed: "7" }),
      /* @__PURE__ */ e("feColorMatrix", { values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.2 -0.1", result: "n" }),
      /* @__PURE__ */ e("feComposite", { in: "n", in2: "SourceAlpha", operator: "in" })
    ] })
  ] }) });
}
const u = "0 0 512 512", f = "#2A2433";
function L({ id: t }) {
  return /* @__PURE__ */ l("svg", { className: "cm-layer cm-bodyl", viewBox: u, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("defs", { children: /* @__PURE__ */ l("linearGradient", { id: `${t}-cloth`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ e("stop", { offset: "0", stopColor: "#86A5B3" }),
      /* @__PURE__ */ e("stop", { offset: "0.55", stopColor: "#5F7D8B" }),
      /* @__PURE__ */ e("stop", { offset: "1", stopColor: "#5A7886", stopOpacity: "0" })
    ] }) }),
    /* @__PURE__ */ l("g", { className: "cm-chest", filter: `url(#${t}-paint)`, children: [
      /* @__PURE__ */ e("path", { d: "M-14 512C-14 440 34 388 128 366C186 352 220 374 256 374C292 374 326 352 384 366C478 388 526 440 526 512Z", fill: `url(#${t}-cloth)` }),
      /* @__PURE__ */ e("path", { d: "M-14 470C-14 440 34 388 128 366C186 352 220 374 256 374C292 374 326 352 384 366C478 388 526 440 526 470", fill: "none", stroke: "#3F5662", strokeWidth: "5", strokeLinejoin: "round" }),
      /* @__PURE__ */ e("path", { d: "M-14 512C-14 460 28 410 92 384C70 440 74 490 82 512Z", fill: "#E7B36A", opacity: "0.22" }),
      /* @__PURE__ */ e("path", { d: "M526 512C526 450 484 404 420 380C444 440 440 490 432 512Z", fill: "#2A3F4B", opacity: "0.3" }),
      /* @__PURE__ */ e("path", { d: "M188 372Q256 450 324 372", fill: "#4A6573", stroke: "#3F5662", strokeWidth: "6", strokeLinecap: "round", strokeLinejoin: "round" })
    ] }),
    /* @__PURE__ */ e("ellipse", { cx: "256", cy: "456", rx: "150", ry: "24", fill: "#1F2F38", opacity: "0.26", filter: `url(#${t}-paint)` })
  ] });
}
function B() {
  return /* @__PURE__ */ l("svg", { className: "cm-layer cm-band", viewBox: u, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("path", { d: "M44 236C38 -96 474 -96 468 236", fill: "none", stroke: f, strokeWidth: "24", strokeLinecap: "round" }),
    /* @__PURE__ */ e("path", { d: "M66 190C84 20 428 20 446 190", fill: "none", stroke: "#FFF3D0", strokeOpacity: "0.16", strokeWidth: "5", strokeLinecap: "round" }),
    /* @__PURE__ */ l("g", { className: "cm-ear-glow", children: [
      /* @__PURE__ */ e("rect", { x: "14", y: "196", width: "60", height: "116", rx: "28", fill: f, stroke: "#8A4A12", strokeWidth: "4" }),
      /* @__PURE__ */ e("rect", { x: "438", y: "196", width: "60", height: "116", rx: "28", fill: f, stroke: "#8A4A12", strokeWidth: "4" }),
      /* @__PURE__ */ e("rect", { x: "26", y: "222", width: "12", height: "64", rx: "6", fill: "#8FE3D0", opacity: "0.55" }),
      /* @__PURE__ */ e("rect", { x: "474", y: "222", width: "12", height: "64", rx: "6", fill: "#8FE3D0", opacity: "0.55" })
    ] })
  ] });
}
function D() {
  const t = (r, i, s) => /* @__PURE__ */ e(
    "path",
    {
      className: "cm-ripple",
      style: { animationDelay: `${s * -1.6}s` },
      d: `M${r + i * 14} 206Q${r + i * 54} 256 ${r + i * 14} 306`,
      fill: "none",
      stroke: "#8FE3D0",
      strokeWidth: "6",
      strokeLinecap: "round"
    },
    `${r}-${s}`
  );
  return /* @__PURE__ */ l("svg", { className: "cm-layer cm-ripples", viewBox: u, "aria-hidden": "true", focusable: "false", children: [
    [0, 1, 2].map((r) => t(14, -1, r)),
    [0, 1, 2].map((r) => t(498, 1, r))
  ] });
}
const F = 8, W = 40, x = (t) => Number.isFinite(t) ? Math.max(-1, Math.min(1, t)) : 0;
function E(t, r) {
  const i = g(0);
  $(() => {
    const s = t.current;
    if (!r || !s) return;
    const n = (c, a) => {
      const o = Date.now();
      o - i.current < W || (i.current = o, s.style.setProperty("--ry", `${(x(c) * F).toFixed(2)}deg`), s.style.setProperty("--rx", `${(-x(a) * F).toFixed(2)}deg`));
    }, d = (c) => {
      const a = window.innerWidth || 1, o = window.innerHeight || 1;
      n(c.clientX / a * 2 - 1, c.clientY / o * 2 - 1);
    };
    return window.addEventListener("pointermove", d, { passive: !0 }), () => {
      window.removeEventListener("pointermove", d);
    };
  }, [t, r]);
}
function Q() {
  return typeof window < "u" && typeof window.matchMedia == "function" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : !1;
}
const k = (t) => t !== void 0 && Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0;
function j({ mood: t = "idle", size: r = 220, reducedMotion: i, label: s = "Zonked mascot", breathPhase: n, level: d, situation: c }) {
  const a = `cm${w().replace(/[^a-zA-Z0-9]/g, "")}`, o = g(null), m = i ?? Q();
  E(o, !m);
  const y = Number.isFinite(r) ? Math.max(48, Math.min(640, r)) : 220;
  return /* @__PURE__ */ l(
    "div",
    {
      ref: o,
      className: `cm-stage cm-${t}${c ? ` cm-s-${c}` : ""}${m ? " cm-still" : ""}${n !== void 0 ? " cm-driven" : ""}`,
      style: { width: y, height: y, "--bp": k(n), "--lv": d === void 0 && t === "listening" ? 0.35 : k(d) },
      role: "img",
      "aria-label": s,
      "data-mood": t,
      "data-situation": c,
      children: [
        /* @__PURE__ */ e(A, { id: a }),
        /* @__PURE__ */ l("div", { className: "cm-body", children: [
          /* @__PURE__ */ e(C, {}),
          /* @__PURE__ */ e(L, { id: a }),
          /* @__PURE__ */ e("div", { className: "cm-sway", children: /* @__PURE__ */ l("div", { className: "cm-head", children: [
            /* @__PURE__ */ e(D, {}),
            /* @__PURE__ */ e(v, { id: a }),
            /* @__PURE__ */ e(N, { id: a }),
            /* @__PURE__ */ e(M, { id: a, mood: t }),
            /* @__PURE__ */ e(B, {}),
            /* @__PURE__ */ e(b, {})
          ] }) }),
          /* @__PURE__ */ e("span", { className: "cm-z", "aria-hidden": "true", children: "z" })
        ] })
      ]
    }
  );
}
export {
  Z as BreathCue,
  j as CalmMascot,
  I as breathCurve,
  H as breathLabel,
  V as useBreath
};
