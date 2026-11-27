import { jsxs as s, jsx as e, Fragment as u } from "react/jsx-runtime";
import { useId as A, useMemo as D, useState as b, useRef as I, useEffect as M, Suspense as E, lazy as O } from "react";
import { C as t, r as _, p as x, D as G, S as F, G as P, a as R, T as z, b as B, c as V, d as $ } from "./chunk-App-ldvDWDBH.mjs";
function w({ legend: a, options: o, value: i, onChange: d }) {
  const r = A();
  return /* @__PURE__ */ s("fieldset", { className: "c-choices", children: [
    /* @__PURE__ */ e("legend", { className: "c-sr", children: a }),
    o.map((l) => /* @__PURE__ */ s("label", { className: "c-choice", children: [
      /* @__PURE__ */ e("input", { type: "radio", name: r, value: l.value, checked: i === l.value, onChange: () => d(l.value) }),
      /* @__PURE__ */ e("span", { children: l.label })
    ] }, l.value))
  ] });
}
const j = 1e4, W = (a) => a.replace(/-\d+$/, "");
function U(a, o = /* @__PURE__ */ new Date()) {
  const i = /* @__PURE__ */ new Set(), d = [];
  for (const r of _(x(a, o), 12)) {
    const l = W(r.template.id);
    if (!i.has(l) && (i.add(l), d.push({ template: r.template, reason: r.reasons[0] ?? r.template.reasonTemplate }), d.length === 3))
      break;
  }
  return d;
}
function Y({ profile: a, playing: o, onPreview: i, onStop: d, onStart: r }) {
  var k, T;
  const l = D(() => U(a), [a]), [m, n] = b(((k = l[0]) == null ? void 0 : k.template.id) ?? ""), [g, f] = b(null), p = I(null);
  M(() => () => void (p.current !== null && window.clearTimeout(p.current)), []);
  const v = (c) => {
    p.current !== null && window.clearTimeout(p.current), n(c.id), f(c.id), i(c), p.current = window.setTimeout(() => {
      f(null), d();
    }, j);
  }, N = (T = l.find((c) => c.template.id === m)) == null ? void 0 : T.template;
  return /* @__PURE__ */ s(u, { children: [
    /* @__PURE__ */ e("h2", { className: "c-h1", children: t.starterTitle }),
    /* @__PURE__ */ s("fieldset", { className: "c-starters", children: [
      /* @__PURE__ */ e("legend", { className: "c-sr", children: t.starterTitle }),
      l.map((c) => /* @__PURE__ */ s("div", { className: "c-starter", "data-picked": m === c.template.id ? "true" : "false", children: [
        /* @__PURE__ */ s("label", { className: "c-starter-pick", children: [
          /* @__PURE__ */ e("input", { type: "radio", name: "starter", checked: m === c.template.id, onChange: () => n(c.template.id) }),
          /* @__PURE__ */ s("span", { className: "c-s-text", children: [
            /* @__PURE__ */ e("b", { children: c.template.name }),
            /* @__PURE__ */ e("small", { children: c.reason })
          ] })
        ] }),
        /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", onClick: () => v(c.template), children: t.preview })
      ] }, c.template.id))
    ] }),
    /* @__PURE__ */ e("p", { className: "c-status", role: "status", children: g !== null && o ? t.previewing : "" }),
    /* @__PURE__ */ e("div", { className: "c-actions", children: /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-primary", disabled: N === void 0, onClick: () => N !== void 0 && r(N), children: t.start }) })
  ] });
}
const L = O(() => import("./chunk-mascot-BtlVTBkR.mjs").then((a) => ({ default: a.CalmMascot }))), y = (a, o) => a.map((i) => ({ value: i, label: o[i] })), q = { 1: t.goalTitle, 2: t.whenTitle, 3: t.listenTitle };
function Q({ playing: a, reduced: o, onAccept: i, onPreview: d, onStop: r, onFinish: l, initial: m = G }) {
  const [n, g] = b(1), [f, p] = b(m.goal), [v, N] = b(m.timeOfDay), [k, T] = b(m.device), c = { ...m, goal: f, timeOfDay: v, device: k, createdAt: Date.now() }, h = (C) => g(C), S = n > 1 ? () => h(n - 1) : null;
  return /* @__PURE__ */ s("section", { className: "c-onb", "aria-label": `Step ${n} of 5`, children: [
    /* @__PURE__ */ e("p", { className: "c-step", children: `Step ${n} of 5` }),
    n === 1 && /* @__PURE__ */ s(u, { children: [
      /* @__PURE__ */ e("div", { className: "c-hero", children: /* @__PURE__ */ e(E, { fallback: null, children: /* @__PURE__ */ e(L, { mood: "happy", size: 140, reducedMotion: o }) }) }),
      /* @__PURE__ */ e("p", { className: "c-promise", children: t.promise })
    ] }),
    n <= 3 && /* @__PURE__ */ s(u, { children: [
      /* @__PURE__ */ e("h2", { className: "c-h1", children: q[n] }),
      n === 1 && /* @__PURE__ */ e(w, { legend: t.goalTitle, options: y(R, P), value: f, onChange: p }),
      n === 2 && /* @__PURE__ */ e(w, { legend: t.whenTitle, options: y(B, z), value: v, onChange: N }),
      n === 3 && /* @__PURE__ */ s(u, { children: [
        /* @__PURE__ */ e(w, { legend: t.listenTitle, options: y($, V), value: k, onChange: T }),
        /* @__PURE__ */ e("p", { className: "c-note", children: t.listenNote })
      ] }),
      /* @__PURE__ */ s("div", { className: "c-actions c-row", children: [
        S !== null && /* @__PURE__ */ e("button", { type: "button", className: "c-btn", onClick: S, children: t.back }),
        /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-primary", onClick: () => h(n + 1), children: t.next })
      ] }),
      n === 1 && /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: () => h(4), children: t.skip })
    ] }),
    n === 4 && /* @__PURE__ */ s(u, { children: [
      /* @__PURE__ */ e("div", { className: "c-hero", children: /* @__PURE__ */ e(E, { fallback: null, children: /* @__PURE__ */ e(L, { mood: "idle", size: 120, reducedMotion: o }) }) }),
      /* @__PURE__ */ e(
        F,
        {
          onAccept: () => {
            i(), h(5);
          }
        }
      ),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: () => h(3), children: t.back })
    ] }),
    n === 5 && /* @__PURE__ */ s(u, { children: [
      /* @__PURE__ */ e(Y, { profile: c, playing: a, onPreview: d, onStop: r, onStart: (C) => l(c, C) }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-link", onClick: () => h(3), children: t.back })
    ] })
  ] });
}
export {
  Q as Onboarding
};
