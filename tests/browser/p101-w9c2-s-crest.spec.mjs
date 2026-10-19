import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('W9-C2 actual WebGL RIBBON vs EDGE physical S-crest; W9-C1 Gold unmodified',async({page},info)=>{
 test.setTimeout(140000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const results=[],shots={};
 for(const [kind,nominal,stageId] of [
  ['RIBBON',34,'VB-P101-A13-W9C2-RIBBON'],
  ['EDGE',22,'VB-P101-A13-W9C2-EDGE']
 ]){
  await page.goto('/drive3d/?stage='+stageId);
  await expect(page.locator('#appStatus')).toContainText('W9-C2 S-CREST',{timeout:90000});
  await expect(page.locator('#stage')).toHaveValue(stageId);
  await expect(page.locator('#view')).toHaveAttribute('data-w9c2-variant','W9-C2-S-CREST-'+kind);
  await expect(page.locator('#view')).toHaveAttribute('data-w9c2-section','5');
  await expect(page.locator('#view')).toHaveAttribute('data-w9c2-true-collider','true');
  await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#view')).toHaveAttribute('data-w9c1-isolated','false');
  await expect(page.locator('#w9c1TrialWarning')).toBeHidden();
  await expect(page.locator('#w9c1G4Survey')).toBeHidden();
  await expect(page.locator('#demoRun')).toBeDisabled();
  const measured=await page.evaluate(async name=>{
   const [candidate,gold]=await Promise.all([
    fetch('../generated/P101_A13_W9C2_'+name+'_TRIAL.json').then(r=>r.json()),
    fetch('../generated/P101_A13_W7_GAMEPLAY.json').then(r=>r.json())
   ]);
   const c=candidate.surfaces[5],b=gold.surfaces[5];
   const width=s=>Math.hypot(...s.points[14*5].map((x,k)=>x-s.points[14*5+4][k]));
   const changed=c.points.filter((p,i)=>p.some((x,k)=>x!==b.points[i][k])).length;
   return {nominal:candidate.stageForge.w9c2PhysicalStudy.targetWidthAtCrestMeters,
    changed,roadStartUnchanged:JSON.stringify(c.points.slice(0,5))===JSON.stringify(b.points.slice(0,5)),
    roadEndUnchanged:JSON.stringify(c.points.slice(-5))===JSON.stringify(b.points.slice(-5)),
    otherRoadsUnchanged:candidate.surfaces.every((s,i)=>i===5||JSON.stringify(s)===JSON.stringify(gold.surfaces[i])),
    machinesUnchanged:JSON.stringify(candidate.movingObstacles)===JSON.stringify(gold.movingObstacles),
    baselineSpawnsUnchanged:JSON.stringify(candidate.spawns.slice(0,6))===JSON.stringify(gold.spawns),
    routeChanged:JSON.stringify(candidate.route)!==JSON.stringify(gold.route),
    changedControlPoints:changed,
    naturalJumpGapImplemented:candidate.stageForge.w9c2PhysicalStudy.trueJumpGapImplemented
   };
  },kind);
  expect(measured.nominal).toBe(nominal);
  expect(measured.changed).toBeGreaterThan(30);
  expect(measured.roadStartUnchanged&&measured.roadEndUnchanged&&measured.otherRoadsUnchanged&&measured.machinesUnchanged&&measured.baselineSpawnsUnchanged).toBe(true);
  expect(measured.routeChanged).toBe(true);
  expect(measured.naturalJumpGapImplemented).toBe(false);
  await page.locator('#spawn').selectOption('7');
  await page.locator('#pause').click();
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
  shots[kind]=await page.locator('#view').screenshot({path:info.outputPath('w9c2-'+kind.toLowerCase()+'-true-webgl.png')});
  results.push({kind,nominal,...measured,photo:'w9c2-'+kind.toLowerCase()+'-true-webgl.png',
   note:'Only local 52m/s camera spawn, not actual human high-speed entry'});
 }
 const difference=await page.evaluate(async({a,b})=>{
  const bytes=async encoded=>{
   const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+encoded)).blob());
   const cv=document.createElement('canvas');cv.width=bitmap.width;cv.height=bitmap.height;
   const ctx=cv.getContext('2d');ctx.drawImage(bitmap,0,0);
   return {w:cv.width,h:cv.height,data:ctx.getImageData(0,0,cv.width,cv.height).data};
  };
  const x=await bytes(a),y=await bytes(b);
  if(x.w!==y.w||x.h!==y.h)throw Error('mismatched physical screenshot sizes');
  let changedPixels=0;
  for(let i=0;i<x.data.length;i+=4)
   if(Math.abs(x.data[i]-y.data[i])+Math.abs(x.data[i+1]-y.data[i+1])+
      Math.abs(x.data[i+2]-y.data[i+2])>42)changedPixels++;
  return {width:x.w,height:x.h,changedPixels};
 },{a:shots.RIBBON.toString('base64'),b:shots.EDGE.toString('base64')});
 expect(difference.changedPixels).toBeGreaterThan(75,'physical shape alternatives must show a real visible difference');
 await fs.writeFile(info.outputPath('w9c2-g2-webgl-audit.json'),JSON.stringify({
  schema:'dopagaki.w9c2.g2-real-webgl/1',results,difference,errors,
  humanFairness:'HOLD',humanEnjoyment:'HOLD',completeSlopeDNAmeters:0,
  claimedActualJumpGap:false,source:'ACTUAL_CHROMIUM_WEBGL'
 },null,2));
 expect(errors).toEqual([]);
});
