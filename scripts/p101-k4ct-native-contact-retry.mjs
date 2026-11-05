/** K4CT contact-to-consequence / real retry on the same original native 240Hz WebGL2 Runner.
 * New experiment, not a repeat of K4CT R2's pre-contact proof. No HUMAN/ART certification.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';

const out=path.resolve('test-results/k4ct-contact-retry');
fs.mkdirSync(out,{recursive:true});
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
const report={schema:'k4ct-240hz-original-b51-13-14-contact-retry-v1',nativeInput:'PLAYWRIGHT_KEYBOARD_NOT_HUMAN',
 sourceOriginal:true,originalPhysicalGameUntouched:true,gateScope:'RESEARCH_ONLY',
 ART:'REJECT',formalART:0,slope2DNAmeters:0,HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',
 RELEASE:'HOLD',MERGE:'HOLD',trials:[],retry:null,errors:[]};
let browser=null;
const failureText=e=>String(e?.stack||e).slice(0,1500);
function analyze(trace){
 const stations=trace?.stations??[],samples=trace?.samples??[];
 const events=samples.flatMap(s=>s.events??[]);
 const m={nativeTicks:samples.length,firstT:samples[0]?.t??null,lastT:samples.at(-1)?.t??null,
  originalB51Stations:stations,firstMode:samples[0]?.mode??null,lastMode:samples.at(-1)?.mode??null,
  lastStatus:samples.at(-1)?.status??'UNKNOWN',lastRoad:samples.at(-1)?.road??null,
  failureEvents:events.filter(e=>e.type==='failure'),movingContactEvents:events.filter(e=>e.type==='moving-contact'),
  movingUnsafeEvents:events.filter(e=>e.type==='moving-unsafe'||e.type==='moving-crush'),
  staticFatalEvents:events.filter(e=>e.type==='static-fatal-contact')};
 m.minGapM={};m.passedStation={};
 for(const st of stations){
  const vals=samples.map(s=>s.hazards.find(h=>h.id===st.id)?.separationM).filter(Number.isFinite);
  m.minGapM[st.id]=vals.length?Math.min(...vals):null;
  const later=samples.filter(s=>s.progressM!=null&&s.progressM>st.stationM+20&&s.centrelineDistanceM<=75);
  m.passedStation[st.id]=later.length>0;
 }
 const last=samples.at(-1);
 m.failureReason=m.failureEvents.at(-1)?.reason??null;
 m.outcome=m.failureEvents.length?'REAL_NATIVE_FAILURE':
   m.passedStation['a13-machine-13']&&!m.movingContactEvents.some(e=>e.id==='a13-machine-13')&&last?.status==='running'?'B51_13_GEOMETRIC_PASS_NOT_HUMAN':'HOLD_INCOMPLETE_OR_UNRESOLVED';
 m.contact13=m.movingContactEvents.some(e=>e.id==='a13-machine-13');
 m.contact14=m.movingContactEvents.some(e=>e.id==='a13-machine-14');
 m.firstChoiceRealKeyboard=samples.some(s=>s.mode==='REAL_KEYBOARD');
 return m;
}
async function setup(page){
 await page.goto(base+'/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>document.getElementById('view')?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
   document.getElementById('stage').value==='K4CT-TWO-REAL-B51-CHOICE',undefined,{timeout:90000});
 const verified=await page.evaluate(()=>{const c=document.getElementById('view'),g=c.getContext('webgl2');return {
  nativeGL:g instanceof WebGL2RenderingContext,
  nativeStatus:c.dataset.r15s3d10OriginalGame,stage:document.getElementById('stage').value
 }});
 assert.ok(verified.nativeGL&&verified.nativeStatus==='REAL_WEBGL2_SOURCE_240HZ');
 await page.locator('#cameraCompare').click();
 await page.waitForFunction(()=>document.getElementById('view').dataset.cameraMode==='ball-lock-unfiltered-heading');
 await page.locator('#demoSpeed').selectOption('2');
}
async function arriveAtChoice(page){
 await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
 await page.locator('#demoRun').click();
 await page.waitForFunction(()=>Math.abs(Number(document.getElementById('view').dataset.r15s3d10PausedAt)-63.70)<0.009||
  ['failed','finished'].includes(document.getElementById('view').dataset.r15s3d10Status),undefined,{timeout:120000,polling:50});
 assert.equal(await page.locator('#view').getAttribute('data-r15s3d10-status'),'running',
  'source Runner failed before real B51 choice');
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',undefined,{timeout:15000});
}
async function awaitOutcome(page,target){
 await page.waitForFunction(t=>{
  const c=document.getElementById('view'),done=Math.abs(Number(c.dataset.r15s3d10PausedAt)-t)<.009;
  return done||['failed','finished'].includes(c.dataset.r15s3d10Status);
 },target,{timeout:120000,polling:50});
}
async function steerAfterChoice(page,key,holdUntilEnd=false){
 const destination=70.25;
 if(key&&!holdUntilEnd){
  await page.evaluate(()=>window.__r15s3d10PauseAt=64.05);
  await page.keyboard.down(key);
  await page.waitForFunction(k=>document.getElementById('view').dataset.k4csLastInputUsed==='ORIGINAL_MANUAL_KEYBOARD'&&
    document.getElementById('view').dataset.k4csActualManualSteer===(k==='KeyA'?'-1':'1'),key,{timeout:15000});
  await awaitOutcome(page,64.05);
  await page.keyboard.up(key);
  const ended=await page.locator('#view').getAttribute('data-r15s3d10-status');
  if(!['failed','finished'].includes(ended)){
   await page.evaluate(t=>window.__r15s3d10PauseAt=t,destination);
   await page.locator('#pause').click();
   await awaitOutcome(page,destination);
  }
 }else{
  await page.evaluate(t=>window.__r15s3d10PauseAt=t,destination);
  if(key)await page.keyboard.down(key);
  await awaitOutcome(page,destination);
  if(key)await page.keyboard.up(key);
 }
}
async function collect(page,label){
 const t=await page.evaluate(()=>window.__k4ctNativeContactTrace);
 assert.ok(t?.stations?.length===2&&t.samples?.length>30,'native B51-13/14 trace absent');
 assert.ok(t.samples.every(s=>Number.isFinite(s.t)&&s.hazards.length===2),'not original physical samples');
 assert.ok(t.samples.some(s=>s.mode==='REAL_KEYBOARD'),'never handed over to original manual Runner');
 const result=analyze(t);
 const traceName='K4CT_'+label+'_NATIVE_240HZ_TRACE.json';
 fs.writeFileSync(path.join(out,traceName),JSON.stringify(t)+'\n');
 const imageName='K4CT_'+label+'_REAL_WEBGL2_RAW.png';
 await page.screenshot({path:path.join(out,imageName),timeout:30000});
 return {label,result,traceName,imageName,jsErrorCount:0,notHuman:true};
}
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const spec of [
  {label:'NEUTRAL',key:null},
  {label:'LEFT_PULSE',key:'KeyA'},
  {label:'RIGHT_PULSE',key:'KeyD'},
  {label:'LEFT_COMMIT',key:'KeyA',hold:true}
 ]){
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage(),errs=[];
  page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,250))});
  try{
   await setup(page);await arriveAtChoice(page);
   await steerAfterChoice(page,spec.key,spec.hold);
   const primary=await collect(page,spec.label);
   primary.jsErrors=errs;
   report.trials.push(primary);
   if(!report.retry&&primary.result.lastStatus==='failed'){
    await page.locator('#retryRun').click({timeout:10000});
    await page.waitForFunction(()=>Number(document.getElementById('view').dataset.r15s3d10NativeTicks)<120&&
     document.getElementById('view').dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ',undefined,{timeout:10000});
    await arriveAtChoice(page);
    await steerAfterChoice(page,spec.key==='KeyA'?'KeyD':'KeyA');
    const second=await collect(page,'AFTER_REAL_FAILURE_RETRY');
    report.retry={from:spec.label,via:'ORIGINAL_RETRY_RUN_UI',restartedFromTickZero:true,
     trial:second,jsErrors:errs};
   }
   if(errs.length)report.errors.push({trial:spec.label,jsErrors:errs});
  }catch(e){
   report.errors.push({trial:spec.label,error:failureText(e),jsErrors:errs});
   try{await page.screenshot({path:path.join(out,'K4CT_'+spec.label+'_ERROR_RAW.png')});}catch{}
  }finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 report.nativeTrialsCompleted=report.trials.length;
 report.realFailureObserved=report.trials.some(t=>t.result.failureEvents.length>0);
 report.realRetryObserved=Boolean(report.retry?.trial);
 report.contactEventsB51_13=report.trials.reduce((a,t)=>a+t.result.movingContactEvents.filter(e=>e.id==='a13-machine-13').length,0);
 report.contactEventsB51_14=report.trials.reduce((a,t)=>a+t.result.movingContactEvents.filter(e=>e.id==='a13-machine-14').length,0);
 report.evidenceStatus=report.errors.length?'HOLD_TRIAL_ERRORS':
   report.realRetryObserved?'REAL_FAILURE_RETRY_EVIDENCED_NOT_HUMAN':'HOLD_NO_RETRY_EVIDENCE';
 fs.writeFileSync(path.join(out,'K4CT_CONTACT_RETRY_REAL_RESULT.json'),JSON.stringify(report,null,2)+'\n');
}
assert.ok(report.trials.length>=3,'fewer than 3 real native choice trials: '+JSON.stringify(report.errors));
assert.equal(report.errors.length,0,'native trials had JavaScript, browser or runner setup errors');
console.log('K4CT_REAL_240HZ_CONTACT_RETRY_NOT_HUMAN',JSON.stringify({
 trials:report.nativeTrialsCompleted,contact13:report.contactEventsB51_13,
 contact14:report.contactEventsB51_14,realFailure:report.realFailureObserved,
 realRetry:report.realRetryObserved,status:report.evidenceStatus,HUMAN:'HOLD',ART:'REJECT'}));
