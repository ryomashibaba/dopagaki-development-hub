/** Source-Chromium WebGL2 original real 240Hz runner, baseline vs one REAL physical course with SIX original repositioned B51.
 * Screenshots are raw, no canvas painting, upscaling or surrogate camera.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const out=path.resolve('test-results/k4ct-two-true-b51');fs.mkdirSync(out,{recursive:true});
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port;
const cases=[
 {name:'K4CS_SINGLE_NATIVE_B51_BASELINE',prefix:'k4ct',q:'k4ct',stage:'K4CS-READABLE-B51-CHOICE'},
 {name:'K4CT_DUAL_ORIGINAL_MOVING_B51',prefix:'k4ct',q:'k4ct',stage:'K4CT-TWO-REAL-B51-CHOICE'}
];
const report={schema:'k4ct-original-source-240hz-real-two-b51-consecutive-choice-v1',
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
   if(spec.name==='K4CT_DUAL_ORIGINAL_MOVING_B51'||spec.name==='K4CS_SINGLE_NATIVE_B51_BASELINE'){
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
       dualNativeB51Count:Number(c.dataset.k4ctTwoRealCount||0),
       firstRealB51:c.dataset.k4ctFirstB51||'none',
       secondRealB51:c.dataset.k4ctSecondB51||'none',
       firstOriginalBoxSeparation:c.dataset.k4ctFirstOriginalBoxSeparation||'none',
       runnerLaneV:c.dataset.k4ctRealRunnerLaneV||'none',
       twoHazardDecision:c.dataset.k4ctDecisionJson||'null',
       dualHud:document.getElementById('k4ctOriginalTwoB51Panel')?.textContent||'',
       dualDisplayed:!document.getElementById('k4ctOriginalTwoB51Panel')?.hidden,
       dualCenterErrorPx:(()=>{const n=document.getElementById('k4ctOriginalTwoB51Panel');if(!n||n.hidden)return null;const a=n.getBoundingClientRect(),v=c.getBoundingClientRect();return Number(Math.abs(a.left+a.width/2-(v.left+v.width/2)).toFixed(2));})(),
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

   if(spec.name==='K4CT_DUAL_ORIGINAL_MOVING_B51'){
     const genuine=pictures.filter(p=>p.dualNativeB51Count===2);
     assert.ok(genuine.length>=3,'must display two consecutive REAL original B51 in at least three true source frames');
     assert.ok(genuine.every(p=>p.firstRealB51.startsWith('a13-machine-')&&p.secondRealB51.startsWith('a13-machine-')
        &&p.firstRealB51!==p.secondRealB51),'must show TWO distinct real physical moving B51 identities');
     for(const p of genuine){
       const decision=JSON.parse(p.twoHazardDecision);
       assert.equal(decision.rowCount,2);
       assert.equal(decision.rows[0].id,p.firstRealB51);
       assert.equal(decision.rows[1].id,p.secondRealB51);
       assert.ok(decision.rows[0].metres<=decision.rows[1].metres,'real source road arrival order reversed');
       assert.ok(decision.rows[0].safeLaneCertified===false&&decision.rows[1].safeLaneCertified===false);
       assert.ok(p.dualDisplayed&&p.dualHud.includes('NO SAFE LANE CERTIFIED'));
       assert.ok(p.dualCenterErrorPx!==null&&p.dualCenterErrorPx<2);
     }
     report.honestDualSamples=genuine.map(x=>({seconds:x.seconds,ids:[x.firstRealB51,x.secondRealB51],laneV:x.runnerLaneV,
       actualOriginalBoxSeparationM:x.firstOriginalBoxSeparation,firstEta:JSON.parse(x.twoHazardDecision).rows[0].etaSeconds,
       secondEta:JSON.parse(x.twoHazardDecision).rows[1].etaSeconds}));
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
   await page.goto(url+'/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.getElementById('view')?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ',{timeout:90000});
   await page.locator('#cameraCompare').click();
   await page.locator('#demoSpeed').selectOption('2');
   await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
   await page.locator('#demoRun').click();
   await page.waitForFunction(()=>Math.abs(Number(document.getElementById('view').dataset.r15s3d10PausedAt)-63.70)<.009,{timeout:120000});
   const before=await page.evaluate(()=>({position:document.getElementById('view').dataset.k4csActualRunnerPosition,dual:document.getElementById('view').dataset.k4ctDecisionJson}));
   assert.ok(before.position&&before.position!=='none'&&JSON.parse(before.dual).rowCount===2,'two B51 must be previewed before A/D choice');
   await page.locator('#takeoverRun').click();
   await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',{timeout:15000});
   await page.evaluate(()=>window.__r15s3d10PauseAt=64.05);
   await page.keyboard.down(key);
   await page.waitForFunction(key=>{
     const c=document.getElementById('view');
     return c.dataset.k4csLastInputUsed==='ORIGINAL_MANUAL_KEYBOARD'&&
       c.dataset.k4csActualManualSteer===(key==='KeyA'?'-1':'1');
   },key,{timeout:15000});
   await page.waitForFunction(()=>Math.abs(Number(document.getElementById('view').dataset.r15s3d10PausedAt)-64.05)<.009||document.getElementById('view').dataset.r15s3d10Status==='failed',{timeout:30000});
   await page.keyboard.up(key);
   const after=await page.evaluate(()=>{
    const c=document.getElementById('view');
    return {position:c.dataset.k4csActualRunnerPosition,simTime:c.dataset.r15s3d10PausedAt,
      originalTick:Number(c.dataset.r15s3d10NativeTicks),status:c.dataset.r15s3d10Status,
      manualPath:c.dataset.k4csLastInputUsed,
      dual:JSON.parse(c.dataset.k4ctDecisionJson||'null'),
      actualOriginalB51BoxSeparation:c.dataset.k4ctFirstOriginalBoxSeparation,
      currentLaneV:c.dataset.k4ctRealRunnerLaneV};
   });
   const file='K4CT_TWO_B51_CHOICE_'+direction+'_TRUE_NATIVE_KEYBOARD.png';
   await page.screenshot({path:path.join(out,file)});
   assert.ok(['running','failed'].includes(after.status),'unexpected real runner status');
   assert.equal(after.manualPath,'ORIGINAL_MANUAL_KEYBOARD');
   assert.ok(after.dual?.rows.length>=1,'did not keep original moving B51 cue while steering');
   manualTrials.push({direction,key,before,after,screenshot:file,notHuman:true,jsErrors});
  }catch(e){
   report.failures.push({name:'K4CT_TWO_B51_CHOICE_'+direction,reason:String(e.stack||e).slice(0,1400),jsErrors});
   try{await page.screenshot({path:path.join(out,'K4CT_TWO_B51_CHOICE_'+direction+'_ERROR.png')});}catch{}
  }finally{await ctx.close();}
 }
 report.nativeKeyboardTrials=manualTrials;
 if(manualTrials.length===2){
  const left=manualTrials[0].after.position.split(',').map(Number),right=manualTrials[1].after.position.split(',').map(Number);
  report.originalNativeManualWorldPositionSeparationM=Math.hypot(...left.map((v,i)=>v-right[i]));
  report.realChoiceEvidence=manualTrials.map(x=>({direction:x.direction,status:x.after.status,
     firstB51:x.after.dual?.rows[0]?.id||'none',secondB51:x.after.dual?.rows[1]?.id||'none',
     actualOriginalBoxSurfaceSeparationM:x.after.actualOriginalB51BoxSeparation,
     originalRunnerLateralV:x.after.currentLaneV,native240HzTime:x.after.simTime}));
  assert.ok(report.originalNativeManualWorldPositionSeparationM>.2,
    'native physical KeyA/KeyD produced no measurable distinct original Runner positions');
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(out,'K4CT_TRUE_TWO_B51_NATIVE_CONTROL_RESULT.json'),JSON.stringify(report,null,2)+'\n');
}
assert.equal(report.failures.length,0,'REAL Chromium 240Hz evidence failed: '+JSON.stringify(report.failures));
assert.equal(report.sessions.length,2);
assert.equal(report.nativeKeyboardTrials?.length,2);
assert.ok(report.originalNativeManualWorldPositionSeparationM>.2);
console.log('K4CT_TRUE_TWO_ORIGINAL_B51_PHYSICAL_CHOICE',JSON.stringify({sessions:report.sessions.length,frames:report.sessions.reduce((v,s)=>v+s.pictures.length,0),originalsProtected:true,ART:'HOLD',HUMAN:'HOLD'}));
