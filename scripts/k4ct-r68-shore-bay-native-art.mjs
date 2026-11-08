/** R55: single original Chromium WebGL2 + 240Hz original B51 warning proof.
 * PRIVATE research generated renderer only. KeyD via real source keyboard, NOT human.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const OUT=path.resolve('test-results/k4ct-r68-shore-bay-native-art');
fs.mkdirSync(OUT,{recursive:true});
const result={schema:'k4ct-r68-one-genuine-shore-bay-original-native-three-frame-v1',
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
   trueSourceCamera:window.__k4ctR60ActualCamera?.slice()||null,
   realNativeB51Poses:structuredClone(window.__k4ctR60SourceB51Pose||[]),
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
 assert.ok(v.trueSourceCamera?.length===12&&v.trueSourceCamera.every(Number.isFinite),'authentic original camera missing');
 assert.deepEqual(v.realNativeB51Poses.map(x=>x.id),['a13-machine-14','a13-machine-15']);
 for(const hazard of v.realNativeB51Poses){assert.ok(hazard.centre?.length===3&&hazard.halfSize?.length===3);assert.ok(hazard.enabled);}
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
 const file='K4CT_R68_ART_'+label+'_TRUE_ORIGINAL_GL_RAW.png';
 await page.screenshot({path:path.join(OUT,file),type:'png'});
 return {...v,image:file};
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
 result.frames.push(await capture(page,'T65_25'));
 await page.keyboard.down('KeyD');
 await advance(page,65.36,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,65.60,true);
 result.frames.push(await capture(page,'T65_60'));
 await advance(page,65.79,true);
 await page.keyboard.down('KeyD');
 await advance(page,65.91,true);
 assert.equal(await page.locator('#view').getAttribute('data-k4cs-last-input-used'),'ORIGINAL_MANUAL_KEYBOARD');
 await page.keyboard.up('KeyD');
 await advance(page,66.35,true);
 result.frames.push(await capture(page,'T66_35'));
 // Stop at 66.35: R60 is a bounded genuine early-frustum study.
 // Deliberately no extra 68.05 raster or reward HUD replay.
 assert.equal(result.frames.length,3);
 assert.ok(result.frames.some(f=>f.twoRealCount>0),'no actual native cue was tested');
 assert.deepEqual(result.errors,[],'pageerrors');
 result.status='R68_ONE_TRUE_SHORE_BAY_SOURCE_GL_CAPTURED_ART_HOLD';
 await ctx.close();
}catch(e){
 result.status='R68_NATIVE_GL_OR_SOURCE_HOLD';
 result.errors.push(String(e.stack||e).slice(0,2400));
}finally{
 if(browser)await browser.close();
 await new Promise(done=>server.close(done));
 fs.writeFileSync(path.join(OUT,'K4CT_R68_ART_ORIGINAL_NATIVE_WARNING_RESULT.json'),JSON.stringify(result,null,2)+'\n');
}
if(result.status!=='R68_ONE_TRUE_SHORE_BAY_SOURCE_GL_CAPTURED_ART_HOLD'){
 console.error('R68_NATIVE_HOLD',JSON.stringify(result.errors));process.exitCode=1;
}else console.log('R68_NATIVE_PASS',JSON.stringify({frames:3,source:'ORIGINAL_240HZ_WEBGL2',B51:28,ART:'HOLD',HUMAN:'HOLD'}));
