import { useEffect as e, useRef as t, useState as n } from "react";
import { H as r, c as i, gt as a, mt as o, st as s } from "./chunk-crewLink-B-5l2pQt.mjs";
import { n as c } from "./chunk-FormFrame-BoSz-j25.mjs";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
// ../../web/src/ui/calm/CrewPanel.tsx
var d = [
	"Fresh",
	"Warming up",
	s.crewBreak
];
function f(e) {
	return e === null || !Number.isFinite(e) || e < 40 ? 0 : e < 60 ? 1 : 2;
}
function p(t) {
	let [r, i] = n(() => Date.now());
	return e(() => {
		if (!t) return;
		i(Date.now());
		let e = window.setInterval(() => i(Date.now()), 1e3);
		return () => window.clearInterval(e);
	}, [t]), r;
}
var m = (e) => new Date(e).toLocaleTimeString([], {
	hour: "2-digit",
	minute: "2-digit"
});
function h(e, t) {
	if (e.source === "demo" && e.demoNextAtMs !== null) {
		let n = Math.max(0, Math.ceil((e.demoNextAtMs - t) / 1e3));
		return e.state?.burnout.level === "decompress" ? s.crewNextDemoLast(n) : s.crewNextDemo(n);
	}
	return e.changedAtMs === 0 ? s.crewNextWait : s.crewNextReal(m(Math.max(t, e.changedAtMs + r)));
}
function g({ view: e, overridden: t, onNotNow: n, onResume: r, onFollow: i, onStopDemo: c }) {
	let g = p(e.state !== null), _ = e.state;
	if (_ === null) return null;
	let v = e.source === "demo", y = !v && g < e.snoozeUntilMs, b = v ? s.crewDemoBadge : y ? s.crewPaused(m(e.snoozeUntilMs)) : s.crewFollowing, x = f(_.burnout.score), S = !v && t && !y;
	return /* @__PURE__ */ u("div", {
		"data-testid": "crew-panel",
		children: [
			/* @__PURE__ */ l("p", {
				className: "c-status",
				role: "status",
				"data-testid": "crew-status",
				children: b
			}),
			/* @__PURE__ */ u("dl", {
				className: "c-stats",
				children: [/* @__PURE__ */ u("div", { children: [/* @__PURE__ */ l("dt", { children: s.crewScore }), /* @__PURE__ */ l("dd", {
					"data-testid": "crew-score",
					children: Math.round(_.burnout.score)
				})] }), /* @__PURE__ */ u("div", { children: [/* @__PURE__ */ l("dt", { children: s.crewBeat }), /* @__PURE__ */ l("dd", {
					"data-testid": "crew-beat",
					children: `${a(_.target.beatHz)} Hz`
				})] })]
			}),
			/* @__PURE__ */ l("p", {
				className: "c-muted",
				"data-testid": "crew-beat-hint",
				children: s.crewBeatHint
			}),
			/* @__PURE__ */ u("section", {
				"aria-labelledby": "c-why-h",
				className: "c-why",
				children: [/* @__PURE__ */ l("h2", {
					id: "c-why-h",
					className: "c-h3",
					children: s.crewWhyTitle
				}), /* @__PURE__ */ l("p", {
					"data-testid": "crew-why",
					children: o(_)
				})]
			}),
			/* @__PURE__ */ l("ol", {
				className: "c-meter",
				"aria-label": "Session load",
				children: d.map((e, t) => /* @__PURE__ */ l("li", {
					className: t === x ? "c-seg c-on" : "c-seg",
					"aria-current": t === x ? "step" : void 0,
					children: e
				}, e))
			}),
			/* @__PURE__ */ u("p", {
				className: "c-next",
				"data-testid": "crew-next",
				children: [/* @__PURE__ */ l("b", { children: `${s.crewNext}: ` }), h(e, g)]
			}),
			/* @__PURE__ */ u("div", {
				className: "c-actions c-row",
				children: [v ? /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn",
					"data-testid": "crew-demo-stop",
					onClick: c,
					children: s.crewDemoStop
				}) : y ? /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn",
					"data-testid": "crew-resume",
					onClick: r,
					children: s.crewFollowAgain
				}) : /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn",
					"data-testid": "crew-not-now",
					onClick: n,
					children: s.crewNotNow
				}), S && /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "crew-follow",
					onClick: i,
					children: s.crewFollowNow
				})]
			}),
			S && /* @__PURE__ */ l("p", {
				className: "c-muted",
				children: s.crewOverridden
			}),
			/* @__PURE__ */ l("p", {
				className: "c-muted",
				"data-testid": "crew-reads",
				children: s.crewReads
			})
		]
	});
}
// ../../web/src/ui/calm/CrewScreen.tsx
function _({ crew: r, overridden: a, onDemo: o, onStopDemo: d, onNotNow: f, onResume: p, onFollow: m }) {
	let h = r.view.state !== null, _ = r.view.source === "demo", [v, y] = n(!1), b = t(!1);
	return e(() => {
		b.current && !_ && y(!0), _ && y(!1), b.current = _;
	}, [_]), /* @__PURE__ */ u("div", { children: [
		/* @__PURE__ */ l("h1", {
			className: "c-h1",
			children: s.crewTitle
		}),
		/* @__PURE__ */ l("p", {
			className: "c-lead",
			children: s.crewIntro
		}),
		/* @__PURE__ */ u("label", {
			className: "c-switch",
			children: [
				/* @__PURE__ */ l("input", {
					type: "checkbox",
					role: "switch",
					"data-testid": "calm-crew-toggle",
					checked: r.enabled || _,
					disabled: _,
					"aria-describedby": _ ? "c-crew-demo-note" : void 0,
					onChange: (e) => i(e.currentTarget.checked)
				}),
				/* @__PURE__ */ l("span", {
					className: "c-track",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ l("span", { children: _ ? s.demoSteering : s.crewSwitch })
			]
		}),
		_ && /* @__PURE__ */ l("p", {
			id: "c-crew-demo-note",
			className: "c-muted",
			"data-testid": "crew-demo-note",
			children: s.demoSteeringHint
		}),
		h ? /* @__PURE__ */ l(g, {
			view: r.view,
			overridden: a,
			onNotNow: f,
			onResume: p,
			onFollow: m,
			onStopDemo: d
		}) : /* @__PURE__ */ u("div", {
			"data-testid": "crew-why-off",
			children: [
				/* @__PURE__ */ l("p", {
					className: "c-status",
					role: "status",
					"data-testid": "crew-status",
					children: v ? s.crewDemoEnd : s.crewOff
				}),
				/* @__PURE__ */ l("p", {
					className: "c-why-off",
					children: r.enabled ? s.crewDisabled : s.crewWhyOff
				}),
				/* @__PURE__ */ u("ol", {
					className: "c-steps",
					children: [/* @__PURE__ */ l("li", { children: s.crewStep1 }), /* @__PURE__ */ l("li", { children: s.crewStep2 })]
				}),
				/* @__PURE__ */ l("p", {
					className: "c-note",
					children: s.crewOptional
				})
			]
		}),
		!_ && /* @__PURE__ */ u("div", {
			className: "c-demo",
			children: [/* @__PURE__ */ l("p", {
				className: "c-muted",
				children: s.crewDemoHint
			}), /* @__PURE__ */ l(c, {
				left: null,
				next: {
					label: s.crewDemo,
					onClick: o,
					testid: "crew-demo"
				}
			})]
		}),
		/* @__PURE__ */ l("p", {
			className: "c-muted",
			children: s.crewPrivacy
		})
	] });
}
export { _ as CrewScreen };
