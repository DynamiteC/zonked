// Mirrors the install-time rules of the Kiro Crew 0.13.1 gateway manifest validator
// (kiro_crew/apps/manifest*.py), so a refusal is caught here before the owner installs.
// shortcut: a hand copy of the rules, not the gateway code. Re-read the validator when
// the gateway version changes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isAbsolute } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const m = JSON.parse(readFileSync(`${root}app.json`, 'utf8'));

const IDENT = /^[a-z][a-z0-9_]{0,63}$/; // tool names and argument names
const NAMESPACE = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const ROUTE = /^[a-z0-9][a-z0-9_-]{0,63}(?:\/[a-z0-9][a-z0-9_-]{0,63}){0,3}$/;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER = /^\d+\.\d+\.\d+([+-]|$)/;
const PANEL_ID = /^[a-z][a-z0-9_-]{0,63}$/;
const RESERVED = new Set(['system', 'library', 'registry', 'registries', 'blob', 'install', 'register', 'market']);
const WINDOWS_DEVICES = new Set(['con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9', 'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9']);
const SCALAR_KEYS = {
  string: ['type', 'description', 'enum', 'maxLength'],
  integer: ['type', 'description', 'minimum', 'maximum'],
  number: ['type', 'description', 'minimum', 'maximum'],
  boolean: ['type', 'description'],
  array: ['type', 'description', 'items', 'maxItems'],
};
const isInt = (v) => Number.isInteger(v);
const badPath = (p) => isAbsolute(p) || /^[A-Za-z]:/.test(p) || p.split(/[\\/]/).includes('..');
const keysOk = (obj, allowed) => Object.keys(obj).every((k) => allowed.includes(k));

test('name, version and required fields', () => {
  assert.match(m.name, KEBAB);
  assert.ok(m.name.length <= 63);
  assert.ok(!RESERVED.has(m.name) && !WINDOWS_DEVICES.has(m.name));
  assert.match(m.version, SEMVER);
  assert.ok(m.displayName && m.description);
});

test('minKiroCrewVersion parses and is not above the tested gateway', () => {
  assert.match(m.minKiroCrewVersion, /^\d+(\.\d+){0,2}$/);
  const n = m.minKiroCrewVersion.split('.').map(Number);
  const cmp = [0, 1, 2].map((i) => Math.sign((n[i] ?? 0) - [0, 13, 1][i])).find((x) => x !== 0) ?? 0;
  assert.ok(cmp <= 0, 'minimum is above the gateway');
});

test('resource paths are relative and exist', () => {
  const paths = [...m.agents, m.ui.entry, m.backend.entryPoint, m.iconPath, m.heroImage, ...m.screenshots, ...m.contributes.panelTabs.map((t) => t.entry)];
  for (const p of paths) {
    assert.equal(badPath(p), false, p);
    // dist/ is build output: another worker may be rebuilding it, so only source files are required here.
    if (!p.startsWith('dist/')) assert.ok(existsSync(`${root}${p}`), `missing ${p}`);
  }
});

test('backend block', () => {
  assert.equal(m.backend.type, 'node');
  assert.ok(m.backend.port === 'auto' || /^\d+$/.test(m.backend.port));
  assert.ok(m.backend.healthCheck.startsWith('/'));
});

test('crons: name, schedule, content and the cron permission', () => {
  for (const c of m.crons) {
    assert.ok(c.name);
    assert.ok(c.every || c.cron_expr);
    assert.ok(c.agent || c.message || c.command || c.script);
    assert.ok(!(c.command && c.script));
    assert.equal(typeof (c.enabled ?? true), 'boolean');
    assert.ok(m.agents.some((a) => a.endsWith(`/${c.agent}.json`)), 'cron agent is shipped');
  }
  if (m.crons.length > 0) assert.equal(m.permissions.cron, true);
});

test('ui pages have route and label', () => {
  for (const p of m.ui.pages) assert.ok(p.route && p.label);
});

