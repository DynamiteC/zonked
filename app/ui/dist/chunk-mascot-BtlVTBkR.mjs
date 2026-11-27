import { jsx as e, jsxs as c } from "react/jsx-runtime";
import { useRef as m, useEffect as y, useId as x } from "react";
const n = "0 0 512 512", h = "#2A2433";
function g() {
  return /* @__PURE__ */ e("svg", { className: "cm-layer cm-shadow", viewBox: n, "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ e("ellipse", { cx: "256", cy: "476", rx: "150", ry: "22", fill: "#6B3A12", opacity: "0.2", filter: "blur(6px)" }) });
}
function F({ id: t }) {
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-ears", viewBox: n, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ c("g", { className: "cm-ear-glow", fill: `url(#${t}-gold)`, stroke: "#9A5416", strokeWidth: "5", children: [
      /* @__PURE__ */ e("rect", { x: "14", y: "206", width: "52", height: "100", rx: "24" }),
      /* @__PURE__ */ e("rect", { x: "446", y: "206", width: "52", height: "100", rx: "24" })
    ] }),
    /* @__PURE__ */ c("g", { fill: h, opacity: "0.7", children: [
      /* @__PURE__ */ e("rect", { x: "32", y: "236", width: "16", height: "10", rx: "5" }),
      /* @__PURE__ */ e("rect", { x: "32", y: "266", width: "16", height: "10", rx: "5" }),
      /* @__PURE__ */ e("rect", { x: "464", y: "236", width: "16", height: "10", rx: "5" }),
      /* @__PURE__ */ e("rect", { x: "464", y: "266", width: "16", height: "10", rx: "5" })
    ] })
  ] });
}
function w({ id: t }) {
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-face", viewBox: n, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ c("g", { filter: `url(#${t}-paint)`, children: [
      /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204", fill: `url(#${t}-gold)` }),
      /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "204", fill: `url(#${t}-shade)` })
    ] }),
    /* @__PURE__ */ e("rect", { x: "52", y: "52", width: "408", height: "408", fill: "#000", filter: `url(#${t}-grain)`, opacity: "0.1", clipPath: `url(#${t}-disc)` }),
    /* @__PURE__ */ e("circle", { cx: "256", cy: "256", r: "198", fill: "none", stroke: "#FFF3D0", strokeOpacity: "0.55", strokeWidth: "5", strokeDasharray: "280 1000", strokeLinecap: "round", transform: "rotate(-150 256 256)" })
  ] });
}
function v({ id: t }) {
  const r = (i) => /* @__PURE__ */ c("g", { className: "cm-eye", children: [
    /* @__PURE__ */ e("circle", { cx: i, cy: "172", r: "34", fill: "#FFF6DC" }),
    /* @__PURE__ */ e("circle", { cx: i, cy: "174", r: "21", fill: h }),
    /* @__PURE__ */ e("circle", { cx: i, cy: "174", r: "21", fill: "none", stroke: "#B4531A", strokeWidth: "3", opacity: "0.6" }),
    /* @__PURE__ */ e("circle", { cx: i - 8, cy: "164", r: "7", fill: "#FFFFFF", opacity: "0.9" }),
    /* @__PURE__ */ e("circle", { cx: i + 9, cy: "184", r: "3", fill: "#FFFFFF", opacity: "0.6" })
  ] });
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-eyes", viewBox: n, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("g", { filter: `url(#${t}-paint)`, children: /* @__PURE__ */ e("path", { d: "M92 170Q92 112 168 114L344 114Q420 112 420 170Q420 230 346 230L300 230Q276 214 256 214Q236 214 212 230L166 230Q92 230 92 170Z", fill: h, stroke: "#8A4A12", strokeWidth: "4", strokeLinejoin: "round" }) }),
    /* @__PURE__ */ e("path", { d: "M118 126Q256 104 394 126", fill: "none", stroke: "#FFFFFF", strokeOpacity: "0.14", strokeWidth: "6", strokeLinecap: "round" }),
    r(178),
    r(334),
    /* @__PURE__ */ e("polygon", { points: "256,142 268,158 256,174 244,158", fill: "#00E5A8", stroke: "#E8B04A", strokeWidth: "4", strokeLinejoin: "round" })
  ] });
}
function k({ id: t, mood: r }) {
  const i = { fill: "none", stroke: h, strokeWidth: 7, strokeLinecap: "round" };
  return /* @__PURE__ */ c("svg", { className: "cm-layer cm-plates", viewBox: n, "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ e("circle", { cx: "132", cy: "276", r: "38", fill: `url(#${t}-blush)` }),
    /* @__PURE__ */ e("circle", { cx: "380", cy: "276", r: "38", fill: `url(#${t}-blush)` }),
    r === "happy" && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M214 292Q256 340 298 292", ...i }),
    r === "sleepy" && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M236 304Q256 310 276 304", ...i, strokeWidth: 6 }),
    r === "breathing" && /* @__PURE__ */ e("ellipse", { className: "cm-mouth", cx: "256", cy: "308", rx: "12", ry: "15", fill: h }),
    (r === "idle" || r === "listening") && /* @__PURE__ */ e("path", { className: "cm-mouth", d: "M228 296Q256 322 284 296", ...i })
  ] });
}
function N() {
  return /* @__PURE__ */ e("svg", { className: "cm-layer cm-motes", viewBox: n, "aria-hidden": "true", focusable: "false", children: [
    [70, 110, 4],
    [440, 90, 3],
    [400, 430, 4],
    [90, 410, 3],
    [256, 40, 3],
    [470, 300, 2]
  ].map(([r, i, s], l) => /* @__PURE__ */ e("circle", { className: "cm-mote", style: { animationDelay: `${l * -1.3}s` }, cx: r, cy: i, r: s, fill: "#FFF3C9" }, `${r}-${i}`)) });
}
function $({ id: t }) {
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
const u = 8, b = 40, p = (t) => Number.isFinite(t) ? Math.max(-1, Math.min(1, t)) : 0;
function M(t, r) {
  const i = m(0);
  y(() => {
    const s = t.current;
    if (!r || !s) return;
    const l = (a, o) => {
      const f = Date.now();
      f - i.current < b || (i.current = f, s.style.setProperty("--ry", `${(p(a) * u).toFixed(2)}deg`), s.style.setProperty("--rx", `${(-p(o) * u).toFixed(2)}deg`));
    }, d = (a) => {
      const o = window.innerWidth || 1, f = window.innerHeight || 1;
      l(a.clientX / o * 2 - 1, a.clientY / f * 2 - 1);
    };
    return window.addEventListener("pointermove", d, { passive: !0 }), () => {
      window.removeEventListener("pointermove", d);
    };
  }, [t, r]);
}
function A() {
  return typeof window < "u" && typeof window.matchMedia == "function" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : !1;
}
function B({ mood: t = "idle", size: r = 220, reducedMotion: i, label: s = "Zonked mascot" }) {
  const l = `cm${x().replace(/[^a-zA-Z0-9]/g, "")}`, d = m(null), a = i ?? A();
  M(d, !a);
  const o = Number.isFinite(r) ? Math.max(48, Math.min(640, r)) : 220;
  return /* @__PURE__ */ c(
    "div",
    {
      ref: d,
      className: `cm-stage cm-${t}${a ? " cm-still" : ""}`,
      style: { width: o, height: o },
      role: "img",
      "aria-label": s,
      "data-mood": t,
      children: [
        /* @__PURE__ */ e($, { id: l }),
        /* @__PURE__ */ c("div", { className: "cm-body", children: [
          /* @__PURE__ */ c("div", { className: "cm-head", children: [
            /* @__PURE__ */ e(g, {}),
            /* @__PURE__ */ e(F, { id: l }),
            /* @__PURE__ */ e(w, { id: l }),
            /* @__PURE__ */ e(v, { id: l }),
            /* @__PURE__ */ e(k, { id: l, mood: t }),
            /* @__PURE__ */ e(N, {})
          ] }),
          /* @__PURE__ */ e("span", { className: "cm-z", "aria-hidden": "true", children: "z" })
        ] })
      ]
    }
  );
}
export {
  B as CalmMascot
};
