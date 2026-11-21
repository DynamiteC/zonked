// Helpers for record-demo.mjs: real captured terminal text, overlay, and the soundtrack renderer.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, hostname, tmpdir, userInfo } from 'node:os';
import { join } from 'node:path';
import { ROOT, WEB } from './e2e-lib.mjs';

export const MEDIA = join(ROOT, 'media');
export const TOTAL = 170;
export const SR = 48000;
mkdirSync(MEDIA, { recursive: true });
export const tmp = mkdtempSync(join(tmpdir(), 'zonked-demo-'));
export const statePath = join(tmp, '.zonked-state.json');

export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  return `${r.stdout ?? ''}${r.stderr ?? ''}`;
}

export function writeState(score, level, presetId, beatHz, carrierHz, breathe) {
  writeFileSync(
    statePath,
    JSON.stringify({
      version: 1,
      at: Math.floor(Date.now() / 1000),
      burnout: { score, level },
      target: { presetId, beatHz, carrierHz, gain: 0.5, transitionSec: 30, breathe },
      sbg: null,
    }),
  );
}

// ---- redaction: nothing personal or hosting-related may reach a pane or a caption. Values are read at run time ----
const GENERIC = [
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/, 'email address'],
  [/\/(Users|home)\/[^\s/]+/, 'absolute home path'],
  [/[A-Za-z0-9-]+\.workers\.dev/, 'workers host'],
  [/(ssh:\/\/|git@[A-Za-z0-9.-]+:)/, 'ssh git remote'],
  [/https?:\/\/[A-Za-z0-9.-]+\.[a-z]{2,}\/[\w.-]+\/[\w.-]+\.git/, 'git remote url'],
  [/wrangler|workers\.dev|cloudflare|deploy/i, 'hosting word'],
  [/chat-\d+-\d{6,}|session[_-]?id/i, 'session id'],
];

let secretCache = null;
function secrets() {
  if (secretCache) return secretCache;
  const git = (k) => run('git', ['config', '--get', k], { cwd: ROOT }).trim();
  const host = hostname();
  const user = userInfo().username;
  const envIds = Object.entries(process.env)
    .filter(([k, v]) => /SESSION|CHAT/i.test(k) && typeof v === 'string' && v.length >= 8)
    .map(([, v]) => v);
  const list = [homedir(), tmp, tmpdir(), git('user.email'), git('user.name'), host, host.split('.')[0], user, process.env.KIROCREW_SCRATCH ?? '', ...envIds];
  secretCache = [...new Set(list.filter((v) => v.length >= 3))].sort((a, b) => b.length - a.length);
  return secretCache;
}

/** Throws when text still matches a forbidden pattern. Used for panes and captions. */
export function assertClean(text) {
  for (const [re, what] of GENERIC) {
    if (re.test(text)) throw new Error(`redaction failed: output still matches the ${what} pattern; recording aborted`);
  }
  for (const v of secrets()) {
    if (v.length >= 4 && text.includes(v)) throw new Error('redaction failed: output still contains a run-time private value; recording aborted');
  }
}

export function redact(text) {
  let out = text.split(statePath).join('.zonked-state.json');
  for (const v of secrets()) out = out.split(v).join('<redacted>');
  out = out.replace(/\/(Users|home)\/[^\s/]+/g, '<home>').replace(/\/(var\/folders|private\/var|tmp)\/\S*/g, '<tmp>');
  for (const [re, what] of GENERIC) {
    if (re.test(out)) throw new Error(`redaction failed: output still matches the ${what} pattern; recording aborted`);
  }
  return out;
}

