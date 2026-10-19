/**
 * A11 Windows local manual review kit built only inside a PR GitHub Actions
 * artifact. NOT GitHub Pages / chatgpt.site deployment.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'dist-site'),out=path.join(root,'b5-manual-review');
if(!fs.existsSync(path.join(source,'generated','P101_B5_HYPER_ARC.json')))
 throw Error('Cannot pack review kit without true physical B5 stage');
const doc=JSON.parse(fs.readFileSync(path.join(source,'generated','P101_B5_HYPER_ARC.json'),'utf8'));
if(doc?.stageForge?.variant!=='B5_HYPER_ARC_ISOLATED'||
   doc.stageForge.nominalLengthMeters!==7280||doc.movingObstacles.length!==12||
   doc.stageForge.genuineFastLaw?.provenStartSpeedMps!==52)
 throw Error('Wrong B5 review geometry/thrust/obstacle configuration');
if(!fs.existsSync(path.join(source,'drive3d','p101-b5-manual-qa.mjs')))
 throw Error('B5 manual real-world observation module missing');
const a13Path=path.join(source,'generated','P101_A13_W7_GAMEPLAY.json');
if(!fs.existsSync(a13Path))throw Error('A13 W7F real 28-machine QA stage missing');
const a13=JSON.parse(fs.readFileSync(a13Path,'utf8'));
if(a13.stageForge.revision!=='W7F'||a13.stageForge.productionPromoted!==false||
   a13.stageForge.humanPlaytest!=='NOT_RUN'||a13.movingObstacles.length!==28||
   a13.stageForge.nativeScriptedProof?.physicsHz!==240)
 throw Error('Refusing to pack wrong A13 W7F physics or unapproved stage');
// W9-C1 G3: independent 28m and 14m TRUE B48 road studies, not release.
for(const [kind,width] of [['CONTROL',28],['ULTRA',14]]){
 const file=path.join(source,'generated','P101_A13_W9C1_'+kind+'_TRIAL.json');
 if(!fs.existsSync(file))throw Error('W9-C1 separate local manual review stage missing: '+kind);
 const c1=JSON.parse(fs.readFileSync(file,'utf8'));
 if(c1.stageForge.recordStageId!=='VB-P101-A13-W9C1-'+kind||
    c1.stageForge.slopeDNAStudy?.nominalCoreWidthMeters!==width||
    !c1.stageForge.slopeDNAStudy?.realB48Surface||c1.surfaces.length!==7||
    c1.movingObstacles.length!==28||c1.stageForge.productionPromoted!==false||
    c1.stageForge.humanPlaytest!=='NOT_RUN')throw Error('Wrong W9-C1 QA asset '+kind);
}
if(!fs.existsSync(path.join(source,'drive3d','p101-w9c1-approach-cue.mjs')))
 throw Error('W9-C1 HUD/physical marker module missing');
fs.rmSync(out,{recursive:true,force:true});
fs.cpSync(source,out,{recursive:true});
const server=`import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
 '.jpg':'image/jpeg','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
 try{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  const u=new URL(req.url,'http://127.0.0.1/');
  let target=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream',
   'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(target).pipe(res);
 }catch(e){res.writeHead(400);res.end('Bad URL');}
});
server.listen(0,'127.0.0.1',()=>{
 const port=server.address().port,w7=process.argv.includes('--a13');
 const ultra=process.argv.includes('--w9c1-ultra'),control=process.argv.includes('--w9c1-control');
 if([w7,ultra,control].filter(Boolean).length>1)throw Error('Only one trial selection allowed');
 const stage=ultra?'VB-P101-A13-W9C1-ULTRA':control?'VB-P101-A13-W9C1-CONTROL':w7?'VB-P101-A13':'VB-P101-B5';
 const url='http://127.0.0.1:'+port+'/drive3d/?stage='+stage;
 console.log('P101 '+stage+' / LOCAL ONLY  '+url);
 console.log('指定ステージを自動で選択します。ロード後、A/Dまたは左右キーで手動走行してください。');
 console.log('試走終了後「試走レポートをJSON保存」で記録を保存できます。');
 console.log('このウィンドウを閉じると試走サーバーは停止します。');
 if(process.platform==='win32'){
  const child=spawn('cmd.exe',['/c','start','',url],{windowsHide:true,stdio:'ignore'});
  child.on('error',()=>console.log('自動で開けない場合、上のURLをブラウザに貼り付けてください。'));
  child.unref();
 }
});
`;
fs.writeFileSync(path.join(out,'_LOCAL_ONLY_SERVER.mjs'),server);
fs.writeFileSync(path.join(out,'RUN_B5_QA.cmd'),`@echo off\r\nchcp 65001 >nul\r\ncd /d "%~dp0"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (echo Node.js 22 or newer is required. & pause & exit /b 1)\r\nnode "_LOCAL_ONLY_SERVER.mjs"\r\npause\r\n`);
fs.writeFileSync(path.join(out,'RUN_A13_W7F_QA.cmd'),`@echo off\r\nchcp 65001 >nul\r\ncd /d "%~dp0"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (echo Node.js 22 or newer is required. & pause & exit /b 1)\r\nnode "_LOCAL_ONLY_SERVER.mjs" --a13\r\npause\r\n`);
for(const [kind,flag] of [['14m','--w9c1-ultra'],['28m','--w9c1-control']]){
 fs.writeFileSync(path.join(out,'RUN_W9C1_'+kind+'_QA.cmd'),
  '@echo off\r\nchcp 65001 >nul\r\ncd /d "%~dp0"\r\nwhere node >nul 2>nul\r\nif errorlevel 1 (echo Node.js 22 or newer is required. & pause & exit /b 1)\r\nnode "_LOCAL_ONLY_SERVER.mjs" '+flag+'\r\npause\r\n');
}
fs.writeFileSync(path.join(out,'START_W9C1_JA.txt'),
`W9-C1 ABYSS DIVE / Windows手動QA — PR #46 Draft/HOLD のみ

1. RUN_W9C1_14m_QA.cmd をダブルクリック。実14m超細道の独立版が開きます。
2. 28mと比較するときは RUN_W9C1_28m_QA.cmd をダブルクリック。
3. ステージ開始00から A/D または左右キーで自動前進のボールを操作。
4. 90mからの狭路予告HUD、表示される距離/現速度換算秒数、道路端の視認性を確認。
5. 任意の試走評価とコメントを付け「試走レポートをJSON保存」。
6. ダウンロードした P101_A13_W9C1_*_MANUAL_QA_*.json をチャットに添付。

画面の「約x.x秒」は現在速度での推定であり、視覚反応時間の保証ではありません。
本当の道路はB48 240Hz、ボール半径0.65m、移動機械28基。
310–360m（約50m）が評価コア、前後200–440mは滑らかな幅遷移。
開始地点の局所QA確認用再発進52m/sは通常走行の中途速度を再現しません。
人間の公平性/実機FPS/楽しいかどうかは未認定。
127.0.0.1のみで起動、ユーザー情報の自動送信なし。
W7F/B5/W9-X/main/本番は一切変更していません。公開・マージ不可。
`,'utf8');
const w7Readme=`P101 A13 W7F / Windowsローカル手動QA — Draft PR専用・非公開

1. RUN_A13_W7F_QA.cmd をダブルクリック（Node.js 22以上）。
2. ブラウザがW7Fを自動選択して開きます。A/D または←→で手動走行してください。
3. 画面の「A13 W7F · 手動試走レポート」からJSONを保存してください。
4. その P101_A13_MANUAL_QA_*.json をチャットへ添付してください。

正規B48/B51-C 240Hz・52m/s始動・28基の本物の動体。
7/7区間、53.275秒、最高203.6m/sは補正操舵スクリプトによる確認であり、
人間の操作・楽しさ・難易度・FPSの合格ではありません。
旧W1とB5、公開ゲームサイトは未変更。ローカル127.0.0.1のみ、データ自動送信なし。
`;
fs.writeFileSync(path.join(out,'START_A13_W7F_JA.txt'),w7Readme,'utf8');
const readme=`P101 B5 / Windows手動品質評価パック — 開発PR内だけの試験版

1. このZIPを任意のフォルダーに解凍します。
2. RUN_B5_QA.cmd をダブルクリックします（Node.js 22以上が必要）。
3. 自動で開くブラウザで「◆ P101 B5 HYPER ARC」を選び、A/D・左右キーで実走行します。
4. 画面右の「B5 · 手動試走レポート」で任意評価を入れ、
   「試走レポートをJSON保存」を押します。
5. 保存した P101_B5_MANUAL_QA_*.json をチャットへ添付すれば、
   FPSや落下区間・障害物視認性に基づき次の改築へ進めます。

これは独立した実物理B48 240Hz検証版です。
開始速度52m/s、最高206.28m/sでの全7区間完走は自動操舵のみ確認。
人間の操作性・Windows/iPhone実機FPS・ゲーム品質は未認定です。
12基の元の移動障害物は有効で、接触判定を無効化しません。
ローカル127.0.0.1上でのみ配信。試走レポートは自動送信されません。
元のP100と公開ゲーム2サイトには変更を加えません。
サーバー停止: 開いたコマンドウィンドウを閉じます。
`;
fs.writeFileSync(path.join(out,'START_HERE_JA.txt'),readme,'utf8');
const fileCount=fs.readdirSync(out,{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).length;
console.log('P101_B5_LOCAL_QA_PACKAGE '+JSON.stringify({
 physicalRoads:doc.surfaces.length,movingMachines:doc.movingObstacles.length,
 nominalMeters:doc.stageForge.nominalLengthMeters,launchMps:52,files:fileCount,
 localOnly:true,publish:false
}));
