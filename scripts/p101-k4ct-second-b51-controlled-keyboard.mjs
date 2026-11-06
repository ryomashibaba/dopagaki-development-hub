/** K4CT real B51-14 continuation after actual K4CT failure/retry CI.
 * Test only timing-limited ORIGINAL KeyD / KeyA (Playwright, never a human).
 * Native 240Hz Runner/CCD, original source B48×7/B51×28 and camera unchanged.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const OUT=path.resolve('test-results/k4ct-contact-retry');
fs.mkdirSync(OUT,{recursive:true});
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
// Retain the already verified three timing variants in run #42048634777.
// Focus this batch on ONE genuine outcome-changing, same-browser failure/retry.
const proposals=[
 {name:'TWO_SHORT_RIGHT_RESCUES',pulses:[{start:65.25,end:65.36,key:'KeyD'},{start:65.79,end:65.91,key:'KeyD'}]}
];
const result={schema:'k4ct-actual-source-road6-b51-14-native-keyboard-corrective-v1',
 previousRun:'https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42046550320',
 rawSourceGame:true,real240Hz:true,nativeKeyAKeyDOnly:true,HUMAN:'HOLD',
 formalART:0,ART:'REJECT',slope2DNAmeters:0,SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',
 RELEASE:'HOLD',MERGE:'HOLD',newColliders:0,experiments:[],errors:[],r6Slices:[]};
let browser=null;
async function waitPause(page,t){
 await page.waitForFunction(t=>{
  const c=document.getElementById('view');
  const ticks=Number(c.dataset.r15s3d10NativeTicks);
  // Source canvas does not reset old pause-at metadata between native retries.
  // A new 240Hz tick count is REQUIRED to prove the second physical traversal.
  return (ticks>=Math.floor(t*240)-2 &&
    Math.abs(Number(c.dataset.r15s3d10PausedAt)-t)<0.009 &&
    c.dataset.r15s3d10Status==='running') ||
    ['failed','finished'].includes(c.dataset.r15s3d10Status);
 },t,{timeout:120000,polling:50});
 return await page.evaluate(()=>({status:document.getElementById('view').dataset.r15s3d10Status,
   pausedAt:Number(document.getElementById('view').dataset.r15s3d10PausedAt),
   nativeTicks:Number(document.getElementById('view').dataset.r15s3d10NativeTicks)}));
}
async function advance(page,t,paused){
 await page.evaluate(x=>window.__r15s3d10PauseAt=x,t);
 if(paused)await page.locator('#pause').click();
 const state=await waitPause(page,t);
 return {paused:state.status==='running'&&state.nativeTicks>=Math.floor(t*240)-2&&
   Math.abs(state.pausedAt-t)<0.009,
  status:state.status,time:state.pausedAt,nativeTicks:state.nativeTicks};
}

// R10A: real Chromium requestAnimationFrame *presentation* pacing only,
// while the original runner is already PAUSED at an exact 240Hz tick.
// This does not measure game 240Hz stepping, GPU execution latency,
// an actual player's FPS, SAT/CCD or any formal performance budget.
// 22 RAF samples × 9 original-camera capture conditions, all nonintrusive.
async function measureR10ChaseFramePacing(page){
 return await page.evaluate(async()=>{
  const c=document.getElementById('view');
  const atTick=Number(c.dataset.r15s3d10NativeTicks);
  const present=[];
  let last=0;
  let finished=false;
  const result=await Promise.race([
   new Promise(resolve=>{
    const add=t=>{
     if(!last){last=t;requestAnimationFrame(add);return;}
     present.push(t-last);last=t;
     if(present.length>=22){finished=true;resolve('sampled');}
     else requestAnimationFrame(add);
    };
    requestAnimationFrame(add);
   }),
   new Promise(resolve=>setTimeout(()=>resolve('timeout'),6500))
  ]);
  const nowTick=Number(c.dataset.r15s3d10NativeTicks);
  const sorted=present.filter(x=>Number.isFinite(x)&&x>0).sort((a,b)=>a-b);
  const p=q=>sorted.length?sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*q))]:null;
  return {
   schema:'k4ct-r10-chromium-paused-source-chase-raf-pacing-v1',
   backend:'ACTUAL_CHROMIUM_REQUEST_ANIMATION_FRAME',
   sampled:result,completed:finished,sampleCount:sorted.length,
   meanMS:sorted.length?sorted.reduce((a,b)=>a+b,0)/sorted.length:null,
   p50MS:p(.50),p95MS:p(.95),worstMS:p(1),
   reportedFPSFromMedian:p(.50)?1000/p(.50):null,
   visualViewport:[c.width,c.height],
   nativeTicksBefore:atTick,nativeTicksAfter:nowTick,
   originalRunnerPaused:nowTick===atTick,
   realHardwareFPSCertified:false,game240HzPerformanceCertified:false,
   independentGPUTimeMeasured:false
  };
 });
}

// R11B: paired, order-balanced original CHASE A/B performance inside the
// SAME paused browser, same viewport, same original 240Hz tick, same
// source 28 B51. This compares verified R9 shader against EXACT
// historically rejected R10B shader; neither is formally promoted.
// requestAnimationFrame is presentation pacing, NOT direct GPU timing.
async function captureR11SingleRunShaderPairs(page,label){
 const rows=[];
 const sequence=['R9_VERIFIED','R10B_REJECTED','R10B_REJECTED','R9_VERIFIED'];
 let originalTick=null;
 for(let i=0;i<sequence.length;i++){
  const shaderMode=sequence[i];
  await page.evaluate(x=>{window.__k4ctR11MaterialAB=x;},shaderMode);
  await page.waitForFunction(x=>{
   const c=document.getElementById('view');
   return c?.dataset.k4ctR11ActualProgram===x &&
     c.dataset.k4ctR11ShaderABAvailable==='R9_VERIFIED_VS_R10B_REJECTED_SAME_BROWSER';
  },shaderMode,{timeout:12000,polling:50});
  const paced=await measureR10ChaseFramePacing(page);
  const proof=await page.evaluate(()=>{
   const c=document.getElementById('view');
   const gl=c.getContext('webgl2');
   return {
    realWebGL2:gl instanceof WebGL2RenderingContext,
    originalSource:c.dataset.r15s3d10OriginalGame,
    originalTicks:Number(c.dataset.r15s3d10NativeTicks),
    originalB51:Number(c.dataset.g4e7yRetainedMachines),
    originalRoadMode:c.dataset.k4ctRoadArtMode,
    actualShader:c.dataset.k4ctR11ActualProgram,
    nonRoadVertexCount:Number(c.dataset.k4ctR9MaterialVertexCount)
   };
  });
  assert.equal(proof.realWebGL2,true);
  assert.equal(proof.originalSource,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(proof.originalB51,28);
  assert.equal(proof.originalRoadMode,'ORIGINAL_B48_PLUS_DCC_CONFORMAL');
  assert.equal(proof.nonRoadVertexCount,80148);
  assert.equal(proof.actualShader,shaderMode);
  assert.ok(paced.sampleCount>=12&&paced.originalRunnerPaused);
  if(originalTick===null)originalTick=proof.originalTicks;
  else assert.equal(proof.originalTicks,originalTick,'R11 paired shader broke frozen source tick');
  let screen=null;
  if(i===0||i===1){
   screen='K4CT_R11_'+label+'_'+shaderMode+'_REAL_SOURCE_AB_RAW.png';
   await page.screenshot({path:path.join(OUT,screen)});
  }
  rows.push({ordinal:i,mode:shaderMode,proof,pacing:paced,screenshot:screen});
 }
 await page.evaluate(()=>{window.__k4ctR11MaterialAB='R9_VERIFIED';});
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.k4ctR11ActualProgram==='R9_VERIFIED';
 },null,{timeout:12000,polling:50});
 assert.deepEqual(rows.map(x=>x.mode),sequence);
 return {sourceCameraLabel:label,sourceNativeTick:originalTick,
  design:'ABBA_TO_PARTLY_CONTROL_CHROME_WARMUP_AND_RUN_ORDER',
  pairedWithinOneBrowser:true,
  actualGameSource:true,sourceRoadAndB51Untouched:true,
  formalFPS:'HOLD',human:false,results:rows};
}

// R11C: REAL source game screenshots with exactly TWO already-authored
// Blender clutter groups temporarily hidden by original group span.
// No geometry regenerated, no collision, no road/real-B51 visibility
// changes. These are ART attribution studies, not accepted game variants.
async function captureR11OriginalChaseClutterAblation(page,label){
 const modes=['ALL','NO_REPEATED_ROOF','NO_CONVEYOR','NO_BOTH'];
 const rows=[];
 let fixedTick=null;
 await page.evaluate(()=>{window.__k4ctR11MaterialAB='R9_VERIFIED';});
 for(const mode of modes){
  await page.evaluate(x=>{window.__k4ctR11ArtLayer=x;},mode);
  await page.waitForFunction(x=>{
   const c=document.getElementById('view');
   return c?.dataset.k4ctR11ActualArtLayer===x &&
      c.dataset.k4ctR11ActualProgram==='R9_VERIFIED';
  },mode,{timeout:12000,polling:50});
  const proof=await page.evaluate(()=>{
   const c=document.getElementById('view');
   return {
    mode:c.dataset.k4ctR11ActualArtLayer,
    shader:c.dataset.k4ctR11ActualProgram,
    ticks:Number(c.dataset.r15s3d10NativeTicks),
    source:c.dataset.r15s3d10OriginalGame,
    b51:Number(c.dataset.g4e7yRetainedMachines),
    originalRoad:c.dataset.k4ctRoadArtMode,
    originalNativeStatus:c.dataset.r15s3d10Status
   };
  });
  assert.equal(proof.source,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(proof.shader,'R9_VERIFIED');
  assert.equal(proof.b51,28);
  assert.equal(proof.originalRoad,'ORIGINAL_B48_PLUS_DCC_CONFORMAL');
  assert.equal(proof.originalNativeStatus,'running');
  if(fixedTick===null)fixedTick=proof.ticks;
  else assert.equal(proof.ticks,fixedTick,'R11 art group isolation moved original source physics');
  const screen='K4CT_R11_'+label+'_'+mode+'_TRUE_SOURCE_CLUTTER_AB_RAW.png';
  await page.screenshot({path:path.join(OUT,screen)});
  rows.push({mode,proof,image:screen});
 }
 await page.evaluate(()=>{window.__k4ctR11ArtLayer='ALL';});
 return {sourceCameraLabel:label,originalNativeTick:fixedTick,
   sourceGroupStudy:true,allBlenderSourceTrianglesPreserved:true,
   originalSourceB51Untouched:true,noFormalArtPromotion:true,rows};
}

/* Same-paused-tick, same-source-camera RAW layer A/B (no retouching).
 * Three modes only toggle noncolliding scenery; 28 B51 are always drawn.
 * SCREENSHOT  != HUMAN test and qualitative ART always remains REJECT. */
