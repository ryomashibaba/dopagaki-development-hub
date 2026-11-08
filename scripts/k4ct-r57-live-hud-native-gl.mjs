/** R55: single original Chromium WebGL2 + 240Hz original B51 warning proof.
 * PRIVATE research generated renderer only. KeyD via real source keyboard, NOT human.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const OUT=path.resolve('test-results/k4ct-r57-live-hud');
fs.mkdirSync(OUT,{recursive:true});
const result={schema:'k4ct-r57-native-game-live-hud-reversible-v1',
  originalB48:7,originalB51:28,newColliders:0,sourceEdited:false,
  formalArtAdopted:0,slope2DNAmetres:0,
  HUMAN:'HOLD',ART:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  frames:[],errors:[]};
let browser=null;
await new Promise((ok,fail)=>server.once('error',fail).listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
async function advance(page,t,wasPaused){
 await page.evaluate(x=>window.__r15s3d10PauseAt=x,t);
 if(wasPaused)await page.locator('#pause').click();
 await page.waitForFunction(x=>{
  const c=document.getElementById('view');
  const tick=Number(c.dataset.r15s3d10NativeTicks);
  return (tick>=Math.floor(x*240)-2&&Math.abs(Number(c.dataset.r15s3d10PausedAt)-x)<.009&&
    c.dataset.r15s3d10Status==='running')||
    ['failed','finished'].includes(c.dataset.r15s3d10Status);
 },t,{timeout:120000,polling:50});
 const s=await page.locator('#view').evaluate(c=>({status:c.dataset.r15s3d10Status,
  tick:Number(c.dataset.r15s3d10NativeTicks),paused:Number(c.dataset.r15s3d10PausedAt)}));
 assert.equal(s.status,'running','original native Runner ended before '+t);
 assert.ok(Math.abs(s.paused-t)<.009&&Math.abs(s.tick-t*240)<=2,'invalid 240Hz source tick');
 return s;
}
async function capture(page,label){
 await page.waitForFunction(()=>{
  const c=document.getElementById('view'),e=document.getElementById('k4ctOriginalTwoB51Panel');
  return c&&e&&c.dataset.k4ctTwoRealCount!==undefined;
 },undefined,{timeout:15000,polling:50});
 const v=await page.evaluate(()=>{
  const c=document.getElementById('view'),e=document.getElementById('k4ctOriginalTwoB51Panel');
  const g=c.getContext('webgl2'),rc=e.getBoundingClientRect(),rr=c.getBoundingClientRect();
  return {nativeWebGL2:g instanceof WebGL2RenderingContext,
   original240Hz:c.dataset.r15s3d10OriginalGame,
   originalB51:Number(c.dataset.g4e7yRetainedMachines),
   status:c.dataset.r15s3d10Status,tick:Number(c.dataset.r15s3d10NativeTicks),
   twoRealCount:Number(c.dataset.k4ctTwoRealCount),
   decision:JSON.parse(c.dataset.k4ctDecisionJson||'null'),
   hidden:e.hidden,text:e.textContent,
   panel:{x:rc.x,y:rc.y,w:rc.width,h:rc.height},
   canvas:{x:rr.x,y:rr.y,w:rr.width,h:rr.height}
  };
 });
 assert.ok(v.nativeWebGL2);
 assert.equal(v.original240Hz,'REAL_WEBGL2_SOURCE_240HZ');
 assert.equal(v.originalB51,28);
 assert.equal(v.status,'running');
 assert.ok(v.twoRealCount>=0&&v.twoRealCount<=2);
 if(v.twoRealCount>0){
  assert.equal(v.hidden,false);
  assert.equal(v.decision.realB48,true);
  assert.equal(v.decision.realB51,28);
  assert.equal(v.decision.originalRunnerPhysicsUnchanged,true);
  assert.equal(v.decision.rowCount,v.twoRealCount);
  assert.match(v.text,/PREDICTION ONLY - NO GUARANTEED SAFE LANE/);
  assert.doesNotMatch(v.text,/\bMOVING (?:LEFT|RIGHT|CENTER)\b/,'predicted future location must not be called velocity');
  assert.equal((v.text.match(/PREDICTED AT (?:LEFT|RIGHT|CENTER|UNKNOWN)/g)||[]).length,v.twoRealCount,
   'every true original B51 warning must describe future location, not motion');
  assert.doesNotMatch(v.text,/OPEN\?|SAFE (RIGHT|LEFT)/);
  assert.ok(v.panel.h>20&&v.panel.h<115&&v.panel.w<=725,'cue panel exceeds fixed view budget');
  assert.ok(v.panel.y>=v.canvas.y-1&&v.panel.y<v.canvas.y+110,'panel outside original view');
  for(let i=0;i<v.decision.rows.length&&i<2;i++){
   const row=v.decision.rows[i],id=String(row.id).match(/(\d+)$/)?.[1];
   assert.ok(id&&v.text.includes((i?'THEN':'NEXT')+' B51-'+id));
   assert.ok(v.text.includes(Math.round(row.metres)+'m / '+row.etaSeconds.toFixed(1)+'s'));
  }
 }else assert.equal(v.hidden,true,'stale panel must be hidden');
 const file='K4CT_R57_'+label+'_TRUE_ORIGINAL_GL_RAW.png';
 await page.screenshot({path:path.join(OUT,file),type:'png'});
 return {...v,image:file};
}

/** Live R57 source-native HUD A/B. Crucially: NO Playwright-added CSS, only
 * the integrated per-frame renderer calls applyK4CTR57Hud() at each source tick.
 */
