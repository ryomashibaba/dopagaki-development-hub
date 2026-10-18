import {test,expect} from '@playwright/test';

test('P100 is a genuinely reshaped optional WebGL2 road candidate, no fake spectator completion',async({page},testInfo)=>{
 test.setTimeout(90000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P100');
 await expect(page.locator('#appStatus')).toContainText('P100 TERRAIN PULSE',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#demoRun')).toBeDisabled();
 const doc=await page.evaluate(async()=>{
  const [a,b]=await Promise.all([
   fetch('../generated/P100_TERRAIN_PULSE.json').then(r=>r.json()),
   fetch('../generated/P99_PRESSURE_LINES.json').then(r=>r.json())
  ]);
  const old=b.surfaces[0].points[12*5+2],current=a.surfaces[0].points[12*5+2];
  return {stage:a.stageForge.id,changedMeters:Math.hypot(...current.map((x,i)=>x-old[i])),
   machinesEqual:JSON.stringify(a.movingObstacles)===JSON.stringify(b.movingObstacles),
   status:a.stageForge.fullStartToFinish,human:a.stageForge.humanPlaytest};
 });
 expect(doc.stage).toBe('VB-P100');
 expect(doc.changedMeters).toBeGreaterThan(5);
 expect(doc.machinesEqual).toBe(true);
 expect(doc.status).toBe('NOT_VERIFIED_P100');
 expect(doc.human).toBe('NOT_RUN');
 await page.locator('#view').screenshot({path:testInfo.outputPath('p100-real-webgl-initial.png')});
 expect(errors).toEqual([]);
});
