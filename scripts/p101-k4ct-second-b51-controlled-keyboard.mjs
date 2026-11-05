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
const proposals=[
 {name:'CORRECT_RIGHT_EARLY',pulses:[{start:65.15,end:65.30,key:'KeyD'}]},
 {name:'CORRECT_RIGHT_MID',pulses:[{start:65.48,end:65.66,key:'KeyD'}]},
 {name:'CORRECT_RIGHT_LATE',pulses:[{start:65.82,end:66.00,key:'KeyD'}]},
 {name:'TWO_SHORT_RIGHT_RESCUES',pulses:[{start:65.25,end:65.36,key:'KeyD'},{start:65.79,end:65.91,key:'KeyD'}]}
];
const result={schema:'k4ct-actual-source-road6-b51-14-native-keyboard-corrective-v1',
 previousRun:'https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42046550320',
 rawSourceGame:true,real240Hz:true,nativeKeyAKeyDOnly:true,HUMAN:'HOLD',
 formalART:0,ART:'REJECT',slope2DNAmeters:0,SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',
 RELEASE:'HOLD',MERGE:'HOLD',newColliders:0,experiments:[],errors:[]};
let browser=null;
async function waitPause(page,t){
 await page.waitForFunction(t=>{
  const c=document.getElementById('view');
  return Math.abs(Number(c.dataset.r15s3d10PausedAt)-t)<0.009||
    ['failed','finished'].includes(c.dataset.r15s3d10Status);
 },t,{timeout:120000,polling:50});
 return await page.evaluate(()=>({status:document.getElementById('view').dataset.r15s3d10Status,
   pausedAt:Number(document.getElementById('view').dataset.r15s3d10PausedAt)}));
}
async function advance(page,t,paused){
 await page.evaluate(x=>window.__r15s3d10PauseAt=x,t);
 if(paused)await page.locator('#pause').click();
 const state=await waitPause(page,t);
 return {paused:state.status==='running'&&Math.abs(state.pausedAt-t)<0.009,
  status:state.status,time:state.pausedAt};
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
    if(middle.status==='running'){
     const end=await advance(page,70.5,true);
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
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 result.experimentsCompleted=result.experiments.length;
 result.road6GroundedObserved=result.experiments.some(x=>x.measured.road6GroundedSamples>0);
 result.b51_14ActualPassed=result.experiments.some(x=>x.measured.trueRoad6B51_14Passed);
 result.actualB51_14Contacts=result.experiments.reduce((s,x)=>s+x.measured.actualNativeContact14.length,0);
 result.realRunnerFailures=result.experiments.filter(x=>x.measured.failure).length;
 result.evidenceStatus=result.errors.length?'HOLD_INSTRUMENTATION':
   result.b51_14ActualPassed?'ORIGINAL_SOURCE_ROAD6_STATION_PASS_NOT_HUMAN':
   result.road6GroundedObserved?'REAL_ROAD6_CONTACT_BUT_B51_14_NOT_PASSED':
   'HOLD_NO_ROAD6_GROUNDED';
 fs.writeFileSync(path.join(OUT,'K4CT_SECOND_B51_CONTROLLED_NATIVE_RESULT.json'),JSON.stringify(result,null,2)+'\n');
}
assert.ok(result.experimentsCompleted>=3,'not enough real independent browser sessions');
assert.deepEqual(result.errors,[],'real native browser experiment errors');
console.log('K4CT_SECOND_TRUE_B51_SOURCE_REAL_KEYBOARD',JSON.stringify({count:result.experimentsCompleted,
 trueRoad6:result.road6GroundedObserved,passedB51_14:result.b51_14ActualPassed,
 actualContacts14:result.actualB51_14Contacts,status:result.evidenceStatus,notHuman:true}));
