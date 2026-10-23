import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7W real 15m jump candidates are invisible in ordinary stage selection',async({page})=>{
 await page.goto('/drive3d/?g4e7w=on&stage=VB-P101-A13-W9C2-G4E7W-BLEND-0-65');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7W-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7w-mode','off');
});
test('G4E-7W 2 physical 15m gaps x 5 true 240Hz camera timepoints',async({page},info)=>{
 test.setTimeout(480000);
 const samples=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const plans=[['A065','0-65'],['A070','0-7']];
 for(const point of ['approach','lip','flight','landing','post'])
  for(const [name,key] of plans){
   const stageId='VB-P101-A13-W9C2-G4E7W-BLEND-'+key;
   await page.goto('/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7wPoint='+point+
    '&stage='+stageId);
   await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:85000});
   const canvas=page.locator('#view');
   await expect(page.locator('#stage')).toHaveValue(stageId);
   await expect(canvas).toHaveAttribute('data-g4e7w-mode','ACTUAL_B48_240HZ_NOT_HUMAN');
   await expect(canvas).toHaveAttribute('data-g4e7w-point',point);
   await expect(canvas).toHaveAttribute('data-run-mode','private-W-true-native-240hz-HOLD');
   await expect(canvas).toHaveAttribute('data-machine-count','28');
   await expect(page.locator('#pause')).toContainText('再開');
   const proof=await page.evaluate(async()=>{
    const canvas=document.querySelector('#view'),data=canvas.dataset,
     id=document.querySelector('#stage').value,
     k=id.endsWith('0-65')?'A065':'A070',
     realDoc=await(await fetch('../generated/P101_A13_W9C2_G4E7W_'+k+'_LOCAL_TRIAL.json')).json(),
     raw=await(await fetch('../generated/P101_A13_W9C2_G4E7W_240HZ_FRAMES_LOCAL.json')).json(),
     shot=raw.stages[k].frames.find(f=>f.id===data.g4e7wPoint);
    const {sample}=await import('../reference_only/director/surface.js'),
     surface=realDoc.surfaces[0],
     u=52/90,a=sample(surface,u,0),b=sample(surface,u,1);
    return {id,key:k,point:data.g4e7wPoint,time:Number(data.g4e7wTime),
     speed:Number(data.g4e7wSpeedMps),grounded:data.g4e7wGrounded==='true',
     hudSpeed:parseFloat(document.querySelector('#speed').textContent),
     hudTime:parseFloat(document.querySelector('#simTime').textContent),
     actualSource:shot.source,shotTime:shot.timeSeconds,shotSpeed:shot.speedMps,
     alpha:realDoc.stageForge.g4e7wStudy.physicalTakeoffTransition,
     widthAtGap:Math.hypot(...a.map((x,i)=>x-b[i])),
     gapMeters:realDoc.stageForge.g4e7wStudy.gap.gapMeters,
     cutCells:realDoc.surfaces[0].voidLongitudinalCells,
     real240Hz:raw.real240Hz,roads:realDoc.surfaces.length,
     machines:realDoc.movingObstacles.length,certified:raw.officialSlope2Meters};
   });
   expect(proof.real240Hz).toBe(240);
   expect(proof.machines).toBe(28);expect(proof.roads).toBe(7);
   expect(proof.certified).toBe(0);
   expect(proof.actualSource).toBe('TRUE_START00_240HZ_P96_NOT_HUMAN');
   expect(proof.speed).toBe(proof.shotSpeed);
   expect(proof.time).toBe(proof.shotTime);
   expect(proof.hudSpeed).toBeCloseTo(proof.speed,0);
   expect(proof.hudTime).toBeCloseTo(proof.time,1);
   expect(proof.alpha).toBe(name==='A065'?.65:.7);
   expect(proof.widthAtGap).toBeGreaterThan(11);
   expect(proof.widthAtGap).toBeLessThan(16);
   expect(proof.cutCells).toEqual([52]);
   const file='g4e7w-'+name.toLowerCase()+'-'+point+'-240hz.png';
   await canvas.screenshot({path:info.outputPath(file)});
   samples.push({file,proof});
  }
 expect(errors).toEqual([]);
 for(const point of ['approach','lip','flight','landing','post']){
  const a=samples.filter(x=>x.proof.point===point);
  expect(a).toHaveLength(2);
  expect(a[0].proof.time).toBe(a[1].proof.time);
 }
 await fs.writeFile(info.outputPath('g4e7w-actual-240hz-image-meta.json'),JSON.stringify({
  schema:'dopagaki.g4e7w-chromium-evidence/1',samples,
  realPhysics:true,humanPlayability:'HOLD',officialSlope2Meters:0,errors,
  publicRelease:false},null,2));
});
