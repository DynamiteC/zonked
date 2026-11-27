import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { s as d } from "./chunk-crewLink-CNIjqEIV.mjs";
import { C as a } from "./chunk-App-ldvDWDBH.mjs";
const o = ["Fresh", "Warming up", a.crewBreak];
function m(c) {
  return c === null || !Number.isFinite(c) || c < 40 ? 0 : c < 60 ? 1 : 2;
}
function w({ crew: c, burnout: i }) {
  const t = c.enabled && c.status === "connected", s = m(i);
  return /* @__PURE__ */ l("div", { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: a.crewTitle }),
    /* @__PURE__ */ e("p", { className: "c-lead", children: a.crewIntro }),
    /* @__PURE__ */ l("label", { className: "c-switch", children: [
      /* @__PURE__ */ e("input", { type: "checkbox", role: "switch", "data-testid": "calm-crew-toggle", checked: c.enabled, onChange: (r) => d(r.currentTarget.checked) }),
      /* @__PURE__ */ e("span", { className: "c-track", "aria-hidden": "true" }),
      /* @__PURE__ */ e("span", { children: a.crewSwitch })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: t ? a.crewOn : a.crewOff }),
    t ? /* @__PURE__ */ e("ol", { className: "c-meter", "aria-label": "Session load", children: o.map((r, n) => /* @__PURE__ */ e("li", { className: n === s ? "c-seg c-on" : "c-seg", "aria-current": n === s ? "step" : void 0, children: r }, r)) }) : /* @__PURE__ */ e("p", { className: "c-note", children: a.crewOptional }),
    /* @__PURE__ */ e("p", { className: "c-muted", children: a.crewPrivacy })
  ] });
}
export {
  w as CrewScreen,
  m as meterStep
};
