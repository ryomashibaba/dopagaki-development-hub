import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7R never visible or selectable on default public game',async({page})=>{
 await page.goto('/drive3d/?g4e7rFrame=hold&stage=VB-P101-A13-W9C2-G4E7R-CUT');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7R-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7r-mode','off');
});
test('G4E-7R real B48 SWEEP/CUT shared physical pose, gap versus uncut, actual Chromium',async({page},info)=>{
 test.setTimeout(280000);
 const records=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const variant of ['SWEEP','CUT'])for(const point of ['approach','post']){
  const id='VB-P101-A13-W9C2-G4E7R-'+variant;
  await page.goto('/drive3d/?g4e7r=on&g4e7rFrame=hold&g4e7rPoint='+point+'&stage='+id);
  const canvas=page.locator('#view');
  await expect(page.locator('#appStatus')).toContainText('G4E-7R',{timeout:70000});
  await expect(page.locator('#stage')).toHaveValue(id);
  await expect(canvas).toHaveAttribute('data-run-mode','private-true-B48-graded-HOLD');
  await expect(canvas).toHaveAttribute('data-g4e7r-mode','STATIC_TRUE_B48_HOLD');
  await expect(canvas).toHaveAttribute('data-g4e7r-variant',variant.toLowerCase());
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  await expect(page.locator('#pause')).toContainText('再開');
  const evidence=await page.evaluate(async()=>{
   const id=document.querySelector('#stage').value,v=id.endsWith('CUT')?'CUT':'SWEEP';
   const response=await fetch('../generated/P101_A13_W9C2_G4E7R_'+v+'_LOCAL_TRIAL.json');
   if(!response.ok)throw Error('Missing LOCAL G4E-7R candidate');
   const doc=await response.json(),study=doc.stageForge.g4e7rStudy;
   const {sample,tessellate}=await import('../reference_only/director/surface.js');
   const index=Number(document.querySelector('#spawn').value),spawn=doc.spawns[index],
    road=doc.surfaces.find(s=>s.id===spawn.surface),
    a=sample(road,spawn.u,0),b=sample(road,spawn.u,1),
    canvas=document.querySelector('#view');
   return {id,index,firstInspectionSpawn:study.inspectionSpawnStart,
    spawnU:spawn.u,worldXYZ:sample(road,spawn.u,spawn.v),
    collidableWidthMeters:Math.hypot(...a.map((x,i)=>x-b[i])),
    realRoadCount:doc.surfaces.length,movingMachines:doc.movingObstacles.length,
    gap:study.gap,triangleCount:tessellate(road).topIndexCount/3,
    degenerate:tessellate(road).degenerate,
    time:document.querySelector('#simTime').textContent,
    officialMeters:study.officialSlope2Meters,runMode:canvas.dataset.runMode};
  });
  expect(evidence.index).toBe(evidence.firstInspectionSpawn+(point==='post'?1:0));
  expect(evidence.spawnU).toBe(point==='post'?.837:.765);
  expect(evidence.realRoadCount).toBe(7);expect(evidence.movingMachines).toBe(28);
  expect(evidence.degenerate).toBe(0);expect(evidence.officialMeters).toBe(0);
  expect(evidence.collidableWidthMeters).toBeGreaterThan(10);
  expect(evidence.collidableWidthMeters).toBeLessThan(50);
  expect(Boolean(evidence.gap)).toBe(variant==='CUT');
  if(evidence.gap)expect(evidence.gap.missingRideableMidSupport).toBe(true);
  const file='g4e7r-'+variant.toLowerCase()+'-'+point+'-true-B48.png';
  await canvas.screenshot({path:info.outputPath(file)});
  records.push({variant,point,file,evidence});
 }
 expect(errors).toEqual([]);
 for(const point of ['approach','post']){
  const a=records.find(r=>r.variant==='SWEEP'&&r.point===point).evidence,
   b=records.find(r=>r.variant==='CUT'&&r.point===point).evidence;
  expect(a.spawnU).toBe(b.spawnU);
  expect(a.worldXYZ).toEqual(b.worldXYZ);
  expect(a.collidableWidthMeters).toEqual(b.collidableWidthMeters);
  expect(a.triangleCount).toBeGreaterThan(b.triangleCount);
 }
 await fs.writeFile(info.outputPath('g4e7r-honest-WebGL-audit.json'),JSON.stringify({
  schema:'dopagaki.g4e7r-real-B48-WebGL/1',records,errors,
  opticalImprovementNotProven:true,humanFairness:'HOLD',
  public:false,officialSlope2Meters:0},null,2));
});
