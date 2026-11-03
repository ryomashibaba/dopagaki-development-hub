/**
 * K4AR: true WebGL2 source camera / sky only / architecture TRIAD.
 * This is a 6-frame per variant STILL comparison, NOT a contiguous moving
 * movie or physical safety, gameplay or art acceptance certificate.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const ROOT=path.resolve('r19-evidence/k4ar');
fs.mkdirSync(ROOT,{recursive:true});
const TICKS={ultra:[11320,11341,11369],control:[11259,11278,11307]};
const source='af076d67492a677d2235e4730aef8cdf4808e106';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const results={schema:'dopagaki.K4AR.original-sky-only-architecture-triad/1',
  sourceBlob:source,originalPhysicsHz:240,sourceCameraUnchanged:true,
  actualWebGL2:true,independentVisualOnly:true,realB48Roads:7,realB51Movers:28,
  candidateART:'NOT_TESTED_HOLD',officialARTAccepted:0,slope2DNAMetres:0,
  continuousHumanVisibility:'NOT_MEASURED',clearance:'NOT_MEASURED',
  HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  runs:[],comparisons:[],errors:[]};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of Object.keys(TICKS)){
  const runs=[];
  for(const visual of ['original','sky-only','full']){
   const candidate=visual!=='original';
   const page=await browser.newPage({viewport:{width:1365,height:930},deviceScaleFactor:1});
   const run={mode,candidate,visual,frames:[],errors:[]};
   page.on('pageerror',e=>run.errors.push(String(e.message)));
   try{
    const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
    const url='http://127.0.0.1:'+server.address().port+
      '/r19a6p4r2f5k4aq/?r19a1=on&k4ab=on&k4ad=on&g5b=off&stage='+
      stage+'&k4aq='+(candidate?'on':'off')+(visual==='sky-only'?'&k4aqMesh=off':'');
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
    await page.waitForFunction(s=>document.querySelector('#stage')?.value===s&&
       document.querySelector('#view')?.dataset.w9c1Isolated==='true',stage,{timeout:120000});
    const gl=await page.evaluate(()=>{
      const c=document.querySelector('#view'),g=c.getContext('webgl2');
      return {webgl2:g instanceof WebGL2RenderingContext,
       preserve:g.getContextAttributes()?.preserveDrawingBuffer};
    });
    assert.deepEqual(gl,{webgl2:true,preserve:false});
    await page.locator('#cameraCompare').click();
    await page.waitForFunction(()=>document.querySelector('#view')?.dataset.cameraMode==='ball-lock-unfiltered-heading');
    await page.locator('#p101Profile').selectOption('OVERDRIVE');
    await page.locator('#demoSpeed').selectOption('2');
    for(const [index,tick] of TICKS[mode].entries()){
     await page.evaluate(t=>{window.__r19a1PauseAtTick=t;},tick);
     if(index===0)await page.locator('#demoRun').click();
     else await page.locator('#pause').click();
     await page.waitForFunction(t=>{
       const d=document.querySelector('#view')?.dataset||{};
       return Number(d.r19a1PauseTick)===t||
         ['finished','failed'].includes(d.r19a1Status);
     },tick,{timeout:200000,polling:60});
     const data=await page.evaluate(()=>{
       const d=document.querySelector('#view').dataset;
       return {nativeTick:Number(d.r19a1NativeTicks),
        pausedTick:Number(d.r19a1PauseTick),
        sourceRoad:d.r19a1Road,status:d.r19a1Status,
        ball:d.r19a1XYZ,eye:d.r19a1Eye,front:d.r19a1Front,
        camera:d.cameraMode,originalB51:Number(d.r19a1B51),
        k4aqMode:d.k4aqMode,k4aqSkyOnly:d.k4aqSkyOnly,triangles:Number(d.k4aqTriangles),
        roadCount:Number(d.k4aqRoads),hazardCount:Number(d.k4aqMovingHazards),
        sourceModified:d.k4aqPhysicsChanged,
        originalAudit:JSON.parse(d.k4abAudit||'{}')};
     });
     assert.equal(data.nativeTick,tick);assert.equal(data.pausedTick,tick);
     assert.equal(data.sourceRoad,'p93-PRISM_CREST-01');assert.equal(data.status,'running');
     assert.equal(data.camera,'ball-lock-unfiltered-heading');
     assert.equal(data.originalB51,28);
     assert.equal(data.roadCount,7);assert.equal(data.hazardCount,28);
     assert.equal(data.sourceModified,'false');
     assert.equal(data.originalAudit.sourceBlob,source);
     assert.equal(data.originalAudit.currentNativeTick,tick);
     assert.equal(data.originalAudit.mask,'none');
     assert.equal(data.k4aqMode,candidate?'PRIVATE_ART_CANDIDATE_HOLD':'ORIGINAL_SOURCE');
     assert.equal(data.k4aqSkyOnly,visual==='sky-only'?'TRUE_SKY_ONLY_CONTROL':'false');
     if(candidate)assert.ok(data.triangles>1000);
     else assert.equal(data.triangles,0);
     const filename='K4AR_'+mode+'_'+tick+'_'+visual.toUpperCase().replace('-','_')+'.png';
     const bytes=await page.locator('#view').screenshot({path:path.join(ROOT,filename),timeout:70000});
     assert.ok(bytes.length>9000,'blank or uninformative native game canvas');
     run.frames.push({tick,timeSeconds:tick/240,
       state:data,image:{file:filename,sha256:sha(bytes),bytes:bytes.length}});
    }
    assert.deepEqual(run.errors,[]);
   }catch(e){run.errors.push(String(e.stack||e).slice(0,5000));
     results.errors.push({mode,candidate,error:run.errors.at(-1)});
   }finally{await page.close();results.runs.push(run);}
   runs.push(run);
  }
  if(runs.every(x=>x.frames.length===3&&!x.errors.length)){
   for(let i=0;i<3;i++){
    const orig=runs[0].frames[i],sky=runs[1].frames[i],art=runs[2].frames[i];
    assert.equal(orig.tick,sky.tick);assert.equal(orig.tick,art.tick);
    for(const shot of [sky,art]){
     for(const name of ['ball','eye','front','camera','sourceRoad','status'])
      assert.equal(orig.state[name],shot.state[name],
        'K4AR original camera/ball/native road diverged: '+name);
     assert.equal(orig.state.originalAudit.sourceBlob,shot.state.originalAudit.sourceBlob);
     assert.equal(shot.state.originalAudit.mask,'none');
    }
    results.comparisons.push({mode,tick:orig.tick,
      original:orig.image,skyOnly:sky.image,candidate:art.image,
      sameSkySameNativePose:true,cameraAndBallIdentical:true,
      sourcePhysicsPreserved:true,
      skyRGBDifferent:orig.image.sha256!==sky.image.sha256,
      architectureRGBDifferent:sky.image.sha256!==art.image.sha256,
      architecturalPixelCount:'NOT_MEASURED_WITHOUT_INDEPENDENT_PNG_DIFF',
      ART:'NOT_TESTED_HOLD'});
   }
  }
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(ROOT,'K4AQ_TRUE_CAMERA_ART_AB_REPORT.json'),
  JSON.stringify(results,null,2)+'\n');
}
assert.deepEqual(results.errors,[]);
assert.equal(results.comparisons.length,6);
assert.ok(results.comparisons.some(x=>x.architectureRGBDifferent),
 'K4AR NO authored architecture difference from sky-only in any original camera shot');
console.log('K4AR_TRUE_NATIVE_CAMERA_18_TRIAD_PNGS_ARCHITECTURE_SEPARATED_ART_HOLD');
