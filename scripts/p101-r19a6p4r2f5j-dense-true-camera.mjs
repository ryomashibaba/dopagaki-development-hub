/** R2F5-J: only genuine original 240Hz source camera; no new architecture. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';

const ticks=Array.from({length:13},(_,k)=>1801+30*k);
assert.deepEqual(ticks,[1801,1831,1861,1891,1921,1951,1981,2011,2041,2071,2101,2131,2161]);
const dir=path.resolve('r19-evidence/r19a6p4r2f5j');
fs.mkdirSync(dir,{recursive:true});
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const I=JSON.parse(fs.readFileSync('r19-evidence/r19a6p4r2f5i/R2F5I_PINNED_ASSETS.json'));
const H=JSON.parse(fs.readFileSync('r19-evidence/r19a6p4r2f5h/R2F5H_PINNED_ASSETS.json'));
const originalBlob='af076d67492a677d2235e4730aef8cdf4808e106';
assert.equal(I.sourceBlob,originalBlob);
assert.equal(H.originalGitBlob,originalBlob);
assert.equal(H.variants.g2.modes.ultra.triangles,44568);
assert.equal(I.I.triangles,47472);
assert.equal(I.collidersAdded,0);
const report={
 schema:'dopagaki.r2f5j-true-camera-dense-13tick-g2-vs-i/1',
 sourceBlob:originalBlob,sourceHz:240,sourceRoads:7,originalB51:28,
 ticks,sourceGLBs:{g2:H.variants.g2.modes,i:I.I},
 actualWebGL2:true,sourceCamera:'ball-lock-unfiltered-heading',
 independentOriginalPhysics:true,addedColliders:0,
 art:'NOT_APPROVED',human:'HOLD',performance:'HOLD',gameplay:'HOLD',
 release:'HOLD',merge:'HOLD',sessions:[],errors:[]
};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage'
 ]});
 for(const mode of ['ultra','control']){
  for(const variant of ['original','g2','i']){
   const scene=variant==='original'?'r19a6':variant==='g2'?'r19a6p4r2f5hg2':'r19a6p4r2f5i';
   const status=variant==='original'?'PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT':
    variant==='g2'?'R2F5H_G2_VERIFIED_GLTF_HOLD':'R2F5I_VERIFIED_NATIVE_STREET_ART_HOLD';
   const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
   const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
   const page=await ctx.newPage(),errors=[],samples=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,500));});
   try{
    const query=new URLSearchParams({r19a1:'on',r19a2Layer:'road-hazards-only',
     r19a3:'off',g5b:'on',stage,[scene]:'on'});
    await page.goto('http://127.0.0.1:'+server.address().port+'/'+scene+'/?'+query,
     {waitUntil:'domcontentloaded',timeout:70000});
    await page.waitForFunction(([s,v])=>
     document.querySelector('#stage')?.value===s&&
     document.querySelector('#view')?.dataset?.r19a6Status===v,
     [stage,status],{timeout:90000});
    const initial=await page.evaluate(()=>{
     const c=document.querySelector('#view'),d=c.dataset;
     return {webgl2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
      B48:Number(d.r19a3RealRoads),B51:Number(d.machineCount),
      width:Number(d.w9c1Width),loaded:d.r19a6Loaded,
      meshCount:Number(d.r19a6MeshCount),triangles:Number(d.r19a6Triangles),
      colliders:Number(d.r19a3ColliderCount)};
    });
    assert.equal(initial.webgl2,true);
    assert.equal(initial.B48,7);assert.equal(initial.B51,28);
    assert.equal(initial.width,mode==='ultra'?14:28);
    assert.equal(initial.loaded,'true');assert.equal(initial.meshCount,5);
    assert.equal(initial.colliders,0);
    assert.equal(initial.triangles,variant==='original'?10566:variant==='g2'?44568:47472);
    await page.locator('#cameraCompare').click();
    await page.waitForFunction(()=>
     document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
    await page.locator('#p101Profile').selectOption('OVERDRIVE');
    await page.locator('#demoSpeed').selectOption('2');
    for(let k=0;k<ticks.length;k++){
     const tick=ticks[k];
     await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
     if(k===0)await page.locator('#demoRun').click();
     else await page.locator('#pause').click();
     await page.waitForFunction(t=>{
      const d=document.querySelector('#view')?.dataset;
      return Number(d?.r19a1PauseTick)===t||['failed','finished'].includes(d?.r19a1Status);
     },tick,{timeout:120000,polling:40});
     const state=await page.evaluate(()=>{
      const d=document.querySelector('#view').dataset;
      return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
       xyz:d.r19a1XYZ.split(',').map(Number),speed:Number(d.r19a1Speed),
       road:d.r19a1Road,B51:Number(d.r19a1B51),camera:d.cameraMode,
       status:d.r19a1Status};
     });
     assert.equal(state.tick,tick);assert.equal(state.paused,tick);
     assert.equal(state.status,'running');assert.equal(state.B51,28);
     assert.equal(state.camera,'ball-lock-unfiltered-heading');
     assert.ok(state.xyz.every(Number.isFinite)&&state.speed>10);
     const file='R2F5J_'+variant+'_'+mode+'_'+tick+'_TRUE_SOURCE_WEBGL2.png';
     const image=await page.locator('#view').screenshot({path:path.join(dir,file),timeout:45000});
     assert.ok(image.length>15000);
     samples.push({tick,seconds:tick/240,state,file,sha256:sha(image),bytes:image.length});
     console.log('R2F5J_SOURCE_FRAME',JSON.stringify({mode,variant,tick,bytes:image.length}));
    }
    assert.deepEqual(errors,[],'true WebGL2 browser error');
    report.sessions.push({mode,variant,initial,samples});
   }catch(err){
    report.errors.push({mode,variant,error:String(err.stack||err).slice(0,2300),errors});
   }finally{await ctx.close();}
  }
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(dir,'R2F5J_REAL_DENSE_78_FRAMES.json'),
  JSON.stringify(report,null,2)+'\n');
}
assert.deepEqual(report.errors,[],'J true WebGL2 screenshots failed');
assert.equal(report.sessions.length,6);
for(const mode of ['ultra','control']){
 const original=report.sessions.find(s=>s.mode===mode&&s.variant==='original');
 assert.ok(original&&original.samples.length===13);
 for(const variant of ['g2','i']){
  const s=report.sessions.find(s=>s.mode===mode&&s.variant===variant);
  assert.ok(s&&s.samples.length===13);
  for(let k=0;k<13;k++){
   const a=original.samples[k],b=s.samples[k];
   assert.equal(a.tick,ticks[k]);assert.equal(b.tick,ticks[k]);
   assert.equal(a.state.road,b.state.road);
   assert.ok(Math.hypot(...a.state.xyz.map((v,i)=>v-b.state.xyz[i]))<.00015);
   assert.ok(Math.abs(a.state.speed-b.state.speed)<.00015);
  }
 }
}
console.log('R2F5J_TRUE_TEMPORAL_78_SOURCE_FRAMES_PASS',
 JSON.stringify({frames:78,ticks,physics:'MATCH',ART:'NOT_APPROVED'}));
