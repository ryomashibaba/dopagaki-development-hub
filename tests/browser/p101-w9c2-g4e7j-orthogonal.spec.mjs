import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('G4E-7J factor matrix is neither discoverable nor usable on Gold or ordinary game',async({page})=>{
 await page.goto('/drive3d/?g4e7j=matrix&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#g4e7jFactors')).toHaveCount(0);
 await page.goto('/drive3d/?g4e7g=on&g4e7h=candidate&g4e7i=candidate&g4e7j=matrix&g4e7gFrame=hold&stage=VB-P101-A13-W9C2-G4E7G-GOLD');
 await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:65000});
 await expect(page.locator('#g4e7jFactors')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7i-geometry-eligible','false');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7j-factor','off');
});

test('G4E-7J orthogonal four-condition real WebGL study at equal physical pose',async({browser},info)=>{
 test.setTimeout(250000);
 const runs=[],errors=[];
 for(const [name,w,h,point] of [
  ['skyline-desktop',1300,780,'skyline'],
  ['crown-desktop',1300,780,'crown'],
  ['skyline-handheld',420,760,'skyline']
 ]){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push({name,message:e.message}));
  await page.goto('/drive3d/?g4e7g=on&g4e7h=candidate&g4e7i=candidate&g4e7j=matrix&g4e7gFrame=hold&g4e7gPoint='+point+'&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
  const canvas=page.locator('#view'),viewport=page.locator('.viewport');
  await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:65000});
  await expect(canvas).toHaveAttribute('data-g4e7i-geometry-eligible','true');
  await expect(canvas).toHaveAttribute('data-g4e7i-triangles','52');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  await page.locator('#g4e7hFocusToggle').click();
  await expect(canvas).toHaveAttribute('data-g4e7h-mode','focus');
  await expect(page.locator('#g4e7iLegibilityToggle')).toBeHidden();
  await expect(page.locator('#g4e7jFactors')).toBeVisible();
  await page.waitForTimeout(180);
  const poses=[],captures=[];
  for(const [id,typography,contours] of [['none',false,false],['type',true,false],['contour',false,true],['both',true,true]]){
   await page.locator('#g4e7j-'+id).click();
   await expect(canvas).toHaveAttribute('data-g4e7j-factor',id);
   await expect(canvas).toHaveAttribute('data-g4e7j-typography',String(typography));
   await expect(canvas).toHaveAttribute('data-g4e7j-contours',String(contours));
   await expect(canvas).toHaveAttribute('data-g4e7i-mode',typography?'legible':'baseline');
   const metrics=await page.evaluate(async()=>{
    const {measureG4E7HViewport}=await import('./p101-w9c2-g4e7h-hud-focus.mjs');
    const q=id=>{
     const el=document.querySelector(id),s=getComputedStyle(el),r=el.getBoundingClientRect();
     return {text:el.textContent,font:Number.parseFloat(s.fontSize),
      visible:s.display!=='none',left:r.left,top:r.top,width:r.width,height:r.height};
    };
    const c=document.querySelector('#view');
    return {hud:measureG4E7HViewport(document.querySelector('.viewport')),
     machine:q('#machineCue'),edge:q('#edgeRadar'),speed:q('#speed'),chapter:q('#chapterHud'),
     viewport:document.querySelector('.viewport').getBoundingClientRect().toJSON(),
     canvas:c.getBoundingClientRect().toJSON(),
     pose:{time:document.querySelector('#simTime').textContent,stage:document.querySelector('#stage').value,
      spawn:document.querySelector('#spawn').value,physics:c.dataset.machineCount,
      camera:c.dataset.cameraMode,heading:c.dataset.cameraHeadingLagDegrees,
      mode:c.dataset.runMode,g4e7g:c.dataset.g4e7gMode},
     enabled:{typography:c.dataset.g4e7jTypography==='true',contours:c.dataset.g4e7jContours==='true'}};
   });
   expect(metrics.pose.time).toBe('0.00 s');
   expect(metrics.pose.physics).toBe('28');
   expect(metrics.machine.visible).toBe(true);
   expect(metrics.edge.visible).toBe(true);
   if(typography){
    expect(metrics.machine.font).toBeGreaterThanOrEqual(12);
    expect(metrics.edge.font).toBeGreaterThanOrEqual(12);
   }else{
    expect(metrics.machine.font).toBeLessThan(12);
    expect(metrics.edge.font).toBeLessThan(12);
   }
   const prefix='g4e7j-'+name+'-'+id;
   const viewPng=await viewport.screenshot({path:info.outputPath(prefix+'-hud.png')});
   const roadPng=await canvas.screenshot({path:info.outputPath(prefix+'-road.png')});
   captures.push({id,typography,contours,metrics,
    hudImage:prefix+'-hud.png',roadImage:prefix+'-road.png',
    hudBytes:viewPng.toString('base64'),roadBytes:roadPng.toString('base64')});
   poses.push(metrics.pose);
  }
  for(const pose of poses)expect(pose).toEqual(poses[0]);
  const metrics=captures.map(c=>c.metrics);
  for(let i=1;i<4;i++){
   for(const prop of ['machine','edge','speed','chapter'])
    expect(metrics[i][prop].text).toEqual(metrics[0][prop].text);
  }
  expect(metrics[0].machine.font).toBe(metrics[2].machine.font);
  expect(metrics[1].machine.font).toBe(metrics[3].machine.font);
  expect(metrics[0].edge.font).toBe(metrics[2].edge.font);
  expect(metrics[1].edge.font).toBe(metrics[3].edge.font);
  const diff=await page.evaluate(async(images)=>{
   const pix=async input=>{
    const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+input)).blob());
    const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
    const context=c.getContext('2d');context.drawImage(bitmap,0,0);
    return {w:c.width,h:c.height,data:context.getImageData(0,0,c.width,c.height).data};
   };
   const a=await Promise.all(images.map(pix));
   const compare=(i,j)=>{
    const x=a[i],y=a[j];if(x.w!==y.w||x.h!==y.h)throw Error('Unmatched canvas sizes');
    let n=0;for(let k=0;k<x.data.length;k+=4)if(Math.max(
     Math.abs(x.data[k]-y.data[k]),Math.abs(x.data[k+1]-y.data[k+1]),
     Math.abs(x.data[k+2]-y.data[k+2]))>24)n++;
    return {pixels:n,percent:Number((100*n/(x.w*x.h)).toFixed(4)),width:x.w,height:x.h};
   };
   return {typeOnly:compare(0,1),contourOnly:compare(0,2),both:compare(0,3),
    contoursWithLargeFont:compare(1,3)};
  },captures.map(c=>c.roadBytes));
  // Without the road paint, changing HTML fonts should not alter GL pixels.
  expect(diff.typeOnly.percent).toBeLessThan(2);
  expect(metrics[1].hud.percent).toBeLessThan(9);
  expect(metrics[3].hud.percent).toBeLessThan(9);
  await page.locator('#g4e7hFocusToggle').click();
  await expect(page.locator('#g4e7j-none')).toBeDisabled();
  await expect(canvas).toHaveAttribute('data-g4e7j-factor','off');
  runs.push({name,viewport:{width:w,height:h},hudOcclusionPercent:metrics.map(m=>m.hud.percent),
   typeFonts:metrics.map(m=>({machine:m.machine.font,edge:m.edge.font})),
   changedCanvasPixels:diff,scenarios:captures.map(({roadBytes,hudBytes,...rest})=>rest),
   physicsSame:true,noHumanLegibilityClaim:true});
  await ctx.close();
 }
 expect(errors).toEqual([]);
 const report={schema:'dopagaki.w9c2.g4e7j-orthogonal-visibility-webgl/1',
  runs,errors,realWebGL:true,
  fourConditions:['none','type','contour','both'],
  sameRunnerPoseAcrossFactors:true,physicallyModifiedRoads:false,
  selectedRoadType:'GLIDE_B48_F7F_SEPARATE_7_7_PROOF',
  hudPaintEffectsIndependent:true,realUserReadTime:'NOT_MEASURED',
  userFairness:'HOLD',officiallyApprovedSlopeDnaMeters:0,publish:'HOLD'};
 await fs.writeFile(info.outputPath('g4e7j-orthogonal-factor-audit.json'),JSON.stringify(report,null,2));
});
