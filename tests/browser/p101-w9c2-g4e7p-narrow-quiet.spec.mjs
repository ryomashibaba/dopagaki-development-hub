import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7P opt-in cannot appear on Gold or normal game',async({page})=>{
 await page.goto('/drive3d/?g4e7p=quiet&stage=VB-P101-A13-W9C2-G4E7M-THREAD');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7p-mode','off');
 await page.goto('/drive3d/?g4e7m=on&g4e7p=quiet&stage=VB-P101-A13-W9C2-G4E7G-GOLD');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7p-mode','off');
});
test('G4E-7P 8 private real-WebGL views, identical B48 geometry and warnings',async({page},info)=>{
 test.setTimeout(330000);const studies=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const variant of ['THREAD','PRECIPICE'])for(const point of ['skyline','crown']){
  const captures=[];
  for(const quiet of [false,true]){
   const id='VB-P101-A13-W9C2-G4E7M-'+variant;
   await page.goto('/drive3d/?g4e7m=on&g4e7mFrame=hold&g4e7mPoint='+point+
    (quiet?'&g4e7p=quiet':'')+'&stage='+id);
   const canvas=page.locator('#view');
   await expect(page.locator('#appStatus')).toContainText('G4E-7M',{timeout:70000});
   await expect(canvas).toHaveAttribute('data-g4e7p-mode',quiet?'private-narrow-quiet':'off');
   await expect(canvas).toHaveAttribute('data-machine-count','28');
   await expect(page.locator('#simTime')).toHaveText('0.00 s');
   const evidence=await page.evaluate(async()=>{
    const id=document.querySelector('#stage').value,v=id.endsWith('THREAD')?'THREAD':'PRECIPICE';
    const d=await(await fetch('../generated/P101_A13_W9C2_G4E7M_'+v+'_LOCAL_TRIAL.json')).json();
    const spawn=d.spawns[Number(document.querySelector('#spawn').value)],
     road=d.surfaces.find(x=>x.id===spawn.surface),{sample}=await import('../reference_only/director/surface.js');
    const a=sample(road,spawn.u,0),b=sample(road,spawn.u,1),canvas=document.querySelector('#view');
    return {id,spawnIndex:document.querySelector('#spawn').value,position:sample(road,spawn.u,spawn.v),
     width:Math.hypot(...a.map((x,i)=>x-b[i])),time:document.querySelector('#simTime').textContent,
     machines:d.movingObstacles.length,roads:d.surfaces.length,certified:d.stageForge.g4e7mRealRoad.certifiedSlopeDnaMeters,
     camera:canvas.dataset.cameraMode,headingLag:canvas.dataset.cameraHeadingLagDegrees,
     machineWarning:document.querySelector('#machineCue').textContent,
     edgeWarning:document.querySelector('#edgeRadar').textContent,removed:Number(canvas.dataset.g4e7pRemoved)};
   });
   const file='g4e7p-'+variant.toLowerCase()+'-'+point+'-'+(quiet?'quiet':'baseline')+'.png';
   await canvas.screenshot({path:info.outputPath(file)});
   captures.push({evidence,file});
  }
  const [before,after]=captures;
  for(const key of ['id','spawnIndex','position','width','time','machines','roads','certified','camera',
   'headingLag','machineWarning','edgeWarning'])
   expect(after.evidence[key]).toEqual(before.evidence[key]);
  expect(before.evidence.width).toBeGreaterThan(10);
  expect(before.evidence.width).toBeLessThan(17);
  expect(before.evidence.machines).toBe(28);
  expect(before.evidence.certified).toBe(0);
  expect(before.evidence.time).toBe('0.00 s');
  expect(before.evidence.removed).toBe(0);
  expect(after.evidence.removed).toBeGreaterThan(0);
  studies.push({variant,point,baseline:before.file,quiet:after.file,
   trueColliderWidthMeters:before.evidence.width,removedGpuTriangles:after.evidence.removed,
   equalPhysics:true,humanFairness:'HOLD'});
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7p-physical-quiet-audit.json'),JSON.stringify({
  schema:'dopagaki.g4e7p-private-B48-WebGL/1',studies,errors,published:false,
  approvedSlope2Meters:0,humanRideability:'NOT_TESTED'},null,2));
});
