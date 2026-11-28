import { useEffect as e, useId as t, useRef as n } from "react";
import { Fragment as r, jsx as i, jsxs as a } from "react/jsx-runtime";
import { t as o } from "./chunk-useBreath-BZ3euK4B.mjs";
// ../../web/src/ui/calm/mascot/eyes.tsx
var s = {
	idle: ["ring", "ring"],
	listening: ["half", "half"],
	happy: ["arc", "arc"],
	sleepy: ["lid", "lid"],
	breathing: ["ring", "ring"],
	focus: ["narrow", "narrow"],
	steering: ["ring", "ring"],
	tired: ["heavy", "heavy"],
	done: ["closed", "closed"],
	offline: ["up", "up"],
	error: ["ring", "squint"],
	loading: ["dial", "dial"]
}, c = "#FFDC1A", l = "#3A2A2E", u = 40, d = 150;
function f(e, t, n) {
	let r = Math.sqrt(1600 - t * t), i = d + t;
	return n ? `M${e - r} ${i}A${u} ${u} 0 ${+(t > 0)} 1 ${e + r} ${i}Z` : `M${e + r} ${i}A${u} ${u} 0 ${+(t < 0)} 1 ${e - r} ${i}Z`;
}
function p({ cx: e, d: t, top: n = !0, tilt: r = 0 }) {
	return /* @__PURE__ */ i("path", {
		className: "cm-lid",
		d: f(e, t, n),
		fill: c,
		stroke: l,
		strokeWidth: "4",
		strokeLinejoin: "round",
		transform: r ? `rotate(${r} ${e} ${d})` : void 0
	});
}
function m({ cx: e, lift: t = 0 }) {
	return /* @__PURE__ */ a(r, { children: [
		/* @__PURE__ */ i("circle", {
			className: "cm-ring cm-s-gold",
			cx: e,
			cy: d,
			r: "24",
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "4",
			strokeOpacity: "0.85"
		}),
		/* @__PURE__ */ i("circle", {
			className: "cm-pupil cm-f-gold",
			cx: e,
			cy: d + t,
			r: "8",
			fill: "#FFD23A"
		}),
		/* @__PURE__ */ i("circle", {
			cx: e - 9,
			cy: 140 + t,
			r: "4",
			fill: "#FFF6DC",
			opacity: "0.8"
		})
	] });
}
function h({ cx: e, kind: t, side: n }) {
	switch (t) {
		case "arc": return /* @__PURE__ */ i("path", {
			className: "cm-s-gold",
			d: `M${e - 20} 160A20 20 0 0 1 ${e + 20} 160`,
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "8",
			strokeLinecap: "round"
		});
		case "closed": return /* @__PURE__ */ i("path", {
			className: "cm-s-gold",
			d: `M${e - 20} 142Q${e} 170 ${e + 20} 142`,
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "8",
			strokeLinecap: "round"
		});
		case "up": return /* @__PURE__ */ i(m, {
			cx: e,
			lift: -10
		});
		case "dial": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ a("g", {
			className: "cm-dial",
			children: [/* @__PURE__ */ i("circle", {
				className: "cm-ring cm-s-gold",
				cx: e,
				cy: d,
				r: "24",
				fill: "none",
				stroke: "#FFD23A",
				strokeWidth: "5",
				strokeDasharray: "8 10",
				strokeLinecap: "round"
			}), /* @__PURE__ */ i("path", {
				d: `M${e} 116V122M${e + 34} ${d}H${e + 28}M${e} 184V178M${e - 34} ${d}H${e - 28}`,
				stroke: "#FFD23A",
				strokeWidth: "4",
				strokeLinecap: "round"
			})]
		}), /* @__PURE__ */ i("circle", {
			className: "cm-pupil cm-f-gold",
			cx: e,
			cy: d,
			r: "5",
			fill: "#FFD23A"
		})] });
		case "lid": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ i(m, { cx: e }), /* @__PURE__ */ i(p, {
			cx: e,
			d: 20
		})] });
		case "half": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ i(m, { cx: e }), /* @__PURE__ */ i(p, {
			cx: e,
			d: 4
		})] });
		case "narrow": return /* @__PURE__ */ a(r, { children: [
			/* @__PURE__ */ i(m, { cx: e }),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: -11
			}),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: 11,
				top: !1
			})
		] });
		case "heavy": return /* @__PURE__ */ a(r, { children: [/* @__PURE__ */ i(m, { cx: e }), /* @__PURE__ */ i(p, {
			cx: e,
			d: 12,
			tilt: n * 14
		})] });
		case "squint": return /* @__PURE__ */ a(r, { children: [
			/* @__PURE__ */ i(m, { cx: e }),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: -4,
				tilt: -n * 8
			}),
			/* @__PURE__ */ i(p, {
				cx: e,
				d: 13,
				top: !1
			})
		] });
		default: return /* @__PURE__ */ i(m, { cx: e });
	}
}
function g({ cx: e, kind: t, side: n }) {
	return /* @__PURE__ */ a("g", {
		className: "cm-eye",
		"data-eye": t,
		children: [/* @__PURE__ */ i("circle", {
			className: "cm-f-mask cm-s-ink",
			cx: e,
			cy: d,
			r: u,
			fill: "#241F2B",
			strokeWidth: "5"
		}), /* @__PURE__ */ i(h, {
			cx: e,
			kind: t,
			side: n
		})]
	});
}
// ../../web/src/ui/calm/mascot/layers.tsx
var _ = "0 0 512 512", v = "translate(46.1 56.1) scale(.82)", y = [
	190,
	226,
	286,
	322
], b = {
	idle: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: 1
	},
	listening: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: 1
	},
	happy: {
		dy: [
			-9,
			4,
			4,
			-9
		],
		len: .9,
		rot: [
			-16,
			-5,
			5,
			16
		]
	},
	sleepy: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .45
	},
	breathing: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .8
	},
	focus: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .7
	},
	steering: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: 1
	},
	tired: {
		dy: [
			7,
			-2,
			-2,
			7
		],
		len: .7,
		rot: [
			10,
			3,
			-3,
			-10
		]
	},
	done: {
		dy: [
			-5,
			2,
			2,
			-5
		],
		len: .85
	},
	offline: {
		dy: [
			4,
			-2,
			3,
			-3
		],
		len: .8
	},
	error: {
		dy: [
			4,
			-2,
			3,
			-3
		],
		len: .8
	},
	loading: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .6
	}
};
function x() {
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-shadow",
		viewBox: _,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ i("ellipse", {
			className: "cm-gshadow",
			cx: "256",
			cy: "452",
			rx: "112",
			ry: "13",
			fill: "#4A3A40",
			opacity: "0.2"
		})
	});
}
function S({ id: e, mood: t, plain: n }) {
	let r = b[t], [o, c] = s[t];
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-face",
		viewBox: _,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ a("g", {
			transform: v,
			children: [
				/* @__PURE__ */ a("g", {
					className: "cm-pod cm-podl",
					children: [
						/* @__PURE__ */ i("rect", {
							className: "cm-f-cup cm-s-ink",
							x: "8",
							y: "196",
							width: "68",
							height: "120",
							rx: "30",
							fill: `url(#${e}-cup)`,
							strokeWidth: "6"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-f-mask cm-s-ink",
							x: "22",
							y: "212",
							width: "40",
							height: "88",
							rx: "16",
							fill: "#2E2433",
							strokeWidth: "4"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "35",
							y: "234",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "35",
							y: "268",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ i("path", {
							className: "cm-bevel",
							d: "M20 232V226Q20 212 34 207"
						})
					]
				}),
				/* @__PURE__ */ a("g", {
					className: "cm-pod cm-podr",
					children: [
						/* @__PURE__ */ i("rect", {
							className: "cm-f-cup cm-s-ink",
							x: "436",
							y: "196",
							width: "68",
							height: "120",
							rx: "30",
							fill: `url(#${e}-cup)`,
							strokeWidth: "6"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-f-mask cm-s-ink",
							x: "450",
							y: "212",
							width: "40",
							height: "88",
							rx: "16",
							fill: "#2E2433",
							strokeWidth: "4"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "463",
							y: "234",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ i("rect", {
							className: "cm-slit",
							x: "463",
							y: "268",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ i("path", {
							className: "cm-bevel",
							d: "M440 232V226Q440 212 454 207"
						})
					]
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-f-gold",
					cx: "256",
					cy: "256",
					r: "200",
					fill: `url(#${e}-gold)`
				}),
				!n && /* @__PURE__ */ i("circle", {
					className: "cm-grain",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "#FBD84A",
					filter: `url(#${e}-grain)`
				}),
				!n && /* @__PURE__ */ i("circle", {
					className: "cm-key",
					cx: "256",
					cy: "256",
					r: "200",
					fill: `url(#${e}-key)`
				}),
				!n && /* @__PURE__ */ i("circle", {
					className: "cm-cel",
					cx: "256",
					cy: "256",
					r: "170",
					fill: "none",
					stroke: "#B8741C",
					strokeOpacity: "0.26",
					strokeWidth: "60",
					strokeDasharray: "330 1100",
					transform: "rotate(5 256 256)"
				}),
				!n && /* @__PURE__ */ i("circle", {
					className: "cm-cool",
					cx: "256",
					cy: "256",
					r: "191",
					fill: "none",
					stroke: "#CFE8F4",
					strokeOpacity: "0.28",
					strokeWidth: "4",
					strokeDasharray: "200 1200",
					strokeLinecap: "round",
					transform: "rotate(30 256 256)"
				}),
				!n && /* @__PURE__ */ i("circle", {
					className: "cm-rim",
					cx: "256",
					cy: "256",
					r: "186",
					fill: "none",
					stroke: "#FFF3B0",
					strokeOpacity: "0.7",
					strokeWidth: "12",
					strokeDasharray: "330 1500",
					strokeLinecap: "round",
					transform: "rotate(200 256 256)"
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-s-ink",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "none",
					stroke: "#3A2A2E",
					strokeWidth: "8"
				}),
				/* @__PURE__ */ i("circle", {
					className: "cm-s-ink",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "none",
					stroke: "#3A2A2E",
					strokeWidth: "6",
					strokeDasharray: "420 1500",
					strokeLinecap: "round",
					transform: "rotate(100 256 256)"
				}),
				/* @__PURE__ */ i("rect", {
					className: "cm-f-mask",
					x: "218",
					y: "146",
					width: "76",
					height: "8",
					rx: "4",
					fill: "#241F2B"
				}),
				/* @__PURE__ */ i("polygon", {
					className: "cm-f-mask cm-s-ink",
					points: "96,240 240,276 240,350 168,370 120,320",
					fill: `url(#${e}-mask)`,
					strokeWidth: "11",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ i("polygon", {
					className: "cm-f-mask cm-s-ink",
					points: "416,240 272,276 272,350 344,370 392,320",
					fill: `url(#${e}-mask)`,
					strokeWidth: "11",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ i("path", {
					className: "cm-bevel cm-bevel-m",
					d: "M112 252L232 282M400 252L280 282"
				}),
				/* @__PURE__ */ i("polygon", {
					className: "cm-gem",
					points: "256,300 270,316 256,332 242,316",
					fill: "#00E5A8",
					fillOpacity: "0.35",
					stroke: "#00E5A8",
					strokeWidth: "5",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ i(g, {
					cx: 178,
					kind: o,
					side: -1
				}),
				/* @__PURE__ */ i(g, {
					cx: 334,
					kind: c,
					side: 1
				}),
				/* @__PURE__ */ i("g", {
					className: "cm-mouth",
					style: { "--ml": r.len },
					children: y.map((e, t) => {
						let n = r.dy[t] ?? 0, a = r.rot?.[t] ?? 0, o = 409 + n;
						return /* @__PURE__ */ i("g", {
							transform: a ? `rotate(${a} ${e} ${o})` : void 0,
							children: /* @__PURE__ */ i("path", {
								className: "cm-bar cm-s-ink",
								d: `M${e} ${o - 17 * r.len}V${o + 17 * r.len}`,
								stroke: "#3A2A2E",
								strokeWidth: "9",
								strokeLinecap: "round",
								fill: "none"
							})
						}, e);
					})
				})
			]
		})
	});
}
function C() {
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-motes",
		viewBox: _,
		"aria-hidden": "true",
		focusable: "false",
		children: [
			[
				70,
				110,
				4
			],
			[
				440,
				90,
				3
			],
			[
				400,
				430,
				4
			],
			[
				90,
				410,
				3
			],
			[
				256,
				30,
				3
			],
			[
				470,
				300,
				2
			]
		].map(([e, t, n], r) => /* @__PURE__ */ i("circle", {
			className: "cm-mote",
			style: { animationDelay: `${r * -1.3}s` },
			cx: e,
			cy: t,
			r: n,
			fill: "#FFF3C9"
		}, `${e}-${t}`))
	});
}
function w({ id: e, lite: t }) {
	return /* @__PURE__ */ i("svg", {
		className: "cm-defs",
		width: "0",
		height: "0",
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ a("defs", { children: [
			/* @__PURE__ */ a("linearGradient", {
				id: `${e}-gold`,
				x1: "0.2",
				y1: "0",
				x2: "0.3",
				y2: "1",
				children: [/* @__PURE__ */ i("stop", {
					offset: "0",
					stopColor: "#FBD84A"
				}), /* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "#E8A128"
				})]
			}),
			/* @__PURE__ */ a("linearGradient", {
				id: `${e}-mask`,
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ i("stop", {
					offset: "0",
					stopColor: "#54415A"
				}), /* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "#2E2433"
				})]
			}),
			/* @__PURE__ */ a("linearGradient", {
				id: `${e}-cup`,
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ i("stop", {
					offset: "0",
					stopColor: "#CC7F5E"
				}), /* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "#9C4F3A"
				})]
			}),
			/* @__PURE__ */ a("radialGradient", {
				id: `${e}-key`,
				cx: "0.3",
				cy: "0.25",
				r: "0.7",
				children: [/* @__PURE__ */ i("stop", {
					offset: "0",
					stopColor: "#FFF4B8",
					stopOpacity: "0.7"
				}), /* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "#FFF4B8",
					stopOpacity: "0"
				})]
			}),
			!t && /* @__PURE__ */ a("filter", {
				id: `${e}-grain`,
				x: "0",
				y: "0",
				width: "1",
				height: "1",
				children: [
					/* @__PURE__ */ i("feTurbulence", {
						type: "fractalNoise",
						baseFrequency: "0.012 0.24",
						numOctaves: "2",
						seed: "4",
						result: "n"
					}),
					/* @__PURE__ */ i("feColorMatrix", {
						in: "n",
						type: "matrix",
						values: "0 0 0 0 0.45  0 0 0 0 0.24  0 0 0 0 0  0.6 0 0 0 -0.14",
						result: "m"
					}),
					/* @__PURE__ */ i("feComposite", {
						in: "m",
						in2: "SourceAlpha",
						operator: "in"
					})
				]
			})
		] })
	});
}
// ../../web/src/ui/calm/mascot/layersExtra.tsx
var T = "0 0 512 512", E = "#3A2A2E";
function D() {
	return /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-band",
		viewBox: T,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ a("g", {
			transform: v,
			children: [
				/* @__PURE__ */ i("path", {
					className: "cm-s-ink cm-bandink",
					d: "M42 204C20 -34 492 -34 470 204",
					fill: "none",
					stroke: E,
					strokeWidth: "26",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ i("path", {
					className: "cm-bandcol",
					d: "M42 204C20 -34 492 -34 470 204",
					fill: "none",
					stroke: "#C27A5A",
					strokeWidth: "15",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ i("path", {
					d: "M60 190C50 10 462 10 452 190",
					fill: "none",
					stroke: "#FFF3D0",
					strokeOpacity: "0.22",
					strokeWidth: "5",
					strokeLinecap: "round"
				})
			]
		})
	});
}
function O({ marked: e = !1 }) {
	let t = (e, t, n) => /* @__PURE__ */ i("path", {
		className: "cm-ripple",
		style: { animationDelay: `${n * -1.6}s` },
		d: `M${e + t * 12} 222Q${e + t * 44} 266 ${e + t * 12} 310`,
		fill: "none",
		stroke: "#8FE3D0",
		strokeWidth: "5",
		strokeLinecap: "round"
	}, `${e}-${n}`);
	return /* @__PURE__ */ a("svg", {
		className: "cm-layer cm-ripples",
		"data-prop": e ? "ripples" : void 0,
		viewBox: T,
		"aria-hidden": "true",
		focusable: "false",
		children: [[
			0,
			1,
			2
		].map((e) => t(56, -1, e)), [
			0,
			1,
			2
		].map((e) => t(456, 1, e))]
	});
}
// ../../web/src/ui/calm/mascot/props.tsx
var k = "0 0 512 512", A = "#3A2A2E", j = {
	sleepy: () => /* @__PURE__ */ a("g", {
		fill: "none",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: "cm-pk",
		children: [
			/* @__PURE__ */ i("path", {
				className: "cm-zl cm-z1",
				d: "M348 112h26l-26 26h26",
				strokeWidth: "7"
			}),
			/* @__PURE__ */ i("path", {
				className: "cm-zl cm-z2",
				d: "M382 72h19l-19 19h19",
				strokeWidth: "6"
			}),
			/* @__PURE__ */ i("path", {
				className: "cm-zl cm-z3",
				d: "M408 40h13l-13 13h13",
				strokeWidth: "5"
			})
		]
	}),
	breathing: () => /* @__PURE__ */ i("path", {
		className: "cm-wisp",
		d: "M326 396q12-10 24 0t24 0t24 0",
		fill: "none",
		stroke: "#BFE9E3",
		strokeWidth: "5",
		strokeLinecap: "round"
	}),
	focus: () => /* @__PURE__ */ i("path", {
		className: "cm-glow",
		d: "M241 252h30",
		fill: "none",
		stroke: "#9CFFE3",
		strokeWidth: "4",
		strokeLinecap: "round"
	}),
	steering: () => /* @__PURE__ */ i("path", {
		className: "cm-spark",
		d: "M404 160l5 13l13 5l-13 5l-5 13l-5-13l-13-5l13-5z",
		fill: "#00E5A8",
		stroke: A,
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}),
	tired: () => /* @__PURE__ */ i("path", {
		className: "cm-sweat",
		d: "M372 118C362 134 358 144 366 152C374 158 386 152 384 142C382 134 376 128 372 118Z",
		fill: "#8FD3F0",
		stroke: A,
		strokeWidth: "3.5",
		strokeLinejoin: "round"
	}),
	done: () => /* @__PURE__ */ a("g", {
		className: "cm-fall",
		children: [
			/* @__PURE__ */ i("path", {
				d: "M390 56c12-9 26-3 24 11c-12 6-24 0-24-11z",
				fill: "#8DBE6B",
				stroke: A,
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ i("path", {
				d: "M392 62q10-2 18-3",
				fill: "none",
				stroke: A,
				strokeWidth: "2",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ i("path", {
				className: "cm-spark",
				d: "M356 70l4 10l10 4l-10 4l-4 10l-4-10l-10-4l10-4z",
				fill: "#FFF3B0",
				stroke: "#C9772A",
				strokeWidth: "2.5",
				strokeLinejoin: "round"
			})
		]
	}),
	offline: () => /* @__PURE__ */ i("path", {
		className: "cm-cloud",
		d: "M316 82a22 22 0 0 1 8-34a30 30 0 0 1 56-2a22 22 0 0 1 22 36z",
		fill: "#C9CFD9",
		stroke: "#6B7280",
		strokeWidth: "4",
		strokeLinejoin: "round"
	}),
	error: () => /* @__PURE__ */ a("g", {
		className: "cm-q",
		fill: "none",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ i("path", {
			d: "M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2",
			stroke: A,
			strokeWidth: "11"
		}), /* @__PURE__ */ i("path", {
			d: "M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2",
			stroke: "#FFD23A",
			strokeWidth: "6"
		})]
	})
}, M = {
	sleepy: "zzz",
	breathing: "wisp",
	focus: "glow",
	steering: "spark",
	tired: "sweat",
	done: "leaf",
	offline: "cloud",
	error: "question"
};
function N({ mood: e }) {
	let t = j[e];
	return t ? /* @__PURE__ */ i("svg", {
		className: "cm-layer cm-props",
		viewBox: k,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ i("g", {
			className: "cm-prop",
			"data-prop": M[e],
			children: t()
		})
	}) : null;
}
// ../../web/src/ui/calm/mascot/useLife.ts
var P = /* @__PURE__ */ new Set([
	"idle",
	"listening",
	"steering",
	"tired",
	"offline",
	"error"
]);
function F(e) {
	let t = e >>> 0;
	return () => {
		t = t + 0x6d2b79f5 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function I(e, t) {
	return (4e3 + e * 3e3) * (t ? 1.6 : 1);
}
function L(t, n, r) {
	e(() => {
		let e = t.current;
		if (r || !e) return;
		let i = F(n.length * 7919 + (n.codePointAt(0) ?? 1)), a = n === "tired", o, s = () => {
			o = setTimeout(() => {
				document.hidden || e.classList.add("cm-blinking"), o = setTimeout(() => {
					e.classList.remove("cm-blinking"), s();
				}, a ? 340 : 170);
			}, I(i(), a));
		}, c = () => {
			e.classList.toggle("cm-paused", document.hidden);
		};
		return c(), document.addEventListener("visibilitychange", c), P.has(n) && s(), () => {
			o !== void 0 && clearTimeout(o), document.removeEventListener("visibilitychange", c), e.classList.remove("cm-blinking", "cm-paused");
		};
	}, [
		t,
		n,
		r
	]);
}
// ../../web/src/ui/calm/mascot/useParallax.ts
var R = 6, z = 50, B = (e) => Number.isFinite(e) ? Math.max(-1, Math.min(1, e)) : 0;
function V() {
	return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(pointer: fine)").matches;
}
async function H() {
	try {
		return (await navigator.permissions?.query({ name: "accelerometer" }))?.state === "granted";
	} catch {
		return !1;
	}
}
function U(t, r) {
	let i = n(0);
	e(() => {
		let e = t.current;
		if (!r || !e) return;
		let n = (t, n) => {
			let r = Date.now();
			r - i.current < z || (i.current = r, e.style.setProperty("--ry", `${(B(t) * R).toFixed(2)}deg`), e.style.setProperty("--rx", `${(-B(n) * R).toFixed(2)}deg`));
		}, a = (e) => {
			if (e.pointerType === "touch") return;
			let t = window.innerWidth || 1, r = window.innerHeight || 1;
			n(e.clientX / t * 2 - 1, e.clientY / r * 2 - 1);
		}, o = (e) => n((e.gamma ?? 0) / 30, ((e.beta ?? 45) - 45) / 30), s = !1;
		return V() ? window.addEventListener("pointermove", a, { passive: !0 }) : typeof DeviceOrientationEvent < "u" && H().then((t) => {
			t && e.isConnected && (s = !0, window.addEventListener("deviceorientation", o, { passive: !0 }));
		}), () => {
			window.removeEventListener("pointermove", a), s && window.removeEventListener("deviceorientation", o);
		};
	}, [t, r]);
}
// ../../web/src/ui/calm/mascot/CalmMascot.tsx
function W() {
	return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
var G = (e) => e !== void 0 && Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0, K = 96, q = 72;
function J({ mood: e = "idle", size: r = 220, reducedMotion: o, label: s = "Zonked mascot", breathPhase: c, level: l, situation: u }) {
	let d = `cm${t().replace(/[^a-zA-Z0-9]/g, "")}`, f = n(null), p = o ?? W(), m = Number.isFinite(r) ? Math.max(24, Math.min(640, r)) : 220, h = m <= K, g = m < q, _ = c !== void 0 && !p ? {
		scale: String(1 + G(c) * .03),
		translate: `0 ${(-G(c) * 1.2).toFixed(2)}%`
	} : void 0;
	return U(f, !p && !h), L(f, e, p), /* @__PURE__ */ a("div", {
		ref: f,
		className: `cm-stage cm-${e}${u ? ` cm-s-${u}` : ""}${p ? " cm-still" : ""}${h ? " cm-compact" : ""}${c === void 0 ? "" : " cm-driven"}`,
		style: {
			width: m,
			height: m,
			"--bp": G(c),
			"--lv": l === void 0 && e === "listening" ? .35 : G(l)
		},
		role: "img",
		"aria-label": s,
		"data-mood": e,
		"data-situation": u,
		children: [/* @__PURE__ */ i(w, {
			id: d,
			lite: g
		}), /* @__PURE__ */ a("div", {
			className: "cm-body",
			children: [!h && /* @__PURE__ */ i(x, {}), /* @__PURE__ */ i("div", {
				className: "cm-sway",
				style: _,
				children: /* @__PURE__ */ a("div", {
					className: "cm-head",
					children: [
						!h && /* @__PURE__ */ i(O, { marked: e === "listening" }),
						/* @__PURE__ */ i(S, {
							id: d,
							mood: e,
							plain: g
						}),
						/* @__PURE__ */ i(D, {}),
						/* @__PURE__ */ i(N, { mood: e }),
						!h && /* @__PURE__ */ i(C, {})
					]
				})
			})]
		})]
	});
}
export { o as BreathCue, J as CalmMascot };
