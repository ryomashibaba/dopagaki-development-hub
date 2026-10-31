import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const base='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const hold='&g4e7bg=inspect&g4e7bgFrame=hold';
async function shot(page,road,point){
 const v=page.locator('#view');
 await expect(v).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN',{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-point',point);
 await expect(page.locator('#g4e7alPanel')).toBeHidden();
 return {time:await v.getAttribute('data-g4e7bg-time'),
   speed:Number(await v.getAttribute('data-g4e7bg-speed')),
   road:await v.getAttribute('data-g4e7bg-native-road')};
}
test('BK opt-in never creates visuals in regular public/default preview',async({page})=>{
 await page.goto('/drive3d/?g4e7bk=lit-glb');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bk-lit','off',{timeout:90000});
 await page.goto(base);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bk-lit','off');
});
test('BK TRUE exact 18.5s real 122mps camera, visual BJ vs 6 real lit GLB materials',async({page},info)=>{
 test.setTimeout(180000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const view=page.locator('#view');
 await page.goto(base+hold+'&g4e7bgPoint=t1850&g4e7bj=strata');
 const original=await shot(page,'true-pinch','t1850');
 await expect(view).toHaveAttribute('data-g4e7bj-scene','abyssal-strata');
 await view.screenshot({path:info.outputPath('g4e7bk-original-BJ-rejected-122mps-WebGL.png')});
 await page.goto(base+hold+'&g4e7bgPoint=t1850&g4e7bk=lit-glb');
 const newFrame=await shot(page,'true-pinch','t1850');
 expect(newFrame).toEqual(original);
 await expect(view).toHaveAttribute('data-g4e7bk-lit','material-normal-glb2-private-not-approved');
 await expect(view).toHaveAttribute('data-g4e7bk-materials','6');
 await expect(view).toHaveAttribute('data-g4e7bk-original-roads','7');
 await expect(view).toHaveAttribute('data-g4e7bk-original-movers','28');
 await expect(view).toHaveAttribute('data-g4e7bk-art-approval','HOLD');
 await expect(view).toHaveAttribute('data-g4e7bj-scene','off');
 expect(Number(await view.getAttribute('data-g4e7bk-triangles'))).toBeGreaterThan(600);
 expect(newFrame.speed).toBeGreaterThan(100);
 await view.screenshot({path:info.outputPath('g4e7bk-true-LITGLB-new-122mps-WebGL.png')});
 await fs.writeFile(info.outputPath('g4e7bk-provenance-HOLD.json'),
  JSON.stringify({original,newFrame,actualGLB:true,source:'P96 script NOT HUMAN',artApproved:false,errors},null,2));
 expect(errors).toEqual([]);
});
test('BK SWITCH real native 112mps / 126mps on both camera snapshots',async({page},info)=>{
 test.setTimeout(180000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const point of ['t1700','t1850']){
  await page.goto(base+hold+'&g4e7bgRoad=pinch-switch&g4e7bgPoint='+point+'&g4e7bk=lit-glb');
  const frame=await shot(page,'pinch-switch',point);
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bk-lit','material-normal-glb2-private-not-approved');
  await expect(page.locator('#view')).toHaveAttribute('data-g4e7bk-materials','6');
  await page.locator('#view').screenshot({path:info.outputPath('g4e7bk-switch-'+point+'-material-world-WebGL.png')});
  expect(frame.speed).toBeGreaterThan(100);
 }
 expect(errors).toEqual([]);
});
test('BK material city does not replace genuine A/D or human-local JSON provenance',async({page})=>{
 test.setTimeout(130000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'&g4e7bk=lit-glb');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7be-loaded-road','true-pinch',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bk-lit','material-normal-glb2-private-not-approved');
 await expect(page.locator('#g4e7alPanel')).toBeVisible();
 await expect(page.locator('#pause')).toBeEnabled();
 await page.keyboard.down('KeyD');await page.waitForTimeout(500);await page.keyboard.up('KeyD');
 const dl=page.waitForEvent('download');await page.locator('#g4e7alDownload').click();
 const record=JSON.parse(await fs.readFile(await(await dl).path(),'utf8'));
 expect(record.uncommittedCurrentRun.source).toBe('LOCAL_MANUAL_INPUT_NO_P96');
 expect(record.uncommittedCurrentRun.metrics.activeDirectionalSteps).toBeGreaterThan(0);
 expect(record.uncommittedCurrentRun.physicalCourse.researchBCRealContour).toBe(true);
 expect(errors).toEqual([]);
});
