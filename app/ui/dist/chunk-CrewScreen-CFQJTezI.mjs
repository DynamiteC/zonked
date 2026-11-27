import { jsxs as l, jsx as e } from "react/jsx-runtime";
import { C as a, p as d } from "./chunk-crewLink-Cq0htOCx.mjs";
const o = ["Fresh", "Warming up", a.crewBreak];
function h(c) {
  return c === null || !Number.isFinite(c) || c < 40 ? 0 : c < 60 ? 1 : 2;
}
function u({ crew: c, burnout: i }) {
  const r = c.enabled && c.status === "connected", n = h(i);
  return /* @__PURE__ */ l("div", { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: a.crewTitle }),
    /* @__PURE__ */ e("p", { className: "c-lead", children: a.crewIntro }),
    /* @__PURE__ */ l("label", { className: "c-switch", children: [
      /* @__PURE__ */ e("input", { type: "checkbox", role: "switch", "data-testid": "calm-crew-toggle", checked: c.enabled, onChange: (t) => d(t.currentTarget.checked) }),
      /* @__PURE__ */ e("span", { className: "c-track", "aria-hidden": "true" }),
      /* @__PURE__ */ e("span", { children: a.crewSwitch })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: r ? a.crewOn : a.crewOff }),
    r ? /* @__PURE__ */ e("ol", { className: "c-meter", "aria-label": "Session load", children: o.map((t, s) => /* @__PURE__ */ e("li", { className: s === n ? "c-seg c-on" : "c-seg", "aria-current": s === n ? "step" : void 0, children: t }, t)) }) : /* @__PURE__ */ e("p", { className: "c-note", children: a.crewOptional }),
    /* @__PURE__ */ e("p", { className: "c-muted", children: a.crewPrivacy })
  ] });
}
export {
  u as CrewScreen,
  h as meterStep
};
