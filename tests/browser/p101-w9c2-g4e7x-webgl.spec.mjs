import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7X does not leak private markers into ordinary game even if URL contains opt-in',async({page})=>{
 await page.goto('/drive3d/?g4e7xGuide=on');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7x-guide','off');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7x-guide-triangles','0');
});
test('G4E-7X opt-in GPU-only gap cues versus baseline: two actual 240Hz native B48 trajectories',async({page},info)=>{
 test.setTimeout(480000);
 const records=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const [name,suffix] of [['A065','0-65'],['A070','0-7']])
  for(const point of ['approach','lip','flight','landing','post']){
   const stage='VB-P101-A13-W9C2-G4E7W-BLEND-'+suffix;
   for(const on of [false,true]){
    await page.goto('/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7wPoint='+point+
      (on?'&g4e7xGuide=on':'')+'&stage='+stage);
    const canvas=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:65000});
    await expect(page.locator('#stage')).toHaveValue(stage);
    await expect(canvas).toHaveAttribute('data-g4e7w-mode','ACTUAL_B48_240HZ_NOT_HUMAN');
    await expect(canvas).toHaveAttribute('data-machine-count','28');
    await expect(canvas).toHaveAttribute('data-g4e7x-guide',on?'REAL_GAP_PAINT_NONCOLLISION':'off');
    const obs=await page.evaluate(async()=>{
     const d=document.querySelector('#view').dataset,stage=document.querySelector('#stage').value,
      key=stage.endsWith('0-65')?'A065':'A070';
     const doc=await(await fetch('../generated/P101_A13_W9C2_G4E7W_'+key+'_LOCAL_TRIAL.json')).json(),
      proof=await(await fetch('../generated/P101_A13_W9C2_G4E7W_240HZ_FRAMES_LOCAL.json')).json(),
      selected=proof.stages[key].frames.find(v=>v.id===d.g4e7wPoint);
     return {time:Number(d.g4e7wTime),speed:Number(d.g4e7wSpeedMps),
      source:selected.source,nativeTime:selected.timeSeconds,nativeSpeed:selected.speedMps,
      guide:d.g4e7xGuide,triangles:Number(d.g4e7xGuideTriangles),
      upstream:Number(d.g4e7xUpstreamMarkers),downstream:Number(d.g4e7xDownstreamMarkers),
      noFakeBridge:d.g4e7xNoFakeBridge,
      cueDistance:Number(d.g4e7xEarliestMeters),sectionCount:doc.surfaces.length,
      movingCount:doc.movingObstacles.length,gapCells:doc.surfaces[0].voidLongitudinalCells,
      lipWidth:doc.stageForge.g4e7wStudy.gap.lipWidthMeters,
      recordStageId:doc.stageForge.recordStageId,physicsHz:proof.real240Hz,
      humanFairness:proof.publish};
    });
    expect(obs.physicsHz).toBe(240);expect(obs.movingCount).toBe(28);
    expect(obs.sectionCount).toBe(7);expect(obs.gapCells).toEqual([52]);
    expect(obs.lipWidth).toBeGreaterThan(11);expect(obs.lipWidth).toBeLessThan(16);
    expect(obs.source).toBe('TRUE_START00_240HZ_P96_NOT_HUMAN');
    expect(obs.time).toBe(obs.nativeTime);expect(obs.speed).toBe(obs.nativeSpeed);
    expect(obs.noFakeBridge).toBe('true');
    expect(obs.recordStageId).toMatch(/^[A-Za-z0-9-]+$/);
    expect(obs.humanFairness).toBe('HOLD');
    if(on){
     expect(obs.triangles).toBeGreaterThan(80);expect(obs.triangles).toBeLessThan(300);
     expect(obs.upstream).toBeGreaterThan(30);
     expect(obs.downstream).toBeGreaterThan(12);
     expect(obs.cueDistance).toBe(195);
    }else expect(obs.triangles).toBe(0);
    const file='g4e7x-'+name.toLowerCase()+'-'+point+'-'+(on?'cue':'baseline')+'.png';
    await canvas.screenshot({path:info.outputPath(file)});
    records.push({name,point,guide:on,file,obs});
   }
  }
 expect(errors).toEqual([]);
 for(const name of ['A065','A070'])for(const point of ['approach','lip','flight','landing','post']){
  const a=records.filter(x=>x.name===name&&x.point===point);
  expect(a).toHaveLength(2);
  expect(a[0].obs.speed).toBe(a[1].obs.speed);
  expect(a[0].obs.time).toBe(a[1].obs.time);
 }
 await fs.writeFile(info.outputPath('g4e7x-real-gap-20-views.json'),JSON.stringify({
  schema:'dopagaki.g4e7x-real-240hz-GPU-lookahead/1',records,errors,
  notHuman:true,notApproved:true,public:false,certifiedSlope2Meters:0
 },null,2));
});
