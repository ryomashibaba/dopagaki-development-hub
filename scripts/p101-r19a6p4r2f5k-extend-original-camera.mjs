/** K: extend the ORIGINAL A1 scripted 240Hz WebGL2 camera into the 7-road course.
 * Source-only, no new building. Not a proof that all target ticks can be reached.
 * If physical route fails/finishes, record exact failure and coverage gap; never invent cameras.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const root=path.resolve('r19-evidence/r19a6p4r2f5k');
fs.mkdirSync(root,{recursive:true});
const source=JSON.parse(fs.readFileSync('docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json'));
assert.equal(source.origin.originalGitBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const anchors=JSON.parse(fs.readFileSync(root+'/R2F5K_ALL7_FROZEN_SOURCE_ROAD_ANCHORS.json'));
assert.equal(anchors.physicalRoadCount,7);
const targets=[265,721,1057,1249,1921,2761,3001,3361,3841,4321,4801,5761,6721,7681,8641,9601,10561,11521,12461];
const maxTarget=targets.at(-1);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const doc={schema:'dopagaki.r2f5k-original-240hz-source-extended-course-camera/1',
 sourceBlob:source.origin.originalGitBlob,sourceOriginalCamera:'ball-lock-unfiltered-heading',
 noCameraChanges:true,scriptedNotHuman:true,roadCount:7,B51:28,Hz:240,
 targetTicks:targets,sourceCameraArchiveTicks:[265,721,1057,1249,1921,2761],
 independentART:'NOT_TESTED',sourceTerrain:'UNCHANGED',addedColliders:0,
 unobservedCameraFramesMustRemainMissing:true,sessions:[],errors:[]};
await new Promise((ok,bad)=>server.once('error',bad).listen(0,'127.0.0.1',ok));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[],observed=[],missed=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,400));});
  const session={mode,stage,observed,missed,firstUnreached:null,errors,
   originalCamera:true,scriptedNotHuman:true,ART:'HOLD',sourceScope:'COURSE_COVERAGE_PROBE'};
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+'/r19a1/?'+
    'r19a1=on&g5b=off&stage='+stage,{waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(x=>document.querySelector('#stage')?.value===x&&
    document.querySelector('#view')?.dataset?.w9c1Isolated==='true',
    stage,{timeout:90000});
   const init=await page.evaluate(()=>{
    const c=document.querySelector('#view'),d=c.dataset;
    return {webgl2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
      B51:Number(d.machineCount),width:Number(d.w9c1Width),g5b:d.g5bMode};
   });
   session.init=init;
   assert.equal(init.webgl2,true);assert.equal(init.B51,28);
   assert.equal(init.width,mode==='ultra'?14:28);
   assert.equal(init.g5b,'off');
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   assert.equal(await page.locator('#demoRun').isDisabled(),false);
   let continuation=true;
   for(let k=0;k<targets.length;k++){
    const tick=targets[k];
    if(!continuation){missed.push(tick);continue;}
    await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
    if(k===0)await page.locator('#demoRun').click();else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
      const d=document.querySelector('#view')?.dataset;
      return Number(d?.r19a1PauseTick)===t||['failed','finished'].includes(d?.r19a1Status);
    },tick,{timeout:180000,polling:40});
    const state=await page.evaluate(()=>{
      const d=document.querySelector('#view').dataset;
      return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
        time:Number(d.r19a1Time),xyz:d.r19a1XYZ?.split(',').map(Number),
        speed:Number(d.r19a1Speed),road:d.r19a1Road,
        status:d.r19a1Status,B51:Number(d.r19a1B51),camera:d.cameraMode,
        cameraEye:d.r19a1Eye?.split(',').map(Number),
        cameraFront:d.r19a1Front?.split(',').map(Number)};
    });
    if(state.status!=='running'){
      session.firstUnreached={targetTick:tick,actualNativeTick:state.tick,
       sourceStatus:state.status,road:state.road,speed:state.speed,
       sourceXYZ:state.xyz};
      missed.push(tick);continuation=false;
      console.log('R2F5K_ORIGINAL_ROUTE_ENDED',JSON.stringify({mode,...session.firstUnreached}));
      continue;
    }
    assert.equal(state.tick,tick);assert.equal(state.paused,tick);
    assert.equal(state.B51,28);
    assert.equal(state.camera,'ball-lock-unfiltered-heading');
    assert.ok(Array.isArray(state.cameraEye)&&state.cameraEye.length===3&&
      state.cameraEye.every(Number.isFinite));
    assert.ok(Array.isArray(state.cameraFront)&&state.cameraFront.length===3&&
      state.cameraFront.every(Number.isFinite));
    const archived=source.frames.find(x=>x.mode===mode&&x.tick===tick);
    let archiveCheck=null;
    if(archived){
      const eyeError=Math.hypot(...state.cameraEye.map((v,i)=>v-archived.eye[i]));
      const frontError=Math.hypot(...state.cameraFront.map((v,i)=>v-archived.front[i]));
      assert.ok(eyeError<.15&&frontError<.0015,'Archived source-camera mismatch '+mode+'/'+tick);
      archiveCheck={eyeErrorM:eyeError,frontErrorNorm:frontError,identicalSourceTime:true};
    }
    const file='R2F5K_'+mode+'_'+tick+'_REAL_ORIGINAL_240HZ_WEBGL2.png';
    const png=await page.locator('#view').screenshot({path:path.join(root,file),timeout:45000});
    assert.ok(png.length>10000);
    observed.push({tick,seconds:tick/240,state,file,bytes:png.length,
      sha256:sha(png),archiveCheck});
    console.log('R2F5K_REAL_ORIGINAL_FRAME',JSON.stringify({
       mode,tick,time:state.time,road:state.road,sourceSpeedMps:state.speed,
       bytes:png.length,archiveChecked:!!archiveCheck}));
   }
   session.lastObservedTick=observed.at(-1)?.tick??null;
   session.overallCoverage=observed.length===targets.length?'ALL_REQUESTED_SOURCE_TIMES':
    'PARTIAL_SOURCE_TIMES__NO_FABRICATED_FUTURE_CAMERA';
   assert.equal(observed[0]?.tick,265);
   assert.ok(observed.filter(x=>x.archiveCheck).length>=6,
    'All six previously archived original camera samples must remain reproducible');
   assert.deepEqual(errors,[],'Browser errors');
   doc.sessions.push(session);
  }catch(e){
   doc.errors.push({mode,error:String(e.stack||e).slice(0,2200),browserErrors:errors});
   session.failedBeforeValidCoverage=true;
   doc.sessions.push(session);
  }finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
 fs.writeFileSync(path.join(root,'R2F5K_REAL_ORIGINAL_EXTENDED_CAMERA_COVERAGE.json'),
  JSON.stringify(doc,null,2)+'\n');
}
assert.deepEqual(doc.errors,[],'Original camera capture technical failure, not a natural route ending');
assert.equal(doc.sessions.length,2);
console.log('R2F5K_REAL_SOURCE_CAMERA_COVERAGE',JSON.stringify(doc.sessions.map(s=>({
 mode:s.mode,lastObservedTick:s.lastObservedTick,sourceStatus:s.firstUnreached?.sourceStatus||'RUNNING',
 observed:s.observed.length,unreached:s.missed.length,art:'NOT_TESTED'}))));
