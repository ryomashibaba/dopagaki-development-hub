/** R19 A6 P1: REAL 240Hz native/source WebGL2 camera before/after Blender 3D.
 * Six original source 0..12s camera ticks, both 14m and 28m physical roads.
 * A pixel difference is NOT an ART pass or proof of readable hazards.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const ticks=[265,721,1057,1249,1921,2761];
const native=JSON.parse(fs.readFileSync('r19-evidence/R19_A1_NATIVE12S_SOURCE.json','utf8'));
assert.equal(native.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const dir=path.resolve('r19-evidence/r19a6p1');
fs.mkdirSync(dir,{recursive:true});
const report={schema:'dopagaki.r19a6p1-actual-original-6camera-Blender-art-comparison/1',
 sourceBlob:native.sourceBlob,nativeHz:240,actualWebGL2:true,sourceRoads:7,sourceB51:28,
 BlenderEditedGLB:true,sourceTimeTicks:ticks,
 ART:'HOLD',HUMAN:'HOLD',GAMEPLAY:'HOLD',PERFORMANCE:'HOLD',RELEASE:'HOLD',
 comparisons:[],errors:[]};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const id='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const ref=native.studies.find(s=>s.mode===mode);assert.ok(ref);
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,350));});
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
    '/r19a6p1/?r19a1=on&r19a2Layer=road-hazards-only&r19a3=off&r19a6p1=on&g5b=on&stage='+id,{
    waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(id=>{
    const canvas=document.querySelector('#view');
    return document.querySelector('#stage')?.value===id&&
     canvas?.dataset?.r19a6Status==='P1_BLENDER_EDITED_GLB_ART_HOLD';
   },id,{timeout:90000});
   const before=await page.evaluate(()=>{
    const el=document.querySelector('#view'),d=el.dataset;
    return {isWebGL2:el.getContext('webgl2') instanceof WebGL2RenderingContext,
     B51:Number(d.machineCount),B48:Number(d.r19a3RealRoads),
     width:Number(d.w9c1Width),loaded:d.r19a6Loaded,
     meshCount:Number(d.r19a6MeshCount),triangles:Number(d.r19a6Triangles),
     colliders:Number(d.r19a3ColliderCount)};
   });
   assert.equal(before.isWebGL2,true);
   assert.equal(before.B51,28);assert.equal(before.B48,7);
   assert.equal(before.width,mode==='ultra'?14:28);
   assert.equal(before.loaded,'true');assert.equal(before.meshCount,5);
   assert.ok(before.triangles>10566&&before.triangles<50000);
   assert.equal(before.colliders,0);
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   for(let i=0;i<ticks.length;i++){
    const tick=ticks[i],physical=ref.physical.samples.find(p=>p.nativeTick===tick);
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
      road:d.r19a1Road,camera:d.cameraMode,status:d.r19a1Status,
      B51:Number(d.r19a1B51)};
    });
    assert.equal(state.tick,tick);assert.equal(state.pause,tick);
    assert.equal(state.status,'running');assert.equal(state.B51,28);
    assert.equal(state.road,physical.road);
    assert.equal(state.camera,'ball-lock-unfiltered-heading');
    const xyzDelta=Math.hypot(...physical.xyz.map((v,k)=>v-state.xyz[k]));
    const speedDelta=Math.abs(physical.speedMps-state.speed);
    assert.ok(xyzDelta<.08&&speedDelta<.05);
    const file='R19_A6P1_'+mode+'_BLENDER_'+tick+'_TRUE_SOURCE_WEBGL2.png';
    const edited=await page.locator('#view').screenshot({path:path.join(dir,file),timeout:45000});
    const baseline=fs.readFileSync(path.join('r19-evidence/r19a3',
     'R19A2_'+mode+'_on_'+tick+'tick_TRUE_WEBGL2.png'));
    report.comparisons.push({mode,tick,sourceXYZDeltaM:xyzDelta,
     sourceSpeedDeltaMps:speedDelta,editedFile:file,editedBytes:edited.length,
     editedSHA256:sha(edited),oldA5SHA256:sha(baseline),
     changedPixelsUNMEASURED:true,notEquivalentImage:sha(edited)!==sha(baseline)});
   }
   assert.deepEqual(errors,[]);
  }catch(e){
   report.errors.push({mode,error:String(e.stack||e).slice(0,1800),browserErrors:errors});
  }finally{await context.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(dir,'R19A6P1_REAL_12_NATIVE_WEBGL2_REPORT.json'),
  JSON.stringify(report,null,2)+'\n');
}
assert.deepEqual(report.errors,[],'source-authentic Blender art render failed');
assert.equal(report.comparisons.length,12);
for(const mode of ['ultra','control']){
 assert.ok(report.comparisons.some(c=>c.mode===mode&&c.notEquivalentImage),
  'edited geometry still has no demonstrated actual camera impact: '+mode);
}
assert.ok(report.comparisons.some(c=>c.tick>=1921&&c.notEquivalentImage),
 'road1 city remains entirely invisible; do NOT certify visual progress');
console.log('R19A6P1_REAL_BLENDER_GLB_ORIGINAL_NATIVE_IMAGES',JSON.stringify({
 total:12,changed:report.comparisons.filter(x=>x.notEquivalentImage).length,
 road1VisibleDifference:report.comparisons.filter(x=>x.tick>=1921&&x.notEquivalentImage).length,
 ART:'HOLD',HUMAN:'HOLD',sourceB48:7,sourceB51:28}));
