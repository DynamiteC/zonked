import { jsxs as m, jsx as e, Fragment as F } from "react/jsx-runtime";
import { useState as h, useMemo as N, useEffect as S } from "react";
import { b as v, P as $, N as A, c as I, I as D, d as R } from "./chunk-App-CbF7SXEB.mjs";
import { C as s, X as j, E as O } from "./chunk-crewLink-uOIAoAgB.mjs";
function G(a, c = v()) {
  const r = (a.text ?? "").toLowerCase().split(/\s+/).filter((t) => t.length > 0), n = a.layerTags ?? [];
  return c.filter((t) => {
    if (a.category !== void 0 && t.category !== a.category || a.vibe !== void 0 && t.vibe !== a.vibe || a.adhdFriendly !== void 0 && t.adhdFriendly !== a.adhdFriendly || !n.every((o) => t.layerTags.includes(o))) return !1;
    const d = `${t.name} ${t.id} ${t.category} ${t.vibe} ${t.tags.join(" ")}`.toLowerCase();
    return r.every((o) => d.includes(o));
  });
}
const p = 10;
function x({ list: a, onPlay: c }) {
  return /* @__PURE__ */ e("ul", { className: "c-list", children: a.map((r) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ m("button", { type: "button", className: "c-row-card c-row-play", onClick: () => c(r), children: [
    /* @__PURE__ */ e("b", { children: r.name }),
    /* @__PURE__ */ e("small", { children: `${r.recommendedMinutes} min` })
  ] }) }, r.id)) });
}
const f = ({ text: a }) => /* @__PURE__ */ e("p", { className: "c-empty", children: a });
function H({ onPlay: a }) {
  const [c, r] = h(null), [n, t] = h(0), d = N(() => {
    const l = {};
    for (const g of v()) for (const u of g.situations) l[u] = (l[u] ?? 0) + 1;
    return l;
  }, []), o = N(() => v().filter((l) => c !== null && l.situations.includes(c)), [c]);
  return /* @__PURE__ */ m(F, { children: [
    /* @__PURE__ */ e("ul", { className: "c-tiles", children: j.map((l) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ m("button", { type: "button", className: "c-tile", "aria-pressed": c === l.id, onClick: () => {
      r(l.id), t(0);
    }, children: [
      /* @__PURE__ */ e(D, { name: l.icon }),
      /* @__PURE__ */ e("span", { className: "c-tile-name", children: l.label }),
      /* @__PURE__ */ e("span", { className: "c-tile-mood", children: l.mood }),
      /* @__PURE__ */ e("span", { className: "c-tile-count", children: s.sounds(d[l.id] ?? 0) })
    ] }) }, l.id)) }),
    c !== null && /* @__PURE__ */ e(x, { list: o.slice(n * p, n * p + p), onPlay: a }),
    c !== null && o.length > p && /* @__PURE__ */ m("div", { className: "c-actions c-row", children: [
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", disabled: n === 0, onClick: () => t(n - 1), children: s.back }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", disabled: (n + 1) * p >= o.length, onClick: () => t(n + 1), children: s.next })
    ] })
  ] });
}
function U({ onPlay: a, onBreathe: c }) {
  const r = v();
  return /* @__PURE__ */ m("ul", { className: "c-list", children: [
    c !== void 0 && /* @__PURE__ */ e("li", { children: /* @__PURE__ */ m("button", { type: "button", className: "c-row-card", "data-testid": "sounds-breathe", onClick: c, children: [
      /* @__PURE__ */ e("b", { children: s.breatheEntry }),
      /* @__PURE__ */ e("small", { children: s.breatheEntryHint })
    ] }) }),
    R.map((n) => {
      const t = r.find((d) => d.id === n.templateId);
      return /* @__PURE__ */ e("li", { children: /* @__PURE__ */ m("button", { type: "button", className: "c-row-card c-row-play", disabled: t === void 0, onClick: () => t !== void 0 && a(t), children: [
        /* @__PURE__ */ e("b", { children: n.name }),
        /* @__PURE__ */ e("small", { children: n.blurb }),
        /* @__PURE__ */ e("small", { children: n.id === "violet" ? "Start very quiet." : O[n.evidence] })
      ] }) }, n.id);
    })
  ] });
}
function V(a) {
  const [c, r] = h(A), [n, t] = h([]);
  return S(() => {
    let d = !0;
    return a.getRecord("favorites").then((o) => d && r(I(o, Date.now()))).catch(() => {
    }), a.listMixes().then((o) => d && t(o)).catch(() => {
    }), () => {
      d = !1;
    };
  }, [a]), { favs: c, mixes: n };
}
function z({ store: a, logs: c, reduced: r = !1, onNature: n, onBreathe: t, onPlay: d, onPlayMix: o }) {
  const [l, g] = h(0), [u, T] = h(""), { favs: L, mixes: C } = V(a), y = u.trim().slice(0, 80), k = N(() => y === "" ? [] : G({ text: y }).slice(0, 20), [y]), M = N(() => v(), []), E = L.items.filter((i) => i.kind === "template").map((i) => M.find((b) => b.id === i.id)).filter((i) => i !== void 0), w = c.slice(0, 10);
  return /* @__PURE__ */ m("div", { children: [
    /* @__PURE__ */ e($, { title: s.libraryTitle, reduced: r }),
    n !== void 0 && /* @__PURE__ */ m("button", { type: "button", className: "c-link-card c-nature-link", "data-testid": "open-nature", onClick: n, children: [
      /* @__PURE__ */ e("b", { children: s.natureTitle }),
      /* @__PURE__ */ e("span", { className: "c-muted", children: s.natureLine })
    ] }),
    /* @__PURE__ */ m("div", { className: "c-search", children: [
      /* @__PURE__ */ e("label", { htmlFor: "c-search-in", className: "c-sr", children: s.searchLabel }),
      /* @__PURE__ */ e("input", { id: "c-search-in", type: "search", placeholder: s.searchLabel, value: u, maxLength: 80, onChange: (i) => T(i.target.value) })
    ] }),
    y !== "" ? k.length === 0 ? /* @__PURE__ */ e(f, { text: s.searchEmpty }) : /* @__PURE__ */ e(x, { list: k, onPlay: d }) : /* @__PURE__ */ m(F, { children: [
      /* @__PURE__ */ e("div", { className: "c-tabs", role: "tablist", "aria-label": s.libraryTitle, children: s.tabs.map((i, b) => /* @__PURE__ */ e("button", { type: "button", role: "tab", id: `c-tab-${b}`, "aria-selected": l === b, "aria-controls": "c-tabpanel", className: "c-tab", onClick: () => g(b), children: i }, i)) }),
      /* @__PURE__ */ m("div", { id: "c-tabpanel", role: "tabpanel", "aria-labelledby": `c-tab-${l}`, children: [
        l === 0 && /* @__PURE__ */ e(H, { onPlay: d }),
        l === 1 && /* @__PURE__ */ e(U, { onPlay: d, ...t !== void 0 ? { onBreathe: t } : {} }),
        l === 2 && (E.length === 0 ? /* @__PURE__ */ e(f, { text: s.emptyFavorites }) : /* @__PURE__ */ e(x, { list: E, onPlay: d })),
        l === 3 && (C.length === 0 ? /* @__PURE__ */ e(f, { text: s.emptyMixes }) : /* @__PURE__ */ e("ul", { className: "c-list", children: C.map((i) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "c-row-card", onClick: () => o(i), children: /* @__PURE__ */ e("b", { children: i.name }) }) }, i.id)) })),
        l === 4 && (w.length === 0 ? /* @__PURE__ */ e(f, { text: s.emptyRecent }) : /* @__PURE__ */ e("ul", { className: "c-list", children: w.map((i) => /* @__PURE__ */ m("li", { className: "c-row-card", children: [
          /* @__PURE__ */ e("b", { children: new Date(i.startedAt).toLocaleDateString() }),
          /* @__PURE__ */ e("small", { children: `${Math.max(1, Math.round((i.endedAt - i.startedAt) / 6e4))} min` })
        ] }, i.id)) }))
      ] })
    ] })
  ] });
}
export {
  z as Library
};
