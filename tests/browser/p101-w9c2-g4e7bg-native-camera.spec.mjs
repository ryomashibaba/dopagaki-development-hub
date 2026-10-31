import {test,expect} from '@playwright/test';
const root='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const inspect='&g4e7bg=inspect&g4e7bgFrame=hold';
async function checkReadOnly(page,road,point){
 const view=page.locator('#view');
 await expect(view).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(view).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN',{timeout:90000});
 await expect(view).toHaveAttribute('data-g4e7bg-point',point);
 await expect(view).toHaveAttribute('data-g4e7al-mode','BG-read-only-native-P96-NOT-human');
 await expect(page.locator('#g4e7alPanel')).toBeHidden();
 await expect(page.locator('#pause')).toBeDisabled();
 await expect(page.locator('#restart')).toBeDisabled();
 await expect(page.locator('#retryRun')).toBeDisabled();
 await expect(page.locator('#stage')).toBeDisabled();
 await expect(page.locator('#appStatus')).toContainText('NOT HUMAN');
 const speed=Number(await view.getAttribute('data-g4e7bg-speed'));
 const time=Number(await view.getAttribute('data-g4e7bg-time'));
 expect(speed).toBeGreaterThan(85);
 expect(time).toBeGreaterThanOrEqual(point==='t1850'?18.5:point==='t1700'?17:15);
 return {speed,time,road:await view.getAttribute('data-g4e7bg-native-road')};
}
test('BG cannot spoof private camera inspector with ordinary stage or BE manual run',async({page})=>{
 await page.goto('/drive3d/?g4e7bg=inspect&g4e7bgFrame=hold&g4e7bgPoint=t1850');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bg-mode','off',{timeout:90000});
 await page.goto(root);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bg-mode','off');
 await expect(page.locator('#g4e7alPanel')).toBeVisible();
 await expect(page.locator('#pause')).toBeEnabled();
});
test('BG A/B EXACT 18.5s authentic 240Hz camera on BC true, no human false PASS',async({page},info)=>{
 test.setTimeout(200000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(root+inspect+'&g4e7bgPoint=t1850');
 const baseline=await checkReadOnly(page,'true-pinch','t1850');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bf-scene','off');
 await page.locator('#view').screenshot({path:info.outputPath('g4e7bg-BC-real-18s5-original-wall-WebGL.png')});
 await page.keyboard.press('Space');await page.keyboard.press('KeyR');
 await expect(page.locator('#pause')).toBeDisabled();
 await page.goto(root+inspect+'&g4e7bgPoint=t1850&g4e7bf=sky-fracture');
 const fracture=await checkReadOnly(page,'true-pinch','t1850');
 expect(fracture).toEqual(baseline);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bf-scene','sky-fracture');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bf-non-collision','true');
 await page.locator('#view').screenshot({path:info.outputPath('g4e7bg-BC-real-18s5-fracture-WebGL.png')});
 expect(errors).toEqual([]);
});
test('BG SWITCH native 17s and 18.5s authentic road2 with identical B48/B51',async({page},info)=>{
 test.setTimeout(200000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const point of ['t1700','t1850']){
  await page.goto(root+inspect+'&g4e7bgRoad=pinch-switch&g4e7bgPoint='+point+'&g4e7bf=sky-fracture');
  const shot=await checkReadOnly(page,'pinch-switch',point);
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7BC-PINCH-SWITCH-ROLLDECK');
  await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bf-scene','sky-fracture');
  await page.locator('#view').screenshot({path:info.outputPath('g4e7bg-switch-'+point+'-real240Hz-WebGL.png')});
  expect(shot.speed).toBeGreaterThan(85);
 }
 expect(errors).toEqual([]);
});
