/** K4AC: conservative native Road5 WebGL2 depth-readback CAPABILITY probe.
 * Isolated K4AB private build, original camera/240Hz/physics untouched.
 * On failure returns DEPTH_UNAVAILABLE/HOLD; never infers object ID or safe space.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';

const DIR=path.resolve('r19-evidence/r19a6p4r2f5k4ac');
fs.mkdirSync(DIR,{recursive:true});
const SOURCE='af076d67492a677d2235e4730aef8cdf4808e106';
const K4Z=JSON.parse(fs.readFileSync('r19-evidence/r19a6p4r2f5k4z-source/K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json','utf8'));
const TICKS=[10680,10800,10920,11040,11160,11280,11400];
const MASKS=['without-epic','without-mega','without-frames',
 'without-B48-and-fixtures-visuals','without-B51-bodies','without-road-optics'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(K4Z.sourceBlob,SOURCE);
assert.equal(K4Z.Hz,240);assert.equal(K4Z.sourceB48,7);assert.equal(K4Z.sourceB51,28);
assert.deepEqual(K4Z.errors,[]);assert.equal(K4Z.sessions.length,2);

const cameraState=async page=>page.evaluate(()=>{
 const d=document.querySelector('#view').dataset;
 return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
  road:d.r19a1Road,xyz:d.r19a1XYZ.split(',').map(Number),
  speed:Number(d.r19a1Speed),B51:Number(d.r19a1B51),
  camera:d.cameraMode,eye:d.r19a1Eye.split(',').map(Number),
  front:d.r19a1Front.split(',').map(Number),steering:d.r19a1Mode,
  status:d.r19a1Status,mask:d.k4abEffectiveMask,
  audit:JSON.parse(d.k4abAudit)};
});
function compareState(actual,ref){
 const maxDiff=(a,b)=>Math.max(...a.map((x,i)=>Math.abs(x-b[i])));
 assert.equal(actual.tick,ref.tick);assert.equal(actual.road,ref.road);
 assert.ok(maxDiff(actual.xyz,ref.xyz)<.001);
 assert.ok(maxDiff(actual.eye,ref.cameraEye)<.02);
 assert.ok(maxDiff(actual.front,ref.cameraFront)<.001);
 assert.ok(Math.abs(actual.speed-ref.speed)<.001);
}
function samePose(a,b){
 compareState(a,{tick:b.tick,road:b.road,xyz:b.xyz,speed:b.speed,cameraEye:b.eye,cameraFront:b.front});
}
function summarizeDepth(a,b){
 if(!a.available||!b.available) return {status:'DEPTH_UNAVAILABLE',comparable:false};
 assert.equal(a.width,b.width);assert.equal(a.height,b.height);
 assert.equal(a.stride,b.stride);assert.equal(a.samples.length,b.samples.length);
 let changed=0,farther=0,nearer=0;
 for(let i=0;i<a.samples.length;i++){
  if(a.samples[i]!==b.samples[i]){changed++;if(b.samples[i]>a.samples[i])farther++;else nearer++;}
 }
 return {status:'READBACK_COMPARISON_ONLY',comparable:true,
  sampleCount:a.samples.length,changed,fartherOnMasked:farther,nearerOnMasked:nearer,
  changedShare:changed/a.samples.length,
  caveat:'Native non-linear depth samples, NOT object-ID, physical clearance or human visibility'};
}
// No changes to original renderer or objects: read depth from its default WebGL2
// framebuffer into an isolated temporary framebuffer. ALL GL bindings restored.
// Some drivers forbid depth blit/readPixels: report this as HOLD, never invent samples.
async function readDepth(page){
 return page.evaluate(()=>{
  const canvas=document.querySelector('#view');
  const gl=canvas?.getContext('webgl2');
  if(!(gl instanceof WebGL2RenderingContext))
   return {available:false,reason:'NO_REAL_WEBGL2'};
  const w=gl.drawingBufferWidth,h=gl.drawingBufferHeight;
  const depthBits=gl.getParameter(gl.DEPTH_BITS),stencilBits=gl.getParameter(gl.STENCIL_BITS);
  const info={width:w,height:h,depthBits,stencilBits,stride:8};
  if(w<100||h<100||depthBits===0)
   return {...info,available:false,reason:'NO_DEFAULT_DEPTH_ATTACHMENT'};
  // Capture BOTH the active texture binding and unit-zero binding. Mutating
  // TEXTURE0 then restoring only the previously active unit is not safe.
  const saved={
   activeTexture:gl.getParameter(gl.ACTIVE_TEXTURE),
   activeBinding:gl.getParameter(gl.TEXTURE_BINDING_2D),
   read:gl.getParameter(gl.READ_FRAMEBUFFER_BINDING),
   draw:gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING),
   pack:gl.getParameter(gl.PACK_ALIGNMENT)};
  gl.activeTexture(gl.TEXTURE0);
  saved.unitZeroBinding=gl.getParameter(gl.TEXTURE_BINDING_2D);
  gl.activeTexture(saved.activeTexture);
  let texture=null,fbo=null,reason='DEPTH_READBACK_NOT_SUPPORTED';
  try{
   // Depth-only FBO: avoid touching displayed colour or enabling a new scene.
   gl.activeTexture(gl.TEXTURE0);
   for(const [internal,format,type,readType] of [
    [gl.DEPTH_COMPONENT24,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT,gl.UNSIGNED_INT],
    [gl.DEPTH24_STENCIL8,gl.DEPTH_STENCIL,gl.UNSIGNED_INT_24_8,gl.UNSIGNED_INT],
    [gl.DEPTH_COMPONENT16,gl.DEPTH_COMPONENT,gl.UNSIGNED_SHORT,gl.UNSIGNED_SHORT]
   ]){
    if(fbo)gl.deleteFramebuffer(fbo);if(texture)gl.deleteTexture(texture);
    fbo=gl.createFramebuffer();texture=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,internal,w,h,0,format,type,null);
    gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,
     internal===gl.DEPTH24_STENCIL8?gl.DEPTH_STENCIL_ATTACHMENT:gl.DEPTH_ATTACHMENT,
     gl.TEXTURE_2D,texture,0);
    // READ_BUFFER belongs to the bound READ framebuffer, not the DRAW one.
    // Never set gl.readBuffer(NONE) on the original default frame buffer.
    gl.drawBuffers([gl.NONE]);gl.readBuffer(gl.NONE);
    const complete=gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(complete!==gl.FRAMEBUFFER_COMPLETE){reason='INCOMPLETE_DEPTH_FBO_'+complete;continue;}
    // Never spin forever on CONTEXT_LOST_WEBGL.
    for(let i=0;i<12;i++)if(gl.getError()===gl.NO_ERROR)break;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER,null);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,fbo);
    gl.blitFramebuffer(0,0,w,h,0,0,w,h,gl.DEPTH_BUFFER_BIT,gl.NEAREST);
    const blitError=gl.getError();
    if(blitError!==gl.NO_ERROR){reason='DEPTH_BLIT_ERROR_'+blitError;continue;}
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER,fbo);
    const pixels=readType===gl.UNSIGNED_SHORT?new Uint16Array(w*h):new Uint32Array(w*h);
    gl.pixelStorei(gl.PACK_ALIGNMENT,4);
    gl.readPixels(0,0,w,h,gl.DEPTH_COMPONENT,readType,pixels);
    const readError=gl.getError();
    if(readError!==gl.NO_ERROR){reason='DEPTH_READ_PIXELS_ERROR_'+readError;continue;}
    const stride=8,samples=[];
    for(let y=0;y<h;y+=stride)for(let x=0;x<w;x+=stride){
     samples.push(pixels[y*w+x]);
    }
    const allNear=samples.every(x=>x===0),allFar=samples.every(x=>
      x===(readType===gl.UNSIGNED_SHORT?65535:4294967295));
    if(allNear||allFar){
     reason=allNear?'UNINFORMATIVE_ALL_ZERO_DEPTH':'UNINFORMATIVE_ALL_FAR_DEPTH';
     continue;
    }
    return {...info,available:true,method:internal===gl.DEPTH24_STENCIL8?
     'DEPTH24_STENCIL8_BLIT_DEPTH_COMPONENT_READ':
     internal===gl.DEPTH_COMPONENT24?'DEPTH_COMPONENT24_BLIT_READ':'DEPTH_COMPONENT16_BLIT_READ',
     samples,allNear,allFar,nonlinearDepth:true};
   }
   return {...info,available:false,reason};
  }catch(e){return {...info,available:false,reason:'DEPTH_EXCEPTION_'+String(e).slice(0,250)};}
  finally{
   gl.bindFramebuffer(gl.READ_FRAMEBUFFER,saved.read);
   gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,saved.draw);
   if(fbo)gl.deleteFramebuffer(fbo);if(texture)gl.deleteTexture(texture);
   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D,saved.unitZeroBinding);
   gl.activeTexture(saved.activeTexture);
   gl.bindTexture(gl.TEXTURE_2D,saved.activeBinding);
   gl.pixelStorei(gl.PACK_ALIGNMENT,saved.pack);
  }
 });
}
const result={
 schema:'dopagaki.K4AC.true-original-road5-webgl2-default-depth-capability/1',
 dateJST:'2026-11-02',sourceBlob:SOURCE,sourceHz:240,sourceB48:7,sourceB51:28,
 sourceCamera:'ball-lock-unfiltered-heading',originalA5Rendered:false,
 approach:'GPU default-depth non-destructive blit/read probe; no offscreen reconstruction',
 independentTrueDepthAcceptance:'HOLD_PENDING_CI',
 samplesAreNonLinearNotWorldDistance:true,perObjectID:'NOT_AVAILABLE',
 sourcePhysicsChanged:false,sourceCameraChanged:false,newModels:0,newColliders:0,
 officialARTAccepted:0,slope2DNARecognizedMetres:0,
 independentART:'NOT_TESTED_HOLD',oldK4K4RK4U:'REJECT',
 human:'NOT_TESTED',walkability:'NOT_RUN',SAT:'NOT_RUN',CCD:'NOT_RUN',
 FPS:'HOLD',release:'HOLD',merge:'HOLD',
 modes:[],errors:[]
};
await new Promise((yes,no)=>server.once('error',no).listen(0,'127.0.0.1',yes));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle',
  '--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const original=K4Z.sessions.find(s=>s.mode===mode);
  assert.equal(original.frames.length,41);
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage();
  const one={mode,road5:[],sourceErrors:[],masks:[],status:'HOLD'};
  page.on('pageerror',e=>one.sourceErrors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
    '/r19a6p4r2f5k4ab/?r19a1=on&k4ab=on&g5b=off&stage='+stage,
    {waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(x=>document.querySelector('#stage')?.value===x&&
    document.querySelector('#view')?.dataset.w9c1Isolated==='true',stage,{timeout:90000});
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset.cameraMode===
    'ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   for(let i=0;i<TICKS.length;i++){
    const tick=TICKS[i];
    await page.evaluate(t=>window.__r19a1PauseAtTick=t,tick);
    if(i===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view').dataset;
     return Number(d.r19a1PauseTick)===t &&
       d.k4abEffectiveMask==='none'&&JSON.parse(d.k4abAudit||'{}').currentNativeTick===t ||
       ['finished','failed'].includes(d.r19a1Status);
    },tick,{timeout:180000,polling:50});
    const state=await cameraState(page),ref=original.frames.find(f=>f.tick===tick);
    assert.ok(ref,'K4Z source missing');
    assert.equal(state.tick,tick);assert.equal(state.paused,tick);
    assert.equal(state.road,'p93-PRISM_CREST-01');
    assert.equal(state.B51,28);assert.equal(state.status,'running');
    assert.equal(state.mask,'none');assert.equal(state.camera,result.sourceCamera);
    assert.equal(state.audit.sourceBlob,SOURCE);
    assert.equal(state.audit.sourceB48,7);assert.equal(state.audit.sourceB51,28);
    assert.equal(state.audit.originalSceneA5R19A3OverlayRendered,false);
    compareState(state,ref.state);
    const png=await page.locator('#view').screenshot({
     path:path.join(DIR,'K4AC_'+mode+'_'+tick+'_UNMODIFIED_ORIGINAL_WEBGL2.png'),timeout:55000});
    const img={file:'K4AC_'+mode+'_'+tick+'_UNMODIFIED_ORIGINAL_WEBGL2.png',
     bytes:png.length,sha256:hash(png),originalK4ZSha:ref.sha256,
     exactFullPNG:hash(png)===ref.sha256 && png.length===ref.bytes};
    const depth=await readDepth(page);
    // The same source tick must remain visually unmodified AFTER the
    // GL readback attempt. This catches leaked texture/FBO/readBuffer state.
    const afterRaw=await page.locator('#view').screenshot({
     path:path.join(DIR,'K4AC_'+mode+'_'+tick+'_AFTER_DEPTH_PROBE_SOURCE.png'),timeout:55000});
    const after={file:'K4AC_'+mode+'_'+tick+'_AFTER_DEPTH_PROBE_SOURCE.png',
     bytes:afterRaw.length,sha256:hash(afterRaw)};
    const afterState=await cameraState(page);samePose(afterState,state);
    assert.equal(afterState.mask,'none');
    one.road5.push({tick,seconds:tick/240,state,originalPNG:img,
     afterDepthProbeSourcePNG:after,depth});
    if(tick===11040){
     for(const mask of MASKS){
      await page.evaluate(m=>window.__k4abMask=m,mask);
      await page.waitForFunction(m=>{
       const d=document.querySelector('#view').dataset;
       return d.k4abEffectiveMask===m&&
        JSON.parse(d.k4abAudit||'{}').currentNativeTick===11040;
      },mask,{timeout:20000,polling:40});
      const masked=await cameraState(page);samePose(masked,state);
      assert.equal(masked.mask,mask);
      const census=masked.audit.originalSceneLayers;
      const suppressed=Object.entries(census).filter(([,v])=>v.suppressedDrawCalls>0)
       .map(([layer,v])=>({layer,drawCalls:v.suppressedDrawCalls}));
      const maskedDepth=await readDepth(page);
      one.masks.push({mask,tick,sourceSameNativePose:true,
       sourceGroupStatus:suppressed.length?'ACTUAL_DRAW_CALL_SUPPRESSED':'NOT_DRAWN',
       suppressed,depth:maskedDepth,comparison:summarizeDepth(depth,maskedDepth)});
     }
     await page.evaluate(()=>window.__k4abMask='none');
     await page.waitForFunction(()=>document.querySelector('#view').dataset.k4abEffectiveMask==='none');
     const restored=await cameraState(page);samePose(restored,state);
     const restoredDepth=await readDepth(page);
     one.samePoseRestoration=summarizeDepth(depth,restoredDepth);
    }
   }
   assert.equal(one.road5.length,7);assert.equal(one.masks.length,6);
   assert.deepEqual(one.sourceErrors,[]);
   const usable=one.road5.every(x=>x.depth.available)&&
    one.masks.every(x=>x.depth.available)&&one.samePoseRestoration?.comparable;
   const nontrivial=one.masks.some(x=>x.comparison.changed>0);
   const restoredExactly=one.samePoseRestoration?.changed===0;
   one.status=usable&&nontrivial&&restoredExactly?'DEPTH_CAPABILITY_CANDIDATE':
    'DEPTH_UNAVAILABLE_OR_UNVALIDATED_HOLD';
  }catch(e){one.status='SOURCE_OR_PROBE_ERROR_HOLD';result.errors.push({
   mode,error:String(e.stack||e).slice(0,3500)});}
  finally{result.modes.push(one);await context.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 result.overallStatus=result.errors.length?'SOURCE_OR_PROBE_ERROR_HOLD':
  result.modes.every(m=>m.status==='DEPTH_CAPABILITY_CANDIDATE')?
  'DEPTH_SAMPLES_ONLY_PENDING_INDEPENDENT_AUDIT':'DEPTH_UNAVAILABLE_OR_UNVALIDATED_HOLD';
 fs.writeFileSync(path.join(DIR,'K4AC_NATIVE_GPU_DEPTH_CAPABILITY.json'),
  JSON.stringify(result,null,2)+'\n');
}
assert.deepEqual(result.errors,[]);
assert.equal(result.modes.length,2);
assert.equal(result.modes.reduce((n,x)=>n+x.road5.length,0),14);
assert.equal(result.modes.reduce((n,x)=>n+x.masks.length,0),12);
console.log('K4AC_SOURCE_VERIFIED_DEPTH_READBACK_STATUS',result.overallStatus,
 'ART_NOT_TESTED_HOLD');
