/** R19A1 original 240Hz WebGL2 vs R19A0 native exact-tick crosscheck.
 * Four conditions: 14m / 28m x existing G5B OFF/ON, 6 actual frames each.
 * Neither screenshots nor FoV-only geometry certify human hazard visibility.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const root=path.resolve('r19-evidence/r19a1');
fs.mkdirSync(root,{recursive:true});
const truth=JSON.parse(fs.readFileSync('r19-evidence/R19_A1_NATIVE12S_SOURCE.json','utf8'));
assert.equal(truth.schema,'dopagaki.r19a0-real-12second-integrated-slice/1');
const targets=[265,721,1057,1249,1921,2761];
const records={schema:'dopagaki.r19a1-real-game-webgl2-native-tick-sync/1',
 targetTicks:targets,sourceNativeA0Schema:truth.schema,
 originalGameSourceBlob:truth.sourceBlob,
 humanPerception:'NOT_TESTED',ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',
 PERFORMANCE:'HOLD',SLOPE2_CERTIFIED_METRES:0,RELEASE:'HOLD',
 sessions:[],errors:[]};
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
await new Promise((ok,bad)=>server.once('error',bad).listen(0,'127.0.0.1',ok));
const url='http://127.0.0.1:'+server.address().port;
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const kind of ['control','ultra'])for(const scenery of ['off','on']){
  const source=truth.studies.find(s=>s.mode===kind);
  assert.ok(source);
  const expected=targets.map(t=>source.physical.samples.find(s=>s.nativeTick===t));
  assert.ok(expected.every(Boolean),'source original exact native sample unavailable');
  const c=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await c.newPage(),errors=[],shots=[];
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,500));});
  const stage='VB-P101-A13-W9C1-'+kind.toUpperCase();
  try{
   await page.goto(url+'/r19a1/?r19a1=on&stage='+stage+'&g5b='+scenery,{
    waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(s=>document.querySelector('#stage')?.value===s&&
    document.querySelector('#view')?.dataset?.w9c1Isolated==='true',
    stage,{timeout:90000});
   const initial=await page.evaluate(()=>{
    const v=document.querySelector('#view'),gl=v.getContext('webgl2');
    return {stage:document.querySelector('#stage').value,
      webGL2:gl instanceof WebGL2RenderingContext,
      version:gl.getParameter(gl.VERSION),width:v.width,height:v.height,
      bodyCount:Number(v.dataset.machineCount),
      g5bMode:v.dataset.g5bMode,g5bTriangles:Number(v.dataset.g5bTriangles),
      sourcePhysicalWidth:Number(v.dataset.w9c1Width)};
   });
   assert.equal(initial.stage,stage);
   assert.equal(initial.webGL2,true);
   assert.equal(initial.bodyCount,28);
   assert.equal(initial.g5bMode,scenery==='on'?'candidate':'off');
   assert.equal(initial.g5bTriangles,scenery==='on'?4608:0);
   assert.equal(initial.sourcePhysicalWidth,kind==='ultra'?14:28);
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset?.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   assert.equal(await page.locator('#demoRun').isDisabled(),false);
   for(let i=0;i<targets.length;i++){
    const tick=targets[i],sample=expected[i];
    await page.evaluate(n=>{window.__r19a1PauseAtTick=n;},tick);
    if(i===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(n=>{
     const v=document.querySelector('#view');
     return Number(v?.dataset?.r19a1PauseTick)===n||
      ['failed','finished'].includes(v?.dataset?.r19a1Status);
    },tick,{timeout:120000,polling:30});
    const probe=await page.evaluate(()=>{
     const v=document.querySelector('#view');
     return {nativeTick:Number(v.dataset.r19a1NativeTicks),
      pausedAtTick:Number(v.dataset.r19a1PauseTick),
      time:Number(v.dataset.r19a1Time),xyz:v.dataset.r19a1XYZ.split(',').map(Number),
      speed:Number(v.dataset.r19a1Speed),road:v.dataset.r19a1Road,
      status:v.dataset.r19a1Status,sourceMachineCount:Number(v.dataset.r19a1B51),
      originalCamera:v.dataset.cameraMode,
      g5bMode:v.dataset.g5bMode,triangles:Number(v.dataset.g5bTriangles),
      machineFovCandidates:Number(v.dataset.r19a1FovCandidates),
      nearestSourceB51:v.dataset.r19a1ClosestB51,
      nearestB51SurfaceM:v.dataset.r19a1B51Separation,
      nearestB51ProjectedX:v.dataset.r19a1B51ScreenX,
      nearestB51ProjectedY:v.dataset.r19a1B51ScreenY,
      occlusionUnmeasured:v.dataset.r19a1B51OcclusionUntested,
      cameraEye:v.dataset.r19a1Eye,cameraFront:v.dataset.r19a1Front,
      width:v.width,height:v.height,simHud:document.getElementById('simTime').textContent,
      speedHud:document.getElementById('speed').textContent,
      cueHud:document.getElementById('w9c1Notice')?.hidden===false?
       document.getElementById('w9c1Notice').textContent:null};
    });
    assert.equal(probe.pausedAtTick,tick,'exact committed native tick not frozen');
    assert.equal(probe.nativeTick,tick);
    assert.equal(probe.status,'running');
    assert.equal(probe.sourceMachineCount,28);
    assert.equal(probe.originalCamera,'ball-lock-unfiltered-heading');
    assert.equal(probe.occlusionUnmeasured,'true');
    const delta=Math.hypot(...probe.xyz.map((x,j)=>x-sample.xyz[j]));
    const speedDelta=Math.abs(probe.speed-sample.speedMps);
    assert.ok(delta<.08,'native source XYZ differs from actual WebGL replay: '+kind+'/'+tick+' delta='+delta);
    assert.ok(speedDelta<.05,'native source speed differs from actual WebGL replay '+kind+'/'+tick+' diff='+speedDelta);
    assert.equal(probe.road,sample.road);
    const name='r19a1_'+kind+'_'+scenery+'_'+tick+'tick_ORIGINAL_WEBGL2.png';
    const png=await page.locator('#view').screenshot({path:path.join(root,name),timeout:35000});
    assert.ok(png.length>10000,'empty real WebGL2 canvas');
    shots.push({tick,expectedNative12Seconds:sample.t,
      sourceXYZ:sample.xyz,sourceMps:sample.speedMps,
      image:name,imageBytes:png.length,pngSHA256:hash(png),
      measuredSourceNativeXYZDeltaM:delta,measuredSourceNativeSpeedDeltaMps:speedDelta,
      originalSourceView:probe,
      visualOriginalB51Occlusion:'NOT_ASSESSED',
      humanHazardLegibility:'HOLD'});
    console.log('R19A1_TRUE_SAME_TICK_WEBGL2',JSON.stringify({kind,scenery,tick,delta,speedDelta,
     road:probe.road,visibleFovCandidates:probe.machineFovCandidates,
     gpu:initial.webGL2,imageBytes:png.length}));
   }
   assert.equal(shots.length,targets.length);
   assert.deepEqual(errors,[]);
   records.sessions.push({kind,scenery,initial,shots,
    exactSourceTicks:true,originalGameRenderer:true,scriptedP96NotHuman:true,ART:'HOLD'});
  }catch(e){
   const v={kind,scenery,error:String(e.stack||e).slice(0,1600),pageErrors:errors};
   records.errors.push(v);console.log('R19A1_REJECT',JSON.stringify(v));
   try{await page.screenshot({path:path.join(root,'R19A1_FAIL_'+kind+'_'+scenery+'.png')});}catch{}
  }finally{await c.close();}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(ok=>server.close(ok));
 fs.writeFileSync(path.join(root,'R19_A1_TRUE_NATIVE_CAMERA_AND_B51_GATE.json'),
  JSON.stringify(records,null,2)+'\n');
}
assert.equal(records.errors.length,0,'REAL 240Hz browser exact-source camera failed');
assert.equal(records.sessions.length,4);
console.log('R19A1_DONE',JSON.stringify({sessions:records.sessions.length,
 frames:records.sessions.reduce((n,s)=>n+s.shots.length,0),
 exactNativeP96:true,sourceOriginalB51:28,ART:'HOLD',HUMAN:'HOLD'}));
