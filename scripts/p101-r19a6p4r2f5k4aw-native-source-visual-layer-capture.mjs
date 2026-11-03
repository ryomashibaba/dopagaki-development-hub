/**
 * K4AW true source-camera 240Hz same-pause GPU layer atlas. No new ART.
 * Private masks may hide safety cues IN NONPLAYABLE SCREENSHOTS ONLY.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const root=path.resolve('r19-evidence/k4aw');
fs.mkdirSync(root,{recursive:true});
const times={control:11259,ultra:11320};
const masks=['none','noW9C1','noP100','noB5','noXZCues','noEdgeLines',
 'noHazardGates','noA13Decor'];
const safe=new Set(['none','noA13Decor']);
const source='af076d67492a677d2235e4730aef8cdf4808e106';
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const data={schema:'dopagaki.K4AW.authentic-native-Road5-individual-GPU-visual-layers/1',
 sourceBlob:source,sourceNativeHz:240,sourceRoads:7,sourceB51:28,
 ART:'NOT_TESTED_HOLD',officialARTAccepted:0,slope2DNAMetres:0,
 HUMAN:'HOLD',SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 diagnosticSafety:'MASKED_SCREENSHOTS_NOT_PLAYABLE_UNSAFE_TO_ADOPT',
 modes:[],errors:[]};
await new Promise((resolve,reject)=>server.once('error',reject)
 .listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:[
  '--use-gl=angle','--use-angle=swiftshader','--enable-webgl',
  '--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const [mode,tick] of Object.entries(times)){
  const page=await browser.newPage({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const run={mode,tick,masks:[],errors:[],pageErrors:[]};
  page.on('pageerror',e=>run.pageErrors.push(String(e.stack||e.message)));
  try{
   const stage='VB-P101-A13-W9C1-'+mode.toUpperCase();
   const u='http://127.0.0.1:'+server.address().port+
    '/r19a6p4r2f5k4aw/?r19a1=on&k4ab=on&k4ad=on&g5b=off'+
    '&k4aq=on&k4as=materials&k4at=on&k4au=on&k4av=on&k4aw=layers&stage='+stage;
   const response=await page.goto(u,{waitUntil:'domcontentloaded',timeout:90000});
   assert.equal(response.status(),200);
   await page.waitForTimeout(250);
   if(run.pageErrors.length)throw Error('NATIVE_BROWSER_BOOT '+run.pageErrors.join(' | '));
   await page.waitForFunction(s=>document.querySelector('#stage')?.value===s&&
    document.querySelector('#view')?.dataset.w9c1Isolated==='true',
    stage,{timeout:90000});
   const gl=await page.evaluate(()=>{
    const g=document.querySelector('#view')?.getContext('webgl2');
    return g instanceof WebGL2RenderingContext;
   });
   assert.equal(gl,true);
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset.cameraMode===
     'ball-lock-unfiltered-heading');
   await page.locator('#p101Profile').selectOption('OVERDRIVE');
   await page.locator('#demoSpeed').selectOption('2');
   await page.evaluate(t=>window.__r19a1PauseAtTick=t,tick);
   await page.locator('#demoRun').click();
   await page.waitForFunction(t=>{
    const d=document.querySelector('#view')?.dataset||{};
    return Number(d.r19a1PauseTick)===t||['failed','finished'].includes(d.r19a1Status);
   },tick,{timeout:180000,polling:50});
   const state=async()=>page.evaluate(()=>{
    const d=document.querySelector('#view').dataset;
    return {tick:Number(d.r19a1NativeTicks),
      paused:Number(d.r19a1PauseTick),road:d.r19a1Road,
      status:d.r19a1Status,ball:d.r19a1XYZ,eye:d.r19a1Eye,
      front:d.r19a1Front,camera:d.cameraMode,
      b51:Number(d.r19a1B51),sourceRoads:Number(d.k4aqRoads),
      sourceBlob:d.k4awSourceBlob,mask:d.k4awMask,
      maskTick:Number(d.k4awNativeTick),
      physicsWrites:d.k4awPhysicsWrites,
      safetyStatus:d.k4awSafety,
      drawGroups:JSON.parse(d.k4awGroups||'{}'),
      sourceAudit:JSON.parse(d.k4abAudit||'{}')};
   });
   const first=await state();
   assert.equal(first.tick,tick);
   assert.equal(first.paused,tick);
   assert.equal(first.road,'p93-PRISM_CREST-01');
   assert.equal(first.status,'running');
   assert.equal(first.camera,'ball-lock-unfiltered-heading');
   assert.equal(first.b51,28);assert.equal(first.sourceRoads,7);
   assert.equal(first.sourceBlob,source);
   assert.equal(first.physicsWrites,'0');
   assert.equal(first.sourceAudit.sourceBlob,source);
   assert.equal(first.sourceAudit.mask,'none');
   for(const mask of masks){
    await page.evaluate(m=>{window.__k4awMask=m;},mask);
    await page.waitForFunction(({m,t})=>{
      const d=document.querySelector('#view')?.dataset||{};
      return d.k4awMask===m&&Number(d.k4awNativeTick)===t;
    },{m:mask,t:tick},{timeout:25000,polling:40});
    const actual=await state();
    for(const f of ['tick','paused','road','status','ball','eye','front','camera','b51',
      'sourceRoads','sourceBlob','physicsWrites']){
      assert.deepEqual(actual[f],first[f],'K4AW native source drift '+f);
    }
    assert.equal(actual.mask,mask);
    const groups=Object.values(actual.drawGroups);
    const suppressed=groups.reduce((sum,g)=>sum+g.suppressedCalls,0);
    const isNoop=suppressed===0;
    const file='K4AW_'+mode+'_'+tick+'_'+mask+'.png';
    const png=await page.locator('#view').screenshot({
     path:path.join(root,file),timeout:60000});
    assert.ok(png.length>9000,'K4AW missing authentic WebGL2 camera pixels');
    run.masks.push({mask,png:{file,bytes:png.length,sha256:digest(png)},
      nativeState:actual,
      suppressedRealGpuDrawCalls:suppressed,
      actuallyHadGpuDrawToSuppress:!isNoop,
      safety: safe.has(mask)?'ART_DECOR_OR_ORIGINAL':
       'VISUAL_DIAGNOSTIC_ONLY_CANNOT_REMOVE_IN_PLAYABLE_GAME'});
   }
   await page.evaluate(()=>window.__k4awMask='none');
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset.k4awMask==='none',
    {timeout:20000});
   assert.equal((await state()).tick,tick);
   assert.deepEqual(run.pageErrors,[]);
  }catch(e){
   run.errors.push(String(e.stack||e).slice(0,6000));
   data.errors.push({mode,error:run.errors.at(-1),pageErrors:run.pageErrors});
  }finally{
   await page.close();data.modes.push(run);
  }
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
 fs.writeFileSync(path.join(root,'K4AW_TRUE_SOURCE_DRAW_LAYER_REPORT.json'),
  JSON.stringify(data,null,2)+'\n');
}
assert.deepEqual(data.errors,[]);
assert.equal(data.modes.length,2);
assert.ok(data.modes.every(x=>x.masks.length===8));
console.log('K4AW_TRUE_NATIVE_ROAD5_INDIVIDUAL_16_PNGS_DRAW_SOURCE_ONLY_ART_HOLD');
