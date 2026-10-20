import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

/**
 * G4D: matched real Chromium WebGL frames at Gold W7F road-IV spawn.
 * Frozen clock makes the comparison deterministic, NOT an FPS benchmark.
 * Human visual quality and player fairness remain HOLD.
 */
test('W9-C2 G4D Gold-only same-camera off/on actual WebGL screenshots',async({context},info)=>{
 test.setTimeout(180000);
 const results=[],errors=[],images={};
 for(const mode of ['off','on']){
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:new Date('2026-10-20T00:00:00Z')});
  await page.clock.pauseAt(new Date('2026-10-20T00:00:01Z'));
  await page.goto('/drive3d/?stage=VB-P101-A13&g4d='+mode);
  const view=page.locator('#view');
  for(let i=0;i<150;i++){
   await page.clock.runFor(100);
   if((await page.locator('#appStatus').textContent()).includes('P101 A13 W7F'))break;
  }
  await expect(page.locator('#appStatus')).toContainText('P101 A13 W7F',{timeout:15000});
  await expect(view).toHaveAttribute('data-g4d-mode',mode==='on'?'visual-candidate':'off');
  await expect(view).toHaveAttribute('data-g4d-non-collision','true');
  await expect(view).toHaveAttribute('data-machine-count','28');
  // Isolate the new skyway layer from legacy P82 skyline occlusion in both modes.
  await page.locator('#megaWorld').click();
  await expect(page.locator('#megaWorld')).toContainText('OFF');
  await page.locator('#spawn').selectOption('3');
  await page.locator('#pause').click();
  await page.clock.runFor(40);
  await expect(page.locator('#simTime')).toContainText('0.00');
  const stats=await view.evaluate(el=>({
   mode:el.dataset.g4dMode,slabs:Number(el.dataset.g4dSlabs),
   gaps:Number(el.dataset.g4dGaps),landmarks:Number(el.dataset.g4dLandmarks),
   triangles:Number(el.dataset.g4dTriangles),nonCollision:el.dataset.g4dNonCollision,
   stageId:el.parentElement.dataset.stageId,renderScale:el.dataset.renderScale,
   cameraMode:el.dataset.cameraMode
  }));
  if(mode==='on'){
   expect(stats.slabs).toBeGreaterThan(85);
   expect(stats.gaps).toBeGreaterThanOrEqual(15);
   expect(stats.landmarks).toBe(4);
   expect(stats.triangles).toBeGreaterThan(1000);
  }else{
   expect(stats.slabs).toBe(0);expect(stats.triangles).toBe(0);
  }
  const name='w9c2-g4d-gold-roadIV-'+mode+'.png';
  images[mode]=(await view.screenshot({path:info.outputPath(name)})).toString('base64');
  results.push({mode,stats,image:name,matchedGoldSpawn:3,legacyMegaWorld:'OFF'});
  if(mode==='on'){
   await page.locator('#stage').selectOption('VB-P101-A13-W9C1-CONTROL');
   for(let i=0;i<150;i++){
    await page.clock.runFor(100);
    if((await view.getAttribute('data-g4d-mode'))==='off')break;
   }
   await expect(view).toHaveAttribute('data-g4d-mode','off');
   await expect(view).toHaveAttribute('data-g4d-triangles','0');
  }
  await page.close();
 }
 const reader=await context.newPage();
 const difference=await reader.evaluate(async({a,b})=>{
  const pixels=async encoded=>{
   const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+encoded)).blob());
   const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
   const ctx=c.getContext('2d');ctx.drawImage(bitmap,0,0);
   return {w:c.width,h:c.height,data:ctx.getImageData(0,0,c.width,c.height).data};
  };
  const x=await pixels(a),y=await pixels(b);
  if(x.w!==y.w||x.h!==y.h)throw Error('Different screenshot dimensions');
  let changed=0,top=0,center=0;
  for(let i=0;i<x.data.length;i+=4){
   const d=Math.max(Math.abs(x.data[i]-y.data[i]),
    Math.abs(x.data[i+1]-y.data[i+1]),Math.abs(x.data[i+2]-y.data[i+2]));
   if(d>20){
    changed++;
    const row=Math.floor(i/4/x.w),column=(i/4)%x.w;
    if(row<x.h*.65)top++;
    if(row>x.h*.25&&row<x.h*.75&&column>x.w*.25&&column<x.w*.75)center++;
   }
  }
  return {width:x.w,height:x.h,changedPixels:changed,upperSkyPixels:top,
   centralViewPixels:center,changedPercent:100*changed/(x.w*x.h)};
 },{a:images.off,b:images.on});
 // Geometry could be completely fog-hidden or behind camera; that is a
 // meaningful failure. We record evidence before asserting visibility.
 await fs.writeFile(info.outputPath('w9c2-g4d-real-webgl-audit.json'),
  JSON.stringify({schema:'dopagaki.w9c2.g4d-webgl-visual-audit/1',
   results,difference,errors,actualWebGL:true,syntheticPausedClock:true,legacyMegaWorld:'OFF',
   fpsMeasured:false,physicsModified:false,playableNewRoad:false,
   productionApproved:false,humanVisualQuality:'HOLD',
   note:'Screenshots compare same camera/spawn. Pixel change is not human quality approval.'},null,2));
 expect(errors).toEqual([]);
 expect(difference.changedPixels).toBeGreaterThan(50);
 expect(difference.upperSkyPixels).toBeGreaterThan(20);
 await reader.close();
});
