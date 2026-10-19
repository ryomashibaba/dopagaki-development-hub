import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('W9-C1 G4 survey exists only on separate 14m and 28m stages and exports independent real run JSON',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',err=>errors.push(err.message));
 for(const kind of ['CONTROL','ULTRA']){
  await page.goto('/drive3d/?stage=VB-P101-A13-W9C1-'+kind);
  await expect(page.locator('#appStatus')).toContainText('W9-C1 ABYSS DIVE',{timeout:80000});
  await expect(page.locator('#w9c1G4Survey')).toBeVisible();
  await expect(page.locator('#view')).toHaveAttribute('data-w9c1-edge-segments','124');
  await page.locator('#pause').click();
  await page.locator('#w9c1WarningSeen').selectOption('4');
  await page.locator('#w9c1EdgeReadability').selectOption('3');
  await page.locator('#w9c1FailureCause').selectOption('no-failure');
  await page.locator('#b5QaNote').fill('G4 script checks export only; not a human review');
  // Restart sampling with the selected stage; never activate auto-steer.
  await page.locator('#pause').click();
  await page.waitForFunction(()=>Number(document.querySelector('#simTime')?.textContent?.replace('s','')||0)>1,null,{timeout:20000});
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#b5QaExport').click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toContain('W9C1_'+kind);
  const report=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  expect(report.stageId).toBe('VB-P101-A13-W9C1-'+kind);
  expect(report.source).toContain('MANUAL_BROWSER_RUN');
  expect(report.w9c1G4.selfReport.warningSeenEarly).toBe(4);
  expect(report.w9c1G4.selfReport.edgeReadability).toBe(3);
  expect(report.w9c1G4.selfReport.failureAttribution).toBe('no-failure');
  expect(report.w9c1G4.humanApproval).toBe('HOLD_NO_AUTOMATIC_PASS');
  expect(report.w9c1G4.actualEntrySpeedProven).toBe(true);
  expect(report.samples.length).toBeGreaterThan(0);
 }
 await page.locator('#stage').selectOption('VB-P101-A13');
 await expect(page.locator('#appStatus')).toContainText('A13 W7F',{timeout:80000});
 await expect(page.locator('#w9c1G4Survey')).toBeHidden();
 await page.locator('#stage').selectOption('VB-P101-B5');
 await expect(page.locator('#appStatus')).toContainText('P101 B5 HYPER ARC',{timeout:80000});
 await expect(page.locator('#w9c1G4Survey')).toBeHidden();
 expect(errors).toEqual([]);
});
