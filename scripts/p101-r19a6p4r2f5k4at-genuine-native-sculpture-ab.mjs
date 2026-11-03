/**
 * K4AT source-native REAL Chromium 6x2 Road5 ART A/B.
 * A = K4AS visually modified genuine Road5 original.
 * B = same Road5 plus K4AT sculpted civic canyon, true normal-lit render.
 * Source B48/B51, 240Hz Runner, ball/camera/source-state must remain EXACT.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const root=path.resolve('r19-evidence/k4at');
fs.mkdirSync(root,{recursive:true});
const ticks={ultra:[11320,11341,11369],control:[11259,11278,11307]};
const src='af076d67492a677d2235e4730aef8cdf4808e106';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const data={schema:'dopagaki.K4AT.genuine-original-Road5-canyon-AB/1',
 sourceBlob:src,originalPhysicsHz:240,realRoadCount:7,originalB51:28,
 nativeCamera:true,actualChromiumWebGL2:true,continuousHumanReview:'NOT_MEASURED',
 ART:'NOT_TESTED_HOLD',HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',
 RELEASE:'HOLD',MERGE:'HOLD',formalArtAccepted:0,slope2DNAMetres:0,
 sessions:[],comparisons:[],errors:[]};
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const mode of ['ultra','control']){
  const runs=[];
  for(const variant of ['material-base','civic-canyon']){
   const page=await browser.newPage({viewport:{width:1365,height:930},deviceScaleFactor:1});
   const session={mode,variant,frames:[],pageErrors:[],errors:[]};
   page.on('pageerror',e=>session.pageErrors.push(String(e.stack||e.message)));
   try{
    const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
    const url='http://127.0.0.1:'+server.address().port+
     '/r19a6p4r2f5k4at/?r19a1=on&k4ab=on&k4ad=on&g5b=off&k4aq=on&k4as=materials'+
     (variant==='civic-canyon'?'&k4at=on':'')+'&stage='+stage;
    const res=await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
    assert.equal(res.status(),200,'K4AT private native renderer must exist');
    await page.waitForTimeout(250);
    if(session.pageErrors.length)throw Error('BOOT_PAGEERROR '+session.pageErrors.join(' | '));
    try{
     await page.waitForFunction(s=>document.querySelector('#stage')?.value===s&&
       document.querySelector('#view')?.dataset.w9c1Isolated==='true',
       stage,{timeout:90000});
    }catch(e){
     const d=await page.evaluate(()=>({
      stage:document.querySelector('#stage')?.value,
      native:document.querySelector('#view')?.dataset.w9c1Isolated,
      appStatus:document.querySelector('#appStatus')?.textContent?.slice(0,250)
     }));
     throw Error('K4AT_NATIVE_BOOT_FAILURE '+JSON.stringify({d,pageErrors:session.pageErrors})+
       ' '+String(e));
    }
    const gl=await page.evaluate(()=>{
     const g=document.querySelector('#view').getContext('webgl2');
     return {actual:g instanceof WebGL2RenderingContext,
       preserved:g.getContextAttributes()?.preserveDrawingBuffer};
    });
    assert.deepEqual(gl,{actual:true,preserved:false});
    await page.locator('#cameraCompare').click();
    await page.waitForFunction(()=>
     document.querySelector('#view')?.dataset.cameraMode==='ball-lock-unfiltered-heading');
    await page.locator('#p101Profile').selectOption('OVERDRIVE');
    await page.locator('#demoSpeed').selectOption('2');
    for(let i=0;i<3;i++){
     const tick=ticks[mode][i];
     await page.evaluate(t=>window.__r19a1PauseAtTick=t,tick);
     if(i===0)await page.locator('#demoRun').click();
     else await page.locator('#pause').click();
     await page.waitForFunction(t=>{
      const d=document.querySelector('#view')?.dataset||{};
      return Number(d.r19a1PauseTick)===t||['failed','finished'].includes(d.r19a1Status);
     },tick,{timeout:180000,polling:50});
     const s=await page.evaluate(()=>{
      const d=document.querySelector('#view').dataset;
      return {
       tick:Number(d.r19a1NativeTicks),pausedTick:Number(d.r19a1PauseTick),
       road:d.r19a1Road,status:d.r19a1Status,ball:d.r19a1XYZ,
       eye:d.r19a1Eye,front:d.r19a1Front,camera:d.cameraMode,
       movers:Number(d.r19a1B51),roadCount:Number(d.k4aqRoads),
       k4as:d.k4asMode,k4asRendered:d.k4asRendered,
       k4at:d.k4atMode,triangles:Number(d.k4atTriangles),
       inlayTriangles:Number(d.k4atInlayTriangles),
       newColliders:d.k4atNewColliders,changedPhysics:d.k4atPhysicsChanged,
       audit:JSON.parse(d.k4abAudit||'{}')
      };
     });
     assert.equal(s.tick,tick);assert.equal(s.pausedTick,tick);
     assert.equal(s.road,'p93-PRISM_CREST-01');
     assert.equal(s.status,'running');
     assert.equal(s.camera,'ball-lock-unfiltered-heading');
     assert.equal(s.movers,28);assert.equal(s.roadCount,7);
     assert.equal(s.k4as,'PRIVATE_ROAD5_ONLY_MATERIAL_CANDIDATE_HOLD');
     assert.equal(s.k4asRendered,'true');
     assert.equal(s.audit.sourceBlob,src);
     assert.equal(s.audit.currentNativeTick,tick);
     assert.equal(s.audit.mask,'none');
     assert.equal(s.k4at,variant==='civic-canyon'?
      'PRIVATE_SOURCE_CIVIC_SCULPTURE_ART_HOLD':'OFF');
     if(variant==='civic-canyon'){
      assert.ok(s.triangles>1000);
      assert.ok(s.inlayTriangles>200);
      assert.equal(s.newColliders,'0');
      assert.equal(s.changedPhysics,'false');
     }else{assert.equal(s.triangles,0);}
     const imageName='K4AT_'+mode+'_'+tick+'_'+
      (variant==='civic-canyon'?'CIVIC_CANYON':'K4AS_BASE')+'.png';
     const bin=await page.locator('#view').screenshot({path:path.join(root,imageName),
       timeout:70000});
     assert.ok(bin.length>9000,'K4AT genuinely rendered original camera bitmap');
     session.frames.push({tick,state:s,image:{file:imageName,
       bytes:bin.length,sha256:sha(bin)}});
    }
    assert.deepEqual(session.pageErrors,[]);
   }catch(e){
    session.errors.push(String(e.stack||e).slice(0,3500));
    data.errors.push({mode,variant,error:session.errors.at(-1),
     pageErrors:session.pageErrors});
   }finally{await page.close();data.sessions.push(session);}
   runs.push(session);
  }
  if(runs.every(r=>r.frames.length===3&&!r.errors.length)){
   for(let i=0;i<3;i++){
    const old=runs[0].frames[i],fresh=runs[1].frames[i];
    for(const field of ['tick','road','status','ball','eye','front','camera','movers','roadCount']){
     assert.deepEqual(old.state[field],fresh.state[field],
       'K4AT actual native source diverged: '+field);
    }
    data.comparisons.push({
     mode,tick:old.tick,
     k4as:old.image,k4at:fresh.image,
     sourceNativePoseIdentical:true,
     differenceIsActualArtPixels:old.image.sha256!==fresh.image.sha256,
     ART:'NOT_TESTED_HOLD'
    });
   }
  }
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(root,'K4AT_TRUE_NATIVE_ART_AB.json'),
  JSON.stringify(data,null,2)+'\n');
}
assert.deepEqual(data.errors,[]);
assert.equal(data.comparisons.length,6);
assert.ok(data.comparisons.some(x=>x.differenceIsActualArtPixels));
console.log('K4AT_TRUE_SOURCE_CAMERA_12_PNG_SCULPTURE_ART_HOLD');
