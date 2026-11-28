import { useCallback as e, useEffect as t, useMemo as n, useRef as r, useState as i } from "react";
import { $ as a, I as o, L as s, P as c, Q as l, R as u, Z as d, _t as f, at as p, b as m, bt as h, et as g, g as _, it as v, nt as y, ot as b, rt as ee, vt as x, yt as S } from "./chunk-crewLink-B-5l2pQt.mjs";
import { a as te, i as ne, r as C, t as w } from "./chunk-favorites-D5uR-Ors.mjs";
import { C as re, S as T, b as ie, d as ae } from "./chunk-data-DrI3L2nM.mjs";
import { a as oe, i as se, n as ce, o as le, r as E, s as ue, t as D } from "./chunk-milestones-Bmiu2MXR.mjs";
import { Fragment as O, jsx as k, jsxs as A } from "react/jsx-runtime";
import { c as j, s as M } from "./chunk-catalog-DQXidRzG.mjs";
import { n as N, r as P, t as F } from "./chunk-RangeField-D77jQUlk.mjs";
var I = "zonked", L = "sanctuary";
function de(e, t, n, r, i = []) {
	return JSON.stringify({
		app: I,
		kind: L,
		v: 1,
		exportedAt: r,
		mixes: e,
		favorites: t,
		milestones: {
			v: 1,
			hidden: n.hidden,
			earned: n.earned,
			reminder: n.reminder
		},
		...i.length > 0 ? { feel: T(i) } : {}
	}, null, 2);
}
function R(e, t) {
	return e === void 0 ? w : {
		v: 1,
		items: C(e, t).items.filter((e) => e.kind === "template")
	};
}
function fe(e, t) {
	if (e.length > 262144) return {
		ok: !1,
		error: "too-big"
	};
	let n;
	try {
		n = JSON.parse(e);
	} catch {
		return {
			ok: !1,
			error: "not-json"
		};
	}
	if (!l(n) || d(n, "app") !== "zonked" || d(n, "kind") !== "sanctuary") return {
		ok: !1,
		error: "not-zonked"
	};
	if (d(n, "v") !== 1) return {
		ok: !1,
		error: "unknown-version"
	};
	let r = d(n, "mixes"), i = Array.isArray(r) ? r : [];
	if (i.length > 200) return {
		ok: !1,
		error: "too-many"
	};
	let a = [];
	for (let e of i) {
		let n = y(e, t);
		n !== null && a.push(n);
	}
	let o = d(n, "milestones"), s = d(n, "feel");
	return {
		ok: !0,
		mixes: a,
		favorites: R(d(n, "favorites"), t),
		milestones: o === void 0 ? null : le(o, t),
		feel: s === void 0 ? null : T(s),
		skipped: i.length - a.length
	};
}
function pe(e, t, n, r, i) {
	let a = n === "replace" ? [] : [...e], o = a.map((e) => e.name), s = [];
	for (let e of t) {
		if (a.length + s.length >= 200) break;
		let t = v(e.name, [...o, ...s.map((e) => e.name)]);
		s.push({
			...e,
			id: g(r + s.length, i),
			name: t,
			updatedAt: r
		});
	}
	return s;
}
// ../../web/src/ui/sanctuary/copy.ts
var z = {
	title: "Sanctuary",
	close: "Close",
	sections: {
		mission: "Why Zonked is free",
		guide: "How it works",
		favorites: "Favorites",
		mixes: "My mixes",
		milestones: "Gentle milestones",
		data: "My data"
	},
	mission: {
		heading: "Zonked is free, for everyone",
		body: "Zonked is a quiet place to rest. Some people use it to unwind after work or a long coding session. It costs nothing and it always will.",
		facts: [
			"No account. You never sign in.",
			"No ads. No payments. No upsell.",
			"No tracking. No analytics. No cookies that follow you.",
			"No network. The sound is made on your device, so it works offline.",
			"Your mixes and progress stay in this browser. You can export them as a file, or delete them in one tap."
		],
		privacyHeading: "How Zonked is free and private",
		privacyBody: "The app only talks to your own computer. If you run the optional Kiro Crew helper, it runs on this same machine (127.0.0.1) and nothing goes to the internet.",
		notMedical: "Zonked is not a medical device. It cannot treat or cure anything. If you have a health problem, ask a doctor or another qualified person."
	},
	guide: {
		heading: "How Zonked works",
		items: [
			{
				title: "What the sound does",
				body: "Zonked plays steady tones, soft noise and gentle layers such as pads, chimes and lo-fi warmth. A slow, even sound gives a busy mind something calm to follow. Some people find it easier to relax or to focus, and some notice nothing. It does not work the same for everyone."
			},
			{
				title: "Why headphones",
				body: "A binaural beat is two slightly different tones, one in each ear. You hear a slow pulse from that small difference. This only works with stereo headphones. On speakers you still get the calm layers, but not the beat."
			},
			{
				title: "Listen safely",
				body: "Ask a doctor first if you have a seizure disorder, a serious mental health condition, tinnitus or sensitive hearing. Start at a very low volume. The sound fades in slowly on its own. Keep it quiet enough to hold a conversation. Stop if you feel dizzy, anxious or in pain, or if your ears ring or feel full. Do not listen while you drive or do anything that needs full attention. Zonked never plays louder than a fixed safe limit."
			},
			{
				title: "Flashing and motion",
				body: "Turn on Reduce motion to stop the moving mascot and any pulsing. Zonked never flashes more than 3 times a second."
			},
			{
				title: "What it cannot do",
				body: "Zonked is not a medical device. It does not diagnose, treat or cure. If sleep problems last for weeks, feel very low or anxious, have seizures or ringing in the ears, or feel unsafe, please talk to a doctor or a crisis line in your country."
			}
		]
	},
	favorites: {
		heading: "Favorites",
		help: "Keep the sounds you love one tap away.",
		empty: "Nothing here yet. Search for a sound below and tap the heart button, or save what is playing.",
		searchLabel: "Find a sound to favorite",
		searchHint: "Type a name, for example calm or sleep",
		addPlaying: "Favorite what is playing",
		remove: "Remove from favorites",
		add: "Add to favorites",
		favorited: "Favorited",
		play: "Play",
		gone: "This sound is no longer in the library",
		mixMissing: "This mix was deleted",
		nothingPlaying: "Play a library sound first, then you can favorite it here."
	},
	mixes: {
		heading: "My mixes",
		help: "Save the sound you are hearing, with its levels and timer. Mixes stay on this device.",
		nameLabel: "Name your mix",
		namePlaceholder: "Evening calm",
		save: "Save current sound",
		nothing: "Start a sound first, then you can save it as a mix.",
		empty: "No mixes yet. When you find a sound you like, save it here.",
		load: "Play",
		rename: "Rename",
		renameLabel: "New name",
		confirmRename: "Save name",
		cancel: "Cancel",
		remove: "Delete",
		confirmRemove: "Yes, delete this mix",
		saved: "Saved on this device.",
		deleted: "Deleted.",
		renamed: "Renamed.",
		full: "You have 200 mixes, the most this device keeps. Delete one to save another.",
		failed: "Could not save on this device. The browser may be blocking storage. Try Export in My data.",
		timerNone: "No timer",
		timerCountdown: "Countdown",
		timerSleep: "Sleep fade",
		timerPomodoro: "Focus and break"
	},
	milestones: {
		heading: "Gentle milestones",
		help: "A small, kind look at your rest habit. There is no score, no goal and no pressure.",
		hide: "Hide milestones",
		show: "Show milestones",
		hidden: "Milestones are hidden. Nothing is counted on screen. You can show them again any time.",
		reset: "Reset milestones",
		confirmReset: "Yes, clear my milestones",
		resetDone: "Milestones cleared.",
		earned: "Reached",
		waiting: "Whenever you are ready",
		stats: {
			sessions: "Sessions",
			minutes: "Minutes listened",
			days: "Days you listened",
			streak: "Calm days in a row",
			longest: "Longest session (minutes)"
		},
		how: [
			"Sessions: each time you press play and stop, if it lasted at least 1 minute.",
			"Minutes listened: the time between play and stop, added up. One session counts at most 12 hours.",
			"Days you listened: different calendar days, in your own time zone, with at least one session.",
			"Calm days in a row: days in a row with a session. One missed day is forgiven, up to once a week. A longer pause just starts a new count, with no message.",
			"All of this is worked out on your device from your own listening log. Nothing is sent anywhere."
		],
		items: {
			"first-session": {
				name: "First session",
				note: "You gave yourself a pause."
			},
			"three-days": {
				name: "Three calm days",
				note: "Three days in a row, with room for a rest day."
			},
			"ten-sessions": {
				name: "Ten sessions",
				note: "A habit of small breaks is forming."
			},
			"one-hour": {
				name: "One hour of rest",
				note: "An hour of sound for your mind."
			},
			"five-hours": {
				name: "Five hours of rest",
				note: "Five gentle hours. Well done."
			},
			"first-sleep-fade": {
				name: "First full sleep fade",
				note: "You let the sound fade you toward sleep."
			},
			"took-a-break": {
				name: "Took a break",
				note: "You rested during a focus timer."
			}
		},
		reminderHeading: "Gentle reminder",
		reminderHelp: "A short line shown here once a day when you open Sanctuary. It stays inside the app. It never sends a notification.",
		reminderOn: "Show my reminder",
		reminderLabel: "Reminder text",
		reminderSave: "Save reminder",
		reminderSaved: "Reminder saved."
	},
	data: {
		heading: "My data",
		help: "Everything lives in this browser. You hold the file, you decide what happens to it.",
		where: "Saved on this device only.",
		notSaved: "This browser is not keeping data between visits (private mode or blocked storage). Export a file to keep your mixes.",
		safariNote: "Some browsers clear site data after a few weeks of no use. Export a file now and then to be safe.",
		export: "Export my data",
		exportHelp: "Downloads one file with your mixes, favorites and milestones.",
		exported: "File ready. Check your downloads.",
		import: "Import from a file",
		importHelp: "Choose a Zonked file. It is checked first and every value is brought into the safe range.",
		merge: "Add to what I have",
		replace: "Replace my mixes",
		imported: "Imported.",
		skipped: "Some items could not be read and were skipped.",
		errors: {
			"too-big": "That file is too big. Zonked files are under 256 KB.",
			"not-json": "That file could not be read as a Zonked file.",
			"not-zonked": "That is not a Zonked file.",
			"unknown-version": "That file comes from a version Zonked does not know, so it was not used.",
			"too-many": "That file has too many mixes (the limit is 200).",
			"read-failed": "The file could not be opened."
		},
		resetHeading: "Delete everything",
		resetHelp: "Removes your mixes, favorites, milestones and listening log from this browser. Your saved scripts stay. This cannot be undone.",
		reset: "Delete my data",
		confirmReset: "Yes, delete everything",
		resetDone: "Everything was deleted from this device.",
		cancel: "Cancel"
	},
	common: {
		loading: "Loading",
		saveFailed: "Could not save on this device."
	}
};
// ../../web/src/ui/sanctuary/download.ts
function B(e, t) {
	let n = URL.createObjectURL(new Blob([t], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, r.rel = "noopener", document.body.append(r), r.click(), r.remove(), window.setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
// ../../web/src/ui/sanctuary/DataPanel.tsx
function me({ data: e, now: t }) {
	let n = z.data, [a, o] = i("merge"), [s, c] = i(null), [l, u] = i(!1), d = r(null), f = async (t) => {
		if (t === void 0) return;
		if (t.size > 262144) {
			c(n.errors["too-big"]);
			return;
		}
		let r;
		try {
			r = await t.text();
		} catch {
			c(n.errors["read-failed"]);
			return;
		}
		let i = await e.importText(r, a);
		c(i === null ? n.imported : n.errors[i]), d.current && (d.current.value = "");
	};
	return /* @__PURE__ */ A("div", {
		className: "sx-stack",
		"data-testid": "sanctuary-data",
		children: [
			/* @__PURE__ */ k("p", {
				className: "sx-muted",
				children: n.help
			}),
			/* @__PURE__ */ k("p", {
				"data-testid": "sanctuary-persist",
				children: e.persistent ? n.where : n.notSaved
			}),
			/* @__PURE__ */ k("p", {
				className: "sx-muted",
				children: n.safariNote
			}),
			/* @__PURE__ */ A("div", {
				className: "sx-card",
				children: [/* @__PURE__ */ k("button", {
					type: "button",
					className: "btn sx-primary",
					"data-testid": "sanctuary-export",
					onClick: () => {
						let r = new Date(t());
						B(`zonked-${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, "0")}-${String(r.getDate()).padStart(2, "0")}.json`, e.exportText()), c(n.exported);
					},
					children: n.export
				}), /* @__PURE__ */ k("p", {
					className: "sx-muted",
					children: n.exportHelp
				})]
			}),
			/* @__PURE__ */ A("div", {
				className: "sx-card",
				children: [
					/* @__PURE__ */ k("label", {
						className: "sx-label",
						htmlFor: "sx-import",
						children: n.import
					}),
					/* @__PURE__ */ k("p", {
						className: "sx-muted",
						children: n.importHelp
					}),
					/* @__PURE__ */ A("fieldset", {
						className: "sx-fieldset",
						children: [
							/* @__PURE__ */ k("legend", {
								className: "sx-muted",
								children: n.import
							}),
							/* @__PURE__ */ A("label", {
								className: "sx-check",
								children: [/* @__PURE__ */ k("input", {
									type: "radio",
									name: "sx-import-mode",
									checked: a === "merge",
									onChange: () => o("merge")
								}), n.merge]
							}),
							/* @__PURE__ */ A("label", {
								className: "sx-check",
								children: [/* @__PURE__ */ k("input", {
									type: "radio",
									name: "sx-import-mode",
									checked: a === "replace",
									onChange: () => o("replace")
								}), n.replace]
							})
						]
					}),
					/* @__PURE__ */ k("input", {
						id: "sx-import",
						ref: d,
						"data-testid": "sanctuary-import",
						className: "sx-input",
						type: "file",
						accept: "application/json,.json",
						onChange: (e) => void f(e.target.files?.[0])
					})
				]
			}),
			/* @__PURE__ */ k("p", {
				role: "status",
				"data-testid": "sanctuary-data-message",
				children: s
			}),
			/* @__PURE__ */ A("div", {
				className: "sx-card",
				children: [
					/* @__PURE__ */ k("h4", {
						className: "sx-h4",
						children: n.resetHeading
					}),
					/* @__PURE__ */ k("p", {
						className: "sx-muted",
						children: n.resetHelp
					}),
					l ? /* @__PURE__ */ A(O, { children: [/* @__PURE__ */ k("button", {
						type: "button",
						className: "btn",
						"data-testid": "sanctuary-reset-yes",
						onClick: () => void e.resetAll().then(() => u(!1)),
						children: n.confirmReset
					}), /* @__PURE__ */ k("button", {
						type: "button",
						className: "btn",
						onClick: () => u(!1),
						children: n.cancel
					})] }) : /* @__PURE__ */ k("button", {
						type: "button",
						className: "btn",
						"data-testid": "sanctuary-reset",
						onClick: () => u(!0),
						children: n.reset
					})
				]
			})
		]
	});
}
// ../../web/src/ui/sanctuary/MixesPanel.tsx
function he(e) {
	let t = e.timer, n = z.mixes, r = t.kind === "countdown" ? `${n.timerCountdown} ${t.minutes ?? 0} min` : t.kind === "sleep-fade" ? `${n.timerSleep} ${t.minutes ?? 0} min` : t.kind === "pomodoro" ? `${n.timerPomodoro} ${t.focusMin ?? 0}/${t.breakMin ?? 0} min` : n.timerNone;
	return `${e.voice.mode}, ${e.voice.beatHz.toFixed(1)} Hz, ${r}`;
}
function ge({ mix: e, data: t, playing: n, onLoad: r }) {
	let [a, o] = i("view"), [s, c] = i(e.name), l = t.favorites.items.some((t) => t.kind === "mix" && t.id === e.id), u = z.mixes;
	return /* @__PURE__ */ k("li", {
		className: "sx-row sx-wrap",
		"data-testid": `sanctuary-mix-${e.id}`,
		"aria-current": n ? "true" : void 0,
		children: a === "rename" ? /* @__PURE__ */ A(O, { children: [
			/* @__PURE__ */ k("label", {
				className: "sx-label",
				htmlFor: `sx-rn-${e.id}`,
				children: u.renameLabel
			}),
			/* @__PURE__ */ k("input", {
				id: `sx-rn-${e.id}`,
				"data-testid": "sanctuary-rename-input",
				className: "sx-input",
				maxLength: 60,
				value: s,
				onChange: (e) => c(e.target.value)
			}),
			/* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-rename-ok",
				onClick: () => void t.renameMix(e.id, s).then(() => o("view")),
				children: u.confirmRename
			}),
			/* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				onClick: () => o("view"),
				children: u.cancel
			})
		] }) : /* @__PURE__ */ A(O, { children: [
			/* @__PURE__ */ A("span", {
				className: "sx-grow",
				children: [/* @__PURE__ */ k("strong", { children: e.name }), /* @__PURE__ */ k("span", {
					className: "sx-muted sx-block",
					children: he(e)
				})]
			}),
			/* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-play",
				onClick: () => r(e),
				children: u.load
			}),
			/* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				"aria-pressed": l,
				"aria-label": `${l ? z.favorites.remove : z.favorites.add}: ${e.name}`,
				"data-testid": "sanctuary-mix-fav",
				onClick: () => void t.toggleFavorite("mix", e.id),
				children: l ? z.favorites.favorited : z.favorites.add
			}),
			/* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-rename",
				onClick: () => {
					c(e.name), o("rename");
				},
				children: u.rename
			}),
			a === "delete" ? /* @__PURE__ */ A(O, { children: [/* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-delete-yes",
				onClick: () => void t.deleteMix(e.id),
				children: u.confirmRemove
			}), /* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				onClick: () => o("view"),
				children: u.cancel
			})] }) : /* @__PURE__ */ k("button", {
				type: "button",
				className: "btn",
				"data-testid": "sanctuary-mix-delete",
				onClick: () => o("delete"),
				children: u.remove
			})
		] })
	});
}
function _e({ data: e, nowPlaying: t, currentMix: n, onLoadMix: r }) {
	let [a, o] = i(""), s = n(), c = z.mixes;
	return /* @__PURE__ */ A("div", {
		className: "sx-stack",
		"data-testid": "sanctuary-mixes",
		children: [
			/* @__PURE__ */ k("p", {
				className: "sx-muted",
				children: c.help
			}),
			/* @__PURE__ */ A("form", {
				className: "sx-card",
				onSubmit: (t) => {
					t.preventDefault(), e.saveMix(n(), a).then((e) => e && o(""));
				},
				children: [
					/* @__PURE__ */ k("label", {
						className: "sx-label",
						htmlFor: "sx-mix-name",
						children: c.nameLabel
					}),
					/* @__PURE__ */ k("input", {
						id: "sx-mix-name",
						"data-testid": "sanctuary-mix-name",
						className: "sx-input",
						maxLength: 60,
						value: a,
						placeholder: c.namePlaceholder,
						onChange: (e) => o(e.target.value)
					}),
					/* @__PURE__ */ k("button", {
						type: "submit",
						className: "btn sx-primary",
						"data-testid": "sanctuary-mix-save",
						disabled: s === null,
						children: c.save
					}),
					s === null ? /* @__PURE__ */ k("p", {
						className: "sx-muted",
						children: c.nothing
					}) : null
				]
			}),
			e.mixes.length === 0 ? /* @__PURE__ */ k("p", {
				"data-testid": "sanctuary-mixes-empty",
				children: c.empty
			}) : /* @__PURE__ */ k("ul", {
				className: "sx-rows",
				"data-testid": "sanctuary-mixes-list",
				children: e.mixes.map((n) => /* @__PURE__ */ k(ge, {
					mix: n,
					data: e,
					playing: t?.kind === "mix" && t.id === n.id,
					onLoad: r
				}, n.id))
			})
		]
	});
}
// ../../web/src/ui/sanctuary/useSanctuaryData.ts
var ve = 5e3, V = E([], 0, 0);
function ye(o, s) {
	let [c, l] = i(!1), [u, d] = i(!0), [f, p] = i([]), [m, h] = i(w), [g, _] = i(D), y = r(D), b = e((e) => {
		y.current = e, _(e);
	}, []), [x, S] = i(V), [T, O] = i(null), [k, A] = i(null), j = r(!0), M = () => new Date(s()).getTimezoneOffset(), N = e(async (e) => {
		try {
			return await e(), !0;
		} catch {
			return j.current && A(z.mixes.failed), !1;
		}
	}, []), P = e((e, t) => o.setRecord(e, t), [o]);
	t(() => (j.current = !0, (async () => {
		let e = s(), [t, n, r, i, a] = await Promise.all([
			o.listMixes(),
			o.getRecord("favorites"),
			o.getRecord("milestones"),
			o.listLogs(ve),
			o.persistent()
		]), c = E(i, e, M()), u = oe(le(r, e), c, e), f = se(u.state, e, M());
		(u.added.length > 0 || f.show) && await o.setRecord("milestones", f.state), j.current && (p(t), h(C(n, e)), b(f.state), S(c), O(f.show ? f.state.reminder.text : null), d(a), l(!0));
	})().catch(() => {
		j.current && (A(z.common.saveFailed), l(!0));
	}), () => {
		j.current = !1;
	}), [o]);
	let F = e(async (e, t) => e === null ? !1 : f.length >= 200 ? (A(z.mixes.full), !1) : N(async () => {
		let n = a(e, v(t.trim() || "My mix", f.map((e) => e.name)), s());
		await o.putMix(n), p((e) => [n, ...e]), A(z.mixes.saved);
	}), [
		N,
		f,
		s,
		o
	]), I = e((e, t) => N(async () => {
		let n = f.find((t) => t.id === e);
		if (n === void 0) return;
		let r = ee(n, v(t, f.filter((t) => t.id !== e).map((e) => e.name)), s());
		await o.putMix(r), p((t) => t.map((t) => t.id === e ? r : t)), A(z.mixes.renamed);
	}), [
		N,
		f,
		s,
		o
	]), L = e((e, t) => N(async () => {
		let n = te(m, e, t, s());
		await P("favorites", n), h(n);
	}), [
		m,
		N,
		s,
		P
	]), R = e((e) => N(async () => {
		await o.deleteMix(e);
		let t = ne(m, "mix", e);
		t !== m && (await P("favorites", t), h(t)), p((t) => t.filter((t) => t.id !== e)), A(z.mixes.deleted);
	}), [
		m,
		N,
		P,
		o
	]), B = e((e) => N(async () => {
		let t = e(y.current);
		b(t), await P("milestones", t);
	}), [
		N,
		P,
		b
	]);
	return {
		ready: c,
		persistent: u,
		mixes: f,
		favorites: m,
		milestones: g,
		stats: x,
		reminder: T,
		notice: k,
		saveMix: F,
		importText: e(async (e, t) => {
			let n = s(), r = fe(e, n);
			return r.ok ? await N(async () => {
				let e = pe(f, r.mixes, t, n);
				if (t === "replace") for (let e of f) await o.deleteMix(e.id);
				for (let t of e) await o.putMix(t);
				let i = t === "replace" ? [] : f, a = [...r.favorites.items, ...m.items.filter((e) => t === "merge" || e.kind === "template")], s = C({
					v: 1,
					items: a
				}, n);
				if (await P("favorites", s), r.feel !== null) {
					let e = ae();
					re(e, t === "merge" ? [...ie(e), ...r.feel] : r.feel);
				}
				h(s), p([...e, ...i].sort((e, t) => t.updatedAt - e.updatedAt)), A(r.skipped > 0 ? `${z.data.imported} ${z.data.skipped}` : z.data.imported);
			}) ? null : "read-failed" : r.error;
		}, [
			m,
			N,
			f,
			s,
			P,
			o
		]),
		...n(() => ({
			renameMix: I,
			deleteMix: R,
			toggleFavorite: L,
			setHidden: (e) => B((t) => ({
				...t,
				hidden: e
			})),
			resetMilestones: async () => {
				await B(ue), A(z.milestones.resetDone);
			},
			setReminder: async (e, t) => {
				await B((n) => ({
					...n,
					reminder: {
						...n.reminder,
						on: e,
						text: ce(t)
					}
				})), A(z.milestones.reminderSaved);
			},
			exportText: () => de(f, m, g, s(), ie(ae())),
			resetAll: () => N(async () => {
				await o.clearSanctuary(), p([]), h(w), b(D), S(V), O(null), A(z.data.resetDone);
			})
		}), [
			m,
			N,
			g,
			f,
			s,
			B,
			R,
			I,
			b,
			o,
			L
		])
	};
}
// ../../web/src/app/neuro.ts
function be(e) {
	return {
		l: e.carrierHz - e.beatHz / 2,
		r: e.carrierHz + e.beatHz / 2
	};
}
// ../../web/src/catalog/bands.ts
var H = {
	garcia: "S1",
	chaieb: "S2",
	lane: "S4",
	zhou: "S8",
	ingendoh: "S12",
	goodin: "S7",
	padma: "S6",
	mallik: "S11"
}, U = "Not a medical device. Results vary and may not happen for you.", W = [
	{
		name: "Delta",
		minHz: .5,
		maxHz: 4,
		mayHelp: "rest and sleep",
		evidence: "limited",
		note: `Little direct research on beats at this range. Steady noise has some sleep studies. ${U}`,
		sources: [H.zhou, H.ingendoh]
	},
	{
		name: "Theta",
		minHz: 4,
		maxHz: 8,
		mayHelp: "meditation and drowsy calm",
		evidence: "preliminary",
		note: `Small studies only. ${U}`,
		sources: [H.chaieb, H.ingendoh]
	},
	{
		name: "Alpha",
		minHz: 8,
		maxHz: 13,
		mayHelp: "a relaxed feeling and easy focus",
		evidence: "mixed",
		note: `Some trials report calmer feelings, others show no effect. ${U}`,
		sources: [
			H.garcia,
			H.padma,
			H.mallik
		]
	},
	{
		name: "Beta",
		minHz: 13,
		maxHz: 30,
		mayHelp: "alert focus",
		evidence: "mixed",
		note: `One small study saw better vigilance, another saw no change. ${U}`,
		sources: [
			H.lane,
			H.goodin,
			H.garcia
		]
	},
	{
		name: "Gamma",
		minHz: 30,
		maxHz: 40,
		mayHelp: "alert attention (experimental)",
		evidence: "limited",
		note: `Very little evidence. Keep sessions short and volume low. ${U}`,
		sources: [H.chaieb, H.ingendoh]
	}
];
function G(e) {
	let t = Number.isFinite(e) ? e : 0;
	return W.find((e) => t >= e.minHz && t < e.maxHz) ?? (t >= 40 ? W[4] : W[0]);
}
// ../../web/src/ui/dialBands.ts
var K = {
	Delta: "deep rest",
	Theta: "dreamy",
	Alpha: "relaxed",
	Beta: "alert",
	Gamma: "sharp"
}, xe = .01;
function Se(e) {
	let t = [];
	for (let e = 0; e <= 100; e += 1) {
		let n = e * xe, r = G(M(n)).name, i = t[t.length - 1];
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
function Ce(e) {
	let t = G(e);
	return `${t.name}: ${K[t.name]}. About ${Math.round(e)} pulses a second.`;
}
function we(e) {
	let t = M(e), n = G(t);
	return `${Math.round(t)} hertz, ${n.name}, ${K[n.name]}`;
}
// ../../web/src/ui/advanced/CalmAlertPanel.tsx
var Te = 25, Ee = .3;
function De({ snap: e, player: t }) {
	let [n, r] = i(Ee), [a, o] = i(!1), s = be(e.voice), c = Math.abs(s.r - s.l), l = a ? G(M(n)).name : G(c).name, u = e.voice.layers ?? h;
	return /* @__PURE__ */ A("div", {
		className: "adv-panel",
		"data-testid": "adv-dial",
		children: [
			/* @__PURE__ */ A("div", {
				className: "adv-ends",
				children: [/* @__PURE__ */ k("span", { children: "Calm" }), /* @__PURE__ */ k("span", { children: "Alert" })]
			}),
			/* @__PURE__ */ k(F, {
				id: "adv-dial",
				testId: "adv-dial-input",
				min: 0,
				max: 1,
				step: .01,
				value: n,
				valueText: we(n),
				bubbleText: `${M(n)} Hz`,
				bands: Se(l),
				onChange: (e) => {
					r(e), o(!0), t.setBeatOverride(M(e)), t.setLayerOverride(j(e, u));
				}
			}),
			/* @__PURE__ */ A("p", {
				className: "adv-line",
				"data-testid": "adv-dial-readout",
				children: [
					"Pulse speed now: ",
					c.toFixed(1),
					" Hz (",
					G(c).name,
					")"
				]
			}),
			/* @__PURE__ */ k("p", {
				className: "adv-note",
				"data-testid": "adv-dial-meaning",
				children: Ce(c)
			}),
			c > Te && /* @__PURE__ */ k("p", {
				className: "adv-note",
				"data-testid": "adv-hearing-note",
				children: "Keep it quiet. Pulses above 25 Hz can feel tiring."
			}),
			/* @__PURE__ */ k("button", {
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
var Oe = 50;
function ke({ text: e, onText: t, onPlay: r }) {
	let i = n(() => x(e), [e]);
	return /* @__PURE__ */ A("div", {
		className: "adv-panel",
		"data-testid": "adv-editor",
		children: [
			/* @__PURE__ */ k("label", {
				htmlFor: "adv-sbg-text",
				children: ".sbg script"
			}),
			/* @__PURE__ */ k("textarea", {
				id: "adv-sbg-text",
				className: "adv-text",
				"data-testid": "adv-editor-text",
				spellCheck: !1,
				value: e,
				onChange: (e) => t(e.target.value),
				"aria-describedby": "adv-sbg-diag"
			}),
			/* @__PURE__ */ k("div", {
				id: "adv-sbg-diag",
				role: "status",
				"aria-live": "polite",
				"data-testid": "adv-diagnostics",
				children: i.diagnostics.length === 0 ? /* @__PURE__ */ k("p", {
					className: "adv-note",
					children: "No problems."
				}) : /* @__PURE__ */ k("ul", {
					className: "adv-diag",
					children: i.diagnostics.slice(0, Oe).map((e, t) => /* @__PURE__ */ A("li", {
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
			/* @__PURE__ */ k("button", {
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
var Ae = 80, q = (e) => e.replace(/[^\w.-]+/g, "_") || "script";
function je({ text: e, name: t, onImport: n }) {
	let [r, a] = i("");
	return /* @__PURE__ */ A("div", {
		className: "adv-panel",
		"data-testid": "adv-io",
		children: [/* @__PURE__ */ A("div", {
			className: "adv-actions",
			children: [/* @__PURE__ */ A("label", {
				className: "adv-btn adv-file",
				children: ["Import .sbg", /* @__PURE__ */ k("input", {
					type: "file",
					accept: ".sbg,.txt,text/plain",
					"data-testid": "adv-import-input",
					onChange: (e) => {
						let t = e.target.files?.[0];
						e.target.value = "", t !== void 0 && (t.size > S.maxBytes ? a(`That file is ${t.size} bytes. The limit is ${S.maxBytes} bytes.`) : t.text().then((e) => {
							n(e, t.name.replace(/\.[^.]*$/, "").slice(0, Ae) || "Imported"), a(`Imported ${t.name}.`);
						}, () => a("Could not read that file.")));
					}
				})]
			}), /* @__PURE__ */ k("button", {
				type: "button",
				className: "adv-btn",
				"data-testid": "adv-export",
				onClick: () => {
					let n = URL.createObjectURL(new Blob([e], { type: "text/plain" })), r = document.createElement("a");
					r.href = n, r.download = `${q(t)}.sbg`, r.click(), URL.revokeObjectURL(n), a(`Saved ${q(t)}.sbg.`);
				},
				children: "Export .sbg"
			})]
		}), /* @__PURE__ */ k("p", {
			className: "adv-note",
			role: "status",
			"aria-live": "polite",
			"data-testid": "adv-io-note",
			children: r
		})]
	});
}
// ../../web/src/ui/advanced/MixPanel.tsx
var Me = [
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
], Ne = .6, J = (e) => Math.round(e * 100);
function Pe({ snap: e, player: t }) {
	let n = e.voice.layers ?? h, r = e.voice.noise, i = r === "violet" ? Ne : 1, a = Math.min(i, e.voice.noiseLevel);
	return /* @__PURE__ */ A("div", {
		className: "adv-panel",
		"data-testid": "adv-mix",
		children: [
			Me.map(([e, r, i]) => /* @__PURE__ */ A("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ k("label", {
					htmlFor: `adv-mix-${e}`,
					children: i
				}), /* @__PURE__ */ k(F, {
					id: `adv-mix-${e}`,
					testId: `adv-mix-${e}`,
					min: 0,
					max: 1,
					step: .05,
					value: n[r],
					valueText: `${J(n[r])} percent`,
					bubbleText: `${J(n[r])}`,
					ticks: N(),
					onChange: (e) => t.setLayerOverride({ [r]: e })
				})]
			}, e)),
			r !== "off" && /* @__PURE__ */ A("div", {
				className: "adv-row",
				children: [/* @__PURE__ */ k("label", {
					htmlFor: "adv-mix-noise",
					children: "Background noise"
				}), /* @__PURE__ */ k(F, {
					id: "adv-mix-noise",
					testId: "adv-mix-noise",
					min: 0,
					max: i,
					step: .05,
					value: a,
					valueText: `${J(a)} percent`,
					bubbleText: `${J(a)}`,
					ticks: N(i),
					onChange: (e) => t.setNoiseOverride({ noiseLevel: Math.min(i, e) })
				})]
			}),
			r === "violet" && /* @__PURE__ */ k("p", {
				className: "adv-note",
				"data-testid": "adv-violet-note",
				children: "Violet is bright. Start very quiet."
			}),
			/* @__PURE__ */ k("button", {
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
function Fe() {
	let [e, n] = i(() => u.count(Date.now(), c));
	t(() => {
		let e = setInterval(() => n(u.count(Date.now(), c)), 2e3);
		return () => clearInterval(e);
	}, []);
	let r = o(e);
	return /* @__PURE__ */ A("div", {
		"data-testid": "sound-health",
		children: [
			/* @__PURE__ */ k("p", {
				role: "status",
				"data-testid": "sound-health-line",
				children: s(e)
			}),
			r !== "" && /* @__PURE__ */ k("p", {
				className: "meta",
				"data-testid": "sound-health-hint",
				children: r
			}),
			/* @__PURE__ */ k("p", {
				className: "meta",
				children: "Counted on this device only. Never sent anywhere."
			})
		]
	});
}
// ../../web/src/ui/useFrame.ts
function Ie(e, n) {
	let i = r(e);
	t(() => {
		i.current = e;
	}), t(() => {
		if (!n) return;
		let e = 0, t = 0, r = (n) => {
			let a = t === 0 ? 0 : Math.min(.25, (n - t) / 1e3);
			t = n, i.current(a), e = requestAnimationFrame(r);
		}, a = () => {
			document.hidden ? (e !== 0 && cancelAnimationFrame(e), e = 0) : e === 0 && (t = 0, e = requestAnimationFrame(r));
		};
		return document.addEventListener("visibilitychange", a), a(), () => {
			document.removeEventListener("visibilitychange", a), e !== 0 && cancelAnimationFrame(e);
		};
	}, [n]);
}
// ../../web/src/ui/Scope.tsx
var Y = 1e3, X = 300, Le = 512, Z = 660, Re = 700, Q = 300, ze = "#FFE600", Be = "#00E5A8";
function Ve(e, t, n) {
	if (e.clearRect(0, 0, Y, X), e.lineWidth = 1, e.strokeStyle = "rgba(255,255,255,0.12)", e.beginPath(), e.moveTo(0, X / 2), e.lineTo(Z, X / 2), e.rect(Re, 0, Q, Q), e.moveTo(850, 0), e.lineTo(850, Q), e.moveTo(Re, Q / 2), e.lineTo(1e3, Q / 2), e.stroke(), n < 2) return;
	let r = X * .45, i = Z / (n - 1);
	e.lineWidth = 2, e.strokeStyle = ze, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = X / 2 - (t[a * 2] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.strokeStyle = Be, e.beginPath();
	for (let a = 0; a < n; a++) {
		let n = X / 2 - (t[a * 2 + 1] ?? 0) * r;
		a === 0 ? e.moveTo(0, n) : e.lineTo(a * i, n);
	}
	e.stroke(), e.lineWidth = 1, e.strokeStyle = "rgba(255,184,0,0.8)", e.beginPath();
	let a = Q / 2;
	for (let r = 0; r < n; r++) {
		let n = 850 + (t[r * 2] ?? 0) * a * .9, i = a - (t[r * 2 + 1] ?? 0) * a * .9;
		r === 0 ? e.moveTo(n, i) : e.lineTo(n, i);
	}
	e.stroke();
}
function He(e, t) {
	if (t <= 0) return 0;
	let n = 0;
	for (let r = 0; r < t * 2; r++) n += (e[r] ?? 0) ** 2;
	return Math.sqrt(n / (t * 2));
}
function Ue({ telemetry: e, onLevel: t }) {
	let n = r(null), i = r(new Float32Array(Le * 2));
	return Ie(() => {
		let r = n.current?.getContext("2d"), a = e.read(i.current);
		t?.(He(i.current, a)), r != null && Ve(r, i.current, a);
	}, !0), /* @__PURE__ */ k("canvas", {
		ref: n,
		className: "scope",
		"data-testid": "scope-canvas",
		width: Y,
		height: X,
		role: "img",
		"aria-label": "Left and right channel oscilloscope and stereo Lissajous plot"
	});
}
// ../../web/src/ui/advanced/ScopePanel.tsx
function We({ telemetry: e }) {
	return /* @__PURE__ */ k("div", {
		className: "adv-panel adv-scope",
		"data-testid": "adv-scope",
		children: /* @__PURE__ */ k(Ue, { telemetry: e })
	});
}
// ../../web/src/ui/advanced/TimersPanel.tsx
var Ge = (e, t, n) => Number.isFinite(e) ? Math.min(n, Math.max(t, Math.round(e))) : t;
function $(e) {
	return /* @__PURE__ */ A("div", {
		className: "adv-field",
		children: [/* @__PURE__ */ k("label", {
			htmlFor: e.id,
			children: e.label
		}), /* @__PURE__ */ k("input", {
			id: e.id,
			"data-testid": e.id,
			className: "adv-num",
			type: "number",
			inputMode: "numeric",
			min: e.min,
			max: e.max,
			value: e.value,
			onChange: (t) => e.onChange(Ge(Number(t.target.value), e.min, e.max))
		})]
	});
}
function Ke({ timer: e, player: t }) {
	let [n, r] = i(30), [a, o] = i(30), [s, c] = i(25), [l, u] = i(5), d = e.kind !== "none";
	return /* @__PURE__ */ A("div", {
		className: "adv-panel",
		"data-testid": "adv-timers",
		children: [
			/* @__PURE__ */ k("p", {
				className: "adv-line",
				"data-testid": "adv-timer-status",
				children: d ? `${e.kind}${e.phase === void 0 ? "" : `, ${e.phase}`}: ${P(e.remainingSec)} left` : "No timer is running."
			}),
			/* @__PURE__ */ A("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ k($, {
					id: "adv-timer-cd",
					label: "Countdown minutes",
					value: n,
					min: 1,
					max: 720,
					onChange: r
				}), /* @__PURE__ */ k("button", {
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
			/* @__PURE__ */ A("div", {
				className: "adv-actions",
				children: [/* @__PURE__ */ k($, {
					id: "adv-timer-sl",
					label: "Sleep fade minutes",
					value: a,
					min: 1,
					max: 720,
					onChange: o
				}), /* @__PURE__ */ k("button", {
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
			/* @__PURE__ */ A("div", {
				className: "adv-actions",
				children: [
					/* @__PURE__ */ k($, {
						id: "adv-timer-focus",
						label: "Focus minutes",
						value: s,
						min: 1,
						max: 180,
						onChange: c
					}),
					/* @__PURE__ */ k($, {
						id: "adv-timer-break",
						label: "Break minutes",
						value: l,
						min: 1,
						max: 60,
						onChange: u
					}),
					/* @__PURE__ */ k("button", {
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
			/* @__PURE__ */ k("button", {
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
function qe(e) {
	let [n, r] = i(() => e.snapshot());
	return t(() => e.subscribe(r), [e]), n;
}
// ../../web/src/ui/advanced/AdvancedPanels.tsx
var Je = [
	"Mix",
	"Calm to Alert",
	"Editor",
	"Import and export",
	"Timers",
	"Scope",
	"Sound health",
	"Saved mixes",
	"Your data"
];
function Ye({ engine: e, player: r, onClose: a, store: o }) {
	let s = n(() => r ?? new p(e, b, () => void 0), [r, e]);
	t(() => {
		if (r === void 0) return () => void s.stop();
	}, [r, s]);
	let c = qe(s), l = ye(n(() => o ?? _(), [o]), Date.now), [u, d] = i(f[0]?.sbg ?? ""), [h, g] = i("script"), v = {
		Mix: /* @__PURE__ */ k(Pe, {
			snap: c,
			player: s
		}),
		"Calm to Alert": /* @__PURE__ */ k(De, {
			snap: c,
			player: s
		}),
		Editor: /* @__PURE__ */ k(ke, {
			text: u,
			onText: d,
			onPlay: (e) => void s.playCustom(e)
		}),
		"Import and export": /* @__PURE__ */ k(je, {
			text: u,
			name: h,
			onImport: (e, t) => {
				d(e), g(t);
			}
		}),
		Timers: /* @__PURE__ */ k(Ke, {
			timer: c.timer,
			player: s
		}),
		Scope: /* @__PURE__ */ k(We, { telemetry: e.telemetry }),
		"Sound health": /* @__PURE__ */ k(Fe, {}),
		"Saved mixes": /* @__PURE__ */ k("div", {
			className: "adv-panel sx-root",
			"data-testid": "adv-mixes",
			children: l.ready ? /* @__PURE__ */ k(_e, {
				data: l,
				nowPlaying: c.templateId === null ? null : {
					kind: "template",
					id: c.templateId
				},
				currentMix: () => s.getMixDraft(),
				onLoadMix: (e) => m("zonked.safety.v1") && s.playMix(e)
			}) : null
		}),
		"Your data": /* @__PURE__ */ k("div", {
			className: "adv-panel sx-root",
			"data-testid": "adv-data",
			children: l.ready ? /* @__PURE__ */ k(me, {
				data: l,
				now: Date.now
			}) : null
		})
	};
	return /* @__PURE__ */ A("div", {
		className: "adv-panels",
		"data-testid": "advanced-panels",
		children: [Je.map((e, t) => /* @__PURE__ */ A("details", {
			className: "adv-section",
			open: t === 0,
			"data-testid": `adv-section-${e.toLowerCase().replace(/ /g, "-")}`,
			children: [/* @__PURE__ */ k("summary", { children: e }), v[e]]
		}, e)), a !== void 0 && /* @__PURE__ */ k("button", {
			type: "button",
			className: "adv-btn",
			"data-testid": "adv-close",
			onClick: a,
			children: "Close"
		})]
	});
}
export { Ye as AdvancedPanels };
