import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const snapshot = () => execFileSync(process.execPath,
  [path.join(root, 'scripts/generate-handoff.mjs')],
  { cwd: root, encoding: 'utf8', timeout: 20000 });

test('latest git HEAD is shown without claiming approval', () => {
  const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const s = snapshot();
  assert.ok(s.includes(head));
  assert.match(s, /Draft PR #46/);
  assert.match(s, /状態はGitHubで再確認/);
  assert.match(s, /正式採択/);
  assert.match(s, /無断merge\/Ready化\/公開禁止/);
});

test('recent audit includes a real tracked source or explicit unknown', () => {
  const s = snapshot();
  assert.match(s, /最新のG4E監査：|G4E監査文書を検出できません/);
  assert.match(s, /監査後のコード変更/);
  assert.match(s, /最新工程doc\/コード/);
});

test('snapshot generator is read-only', () => {
  const before = execFileSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  snapshot();
  const after = execFileSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  assert.equal(after, before);
});
