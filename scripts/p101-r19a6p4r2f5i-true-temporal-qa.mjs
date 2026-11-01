/** R2F5-I 7 original 240Hz ticks x original/F/G2/I x ultra/control, 56 true frames. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const ticks=[1681,1801,1861,1921,1981,2041,2161];
const dir=path.resolve('r19-evidence/r19a6p4r2f5i');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'R2F5I_PINNED_ASSETS.json')));
assert.equal(manifest.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const proof={schema:'dopagaki.r2f5i-original-native-temporal-7tick-4scenes/1',
 sourceBlob:manifest.sourceBlob,sourceRun:41299372268,
 nativeHz:240,ticks,sourceRoads:7,sourceB51:28,actualWebGL2:true,
 sourceCamera:'ball-lock-unfiltered-heading',sourcePhysicsUnmodified:true,
 ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',GAMEPLAY:'HOLD',
 RELEASE:'HOLD',MERGE:'HOLD',sessions:[],errors:[]};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle',
 '--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader',
 '--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control'])for(const variant of ['original','f','g2','i']){
  const scene=variant==='original'?'r19a6':variant==='i'?'r19a6p4r2f5i':'r19a6p4r2f5h'+variant;
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const status=variant==='original'?'PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT':
    variant==='i'?'R2F5I_VERIFIED_NATIVE_STREET_ART_HOLD':'R2F5H_'+variant.toUpperCase()+'_VERIFIED_GLTF_HOLD';
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage();const errors=[],samples=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,300));});
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+'/'+scene+'/?r19a1=on&r19a2Layer=road-hazards-only&r19a3=off&'+scene+'=on&g5b=on&stage='+stage,
    {waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(([stage,status])=>
    document.querySelector('#stage')?.value===stage&&document.querySelector('#view')?.dataset?.r19a6Status===status,
    [stage,status],{timeout:90000});
   const info=await page.evaluate(()=>{
    const c=document.querySelector('#view'),d=c.dataset;
    return {webgl2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
    B51:Number(d.machineCount),B48:Number(d.r19a3RealRoads),width:Number(d.w9c1Width),
    loaded:d.r19a6Loaded,meshCount:Number(d.r19a6MeshCount),
    triangles:Number(d.r19a6Triangles),colliders:Number(d.r19a3ColliderCount)};
   });
   assert.equal(info.webgl2,true);assert.equal(info.B51,28);assert.equal(info.B48,7);
   assert.equal(info.width,mode==='ultra'?14:28);assert.equal(info.loaded,'true');
   assert.equal(info.meshCount,5);assert.equal(info.colliders,0);
   assert.equal(info.triangles,variant==='original'?10566:variant==='f'?44172:variant==='g2'?44568:manifest.I.triangles, 'independent original/F/G2 GLB triangle count changed');
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   for(let i=0;i<ticks.length;i++){
    const tick=ticks[i];
    await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
    if(i===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view')?.dataset;
     return Number(d?.r19a1PauseTick)===t||['failed','finished'].includes(d?.r19a1Status);
    },tick,{timeout:120000,polling:40});
    const state=await page.evaluate(()=>{
     const d=document.querySelector('#view').dataset;
     return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
      xyz:d.r19a1XYZ.split(',').map(Number),speed:Number(d.r19a1Speed),
      road:d.r19a1Road,B51:Number(d.r19a1B51),camera:d.cameraMode,status:d.r19a1Status};
    });
    assert.equal(state.tick,tick);assert.equal(state.paused,tick);
    assert.equal(state.B51,28);assert.equal(state.status,'running');
    assert.equal(state.camera,'ball-lock-unfiltered-heading');
    assert.ok(state.xyz.every(Number.isFinite)&&state.speed>10);
    const file='R2F5I_'+variant+'_'+mode+'_'+tick+'_TRUE_SOURCE_WEBGL2.png';
    const png=await page.locator('#view').screenshot({path:path.join(dir,file),timeout:45000});
    assert.ok(png.length>15000);
    samples.push({tick,seconds:tick/240,state,file,sha256:sha(png),bytes:png.length});
    console.log('R2F5I_REAL_FRAME',JSON.stringify({mode,variant,tick,bytes:png.length}));
   }
   assert.deepEqual(errors,[],'WebGL2 browser console');
   proof.sessions.push({mode,variant,info,samples});
  }catch(e){proof.errors.push({mode,variant,error:String(e.stack||e).slice(0,1800),browserErrors:errors});}
  finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(dir,'R2F5I_REAL_TEMPORAL_56FRAMES.json'),JSON.stringify(proof,null,2)+'\n');
}
assert.deepEqual(proof.errors,[],'real 240Hz temporal frame rendering failed');
assert.equal(proof.sessions.length,8);
for(const mode of ['ultra','control']){
 const ref=proof.sessions.find(s=>s.mode===mode&&s.variant==='original');
 assert.ok(ref&&ref.samples.length===7);
 for(const variant of ['f','g2','i']){
  const trial=proof.sessions.find(s=>s.mode===mode&&s.variant===variant);
  assert.ok(trial&&trial.samples.length===7);
  for(let i=0;i<7;i++){
   const a=ref.samples[i],b=trial.samples[i];
   assert.equal(a.tick,ticks[i]);assert.equal(b.tick,ticks[i]);
   assert.equal(a.state.road,b.state.road);
   assert.ok(Math.hypot(...a.state.xyz.map((v,j)=>v-b.state.xyz[j]))<.00015);
   assert.ok(Math.abs(a.state.speed-b.state.speed)<.00015);
  }
 }
}
console.log('R2F5I_56_REAL_NATIVE_FRAMES_PASS',JSON.stringify({frames:56,ticks,ART:'HOLD'}));
