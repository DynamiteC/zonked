import { useEffect as e, useId as t, useMemo as n, useRef as r, useState as i } from "react";
import { Fragment as a, jsx as o, jsxs as s } from "react/jsx-runtime";
import { G as c, J as l, W as u, X as d, Y as f } from "./chunk-crewLink-CH1NzHoN.mjs";
import { b as p, g as m, t as h, x as g, y as _ } from "./chunk-data-CUBWt-Gc.mjs";
import { n as v, r as y, t as b } from "./chunk-FormFrame-BnLJENRx.mjs";
import { t as x } from "./chunk-SafetyNotice-DNihttKl.mjs";
import { n as S } from "./chunk-catalog-DjXCbOxc.mjs";
// ../../web/src/ui/calm/ChoiceGrid.tsx
function C({ legend: e, options: n, value: r, onChange: i }) {
	let a = t();
	return /* @__PURE__ */ s("fieldset", {
		className: "c-choices",
		children: [/* @__PURE__ */ o("legend", {
			className: "c-sr",
			children: e
		}), n.map((e) => /* @__PURE__ */ s("label", {
			className: "c-choice",
			"data-on": r === e.value ? "true" : "false",
			children: [
				/* @__PURE__ */ o("input", {
					type: "radio",
					name: a,
					value: e.value,
					"aria-label": e.label,
					checked: r === e.value,
					onChange: () => i(e.value)
				}),
				/* @__PURE__ */ o("span", {
					className: "c-radio",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ o("span", {
					className: "c-opt",
					"aria-hidden": "true",
					children: e.label
				})
			]
		}, e.value))]
	});
}
// ../../web/src/ui/calm/StarterStep.tsx
var w = 1e4, T = (e) => e.replace(/-\d+$/, "");
function E(e, t = /* @__PURE__ */ new Date()) {
	let n = /* @__PURE__ */ new Set(), r = [];
	for (let i of S(m(e, t), 12)) {
		let e = T(i.template.id);
		if (!n.has(e) && (n.add(e), r.push({
			template: i.template,
			reason: d(i.reasons[0] ?? i.template.reasonTemplate),
			score: i.score
		}), r.length === 3)) break;
	}
	return r;
}
function D(e, t = /* @__PURE__ */ new Date()) {
	let [n, r] = E(e, t);
	return n === void 0 ? null : r === void 0 || n.score - r.score >= 5 ? n : null;
}
function O({ profile: t, playing: c, onPreview: l, onStop: d, onStart: f, onBack: p }) {
	let m = n(() => E(t), [t]), [h, g] = i(m[0]?.template.id ?? ""), [_, y] = i(null), b = r(null);
	e(() => () => void (b.current !== null && window.clearTimeout(b.current)), []);
	let x = (e) => {
		b.current !== null && window.clearTimeout(b.current), g(e.id), y(e.id), l(e), b.current = window.setTimeout(() => {
			y(null), d();
		}, w);
	}, S = m.find((e) => e.template.id === h)?.template;
	return /* @__PURE__ */ s(a, { children: [
		/* @__PURE__ */ o("h1", {
			className: "c-h1 c-ftitle",
			children: u.starterTitle
		}),
		/* @__PURE__ */ s("fieldset", {
			className: "c-starters",
			children: [/* @__PURE__ */ o("legend", {
				className: "c-sr",
				children: u.starterTitle
			}), m.map((e) => /* @__PURE__ */ s("div", {
				className: "c-starter",
				"data-picked": h === e.template.id ? "true" : "false",
				children: [/* @__PURE__ */ s("label", {
					className: "c-starter-pick",
					children: [
						/* @__PURE__ */ o("input", {
							type: "radio",
							name: "starter",
							checked: h === e.template.id,
							onChange: () => g(e.template.id)
						}),
						/* @__PURE__ */ o("span", {
							className: "c-radio",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ s("span", {
							className: "c-s-text",
							children: [/* @__PURE__ */ o("b", { children: e.template.name }), /* @__PURE__ */ o("small", { children: e.reason })]
						})
					]
				}), /* @__PURE__ */ o("button", {
					type: "button",
					className: "c-btn c-small",
					onClick: () => x(e.template),
					children: u.preview
				})]
			}, e.template.id))]
		}),
		/* @__PURE__ */ o("p", {
			className: "c-status",
			role: "status",
			children: _ !== null && c ? u.previewing : ""
		}),
		/* @__PURE__ */ o(v, {
			left: p === void 0 ? null : {
				label: u.back,
				onClick: p
			},
			next: {
				label: u.start,
				disabled: S === void 0,
				onClick: () => {
					b.current !== null && window.clearTimeout(b.current), S !== void 0 && f(S);
				}
			}
		})
	] });
}
// ../../web/src/ui/calm/Onboarding.tsx
var k = (e, t) => e.map((e) => ({
	value: e,
	label: t[e]
})), A = {
	1: u.goalTitle,
	2: u.whenTitle,
	3: u.listenTitle
}, j = {
	1: u.promise,
	2: u.whenHelper,
	3: u.listenNote
};
function M({ step: e, answers: t, set: n, onBack: r, onNext: i, onSkip: d, reduced: m }) {
	return /* @__PURE__ */ s(a, { children: [
		/* @__PURE__ */ o(y, {
			step: e,
			text: u.stepOf(e),
			mood: e === 1 ? "happy" : "idle",
			reduced: m
		}),
		/* @__PURE__ */ s(b, {
			title: A[e],
			helper: j[e],
			children: [
				e === 1 && /* @__PURE__ */ o(C, {
					legend: u.goalTitle,
					options: k(p, l),
					value: t.goal,
					onChange: n.goal
				}),
				e === 2 && /* @__PURE__ */ o(C, {
					legend: u.whenTitle,
					options: k(g, f),
					value: t.when,
					onChange: n.when
				}),
				e === 3 && /* @__PURE__ */ o(C, {
					legend: u.listenTitle,
					options: k(_, c),
					value: t.device,
					onChange: n.device
				})
			]
		}),
		/* @__PURE__ */ o(v, {
			left: r === null ? {
				label: u.skip,
				onClick: d,
				testid: "onb-skip"
			} : {
				label: u.back,
				onClick: r
			},
			next: {
				label: u.next,
				onClick: i
			}
		})
	] });
}
function N({ playing: e, reduced: t, onAccept: n, onPreview: r, onStop: a, onFinish: c, initial: l = h }) {
	let [d, f] = i(1), [p, m] = i(!1), [g, _] = i(l.goal), [v, b] = i(l.timeOfDay), [S, C] = i(l.device), w = {
		...l,
		goal: g,
		timeOfDay: v,
		device: S,
		createdAt: Date.now()
	}, T = () => {
		n();
		let e = p ? E(w)[0] : D(w);
		e == null ? f(5) : c(w, e.template);
	}, k = () => {
		f(p ? 1 : 3), m(!1);
	}, A = d <= 3 ? d : null;
	return /* @__PURE__ */ s("section", {
		className: "c-onb",
		"aria-label": A === null ? u.safetyTitle : u.stepOf(A),
		children: [
			A !== null && /* @__PURE__ */ o(M, {
				step: A,
				answers: {
					goal: g,
					when: v,
					device: S
				},
				set: {
					goal: _,
					when: b,
					device: C
				},
				onBack: A > 1 ? () => f(A - 1) : null,
				onNext: () => f(A + 1),
				onSkip: () => {
					m(!0), f(4);
				},
				reduced: t
			}),
			d === 4 && /* @__PURE__ */ o(y, {
				step: 3,
				text: u.lastStep,
				mood: "idle",
				reduced: t
			}),
			d === 4 && /* @__PURE__ */ o(x, {
				onAccept: T,
				onBack: k
			}),
			d === 5 && /* @__PURE__ */ o(y, {
				step: 3,
				text: u.lastStep,
				mood: "happy",
				reduced: t
			}),
			d === 5 && /* @__PURE__ */ o(O, {
				profile: w,
				playing: e,
				onPreview: r,
				onStop: a,
				onStart: (e) => c(w, e),
				onBack: () => f(3)
			})
		]
	});
}
export { N as Onboarding };
