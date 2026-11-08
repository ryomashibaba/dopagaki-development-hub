/** R73: improve the R72 locally runnable, isolated native 240Hz B51 kit
 * WITHOUT changing original game / physics / camera / Blender / stages.
 * Purely copies an already verified original archived R72 trial directory,
 * replaces its Windows launcher with an owned loopback dynamic-port server.
 * This must not publish, merge, or certify human gameplay.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const source=path.resolve(process.argv[2]||'test-results/k4ct-r72-human-trial-bundle');
const dest=path.resolve(process.argv[3]||'test-results/k4ct-r73-human-trial-bundle');
assert.notEqual(source,dest,'Never overwrite the saved R72 source kit');
assert.ok(source.endsWith('k4ct-r72-human-trial-bundle')||source.endsWith('DOPAGAKI_R72_Local_Trial'), 'Refuse arbitrary source directory');
assert.ok(dest.endsWith('k4ct-r73-human-trial-bundle')||dest.endsWith('DOPAGAKI_R73_Local_Trial'), 'Refuse arbitrary destination directory');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourceManifestPath=path.join(source,'R72_PACKAGE_MANIFEST.json');
const sourceManifestBytes=fs.readFileSync(sourceManifestPath);
const old=JSON.parse(sourceManifestBytes);
assert.equal(old.nativeSourceGameBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(old.originalBlenderAuthorBlob,'096fffbc1627915eb0122224955bb02cfba6b3ae');
assert.deepEqual([old.originalB48,old.originalB51,old.newColliders],[7,28,0]);
assert.equal(old.autoNetworkUpload,false);
assert.equal(old.launchTestedOnWindows,false);
for(const [field,relative] of [
 ['UIAddonSHA256','k4ct/r72-one-click-human-trial.mjs'],
 ['launcherSHA256','R72_DOPAGAKI_LOCAL_TRIAL.cmd']]){
 assert.equal(sha(fs.readFileSync(path.join(source,relative))),old[field]);
}
for(const p of ['k4ct/index.html','k4ct/drive3d.mjs',
 'reference_only/director/physics.js','reference_only/director/collision.js',
 'reference_only/director/game-fixtures.js','reference_only/director/moving/moving-obstacles.mjs',
 'reference_only/director/surface.js','generated/K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json'])
 assert.ok(fs.statSync(path.join(source,p)).isFile(),p);
const pythonSource=fs.readFileSync('scripts/k4ct-r73-local-server.py');
assert.ok(pythonSource.includes('ThreadingHTTPServer(("127.0.0.1", 0)'));
assert.ok(pythonSource.includes('--self-check'));
assert.ok(pythonSource.includes('http.server')||pythonSource.includes('SimpleHTTPRequestHandler'));
if(fs.existsSync(dest))throw Error('Destination exists. Refusing overwrite, preserving previous local evidence.');
fs.cpSync(source,dest,{recursive:true,force:false});
for(const oldname of ['R72_DOPAGAKI_LOCAL_TRIAL.cmd','R72_最初に読んでください.txt','R72_PACKAGE_MANIFEST.json'])
 fs.rmSync(path.join(dest,oldname));
const pythonName='R73_LOCAL_SERVER.py';
fs.writeFileSync(path.join(dest,pythonName),pythonSource);
const cmd=[
 '@echo off',
 'setlocal',
 'cd /d "%~dp0"',
 'py -3.13 -V >nul 2>&1',
 'if errorlevel 1 (',
 '  echo [R73 HOLD] Python 3.13 was not found. No settings changed.',
 '  echo Python 3.13 and its py launcher are required.',
 '  pause',
 '  exit /b 3',
 ')',
 'echo [R73] Checking saved original 240Hz trial kit and opening own LOCAL server...',
 'py -3.13 "%~dp0R73_LOCAL_SERVER.py"',
 'set "R73_EXIT=%ERRORLEVEL%"',
 'if not "%R73_EXIT%"=="0" (',
 '  echo [R73 HOLD] Please report the message above. No Windows settings changed.',
 '  pause',
 ')',
 'exit /b %R73_EXIT%',
 ''
].join('\r\n');
const cmdName='R73_DOPAGAKI_LOCAL_TRIAL.cmd';
fs.writeFileSync(path.join(dest,cmdName),cmd,'utf8');
const readme=[
 'DOPAGAKI SLOPE — K4CT R73 ローカル試走セット (ART/HUMAN HOLD)',
 '',
 '1. このZIPを展開する。',
 '2. '+cmdName+' をダブルクリック。Windows・Python 3.13 (pyランチャー) が必要。',
 '3. ブラウザが自動で開き、右下「B51-14試走を開始」をクリックする。',
 '4. 63.70秒地点までデモ移動し、手動に切替後はA/Dまたは矢印で操舵。',
 '5. 必要なら「結果JSONを保存」で端末内に保存。自動送信しない。',
 '閉じるときはコマンド画面を閉じるかCtrl+C。自分で起動したHTTPのみ終了。',
 '起動不能ならコマンド画面の [R73 HOLD] の行だけ共有すれば調査できる。',
 '通信は127.0.0.1のローカルHTTPだけ。利用可能な空きポートを自動取得する。',
 '元Camera/240Hz/Road/B48x7/B51x28/物理/Blender原本は変更されていない。',
 'この研究の自動デモやブラウザ試験は「人間による回避・公平・面白さ」ではない。',
 '正式ART採用0、Slope2 DNA認定0m、HUMAN/SAT/CCD/WindowsFPS/公開/merge HOLD。',
 'R72 Linux Chromium browser handover and local JSON save succeeded; R73 Windows execution UNTESTED.',
 ''
].join('\r\n');
fs.writeFileSync(path.join(dest,'R73_最初に読んでください.txt'),readme,'utf8');
const manifest={...old,
 schema:'k4ct-r73-native-source-safe-dynamic-local-launcher/1',
 basedOnR72ManifestSHA256:sha(sourceManifestBytes),
 localLauncherRevision:'R73_DYNAMIC_OWNED_LOOPBACK_SERVER',
 pythonScriptSHA256:sha(pythonSource),
 launcherSHA256:sha(Buffer.from(cmd,'utf8')),
 UIAddonSHA256:old.UIAddonSHA256,
 requiresNoExtraPaidService:true,
 serverBind:'127.0.0.1',httpPort:null,dynamicAvailablePort:true,
 localHTTPReadyBeforeOpeningBrowser:true,
 serverOwnerSamePythonProcess:true,staleOtherServerReuse:false,
 WindowsExecution:'UNTESTED',launchTestedOnWindows:false,
 userHumanUncertified:true,
 originalBrowser240HzSmokeVerifiedOnR72Only:true,
 extraOriginalGameEditing:false,
 humanQA:'HOLD',ART:'HOLD',HUMAN:'HOLD'
};
fs.writeFileSync(path.join(dest,'R73_PACKAGE_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
assert.equal(sha(fs.readFileSync(path.join(dest,cmdName))),manifest.launcherSHA256);
assert.equal(sha(fs.readFileSync(path.join(dest,pythonName))),manifest.pythonScriptSHA256);
assert.equal(sha(fs.readFileSync(path.join(dest,'k4ct/r72-one-click-human-trial.mjs'))),manifest.UIAddonSHA256);
const after=JSON.parse(fs.readFileSync(path.join(dest,'generated/K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json')));
assert.equal(after.movingObstacles.length,28);
assert.equal(after.surfaces.length,7);
console.log('R73_LOCAL_TRIAL_BUNDLE_SOURCE_ONLY_UPGRADE_PASS',JSON.stringify({
 source,output:dest,originalPhysicsChanged:false,originalB51:28,originalB48:7,
 localOnly:true,winVerified:false,HUMAN:'HOLD',ART:'HOLD'
}));
