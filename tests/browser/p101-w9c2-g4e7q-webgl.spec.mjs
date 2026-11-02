import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7Q is never selectable from normal or Gold/default private preview',async({page})=>{
 await page.goto('/drive3d/?stage=VB-P101-A13-W9C2-G4E7Q-LEAP');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7Q-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7q-mode','off');
});
test('G4E-7Q genuine dive + missing collider gap private WebGL and zero-time proof',async({page},info)=>{
 test.setTimeout(280000);
 const output=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const variant of ['DROP','LEAP'])for(const point of ['crest','landing']){
  const id='VB-P101-A13-W9C2-G4E7Q-'+variant;
  await page.goto('/drive3d/?g4e7q=on&g4e7qFrame=hold&g4e7qPoint='+point+'&stage='+id);
  const canvas=page.locator('#view');
  await expect(page.locator('#appStatus')).toContainText('G4E-7Q',{timeout:70000});
  await expect(page.locator('#stage')).toHaveValue(id);
  await expect(canvas).toHaveAttribute('data-g4e7q-mode','STATIC_ACTUAL_B48_HOLD');
  await expect(canvas).toHaveAttribute('data-g4e7q-variant',variant.toLowerCase());
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  await expect(page.locator('#pause')).toContainText('再開');
  const evidence=await page.evaluate(async()=>{
   const id=document.querySelector('#stage').value,v=id.endsWith('DROP')?'DROP':'LEAP';
   const doc=await(await fetch('../generated/P101_A13_W9C2_G4E7Q_'+v+'_LOCAL_TRIAL.json')).json();
   const {sample,tessellate}=await import('../reference_only/director/surface.js');
   const spawn=doc.spawns[Number(document.querySelector('#spawn').value)];
   const road=doc.surfaces.find(s=>s.id===spawn.surface),
    a=sample(road,spawn.u,0),b=sample(road,spawn.u,1);
   const canvas=document.querySelector('#view');
   return {id,spawnIndex:Number(document.querySelector('#spawn').value),
    expected:doc.stageForge.g4e7qStudy.originalSpawns,spawnU:spawn.u,
    roadWidth:Math.hypot(...a.map((x,i)=>x-b[i])),roadXYZ:sample(road,spawn.u,spawn.v),
    variant:doc.stageForge.g4e7qStudy.variant,hasPhysicalGap:!!doc.stageForge.g4e7qStudy.gap,
    gap:doc.stageForge.g4e7qStudy.gap,
    colliders:doc.surfaces.length,machines:doc.movingObstacles.length,
    topTriangles:tessellate(road).topIndexCount/3,
    degenerate:tessellate(road).degenerate,
    certified:doc.stageForge.g4e7qStudy.officiallyApprovedSlopeDnaMeters,
    time:document.querySelector('#simTime').textContent,runMode:canvas.dataset.runMode};
  });
  expect(evidence.colliders).toBe(7);expect(evidence.machines).toBe(28);
  expect(evidence.degenerate).toBe(0);expect(evidence.certified).toBe(0);
  expect(evidence.roadWidth).toBeGreaterThan(10);
  expect(evidence.roadWidth).toBeLessThan(50);
  expect(evidence.spawnIndex).toBe(evidence.expected+(point==='landing'?1:0));
  expect(evidence.spawnU).toBe(point==='landing'?.814:.762);
  expect(evidence.hasPhysicalGap).toBe(variant==='LEAP');
  expect(evidence.runMode).toBe('private-real-B48-dive-human-hold');
  if(variant==='LEAP'){expect(evidence.gap.actualB48MissingStrips).toBe(true);
   expect(evidence.gap.noRideableMidpointSupport).toBe(true);
  }
  const file='g4e7q-'+variant.toLowerCase()+'-'+point+'-actual-webgl.png';
  await canvas.screenshot({path:info.outputPath(file)});
  output.push({file,point,variant,evidence});
 }
 expect(errors).toEqual([]);
 for(const point of ['crest','landing']){
  const a=output.find(x=>x.point===point&&x.variant==='DROP');
  const b=output.find(x=>x.point===point&&x.variant==='LEAP');
  expect(a.evidence.roadWidth).toEqual(b.evidence.roadWidth);
  expect(a.evidence.roadXYZ).toEqual(b.evidence.roadXYZ);
  expect(a.evidence.topTriangles).toBeGreaterThan(b.evidence.topTriangles);
 }
 await fs.writeFile(info.outputPath('g4e7q-B48-private-WebGL.json'),JSON.stringify({
  schema:'dopagaki.g4e7q-WebGL/1',studies:output,errors,actualRealB48Gap:true,
  previewOnly:true,airborneJumpNotVerified:true,humanFairness:'HOLD',published:false,
  certifiedSlope2Meters:0},null,2));
});
