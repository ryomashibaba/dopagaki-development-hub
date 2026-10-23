import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const stage='VB-P101-A13-W9C2-G4E7AD-APPROACH-ARC';
test('AE canyon is invisible without full loopback native-frame opt-in',async({page})=>{
 await page.goto('/drive3d/?g4e7ae=on&g4e7aeScene=rift&stage='+stage);
 await expect(page.locator('#stage option[value="'+stage+'"]')).toHaveCount(0);
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7ae-scene','off');
});
test('AE actually REPLACES legacy blocks; same native camera, physics and real WebGL image',async({page},info)=>{
 test.setTimeout(480000);
 const errors=[],records=[];page.on('pageerror',e=>errors.push(e.message));
 for(const point of ['t315','t365','t415','t450','t515']){
  let legacy=null;
  for(const scene of ['legacy','rift']){
   await page.goto('/drive3d/?g4e7ad=on&g4e7adFrame=hold&g4e7adScene=clear'+
     '&g4e7ae=on&g4e7aeScene='+scene+'&g4e7adPoint='+point+'&stage='+stage);
   const canvas=page.locator('#view');
   await expect(page.locator('#appStatus')).toContainText('G4E-7AD LOCAL',{timeout:90000});
   await expect(page.locator('#stage')).toHaveValue(stage);
   await expect(canvas).toHaveAttribute('data-g4e7ad-mode','ACTUAL_240HZ_R2_NATIVE_CAMERA_HOLD');
   await expect(canvas).toHaveAttribute('data-g4e7ae-scene',scene);
   await expect(canvas).toHaveAttribute('data-g4e7ae-replaces-legacy',String(scene==='rift'));
   const metadata=await page.evaluate(async()=>{
    const d=document.querySelector('#view').dataset,
      stage=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_APPROACH_ARC_LOCAL_TRIAL.json')).json(),
      proof=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_240HZ_FRAMES_LOCAL.json')).json(),
      shot=proof.stages['approach-arc'].frames.find(x=>x.id===d.g4e7adPoint);
    return {
     scene:d.g4e7aeScene,
     replaced:d.g4e7aeReplacesLegacy==='true',
     banks:Number(d.g4e7aeBanks),folds:Number(d.g4e7aeFolds),
     voids:Number(d.g4e7aeVoids),triangles:Number(d.g4e7aeTriangles),
     clearance:Number(d.g4e7aeClearance),nonCollision:d.g4e7aeNonCollision==='true',
     oldPortalCount:Number(d.archPortalCount),
     realRoads:stage.surfaces.length,hazards:stage.movingObstacles.length,
     realGap:stage.surfaces[0].voidLongitudinalCells,
     stageStatus:stage.stageForge.g4e7acR2Study.publish,
     proofHz:proof.physicsHz,officialMeters:proof.certifiedSlope2Meters,
     shotSource:shot.source,time:Number(d.g4e7adTime),speed:Number(d.g4e7adSpeedMps),
     pose:shot.pose,yaw:shot.yaw,eye:shot.eye,front:shot.front
    };
   });
   expect(metadata.realRoads).toBe(7);
   expect(metadata.hazards).toBe(28);
   expect(metadata.realGap).toEqual([52]);
   expect(metadata.stageStatus).toBe('HOLD');
   expect(metadata.proofHz).toBe(240);
   expect(metadata.officialMeters).toBe(0);
   expect(metadata.shotSource).toBe('ACTUAL_240HZ_START00_P96_NOT_HUMAN');
   expect(metadata.speed).toBeGreaterThan(52);
   expect(metadata.nonCollision).toBe(true);
   const preserved={time:metadata.time,speed:metadata.speed,pose:metadata.pose,
     yaw:metadata.yaw,eye:metadata.eye,front:metadata.front};
   if(scene==='legacy'){
    legacy=preserved;
    expect(metadata.replaced).toBe(false);
    expect(metadata.banks).toBe(0);
    expect(metadata.triangles).toBe(0);
   }else{
    expect(metadata.replaced).toBe(true);
    expect(preserved).toEqual(legacy);
    expect(metadata.banks).toBe(2);
    expect(metadata.voids).toBeGreaterThan(45);
    expect(metadata.folds).toBeGreaterThan(20);
    expect(metadata.triangles).toBeGreaterThan(800);
    expect(metadata.clearance).toBeGreaterThanOrEqual(50);
    expect(metadata.oldPortalCount).toBeGreaterThan(0); // old geometry exists, but is not rendered in rift
   }
   const file='g4e7ae-'+point+'-'+scene+'.png';
   await canvas.screenshot({path:info.outputPath(file)});
   records.push({file,metadata:{...metadata,pose:undefined}});
  }
 }
 expect(records).toHaveLength(10);
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7ae-legacy-vs-split-horizon.json'),
  JSON.stringify({schema:'dopagaki.g4e7ae-native-WebGL-A-B/1',records,
   physicsChanged:false,roadStatus:'unchanged',certifiedSlope2Meters:0,
   artQuality:'HOLD',humanQuality:'HOLD',publication:'HOLD'},null,2));
});
