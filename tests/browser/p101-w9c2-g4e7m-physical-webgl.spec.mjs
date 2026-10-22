import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E7M default stage never exposes 13-16m real collision-road candidates',async({page})=>{
 await page.goto('/drive3d/?stage=VB-P101-A13-W9C2-G4E7M-PRECIPICE');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7M-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7m-mode','off');
});
test('G4E7M GLIDE vs 2 actual B48 narrow-road candidates: WebGL2 12 photos and exact physical width',async({browser},info)=>{
 test.setTimeout(270000);
 const studies=[],errors=[];
 for(const point of ['skyline','crown']){
  const records=[];
  for(const variant of ['GLIDE','THREAD','PRECIPICE']){
   const ctx=await browser.newContext({viewport:{width:1300,height:780},deviceScaleFactor:1});
   const page=await ctx.newPage();page.on('pageerror',e=>errors.push({point,variant,error:e.message}));
   const original=variant==='GLIDE',id='VB-P101-A13-W9C2-'+(original?'G4E7G':'G4E7M')+'-'+variant;
   await page.goto('/drive3d/?g4e7g=on&g4e7m=on&g4e7gFrame=hold&g4e7mFrame=hold&g4e7gPoint='+point+'&g4e7mPoint='+point+'&stage='+id);
   const canvas=page.locator('#view'),viewport=page.locator('.viewport');
   await expect(page.locator('#appStatus')).toContainText(original?'G4E-7G':'G4E-7M',{timeout:70000});
   await expect(page.locator('#stage')).toHaveValue(id);
   await expect(canvas).toHaveAttribute('data-run-mode',original?'private-visual-qa-not-human':'private-real-B48-human-hold');
   await expect(canvas).toHaveAttribute('data-machine-count','28');
   if(!original){
    await expect(canvas).toHaveAttribute('data-g4e7m-mode','STATIC_REAL_NARROW_B48');
    await expect(canvas).toHaveAttribute('data-g4e7m-variant',variant.toLowerCase());
   }
   await expect(page.locator('#simTime')).toHaveText('0.00 s');
   await expect(page.locator('#pause')).toContainText('再開');
   const proof=await page.evaluate(async()=>{
    const id=document.querySelector('#stage').value,
      original=id.endsWith('G4E7G-GLIDE'),
      variant=original?'GLIDE':id.endsWith('THREAD')?'THREAD':'PRECIPICE',
      source='P101_A13_W9C2_'+(original?'G4E7G_GLIDE_LOCAL_VISUAL':'G4E7M_'+variant+'_LOCAL_TRIAL')+'.json';
    const response=await fetch('../generated/'+source,{cache:'no-store'});
    if(!response.ok)throw Error('Private actual collision asset missing');
    const doc=await response.json();
    const index=Number(document.querySelector('#spawn').value),
     spawn=doc.spawns[index],road=doc.surfaces.find(s=>s.id===spawn.surface);
    const {sample,tessellate}=await import('../reference_only/director/surface.js');
    const a=sample(road,spawn.u,0),b=sample(road,spawn.u,1),
     p=sample(road,spawn.u,spawn.v);
    const delta=Math.hypot(...a.map((x,i)=>x-b[i]));
    const start=original?doc.stageForge.g4e7gVisualTrial.originalSpawns:
     doc.stageForge.g4e7mRealRoad.originalSpawns;
    return {id,variant,index,expectedIndex:start,
     spawn:{u:spawn.u,v:spawn.v,surface:spawn.surface},world:p,
     trueColliderWidth:delta,degenerate:tessellate(road).degenerate,
     machineCount:doc.movingObstacles.length,physicalRoadCount:doc.surfaces.length,
     certifiedMeters:original?doc.stageForge.g4e7gVisualTrial.approvedSlopeDnaMeters:
      doc.stageForge.g4e7mRealRoad.certifiedSlopeDnaMeters,
     narrowCore:original?0:doc.stageForge.g4e7mRealRoad.totalNominalNarrowCoreMeters,
     camera:document.querySelector('#view').dataset.cameraMode,
     runMode:document.querySelector('#view').dataset.runMode};
   });
   expect(proof.index).toBe(proof.expectedIndex+(point==='skyline'?0:1));
   expect(proof.spawn.u).toBe(point==='skyline'?.52:.15);
   expect(proof.spawn.v).toBe(.5);
   expect(proof.physicalRoadCount).toBe(7);expect(proof.machineCount).toBe(28);
   expect(proof.degenerate).toBe(0);expect(proof.certifiedMeters).toBe(0);
   if(!original){expect(proof.trueColliderWidth).toBeGreaterThan(10);
    expect(proof.trueColliderWidth).toBeLessThanOrEqual(16);
    expect(proof.narrowCore).toBeGreaterThan(200);
   }else expect(proof.trueColliderWidth).toBeGreaterThan(40);
   const filename='g4e7m-'+point+'-'+variant.toLowerCase();
   await page.waitForTimeout(130);
   await viewport.screenshot({path:info.outputPath(filename+'-hud.png')});
   await page.evaluate(()=>{
    const el=document.createElement('style');el.id='g4e7m-mask-hud';
    el.textContent='.viewport > :not(canvas){visibility:hidden!important}';
    document.head.append(el);
   });
   const pure=await canvas.screenshot({path:info.outputPath(filename+'-road.png')});
   await page.evaluate(()=>document.querySelector('#g4e7m-mask-hud')?.remove());
   records.push({proof,images:[filename+'-hud.png',filename+'-road.png'],pure:pure.toString('base64'),
    time:(await page.locator('#simTime').textContent()).trim()});
   await ctx.close();
  }
  for(const r of records)expect(r.time).toBe('0.00 s');
  for(let i=1;i<3;i++){
   // Same normalized surface u/v, but real geometry & world-camera positions differ.
   expect(records[i].proof.spawn.u).toBe(records[0].proof.spawn.u);
   expect(records[i].proof.spawn.v).toBe(records[0].proof.spawn.v);
   expect(records[i].proof.trueColliderWidth).toBeLessThan(records[0].proof.trueColliderWidth);
  }
  const compare=await (await browser.newPage()).evaluate(async inputs=>{
   const d=async s=>{
    const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+s)).blob());
    const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
    return {w:canvas.width,h:canvas.height,x:ctx.getImageData(0,0,canvas.width,canvas.height).data};
   };
   const images=await Promise.all(inputs.map(d));return images.slice(1).map((b,j)=>{
    const a=images[0];if(a.w!==b.w||a.h!==b.h)throw Error('unmatched physical camera view size');
    let changes=0;for(let i=0;i<a.x.length;i+=4)if(Math.max(
     Math.abs(a.x[i]-b.x[i]),Math.abs(a.x[i+1]-b.x[i+1]),
     Math.abs(a.x[i+2]-b.x[i+2]))>24)changes++;
    return {variant:['THREAD','PRECIPICE'][j],changedPixels:changes,
     changedPercent:Number((100*changes/(a.w*a.h)).toFixed(3)),
     note:'Different world geometry and camera position; NOT isolated road-width effect'};
   });
  },records.map(r=>r.pure));
  expect(compare.every(c=>c.changedPixels>100)).toBe(true);
  studies.push({point,records:records.map(({pure,...r})=>r),glideVsNewWebGL:compare,
   equalNormalizedB48SurfaceUV:true,identicalWorldPose:false,humanFairness:'HOLD'});
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7m-physical-webgl-audit.json'),
  JSON.stringify({schema:'dopagaki.g4e7m-physical-WebGL/1',studies,errors,
   actualCollidable13to16mRoad:true,originalGlidePhysicsStillExists:true,
   additionalAcceptedSlope2Meters:0,
   automatedRunResult:'NATIVE_MATRIX_SEPARATE',
   humanRun:'NOT_DONE',publish:'HOLD'},null,2));
});
