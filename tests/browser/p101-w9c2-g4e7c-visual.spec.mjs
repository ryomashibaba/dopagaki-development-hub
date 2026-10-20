import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

/** True same-pose A/B: pause original B48 Runner and toggle GPU triangles ONLY.
 * No camera mutation, fake ground, pre-recorded steering, or human visibility PASS.
 */
test('G4E7C cannot activate on Gold / public-default preview',async({page})=>{
 await page.goto('/drive3d/?g4e7c=candidate&g4e7b=scripted');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7c-mode','off');
 await expect(page.locator('#g4e7cCueToggle')).toHaveCount(0);
 await page.goto('/drive3d/?g4e6=on&g4e7c=candidate&stage=VB-P101-A13');
 await expect(page.locator('#appStatus')).toContainText('W7F',{timeout:60000});
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7c-mode','off');
 await expect(page.locator('#g4e7cCueToggle')).toHaveCount(0);
});
test('G4E7C real WebGL paired gap-cue visibility on exactly paused B48 camera',async({context},info)=>{
 test.setTimeout(260000);
 const results=[],errors=[];
 const sites=[{id:'C0-55-1',moments:[3.4,4.3]},{id:'B0-65-1',moments:[4.3,5.15]}];
 for(const {id,moments} of sites){
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push({id,message:e.message}));
  await page.goto('/drive3d/?g4e6=on&g4e7b=scripted&g4e7c=candidate&stage=VB-P101-A13-W9C2-G4E6-'+id);
  await expect(page.locator('#appStatus')).toContainText('G4E-7B',{timeout:60000});
  const view=page.locator('#view'),toggle=page.locator('#g4e7cCueToggle');
  await expect(view).toHaveAttribute('data-g4e7c-mode','private-opt-in');
  await expect(view).toHaveAttribute('data-g4e7c-non-collision','true');
  await expect(view).toHaveAttribute('data-g4e7c-cue-active','true');
  await expect(view).toHaveAttribute('data-g4e7b-mode','SCRIPTED_P96_NOT_HUMAN');
  await expect(view).toHaveAttribute('data-machine-count','28');
  await expect(toggle).toBeVisible();
  const triangles=Number(await view.getAttribute('data-g4e7c-triangles'));
  expect(triangles).toBeGreaterThan(15);
  const captures=[];
  for(const [i,target] of moments.entries()){
   await page.waitForFunction(t=>{
     const d=document.querySelector('#view')?.dataset;
     return Number(d?.g4e7bTime||0)>=t||['failed','finished'].includes(d?.runOutcome);
   },target,{timeout:90000,polling:120});
   if((await page.locator('#pause').textContent()).includes('一時停止'))
    await page.locator('#pause').click();
   // Restore test order: ON screenshot, OFF screenshot, exactly same physical pose.
   if((await view.getAttribute('data-g4e7c-cue-active'))!=='true')await toggle.click();
   const onName='g4e7c-'+id+'-'+i+'-cue-on.png';
   const on=await view.screenshot({path:info.outputPath(onName)});
   const physicsOn=await page.evaluate(()=>({
    time:document.querySelector('#view').dataset.g4e7bTime,
    cameraLag:document.querySelector('#view').dataset.cameraHeadingLagDegrees,
    speed:document.querySelector('#view').dataset.g4e7bSpeed,
    position:document.querySelector('#view').dataset.g4e7bXYZ,
    u:document.querySelector('#view').dataset.g4e7bU,
    status:document.querySelector('#view').dataset.runOutcome
   }));
   await toggle.click();
   await expect(view).toHaveAttribute('data-g4e7c-cue-active','false');
   const offName='g4e7c-'+id+'-'+i+'-cue-off.png';
   const off=await view.screenshot({path:info.outputPath(offName)});
   const physicsOff=await page.evaluate(()=>({
    time:document.querySelector('#view').dataset.g4e7bTime,
    cameraLag:document.querySelector('#view').dataset.cameraHeadingLagDegrees,
    speed:document.querySelector('#view').dataset.g4e7bSpeed,
    position:document.querySelector('#view').dataset.g4e7bXYZ,
    u:document.querySelector('#view').dataset.g4e7bU,
    status:document.querySelector('#view').dataset.runOutcome
   }));
   expect(physicsOff).toEqual(physicsOn);
   const delta=await page.evaluate(async({a,b})=>{
    const pixels=async encoded=>{
     const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+encoded)).blob());
     const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;
     const ctx=c.getContext('2d');ctx.drawImage(bitmap,0,0);
     return {w:c.width,h:c.height,p:ctx.getImageData(0,0,c.width,c.height).data};
    };
    const x=await pixels(a),y=await pixels(b);
    if(x.w!==y.w||x.h!==y.h)throw Error('G4E7C paired screenshot size mismatch');
    let changed=0,center=0;
    for(let k=0;k<x.p.length;k+=4){
     const d=Math.max(...[0,1,2].map(j=>Math.abs(x.p[k+j]-y.p[k+j])));
     if(d>20){changed++;const col=(k/4)%x.w,row=Math.floor(k/4/x.w);
      if(col>x.w*.2&&col<x.w*.8&&row>x.h*.2&&row<x.h*.8)center++;}
    }
    return {width:x.w,height:x.h,changed,center,percent:100*changed/(x.w*x.h)};
   },{a:on.toString('base64'),b:off.toString('base64')});
   captures.push({index:i,target,physicsOn,delta,images:[onName,offName]});
   // Stay ON during next real step. This does not alter ball, physics or camera.
   await toggle.click();
   if(physicsOn.status==='running'&&(await page.locator('#pause').textContent()).includes('再開'))
    await page.locator('#pause').click();
  }
  results.push({id,triangles,captures,scriptedNativeNotHuman:true,
   humanTwoSecondVisibility:'UNVERIFIED',manualFairness:'HOLD',
   physicallyAdditionalRoadMeters:0});
  await page.close();
 }
 await fs.writeFile(info.outputPath('g4e7c-matched-webgl-cue-audit.json'),
  JSON.stringify({schema:'dopagaki.w9c2.g4e7c-matched-visual/1',results,errors,
   pairedAtSamePhysicalPose:true,canInferHumanRecognition:false,
   goldModified:false,publicPromoted:false,approvedSlopeMeters:0},null,2));
 expect(errors).toEqual([]);
 // A candidate that changes zero pixels across both near-gap views is not a
 // meaningful art improvement. A pixel effect STILL does not prove readability.
 for(const r of results)expect(r.captures.some(c=>c.delta.changed>20)).toBe(true);
});
