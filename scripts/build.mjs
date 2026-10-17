import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {generateEchoRush} from './p66-echo-rebuild.mjs';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const mode=process.argv[2];
if(!['private','public-safe','public'].includes(mode))throw Error('Usage: node scripts/build.mjs private|public-safe|public');
const includeStages=mode!=='public-safe';
const dest=path.join(root,mode==='private'?'dist-private':mode==='public'?'dist-site':'dist');
fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});
const write=(rel,data)=>{const p=path.join(dest,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,data);};
const copy=(from,to)=>{const p=path.join(root,from);if(!fs.existsSync(p))throw Error('Missing build input: '+from);write(to,fs.readFileSync(p));};
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const sources=JSON.parse(fs.readFileSync(path.join(root,'private/P63_INPUT_MANIFEST.json'),'utf8'));
const names=Object.keys(sources.input_sha256);
if(names.length!==4)throw Error('Expected exactly 4 P62 stages');
for(const file of names){const b=fs.readFileSync(path.join(root,'private/stages',file));if(sha(b)!==sources.input_sha256[file])throw Error('Frozen P62 SHA mismatch: '+file)}
// Build-info contains no developer machine paths or private source data.
const build={schema:'dopagaki.devhub.build/1',version:'P85',mode,buildAt:new Date().toISOString(),gitCommit:process.env.GITHUB_SHA||'LOCAL',stageCount:includeStages?4:0,experimentalStageCount:includeStages?1:0,movingObstacleCount:includeStages?24:0,publicAccessibleByDefault:true,notes:mode==='private'?'PRIVATE: only deploy behind access control':mode==='public'?'PUBLIC: publication of stage data approved by owner; not a playable 3D game':'PUBLIC-SAFE: stage assets deliberately excluded'};
if(includeStages){
 copy('web/inspector.html','web/index.html');
 copy('web/drive3d.html','drive3d/index.html');
 copy('web/drive3d.mjs','drive3d/drive3d.mjs');
 copy('web/drive3d-camera.mjs','drive3d/drive3d-camera.mjs');
 copy('web/drive3d-loop.mjs','drive3d/drive3d-loop.mjs');
 copy('web/p66-visual.mjs','drive3d/p66-visual.mjs');
 copy('web/p73-machine-visual.mjs','drive3d/p73-machine-visual.mjs');
 copy('web/p74-nearmiss.mjs','drive3d/p74-nearmiss.mjs');
 copy('web/p75-survival.mjs','drive3d/p75-survival.mjs');
 copy('web/p78-demo.mjs','drive3d/p78-demo.mjs');
 copy('web/p79-practice.mjs','drive3d/p79-practice.mjs');
 copy('web/p80-trackflow.mjs','drive3d/p80-trackflow.mjs');
 copy('web/p81-edge-radar.mjs','drive3d/p81-edge-radar.mjs');
 copy('web/p82-megastructure.mjs','drive3d/p82-megastructure.mjs');
 copy('web/p83-render-quality.mjs','drive3d/p83-render-quality.mjs');
 copy('web/p84-visibility.mjs','drive3d/p84-visibility.mjs');
 copy('web/p85-energyball.mjs','drive3d/p85-energyball.mjs');
 write('generated/P66_ECHO_RUSH.json',JSON.stringify(generateEchoRush(),null,2)+'\n');
 for(const file of names)copy('private/stages/'+file,'generated/'+file);
 copy('private/reports/P62_FULL_RUN_MATRIX.json','reports/P62_FULL_RUN_MATRIX.json');
 const modules=['moving/moving-obstacles.mjs','moving/native-physics-bridge.mjs','surface.js','physics.js','collision.js','math.js','game-fixtures.js'];
 for(const m of modules)copy('private/reference_only/director/'+m,'reference_only/director/'+m);
 copy('private/reference_only/package.json','reference_only/package.json');
 const html=fs.readFileSync(path.join(dest,'web/index.html'),'utf8');
 for(const n of names)if(!html.includes(n))throw Error('P62 inspector references wrong/missing JSON: '+n);
 if(html.includes('_P62_GRAZING_CONTACT_BALANCE.json'))throw Error('P62 legacy 404 reference reintroduced');
}
const info=JSON.stringify(build,null,2)+'\n';write('build-info.json',info);
const hub=(includeStages?
 `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DOPAGAKI DEV HUB P63</title><style>:root{font:16px system-ui;color:#e8f3ff;background:#071422}body{margin:0;padding:24px;background:radial-gradient(ellipse at top,#1a3549,#071422 68%);min-height:100vh}.frame{max-width:980px;margin:auto}.tag{font-size:12px;color:#7fffd5;letter-spacing:.1em}.panel{background:#0e2232;border:1px solid #36566c;border-radius:16px;padding:24px;margin-top:16px}h1{margin:8px 0;font-size:30px}p{line-height:1.6;color:#aec6d8}.flex{display:flex;gap:15px;flex-wrap:wrap}.card{flex:1 1 200px;background:#142b40;border:1px solid #32516b;border-radius:10px;padding:18px}.card b{display:block;margin-bottom:12px}a{color:#82d7ff}a.launch{display:inline-block;color:#041726;background:#88dbff;border-radius:8px;padding:11px 18px;font-weight:800;text-decoration:none}.warning{color:#ffdd9e}</style></head><body><main class="frame"><div class="tag">${mode==='public'?'P85 / PUBLIC QA-GATED PREVIEW':'P63 / PRIVATE DEV ENVIRONMENT'}</div><h1>DOPAGAKI DEVELOPMENT HUB</h1><p>実ステージ4作品・移動障害物24基のプレビューと実装履歴を管理する開発用ページ。公開ゲームではありません。</p><div class="panel"><div class="tag">STAGE PREVIEW</div><h2>P62 Kinetic Megastructures</h2><div class="flex"><div class="card"><b>ECHO PIPE</b>巨大共鳴管</div><div class="card"><b>HOLLOW SPHERES</b>空洞天球</div><div class="card"><b>MONSOON WAVE</b>波動シェル</div><div class="card"><b>HANGING GARDENS</b>空中庭園</div></div><p><a class="launch" href="./web/">4作品の動体プレビューを開く →</a></p><p><a class="launch" href="./drive3d/">P85 / エネルギーボール・スピードトレイル →</a></p><p class="warning">${mode==='public'?'公開許可済みのステージ資料を表示しています。2D俯瞰とP85の高品質エネルギーボール・高速光跡・低FPS対応3D試走を公開中。正式ゲームの完成版ではありません。':'アクセス制限された開発環境専用です。人間の試走・正式ゲームの描画・FPSを示すものではありません。'}</p></div><div class="panel"><h2>Build / 検証</h2><p>ビルド情報：<a href="./build-info.json">build-info.json</a></p><p>Moving Lab B51-C正本の物理モジュールは読み取り専用参照として保持。新しい移動体実装はここには追加しません。</p></div></main></body></html>`:
 `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>DOPAGAKI DEV HUB — Setup</title><style>body{font:16px system-ui;line-height:1.7;background:#081625;color:#ebf6ff;margin:7vw auto;max-width:740px;padding:20px}section{border:1px solid #42667d;background:#10283b;padding:24px;border-radius:14px}a{color:#83ddff}</style></head><body><section><small>PUBLIC-SAFE / NO PRIVATE DATA</small><h1>DOPAGAKI DEVELOPMENT HUB</h1><p>開発環境の準備中です。この版には未公開ステージJSONやプライベートな検証データを含めていません。</p><p>アクセス制御とデプロイ承認が完了してから実ステージのプレビューを公開します。</p><p><a href="./build-info.json">ビルド情報</a></p></section></body></html>`);
write('index.html',hub);
if(mode==='public')write('.nojekyll','');
write('_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Frame-Options: DENY\n  Cache-Control: no-store\n');
write('robots.txt','User-agent: *\nDisallow: /\n');
const files=[];function enumerate(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const rel=path.posix.join(prefix,entry.name);if(entry.isDirectory())enumerate(path.join(dir,entry.name),rel);else files.push({path:rel,bytes:fs.statSync(path.join(dir,entry.name)).size,sha256:sha(fs.readFileSync(path.join(dir,entry.name)))});}}enumerate(dest);
const forbidden=mode==='public-safe'?files.filter(x=>/generated\/|reference_only\/|reports\/|web\//.test(x.path)):[];
if(forbidden.length)throw Error('PUBLIC LEAK: '+forbidden.map(x=>x.path));
write('asset-checksums.json',JSON.stringify(files,null,2)+'\n');
console.log(`BUILD PASS ${mode}: ${files.length+1} files; ${names.length} private input JSON SHA verified; dist=${dest}`);
