import {spawn} from 'node:child_process';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=43731;
const buildDirectory=process.env.DOPAGAKI_BUILD_DIR||'dist-private';
if(!['dist-private','dist-site'].includes(buildDirectory))throw Error('Unsupported build directory: '+buildDirectory);
const child=spawn(process.execPath,['scripts/serve.mjs',buildDirectory,String(port)],{cwd:root,stdio:'pipe'});
const host=`http://127.0.0.1:${port}`;
async function untilReady(){for(let i=0;i<50;i++){try{const r=await fetch(host+'/');if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('Local HTTP server did not start: '+(await new Promise(resolve=>{let s='';child.stderr.on('data',b=>s+=b.toString());setTimeout(()=>resolve(s),100)})));}
try{
 await untilReady();
 const files=fs.readdirSync(path.join(root,'private/stages'));
 const urls=['/','/web/','/drive3d/','/drive3d/drive3d.mjs','/drive3d/drive3d-camera.mjs','/drive3d/drive3d-loop.mjs','/drive3d/p66-visual.mjs','/drive3d/p73-machine-visual.mjs','/drive3d/p74-nearmiss.mjs','/drive3d/p75-survival.mjs','/drive3d/p78-demo.mjs','/drive3d/p79-practice.mjs','/drive3d/p80-trackflow.mjs','/drive3d/p81-edge-radar.mjs','/drive3d/p82-megastructure.mjs','/drive3d/p83-render-quality.mjs','/drive3d/p84-visibility.mjs','/drive3d/p85-energyball.mjs','/drive3d/p86-chapter-splits.mjs','/drive3d/p87-ghost.mjs','/drive3d/p88-ghost-pace.mjs','/generated/P66_ECHO_RUSH.json','/generated/P87_REFERENCE_GHOST.json','/build-info.json','/reports/P62_FULL_RUN_MATRIX.json','/reference_only/director/moving/moving-obstacles.mjs','/reference_only/director/surface.js',...files.map(x=>'/generated/'+x)];
 for(const pathname of urls){const r=await fetch(host+pathname);assert.equal(r.status,200,`HTTP ${r.status} ${pathname}`);const type=r.headers.get('content-type')||'';assert(!type.includes('text/html')||pathname==='/'||pathname==='/web/'||pathname==='/drive3d/','JSON/JS must not be HTML');if(pathname.endsWith('.json'))JSON.parse(await r.text());else await r.arrayBuffer();}
 const missing=await fetch(host+'/generated/EP-001_P62_GRAZING_CONTACT_BALANCE.json');assert.equal(missing.status,404,'Old erroneous filename should not exist');
 const page=await (await fetch(host+'/web/')).text();
 for(const file of files)assert(page.includes(file),`Inspector missing ${file}`);
 const drive=await(await fetch(host+'/drive3d/')).text();assert(drive.includes('drive3d.mjs'),'Missing 3D module');
 const p66=await(await fetch(host+'/generated/P66_ECHO_RUSH.json')).json();assert.equal(p66.stageForge.id,'EP-P66');assert.equal(p66.movingObstacles.length,6);assert(p66.visualBlueprint.spiralRings.length>=5);
 const ghost=await(await fetch(host+'/generated/P87_REFERENCE_GHOST.json')).json();
 assert.equal(ghost.schema,'dopagaki.native-reference-ghost/1');
 assert(ghost.finished&&ghost.finishSeconds>82&&ghost.finishSeconds<85);
 assert(ghost.samples.length>1200&&ghost.samples.length<1450);
 assert.equal(ghost.sectors.length,8);assert(Math.abs(ghost.sectors.at(-1).time-ghost.finishSeconds)<.002);assert.equal(p66.visualBlueprint.returnHoops.length,9);assert.equal(p66.surfaces.length,23);
 const moduleText=await(await fetch(host+'/drive3d/drive3d.mjs')).text();assert(moduleText.includes('Runner,DT')&&moduleText.includes('movingObstaclePose')&&moduleText.includes('drive3d-camera.mjs')&&moduleText.includes('drive3d-loop.mjs')&&moduleText.includes('p73-machine-visual.mjs')&&moduleText.includes('p74-nearmiss.mjs')&&moduleText.includes('p75-survival.mjs')&&moduleText.includes('p78-demo.mjs')&&moduleText.includes('p79-practice.mjs')&&moduleText.includes('p80-trackflow.mjs')&&moduleText.includes('p81-edge-radar.mjs')&&moduleText.includes('p82-megastructure.mjs')&&moduleText.includes('p83-render-quality.mjs')&&moduleText.includes('p84-visibility.mjs')&&moduleText.includes('p85-energyball.mjs')&&moduleText.includes('p86-chapter-splits.mjs')&&moduleText.includes('p87-ghost.mjs')&&moduleText.includes('p88-ghost-pace.mjs'),'3D page not connected to B48 Runner or Moving Lab');
 console.log('HTTP PASS',urls.length,'valid assets; old 404 path rejected; stage imports verified');
}catch(e){console.error(e);process.exitCode=1;}finally{child.kill('SIGTERM');}
