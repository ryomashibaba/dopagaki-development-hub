/**
 * R48: source-original 240Hz Chromium/WebGL2 R47 temporal FLAT PROXY native screen probe
 * R44 genuine Blender background; four diagnostic-only non-Blender 2-triangle proxy surfaces.
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
const DIR=path.resolve('test-results/k4ct-r48-native-diagnostic');
fs.mkdirSync(DIR,{recursive:true});
const g=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const originalBlob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+g.length+'\0'),g])).digest('hex');
assert.equal(originalBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const DCC=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('test-results/k4ct-r44-art/R44_SOURCE_UNDERBANK_CONDUIT_MANIFEST.json','utf8'));
assert.equal(DCC.schema,'k4ct-blender-authored-true-source-integrated-scene/1');
assert.equal(manifest.schema,'k4ct-r44-source-road6-r43-a-underbank-real-blender-conduit-three-stage-v1');
assert(DCC.triangles>5000 && DCC.triangles<60000);
assert(manifest.sourceGroup19Untouched && manifest.allThreeStageSharedBoundaryCoordinates && manifest.realEvaluatedBlenderWaterMeshes.length===3);
assert.equal(manifest.originalB48,7);assert.equal(manifest.originalB51,28);
assert.equal(manifest.totalSceneTriangles,DCC.triangles);
assert.equal(DCC.sourcePhysicalRoad5SHA256,'4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
assert.equal(DCC.originalB48,7);assert.equal(DCC.originalB51,28);assert.equal(DCC.newColliders,0);
assert.equal(Object.keys(DCC.objects).length,43);
const components=['HEADRACE','FALL','RECEIVER','GATE_PROXY'];
const roi={x0:0,y0:100,x1:1365,y1:780};
const scopes={gameFrame:roi,leftWater:{x0:0,y0:280,x1:670,y1:710}};
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
 assert.equal(await page.evaluate(()=>window.__k4ctR48ResearchDiagnosticOn),false);
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
 async function mode(value){
  assert(['OFF','NONE','ALL',...components.map(x=>'SKIP_'+x)].includes(value));
  await page.evaluate(v=>{
   window.__k4ctR48ResearchDiagnosticOn=v!=='OFF';
   window.__k4ctR48ProxyMask=v==='OFF'?'ALL':v;
   window.__k4ctVisualABMode='R7_DCC';
   window.__k4ctSuppressK4CSGateOnly=true;
   window.__k4ctR12SkipGroup=null;
  },value);
  await page.waitForFunction(v=>{
   const c=document.getElementById('view');
   return c?.dataset.k4ctR48ProxyMode===v&&
    c.dataset.k4ctR9Material==='REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2';
  },value,{timeout:25000,polling:50});
 }
 const sourceTick=()=>page.evaluate(()=>Number(document.getElementById('view')
  .dataset.r15s3d10NativeTicks));
 const samples=[66.25,66.35,66.55];
 async function inspect(sec){
  const nativeTick=await sourceTick();
  assert(Math.abs(nativeTick-sec*240)<=2);
  const state=await page.evaluate(()=>{
   const c=document.getElementById('view'),gl=c.getContext('webgl2');
   return {tick:Number(c.dataset.r15s3d10NativeTicks),
    originalGame:c.dataset.r15s3d10OriginalGame,
    realWebGL2:gl instanceof WebGL2RenderingContext,
    depthBits:gl.getParameter(gl.DEPTH_BITS),
    depthEnabled:gl.isEnabled(gl.DEPTH_TEST),
    originalCamera:c.dataset.r15s3d10CameraMode??null,
    originalB51:Number(c.dataset.g4e7yRetainedMachines),
    genuineBlenderBackground:c.dataset.k4ctNativeDcc};
  });
  assert(state.realWebGL2&&state.depthEnabled&&state.depthBits>0);
  assert.equal(state.originalB51,28);
  assert.equal(state.originalGame,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.genuineBlenderBackground,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  await mode('OFF');
  const orig=await capture();
  const srcName='R48_ORIGINAL_R44_T'+String(sec).replace('.','_')+'.png';
  fs.writeFileSync(path.join(DIR,srcName),orig);
  await mode('NONE');
  const withR44RejectedGroupsHidden=decodeChromePng(await capture());
  await mode('ALL');
  const candidatePNG=await capture();
  fs.writeFileSync(path.join(DIR,'R48_PROXY_NATIVE_T'+String(sec).replace('.','_')+'.png'),candidatePNG);
  const candidate=decodeChromePng(candidatePNG);
  const contribution={};
  for(const name of components){
   await mode('SKIP_'+name);
   assert.equal(await sourceTick(),nativeTick,'R48 tick changed under same-frame proxy diagnostic');
   const variantPNG=await capture();
   const variant=decodeChromePng(variantPNG);
   contribution[name]=Object.fromEntries(Object.entries(scopes).map(([key,rect])=>
    [key,pixelImpact(candidate,variant,rect)]));
   const evidence=(sec===66.25&&name==='HEADRACE')||
      (sec===66.35&&['FALL','GATE_PROXY'].includes(name))||
      (sec===66.55&&name==='RECEIVER');
   if(evidence)fs.writeFileSync(path.join(DIR,'R48_PROXY_T'+String(sec).replace('.','_')+'_SKIP_'+name+'.png'),variantPNG);
  }
  await mode('ALL');
  assert.equal(await sourceTick(),nativeTick);
  const restored=pixelImpact(candidate,decodeChromePng(await capture()),roi);
  assert(restored.changedPctRGBgt25<.5,'proxy restoration unstable');
  await mode('OFF');
  const sourceRestored=pixelImpact(decodeChromePng(orig),decodeChromePng(await capture()),roi);
  assert(sourceRestored.changedPctRGBgt25<.5,'original Game R44 screenshot not restored');
  results.push({seconds:sec,sourceTick:nativeTick,source:state,
   genuineOriginalSourceCamera:true,
   actuallyRenderedInRealWebGL2:true,
   researchOnlyFlatMeshesNotGenuineBlender:true,
   notTrueHydraulicallyConnectedWaterOrAnchoredMechanic:true,
   effectOfAddedProxyAtROI:pixelImpact(withR44RejectedGroupsHidden,candidate,roi),
   contributionByTemporalComponent:contribution,
   sameTickRestorationValid:true,
   restoredRGBgt25:restored.changedRGBgt25,
   originalR44RestoredRGBgt25:sourceRestored.changedRGBgt25});
  console.log('R48_ORIGINAL_WEBGL2_TEMPORAL_PROXY',JSON.stringify({
   sec,tick:nativeTick,
   impacts:components.map(n=>[n,contribution[n].gameFrame.changedRGBgt25]),
   restored:restored.changedRGBgt25,sourceRestored:sourceRestored.changedRGBgt25}));
 }
 await advance(65.25,false);
 await page.keyboard.down('KeyD');await advance(65.36,true);
 await page.keyboard.up('KeyD');await advance(65.60,true);
 await advance(65.79,true);await page.keyboard.down('KeyD');
 await advance(65.91,true);await page.keyboard.up('KeyD');
 await advance(66.00,true);
 for(const sec of samples){await advance(sec,true);await inspect(sec);}
 assert.deepEqual(results.map(x=>x.sourceTick),[15900,15924,15972]);
 assert.deepEqual(errors,[]);
 const report={
  schema:'k4ct-r48-actual-original-webgl2-temporal-flat-proxy-v1',
  originalGameBlob:originalBlob,
  originalWebGL2:true,originalRunner240Hz:true,
  originalSourceCameraB48B51Unchanged:true,
  originalB48:7,originalB51:28,newColliders:0,
  genuineBlenderBackgroundTriangles:32004,
  proxyMaterialNeverClaimedGenuineBlender:true,
  sourceWaterMachinePhysicalConnectionsNotProven:true,
  sampledTicks:results.map(x=>x.sourceTick),
  restorationEveryFrameValid:true,
  components,frames:results,
  ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',
  FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  formalARTAdopted:0,slope2DNAmeters:0
 };
 fs.writeFileSync(path.join(DIR,'R48_ORIGINAL_GL_TEMPORAL_PROXY.json'),JSON.stringify(report,null,2)+'\n');
 await context.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
