// Stdio MCP server for the three Zonked agents (newline-delimited JSON-RPC 2.0).
// It shares crew-memory.json with the HTTP backend through store.mjs. No network, no shell.
// The agent file passes ZONKED_DATA="{APP_DATA}" so both processes use the same directory.
import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';
import { createStore, resolveDataDir } from './store.mjs';
import { TOOL_DEFS, TOOL_NAMES, runTool } from './tools.mjs';

const MAX_LINE = 8192;
const PROTOCOL = '2024-11-05';

const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

export function handleMessage(store, msg) {
  if (typeof msg !== 'object' || msg === null || Array.isArray(msg) || typeof msg.method !== 'string') {
    return fail(null, -32600, 'invalid request');
  }
  const id = msg.id ?? null;
  if (msg.id === undefined) return null; // a notification gets no reply
  switch (msg.method) {
    case 'initialize':
      return ok(id, { protocolVersion: PROTOCOL, capabilities: { tools: {} }, serverInfo: { name: 'zonked-crew', version: '0.1.0' } });
    case 'ping':
      return ok(id, {});
    case 'tools/list':
      return ok(id, { tools: TOOL_DEFS });
    case 'tools/call': {
      const p = typeof msg.params === 'object' && msg.params !== null ? msg.params : {};
      if (typeof p.name !== 'string' || !TOOL_NAMES.includes(p.name)) return fail(id, -32602, 'unknown tool');
      const result = runTool(store, { tool: p.name, arguments: p.arguments });
      return ok(id, { content: [{ type: 'text', text: JSON.stringify(result) }], isError: result.ok !== true });
    }
    default:
      return fail(id, -32601, 'method not found');
  }
}

export function serve(store, input = process.stdin, output = process.stdout) {
  const rl = createInterface({ input });
  rl.on('line', (line) => {
    if (line.length > MAX_LINE) return void output.write(`${JSON.stringify(fail(null, -32600, 'line too long'))}\n`);
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      return void output.write(`${JSON.stringify(fail(null, -32700, 'parse error'))}\n`);
    }
    const reply = handleMessage(store, msg);
    if (reply !== null) output.write(`${JSON.stringify(reply)}\n`);
  });
  return rl;
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  serve(createStore(resolveDataDir(process.env.ZONKED_DATA)));
}
