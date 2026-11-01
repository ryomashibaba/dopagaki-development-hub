/** K4: true unmodified original-camera 240Hz market A/B, 4 ticks x 2 widths.
 * Geometry is genuine native Blender/GLB, not proxy projection.
 * Pixel differences prove visibility only. No ART acceptance by automation.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const out=path.resolve('r19-evidence/r19a6p4r2f5k4');
const native=JSON.parse(fs.readFileSync(path.join(out,'K4_PINNED_NATIVE_ASSETS.json'),'utf8'));
const archived=JSON.parse(fs.readFileSync('docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json','utf8'));
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
assert.equal(native.sourceBlob,SHA);
assert.equal(archived.origin.originalGitBlob,SHA);
const ticks=[265,721,1057,1249];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const proof={schema:'dopagaki.k4-road0-market-16-true-webgl2-original-camera/1',
  sourceBlob:SHA,Hz:240,sourceB48:7,sourceB51:28,
  sourceCamera:'ball-lock-unfiltered-heading',genuineNativeBlender:true,
  originalPhysicsUnmodified:true,scriptedNotHuman:true,
  researchSceneOnly:true,addedColliders:0,ART:'HOLD',HUMAN:'HOLD',
  GAMEPLAY:'HOLD',PERFORMANCE:'HOLD',B51Readability:'NOT_REVIEWED',
  candidateSpecificSAT:'NOT_RUN',CCD:'NOT_RUN',RELEASE:'HOLD',MERGE:'HOLD',
  sampledTicks:ticks,sessions:[],errors:[]};
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle',
  '--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control'])for(const variant of ['original','k4']){
  const scene=variant==='original'?'r19a6':'r19a6p4r2f5k4';
  const status=variant==='original'?'PINNED_ORIGINAL_GLB_IMPORTED_ART_REJECT':
   'R2F5K4_NATIVE_MARKET_ART_HOLD';
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[],samples=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,350))});
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
     '/'+scene+'/?r19a1=on&r19a2Layer=road-hazards-only&r19a3=off&'+
     scene+'=on&g5b=on&stage='+stage,{waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(([stage,status])=>
    document.querySelector('#stage')?.value===stage &&
    document.querySelector('#view')?.dataset?.r19a6Status===status,
    [stage,status],{timeout:90000});
   const info=await page.evaluate(()=>{
    const c=document.querySelector('#view'),d=c.dataset;
    return {webgl2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
     roads:Number(d.r19a3RealRoads),B51:Number(d.machineCount),
     width:Number(d.w9c1Width),loaded:d.r19a6Loaded,
     meshes:Number(d.r19a6MeshCount),triangles:Number(d.r19a6Triangles),
     colliders:Number(d.r19a3ColliderCount)};
   });
   assert.equal(info.webgl2,true);assert.equal(info.roads,7);
   assert.equal(info.B51,28);assert.equal(info.loaded,'true');
   assert.equal(info.width,mode==='ultra'?14:28);
   assert.equal(info.meshes,5);assert.equal(info.colliders,0);
   assert.equal(info.triangles,variant==='original'?10566:native.modes[mode].triangles);
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
    },tick,{timeout:180000,polling:40});
    const state=await page.evaluate(()=>{
     const d=document.querySelector('#view').dataset;
     return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
      xyz:d.r19a1XYZ?.split(',').map(Number),
      speed:Number(d.r19a1Speed),road:d.r19a1Road,
      B51:Number(d.r19a1B51),camera:d.cameraMode,
      cameraEye:d.r19a1Eye?.split(',').map(Number),
      cameraFront:d.r19a1Front?.split(',').map(Number),
      status:d.r19a1Status};
    });
    assert.equal(state.tick,tick);assert.equal(state.paused,tick);
    assert.equal(state.status,'running');assert.equal(state.B51,28);
    assert.equal(state.camera,'ball-lock-unfiltered-heading');
    const historical=archived.frames.find(x=>x.mode===mode&&x.tick===tick);
    assert.ok(historical,'not an original archived camera');
    const eyeDelta=Math.hypot(...historical.eye.map((x,k)=>x-state.cameraEye[k]));
    const frontDelta=Math.hypot(...historical.front.map((x,k)=>x-state.cameraFront[k]));
    assert.ok(eyeDelta<.15&&frontDelta<.0015,'original camera drift');
    const name='K4_'+variant+'_'+mode+'_'+tick+'_REAL_ORIGINAL_WEBGL2.png';
    const png=await page.locator('#view').screenshot({path:path.join(out,name),timeout:45000});
    assert.ok(png.length>10000);
    samples.push({tick,seconds:tick/240,state,
      originalCameraErrorM:eyeDelta,originalCameraFrontError:frontDelta,
      png:name,bytes:png.length,sha256:hash(png)});
    console.log('K4_NATIVE_REAL_WEBGL2',JSON.stringify({mode,variant,tick,bytes:png.length}));
   }
   assert.deepEqual(errors,[],'WebGL2 errors');
   proof.sessions.push({mode,variant,info,samples});
  }catch(e){proof.errors.push({mode,variant,error:String(e.stack||e).slice(0,2300),
    browserErrors:errors});}
  finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
 fs.writeFileSync(path.join(out,'K4_REAL_ORIGINAL_WEBGL2_16_IMAGES.json'),
  JSON.stringify(proof,null,2)+'\n');
}
assert.deepEqual(proof.errors,[],'genuine original WebGL2 K4 gate failed');
assert.equal(proof.sessions.length,4);
for(const mode of ['ultra','control']){
 const ref=proof.sessions.find(x=>x.mode===mode&&x.variant==='original');
 const trial=proof.sessions.find(x=>x.mode===mode&&x.variant==='k4');
 assert.ok(ref&&trial&&ref.samples.length===4&&trial.samples.length===4);
 let changed=0;
 for(let i=0;i<4;i++){
  const a=ref.samples[i],b=trial.samples[i];
  assert.equal(a.tick,b.tick);assert.equal(a.state.road,b.state.road);
  assert.ok(Math.hypot(...a.state.xyz.map((v,j)=>v-b.state.xyz[j]))<.0005,
    'geometry altered native physics');
  assert.ok(Math.abs(a.state.speed-b.state.speed)<.0005);
  assert.ok(Math.hypot(...a.state.cameraEye.map((v,j)=>v-b.state.cameraEye[j]))<.001);
  assert.ok(Math.hypot(...a.state.cameraFront.map((v,j)=>v-b.state.cameraFront[j]))<.0001);
  if(a.sha256!==b.sha256)changed++;
 }
 assert.ok(changed>0,'new K4 market is not seen from either source camera: '+mode);
}
console.log('K4_REAL_16_WEBGL2_IMAGE_CAPTURE_LIMITED_PASS_ART_HOLD',JSON.stringify({
 trueFrames:16,originalSourceRoad0Camera:true,
 artApproved:false,slope2RecognizedMetres:0}));
