import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

// Actual Chromium page and real B48/B51-C manual Runner. No autopilot or
// injected fake physics. For speed only, the operator explicitly captures a
// short in-progress interval (NOT a finish, success or human fairness proof).
test('G5-C3 one local page: CONTROL -> ULTRA -> combined JSON download with true snapshots',async({page},info)=>{
 test.setTimeout(150000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/w9c1-pair-session/');
 await expect(page.getByRole('heading',{name:'28m → 14m 比較試走'})).toBeVisible();
 await expect(page.locator('#phase')).toContainText('CONTROL 28m');
 const frame=page.frameLocator('#game');
 await expect(frame.locator('#appStatus')).toContainText('W9-C1 ABYSS DIVE',{timeout:85000});
 await expect(frame.locator('#view')).toHaveAttribute('data-machine-count','28');
 await expect(frame.locator('#spawn')).toHaveValue('0');
 await expect(frame.locator('#p101Profile')).toHaveValue('OVERDRIVE');
 await expect(frame.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#next')).toBeEnabled();
 await page.locator('#next').click();
 await expect(page.locator('#phase')).toContainText('ULTRA 14m',{timeout:20000});
 await expect(frame.locator('#appStatus')).toContainText('W9-C1 ABYSS DIVE',{timeout:85000});
 await expect(frame.locator('#view')).toHaveAttribute('data-w9c1-width','14');
 await expect(frame.locator('#spawn')).toHaveValue('0');
 await expect(page.locator('#save')).toBeEnabled();
 const downloading=page.waitForEvent('download',{timeout:20000});
 await page.locator('#save').click();
 const file=await downloading;
 expect(file.suggestedFilename()).toBe('DOPAGAKI_W9C1_28m_vs_14m_G5C3_COMPARISON.json');
 const json=JSON.parse(await fs.readFile(await file.path(),'utf8'));
 expect(json.schema).toBe('dopagaki.w9c1-paired-human-review/1');
 expect(json.control.stageId).toBe('VB-P101-A13-W9C1-CONTROL');
 expect(json.ultra.stageId).toBe('VB-P101-A13-W9C1-ULTRA');
 expect(json.control.finalStatus).toBe('running-snapshot');
 expect(json.ultra.finalStatus).toBe('running-snapshot');
 expect(json.control.physicsSeconds).toBeGreaterThanOrEqual(0);
 expect(json.ultra.physicsSeconds).toBeGreaterThanOrEqual(0);
 expect(json.comparability.bothStart00).toBe(true);
 expect(json.comparability.bothTerminated).toBe(false);
 expect(json.winner).toBe('UNDETERMINED');
 expect(json.approvedForProduction).toBe(false);
 await expect(page.locator('#summary')).toBeVisible();
 await page.screenshot({path:info.outputPath('w9c1-g5c3-guided-local-workflow.png'),fullPage:true});
 // Untrusted message from the parent itself cannot impersonate the child.
 await page.evaluate(()=>window.postMessage({
   type:'dopagaki.w9c1.g5c3.report/1',stageId:'VB-P101-A13-W9C1-ULTRA',
   report:{schema:'bad'}
  },location.origin));
 await expect(page.locator('#alert')).toBeHidden();
 expect(errors).toEqual([]);
});
