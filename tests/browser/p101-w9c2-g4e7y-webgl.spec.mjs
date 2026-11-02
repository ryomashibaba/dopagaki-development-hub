import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7Y actual 240Hz occlusion: baseline vs first-road quiet vs open skyline',async({page},info)=>{
 test.setTimeout(480000);const samples=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const [name,suffix] of [['A065','0-65'],['A070','0-7']])
 for(const point of ['approach','lip','flight'])
 for(const mode of ['baseline','quiet','open']){
  const stage='VB-P101-A13-W9C2-G4E7W-BLEND-'+suffix;
  await page.goto('/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7wPoint='+point+
    (mode==='baseline'?'':'&g4e7yScene='+mode)+'&stage='+stage);
  const canvas=page.locator('#view');
  await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:65000});
  await expect(canvas).toHaveAttribute('data-g4e7y-scene',mode);
  await expect(canvas).toHaveAttribute('data-g4e7w-mode','ACTUAL_B48_240HZ_NOT_HUMAN');
  const obs=await page.evaluate(async()=>{
   const d=document.querySelector('#view').dataset,
    id=document.querySelector('#stage').value,
    key=id.endsWith('0-65')?'A065':'A070',
    phys=await(await fetch('../generated/P101_A13_W9C2_G4E7W_'+key+'_LOCAL_TRIAL.json')).json();
   return {time:Number(d.g4e7wTime),speed:Number(d.g4e7wSpeedMps),
    hazardFramesRemoved:Number(d.g4e7yRemovedHazardFrames),
    facilities:Number(d.g4e7yHeroFacilities),machines:Number(d.machineCount),
    physicalRoads:phys.surfaces.length,voidCells:phys.surfaces[0].voidLongitudinalCells,
    official:phys.stageForge.g4e7wStudy.officialSlope2Meters,
    physicalGeometryUnmodified:d.g4e7yActualB48Unmodified};
  });
  expect(obs.machines).toBe(28);expect(obs.physicalRoads).toBe(7);
  expect(obs.voidCells).toEqual([52]);expect(obs.official).toBe(0);
  expect(obs.speed).toBeGreaterThan(75);expect(obs.physicalGeometryUnmodified).toBe('true');
  if(mode==='baseline'){expect(obs.hazardFramesRemoved).toBe(0);expect(obs.facilities).toBe(2);}
  else{expect(obs.hazardFramesRemoved).toBeGreaterThan(0);expect(obs.facilities).toBe(1);}
  const file='g4e7y-'+name.toLowerCase()+'-'+point+'-'+mode+'.png';
  await canvas.screenshot({path:info.outputPath(file)});
  samples.push({name,point,mode,obs,file});
 }
 expect(errors).toEqual([]);
 for(const name of ['A065','A070'])for(const point of ['approach','lip','flight']){
  const g=samples.filter(x=>x.name===name&&x.point===point);
  expect(g.length).toBe(3);
  expect(g.every(x=>x.obs.time===g[0].obs.time&&x.obs.speed===g[0].obs.speed)).toBe(true);
 }
 await fs.writeFile(info.outputPath('g4e7y-real-camera-scene-18view.json'),JSON.stringify({
  schema:'dopagaki.g4e7y-scenery-occlusion-real-B48/1',samples,
  humanVisibility:'HOLD',publication:'HOLD',officialSlope2Meters:0},null,2));
});
