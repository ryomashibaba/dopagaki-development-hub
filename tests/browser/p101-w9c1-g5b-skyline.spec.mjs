import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

// G5-B remains URL-only and OFF by default. Same stage, spawn, clock & camera.
// Pixel differences prove rendering, NOT whether humans prefer the candidate.
test('W9-C1 G5-B opt-in WebGL skyline: isolated matched images and no physics adoption',async({context},info)=>{
 test.setTimeout(180000);
 const evidence=[],errors=[];
 for(const kind of ['CONTROL','ULTRA']){
  const shots={};
  for(const mode of ['off','on']){
   const page=await context.newPage();
   page.on('pageerror',err=>errors.push(err.message));
   await page.clock.install({time:new Date('2026-10-19T00:00:00Z')});
   await page.clock.pauseAt(new Date('2026-10-19T00:00:01Z'));
   await page.goto('/drive3d/?stage=VB-P101-A13-W9C1-'+kind+'&g5b='+mode);
   // Stage loading deliberately waits for requestAnimationFrame; a paused
   // Playwright clock cannot reach that callback without runFor().
   for(let i=0;i<150;i++){
    await page.clock.runFor(100);
    if((await page.locator('#appStatus').textContent()).includes('W9-C1 ABYSS DIVE'))break;
   }
   await expect(page.locator('#appStatus')).toContainText('W9-C1 ABYSS DIVE',{timeout:15000});
   const view=page.locator('#view');
   await expect(view).toHaveAttribute('data-g5b-mode',mode==='on'?'candidate':'off');
   await expect(view).toHaveAttribute('data-g5b-non-collision','true');
   await expect(view).toHaveAttribute('data-machine-count','28');
   await expect(view).toHaveAttribute('data-w9c1-isolated','true');
   const stats=await view.evaluate(el=>({
    stations:Number(el.dataset.g5bStations),triangles:Number(el.dataset.g5bTriangles),
    clearance:Number(el.dataset.g5bClearance),nonCollision:el.dataset.g5bNonCollision,
    physicalRoadWidth:Number(el.dataset.w9c1Width),runMode:el.dataset.runMode
   }));
   if(mode==='on'){
    expect(stats.stations).toBeGreaterThan(40);
    expect(stats.triangles).toBeGreaterThan(3000);
    expect(stats.clearance).toBeGreaterThanOrEqual(65);
   }else{
    expect(stats.stations).toBe(0);
    expect(stats.triangles).toBe(0);
   }
   await page.locator('#spawn').selectOption('7'); // 320m visual preview only
   await page.locator('#pause').click();
   await page.clock.runFor(32);
   await expect(page.locator('#simTime')).toContainText('0.00');
   const filename='w9c1-g5b-'+kind.toLowerCase()+'-320m-'+mode+'.png';
   shots[mode]=(await view.screenshot({path:info.outputPath(filename)})).toString('base64');
   evidence.push({kind,mode,stats,image:filename});
   if(mode==='on'){
    // Switching away from W9-C1 must not leak candidate architecture to Gold.
    await page.locator('#stage').selectOption('VB-P101-A13');
    for(let i=0;i<100;i++){
     await page.clock.runFor(100);
     if((await view.getAttribute('data-g5b-mode'))==='off')break;
    }
    await expect(view).toHaveAttribute('data-g5b-mode','off');
    await expect(view).toHaveAttribute('data-g5b-triangles','0');
   }
   await page.close();
  }
  const reader=await context.newPage();
  const delta=await reader.evaluate(async({a,b})=>{
   const pixels=async encoded=>{
    const image=await createImageBitmap(await(await fetch('data:image/png;base64,'+encoded)).blob());
    const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
    return {width:canvas.width,height:canvas.height,data:ctx.getImageData(0,0,canvas.width,canvas.height).data};
   };
   const old=await pixels(a),next=await pixels(b);
   if(old.width!==next.width||old.height!==next.height)throw Error('G5-B compared different resolutions');
   let changed=0,forward=0;
   for(let i=0;i<old.data.length;i+=4){
    const v=Math.max(...[0,1,2].map(k=>Math.abs(old.data[i+k]-next.data[i+k])));
    if(v>20){changed++;if(Math.floor(i/4/old.width)<old.height*.75)forward++;}
   }
   return {width:old.width,height:old.height,changed,forward};
  },{a:shots.off,b:shots.on});
  expect(delta.changed).toBeGreaterThan(100);
  expect(delta.forward).toBeGreaterThan(50);
  evidence.push({kind,matchedSameSpawn:true,renderDifference:delta,
    humanFairness:'HOLD',qualityPreference:'UNASSESSED'});
  await reader.close();
 }
 await fs.writeFile(info.outputPath('w9c1-g5b-visual-audit.json'),JSON.stringify({
  schema:'dopagaki.w9c1-g5b-visual-audit/1',evidence,errors,
  onByDefault:false,physicsModified:false,humanApproval:'HOLD',
  claim:'Matched WebGL pixel differences and source isolation only, not human perceptual or FPS approval'
 },null,2));
 expect(errors).toEqual([]);
});
