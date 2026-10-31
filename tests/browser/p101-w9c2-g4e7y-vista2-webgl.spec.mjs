import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7Y R4 true early native 240Hz comparison one vs two chapter skyline replacements',async({page},info)=>{
 test.setTimeout(460000);const records=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const [profile,key] of [['A065','0-65'],['A070','0-7']])
 for(const time of ['t315','t365','t450'])
 for(const variant of ['vista','vista2']){
  const stage='VB-P101-A13-W9C2-G4E7W-BLEND-'+key;
  await page.goto('/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7yEarly='+time+
   '&g4e7yScene='+variant+'&stage='+stage);
  const c=page.locator('#view');
  await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:65000});
  await expect(c).toHaveAttribute('data-g4e7y-scene',variant);
  await expect(c).toHaveAttribute('data-g4e7w-mode','ACTUAL_B48_240HZ_NOT_HUMAN');
  const observation=await page.evaluate(async()=>{
   const d=document.querySelector('#view').dataset,
    name=document.querySelector('#stage').value.endsWith('0-65')?'A065':'A070',
    proof=await(await fetch('../generated/P101_A13_W9C2_G4E7Y_EARLY_240HZ_FRAMES_LOCAL.json')).json(),
    shot=proof.stages[name].frames.find(s=>s.id===d.g4e7yEarly);
   return {time:Number(d.g4e7wTime),speed:Number(d.g4e7wSpeedMps),
    eyeToLip:Number(d.g4e7yEyeToTakeoffMeters),eye:shot.eye,
    yaw:shot.yaw,front:shot.front,
    chapter0Portals:Number(d.g4e7yChapter0Portals),
    chapter1Portals:Number(d.g4e7yChapter1Portals),
    chapter0Wings:Number(d.g4e7yChapter0Wings),
    chapter1Wings:Number(d.g4e7yChapter1Wings),
    originalMachines:proof.stages[name].movingMachines,
    actualRoads:proof.stages[name].actualRoads,
    nativeHz:proof.real240Hz,
    official:proof.officialSlope2Meters};
  });
  expect(observation.nativeHz).toBe(240);expect(observation.originalMachines).toBe(28);
  expect(observation.actualRoads).toBe(7);expect(observation.official).toBe(0);
  expect(observation.chapter0Portals).toBe(0);
  expect(observation.chapter0Wings).toBe(10);
  if(variant==='vista2'){
   expect(observation.chapter1Portals).toBe(0);expect(observation.chapter1Wings).toBe(10);
  }else{
   expect(observation.chapter1Portals).toBe(4);expect(observation.chapter1Wings).toBe(0);
  }
  const filename='g4e7y-r4-'+profile.toLowerCase()+'-'+time+'-'+variant+'.png';
  await c.screenshot({path:info.outputPath(filename)});
  records.push({profile,time,variant,observation,filename});
 }
 for(const profile of ['A065','A070'])for(const time of ['t315','t365','t450']){
  const x=records.filter(r=>r.profile===profile&&r.time===time);
  expect(x.length).toBe(2);
  expect(x[0].observation.eye).toEqual(x[1].observation.eye);
  expect(x[0].observation.front).toEqual(x[1].observation.front);
  expect(x[0].observation.speed).toBe(x[1].observation.speed);
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7y-r4-two-chapter-12view.json'),JSON.stringify({
  schema:'dopagaki.g4e7y-real-two-chapter-exterior-GPU/1',
  records,humanFairness:'HOLD',officialSlope2Meters:0,public:false},null,2));
});
