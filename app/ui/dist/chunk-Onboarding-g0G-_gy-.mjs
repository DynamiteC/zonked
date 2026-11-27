import { jsxs as d, jsx as e, Fragment as A } from "react/jsx-runtime";
import { useId as O, useMemo as _, useState as f, useRef as G, useEffect as R, Suspense as x, lazy as P } from "react";
import { C as c, b as B, G as V, V as z, W as F } from "./chunk-crewLink-uOIAoAgB.mjs";
import { r as W, p as j, D as q, S as Q, G as U, T as Y, a as $ } from "./chunk-App-CbF7SXEB.mjs";
function C({ legend: t, options: l, value: n, onChange: i }) {
  const o = O();
  return /* @__PURE__ */ d("fieldset", { className: "c-choices", children: [
    /* @__PURE__ */ e("legend", { className: "c-sr", children: t }),
    l.map((a) => /* @__PURE__ */ d("label", { className: "c-choice", children: [
      /* @__PURE__ */ e("input", { type: "radio", name: o, value: a.value, "aria-label": a.label, checked: n === a.value, onChange: () => i(a.value) }),
      /* @__PURE__ */ d("span", { "aria-hidden": "true", children: [
        a.label,
        n === a.value && /* @__PURE__ */ e("i", { className: "c-sel", "aria-hidden": "true", children: c.selected })
      ] })
    ] }, a.value))
  ] });
}
const H = 1e4, J = (t) => t.replace(/-\d+$/, ""), K = 5;
function S(t, l = /* @__PURE__ */ new Date()) {
  const n = /* @__PURE__ */ new Set(), i = [];
  for (const o of W(j(t, l), 12)) {
    const a = J(o.template.id);
    if (!n.has(a) && (n.add(a), i.push({ template: o.template, reason: B(o.reasons[0] ?? o.template.reasonTemplate), score: o.score }), i.length === 3))
      break;
  }
  return i;
}
function X(t, l = /* @__PURE__ */ new Date()) {
  const [n, i] = S(t, l);
  return n === void 0 ? null : i === void 0 || n.score - i.score >= K ? n : null;
}
function Z({ profile: t, playing: l, onPreview: n, onStop: i, onStart: o }) {
  var v, g;
  const a = _(() => S(t), [t]), [p, m] = f(((v = a[0]) == null ? void 0 : v.template.id) ?? ""), [h, b] = f(null), u = G(null);
  R(() => () => void (u.current !== null && window.clearTimeout(u.current)), []);
  const T = (s) => {
    u.current !== null && window.clearTimeout(u.current), m(s.id), b(s.id), n(s), u.current = window.setTimeout(() => {
      b(null), i();
    }, H);
  }, N = (g = a.find((s) => s.template.id === p)) == null ? void 0 : g.template;
  return /* @__PURE__ */ d(A, { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: c.starterTitle }),
    /* @__PURE__ */ d("fieldset", { className: "c-starters", children: [
      /* @__PURE__ */ e("legend", { className: "c-sr", children: c.starterTitle }),
      a.map((s) => /* @__PURE__ */ d("div", { className: "c-starter", "data-picked": p === s.template.id ? "true" : "false", children: [
        /* @__PURE__ */ d("label", { className: "c-starter-pick", children: [
          /* @__PURE__ */ e("input", { type: "radio", name: "starter", checked: p === s.template.id, onChange: () => m(s.template.id) }),
          /* @__PURE__ */ d("span", { className: "c-s-text", children: [
            /* @__PURE__ */ e("b", { children: s.template.name }),
            /* @__PURE__ */ e("small", { children: s.reason })
          ] })
        ] }),
        /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", onClick: () => T(s.template), children: c.preview })
      ] }, s.template.id))
    ] }),
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", children: h !== null && l ? c.previewing : "" }),
    /* @__PURE__ */ e("div", { className: "c-actions", children: /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-primary", disabled: N === void 0, onClick: () => {
      u.current !== null && window.clearTimeout(u.current), N !== void 0 && o(N);
    }, children: c.start }) })
  ] });
}
const ee = P(() => import("./chunk-mascot-suXXzKOI.mjs").then((t) => ({ default: t.CalmMascot }))), y = (t, l) => t.map((n) => ({ value: n, label: l[n] })), te = { 1: c.goalTitle, 2: c.whenTitle, 3: c.listenTitle };
function E({ mood: t, size: l, reduced: n }) {
  return /* @__PURE__ */ e("div", { className: "c-hero", children: /* @__PURE__ */ e(x, { fallback: null, children: /* @__PURE__ */ e(ee, { mood: t, size: l, reducedMotion: n }) }) });
}
function ne({ step: t, answers: l, set: n, onBack: i, onNext: o, onSkip: a }) {
  return /* @__PURE__ */ d(A, { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: te[t] }),
    t === 1 && /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link c-skip-now", onClick: a, children: c.skip }),
    t === 1 && /* @__PURE__ */ e(C, { legend: c.goalTitle, options: y(U, V), value: l.goal, onChange: n.goal }),
    t === 2 && /* @__PURE__ */ e(C, { legend: c.whenTitle, options: y(Y, z), value: l.when, onChange: n.when }),
    t === 3 && /* @__PURE__ */ e(C, { legend: c.listenTitle, options: y($, F), value: l.device, onChange: n.device }),
    t === 3 && /* @__PURE__ */ e("p", { className: "c-note", children: c.listenNote }),
    /* @__PURE__ */ d("div", { className: "c-actions c-row", children: [
      i !== null && /* @__PURE__ */ e("button", { type: "button", className: "c-btn", onClick: i, children: c.back }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-primary", onClick: o, children: c.next })
    ] })
  ] });
}
const L = ({ onClick: t }) => /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: t, children: c.back });
function ie({ playing: t, reduced: l, onAccept: n, onPreview: i, onStop: o, onFinish: a, initial: p = q }) {
  const [m, h] = f(1), [b, u] = f(!1), [T, N] = f(p.goal), [v, g] = f(p.timeOfDay), [s, D] = f(p.device), k = { ...p, goal: T, timeOfDay: v, device: s, createdAt: Date.now() }, I = () => {
    n();
    const w = b ? S(k)[0] : X(k);
    w != null ? a(k, w.template) : h(5);
  }, M = () => {
    h(b ? 1 : 3), u(!1);
  }, r = m <= 3 ? m : null;
  return /* @__PURE__ */ d("section", { className: "c-onb", "aria-label": r !== null ? c.stepOf(r) : c.safetyTitle, children: [
    r !== null && /* @__PURE__ */ e("p", { className: "c-step", children: c.stepOf(r) }),
    r === 1 && /* @__PURE__ */ e(E, { mood: "happy", size: 96, reduced: l }),
    r === 1 && /* @__PURE__ */ e("p", { className: "c-promise", children: c.promise }),
    r !== null && /* @__PURE__ */ e(
      ne,
      {
        step: r,
        answers: { goal: T, when: v, device: s },
        set: { goal: N, when: g, device: D },
        onBack: r > 1 ? () => h(r - 1) : null,
        onNext: () => h(r + 1),
        onSkip: () => {
          u(!0), h(4);
        }
      }
    ),
    m === 4 && /* @__PURE__ */ e(E, { mood: "idle", size: 120, reduced: l }),
    m === 4 && /* @__PURE__ */ e(Q, { onAccept: I }),
    m === 4 && /* @__PURE__ */ e(L, { onClick: M }),
    m === 5 && /* @__PURE__ */ e(Z, { profile: k, playing: t, onPreview: i, onStop: o, onStart: (w) => a(k, w) }),
    m === 5 && /* @__PURE__ */ e(L, { onClick: () => h(3) })
  ] });
}
export {
  ie as Onboarding
};
