/** K4AM: capture only the nine original RGB ticks missing from K4AK requests.
 * Isolated true Chromium + original source runner, camera and B51. ART HOLD.
 * A native 240Hz physics tick is not a 240fps display claim.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';

const OUT=path.resolve('r19-evidence/r19a6p4r2f5k4am');
fs.mkdirSync(OUT,{recursive:true});
const SRC='af076d67492a677d2235e4730aef8cdf4808e106';
const AI_SHA='e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60';
const PENDING={ultra:[11326,11338,11349,11351,11363],control:[11265,11277,11284,11301]};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const aib=fs.readFileSync('r19-evidence/r19a6p4r2f5k4ai-pinned/K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json');
assert.equal(sha(aib),AI_SHA);
const K4AI=JSON.parse(aib);
assert.equal(K4AI.originalSourceBlob,SRC);
assert.deepEqual(K4AI.errors,[]);
assert.equal(K4AI.sessions.length,2);
assert.deepEqual(PENDING.ultra,[11326,11338,11349,11351,11363]);
assert.deepEqual(PENDING.control,[11265,11277,11284,11301]);
let seq=0;

async function syncDepth(page,tick,mask){
 const id=++seq;
 await page.evaluate(r=>{window.__k4adRequest=r;},{seq:id,tick,mask});
 await page.waitForFunction(({id,tick,mask})=>{
  const data=document.querySelector('#view')?.dataset.k4adCapture;
  if(!data)return false;
  try{const x=JSON.parse(data);return x.seq===id&&x.tick===tick&&x.mask===mask;}
  catch{return false;}
 },{id,tick,mask},{timeout:30000,polling:40});
 const raw=await page.locator('#view').getAttribute('data-k4ad-capture');
 const x=JSON.parse(raw);
 assert.equal(x.seq,id);assert.equal(x.tick,tick);assert.equal(x.mask,mask);
 assert.equal(x.sourceBlob,SRC);assert.equal(x.sourceB48,7);assert.equal(x.sourceB51,28);
 assert.equal(x.provenance,'SAME_NATIVE_FRAME_REPLAY_ORIGINAL_GPU_MESHES_TO_RGBA8_FBO');
 assert.equal(x.originalGameModified,false);assert.equal(x.art,'NOT_TESTED_HOLD');
 const d=x.depth;
 assert.equal(d.available,true);
 assert.equal(d.method,'ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY');
 assert.equal(d.nonlinearDepth,true);assert.equal(d.originalVertexShader,true);
 assert.equal(d.width,1013);assert.equal(d.height,698);assert.equal(d.stride,8);
 assert.equal(d.samples.length,11176);
 assert.ok(d.samples.every(v=>Number.isInteger(v)&&v>=0&&v<=16777215));
 return x;
}
async function state(page){
 return page.evaluate(()=>{
  const d=document.querySelector('#view').dataset;
  return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
   road:d.r19a1Road,xyz:d.r19a1XYZ.split(',').map(Number),
   eye:d.r19a1Eye.split(',').map(Number),
   front:d.r19a1Front.split(',').map(Number),
   camera:d.cameraMode,status:d.r19a1Status,
   sourceB51:Number(d.r19a1B51),effectiveMask:d.k4abEffectiveMask,
   audit:JSON.parse(d.k4abAudit||'{}')};
 });
}
function same(a,b){
 assert.equal(a.tick,b.tick);assert.equal(a.paused,b.paused);
 assert.equal(a.road,b.road);assert.equal(a.camera,b.camera);
 for(const key of ['xyz','eye','front'])
  assert.ok(a[key].every((v,i)=>Math.abs(v-b[key][i])<0.001),key+' changed');
}
function pinned(s,rec,tick){
 assert.equal(rec.nativeTick,tick);
 assert.equal(rec.originalStatus,'running');
 assert.equal(rec.originalRoad,'p93-PRISM_CREST-01');
 assert.equal(rec.originalB51Id,'p95-hazard-12'); // geometry target only
 for(const [key,pin,tolerance] of [
  ['xyz','originalSourceBallCenter',.0015],
  ['eye','originalSourceCameraEye',.025],
  ['front','originalSourceCameraFront',.0015]])
  assert.ok(s[key].every((v,i)=>Math.abs(v-rec[pin][i])<tolerance),
   'K4AM_K4AI_NATIVE_POSE_MISMATCH_'+key);
}
async function png(page,file){
 const data=await page.locator('#view').screenshot({path:path.join(OUT,file),timeout:55000});
 assert.ok(data.length>9000);
 return {file,bytes:data.length,sha256:sha(data)};
}
function depthSummary(d){
 return {method:d.method,nonlinearDepth:d.nonlinearDepth,
  sampleCount:d.samples.length,originalDraws:d.originalDraws,
  sha256:sha(Buffer.from(JSON.stringify(d.samples))),samples:d.samples};
}
const result={
 schema:'dopagaki.K4AM.original-webgl2-source-RGB-nine-gaps/1',
 originalSourceBlob:SRC,pinnedK4AIRawSHA256:AI_SHA,
 original240HzPhysics:true,actualLive240fpsClaim:false,
 purpose:'FILL_ONLY_K4AK_NINE_MISSING_SOURCE_RGB_TICKS',
 geometryTrackedId:'p95-hazard-12',
 gpuRemovedGroup:'B51_BODY_ALL_28',
 perTickSingleObstacleAttribution:'UNKNOWN_EXCEPT_K4AG_TICK11280',
 newModels:0,newColliders:0,physicsChanged:false,cameraChanged:false,
 officialARTAccepted:0,slope2DNAMetres:0,ART:'NOT_TESTED_HOLD',
 HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 sourceCandidatesCreated:0,sessions:[],errors:[]
};
await new Promise((ok,no)=>server.once('error',no).listen(0,'127.0.0.1',ok));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const k=K4AI.sessions.find(s=>s.mode===mode);
  assert.ok(k);
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage();
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const session={mode,missingTicks:PENDING[mode],frames:[],errors:[]};
  page.on('pageerror',e=>session.errors.push('pageerror: '+e.message));
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
    '/r19a6p4r2f5k4ad/?r19a1=on&k4ab=on&k4ad=on&g5b=off&stage='+stage,
    {waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(s=>document.querySelector('#stage')?.value===s&&
    document.querySelector('#view')?.dataset.w9c1Isolated==='true',stage,{timeout:90000});
   const webgl=await page.evaluate(()=>{
    const gl=document.querySelector('#view').getContext('webgl2');
    return {webgl2:gl instanceof WebGL2RenderingContext,
      preserveDrawingBuffer:gl.getContextAttributes()?.preserveDrawingBuffer,
      width:gl.drawingBufferWidth,height:gl.drawingBufferHeight};
   });
   assert.equal(webgl.webgl2,true);assert.equal(webgl.preserveDrawingBuffer,false);
   session.trueOriginalWebGLContext=webgl;
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   for(const [index,tick] of PENDING[mode].entries()){
    await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
    if(index===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view').dataset;
     return (Number(d.r19a1PauseTick)===t && d.k4abEffectiveMask==='none' &&
       JSON.parse(d.k4abAudit||'{}').currentNativeTick===t) ||
       ['finished','failed'].includes(d.r19a1Status);
    },tick,{timeout:180000,polling:50});
    const s=await state(page),native=k.continuousNative240Hz.records[tick-10680];
    assert.equal(s.tick,tick);assert.equal(s.paused,tick);
    assert.equal(s.road,'p93-PRISM_CREST-01');assert.equal(s.status,'running');
    assert.equal(s.camera,'ball-lock-unfiltered-heading');
    assert.equal(s.sourceB51,28);assert.equal(s.effectiveMask,'none');
    assert.equal(s.audit.sourceBlob,SRC);
    assert.equal(s.audit.originalSceneA5R19A3OverlayRendered,false);
    pinned(s,native,tick);
    const original=await syncDepth(page,tick,'none');
    same(await state(page),s);
    const sourcePNG=await png(page,`K4AM_${mode}_${tick}_ORIGINAL_SOURCE.png`);
    await page.evaluate(()=>{window.__k4abMask='without-B51-bodies';});
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view').dataset;
     return d.k4abEffectiveMask==='without-B51-bodies' &&
      JSON.parse(d.k4abAudit||'{}').currentNativeTick===t;
    },tick,{timeout:20000,polling:40});
    same(await state(page),{...s,effectiveMask:'without-B51-bodies'});
    const masked=await syncDepth(page,tick,'without-B51-bodies');
    const groupPNG=await png(page,`K4AM_${mode}_${tick}_WITHOUT_B51_GROUP.png`);
    await page.evaluate(()=>{window.__k4abMask='none';});
    await page.waitForFunction(()=>document.querySelector('#view').dataset.k4abEffectiveMask==='none');
    const recovered=await syncDepth(page,tick,'none');
    same(await state(page),s);
    const restoredPNG=await png(page,`K4AM_${mode}_${tick}_RESTORED_SOURCE.png`);
    const a=original.depth.samples,b=masked.depth.samples,c=recovered.depth.samples;
    assert.deepEqual(c,a,'ORIGINAL_GPU_DEPTH_NOT_RESTORED');
    assert.ok(a.every((v,i)=>b[i]>=v),'REMOVING_B51_CREATED_NEARER_GPU_DEPTH');
    assert.equal(original.depth.originalDraws,72);
    assert.equal(masked.depth.originalDraws,44);
    assert.equal(recovered.depth.originalDraws,72);
    assert.equal(masked.seq,original.seq+1);assert.equal(recovered.seq,masked.seq+1);
    session.frames.push({
     tick,nativePhysicsSeconds:tick/240,
     k4aiNativeTickPoseMatch:true,source:s,
     sourcePNG,groupHiddenPNG:groupPNG,restoredPNG,
     nativeGPU:{original:depthSummary(original.depth),
       allB51GroupHidden:depthSummary(masked.depth),
       restored:depthSummary(recovered.depth),
       maskedFartherDepthSamples:a.reduce((n,v,i)=>n+Number(b[i]>v),0),
       nearerDepthSamples:0,originalRestoredAll11176:true},
     groupMaskNotSingleB51Id:true,sourceColorCandidateArtAB:'NOT_CAPTURED',
     ART:'NOT_TESTED_HOLD'
    });
   }
   assert.deepEqual(session.errors,[]);
   assert.equal(session.frames.length,PENDING[mode].length);
  }catch(e){
   result.errors.push({mode,message:String(e.stack||e).slice(0,4500)});
  }finally{
   result.sessions.push(session);
   await context.close();
  }
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(OUT,'K4AM_ORIGINAL_NINE_MISSING_RGB_TICKS.json'),
  JSON.stringify(result,null,2)+'\n','utf8');
}
assert.deepEqual(result.errors,[]);
assert.equal(result.sessions.reduce((n,s)=>n+s.frames.length,0),9);
assert.equal(seq,27);
console.log('K4AM_ORIGINAL_RGB_NINE_MISSING_NATIVE_TICKS_CAPTURED_ART_HOLD');
