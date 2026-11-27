import { jsxs as o, jsx as e, Fragment as F } from "react/jsx-runtime";
import { useState as h, useMemo as y, useEffect as T } from "react";
import { e as v, C as d, N as $, f as L, F as M, h as S, E as A } from "./chunk-App-ldvDWDBH.mjs";
function D(l, c = v()) {
  const a = (l.text ?? "").toLowerCase().split(/\s+/).filter((t) => t.length > 0), s = l.layerTags ?? [];
  return c.filter((t) => {
    if (l.category !== void 0 && t.category !== l.category || l.vibe !== void 0 && t.vibe !== l.vibe || l.adhdFriendly !== void 0 && t.adhdFriendly !== l.adhdFriendly || !s.every((n) => t.layerTags.includes(n))) return !1;
    const r = `${t.name} ${t.id} ${t.category} ${t.vibe} ${t.tags.join(" ")}`.toLowerCase();
    return a.every((n) => r.includes(n));
  });
}
const u = 10;
function g({ list: l, onPlay: c }) {
  return /* @__PURE__ */ e("ul", { className: "c-list", children: l.map((a) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ o("button", { type: "button", className: "c-row-card", onClick: () => c(a), children: [
    /* @__PURE__ */ e("b", { children: a.name }),
    /* @__PURE__ */ e("small", { children: `${a.recommendedMinutes} min` })
  ] }) }, a.id)) });
}
const p = ({ text: l }) => /* @__PURE__ */ e("p", { className: "c-empty", children: l });
function I({ onPlay: l }) {
  const [c, a] = h(null), [s, t] = h(0), r = y(() => v().filter((n) => c !== null && n.situations.includes(c)), [c]);
  return /* @__PURE__ */ o(F, { children: [
    /* @__PURE__ */ e("ul", { className: "c-tiles", children: M.map((n, f) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: `c-tile c-g${f % 6 + 1}`, "aria-pressed": c === n.id, onClick: () => {
      a(n.id), t(0);
    }, children: n.label }) }, n.id)) }),
    c !== null && /* @__PURE__ */ e(g, { list: r.slice(s * u, s * u + u), onPlay: l }),
    c !== null && r.length > u && /* @__PURE__ */ o("div", { className: "c-actions c-row", children: [
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", disabled: s === 0, onClick: () => t(s - 1), children: d.back }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", disabled: (s + 1) * u >= r.length, onClick: () => t(s + 1), children: d.next })
    ] })
  ] });
}
function R({ onPlay: l }) {
  const c = v();
  return /* @__PURE__ */ e("ul", { className: "c-list", children: S.map((a) => {
    const s = c.find((t) => t.id === a.templateId);
    return /* @__PURE__ */ e("li", { children: /* @__PURE__ */ o("button", { type: "button", className: "c-row-card", disabled: s === void 0, onClick: () => s !== void 0 && l(s), children: [
      /* @__PURE__ */ e("b", { children: a.name }),
      /* @__PURE__ */ e("small", { children: a.blurb }),
      /* @__PURE__ */ e("small", { children: a.id === "violet" ? "Start very quiet." : A[a.evidence] })
    ] }) }, a.id);
  }) });
}
function j(l) {
  const [c, a] = h($), [s, t] = h([]);
  return T(() => {
    let r = !0;
    return l.getRecord("favorites").then((n) => r && a(L(n, Date.now()))).catch(() => {
    }), l.listMixes().then((n) => r && t(n)).catch(() => {
    }), () => {
      r = !1;
    };
  }, [l]), { favs: c, mixes: s };
}
function V({ store: l, logs: c, onPlay: a, onPlayMix: s }) {
  const [t, r] = h(0), [n, f] = h(""), { favs: k, mixes: N } = j(l), b = n.trim().slice(0, 80), x = y(() => b === "" ? [] : D({ text: b }).slice(0, 20), [b]), w = y(() => v(), []), C = k.items.filter((i) => i.kind === "template").map((i) => w.find((m) => m.id === i.id)).filter((i) => i !== void 0), E = c.slice(0, 10);
  return /* @__PURE__ */ o("div", { children: [
    /* @__PURE__ */ e("h1", { className: "c-h1", children: d.libraryTitle }),
    /* @__PURE__ */ o("div", { className: "c-search", children: [
      /* @__PURE__ */ e("label", { htmlFor: "c-search-in", className: "c-sr", children: d.searchLabel }),
      /* @__PURE__ */ e("input", { id: "c-search-in", type: "search", placeholder: d.searchLabel, value: n, maxLength: 80, onChange: (i) => f(i.target.value) })
    ] }),
    b !== "" ? x.length === 0 ? /* @__PURE__ */ e(p, { text: d.searchEmpty }) : /* @__PURE__ */ e(g, { list: x, onPlay: a }) : /* @__PURE__ */ o(F, { children: [
      /* @__PURE__ */ e("div", { className: "c-tabs", role: "tablist", "aria-label": d.libraryTitle, children: d.tabs.map((i, m) => /* @__PURE__ */ e("button", { type: "button", role: "tab", id: `c-tab-${m}`, "aria-selected": t === m, "aria-controls": "c-tabpanel", className: "c-tab", onClick: () => r(m), children: i }, i)) }),
      /* @__PURE__ */ o("div", { id: "c-tabpanel", role: "tabpanel", "aria-labelledby": `c-tab-${t}`, children: [
        t === 0 && /* @__PURE__ */ e(I, { onPlay: a }),
        t === 1 && /* @__PURE__ */ e(R, { onPlay: a }),
        t === 2 && (C.length === 0 ? /* @__PURE__ */ e(p, { text: d.emptyFavorites }) : /* @__PURE__ */ e(g, { list: C, onPlay: a })),
        t === 3 && (N.length === 0 ? /* @__PURE__ */ e(p, { text: d.emptyMixes }) : /* @__PURE__ */ e("ul", { className: "c-list", children: N.map((i) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "c-row-card", onClick: () => s(i), children: /* @__PURE__ */ e("b", { children: i.name }) }) }, i.id)) })),
        t === 4 && (E.length === 0 ? /* @__PURE__ */ e(p, { text: d.emptyRecent }) : /* @__PURE__ */ e("ul", { className: "c-list", children: E.map((i) => /* @__PURE__ */ o("li", { className: "c-row-card", children: [
          /* @__PURE__ */ e("b", { children: new Date(i.startedAt).toLocaleDateString() }),
          /* @__PURE__ */ e("small", { children: `${Math.max(1, Math.round((i.endedAt - i.startedAt) / 6e4))} min` })
        ] }, i.id)) }))
      ] })
    ] })
  ] });
}
export {
  V as Library
};
