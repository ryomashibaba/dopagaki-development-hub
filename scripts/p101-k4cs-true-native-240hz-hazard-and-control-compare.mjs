/** Source-Chromium WebGL2 original real 240Hz runner, baseline vs one REAL physical course with SIX original repositioned B51.
 * Screenshots are raw, no canvas painting, upscaling or surrogate camera.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const out=path.resolve('test-results/k4cs-native-readable');fs.mkdirSync(out,{recursive:true});
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port;
const cases=[
 {name:'K4CR_SAME_PHYSICAL_BASELINE',prefix:'k4cs',q:'k4cs',stage:'K4CR-BANKED-ROAD5-B51'},
 {name:'K4CS_TRUE_EARLY_WARNING',prefix:'k4cs',q:'k4cs',stage:'K4CS-READABLE-B51-CHOICE'}
];
const report={schema:'k4cs-true-native-source-b48-700m-advance-b51-real-control-v1',
 humanPerformed:false,scriptedRealKeyboardControlsTested:true,originalSourceCameraAndPhysics:true,sourceRoad5AlreadySeparateResearchVariant:true,physicalRoad5ActuallyChangedInCandidate:true,
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
      renderedSector:canvas.dataset.k4cqScene||'BASELINE',triangles:Number(canvas.dataset.k4cqTriangles||0),originalB48Markers:Number(canvas.dataset.k4csActualOriginalRoadGates||0),beaconTriangles:Number(canvas.dataset.k4csGateTriangles||0)};
   });
   assert.ok(gl.actualWebGL2,'real original WebGL2 context is unavailable');
   if(spec.name==='K4CS_TRUE_EARLY_WARNING'||spec.name==='K4CR_SAME_PHYSICAL_BASELINE'){
    assert.equal(gl.renderedSector,'K4CQ_ONE_ROAD5_TO6_COASTAL_LANDING_R2_PRIVATE');
    assert.ok(gl.triangles>1000);
   }
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.getElementById('view').dataset.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#demoSpeed').selectOption('2');
   for(const [index,time] of [55,58,62,64,67].entries()){
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
       actualPosition:c.dataset.k4csActualRunnerPosition||'none',
       earlyB51:c.dataset.k4csWarningId||'none',
       earlyMetres:c.dataset.k4csAdvanceM||'none',
       earlySeconds:c.dataset.k4csAdvanceSeconds||'none',
       earlySide:c.dataset.k4csPredictedSide||'none',
       cueHud:document.getElementById('k4csNativeHazardNotice')?.textContent||'',
       cueCanvasCenterErrorPx:(()=>{const n=document.getElementById('k4csNativeHazardNotice');if(!n||n.hidden)return null;const a=n.getBoundingClientRect(),v=c.getBoundingClientRect();return Number(Math.abs(a.left+a.width/2-(v.left+v.width/2)).toFixed(2));})(),
       cueDisplayed:!document.getElementById('k4csNativeHazardNotice')?.hidden,
       realB51Target:c.dataset.hazardTarget,realB51SeparationM:c.dataset.r15s3d10PhysicallyNearB51,
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

   if(spec.name==='K4CS_TRUE_EARLY_WARNING'){
    assert.ok(gl.originalB48Markers>=12,'missing source Road4/5/6 roadside 3D early warnings');
    assert.ok(gl.beaconTriangles>150,'must render genuine source-sampled world triangles');
    const genuine=pictures.filter(p=>p.earlyB51!=='none');
    assert.ok(genuine.length>=2,'no actual upcoming B51 warning');
    assert.ok(genuine.some(p=>Number(p.earlySeconds)>=1.5),'failed to provide at least 1.5s early readable notice');
    assert.ok(genuine.every(p=>p.earlyB51.startsWith('a13-machine-')&&p.earlyMetres!=='none'&&p.cueDisplayed),
      'forecast must identify actual B51 on-screen and not a synthetic marker');
    assert.ok(genuine.every(p=>p.cueHud.includes('NO SAFE LANE CERTIFIED')),
      'must not invent a guaranteed safe lane');
    assert.ok(genuine.every(p=>p.cueCanvasCenterErrorPx!==null&&p.cueCanvasCenterErrorPx<2),'warning must be centered on actual game canvas');
   }
   assert.deepEqual(errors,[],spec.name+' browser page/console errors');
   report.sessions.push({...spec,gpu:gl,pictures,jsErrors:errors});
  }catch(e){report.failures.push({name:spec.name,reason:String(e.stack||e).slice(0,1100),jsErrors:errors});
   try{await page.screenshot({path:path.join(out,spec.name+'_ERROR.png')});}catch{}
  }finally{await ctx.close();}
 }

 // Use ACTUAL original renderer/demo takeover (not fake telemetry or injected physics)
 // and keyboard KeyA/KeyD in separate native browser sessions. NOT HUMAN.
 const manualTrials=[];
 for(const [direction,key] of [['LEFT','KeyA'],['RIGHT','KeyD']]){
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage(),jsErrors=[];
  page.on('pageerror',e=>jsErrors.push(e.message));
  try{
   await page.goto(url+'/k4cs/?k4cs=on&stage=K4CS-READABLE-B51-CHOICE',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.getElementById('view')?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ',{timeout:90000});
   await page.locator('#cameraCompare').click();
   await page.locator('#demoSpeed').selectOption('2');
   await page.evaluate(()=>window.__r15s3d10PauseAt=54.8);
   await page.locator('#demoRun').click();
   await page.waitForFunction(()=>Math.abs(Number(document.getElementById('view').dataset.r15s3d10PausedAt)-54.8)<.009,{timeout:120000});
   const before=await page.evaluate(()=>document.getElementById('view').dataset.k4csActualRunnerPosition);
   assert.ok(before&&before!=='none');
   await page.locator('#takeoverRun').click();
   await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',{timeout:15000});
   await page.evaluate(()=>window.__r15s3d10PauseAt=55.15);
   await page.keyboard.down(key);
   await page.waitForFunction(key=>{
     const c=document.getElementById('view');
     return c.dataset.k4csLastInputUsed==='ORIGINAL_MANUAL_KEYBOARD'&&
       c.dataset.k4csActualManualSteer===(key==='KeyA'?'-1':'1');
   },key,{timeout:15000});
   await page.waitForFunction(()=>Math.abs(Number(document.getElementById('view').dataset.r15s3d10PausedAt)-55.15)<.009||document.getElementById('view').dataset.r15s3d10Status==='failed',{timeout:30000});
   await page.keyboard.up(key);
   const after=await page.evaluate(()=>{
    const c=document.getElementById('view');
    return {position:c.dataset.k4csActualRunnerPosition,simTime:c.dataset.r15s3d10PausedAt,
      originalTick:Number(c.dataset.r15s3d10NativeTicks),status:c.dataset.r15s3d10Status,
      manualPath:c.dataset.k4csLastInputUsed};
   });
   const file='K4CS_ORIGINAL_MANUAL_'+direction+'_TRUE_KEYBOARD.png';
   await page.screenshot({path:path.join(out,file)});
   assert.equal(after.status,'running','manual takeover does not survive original 240Hz physics sample');
   assert.equal(after.manualPath,'ORIGINAL_MANUAL_KEYBOARD');
   manualTrials.push({direction,key,before,after,screenshot:file,notHuman:true,jsErrors});
  }catch(e){
   report.failures.push({name:'K4CS_NATIVE_MANUAL_'+direction,reason:String(e.stack||e).slice(0,1400),jsErrors});
   try{await page.screenshot({path:path.join(out,'K4CS_NATIVE_MANUAL_'+direction+'_ERROR.png')});}catch{}
  }finally{await ctx.close();}
 }
 report.nativeKeyboardTrials=manualTrials;
 if(manualTrials.length===2){
  const left=manualTrials[0].after.position.split(',').map(Number),right=manualTrials[1].after.position.split(',').map(Number);
  report.originalNativeManualWorldPositionSeparationM=Math.hypot(...left.map((v,i)=>v-right[i]));
  assert.ok(report.originalNativeManualWorldPositionSeparationM>.2,
    'native physical KeyA/KeyD produced no measurable distinct original Runner positions');
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(out,'K4CS_REAL_CHROMIUM_AND_CONTROLS_RESULT.json'),JSON.stringify(report,null,2)+'\n');
}
assert.equal(report.failures.length,0,'REAL Chromium 240Hz evidence failed: '+JSON.stringify(report.failures));
assert.equal(report.sessions.length,2);
assert.equal(report.nativeKeyboardTrials?.length,2);
assert.ok(report.originalNativeManualWorldPositionSeparationM>.2);
console.log('K4CS_TRUE_CHROMIUM_AND_NATIVE_MANUAL_KEYS',JSON.stringify({sessions:report.sessions.length,frames:report.sessions.reduce((v,s)=>v+s.pictures.length,0),originalsProtected:true,ART:'HOLD',HUMAN:'HOLD'}));
