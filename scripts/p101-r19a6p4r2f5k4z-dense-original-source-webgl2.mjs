/** K4Z - densely re-capture original Road2/Road4/Road5/Road6 genuinely.
 * ONE lawful source physics + original WebGL2 camera session per road-width.
 * Original source 240Hz and legal P96=>P94/3 steering unchanged.
 *  All frames are actually paused and screen-captured. No invented frames.
 *  Existing K and K3B captures are separate; don't splice into this run.
 *  No candidate building, model, new ground, collider or human ART decision.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';

const OUT=path.resolve('r19-evidence/r19a6p4r2f5k4z');
fs.mkdirSync(OUT,{recursive:true});
const SRC='af076d67492a677d2235e4730aef8cdf4808e106';
const archived=JSON.parse(fs.readFileSync('docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json','utf8'));
const native=JSON.parse(fs.readFileSync('r19-evidence/r19a6p4r2f5k3/R2F5K3_REAL_LATE_STEERING_NATIVE_MATRIX.json','utf8'));
const historic=JSON.parse(fs.readFileSync('r19-evidence/r19a6p4r2f5k3b-original/R2F5K3B_REAL_SEVEN_ROAD_WEBGL2_CAMERA.json','utf8'));
assert.equal(archived.origin.originalGitBlob,SRC);
assert.equal(native.sourceBlob,SRC);
assert.equal(historic.sourceBlob,SRC);
assert.equal(native.switchTick,7680);
assert.equal(historic.controller,'P96_div4.8_until_tick7680_then_P94_corrective_div3');
assert.equal(historic.sourceHz,240);
assert.equal(historic.sourceB48,7);
assert.equal(historic.sourceB51,28);
assert.deepEqual(historic.errors,[]);

const targetTicks=[
   265,721,1057,1249,1921,2761,
   4801,5041,5281,5521,5761,
   6721,7680,8160,8640,8880,9120,
   9480,9600,9720,9840,9960,10080,10200,10320,10440,10560,
   10680,10800,10920,11040,11160,11280,11400,11520,
   11640,11760,11880,12000,12120,12240
];
const REQUIRED=['p93-SCISSOR_RISE-01','p93-VOID_SURGE-01',
 'p93-PRISM_CREST-01','p93-FINISH_RIDGE-01'];
assert.equal(targetTicks.length,new Set(targetTicks).size);
assert.ok(targetTicks.every((x,i)=>Number.isInteger(x)&&x>0&&(i===0||x>targetTicks[i-1])));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const diff=(a,b)=>Math.hypot(...a.map((x,j)=>x-b[j]));
const report={
 schema:'dopagaki.k4z-legal-original-240hz-high-density-seven-road-camera-source/1',
 sourceBlob:SRC,Hz:240,sourceB48:7,sourceB51:28,
 nativeRuntimeOriginalSource:true,oneContinuousPhysicalRunPerMode:true,
 captureIsSparsePausesNotContinuousVideo:true,
 originalCamera:'ball-lock-unfiltered-heading',
 sourcePrivateSteeringOnly:'P96_div4.8_until_tick7680_then_P94_corrective_div3',
 legalSteeringNoTeleport:true,forcedBallXYZChanges:false,
 originalGeometryChanged:false,originalCameraChanged:false,
 originalPhysicsChanged:false,addedColliders:0,
 buildingModelsCreated:0,noCandidateArchitecture:true,
 scriptedNotHuman:true,goal:'SOURCE_CAMERA_EVIDENCE_FOR_FUTURE_HUMAN_ART_GATE',
 targetTicks,threeDimensionalVoidHumanReadability:'NOT_TESTED',
 continuousHumanVisibilitySeconds:'UNKNOWN',
 oldK4RAndK4UART:'REJECT',newCandidateART:'NOT_TESTED_HOLD',
 officialARTAccepted:0,slope2DNARecognizedMetres:0,
 SAT:'NOT_RUN',CCD:'NOT_RUN',HUMAN:'NOT_TESTED',FPS:'NOT_TESTED',
 RELEASE:'HOLD',MERGE:'HOLD',sessions:[],errors:[]
};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle',
  '--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const successful=native.runs.find(x=>x.mode===mode&&x.variant==='p94-corrective-div3');
  const predecessor=historic.sessions.find(x=>x.mode===mode);
  assert.ok(successful&&successful.finishedNativeSource&&successful.visitedRoadIndexes.length===7);
  assert.ok(predecessor&&predecessor.shots.length===14);
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage();
  const errors=[],frames=[],historicalMatches=[];
  const session={mode,stage,frames,sourceErrors:errors,historicalMatches,
    actualRoadCounts:{},targetCount:targetTicks.length,
    oneContinuousRunWithoutRestart:true,nativePhysicsCompletedAtLastPause:false,
    sourceNoCandidate:true,ART:'NOT_TESTED_HOLD'};
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,400));});
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
     '/r19a6p4r2f5k3b/?r19a1=on&g5b=off&stage='+stage,
     {waitUntil:'domcontentloaded',timeout:70000});
   await page.waitForFunction(x=>document.querySelector('#stage')?.value===x&&
     document.querySelector('#view')?.dataset?.w9c1Isolated==='true',
     stage,{timeout:90000});
   const init=await page.evaluate(()=>{
    const c=document.querySelector('#view'),d=c.dataset;
    return {webgl2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
      sourceB51:Number(d.machineCount),
      width:Number(d.w9c1Width),g5b:d.g5bMode};
   });
   assert.equal(init.webgl2,true);
   assert.equal(init.sourceB51,28);
   assert.equal(init.width,mode==='ultra'?14:28);
   assert.equal(init.g5b,'off');
   session.init=init;
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>
    document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   assert.equal(await page.locator('#demoRun').isDisabled(),false);
   for(let index=0;index<targetTicks.length;index++){
    const tick=targetTicks[index];
    await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
    if(index===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view')?.dataset;
     return Number(d?.r19a1PauseTick)===t||
       ['failed','finished'].includes(d?.r19a1Status);
    },tick,{timeout:180000,polling:40});
    const state=await page.evaluate(()=>{
     const d=document.querySelector('#view').dataset;
     return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
       status:d.r19a1Status,xyz:d.r19a1XYZ?.split(',').map(Number),
       speed:Number(d.r19a1Speed),road:d.r19a1Road,
       camera:d.cameraMode,cameraEye:d.r19a1Eye?.split(',').map(Number),
       cameraFront:d.r19a1Front?.split(',').map(Number),
       B51:Number(d.r19a1B51),
       privateSteeringLabel:d.r19a1Mode};
    });
    assert.equal(state.status,'running','Source ended BEFORE genuine target tick '+tick);
    assert.equal(state.tick,tick);
    assert.equal(state.paused,tick);
    assert.equal(state.B51,28);
    assert.equal(state.camera,'ball-lock-unfiltered-heading');
    assert.equal(state.privateSteeringLabel,'K3B_LEGAL_LATE_P94_DIV3__NOT_HUMAN');
    assert.ok(state.xyz.length===3&&state.xyz.every(Number.isFinite));
    assert.ok(state.cameraEye.length===3&&state.cameraEye.every(Number.isFinite));
    assert.ok(state.cameraFront.length===3&&state.cameraFront.every(Number.isFinite));
    const previous=predecessor.shots.find(x=>x.tick===tick);
    const early=archived.frames.find(x=>x.mode===mode&&x.tick===tick);
    let oldCamera=null,oldState=null,oldImage=null;
    if(early){
      const e=diff(state.cameraEye,early.eye),f=diff(state.cameraFront,early.front);
      assert.ok(e<.15&&f<.0015,'Immutable archived original camera mismatch');
      oldCamera={eyeErrorM:e,frontErrorNorm:f};
    }
    if(previous){
      const xyzErrorM=diff(state.xyz,previous.state.xyz);
      const speedError=Math.abs(state.speed-previous.state.speed);
      const eyeError=diff(state.cameraEye,previous.state.cameraEye);
      const frontError=diff(state.cameraFront,previous.state.cameraFront);
      assert.ok(xyzErrorM<.001&&speedError<.001&&eyeError<.15&&frontError<.0015);
      assert.equal(state.road,previous.state.road);
      oldState={xyzErrorM,speedErrorMps:speedError,cameraEyeErrorM:eyeError,
         cameraFrontErrorNorm:frontError,matchedOriginalK3BCamera:true};
      oldImage={historicOriginalPNGsha256:previous.sha256,
        sourceImageBytes:previous.bytes,
        compareImageShaResult:'CHECK_AFTER_NEW_CAPTURE'};
      historicalMatches.push(tick);
    }
    const matchedNative=successful.snapshots.find(x=>x.tick===tick);
    let physical=null;
    if(matchedNative){
      const positionDelta=diff(state.xyz,matchedNative.xyz);
      const speedDelta=Math.abs(state.speed-matchedNative.speedMps);
      assert.ok(positionDelta<.0006&&speedDelta<.0006);
      assert.equal(matchedNative.road,state.road);
      physical={xyzErrorM:positionDelta,speedErrorMps:speedDelta,
        nativePhysicalMatrix:'p94-corrective-div3'};
    }
    const name='K4Z_'+mode+'_'+tick+'_ONE_ORIGINAL_240HZ_WEBGL2.png';
    const png=await page.locator('#view').screenshot({path:path.join(OUT,name),timeout:45000});
    assert.ok(png.length>10000);
    if(oldImage)oldImage.compareImageShaResult=sha(png)===previous.sha256?
      'EXACT_SOURCE_PNG_SHA_MATCH':'DIFFERENT_CAPTURE_PNG_SHA_REVIEW_REQUIRED';
    frames.push({tick,seconds:tick/240,state,file:name,bytes:png.length,sha256:sha(png),
      oldCamera,oldState,oldImage,physical});
    session.actualRoadCounts[state.road]=(session.actualRoadCounts[state.road]||0)+1;
    console.log('K4Z_TRUE_240HZ_ORIGINAL_WEBGL2',JSON.stringify({
      mode,tick,road:state.road,bytes:png.length,oldSourceStateMatched:!!oldState,
      nativePhysicsMatched:!!physical,shaMatchesPrior:oldImage?.compareImageShaResult??null}));
   }
   assert.deepEqual(errors,[]);
   assert.equal(frames.length,targetTicks.length);
   assert.ok(historicalMatches.length>=7);
   for(const road of REQUIRED){
      assert.ok((session.actualRoadCounts[road]??0)>=3,
       'K4Z needs >=3 real same-run snapshots of '+road+' mode '+mode+
       ' actual distribution '+JSON.stringify(session.actualRoadCounts));
   }
   // This is a genuine single scripted source run per width, but its
   // sparse PNGs are not a 240fps video nor proof of user comprehension.
   session.nativePhysicsCompletedAtLastPause=false;
   report.sessions.push(session);
  }catch(e){
   report.errors.push({mode,error:String(e.stack||e).slice(0,3500),
     sourceErrors:errors,framesCaptured:frames.length});
   report.sessions.push(session);
  }finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(OUT,'K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json'),
   JSON.stringify(report,null,2)+'\n');
}
assert.deepEqual(report.errors,[],'K4Z real capture must not silently pass failed/missing actual states');
assert.equal(report.sessions.length,2);
console.log('K4Z_ACTUAL_SOURCE_240HZ_DENSE_CAMERA_TECH_GATE_PASS',JSON.stringify({
 modes:report.sessions.map(x=>({mode:x.mode,captured:x.frames.length,
  roadCounts:x.actualRoadCounts,historicalSourceMatched:x.historicalMatches.length})),
 realOriginalPNGs:report.sessions.reduce((n,x)=>n+x.frames.length,0),
 realNewArchitectureModels:0,ART:'NOT_TESTED_HOLD',sourcePhysicsUnchanged:true}));
