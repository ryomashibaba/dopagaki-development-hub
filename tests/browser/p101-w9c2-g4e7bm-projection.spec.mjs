import {test,expect} from '@playwright/test';
const base='/drive3d/?g4e7al=manual&g4e7be=roll-deck';
const fixed='&g4e7bg=inspect&g4e7bgFrame=hold';
async function read(page,road,point){
 const v=page.locator('#view');
 await expect(v).toHaveAttribute('data-g4e7be-loaded-road',road,{timeout:90000});
 await expect(v).toHaveAttribute('data-g4e7bg-mode','SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN');
 await expect(v).toHaveAttribute('data-g4e7bg-point',point);
 return {time:await v.getAttribute('data-g4e7bg-time'),speed:await v.getAttribute('data-g4e7bg-speed')};
}
test('BM absent in normal stage and plain BC manual',async({page})=>{
 await page.goto('/drive3d/?g4e7bm=registered');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bm-lit','off',{timeout:90000});
 await page.goto(base);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7bm-lit','off',{timeout:90000});
});
test('BM actual same native speed/camera BK2 vs rejected BL vs camera-registered BM',async({page},info)=>{
 test.setTimeout(230000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const road of ['true-pinch','pinch-switch'])for(const point of road==='true-pinch'?['t1850']:['t1700','t1850']){
  const roadParam=road==='pinch-switch'?'&g4e7bgRoad=pinch-switch':'';
  let reference;
  for(const [label,selector] of [['BK2','g4e7bk=lit-glb'],['BL','g4e7bl=open-crown'],['BM','g4e7bm=registered']]){
   await page.goto(base+fixed+roadParam+'&g4e7bgPoint='+point+'&'+selector);
   const now=await read(page,road,point);
   if(reference)expect(now).toEqual(reference);else reference=now;
   const v=page.locator('#view');
   if(label==='BM'){
    await expect(v).toHaveAttribute('data-g4e7bm-lit','real-native-frustum-registered-PRIVATE-ART-HOLD');
    await expect(v).toHaveAttribute('data-g4e7bm-real-roads','7');
    await expect(v).toHaveAttribute('data-g4e7bm-real-movers','28');
    await expect(v).toHaveAttribute('data-g4e7bm-art-approval','HOLD');
    expect(Number(await v.getAttribute('data-g4e7bm-triangles'))).toBeGreaterThan(1200);
    expect(Number(await v.getAttribute('data-g4e7bm-road-clearance'))).toBeGreaterThanOrEqual(50);
   }
   await v.screenshot({path:info.outputPath('g4e7bm-'+label+'-'+road+'-'+point+'.png')});
  }
 }
 expect(errors).toEqual([]);
});
