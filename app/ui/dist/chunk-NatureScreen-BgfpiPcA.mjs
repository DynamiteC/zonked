import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { useState as p, Suspense as s, lazy as u } from "react";
import { listSamples as h } from "./chunk-samples-C3n2Kj1F.mjs";
import { C as a } from "./chunk-crewLink-Cq0htOCx.mjs";
import { P as b, I as N, M as f } from "./chunk-App-CzOQ23by.mjs";
const C = { wind: "breeze", waterfall: "rapids", flute: "wave" }, k = u(() => import("./chunk-MySounds-CqMfE5iF.mjs").then((t) => ({ default: t.MySounds }))), v = u(() => import("./chunk-Credits-lek4wGmJ.mjs").then((t) => ({ default: t.Credits })));
function o({ id: t, label: r, value: c, max: l, onChange: d }) {
  return /* @__PURE__ */ i("div", { className: "c-slider", children: [
    /* @__PURE__ */ e("label", { htmlFor: t, children: r }),
    /* @__PURE__ */ e("input", { id: t, type: "range", min: 0, max: l, step: 0.05, value: c, "aria-valuetext": `${Math.round(c / l * 100)} percent`, onChange: (n) => d(Number(n.currentTarget.value)) })
  ] });
}
function y({ nature: t }) {
  return /* @__PURE__ */ i("div", { className: "c-nature-controls", children: [
    /* @__PURE__ */ e(o, { id: "c-blend", label: a.natureBlend, value: t.prefs.blend, max: 1, onChange: t.setBlend }),
    /* @__PURE__ */ e(o, { id: "c-nlevel", label: a.natureLevel, value: t.prefs.level, max: f, onChange: t.setLevel })
  ] });
}
function $({ nature: t, reduced: r, onBack: c }) {
  const [l, d] = p(null);
  return /* @__PURE__ */ i("div", { className: "c-nature", children: [
    /* @__PURE__ */ e(b, { title: a.natureHead, reduced: r }),
    /* @__PURE__ */ e("p", { className: "c-lead", children: a.natureIntro }),
    /* @__PURE__ */ e("ul", { className: "c-tiles c-nature-tiles", children: h().map((n, m) => /* @__PURE__ */ i("li", { children: [
      /* @__PURE__ */ i("button", { type: "button", className: `c-tile c-g${m % 6 + 1}`, "data-testid": `nature-${n.id}`, "aria-pressed": t.on === n.id, onClick: () => t.start(n.id), children: [
        /* @__PURE__ */ e(N, { name: C[n.id] ?? n.id }),
        /* @__PURE__ */ e("span", { className: "c-tile-name", children: n.label }),
        /* @__PURE__ */ e("span", { className: "c-tile-mood", children: n.kind === "synth" ? n.note ?? a.natureMade : a.natureFree }),
        t.on === n.id && /* @__PURE__ */ e("span", { className: "c-tile-count", children: a.natureOn })
      ] }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link c-small", "aria-expanded": l === n.id, onClick: () => d(l === n.id ? null : n.id), children: `${a.natureCredits}: ${n.label}` }),
      l === n.id && /* @__PURE__ */ e(s, { fallback: null, children: /* @__PURE__ */ e(v, { id: n.id, synth: n.kind === "synth" }) })
    ] }, n.id)) }),
    /* @__PURE__ */ e(y, { nature: t }),
    t.on !== null && /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-wide", "data-testid": "nature-stop", onClick: t.stop, children: a.natureOff }),
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", "data-testid": "nature-message", children: t.message }),
    /* @__PURE__ */ e("p", { className: "c-note", children: a.natureNote }),
    /* @__PURE__ */ e(s, { fallback: null, children: /* @__PURE__ */ e(k, { nature: t }) }),
    /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link c-back", onClick: c, children: a.natureBack })
  ] });
}
export {
  y as NatureControls,
  $ as NatureScreen,
  o as Slider
};