// ---- crew.yaml: the real agent entries, only role, write_allow and shell_allow ----
export function agentYaml(name) {
  const lines = readFileSync(join(ROOT, '.kiro/crew/crew.yaml'), 'utf8').split('\n');
  const start = lines.findIndex((l) => l === `  ${name}:`);
  if (start < 0) throw new Error(`agent ${name} not found in crew.yaml`);
  const out = [`# .kiro/crew/crew.yaml: ${name}`];
  let key = '';
  for (let i = start + 1; i < lines.length && /^ {4}\S|^ {6}|^\s*#|^\s*$/.test(lines[i] ?? ''); i++) {
    const l = lines[i] ?? '';
    const m = /^ {4}(\w+):\s*(.*)$/.exec(l);
    if (m) key = m[1] ?? '';
    if (m && key === 'role') out.push(`role: ${m[2]}`.slice(0, 96));
    else if (m && (key === 'write_allow' || key === 'shell_allow')) out.push(`${key}:`);
    else if (!m && /^ {6}- /.test(l) && (key === 'write_allow' || key === 'shell_allow')) out.push(l.slice(4));
  }
  return out;
}

// ---- real captured text for the terminal panes (run from the repo root with relative paths) ----
export function panesOf(t) {
  return [
    ['burnout-sentinel', t.sentinel],
    ['acoustic-sequencer', t.sequencer],
    ['dsp-verifier', t.verifier],
    ['crew-bridge', t.bridge],
  ];
}

export function captureText(bridgeLines) {
  const at = { cwd: ROOT };
  const cargo = run('cargo', ['test', '--manifest-path', 'crates/dsp-core/Cargo.toml'], at)
    .split('\n')
    .filter((l) => /^test result:/.test(l))
    .slice(0, 1);
  const log = run('git', ['--no-pager', 'log', '--format=%h %s', '-n', '3'], at).trim().split('\n').filter(Boolean);
  const capPath = join(tmp, 'cap.json');
  const fake = run(process.execPath, ['crew-bridge/scripts/fake-crew.mjs', '--state', capPath, '--step-sec', '0.2', '--count', '4', '--transition-sec', '5'], at)
    .trim()
    .split('\n');
  const state = JSON.stringify(JSON.parse(readFileSync(capPath, 'utf8'))).slice(0, 190);
  const t = {
    sentinel: [...agentYaml('burnout-sentinel'), '$ git --no-pager log --format="%h %s" -n 3', ...log],
    sequencer: [...agentYaml('acoustic-sequencer'), '$ node crew-bridge/scripts/fake-crew.mjs --transition-sec 5', ...fake.slice(0, 4), '$ cat .zonked-state.json', state],
    verifier: [...agentYaml('dsp-verifier'), '$ cargo test --manifest-path crates/dsp-core/Cargo.toml', ...cargo],
    bridge: ['$ zonked-bridge --state .zonked-state.json --min-transition 5', ...bridgeLines],
  };
  for (const k of Object.keys(t)) t[k] = t[k].map(redact);
  return t;
}

