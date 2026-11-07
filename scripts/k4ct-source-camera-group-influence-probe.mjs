/**
 * R33: original Chromium/WebGL2, real original camera/240Hz, exact R32
 * Blender artifact. Targeted one-group-at-a-time leave-one-out test.
 * Screen-space INFLUENCE, not direct surface ownership or ART approval.
 * This ONLY toggles a pre-existing research renderer skip flag during an
 * already-paused source game tick. Never edits B48/B51/Camera/physics.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {decodeChromePng,pixelImpact} from './k4ct-r12-real-chromium-png-pixel-impact.mjs';
const DIR=path.resolve('test-results/k4ct-source-ownership');
fs.mkdirSync(DIR,{recursive:true});
const g=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const originalBlob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+g.length+'\0'),g])).digest('hex');
assert.equal(originalBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const DCC=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('test-results/k4ct-active-art/R32_SCENE_MANIFEST.json','utf8'));
assert.equal(DCC.schema,'k4ct-blender-authored-true-source-integrated-scene/1');
assert.equal(manifest.schema,'k4ct-active-art-r32-camera-anchored-double-drop-intake-turbine-v1');
assert.equal(DCC.triangles,10309);
assert.equal(DCC.sourcePhysicalRoad5SHA256,'4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
assert.equal(DCC.originalB48,7);assert.equal(DCC.originalB51,28);assert.equal(DCC.newColliders,0);
assert.equal(Object.keys(DCC.objects).length,43);
const IDs=['03','05','23','24','19','34','41','42'];
const byId=Object.fromEntries(IDs.map(id=>{
 const names=Object.keys(DCC.objects).filter(k=>k.startsWith(id+'_'));
 assert.equal(names.length,1,'source group missing/ambiguous '+id);
 return [id,names[0]];
}));
const crops={
 leftWater:{x0:0,y0:280,x1:240,y1:700},
 widerLeft:{x0:0,y0:250,x1:670,y1:710},
 plantRight:{x0:750,y0:230,x1:1220,y1:730},
 gameFrame:{x0:0,y0:100,x1:1365,y1:780}
};
const results=[],errors=[];
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+
 '/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
  c.dataset.k4ctNativeDcc==='GENUINE_BLENDER_EDITABLE_NONCOLLIDING'&&
  window.__k4ctR12OriginalNonroadGroupNames?.length===42;
 },undefined,{timeout:90000});
 const available=await page.evaluate(()=>window.__k4ctR12OriginalNonroadGroupNames);
 assert(IDs.every(id=>available.includes(byId[id])),'R33 required group missing in actual renderer');
 await page.locator('#cameraCompare').click();
 await page.locator('#demoSpeed').selectOption('2');
 await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
 await page.locator('#demoRun').click();
 async function pausedAt(sec){
  await page.waitForFunction(s=>{
   const c=document.getElementById('view'),ticks=Number(c.dataset.r15s3d10NativeTicks);
   return (ticks>=Math.floor(s*240)-2&&
     Math.abs(Number(c.dataset.r15s3d10PausedAt)-s)<.009&&
     c.dataset.r15s3d10Status==='running')||
     ['failed','finished'].includes(c.dataset.r15s3d10Status);
  },sec,{timeout:120000,polling:50});
  assert.equal(await page.locator('#view').getAttribute('data-r15s3d10-status'),
   'running','original 240Hz native drive ended before '+sec);
 }
 await pausedAt(63.70);
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view')
  .dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',undefined,{timeout:15000});
 async function advance(sec,wasPaused){
  await page.evaluate(v=>window.__r15s3d10PauseAt=v,sec);
  if(wasPaused)await page.locator('#pause').click();
  await pausedAt(sec);
 }
 const capture=()=>page.screenshot({type:'png'});
 async function skip(name){
  await page.evaluate(x=>window.__k4ctR12SkipGroup=x,name);
  await page.waitForFunction(x=>{
   const c=document.getElementById('view');
   return c?.dataset.k4ctR12SkippedGroup===(x??'ALL')&&
    c.dataset.k4ctR9Material==='REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2';
  },name,{timeout:18000,polling:50});
 }
 const sourceTick=()=>page.evaluate(()=>Number(document.getElementById('view')
  .dataset.r15s3d10NativeTicks));
 const samples=[65.25,65.60,66.35,67.20,68.05];
 async function inspect(sec){
  const state=await page.evaluate(()=>{
   const c=document.getElementById('view'),gl=c.getContext('webgl2');
   return {tick:Number(c.dataset.r15s3d10NativeTicks),
    originalGame:c.dataset.r15s3d10OriginalGame,
    originalCamera:c.dataset.r15s3d10CameraMode??null,
    realWebGL2:gl instanceof WebGL2RenderingContext,
    depthBits:gl.getParameter(gl.DEPTH_BITS),
    depthEnabled:gl.isEnabled(gl.DEPTH_TEST),
    material:c.dataset.k4ctR9Material,blender:c.dataset.k4ctNativeDcc,
    sourceB51:Number(c.dataset.g4e7yRetainedMachines)};
  });
  assert(state.realWebGL2&&state.depthEnabled&&state.depthBits>0);
  assert.equal(state.originalGame,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.blender,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  assert.equal(state.material,'REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2');
  assert.equal(state.sourceB51,28);
  assert(Math.abs(state.tick-sec*240)<=2);
  await page.evaluate(()=>{window.__k4ctVisualABMode='R7_DCC';
   window.__k4ctSuppressK4CSGateOnly=true;window.__k4ctR12SkipGroup=null;});
  await skip(null);
  const basePNG=await capture();
  fs.writeFileSync(path.join(DIR,'R33_TRUE_ORIGINAL_T'+String(sec).replace('.','_')+'_BASE.png'),basePNG);
  const base=decodeChromePng(basePNG),influence={};
  for(const id of IDs){
   await skip(byId[id]);
   assert.equal(await sourceTick(),state.tick,'source 240Hz tick advanced while group skipped');
   const variant=decodeChromePng(await capture());
   influence[id]={group:byId[id],
     crops:Object.fromEntries(Object.entries(crops).map(([key,rect])=>
      [key,pixelImpact(base,variant,rect)]))};
   if((sec===65.60&&['03','19','34'].includes(id))||
      (sec===68.05&&['41','42'].includes(id))){
     fs.writeFileSync(path.join(DIR,'R33_ORIGINAL_T'+String(sec).replace('.','_')+
       '_HIDE_'+id+'.png'),await capture());
   }
  }
  await skip(null);
  assert.equal(await sourceTick(),state.tick,'source tick advanced before restore');
  const restored=decodeChromePng(await capture());
  const restoredCrops=Object.fromEntries(Object.entries(crops).map(([key,rect])=>
    [key,pixelImpact(base,restored,rect)]));
  const restoreValid=restoredCrops.gameFrame.changedPctRGBgt25<.5&&
    restoredCrops.leftWater.changedPctRGBgt25<.5;
  results.push({seconds:sec,sourceTick:state.tick,source:state,
    sourceCameraDepth:true,exactGroups:IDs,groupHideInfluence:influence,
    restoreVsOriginal:restoredCrops,restoreValid,
    noCameraPhysicsB48B51Edits:true,
    caveat:'Leave-one-out rendered change indicates influence; not unique opaque pixel ownership'});
  console.log('R33_SOURCE_TICK_GROUP_INFLUENCE',JSON.stringify({sec,tick:state.tick,
   restoreValid,
   left:IDs.map(id=>[id,influence[id].crops.leftWater.changedRGBgt25]),
   widerLeft:IDs.map(id=>[id,influence[id].crops.widerLeft.changedRGBgt25]),
   right:IDs.map(id=>[id,influence[id].crops.plantRight.changedRGBgt25])}));
 }
 await advance(65.25,false);await inspect(65.25);
 await page.keyboard.down('KeyD');
 await advance(65.36,true);await page.keyboard.up('KeyD');
 await advance(65.60,true);await inspect(65.60);
 await advance(65.79,true);await page.keyboard.down('KeyD');
 await advance(65.91,true);await page.keyboard.up('KeyD');
 await advance(66.00,true);
 await advance(66.35,true);await inspect(66.35);
 await advance(67.20,true);await inspect(67.20);
 await advance(67.65,true);
 await advance(68.05,true);await inspect(68.05);
 assert.deepEqual(results.map(x=>x.sourceTick),[15660,15744,15924,16128,16332]);
 assert.deepEqual(errors,[]);
 const valid=results.filter(x=>x.restoreValid);
 const roiImpacts=Object.fromEntries(Object.keys(crops).map(key=>
  [key,Object.fromEntries(IDs.map(id=>[id,valid.map(x=>
   x.groupHideInfluence[id].crops[key].changedRGBgt25)]))]));
 const waterInfluence=results.map(x=>({seconds:x.seconds,
  anyOf03_05_23_24LeftWater:IDs.slice(0,4).some(id=>x.groupHideInfluence[id].crops.leftWater.changedRGBgt25>0),
  group19LeftWater:x.groupHideInfluence['19'].crops.leftWater.changedRGBgt25,
  source34WideLeft:x.groupHideInfluence['34'].crops.widerLeft.changedRGBgt25,
  source41Right:x.groupHideInfluence['41'].crops.plantRight.changedRGBgt25}));
 const output={schema:'k4ct-r33-original-camera-targeted-group-influence-v1',
  method:'One research renderer Blender material group skipped at fixed genuine original 240Hz paused tick, original WebGL2 and depth, 5 same control-path frames, direct source screenshot differences',
  requiredR32ArtifactRun:42357674018,
  originalGameBlob:originalBlob,originalRoadSHA256:DCC.sourcePhysicalRoad5SHA256,
  unmodifiedOriginalSourceCamera:true,originalWebGL2:true,originalRunner240Hz:true,
  originalB48:7,originalB51:28,newColliders:0,originalBlenderGroups:43,
  sampledTicks:results.map(x=>x.sourceTick),groups:byId,regions:crops,
  validRestorationFrames:valid.length,restorationEveryFrameValid:valid.length===5,
  roiInfluenceAcrossValidFrames:roiImpacts,waterInfluence,frames:results,
  pixelChangeNotUniqueOwnership:true,
  waterOwnerDetermined:false,ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
  FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',formalARTAdopted:0,slope2DNAmeters:0,
  limitations:'Masked drawing is a source-scene influence check; overlapping visible water can be from background/source renderer and negative occlusion. No direct per-pixel triangle ID or literal GL depth readback. Restored screens and exact source tick required for attribution; human fun and fairness not tested.'};
 fs.writeFileSync(path.join(DIR,'K4CT_R33_GROUP_INFLUENCE.json'),JSON.stringify(output,null,2)+'\n');
 if(valid.length!==5)throw Error('R33_RESTORE_UNSTABLE: evidence saved; attribution HOLD, not false ownership');
 await context.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
