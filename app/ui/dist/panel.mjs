import { jsxs as d, jsx as a } from "react/jsx-runtime";
import { useState as i, useEffect as c } from "react";
import { d as m, g as k, a as b, e as w, h as C, i as p, s as S } from "./chunk-crewLink-CNIjqEIV.mjs";
import { j as E, k as I } from "./chunk-crewLink-CNIjqEIV.mjs";
const x = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  padding: 16,
  fontFamily: "system-ui, sans-serif",
  fontSize: 14,
  lineHeight: 1.4
}, u = { alignSelf: "flex-start", minHeight: 44, minWidth: 96, padding: "0 16px", font: "inherit", cursor: "pointer", borderRadius: 10 };
function L(e) {
  const t = e.timer;
  return t.kind !== "countdown" || !t.running ? null : Math.ceil(t.remainingSec / 60);
}
function j() {
  m();
  const { player: e } = k(), [t, f] = i(b), [h, g] = i(w);
  c(() => C(g), []);
  const [n, l] = i(() => e.snapshot());
  c(() => (l(e.snapshot()), e.subscribe(l)), [e]);
  const y = p() && n.templateId !== null, o = L(n);
  let s = "Stopped.";
  return n.playing ? s = o === null ? "Playing." : `Playing. About ${String(o)} min left.` : p() ? n.templateId === null && (s = "Open Zonked and pick a sound first.") : s = "Open Zonked once to read the headphone note.", /* @__PURE__ */ d("div", { style: x, "data-testid": "zonked-panel", children: [
    /* @__PURE__ */ a("strong", { "data-testid": "panel-title", children: n.templateName ?? "Zonked" }),
    /* @__PURE__ */ a("span", { "data-testid": "panel-hint", role: "status", children: s }),
    n.playing ? /* @__PURE__ */ a("button", { type: "button", style: u, "data-testid": "panel-stop", onClick: () => void e.stop(), children: "Stop" }) : /* @__PURE__ */ a("button", { type: "button", style: u, "data-testid": "panel-play", disabled: !y, onClick: () => void e.play(), children: "Play" }),
    /* @__PURE__ */ d("label", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "checkbox",
          "data-testid": "panel-crew",
          checked: t,
          onChange: (r) => {
            f(r.target.checked), S(r.target.checked);
          }
        }
      ),
      "Let the Crew steer my sound"
    ] }),
    /* @__PURE__ */ a("span", { "data-testid": "panel-crew-status", role: "status", children: t ? h === "connected" ? "Crew is steering." : "Crew backend not reachable. Playing on your own." : "Crew is off." })
  ] });
}
export {
  j as default,
  E as engineState,
  I as engineStats
};
