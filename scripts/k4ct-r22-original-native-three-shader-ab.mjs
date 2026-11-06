/**
 * R22: TRUE original Chromium source 240Hz 3-tick A/B of
 * R21 exact Blender node-attribute bridge, comparing 3 PRIVATE shader modes.
 * 0=baseline identical R21 original, 1=maritime material-response only,
 * 2=mode1 plus actual harbor-water IDs. Original game, 28 B51, all B48,
 * camera, 240Hz input and release gates NEVER modified.
 * This is neither human ART assessment nor PBR validation.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {decodeChromePng,pixelImpact} from './k4ct-r12-real-chromium-png-pixel-impact.mjs';

const OUT=path.resolve('test-results/k4ct-r22-native-shader');
fs.mkdirSync(OUT,{recursive:true});
const r21proof=JSON.parse(fs.readFileSync(
 'test-results/k4ct-r22-proofs/K4CT_R22_REAL_R21_BLENDER_BRIDGE_SHA256_PROVENANCE.json'));
const shaderproof=JSON.parse(fs.readFileSync(
 'test-results/k4ct-r22-proofs/K4CT_R22_PRIVATE_SHADER_ONLY_PATCH.json'));
assert(r21proof.reconstructedTrueR21BridgeExactlyByteIdentical);
assert.equal(shaderproof.trueR21MaterialBridgeSha256,r21proof.reconstructedR9Sha256);
const dcc=JSON.parse(fs.readFileSync(
 'test-results/k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'));
assert.equal(dcc.triangles,25700);assert.equal(Object.keys(dcc.objects).length,43);
assert.equal(dcc.originalB48,7);assert.equal(dcc.originalB51,28);assert.equal(dcc.newColliders,0);
const game=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const original=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+game.length+'\0'),game])).digest('hex');
assert.equal(original,'af076d67492a677d2235e4730aef8cdf4808e106');
const ticks=[15660,15924,16332],times=[65.25,66.35,68.05];
const results=[],modes={0:'R21_UNCHANGED_SHADER',1:'MARINE_MATERIAL_RESPONSE',2:'MARINE_WATER_AND_MATERIAL_RESPONSE'};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const page=await context.newPage(),pageErrors=[];
 page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+
  '/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',
  {waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
   c.dataset.k4ctNativeDcc==='GENUINE_BLENDER_EDITABLE_NONCOLLIDING'&&
   c.dataset.k4ctR9MaterialProgram==='R9_REAL_BLENDER_ATTRIBUTES_SOURCE_SAFE'&&
   window.__k4ctR12OriginalNonroadGroupNames?.length===42;
 },undefined,{timeout:90000});
 await page.locator('#cameraCompare').click();
 await page.locator('#demoSpeed').selectOption('2');
 await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
 await page.locator('#demoRun').click();
 async function paused(s){
  await page.waitForFunction(sec=>{
   const c=document.getElementById('view');
   const tick=Number(c.dataset.r15s3d10NativeTicks);
   return (tick>=Math.floor(sec*240)-2&&
    Math.abs(Number(c.dataset.r15s3d10PausedAt)-sec)<.009&&
    c.dataset.r15s3d10Status==='running')||
    ['failed','finished'].includes(c.dataset.r15s3d10Status);
  },s,{timeout:120000,polling:50});
  assert.equal(await page.locator('#view').getAttribute('data-r15s3d10-status'),'running',
    'Original native stage terminal before '+s);
 }
 await paused(63.70);
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view')
  .dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',
  undefined,{timeout:15000});
 async function advance(sec,previouslyPaused){
  await page.evaluate(v=>{window.__r15s3d10PauseAt=v;},sec);
  if(previouslyPaused)await page.locator('#pause').click();
  await paused(sec);
 }
 async function capture(sec,index){
  const state=await page.evaluate(()=>{
   const c=document.getElementById('view'),gl=c.getContext('webgl2');
   return {nativeTick:Number(c.dataset.r15s3d10NativeTicks),
    realWebGL2:gl instanceof WebGL2RenderingContext,
    depthBits:gl.getParameter(gl.DEPTH_BITS),
    depthTest:gl.isEnabled(gl.DEPTH_TEST),
    depthWrite:gl.getParameter(gl.DEPTH_WRITEMASK),
    originalGame:c.dataset.r15s3d10OriginalGame,
    originalB51:Number(c.dataset.g4e7yRetainedMachines),
    material:c.dataset.k4ctR9Material,
    renderer:c.dataset.k4ctNativeDcc,
    cameraMode:c.dataset.k4ctR9MaterialProgram};
  });
  assert.equal(state.nativeTick,ticks[index]);
  assert(state.realWebGL2&&state.depthBits>0&&state.depthTest&&state.depthWrite);
  assert.equal(state.originalB51,28);
  assert.equal(state.originalGame,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.renderer,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  assert.equal(state.material,'REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2');
  await page.evaluate(()=>{window.__k4ctVisualABMode='R7_DCC';
   window.__k4ctSuppressK4CSGateOnly=true;window.__k4ctR12SkipGroup=null;});
  const frames=new Map(),names={};
  for(const mode of [0,1,2]){
   await page.evaluate(m=>{window.__k4ctR22ShaderMode=m;},mode);
   await page.waitForFunction(m=>{
    const c=document.getElementById('view');
    return c?.dataset.k4ctR22ShaderMode===String(m)&&
     c.dataset.k4ctR9Material==='REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2'&&
     c.dataset.k4ctR12SkippedGroup==='ALL';
   },mode,{timeout:14000,polling:50});
   assert.equal(await page.evaluate(()=>Number(
    document.getElementById('view').dataset.r15s3d10NativeTicks)),ticks[index]);
   const png=await page.screenshot({type:'png'});
   frames.set(mode,decodeChromePng(png));
   const filename='R22_NATIVE_T'+String(sec).replace('.','_')+
    '_MODE'+mode+'_'+modes[mode]+'.png';
   fs.writeFileSync(path.join(OUT,filename),png);
   names[mode]=filename;
  }
  await page.evaluate(()=>{window.__k4ctR22ShaderMode=0;});
  await page.waitForFunction(()=>document.getElementById('view')
   ?.dataset.k4ctR22ShaderMode==='0',undefined,{timeout:14000,polling:50});
  const restored=decodeChromePng(await page.screenshot({type:'png'}));
  const parity=pixelImpact(frames.get(0),restored);
  assert(parity.changedPctRGBgt25<.5,'R22 same native tick material mode not reversible');
  const R21source=path.resolve('test-results/k4ct-r22-source-r21/k4ct-r21-native-blockout/' +
    'R21_TRUE_SOURCE_CHASE_T'+String(sec).replace('.','_')+'_CLEAN_RAW.png');
  assert(fs.existsSync(R21source),'Actual original R21 RAW not available');
  const r21Original=pixelImpact(decodeChromePng(fs.readFileSync(R21source)),frames.get(0));
  assert(r21Original.changedPctRGBgt25<.5,
   'R22 shader mode0 does not reproduce genuine original R21 scene');
  results.push({
   originalTimeSec:sec,originalSourceTick:ticks[index],state,
   actualRawFiles:names,
   baselineVsR21TrueSource:r21Original,
   materialMode1VsBaseline:pixelImpact(frames.get(0),frames.get(1)),
   marineWaterMode2VsBaseline:pixelImpact(frames.get(0),frames.get(2)),
   mode2VsMaterialMode1:pixelImpact(frames.get(1),frames.get(2)),
   restoredBaselineParity:parity
  });
 }
 await advance(65.25,false);await capture(65.25,0);
 await page.keyboard.down('KeyD');
 await advance(65.36,true);
 await page.keyboard.up('KeyD');
 await advance(65.79,true);
 await page.keyboard.down('KeyD');
 await advance(65.91,true);
 await page.keyboard.up('KeyD');
 await advance(66.35,true);await capture(66.35,1);
 await advance(68.05,true);await capture(68.05,2);
 assert.deepEqual(results.map(x=>x.originalSourceTick),ticks);
 assert.deepEqual(pageErrors,[],'Native original Chromium page errors');
 const report={
  schema:'k4ct-r22-original-source-private-r21-genuine-blender-marine-shader-ab-v1',
  sourceExactR21MaterialBridgeSHA256:r21proof.reconstructedR9Sha256,
  unchangedGeometrySHA256:r21proof.R20BlenderMeshGeometrySHA256,
  originalGameGitBlob:original,
  trueOriginalCameraNative240Hz:true,
  realOriginalChromiumWebGL2:true,
  originalB48:7,originalB51:28,newColliders:0,
  source3Ticks:ticks,originalBlenderEditableMeshes:43,realTriangles:25700,
  noNew3DMeshOrArtistModels:true,
  sourceWebGL2ShaderAndPhysicsUnmodified:true,
  shaderPatchPrivateOnly:true,fullPBR:false,
  noFormalArtAdoption:true,
  shaderModes:modes,trueSourceAB:results,
  noHumanHazardReadabilityCertification:true,
  sampledOnlyThreeNativeSourceMoments:true,
  ART:'REJECT',formalARTAdopted:0,slope2DNAmeters:0,
  HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',
  RELEASE:'HOLD',MERGE:'HOLD',
  methodLimit:'Same-tick GL depth-tested pixel changes are material/shading visual sensitivity; not art quality, true visible ownership, physical PBR or moving B51 human near-miss readability.'
 };
 fs.writeFileSync(path.join(OUT,'K4CT_R22_NATIVE_SOURCE_THREE_MODE_SHADER_AB.json'),
  JSON.stringify(report,null,2)+'\n');
 console.log('R22_ORIGINAL_240HZ_REAL_GL_MATERIAL_3_MODE_PASS',
  JSON.stringify(results.map(x=>({
   sec:x.originalTimeSec,baselineParity:x.baselineVsR21TrueSource.changedPctRGBgt25,
   mode1_RGB25:x.materialMode1VsBaseline.changedPctRGBgt25,
   mode2_RGB25:x.marineWaterMode2VsBaseline.changedPctRGBgt25,
   mode2_RGB10:x.marineWaterMode2VsBaseline.changedPctRGBgt10
  }))));
 await context.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
