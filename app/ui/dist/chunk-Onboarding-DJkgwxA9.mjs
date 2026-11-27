import { jsxs as d, jsx as e, Fragment as A } from "react/jsx-runtime";
import { useId as O, useMemo as _, useState as f, useRef as G, useEffect as x, Suspense as R, lazy as P } from "react";
import { C as c, G as B, T as z, U as F } from "./chunk-crewLink-CU32qOP4.mjs";
import { r as V, p as j, D as U, S as W, G as q, T as Q, a as Y } from "./chunk-App-BLMq_l8s.mjs";
function C({ legend: t, options: l, value: n, onChange: i }) {
  const o = O();
  return /* @__PURE__ */ d("fieldset", { className: "c-choices", children: [
    /* @__PURE__ */ e("legend", { className: "c-sr", children: t }),
    l.map((a) => /* @__PURE__ */ d("label", { className: "c-choice", children: [
      /* @__PURE__ */ e("input", { type: "radio", name: o, value: a.value, checked: n === a.value, onChange: () => i(a.value) }),
      /* @__PURE__ */ d("span", { children: [
        a.label,
        n === a.value && /* @__PURE__ */ e("i", { className: "c-sel", "aria-hidden": "true", children: c.selected })
      ] })
    ] }, a.value))
  ] });
}
const $ = 1e4, H = (t) => t.replace(/-\d+$/, ""), J = 5;
function S(t, l = /* @__PURE__ */ new Date()) {
  const n = /* @__PURE__ */ new Set(), i = [];
  for (const o of V(j(t, l), 12)) {
    const a = H(o.template.id);
    if (!n.has(a) && (n.add(a), i.push({ template: o.template, reason: o.reasons[0] ?? o.template.reasonTemplate, score: o.score }), i.length === 3))
      break;
  }
  return i;
}
function K(t, l = /* @__PURE__ */ new Date()) {
  const [n, i] = S(t, l);
  return n === void 0 ? null : i === void 0 || n.score - i.score >= J ? n : null;
}
function X({ profile: t, playing: l, onPreview: n, onStop: i, onStart: o }) {
  var v, g;
  const a = _(() => S(t), [t]), [p, m] = f(((v = a[0]) == null ? void 0 : v.template.id) ?? ""), [h, b] = f(null), u = G(null);
  x(() => () => void (u.current !== null && window.clearTimeout(u.current)), []);
  const T = (s) => {
    u.current !== null && window.clearTimeout(u.current), m(s.id), b(s.id), n(s), u.current = window.setTimeout(() => {
      b(null), i();
    }, $);
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
const Z = P(() => import("./chunk-mascot-B7ELnD3t.mjs").then((t) => ({ default: t.CalmMascot }))), y = (t, l) => t.map((n) => ({ value: n, label: l[n] })), ee = { 1: c.goalTitle, 2: c.whenTitle, 3: c.listenTitle };
function E({ mood: t, size: l, reduced: n }) {
  return /* @__PURE__ */ e("div", { className: "c-hero", children: /* @__PURE__ */ e(R, { fallback: null, children: /* @__PURE__ */ e(Z, { mood: t, size: l, reducedMotion: n }) }) });
}
function te({ step: t, answers: l, set: n, onBack: i, onNext: o, onSkip: a }) {
  return /* @__PURE__ */ d(A, { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: ee[t] }),
    t === 1 && /* @__PURE__ */ e(C, { legend: c.goalTitle, options: y(q, B), value: l.goal, onChange: n.goal }),
    t === 2 && /* @__PURE__ */ e(C, { legend: c.whenTitle, options: y(Q, z), value: l.when, onChange: n.when }),
    t === 3 && /* @__PURE__ */ e(C, { legend: c.listenTitle, options: y(Y, F), value: l.device, onChange: n.device }),
    t === 3 && /* @__PURE__ */ e("p", { className: "c-note", children: c.listenNote }),
    /* @__PURE__ */ d("div", { className: "c-actions c-row", children: [
      i !== null && /* @__PURE__ */ e("button", { type: "button", className: "c-btn", onClick: i, children: c.back }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-primary", onClick: o, children: c.next })
    ] }),
    t === 1 && /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-wide", onClick: a, children: c.skip })
  ] });
}
const L = ({ onClick: t }) => /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: t, children: c.back });
function se({ playing: t, reduced: l, onAccept: n, onPreview: i, onStop: o, onFinish: a, initial: p = U }) {
  const [m, h] = f(1), [b, u] = f(!1), [T, N] = f(p.goal), [v, g] = f(p.timeOfDay), [s, D] = f(p.device), w = { ...p, goal: T, timeOfDay: v, device: s, createdAt: Date.now() }, I = () => {
    n();
    const k = b ? S(w)[0] : K(w);
    k != null ? a(w, k.template) : h(5);
  }, M = () => {
    h(b ? 1 : 3), u(!1);
  }, r = m <= 3 ? m : null;
  return /* @__PURE__ */ d("section", { className: "c-onb", "aria-label": r !== null ? c.stepOf(r) : c.safetyTitle, children: [
    r !== null && /* @__PURE__ */ e("p", { className: "c-step", children: c.stepOf(r) }),
    r === 1 && /* @__PURE__ */ e(E, { mood: "happy", size: 120, reduced: l }),
    r === 1 && /* @__PURE__ */ e("p", { className: "c-promise", children: c.promise }),
    r !== null && /* @__PURE__ */ e(
      te,
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
    m === 4 && /* @__PURE__ */ e(W, { onAccept: I }),
    m === 4 && /* @__PURE__ */ e(L, { onClick: M }),
    m === 5 && /* @__PURE__ */ e(X, { profile: w, playing: t, onPreview: i, onStop: o, onStart: (k) => a(w, k) }),
    m === 5 && /* @__PURE__ */ e(L, { onClick: () => h(3) })
  ] });
}
export {
  se as Onboarding
};
