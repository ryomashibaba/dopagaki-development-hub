import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E7B scripted replay remains OFF in normal Gold/default game',async({page})=>{
 await page.goto('/drive3d/?g4e7b=scripted');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-g4e7b-mode','off');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#stage option[value^="VB-P101-A13-W9C2-G4E6-"]')).toHaveCount(0);
});
test('G4E7B native real-gap screenshots are P96 SCRIPTED QA, never human fairness',async({context},info)=>{
 test.setTimeout(300000);
 const records=[],errors=[];
 for(const id of ['C0-55-1','B0-65-1']){
  const page=await context.newPage();page.on('pageerror',e=>errors.push({id,error:e.message}));
  await page.goto('/drive3d/?g4e6=on&g4e7b=scripted&stage=VB-P101-A13-W9C2-G4E6-'+id);
  await expect(page.locator('#appStatus')).toContainText('G4E-7B',{timeout:60000});
  const view=page.locator('#view');
  await expect(view).toHaveAttribute('data-g4e7b-mode','SCRIPTED_P96_NOT_HUMAN');
  await expect(view).toHaveAttribute('data-run-mode','scripted-qa-not-human');
  await expect(view).toHaveAttribute('data-machine-count','28');
  await expect(page.locator('#b5QaPanel')).toBeHidden();
  await expect(page.locator('#spawn')).toHaveValue('0');
  const frames=[];
  for(const [label,target] of [['early-approach',2.5],['gap-approach',4.35],
    ['near-takeoff',5.3],['flight-window',7.3],['landing-window',10.5]]){
   await page.waitForFunction(t=>{
    const d=document.querySelector('#view')?.dataset;
    return Number(d?.g4e7bTime||0)>=t||['failed','finished'].includes(d?.runOutcome);
   },target,{timeout:100000,polling:150});
   if((await page.locator('#pause').textContent()).includes('一時停止'))await page.locator('#pause').click();
   const img='g4e7b-'+id+'-'+label+'.png';
   const shot=await view.screenshot({path:info.outputPath(img)});
   expect(shot.length).toBeGreaterThan(1000);
   const metric=await view.evaluate(el=>({
    time:Number(el.dataset.g4e7bTime),u:el.dataset.g4e7bU,
    speed:el.dataset.g4e7bSpeed,grounded:el.dataset.g4e7bGrounded,
    armed:el.dataset.g4e7bArmed,
    airSeen:el.dataset.g4e7bAirSeen,landingSeen:el.dataset.g4e7bLandingSeen,
    outcome:el.dataset.runOutcome,runMode:el.dataset.runMode,xyz:el.dataset.g4e7bXYZ,
    cameraLag:el.dataset.cameraHeadingLagDegrees,renderScale:el.dataset.renderScale,
    renderOverloads:el.dataset.g4e7bFrameSkips,
    fpsHUD:document.querySelector('#fps')?.textContent
   }));
   frames.push({label,target,image:img,metric});
   if(metric.outcome==='running'&&(await page.locator('#pause').textContent()).includes('再開'))await page.locator('#pause').click();
  }
  records.push({id,frames,mode:'SCRIPTED_P96_EARLY_SOFT_DIV_4_8_NOT_HUMAN',
   airSeen:frames.some(f=>f.metric.airSeen==='true'),
   landingSeen:frames.some(f=>f.metric.landingSeen==='true'),
   handDriven:false,visibility:'UNKNOWN',humanFPS:'UNVERIFIED',dnaCertifiedMeters:0});
  await page.close();
 }
 const audit={schema:'dopagaki.w9c2.g4e7b-real-webgl/1',records,errors,
  changedCamera:false,physicsRunnerReal:true,autopilotIsHuman:false,
  twoSecondNaturalVisibility:'NOT_PROVEN',fairness:'HOLD'};
 await fs.writeFile(info.outputPath('g4e7b-webgl-flight-audit.json'),JSON.stringify(audit,null,2));
 expect(errors).toEqual([]);
 for(const r of records){
  expect(r.frames.every(x=>x.metric.runMode==='scripted-qa-not-human')).toBe(true);
  expect(r.frames.at(-1).metric.time).toBeGreaterThanOrEqual(4.35);
 }
});
