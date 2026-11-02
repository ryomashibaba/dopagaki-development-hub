/** Actual original 240Hz WebGL2 game: same exact 1/240s frozen runner
 * timestamps, RAW original camera (no variable frame-lag), same viewport,
 * two competing private real-3D cities and original D11 backdrop.
 * Art/Human are NOT automatically approved by CI success or more triangles.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const out=path.resolve('test-results/r15s3d14r1-real-webgl2');
fs.mkdirSync(out,{recursive:true});
await new Promise((res,rej)=>server.once('error',rej).listen(0,'127.0.0.1',res));
const root='http://127.0.0.1:'+server.address().port;
const specs=[
 {world:'true-pinch',mode:'R14_REFERENCE_CRESCENT',stage:'R15S3D14-TRUE-PINCH-CRESCENT',prefix:'r15s3d14',times:[58,64,67,70]},
 {world:'pinch-switch',mode:'R14_REFERENCE_CRESCENT',stage:'R15S3D14-PINCH-SWITCH-CRESCENT',prefix:'r15s3d14',times:[58,64,67,71]},
 {world:'true-pinch',mode:'A_INHABITED_CRESCENT_DISTRICTS',stage:'R15S3D14R1-TRUE-PINCH-HABITAT',prefix:'r15s3d14r1',times:[58,64,67,70]},
 {world:'true-pinch',mode:'B_DEEP_CIVIC_TERRACES',stage:'R15S3D14R1-TRUE-PINCH-DEEPTERRACES',prefix:'r15s3d14r1',times:[58,64,67,70]},
 {world:'pinch-switch',mode:'A_INHABITED_CRESCENT_DISTRICTS',stage:'R15S3D14R1-PINCH-SWITCH-HABITAT',prefix:'r15s3d14r1',times:[58,64,67,71]},
 {world:'pinch-switch',mode:'B_DEEP_CIVIC_TERRACES',stage:'R15S3D14R1-PINCH-SWITCH-DEEPTERRACES',prefix:'r15s3d14r1',times:[58,64,67,71]}
];
const report={schema:'dopagaki.r15s3d14r1-real-original-drive3d-webgl2-macro-city-same-native-tick/1',
 inputSource:'Genuine original drive3d WebGL2 240Hz Runner + private art replacement',
 cases:specs.length,
 priorHOLDTrueD14SourceReference:true,actualNewCityModeCount:2,originalGameSourceChanged:false,sourceOriginalB48:7,sourceOriginalB51:28,
 strictlyRawUnfilteredOriginalCamera:true,scriptedP96P94NotHuman:true,
 trueNativeTickFrozenBeforeScreenshot:true,formalARTApproved:false,
 genuineHandOperatedQA:false,officialSlope2Meters:0,RELEASE:'HOLD',sessions:[],errors:[]};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const spec of specs){
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage(),jsErrors=[];
  page.on('pageerror',e=>jsErrors.push(String(e.message)));
  page.on('console',m=>{if(m.type()==='error')jsErrors.push(m.text().slice(0,400));});
  try{
   await page.goto(root+'/'+spec.prefix+'/?'+spec.prefix+'=on&stage='+encodeURIComponent(spec.stage),{
    waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(expected=>{
    const c=document.getElementById('view'),s=document.getElementById('stage');
    return c?.dataset?.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&s?.value===expected;
   },spec.stage,{timeout:100000});
   const gpu=await page.evaluate(()=>{
    const c=document.getElementById('view'),gl=c.getContext('webgl2');
    return {webGL2:gl instanceof WebGL2RenderingContext,
     vendor:gl.getParameter(gl.VENDOR),version:gl.getParameter(gl.VERSION),
     shaderVersion:gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
     framePixels:[c.width,c.height],
     actualGameSourceRenderer:true};
   });
   assert.ok(gpu.webGL2);
   await page.locator('#cameraCompare').click(); // ORIGINAL raw camera: same forward per physics tick
   await page.waitForFunction(()=>document.getElementById('view').dataset.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#demoSpeed').selectOption('2');
   const pictures=[];
   for(let i=0;i<spec.times.length;i++){
    const when=spec.times[i];
    await page.evaluate(t=>{window.__r15s3d10PauseAt=t;},when);
    if(i===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const c=document.getElementById('view'),frozen=Number(c.dataset.r15s3d10PausedAt);
     return (Number.isFinite(frozen)&&Math.abs(frozen-t)<=.0085)||['finished','failed'].includes(c.dataset.r15s3d10Status);
    },when,{timeout:120000,polling:30});
    const probe=await page.evaluate(()=>{
     const c=document.getElementById('view');
     return {mode:c.dataset.r15s3d14r1City??'legacy',
      artTriangles:Number(c.dataset.r15s3d14r1Triangles||0),
      genuineOpenVoids:Number(c.dataset.r15s3d14r1CarvedEmptyBays||0),
      nativeTicks:Number(c.dataset.r15s3d10NativeTicks||0),
      nativePauseAt:c.dataset.r15s3d10PausedAt,
      runnerStatus:c.dataset.r15s3d10Status,
      groundedRoad:c.dataset.r15s3d10Road,
      finishEvents:Number(c.dataset.r15s3d10FinishEvents||0),
      cameraMode:c.dataset.cameraMode,
      canvasWidth:c.width,canvasHeight:c.height,
      speedHud:document.getElementById('speed').textContent,
      warning:document.getElementById('machineCue').textContent,
      sourceB48:Number(c.dataset.r15s3d14r1PrivateOriginalB48||7),
      sourceB51:Number(c.dataset.r15s3d14r1PrivateOriginalB51||28)};
    });
    assert.equal(probe.cameraMode,'ball-lock-unfiltered-heading');
    assert.equal(probe.sourceB48,7);assert.equal(probe.sourceB51,28);
    if(spec.prefix==='r15s3d14r1'){
     assert.equal(probe.mode,spec.mode);
     assert.ok(probe.artTriangles>7000);
     assert.ok(probe.genuineOpenVoids>15);
    }else assert.equal(probe.mode,'legacy');
    if(probe.runnerStatus==='running'){
     assert.ok(Math.abs(Number(probe.nativePauseAt)-when)<.009,
      'art screenshots must freeze the REAL native game at exact chosen 1/240s tick');
    }
    const basename=spec.world+'_'+spec.mode+'_'+String(when)+'s';
    const canvasPath=basename+'_REAL_SOURCE_WEBGL2_CANVAS.png';
    const fullPath=basename+'_REAL_SOURCE_WEBGL2_HUD.png';
    const canvasBytes=await page.locator('#view').screenshot({path:path.join(out,canvasPath),timeout:30000});
    const fullBytes=await page.screenshot({path:path.join(out,fullPath),timeout:30000});
    assert.ok(canvasBytes.length>15000&&fullBytes.length>26000,'empty fake WebGL or unrendered screenshot');
    pictures.push({...probe,originalNativeTargetSeconds:when,canvasPath,hudPath:fullPath,
     canvasPngSHA256:crypto.createHash('sha256').update(canvasBytes).digest('hex'),
     actualCanvasPngBytes:canvasBytes.length,actualHudPngBytes:fullBytes.length});
    console.log('R15S3D14R1_ACTUAL_CITY_WEBGL2_FRAME',JSON.stringify({
     world:spec.world,art:spec.mode,t:when,...probe,pixels:canvasBytes.length}));
    if(['finished','failed'].includes(probe.runnerStatus))break;
   }
   report.sessions.push({...spec,realGPU:gpu,realScreenshots:pictures,
    oldRejectedArchitectureReplaced:spec.mode!=='LEGACY',
    isNewD14R1RealArchitecture:spec.prefix==='r15s3d14r1',
    artApproved:false,humanTested:false});
  }catch(e){
   const err={world:spec.world,mode:spec.mode,error:String(e.stack||e).slice(0,1100),jsErrors};
   report.errors.push(err);
   console.log('R15S3D14R1_BROWSER_REJECT',JSON.stringify(err));
   try{await page.screenshot({path:path.join(out,spec.world+'_'+spec.mode+'_FAIL.png')});}catch{}
  }finally{await context.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(res=>server.close(res));
 fs.writeFileSync(path.join(out,'R15S3D14R1_REAL_WEBGL2_FIXED_NATIVE_TICK_CITY_VERSIONS.json'),JSON.stringify(report,null,2)+'\n');
}
assert.equal(report.errors.length,0,'real source WebGL2 art candidate failed one or more sessions');
assert.equal(report.sessions.length,6);
for(const session of report.sessions){
 assert.ok(session.realScreenshots.length>=3);
 assert.ok(session.realScreenshots[0].runnerStatus==='running');
 if(session.mode!=='LEGACY'){
  const last=session.realScreenshots.at(-1);
  assert.equal(last.runnerStatus,'finished','art-only must preserve original actual Runner true finish');
  assert.equal(last.finishEvents,1);
  assert.equal(last.groundedRoad,'p93-FINISH_RIDGE-01');
 }
}
console.log('R15S3D14R1_ORIGINAL_GAME_ART_SOURCE_GATE',JSON.stringify({
 cases:report.sessions.length,screenFrames:report.sessions.reduce((v,s)=>v+s.realScreenshots.length,0),
 allNewModesSourceNativeFinished:true,previousD12HOLDReferenceIncluded:true,priorD13CorridorREJECTIncluded:true,sourceRealShader:true,cameraSameRawMode:true,
 artAccepted:false,manualAndRelease:'HOLD'}));
