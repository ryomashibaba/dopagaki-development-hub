import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const stage='VB-P101-A13-W9C2-G4E7AD-APPROACH-ARC';

// G4E-7AE vision metric: compare actual WebGL PNG bytes at identical 240Hz camera.
// PNG decoding is done with browser-native APIs, not AI image generation.
// Regions are descriptive ONLY: diff share never certifies human readability.
async function pixelDifference(page,clearPNG,riftPNG){
 return page.evaluate(async files=>{
  async function rgba(encoded){
   const bytes=Uint8Array.from(atob(encoded),x=>x.charCodeAt(0));
   const picture=await createImageBitmap(new Blob([bytes],{type:'image/png'}));
   const cv=document.createElement('canvas');cv.width=picture.width;cv.height=picture.height;
   const context=cv.getContext('2d',{willReadFrequently:true});
   context.drawImage(picture,0,0);
   return {width:picture.width,height:picture.height,pixels:context.getImageData(0,0,picture.width,picture.height).data};
  }
  const a=await rgba(files.clear),b=await rgba(files.rift);
  if(a.width!==b.width||a.height!==b.height)throw Error('AE screenshot dimensions unexpectedly changed');
  const width=a.width,height=a.height,n=width*height;
  const counts={all:0,center:0,outer:0,upper:0},total={all:n,center:0,outer:0,upper:0};
  let sumDiff=0;const threshold=15;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const i=(y*width+x)*4,
    d=Math.max(Math.abs(a.pixels[i]-b.pixels[i]),
     Math.abs(a.pixels[i+1]-b.pixels[i+1]),Math.abs(a.pixels[i+2]-b.pixels[i+2]));
   const change=d>threshold,center=x>=width*.3&&x<width*.7,upper=y<height*.65;
   if(change){counts.all++;if(center)counts.center++;else counts.outer++;if(upper)counts.upper++;}
   if(center)total.center++;else total.outer++;if(upper)total.upper++;
   sumDiff+=d;
  }
  const round=x=>Number((x*100).toFixed(2));
  return {imageWidth:width,imageHeight:height,thresholdMaxRGB:threshold,
   changedPct:round(counts.all/n),centerChangedPct:round(counts.center/total.center),
   outerChangedPct:round(counts.outer/total.outer),
   upperChangedPct:round(counts.upper/total.upper),
   meanMaxRGBDifference:Number((sumDiff/n).toFixed(2)),
   cameraHeldIdentical:true,humanReadability:'UNASSESSED',artAcceptance:'HOLD'};
 },{clear:clearPNG.toString('base64'),rift:riftPNG.toString('base64')});
}

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
  let legacy=null,oldPNG=null;
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
   const png=await canvas.screenshot({path:info.outputPath(file)});
   let delta=null;
   if(scene==='legacy'){oldPNG=png;}
   else{
    delta=await pixelDifference(page,oldPNG,png);
    // This is only a real pixel-change smoke check, NOT an artistic success threshold.
    expect(delta.changedPct).toBeGreaterThan(0.5);
   }
   records.push({file,metadata:{...metadata,pose:undefined},screenChangeFromLegacy:delta});
  }
 }
 expect(records).toHaveLength(10);
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7ae-legacy-vs-split-horizon.json'),
  JSON.stringify({schema:'dopagaki.g4e7ae-native-WebGL-A-B/1',records,
   physicsChanged:false,roadStatus:'unchanged',certifiedSlope2Meters:0,
   colorChangeMetric:'MAX_RGB_DIFFERENCE_GT_15_REGIONAL_PIXEL_SHARE',
   artQuality:'HOLD',humanQuality:'HOLD',publication:'HOLD'},null,2));
});
