/** K4AD source-native Road5 in-render depth evidence, private isolated stage.
 * No screenshot or page.evaluate depth read after compositing is accepted.
 * No ART, obstacle safety, public-court visibility or release claim.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const OUT=path.resolve('r19-evidence/r19a6p4r2f5k4ai');
fs.mkdirSync(OUT,{recursive:true});
const SRC='af076d67492a677d2235e4730aef8cdf4808e106';
const ground=JSON.parse(fs.readFileSync(
 'r19-evidence/r19a6p4r2f5k4z-source/K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json','utf8'));
const ticks=[10680,10800,10920,11040,11160,11280,11400];
const masks=['without-B51-bodies'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(ground.sourceBlob,SRC);
assert.equal(ground.Hz,240);
assert.equal(ground.sourceB48,7);
assert.equal(ground.sourceB51,28);
assert.deepEqual(ground.errors,[]);
assert.equal(ground.sessions.length,2);
let seq=0;
async function syncDepth(page,tick,mask){
 const id=++seq;
 await page.evaluate(r=>{window.__k4adRequest=r;},{seq:id,tick,mask});
 await page.waitForFunction(({id,tick,mask})=>{
  const raw=document.querySelector('#view')?.dataset.k4adCapture;
  if(!raw)return false;
  let r;try{r=JSON.parse(raw);}catch{return false;}
  return r.seq===id&&r.tick===tick&&r.mask===mask;
 },{id,tick,mask},{timeout:30000,polling:40});
 const raw=await page.locator('#view').getAttribute('data-k4ad-capture');
 const evidence=JSON.parse(raw);
 assert.equal(evidence.seq,id);
 assert.equal(evidence.tick,tick);
 assert.equal(evidence.mask,mask);
 assert.equal(evidence.provenance,
  'SAME_NATIVE_FRAME_REPLAY_ORIGINAL_GPU_MESHES_TO_RGBA8_FBO');
 assert.equal(evidence.sourceBlob,SRC);
 assert.equal(evidence.sourceB48,7);
 assert.equal(evidence.sourceB51,28);
 assert.equal(evidence.art,'NOT_TESTED_HOLD');
 assert.equal(evidence.originalGameModified,false);
 return evidence;
}
async function state(page){
 return page.evaluate(()=>{
  const d=document.querySelector('#view').dataset;
  return {
   tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
   road:d.r19a1Road,speed:Number(d.r19a1Speed),
   xyz:d.r19a1XYZ.split(',').map(Number),
   eye:d.r19a1Eye.split(',').map(Number),
   front:d.r19a1Front.split(',').map(Number),
   camera:d.cameraMode,status:d.r19a1Status,steering:d.r19a1Mode,
   sourceB51:Number(d.r19a1B51),effectiveMask:d.k4abEffectiveMask,
   audit:JSON.parse(d.k4abAudit||'{}')
  };
 });
}
function compare(a,b){
 const maxDiff=(xs,ys)=>Math.max(...xs.map((x,i)=>Math.abs(x-ys[i])));
 assert.equal(a.tick,b.tick);assert.equal(a.road,b.road);
 assert.ok(maxDiff(a.xyz,b.xyz)<0.001);
 assert.ok(maxDiff(a.eye,b.eye??b.cameraEye)<0.02);
 assert.ok(maxDiff(a.front,b.front??b.cameraFront)<0.001);
 assert.ok(Math.abs(a.speed-b.speed)<0.001);
}
async function screenshot(page,file){
 const data=await page.locator('#view').screenshot({path:path.join(OUT,file),timeout:55000});
 assert.ok(data.length>9000);
 return {file,bytes:data.length,sha256:sha(data)};
}
const result={
 schema:'dopagaki.K4AI.native-render-synchronous-webgl2-depth-provenance/1',
 researchBranch:'research/k4ai-original-240hz-camera-obb-continuity-20261103',
 originalSourceBlob:SRC,Hz:240,B48:7,B51:28,
 originalK4ZRequiredPNG:82,
 sourceContextExpectedPreserveDrawingBuffer:false,
 capture:'SAME_NATIVE_FRAME_REPLAY_ORIGINAL_GPU_MESHES_TO_RGBA8_FBO',
 originalA5Rendered:false,newModels:0,newColliders:0,
 physicsChanged:false,cameraChanged:false,originalSourceGameChanged:false,
 objectIds:'NOT_MEASURED',nativeDepth:'PENDING',
 officialARTAccepted:0,slope2DNAMetres:0,ART:'NOT_TESTED_HOLD',
 SAT:'NOT_RUN',CCD:'NOT_RUN',HUMAN:'NOT_TESTED',FPS:'HOLD',
 RELEASE:'HOLD',MERGE:'HOLD',sessions:[],errors:[]
};
await new Promise((yes,no)=>server.once('error',no).listen(0,'127.0.0.1',yes));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle',
  '--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const original=ground.sessions.find(x=>x.mode===mode);
  assert.equal(original.frames.length,41);
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage();
  const session={mode,stage,frames:[],masks:[],restored:[],errors:[],diagnosis:'HOLD'};
  page.on('pageerror',e=>session.errors.push('pageerror: '+e.message));
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
    '/r19a6p4r2f5k4ai/?r19a1=on&k4ab=on&k4ad=on&k4ah=on&k4ai=on&g5b=off&stage='+stage,
    {waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(s=>document.querySelector('#stage')?.value===s&&
    document.querySelector('#view')?.dataset.w9c1Isolated==='true',stage,{timeout:90000});
   const webgl=await page.evaluate(()=>{
    const c=document.querySelector('#view'),gl=c.getContext('webgl2');
    return {webgl2:gl instanceof WebGL2RenderingContext,
     preserveDrawingBuffer:gl.getContextAttributes()?.preserveDrawingBuffer,
     width:gl.drawingBufferWidth,height:gl.drawingBufferHeight};
   });
   assert(webgl.webgl2);assert.equal(webgl.preserveDrawingBuffer,false);
   session.trueOriginalWebGLContext=webgl;
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset.cameraMode===
    'ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   for(let index=0;index<ticks.length;index++){
    const tick=ticks[index];
    await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
    if(index===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view').dataset;
     return (Number(d.r19a1PauseTick)===t&&d.k4abEffectiveMask==='none'
       &&JSON.parse(d.k4abAudit||'{}').currentNativeTick===t)
       ||['finished','failed'].includes(d.r19a1Status);
    },tick,{timeout:180000,polling:50});
    const source=await state(page);
    const reference=original.frames.find(x=>x.tick===tick);
    assert.ok(reference,'Original K4Z frame missing');
    assert.equal(source.tick,tick);assert.equal(source.paused,tick);
    assert.equal(source.road,'p93-PRISM_CREST-01');
    assert.equal(source.status,'running');
    assert.equal(source.effectiveMask,'none');
    assert.equal(source.sourceB51,28);
    assert.equal(source.camera,'ball-lock-unfiltered-heading');
    assert.equal(source.audit.sourceBlob,SRC);
    assert.equal(source.audit.originalSceneA5R19A3OverlayRendered,false);
    compare(source,reference.state);
    // Depth reading is requested now; it happens only INSIDE next genuine render.
    // No intervening screenshot/other page.evaluate reads are used for depth.
    const sync=await syncDepth(page,tick,'none');
    assert.equal(sync.sourceRoad,source.road);
    const geometryRaw=await page.locator('#view').getAttribute('data-k4ah-geometry');
    assert.ok(geometryRaw,'Geometry was not captured inside same original source render');
    const geometry=JSON.parse(geometryRaw);
    assert.equal(geometry.requestSeq,sync.seq);
    assert.equal(geometry.nativeTick,tick);
    assert.equal(geometry.sourceRoad,source.road);
    assert.equal(geometry.sourceMask,'none');
    assert.equal(geometry.sourceB51Count,28);
    assert.equal(geometry.obstacleDescriptor.id,'p95-hazard-12');
    assert.equal(geometry.originalMovingObstaclePose.id,'p95-hazard-12');
    assert.equal(geometry.sourceBlob,SRC);
    assert.equal(geometry.originalGameModified,false);
    assert.equal(geometry.collisionChanged,false);
    assert.equal(geometry.ART,'NOT_TESTED_HOLD');
    // A source-physics tick record must agree with K4AH's real paused
    // original-camera render at each of the seven immutable GPU anchors.
    const sourceTickGeometry=await page.evaluate(t=>{
     const a=window.__k4aiNativeRecords;
     return Array.isArray(a)?a.find(x=>x.nativeTick===t):null;
    },tick);
    assert.ok(sourceTickGeometry,'Missing true native 240Hz sample at K4AH anchor');
    assert.equal(sourceTickGeometry.sourceCollisionResultNOT_MEASURED,true);
    assert.equal(sourceTickGeometry.originalGPUVisualOcclusionNOT_MEASURED,true);
    assert.equal(sourceTickGeometry.originalB51Id,'p95-hazard-12');
    assert.equal(sourceTickGeometry.originalStatus,'running');
    assert.equal(sourceTickGeometry.originalRoad,source.road);
    const delta=(a,b)=>Math.max(...a.map((x,i)=>Math.abs(x-b[i])));
    assert.ok(delta(sourceTickGeometry.originalSourceBallCenter,geometry.ballPosition)<1e-7);
    assert.ok(delta(sourceTickGeometry.originalSourceCameraEye,geometry.camera.eye)<1e-7);
    assert.ok(delta(sourceTickGeometry.originalSourceCameraFront,geometry.camera.front)<1e-7);
    assert.ok(delta(sourceTickGeometry.originalSourceOBBCenter,
      geometry.originalMovingObstaclePose.center)<1e-7);
    assert.ok(Math.abs(sourceTickGeometry.signedEyePointToOBBMeters-
      geometry.signedCameraEyePointToOBBMeters)<1e-8);
    assert.ok(Math.abs(sourceTickGeometry.signedBallSurfaceToOBBMeters-
      geometry.signedBallSurfaceToOBBMeters)<1e-8);
    for(let axis=0;axis<3;axis++){
     assert.ok(Math.abs(geometry.ballPosition[axis]-source.xyz[axis])<0.002);
     assert.ok(Math.abs(geometry.camera.eye[axis]-source.eye[axis])<0.025);
     assert.ok(Math.abs(geometry.camera.front[axis]-source.front[axis])<0.002);
    }
    assert.ok(Math.abs(geometry.poseTimeSeconds-tick/240)<1e-5);
    assert.ok(Math.abs(geometry.sourceTimeSeconds-tick/240)<1e-5);
    const after=await state(page);compare(after,source);
    // Source-authored chapter HUD overlays the screenshot even though it is
    // not part of WebGL canvas. Record its exact DOM geometry and semantics.
    const chapterHUD=await page.evaluate(()=>{
     const canvas=document.querySelector('#view');
     const hud=document.querySelector('#chapterHud');
     const a=canvas.getBoundingClientRect(),b=hud.getBoundingClientRect();
     const style=getComputedStyle(hud);
     return {id:hud.id,className:hud.className,
      text:hud.textContent.trim(),position:style.position,
      pointerEvents:style.pointerEvents,
      rect:[b.left-a.left,b.top-a.top,b.right-a.left,b.bottom-a.top]
       .map(x=>Math.round(x*1000)/1000)};
    });
    assert.equal(chapterHUD.id,'chapterHud');
    assert.equal(chapterHUD.className,'chapter');
    assert.equal(chapterHUD.position,'absolute');
    assert.equal(chapterHUD.pointerEvents,'none');
    assert.ok(chapterHUD.text.includes('PRISM SKY CREST'));
    assert.ok(chapterHUD.rect[1]>=18&&chapterHUD.rect[1]<=23);
    const originalPNG=await screenshot(page,
     'K4AI_'+mode+'_'+tick+'_ORIGINAL_WEBGL2_AFTER_IN_RENDER_READBACK.png');
    const record={tick,seconds:tick/240,source,chapterHUD,geometry,
     originalPNG,k4zTrueOriginal:{bytes:reference.bytes,sha256:reference.sha256},
     fullPNGExact:originalPNG.sha256===reference.sha256&&
       originalPNG.bytes===reference.bytes,
     synchronousRenderDepth:sync.depth,captureProof:{
       provenance:sync.provenance,seq:sync.seq,tick:sync.tick,
       mask:sync.mask,sourceRoad:sync.sourceRoad}};
    session.frames.push(record);
    // K4AF: independently sample all 7 ORIGINAL native ticks, not only 46.0s.
    // Each mask is private WebGL draw suppression on the exact paused source pose.
    {
     for(const mask of masks){
      await page.evaluate(m=>window.__k4abMask=m,mask);
      await page.waitForFunction(({mask,tick})=>{
       const d=document.querySelector('#view').dataset;
       return d.k4abEffectiveMask===mask&&
         JSON.parse(d.k4abAudit||'{}').currentNativeTick===tick;
      },{mask,tick},{timeout:20000,polling:40});
      const before=await state(page);compare(before,source);
      const evidence=await syncDepth(page,tick,mask);
      const afterMask=await state(page);compare(afterMask,source);
      session.masks.push({tick,mask,synchronousDepth:evidence.depth,
       proof:{provenance:evidence.provenance,seq:evidence.seq,
        tick:evidence.tick,mask:evidence.mask,sourceRoad:evidence.sourceRoad},
       sourceSameBallCameraAnd240HzTick:true,
       sourceDrawCensus:afterMask.audit.originalSceneLayers,
       screenshot:await screenshot(page,'K4AI_'+mode+'_'+tick+'_'+mask+'_SOURCE_MASK.png')});
     }
     await page.evaluate(()=>window.__k4abMask='none');
     await page.waitForFunction(()=>document.querySelector('#view').dataset.k4abEffectiveMask==='none');
     const recovered=await syncDepth(page,tick,'none');
     const stateRestored=await state(page);compare(stateRestored,source);
     session.restored.push({tick,depth:recovered.depth,proof:recovered.provenance,
      screenshot:await screenshot(page,'K4AI_'+mode+'_'+tick+'_RESTORED_NATIVE.png')});
    }
   }
   // All 721 consecutive native physics steps are original Runner steps.
   const continuous=await page.evaluate(()=>({
    meta:window.__k4aiMetadata,ready:window.__k4aiContinuityReady===true,
    records:window.__k4aiNativeRecords
   }));
   assert.equal(continuous.ready,true,'True 240Hz original run never reached tick11400');
   assert.equal(continuous.meta.sampleRateHz,240);
   assert.equal(continuous.meta.cameraModeRequired,'ball-lock-unfiltered-heading');
   assert.equal(continuous.meta.sourceBlob,SRC);
   assert.deepEqual(continuous.meta.measuredTicks,[10680,11400]);
   assert.equal(continuous.meta.sourceNativePhysicsChanged,false);
   assert.equal(continuous.meta.sourceCollisionChanged,false);
   assert.equal(continuous.meta.sourceCameraChanged,false);
   assert.equal(continuous.meta.sourceGPUChanged,false);
   assert.ok(Array.isArray(continuous.meta.originalSourceSurfaceIds));
   assert.equal(new Set(continuous.meta.originalSourceSurfaceIds).size,
    continuous.meta.originalSourceSurfaceIds.length);
   assert.ok(continuous.meta.originalSourceSurfaceIds.includes('p93-PRISM_CREST-01'));
   const legalRoads=new Set(continuous.meta.originalSourceSurfaceIds);
   assert.equal(continuous.records.length,721);
   for(let k=0;k<721;k++){
    const t=10680+k,g=continuous.records[k];
    assert.equal(g.nativeTick,t);
    // Native Runner.surface can be null between sparse Road5 anchors.
    // Never forge a continuous road-contact classification.
    assert.ok(g.originalRoad===null||legalRoads.has(g.originalRoad),
     'K4AI_SOURCE_ROAD_ID_NOT_IN_ORIGINAL_COURSE');
    assert.equal(g.sourceRoadUnassigned,g.originalRoad===null);
    assert.equal(typeof g.originalSourceGrounded,'boolean');
    assert.equal(g.originalStatus,'running');
    assert.equal(g.originalB51Id,'p95-hazard-12');
    assert.ok(Math.abs(g.sourceSeconds-t/240)<1e-5);
    assert.ok(Math.abs(g.originalDisplayPoseTime-t/240)<1e-5);
    assert.equal(g.sourceCollisionResultNOT_MEASURED,true);
    assert.equal(g.originalGPUVisualOcclusionNOT_MEASURED,true);
    assert.ok(Number.isFinite(g.signedEyePointToOBBMeters));
    assert.ok(Number.isFinite(g.signedBallSurfaceToOBBMeters));
   }
   session.continuousNative240Hz=continuous;
   assert.equal(session.frames.length,7);
   assert.equal(session.masks.length,7);
   assert.equal(session.restored.length,7);
   assert.deepEqual(session.errors,[]);
   const capable=session.frames.every(f=>f.synchronousRenderDepth.available)&&
     session.masks.every(m=>m.synchronousDepth.available)&&
     session.restored.every(m=>m.depth.available);
   session.diagnosis=capable?'SYNC_DEPTH_SAMPLES_OBTAINED_UNAUDITED':
    'SYNC_DEPTH_UNAVAILABLE_OR_INCOMPLETE_HOLD';
   result.sessions.push(session);
  }catch(e){
   result.errors.push({mode,message:String(e.stack||e).slice(0,4000)});
   result.sessions.push(session);
  }finally{await context.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 result.nativeDepth=result.errors.length?'EXECUTION_ERROR_HOLD':
  result.sessions.every(s=>s.diagnosis==='SYNC_DEPTH_SAMPLES_OBTAINED_UNAUDITED')?
  'SYNC_NATIVE_DEPTH_CANDIDATE_PENDING_INDEPENDENT_AUDIT':
  'SYNC_DEPTH_UNAVAILABLE_OR_INCOMPLETE_HOLD';
 fs.writeFileSync(path.join(OUT,'K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json'),
  JSON.stringify(result,null,2)+'\n','utf8');
}
assert.deepEqual(result.errors,[]);
assert.equal(result.sessions.length,2);
assert.equal(result.sessions.reduce((n,x)=>n+x.frames.length,0),14);
assert.equal(result.sessions.reduce((n,x)=>n+x.masks.length,0),14);
assert.equal(result.sessions.reduce((n,x)=>n+x.restored.length,0),14);
assert.equal(result.sessions.reduce((n,x)=>
 n+(x.continuousNative240Hz?.records.length||0),0),1442);
console.log('K4AI_WEBGL2_TRUE_SOURCE_RESULTS',JSON.stringify({
 nativeDepth:result.nativeDepth,
 capture:result.capture,
 art:'NOT_TESTED_HOLD',sourceBlob:SRC}));
