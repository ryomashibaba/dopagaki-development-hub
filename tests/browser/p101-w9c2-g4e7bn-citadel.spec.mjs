import {test,expect} from '@playwright/test';
const base='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const fixed='&g4e7bg=inspect&g4e7bgFrame=hold';
async function sample(page,road,point){
 const v=page.locator('#view');
 await expect(v).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN');
 await expect(v).toHaveAttribute('data-g4e7bg-point',point);
 return {time:await v.getAttribute('data-g4e7bg-time'),speed:await v.getAttribute('data-g4e7bg-speed')};
}
test('BN cannot be loaded without real private BC road',async({page})=>{
 await page.goto('/drive3d/?g4e7bn=citadel');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bn-lit','off',{timeout:90000});
 await page.goto(base);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bn-lit','off',{timeout:90000});
});
test('BN native art compare BM curved-tube REJECT versus inhabited city on same camera',async({page},info)=>{
 test.setTimeout(240000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const road of ['true-pinch','pinch-switch']){
  for(const point of road==='true-pinch'?['t1850']:['t1700','t1850']){
   const roadKey=road==='pinch-switch'?'&g4e7bgRoad=pinch-switch':'';
   await page.goto(base+fixed+roadKey+'&g4e7bgPoint='+point+'&g4e7bm=registered');
   const old=await sample(page,road,point);
   await page.locator('#view').screenshot({path:info.outputPath('g4e7bn-BM-REJECT-'+road+'-'+point+'.png')});
   await page.goto(base+fixed+roadKey+'&g4e7bgPoint='+point+'&g4e7bn=citadel');
   const modern=await sample(page,road,point);
   expect(modern).toEqual(old);
   const v=page.locator('#view');
   await expect(v).toHaveAttribute('data-g4e7bn-lit','one-inhabited-city-GLB2-private-ART-HOLD');
   await expect(v).toHaveAttribute('data-g4e7bn-real-roads','7');
   await expect(v).toHaveAttribute('data-g4e7bn-real-movers','28');
   await expect(v).toHaveAttribute('data-g4e7bn-art-approval','HOLD');
   expect(Number(await v.getAttribute('data-g4e7bn-triangles'))).toBeGreaterThan(1500);
   expect(Number(modern.speed)).toBeGreaterThan(100);
   await v.screenshot({path:info.outputPath('g4e7bn-CITADEL-'+road+'-'+point+'.png')});
  }
 }
 expect(errors).toEqual([]);
});