async function captureR6RawLayerAB(page,label){
 const states=[];
 let tick=null;
 for(const trial of ['BASE','K4CS','CLEAN']){
  await page.evaluate(x=>{
   window.__k4ctVisualABMode='R7_DCC';
   window.__k4ctRenderAttribution=x==='CLEAN'?'BASE':x;
   window.__k4ctSuppressK4CSGateOnly=x==='CLEAN';
   window.__k4ctAttributionTrialTag=x;
  },trial);
  await page.waitForFunction(x=>{
   const c=document.getElementById('view');
   const expected=x==='CLEAN'?'RESEARCH_ONLY_NONCOLLIDING_GATES_HIDDEN':'ORIGINAL_NONCOLLIDING_GATES_VISIBLE';
   return c?.dataset.k4ctK4csGateStatus===expected &&
    c.dataset.k4ctAttributionMode===(x==='CLEAN'?'BASE':x);
  },trial,{timeout:30000,polling:50});
  await page.waitForTimeout(140);
  const r10Pacing=await measureR10ChaseFramePacing(page);
  assert.ok(r10Pacing.sampleCount>=12&&r10Pacing.originalRunnerPaused,
    'R10 original-source frozen camera performance samples missing');
  const state=await page.evaluate(()=>{
   const c=document.getElementById('view');
   return {mode:c.dataset.k4ctVisualABMode,
    trial:window.__k4ctAttributionTrialTag,
    attribution:c.dataset.k4ctAttributionMode,
    nativeGateStatus:c.dataset.k4ctK4csGateStatus,
    sourceB51StageCount:Number(c.dataset.g4e7yRetainedMachines),
    originalSource:c.dataset.r15s3d10OriginalGame,
    nativeTicks:Number(c.dataset.r15s3d10NativeTicks),
    nativeStatus:c.dataset.r15s3d10Status,
    DCC:c.dataset.k4ctNativeDcc,
    nativeB51MaterialMode:c.dataset.k4ctNativeB51MaterialMode,
    sourceResearchRoad5:true,
    r9MaterialDrawn:c.dataset.k4ctR9Material,
    r9ShaderLinked:c.dataset.k4ctR9MaterialProgram,
    r9BlenderMaterialVertices:Number(c.dataset.k4ctR9MaterialVertexCount),
    r9SourceRoadUnchanged:c.dataset.k4ctRoadArtMode};
  });
  assert.equal(state.mode,'R7_DCC');
  assert.equal(state.trial,trial);
  assert.equal(state.sourceB51StageCount,28);
  assert.equal(state.originalSource,'REAL_WEBGL2_SOURCE_240HZ');
  assert.equal(state.DCC,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
  assert.equal(state.nativeStatus,'running');
  assert.equal(state.nativeB51MaterialMode,'ORIGINAL_SOURCE_VISUAL');
  assert.equal(state.r9MaterialDrawn,'REAL_BLENDER_POLYGON_NORMAL_UV_BSDF_ATTRIBUTE_WEBGL2',
   'Actual paused source screenshot must use the R9 material bridge draw, not just export JSON');
  assert.equal(state.r9ShaderLinked,'R9_REAL_BLENDER_ATTRIBUTES_SOURCE_SAFE');
  assert.ok(state.r9BlenderMaterialVertices>2500,'Blender material scene not drawn in source game');
  assert.equal(state.r9SourceRoadUnchanged,'ORIGINAL_B48_PLUS_DCC_CONFORMAL');
  assert.equal(state.nativeGateStatus,trial==='CLEAN'?'RESEARCH_ONLY_NONCOLLIDING_GATES_HIDDEN':'ORIGINAL_NONCOLLIDING_GATES_VISIBLE');
  if(tick===null)tick=state.nativeTicks;
  else assert.equal(state.nativeTicks,tick,'R8B display-only transition changed native tick');
  const file='K4CT_R8B_'+label+'_'+trial+'_EXACT_SOURCE_RAW.png';
  await page.screenshot({path:path.join(OUT,file)});
  let r11SingleRunAB=null;
  let r11OriginalArtAblation=null;
  if(trial==='CLEAN'){
   r11SingleRunAB=await captureR11SingleRunShaderPairs(page,label);
   assert.equal(r11SingleRunAB.sourceNativeTick,state.nativeTicks);
   r11OriginalArtAblation=await captureR11OriginalChaseClutterAblation(page,label);
   assert.equal(r11OriginalArtAblation.originalNativeTick,state.nativeTicks);
  }
  states.push({...state,file,r10Pacing,r11SingleRunAB,r11OriginalArtAblation});
 }
 await page.evaluate(()=>{window.__k4ctRenderAttribution='BASE';window.__k4ctSuppressK4CSGateOnly=true;});
 return {label,nativeTick:tick,states,renderOnly:true,
  originalCamera:true,sourceB51CollisionUnchanged:true,formalART:0,HUMAN:'HOLD'};
}

async function init(page){
 await page.goto(base+'/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{const c=document.getElementById('view');
  return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
   document.getElementById('stage').value==='K4CT-TWO-REAL-B51-CHOICE';},
  undefined,{timeout:90000});
 const v=await page.evaluate(()=>{const c=document.getElementById('view'),gl=c.getContext('webgl2');
  return {realGL:gl instanceof WebGL2RenderingContext,dcc:c.dataset.k4ctNativeDcc,
    dccTriangles:Number(c.dataset.k4ctNativeDccTriangles)};});
 assert.ok(v.realGL,'source real WebGL2 not running');
 assert.equal(v.dcc,'GENUINE_BLENDER_EDITABLE_NONCOLLIDING');
 assert.ok(v.dccTriangles>2500,'Blender-created integrated scene not shown in source WebGL2');
 await page.locator('#cameraCompare').click();
 await page.locator('#demoSpeed').selectOption('2');
 await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
 await page.locator('#demoRun').click();
 const pre=await waitPause(page,63.70);
 assert.equal(pre.status,'running');
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',
   undefined,{timeout:15000});
 return v;
}
function summarize(tr){
 const events=tr.samples.flatMap(x=>x.events);
 const nearest=id=>Math.min(...tr.samples.map(x=>x.hazards.find(h=>h.id===id)?.separationM??Infinity));
 const st=tr.stations.find(s=>s.id==='a13-machine-14');
 const pass14=tr.samples.some(s=>s.progressM!=null && s.progressM>st.stationM+20 && s.centrelineDistanceM<=75&&s.grounded);
 const road6=tr.samples.filter(s=>s.road&&s.road===tr.samples[0]?.road?false:!!s.road).length;
 const road5=tr.samples[0]?.road??null;
 const road6Id=tr.samples.find(s=>s.road&&s.road!==road5)?.road??null;
 const airborne=tr.samples.filter(s=>s.grounded===false).length;
 const failures=events.filter(x=>x.type==='failure');
 const contacts=events.filter(x=>x.type==='moving-contact');
 const landings=events.filter(x=>x.type==='contact');
 const last=tr.samples.at(-1);
 return {samples:tr.samples.length,firstTime:tr.samples[0]?.t,lastTime:last?.t,
  finalStatus:last?.status,finalRoad:last?.road,road6Id,
  road6GroundedSamples:tr.samples.filter(s=>s.road===road6Id&&s.grounded).length,
  airborneSamples:airborne,actualNativeContact13:contacts.filter(e=>e.id==='a13-machine-13'),
  actualNativeContact14:contacts.filter(e=>e.id==='a13-machine-14'),
  landingEvents:landings.length,failure:failures.at(-1)??null,
  minimumGap13M:nearest('a13-machine-13'),minimumGap14M:nearest('a13-machine-14'),
  trueRoad6B51_14Passed:pass14,scriptedNotHuman:true};
}
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const spec of proposals){
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   const renderer=await init(page);
   let paused=false,terminal=false;
   const actualKeyboardInputs=[];
   for(const pulse of spec.pulses){
    const first=await advance(page,pulse.start,paused);
    if(spec.name==='TWO_SHORT_RIGHT_RESCUES'&&Math.abs(pulse.start-65.25)<.001){
     await page.screenshot({path:path.join(OUT,'K4CT_R5_T65_25_PRE_INPUT_ORIGINAL_CHASE.png')});
     result.r6Slices.push(await captureR6RawLayerAB(page,'T65_25'));
    }
    if(first.status!=='running'){terminal=true;break;}
    paused=true;
    await page.keyboard.down(pulse.key);
    const second=await advance(page,pulse.end,true);
    const native=await page.evaluate(()=>({mode:document.getElementById('view').dataset.k4csLastInputUsed,
      steering:document.getElementById('view').dataset.k4csActualManualSteer}));
    await page.keyboard.up(pulse.key);
    actualKeyboardInputs.push({...pulse,actual: native,ended:second.status});
    assert.equal(native.mode,'ORIGINAL_MANUAL_KEYBOARD');
    assert.equal(native.steering,pulse.key==='KeyD'?'1':'-1');
    if(second.status!=='running'){terminal=true;break;}
    paused=true;
   }
   if(!terminal){
    const middle=await advance(page,66.35,paused);
    paused=middle.status==='running';
    await page.screenshot({path:path.join(OUT,'K4CT_'+spec.name+'_T66_35_REAL_GAME_RAW.png')});
     if(middle.status==='running')result.r6Slices.push(await captureR6RawLayerAB(page,'T66_35'));
    if(middle.status==='running'){
     const critical=await advance(page,68.05,true);
     await page.screenshot({path:path.join(OUT,'K4CT_R5_T68_05_LATE_ORIGINAL_CHASE.png')});
      if(critical.status==='running')result.r6Slices.push(await captureR6RawLayerAB(page,'T68_05'));
     if(critical.status!=='running'&&critical.status!=='finished'){
      throw Error('original runner failed in late chase scene, original result preserved');
     }
     const end=critical.status==='running'?await advance(page,70.5,true):critical;
     paused=end.status==='running';
    }
   }
   const trace=await page.evaluate(()=>window.__k4ctNativeContactTrace);
   assert.ok(trace?.stations?.length===2&&trace.samples.length>250);
   assert.ok(trace.samples.some(s=>s.mode==='REAL_KEYBOARD'));
   assert.ok(trace.samples.every(s=>s.hazards.length===2));
   const fname='K4CT_'+spec.name+'_ORIGINAL_240HZ_TRACE.json';
   const iname='K4CT_'+spec.name+'_REAL_GAME_FINAL_RAW.png';
   fs.writeFileSync(path.join(OUT,fname),JSON.stringify(trace)+'\n');
   await page.screenshot({path:path.join(OUT,iname)});
   const measured=summarize(trace);
   result.experiments.push({name:spec.name,originalKeyPulses:spec.pulses,
    actualKeyboardInputs,renderer,measured,sourceOriginal:true,traceName:fname,imageName:iname,
    errors,nativeInput:'PLAYWRIGHT_KEYBOARD_NOT_HUMAN'});
   if(errors.length)result.errors.push({name:spec.name,errors});
  }catch(e){
   result.errors.push({name:spec.name,reason:String(e.stack||e).slice(0,1300),errors});
   try{await page.screenshot({path:path.join(OUT,'K4CT_'+spec.name+'_ERROR_RAW.png')});}catch{}
  }finally{await context.close();}
 }
 // Paired actual gameplay experiment: fail by NEUTRAL on the SAME native
 // physical course, click the original retry control, then apply the TWO
 // previously-measured real KeyD pulses to CLEAR. Not a teleport or human test.
 const pairCtx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const pair=await pairCtx.newPage(),pairErrors=[];
 pair.on('pageerror',e=>pairErrors.push(e.message));
 pair.on('console',m=>{if(m.type()==='error')pairErrors.push(m.text().slice(0,250));});
 try{
  const realRenderer=await init(pair);
  // Original takeoverRun already resumes the real Runner; do not click Pause again.
  const failTick=await advance(pair,70.5,false);
  const first=await pair.evaluate(()=>window.__k4ctNativeContactTrace);
  const failed=summarize(first);
  assert.equal(failTick.status,'failed','neutral must REALLY fail before replay');
  assert.equal(failed.finalStatus,'failed');
  assert.equal(failed.failure?.reason,'コースから落下');
  const failureFile='K4CT_PAIR_NEUTRAL_FAILED_ORIGINAL_TRACE.json';
  const failureImage='K4CT_PAIR_NEUTRAL_FAILED_REAL_GAME_RAW.png';
  fs.writeFileSync(path.join(OUT,failureFile),JSON.stringify(first)+'\n');
  await pair.screenshot({path:path.join(OUT,failureImage)});
  await pair.locator('#retryRun').click({timeout:10000});
  await pair.waitForFunction(()=>{
   const c=document.getElementById('view');
   return Number(c.dataset.r15s3d10NativeTicks)<120 &&
       c.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ';
  },undefined,{timeout:10000});
  const resetTick=Number(await pair.locator('#view').getAttribute('data-r15s3d10-native-ticks'));
  assert.ok(resetTick<120,'retry must reset real Runner native tick count');
  // The original renderer restarts from spawn; only ORIGINAL scripted steering
  // brings it to the same pre-choice 63.70s. No synthetic Runner state.
  await pair.evaluate(()=>window.__r15s3d10PauseAt=63.70);
  await pair.locator('#demoRun').click();
  const pre=await waitPause(pair,63.70);
  assert.equal(pre.status,'running');
  assert.ok(pre.nativeTicks>=Math.floor(63.70*240)-2,'retry demo must really replay from 0 to 63.70s');
  await pair.locator('#takeoverRun').click();
  await pair.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',
   undefined,{timeout:15000});
  let paused=false;
  const genuine=[];
  for(const pulse of [{start:65.25,end:65.36,key:'KeyD'},{start:65.79,end:65.91,key:'KeyD'}]){
   const start=await advance(pair,pulse.start,paused);
   assert.ok(start.paused && start.status==='running');
   await pair.keyboard.down(pulse.key);
   const stop=await advance(pair,pulse.end,true);
   const used=await pair.evaluate(()=>({
    path:document.getElementById('view').dataset.k4csLastInputUsed,
    steer:document.getElementById('view').dataset.k4csActualManualSteer
   }));
   await pair.keyboard.up(pulse.key);
   assert.equal(used.path,'ORIGINAL_MANUAL_KEYBOARD');
   assert.equal(used.steer,'1');
   assert.equal(stop.status,'running');
   genuine.push({...pulse,observed:used});
   paused=true;
  }
  const finish=await advance(pair,70.5,paused);
  const second=await pair.evaluate(()=>window.__k4ctNativeContactTrace);
  const recovered=summarize(second);
  assert.equal(finish.status,'finished','same-session real retry must finish');
  assert.equal(recovered.finalStatus,'finished');
  assert.ok(recovered.trueRoad6B51_14Passed,'recovered native Runner never crossed second true B51 station');
  assert.equal(recovered.actualNativeContact14.length,0);
  assert.ok(recovered.minimumGap13M>0 && recovered.minimumGap14M>0);
  const startPose=t=>t.samples.find(s=>Math.abs(s.t-63.70)<.006)?.position;
  const a=startPose(first),c=startPose(second);
  assert.ok(a&&c,'same 63.70s pre-choice sample absent');
  const startPositionDrift=Math.hypot(...a.map((v,i)=>v-c[i]));
  assert.ok(startPositionDrift<0.25,'source pre-choice physical state not reproduced');
  const recoveryFile='K4CT_PAIR_RETRIED_FINISHED_ORIGINAL_TRACE.json';
  const recoveryImage='K4CT_PAIR_RETRIED_FINISHED_REAL_GAME_RAW.png';
  fs.writeFileSync(path.join(OUT,recoveryFile),JSON.stringify(second)+'\n');
  await pair.screenshot({path:path.join(OUT,recoveryImage)});
  if(pairErrors.length)throw Error('native pair browser errors: '+JSON.stringify(pairErrors));
  result.pairedLoop={sameBrowserContext:true,sourceRunnerOriginal:true,
    originalRetryButton:'retryRun',restartFromZero:resetTick<120,
    startPositionDriftM:startPositionDrift,
    nativeRenderer:realRenderer,failed,failedTrace:failureFile,failedImage:failureImage,
    realRecoveryKeys:genuine,finished:recovered,finishedTrace:recoveryFile,finishedImage:recoveryImage,
    actualB51ContactNotDemonstrated:true,
    status:'ORIGINAL_NEUTRAL_FAILURE_TO_NATIVE_RETRY_FINISH_NOT_HUMAN',
    pageErrors:pairErrors};
 }catch(e){
  result.errors.push({name:'ORIGINAL_SAME_SESSION_FAILURE_RETRY_FINISH',reason:String(e.stack||e).slice(0,1600),pageErrors:pairErrors});
  try{await pair.screenshot({path:path.join(OUT,'K4CT_PAIR_FAILURE_ERROR_RAW.png')});}catch{}
 }finally{await pairCtx.close();}

}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 result.experimentsCompleted=result.experiments.length;
 result.road6GroundedObserved=result.experiments.some(x=>x.measured.road6GroundedSamples>0);
 result.b51_14ActualPassed=result.experiments.some(x=>x.measured.trueRoad6B51_14Passed);
 result.actualB51_14Contacts=result.experiments.reduce((s,x)=>s+x.measured.actualNativeContact14.length,0);
 result.realRunnerFailures=result.experiments.filter(x=>x.measured.failure).length;
 result.pairedLoopProven=Boolean(result.pairedLoop?.finished?.finalStatus==='finished' &&
    result.pairedLoop?.failed?.finalStatus==='failed' &&
    result.pairedLoop?.restartFromZero && result.pairedLoop?.sameBrowserContext);
 result.evidenceStatus=result.errors.length?'HOLD_INSTRUMENTATION':
   result.pairedLoopProven?'REAL_NEUTRAL_FAIL_NATIVE_RETRY_FINISH_NOT_HUMAN':
   result.b51_14ActualPassed?'ORIGINAL_SOURCE_ROAD6_STATION_PASS_NOT_HUMAN':
   result.road6GroundedObserved?'REAL_ROAD6_CONTACT_BUT_B51_14_NOT_PASSED':
   'HOLD_NO_ROAD6_GROUNDED';
 fs.writeFileSync(path.join(OUT,'K4CT_SECOND_B51_CONTROLLED_NATIVE_RESULT.json'),JSON.stringify(result,null,2)+'\n');
}
const r11AB=result.r6Slices.flatMap(slice=>
 slice.states.filter(row=>row.trial==='CLEAN').map(row=>row.r11SingleRunAB));