async function captureAB(page,label){
 await page.evaluate(()=>window.__k4ctR57HudMode='BASE');
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4ctR57HudMode==='BASE',undefined,{timeout:10000});
 const baseline=await capture(page,label+'_BASE');
 const baselineState=await page.evaluate(()=>{
  const c=document.getElementById('view');
  return {tick:Number(c.dataset.r15s3d10NativeTicks),
   css:Boolean(document.getElementById('k4ctR57LiveHudCSS')),
   bonusSuppressed:c.dataset.k4ctR57BonusSuppressed};
 });
 assert.equal(baselineState.css,false,'BASE mode left research CSS active');
 assert.equal(baselineState.bonusSuppressed,'false','BASE suppressed reward');
 await page.evaluate(()=>window.__k4ctR57HudMode='CANDIDATE');
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4ctR57HudMode==='CANDIDATE',undefined,{timeout:10000});
 const candidate=await capture(page,label+'_CANDIDATE');
 const applied=await page.evaluate(()=>{
  const c=document.getElementById('view'),b=document.querySelectorAll('div,aside,output');
  let banner=null;
  for(const e of b){
   const t=(e.innerText||e.textContent||'').trim(),r=e.getBoundingClientRect(),cv=c.getBoundingClientRect();
   if(/^NEAR\s+MISS\b/i.test(t)&&t.length<130&&r.width>160&&r.height>22&&r.height<180&&r.left>=cv.left&&r.right<=cv.right+5){banner=e;break;}
  }
  return {tick:Number(c.dataset.r15s3d10NativeTicks),
   css:Boolean(document.getElementById('k4ctR57LiveHudCSS')),
   mode:c.dataset.k4ctR57HudMode,eligible:c.dataset.k4ctR57HudEligible,
   immediate:c.dataset.k4ctR57ImmediateHazard,
   bonusFound:c.dataset.k4ctR57BonusFound,
   bonusSuppressed:c.dataset.k4ctR57BonusSuppressed,
   bonusVisible:banner?getComputedStyle(banner).visibility:null,
   bonusText:banner?.textContent||null,
   legacyP97TextIncluded:document.body.innerText.includes('P97 REAL ROAD PREWARNING'),
   note:'P97 display remains in unchanged original source; this only tests text existence, not unique panel bounds.'};
 });
 assert.equal(baseline.tick,candidate.tick,'native Runner tick changed on live HUD A/B');
 assert.equal(baselineState.tick,applied.tick);
 assert.equal(JSON.stringify(baseline.decision),JSON.stringify(candidate.decision),
  'real B51 telemetry changed by live research HUD');
 assert.equal(baseline.text,candidate.text);
 assert.equal(applied.css,true);
 assert.equal(applied.eligible,'true');
 assert.ok(candidate.panel.w>=430&&candidate.panel.w<=441);
 assert.ok(candidate.panel.x>=baseline.canvas.x+200);
 assert.ok(candidate.panel.x+candidate.panel.w<=baseline.canvas.x+baseline.canvas.w*.67);
 // Original P97 is a native game visual, not a guaranteed DOM text node.
 // Retain the observation and independently review the TRUE source RAW; do
 // not confuse innerText absence with deletion of the original warning.
 if(!applied.legacyP97TextIncluded)result.p97DomTextInstrumented=false;
 if(label==='T68_05'){
  assert.equal(applied.immediate,'true');
  assert.equal(applied.bonusFound,'true');
  assert.equal(applied.bonusSuppressed,'true');
  assert.equal(applied.bonusVisible,'hidden');
  assert.match(applied.bonusText,/NEAR\s+MISS/);
 }
 // True live reversion at the identical source tick, no ad hoc Playwright CSS.
 await page.evaluate(()=>window.__k4ctR57HudMode='BASE');
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4ctR57HudMode==='BASE',undefined,{timeout:10000});
 const restored=await page.evaluate(()=>{
  const c=document.getElementById('view');
  const all=Array.from(document.querySelectorAll('div,aside,output')).filter(e=>
   /^NEAR\s+MISS\b/i.test((e.innerText||e.textContent||'').trim())&&e.getBoundingClientRect().width>160);
  const found=all[0];
  return {tick:Number(c.dataset.r15s3d10NativeTicks),styleExists:Boolean(document.getElementById('k4ctR57LiveHudCSS')),
   bonusSuppressed:c.dataset.k4ctR57BonusSuppressed,
   rewardVisible:found?getComputedStyle(found).visibility:null};
 });
 assert.equal(restored.tick,baseline.tick);
 assert.equal(restored.styleExists,false);
 assert.equal(restored.bonusSuppressed,'false');
 if(label==='T68_05')assert.notEqual(restored.rewardVisible,'hidden','BASE did not restore NEAR MISS');
 return {baseline,candidate,applied,restored};
}

