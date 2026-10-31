import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7Z true 15m B48 no-bridge signals: native-240Hz 16 matched GPU shots',async({page},info)=>{
 test.setTimeout(480000);const records=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const [profile,key] of [['A065','0-65'],['A070','0-7']]){
  for(const point of ['t265','t365','t450','t415']){
   let base=null;
   for(const marked of [false,true]){
    const stage='VB-P101-A13-W9C2-G4E7W-BLEND-'+key;
    await page.goto('/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7yScene=vista2'+
     '&g4e7yEarly='+point+(marked?'&g4e7zGuide=on':'')+'&stage='+stage);
    const canvas=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:75000});
    await expect(canvas).toHaveAttribute('data-g4e7y-scene','vista2');
    await expect(canvas).toHaveAttribute('data-g4e7z-mode',marked?'TRUE_B48_OUTBOARD_NO_FAKE_FLOOR':'off');
    const v=await page.evaluate(async()=>{
     const d=document.querySelector('#view').dataset,
      stage=document.querySelector('#stage').value,
      key=stage.endsWith('0-65')?'A065':'A070',
      exact=await(await fetch('../generated/P101_A13_W9C2_G4E7Y_EARLY_240HZ_FRAMES_LOCAL.json')).json(),
      shot=exact.stages[key].frames.find(x=>x.id===d.g4e7yEarly),
      doc=await(await fetch('../generated/P101_A13_W9C2_G4E7W_'+key+'_LOCAL_TRIAL.json')).json();
     return {time:Number(d.g4e7wTime),speed:Number(d.g4e7wSpeedMps),
      eyeToGap:Number(d.g4e7yEyeToTakeoffMeters),
      cameraEye:shot.eye,front:shot.front,source:shot.source,
      roadCount:doc.surfaces.length,machineCount:doc.movingObstacles.length,
      firstRoadVoid:doc.surfaces[0].voidLongitudinalCells,
      actualGapWidth:doc.stageForge.g4e7wStudy.gap.lipWidthMeters,
      stations:Number(d.g4e7zStations),triangles:Number(d.g4e7zTriangles),
      trueVoid:d.g4e7zTrueVoid,physicsUnchanged:d.g4e7zPhysicsUnchanged,
      clearance:Number(d.g4e7zEdgeClearance),
      official:exact.officialSlope2Meters};
    });
    expect(v.roadCount).toBe(7);expect(v.machineCount).toBe(28);
    expect(v.firstRoadVoid).toEqual([52]);
    expect(v.actualGapWidth).toBeGreaterThan(11);
    expect(v.actualGapWidth).toBeLessThan(16);
    expect(v.source).toBe('TRUE_START00_240HZ_P96_NOT_HUMAN');
    expect(v.trueVoid).toBe('true');
    expect(v.physicsUnchanged).toBe('true');
    expect(v.official).toBe(0);
    if(marked){expect(v.stations).toBe(14);expect(v.triangles).toBe(56);expect(v.clearance).toBe(5.4);}
    else{expect(v.stations).toBe(0);expect(v.triangles).toBe(0);}
    if(base)expect({eye:v.cameraEye,front:v.front,time:v.time,speed:v.speed}).toEqual(base);
    else base={eye:v.cameraEye,front:v.front,time:v.time,speed:v.speed};
    const file='g4e7z-'+profile.toLowerCase()+'-'+point+'-'+(marked?'signaled':'clear')+'.png';
    await canvas.screenshot({path:info.outputPath(file)});
    records.push({profile,point,marked,file,v});
   }
  }
 }
 expect(records).toHaveLength(16);expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7z-true-native-16view-signaling.json'),
  JSON.stringify({schema:'dopagaki.g4e7z-B48-exterior-signals/1',records,
   officialSlope2Meters:0,public:false,humanFairness:'HOLD'},null,2));
});
