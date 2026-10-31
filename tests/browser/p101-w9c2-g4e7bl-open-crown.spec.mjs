import {test,expect} from '@playwright/test';
const base='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const native='&g4e7bg=inspect&g4e7bgFrame=hold';
async function frame(page,road,point){
 const v=page.locator('#view');
 await expect(v).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN');
 await expect(v).toHaveAttribute('data-g4e7bg-point',point);
 return {time:await v.getAttribute('data-g4e7bg-time'),speed:await v.getAttribute('data-g4e7bg-speed')};
}
test('BL absent in ordinary private preview',async({page})=>{
 await page.goto(base);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bl-lit','off',{timeout:90000});
});
test('BL true and switch genuine 240Hz identical BK2/BL camera WebGL A/B',async({page},info)=>{
 test.setTimeout(210000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const road of ['true-pinch','pinch-switch']){
  for(const point of road==='true-pinch'?['t1850']:['t1700','t1850']){
   const onRoad=road==='true-pinch'?'':'&g4e7bgRoad=pinch-switch';
   await page.goto(base+native+onRoad+'&g4e7bgPoint='+point+'&g4e7bk=lit-glb');
   const bk=await frame(page,road,point);
   await page.locator('#view').screenshot({path:info.outputPath('g4e7bl-BK2-'+road+'-'+point+'.png')});
   await page.goto(base+native+onRoad+'&g4e7bgPoint='+point+'&g4e7bl=open-crown');
   const bl=await frame(page,road,point);
   expect(bl).toEqual(bk);
   const v=page.locator('#view');
   await expect(v).toHaveAttribute('data-g4e7bl-lit','real-sculpted-GLB2-PRIVATE-art-HOLD');
   await expect(v).toHaveAttribute('data-g4e7bl-real-roads','7');
   await expect(v).toHaveAttribute('data-g4e7bl-real-movers','28');
   await expect(v).toHaveAttribute('data-g4e7bl-art-approval','HOLD');
   expect(Number(await v.getAttribute('data-g4e7bl-triangles'))).toBeGreaterThan(1200);
   expect(Number(bl.speed)).toBeGreaterThan(100);
   await v.screenshot({path:info.outputPath('g4e7bl-CROWN-'+road+'-'+point+'.png')});
  }
 }
 expect(errors).toEqual([]);
});
