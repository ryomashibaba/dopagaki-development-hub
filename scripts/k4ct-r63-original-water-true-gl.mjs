/** R55: single original Chromium WebGL2 + 240Hz original B51 warning proof.
 * PRIVATE research generated renderer only. KeyD via real source keyboard, NOT human.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {decodeChromePng,pixelImpact} from './k4ct-r12-real-chromium-png-pixel-impact.mjs';
const OUT=path.resolve('test-results/k4ct-r63-original-true-gl-water-visibility');
fs.mkdirSync(OUT,{recursive:true});
const result={schema:'k4ct-r63-original-240hz-chromium-protected19-y93-source-surface-depth-v1',
  originalB48:7,originalB51:28,newColliders:0,sourceEdited:false,
  formalArtAdopted:0,slope2DNAmetres:0,
  HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  frames:[],errors:[]};
let browser=null;
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
async function advance(page,t,wasPaused){
 await page.evaluate(x=>window.__r15s3d10PauseAt=x,t);
 if(wasPaused)await page.locator('#pause').click();
 await page.waitForFunction(x=>{
  const c=document.getElementById('view');
  const tick=Number(c.dataset.r15s3d10NativeTicks);
  return (tick>=Math.floor(x*240)-2&&Math.abs(Number(c.dataset.r15s3d10PausedAt)-x)<.009&&
    c.dataset.r15s3d10Status==='running')||
    ['failed','finished'].includes(c.dataset.r15s3d10Status);
 },t,{timeout:120000,polling:50});
 const s=await page.locator('#view').evaluate(c=>({status:c.dataset.r15s3d10Status,
  tick:Number(c.dataset.r15s3d10NativeTicks),paused:Number(c.dataset.r15s3d10PausedAt)}));
 assert.equal(s.status,'running','original native Runner ended before '+t);
 assert.ok(Math.abs(s.paused-t)<.009&&Math.abs(s.tick-t*240)<=2,'invalid 240Hz source tick');
 return s;
}
async function study(page,sec){
 const label='T'+sec.toFixed(2).replace('.','_');
 const captures={};
 for(const mode of ['BASE','HIDE_Y93','HIDE_GROUP19','RESTORED_BASE']){
  await page.evaluate(m=>{
   window.__k4ctR63WaterDrawMode=m==='HIDE_Y93'?'HIDE_REAL_WATER_Y93':'BASE';
   window.__k4ctR12SkipGroup=m==='HIDE_GROUP19'?'19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY':null;
  },mode);
  const drawMode=mode==='HIDE_Y93'?'HIDE_REAL_WATER_Y93':mode==='HIDE_GROUP19'?'GROUP19_CONTROL':'BASE';
  await page.waitForFunction(z=>{
   const c=document.getElementById('view');
   return c?.dataset.k4ctR63WaterDrawMode===z.drawMode&&
    c.dataset.k4ctR12SkippedGroup===z.group;
  },{drawMode,group:mode==='HIDE_GROUP19'?'19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY':'ALL'},{timeout:15000,polling:50});
  await page.waitForTimeout(135);
  const state=await page.evaluate(()=>{
   const c=document.getElementById('view'),gl=c.getContext('webgl2');
   return {tick:Number(c.dataset.r15s3d10NativeTicks),
    realGL:gl instanceof WebGL2RenderingContext,
    depthBits:gl.getParameter(gl.DEPTH_BITS),native240Hz:c.dataset.r15s3d10OriginalGame,
    originalB51:Number(c.dataset.g4e7yRetainedMachines),
    status:c.dataset.r15s3d10Status,
    maskedSourceTriangles:Number(c.dataset.k4ctR63ProtectedY93Triangles),
    originalDcc:c.dataset.k4ctNativeDcc,
    camera:window.__k4ctR60ActualCamera?.slice(),
    nextNative:JSON.parse(c.dataset.k4ctDecisionJson||'null'),
    realB51Poses:structuredClone(window.__k4ctR60SourceB51Pose||[])};
  });
  assert.ok(state.realGL&&state.depthBits>=16);
  assert.equal(state.native240Hz,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.originalB51,28);assert.equal(state.status,'running');
  assert.equal(state.originalDcc,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  assert.equal(state.maskedSourceTriangles,144);assert.equal(state.camera?.length,12);
  assert.deepEqual(state.realB51Poses.map(x=>x.id),['a13-machine-14','a13-machine-15']);
  const filename='K4CT_R63_'+label+'_'+mode+'_TRUE_GL.png';
  const png=await page.screenshot({type:'png'});
  fs.writeFileSync(path.join(OUT,filename),png);
  captures[mode]={png,state,filename};
 }
 const b=captures.BASE;
 for(const obj of Object.values(captures)){
  assert.equal(obj.state.tick,b.state.tick);
  assert.equal(JSON.stringify(obj.state.camera),JSON.stringify(b.state.camera));
  assert.equal(JSON.stringify(obj.state.nextNative),JSON.stringify(b.state.nextNative));
 }
 const baseline=decodeChromePng(b.png);
 const roi={x0:19,y0:108,x1:1032,y1:697};
 const y93=pixelImpact(baseline,decodeChromePng(captures.HIDE_Y93.png),roi);
 const full=pixelImpact(baseline,decodeChromePng(captures.HIDE_GROUP19.png),roi);
 const restored=pixelImpact(baseline,decodeChromePng(captures.RESTORED_BASE.png),roi);
 assert.equal(restored.changedRGBgt1,0,'R63 original source GL was not restored at exact tick');
 console.log('R63_TRUE_GL_ORIGINAL_SURFACE',JSON.stringify({
  tick:b.state.tick,waterY93Pixels:y93.changedRGBgt25,
  group19AllPixels:full.changedRGBgt25,restored:restored.changedRGBgt1,
  waterBBox:y93.delta25BoundingBox}));
 return {seconds:sec,sourceNativeTick:b.state.tick,originalMovingB51:b.state.realB51Poses[0],
  sourceCamera:b.state.camera,originalMovingNativeCue:b.state.nextNative?.rows?.slice(0,2),
  actualProtected19Y93Triangles:144,waterY93TrueGLInfluence:y93,
  group19AllPositiveControlTrueGLInfluence:full,sourceGLRestored:restored,
  raw:Object.fromEntries(Object.entries(captures).map(([k,v])=>[k,v.filename])),
  sourceGLNotHumanAndNotArt:true};
}

try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const page=await ctx.newPage();
 page.on('pageerror',e=>result.errors.push(String(e.message)));
 await page.goto(base+'/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
   document.getElementById('stage').value==='K4CT-TWO-REAL-B51-CHOICE';
 },undefined,{timeout:90000});
 const ok=await page.locator('#view').evaluate(c=>c.getContext('webgl2') instanceof WebGL2RenderingContext);
 assert.ok(ok,'not real Chromium WebGL2');
 await page.locator('#cameraCompare').click();
 await page.locator('#demoSpeed').selectOption('2');
 await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
 await page.locator('#demoRun').click();
 await advance(page,63.70,false);
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',undefined,{timeout:15000});
 await advance(page,65.25,false);
 result.frames.push(await study(page,65.25));
 await page.keyboard.down('KeyD');
 await advance(page,65.36,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,65.60,true);
 result.frames.push(await study(page,65.60));
 await advance(page,65.79,true);
 await page.keyboard.down('KeyD');
 await advance(page,65.91,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,66.35,true);
 result.frames.push(await study(page,66.35));
 // Stop at 66.35: R60 is a bounded genuine early-frustum study.
 // Deliberately no extra 68.05 raster or reward HUD replay.
 assert.equal(result.frames.length,3);
 assert.ok(result.frames.some(f=>f.originalMovingNativeCue?.length>0),'no actual native cue was tested');
 assert.deepEqual(result.errors,[],'pageerrors');
 assert.ok(result.frames.some(f=>f.group19AllPositiveControlTrueGLInfluence.changedRGBgt25>200),
  'full protected group19 draw control did not produce true GL differences');
 result.status='R63_TRUE_SOURCE_GL_WATER_INFLUENCE_TECH_PASS_NOT_ART';
 await ctx.close();
}catch(e){
 result.status='R63_SOURCE_GL_HOLD';
 result.errors.push(String(e.stack||e).slice(0,2400));
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 fs.writeFileSync(path.join(OUT,'K4CT_R63_ORIGINAL_SOURCE_WATER_VISIBILITY_RESULT.json'),JSON.stringify(result,null,2)+'\n');
}
if(result.status!=='R63_TRUE_SOURCE_GL_WATER_INFLUENCE_TECH_PASS_NOT_ART'){
 console.error('R63_NATIVE_HOLD',JSON.stringify(result.errors));process.exitCode=1;
}else console.log('R63_NATIVE_PASS',JSON.stringify({frames:3,source:'ORIGINAL_240HZ_WEBGL2',B51:28,ART:'HOLD',HUMAN:'HOLD'}));
