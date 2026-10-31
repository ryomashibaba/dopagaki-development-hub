import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('G4E-7L monument locked out of default/W7F Gold and G4E-7D human cases',async({page})=>{
 await page.goto('/drive3d/?g4e7l=monument&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#g4e7lModes')).toHaveCount(0);
 await page.goto('/drive3d/?g4e7g=on&g4e7l=monument&g4e7gFrame=hold&stage=VB-P101-A13-W9C2-G4E7G-GOLD');
 await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:60000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7l-mode','off');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7l-rift-triangles','0');
 await expect(page.locator('#g4e7lModes')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
});

test('G4E-7L true WebGL: 2 real-road-anchored heroic architecture concepts in 3 road views',async({browser},info)=>{
 test.setTimeout(290000);
 const studies=[],errors=[];
 for(const [point,w,h,side] of [
  ['skyline',1300,780,'skyline'],['crown',1300,780,'crown'],
  ['skyline-420px',420,760,'skyline']]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const page=await ctx.newPage();
  page.on('pageerror',error=>errors.push({point,message:error.message}));
  await page.goto('/drive3d/?g4e7g=on&g4e7gFrame=hold&g4e7l=monument&g4e7gPoint='+side+'&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
  const canvas=page.locator('#view'),view=page.locator('.viewport');
  await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:60000});
  await expect(canvas).toHaveAttribute('data-g4e7g-mode','STATIC_SAME_U_NOT_SAME_WORLD_POSE');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(canvas).toHaveAttribute('data-g4e7l-non-collision','true');
  await expect(canvas).toHaveAttribute('data-g4e7l-districts','2');
  await expect(canvas).toHaveAttribute('data-g4e7l-skyseam-count','2');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  const dimensions=await canvas.evaluate(c=>({
   rift:+c.dataset.g4e7lRiftTriangles,skyseam:+c.dataset.g4e7lSkyseamTriangles,
   districts:+c.dataset.g4e7lDistricts,voidBays:+c.dataset.g4e7lVoidBays,
   altitude:+c.dataset.g4e7lHighestMeters}));
  expect(dimensions.rift).toBeGreaterThan(1000);
  expect(dimensions.skyseam).toBeGreaterThan(dimensions.rift);
  expect(dimensions.voidBays).toBeGreaterThan(12);
  expect(dimensions.altitude).toBeGreaterThan(350);
  await expect(page.locator('#g4e7lModes')).toBeVisible();
  const pictures=[],poses=[];
  for(const mode of ['off','rift','skyseam']){
   await page.locator('#g4e7l-'+mode).click();
   await expect(canvas).toHaveAttribute('data-g4e7l-mode',mode);
   const pose=await page.evaluate(()=>({
    time:document.querySelector('#simTime').textContent,
    stage:document.querySelector('#stage').value,
    spawn:document.querySelector('#spawn').value,
    camera:document.querySelector('#view').dataset.cameraMode,
    lag:document.querySelector('#view').dataset.cameraHeadingLagDegrees,
    machines:document.querySelector('#view').dataset.machineCount,
    warning:document.querySelector('#machineCue').textContent,
    edgeWarning:document.querySelector('#edgeRadar').textContent
   }));
   expect(pose.time).toBe('0.00 s');
   poses.push(pose);
   await page.waitForTimeout(90);
   const name='g4e7l-'+point+'-'+mode;
   const composed=await view.screenshot({path:info.outputPath(name+'-hud.png')});
   await page.evaluate(()=>{
    const style=document.createElement('style');
    style.id='g4e7l-no-dom';
    style.textContent='.viewport > :not(canvas){visibility:hidden!important}';
    document.head.append(style);
   });
   const bare=await canvas.screenshot({path:info.outputPath(name+'-webgl.png')});
   await page.evaluate(()=>document.querySelector('#g4e7l-no-dom')?.remove());
   pictures.push({mode,images:[name+'-hud.png',name+'-webgl.png'],
    composedBytes:composed.toString('base64'),bareBytes:bare.toString('base64')});
  }
  for(const pose of poses)expect(pose).toEqual(poses[0]);
  const percent=await page.evaluate(async images=>{
   const decode=async b=>{
    const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+b)).blob());
    const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
    const ctx=c.getContext('2d');ctx.drawImage(bitmap,0,0);
    return {w:c.width,h:c.height,p:ctx.getImageData(0,0,c.width,c.height).data};
   };
   const p=await Promise.all(images.map(decode));
   const diff=(a,b)=>{
    const x=p[a],y=p[b];if(x.w!==y.w||x.h!==y.h)throw Error('GL-sized mismatch');
    let count=0;
    for(let i=0;i<x.p.length;i+=4){
     if(Math.max(Math.abs(x.p[i]-y.p[i]),Math.abs(x.p[i+1]-y.p[i+1]),
      Math.abs(x.p[i+2]-y.p[i+2]))>24)count++;
    }
    return {pixels:count,percent:Number((100*count/(x.w*x.h)).toFixed(4)),
     width:x.w,height:x.h};
   };
   return {riftVsOriginal:diff(0,1),skyseamVsOriginal:diff(0,2),
    skyseamVsRift:diff(1,2)};
  },pictures.map(p=>p.bareBytes));
  expect(percent.riftVsOriginal.pixels).toBeGreaterThan(100);
  expect(percent.skyseamVsOriginal.pixels).toBeGreaterThan(100);
  // A distinct design MUST appear from the actual driver perspective.
  expect(percent.skyseamVsRift.pixels).toBeGreaterThan(100);
  await page.locator('#g4e7l-off').click();
  await expect(canvas).toHaveAttribute('data-g4e7l-mode','off');
  studies.push({point,viewport:{width:w,height:h},dimensions,pureWebGLDifference:percent,
   photos:pictures.map(({composedBytes,bareBytes,...p})=>p),
   physicalRunnerPoseUnchanged:true,humanPlayability:'HOLD'});
  await ctx.close();
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7l-titan-webgl-audit.json'),JSON.stringify({
  schema:'dopagaki.g4e7l.real-b48-titan-webgl/1',studies,errors,
  candidateCount:2,additionalB48PhysicalRoadMeters:0,
  existingPhysicalGlideRealModifiedMeters:300,
  collisionAdded:false,architectureIsNonColliding:true,
  noHumanApproval:true,approvedSlopeDnaMeters:0,release:'HOLD'
 },null,2));
});
