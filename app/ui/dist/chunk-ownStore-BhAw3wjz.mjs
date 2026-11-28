import { n as e } from "./chunk-own-D62uDPlI.mjs";
// ../../web/src/ui/calm/nature/ownStore.ts
var t = "zonked.mysounds.v1", n = "sounds", r = 60, i = (e) => ({
	ok: !1,
	error: e
}), a = "Your device could not store this sound. Remove one and try again.", o = (e) => /^own:[a-z0-9]{6,40}$/.test(e);
function s(e) {
	let t = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, r);
	return t === "" ? "My sound" : t;
}
function c(e) {
	return new Promise((r, i) => {
		let a = e.open(t, 1);
		a.onupgradeneeded = () => void a.result.createObjectStore(n, { keyPath: "id" }), a.onsuccess = () => r(a.result), a.onerror = () => i(a.error ?? /* @__PURE__ */ Error("open failed")), a.onblocked = () => i(/* @__PURE__ */ Error("blocked"));
	});
}
function l(e) {
	return new Promise((t, n) => {
		e.onsuccess = () => t(e.result), e.onerror = () => n(e.error ?? /* @__PURE__ */ Error("request failed"));
	});
}
function u(e) {
	return new Promise((t, n) => {
		e.oncomplete = () => t(), e.onerror = () => n(e.error ?? /* @__PURE__ */ Error("write failed")), e.onabort = () => n(e.error ?? /* @__PURE__ */ Error("write aborted"));
	});
}
var d = () => typeof indexedDB > "u" ? null : indexedDB;
async function f(e, t, n) {
	if (e === null) return i("This browser cannot keep sounds on your device.");
	let r = null;
	try {
		return r = await c(e), {
			ok: !0,
			value: await t(r)
		};
	} catch (e) {
		return e instanceof RangeError ? i(e.message === "count" ? "You can keep 5 sounds. Remove one first." : "Your sounds would use more than 20 MB. Remove one first.") : i(e instanceof DOMException && e.name === "QuotaExceededError" ? a : n);
	} finally {
		r?.close();
	}
}
async function p(e = d()) {
	return f(e, async (e) => (await l(e.transaction(n).objectStore(n).getAll())).map((e) => ({
		id: e.id,
		name: e.name,
		size: e.size
	})), "Your sounds could not be read.");
}
async function m(e, t = d()) {
	if (!o(e)) return i("Unknown sound.");
	let r = await f(t, async (t) => await l(t.transaction(n).objectStore(n).get(e)), "Your sound could not be read.");
	return r.ok ? r.value === void 0 ? i("That sound is gone.") : {
		ok: !0,
		value: r.value.bytes
	} : r;
}
async function h(e, t, r = d()) {
	if (t.byteLength > 8388608) return i("This file is bigger than 8 MB.");
	let a = {
		id: `own:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
		name: s(e),
		size: t.byteLength,
		bytes: t
	};
	return f(r, async (e) => {
		let t = await l(e.transaction(n).objectStore(n).getAll());
		if (t.length >= 5) throw RangeError("count");
		if (t.reduce((e, t) => e + t.size, 0) + a.size > 20971520) throw RangeError("total");
		let r = e.transaction(n, "readwrite");
		return r.objectStore(n).put(a), await u(r), {
			id: a.id,
			name: a.name,
			size: a.size
		};
	}, "Your sound could not be saved.");
}
async function g(e, t = d()) {
	return f(t, async (t) => {
		let r = t.transaction(n, "readwrite");
		return r.objectStore(n).delete(e), await u(r), !0;
	}, "That sound could not be removed.");
}
async function _(e = d()) {
	return f(e, async (e) => {
		let t = e.transaction(n, "readwrite");
		return t.objectStore(n).clear(), await u(t), !0;
	}, "Your sounds could not be removed.");
}
var v = async (e) => {
	let t = typeof OfflineAudioContext > "u" ? void 0 : OfflineAudioContext;
	if (t === void 0) throw Error("no decoder");
	let n = await new t(1, 1, 44100).decodeAudioData(e.slice(0));
	return {
		channels: Array.from({ length: n.numberOfChannels }, (e, t) => n.getChannelData(t)),
		sampleRate: n.sampleRate
	};
}, y = 1e4;
function b(e, t) {
	return new Promise((n, r) => {
		let i = setTimeout(() => r(/* @__PURE__ */ Error("decode timeout")), t);
		e.then((e) => {
			clearTimeout(i), n(e);
		}, (e) => {
			clearTimeout(i), r(e instanceof Error ? e : /* @__PURE__ */ Error("decode failed"));
		});
	});
}
async function x(t, n = v) {
	if (t.byteLength > 8388608) return i("This file is bigger than 8 MB.");
	if (t.byteLength === 0) return i("This file is empty.");
	let r;
	try {
		r = await b(n(t), y);
	} catch {
		return i("This file is not a sound this browser can read.");
	}
	if ((r.channels[0]?.length ?? 0) / r.sampleRate > 600) return i("This file is longer than 10 minutes.");
	let a = e(r.channels, r.sampleRate);
	return a.ok ? {
		ok: !0,
		value: !0
	} : i(a.error);
}
export { _ as a, p as i, m as n, g as o, o as r, x as s, h as t };
