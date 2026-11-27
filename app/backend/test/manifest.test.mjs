import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TOOL_DEFS } from '../tools.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const manifest = JSON.parse(readFileSync(`${root}app.json`, 'utf8'));

test('permissions list exactly what the app uses', () => {
  assert.deepEqual(manifest.permissions, { api: ['/apps/zonked/api'], cron: true });
});

test('every declared agent file exists and names its tools', () => {
  assert.equal(manifest.agents.length, 3);
  for (const path of manifest.agents) {
    const agent = JSON.parse(readFileSync(`${root}${path}`, 'utf8'));
    assert.ok(path.endsWith(`${agent.name}.json`));
    assert.ok(agent.prompt.length > 200 && agent.prompt.length < 4000);
    assert.equal(agent.includeMcpJson, false);
    for (const t of agent.tools.filter((x) => x.startsWith('@zonked-crew/'))) {
      assert.ok(Object.hasOwn(agent.mcpServers, 'zonked-crew'));
      assert.ok(TOOL_DEFS.some((d) => t.endsWith(`/${d.name}`)), t);
    }
  }
});

test('the sentinel cron ships off, runs one agent and declares the cron permission', () => {
  assert.equal(manifest.crons.length, 1);
  assert.equal(manifest.crons[0].enabled, false);
  assert.equal(manifest.crons[0].agent, 'burnout-sentinel');
  assert.ok(manifest.crons[0].every >= 60);
});

test('agentTools match the tool table and use only manifest-legal schema keys', () => {
  const names = manifest.agentTools.tools.map((t) => t.name);
  assert.deepEqual(names, TOOL_DEFS.map((d) => d.name));
  const legal = new Set(['type', 'minimum', 'maximum', 'enum', 'maxLength']);
  for (const tool of manifest.agentTools.tools) {
    assert.ok(tool.name.startsWith('zonked_'));
    for (const prop of Object.values(tool.inputSchema.properties)) {
      for (const key of Object.keys(prop)) assert.ok(legal.has(key), `${tool.name}.${key}`);
    }
  }
});

test('stdio server answers a real tools/list over a pipe', async () => {
  const child = spawn(process.execPath, [`${root}backend/mcp.mjs`], { env: { ...process.env, ZONKED_DATA: `${root}backend/.tmp-test-data` }, stdio: ['pipe', 'pipe', 'inherit'] });
  const reply = await new Promise((resolve) => {
    child.stdout.once('data', (d) => resolve(JSON.parse(String(d).split('\n')[0])));
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })}\n`);
  });
  child.kill();
  assert.equal(reply.result.tools.length, 2);
});
