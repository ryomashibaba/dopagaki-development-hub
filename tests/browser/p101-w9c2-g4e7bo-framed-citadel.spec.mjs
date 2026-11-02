import {test,expect} from '@playwright/test';
const base='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const shot='&g4e7bg=inspect&g4e7bgFrame=hold';
async function actual(page,road,point){
 const v=page.locator('#view');
 await expect(v).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN');
 await expect(v).toHaveAttribute('data-g4e7bg-point',point);
 return {speed:await v.getAttribute('data-g4e7bg-speed'),time:await v.getAttribute('data-g4e7bg-time')};
}
test('BO cannot leak into ordinary game or manual BC trials',async({page})=>{
 await page.goto('/drive3d/?g4e7bo=framed');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bo-lit','off',{timeout:90000});
 await page.goto(base);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bo-lit','off',{timeout:90000});
});
test('BO original BN vs new objectively registered full city at same native 240Hz camera',async({page},info)=>{
 test.setTimeout(240000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const road of ['true-pinch','pinch-switch'])for(const point of road==='true-pinch'?['t1850']:['t1700','t1850']){
  const roadParam=road==='pinch-switch'?'&g4e7bgRoad=pinch-switch':'';
  await page.goto(base+shot+roadParam+'&g4e7bgPoint='+point+'&g4e7bn=citadel');
  const before=await actual(page,road,point);
  await page.locator('#view').screenshot({path:info.outputPath('g4e7bo-BN-old-'+road+'-'+point+'.png')});
  await page.goto(base+shot+roadParam+'&g4e7bgPoint='+point+'&g4e7bo=framed');
  const after=await actual(page,road,point);
  expect(after).toEqual(before);
  const v=page.locator('#view');
  await expect(v).toHaveAttribute('data-g4e7bo-lit','original-BN-city-camera-framed-PRIVATE-ART-HOLD');
  await expect(v).toHaveAttribute('data-g4e7bo-art-approval','HOLD');
  await expect(v).toHaveAttribute('data-g4e7bo-real-roads','7');
  await expect(v).toHaveAttribute('data-g4e7bo-real-movers','28');
  expect(Number(await v.getAttribute('data-g4e7bo-triangles'))).toBeGreaterThan(1500);
  expect(Number(await v.getAttribute('data-g4e7bo-after-score'))).toBeGreaterThanOrEqual(Number(await v.getAttribute('data-g4e7bo-before-score'))-.001);
  expect(Number(after.speed)).toBeGreaterThan(100);
  await v.screenshot({path:info.outputPath('g4e7bo-BO-framed-'+road+'-'+point+'.png')});
 }
 expect(errors).toEqual([]);
});
