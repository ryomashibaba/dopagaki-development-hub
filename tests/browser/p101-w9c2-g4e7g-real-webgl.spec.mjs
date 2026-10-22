import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('G4E7G default Gold/browser never exposes private road comparison',async({page})=>{
 await page.goto('/drive3d/?stage=VB-P101-A13-W9C2-G4E7G-GLIDE');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E7G-"]')).toHaveCount(0);
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7g-mode','off');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
});
test('G4E7G real WebGL same normalized road pose Gold vs Glide (NOT world-pose matched)',async({context},info)=>{
 test.setTimeout(250000);
 const records=[],errors=[],shots={};
 for(const point of ['skyline','crown']){
  shots[point]={};
  for(const kind of ['GOLD','GLIDE']){
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push({point,kind,error:e.message}));
   const id='VB-P101-A13-W9C2-G4E7G-'+kind;
   await page.goto('/drive3d/?g4e7g=on&g4e7gFrame=hold&g4e7gPoint='+point+'&stage='+id);
   await expect(page.locator('#appStatus')).toContainText('G4E-7G',{timeout:60000});
   const canvas=page.locator('#view');
   await expect(page.locator('#stage')).toHaveValue(id);
   await expect(canvas).toHaveAttribute('data-g4e7g-mode','STATIC_SAME_U_NOT_SAME_WORLD_POSE');
   await expect(canvas).toHaveAttribute('data-g4e7g-kind',kind.toLowerCase());
   await expect(canvas).toHaveAttribute('data-run-mode','private-visual-qa-not-human');
   await expect(canvas).toHaveAttribute('data-machine-count','28');
   await expect(page.locator('#pause')).toContainText('再開');
   await expect(page.locator('#demoRun')).toBeDisabled();
   await expect(page.locator('#spawn')).toContainText('VISUAL QA');
   const proof=await page.evaluate(async()=>{
    const id=document.querySelector('#stage').value,kind=id.endsWith('GOLD')?'GOLD':'GLIDE';
    const response=await fetch('../generated/P101_A13_W9C2_G4E7G_'+kind+'_LOCAL_VISUAL.json');
    if(!response.ok)throw Error('Private real-B48 G4E7G asset missing');
    const doc=await response.json(),v=doc.stageForge.g4e7gVisualTrial;
    const selected=Number(document.querySelector('#spawn').value),spawn=doc.spawns[selected];
    const {sample}=await import('../reference_only/director/surface.js');
    const road=doc.surfaces.find(s=>s.id===spawn.surface);
    const p=sample(road,spawn.u,spawn.v);
    const width=Math.hypot(...sample(road,spawn.u,0).map((n,i)=>n-sample(road,spawn.u,1)[i]));
    return {id,selected,spawn:{surface:spawn.surface,u:spawn.u,v:spawn.v},
     p,width,originalSpawns:v.originalSpawns,
     privateOnly:v.privateAssetOnly,approved:v.approvedSlopeDnaMeters,
     roads:doc.surfaces.length,machines:doc.movingObstacles.length,
     revision:doc.stageForge.revision,source:v.scriptedW7FFinishReferentialOnly,
     noHumanRun:doc.stageForge.humanPlaytest==='NOT_RUN'};
   });
   expect(proof.privateOnly).toBe(true);
   expect(proof.approved).toBe(0);expect(proof.noHumanRun).toBe(true);
   expect(proof.roads).toBe(7);expect(proof.machines).toBe(28);
   expect(proof.selected).toBe(proof.originalSpawns+(point==='crown'?1:0));
   expect(proof.spawn.u).toBe(point==='crown'?.15:.52);
   // Snapshot at zero elapsed simulated seconds, with the original ball-follow camera.
   await page.waitForTimeout(220);
   expect((await page.locator('#simTime').textContent()).trim()).toBe('0.00 s');
   const visual='g4e7g-'+point+'-'+kind.toLowerCase()+'-static.png';
   const png=await canvas.screenshot({path:info.outputPath(visual)});
   expect(png.length).toBeGreaterThan(1000);
   const mode=await canvas.evaluate(el=>({webgl2:Boolean(el.getContext('webgl2')),
    runMode:el.dataset.runMode,cameraMode:el.dataset.cameraMode,
    lag:el.dataset.cameraHeadingLagDegrees,scale:el.dataset.renderScale,
    g4e7gMode:el.dataset.g4e7gMode,moving:el.dataset.machineCount}));
   expect(mode.webgl2).toBe(true);
   shots[point][kind]={png:png.toString('base64'),proof,mode,visual};
   await page.locator('#pause').click();
   await page.waitForTimeout(1000);
   await page.locator('#pause').click();
   const shortTime=Number.parseFloat((await page.locator('#simTime').textContent()).trim());
   const shortName='g4e7g-'+point+'-'+kind.toLowerCase()+'-neutral-1s.png';
   await canvas.screenshot({path:info.outputPath(shortName)});
   records.push({point,kind,proof,mode,shortTime,images:[visual,shortName],
    visualStart:'LOCAL_52MPS_NONCANONICAL_SPAWN',input:'NEUTRAL_NO_AUTOPILOT',
    originalStart00Native7of7:'SEPARATELY_VERIFIED_NOT_THIS_RUN'});
   await page.close();
  }
 }
 const comparisons=[];
 for(const point of ['skyline','crown']){
  const a=shots[point].GOLD,b=shots[point].GLIDE;
  const delta=Math.hypot(...a.proof.p.map((v,i)=>v-b.proof.p[i]));
  expect(delta).toBeGreaterThan(1);
  const pixels=await context.pages()[0].evaluate(async({a,b})=>{
   const read=async s=>{
    const blob=await(await fetch('data:image/png;base64,'+s)).blob();
    const image=await createImageBitmap(blob);
    const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
    const ctx=c.getContext('2d');ctx.drawImage(image,0,0);
    return {w:c.width,h:c.height,bytes:ctx.getImageData(0,0,c.width,c.height).data};
   };
   const x=await read(a),y=await read(b);if(x.w!==y.w||x.h!==y.h)throw Error('Unmatched image sizes');
   let changed=0;
   for(let i=0;i<x.bytes.length;i+=4)if(Math.max(...[0,1,2].map(j=>Math.abs(x.bytes[i+j]-y.bytes[i+j])))>24)changed++;
   return {size:[x.w,x.h],pixelsChanged:changed,percent:100*changed/(x.w*x.h)};
  },{a:a.png,b:b.png});
  comparisons.push({point,samePhysicalNormalizedU:true,identicalWorldPose:false,
   exactSameCameraWorldCoordinates:false,sameRenderCameraAlgorithm:true,
   xyzDifferenceMeters:delta,realRoadPixelDifference:pixels});
  expect(pixels.pixelsChanged).toBeGreaterThan(50);
 }
 const result={schema:'dopagaki.w9c2.g4e7g-webgl-visual-evidence/1',
  records,comparisons,errors,nonpublishing:true,
  sameWorldPoseClaim:false,headlessActualWebGL:true,
  humanDriven:false,windowsHumanFps:'NOT_MEASURED',
  sceneryQuality:'UNVERIFIED',humanFairness:'HOLD',approvedSlopeDnaMeters:0};
 await fs.writeFile(info.outputPath('g4e7g-real-webgl-visual-audit.json'),JSON.stringify(result,null,2));
 expect(errors).toEqual([]);
});
