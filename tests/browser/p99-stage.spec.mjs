import {test,expect} from '@playwright/test';

/** P99 must be an actual B48 different physical course, not a road paint. */
test('P99 authentic variable-width corridor with 12 B51-C machines is independently playable in Chromium',async({page},testInfo)=>{
 test.setTimeout(125000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P99');
 await expect(page.locator('#appStatus')).toContainText('P99 PRESSURE LINES',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#view')).toHaveAttribute('data-hazard-gate-count','36');
 await expect(page.locator('#view')).toHaveAttribute('data-mega-section-count','7');
 await expect(page.locator('#view')).toHaveAttribute('data-arch-portal-count','42');
 await expect(page.locator('#spawn option')).toHaveCount(6);
 await expect(page.locator('#demoRun')).toBeEnabled();
 // P99 and P95 have intentionally identical-width START SEAMS. A start-frame
 // image alone cannot prove a visible difference. Take both at actual t>=12s,
 // once the physical sky-crown corridor is inside its compressed width window.
 await page.locator('#demoSpeed').selectOption('2');
 await page.locator('#demoRun').click();
 await page.waitForFunction(t=>(parseFloat(document.querySelector('#simTime')?.textContent)||0)>=t,12,{timeout:75000});
 await page.locator('#view').screenshot({path:testInfo.outputPath('p99-narrow-crown-12s.png')});
 await page.locator('#demoRun').click();
 await expect(page.locator('#practiceRun')).toBeDisabled();
 const raw=await page.evaluate(async()=>{
  const [d,base,e]=await Promise.all([
   fetch('../generated/P99_PRESSURE_LINES.json').then(x=>x.json()),
   fetch('../generated/P95_VOID_HAZARD_CANDIDATE.json').then(x=>x.json()),
   fetch('../generated/P99_PHYSICAL_TRIAL.json').then(x=>x.json())
  ]);
  const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
  const physicalWidths=d.surfaces.map((s,i)=>{
   const index=16*5,old=base.surfaces[i],src=s.points;
   return {widthAtMiddle:distance(src[index],src[index+4]),
    originalMiddle:distance(old.points[index],old.points[index+4])};
  });
  return {id:d.stageForge.id,physicalWidths,allMovingSame:JSON.stringify(d.movingObstacles)===JSON.stringify(base.movingObstacles),
   human:d.stageForge.humanPlaytest,prior:d.stageForge.priorP96CompletionApplicable,
   proofVerdict:e.verdict,proofMachines:e.activeColliders,proofHuman:e.humanPlaytest};
 });
 expect(raw.id).toBe('VB-P99');
 expect(raw.allMovingSame).toBe(true);
 expect(raw.physicalWidths).toHaveLength(7);
 expect(raw.physicalWidths.every(x=>x.widthAtMiddle<x.originalMiddle*.89)).toBe(true);
 expect(raw.human).toBe('NOT_RUN');expect(raw.prior).toBe(false);
 expect(raw.proofMachines).toBe(12);expect(raw.proofHuman).toBe('NOT_RUN');
 await page.locator('#stage').selectOption('VB-P95');
 await expect(page.locator('#appStatus')).toContainText('P96 VOID BREAKER',{timeout:75000});
 await expect(page.locator('#demoRun')).toBeEnabled();
 await page.locator('#demoSpeed').selectOption('2');
 await page.locator('#demoRun').click();
 await page.waitForFunction(t=>(parseFloat(document.querySelector('#simTime')?.textContent)||0)>=t,12,{timeout:75000});
 await page.locator('#view').screenshot({path:testInfo.outputPath('p99-original-wide-crown-12s.png')});
 await page.locator('#demoRun').click();
 await page.locator('#stage').selectOption('VB-P93');
 await expect(page.locator('#appStatus')).toContainText('P94 VOID BREAKER',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','0');
 expect(errors).toEqual([]);
});

test('P99 native 240Hz spectator physically finishes 7 variable-width surfaces, avoids all 12 live machines, keeps PB unchanged',async({page})=>{
 test.setTimeout(135000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P99');
 await expect(page.locator('#appStatus')).toContainText('P99 PRESSURE LINES',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#demoRun')).toBeEnabled();
 await expect(page.locator('#practiceRun')).toBeDisabled();
 const before=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.locator('#demoSpeed').selectOption('2');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await expect(page.locator('#resultTitle')).toHaveText('DEMO COMPLETE',{timeout:100000});
 await expect(page.locator('#view')).toHaveAttribute('data-run-outcome','finished');
 const after=await page.evaluate(()=>JSON.stringify({...localStorage}));
 expect(after).toBe(before);
 const proof=await page.evaluate(async()=>await(await fetch('../generated/P99_PHYSICAL_TRIAL.json')).json());
 expect(proof.activeColliders).toBe(12);
 expect(proof.scriptedProfileWins).toBeGreaterThanOrEqual(2);
 expect(proof.nativeProfiles.filter(x=>x.status==='SCRIPTED_NATIVE_FULL_PASS').length).toBeGreaterThanOrEqual(2);
 expect(proof.humanPlaytest).toBe('NOT_RUN');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 expect(errors).toEqual([]);
});
