/**
 * R19 A6 P3 — actual original source WebGL2 viewForPose and B51 OBB camera audit.
 * Do NOT confuse projected hazard geometry with actually visible B51 pixels.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const ticks=[265,721,1057,1249,1921,2761];
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const truth=JSON.parse(fs.readFileSync('r19-evidence/R19_A1_NATIVE12S_SOURCE.json','utf8'));
assert.equal(truth.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const out=path.resolve('r19-evidence/r19a6p3');fs.mkdirSync(out,{recursive:true});
const proof={schema:'dopagaki.r19a6p3-original-camera-six-ticks-two-widths/1',
 sourceBlob:truth.sourceBlob,original240Hz:true,originalB48:7,originalB51:28,
 realSourceWebGL2:true,sourceCamera:'viewForPose',originalGLSLFocal:1.35,
 genuineB51OBBProjectionNotVisiblePixelMask:true,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',MERGE:'HOLD',
 frames:[],failures:[]};
await new Promise((ok,bad)=>server.once('error',bad).listen(0,'127.0.0.1',ok));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle',
  '--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const ref=truth.studies.find(s=>s.mode===mode);assert.ok(ref);
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,400));});
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
    '/r19a6p3/?r19a1=on&r19a6p3=on&r19a3=off&r19a2Layer=road-hazards-only&g5b=on&stage='+stage,{
      waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(stage=>document.querySelector('#stage')?.value===stage&&
    document.querySelector('#view')?.dataset?.w9c1Isolated==='true',stage,{timeout:90000});
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   for(let i=0;i<ticks.length;i++){
    const tick=ticks[i],native=ref.physical.samples.find(x=>x.nativeTick===tick);
    assert.ok(native,'source truth native tick absent '+tick);
    await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
    if(i===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view')?.dataset;
     return Number(d?.r19a1PauseTick)===t||['failed','finished'].includes(d?.r19a1Status);
    },tick,{timeout:120000,polling:40});
    const imageName='P3_'+mode+'_'+tick+'_ORIGINAL_NO_CITY_CAMERA_B51_WEBGL2.png';
    const img=await page.locator('#view').screenshot({path:path.join(out,imageName),timeout:45000});
    const result=await page.evaluate(()=>{
     const c=document.querySelector('#view'),d=c.dataset;
     return {camera:JSON.parse(d.r19a6p3ActualCamera),
      tick:Number(d.r19a1NativeTicks),frozen:Number(d.r19a1PauseTick),
      physicalXYZ:d.r19a1XYZ.split(',').map(Number),
      speed:Number(d.r19a1Speed),surface:d.r19a1Road,status:d.r19a1Status,
      B51:Number(d.r19a1B51),sourceB48:Number(d.r19a3RealRoads),
      gl2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
      cameraMode:d.cameraMode};
    });
    assert.equal(result.tick,tick);assert.equal(result.frozen,tick);
    assert.equal(result.camera.nativeTick,tick);
    assert.equal(result.gl2,true);
    assert.equal(result.status,'running');assert.equal(result.B51,28);
    assert.equal(result.sourceB48,7);
    assert.equal(result.cameraMode,'ball-lock-unfiltered-heading');
    assert.equal(result.camera.hazards.length,28);
    assert.equal(result.camera.sourceB48,7);assert.equal(result.camera.sourceB51,28);
    assert.equal(result.surface,native.road);
    const dxyz=Math.hypot(...native.xyz.map((v,k)=>v-result.physicalXYZ[k]));
    const dv=Math.abs(native.speedMps-result.speed);
    assert.ok(dxyz<.08&&dv<.05,'actual original source simulated native state changed');
    const hz=result.camera.hazards;
    const near=hz.filter(x=>x.fullOBBBoundsIntersectScreen).length;
    proof.frames.push({mode,tick,seconds:native.t,road:result.surface,
     physicalXYZDeltaM:dxyz,physicalSpeedDeltaMps:dv,
     image:imageName,pngSHA256:sha(img),pngBytes:img.length,
     actualProjection:result.camera,projectedFullyOBBInFrame:near,
     pixelOcclusion:'NOT_MEASURED',trueB51VisualReadability:'HOLD'});
    console.log('P3_REAL_ORIGINAL_CAMERA',JSON.stringify({mode,tick,
     eye:result.camera.eye,front:result.camera.front,
     projectedB51OBBCandidates:near,originalSourceDelta:dxyz}));
   }
   assert.deepEqual(errors,[]);
  }catch(e){proof.failures.push({mode,error:String(e.stack||e).slice(0,1800),errors});}
  finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
 fs.writeFileSync(path.join(out,'P3_ACTUAL_RAW_CAMERA_B51_12_FRAMES.json'),JSON.stringify(proof,null,2)+'\n');
}
assert.deepEqual(proof.failures,[]);
assert.equal(proof.frames.length,12);
assert.deepEqual(new Set(proof.frames.map(x=>x.tick)),new Set(ticks));
console.log('P3_SOURCE_CAMERA_B51_12_COMPLETE',JSON.stringify({
 views:12,sourceRoads:7,B51:28,ART:'HOLD',pixelOcclusion:'NOT_MEASURED'}));
