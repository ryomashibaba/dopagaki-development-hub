
import {test,expect} from '@playwright/test';

test('P101 actual selectable 240Hz faster lateral driving is opt-in and leaves P100 intact',async({page})=>{
 test.setTimeout(90000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P101');
 await expect(page.locator('#appStatus')).toContainText('P101 VELOCITY OVERDRIVE',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#view')).toHaveAttribute('data-arch-portal-count','28');
 await expect(page.locator('#view')).toHaveAttribute('data-road-read-stripes','1456');
 await expect(page.locator('#p101Controls')).toBeVisible();
 await expect(page.locator('#demoRun')).toBeDisabled();
 await expect(page.locator('#practiceRun')).toBeDisabled();
 await expect(page.locator('#view')).toHaveAttribute('data-overdrive-profile','OVERDRIVE');
 await page.locator('#p101Profile').selectOption('HYPER');
 await expect(page.locator('#view')).toHaveAttribute('data-overdrive-profile','HYPER');
 await page.keyboard.down('ArrowRight');
 await page.waitForFunction(()=>Number.parseFloat(document.querySelector('#simTime')?.textContent||'0')>1.5,null,{timeout:45000});
 await page.keyboard.up('ArrowRight');
 await expect(page.locator('#speed')).not.toHaveText('44.0');
 await page.locator('#view').screenshot({path:'test-results/p101-real-physical-strong-lateral.png'});
 await page.locator('#stage').selectOption('VB-P100');
 await expect(page.locator('#p101Controls')).toBeHidden();
 await expect(page.locator('#demoRun')).toBeEnabled();
 await expect(page.locator('#view')).toHaveAttribute('data-overdrive-profile','off');
 expect(errors).toEqual([]);
});

test('P101 B4 genuinely reshapes physical hairpins independently from frozen P100, with honest WebGL curve images',async({page},info)=>{
 test.setTimeout(110000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P101');
 await expect(page.locator('#appStatus')).toContainText('P101 VELOCITY OVERDRIVE',{timeout:75000});
 const physical=await page.evaluate(async()=>{
   const [a,b]=await Promise.all(['../generated/P100_TERRAIN_PULSE.json','../generated/P101_VELOCITY_OVERDRIVE.json'].map(async uri=>{
    const resp=await fetch(uri,{cache:'no-store'});if(!resp.ok)throw Error('Missing true B48 stage: '+uri);return resp.json();
   }));
   const mids=a.surfaces.map((s,i)=>Math.hypot(...b.surfaces[i].points[77].map((v,j)=>v-s.points[77][j])));
   const unchangedEnds=a.surfaces.every((s,i)=>[0,30].every(row=>[0,1,2,3,4].every(col=>
      JSON.stringify(b.surfaces[i].points[row*5+col])===JSON.stringify(s.points[row*5+col]))));
   const machines=a.movingObstacles.every((x,i)=>['id','type','collision','size','period','phase','enabled'].every(key=>
      JSON.stringify(x[key])===JSON.stringify(b.movingObstacles[i][key])));
   return {mids,unchangedEnds,machines,roadCount:b.surfaces.length,stations:b.movingObstacles.length,
    curvature:b.stageForge.curvatureAudit};
 });
 expect(physical.roadCount).toBe(7);
 expect(physical.stations).toBe(12);
 expect(physical.unchangedEnds).toBe(true);
 expect(physical.machines).toBe(true);
 expect(physical.mids.filter(d=>d>8).length).toBe(1);
 expect(physical.mids[1]).toBeGreaterThan(8);
 physical.mids.forEach((d,i)=>{if(i!==1)expect(d).toBe(0)});
 expect(physical.curvature).toHaveLength(7);
 for(const [spawn,title] of [['1','sky-crown'],['3','lower-hairpin'],['4','late-surge']]){
  await page.locator('#spawn').selectOption(spawn);
  await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
  await page.locator('#view').screenshot({path:info.outputPath('p101-b4-real-'+title+'.png')});
 }
 expect(errors).toEqual([]);
});
