import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

/**
 * G4E-7A: actual WebGL evidence from private real-B48 gap stages only.
 * This is not a scripted completion run, human driving session, real-world
 * FPS benchmark, or certification that the jump is visually recognizable.
 */
test('G4E7A: authentic local WebGL gap imagery and non-autopilot runtime',async({context},info)=>{
 test.setTimeout(180000);
 const results=[],errors=[],sourceImages={};
 for(const id of ['C0-55-1','B0-65-1']){
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push({id,message:e.message}));
  const stage='VB-P101-A13-W9C2-G4E6-'+id;
  await page.goto('/drive3d/?g4e6=on&stage='+stage);
  await expect(page.locator('#appStatus')).toContainText('G4E-6 ローカル限定比較',{timeout:60000});
  const view=page.locator('#view');
  await expect(view).toHaveAttribute('data-machine-count','28');
  await expect(view).toHaveAttribute('data-run-mode','manual');
  await expect(page.locator('#spawn')).toHaveValue('0');
  const physical=await page.evaluate(async id=>{
   const response=await fetch('../generated/P101_A13_W9C2_G4E6_'+id+'_LOCAL_TRIAL.json');
   if(!response.ok)throw Error('Private G4E6 asset missing');
   const stage=await response.json(),g=stage.stageForge.g4e6EarlyGap;
   return {id:g.id,section:g.section,gapMeters:g.gapMeters,
    voidCells:stage.surfaces[g.section].voidLongitudinalCells,
    physicalOpen:g.actualOpenB48Collision,
    noMidpointSupport:g.noMidpointRideableSupport,
    sameRoadContinuation:g.continuationOnSameOriginalRoad,
    humanPlaytest:stage.stageForge.humanPlaytest,
    promoted:stage.stageForge.productionPromoted,
    roads:stage.surfaces.length,machines:stage.movingObstacles.length};
  },id);
  expect(physical).toMatchObject({id,physicalOpen:true,noMidpointSupport:true,
   sameRoadContinuation:true,humanPlaytest:'NOT_RUN',promoted:false,roads:7,machines:28});
  expect(physical.voidCells.length).toBe(1);
  const captures=[];
  const capture=async label=>{
   const imageName='g4e7a-'+id+'-'+label+'.png';
   const bytes=await view.screenshot({path:info.outputPath(imageName)});
   expect(bytes.length).toBeGreaterThan(1000);
   const gl=await view.evaluate(node=>({
    webgl2:Boolean(node.getContext('webgl2')),
    runMode:node.dataset.runMode,outcome:node.dataset.runOutcome,
    cameraMode:node.dataset.cameraMode,
    cameraHeadingLagDegrees:node.dataset.cameraHeadingLagDegrees,
    renderScale:node.dataset.renderScale,machineCount:node.dataset.machineCount
   }));
   expect(gl.webgl2).toBe(true);
   expect(gl.machineCount).toBe('28');
   captures.push({image:imageName,simSeconds:await page.locator('#simTime').textContent(),
    indicatedFps:await page.locator('#fps').textContent(),gl});
   return bytes.toString('base64');
  };
  await page.locator('#pause').click();
  sourceImages[id]=await capture('start00');
  await page.locator('#pause').click();
  // Genuine browser-run physics, neutral input; may fail before reaching gap.
  await page.waitForTimeout(2200);
  await page.locator('#pause').click();
  await capture('neutral-short-run');
  results.push({id,physical,captures,input:'NEUTRAL_REAL_BROWSER_NO_AUTOSTEER',
   humanFairness:'HOLD',humanSawGap:'UNMEASURED',
   takeoffAndLandingObservedByThisTest:false,
   hardwareFpsCertified:false,fullStart00NativeFinishFromThisTest:false});
  await page.close();
 }
 // Matched initial camera/spawn; pixels show presentation changes but cannot
 // demonstrate 2-second visual warning at the actual takeoff site.
 const reader=await context.newPage();
 const matched=await reader.evaluate(async({a,b})=>{
  const pixels=async encoded=>{
   const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+encoded)).blob());
   const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
   const x=c.getContext('2d');x.drawImage(bitmap,0,0);
   return {w:c.width,h:c.height,data:x.getImageData(0,0,c.width,c.height).data};
  };
  const x=await pixels(a),y=await pixels(b);
  if(x.w!==y.w||x.h!==y.h)throw Error('Mismatched capture dimensions');
  let changed=0;
  for(let i=0;i<x.data.length;i+=4){
   const max=Math.max(Math.abs(x.data[i]-y.data[i]),
    Math.abs(x.data[i+1]-y.data[i+1]),Math.abs(x.data[i+2]-y.data[i+2]));
   if(max>20)changed++;
  }
  return {width:x.w,height:x.h,changedPixels:changed,
   changedPercent:changed*100/(x.w*x.h)};
 },{a:sourceImages['C0-55-1'],b:sourceImages['B0-65-1']});
 await reader.close();
 const report={schema:'dopagaki.w9c2.g4e7a.private-webgl/1',
  results,matchedStart00:matched,errors,
  visibilityVerdict:'HOLD_REAL_GAP_NOT_VISUALLY_CERTIFIED',
  neutralRunIsNotHumanDriving:true,nonpublishing:true,progressTo40PercentMeters:0,
  note:'These captures and the actual native gap structure are evidence only. No eye-tracked visibility, actual human reaction time, hand-steered takeoff or independent hardware FPS approval.'};
 await fs.writeFile(info.outputPath('g4e7a-real-webgl-audit.json'),JSON.stringify(report,null,2));
 expect(errors).toEqual([]);
});
