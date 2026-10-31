/**
 * R19 A6 P0: 2 road modes x 2 REAL 240Hz camera ticks.
 * Byte-for-byte compare source A5 rendering to VERIFIED GLB readback in a
 * PRIVATE renderer. No proxy frame, no fake physics or ART certification.
 * Requires existing R19 A3 24 frame source evidence from the same CI run.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ticks=[1057,1921]; // original core at 4.404s; road1 8.004s
const dir=path.resolve('r19-evidence/r19a6');
fs.mkdirSync(dir,{recursive:true});
const native=JSON.parse(fs.readFileSync('r19-evidence/R19_A1_NATIVE12S_SOURCE.json','utf8'));
assert.equal(native.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const result={schema:'dopagaki.r19a6-original-glb-actual-webgl2-native-frame-compare/1',
 sourceBlob:native.sourceBlob,glbIsOriginalNotBlenderEdited:true,
 comparisons:[],errors:[],sourceNative240Hz:true,sourceRoads:7,sourceB51:28,
 ART:'REJECT',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',MERGE:'HOLD'};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const study=native.studies.find(x=>x.mode===mode);
  assert.ok(study);
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,350));});
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
    '/r19a6/?r19a1=on&r19a2Layer=road-hazards-only&r19a3=off&r19a6=on&g5b=on&stage='+stage,{
    waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(id=>document.querySelector('#stage')?.value===id&&
     document.querySelector('#view')?.dataset?.r19a6Loaded==='true',stage,{timeout:90000});
   const before=await page.evaluate(()=>{
    const e=document.querySelector('#view'),d=e.dataset;
    return {gl:e.getContext('webgl2') instanceof WebGL2RenderingContext,
     sourceStage:document.querySelector('#stage').value,
     originalB51:Number(d.machineCount),r19a3:d.r19a3Enabled,
     r19a6:d.r19a6Status,triangles:Number(d.r19a6Triangles),
     meshCount:Number(d.r19a6MeshCount),colliders:Number(d.r19a3ColliderCount),
     roadWidth:Number(d.w9c1Width)};
   });
   assert.equal(before.gl,true);
   assert.equal(before.sourceStage,stage);
   assert.equal(before.originalB51,28);
   assert.equal(before.r19a3,'false');
   assert.equal(before.r19a6,'PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT');
   assert.equal(before.meshCount,5);
   assert.equal(before.colliders,0);
   assert.equal(before.triangles,10566);
   assert.equal(before.roadWidth,mode==='ultra'?14:28);
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   for(let i=0;i<ticks.length;i++){
    const tick=ticks[i],physical=study.physical.samples.find(x=>x.nativeTick===tick);
    assert.ok(physical);
    await page.evaluate(n=>{window.__r19a1PauseAtTick=n;},tick);
    if(i===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(n=>{
     const e=document.querySelector('#view')?.dataset;
     return Number(e?.r19a1PauseTick)===n||['failed','finished'].includes(e?.r19a1Status);
    },tick,{timeout:120000,polling:45});
    const state=await page.evaluate(()=>{
     const d=document.querySelector('#view').dataset;
     return {tick:Number(d.r19a1NativeTicks),pause:Number(d.r19a1PauseTick),
      xyz:d.r19a1XYZ.split(',').map(Number),speed:Number(d.r19a1Speed),
      road:d.r19a1Road,camera:d.cameraMode,status:d.r19a1Status,b51:Number(d.r19a1B51)};
    });
    assert.equal(state.tick,tick);assert.equal(state.pause,tick);
    assert.equal(state.status,'running');assert.equal(state.b51,28);
    assert.equal(state.road,physical.road);
    assert.equal(state.camera,'ball-lock-unfiltered-heading');
    const delta=Math.hypot(...physical.xyz.map((v,k)=>v-state.xyz[k]));
    const speedDelta=Math.abs(physical.speedMps-state.speed);
    assert.ok(delta<.08&&speedDelta<.05,'actual A6 source native mismatch');
    const filename='R19A6_'+mode+'_GLB_'+tick+'_TRUE_WEBGL2.png';
    const raw=await page.locator('#view').screenshot({path:path.join(dir,filename),timeout:45000});
    const baseline=fs.readFileSync(path.join('r19-evidence/r19a3',
     'R19A2_'+mode+'_on_'+tick+'tick_TRUE_WEBGL2.png'));
    assert.equal(sha(raw),sha(baseline),'EXACT source GLB GPU readback diverged from original game camera');
    result.comparisons.push({mode,tick,filename,renderSHA256:sha(raw),pngBytes:raw.length,
     originalSourceMatch:true,physicalXYZDelta:delta,physicalSpeedDelta:speedDelta});
   }
   assert.deepEqual(errors,[],'browser errors');
  }catch(e){result.errors.push({mode,error:String(e.stack||e).slice(0,1800),pageErrors:errors});}
  finally{await context.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(dir,'R19A6_PINNED_GLB_NATIVE_WEBGL2_COMPARE.json'),
  JSON.stringify(result,null,2)+'\n');
}
assert.deepEqual(result.errors,[],'R19 A6 actual browser verification failed');
assert.equal(result.comparisons.length,4);
console.log('R19A6_REAL_SOURCE_GLB_WEBGL2_MATCH',JSON.stringify(result));
