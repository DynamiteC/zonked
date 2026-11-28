// Every web test file that stubs the audio engine must say so on top, so a reader never mistakes it for proof of real output.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'web', 'src');
const STUB = /start: vi\.fn|as unknown as AudioEngine|engine as never|as never\)|createFakeEngine|fakeEngine/;

function* tests(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* tests(p);
    else if (/\.test\.tsx?$/.test(name)) yield p;
  }
}

test('test files that stub the audio engine carry the MOCKED label', () => {
  const missing = [...tests(SRC)].filter((f) => STUB.test(readFileSync(f, 'utf8')) && !readFileSync(f, 'utf8').split('\n').slice(0, 3).join('\n').includes('// MOCKED:'));
  assert.deepEqual(missing, []);
});
