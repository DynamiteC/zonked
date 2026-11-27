import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { C as t } from "./chunk-crewLink-BQ1FLTqp.mjs";
import { P as u } from "./chunk-App-7MO50ppA.mjs";
function i({ label: s, hint: c, checked: h, onChange: l, testId: d }) {
  return /* @__PURE__ */ a("label", { className: "c-switch", children: [
    /* @__PURE__ */ e("input", { type: "checkbox", role: "switch", "data-testid": d, checked: h, onChange: (r) => l(r.currentTarget.checked) }),
    /* @__PURE__ */ e("span", { className: "c-track", "aria-hidden": "true" }),
    /* @__PURE__ */ a("span", { children: [
      s,
      c !== void 0 && /* @__PURE__ */ e("small", { className: "c-muted", children: c })
    ] })
  ] });
}
function f({ gentle: s, reduceMotion: c, reduced: h = !1, onGentle: l, onReduceMotion: d, onStudio: r, onForget: g, look: n, onLook: m }) {
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ e(u, { title: t.settingsTitle, reduced: h }),
    /* @__PURE__ */ e(i, { label: t.gentle, hint: t.gentleHint, checked: s, onChange: l, testId: "gentle-switch" }),
    /* @__PURE__ */ e(i, { label: t.reduceMotion, checked: c, onChange: d, testId: "motion-switch" }),
    /* @__PURE__ */ e(i, { label: t.themeLight, hint: t.themeLabel, checked: n.theme === "light", onChange: (o) => m({ ...n, theme: o ? "light" : "dark" }), testId: "theme-switch" }),
    /* @__PURE__ */ e(i, { label: t.contrast, hint: t.contrastHint, checked: n.highContrast, onChange: (o) => m({ ...n, highContrast: o }), testId: "contrast-switch" }),
    /* @__PURE__ */ a("div", { className: "c-actions", children: [
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", "data-testid": "studio-switch", onClick: r, children: t.studioLink }),
      /* @__PURE__ */ e("p", { className: "c-muted", children: t.studioHint }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: g, children: t.forget }),
      /* @__PURE__ */ e("p", { className: "c-muted", children: t.forgetHint })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-muted", children: t.offline })
  ] });
}
export {
  f as SettingsScreen
};
