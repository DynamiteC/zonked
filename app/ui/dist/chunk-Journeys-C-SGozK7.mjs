import { jsxs as u, jsx as c } from "react/jsx-runtime";
import { g as b, e as p, p as v, r as $, C as d, J as D } from "./chunk-App-DapSTSRU.mjs";
const I = 3, g = Object.freeze([]);
function C(e, i) {
  const n = new RegExp(`^${e.replace(/[^a-z0-9-]/g, "")}-\\d{2}$`);
  return i.filter((s) => n.test(s.id)).sort((s, t) => s.id < t.id ? -1 : s.id > t.id ? 1 : 0);
}
function E(e, i, n) {
  var t;
  const s = { ...i, situation: e.situation, vibe: e.vibe, availableMinutes: e.minutes };
  return (t = $(s, 1, n)[0]) == null ? void 0 : t.template.id;
}
function J(e, i, n) {
  const s = e.length;
  for (let t = 0; t < s; t += 1) {
    const a = e[(i + t) % s];
    if (a !== void 0 && (!n || a.intensity <= I)) return a.id;
  }
}
function T(e, i, n, s, t) {
  return J(C(e.family, t), i, s.extraGentle) ?? E(n, v(s), t);
}
function x(e, i, n, s = p()) {
  const t = b(i);
  if (t === void 0) return g;
  const a = [];
  for (const m of t.days) {
    if (m.kind === "rest") continue;
    const l = T(m, a.length, t, e, s);
    l !== void 0 && a.push(l);
  }
  return Object.freeze(a);
}
const f = (e) => e.days.length;
function R({ progress: e, onOpen: i }) {
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ c("h1", { className: "c-h1", children: d.journeysTitle }),
    /* @__PURE__ */ c("p", { className: "c-lead", children: d.journeysEmpty }),
    /* @__PURE__ */ c("ul", { className: "c-list", children: D.map((n, s) => {
      var a;
      const t = ((a = e[n.id]) == null ? void 0 : a.doneDays.length) ?? 0;
      return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ u("button", { type: "button", className: `c-journey-card c-wide c-j${s % 6 + 1}`, onClick: () => i(n.id), children: [
        /* @__PURE__ */ c("b", { children: n.title }),
        /* @__PURE__ */ c("small", { children: n.blurb }),
        /* @__PURE__ */ c("em", { children: t === 0 ? `${f(n)} days` : `${t} of ${f(n)} done` })
      ] }) }, n.id);
    }) })
  ] });
}
function j(e, i) {
  let n = 0;
  return e.days.map((s, t) => {
    if (s.kind === "rest") return { no: t + 1, rest: !0, templateId: void 0 };
    const a = i[n];
    return n += 1, { no: t + 1, rest: !1, templateId: a };
  });
}
function A(e) {
  var l;
  const i = b(e.id);
  if (i === void 0) return /* @__PURE__ */ c("p", { className: "c-empty", children: d.journeysEmpty });
  const n = e.progress[e.id], s = p(), t = j(i, (n == null ? void 0 : n.pickedIds) ?? []), a = (l = t.find((o) => !o.rest && !((n == null ? void 0 : n.doneDays.includes(o.no)) ?? !1))) == null ? void 0 : l.no, m = () => e.onStartJourney(e.id, { startedAt: e.todayDay, doneDays: [], pickedIds: x(e.profile, e.id, e.todayDay) });
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-link c-back", onClick: e.onBack, children: d.back }),
    /* @__PURE__ */ c("h1", { className: "c-h1", children: i.title }),
    /* @__PURE__ */ c("p", { className: "c-lead", children: i.blurb }),
    n === void 0 ? /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-primary", "data-testid": "journey-start", onClick: m, children: d.startJourney }) : /* @__PURE__ */ c("ol", { className: "c-days", children: t.map((o) => {
      const y = n.doneDays.includes(o.no), r = o.templateId === void 0 ? void 0 : s.find((h) => h.id === o.templateId), k = o.rest ? d.restDay : (r == null ? void 0 : r.name) ?? "Session", N = o.rest ? "" : `${(r == null ? void 0 : r.recommendedMinutes) ?? 0} min`;
      return /* @__PURE__ */ u("li", { className: `c-day${o.rest ? " c-rest" : ""}${y ? " c-done" : ""}${o.no === a ? " c-now" : ""}`, children: [
        /* @__PURE__ */ c("span", { className: "c-badge", "aria-hidden": "true", children: o.no }),
        /* @__PURE__ */ u("span", { className: "c-d-text", children: [
          /* @__PURE__ */ c("b", { children: `Day ${o.no}${y ? `, ${d.done}` : ""}` }),
          /* @__PURE__ */ c("small", { children: [k, N].filter((h) => h !== "").join(", ") })
        ] }),
        !o.rest && r !== void 0 && /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-small", "aria-label": `${d.play} day ${o.no}, ${r.name}`, onClick: () => e.onPlayDay(e.id, o.no, r), children: y ? d.play : d.start })
      ] }, o.no);
    }) }),
    n !== void 0 && /* @__PURE__ */ c("button", { type: "button", className: "c-btn c-link", onClick: () => e.onRestart(e.id), children: d.restart })
  ] });
}
export {
  A as JourneyDetail,
  R as JourneyList
};