// ---- overlay injected into the app page: title card, terminal panes and highlight box (shadow DOM, inert) ----
// Captions live in a separate 60 px strip page, so they never cover the app.
export function overlayInit() {
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>
  .dim{position:absolute;inset:0;background:rgba(8,10,16,.84);display:none;align-items:center;justify-content:center;flex-direction:column;color:#fff;font-family:system-ui,sans-serif;text-align:center}
  .dim h1{margin:0 0 22px;font:700 64px/1.1 system-ui,sans-serif}
  .dim ol{list-style:none;margin:0;padding:0;max-width:1000px}
  .dim li{margin:10px 0;font:600 30px/1.3 system-ui,sans-serif;color:#eaf0ff;opacity:0;transform:translateY(8px);transition:opacity .8s,transform .8s}
  .dim li.on{opacity:1;transform:none}
  .dim li b{color:#ffd479;margin-right:10px}
  .dim p{margin:22px 0 0;font:500 26px/1.3 system-ui,sans-serif;color:#d8e3ff;max-width:900px;opacity:0;transition:opacity .8s}
  .dim p.on{opacity:1}
  .term{position:absolute;inset:0;background:#0b0d12;display:none;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr 1fr;gap:8px;padding:8px;box-sizing:border-box;
   font:12px/1.35 ui-monospace,Menlo,monospace;color:#cfe3d4}
  .term h1{grid-column:1/3;margin:0;padding:6px 14px;font:600 15px system-ui,sans-serif;background:#161a23;color:#8fd6a0}
  .term .p{background:#10131a;border:1px solid #2a3140;overflow:hidden;display:flex;flex-direction:column;min-height:0}
  .term b{padding:3px 10px;background:#1d2330;color:#ffd479;font-size:12px}
  .term pre{margin:0;padding:6px 10px;white-space:pre;overflow:hidden;flex:1}
  .hl{position:absolute;border:3px solid #ffd479;border-radius:0;box-shadow:0 0 12px #ffd479;display:none}
  </style><div class=term></div><div class=hl></div><div class=dim></div>`;
  const hl = root.querySelector('.hl');
  const dim = root.querySelector('.dim');
  const term = root.querySelector('.term');
  let timer = 0;
  window.__demoTerm = (panes, delay) => {
    clearTimeout(timer);
    term.textContent = '';
    if (!panes) return void (term.style.display = 'none');
    term.style.display = 'grid';
    const h = document.createElement('h1');
    h.textContent = 'Kiro Crew: zonked (3 agents)';
    term.append(h);
    const outs = panes.map(([name]) => {
      const box = document.createElement('div');
      box.className = 'p';
      const b = document.createElement('b');
      b.textContent = name;
      const pre = document.createElement('pre');
      box.append(b, pre);
      term.append(box);
      return pre;
    });
    const idx = panes.map(() => 0);
    const tick = () => {
      let more = false;
      panes.forEach(([, lines], i) => {
        if (idx[i] < lines.length) {
          outs[i].textContent += `${lines[idx[i]++]}\n`;
          more = true;
        }
      });
      if (more) timer = setTimeout(tick, delay);
    };
    tick();
  };
  let sel = null;
  const place = () => {
    const el = sel && document.querySelector(sel);
    if (!el) return void (hl.style.display = 'none');
    const r = el.getBoundingClientRect();
    Object.assign(hl.style, { display: 'block', left: `${r.left - 4}px`, top: `${r.top - 4}px`, width: `${r.width + 8}px`, height: `${r.height + 8}px` });
  };
  setInterval(place, 250);
  // __demoTitle(title, steps, shown, foot): dimmed page behind a centred card. steps appear one by one.
  window.__demoTitle = (title, steps, shown, foot) => {
    dim.textContent = '';
    if (!title) return void (dim.style.display = 'none');
    dim.style.display = 'flex';
    const h = document.createElement('h1');
    h.textContent = title;
    dim.append(h);
    if (steps?.length) {
      const ol = document.createElement('ol');
      steps.forEach(([year, text], i) => {
        const li = document.createElement('li');
        const b = document.createElement('b');
        b.textContent = year;
        li.append(b, text);
        if (i < shown) li.className = 'on';
        ol.append(li);
      });
      dim.append(ol);
    }
    if (foot) {
      const p = document.createElement('p');
      p.textContent = foot;
      dim.append(p);
      requestAnimationFrame(() => requestAnimationFrame(() => (p.className = 'on')));
    }
    if (steps?.length) requestAnimationFrame(() => requestAnimationFrame(() => dim.querySelectorAll('li').forEach((li, i) => i < shown && li.classList.add('on'))));
  };
  window.__demoSteps = (n) => dim.querySelectorAll('li').forEach((li, i) => li.classList.toggle('on', i < n));
  window.__demoHighlight = (s) => {
    sel = s;
    place();
  };
  const attach = () => document.documentElement.appendChild(host);
  if (document.documentElement) attach();
  else document.addEventListener('DOMContentLoaded', attach);
}

// ---- caption strip: its own 1280x60 page, stacked above the app in the final video ----
export const CAPTION_HTML = `<!doctype html><meta charset=utf-8><style>
html,body{margin:0;height:60px;background:#0b0e16;overflow:hidden}
#c{height:60px;display:flex;align-items:center;justify-content:center;color:#fff;font:600 26px/1 system-ui,sans-serif;white-space:nowrap;padding:0 16px;box-sizing:border-box}
</style><div id=c></div><script>
window.__cap=(t)=>{const c=document.getElementById('c');c.textContent=t;c.style.fontSize='26px';
let s=26;while(c.scrollWidth>c.clientWidth&&s>16){s-=1;c.style.fontSize=s+'px'}};
</script>`;

// ---- soundtrack rendered from dsp_core.wasm, including the layers ----------------------------
// samples: [{ t, running, p }] where p is the live 32-slot param block read from the engine's shared buffer.
// bedParams: a param block captured from a lo-fi chords run. It plays softly whenever the live sound is
// idle or nearly silent (title card, offline reload, end of the sleep fade), so no gap is ever silent.
const GAIN_CAP = 0.6;
const BED_CAP = 0.5;
const BED_LEVEL = 0.8;

async function newEngine() {
  const bytes = readFileSync(join(WEB, 'src/wasm/dsp_core.wasm'));
  const { instance } = await WebAssembly.instantiate(bytes, {});
  const ex = instance.exports;
  ex.zk_init(SR);
  const count = typeof ex.zk_param_count === 'function' ? ex.zk_param_count() : 8;
  const apply = (p, cap) => {
    const blk = new Float32Array(ex.memory.buffer, ex.zk_param_block(), count);
    for (let i = 0; i < count; i++) blk[i] = p[i] ?? 0;
    blk[2] = Math.min(blk[2], cap);
    ex.zk_apply_params();
  };
  const FR = 128;
  const block = (l, r, at) => {
    ex.zk_render(FR);
    l.set(new Float32Array(ex.memory.buffer, ex.zk_out_left(), FR), at);
    r.set(new Float32Array(ex.memory.buffer, ex.zk_out_right(), FR), at);
  };
  return { apply, block, FR };
}

const idleAt = (s) => !(s?.running && s.p && (s.p[2] ?? 0) > 0.08);

export async function renderWav(samples, bedParams, out) {
  const frames = TOTAL * SR;
  const L = new Float32Array(frames);
  const R = new Float32Array(frames);
  const bL = new Float32Array(frames);
  const bR = new Float32Array(frames);
  const main = await newEngine();
  const bed = await newEngine();
  const silent = new Array(32).fill(0);
  silent[0] = 200;
  silent[1] = 10;
  silent[6] = 0.25;
  main.apply(silent, GAIN_CAP);
  bed.apply(bedParams, BED_CAP);
  const FR = main.FR;
  const w = new Float32Array(frames / FR + 1);
  let si = -1;
  let wBed = 1;
  for (let f = 0, k = 0; f + FR <= frames; f += FR, k++) {
    const t = f / SR;
    let ni = si;
    while (ni + 1 < samples.length && samples[ni + 1].t <= t) ni++;
    if (ni !== si) {
      si = ni;
      const s = samples[si];
      main.apply(s.running && s.p ? s.p : silent, GAIN_CAP);
    }
    main.block(L, R, f);
    bed.block(bL, bR, f);
    const target = idleAt(samples[si]) ? 1 : 0;
    wBed += (target - wBed) * (FR / SR / 1.2); // about 1.2 s crossfade
    w[k] = wBed * BED_LEVEL;
  }
  const pcm = new Int16Array(frames * 2);
  for (let f = 0; f < frames; f++) {
    const g = w[Math.floor(f / FR)] ?? 0;
    pcm[f * 2] = Math.max(-1, Math.min(1, L[f] + bL[f] * g)) * 32767;
    pcm[f * 2 + 1] = Math.max(-1, Math.min(1, R[f] + bR[f] * g)) * 32767;
  }
  const hdr = Buffer.alloc(44);
  const dataLen = pcm.length * 2;
  hdr.write('RIFF', 0);
  hdr.writeUInt32LE(36 + dataLen, 4);
  hdr.write('WAVEfmt ', 8);
  hdr.writeUInt32LE(16, 16);
  hdr.writeUInt16LE(1, 20);
  hdr.writeUInt16LE(2, 22);
  hdr.writeUInt32LE(SR, 24);
  hdr.writeUInt32LE(SR * 4, 28);
  hdr.writeUInt16LE(4, 32);
  hdr.writeUInt16LE(16, 34);
  hdr.write('data', 36);
  hdr.writeUInt32LE(dataLen, 40);
  writeFileSync(out, Buffer.concat([hdr, Buffer.from(pcm.buffer)]));
}
