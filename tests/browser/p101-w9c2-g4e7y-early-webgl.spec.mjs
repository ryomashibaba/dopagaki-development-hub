import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

// G4E-7Y R2: no stand-in spawn/camera or time-extrapolated player. All 30
// pictures are actual start00 240Hz native steps with original ball-lock.
test('G4E-7Y first 2s before true takeoff: unchanged physics, 3 scene controls, 30 real WebGL views',async({page},info)=>{
 test.setTimeout(480000);
 const records=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const [name,key] of [['A065','0-65'],['A070','0-7']]){
  let previous=Infinity;
  for(const point of ['t265','t315','t365','t415','t450']){
   let fixedCamera=null;
   for(const mode of ['baseline','quiet','open']){
    const url='/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7yEarly='+point+
     (mode==='baseline'?'':'&g4e7yScene='+mode)+
     '&stage=VB-P101-A13-W9C2-G4E7W-BLEND-'+key;
    await page.goto(url);
    const canvas=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:80000});
    await expect(canvas).toHaveAttribute('data-g4e7y-early',point);
    await expect(canvas).toHaveAttribute('data-g4e7y-scene',mode);
    await expect(canvas).toHaveAttribute('data-g4e7w-mode','ACTUAL_B48_240HZ_NOT_HUMAN');
    const observation=await page.evaluate(async()=>{
     const c=document.querySelector('#view').dataset;
     const ref=await(await fetch('../generated/P101_A13_W9C2_G4E7Y_EARLY_240HZ_FRAMES_LOCAL.json')).json();
     const name=document.querySelector('#stage').value.endsWith('0-65')?'A065':'A070',
      shot=ref.stages[name].frames.find(x=>x.id===c.g4e7yEarly);
     return {id:c.g4e7yEarly,seconds:Number(c.g4e7wTime),
      speedMps:Number(c.g4e7wSpeedMps),
      cameraEyeMeters:Number(c.g4e7yEyeToTakeoffMeters),
      source:shot.source,eye:shot.eye,front:shot.front,
      frozenYaw:shot.yaw,origin:shot.pose.position,
      nativeCameraMeters:shot.eyeToActualTakeoffMeters,
      nativeSeconds:shot.timeSeconds,nativeSpeed:shot.speedMps,
      240:Number(ref.real240Hz),official:ref.officialSlope2Meters,
      machines:Number(c.machineCount),
      clearedFrames:Number(c.g4e7yRemovedHazardFrames),
      retainedB48:c.g4e7yActualB48Unmodified};
    });
    expect(observation['240']).toBe(240);
    expect(observation.official).toBe(0);
    expect(observation.machines).toBe(28);
    expect(observation.source).toBe('TRUE_START00_240HZ_P96_NOT_HUMAN');
    expect(observation.seconds).toBe(observation.nativeSeconds);
    expect(observation.speedMps).toBe(observation.nativeSpeed);
    expect(observation.cameraEyeMeters).toBe(observation.nativeCameraMeters);
    expect(observation.speedMps).toBeGreaterThan(50);
    expect(observation.retainedB48).toBe('true');
    if(mode!=='baseline')expect(observation.clearedFrames).toBeGreaterThan(0);
    else expect(observation.clearedFrames).toBe(0);
    if(fixedCamera)expect({
     eye:observation.eye,front:observation.front,seconds:observation.seconds,
     speedMps:observation.speedMps
    }).toEqual(fixedCamera);
    else fixedCamera={eye:observation.eye,front:observation.front,
     seconds:observation.seconds,speedMps:observation.speedMps};
    const file='g4e7y-r2-'+name.toLowerCase()+'-'+point+'-'+mode+'.png';
    await canvas.screenshot({path:info.outputPath(file)});
    records.push({name,point,mode,file,observation});
   }
   const meters=records.at(-1).observation.cameraEyeMeters;
   expect(meters).toBeLessThan(previous);
   previous=meters;
  }
 }
 expect(records).toHaveLength(30);
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7y-r2-real-early-30view-metadata.json'),JSON.stringify({
  schema:'dopagaki.g4e7y-r2-real-early-240hz/1',records,
  humanPlayability:'HOLD',officialSlope2Meters:0,public:false
 },null,2));
});
