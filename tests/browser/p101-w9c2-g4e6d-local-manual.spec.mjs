import {test,expect} from '@playwright/test';
test('G4E-6D: real gap local preview OFF by default, two physically approved-scripted but human-HOLD road options',async({page})=>{
 test.setTimeout(150000);
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E6-"]')).toHaveCount(0);
 await page.goto('/drive3d/?g4e6=on');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 for(const [site,expected] of [['C0-55-1',6.96],['B0-65-1',6.91]]){
  const id='VB-P101-A13-W9C2-G4E6-'+site;
  await expect(page.locator('#stage option[value="'+id+'"]')).toHaveCount(1);
  await page.locator('#stage').selectOption(id);
  await expect(page.locator('#appStatus')).toContainText('G4E-6 ローカル限定比較',{timeout:60000});
  const result=await page.evaluate(async name=>{
   const res=await fetch('../generated/P101_A13_W9C2_G4E6_'+name+'_LOCAL_TRIAL.json');
   if(!res.ok)throw Error('Private G4E6 physical asset unavailable');
   const doc=await res.json(),g=doc.stageForge.g4e6EarlyGap;
   return {id:doc.stageForge.recordStageId,
    roads:doc.surfaces.length,moving:doc.movingObstacles.length,
    gap:g.gapMeters,road:doc.surfaces[g.section].id,
    actualCells:doc.surfaces[g.section].voidLongitudinalCells.length,
    floor:g.noMidpointRideableSupport,physics:g.physicsLawUnchanged,
    human:doc.stageForge.humanPlaytest,promoted:doc.stageForge.productionPromoted,
    recognized:doc.stageForge.gameRegistered===true};
  },site);
  expect(result.id).toBe(id);
  expect(result.roads).toBe(7);
  expect(result.moving).toBe(28);
  expect(result.actualCells).toBe(1);
  expect(result.gap).toBeGreaterThan(expected-.2);
  expect(result.gap).toBeLessThan(expected+.2);
  expect(result.floor).toBe(true);
  expect(result.physics).toBe(true);
  expect(result.human).toBe('NOT_RUN');
  expect(result.promoted).toBe(false);
  expect(result.recognized).toBe(false);
 }
 expect(errors).toEqual([]);
});
