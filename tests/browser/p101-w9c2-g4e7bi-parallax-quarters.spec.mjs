import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const base='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const native='&g4e7bg=inspect&g4e7bgFrame=hold';
async function frozen(page,road,point){
 const v=page.locator('#view');
 await expect(v).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN',{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-point',point);
 await expect(page.locator('#g4e7alPanel')).toBeHidden();
 return {time:await v.getAttribute('data-g4e7bg-time'),speed:Number(await v.getAttribute('data-g4e7bg-speed')),
  physicsRoad:await v.getAttribute('data-g4e7bg-native-road')};
}
test('BI cannot activate without authentic BC private localhost opt-in',async({page})=>{
 await page.goto('/drive3d/?g4e7bi=parallax');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bi-scene','off',{timeout:90000});
 await page.goto(base);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bi-scene','off');
});
test('BI exact TRUE 18.5s 122mps native WebGL compare BH and BI',async({page},info)=>{
 test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const view=page.locator('#view'),point='t1850';
 await page.goto(base+native+'&g4e7bgPoint='+point+'&g4e7bh=open-horizon');
 const bh=await frozen(page,'true-pinch',point);
 await expect(view).toHaveAttribute('data-g4e7bh-scene','open-horizon');
 await view.screenshot({path:info.outputPath('g4e7bi-true-BH-prior-WebGL.png')});
 await page.goto(base+native+'&g4e7bgPoint='+point+'&g4e7bi=parallax');
 const bi=await frozen(page,'true-pinch',point);
 expect(bi).toEqual(bh);
 await expect(view).toHaveAttribute('data-g4e7bi-scene','parallax-city');
 await expect(view).toHaveAttribute('data-g4e7bh-scene','off');
 await expect(view).toHaveAttribute('data-g4e7bi-sites','4');
 await expect(view).toHaveAttribute('data-g4e7bi-air-bays','48');
 await expect(view).toHaveAttribute('data-g4e7bi-quarters','28');
 await expect(view).toHaveAttribute('data-g4e7bi-physics-untouched','true');
 await expect(view).toHaveAttribute('data-machine-count','28');
 expect(bi.speed).toBeGreaterThan(100);
 await view.screenshot({path:info.outputPath('g4e7bi-true-visible-layered-city-WebGL.png')});
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7bi-native-same-frame.json'),JSON.stringify({bh,bi,source:'240Hz P96 NOT HUMAN',visualQuality:'UNREVIEWED',errors},null,2));
});
test('BI both SWITCH genuine 17.0 and 18.5s preserved camera data',async({page},info)=>{
 test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const point of ['t1700','t1850']){
  await page.goto(base+native+'&g4e7bgRoad=pinch-switch&g4e7bgPoint='+point+'&g4e7bi=parallax');
  const shot=await frozen(page,'pinch-switch',point);
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bi-scene','parallax-city');
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bi-physics-untouched','true');
  expect(shot.speed).toBeGreaterThan(100);
  await page.locator('#view').screenshot({path:info.outputPath('g4e7bi-switch-'+point+'-parallax-WebGL.png')});
 }
 expect(errors).toEqual([]);
});
test('BI genuine A/D manual 240Hz from original start, JSON directly local',async({page})=>{
 test.setTimeout(135000);
 await page.goto(base+'&g4e7bi=parallax');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bi-scene','parallax-city');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bg-mode','off');
 await expect(page.locator('#g4e7alPanel')).toBeVisible();
 await expect(page.locator('#pause')).toBeEnabled();
 await page.keyboard.down('KeyA');await page.waitForTimeout(520);await page.keyboard.up('KeyA');
 const dl=page.waitForEvent('download');await page.locator('#g4e7alDownload').click();
 const result=JSON.parse(await fs.readFile(await(await dl).path(),'utf8'));
 expect(result.uncommittedCurrentRun.source).toBe('LOCAL_MANUAL_INPUT_NO_P96');
 expect(result.uncommittedCurrentRun.metrics.activeDirectionalSteps).toBeGreaterThan(0);
 expect(result.uncommittedCurrentRun.physicalCourse.researchBCRealContour).toBe(true);
});
