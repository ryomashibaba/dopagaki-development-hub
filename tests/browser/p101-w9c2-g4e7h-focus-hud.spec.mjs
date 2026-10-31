import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('G4E7H HUD focus remains unavailable in default Gold, even with focus query',async({page})=>{
 await page.goto('/drive3d/?g4e7h=candidate&stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#g4e7hFocusToggle')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('.viewport')).not.toHaveAttribute('data-g4e7h-mode','focus');
});

test('G4E7H 8 actual WebGL baseline/focus matched physical pose pairs retain warning text',async({context},info)=>{
 test.setTimeout(260000);
 const cases=[],errors=[];
 for(const point of ['skyline','crown'])for(const kind of ['GOLD','GLIDE']){
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push({point,kind,error:e.message}));
  const stage='VB-P101-A13-W9C2-G4E7G-'+kind;
  await page.goto('/drive3d/?g4e7g=on&g4e7gFrame=hold&g4e7h=candidate&g4e7gPoint='+
   point+'&stage='+stage);
  const view=page.locator('#view'),viewport=page.locator('.viewport'),toggle=page.locator('#g4e7hFocusToggle');
  await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:60000});
  await expect(view).toHaveAttribute('data-g4e7g-mode','STATIC_SAME_U_NOT_SAME_WORLD_POSE');
  await expect(view).toHaveAttribute('data-g4e7h-mode','baseline');
  await expect(view).toHaveAttribute('data-machine-count','28');
  await expect(view).toHaveAttribute('data-run-mode','private-visual-qa-not-human');
  await expect(toggle).toBeVisible();
  await expect(page.locator('#pause')).toContainText('再開');
  await expect(page.locator('#simTime')).toHaveText('0.00 s');
  const originalTexts=await page.evaluate(()=>({
   machine:document.querySelector('#machineCue').textContent,
   edge:document.querySelector('#edgeRadar').textContent,
   chapter:document.querySelector('#chapterHud').textContent,
   speed:document.querySelector('#speed').textContent
  }));
  const measure=()=>page.evaluate(async()=>{
   const {measureG4E7HViewport}=await import('./p101-w9c2-g4e7h-hud-focus.mjs');
   return measureG4E7HViewport(document.querySelector('.viewport'));
  });
  await page.waitForTimeout(160);
  const physics0=await view.evaluate(el=>({
   time:document.querySelector('#simTime').textContent,
   stage:document.querySelector('#stage').value,
   spawn:document.querySelector('#spawn').value,
   runMode:el.dataset.runMode,cameraMode:el.dataset.cameraMode,
   kind:el.dataset.g4e7gKind,physical:el.dataset.machineCount
  }));
  const baseline=await measure();
  const beforeName='g4e7h-'+point+'-'+kind.toLowerCase()+'-baseline.png';
  const baselineImg=await view.screenshot({path:info.outputPath(beforeName)});
  await toggle.click();
  await expect(viewport).toHaveAttribute('data-g4e7h-mode','focus');
  await expect(view).toHaveAttribute('data-g4e7h-mode','focus');
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.righttag')).toHaveCSS('display','none');
  await expect(page.locator('#machineCue')).not.toHaveCSS('display','none');
  await expect(page.locator('#edgeRadar')).not.toHaveCSS('display','none');
  const focus=await measure();
  const afterName='g4e7h-'+point+'-'+kind.toLowerCase()+'-focus.png';
  const focusImg=await view.screenshot({path:info.outputPath(afterName)});
  const physics1=await view.evaluate(el=>({
   time:document.querySelector('#simTime').textContent,
   stage:document.querySelector('#stage').value,
   spawn:document.querySelector('#spawn').value,
   runMode:el.dataset.runMode,cameraMode:el.dataset.cameraMode,
   kind:el.dataset.g4e7gKind,physical:el.dataset.machineCount
  }));
  expect(physics1).toEqual(physics0);
  expect(physics1.time).toBe('0.00 s');
  const afterTexts=await page.evaluate(()=>({
   machine:document.querySelector('#machineCue').textContent,
   edge:document.querySelector('#edgeRadar').textContent,
   chapter:document.querySelector('#chapterHud').textContent,
   speed:document.querySelector('#speed').textContent
  }));
  expect(afterTexts).toEqual(originalTexts);
  expect(baseline.percent).toBeGreaterThan(1);
  expect(focus.percent).toBeLessThan(baseline.percent);
  const pixelChange=await page.evaluate(async({a,b})=>{
   const read=async input=>{
    const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+input)).blob());
    const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
    const ctx=c.getContext('2d');ctx.drawImage(bitmap,0,0);
    return {w:c.width,h:c.height,p:ctx.getImageData(0,0,c.width,c.height).data};
   };
   const x=await read(a),y=await read(b);
   if(x.w!==y.w||x.h!==y.h)throw Error('Paired screenshot mismatch');
   let changed=0;
   for(let i=0;i<x.p.length;i+=4)if(Math.max(
    Math.abs(x.p[i]-y.p[i]),Math.abs(x.p[i+1]-y.p[i+1]),
    Math.abs(x.p[i+2]-y.p[i+2]))>24)changed++;
   return {width:x.w,height:x.h,changed,
    changedPercent:Number((100*changed/(x.w*x.h)).toFixed(3))};
  },{a:baselineImg.toString('base64'),b:focusImg.toString('base64')});
  expect(pixelChange.changed).toBeGreaterThan(100);
  // Verify reversible experiment at exactly the same pose.
  await toggle.click();
  await expect(viewport).toHaveAttribute('data-g4e7h-mode','baseline');
  await expect(page.locator('.righttag')).not.toHaveCSS('display','none');
  cases.push({point,kind,baseline,focus,pixelChange,images:[beforeName,afterName],
   physicsPoseUnchanged:true,warningTextUnchanged:true,
   humanFps:'NOT_MEASURED',humanFairness:'HOLD'});
  await page.close();
 }
 expect(errors).toEqual([]);
 const report={schema:'dopagaki.w9c2.g4e7h-focus-hud-webgl/1',cases,errors,
  samePhysicalPosePerBaselineFocus:true,
  differentWorldPositionsBetweenGoldAndGlide:true,
  hardwareFps:'NOT_MEASURED',humanLegibility:'NOT_CERTIFIED',humanFairness:'HOLD',
  visualProposedOnly:true,physicsMutated:false,approvedSlopeDnaMeters:0,
  publish:'HOLD'};
 await fs.writeFile(info.outputPath('g4e7h-same-pose-focus-hud-audit.json'),
  JSON.stringify(report,null,2));
});
