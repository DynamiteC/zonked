import { jsxs as d, jsx as e, Fragment as T } from "react/jsx-runtime";
import { useState as h, useMemo as g, useEffect as $ } from "react";
import { b as v, P as M, N as S, c as A, I, d as D } from "./chunk-App-CzOQ23by.mjs";
import { C as o, F as R, E as j } from "./chunk-crewLink-Cq0htOCx.mjs";
function O(a, s = v()) {
  const l = (a.text ?? "").toLowerCase().split(/\s+/).filter((t) => t.length > 0), i = a.layerTags ?? [];
  return s.filter((t) => {
    if (a.category !== void 0 && t.category !== a.category || a.vibe !== void 0 && t.vibe !== a.vibe || a.adhdFriendly !== void 0 && t.adhdFriendly !== a.adhdFriendly || !i.every((n) => t.layerTags.includes(n))) return !1;
    const m = `${t.name} ${t.id} ${t.category} ${t.vibe} ${t.tags.join(" ")}`.toLowerCase();
    return l.every((n) => m.includes(n));
  });
}
const p = 10;
function x({ list: a, onPlay: s }) {
  return /* @__PURE__ */ e("ul", { className: "c-list", children: a.map((l) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ d("button", { type: "button", className: "c-row-card", onClick: () => s(l), children: [
    /* @__PURE__ */ e("b", { children: l.name }),
    /* @__PURE__ */ e("small", { children: `${l.recommendedMinutes} min` })
  ] }) }, l.id)) });
}
const N = ({ text: a }) => /* @__PURE__ */ e("p", { className: "c-empty", children: a });
function G({ onPlay: a }) {
  const [s, l] = h(null), [i, t] = h(0), m = g(() => {
    const r = {};
    for (const u of v()) for (const f of u.situations) r[f] = (r[f] ?? 0) + 1;
    return r;
  }, []), n = g(() => v().filter((r) => s !== null && r.situations.includes(s)), [s]);
  return /* @__PURE__ */ d(T, { children: [
    /* @__PURE__ */ e("ul", { className: "c-tiles", children: R.map((r, u) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ d("button", { type: "button", className: `c-tile c-g${u % 6 + 1}`, "aria-pressed": s === r.id, onClick: () => {
      l(r.id), t(0);
    }, children: [
      /* @__PURE__ */ e(I, { name: r.icon }),
      /* @__PURE__ */ e("span", { className: "c-tile-name", children: r.label }),
      /* @__PURE__ */ e("span", { className: "c-tile-mood", children: r.mood }),
      /* @__PURE__ */ e("span", { className: "c-tile-count", children: o.sounds(m[r.id] ?? 0) })
    ] }) }, r.id)) }),
    s !== null && /* @__PURE__ */ e(x, { list: n.slice(i * p, i * p + p), onPlay: a }),
    s !== null && n.length > p && /* @__PURE__ */ d("div", { className: "c-actions c-row", children: [
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", disabled: i === 0, onClick: () => t(i - 1), children: o.back }),
      /* @__PURE__ */ e("button", { type: "button", className: "c-btn c-small", disabled: (i + 1) * p >= n.length, onClick: () => t(i + 1), children: o.next })
    ] })
  ] });
}
function U({ onPlay: a }) {
  const s = v();
  return /* @__PURE__ */ e("ul", { className: "c-list", children: D.map((l) => {
    const i = s.find((t) => t.id === l.templateId);
    return /* @__PURE__ */ e("li", { children: /* @__PURE__ */ d("button", { type: "button", className: "c-row-card", disabled: i === void 0, onClick: () => i !== void 0 && a(i), children: [
      /* @__PURE__ */ e("b", { children: l.name }),
      /* @__PURE__ */ e("small", { children: l.blurb }),
      /* @__PURE__ */ e("small", { children: l.id === "violet" ? "Start very quiet." : j[l.evidence] })
    ] }) }, l.id);
  }) });
}
function V(a) {
  const [s, l] = h(S), [i, t] = h([]);
  return $(() => {
    let m = !0;
    return a.getRecord("favorites").then((n) => m && l(A(n, Date.now()))).catch(() => {
    }), a.listMixes().then((n) => m && t(n)).catch(() => {
    }), () => {
      m = !1;
    };
  }, [a]), { favs: s, mixes: i };
}
function z({ store: a, logs: s, reduced: l = !1, onNature: i, onPlay: t, onPlayMix: m }) {
  const [n, r] = h(0), [u, f] = h(""), { favs: w, mixes: C } = V(a), y = u.trim().slice(0, 80), k = g(() => y === "" ? [] : O({ text: y }).slice(0, 20), [y]), L = g(() => v(), []), E = w.items.filter((c) => c.kind === "template").map((c) => L.find((b) => b.id === c.id)).filter((c) => c !== void 0), F = s.slice(0, 10);
  return /* @__PURE__ */ d("div", { children: [
    /* @__PURE__ */ e(M, { title: o.libraryTitle, reduced: l }),
    i !== void 0 && /* @__PURE__ */ d("button", { type: "button", className: "c-card c-link-card c-nature-link", "data-testid": "open-nature", onClick: i, children: [
      /* @__PURE__ */ e("b", { children: o.natureTitle }),
      /* @__PURE__ */ e("span", { className: "c-muted", children: o.natureLine })
    ] }),
    /* @__PURE__ */ d("div", { className: "c-search", children: [
      /* @__PURE__ */ e("label", { htmlFor: "c-search-in", className: "c-sr", children: o.searchLabel }),
      /* @__PURE__ */ e("input", { id: "c-search-in", type: "search", placeholder: o.searchLabel, value: u, maxLength: 80, onChange: (c) => f(c.target.value) })
    ] }),
    y !== "" ? k.length === 0 ? /* @__PURE__ */ e(N, { text: o.searchEmpty }) : /* @__PURE__ */ e(x, { list: k, onPlay: t }) : /* @__PURE__ */ d(T, { children: [
      /* @__PURE__ */ e("div", { className: "c-tabs", role: "tablist", "aria-label": o.libraryTitle, children: o.tabs.map((c, b) => /* @__PURE__ */ e("button", { type: "button", role: "tab", id: `c-tab-${b}`, "aria-selected": n === b, "aria-controls": "c-tabpanel", className: "c-tab", onClick: () => r(b), children: c }, c)) }),
      /* @__PURE__ */ d("div", { id: "c-tabpanel", role: "tabpanel", "aria-labelledby": `c-tab-${n}`, children: [
        n === 0 && /* @__PURE__ */ e(G, { onPlay: t }),
        n === 1 && /* @__PURE__ */ e(U, { onPlay: t }),
        n === 2 && (E.length === 0 ? /* @__PURE__ */ e(N, { text: o.emptyFavorites }) : /* @__PURE__ */ e(x, { list: E, onPlay: t })),
        n === 3 && (C.length === 0 ? /* @__PURE__ */ e(N, { text: o.emptyMixes }) : /* @__PURE__ */ e("ul", { className: "c-list", children: C.map((c) => /* @__PURE__ */ e("li", { children: /* @__PURE__ */ e("button", { type: "button", className: "c-row-card", onClick: () => m(c), children: /* @__PURE__ */ e("b", { children: c.name }) }) }, c.id)) })),
        n === 4 && (F.length === 0 ? /* @__PURE__ */ e(N, { text: o.emptyRecent }) : /* @__PURE__ */ e("ul", { className: "c-list", children: F.map((c) => /* @__PURE__ */ d("li", { className: "c-row-card", children: [
          /* @__PURE__ */ e("b", { children: new Date(c.startedAt).toLocaleDateString() }),
          /* @__PURE__ */ e("small", { children: `${Math.max(1, Math.round((c.endedAt - c.startedAt) / 6e4))} min` })
        ] }, c.id)) }))
      ] })
    ] })
  ] });
}
export {
  z as Library
};
