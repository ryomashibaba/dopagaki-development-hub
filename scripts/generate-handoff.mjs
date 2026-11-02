#!/usr/bin/env node
// Read-only handoff snapshot. No network, credentials, git writes, PR edits or deployments.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const base = 'https://github.com/ryomashibaba/dopagaki-development-hub';
function git(args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8', timeout: 15000, maxBuffer: 2_000_000
  }).trim();
}
function safeLine(s) {
  return String(s).replace(/[\r\n]/g, ' ').replace(/§/g, "'").trim();
}
const head = git(['rev-parse', 'HEAD']);
let branch;
try { branch = git(['symbolic-ref', '--quiet', '--short', 'HEAD']); }
catch { branch = process.env.GITHUB_REF_NAME || '(detached)'; }
const subject = safeLine(git(['log', '-1', '--format=%s']));
const commitTime = git(['log', '-1', '--format=%cI']);
const gitDocs = git(['log', '--name-only', '--pretty=format:', '-n', '80',
  '--', ':(glob)docs/*.md']).split(/\r?\n/).map(s => s.trim());
const uniqueDocs = [...new Set(gitDocs.filter(s =>
  /^docs\/[A-Za-z0-9_/-]+\.md$/.test(s) && existsSync(path.join(repo, s))
))];
const latestAudit = uniqueDocs.find(s => /^docs\/W9C2_G4E/i.test(s)) || null;
const recentLog = git(['log', '-n', '8', '--format=%h %s'])
  .split(/\r?\n/).map(safeLine);
const auditText = latestAudit ?
  readFileSync(path.join(repo, latestAudit), 'utf8').slice(0, 14_000) : '';
const auditSha = latestAudit ?
  git(['log', '-1', '--format=%H', '--', latestAudit]) : '';
const generatedAt = new Date().toISOString();
const chunks = [
  '# DOPAGAKI SLOPE — 自動引き継ぎスナップショット',
  '',
  '> **自動生成資料・正式採択/人間QA/公開を認定しません。** 開始時はGitHubの現行ブランチとPRを再照合。',
  '',
  '- 生成UTC：' + generatedAt,
  '- 取得ブランチ：§' + safeLine(branch) + '§',
  '- 取得HEAD：§' + head + '§',
  '- 最終コミット日時：' + commitTime,
  '- 最終コミット：' + subject,
  '- GitHub：' + base + '/tree/' + encodeURIComponent(branch),
  '- Draft PR #46：' + base + '/pull/46 （**状態はGitHubで再確認**）',
  '',
  '## 直近のコミット（Git履歴の事実のみ）',
  '',
  ...recentLog.map(x => '- ' + x),
  '',
  '## 最近更新された工程監査',
  '',
  latestAudit ?
    '- 最新のG4E監査：[' + latestAudit + '](' +
      base + '/blob/' + head + '/' + latestAudit + ')' :
    '- このcheckoutでG4E監査文書を検出できませんでした。GitHubのdocsを直接確認。',
  '- 最新監査の最終変更コミット：' + (auditSha ? '§' + auditSha + '§' : '不明'),
  '- 直近のその他のdocs（最大4件）：' +
    (uniqueDocs.slice(0, 4).join(' / ') || 'なし'),
  '- 注意：最新HEADに監査後のコード変更があれば、下記監査だけで現行成果を断定しない。',
  '',
  '## 最新G4E監査の原文（長すぎる場合は先頭14000文字）',
  '',
  auditText || '監査原文なし。URLから再取得すること。',
  '',
  '## 新チャットへの開始指令',
  '',
  '1. ' + base + '/blob/' + head + '/PROJECT_STATE.md を読み、恒久方針を守る。',
  '2. GitHubの最新HEAD、Draft PR #46、直近CI、最新工程doc/コードを実際に再取得する。',
  '3. 技術CI成功・人間の実走行・美術・正式採択/公開を混同しない。正式認定距離を推測で増やさない。',
  '4. 主眼は実際に面白い高速立体コース。次の有意義な開発作業へ進み、結果を短く記録する。',
  '5. main、Gold、既存研究原本、両本番、原作Slope、Draft状態を保護。無断merge/Ready化/公開禁止。',
  ''
];
process.stdout.write(chunks.join('\n').replace(/§/g, String.fromCharCode(96)));
