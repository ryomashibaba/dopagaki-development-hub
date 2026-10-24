import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('G4E-7K cannot activate on ordinary game or private Gold',async({page})=>{
 await page.goto('/drive3d/?g4e7k=quiet&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#g4e7kQuietToggle')).toHaveCount(0);
 await page.goto('/drive3d/?g4e7g=on&g4e7k=quiet&g4e7gFrame=hold&stage=VB-P101-A13-W9C2-G4E7G-GOLD');
 await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:65000});
 await expect(page.locator('#g4e7kQuietToggle')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7k-mode','off');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7k-quiet-chevrons','0');
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
});

test('G4E-7K real GLIDE GPU A/B: quiet inner decorations, identical physical position and full warning',async({browser},info)=>{
 test.setTimeout(260000);
 const result=[],errors=[];
 for(const [point,w,h] of [['skyline',1300,780],['crown',1300,780],['skyline-mobile',420,760]]){
  const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const page=await context.newPage();page.on('pageerror',e=>errors.push({point,error:e.message}));
  const location=point.startsWith('skyline')?'skyline':'crown';
  await page.goto('/drive3d/?g4e7g=on&g4e7k=quiet&g4e7gFrame=hold&g4e7gPoint='+location+'&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
  const canvas=page.locator('#view'),viewport=page.locator('.viewport'),toggle=page.locator('#g4e7kQuietToggle');
  await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:65000});
  await expect(canvas).toHaveAttribute('data-g4e7g-mode','STATIC_SAME_U_NOT_SAME_WORLD_POSE');
  await expect(canvas).toHaveAttribute('data-g4e7k-mode','baseline');
  await expect(canvas).toHaveAttribute('data-g4e7k-non-collision','true');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  await expect(toggle).toBeVisible();
  const before=await page.evaluate(async()=>{
   const stage=await(await fetch('../generated/P101_A13_W9C2_G4E7G_GLIDE_LOCAL_VISUAL.json')).json();
   const c=document.querySelector('#view');
   const {sample}=await import('../reference_only/director/surface.js');
   const spawn=stage.spawns[Number(document.querySelector('#spawn').value)];
   const road=stage.surfaces.find(s=>s.id===spawn.surface);
   const r={time:document.querySelector('#simTime').textContent,kind:c.dataset.g4e7gKind,
    stage:document.querySelector('#stage').value,spawn:document.querySelector('#spawn').value,
    camera:c.dataset.cameraMode,lag:c.dataset.cameraHeadingLagDegrees,
    machineCount:c.dataset.machineCount,roadXYZ:sample(road,spawn.u,spawn.v)};
   return {physics:r,fullWarn:document.querySelector('#machineCue').textContent,
    roadWarn:document.querySelector('#edgeRadar').textContent,
    artRemovedTriangles:Number(c.dataset.g4e7kTriangleReduction),
    chevronCount:Number(c.dataset.g4e7kQuietChevrons)};
  });
  expect(before.physics.time).toBe('0.00 s');
  expect(before.artRemovedTriangles).toBeGreaterThan(0);
  expect(before.chevronCount).toBeGreaterThanOrEqual(3);
  const capture=async suffix=>{
   const prefix='g4e7k-'+point+'-'+suffix;
   const withHud=await viewport.screenshot({path:info.outputPath(prefix+'-hud.png')});
   await page.evaluate(()=>{
    const style=document.createElement('style');style.id='g4e7k-pure-gl';
    style.textContent='.viewport > :not(canvas){visibility:hidden!important}';
    document.head.append(style);
   });
   const pure=await canvas.screenshot({path:info.outputPath(prefix+'-road.png')});
   await page.evaluate(()=>document.querySelector('#g4e7k-pure-gl').remove());
   return {withHud:withHud.toString('base64'),pure:pure.toString('base64'),
    files:[prefix+'-hud.png',prefix+'-road.png']};
  };
  await page.waitForTimeout(120);
  const base=await capture('baseline');
  await toggle.click();
  await expect(canvas).toHaveAttribute('data-g4e7k-mode','quiet');
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await page.waitForTimeout(120);
  const quiet=await capture('quiet');
  const after=await page.evaluate(()=>({time:document.querySelector('#simTime').textContent,
   kind:document.querySelector('#view').dataset.g4e7gKind,stage:document.querySelector('#stage').value,
   spawn:document.querySelector('#spawn').value,
   camera:document.querySelector('#view').dataset.cameraMode,
   lag:document.querySelector('#view').dataset.cameraHeadingLagDegrees,
   machineCount:document.querySelector('#view').dataset.machineCount,
   fullWarn:document.querySelector('#machineCue').textContent,
   roadWarn:document.querySelector('#edgeRadar').textContent}));
  for(const key of ['time','kind','stage','spawn','camera','lag','machineCount'])
   expect(after[key]).toEqual(before.physics[key]);
  expect(after.fullWarn).toEqual(before.fullWarn);
  expect(after.roadWarn).toEqual(before.roadWarn);
  const diff=await page.evaluate(async ({a,b})=>{
   const read=async s=>{
    const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+s)).blob());
    const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
    const cx=c.getContext('2d');cx.drawImage(bitmap,0,0);
    return {width:c.width,height:c.height,data:cx.getImageData(0,0,c.width,c.height).data};
   };
   const x=await read(a),y=await read(b);
   if(x.width!==y.width||x.height!==y.height)throw Error('G4E7K differing GL capture dimensions');
   let changed=0;
   for(let i=0;i<x.data.length;i+=4)if(Math.max(...[0,1,2].map(j=>Math.abs(x.data[i+j]-y.data[i+j])))>24)changed++;
   return {pixels:changed,percent:Number((changed*100/(x.width*x.height)).toFixed(4)),
    size:[x.width,x.height]};
  },{a:base.pure,b:quiet.pure});
  if(location==='skyline')expect(diff.pixels).toBeGreaterThan(30);
  await toggle.click();await expect(canvas).toHaveAttribute('data-g4e7k-mode','baseline');
  result.push({point,viewport:{width:w,height:h},changedPureGL:diff,chevronsRemoved:before.chevronCount,
   trianglesSaved:before.artRemovedTriangles,originalPhysicalSample:before.physics.roadXYZ,
   unchangedPhysicalPose:true,warningsIdentical:true,
   screenshots:[...base.files,...quiet.files],humanFairness:'HOLD'});
  await context.close();
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7k-quiet-skyline-real-webgl.json'),
  JSON.stringify({schema:'dopagaki.w9c2.g4e7k-quiet-webgl/1',
   source:'true collidable GLIDE 300m previous G4E7F, GL only removes chevrons',
   studies:result,errors,officiallyApprovedSlopeDnaMeters:0,
   humanSkill:'NOT_TESTED',humanVisualQuality:'HOLD',publish:'HOLD'},null,2));
});
