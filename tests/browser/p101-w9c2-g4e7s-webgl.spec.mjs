import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7S default web game never enables hidden scripted-camera research',async({page})=>{
 await page.goto('/drive3d/?g4e7s=speed&g4e7sScene=shards');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7s-mode','off');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7s-spires','0');
});
test('G4E-7S: eight matched TRUE 240Hz high-speed B48 camera frames, skyline only',async({page},info)=>{
 test.setTimeout(280000);
 const records=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const point of ['approach','lip','flight','rejoin'])for(const scene of ['baseline','shards']){
  await page.goto('/drive3d/?g4e7r=on&g4e7rFrame=hold&g4e7s=speed&g4e7sPoint='+
   point+'&g4e7sScene='+scene+'&stage=VB-P101-A13-W9C2-G4E7R-CUT');
  const canvas=page.locator('#view');
  await expect(page.locator('#appStatus')).toContainText('G4E-7S SCRIPTED 240Hz',{timeout:90000});
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7R-CUT');
  await expect(canvas).toHaveAttribute('data-g4e7s-mode','ACTUAL_240HZ_SCRIPTED_STILL_NOT_HUMAN');
  await expect(canvas).toHaveAttribute('data-g4e7s-point',point);
  await expect(canvas).toHaveAttribute('data-run-mode','private-true-B48-graded-HOLD');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#pause')).toContainText('再開');
  const record=await page.evaluate(async()=>{
   const d=document.querySelector('#view').dataset,
    source=await(await fetch('../generated/P101_A13_W9C2_G4E7S_240HZ_PRIVATE.json')).json(),
    frame=source.frames.find(f=>f.id===d.g4e7sPoint);
   return {point:d.g4e7sPoint,scene:d.g4e7sScene,
    speedMps:Number(d.g4e7sSpeedMps),u:Number(d.g4e7sU),
    grounded:d.g4e7sGrounded==='true',tick:Number(d.g4e7sTick),
    monuments:Number(d.g4e7sSpires),voidWindows:Number(d.g4e7sVoidWindows),
    triangles:Number(d.g4e7sTriangles),outboardMeters:Number(d.g4e7sOutboardMeters),
    nonCollision:d.g4e7sNonCollision,realPose:frame.pose,
    source:source.nativeSource,physicsHz:source.physicsHz,
    stageId:source.stageId,human:source.motionNotHuman,
    certified:source.officialSlopeDnaMeters,realMovingCount:source.originalMovingCount};
  });
  expect(record.speedMps).toBeGreaterThan(70);
  expect(record.speedMps).toBeLessThan(210);
  expect(record.physicsHz).toBe(240);expect(record.realMovingCount).toBe(28);
  expect(record.source).toBe('REAL_START00_240HZ_NOT_MANUAL');
  expect(record.human).toBe(true);expect(record.certified).toBe(0);
  expect(record.nonCollision).toBe('true');
  if(scene==='shards'){
   expect(record.monuments).toBe(6);expect(record.voidWindows).toBeGreaterThanOrEqual(12);
   expect(record.triangles).toBeGreaterThan(300);expect(record.outboardMeters).toBeGreaterThan(80);
  }else{expect(record.monuments).toBe(0);expect(record.triangles).toBe(0);}
  const file='g4e7s-'+point+'-'+scene+'-real240hz.png';
  await canvas.screenshot({path:info.outputPath(file)});
  records.push({file,record});
 }
 expect(errors).toEqual([]);
 for(const point of ['approach','lip','flight','rejoin']){
  const a=records.find(x=>x.record.point===point&&x.record.scene==='baseline').record;
  const b=records.find(x=>x.record.point===point&&x.record.scene==='shards').record;
  expect(a.speedMps).toBe(b.speedMps);expect(a.u).toBe(b.u);
  expect(a.tick).toBe(b.tick);expect(a.grounded).toBe(b.grounded);
  expect(a.realPose).toEqual(b.realPose);
 }
 await fs.writeFile(info.outputPath('g4e7s-matched-native240hz-WebGL.json'),JSON.stringify({
  schema:'dopagaki.g4e7s-240hz-matched-visible/1',records,
  source:'TRUE_240HZ_P96_START00_SCRIPTED_NOT_HUMAN',errors,
  humanPass:false,release:'HOLD',certifiedSlope2Meters:0},null,2));
});
