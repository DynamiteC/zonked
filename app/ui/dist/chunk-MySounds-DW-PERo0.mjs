import { jsxs as m, jsx as s } from "react/jsx-runtime";
import { useRef as b, useState as v, useCallback as d, useEffect as y } from "react";
import { C as o } from "./chunk-crewLink-BQ1FLTqp.mjs";
import { I as w, h as N, v as k, i as A, j as C, k as g, m as O } from "./chunk-App-7MO50ppA.mjs";
const S = (a) => `${(a / (1024 * 1024)).toFixed(1)} MB`;
async function T(a) {
  if (a.size > O) return "This file is bigger than 8 MB.";
  try {
    return await a.arrayBuffer();
  } catch {
    return "This file could not be read.";
  }
}
function x() {
  const [a, r] = v([]), [l, c] = v(""), n = d(async () => {
    const t = await N();
    t.ok ? r(t.value) : c(t.error);
  }, []);
  y(() => void n(), [n]);
  const u = d(
    async (t) => {
      c("");
      const i = await T(t);
      if (typeof i == "string") return c(i);
      const f = await k(i);
      if (!f.ok) return c(f.error);
      const p = await A(t.name, i);
      c(p.ok ? o.mineAdded : p.error), await n();
    },
    [n]
  ), h = d(async (t) => {
    const i = await C(t);
    i.ok || c(i.error), await n();
  }, [n]), e = d(async () => {
    const t = await g();
    t.ok || c(t.error), await n();
  }, [n]);
  return { items: a, status: l, add: u, remove: h, removeAll: e };
}
function j({ nature: a }) {
  const r = x(), l = b(null), { remove: c, removeAll: n } = r, u = (e) => {
    a.on === e && a.stop(), c(e);
  }, h = () => {
    a.stop(), n();
  };
  return /* @__PURE__ */ m("section", { className: "c-card c-mine", "aria-labelledby": "c-mine-h", "data-testid": "my-sounds", children: [
    /* @__PURE__ */ s("h2", { id: "c-mine-h", className: "c-h3", children: o.mineTitle }),
    /* @__PURE__ */ s("p", { className: "c-eyebrow", "data-testid": "mine-stays", children: o.mineStays }),
    /* @__PURE__ */ s("p", { className: "c-muted", children: o.mineNote }),
    /* @__PURE__ */ s("p", { className: "c-muted", children: o.mineLimits }),
    /* @__PURE__ */ s("input", { ref: l, className: "c-sr", id: "c-mine-file", type: "file", accept: "audio/*", "data-testid": "mine-file", tabIndex: -1, onChange: (e) => {
      var i;
      const t = (i = e.currentTarget.files) == null ? void 0 : i[0];
      e.currentTarget.value = "", t !== void 0 && r.add(t);
    } }),
    /* @__PURE__ */ s("button", { type: "button", className: "c-btn", onClick: () => {
      var e;
      return (e = l.current) == null ? void 0 : e.click();
    }, children: o.mineChoose }),
    /* @__PURE__ */ s("p", { className: "c-status", role: "status", "data-testid": "mine-status", children: r.status }),
    r.items.length === 0 ? /* @__PURE__ */ s("p", { className: "c-muted", children: o.mineEmpty }) : /* @__PURE__ */ s("ul", { className: "c-list", children: r.items.map((e) => /* @__PURE__ */ m("li", { className: "c-own-row", children: [
      /* @__PURE__ */ m("button", { type: "button", className: "c-row-card", "data-testid": "mine-play", "aria-pressed": a.on === e.id, onClick: () => a.start(e.id), children: [
        /* @__PURE__ */ m("span", { children: [
          /* @__PURE__ */ s(w, { name: "file" }),
          " ",
          /* @__PURE__ */ s("b", { children: e.name })
        ] }),
        /* @__PURE__ */ s("small", { children: S(e.size) })
      ] }),
      /* @__PURE__ */ s("button", { type: "button", className: "c-btn c-small", "data-testid": "mine-remove", "aria-label": `${o.mineRemove} ${e.name}`, onClick: () => u(e.id), children: o.mineRemove })
    ] }, e.id)) }),
    r.items.length > 0 && /* @__PURE__ */ s("button", { type: "button", className: "c-btn c-link", "data-testid": "mine-remove-all", onClick: h, children: o.mineRemoveAll })
  ] });
}
export {
  j as MySounds
};
