import { useEffect as e, useId as t, useMemo as n, useRef as r, useState as i } from "react";
import { Fragment as a, jsx as o, jsxs as s } from "react/jsx-runtime";
import { ct as c, dt as l, ft as u, pt as d, st as f } from "./chunk-crewLink-B-5l2pQt.mjs";
import { A as p, E as m, M as h, j as g, l as _ } from "./chunk-data-DrI3L2nM.mjs";
import { n as v, r as y, t as b } from "./chunk-FormFrame-BoSz-j25.mjs";
import { t as x } from "./chunk-SafetyNotice-CJuWch_-.mjs";
import { n as S } from "./chunk-catalog-DQXidRzG.mjs";
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
function O({ profile: t, playing: c, onPreview: l, onStop: u, onStart: d, onBack: p }) {
	let m = n(() => E(t), [t]), [h, g] = i(m[0]?.template.id ?? ""), [_, y] = i(null), b = r(null);
	e(() => () => void (b.current !== null && window.clearTimeout(b.current)), []);
	let x = (e) => {
		b.current !== null && window.clearTimeout(b.current), g(e.id), y(e.id), l(e), b.current = window.setTimeout(() => {
			y(null), u();
		}, w);
	}, S = m.find((e) => e.template.id === h)?.template;
	return /* @__PURE__ */ s(a, { children: [
		/* @__PURE__ */ o("h1", {
			className: "c-h1 c-ftitle",
			children: f.starterTitle
		}),
		/* @__PURE__ */ s("fieldset", {
			className: "c-starters",
			children: [/* @__PURE__ */ o("legend", {
				className: "c-sr",
				children: f.starterTitle
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
					children: f.preview
				})]
			}, e.template.id))]
		}),
		/* @__PURE__ */ o("p", {
			className: "c-status",
			role: "status",
			children: _ !== null && c ? f.previewing : ""
		}),
		/* @__PURE__ */ o(v, {
			left: p === void 0 ? null : {
				label: f.back,
				onClick: p
			},
			next: {
				label: f.start,
				disabled: S === void 0,
				onClick: () => {
					b.current !== null && window.clearTimeout(b.current), S !== void 0 && d(S);
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
	1: f.goalTitle,
	2: f.whenTitle,
	3: f.listenTitle
}, j = {
	1: f.promise,
	2: f.whenHelper,
	3: f.listenNote
};
function M({ step: e, answers: t, set: n, onBack: r, onNext: i, onSkip: d, reduced: m }) {
	return /* @__PURE__ */ s(a, { children: [
		/* @__PURE__ */ o(y, {
			step: e,
			text: f.stepOf(e),
			mood: e === 1 ? "happy" : "idle",
			reduced: m
		}),
		/* @__PURE__ */ s(b, {
			title: A[e],
			helper: j[e],
			children: [
				e === 1 && /* @__PURE__ */ o(C, {
					legend: f.goalTitle,
					options: k(g, l),
					value: t.goal,
					onChange: n.goal
				}),
				e === 2 && /* @__PURE__ */ o(C, {
					legend: f.whenTitle,
					options: k(h, u),
					value: t.when,
					onChange: n.when
				}),
				e === 3 && /* @__PURE__ */ o(C, {
					legend: f.listenTitle,
					options: k(p, c),
					value: t.device,
					onChange: n.device
				})
			]
		}),
		/* @__PURE__ */ o(v, {
			left: r === null ? {
				label: f.skip,
				onClick: d,
				testid: "onb-skip"
			} : {
				label: f.back,
				onClick: r
			},
			next: {
				label: f.next,
				onClick: i
			}
		})
	] });
}
function N({ playing: e, reduced: t, onAccept: n, onPreview: r, onStop: a, onFinish: c, initial: l = _ }) {
	let [u, d] = i(1), [p, m] = i(!1), [h, g] = i(l.goal), [v, b] = i(l.timeOfDay), [S, C] = i(l.device), w = {
		...l,
		goal: h,
		timeOfDay: v,
		device: S,
		createdAt: Date.now()
	}, T = () => {
		n();
		let e = p ? E(w)[0] : D(w);
		e == null ? d(5) : c(w, e.template);
	}, k = () => {
		d(p ? 1 : 3), m(!1);
	}, A = u <= 3 ? u : null;
	return /* @__PURE__ */ s("section", {
		className: "c-onb",
		"aria-label": A === null ? f.safetyTitle : f.stepOf(A),
		children: [
			A !== null && /* @__PURE__ */ o(M, {
				step: A,
				answers: {
					goal: h,
					when: v,
					device: S
				},
				set: {
					goal: g,
					when: b,
					device: C
				},
				onBack: A > 1 ? () => d(A - 1) : null,
				onNext: () => d(A + 1),
				onSkip: () => {
					m(!0), d(4);
				},
				reduced: t
			}),
			u === 4 && /* @__PURE__ */ o(y, {
				step: 3,
				text: f.lastStep,
				mood: "idle",
				reduced: t
			}),
			u === 4 && /* @__PURE__ */ o(x, {
				onAccept: T,
				onBack: k
			}),
			u === 5 && /* @__PURE__ */ o(y, {
				step: 3,
				text: f.lastStep,
				mood: "happy",
				reduced: t
			}),
			u === 5 && /* @__PURE__ */ o(O, {
				profile: w,
				playing: e,
				onPreview: r,
				onStop: a,
				onStart: (e) => c(w, e),
				onBack: () => d(3)
			})
		]
	});
}
export { N as Onboarding };
