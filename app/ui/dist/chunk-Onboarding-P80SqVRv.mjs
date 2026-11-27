import { jsxs as d, jsx as e, Fragment as L } from "react/jsx-runtime";
import { useId as M, useMemo as _, useState as f, useRef as x, useEffect as G, Suspense as B, lazy as P } from "react";
import { C as n, G as R, T as z, D as F } from "./chunk-crewLink-Br6qeo5M.mjs";
import { r as V, p as j, D as W, S as q, G as Q, T as U, a as Y } from "./chunk-App-ikZzyVmD.mjs";
function C({ legend: t, options: l, value: c, onChange: i }) {
  const o = M();
  return /* @__PURE__ */ d("fieldset", { className: "c-choices", children: [
    /* @__PURE__ */ e("legend", { className: "c-sr", children: t }),
    l.map((a) => /* @__PURE__ */ d("label", { className: "c-choice", children: [
      /* @__PURE__ */ e("input", { type: "radio", name: o, value: a.value, checked: c === a.value, onChange: () => i(a.value) }),
      /* @__PURE__ */ d("span", { children: [
        a.label,
        c === a.value && /* @__PURE__ */ e("i", { className: "c-sel", children: n.selected })
      ] })
    ] }, a.value))
  ] });
}
const $ = 1e4, H = (t) => t.replace(/-\d+$/, "");
function D(t, l = /* @__PURE__ */ new Date()) {
  const c = /* @__PURE__ */ new Set(), i = [];
  for (const o of V(j(t, l), 12)) {
    const a = H(o.template.id);
    if (!c.has(a) && (c.add(a), i.push({ template: o.template, reason: o.reasons[0] ?? o.template.reasonTemplate }), i.length === 3))
      break;
  }
  return i;
}
function J({ profile: t, playing: l, onPreview: c, onStop: i, onStart: o }) {
  var v, k;
  const a = _(() => D(t), [t]), [u, m] = f(((v = a[0]) == null ? void 0 : v.template.id) ?? ""), [h, b] = f(null), p = x(null);
  G(() => () => void (p.current !== null && window.clearTimeout(p.current)), []);
  const w = (s) => {
    p.current !== null && window.clearTimeout(p.current), m(s.id), b(s.id), c(s), p.current = window.setTimeout(() => {
      b(null), i();
    }, $);
  }, N = (k = a.find((s) => s.template.id === u)) == null ? void 0 : k.template;
  return /* @__PURE__ */ d(L, { children: [
    /* @__PURE__ */ e("h2", { className: "c-h1", children: n.starterTitle }),
    /* @__PURE__ */ d("fieldset", { className: "c-starters", children: [
      /* @__PURE__ */ e("legend", { className: "c-sr", children: n.starterTitle }),
      a.map((s) => /* @__PURE__ */ d("div", { className: "c-starter", "data-picked": u === s.template.id ? "true" : "false", children: [
        /* @__PURE__ */ d("label", { className: "c-starter-pick", children: [
          /* @__PURE__ */ e("input", { type: "radio", name: "starter", checked: u === s.template.id, onChange: () => m(s.template.id) }),
          /* @__PURE__ */ d("span", { className: "c-s-text", children: [
            /* @__PURE__ */ e("b", { children: s.template.name }),
            /* @__PURE__ */ e("small", { children: s.reason })
          ] })
        ] }),
        /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", onClick: () => w(s.template), children: n.preview })
      ] }, s.template.id))
    ] }),
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", children: h !== null && l ? n.previewing : "" }),
    /* @__PURE__ */ e("div", { className: "c-actions", children: /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-primary", disabled: N === void 0, onClick: () => {
      p.current !== null && window.clearTimeout(p.current), N !== void 0 && o(N);
    }, children: n.start }) })
  ] });
}
const K = P(() => import("./chunk-mascot-BnpJf37G.mjs").then((t) => ({ default: t.CalmMascot }))), y = (t, l) => t.map((c) => ({ value: c, label: l[c] })), X = { 1: n.goalTitle, 2: n.whenTitle, 3: n.listenTitle };
function S({ mood: t, size: l, reduced: c }) {
  return /* @__PURE__ */ e("div", { className: "c-hero", children: /* @__PURE__ */ e(B, { fallback: null, children: /* @__PURE__ */ e(K, { mood: t, size: l, reducedMotion: c }) }) });
}
function Z({ step: t, answers: l, set: c, onBack: i, onNext: o, onSkip: a }) {
  return /* @__PURE__ */ d(L, { children: [
    /* @__PURE__ */ e("h2", { className: "c-h1", children: X[t] }),
    t === 1 && /* @__PURE__ */ e(C, { legend: n.goalTitle, options: y(Q, R), value: l.goal, onChange: c.goal }),
    t === 2 && /* @__PURE__ */ e(C, { legend: n.whenTitle, options: y(U, z), value: l.when, onChange: c.when }),
    t === 3 && /* @__PURE__ */ e(C, { legend: n.listenTitle, options: y(Y, F), value: l.device, onChange: c.device }),
    t === 3 && /* @__PURE__ */ e("p", { className: "c-note", children: n.listenNote }),
    /* @__PURE__ */ d("div", { className: "c-actions c-row", children: [
      i !== null && /* @__PURE__ */ e("button", { type: "button", className: "c-btn", onClick: i, children: n.back }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-primary", onClick: o, children: n.next })
    ] }),
    t === 1 && /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-wide", onClick: a, children: n.skip })
  ] });
}
const E = ({ onClick: t }) => /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: t, children: n.back });
function ae({ playing: t, reduced: l, onAccept: c, onPreview: i, onStop: o, onFinish: a, initial: u = W }) {
  const [m, h] = f(1), [b, p] = f(!1), [w, N] = f(u.goal), [v, k] = f(u.timeOfDay), [s, A] = f(u.device), T = { ...u, goal: w, timeOfDay: v, device: s, createdAt: Date.now() }, I = () => {
    c();
    const g = b ? D(T)[0] : void 0;
    g !== void 0 ? a(T, g.template) : h(5);
  }, O = () => {
    h(b ? 1 : 3), p(!1);
  }, r = m <= 3 ? m : null;
  return /* @__PURE__ */ d("section", { className: "c-onb", "aria-label": r !== null ? n.stepOf(r) : n.safetyTitle, children: [
    r !== null && /* @__PURE__ */ e("p", { className: "c-step", children: n.stepOf(r) }),
    r === 1 && /* @__PURE__ */ e(S, { mood: "happy", size: 120, reduced: l }),
    r === 1 && /* @__PURE__ */ e("p", { className: "c-promise", children: n.promise }),
    r !== null && /* @__PURE__ */ e(
      Z,
      {
        step: r,
        answers: { goal: w, when: v, device: s },
        set: { goal: N, when: k, device: A },
        onBack: r > 1 ? () => h(r - 1) : null,
        onNext: () => h(r + 1),
        onSkip: () => {
          p(!0), h(4);
        }
      }
    ),
    m === 4 && /* @__PURE__ */ e(S, { mood: "idle", size: 120, reduced: l }),
    m === 4 && /* @__PURE__ */ e(q, { onAccept: I }),
    m === 4 && /* @__PURE__ */ e(E, { onClick: O }),
    m === 5 && /* @__PURE__ */ e(J, { profile: T, playing: t, onPreview: i, onStop: o, onStart: (g) => a(T, g) }),
    m === 5 && /* @__PURE__ */ e(E, { onClick: () => h(3) })
  ] });
}
export {
  ae as Onboarding
};
