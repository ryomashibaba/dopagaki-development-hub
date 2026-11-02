import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const ids=['r2-control','true-pinch','pinch-switch'];
const stage=id=>'VB-P101-A13-W9C2-G4E7AI-'+id.toUpperCase();
test('AI real B48 narrow stage is invisible without loopback opt-in',async({page})=>{
 await page.goto('/drive3d/?stage='+stage('true-pinch'));
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7AI"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7ai-mode','off');
});
test('AI 3 real physical roads x 4 high-speed native 240Hz frames plus same-camera background comparison',async({page},info)=>{
 test.setTimeout(480000);
 const errors=[],records=[];page.on('pageerror',e=>errors.push(e.message));
 for(const point of ['t315','t365','t415','t450']){
  for(const id of ids){
   for(const backdrop of (point==='t365'?['legacy','quiet']:['quiet'])){
    await page.goto('/drive3d/?g4e7ai=on&g4e7aiFrame=hold&g4e7aiPoint='+point+
     '&g4e7aiBackdrop='+backdrop+'&stage='+stage(id));
    const canvas=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7AI LOCAL',{timeout:80000});
    await expect(page.locator('#stage')).toHaveValue(stage(id));
    await expect(canvas).toHaveAttribute('data-g4e7ai-mode','ACTUAL_240HZ_AH_NARROW_B48_HOLD');
    await expect(canvas).toHaveAttribute('data-g4e7ai-point',point);
    await expect(canvas).toHaveAttribute('data-g4e7ai-backdrop',backdrop);
    const data=await page.evaluate(async id=>{
     const d=document.querySelector('#view').dataset,
      st=await(await fetch('../generated/P101_A13_W9C2_G4E7AI_'+id.replace('-','_').toUpperCase()+'_LOCAL_TRIAL.json')).json(),
      proof=await(await fetch('../generated/P101_A13_W9C2_G4E7AI_240HZ_FRAMES_LOCAL.json')).json(),
      f=proof.stages[id].frames.find(x=>x.id===d.g4e7aiPoint);
     return {id,point:d.g4e7aiPoint,backdrop:d.g4e7aiBackdrop,
       time:f.timeSeconds,speed:f.speedMps,eye:f.eye,front:f.front,yaw:f.yaw,
       source:f.source,grounded:f.grounded,
       roads:st.surfaces.length,machines:st.movingObstacles.length,
       gap:st.surfaces[0].voidLongitudinalCells,
       width:st.stageForge.g4e7ahStudy.widthMinMeters,
       canvasWidth:Number(d.g4e7aiNativeWidth),
       studySource:st.stageForge.g4e7ahStudy.source,
       hz:proof.physicsHz,promoted:st.stageForge.productionPromoted,
       originalLipLandingExact:st.stageForge.g4e7ahStudy.originalLipLandingExact,
       certified:proof.certifiedSlope2Meters,publication:proof.publication};
    },id);
    expect(data.roads).toBe(7);expect(data.machines).toBe(28);
    expect(data.gap).toEqual([52]);expect(data.hz).toBe(240);
    expect(data.speed).toBeGreaterThan(52);
    expect(data.source).toBe('ACTUAL_240HZ_START00_P96_NOT_HUMAN');
    expect(data.originalLipLandingExact).toBe(true);
    expect(data.studySource).toBe('G4E7AC_R2_APPROACH_ARC_FULL_7_ROAD_SUCCESS');
    expect(data.promoted).toBe(false);
    expect(data.certified).toBe(0);expect(data.publication).toBe('HOLD');
    expect(data.width).toBe(data.canvasWidth);
    if(id==='r2-control')expect(data.width).toBeGreaterThan(14);
    else expect(data.width).toBeLessThan(12);
    const file='g4e7ai-'+id+'-'+point+'-'+backdrop+'.png';
    await canvas.screenshot({path:info.outputPath(file)});
    records.push({file,data});
   }
  }
 }
 expect(records).toHaveLength(15);
 for(const id of ids){
  const a=records.find(r=>r.data.id===id&&r.data.point==='t365'&&r.data.backdrop==='quiet').data;
  const b=records.find(r=>r.data.id===id&&r.data.point==='t365'&&r.data.backdrop==='legacy').data;
  expect({eye:a.eye,front:a.front,yaw:a.yaw,speed:a.speed}).toEqual(
   {eye:b.eye,front:b.front,yaw:b.yaw,speed:b.speed});
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7ai-native-b48-15-views.json'),
  JSON.stringify({schema:'dopagaki.g4e7ai-real-narrow-native-views/1',
   records,note:'DIFFERENT REAL PHYSICAL COURSES HAVE DIFFERENT ACTUAL CAMERAS; NO FALSE PIXEL-ALIGNED COMPARISON',
   nonhumanSteer:'P96',original28MovingHazards:true,certifiedSlope2Meters:0,
   humanQuality:'HOLD',visualQuality:'HOLD',release:'HOLD'},null,2));
});
