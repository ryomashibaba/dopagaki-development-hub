/** R55: single original Chromium WebGL2 + 240Hz original B51 warning proof.
 * PRIVATE research generated renderer only. KeyD via real source keyboard, NOT human.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {decodeChromePng,pixelImpact} from './k4ct-r12-real-chromium-png-pixel-impact.mjs';
const OUT=path.resolve('test-results/k4ct-r58-native-b51-footprint');
fs.mkdirSync(OUT,{recursive:true});
const result={schema:'k4ct-r58-source-original-240hz-visible-moving-b51-footprint-native-v1',
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
/** Actual source Chromium WebGL2 same tick 3 modes:
 * BASE unchanged original B51 surface,
 * HULL alternative existing real B51 mesh with only RGB changed,
 * B51_INFLUENCE real shader-only magenta source body attribution.
 * No enlarged proxy, invented marker or edited B51 collider.
 */
async function captureB51(page,label){
 const p=page.locator('#view');
 const snapshot=async()=>page.evaluate(()=>{
  const c=document.getElementById('view');
  const gl=c.getContext('webgl2');
  return {gl:gl instanceof WebGL2RenderingContext,
   source:c.dataset.r15s3d10OriginalGame,
   tick:Number(c.dataset.r15s3d10NativeTicks),
   b51Count:Number(c.dataset.g4e7yRetainedMachines),
   realDcc:c.dataset.k4ctNativeDcc,
   originals:c.dataset.k4ctNativeB51MaterialMode,
   shaderAttribution:c.dataset.k4ctAttributionMode,
   decision:JSON.parse(c.dataset.k4ctDecisionJson||'null'),
   status:c.dataset.r15s3d10Status,
   currentHull:window.__k4ctR58B51HullMode||'BASE'};
 });
 const switchTo=async(mode,attribute)=>{
  await page.evaluate(({mode,attribute})=>{
   window.__k4ctR58B51HullMode=mode;
   window.__k4ctRenderAttribution=attribute;
  },{mode,attribute});
  await page.waitForFunction(({mode,attribute})=>{
   const c=document.getElementById('view');
   return (window.__k4ctR58B51HullMode===mode)&&
    c.dataset.k4ctAttributionMode===attribute&&
    c.dataset.k4ctNativeB51MaterialMode===(mode==='BASE'?'ORIGINAL_SOURCE_VISUAL':'RESEARCH_RECOLOR_SOURCE_OPAQUE_HULL_IDENTICAL_XYZ');
  },{mode,attribute},{timeout:12000,polling:50});
  await page.waitForTimeout(145);
  return snapshot();
 };
 const configurations=[
  {mode:'BASE',attribution:'BASE',tag:'BASE'},
  {mode:'SOURCE_HULL_CONTRAST',attribution:'BASE',tag:'HULL_RGB_ONLY'},
  {mode:'BASE',attribution:'B51',tag:'B51_TRUE_GL_ATTRIBUTION'},
  {mode:'BASE',attribution:'BASE',tag:'RESTORED_BASE'}
 ];
 const frames=[];
 for(const spec of configurations){
  const state=await switchTo(spec.mode,spec.attribution);
  assert.ok(state.gl);
  assert.equal(state.source,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.status,'running');
  assert.equal(state.b51Count,28);
  assert.equal(state.realDcc,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  assert.equal(state.decision.realB51,28);
  assert.ok(state.decision.originalRunnerPhysicsUnchanged);
  const image='K4CT_R58_'+label+'_'+spec.tag+'_TRUE_SOURCE_GL.png';
  const buf=await page.screenshot({type:'png'});
  fs.writeFileSync(path.join(OUT,image),buf);
  frames.push({tag:spec.tag,state,image,buffer:buf});
 }
 const [a,b,c,d]=frames;
 assert.equal(new Set(frames.map(x=>x.state.tick)).size,1,
  'Native source 240Hz progressed during attribution A/B');
 assert.equal(JSON.stringify(a.state.decision),JSON.stringify(b.state.decision));
 assert.equal(JSON.stringify(a.state.decision),JSON.stringify(c.state.decision));
 assert.equal(JSON.stringify(a.state.decision),JSON.stringify(d.state.decision));
 const original=decodeChromePng(a.buffer),hull=decodeChromePng(b.buffer),
  attribution=decodeChromePng(c.buffer),recovered=decodeChromePng(d.buffer);
 const bodyROI={x0:19,y0:100,x1:1032,y1:697};
 const changeHull=pixelImpact(original,hull,bodyROI);
 const changeB51=pixelImpact(original,attribution,bodyROI);
 const recovery=pixelImpact(original,recovered,bodyROI);
 assert.equal(recovery.changedRGBgt25,0,'R58 source B51 mode restoration changes pixels');
 const summary={label,sourceTick:a.state.tick,originalB51Count:28,
  originalSourceRunner240Hz:true,sourceGL:true,
  nativeDecision:a.state.decision,
  materialOnlySourceOriginalB51XYZUnchanged:true,
  imageNames:frames.map(x=>x.image),
  genuineRealB51VisibleInfluence:changeB51,
  sameMeshHullColorInfluence:changeHull,
  originalModeReproducibility:recovery,
  humanVisualFairnessNotCertified:true,notActualPixelOwnership:true,artAdopted:0};
 return summary;
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
 result.frames.push(await captureB51(page,'T65_25'));
 await page.keyboard.down('KeyD');
 await advance(page,65.36,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,65.79,true);
 await page.keyboard.down('KeyD');
 await advance(page,65.91,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,66.35,true);
 result.frames.push(await captureB51(page,'T66_35'));
 await advance(page,68.05,true);
 result.frames.push(await captureB51(page,'T68_05'));
 assert.equal(result.frames.length,3);
 assert.ok(result.frames.some(f=>f.nativeDecision.rowCount>0),'no actual native cue was tested');
 assert.deepEqual(result.errors,[],'pageerrors');
 result.status='R58_TRUE_SOURCE_B51_FOOTPRINT_TECH_PASS_ART_HOLD';
 await ctx.close();
}catch(e){
 result.status='HOLD_R58_SOURCE_B51_ATTRIBUTION_NOT_VERIFIED';
 result.errors.push(String(e.stack||e).slice(0,2400));
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 fs.writeFileSync(path.join(OUT,'K4CT_R58_ORIGINAL_NATIVE_WARNING_RESULT.json'),JSON.stringify(result,null,2)+'\n');
}
if(result.status!=='R58_TRUE_SOURCE_B51_FOOTPRINT_TECH_PASS_ART_HOLD'){
 console.error('R58_NATIVE_HOLD',JSON.stringify(result.errors));process.exitCode=1;
}else console.log('R58_NATIVE_PASS',JSON.stringify({frames:3,source:'ORIGINAL_240HZ_WEBGL2',B51:28,ART:'HOLD',HUMAN:'HOLD'}));
