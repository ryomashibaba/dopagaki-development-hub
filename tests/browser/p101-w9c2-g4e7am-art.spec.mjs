import {test,expect} from '@playwright/test';
const stage=road=>'VB-P101-A13-W9C2-G4E7AK-'+road.toUpperCase();
const url=(road,optIn)=>'/drive3d/?g4e7al=manual'+(optIn?'&g4e7am=continent':'')+'&stage='+stage(road);
test('AM art is OFF unless explicit localhost manual + experimental opt-in',async({page},info)=>{
 test.setTimeout(100000);
 await page.goto(url('true-pinch',false));
 await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:80000});
 const view=page.locator('#view');
 await expect(view).toHaveAttribute('data-g4e7am-scene','off');
 await expect(view).toHaveAttribute('data-g4e7am-banks','0');
 await expect(view).toHaveAttribute('data-machine-count','28');
 await page.screenshot({path:info.outputPath('g4e7am-original-11m-background-not-human.png')});
});
for(const road of ['true-pinch','pinch-switch']){
 test('AM genuine B48 '+road+' giant skyline visual candidate and 28-mover physics untouched',async({page},info)=>{
  test.setTimeout(100000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url(road,true));
  await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:80000});
  const view=page.locator('#view');
  // AL intentionally enforces first trial to be true-pinch; for pinch-switch
  // verify its geometry with the direct Node generator, not a forged human run.
  await expect(view).toHaveAttribute('data-g4e7am-scene','continent');
  await expect(view).toHaveAttribute('data-g4e7am-banks','2');
  await expect(view).toHaveAttribute('data-g4e7am-terraces','8');
  await expect(view).toHaveAttribute('data-g4e7am-spines','6');
  await expect(view).toHaveAttribute('data-g4e7am-non-collision','true');
  await expect(view).toHaveAttribute('data-machine-count','28');
  const stats=await view.evaluate(el=>({
   voids:Number(el.dataset.g4e7amVoids),
   tris:Number(el.dataset.g4e7amTriangles),
   rise:Number(el.dataset.g4e7amRiseMeters),
   outboard:Number(el.dataset.g4e7amOutboard),
   stage:document.querySelector('#stage').value,
   physics:el.dataset.runMode
  }));
  expect(stats.voids).toBeGreaterThan(105);
  expect(stats.tris).toBeGreaterThan(1000);
  expect(stats.rise).toBeGreaterThan(650);
  expect(stats.outboard).toBeGreaterThanOrEqual(120);
  expect(stats.stage).toBe(stage('true-pinch'));
  expect(stats.physics).toBe('private-real-B48-B51-AL-manual-HOLD');
  await page.waitForTimeout(450);
  await page.screenshot({path:info.outputPath('g4e7am-upturned-city-'+road+'-automated-not-human.png')});
  expect(errors).toEqual([]);
 });
}
