import {test,expect} from '@playwright/test';

test('P100 is a genuinely reshaped optional WebGL2 road candidate, real spectator 7/7 acceptance only after independently proven native finish',async({page},testInfo)=>{
 test.setTimeout(90000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P100');
 await expect(page.locator('#appStatus')).toContainText('P100 TERRAIN PULSE',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#view')).toHaveAttribute('data-arch-portal-count','28');
 await expect(page.locator('#view')).toHaveAttribute('data-road-read-stripes','1456');
 await expect(page.locator('#view')).toHaveAttribute('data-road-read-bars','266');
 await expect(page.locator('#demoRun')).toBeEnabled();
 const doc=await page.evaluate(async()=>{
  const [a,b]=await Promise.all([
   fetch('../generated/P100_TERRAIN_PULSE.json').then(r=>r.json()),
   fetch('../generated/P99_PRESSURE_LINES.json').then(r=>r.json())
  ]);
  const changedMeters=Math.max(...[6,9,12,15,18,21,24].map(row=>{
   const old=b.surfaces[0].points[row*5+2],current=a.surfaces[0].points[row*5+2];
   return Math.hypot(...current.map((x,i)=>x-old[i]));
  }));
  return {stage:a.stageForge.id,changedMeters,
   machinesEqual:JSON.stringify(a.movingObstacles)===JSON.stringify(b.movingObstacles),
   status:a.stageForge.fullStartToFinish,human:a.stageForge.humanPlaytest};
 });
 expect(doc.stage).toBe('VB-P100');
 expect(doc.changedMeters).toBeGreaterThan(5);
 expect(doc.machinesEqual).toBe(true);
 expect(doc.status).toBe('P100_NATIVE_240HZ_12_ACTIVE_TWO_PROFILE_FINISH_VERIFIED');
 expect(doc.human).toBe('NOT_RUN');
 await page.locator('#view').screenshot({path:testInfo.outputPath('p100-real-webgl-initial.png')});
 expect(errors).toEqual([]);
});

test('P100 near-soft native spectator physically finishes 7/7 with 12 active machines, no personal-best writes',async({page},testInfo)=>{
 test.setTimeout(140000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P100');
 await expect(page.locator('#appStatus')).toContainText('P100 TERRAIN PULSE',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 const before=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.locator('#demoSpeed').selectOption('2');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await page.waitForFunction(()=>Number.parseFloat(document.querySelector('#simTime')?.textContent||'0')>12,null,{timeout:75000});
 // The previous full-size spectator caption obscured machine warnings.
 const overlaps=await page.evaluate(()=>{
   const a=document.querySelector('#demoBanner'),b=document.querySelector('#machineCue');
   if(a.hidden||b.hidden)return false;
   const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();
   return x.left<y.right&&x.right>y.left&&x.top<y.bottom&&x.bottom>y.top;
 });
 expect(overlaps,'spectator overlay must not obscure B51-C warning').toBe(false);
 const chapterClash=await page.evaluate(()=>{
   const a=document.querySelector('.righttag').getBoundingClientRect();
   const b=document.querySelector('#chapterHud').getBoundingClientRect();
   return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
 });
 expect(chapterClash,'stage heading must not overlap dev caution').toBe(false);
 await page.locator('#view').screenshot({path:testInfo.outputPath('p100-midcourse-real-12s.png')});
 await expect(page.locator('#resultTitle')).toHaveText('DEMO COMPLETE',{timeout:100000});
 await expect(page.locator('#view')).toHaveAttribute('data-run-outcome','finished');
 const after=await page.evaluate(()=>JSON.stringify({...localStorage}));
 expect(after).toBe(before);
 await page.locator('#view').screenshot({path:testInfo.outputPath('p100-completed-real-webgl.png')});
 expect(errors).toEqual([]);
});
