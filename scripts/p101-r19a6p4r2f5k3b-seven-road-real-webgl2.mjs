/** K3B real original 240Hz WebGL2 camera through original Road4-6, scripted only.
 * Compare each real camera physics state with successful native K3 trial.
 */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const dir=path.resolve('r19-evidence/r19a6p4r2f5k3b');fs.mkdirSync(dir,{recursive:true});
const matrix=JSON.parse(fs.readFileSync('r19-evidence/r19a6p4r2f5k3/R2F5K3_REAL_LATE_STEERING_NATIVE_MATRIX.json'));
const archive=JSON.parse(fs.readFileSync('docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json'));
const blob='af076d67492a677d2235e4730aef8cdf4808e106';
assert.equal(matrix.sourceBlob,blob);assert.equal(archive.origin.originalGitBlob,blob);
assert.equal(matrix.runs.length,16);assert.equal(matrix.switchTick,7680);
const ticks=[265,721,1057,1249,1921,2761,7680,8640,9120,9600,10320,11040,11760,12240];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const result={schema:'dopagaki.r2f5k3b-legal-late-native-original-camera-7roads/1',
 sourceBlob:blob,sourceHz:240,sourceB48:7,sourceB51:28,actualWebGL2:true,
 originalCamera:'ball-lock-unfiltered-heading',scriptedNotHuman:true,
 geometryChanged:false,speedLawChanged:false,collisionChanged:false,
 controller:'P96_div4.8_until_tick7680_then_P94_corrective_div3',
 cameraOriginalFramesNeedMatch:true,allSourceRoadsCameraTarget:true,
 ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',GAMEPLAY:'HOLD',RELEASE:'HOLD',
 MERGE:'HOLD',sessions:[],errors:[]};
