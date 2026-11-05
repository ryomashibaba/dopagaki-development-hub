/** Source-Chromium WebGL2 original real 240Hz runner, baseline vs one scene.
 * Screenshots are raw, no canvas painting, upscaling or surrogate camera.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const out=path.resolve('test-results/k4cq-integrated');fs.mkdirSync(out,{recursive:true});
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port;
const cases=[
 {name:'BASELINE_R15S3D10',prefix:'k4cq',q:'k4cq',stage:'R15S3D10-TRUE-PINCH'},
 {name:'K4CQ_RESEARCH',prefix:'k4cq',q:'k4cq',stage:'K4CQ-ONE-ROAD5-TIDAL-APEX'}
];
const report={schema:'k4cq-true-webgl2-original-game-native-240hz-one-sector-v1',
 humanPerformed:false,originalSourceCameraAndPhysics:true,sourceRoad5AlreadySeparateResearchVariant:true,
 officialArtAdopted:0,slope2DNA:0,ART:'HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',sessions:[],failures:[]};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const spec of cases){
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,250));});
  const pictures=[];
  try{
   await page.goto(url+'/'+spec.prefix+'/?'+spec.q+'=on&stage='+encodeURIComponent(spec.stage),{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(id=>{
    const c=document.getElementById('view');
    return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&document.getElementById('stage').value===id;
   },spec.stage,{timeout:90000});
   const gl=await page.evaluate(()=>{
    const canvas=document.getElementById('view'),g=canvas.getContext('webgl2');
    return {actualWebGL2:g instanceof WebGL2RenderingContext,version:g?.getParameter(g.VERSION),
      renderedSector:canvas.dataset.k4cqScene||'BASELINE',triangles:Number(canvas.dataset.k4cqTriangles||0)};
   });
   assert.ok(gl.actualWebGL2,'real original WebGL2 context is unavailable');
   if(spec.name==='K4CQ_RESEARCH'){
    assert.equal(gl.renderedSector,'K4CQ_ONE_ROAD5_TO6_COASTAL_LANDING_R2_PRIVATE');
    assert.ok(gl.triangles>1000);
   }
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.getElementById('view').dataset.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#demoSpeed').selectOption('2');
   for(const [index,time] of [58,64,67].entries()){
    await page.evaluate(t=>window.__r15s3d10PauseAt=t,time);
    if(index===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
      const c=document.getElementById('view'),p=Number(c.dataset.r15s3d10PausedAt);
      return Number.isFinite(p)&&Math.abs(p-t)<.009||['failed','finished'].includes(c.dataset.r15s3d10Status);
    },time,{timeout:120000,polling:40});
    const v=await page.evaluate(()=>{
      const c=document.getElementById('view');return {
       nativeTicks:Number(c.dataset.r15s3d10NativeTicks||0),pauseAt:Number(c.dataset.r15s3d10PausedAt),
       runnerStatus:c.dataset.r15s3d10Status,realRoad:c.dataset.r15s3d10Road,
       finishedEvents:Number(c.dataset.r15s3d10FinishEvents||0),
       original240HzScriptMode:c.dataset.r15s3d10DriveMode,
       sourceCameraMode:c.dataset.cameraMode,
       sourceSpeedHud:document.getElementById('speed').textContent,
       frameFpsHud:document.getElementById('fps').textContent};
    });
    assert.equal(v.sourceCameraMode,'ball-lock-unfiltered-heading');
    assert.equal(v.runnerStatus,'running','native physical run terminated before target screenshot');
    assert.ok(Math.abs(v.pauseAt-time)<.009,'not a frozen actual native 1/240 tick');
    const file=spec.name+'_T'+time+'_TRUE_WEBGL2.png';
    const bytes=await page.screenshot({path:path.join(out,file),timeout:30000});
    assert.ok(bytes.length>30000,'not a meaningfully rendered original game screenshot');
    pictures.push({file,bytes:bytes.length,seconds:time,...v});
   }
   assert.deepEqual(errors,[],spec.name+' browser page/console errors');
   report.sessions.push({...spec,gpu:gl,pictures,jsErrors:errors});
  }catch(e){report.failures.push({name:spec.name,reason:String(e.stack||e).slice(0,1100),jsErrors:errors});
   try{await page.screenshot({path:path.join(out,spec.name+'_ERROR.png')});}catch{}
  }finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(out,'K4CQ_REAL_CHROMIUM_RESULT.json'),JSON.stringify(report,null,2)+'\n');
}
assert.equal(report.failures.length,0,'REAL Chromium 240Hz evidence failed: '+JSON.stringify(report.failures));
assert.equal(report.sessions.length,2);
console.log('K4CQ_TRUE_CHROMIUM_SOURCE_240HZ',JSON.stringify({sessions:report.sessions.length,frames:report.sessions.reduce((v,s)=>v+s.pictures.length,0),originalsProtected:true,ART:'HOLD',HUMAN:'HOLD'}));
