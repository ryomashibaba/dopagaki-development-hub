/** R72: pack a Windows one-click LOCAL playable experiment only.
 * The genuine original 240Hz engine/B51/Camera/Road are generated from the
 * protected source. This produces no Pages or formal QA, no auto-upload.
 * Zip only build output and one local launcher; never copy any repo secrets.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const expectedGame='af076d67492a677d2235e4730aef8cdf4808e106';
const expectedBlender='096fffbc1627915eb0122224955bb02cfba6b3ae';
const gitBlob=p=>execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();
assert.equal(gitBlob('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'),expectedGame);
assert.equal(gitBlob('scripts/p101-k4ct-native-spillway-dcc.py'),expectedBlender);
const original=path.resolve('dist-private/k4ct');
const generated=path.resolve('dist-private/generated');
const stageFile=path.join(generated,'K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json');
const stage=JSON.parse(fs.readFileSync(stageFile,'utf8'));
assert.equal(stage.movingObstacles.length,28);
assert.equal(stage.surfaces.length,7);
assert.equal(stage.stageForge.k4ctPrivate.newColliders,0);
assert.equal(stage.stageForge.k4ctPrivate.originalRunnerCamera240HzSteeringCCDUnmodified,true);
assert.equal(stage.stageForge.k4ctPrivate.productionPromoted,undefined);
assert.equal(stage.stageForge.productionPromoted,false);
assert.ok(fs.statSync(original).isDirectory());
const gameJs=fs.readFileSync(path.join(original,'drive3d.mjs'),'utf8');
assert.match(gameJs,/REAL_WEBGL2_SOURCE_240HZ/);
assert.match(gameJs,/ORIGINAL_MANUAL_UNCERTIFIED/);
assert.ok(gameJs.includes("applyK4CTR57Hud(canvas,k4ctPanel,dual)"));
assert.ok(gameJs.includes('k4ctResearchRedundantCue'));
const dest=path.resolve('test-results/k4ct-r72-human-trial-bundle');
fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});
const target=path.join(dest,'k4ct');
fs.cpSync(original,target,{recursive:true});
const outputGenerated=path.join(dest,'generated');fs.mkdirSync(outputGenerated,{recursive:true});
// Only explicit game-stage assets referenced by the standalone renderer.
// Do NOT copy every generated PRIVATE asset or files with secret-like names.
const assetNames=[...new Set([...gameJs.matchAll(/['"]([A-Za-z0-9_-]+\.json)['"]/g)].map(m=>m[1]))];
assetNames.push('K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json');
const used=[...new Set(assetNames)];
assert.ok(used.includes('K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json'));
for(const name of used){
 if(!/^[A-Za-z0-9_-]+\.json$/.test(name))throw Error('Invalid generated asset path '+name);
 const input=path.join(generated,name);
 if(!fs.existsSync(input))continue; // Other selected modes are not in this one-stage bundle.
 fs.copyFileSync(input,path.join(outputGenerated,name));
}
assert.ok(fs.existsSync(path.join(outputGenerated,'K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json')));
const index=path.join(target,'index.html'),originalHtml=fs.readFileSync(index,'utf8');
assert.equal(originalHtml.split('</body>').length,2,'Unrecognized isolated game HTML');
const addon='<script type="module" src="./r72-one-click-human-trial.mjs"></script>';
assert.ok(!originalHtml.includes('r72-one-click-human-trial'),'not idempotent');
fs.writeFileSync(index,originalHtml.replace('</body>',addon+'\n</body>'));
fs.copyFileSync('scripts/k4ct-r72-one-click-human-trial.mjs',path.join(target,'r72-one-click-human-trial.mjs'));
const cmd=[
 '@echo off',
 'setlocal',
 'cd /d "%~dp0"',
 'py -3.13 -V >nul 2>&1',
 'if errorlevel 1 (',
 '  echo [HOLD] Python 3.13 launcher not found. No files changed.',
 '  pause',
 '  exit /b 3',
 ')',
 'echo K4CT R72 research game - LOCALHOST only / not human-certified.',
 'echo This window runs the local read-only web server. Close to stop.',
 'start "K4CT_LOCAL_HTTP" /B py -3.13 -m http.server 4373 --bind 127.0.0.1 --directory "%~dp0"',
 'timeout /t 3 /nobreak >nul',
 'start "" "http://127.0.0.1:4373/k4ct/?k4ct=on^&stage=K4CT-TWO-REAL-B51-CHOICE"',
 'echo If the game is blank, check port 4373 or restart this launcher.',
 'pause',
 ''
].join('\r\n');
const launcher='R72_DOPAGAKI_LOCAL_TRIAL.cmd';
fs.writeFileSync(path.join(dest,launcher),cmd,'utf8');
const readme=[
 'DOPAGAKI SLOPE / K4CT R72 研究専用・ローカル試走セット',
 '',
 'このフォルダをZIPから展開し、Windowsで '+launcher+' をダブルクリック。',
 'Python 3.13のpyランチャーが必要です。自動で http://127.0.0.1:4373/ にだけローカルサーバーを起動します。',
 'ブラウザ表示後、右下の「B51-14試走を開始」をクリックしてください。',
 '元のデモが63.70秒まで走り、そこから操作を引き継ぎます。以降はA/Dか左右矢印で操縦。',
 '失敗・再挑戦・実B51の存在を確認してください。失敗原因を含め自然に操作して判断するための研究用です。',
 '任意で「結果JSONを保存」を押すと端末内に記録が保存されます。自動送信・外部サーバー接続なし。',
 '元240Hz/Camera/28 B51/7 B48/当たり判定は変更していません。',
 'デモ移動はSCRIPTEDです。Playwright試験・自動入力は人間によるクリアやゲームの公平性の証明ではありません。',
 '正式ART採用0・Slope2 DNA認定0m・HUMAN/SAT/CCD/FPS/公開/マージはHOLD。',
 'R49のART REJECT景観を基にしています。ゲームの完成版・正式公開物ではありません。',
 'ブラウザが使えない場合はコマンドウィンドウを閉じ、他のhttp.serverを停止してから再起動してください。',
 '出典: https://github.com/ryomashibaba/dopagaki-development-hub',
 '元GAME blob '+expectedGame,
 '元Blender作者 blob '+expectedBlender,
 ''
].join('\n');
fs.writeFileSync(path.join(dest,'R72_最初に読んでください.txt'),readme,'utf8');
const diag={
 schema:'k4ct-r72-local-human-trial-bundle-static-build/1',
 nativeSourceGameBlob:expectedGame,
 originalBlenderAuthorBlob:expectedBlender,
 trueOriginal240HzStage:'K4CT-TWO-REAL-B51-CHOICE',
 originalB48:7,originalB51:28,newColliders:0,
 onlyGeneratedPrivateAndLocalBundleModified:true,
 isolatedBuildArtwork:'R49_ART_REJECT_NOT_FORMAL',
 autoNetworkUpload:false,serverBind:'127.0.0.1',httpPort:4373,
 launchRequires:'Windows Python 3.13 py launcher',
 userHumanUncertified:true,formalArtAccepted:0,slope2DNAMetres:0,
 launchTestedOnWindows:false,sourceCameraOriginal:true,
 bundledGeneratedStageAssets:used.filter(x=>fs.existsSync(path.join(outputGenerated,x))),
 launcherSHA256:crypto.createHash('sha256').update(cmd).digest('hex'),
 UIAddonSHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(target,'r72-one-click-human-trial.mjs')).digest('hex')),
 HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',WindowsFPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'
};
fs.writeFileSync(path.join(dest,'R72_PACKAGE_MANIFEST.json'),JSON.stringify(diag,null,2)+'\n');
assert.ok(fs.readdirSync(target).includes('drive3d.mjs'));
assert.ok(fs.readFileSync(index,'utf8').includes(addon));
assert.ok(fs.existsSync(path.join(outputGenerated,'K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json')));
console.log('R72_PRIVATE_LOCAL_TRIAL_BUNDLE_CREATED',JSON.stringify({
 source:diag.nativeSourceGameBlob,stage:diag.trueOriginal240HzStage,
 assets:diag.bundledGeneratedStageAssets.length,launcher,
 USER_MANUAL:'NOT_YET_TESTED',ART:'HOLD',HUMAN:'HOLD'}));
