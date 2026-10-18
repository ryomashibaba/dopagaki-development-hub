import {test,expect} from '@playwright/test';
test('B5 PR-only playable real WebGL two opposed 180 turns and verified physical power law manual input',async({page},info)=>{
 test.setTimeout(110000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P101-B5');
 await expect(page.locator('#appStatus')).toContainText('B5 HYPER ARC',{timeout:80000});
 await expect(page.locator('#view')).toHaveAttribute('data-b5-physical-stage','true');
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#p101Controls')).toBeVisible();
 await expect(page.locator('#demoRun')).toBeDisabled();
 await expect(page.locator('#p101Profile')).toHaveValue('OVERDRIVE');
 const stage=await page.evaluate(async()=>{
  const res=await fetch('../generated/P101_B5_HYPER_ARC.json',{cache:'no-store'});
  if(!res.ok)throw Error('missing real generated native B5 JSON');
  const d=await res.json();
  return {roadCount:d.surfaces.length,roadLengths:d.stageForge.actualRoads.map(x=>x.length),
   total:d.stageForge.nominalLengthMeters,machines:d.movingObstacles.length,
   profile:d.stageForge.genuineFastLaw,verified:d.stageForge.fullStartToFinish,
   variant:d.stageForge.variant};
 });
 expect(stage.roadCount).toBe(7);
 expect(stage.total).toBe(7280);
 expect(stage.machines).toBe(12);
 expect(stage.roadLengths[3]).toBe(1800);
 expect(stage.variant).toBe('B5_HYPER_ARC_ISOLATED');
 expect(stage.profile).toMatchObject({baseForwardScale:.12,afterSection:4,positiveLateAddition:.13});
 expect(stage.verified).toContain('SCRIPTED_ONLY');
 await page.locator('#view').screenshot({path:info.outputPath('p101-b5-real-opening-webgl.png')});
 await page.locator('#spawn').selectOption('3');
 await expect(page.locator('#view')).toHaveAttribute('data-b5-physical-stage','true');
 await page.locator('#view').screenshot({path:info.outputPath('p101-b5-real-180deg-lower-reversal-webgl.png')});
 await page.keyboard.down('ArrowRight');
 await page.waitForFunction(()=>Number.parseFloat(document.querySelector('#simTime')?.textContent||'0')>1.5,null,{timeout:40000});
 await page.keyboard.up('ArrowRight');
 await expect(page.locator('#speed')).not.toHaveText('44.0');
 await page.locator('#stage').selectOption('VB-P100');
 await expect(page.locator('#view')).toHaveAttribute('data-b5-physical-stage','false');
 await expect(page.locator('#p101Controls')).toBeHidden();
 expect(errors).toEqual([]);
});
