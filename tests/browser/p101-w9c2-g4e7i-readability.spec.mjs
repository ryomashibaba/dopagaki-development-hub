import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('G4E7I off on default game / Gold / external opt-in absent',async({page})=>{
 await page.goto('/drive3d/?g4e7i=candidate&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#g4e7iLegibilityToggle')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await page.goto('/drive3d/?g4e7g=on&g4e7h=candidate&g4e7i=candidate&g4e7gFrame=hold&stage=VB-P101-A13-W9C2-G4E7G-GOLD');
 await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:60000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7i-geometry-eligible','false');
 await expect(page.locator('#g4e7iLegibilityToggle')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7i-mode','off');
});

test('G4E7I GLIDE Skyline real WebGL physical-pose legible A/B, including narrow viewport',async({browser},info)=>{
 test.setTimeout(240000);
 const errors=[],runs=[];
 for(const [point,width,height] of [['skyline',1300,780],['crown',1300,780],['skyline-mobile',420,760]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push({point,error:e.message}));
  const spot=point.startsWith('skyline')?'skyline':'crown';
  const url='/drive3d/?g4e7g=on&g4e7h=candidate&g4e7i=candidate&g4e7gFrame=hold&g4e7gPoint='+
   spot+'&stage=VB-P101-A13-W9C2-G4E7G-GLIDE';
  await page.goto(url);
  const view=page.locator('#view'),focus=page.locator('#g4e7hFocusToggle'),
   legible=page.locator('#g4e7iLegibilityToggle');
  await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:60000});
  await expect(view).toHaveAttribute('data-g4e7g-mode','STATIC_SAME_U_NOT_SAME_WORLD_POSE');
  await expect(view).toHaveAttribute('data-g4e7i-geometry-eligible','true');
  await expect(view).toHaveAttribute('data-g4e7i-triangles','52');
  await expect(view).toHaveAttribute('data-g4e7i-non-collision','true');
  await expect(view).toHaveAttribute('data-run-mode','private-visual-qa-not-human');
  await expect(view).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  await expect(legible).toBeDisabled();
  await focus.click();
  await expect(view).toHaveAttribute('data-g4e7h-mode','focus');
  await expect(view).toHaveAttribute('data-g4e7i-mode','baseline');
  await expect(legible).toBeEnabled();
  const metric=async()=>page.evaluate(async()=>{
   const {measureG4E7HViewport}=await import('./p101-w9c2-g4e7h-hud-focus.mjs');
   const dom=document.querySelector('.viewport'),c=document.querySelector('#view');
   const get=q=>{
    const el=document.querySelector(q),style=getComputedStyle(el),r=el.getBoundingClientRect();
    return {text:el.textContent,font:parseFloat(style.fontSize),visible:style.display!=='none',
     rect:{left:r.left,top:r.top,right:r.right,bottom:r.bottom}};
   };
   return {hud:measureG4E7HViewport(dom),hazard:get('#machineCue'),
    edge:get('#edgeRadar'),speed:get('#speed'),chapter:get('#chapterHud'),
    phys:{time:document.querySelector('#simTime').textContent,spawn:document.querySelector('#spawn').value,
     stage:document.querySelector('#stage').value,camera:c.dataset.cameraMode,
     heading:c.dataset.cameraHeadingLagDegrees,runMode:c.dataset.runMode,machines:c.dataset.machineCount}};
  });
  await page.waitForTimeout(120);
  const before=await metric();
  const beforeName='g4e7i-'+point+'-glide-focus-baseline.png';
  const a=await view.screenshot({path:info.outputPath(beforeName)});
  await legible.click();
  await expect(view).toHaveAttribute('data-g4e7i-mode','legible');
  await expect(legible).toHaveAttribute('aria-pressed','true');
  const after=await metric();
  const afterName='g4e7i-'+point+'-glide-legible-contours.png';
  const b=await view.screenshot({path:info.outputPath(afterName)});
  expect(after.phys).toEqual(before.phys);
  expect(after.phys.time).toBe('0.00 s');
  expect(after.hazard.text).toEqual(before.hazard.text);
  expect(after.edge.text).toEqual(before.edge.text);
  expect(after.chapter.text).toEqual(before.chapter.text);
  expect(after.speed.text).toEqual(before.speed.text);
  expect(after.hazard.font).toBeGreaterThanOrEqual(12);
  expect(after.edge.font).toBeGreaterThanOrEqual(12);
  expect(after.hazard.font).toBeGreaterThan(before.hazard.font);
  expect(after.edge.font).toBeGreaterThan(before.edge.font);
  expect(after.hud.percent).toBeLessThan(8); // visual overlay area, not human legibility
  expect(after.hazard.visible).toBe(true);
  expect(after.edge.visible).toBe(true);
  const diff=await page.evaluate(async({a,b})=>{
   const read=async str=>{
    const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+str)).blob());
    const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
    return {w:canvas.width,h:canvas.height,p:ctx.getImageData(0,0,canvas.width,canvas.height).data};
   };
   const first=await read(a),second=await read(b);
   if(first.w!==second.w||first.h!==second.h)throw Error('Screenshot dimensions drift');
   let changed=0;
   for(let i=0;i<first.p.length;i+=4)if(Math.max(
    Math.abs(first.p[i]-second.p[i]),Math.abs(first.p[i+1]-second.p[i+1]),
    Math.abs(first.p[i+2]-second.p[i+2]))>24)changed++;
   return {width:first.w,height:first.h,pixelsChanged:changed,
    changedPercent:Number((100*changed/(first.w*first.h)).toFixed(3))};
  },{a:a.toString('base64'),b:b.toString('base64')});
  expect(diff.pixelsChanged).toBeGreaterThan(100);
  await legible.click();
  await expect(view).toHaveAttribute('data-g4e7i-mode','baseline');
  await focus.click();
  await expect(legible).toBeDisabled();
  runs.push({point,viewport:{width,height},before,after,diff,
   images:[beforeName,afterName],realSkylineB48Cues:true,
   humanReaction:'NOT_TESTED',hardwareFps:'NOT_CERTIFIED'});
  await context.close();
 }
 expect(errors).toEqual([]);
 await fs.writeFile(info.outputPath('g4e7i-readability-real-webgl.json'),
  JSON.stringify({schema:'dopagaki.w9c2.g4e7i-readable-hud-road-contours/1',
   runs,errors,humanFairness:'HOLD',cameraUnmodified:true,approvedSlopeDnaMeters:0,
   publish:'HOLD',realB48PhysicsNotModified:true},null,2));
});
