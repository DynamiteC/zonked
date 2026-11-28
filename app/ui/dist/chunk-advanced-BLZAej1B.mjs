import { useEffect as e, useMemo as t, useRef as n, useState as r } from "react";
import { A as i, J as a, M as o, O as s, at as c, ct as l, j as u, ot as d, q as f, st as p } from "./chunk-crewLink-DfIjAvPP.mjs";
import { n as m, r as h } from "./chunk-soundMenu-C52iaQfx.mjs";
import { n as g, r as _, t as v } from "./chunk-RangeField-D77jQUlk.mjs";
import { jsx as y, jsxs as b } from "react/jsx-runtime";
// ../../web/src/app/neuro.ts
function x(e) {
	return {
		l: e.carrierHz - e.beatHz / 2,
		r: e.carrierHz + e.beatHz / 2
	};
}
// ../../web/src/catalog/bands.ts
var S = {
	garcia: "S1",
	chaieb: "S2",
	lane: "S4",
	zhou: "S8",
	ingendoh: "S12",
	goodin: "S7",
	padma: "S6",
	mallik: "S11"
}, C = "Not a medical device. Results vary and may not happen for you.", w = [
	{
		name: "Delta",
		minHz: .5,
		maxHz: 4,
		mayHelp: "rest and sleep",
		evidence: "limited",
		note: `Little direct research on beats at this range. Steady noise has some sleep studies. ${C}`,
		sources: [S.zhou, S.ingendoh]
	},
	{
		name: "Theta",
		minHz: 4,
		maxHz: 8,
		mayHelp: "meditation and drowsy calm",
		evidence: "preliminary",
		note: `Small studies only. ${C}`,
		sources: [S.chaieb, S.ingendoh]
	},
	{
		name: "Alpha",
		minHz: 8,
		maxHz: 13,
		mayHelp: "stress relief and relaxed focus",
		evidence: "mixed",
		note: `Some trials show lower anxiety, others show no effect. ${C}`,
		sources: [
			S.garcia,
			S.padma,
			S.mallik
		]
	},
	{
		name: "Beta",
		minHz: 13,
		maxHz: 30,
		mayHelp: "alert focus",
		evidence: "mixed",
		note: `One small study saw better vigilance, another saw no change. ${C}`,
		sources: [
			S.lane,
			S.goodin,
			S.garcia
		]
	},
	{
		name: "Gamma",
		minHz: 30,
		maxHz: 40,
		mayHelp: "alert attention (experimental)",
		evidence: "limited",
		note: `Very little evidence. Keep sessions short and volume low. ${C}`,
		sources: [S.chaieb, S.ingendoh]
	}
];
function T(e) {
	let t = Number.isFinite(e) ? e : 0;
	return w.find((e) => t >= e.minHz && t < e.maxHz) ?? (t >= 40 ? w[4] : w[0]);
}
// ../../web/src/ui/dialBands.ts
var E = {
	Delta: "deep rest",
	Theta: "dreamy",
	Alpha: "relaxed",
	Beta: "alert",
	Gamma: "sharp"
}, D = .01;
function O(e) {
	let t = [];
	for (let e = 0; e <= 100; e += 1) {
		let n = e * D, r = T(m(n)).name, i = t[t.length - 1];
		i && i.name === r ? i.to = n : t.push({
			name: r,
			from: n,
			to: n
		});
	}
	return t.map((n, r) => ({
		from: n.from,
		to: r === t.length - 1 ? 1 : t[r + 1].from,
		label: n.name,
		active: n.name === e
	}));
}
function k(e) {
	let t = T(e);
	return `${t.name}: ${E[t.name]}. About ${Math.round(e)} pulses a second.`;
}
function A(e) {
	let t = m(e), n = T(t);
	return `${Math.round(t)} hertz, ${n.name}, ${E[n.name]}`;
}
// ../../web/src/ui/advanced/CalmAlertPanel.tsx
var j = 25, ee = .3;
function te({ snap: e, player: t }) {
	let [n, i] = r(ee), [a, o] = r(!1), s = x(e.voice), c = Math.abs(s.r - s.l), u = a ? T(m(n)).name : T(c).name, d = e.voice.layers ?? l;
	return /* @__PURE__ */ b("div", {
		className: "adv-panel",
		"data-testid": "adv-dial",
		children: [
			/* @__PURE__ */ b("div", {
				className: "adv-ends",
				children: [/* @__PURE__ */ y("span", { children: "Calm" }), /* @__PURE__ */ y("span", { children: "Alert" })]
			}),
			/* @__PURE__ */ y(v, {
				id: "adv-dial",
				testId: "adv-dial-input",
				min: 0,
				max: 1,
				step: .01,
				value: n,
				valueText: A(n),
				bubbleText: `${m(n)} Hz`,
				bands: O(u),
				onChange: (e) => {
					i(e), o(!0), t.setBeatOverride(m(e)), t.setLayerOverride(h(e, d));
				}
			}),
			/* @__PURE__ */ b("p", {
				className: "adv-line",
				"data-testid": "adv-dial-readout",
				children: [
					"Pulse speed now: ",
					c.toFixed(1),
					" Hz (",
					T(c).name,
					")"
				]
			}),
			/* @__PURE__ */ y("p", {
				className: "adv-note",
				"data-testid": "adv-dial-meaning",
				children: k(c)
			}),
			c > j && /* @__PURE__ */ y("p", {
				className: "adv-note",
				"data-testid": "adv-hearing-note",
				children: "Keep it quiet. Pulses above 25 Hz can feel tiring."
			}),
			/* @__PURE__ */ y("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-dial-reset",
				onClick: () => {
					o(!1), t.setBeatOverride(null);
				},
				children: "Back to the sound's own pulse"
			})
		]
	});
}
// ../../web/src/ui/advanced/EditorPanel.tsx
var M = 50;
function N({ text: e, onText: n, onPlay: r }) {
	let i = t(() => d(e), [e]);
	return /* @__PURE__ */ b("div", {
		className: "adv-panel",
		"data-testid": "adv-editor",
		children: [
			/* @__PURE__ */ y("label", {
				htmlFor: "adv-sbg-text",
				children: ".sbg script"
			}),
			/* @__PURE__ */ y("textarea", {
				id: "adv-sbg-text",
				className: "adv-text",
				"data-testid": "adv-editor-text",
				spellCheck: !1,
				value: e,
				onChange: (e) => n(e.target.value),
				"aria-describedby": "adv-sbg-diag"
			}),
			/* @__PURE__ */ y("div", {
				id: "adv-sbg-diag",
				role: "status",
				"aria-live": "polite",
				"data-testid": "adv-diagnostics",
				children: i.diagnostics.length === 0 ? /* @__PURE__ */ y("p", {
					className: "adv-note",
					children: "No problems."
				}) : /* @__PURE__ */ y("ul", {
					className: "adv-diag",
					children: i.diagnostics.slice(0, M).map((e, t) => /* @__PURE__ */ b("li", {
						"data-severity": e.severity,
						children: [
							"Line ",
							e.line,
							": ",
							e.severity,
							": ",
							e.message
						]
					}, `${e.line}-${t}`))
				})
			}),
			/* @__PURE__ */ y("button", {
				type: "button",
				className: "adv-btn adv-primary",
				"data-testid": "adv-editor-play",
				disabled: !i.ok,
				onClick: () => r(e),
				children: "Play this script"
			})
		]
	});
}
// ../../web/src/ui/advanced/ImportExportPanel.tsx
var P = 80, F = (e) => e.replace(/[^\w.-]+/g, "_") || "script";
function I({ text: e, name: t, onImport: n }) {
	let [i, a] = r("");
	return /* @__PURE__ */ b("div", {
		className: "adv-panel",
		"data-testid": "adv-io",
		children: [/* @__PURE__ */ b("div", {
			className: "adv-actions",
			children: [/* @__PURE__ */ b("label", {
				className: "adv-btn adv-file",
				children: ["Import .sbg", /* @__PURE__ */ y("input", {
					type: "file",
					accept: ".sbg,.txt,text/plain",
					"data-testid": "adv-import-input",
					onChange: (e) => {
						let t = e.target.files?.[0];
						e.target.value = "", t !== void 0 && (t.size > p.maxBytes ? a(`That file is ${t.size} bytes. The limit is ${p.maxBytes} bytes.`) : t.text().then((e) => {
							n(e, t.name.replace(/\.[^.]*$/, "").slice(0, P) || "Imported"), a(`Imported ${t.name}.`);
						}, () => a("Could not read that file.")));
					}
				})]
			}), /* @__PURE__ */ y("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-export",
				onClick: () => {
					let n = URL.createObjectURL(new Blob([e], { type: "text/plain" })), r = document.createElement("a");
					r.href = n, r.download = `${F(t)}.sbg`, r.click(), URL.revokeObjectURL(n), a(`Saved ${F(t)}.sbg.`);
				},
				children: "Export .sbg"
			})]
		}), /* @__PURE__ */ y("p", {
			className: "adv-note",
			role: "status",
			"aria-live": "polite",
			"data-testid": "adv-io-note",
			children: i
		})]
	});
}
// ../../web/src/ui/advanced/MixPanel.tsx
var L = [
	[
		"lofi",
		"lofiLevel",
		"Warm hum"
	],
	[
		"inst",
		"instLevel",
		"Soft notes"
	],
	[
		"pad",
		"padLevel",
		"Pad"
	],
	[
		"chimes",
		"chimeLevel",
		"Chimes"
	],
	[
		"perc",
		"percLevel",
		"Gentle rhythm"
	],
	[
		"crackle",
		"crackle",
		"Vinyl crackle"
	],
	[
		"breath",
		"breathDepth",
		"Breathing swell"
	],
	[
		"width",
		"stereoWidth",
		"Stereo width"
	],
	[
		"pan",
		"panDepth",
		"Slow pan"
	]
], R = .6, z = (e) => Math.round(e * 100);
function B({ snap: e, player: t }) {
	let n = e.voice.layers ?? l, r = e.voice.noise, i = r === "violet" ? R : 1, a = Math.min(i, e.voice.noiseLevel);
	return /* @__PURE__ */ b("div", {
		className: "adv-panel",
		"data-testid": "adv-mix",
		children: [
			L.map(([e, r, i]) => /* @__PURE__ */ b("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ y("label", {
					htmlFor: `adv-mix-${e}`,
					children: i
				}), /* @__PURE__ */ y(v, {
					id: `adv-mix-${e}`,
					testId: `adv-mix-${e}`,
					min: 0,
					max: 1,
					step: .05,
					value: n[r],
					valueText: `${z(n[r])} percent`,
					bubbleText: `${z(n[r])}`,
					ticks: g(),
					onChange: (e) => t.setLayerOverride({ [r]: e })
				})]
			}, e)),
			r !== "off" && /* @__PURE__ */ b("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ y("label", {
					htmlFor: "adv-mix-noise",
					children: "Background noise"
				}), /* @__PURE__ */ y(v, {
					id: "adv-mix-noise",
					testId: "adv-mix-noise",
					min: 0,
					max: i,
					step: .05,
					value: a,
					valueText: `${z(a)} percent`,
					bubbleText: `${z(a)}`,
					ticks: g(i),
					onChange: (e) => t.setNoiseOverride({ noiseLevel: Math.min(i, e) })
				})]
			}),
			r === "violet" && /* @__PURE__ */ y("p", {
				className: "adv-note",
				"data-testid": "adv-violet-note",
				children: "Violet is bright. Start very quiet."
			}),
			/* @__PURE__ */ y("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-mix-reset",
				onClick: () => t.clearLayerOverrides(),
				children: "Reset to the sound"
			})
		]
	});
}
// ../../web/src/ui/advanced/HealthPanel.tsx
function V() {
	let [t, n] = r(() => o.count(Date.now(), s));
	e(() => {
		let e = setInterval(() => n(o.count(Date.now(), s)), 2e3);
		return () => clearInterval(e);
	}, []);
	let a = i(t);
	return /* @__PURE__ */ b("div", {
		"data-testid": "sound-health",
		children: [
			/* @__PURE__ */ y("p", {
				role: "status",
				"data-testid": "sound-health-line",
				children: u(t)
			}),
			a !== "" && /* @__PURE__ */ y("p", {
				className: "meta",
				"data-testid": "sound-health-hint",
				children: a
			}),
			/* @__PURE__ */ y("p", {
				className: "meta",
				children: "Counted on this device only. Never sent anywhere."
			})
		]
	});
}
// ../../web/src/ui/useFrame.ts
function H(t, r) {
	let i = n(t);
	e(() => {
		i.current = t;
	}), e(() => {
		if (!r) return;
		let e = 0, t = 0, n = (r) => {
			let a = t === 0 ? 0 : Math.min(.25, (r - t) / 1e3);
			t = r, i.current(a), e = requestAnimationFrame(n);
		}, a = () => {
			document.hidden ? (e !== 0 && cancelAnimationFrame(e), e = 0) : e === 0 && (t = 0, e = requestAnimationFrame(n));
		};
		return document.addEventListener("visibilitychange", a), a(), () => {
			document.removeEventListener("visibilitychange", a), e !== 0 && cancelAnimationFrame(e);
		};
	}, [r]);
}
// ../../web/src/ui/Scope.tsx
var U = 1e3, W = 300, G = 512, K = 660, q = 700, J = 300, Y = "#FFE600", X = "#00E5A8";
function Z(e, t, n) {
	if (e.clearRect(0, 0, U, W), e.lineWidth = 1, e.strokeStyle = "rgba(255,255,255,0.12)", e.beginPath(), e.moveTo(0, W / 2), e.lineTo(K, W / 2), e.rect(q, 0, J, J), e.moveTo(850, 0), e.lineTo(850, J), e.moveTo(q, J / 2), e.lineTo(1e3, J / 2), e.stroke(), n < 2) return;
	let r = W * .45, i = K / (n - 1);
	e.lineWidth = 2, e.strokeStyle = Y, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = W / 2 - (t[a * 2] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.strokeStyle = X, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = W / 2 - (t[a * 2 + 1] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.lineWidth = 1, e.strokeStyle = "rgba(255,184,0,0.8)", e.beginPath();
	let a = J / 2;
	for (let r = 0; r < n; r++) {
		let n = 850 + (t[r * 2] ?? 0) * a * .9, i = a - (t[r * 2 + 1] ?? 0) * a * .9;
		r === 0 ? e.moveTo(n, i) : e.lineTo(n, i);
	}
	e.stroke();
}
function Q(e, t) {
	if (t <= 0) return 0;
	let n = 0;
	for (let r = 0; r < t * 2; r++) n += (e[r] ?? 0) ** 2;
	return Math.sqrt(n / (t * 2));
}
function ne({ telemetry: e, onLevel: t }) {
	let r = n(null), i = n(new Float32Array(G * 2));
	return H(() => {
		let n = r.current?.getContext("2d"), a = e.read(i.current);
		t?.(Q(i.current, a)), n != null && Z(n, i.current, a);
	}, !0), /* @__PURE__ */ y("canvas", {
		ref: r,
		className: "scope",
		"data-testid": "scope-canvas",
		width: U,
		height: W,
		role: "img",
		"aria-label": "Left and right channel oscilloscope and stereo Lissajous plot"
	});
}
// ../../web/src/ui/advanced/ScopePanel.tsx
function re({ telemetry: e }) {
	return /* @__PURE__ */ y("div", {
		className: "adv-panel adv-scope",
		"data-testid": "adv-scope",
		children: /* @__PURE__ */ y(ne, { telemetry: e })
	});
}
// ../../web/src/ui/advanced/TimersPanel.tsx
var ie = (e, t, n) => Number.isFinite(e) ? Math.min(n, Math.max(t, Math.round(e))) : t;
function $(e) {
	return /* @__PURE__ */ b("div", {
		className: "adv-field",
		children: [/* @__PURE__ */ y("label", {
			htmlFor: e.id,
			children: e.label
		}), /* @__PURE__ */ y("input", {
			id: e.id,
			"data-testid": e.id,
			className: "adv-num",
			type: "number",
			inputMode: "numeric",
			min: e.min,
			max: e.max,
			value: e.value,
			onChange: (t) => e.onChange(ie(Number(t.target.value), e.min, e.max))
		})]
	});
}
function ae({ timer: e, player: t }) {
	let [n, i] = r(30), [a, o] = r(30), [s, c] = r(25), [l, u] = r(5), d = e.kind !== "none";
	return /* @__PURE__ */ b("div", {
		className: "adv-panel",
		"data-testid": "adv-timers",
		children: [
			/* @__PURE__ */ y("p", {
				className: "adv-line",
				"data-testid": "adv-timer-status",
				children: d ? `${e.kind}${e.phase === void 0 ? "" : `, ${e.phase}`}: ${_(e.remainingSec)} left` : "No timer is running."
			}),
			/* @__PURE__ */ b("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ y($, {
					id: "adv-timer-cd",
					label: "Countdown minutes",
					value: n,
					min: 1,
					max: 720,
					onChange: i
				}), /* @__PURE__ */ y("button", {
					type: "button",
					className: "adv-btn",
					"data-testid": "adv-timer-countdown",
					onClick: () => t.startTimer({
						kind: "countdown",
						minutes: n
					}),
					children: "Start countdown"
				})]
			}),
			/* @__PURE__ */ b("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ y($, {
					id: "adv-timer-sl",
					label: "Sleep fade minutes",
					value: a,
					min: 1,
					max: 720,
					onChange: o
				}), /* @__PURE__ */ y("button", {
					type: "button",
					className: "adv-btn",
					"data-testid": "adv-timer-sleep",
					onClick: () => t.startTimer({
						kind: "sleep-fade",
						minutes: a
					}),
					children: "Start sleep fade"
				})]
			}),
			/* @__PURE__ */ b("div", {
				className: "adv-actions",
				children: [
					/* @__PURE__ */ y($, {
						id: "adv-timer-focus",
						label: "Focus minutes",
						value: s,
						min: 1,
						max: 180,
						onChange: c
					}),
					/* @__PURE__ */ y($, {
						id: "adv-timer-break",
						label: "Break minutes",
						value: l,
						min: 1,
						max: 60,
						onChange: u
					}),
					/* @__PURE__ */ y("button", {
						type: "button",
						className: "adv-btn",
						"data-testid": "adv-timer-pomodoro",
						onClick: () => t.startTimer({
							kind: "pomodoro",
							focusMin: s,
							breakMin: l,
							longBreakMin: Math.max(l, 15),
							longEvery: 4
						}),
						children: "Start focus and break"
					})
				]
			}),
			/* @__PURE__ */ y("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-timer-stop",
				disabled: !d,
				onClick: () => t.stopTimer(),
				children: "Stop timer"
			})
		]
	});
}
// ../../web/src/ui/advanced/usePlayerSnapshot.ts
function oe(t) {
	let [n, i] = r(() => t.snapshot());
	return e(() => t.subscribe(i), [t]), n;
}
// ../../web/src/ui/advanced/AdvancedPanels.tsx
var se = [
	"Mix",
	"Calm to Alert",
	"Editor",
	"Import and export",
	"Timers",
	"Scope",
	"Sound health"
];
function ce({ engine: n, player: i, onClose: o }) {
	let s = t(() => i ?? new f(n, a, () => void 0), [i, n]);
	e(() => {
		if (i === void 0) return () => void s.stop();
	}, [i, s]);
	let l = oe(s), [u, d] = r(c[0]?.sbg ?? ""), [p, m] = r("script"), h = {
		Mix: /* @__PURE__ */ y(B, {
			snap: l,
			player: s
		}),
		"Calm to Alert": /* @__PURE__ */ y(te, {
			snap: l,
			player: s
		}),
		Editor: /* @__PURE__ */ y(N, {
			text: u,
			onText: d,
			onPlay: (e) => void s.playCustom(e)
		}),
		"Import and export": /* @__PURE__ */ y(I, {
			text: u,
			name: p,
			onImport: (e, t) => {
				d(e), m(t);
			}
		}),
		Timers: /* @__PURE__ */ y(ae, {
			timer: l.timer,
			player: s
		}),
		Scope: /* @__PURE__ */ y(re, { telemetry: n.telemetry }),
		"Sound health": /* @__PURE__ */ y(V, {})
	};
	return /* @__PURE__ */ b("div", {
		className: "adv-panels",
		"data-testid": "advanced-panels",
		children: [se.map((e, t) => /* @__PURE__ */ b("details", {
			className: "adv-section",
			open: t === 0,
			"data-testid": `adv-section-${e.toLowerCase().replace(/ /g, "-")}`,
			children: [/* @__PURE__ */ y("summary", { children: e }), h[e]]
		}, e)), o !== void 0 && /* @__PURE__ */ y("button", {
			type: "button",
			className: "adv-btn",
			"data-testid": "adv-close",
			onClick: o,
			children: "Close"
		})]
	});
}
export { ce as AdvancedPanels };
