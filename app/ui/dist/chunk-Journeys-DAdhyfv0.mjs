import { jsxs as u, jsx as o } from "react/jsx-runtime";
import { g as h, b as p, p as v, r as $, P as D, J as I } from "./chunk-App-DWMtU3Ve.mjs";
import { C as d } from "./chunk-crewLink-BlI22vqq.mjs";
const g = 3, C = Object.freeze([]);
function E(e, s) {
  const i = new RegExp(`^${e.replace(/[^a-z0-9-]/g, "")}-\\d{2}$`);
  return s.filter((t) => i.test(t.id)).sort((t, n) => t.id < n.id ? -1 : t.id > n.id ? 1 : 0);
}
function J(e, s, i) {
  var n;
  const t = { ...s, situation: e.situation, vibe: e.vibe, availableMinutes: e.minutes };
  return (n = $(t, 1, i)[0]) == null ? void 0 : n.template.id;
}
function T(e, s, i) {
  const t = e.length;
  for (let n = 0; n < t; n += 1) {
    const c = e[(s + n) % t];
    if (c !== void 0 && (!i || c.intensity <= g)) return c.id;
  }
}
function x(e, s, i, t, n) {
  return T(E(e.family, n), s, t.extraGentle) ?? J(i, v(t), n);
}
function w(e, s, i, t = p()) {
  const n = h(s);
  if (n === void 0) return C;
  const c = [];
  for (const m of n.days) {
    if (m.kind === "rest") continue;
    const l = x(m, c.length, n, e, t);
    l !== void 0 && c.push(l);
  }
  return Object.freeze(c);
}
const b = (e) => e.days.length;
function P({ progress: e, onOpen: s, reduced: i = !1 }) {
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ o(D, { title: d.journeysTitle, reduced: i }),
    /* @__PURE__ */ o("p", { className: "c-lead", children: d.journeysEmpty }),
    /* @__PURE__ */ o("ul", { className: "c-list", children: I.map((t) => {
      var c;
      const n = ((c = e[t.id]) == null ? void 0 : c.doneDays.length) ?? 0;
      return /* @__PURE__ */ o("li", { children: /* @__PURE__ */ u("button", { type: "button", className: "c-journey-card c-wide", onClick: () => s(t.id), children: [
        /* @__PURE__ */ o("b", { children: t.title }),
        /* @__PURE__ */ o("small", { children: t.blurb }),
        /* @__PURE__ */ o("em", { children: n === 0 ? d.dayZero(b(t)) : `${n} of ${b(t)} done` })
      ] }) }, t.id);
    }) })
  ] });
}
function M(e, s) {
  let i = 0;
  return e.days.map((t, n) => {
    if (t.kind === "rest") return { no: n + 1, rest: !0, templateId: void 0 };
    const c = s[i];
    return i += 1, { no: n + 1, rest: !1, templateId: c };
  });
}
function S(e) {
  var l;
  const s = h(e.id);
  if (s === void 0) return /* @__PURE__ */ o("p", { className: "c-empty", children: d.journeysEmpty });
  const i = e.progress[e.id], t = p(), n = M(s, (i == null ? void 0 : i.pickedIds) ?? []), c = (l = n.find((a) => !a.rest && !((i == null ? void 0 : i.doneDays.includes(a.no)) ?? !1))) == null ? void 0 : l.no, m = () => e.onStartJourney(e.id, { startedAt: e.todayDay, doneDays: [], pickedIds: w(e.profile, e.id, e.todayDay) });
  return /* @__PURE__ */ u("div", { children: [
    /* @__PURE__ */ o("button", { type: "button", className: "c-btn c-link c-back", onClick: e.onBack, children: d.back }),
    /* @__PURE__ */ o("h1", { className: "c-h1", children: s.title }),
    /* @__PURE__ */ o("p", { className: "c-lead", children: s.blurb }),
    i === void 0 ? /* @__PURE__ */ o("button", { type: "button", className: "c-btn c-primary", "data-testid": "journey-start", onClick: m, children: d.startJourney }) : /* @__PURE__ */ o("ol", { className: "c-days", children: n.map((a) => {
      const y = i.doneDays.includes(a.no), r = a.templateId === void 0 ? void 0 : t.find((f) => f.id === a.templateId), k = a.rest ? d.restDay : (r == null ? void 0 : r.name) ?? "Session", N = a.rest ? "" : `${(r == null ? void 0 : r.recommendedMinutes) ?? 0} min`;
      return /* @__PURE__ */ u("li", { className: `c-day${a.rest ? " c-rest" : ""}${y ? " c-done" : ""}${a.no === c ? " c-now" : ""}`, children: [
        /* @__PURE__ */ o("span", { className: "c-badge", "aria-hidden": "true", children: a.no }),
        /* @__PURE__ */ u("span", { className: "c-d-text", children: [
          /* @__PURE__ */ o("b", { children: `Day ${a.no}${y ? `, ${d.done}` : ""}` }),
          /* @__PURE__ */ o("small", { children: [k, N].filter((f) => f !== "").join(", ") })
        ] }),
        !a.rest && r !== void 0 && /* @__PURE__ */ o("button", { type: "button", className: "c-btn c-small", "aria-label": `${d.play} day ${a.no}, ${r.name}`, onClick: () => e.onPlayDay(e.id, a.no, r), children: y ? d.play : d.start })
      ] }, a.no);
    }) }),
    i !== void 0 && /* @__PURE__ */ o("button", { type: "button", className: "c-btn c-link", onClick: () => e.onRestart(e.id), children: d.restart })
  ] });
}
export {
  S as JourneyDetail,
  P as JourneyList
};
