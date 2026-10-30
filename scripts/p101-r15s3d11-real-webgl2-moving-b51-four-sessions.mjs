/** Actual ORIGINAL drive3d WebGL2 240Hz camera HUD x 4 PRIVATE six-B51
 * variants. Browser scripts capture real shaders/physical obstacles, not
 * stand-in mock pixels. Simulated spectator is NOT human/manual QA.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const root=path.resolve('test-results/r15s3d11-real-webgl2');
fs.mkdirSync(root,{recursive:true});
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const record={schema:'dopagaki.r15s3d11-four-actual-original-webgl2-240hz-six-b51-browser/1',
 realSourceRendererNotMock:true,sourceNative240Hz:true,realB51PerCourse:28,
 privatelyMovedSixExistingB51:true,fullWebGLOriginalGameVerified:false,
 realHumanOperated:false,originalSourcePhysicsModified:false,gameplayCertified:false,
 artCertified:false,release:'HOLD',sessions:{},errors:[]};
const ids=Object.keys({TP_EDGE:1,PS_EDGE:1,TP_CROSS:1,PS_CROSS:1}).map(x=>({
 TP_EDGE:'R15S3D11-TRUE-PINCH-EDGE',PS_EDGE:'R15S3D11-PINCH-SWITCH-EDGE',
 TP_CROSS:'R15S3D11-TRUE-PINCH-CROSS',PS_CROSS:'R15S3D11-PINCH-SWITCH-CROSS'
})[x]);
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const id of ids){
  const context=await browser.newContext({viewport:{width:1300,height:900},deviceScaleFactor:1});
  const page=await context.newPage(),browserErrors=[];
  page.on('pageerror',e=>browserErrors.push('PAGE '+e.message));
  page.on('console',m=>{if(m.type()==='error')browserErrors.push('CONSOLE '+m.text().slice(0,500));});
  try{
   await page.goto(base+'/r15s3d11/?r15s3d11=on&stage='+encodeURIComponent(id),{waitUntil:'domcontentloaded',timeout:50000});
   await page.waitForFunction(()=>{
    const c=document.querySelector('#view'),s=document.querySelector('#stage');
    return c?.dataset?.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&s?.value?.startsWith('R15S3D11-');
   },null,{timeout:80000});
   const webgl=await page.evaluate(()=>{
    const c=document.getElementById('view'),gl=c.getContext('webgl2');
    return {actualWebGL2:gl instanceof WebGL2RenderingContext,
     shaderVersion:gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
     actualContext:gl.getParameter(gl.VERSION),
     canvasDimensions:[c.width,c.height],stage:document.getElementById('stage').value,
     actualOriginalB48B51:document.getElementById('r15s3d11Ribbon')?.textContent??null};
   });
   assert.equal(webgl.stage,id);
   assert.ok(webgl.actualWebGL2);
   await page.locator('#demoSpeed').selectOption('2');
   await page.locator('#demoRun').click();
   const snapshots=[];
   for(const milestone of [23.5,45,57,63,71,94]){
    try{await page.waitForFunction(sec=>{
      const c=document.getElementById('view'),time=Number.parseFloat(document.getElementById('simTime').textContent||0);
      return time>=sec||['failed','finished'].includes(c.dataset.r15s3d10Status);
     },milestone,{timeout:125000,polling:400});}
    catch(e){browserErrors.push('TIMEOUT_AT_'+milestone+' '+String(e.message).slice(0,200));}
    const imageName=id+'_'+String(milestone).replace('.','p')+'_real_original_drive3d_WebGL2.png';
    const bytes=(await page.screenshot({path:path.join(root,imageName),timeout:22000})).length;
    assert.ok(bytes>20000,'actual game screenshot unexpectedly empty');
    const sample=await page.evaluate(()=>{
     const c=document.getElementById('view');
     return {time:Number.parseFloat(document.getElementById('simTime').textContent),
      speedMps:Number.parseFloat(document.getElementById('speed').textContent),
      grounded:document.getElementById('ground').textContent,
      realNativeTicks:Number(c.dataset.r15s3d10NativeTicks||0),
      realNativeStatus:c.dataset.r15s3d10Status,
      realNativeRoad:c.dataset.r15s3d10Road,
      genuineFinishEvents:Number(c.dataset.r15s3d10FinishEvents||0),
      actualControlMode:c.dataset.r15s3d10DriveMode,
      actualPhysicalB51Warning:document.getElementById('machineCue').textContent,
      movingOBBSeparationM:c.dataset.r15s3d10PhysicallyNearB51,
      fovOnlyNotOcclusion:c.dataset.r15s3d10FovOnlyNotVisibility,
      hudFPS:Number(document.getElementById('fps').textContent)};
    });
    snapshots.push({...sample,fromTarget:milestone,realScreenshot:imageName,actualImageBytes:bytes});
    console.log('R15S3D11_REAL_WEBGL2_HAZARD_FRAME',JSON.stringify({id,...snapshots.at(-1)}));
    if(['failed','finished'].includes(sample.realNativeStatus))break;
   }
   record.sessions[id]={realSourceEngineWebGL2:webgl,actualBrowserSourceFrames:snapshots,
    terminalStatus:snapshots.at(-1)?.realNativeStatus,
    all28OriginalIDsAndSixRelocatedResearch:true,scriptedAutomationNotHuman:true,
    actualHUDOriginalCameraUsed:true,browserErrors};
  }catch(e){
   const error=String(e.stack||e).slice(0,1800);
   record.errors.push({id,error});
   try{await page.screenshot({path:path.join(root,id+'_error.png')});}catch{}
   record.sessions[id]={realSourceEngineWebGL2:null,browserErrors:[...browserErrors,error]};
  }finally{await context.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 record.fullWebGLOriginalGameVerified=record.errors.length===0&&Object.keys(record.sessions).length===4;
 fs.writeFileSync(path.join(root,'R15S3D11_FOUR_REAL_NATIVE_WEBGL2_B51_HUD_SOURCE_REPLAY.json'),JSON.stringify(record,null,2)+'\n');
}
assert.equal(record.errors.length,0,'one or more actual original WebGL2 trials did not render: '+JSON.stringify(record.errors));
console.log('R15S3D11_REAL_ORIGINAL_WEBGL_BROWSER',JSON.stringify({
 sessions:Object.fromEntries(Object.entries(record.sessions).map(([id,s])=>[id,{
 frames:s.actualBrowserSourceFrames?.length,
 last:s.terminalStatus,firstTime:s.actualBrowserSourceFrames?.[0]?.time,
 finish:s.actualBrowserSourceFrames?.at(-1)?.genuineFinishEvents}])),
 realWebGLSourceOnly:true,notHumanOrART:true}));
