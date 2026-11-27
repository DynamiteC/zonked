import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { C as t } from "./chunk-App-DapSTSRU.mjs";
function o({ label: i, hint: c, checked: s, onChange: a, testId: l }) {
  return /* @__PURE__ */ n("label", { className: "c-switch", children: [
    /* @__PURE__ */ e("input", { type: "checkbox", role: "switch", "data-testid": l, checked: s, onChange: (d) => a(d.currentTarget.checked) }),
    /* @__PURE__ */ e("span", { className: "c-track", "aria-hidden": "true" }),
    /* @__PURE__ */ n("span", { children: [
      i,
      c !== void 0 && /* @__PURE__ */ e("small", { className: "c-muted", children: c })
    ] })
  ] });
}
function m({ gentle: i, reduceMotion: c, onGentle: s, onReduceMotion: a, onStudio: l, onForget: d }) {
  return /* @__PURE__ */ n("div", { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: t.settingsTitle }),
    /* @__PURE__ */ e(o, { label: t.gentle, hint: t.gentleHint, checked: i, onChange: s, testId: "gentle-switch" }),
    /* @__PURE__ */ e(o, { label: t.reduceMotion, checked: c, onChange: a, testId: "motion-switch" }),
    /* @__PURE__ */ n("div", { className: "c-actions", children: [
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn", "data-testid": "studio-switch", onClick: l, children: t.studio }),
      /* @__PURE__ */ e("p", { className: "c-muted", children: t.studioHint }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: d, children: t.forget })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-muted", children: t.offline })
  ] });
}
export {
  m as SettingsScreen
};
