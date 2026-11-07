/**
 * R31: first-five true ORIGINAL 240Hz/WebGL2 CLEAN RAW frames of one NEW
 * hand-authored low-profile lockyard, inlet and grounded turbine. No group-hide, delta metric ART pass, or
 * same-tick parity assertion at this early stage. ART requires direct visual review.
 * HUMAN/ART/FPS/SAT/CCD and formal release are never inferred.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const phase='candidate'; // R31 purposeful low-profile site-composed DCC candidate, never formal ART
const DIR=path.resolve('test-results/k4ct-active-art-raw-native');
fs.mkdirSync(DIR,{recursive:true});
const game=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const originalBlob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+game.length+'\0'),game])).digest('hex');
assert.equal(originalBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const dcc=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'));
assert.equal(dcc.schema,'k4ct-blender-authored-true-source-integrated-scene/1');
assert.equal(dcc.originalB48,7);assert.equal(dcc.originalB51,28);
assert.equal(dcc.newColliders,0);
assert(dcc.triangles>3500&&Object.keys(dcc.objects).length===43);
const originalTop=[
 '00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
 '12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER',
 '13_CONTROL_FLOOR_GLAZING',
 '19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
 '34_R7C_CHASE_VISIBLE_POWER_INTAKE',
 '41_R8J_COASTAL_TIDAL_TURBINE_CROWN',
 '42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK'
];
assert(originalTop.every(x=>dcc.objects[x]>0));
const targetIDs=[]; // no expensive group attribution during ART-first screening
const manifest=JSON.parse(fs.readFileSync('test-results/k4ct-active-art/R31_SCENE_MANIFEST.json','utf-8'));
assert.equal(manifest.schema,'k4ct-active-art-original-camera-r31-single-authored-open-lockyard-v1');
assert.equal(manifest.physicalB48,7);assert.equal(manifest.movingB51,28);assert.equal(manifest.newColliders,0);
assert(Object.keys(manifest.reworkedGroups).length===35 && manifest.realBlenderBeveledStoneVolumes.length===3);
const result=[];
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+
  '/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
    c.dataset.k4ctNativeDcc==='GENUINE_BLENDER_EDITABLE_NONCOLLIDING'&&
    window.__k4ctR12OriginalNonroadGroupNames?.length===42;
 },undefined,{timeout:90000});
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
  assert.equal(await page.locator('#view').getAttribute('data-r15s3d10-status'),'running',
    'Original 240Hz runner failed before '+sec);
 }
 await pausedAt(63.70);
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view')
  .dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',
  undefined,{timeout:15000});
 async function advance(sec,wasPaused){
  await page.evaluate(x=>window.__r15s3d10PauseAt=x,sec);
  if(wasPaused)await page.locator('#pause').click();
  await pausedAt(sec);
 }
 async function actualSourceFrame(sec){
  const state=await page.evaluate(()=>{
   const c=document.getElementById('view'),gl=c.getContext('webgl2');
   return {tick:Number(c.dataset.r15s3d10NativeTicks),
    original:c.dataset.r15s3d10OriginalGame,realWebGL2:gl instanceof WebGL2RenderingContext,
    originalB51:Number(c.dataset.g4e7yRetainedMachines),
    material:c.dataset.k4ctR9Material,
    depthBits:gl.getParameter(gl.DEPTH_BITS),
    depthEnabled:gl.isEnabled(gl.DEPTH_TEST),
    dcc:c.dataset.k4ctNativeDcc,
    triangles:Number(c.dataset.k4ctNativeDccTriangles)};
  });
  assert(state.realWebGL2&&state.depthEnabled&&state.depthBits>0);
  assert.equal(state.originalB51,28);
  assert.equal(state.original,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.dcc,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  assert(Math.abs(state.tick-sec*240)<=2);
  assert.equal(state.material,'REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2');
  await page.evaluate(()=>{window.__k4ctVisualABMode='R7_DCC';
   window.__k4ctSuppressK4CSGateOnly=true;window.__k4ctR12SkipGroup=null;});
  await page.waitForFunction(()=>document.getElementById('view')?.dataset.k4ctR12SkippedGroup==='ALL',
   undefined,{timeout:15000});
  const png=await page.screenshot({type:'png'});
  const image='R31_'+phase.toUpperCase()+'_TRUE_SOURCE_CHASE_T'+String(sec).replace('.','_')+'_CLEAN_RAW.png';
  fs.writeFileSync(path.join(DIR,image),png);
  // R31 first stage: capture genuine CLEAN original-GL RAW only. No expensive
  // leave-one-out and no brittle same-source-tick parity assertion at this stage.
  result.push({timeSec:sec,sourceTick:state.tick,source:state,
    cleanRAW:image,originalCamera:true,originalGameFrame:true,
    originalB51:28,formalARTAdopted:0,artVerdict:'HOLD',
    independentRestorationMeasurement:'NOT_ATTEMPTED',
    genuineSource240HzNotHumanCertification:true});
 }
 // Original takeoverRun automatically RESUMES initial pause.
 await advance(65.25,false);await actualSourceFrame(65.25);
 await page.keyboard.down('KeyD');
 await advance(65.36,true);await page.keyboard.up('KeyD');
 await advance(65.60,true);await actualSourceFrame(65.60);
 await advance(65.79,true);await page.keyboard.down('KeyD');
 await advance(65.91,true);await page.keyboard.up('KeyD');
 await advance(66.00,true);
 await advance(66.35,true);await actualSourceFrame(66.35);
 await advance(67.20,true);await actualSourceFrame(67.20);
 await advance(67.65,true);
 await advance(68.05,true);await actualSourceFrame(68.05);
 assert.deepEqual(result.map(x=>x.sourceTick),[15660,15744,15924,16128,16332]);
 assert.deepEqual(errors,[]);
 // R31 first pass explicitly does not measure influence or restore parity.
 const siteSignals=[],witness=[],anchorGate=null;
 const output={
  schema:'k4ct-active-art-source-camera-r31-five-raw-v1',
  phase,witness,anchorGate,siteSignals,genuineResearchArtCandidate:true,gateMeaning:'R31 authored open lockyard/3-step waterfall with source-bounded equipment foundations in ORIGINAL 240Hz/WebGL2. Five clean RAW only. No group attribution or ART pass.',
  originalGameBlob:originalBlob,roadPhysicsSHA256:dcc.sourcePhysicalRoad5SHA256,
  genuineBlenderPolygons: true,editableBlenderGroups:43,totalTriangles:dcc.triangles,
  originalWebGL2:true,originalCamera:true,originalRunner240Hz:true,
  originalB48:7,originalB51:28,newColliders:0,
  originalRoadSourceUnmodified:true,scriptedNoHuman:true,
  notFullCCDOrSAT:true,notHardwareGPUFPS:true,
  pixelInfluenceNotARTScore:true,notTrueObjectVisibleOwnership:true,
  selectiveGroupsOnly:targetIDs,full42GroupRunIntentionallySkipped:true,earlyRAWOnly:true,restorationParityNotMeasured:true,
  sourceFramesRAW:result,
  originalCameraR16AnalyticAnchorWasNotRealGLProof:true,
  R19NonadoptedResearchSubstrate:false,
  R23SourceOriginalFiveFrameCompared:false,
  realWaterElevationAndTwoGateReauthor:'SOURCE_MESH_UNREVIEWED',
  sourceNativeGroupIDs:targetIDs,
  originalIntakeTowerTurbinePreserved:true,
  formalARTAdopted:0,slope2DNAmeters:0,
  ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  methodLimit:'Five paused ORIGINAL 240Hz source ticks, one actual Boolean/Subsurf-carved R31 Blender scene, no group-hide, same-tick parity, baseline PNG comparison, human trial or accepted ART; depth-enabled genuine RAW only.'
 };
 fs.writeFileSync(path.join(DIR,'K4CT_R31_TRUE_SOURCE_PHASED_VISIBILITY.json'),
  JSON.stringify(output,null,2)+'\n');
 console.log('R31_ORIGINAL_WEBGL2_PHASED_SOURCE_VISIBILITY_COMPLETE',
  JSON.stringify(result.map(r=>({sec:r.timeSec,tick:r.sourceTick,cleanRAW:r.cleanRAW,realWebGL2:r.source.realWebGL2}))));
 assert(result.length===5 && targetIDs.length===0,'R31 original source camera five RAW contract');
 await context.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
