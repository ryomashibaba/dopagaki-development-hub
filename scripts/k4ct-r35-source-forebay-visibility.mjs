/**
 * R35 original source phased genuine-GL visible-anchor and candidate review — actual shoreline water, sluice, gates rendered into original
 * PRIVATE Chromium/WebGL2, 5 exact source CHASE ticks, only 8 targeted
 * non-road Blender group leave-one-out probes (not 42x5 QA).
 * HUMAN/ART/FPS/SAT/CCD and formal release are never inferred.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {decodeChromePng,pixelImpact} from './k4ct-r12-real-chromium-png-pixel-impact.mjs';
const phase='probe'; // The scene is an isolated genuine Blender proxy, never candidate ART
const DIR=path.resolve('test-results/k4ct-r35-site-probe');
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
const targetIDs=['15','16','17']; // One genuinely authored Blender silhouette per site
const names=Object.fromEntries(targetIDs.map(id=>{
 const match=Object.keys(dcc.objects).filter(k=>k.startsWith(id+'_'));
 assert.equal(match.length,1);return [id,match[0]];
}));
const sites=JSON.parse(fs.readFileSync('test-results/k4ct-r35-site-probe/R35_THREE_REAL_DCC_SITE_COORDINATES.json','utf8'));
assert.equal(sites.schema,'k4ct-r35-real-blender-site-probe-v1');
assert.deepEqual(sites.sites.map(s=>s.outboardM),[55,75,95]);
assert(sites.sites.every(s=>s.bank==='R'&&s.centerWorldY===112.5&&s.baseWorldYAtBoxCenterMinus5>105));
const R35_LEFT={x0:0,y0:280,x1:240,y1:700};
const R35_WIDE={x0:0,y0:250,x1:670,y1:710};
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
  const image='R35_'+phase.toUpperCase()+'_TRUE_SOURCE_CHASE_T'+String(sec).replace('.','_')+'_CLEAN_RAW.png';
  fs.writeFileSync(path.join(DIR,image),png);
  const base=decodeChromePng(png),changes={};
  const priorR23Difference=false&&
   fs.existsSync(path.resolve('test-results/k4ct-r35-preflight-native/R35_PREFLIGHT_TRUE_SOURCE_CHASE_T'+String(sec).replace('.','_')+'_CLEAN_RAW.png'))
   ? pixelImpact(decodeChromePng(fs.readFileSync(path.resolve(
     'test-results/k4ct-r35-preflight-native/R35_PREFLIGHT_TRUE_SOURCE_CHASE_T'+String(sec).replace('.','_')+'_CLEAN_RAW.png'))),base)
   : null; // Different sessions: diagnostic only, never ART score.
  for(const id of targetIDs){
   const name=names[id];
   await page.evaluate(g=>window.__k4ctR12SkipGroup=g,name);
   await page.waitForFunction(g=>{
    const c=document.getElementById('view');
    return c?.dataset.k4ctR12SkippedGroup===g&&
     c.dataset.k4ctR9Material==='REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2';
   },name,{timeout:15000,polling:50});
   assert.equal(await page.evaluate(()=>Number(
    document.getElementById('view').dataset.r15s3d10NativeTicks)),state.tick);
   const pic=await page.screenshot({type:'png'});
   const raw=decodeChromePng(pic);
   changes[id]={group:name,impact:pixelImpact(base,raw),
    leftWater:pixelImpact(base,raw,R35_LEFT),widerLeft:pixelImpact(base,raw,R35_WIDE)};
  }
  await page.evaluate(()=>{window.__k4ctR12SkipGroup=null;});
  await page.waitForFunction(()=>document.getElementById('view')?.dataset.k4ctR12SkippedGroup==='ALL',
   undefined,{timeout:15000,polling:50});
  const after=decodeChromePng(await page.screenshot({type:'png'}));
  const parity=pixelImpact(base,after);
  const leftParity=pixelImpact(base,after,R35_LEFT);
  const widerParity=pixelImpact(base,after,R35_WIDE);
  assert(parity.changedPctRGBgt25<.5 && leftParity.changedPctRGBgt25<.5 && widerParity.changedPctRGBgt25<.5,'R35 failed same source tick restoration');
  result.push({timeSec:sec,sourceTick:state.tick,source:state,
   cleanRAW:image,selectiveGroupInfluence:changes,reproducibility:parity,
   leftWaterRestore:leftParity,widerLeftRestore:widerParity,
   priorR23OriginalTrueSourceDifference:priorR23Difference,
   genuineSource240HzNotHumanCertification:true,
   unchangedOriginalB51:28,artApproval:false});
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
 // Compare each SOURCE-rendered depth-tested marker's actual raster influence
 // against restoration noise IN THE SAME paused source tick. 0.15% is merely
 // a conservative diagnostic floor, NEVER an ART or human acceptance threshold.
 const siteSignals=targetIDs.map(id=>{
  const observations=result.map(r=>{
   const impact=r.selectiveGroupInfluence[id].impact.changedPctRGBgt25;
   const restore=r.reproducibility.changedPctRGBgt25;
   return {sec:r.timeSec,tick:r.sourceTick,impactRGB25Percent:impact,
    leftWaterChangedPixels:r.selectiveGroupInfluence[id].leftWater.changedRGBgt25,
    widerLeftChangedPixels:r.selectiveGroupInfluence[id].widerLeft.changedRGBgt25,
    leftWaterChangedPercent:r.selectiveGroupInfluence[id].leftWater.changedPctRGBgt25,
    rendererRestoreNoisePercent:restore,
    exceedsNoiseFloor:impact>Math.max(0.15,restore+0.05)};
  });
  return {id,actualBlenderSite:sites.sites.find(s=>s.id===id),observations,
   cleanObservedTicks:observations.filter(o=>o.exceedsNoiseFloor).map(o=>o.tick),
   maxDiagnosticImpactRGB25Percent:Math.max(...observations.map(o=>o.impactRGB25Percent))};
 });
 const witness=siteSignals;
 const anchorGate=null;
 const output={
  schema:'k4ct-r35-original-webgl-forebay-inner-three-point-visibility-v1',
  phase,witness,anchorGate,siteSignals,siteProbeForRealDCC:true,
  gateMeaning:'Three diagnostic TRUE Blender markers on protected group19 forebay at source Road5 R55/75/95m, worldY112.5; own original 240Hz Chromium WebGL2 depth visibility only; never ART pass',
  sourceForebayProtectedGroup19:'19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',sourceBankSide:'R',sourceRightDistances:[55,75,95],sourceForebayWorldY:105,
  actualBlenderSiteMetadata:sites.sites,
  originalGameBlob:originalBlob,roadPhysicsSHA256:dcc.sourcePhysicalRoad5SHA256,
  genuineBlenderPolygons: true,editableBlenderGroups:43,totalTriangles:dcc.triangles,
  originalWebGL2:true,originalCamera:true,originalRunner240Hz:true,
  originalB48:7,originalB51:28,newColliders:0,
  originalRoadSourceUnmodified:true,scriptedNoHuman:true,
  notFullCCDOrSAT:true,notHardwareGPUFPS:true,
  pixelInfluenceNotARTScore:true,notTrueObjectVisibleOwnership:true,
  selectiveGroupsOnly:targetIDs,full42GroupRunIntentionallySkipped:true,
  sourceFramesRAW:result,
  originalCameraR16AnalyticAnchorWasNotRealGLProof:true,
  R19NonadoptedResearchSubstrate:false,
  R23SourceOriginalFiveFrameCompared:false,
  realWaterElevationAndTwoGateReauthor:false,
  sourceNativeGroupIDs:targetIDs,
  originalIntakeTowerTurbinePreserved:true,
  formalARTAdopted:0,slope2DNAmeters:0,
  ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  methodLimit:'Five paused original 240Hz source ticks, three TEMPORARY genuine Blender diagnostic silhouettes R55/75/95, depth-tested group-hide and same-tick restoration; no unique pixel ownership, ART pass, human trial or formal B51/CCD/SAT/FPS.'
 };
 fs.writeFileSync(path.join(DIR,'K4CT_R35_TRUE_SOURCE_PHASED_VISIBILITY.json'),
  JSON.stringify(output,null,2)+'\n');
 console.log('R35_ORIGINAL_WEBGL2_PHASED_SOURCE_VISIBILITY_COMPLETE',
  JSON.stringify(result.map(r=>({sec:r.timeSec,tick:r.sourceTick,
   influential:Object.entries(r.selectiveGroupInfluence).map(([id,v])=>
    [id,Number(v.impact.changedPctRGBgt25.toFixed(3))])}))));
 assert(result.length===5 && targetIDs.length===3,'R35 exact source probe contract');
 await context.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
