/** R55: single original Chromium WebGL2 + 240Hz original B51 warning proof.
 * PRIVATE research generated renderer only. KeyD via real source keyboard, NOT human.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const OUT=path.resolve('test-results/k4ct-r56-native-hud');
fs.mkdirSync(OUT,{recursive:true});
const result={schema:'k4ct-r56-original-240hz-webgl2-reversible-hud-ab-v1',
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
  assert.doesNotMatch(v.text,/OPEN\?|SAFE (RIGHT|LEFT)/);
  assert.ok(v.panel.h>20&&v.panel.h<115&&v.panel.w<=725,'cue panel exceeds fixed view budget');
  assert.ok(v.panel.y>=v.canvas.y-1&&v.panel.y<v.canvas.y+110,'panel outside original view');
  for(let i=0;i<v.decision.rows.length&&i<2;i++){
   const row=v.decision.rows[i],id=String(row.id).match(/(\d+)$/)?.[1];
   assert.ok(id&&v.text.includes((i?'THEN':'NEXT')+' B51-'+id));
   assert.ok(v.text.includes(Math.round(row.metres)+'m / '+row.etaSeconds.toFixed(1)+'s'));
  }
 }else assert.equal(v.hidden,true,'stale panel must be hidden');
 const file='K4CT_R56_'+label+'_TRUE_ORIGINAL_GL_RAW.png';
 await page.screenshot({path:path.join(OUT,file),type:'png'});
 return {...v,image:file};
}

/** Same original paused tick / same GL view / same B51, CSS-only A/B. */
async function captureAB(page,label){
 const baseline=await capture(page,label+'_BASE');
 const info=await page.evaluate(()=>{
  const c=document.getElementById('view'),rect=c.getBoundingClientRect();
  const style=document.createElement('style');style.id='k4ctR56ResearchStyles';
  const panelX=rect.left+rect.width*.418;
  style.textContent='#k4ctOriginalTwoB51Panel{width:440px!important;max-width:440px!important;box-sizing:border-box!important;left:'+panelX.toFixed(1)+'px!important;font-size:12px!important;line-height:1.35!important;padding:6px 9px!important;}';
  document.head.append(style);
  const candidates=Array.from(document.querySelectorAll('div,aside,output')).filter(el=>{
   const t=(el.innerText||el.textContent||'').trim(),b=el.getBoundingClientRect();
   return /^NEAR\s+MISS\b/i.test(t)&&t.length<130&&b.width>160&&b.height>22&&b.height<180&&b.left>=rect.left&&b.right<=rect.right+5;
  }).sort((a,b)=>{
   const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();
   return B.width*B.height-A.width*A.height;
  });
  const bonus=candidates[0]||null;
  const d=JSON.parse(c.dataset.k4ctDecisionJson||'null'),first=d?.rows?.[0];
  const imminent=Number.isFinite(first?.etaSeconds)&&first.etaSeconds<=.75;
  if(bonus&&imminent)bonus.style.setProperty('visibility','hidden','important');
  const oldWarn=Array.from(document.querySelectorAll('body *')).filter(el=>{
   const t=(el.innerText||el.textContent||'').trim(),b=el.getBoundingClientRect();
   return t.includes('P97 REAL ROAD PREWARNING')&&t.length<160&&b.width>80&&b.height>8&&b.height<130&&b.left>=rect.left&&b.right<=rect.right+8;
  }).sort((a,b)=>{
   const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();
   return A.width*A.height-B.width*B.height;
  });
  const ww=oldWarn[0]?.getBoundingClientRect();
  return {imminent,bonusFound:Boolean(bonus),bonusText:bonus?.textContent||null,
   bonusVisibility:bonus?getComputedStyle(bonus).visibility:null,
   P97:ww?{x:ww.x,y:ww.y,w:ww.width,h:ww.height}:null,
   originalRoadNoticeKept:true,sourceWarningPanelMovedOnly:true};
 });
 await page.waitForTimeout(150);
 const candidate=await capture(page,label+'_CANDIDATE');
 assert.equal(baseline.tick,candidate.tick,'original 240Hz Runner progressed during A/B');
 assert.equal(baseline.originalB51,candidate.originalB51);
 assert.equal(JSON.stringify(baseline.decision),JSON.stringify(candidate.decision),
  'native moving B51 data changed during CSS-only research test');
 assert.equal(baseline.text,candidate.text,'research cue semantics changed');
 assert.ok(candidate.panel.w>=430&&candidate.panel.w<=441);
 assert.ok(candidate.panel.x>=baseline.canvas.x+200);
 assert.ok(candidate.panel.x+candidate.panel.w<=baseline.canvas.x+baseline.canvas.w*.67);
 if(info.P97){
  const right=candidate.panel.x+candidate.panel.w;
  assert.ok(right<=info.P97.x+2,
   'candidate B51 and existing P97 warning still geometrically overlap');
 }
 if(label==='T68_05'){
  assert.ok(info.imminent,'expected real B51 imminent hazard');
  assert.ok(info.bonusFound,'NEAR MISS visual bonus overlay not found');
  assert.equal(info.bonusVisibility,'hidden');
  assert.match(info.bonusText,/NEAR\s+MISS/);
 }
 await page.evaluate(()=>{
  document.getElementById('k4ctR56ResearchStyles')?.remove();
  for(const el of document.querySelectorAll('div,aside,output'))
   if(el.style.getPropertyPriority('visibility')==='important'&&/^NEAR\s+MISS\b/i.test((el.innerText||el.textContent||'').trim()))
    el.style.removeProperty('visibility');
 });
 assert.equal(Number(await page.locator('#view').getAttribute('data-r15s3d10-native-ticks')),baseline.tick);
 return {baseline,candidate,independentHudStudy:info};
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
 result.status='R56_NATIVE_PRIVATE_HUD_AB_TECH_PASS_ART_HOLD';
 await ctx.close();
}catch(e){
 result.status='HOLD_R56_HUD_AB_NOT_PROVEN';
 result.errors.push(String(e.stack||e).slice(0,2400));
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 fs.writeFileSync(path.join(OUT,'K4CT_R56_ORIGINAL_NATIVE_WARNING_RESULT.json'),JSON.stringify(result,null,2)+'\n');
}
if(result.status!=='R56_NATIVE_PRIVATE_HUD_AB_TECH_PASS_ART_HOLD'){
 console.error('R56_NATIVE_HOLD',JSON.stringify(result.errors));process.exitCode=1;
}else console.log('R56_NATIVE_PASS',JSON.stringify({frames:3,source:'ORIGINAL_240HZ_WEBGL2',B51:28,ART:'HOLD',HUMAN:'HOLD'}));
