/**
 * R38: original Chromium/WebGL2, real original camera/240Hz, exact R36
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
const DIR=path.resolve('test-results/k4ct-r38-depth');
fs.mkdirSync(DIR,{recursive:true});
const g=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const originalBlob=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+g.length+'\0'),g])).digest('hex');
assert.equal(originalBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const DCC=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('test-results/k4ct-r36-art/R36_ARCHITECTURAL_GATE_MANIFEST.json','utf8'));
assert.equal(DCC.schema,'k4ct-blender-authored-true-source-integrated-scene/1');
assert.equal(manifest.schema,'k4ct-r36-source-road6-one-real-blender-hollow-sluice-spillway-v1');
assert.equal(DCC.triangles,31583);
assert.equal(DCC.sourcePhysicalRoad5SHA256,'4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
assert.equal(DCC.originalB48,7);assert.equal(DCC.originalB51,28);assert.equal(DCC.newColliders,0);
assert.equal(Object.keys(DCC.objects).length,43);
const IDs=['19','23','24','15','16','17'];
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
 assert(IDs.every(id=>available.includes(byId[id])),'R37 source required group missing in actual renderer');
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
 const samples=[66.25,66.35,66.55];
 async function inspect(sec){
  const state=await page.evaluate(()=>{
   const c=document.getElementById('view'),gl=c.getContext('webgl2');
   return {tick:Number(c.dataset.r15s3d10NativeTicks),
    native240Hz:c.dataset.r15s3d10OriginalGame,
    depthBits:gl.getParameter(gl.DEPTH_BITS),depthEnabled:gl.isEnabled(gl.DEPTH_TEST),
    webgl2:gl instanceof WebGL2RenderingContext,
    sourceB51:Number(c.dataset.g4e7yRetainedMachines),
    sourceDcc:c.dataset.k4ctNativeDcc};
  });
  assert(state.webgl2&&state.depthBits>=16&&state.depthEnabled);
  assert.equal(state.native240Hz,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.sourceB51,28);
  assert.equal(state.sourceDcc,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  assert(Math.abs(state.tick-sec*240)<=2);
  await page.evaluate(()=>{window.__k4ctVisualABMode='R7_DCC';window.__k4ctSuppressK4CSGateOnly=true;window.__k4ctR12SkipGroup=null;});
  async function mode(m){
   await page.evaluate(x=>window.__k4ctR38VisibilityMode=x,m);
   await page.waitForFunction(x=>document.getElementById('view')?.dataset.k4ctR38ProbeMode===x,
    m,{timeout:20000,polling:50});
   assert.equal(await sourceTick(),state.tick,'R38 tick moved on a frozen-frame diagnostic');
   const dat=await page.evaluate(()=>{
    const c=document.getElementById('view');
    return {drawTriangles:Number(c.dataset.k4ctR38DrawTriangles||0),
      camera:window.__k4ctR38ActualCamera,
      glDepthActive:c.getContext('webgl2').isEnabled(c.getContext('webgl2').DEPTH_TEST)};
   });
   assert(dat.camera?.length===12&&dat.glDepthActive);
   const png=await capture();
   const file='R38_TRUE_SOURCE_T'+String(sec).replace('.','_')+'_'+m+'.png';
   fs.writeFileSync(path.join(DIR,file),png);
   return {png,drawTriangles:dat.drawTriangles,camera:dat.camera,file};
  }
  const variants={};
  for(const m of ['BASE','NO19','NO19_NO_WATER','NO_LOCAL','NO_LOCAL_NO_WATER','FRONT_ONLY_WATER','FRONT_NONE'])
   variants[m]=await mode(m);
  const restored=await mode('BASE');
  const base=decodeChromePng(variants.BASE.png);
  const impact=(m,n)=>Object.fromEntries(Object.entries(crops).map(([k,rect])=>[
    k,pixelImpact(decodeChromePng(variants[m].png),decodeChromePng(variants[n].png),rect)
  ]));
  const restore=pixelImpact(base,decodeChromePng(restored.png),crops.gameFrame);
  const pairs={
   waterWithForebayHidden:impact('NO19','NO19_NO_WATER'),
   waterWithLocalSurroundHidden:impact('NO_LOCAL','NO_LOCAL_NO_WATER'),
   waterWithoutDepthTest:impact('FRONT_ONLY_WATER','FRONT_NONE'),
   naturalSourceWaterBlocked:impact('BASE','NO19'),
   originalRestore:restore
  };
  const valid=restore.changedPctRGBgt25<.5;
  results.push({seconds:sec,sourceTick:state.tick,state,camera:variants.BASE.camera,
    modes:Object.fromEntries(Object.entries(variants).map(([k,v])=>[k,{file:v.file,drawTriangles:v.drawTriangles}])),
    pairs,restoreValid:valid, originalGameAndProtectedSourceUnchanged:true});
  console.log('R38_ORIGINAL_GL_DEPTH_VISIBILITY',JSON.stringify({sec,tick:state.tick,valid,
    no19:pairs.waterWithForebayHidden.gameFrame.changedRGBgt1,
    noSurround:pairs.waterWithLocalSurroundHidden.gameFrame.changedRGBgt1,
    front:pairs.waterWithoutDepthTest.gameFrame.changedRGBgt1}));
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
 const output={
 schema:'k4ct-r38-original-webgl2-water-depth-frustum-discrimination-v1',
 method:'Original source 240Hz Chromium/WebGL2 with R36 real Blender. Depth-disabled drawing is diagnostic ONLY; all natural variants still use untouched original renderer depth/Camera/physics. Same-tick paired masks, restore control.',
 originalSourceGameBlob:originalBlob,originalRoadSHA256:DCC.sourcePhysicalRoad5SHA256,
 sourceR12ABlenderAuthorBlob:'096fffbc1627915eb0122224955bb02cfba6b3ae',
 reusedR36Run:42369037970,sourceBlenderTriangles:DCC.triangles,
 ticks:results.map(r=>r.sourceTick),frames:results,
 originalB48:7,originalB51:28,newColliders:0,
 protected19SourceMeshUntouched:true,originalSourceCameraUntouched:true,
 independentSAT:false,independentCCD:false,hardwareFPS:false,humanPlay:false,
 diagnosticOnlyNotART:true,restoreEveryTickValid:results.every(x=>x.restoreValid),
 formalARTAdopted:0,slope2DNAmeters:0,
 ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 caveat:'Depth-disabled forced-surface screenshot is NOT normal gameplay; visibility is screen-space effect, not unique pixel ownership or valid hydraulic design. Only paired natural depth-tested modes can evaluate real occlusion.'
 };
 fs.writeFileSync(path.join(DIR,'K4CT_R38_WATER_DEPTH_FRUSTUM.json'),JSON.stringify(output,null,2)+'\n');
 if(!output.restoreEveryTickValid)throw Error('R38 restore control invalid, result HOLD');
 await context.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
