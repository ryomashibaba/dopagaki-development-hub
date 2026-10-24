import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const stageId=x=>'VB-P101-A13-W9C2-G4E7AD-'+x.toUpperCase();
test('AD research remains invisible without private localhost opt-in',async({page})=>{
 await page.goto('/drive3d/?stage=VB-P101-A13-W9C2-G4E7AD-APPROACH-ARC');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7AD-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7ad-mode','off');
});
test('AD actual 240Hz camera and B48 WebGL: 2 candidates x 3 times x 2 city choices',async({page},info)=>{
 test.setTimeout(480000);
 const errors=[],records=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const variant of ['approach-arc','landing-crescent']){
  for(const point of ['t315','t365','t415']){
   let clear=null;
   for(const scene of ['clear','city']){
    await page.goto('/drive3d/?g4e7ad=on&g4e7adFrame=hold&g4e7adPoint='+point+
      '&g4e7adScene='+scene+'&stage='+stageId(variant));
    const canvas=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7AD LOCAL',{timeout:75000});
    await expect(page.locator('#stage')).toHaveValue(stageId(variant));
    await expect(canvas).toHaveAttribute('data-g4e7ad-mode','ACTUAL_240HZ_R2_NATIVE_CAMERA_HOLD');
    await expect(canvas).toHaveAttribute('data-g4e7ad-scene',scene);
    const meta=await page.evaluate(async()=>{
     const d=document.querySelector('#view').dataset,
      st=document.querySelector('#stage').value,
      suffix=st.endsWith('APPROACH-ARC')?'APPROACH_ARC':'LANDING_CRESCENT',
      doc=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_'+suffix+'_LOCAL_TRIAL.json')).json(),
      proof=await(await fetch('../generated/P101_A13_W9C2_G4E7AD_240HZ_FRAMES_LOCAL.json')).json(),
      id=doc.stageForge.g4e7acR2Study.id,
      frame=proof.stages[id].frames.find(x=>x.id===d.g4e7adPoint);
     return {id,scene:d.g4e7adScene,
       originalRoads:doc.surfaces.length,originalHazards:doc.movingObstacles.length,
       voidCells:doc.surfaces[0].voidLongitudinalCells,
       time:Number(d.g4e7adTime),speed:Number(d.g4e7adSpeedMps),
       physicsHz:proof.physicsHz,source:frame.source,
       eye:frame.eye,front:frame.front,yaw:frame.yaw,
       citySpires:Number(d.g4e7adSpires),cityWindows:Number(d.g4e7adWindows),
       cityTriangles:Number(d.g4e7adTriangles),clearance:Number(d.g4e7adClearanceMeters),
       noCollision:d.g4e7adNonCollision==='true',
       formalMeters:proof.certifiedSlope2Meters,
       study:doc.stageForge.g4e7acR2Study};
    });
    expect(meta.originalRoads).toBe(7);
    expect(meta.originalHazards).toBe(28);
    expect(meta.voidCells).toEqual([52]);
    expect(meta.physicsHz).toBe(240);
    expect(meta.formalMeters).toBe(0);
    expect(meta.source).toBe('ACTUAL_240HZ_START00_P96_NOT_HUMAN');
    expect(meta.noCollision).toBe(true);
    expect(meta.study.certifiedSlope2Meters).toBe(0);
    const pose={time:meta.time,speed:meta.speed,eye:meta.eye,front:meta.front,yaw:meta.yaw};
    if(scene==='clear'){
     expect(meta.citySpires).toBe(0);
     expect(meta.cityTriangles).toBe(0);
     clear=pose;
    }else{
     expect(pose).toEqual(clear);
     expect(meta.citySpires).toBe(12);
     expect(meta.cityWindows).toBe(24);
     expect(meta.cityTriangles).toBeGreaterThan(0);
     expect(meta.clearance).toBeGreaterThanOrEqual(60);
    }
    const file='g4e7ad-'+variant+'-'+point+'-'+scene+'.png';
    await canvas.screenshot({path:info.outputPath(file)});
    records.push({file,meta:{...meta,study:undefined}});
   }
  }
 }
 expect(records).toHaveLength(12);
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7ad-WebGL-12-views.json'),JSON.stringify({
  schema:'dopagaki.g4e7ad-comparison/1',records,
  humanQuality:'HOLD',artApproval:'UNREVIEWED',certifiedMeters:0,publication:'HOLD'
 },null,2));
});
