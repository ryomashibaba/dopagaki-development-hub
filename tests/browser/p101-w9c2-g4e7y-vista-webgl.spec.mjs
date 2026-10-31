import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7Y R3 visual design: 20 actual 240Hz early camera baseline vs asymmetric outboard cliff city',async({page},info)=>{
 test.setTimeout(480000);
 const records=[],errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 for(const [name,key] of [['A065','0-65'],['A070','0-7']]){
  for(const id of ['t265','t315','t365','t415','t450']){
   let source=null;
   for(const vista of [false,true]){
    const stage='VB-P101-A13-W9C2-G4E7W-BLEND-'+key;
    await page.goto('/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7yEarly='+id+
      (vista?'&g4e7yScene=vista':'')+'&stage='+stage);
    const c=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:80000});
    await expect(c).toHaveAttribute('data-g4e7y-scene',vista?'vista':'baseline');
    await expect(c).toHaveAttribute('data-g4e7w-mode','ACTUAL_B48_240HZ_NOT_HUMAN');
    const data=await page.evaluate(async()=>{
     const c=document.querySelector('#view').dataset,
      key=document.querySelector('#stage').value.endsWith('0-65')?'A065':'A070',
      proof=await(await fetch('../generated/P101_A13_W9C2_G4E7Y_EARLY_240HZ_FRAMES_LOCAL.json')).json(),
      shot=proof.stages[key].frames.find(f=>f.id===c.g4e7yEarly);
     return {point:c.g4e7yEarly,
      now:Number(c.g4e7wTime),speed:Number(c.g4e7wSpeedMps),
      eyeToLip:Number(c.g4e7yEyeToTakeoffMeters),
      trueNativeSource:shot.source,
      worldPose:shot.pose,eye:shot.eye,front:shot.front,
      official:proof.officialSlope2Meters,
      nativeSeconds:shot.timeSeconds,nativeSpeed:shot.speedMps,
      nativeEyes:shot.eyeToActualTakeoffMeters,
      nativeHz:proof.real240Hz,stageRoads:proof.stages[key].actualRoads,
      nativeMoving:proof.stages[key].movingMachines,
      chapter0Portals:Number(c.g4e7yChapter0Portals),
      chapter0OutboardWings:Number(c.g4e7yChapter0Wings),
      noncollision:String(c.g4e7yActualB48Unmodified)};
    });
    expect(data.nativeHz).toBe(240);
    expect(data.official).toBe(0);
    expect(data.stageRoads).toBe(7);expect(data.nativeMoving).toBe(28);
    expect(data.trueNativeSource).toBe('TRUE_START00_240HZ_P96_NOT_HUMAN');
    expect(data.now).toBe(data.nativeSeconds);expect(data.speed).toBe(data.nativeSpeed);
    expect(data.eyeToLip).toBe(data.nativeEyes);
    expect(data.noncollision).toBe('true');
    if(vista){expect(data.chapter0Portals).toBe(0);expect(data.chapter0OutboardWings).toBe(10);}
    else{expect(data.chapter0Portals).toBe(4);expect(data.chapter0OutboardWings).toBe(0);}
    const unchanged={eye:data.eye,front:data.front,pose:data.worldPose,now:data.now,speed:data.speed};
    if(source)expect(unchanged).toEqual(source);
    else source=unchanged;
    const file='g4e7y-vista-'+name.toLowerCase()+'-'+id+'-'+(vista?'outboard':'baseline')+'.png';
    await c.screenshot({path:info.outputPath(file)});
    records.push({name,id,vista,file,data});
   }
  }
 }
 expect(records).toHaveLength(20);expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7y-vista-20views-metadata.json'),JSON.stringify({
  schema:'dopagaki.g4e7y-asymmetric-exterior-20views/1',records,
  release:'HOLD',humanFairness:'HOLD',officialSlope2Meters:0},null,2));
});
