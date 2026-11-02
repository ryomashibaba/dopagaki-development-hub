import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const choices=['true-pinch','pinch-switch'];
const stage=id=>'VB-P101-A13-W9C2-G4E7AK-'+id.toUpperCase();
test('AK reanchor experiment is invisible without explicit local frame opt-in',async({page})=>{
 await page.goto('/drive3d/?stage='+stage('true-pinch'));
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7AK"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7ak-mode','off');
});
test('AK actual reanchored 28 B51-C show in native 240Hz Chromium WebGL at 10 private views',async({page},info)=>{
 test.setTimeout(480000);
 const errors=[],records=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const id of choices){
  for(const shot of ['t250','t280','t320','t690']){
   for(const backdrop of (shot==='t280'?['quiet','legacy']:['quiet'])){
    await page.goto('/drive3d/?g4e7ak=on&g4e7akFrame=hold&g4e7akPoint='+shot+
     '&g4e7akBackdrop='+backdrop+'&stage='+stage(id));
    const canvas=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7AK LOCAL',{timeout:90000});
    await expect(page.locator('#stage')).toHaveValue(stage(id));
    await expect(canvas).toHaveAttribute('data-g4e7ak-mode','ACTUAL_240HZ_AJ_REANCHOR_B51_HOLD');
    await expect(canvas).toHaveAttribute('data-g4e7ak-point',shot);
    await expect(canvas).toHaveAttribute('data-g4e7ak-backdrop',backdrop);
    const data=await page.evaluate(async id=>{
     const d=document.querySelector('#view').dataset,
      doc=await(await fetch('../generated/P101_A13_W9C2_G4E7AK_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json')).json(),
      proof=await(await fetch('../generated/P101_A13_W9C2_G4E7AK_240HZ_FRAMES_LOCAL.json')).json(),
      f=proof.stages[id].frames.find(x=>x.id===d.g4e7akPoint);
     return {id,shot:d.g4e7akPoint,backdrop:d.g4e7akBackdrop,
      time:f.timeSeconds,speed:f.speedMps,yaw:f.yaw,eye:f.eye,front:f.front,
      source:f.source,originalMovingPose:f.originalMovingPose,
      stageId:proof.stages[id].stageId,docId:doc.stageForge.recordStageId,
      roads:doc.surfaces.length,machines:doc.movingObstacles.length,
      unchanged:doc.stageForge.g4e7ajStudy.unchangedMovingObjects,
      sourceLayout:doc.stageForge.g4e7ajStudy.id,
      width:doc.stageForge.g4e7ahStudy.widthMinMeters,
      gap:doc.surfaces[0].voidLongitudinalCells,
      hz:proof.physicsHz,promoted:doc.stageForge.productionPromoted,
      certified:proof.certifiedSlope2Meters,publication:proof.publication};
    },id);
    expect(data.roads).toBe(7);expect(data.machines).toBe(28);
    expect(data.unchanged).toBe(26);expect(data.sourceLayout).toBe('reanchor');
    expect(data.stageId).toBe(data.docId);expect(data.gap).toEqual([52]);
    expect(data.hz).toBe(240);expect(data.promoted).toBe(false);
    expect(data.speed).toBeGreaterThan(52);expect(data.width).toBeLessThan(12);
    expect(data.source).toBe('ACTUAL_240HZ_START00_REANCHORED_28_B51_P96_NOT_HUMAN');
    expect(data.originalMovingPose).toHaveLength(2);
    expect(data.certified).toBe(0);expect(data.publication).toBe('HOLD');
    const file='g4e7ak-'+id+'-'+shot+'-'+backdrop+'.png';
    await canvas.screenshot({path:info.outputPath(file)});
    records.push({file,data});
   }
  }
 }
 expect(records).toHaveLength(10);
 for(const id of choices){
  const a=records.find(r=>r.data.id===id&&r.data.shot==='t280'&&r.data.backdrop==='quiet').data;
  const b=records.find(r=>r.data.id===id&&r.data.shot==='t280'&&r.data.backdrop==='legacy').data;
  expect({eye:a.eye,front:a.front,yaw:a.yaw,speed:a.speed,originalMovingPose:a.originalMovingPose}).toEqual(
   {eye:b.eye,front:b.front,yaw:b.yaw,speed:b.speed,originalMovingPose:b.originalMovingPose});
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7ak-true-reanchor-WebGL-10-evidence.json'),
  JSON.stringify({schema:'dopagaki.g4e7ak-reanchor-Chromium-WebGL/1',records,
   note:'real native ball poses and both genuine hazard 3D poses; P96 not human; screenshot does not certify visual fairness',
   formalSlope2Meters:0,humanQuality:'HOLD',artQuality:'HOLD',publication:'HOLD'},null,2));
});
