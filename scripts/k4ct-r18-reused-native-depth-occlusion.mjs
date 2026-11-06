/**
 * R18 lightweight depth-tested real-Chromium occlusion experiment.
 * Reuses the ACTUAL Blender R17 ART-REJECT triangle export from CI
 * #42297615144, no new Blender or proxy geometry, no source-camera edits.
 * Only omit genuine noncolliding DCC groups from isolated PRIVATE renderer.
 * Screenshot differentials are NOT physical depth readback/ART/human proof.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {decodeChromePng,pixelImpact} from './k4ct-r12-real-chromium-png-pixel-impact.mjs';
const out=path.resolve('test-results/k4ct-r18-depth-veto');
fs.mkdirSync(out,{recursive:true});
function gitBlob(file){
 const b=fs.readFileSync(file);
 return crypto.createHash('sha1').update(Buffer.concat([
  Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
}
assert.equal(gitBlob('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'),
 'af076d67492a677d2235e4730aef8cdf4808e106');
assert.equal(gitBlob('scripts/p101-k4ct-native-spillway-dcc.py'),
 '096fffbc1627915eb0122224955bb02cfba6b3ae',
 'active author must remain accepted-for-test R12A, not rejected R17');
const archiveDir='test-results/k4ct-contact-retry/';
const dcc=JSON.parse(fs.readFileSync(archiveDir+'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'));
const bridge=JSON.parse(fs.readFileSync(archiveDir+'K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json'));
assert.equal(dcc.triangles,31412);
assert.equal(dcc.nativeBlenderVersion,'4.0.2');
assert.equal(bridge.triangles,26804);
assert.equal(dcc.originalB48,7);assert.equal(dcc.originalB51,28);
assert.equal(dcc.newColliders,0);assert.equal(dcc.ART,'REJECT');
const privateFile='dist-private/k4ct/drive3d.mjs';
const source=fs.readFileSync(privateFile,'utf8');
const begin=' const r12Skip=window.__k4ctR12SkipGroup??null;';
const end=" canvas.dataset.k4ctR12SkippedGroup=r12Skip??'ALL';";
const first=source.indexOf(begin),last=source.indexOf(end,first);
assert(first>=0&&last>first&&source.indexOf(begin,first+1)<0);
assert(!source.includes('__k4ctR18Omissions'));
const patch=[
 ' // R18: study TRUE WebGL2 depth-tested rendering of R17 geometry.',
 ' // Skip DCC spans ONLY, retain source roads, B51 and original GL camera.',
 ' const r12Skip=window.__k4ctR12SkipGroup??null;',
 ' const omit=window.__k4ctR18Omissions;',
 ' if(Array.isArray(omit)){',
 "  if(r12Skip!==null)throw Error('R18 conflicting R12 skip');",
 '  const set=new Set(omit);let found=0;',
 "  if(set.size!==omit.length)throw Error('duplicate R18 group');",
 '  for(const part of K4CT_R12_NONROAD_GROUP_SPANS){',
 '   if(set.has(part.name)){found++;continue;}',
 '   gl.drawArrays(gl.TRIANGLES,part.first,part.count);',
 '  }',
 "  if(found!==set.size)throw Error('R18 unknown group');",
 "  canvas.dataset.k4ctR18Omissions=[...set].sort().join('|')||'NONE';",
 ' }else if(r12Skip===null){',
 '  gl.drawArrays(gl.TRIANGLES,0,k4ctR9MaterialVertexCount);',
 ' }else{',
 '  let found=false;',
 '  for(const part of K4CT_R12_NONROAD_GROUP_SPANS){',
 '   if(part.name===r12Skip){found=true;continue;}',
 '   gl.drawArrays(gl.TRIANGLES,part.first,part.count);',
 '  }',
 "  if(!found)throw Error('unknown R12 group '+r12Skip);",
 ' }'
].join('\n')+'\n';
fs.writeFileSync(privateFile,source.slice(0,first)+patch+source.slice(last));
const groups=Object.keys(dcc.objects).filter(x=>!x.startsWith('00_'));
const names=Object.fromEntries(['01','21','25','27'].map(k=>{
 const matched=groups.filter(x=>x.startsWith(k+'_'));
 assert.equal(matched.length,1);return [k,matched[0]];
}));
const trials={
 BASE:[],NO27:['27'],NO21:['21'],NO21_27:['21','27'],
 NO25:['25'],NO25_27:['25','27'],
 NO01:['01'],NO01_27:['01','27'],
 NO21_25:['21','25'],NO21_25_27:['21','25','27'],
 NO01_21_25:['01','21','25'],NO01_21_25_27:['01','21','25','27']
};
const records=[];
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
 '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const page=await ctx.newPage(),errors=[];
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
 async function paused(sec){
  await page.waitForFunction(sec=>{
   const c=document.getElementById('view'),tick=Number(c.dataset.r15s3d10NativeTicks);
   return (tick>=Math.floor(sec*240)-2&&
    Math.abs(Number(c.dataset.r15s3d10PausedAt)-sec)<.009&&
    c.dataset.r15s3d10Status==='running')||
    ['failed','finished'].includes(c.dataset.r15s3d10Status);
  },sec,{timeout:120000,polling:50});
  assert.equal(await page.locator('#view').getAttribute('data-r15s3d10-status'),'running');
 }
 await paused(63.70);
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode===
  'ORIGINAL_MANUAL_UNCERTIFIED',undefined,{timeout:15000});
 async function advance(sec,wasPaused=true){
  await page.evaluate(s=>window.__r15s3d10PauseAt=s,sec);
  if(wasPaused)await page.locator('#pause').click();
  await paused(sec);
 }
 async function capture(sec){
  const tick=await page.evaluate(()=>Number(document.getElementById('view').dataset.r15s3d10NativeTicks));
  assert(Math.abs(tick-sec*240)<=2);
  const glState=await page.evaluate(()=>{
   const c=document.getElementById('view'),gl=c.getContext('webgl2');
   return {actualWebGL2:gl instanceof WebGL2RenderingContext,
    nativeB51:Number(c.dataset.g4e7yRetainedMachines),
    depthBits:gl.getParameter(gl.DEPTH_BITS),depthTestEnabled:gl.isEnabled(gl.DEPTH_TEST),
    depthWriteMask:gl.getParameter(gl.DEPTH_WRITEMASK),
    originalSource:c.dataset.r15s3d10OriginalGame,
    rasterPixels:[gl.drawingBufferWidth,gl.drawingBufferHeight]};
  });
  assert(glState.actualWebGL2&&glState.depthBits>0&&glState.depthTestEnabled);
  assert.equal(glState.nativeB51,28);
  const images=new Map(),saved={};
  for(const [label,ids] of Object.entries(trials)){
   const omitted=ids.map(k=>names[k]).sort(),tag=omitted.join('|')||'NONE';
   await page.evaluate(v=>{window.__k4ctR18Omissions=v;},omitted);
   await page.waitForFunction(tag=>{
    const c=document.getElementById('view');
    return c.dataset.k4ctR18Omissions===tag &&
      c.dataset.k4ctR9Material==='REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2';
   },tag,{timeout:14000,polling:50});
   assert.equal(await page.evaluate(()=>Number(
    document.getElementById('view').dataset.r15s3d10NativeTicks)),tick);
   const png=await page.screenshot({type:'png'});
   images.set(label,decodeChromePng(png));
   if(['BASE','NO27','NO21_25','NO21_25_27','NO01_21_25','NO01_21_25_27'].includes(label)){
    const filename='R18_T'+String(sec).replace('.','_')+'_'+label+'.png';
    fs.writeFileSync(path.join(out,filename),png);saved[label]=filename;
   }
  }
  await page.evaluate(()=>{window.__k4ctR18Omissions=[];});
  await page.waitForFunction(()=>document.getElementById('view')
    ?.dataset.k4ctR18Omissions==='NONE',undefined,{timeout:14000});
  const restored=decodeChromePng(await page.screenshot({type:'png'}));
  const impact=(a,b)=>pixelImpact(images.get(a),images.get(b));
  const r={timeSec:sec,nativeTick:tick,glState,rawFiles:saved,
   originalGroup27:impact('BASE','NO27'),
   after21:impact('NO21','NO21_27'),
   after25:impact('NO25','NO25_27'),
   after01:impact('NO01','NO01_27'),
   after21and25:impact('NO21_25','NO21_25_27'),
   after01and21and25:impact('NO01_21_25','NO01_21_25_27'),
   original21:impact('BASE','NO21'),original25:impact('BASE','NO25'),
   original01:impact('BASE','NO01'),
   rock21and25:impact('BASE','NO21_25'),
   rock01and21and25:impact('BASE','NO01_21_25'),
   reproducibility:pixelImpact(images.get('BASE'),restored)};
  assert(r.reproducibility.changedPctRGBgt25<.5,'same-tick renderer not reproducible');
  records.push(r);
 }
 // Original take-over resumes from 63.70; no first extra pause.
 await advance(65.25,false);await capture(65.25);
 await page.keyboard.down('KeyD');await advance(65.36,true);await page.keyboard.up('KeyD');
 await advance(65.79,true);
 await page.keyboard.down('KeyD');await advance(65.91,true);await page.keyboard.up('KeyD');
 await advance(66.35,true);await capture(66.35);
 await advance(68.05,true);await capture(68.05);
 assert.deepEqual(records.map(r=>r.nativeTick),[15660,15924,16332]);
 assert.deepEqual(errors,[]);
 const summary=records.map(r=>({
  timeSec:r.timeSec,
  group27OriginalChangedPct:r.originalGroup27.changedPctRGBgt25,
  group27AfterRock21And25RemovedChangedPct:r.after21and25.changedPctRGBgt25,
  group27AfterRock01And21And25RemovedChangedPct:r.after01and21and25.changedPctRGBgt25,
  rock21and25ChangedPct:r.rock21and25.changedPctRGBgt25,
  restoredBaselineChangedPct:r.reproducibility.changedPctRGBgt25
 }));
 const result={
  schema:'k4ct-r18-reused-r17-real-depth-tested-chase-occlusion-v1',
  R17Artifact:13542933482,R17NativeCI:42297615144,
  nonadoptedR17BlenderArt:true,R17ActualTriangles:31412,
  activeSourceDccRestoredR12ABlob:'096fffbc1627915eb0122224955bb02cfba6b3ae',
  originalGameGitBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
  sourceRoad5PhysicalSHA256:dcc.sourcePhysicalRoad5SHA256,
  genuineBlenderBSDFAttributeMesh:true,realOriginalChromiumWebGL2:true,
  actualWebGLDepthTesting:true,numericDepthBufferReadback:false,
  actual240HzOriginalCamera:true,nativeB48:7,movingB51:28,
  scenarioCountPerRealFrame:Object.keys(trials).length,
  screenPixelDiffDoesNotProveExactRasterOwnership:true,
  noNew3DArtCreated:true,noSourcePhysicsCameraB51OrOriginalCodeChanged:true,
  sourceNativeTimeSec:[65.25,66.35,68.05],
  groupIDs:names,rawResults:records,comparisons:summary,
  formalArtAdopted:0,slope2DNAmeters:0,ART:'REJECT',HUMAN:'HOLD',
  SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  note:'All frame variants are actual original GL depth-tested draws. Hidden rock reveals underlying geometry: percentage changes are influence, not exact group-27 visibility, hazard safety, or human artistic quality.'
 };
 fs.writeFileSync(path.join(out,'K4CT_R18_ACTUAL_GL_OCCLUSION_VETO.json'),
  JSON.stringify(result,null,2)+'\n');
 console.log('R18_NATIVE_DEPTH_TESTED_OCCLUSION_PASS',JSON.stringify(summary));
 await ctx.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
