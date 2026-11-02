import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const root='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const frozen='&g4e7bg=inspect&g4e7bgFrame=hold';
async function shot(page,road,point){
 const cv=page.locator('#view');
 await expect(cv).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(cv).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN',{timeout:90000});
 await expect(cv).toHaveAttribute('data-g4e7bg-point',point);
 await expect(page.locator('#g4e7alPanel')).toBeHidden();
 return {speed:Number(await cv.getAttribute('data-g4e7bg-speed')),
  time:await cv.getAttribute('data-g4e7bg-time'),road:await cv.getAttribute('data-g4e7bg-native-road')};
}
test('BJ private real BC gate cannot be spoofed by public-like or normal input',async({page})=>{
 await page.goto('/drive3d/?g4e7bj=strata');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bj-scene','off',{timeout:90000});
 await page.goto(root);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bj-scene','off');
});
test('BJ vs BI TRUE authentic 18.5s 122mps same B48 and chase camera images',async({page},info)=>{
 test.setTimeout(180000);const errs=[];page.on('pageerror',e=>errs.push(e.message));
 const v=page.locator('#view');
 await page.goto(root+frozen+'&g4e7bgPoint=t1850&g4e7bi=parallax');
 const old=await shot(page,'true-pinch','t1850');
 await expect(v).toHaveAttribute('data-g4e7bi-scene','parallax-city');
 await v.screenshot({path:info.outputPath('g4e7bj-true-BI-old-122mps-WebGL.png')});
 await page.goto(root+frozen+'&g4e7bgPoint=t1850&g4e7bj=strata');
 const fresh=await shot(page,'true-pinch','t1850');
 expect(fresh).toEqual(old);
 await expect(v).toHaveAttribute('data-g4e7bj-scene','abyssal-strata');
 await expect(v).toHaveAttribute('data-g4e7bi-scene','off');
 await expect(v).toHaveAttribute('data-g4e7bj-districts','4');
 await expect(v).toHaveAttribute('data-g4e7bj-atriums','32');
 await expect(v).toHaveAttribute('data-g4e7bj-non-collision','true');
 await expect(v).toHaveAttribute('data-machine-count','28');
 expect(fresh.speed).toBeGreaterThan(100);
 await v.screenshot({path:info.outputPath('g4e7bj-true-ABYSSAL-new-122mps-WebGL.png')});
 await fs.writeFile(info.outputPath('g4e7bj-source-true-hold.json'),
  JSON.stringify({old,fresh,source:'P96 fixed scripted NOT human',artApproval:'HOLD',errors:errs},null,2));
 expect(errs).toEqual([]);
});
test('BJ real 17s and 18.5s SWITCH camera both still road-visible',async({page},info)=>{
 test.setTimeout(185000);
 for(const point of ['t1700','t1850']){
  await page.goto(root+frozen+'&g4e7bgRoad=pinch-switch&g4e7bgPoint='+point+'&g4e7bj=strata');
  const frame=await shot(page,'pinch-switch',point);
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7BC-PINCH-SWITCH-ROLLDECK');
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bj-scene','abyssal-strata');
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bj-non-collision','true');
  await page.locator('#view').screenshot({path:info.outputPath('g4e7bj-switch-'+point+'-ABYSSAL-WebGL.png')});
  expect(frame.speed).toBeGreaterThan(100);
 }
});
test('BJ no P96 injection into human A/D manual JSON',async({page})=>{
 test.setTimeout(130000);
 await page.goto(root+'&g4e7bj=strata');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bj-scene','abyssal-strata');
 await expect(page.locator('#g4e7alPanel')).toBeVisible();
 await expect(page.locator('#pause')).toBeEnabled();
 await page.keyboard.down('KeyA');await page.waitForTimeout(480);await page.keyboard.up('KeyA');
 const dl=page.waitForEvent('download');await page.locator('#g4e7alDownload').click();
 const record=JSON.parse(await fs.readFile(await(await dl).path(),'utf8'));
 expect(record.uncommittedCurrentRun.source).toBe('LOCAL_MANUAL_INPUT_NO_P96');
 expect(record.uncommittedCurrentRun.metrics.activeDirectionalSteps).toBeGreaterThan(0);
 expect(record.uncommittedCurrentRun.physicalCourse.researchBCRealContour).toBe(true);
});
