import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const base='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const hold='&g4e7bg=inspect&g4e7bgFrame=hold';
async function shot(page,road,point){
 const v=page.locator('#view');
 await expect(v).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN',{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-point',point);
 await expect(page.locator('#pause')).toBeDisabled();
 await expect(page.locator('#g4e7alPanel')).toBeHidden();
 return {speed:Number(await v.getAttribute('data-g4e7bg-speed')),time:await v.getAttribute('data-g4e7bg-time'),road:await v.getAttribute('data-g4e7bg-native-road')};
}
test('BH privacy gate and real manual route remain isolated',async({page})=>{
 await page.goto('/drive3d/?g4e7bh=open-horizon');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bh-scene','off',{timeout:90000});
 await page.goto(base);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bh-scene','off');
});
test('BH authentic TRUE camera 122mps+ controlled WebGL A/B/C',async({page},info)=>{
 test.setTimeout(180000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const v=page.locator('#view'),point='t1850';
 await page.goto(base+hold+'&g4e7bgPoint='+point);
 const control=await shot(page,'true-pinch',point);
 await v.screenshot({path:info.outputPath('g4e7bh-true-control-WebGL.png')});
 await page.goto(base+hold+'&g4e7bgPoint='+point+'&g4e7bf=sky-fracture');
 const bf=await shot(page,'true-pinch',point);expect(bf).toEqual(control);
 await expect(v).toHaveAttribute('data-g4e7bf-scene','sky-fracture');
 await v.screenshot({path:info.outputPath('g4e7bh-true-rejected-BF-WebGL.png')});
 await page.goto(base+hold+'&g4e7bgPoint='+point+'&g4e7bh=open-horizon');
 const bh=await shot(page,'true-pinch',point);expect(bh).toEqual(control);
 await expect(v).toHaveAttribute('data-g4e7bh-scene','open-horizon');
 await expect(v).toHaveAttribute('data-g4e7bh-monuments','4');
 await expect(v).toHaveAttribute('data-g4e7bh-sky-openings','8');
 await expect(v).toHaveAttribute('data-g4e7bh-quarters','16');
 await expect(v).toHaveAttribute('data-g4e7bh-physics-untouched','true');
 await expect(v).toHaveAttribute('data-machine-count','28');
 expect(Number(await v.getAttribute('data-g4e7bh-triangles'))).toBeGreaterThan(1800);
 expect(bh.speed).toBeGreaterThan(100);
 await v.screenshot({path:info.outputPath('g4e7bh-true-open-horizon-WebGL.png')});
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7bh-native-same-pose.json'),JSON.stringify({control,bf,bh,realHuman:false,artApproved:false,errors},null,2));
});
test('BH SWITCH authentic native 17.0 and 18.5 second camera',async({page},info)=>{
 test.setTimeout(180000);
 for(const point of ['t1700','t1850']){
  await page.goto(base+hold+'&g4e7bgRoad=pinch-switch&g4e7bgPoint='+point+'&g4e7bh=open-horizon');
  const result=await shot(page,'pinch-switch',point);
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7BC-PINCH-SWITCH-ROLLDECK');
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bh-scene','open-horizon');
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bh-physics-untouched','true');
  expect(result.speed).toBeGreaterThan(100);
  await page.locator('#view').screenshot({path:info.outputPath('g4e7bh-switch-'+point+'-WebGL.png')});
 }
});
test('BH actual A/D start00 keyboard and JSON never disguised P96',async({page})=>{
 test.setTimeout(135000);
 await page.goto(base+'&g4e7bh=open-horizon');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bh-scene','open-horizon');
 await expect(page.locator('#g4e7alPanel')).toBeVisible();
 await expect(page.locator('#pause')).toBeEnabled();
 await page.keyboard.down('KeyD');await page.waitForTimeout(480);await page.keyboard.up('KeyD');
 const dl=page.waitForEvent('download');await page.locator('#g4e7alDownload').click();
 const result=JSON.parse(await fs.readFile(await(await dl).path(),'utf8'));
 expect(result.uncommittedCurrentRun.source).toBe('LOCAL_MANUAL_INPUT_NO_P96');
 expect(result.uncommittedCurrentRun.metrics.activeDirectionalSteps).toBeGreaterThan(0);
 expect(result.uncommittedCurrentRun.physicalCourse.researchBCRealContour).toBe(true);
});