await new Promise((yes,no)=>server.once('error',no).listen(0,'127.0.0.1',yes));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const native=matrix.runs.find(r=>r.mode===mode&&r.variant==='p94-corrective-div3');
  assert.ok(native&&native.finishedNativeSource&&native.visitedRoadIndexes.length===7);
  const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
  const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await ctx.newPage(),errors=[],shots=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,450));});
  const trial={mode,stage,shots,realRoadsSeen:[],nativeReference:'p94-corrective-div3',
   originalSourceCamera:true,scriptedNotHuman:true,ART:'HOLD'};
  try{
   await page.goto('http://127.0.0.1:'+server.address().port+
    '/r19a6p4r2f5k3b/?r19a1=on&g5b=off&stage='+stage,
    {waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(s=>document.querySelector('#stage')?.value===s&&
     document.querySelector('#view')?.dataset?.w9c1Isolated==='true',
     stage,{timeout:90000});
   const init=await page.evaluate(()=>{
     const c=document.querySelector('#view'),d=c.dataset;
     return {webgl2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
      B51:Number(d.machineCount),width:Number(d.w9c1Width),g5b:d.g5bMode};
   });
   assert.equal(init.webgl2,true);assert.equal(init.B51,28);assert.equal(init.g5b,'off');
   assert.equal(init.width,mode==='ultra'?14:28);
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   assert.equal(await page.locator('#demoRun').isDisabled(),false);
   for(let k=0;k<ticks.length;k++){
    const tick=ticks[k];await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
    if(k===0)await page.locator('#demoRun').click();else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const d=document.querySelector('#view')?.dataset;
     return Number(d?.r19a1PauseTick)===t||['failed','finished'].includes(d?.r19a1Status);
    },tick,{timeout:180000,polling:40});
    const state=await page.evaluate(()=>{
     const d=document.querySelector('#view').dataset;
     return {tick:Number(d.r19a1NativeTicks),paused:Number(d.r19a1PauseTick),
      xyz:d.r19a1XYZ?.split(',').map(Number),speed:Number(d.r19a1Speed),
      road:d.r19a1Road,status:d.r19a1Status,
      B51:Number(d.r19a1B51),camera:d.cameraMode,
      cameraEye:d.r19a1Eye?.split(',').map(Number),
      cameraFront:d.r19a1Front?.split(',').map(Number),
      privateSteeringLabel:d.r19a1Mode};
    });
    assert.equal(state.status,'running');assert.equal(state.tick,tick);
    assert.equal(state.paused,tick);assert.equal(state.B51,28);
    assert.equal(state.camera,'ball-lock-unfiltered-heading');
    assert.equal(state.privateSteeringLabel,'K3B_LEGAL_LATE_P94_DIV3__NOT_HUMAN');
    let archived=null,nativeCompare=null;
    const a=archive.frames.find(x=>x.mode===mode&&x.tick===tick);
    if(a){
     const eyeErr=Math.hypot(...a.eye.map((x,i)=>x-state.cameraEye[i]));
     const frontErr=Math.hypot(...a.front.map((x,i)=>x-state.cameraFront[i]));
     assert.ok(eyeErr<.15&&frontErr<.0015,
       'Historical camera before 32s changed '+mode+'/'+tick);
     archived={eyeErrorM:eyeErr,frontErrorNorm:frontErr};
    }
    const reference=native.snapshots.find(x=>x.tick===tick);
    if(reference){
     const delta=Math.hypot(...reference.xyz.map((x,i)=>x-state.xyz[i]));
     const velocity=Math.abs(reference.speedMps-state.speed);
     assert.ok(delta<.0005&&velocity<.0005,
       'K3 native source cannot reproduce source browser steering '+mode+'/'+tick+
       ' delta='+delta+' velocity='+velocity);
     assert.equal(reference.road,state.road);
     nativeCompare={xyzErrorM:delta,speedErrorMps:velocity};
    }
    assert.ok(state.cameraEye?.every(Number.isFinite));
    assert.ok(state.cameraFront?.every(Number.isFinite));
    const file='R2F5K3B_'+mode+'_'+tick+'_SOURCE_240HZ_WEBGL2.png';
    const png=await page.locator('#view').screenshot({path:path.join(dir,file),timeout:45000});
    assert.ok(png.length>10000);shots.push({tick,seconds:tick/240,state,file,
     bytes:png.length,sha256:sha(png),archived,nativeCompare});
    console.log('R2F5K3B_TRUE_ORIGINAL_CAMERA_FRAME',JSON.stringify({
     mode,tick,sourceRoad:state.road,bytes:png.length,nativeMatched:!!nativeCompare}));
   }
   const roads=[...new Set(shots.map(s=>s.state.road))];
   trial.realRoadsSeen=roads;
   for(const name of ['VOID_SURGE','PRISM_CREST','FINISH_RIDGE']){
    assert.ok(roads.some(x=>x?.includes(name)),
      'Original Road4/5/6 camera never observed '+mode+'/'+name);
   }
   assert.ok(shots.filter(s=>s.archived).length===6);
   assert.ok(shots.filter(s=>s.nativeCompare).length>=8);
   assert.deepEqual(errors,[]);
   result.sessions.push(trial);
  }catch(err){result.errors.push({mode,error:String(err.stack||err).slice(0,2500),pageErrors:errors});}
  finally{await ctx.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
 fs.writeFileSync(path.join(dir,'R2F5K3B_REAL_SEVEN_ROAD_WEBGL2_CAMERA.json'),JSON.stringify(result,null,2)+'\n');
}
assert.deepEqual(result.errors,[],'Road4-6 genuine WebGL2 coverage is not proven');
assert.equal(result.sessions.length,2);
console.log('R2F5K3B_REAL_SOURCE_CAMERA_7_ROADS_PASS',JSON.stringify({
 shots:result.sessions.reduce((n,s)=>n+s.shots.length,0),modes:['ultra','control'],
 road456Genuine:true,human:false,art:'HOLD'}));
