import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7T private trials never selectable in default browser stage menu',async({page})=>{
 await page.goto('/drive3d/?stage=VB-P101-A13-W9C2-G4E7T-EARLY');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7T-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7t-mode','off');
});
test('G4E-7T private true early 13m B48 real WEBGL six-frame honest A/B/C',async({page},info)=>{
 test.setTimeout(280000);
 const errors=[],images=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const variant of ['SOLID','EARLY','LATE'])for(const point of ['approach','landing']){
  const stageId='VB-P101-A13-W9C2-G4E7T-'+variant;
  await page.goto('/drive3d/?g4e7t=on&g4e7tFrame=hold&g4e7tPoint='+point+'&stage='+stageId);
  const canvas=page.locator('#view');
  await expect(page.locator('#appStatus')).toContainText('G4E-7T LOCAL',{timeout:70000});
  await expect(page.locator('#stage')).toHaveValue(stageId);
  await expect(canvas).toHaveAttribute('data-g4e7t-mode','STATIC_TRUE_EARLY_B48_HOLD');
  await expect(canvas).toHaveAttribute('data-g4e7t-variant',variant.toLowerCase());
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(canvas).toHaveAttribute('data-run-mode','private-true-early-B48-HOLD');
  await expect(page.locator('#pause')).toContainText('再開');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  const data=await page.evaluate(async()=>{
   const id=document.querySelector('#stage').value,variant=id.split('-').at(-1),
    file='../generated/P101_A13_W9C2_G4E7T_'+variant+'_LOCAL_TRIAL.json',
    response=await fetch(file);
   if(!response.ok)throw Error('Missing private real B48 candidate');
   const doc=await response.json(),study=doc.stageForge.g4e7tStudy,
    idx=Number(document.querySelector('#spawn').value),sp=doc.spawns[idx],
    {sample,tessellate}=await import('../reference_only/director/surface.js');
   const road=doc.surfaces.find(s=>s.id===sp.surface),
    l=sample(road,sp.u,0),r=sample(road,sp.u,1);
   return {index:idx,base:study.originalSpawnCount,u:sp.u,
    xyz:sample(road,sp.u,.5),widthMeters:Math.hypot(...l.map((x,i)=>x-r[i])),
    triangleCount:tessellate(road).topIndexCount/3,
    gap:study.gap,variant:study.variant,roads:doc.surfaces.length,
    moving:doc.movingObstacles.length,certified:study.certifiedSlope2Meters};
  });
  expect(data.index).toBe(data.base+(point==='landing'?1:0));
  expect(data.u).toBe(point==='landing'?.68:.53);
  expect(data.widthMeters).toBeGreaterThan(10);
  expect(data.widthMeters).toBeLessThan(80);
  expect(data.roads).toBe(7);expect(data.moving).toBe(28);
  expect(data.certified).toBe(0);
  expect(Boolean(data.gap)).toBe(variant!=='SOLID');
  if(data.gap){expect(data.gap.physicalTwoCellVoid).toBe(true);expect(data.gap.cells).toHaveLength(2);}
  const file='g4e7t-'+variant.toLowerCase()+'-'+point+'-actual-B48.png';
  await canvas.screenshot({path:info.outputPath(file)});
  images.push({variant,point,file,data});
 }
 expect(errors).toEqual([]);
 for(const point of ['approach','landing']){
  const root=images.find(x=>x.variant==='SOLID'&&x.point===point).data;
  for(const variant of ['EARLY','LATE']){
   const v=images.find(x=>x.variant===variant&&x.point===point).data;
   expect(v.u).toBe(root.u);expect(v.xyz).toEqual(root.xyz);
   expect(v.widthMeters).toBe(root.widthMeters);
   expect(root.triangleCount).toBeGreaterThan(v.triangleCount);
  }
 }
 await fs.writeFile(info.outputPath('g4e7t-real-early-WebGL.json'),JSON.stringify({
  schema:'dopagaki.g4e7t-private-real-early-B48-WebGL/1',images,
  canonicalAutoStatus:'SEPARATE_FROM_VISUAL',humanStatus:'HOLD',
  certifiedSlope2Meters:0,errors,release:false},null,2));
});
