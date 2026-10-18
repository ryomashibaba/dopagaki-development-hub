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
 const port=server.address().port,url='http://127.0.0.1:'+port+'/drive3d/';
 console.log('P101 B5 / LOCAL ONLY  '+url);
 console.log('画面のステージ選択から ◆ P101 B5 HYPER ARC を選択してください。');
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
