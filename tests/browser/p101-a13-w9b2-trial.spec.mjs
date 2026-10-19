import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('W9-B2 isolated playable real-bank trial vs W7F Gold with independent manual export',async({page},info)=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/?stage=VB-P101-A13-W9X-B1');
 await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9X-B1');
 await expect(page.locator('#appStatus')).toContainText('W9-X-B1',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-a13-version','W9-X-B1');
 await expect(page.locator('#view')).toHaveAttribute('data-w9-trial','true');
 await expect(page.locator('#view')).toHaveAttribute('data-w9-bank-amplitude','8');
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
 await expect(page.locator('#view')).toHaveAttribute('data-a13-w9-facilities','2');
 await expect(page.locator('#w9TrialWarning')).toBeVisible();
 await expect(page.locator('#b5QaTitle')).toContainText('W9-X-B1');
 await expect(page.locator('#demoRun')).toBeDisabled();
 await expect(page.locator('#w9TrialLink')).toHaveAttribute('href','?stage=VB-P101-A13-W9X-B1');
 await expect(page.locator('#w9GoldLink')).toHaveAttribute('href','?stage=VB-P101-A13');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await page.locator('#view').screenshot({path:info.outputPath('w9x-opening-real-webgl.png')});
 await page.locator('#spawn').selectOption('3');
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
 await page.locator('#view').screenshot({path:info.outputPath('w9x-lower-reversal-real-webgl.png')});
 await page.keyboard.down('ArrowRight');
 await page.waitForFunction(()=>Number.parseFloat(document.querySelector('#simTime')?.textContent||'0')>1.1,null,{timeout:40000});
 await page.keyboard.up('ArrowRight');
 const promise=page.waitForEvent('download');
 await page.locator('#b5QaExport').click();
 const d=await promise;
 expect(d.suggestedFilename()).toMatch(/^P101_A13_W9X_B1_MANUAL_QA_(ongoing|failed|finished)\.json$/);
 const audit=JSON.parse(await fs.readFile(await d.path(),'utf8'));
 expect(audit.stageId).toBe('VB-P101-A13-W9X-B1');
 expect(audit.samples.length).toBeGreaterThan(0);
 await page.locator('#stage').selectOption('VB-P101-A13');
 await expect(page.locator('#appStatus')).toContainText('A13 W7F');
 await expect(page.locator('#view')).toHaveAttribute('data-a13-version','W7F');
 await expect(page.locator('#view')).toHaveAttribute('data-w9-trial','false');
 await expect(page.locator('#view')).toHaveAttribute('data-w9-bank-amplitude','0');
 await expect(page.locator('#w9TrialWarning')).toBeHidden();
 await page.locator('#spawn').selectOption('3');
 await page.locator('#view').screenshot({path:info.outputPath('w7f-lower-reversal-real-webgl.png')});
 // Independent evidence: measured authentic B48 lattice deltas, not visual success inferred from CI.
 const physicalComparison=await page.evaluate(async()=>{
  const [trial,gold]=await Promise.all([
   fetch('../generated/P101_A13_W9X_B1_TRIAL.json').then(r=>r.json()),
   fetch('../generated/P101_A13_W7_GAMEPLAY.json').then(r=>r.json())
  ]);
  const differences=[];let nonbankDifferences=0,centerChanges=0,seamChanges=0;
  for(let section=0;section<gold.surfaces.length;section++){
   const a=trial.surfaces[section],b=gold.surfaces[section];
   for(let j=0;j<a.points.length;j++){
    const p=a.points[j],q=b.points[j];
    const changed=p.some((v,k)=>v!==q[k]);
    if(section!==3){if(changed)nonbankDifferences++;continue;}
    if(j%5===2&&changed)centerChanges++;
    if(Math.floor(j/5)===0||Math.floor(j/5)===30){if(changed)seamChanges++;}
    if(changed)differences.push({row:Math.floor(j/5),lane:j%5,verticalMeters:p[1]-q[1]});
   }
  }
  const magnitude=differences.map(x=>Math.abs(x.verticalMeters));
  const positive=differences.filter(x=>x.verticalMeters>1e-7).length;
  const negative=differences.filter(x=>x.verticalMeters< -1e-7).length;
  return {schema:'dopagaki.w9b3-physical-visual-evidence/1',
   source:'ACTUAL_BROWSER_FETCH_OF_B48_STAGE_JSON_NOT_HUMAN_PLAYTEST',
   comparison:'W9-X-B1 versus protected W7F Gold',
   changedControlPoints:differences.length,
   maxVerticalControlPointDeltaMeters:Math.max(...magnitude),
   positiveChanges:positive,negativeChanges:negative,
   centerChanges,seamChanges,nonbankDifferences,
   movingColliderCount:trial.movingObstacles.length,
   unchangedMovingBodies:JSON.stringify(trial.movingObstacles)===JSON.stringify(gold.movingObstacles),
   humanPlayability:'NOT_TESTED',fairness:'HOLD',productionPromotion:false};
 });
 expect(physicalComparison.changedControlPoints).toBeGreaterThan(45);
 expect(physicalComparison.maxVerticalControlPointDeltaMeters).toBeGreaterThan(4);
 expect(physicalComparison.maxVerticalControlPointDeltaMeters).toBeLessThan(8);
 expect(physicalComparison.positiveChanges).toBeGreaterThan(0);
 expect(physicalComparison.negativeChanges).toBeGreaterThan(0);
 expect(physicalComparison.centerChanges).toBe(0);
 expect(physicalComparison.seamChanges).toBe(0);
 expect(physicalComparison.nonbankDifferences).toBe(0);
 expect(physicalComparison.unchangedMovingBodies).toBe(true);
 expect(physicalComparison.movingColliderCount).toBe(28);
 await fs.writeFile(info.outputPath('w9b3-visual-audit.json'),JSON.stringify(physicalComparison,null,2)+'\\n');
 await page.locator('#stage').selectOption('VB-P101-B5');
 await expect(page.locator('#appStatus')).toContainText('B5 HYPER ARC');
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#view')).toHaveAttribute('data-w9-trial','false');
 expect(errors).toEqual([]);
});
