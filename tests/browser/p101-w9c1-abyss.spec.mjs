import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('W9-C1 control versus ultra: true B48 WebGL skins and independent HOLD records',async({page},info)=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const physical={};const imgs=[];
 for(const [kind,id,nominal] of [
  ['control','VB-P101-A13-W9C1-CONTROL',28],
  ['ultra','VB-P101-A13-W9C1-ULTRA',14]
 ]){
  await page.goto('/drive3d/?stage='+id);
  await expect(page.locator('#stage')).toHaveValue(id);
  await expect(page.locator('#appStatus')).toContainText('W9-C1 ABYSS DIVE',{timeout:90000});
  await expect(page.locator('#view')).toHaveAttribute('data-w9c1-width',String(nominal));
  await expect(page.locator('#view')).toHaveAttribute('data-w9c1-isolated','true');
  await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#w9c1TrialWarning')).toBeVisible();
  await expect(page.locator('#demoRun')).toBeDisabled();
  await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
  const result=await page.evaluate(async({kind})=>{
   const [trial,gold]=await Promise.all([
    fetch('../generated/P101_A13_W9C1_'+kind.toUpperCase()+'_TRIAL.json').then(r=>r.json()),
    fetch('../generated/P101_A13_W7_GAMEPLAY.json').then(r=>r.json())
   ]);
   const a=trial.surfaces[0],b=gold.surfaces[0],row=17;
   const len=(x,y)=>Math.hypot(...x.map((v,k)=>v-y[k]));
   return {roadWidthAt340Meters:len(a.points[row*5],a.points[row*5+4]),
    originalWidthAt340Meters:len(b.points[row*5],b.points[row*5+4]),
    otherSurfacesEqual:JSON.stringify(trial.surfaces.slice(1))===JSON.stringify(gold.surfaces.slice(1)),
    movingBodiesEqual:JSON.stringify(trial.movingObstacles)===JSON.stringify(gold.movingObstacles),
    centerlineEqual:a.points.every((p,j)=>j%5!==2||p.every((v,k)=>v===b.points[j][k])),
    originalSpawnsEqual:JSON.stringify(trial.spawns.slice(0,6))===JSON.stringify(gold.spawns),
    recordStageId:trial.stageForge.recordStageId,productionPromoted:trial.stageForge.productionPromoted,
    visualsFromPhysicalRoad:true};
  },{kind});
  expect(result.roadWidthAt340Meters).toBeCloseTo(nominal,1);
  expect(result.originalWidthAt340Meters).toBeGreaterThan(70);
  expect(result.otherSurfacesEqual).toBe(true);
  expect(result.movingBodiesEqual).toBe(true);
  expect(result.centerlineEqual).toBe(true);
  expect(result.originalSpawnsEqual).toBe(true);
  expect(result.recordStageId).toBe(id);
  expect(result.productionPromoted).toBe(false);
  physical[kind]=result;
  await page.locator('#spawn').selectOption('7'); // isolated 320m visual preview; never real entry-speed proof
  await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
  await page.locator('#view').screenshot({path:info.outputPath('w9c1-'+kind+'-core-real-webgl.png')});
  imgs.push('w9c1-'+kind+'-core-real-webgl.png');
 }
 expect(physical.control.roadWidthAt340Meters).toBeGreaterThan(physical.ultra.roadWidthAt340Meters+13);
 await fs.writeFile(info.outputPath('w9c1-browser-physical-width-audit.json'),JSON.stringify({
  schema:'dopagaki.w9c1.actual-browser-b48-comparison/1',
  source:'LIVE_BROWSER_FETCH_AND_WEBGL_SCREENSHOTS_NOT_HUMAN_PLAYTEST',
  physical,images:imgs,forwardNoticeSeconds:'UNMEASURED',humanFairness:'HOLD'},null,2));
 expect(errors).toEqual([]);
});
