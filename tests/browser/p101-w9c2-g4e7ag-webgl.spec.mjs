import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const stage='VB-P101-A13-W9C2-G4E7AD-APPROACH-ARC';
async function screenDelta(page,before,after){
 return await page.evaluate(async({before,after})=>{
  async function pixels(data){
   const buf=Uint8Array.from(atob(data),x=>x.charCodeAt(0)),
     bmp=await createImageBitmap(new Blob([buf],{type:'image/png'}));
   const c=document.createElement('canvas');c.width=bmp.width;c.height=bmp.height;
   const ctx=c.getContext('2d',{willReadFrequently:true});
   ctx.drawImage(bmp,0,0);
   return {w:bmp.width,h:bmp.height,p:ctx.getImageData(0,0,c.width,c.height).data};
  }
  const a=await pixels(before),b=await pixels(after);
  if(a.w!==b.w||a.h!==b.h)throw Error('AG camera image dimensions changed');
  let total=0,upper=0,center=0,cN=0,uN=0;
  for(let y=0;y<a.h;y++)for(let x=0;x<a.w;x++){
   const i=(y*a.w+x)*4;
   const diff=Math.max(Math.abs(a.p[i]-b.p[i]),Math.abs(a.p[i+1]-b.p[i+1]),
     Math.abs(a.p[i+2]-b.p[i+2]))>15;
   if(diff)total++;if(y<a.h*.65){uN++;if(diff)upper++;}
   if(x>a.w*.3&&x<a.w*.7){cN++;if(diff)center++;}
  }
  return {pixelThresholdMaxRgb:15,changedPct:Number((100*total/(a.w*a.h)).toFixed(2)),
   upperChangedPct:Number((100*upper/uN).toFixed(2)),
   centerChangedPct:Number((100*center/cN).toFixed(2)),
   noHumanApproval:true};
 },{before:before.toString('base64'),after:after.toString('base64')});
}
test('AG private optical research hidden without original 240Hz gate',async({page})=>{
 await page.goto('/drive3d/?g4e7ag=on&g4e7agScene=open&stage='+stage);
 await expect(page.locator('#stage option[value="'+stage+'"]')).toHaveCount(0);
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7ag-scene','off');
});
test('AG 5 real hollow skyline landmarks vs AF dark wall, exact same native camera',async({page},info)=>{
 test.setTimeout(480000);
 const errors=[],records=[];page.on('pageerror',err=>errors.push(err.message));
 for(const point of ['t315','t365','t415','t450']){
  let prev=null,pngPrev=null;
  for(const scene of ['af','ag']){
   const option=scene==='af'?'g4e7af=on&g4e7afScene=citadel':'g4e7ag=on&g4e7agScene=open';
   await page.goto('/drive3d/?g4e7ad=on&g4e7adFrame=hold&g4e7ae=on'+
     '&g4e7adScene=clear&g4e7adPoint='+point+'&stage='+stage+'&'+option);
   const canvas=page.locator('#view');
   await expect(page.locator('#appStatus')).toContainText('G4E-7AD LOCAL',{timeout:90000});
   await expect(canvas).toHaveAttribute('data-g4e7ad-mode','ACTUAL_240HZ_R2_NATIVE_CAMERA_HOLD');
   await expect(canvas).toHaveAttribute('data-g4e7ag-scene',scene==='ag'?'open':'off');
   const meta=await page.evaluate(async()=>{
    const d=document.querySelector('#view').dataset,
     doc=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_APPROACH_ARC_LOCAL_TRIAL.json')).json(),
     proof=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_240HZ_FRAMES_LOCAL.json')).json(),
     f=proof.stages['approach-arc'].frames.find(x=>x.id===d.g4e7adPoint);
    return {roads:doc.surfaces.length,machines:doc.movingObstacles.length,
     voidCells:doc.surfaces[0].voidLongitudinalCells,physicsHz:proof.physicsHz,
     certifiedMeters:proof.certifiedSlope2Meters,source:f.source,
     pose:f.pose,yaw:f.yaw,eye:f.eye,front:f.front,speed:f.speedMps,time:f.timeSeconds,
     afDistricts:Number(d.g4e7afDistricts),agScene:d.g4e7agScene,
     agLandmarks:Number(d.g4e7agLandmarks),agOpenCenters:Number(d.g4e7agOpenCenters),
     agIslands:Number(d.g4e7agIslands),agLightRibs:Number(d.g4e7agLightRibs),
     agTriangles:Number(d.g4e7agTriangles),agOutboard:Number(d.g4e7agMinimumOutboard),
     preserved:d.g4e7agPhysicsUnchanged==='true'};
   });
   expect(meta.roads).toBe(7);expect(meta.machines).toBe(28);
   expect(meta.voidCells).toEqual([52]);expect(meta.physicsHz).toBe(240);
   expect(meta.certifiedMeters).toBe(0);expect(meta.speed).toBeGreaterThan(52);
   expect(meta.source).toBe('ACTUAL_240HZ_START00_P96_NOT_HUMAN');
   expect(meta.preserved).toBe(true);
   const camera={pose:meta.pose,yaw:meta.yaw,eye:meta.eye,front:meta.front,speed:meta.speed,time:meta.time};
   const name='g4e7ag-'+point+'-'+scene+'.png';
   const png=await canvas.screenshot({path:info.outputPath(name)});
   let delta=null;
   if(scene==='af'){
    expect(meta.afDistricts).toBe(8);expect(meta.agLandmarks).toBe(0);
    prev=camera;pngPrev=png;
   }else{
    expect(meta.afDistricts).toBe(0);
    expect(meta.agLandmarks).toBe(5);
    expect(meta.agOpenCenters).toBe(5);
    expect(meta.agIslands).toBe(15);
    expect(meta.agLightRibs).toBeGreaterThanOrEqual(85);
    expect(meta.agTriangles).toBeGreaterThan(800);
    expect(meta.agOutboard).toBeGreaterThanOrEqual(85);
    expect(camera).toEqual(prev);
    delta=await screenDelta(page,pngPrev,png);
    expect(delta.changedPct).toBeGreaterThan(0.5);
   }
   records.push({file:name,metadata:{...meta,pose:undefined},differenceFromAF:delta});
  }
 }
 expect(records).toHaveLength(8);
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7ag-real-WebGL-comparison.json'),JSON.stringify({
  schema:'dopagaki.g4e7ag-open-city-WebGL-1',records,
  realB48Preserved:true,certifiedSlope2Meters:0,
  humanFairness:'HOLD',artFairness:'HOLD',publication:'HOLD'},null,2));
});