test('panel tabs: slug id, required text, 120 char caps, at most 8, unique', () => {
  const tabs = m.contributes.panelTabs;
  assert.ok(tabs.length <= 8);
  assert.equal(new Set(tabs.map((t) => t.id)).size, tabs.length);
  for (const t of tabs) {
    assert.match(t.id, PANEL_ID);
    for (const k of ['title', 'menuLabel', 'entry']) assert.ok(t[k], k);
    for (const k of ['title', 'menuLabel', 'menuDescription']) assert.ok([...(t[k] ?? '')].length <= 120, k);
  }
});

test('agentTools block: keys, route, count, namespace', () => {
  const a = m.agentTools;
  assert.ok(keysOk(a, ['namespace', 'route', 'tools']));
  assert.match(a.route, ROUTE);
  if (a.namespace) assert.ok(NAMESPACE.test(a.namespace) && a.namespace.length <= 32);
  assert.ok(Array.isArray(a.tools) && a.tools.length >= 1 && a.tools.length <= 16);
  const prefix = `${a.namespace || m.name.replaceAll('-', '_')}_`;
  const names = a.tools.map((t) => t.name);
  assert.equal(new Set(names).size, names.length);
  for (const n of names) assert.ok(n.startsWith(prefix), n);
});

test('agentTools tools: names, limits and schema subset', () => {
  const toolKeys = ['name', 'title', 'description', 'inputSchema', 'maxResultChars', 'strictSession', 'timeoutSeconds', 'result'];
  for (const t of m.agentTools.tools) {
    assert.ok(keysOk(t, toolKeys), `${t.name} keys`);
    assert.match(t.name, IDENT);
    assert.ok(typeof t.description === 'string' && t.description.trim() && t.description.length <= 4000);
    if (t.title !== undefined) assert.ok(t.title.length <= 80 && !/[\r\n]/.test(t.title));
    if (t.maxResultChars !== undefined) assert.ok(isInt(t.maxResultChars) && t.maxResultChars > 0 && t.maxResultChars <= 60000);
    if (t.timeoutSeconds !== undefined) assert.ok(isInt(t.timeoutSeconds) && t.timeoutSeconds > 0 && t.timeoutSeconds <= 600);
    if (t.result !== undefined) assert.ok(['json', 'text'].includes(t.result));
    assert.ok(t.strictSession === undefined || t.strictSession === false, 'strictSession is refused for a process backend');
    const s = t.inputSchema;
    assert.equal(s.type, 'object');
    assert.ok(keysOk(s, ['type', 'properties', 'required', 'additionalProperties']));
    assert.equal(s.additionalProperties ?? false, false);
    const props = s.properties ?? {};
    assert.ok(Object.keys(props).length <= 32);
    for (const [arg, p] of Object.entries(props)) {
      assert.match(arg, IDENT, `argument ${arg} must be a lowercase identifier`);
      assert.ok(Object.hasOwn(SCALAR_KEYS, p.type), `${arg} type`);
      assert.ok(keysOk(p, SCALAR_KEYS[p.type]), `${arg} keys`);
      if ('description' in p) assert.equal(typeof p.description, 'string');
      if ('maxLength' in p) assert.ok(isInt(p.maxLength) && p.maxLength > 0 && p.maxLength <= 65536);
      if ('enum' in p) assert.ok(Array.isArray(p.enum) && p.enum.length > 0 && p.enum.every((v) => typeof v === 'string' && v));
      for (const b of ['minimum', 'maximum']) if (b in p) assert.equal(typeof p[b], 'number');
      if (p.type === 'array') {
        assert.ok(['string', 'integer'].includes(p.items?.type));
        if ('maxItems' in p) assert.ok(isInt(p.maxItems) && p.maxItems > 0 && p.maxItems <= 256);
      }
    }
    const req = s.required ?? [];
    assert.equal(new Set(req).size, req.length);
    for (const r of req) assert.ok(Object.hasOwn(props, r), `required ${r} is declared`);
  }
});

test('permissions only name what the app uses', () => {
  assert.ok(m.permissions.api.every((a) => a.startsWith(`/apps/${m.name}/`)));
});