assert.equal(r11AB.length,3,'R11 must complete all three original source chase source-camera ABBA pairs');
assert.deepEqual(r11AB.map(x=>x.sourceCameraLabel),['T65_25','T66_35','T68_05']);
for(const pair of r11AB){
 assert.ok(pair.pairedWithinOneBrowser&&pair.sourceRoadAndB51Untouched);
 assert.equal(pair.results.length,4);
 assert.ok(pair.results.every(r=>r.proof.originalTicks===pair.sourceNativeTick));
}
const r11ArtStudies=result.r6Slices.flatMap(slice=>
 slice.states.filter(row=>row.trial==='CLEAN').map(row=>row.r11OriginalArtAblation));
assert.equal(r11ArtStudies.length,3);
for(const study of r11ArtStudies){
 assert.equal(study.rows.length,4);
 assert.deepEqual(study.rows.map(x=>x.mode),
  ['ALL','NO_REPEATED_ROOF','NO_CONVEYOR','NO_BOTH']);
 assert.ok(study.rows.every(x=>x.proof.ticks===study.originalNativeTick));
}
fs.writeFileSync(path.join(OUT,'K4CT_R11_ORIGINAL_CHASE_DCC_GROUP_CLUTTER_ABLATION.json'),
 JSON.stringify({schema:'k4ct-r11-original-real-source-camera-art-group-attribution-v1',
  realOriginalWebGL2:true,realBlenderEditableGroups:true,
  originalSourceCamera:true,source240Hz:true,
  isolatedGroupNames:[
   '09_QUARRY_EMBEDDED_POWERHOUSE_AND_STEPPED_ROOFS',
   '38_R8D_ONE_SUSPENDED_QUARRY_CONVEYOR'
  ],
  originalGameB48:7,originalB51:28,
  noCollidersChanged:true,originalDCCSourceChanged:false,
  formalART:0,artDecision:'REJECT_PENDING_REAL_SOURCE_IMAGE_CRITIQUE',
  ART_not_a_mockup:true,human:'HOLD',
  sourceTrials:r11ArtStudies},null,2)+'\n');
