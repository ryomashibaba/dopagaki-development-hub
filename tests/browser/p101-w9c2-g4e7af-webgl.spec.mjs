import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const stage='VB-P101-A13-W9C2-G4E7AD-APPROACH-ARC';
test('AF is hidden unless private 240Hz camera and explicit flags',async({page})=>{
 await page.goto('/drive3d/?g4e7af=on&g4e7afScene=citadel&stage='+stage);
 await expect(page.locator('#stage option[value="'+stage+'"]')).toHaveCount(0);
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7af-scene','off');
});
test('AF versus rejected AE: genuine WebGL 240Hz same camera and true B48, no ghosts',async({page},info)=>{
 test.setTimeout(480000);
 const errors=[],records=[];page.on('pageerror',e=>errors.push(e.message));
 for(const point of ['t315','t365','t415','t450']){
  let baseline=null;
  for(const [scene,params] of [
   ['ae','g4e7aeScene=rift'],
   ['af','g4e7aeScene=legacy&g4e7af=on&g4e7afScene=citadel']
  ]){
   await page.goto('/drive3d/?g4e7ad=on&g4e7adFrame=hold&g4e7adScene=clear'+
    '&g4e7ae=on&g4e7adPoint='+point+'&stage='+stage+'&'+params);
   const canvas=page.locator('#view');
   await expect(page.locator('#appStatus')).toContainText('G4E-7AD LOCAL',{timeout:90000});
   await expect(canvas).toHaveAttribute('data-g4e7ad-mode','ACTUAL_240HZ_R2_NATIVE_CAMERA_HOLD');
   await expect(canvas).toHaveAttribute('data-g4e7af-scene',scene==='af'?'citadel':'off');
   const meta=await page.evaluate(async()=>{
    const c=document.querySelector('#view'),d=c.dataset,
     doc=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_APPROACH_ARC_LOCAL_TRIAL.json')).json(),
     evidence=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_240HZ_FRAMES_LOCAL.json')).json(),
     frame=evidence.stages['approach-arc'].frames.find(x=>x.id===d.g4e7adPoint);
    return {physicsHz:evidence.physicsHz,roadCount:doc.surfaces.length,
     hazards:doc.movingObstacles.length,gap:doc.surfaces[0].voidLongitudinalCells,
     source:frame.source,time:frame.timeSeconds,eye:frame.eye,
     front:frame.front,yaw:frame.yaw,speedMps:frame.speedMps,
     scene:d.g4e7afScene,afDistricts:Number(d.g4e7afDistricts),
     afVoids:Number(d.g4e7afAtriumHoles),afLight:Number(d.g4e7afLitShear),
     afTriangles:Number(d.g4e7afTriangles),afPhysical:d.g4e7afPhysicsPreserved==='true',
     aeBanks:Number(d.g4e7aeBanks),aeTriangles:Number(d.g4e7aeTriangles),
     officialMeters:evidence.certifiedSlope2Meters};
   });
   expect(meta.physicsHz).toBe(240);expect(meta.roadCount).toBe(7);
   expect(meta.hazards).toBe(28);expect(meta.gap).toEqual([52]);
   expect(meta.source).toBe('ACTUAL_240HZ_START00_P96_NOT_HUMAN');
   expect(meta.speedMps).toBeGreaterThan(52);
   expect(meta.officialMeters).toBe(0);
   expect(meta.afPhysical).toBe(true);
   const camera={time:meta.time,eye:meta.eye,front:meta.front,yaw:meta.yaw,speed:meta.speedMps};
   if(scene==='ae'){
    baseline=camera;expect(meta.aeBanks).toBe(2);expect(meta.afDistricts).toBe(0);
   }else{
    expect(camera).toEqual(baseline);
    expect(meta.afDistricts).toBe(8);expect(meta.afVoids).toBeGreaterThan(65);
    expect(meta.afLight).toBeGreaterThan(45);expect(meta.afTriangles).toBeGreaterThan(1500);
    expect(meta.aeBanks).toBe(0);expect(meta.aeTriangles).toBe(0);
   }
   const name='g4e7af-'+point+'-'+scene+'.png';
   await canvas.screenshot({path:info.outputPath(name)});
   records.push({file:name,meta});
  }
 }
 expect(records).toHaveLength(8);expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7af-true-WebGL-8-scenes.json'),
  JSON.stringify({schema:'dopagaki.g4e7af-art-research/1',records,
   physicsUnchanged:true,certifiedSlope2Meters:0,
   artApproved:false,humanApproved:false,published:false},null,2));
});