try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const page=await ctx.newPage();
 page.on('pageerror',e=>result.errors.push(String(e.message)));
 await page.goto(base+'/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{
  const c=document.getElementById('view');
  return c?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
   document.getElementById('stage').value==='K4CT-TWO-REAL-B51-CHOICE';
 },undefined,{timeout:90000});
 const ok=await page.locator('#view').evaluate(c=>c.getContext('webgl2') instanceof WebGL2RenderingContext);
 assert.ok(ok,'not real Chromium WebGL2');
 await page.locator('#cameraCompare').click();
 await page.locator('#demoSpeed').selectOption('2');
 await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
 await page.locator('#demoRun').click();
 await advance(page,63.70,false);
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',undefined,{timeout:15000});
 await advance(page,65.25,false);
 result.frames.push(await captureAB(page,'T65_25'));
 await page.keyboard.down('KeyD');
 await advance(page,65.36,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,65.79,true);
 await page.keyboard.down('KeyD');
 await advance(page,65.91,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,66.35,true);
 result.frames.push(await captureAB(page,'T66_35'));
 await advance(page,68.05,true);
 result.frames.push(await captureAB(page,'T68_05'));
 assert.equal(result.frames.length,3);
 assert.ok(result.frames.some(f=>f.candidate.twoRealCount>0),'no actual native cue was tested');
 assert.deepEqual(result.errors,[],'pageerrors');
 result.status='R57_NATIVE_LIVE_HUD_REVERSION_TECH_PASS_ART_HOLD';
 await ctx.close();
}catch(e){
 result.status='HOLD_R57_LIVE_HUD_NOT_PROVEN';
 result.errors.push(String(e.stack||e).slice(0,2400));
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 fs.writeFileSync(path.join(OUT,'K4CT_R57_ORIGINAL_NATIVE_WARNING_RESULT.json'),JSON.stringify(result,null,2)+'\n');
}
if(result.status!=='R57_NATIVE_LIVE_HUD_REVERSION_TECH_PASS_ART_HOLD'){
 console.error('R57_NATIVE_HOLD',JSON.stringify(result.errors));process.exitCode=1;
}else console.log('R57_NATIVE_PASS',JSON.stringify({frames:3,source:'ORIGINAL_240HZ_WEBGL2',B51:28,ART:'HOLD',HUMAN:'HOLD'}));
