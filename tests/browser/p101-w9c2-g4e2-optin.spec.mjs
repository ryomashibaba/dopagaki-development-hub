import {test,expect} from '@playwright/test';
test('G4E-2 private selector opt-in exposes both real narrow road candidates without changing Gold default',async({page})=>{
 test.setTimeout(150000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#stage option[value="VB-P101-A13-W9C2-G4E-SHOULDER"]')).toHaveCount(0);
 await expect(page.locator('#stage option[value="VB-P101-A13-W9C2-G4E-RAZOR"]')).toHaveCount(0);
 await page.goto('/drive3d/?g4e=on');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 for(const kind of ['SHOULDER','RAZOR']){
  const id='VB-P101-A13-W9C2-G4E-'+kind;
  await expect(page.locator('#stage option[value="'+id+'"]')).toHaveCount(1);
  await page.locator('#stage').selectOption(id);
  await expect(page.locator('#appStatus')).toContainText('G4E-1 独立試走',{timeout:60000});
  const record=await page.evaluate(async name=>{
   const response=await fetch('../generated/P101_A13_W9C2_G4E_'+name+'_TRIAL.json');
   if(!response.ok)throw Error('Missing physical candidate asset');
   const doc=await response.json();
   return {id:doc.stageForge.recordStageId,roads:doc.surfaces.length,
    machines:doc.movingObstacles.length,
    physical:doc.stageForge.g4ePhysicalStudy.realB48Collider,
    approved:doc.stageForge.productionPromoted,
    human:doc.stageForge.humanPlaytest,
    modifiedRows:doc.stageForge.g4ePhysicalStudy.modifiedControlRows.length,
    gaps:doc.stageForge.g4ePhysicalStudy.trueOpenGapImplemented};
  },kind);
  expect(record).toMatchObject({id,roads:7,machines:28,physical:true,
   approved:false,human:'NOT_RUN',gaps:false});
  expect(record.modifiedRows).toBeGreaterThan(8);
 }
 expect(errors).toEqual([]);
});
