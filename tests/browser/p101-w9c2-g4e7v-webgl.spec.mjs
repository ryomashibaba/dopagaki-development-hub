import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7V private 240Hz not exposed on normal game or remote search flags',async({page})=>{
 await page.goto('/drive3d/?g4e7v=on&stage=VB-P101-A13-W9C2-G4E7V-SLOPE6');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7V-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7v-mode','off');
});
test('G4E-7V true 240Hz FOUR speed-camera positions x THREE authentic B48 geometries',async({page},info)=>{
 test.setTimeout(500000);
 const out=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const stages=['ORIGINAL','EXIT6','SLOPE6'],frames=['approach','impact','outbound','lookahead'];
 for(const frame of frames)for(const variant of stages){
  const id='VB-P101-A13-W9C2-G4E7V-'+variant;
  await page.goto('/drive3d/?g4e7v=on&g4e7vFrame=hold&g4e7vPoint='+frame+'&stage='+id);
  const canvas=page.locator('#view');
  await expect(page.locator('#appStatus')).toContainText('G4E-7V LOCAL',{timeout:80000});
  await expect(page.locator('#stage')).toHaveValue(id);
  await expect(canvas).toHaveAttribute('data-g4e7v-mode','ACTUAL_240HZ_NOT_HUMAN_STATIC');
  await expect(canvas).toHaveAttribute('data-g4e7v-point',frame);
  await expect(canvas).toHaveAttribute('data-run-mode','private-240hz-real-speed-static-HOLD');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#pause')).toContainText('再開');
  const sample=await page.evaluate(async()=>{
   const canvas=document.querySelector('#view'),c=canvas.dataset,
    stage=document.querySelector('#stage').value,key=stage.split('-').at(-1),
    proof=await(await fetch('../generated/P101_A13_W9C2_G4E7V_240HZ_FRAMES_LOCAL.json')).json(),
    doc=await(await fetch('../generated/P101_A13_W9C2_G4E7V_'+key+'_LOCAL_TRIAL.json')).json(),
    v=key.toLowerCase(),f=proof.stages[v].frames.find(x=>x.id===c.g4e7vPoint);
   const {sample,tessellate}=await import('../reference_only/director/surface.js'),
    road=doc.surfaces[0],at=sample(road,.58888889,0),other=sample(road,.58888889,1);
   return {variant:v,point:c.g4e7vPoint,time:Number(c.g4e7vTime),
    speed:Number(c.g4e7vSpeedMps),hudSpeed:parseFloat(document.querySelector('#speed').textContent),
    hudTime:parseFloat(document.querySelector('#simTime').textContent),grounded:c.g4e7vGrounded==='true',
    nativePhysicsHz:proof.physicsHz,source:f.source,viewTime:f.timeSeconds,
    viewSpeed:f.speedMps,yaw:f.yaw,eye:f.eye,pose:f.pose,
    realWidthAtLip:Math.hypot(...at.map((x,i)=>x-other[i])),
    gapCells:road.voidLongitudinalCells,
    triangleCount:tessellate(road).topIndexCount/3,
    roads:doc.surfaces.length,machines:doc.movingObstacles.length,
    official:doc.stageForge.g4e7vStudy.officialSlope2Meters};
  });
  expect(sample.nativePhysicsHz).toBe(240);expect(sample.roads).toBe(7);
  expect(sample.machines).toBe(28);expect(sample.official).toBe(0);
  expect(sample.source).toBe('NATIVE_START00_240HZ_P96_NOT_HUMAN');
  expect(sample.speed).toBeGreaterThan(50);expect(sample.speed).toBeLessThan(120);
  expect(sample.speed).toBe(sample.viewSpeed);expect(sample.time).toBe(sample.viewTime);
  expect(sample.hudSpeed).toBeCloseTo(sample.viewSpeed,0);
  expect(sample.hudTime).toBeCloseTo(sample.viewTime,1);
  expect(sample.gapCells).toEqual([53]);
  expect(sample.realWidthAtLip).toBeGreaterThan(11);
  expect(sample.realWidthAtLip).toBeLessThan(22);
  const file='g4e7v-'+frame+'-'+variant.toLowerCase()+'-actual240hz.png';
  await canvas.screenshot({path:info.outputPath(file)});
  out.push({file,sample});
 }
 expect(errors).toEqual([]);
 for(const frame of frames){
  const cases=out.filter(x=>x.sample.point===frame);
  expect(cases).toHaveLength(3);
  expect(cases[0].sample.time).toBe(cases[1].sample.time);
  expect(cases[1].sample.time).toBe(cases[2].sample.time);
  for(const x of cases)expect(x.sample.source).toBe('NATIVE_START00_240HZ_P96_NOT_HUMAN');
 }
 await fs.writeFile(info.outputPath('g4e7v-actual240hz-visual-review.json'),JSON.stringify({
  schema:'dopagaki.g4e7v-matched-native-time-WebGL/1',shots:out,errors,
  comparativeCamera:'NATIVE_BALL_LOCK_NO_TELEPORT',
  sceneryApproval:'HOLD',humanFairness:'HOLD',officialSlope2Meters:0},null,2));
});
