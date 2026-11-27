import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { C as t } from "./chunk-crewLink-BlI22vqq.mjs";
import { P as g, e as k } from "./chunk-App-DWMtU3Ve.mjs";
function d({ label: l, hint: c, checked: n, onChange: h, testId: o }) {
  return /* @__PURE__ */ a("label", { className: "c-switch", children: [
    /* @__PURE__ */ e("input", { type: "checkbox", role: "switch", "data-testid": o, checked: n, onChange: (m) => h(m.currentTarget.checked) }),
    /* @__PURE__ */ e("span", { className: "c-track", "aria-hidden": "true" }),
    /* @__PURE__ */ a("span", { children: [
      l,
      c !== void 0 && /* @__PURE__ */ e("small", { className: "c-muted", children: c })
    ] })
  ] });
}
const b = ["system", "light", "dark", "contrast"];
function p({ value: l, onChange: c }) {
  return /* @__PURE__ */ a("fieldset", { className: "c-themes", "data-testid": "theme-picker", children: [
    /* @__PURE__ */ e("legend", { children: t.themeTitle }),
    b.map((n) => /* @__PURE__ */ a("label", { className: "c-theme-opt", children: [
      /* @__PURE__ */ e("input", { type: "radio", name: "c-theme", value: n, "data-testid": `theme-${n}`, checked: l === n, onChange: () => c(n) }),
      /* @__PURE__ */ e("span", { children: t.themeChoices[n] })
    ] }, n))
  ] });
}
function H({ gentle: l, reduceMotion: c, reduced: n = !1, onGentle: h, onReduceMotion: o, onStudio: m, onForget: u, prefs: i, onPrefs: r }) {
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ e(g, { title: t.settingsTitle, reduced: n }),
    /* @__PURE__ */ e(d, { label: t.gentle, hint: t.gentleHint, checked: l, onChange: h, testId: "gentle-switch" }),
    /* @__PURE__ */ e(d, { label: t.reduceMotion, checked: c, onChange: o, testId: "motion-switch" }),
    /* @__PURE__ */ e(p, { value: i.choice, onChange: (s) => r({ ...i, choice: s }) }),
    /* @__PURE__ */ e(d, { label: t.dimLabel, hint: t.dimHint, checked: k(i), onChange: (s) => r({ ...i, dim: s }), testId: "dim-switch" }),
    /* @__PURE__ */ e(d, { label: t.announceLabel, hint: t.announceHint, checked: i.announce, onChange: (s) => r({ ...i, announce: s }), testId: "announce-switch" }),
    /* @__PURE__ */ a("div", { className: "c-actions", children: [
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", "data-testid": "studio-switch", onClick: m, children: t.studioLink }),
      /* @__PURE__ */ e("p", { className: "c-muted", children: t.studioHint }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: u, children: t.forget }),
      /* @__PURE__ */ e("p", { className: "c-muted", children: t.forgetHint })
    ] }),
    /* @__PURE__ */ e("p", { className: "c-muted", children: t.offline })
  ] });
}
export {
  H as SettingsScreen
};