fs.writeFileSync(path.join(OUT,'K4CT_R11_SAME_BROWSER_ABBA_REJECTED_R10_PERFORMANCE.json'),
 JSON.stringify({schema:'k4ct-r11-same-browser-original-camera-paired-renderer-v1',
  compared:['R9_VERIFIED','R10B_REJECTED'],
  design:'ABBA at fixed 3 source-camera ticks, actual Chromium headless',
  outOfBandShaderCompilation:true,
  sourceCameraTrue:true,originalB48:7,originalB51:28,
  actualSourceNativeHz:240,actualSourceGameUnmodified:true,
  measuredBy:'window.requestAnimationFrame display callback intervals',
  gpuMillisecondsMeasured:false,gameFrameRateCertified:false,
  formalArtAdopted:0,formalFPS:'HOLD',formalHUMAN:'HOLD',
  originalB51CollisionChanged:false,human:false,
  trials:r11AB},null,2)+'\n');
fs.writeFileSync(path.join(OUT,'K4CT_R10_REAL_CHROMIUM_9_VIEW_RAF_PACING.json'),
 JSON.stringify({schema:'k4ct-r10-real-chromium-9-capture-raf-pacing-v1',
  environment:'Github Actions Ubuntu24.04/Chromium headless, GPU backend unspecified',
  sourceCameraTimesSec:[65.25,66.35,68.05],sourceOriginalRunnerHz:240,
  realHumanFPS:false,realGPUtime:false,formalFPS:'HOLD',
  records:result.r6Slices.flatMap(x=>x.states.map(y=>({
   time:x.label,mode:y.trial,sourceTick:y.nativeTicks,
   sourceProgram:y.r9ShaderLinked,roadMode:y.r9SourceRoadUnchanged,
   materialVertexCount:y.r9BlenderMaterialVertices,pacing:y.r10Pacing
  })))},null,2)+'\n');
