/** Real original drive3d WebGL2 private-only Chromium screenshots and HUD probes.
 * Distinct from fake canvas renderings: loads original shader, original camera,
 * B48/B51 meshes, source 240Hz Runner and original HUD in the browser.
 * No human QA: automated scripted source inputs cannot certify playable feel.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const dest=path.resolve('test-results/r15s3d10-real-webgl');
fs.mkdirSync(dest,{recursive:true});
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const worlds=['true-pinch','pinch-switch'];
const results={schema:'dopagaki.r15s3d10-private-original-WebGL2-runner-camera-HUD-playwright/1',
 baselineSourceArtifact:'R15S3D9_A_CONTINUOUS_NARROW_MACRO_REAL_NATIVE_FINISH_2_OF_2',
 browserWebGL2Requested:true,originalRenderer:'web/drive3d.mjs copied privately and only staged under dist-private/r15s3d10/',
 originalSourceGameChanged:false,originalNativePhysicsChanged:false,
 originalMovingObstaclesCount:28,originalRideableB48Count:7,
 sourceGameWebGLBrowserEvidenceNotHumanQA:true,
 artCertification:false,gameplayCertification:false,realRelease:false,
 worlds:{},failures:[]};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const world of worlds){
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push('PAGEERROR '+String(e.message).slice(0,300)));
  page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE '+m.text().slice(0,300));});
  const id='R15S3D10-'+world.toUpperCase();
  try{
   await page.goto(base+'/r15s3d10/?r15s3d10=on&stage='+encodeURIComponent(id),{waitUntil:'domcontentloaded',timeout:40000});
   await page.waitForFunction(()=>{
    const c=document.querySelector('#view'),s=document.querySelector('#stage');
    return c?.dataset?.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&s?.value?.startsWith('R15S3D10-');
   },null,{timeout:90000});
   const engine=await page.evaluate(()=>{
    const c=document.getElementById('view');
    const gl=c.getContext('webgl2');
    return {actualWebGL2:gl instanceof WebGL2RenderingContext,
     glVersion:gl.getParameter(gl.VERSION),
     canvasSize:{width:c.width,height:c.height},
     sourceStage:document.getElementById('stage').value,
     liveHudSpeed:document.getElementById('speed').textContent,
     sourceVisual:c.dataset.r15s3d10OriginalGame};
   });
   assert.ok(engine.actualWebGL2,'no actual source WebGL2');
   assert.equal(engine.sourceStage,id);
   await page.locator('#demoSpeed').selectOption('2');
   await page.locator('#demoRun').click();
   const screenshots=[],samples=[];
   for(const t of [17,34,48,60,70]){
    try{
     await page.waitForFunction(target=>{
      const c=document.querySelector('#view');
      const s=document.querySelector('#simTime');
      const current=Number.parseFloat(s?.textContent||'0');
      return current>=target||c?.dataset?.r15s3d10Status==='finished'||c?.dataset?.r15s3d10Status==='failed';
     },t,{timeout:110000,polling:300});
    }catch(e){errors.push('SCREENSHOT_TIME_GATE '+t+': '+String(e.message).slice(0,230));}
    const name=world+'_'+String(t).padStart(2,'0')+'s_actual_webgl2_original_game.png';
    const image=await page.screenshot({path:path.join(dest,name),timeout:25000});
    assert.ok(image.length>30000,'screenshot too small for meaningful actual game WebGL');
    const state=await page.evaluate(()=>{
     const c=document.querySelector('#view');
     const status=c.dataset.r15s3d10Status||'not-started';
     return {nativeTicks:Number(c.dataset.r15s3d10NativeTicks||0),
      realRunnerStatus:status,realRoad:c.dataset.r15s3d10Road,
      finishEvents:Number(c.dataset.r15s3d10FinishEvents||0),
      scriptOrManual:c.dataset.r15s3d10DriveMode,
      hudTime:document.getElementById('simTime').textContent,
      hudSpeedMps:document.getElementById('speed').textContent,
      hudGround:document.getElementById('ground').textContent,
      hudFps:document.getElementById('fps').textContent,
      warning:document.getElementById('machineCue')?.textContent||null,
      framePixels:[c.width,c.height]};
    });
    screenshots.push({file:name,bytes:image.length,atTargetSeconds:t});
    samples.push(state);
    console.log('R15S3D10_REAL_WEBGL_FRAME',JSON.stringify({world,target:t,screenshotBytes:image.length,...state}));
    if(['finished','failed'].includes(state.realRunnerStatus))break;
   }
   const last=samples.at(-1);
   results.worlds[world]={actualOriginalWebGL2Renderer:true,engine,
    screenShotEvidence:screenshots,realBrowserHudAndRunnerSamples:samples,
    actualOriginalNativeRunnerFinishInBrowser:last.realRunnerStatus==='finished',
    originalFinishEventRecordedInBrowser:last.finishEvents===1,
    actualScriptedAutoRunNotHumanInput:true,
    actualManualControlsPresent:true,
    actualWebGLVisualQualityApproved:false,
    originalGameCameraUsed:true,browserErrors:errors};
  }catch(e){
   errors.push('RENDERER_FAILURE '+String(e.stack||e).slice(0,1000));
   results.failures.push({world,reason:errors.at(-1)});
   results.worlds[world]={actualOriginalWebGL2Renderer:false,browserErrors:errors};
   try{await page.screenshot({path:path.join(dest,world+'_browser_failure.png'),timeout:10000});}catch{}
  }finally{
   await context.close();
  }
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(dest,'R15S3D10_ORIGINAL_WEBGL_BROWSER_EVIDENCE.json'),JSON.stringify(results,null,2)+'\n');
}
assert.equal(Object.keys(results.worlds).length,2);
assert.equal(results.failures.length,0,'real original WebGL2 capture failed in one or both worlds: '+JSON.stringify(results.failures));
console.log('R15S3D10_ACTUAL_SOURCE_GAME_WEBGL2',JSON.stringify({
 worldCount:2,worldSummary:Object.fromEntries(worlds.map(w=>[w,{frames:results.worlds[w].screenShotEvidence.length,
 terminal:results.worlds[w].realBrowserHudAndRunnerSamples.at(-1)?.realRunnerStatus,
 nativeFinish:results.worlds[w].actualOriginalNativeRunnerFinishInBrowser}])),
 artHumanCertified:false,originalGameModified:false}));
