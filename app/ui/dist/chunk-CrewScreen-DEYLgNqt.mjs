import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { C as c, p as d } from "./chunk-crewLink-Br6qeo5M.mjs";
const h = ["Fresh", "Warming up", c.crewBreak];
function o(a) {
  return a === null || !Number.isFinite(a) || a < 40 ? 0 : a < 60 ? 1 : 2;
}
function w({ crew: a, burnout: i }) {
  const s = a.enabled && a.status === "connected", n = o(i);
  return /* @__PURE__ */ t("div", { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: c.crewTitle }),
    /* @__PURE__ */ e("p", { className: "c-lead", children: c.crewIntro }),
    /* @__PURE__ */ t("label", { className: "c-switch", children: [
      /* @__PURE__ */ e("input", { type: "checkbox", role: "switch", "data-testid": "calm-crew-toggle", checked: a.enabled, onChange: (r) => d(r.currentTarget.checked) }),
      /* @__PURE__ */ e("span", { className: "c-track", "aria-hidden": "true" }),
      /* @__PURE__ */ e("span", { children: c.crewSwitch })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", "data-testid": "crew-status", children: s ? c.crewOn : c.crewOff }),
    s ? /* @__PURE__ */ e("ol", { className: "c-meter", "aria-label": "Session load", children: h.map((r, l) => /* @__PURE__ */ e("li", { className: l === n ? "c-seg c-on" : "c-seg", "aria-current": l === n ? "step" : void 0, children: r }, r)) }) : /* @__PURE__ */ t("div", { "data-testid": "crew-why-off", children: [
      /* @__PURE__ */ e("p", { className: "c-why-off", children: a.enabled ? c.crewDisabled : c.crewWhyOff }),
      /* @__PURE__ */ t("ol", { className: "c-steps", children: [
        /* @__PURE__ */ e("li", { children: c.crewStep1 }),
        /* @__PURE__ */ e("li", { children: c.crewStep2 })
      ] }),
      /* @__PURE__ */ e("p", { className: "c-note", children: c.crewOptional })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-muted", children: c.crewPrivacy })
  ] });
}
export {
  w as CrewScreen,
  o as meterStep
};