fs.writeFileSync(path.join(OUT,'K4CT_R8B_K4CS_NONCOLLIDING_GATE_SOURCE_AB_AUDIT.json'),JSON.stringify({schema:'k4ct-r8b-true-k4cs-marker-mesh-safe-draw-ab-v1',slices:result.r6Slices,originalB51:28,originalCamera:true,originalRunner240Hz:true,onlyNoncollisionLayerSwitch:true,ART:'REJECT',HUMAN:'HOLD',formalArt:0})+'\n');
assert.equal(result.r6Slices.length,3,'R7 must capture all three actual source chase times');
for(const f of result.r6Slices)assert.deepEqual(f.states.map(x=>x.trial),['BASE','K4CS','CLEAN']);
assert.equal(result.experimentsCompleted,1,'must retain single known successful reference trial');
assert.ok(result.pairedLoopProven,'same-session original failure, actual retry, and finish not proven');
assert.deepEqual(result.errors,[],'real native browser experiment errors');
console.log('K4CT_SECOND_TRUE_B51_SOURCE_REAL_KEYBOARD',JSON.stringify({count:result.experimentsCompleted,
 trueRoad6:result.road6GroundedObserved,passedB51_14:result.b51_14ActualPassed,
 sameSessionFailRetryFinish:result.pairedLoopProven,
 actualContacts14:result.actualB51_14Contacts,status:result.evidenceStatus,notHuman:true}));
