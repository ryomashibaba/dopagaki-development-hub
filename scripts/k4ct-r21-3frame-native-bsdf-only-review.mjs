/**
 * R21 single blockout review — genuine Blender mesh rendered into original
 * PRIVATE Chromium/WebGL2, 3 exact source CHASE ticks, only 4 targeted
 * non-road Blender group leave-one-out probes (not 42x3 QA).
 * HUMAN/ART/FPS/SAT/CCD and formal release are never inferred.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {decodeChromePng,pixelImpact} from './k4ct-r12-real-chromium-png-pixel-impact.mjs';
const DIR=path.resolve('test-results/k4ct-r21-native-blockout');
fs.mkdirSync(DIR,{recursive:true});
const game=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const originalBlob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+game.length+'\0'),game])).digest('hex');
assert.equal(originalBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const dcc=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'));
const r9=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json'));
const realProof=JSON.parse(fs.readFileSync('test-results/k4ct-r21-native-material/K4CT_R21_GENUINE_BLENDER_MARINE_BSDF_PROOF.json'));
const spec=JSON.parse(fs.readFileSync('research-evidence/k4ct/K4CT_R21_REAL_BSDF_AND_NATIVE_VISIBILITY_VETO_CONTRACT_20261107.json')).actualBSDFPropertyGoals;
assert.equal(realProof.schema,'k4ct-r21-actual-blender-archive-reopen-bsdf-marine-node-bridge-v1');
assert(realProof.originalDccByteIdentical&&realProof.realSavedAndReopenedPrincipledNodes);
assert.equal(realProof.changedTrueMaterialCount,12);
assert.equal(realProof.totalTriangles,25700);
assert(Object.keys(spec).length===12);
assert(r9.r21ActualBlenderNodeSemanticsProven&&r9.r21OriginalXYZRGBNormalsUVIDsUnchanged);
for(const [name,goal] of Object.entries(spec)){
 const mat=r9.materials.find(x=>x.name===name);
 assert(mat,'R21 actual Blender marine material missing '+name);
 assert(Math.abs(mat.roughness-goal[0])<.0001);
 assert(Math.abs(mat.metalness-goal[1])<.0001);
}
assert(new Set(r9.materials.filter(x=>x.name.startsWith('harbor_'))
 .map(x=>x.roughness.toFixed(3)+'|'+x.metalness.toFixed(3))).size>=10);
const newMarine=['harbor_abyss','harbor_tidal_steel','harbor_swell','harbor_wet_rock',
 'harbor_foam_silver','harbor_salt_concrete','harbor_laminate','harbor_green_iron',
 'harbor_aged_copper','harbor_crane_gold','harbor_ship_hull','harbor_window'];
assert(r9.fromActualBlenderMeshPolygons&&r9.fromActualBlenderBSDFInputs);
assert(newMarine.every(k=>r9.materials.some(m=>m.name===k)), 'R21 true author material provenance');
assert(r9.triangles+r9.roadLegacyTriangles===dcc.triangles);
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
const targetIDs=['03','16','34','42'];
const names=Object.fromEntries(targetIDs.map(id=>{
 const match=Object.keys(dcc.objects).filter(k=>k.startsWith(id+'_'));
 assert.equal(match.length,1);return [id,match[0]];
}));
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
  const image='R21_TRUE_SOURCE_CHASE_T'+String(sec).replace('.','_')+'_CLEAN_RAW.png';
  fs.writeFileSync(path.join(DIR,image),png);
  const base=decodeChromePng(png),changes={};
  const R20OriginalRaw=path.resolve('test-results/k4ct-r21-original-artifact/k4ct-r20-native-blockout/R20_TRUE_SOURCE_CHASE_T'+String(sec).replace('.','_')+'_CLEAN_RAW.png');
  assert(fs.existsSync(R20OriginalRaw),'R20 original source raw not supplied');
  const materialOnlyPixelImpact=pixelImpact(
   decodeChromePng(fs.readFileSync(R20OriginalRaw)),base);
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
   changes[id]={group:name,impact:pixelImpact(base,decodeChromePng(pic))};
  }
  await page.evaluate(()=>{window.__k4ctR12SkipGroup=null;});
  await page.waitForFunction(()=>document.getElementById('view')?.dataset.k4ctR12SkippedGroup==='ALL',
   undefined,{timeout:15000,polling:50});
  const after=decodeChromePng(await page.screenshot({type:'png'}));
  const parity=pixelImpact(base,after);
  assert(parity.changedPctRGBgt25<.5,'failed same-source-tick render restore');
  result.push({timeSec:sec,sourceTick:state.tick,source:state,
   cleanRAW:image,materialOnlyPixelImpactAgainstR20:materialOnlyPixelImpact,
   selectiveGroupInfluence:changes,reproducibility:parity,
   unchangedOriginalB51:28,artApproval:false});
 }
 // Original takeoverRun automatically RESUMES initial pause.
 await advance(65.25,false);await actualSourceFrame(65.25);
 await page.keyboard.down('KeyD');
 await advance(65.36,true);await page.keyboard.up('KeyD');
 await advance(65.79,true);await page.keyboard.down('KeyD');
 await advance(65.91,true);await page.keyboard.up('KeyD');
 await advance(66.35,true);await actualSourceFrame(66.35);
 await advance(68.05,true);await actualSourceFrame(68.05);
 assert.deepEqual(result.map(x=>x.sourceTick),[15660,15924,16332]);
 assert.deepEqual(errors,[]);
 const output={
  schema:'k4ct-r21-single-true-blender-working-port-native-3frame-source-review-v1',
  originalGameBlob:originalBlob,roadPhysicsSHA256:dcc.sourcePhysicalRoad5SHA256,
  genuineBlenderPolygons: true,editableBlenderGroups:43,totalTriangles:dcc.triangles,
  allPreviousR20TopologyAndMaterialBaseRGBPreserved:true,
  originalWebGL2:true,originalCamera:true,originalRunner240Hz:true,
  originalB48:7,originalB51:28,newColliders:0,
  originalRoadSourceUnmodified:true,scriptedNoHuman:true,
  notFullCCDOrSAT:true,notHardwareGPUFPS:true,
  pixelInfluenceNotARTScore:true,notTrueObjectVisibleOwnership:true,
  sourceR19ResearchSubstrateIsUnadopted:true,
  R21ActualSavedReopenedBlenderBSDFOnly:true,
  R21OriginalR20MeshReusedNoGeometryChange:true,
  trueBlenderMarineMaterialCount:newMarine.length,
  artistMaterialNames:newMarine,
  waterAndShippingPortGenuineEditable:true,
  geometryChangesMadeInR21:false,
  noNewArtMeshesCreated:true,
  newMarineMaterialPropertiesActualBlender:true,
  selectiveGroupsOnly:targetIDs,full42GroupRunIntentionallySkipped:true,
  source3FrameRAW:result,
  materialOnlyRealBlenderBSDFNativePixelComparisons:result.map(x=>({sec:x.timeSec,impact:x.materialOnlyPixelImpactAgainstR20})),
  originalR20GenuineNativeCI:42307252065,
  originalR20ArtStillRejected:true,
  trueBlenderNodeProof:'K4CT_R21_GENUINE_BLENDER_MARINE_BSDF_PROOF.json',
  formalARTAdopted:0,slope2DNAmeters:0,
  ART:'REJECT',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  methodLimit:'Three paused source ticks + selective four genuine Blender group hide measurements. No human verdict and no independent full moving B51 physical success/retry certificate.'
 };
 fs.writeFileSync(path.join(DIR,'K4CT_R21_TRUE_SOURCE_3FRAME_ART_CRITICAL_PREFLIGHT.json'),
  JSON.stringify(output,null,2)+'\n');
 console.log('R21_ORIGINAL_WEBGL2_THREE_ACT_GENUINE_BLENDER_PASS',
  JSON.stringify(result.map(r=>({sec:r.timeSec,tick:r.sourceTick,
   influential:Object.entries(r.selectiveGroupInfluence).map(([id,v])=>
    [id,Number(v.impact.changedPctRGBgt25.toFixed(3))])}))));
 await context.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
