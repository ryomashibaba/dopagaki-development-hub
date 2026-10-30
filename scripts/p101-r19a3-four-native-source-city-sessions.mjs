/** R19 A3: genuine source WebGL2 native camera test of ONE civic building.
 * 14m ULTRA: clean road+hazards vs one new civic campus x4 frames;
 * CONTROL 28m: matching clean source reference vs same new art x4 frames.
 * No colored proxy drawing, no stage/collider/steering/speed fudging.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const dir=path.resolve('r19-evidence/r19a3');
fs.mkdirSync(dir,{recursive:true});
const truth=JSON.parse(fs.readFileSync('r19-evidence/R19_A1_NATIVE12S_SOURCE.json','utf8'));
assert.equal(truth.sourceBlob,'af076d67492a677d2235e4730aef8cdf4808e106');
const cases={
 ultra:['off','on'],
 control:['off','on']
};
const ticks=[721,1057,1249,1921];
const proof={schema:'dopagaki.r19a3-one-civic-city-actual-12second-art-comparison/1',
 originalSourceSHA:truth.sourceBlob,originalA1NativeProof:'r19a0-real-12second-integrated-slice',
 originalCamera:'ball-lock-unfiltered-heading',originalB48:7,originalMovingB51:28,
 nativeTicks:ticks,ART:'HOLD',HUMAN:'HOLD',GAMEPLAY:'HOLD',PERFORMANCE:'HOLD',
 SLOPE2_OFFICIALLY_CERTIFIED_M:0,oneUnapprovedCityNotArtQuality:true,
 sessions:[],failures:[]};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const [kind,layers] of Object.entries(cases)){
  const actual=truth.studies.find(s=>s.mode===kind);
  assert.ok(actual);
  const expected=ticks.map(t=>actual.physical.samples.find(s=>s.nativeTick===t));
  assert.ok(expected.every(Boolean));
  for(const layer of layers){
   const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
   const page=await context.newPage(),errors=[],screens=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,350));});
   const stage='VB-P101-A13-W9C1-'+kind.toUpperCase();
   try{
    await page.goto('http://127.0.0.1:'+server.address().port+
     '/r19a3/?r19a1=on&r19a2Layer=road-hazards-only&r19a3='+layer+'&g5b=on&stage='+stage,{
     waitUntil:'domcontentloaded',timeout:70000});
    await page.waitForFunction(id=>document.querySelector('#stage')?.value===id&&
      document.querySelector('#view')?.dataset?.w9c1Isolated==='true',stage,{timeout:90000});
    const before=await page.evaluate(()=>{
      const el=document.getElementById('view'),gl=el.getContext('webgl2');
      return {webgl2:gl instanceof WebGL2RenderingContext,
       stage:document.getElementById('stage').value,originalB51:Number(el.dataset.machineCount),
       realWidth:Number(el.dataset.w9c1Width),
       noncollidingG5BTriangles:Number(el.dataset.g5bTriangles),
       machineFrameTriangles:Number(el.dataset.r19a2MachineTriangles),
       w9HeroTriangles:Number(el.dataset.r19a2W9Triangles),
       r19a3Active:el.dataset.r19a3Enabled==='true',
       r19a3Triangles:Number(el.dataset.r19a3Triangles),
       r19a3ColliderCount:Number(el.dataset.r19a3ColliderCount)};
    });
    assert.equal(before.webgl2,true);
    assert.equal(before.originalB51,28);
    assert.equal(before.noncollidingG5BTriangles,4608);
    assert.ok(before.machineFrameTriangles>0&&before.w9HeroTriangles>0);
    assert.equal(before.r19a3Active,layer==='on');
    if(layer==='on')assert.equal(before.r19a3ColliderCount,0);
    if(layer==='on')assert.ok(before.r19a3Triangles>2000);
    assert.equal(before.realWidth,kind==='ultra'?14:28);
    await page.locator('#cameraCompare').click();
    await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
    await page.locator('#p101Profile').selectOption('OVERDRIVE');
    await page.locator('#demoSpeed').selectOption('2');
    assert.equal(await page.locator('#demoRun').isDisabled(),false);
    for(let i=0;i<ticks.length;i++){
     const tick=ticks[i],snapshot=expected[i];
     await page.evaluate(n=>{window.__r19a1PauseAtTick=n;},tick);
     if(i===0)await page.locator('#demoRun').click();
     else await page.locator('#pause').click();
     await page.waitForFunction(n=>{
      const e=document.querySelector('#view')?.dataset;
      return Number(e?.r19a1PauseTick)===n||['failed','finished'].includes(e?.r19a1Status);
     },tick,{timeout:120000,polling:45});
     // Screenshots force original source WebGL2 render to commit.
     const filename='R19A2_'+kind+'_'+layer+'_'+tick+'tick_TRUE_WEBGL2.png';
     const raw=await page.locator('#view').screenshot({path:path.join(dir,filename),timeout:45000});
     assert.ok(raw.length>15000);
     const screen=await page.evaluate(()=>{
      const e=document.getElementById('view').dataset;
      return {tick:Number(e.r19a1NativeTicks),pauseTick:Number(e.r19a1PauseTick),
       xyz:e.r19a1XYZ.split(',').map(Number),speed:Number(e.r19a1Speed),
       road:e.r19a1Road,actualMask:e.r19a2Layer,
       civicCityEnabled:e.r19a3Enabled,'
       currentB51:Number(e.r19a1B51),status:e.r19a1Status,
       camera:e.cameraMode,near:e.r19a1ClosestB51,occlusion:e.r19a1B51OcclusionUntested};
     });
     assert.equal(screen.tick,tick);assert.equal(screen.pauseTick,tick);
     assert.equal(screen.status,'running');
     assert.equal(screen.camera,'ball-lock-unfiltered-heading');
     assert.equal(screen.actualMask,'road-hazards-only');
     assert.equal(screen.civicCityEnabled,layer==='on'?'true':'false');
     assert.equal(screen.currentB51,28);
     assert.equal(screen.occlusion,'true');
     assert.equal(screen.road,snapshot.road);
     const delta=Math.hypot(...snapshot.xyz.map((v,j)=>v-screen.xyz[j]));
     const speedDiff=Math.abs(snapshot.speedMps-screen.speed);
     assert.ok(delta<.08,'actual native XYZ mismatch '+kind+'/'+layer+'/'+tick+': '+delta);
     assert.ok(speedDiff<.05,'actual native speed mismatch '+kind+'/'+layer+'/'+tick+': '+speedDiff);
     screens.push({tick,nativeTime:snapshot.t,actualPhysicalXYZDeltaM:delta,
      actualPhysicalSpeedDeltaMps:speedDiff,sourceNativeB48Road:snapshot.road,
      file:filename,pngBytes:raw.length,pngSHA256:sha(raw),sourceScreenshotState:screen});
     console.log('R19A3_TRUE_NATIVE_CIVIC_CITY',JSON.stringify({kind,layer,tick,
      xyzDiff:delta,speedDiff,pngBytes:raw.length,B51:28}));
    }
    assert.deepEqual(errors,[]);
    proof.sessions.push({kind,layer,sourceStage:stage,before,screens,
     rawCamera:true,nativeP96NotHuman:true,sourceGameChanged:false});
   }catch(e){
    const error={kind,layer,error:String(e.stack||e).slice(0,1700),pageErrors:errors};
    proof.failures.push(error);
    console.log('R19A3_CITY_FAILURE',JSON.stringify(error));
    try{await page.screenshot({path:path.join(dir,'FAILED_'+kind+'_'+layer+'.png')});}catch{}
   }finally{await context.close();}
  }
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(dir,'R19_A3_ONE_CITY_ORIGINAL_NATIVE_CAMERA.json'),
  JSON.stringify(proof,null,2)+'\n');
}
assert.equal(proof.failures.length,0,'original WebGL scene source or native mismatch');
assert.equal(proof.sessions.length,4);
assert.equal(proof.sessions.reduce((s,x)=>s+x.screens.length,0),16);
console.log('R19A3_ONE_CIVIC_CITY_SOURCE_CAMERA_COMPLETE',JSON.stringify({
 cases:4,realFrames:16,sourceNativeMatched:true,ART:'HOLD',HUMAN:'HOLD'}));
