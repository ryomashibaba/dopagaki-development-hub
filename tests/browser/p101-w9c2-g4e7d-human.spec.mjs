import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

/** Human QA is an OFFLINE workflow test. Playwright clicks controls but DOES
 * NOT claim actual human eyes, actual manual steering, or Windows GPU FPS.
 */
test('G4E7D human panel cannot appear in default/public Gold',async({page})=>{
 await page.goto('/drive3d/?g4e7c=candidate&g4e7d=manual');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#g4e7dPanel')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7c-mode','off');
});
test('G4E7D single private page safely records 4 honest incomplete runs then downloads JSON',async({page},info)=>{
 test.setTimeout(150000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='/drive3d/?g4e6=on&g4e7c=candidate&g4e7d=manual&stage=VB-P101-A13-W9C2-G4E6-C0-55-1';
 await page.goto(url);
 await expect(page.locator('#appStatus')).toContainText('G4E-6',{timeout:60000});
 const view=page.locator('#view'),panel=page.locator('#g4e7dPanel');
 await expect(panel).toBeVisible();
 await expect(view).toHaveAttribute('data-run-mode','manual');
 await expect(view).toHaveAttribute('data-g4e7d-mode','human-keyboard-qa-only');
 await expect(view).toHaveAttribute('data-g4e7b-mode','off');
 await expect(view).toHaveAttribute('data-machine-count','28');
 await expect(page.locator('#stage')).toBeDisabled();
 await expect(page.locator('#cameraCompare')).toBeDisabled();
 await expect(page.locator('#g4e7cCueToggle')).toBeDisabled();
 const plan=[
  {id:'C0-55-1',cue:false},
  {id:'C0-55-1',cue:true},
  {id:'B0-65-1',cue:false},
  {id:'B0-65-1',cue:true}
 ];
 for(const [i,choice] of plan.entries()){
  await expect(page.locator('#g4e7dStep')).toContainText((i+1)+'/4');
  await expect(page.locator('#g4e7dStep')).toContainText(choice.id);
  await expect(view).toHaveAttribute('data-g4e7c-cue-active',String(choice.cue));
  await expect(view).toHaveAttribute('data-g4e7d-mode','human-keyboard-qa-only');
  await page.locator('#g4e7dVisibility').selectOption(i===0?'no':i===1?'yes':'unsure');
  await page.locator('#g4e7dEnjoyment').selectOption(i===1?'4':'');
  await page.locator('#g4e7dNote').fill(i===0?'Playwright control-flow test; not human feedback':'');
  await page.locator('#g4e7dNext').click();
  if(i<plan.length-1){
   await expect(page.locator('#g4e7dStep')).toContainText((i+2)+'/4',{timeout:60000});
   await expect(view).toHaveAttribute('data-g4e7d-mode','human-keyboard-qa-only');
  }
 }
 await expect(page.locator('#g4e7dStep')).toContainText('4/4 記録済み');
 await expect(page.locator('#g4e7dNext')).toBeDisabled();
 await expect(view).toHaveAttribute('data-g4e7d-mode','four-trials-recorded-hold');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#g4e7dDownload').click();
 const download=await downloadPromise;
 const report=JSON.parse(await fs.readFile(await download.path(),'utf8'));
 expect(report.completedPairs).toBe(true);
 expect(report.completedTrials).toBe(4);
 expect(report.runs.map(x=>x.candidateId)).toEqual(plan.map(x=>x.id));
 expect(report.runs.map(x=>x.nonCollisionCue)).toEqual(['OFF','ON','OFF','ON']);
 expect(report.runs.map(x=>x.input)).toEqual(Array(4).fill('HUMAN_KEYBOARD_OR_TOUCH_NOT_P96'));
 expect(report.runs.every(x=>x.approvedSlopeDnaMeters===0&&x.fairnessCertified===false)).toBe(true);
 expect(report.runs.every(x=>x.physics.observedOriginalRoadLanding18Ticks===false)).toBe(true);
 expect(report.runs.every(x=>x.status==='RUNNING_SNAPSHOT_NOT_TERMINAL'||x.status==='failed')).toBe(true);
 expect(report.runs[0].voluntaryHumanReport.gapVisibleAtLeastTwoSecondsBeforeTakeoff).toBe('no');
 expect(report.runs[1].voluntaryHumanReport.enjoymentOneToFive).toBe(4);
 expect(report.automaticSubmission).toBeUndefined();
 await fs.writeFile(info.outputPath('g4e7d-headless-control-flow-NOT-HUMAN.json'),JSON.stringify({
  check:'UI four-stage scheduling and export only',report,
  realHumanPlayed:false,realWindowsHardwareBenchmark:false,
  humanFairness:'NOT_TESTED'
 },null,2));
 expect(errors).toEqual([]);
});
