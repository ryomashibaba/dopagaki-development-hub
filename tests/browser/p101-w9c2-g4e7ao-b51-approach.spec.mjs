import {test,expect} from '@playwright/test';
const stage=road=>'VB-P101-A13-W9C2-G4E7AK-'+road.toUpperCase();
const url=on=>'/drive3d/?g4e7al=manual'+(on?'&g4e7ao=on':'');
test('AO default is OFF and keeps native 28 moving hazards',async({page},info)=>{
 test.setTimeout(100000);
 await page.goto(url(false));
 await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:85000});
 const canvas=page.locator('#view');
 await expect(canvas).toHaveAttribute('data-g4e7ao-mode','off');
 await expect(canvas).toHaveAttribute('data-machine-count','28');
 await canvas.screenshot({path:info.outputPath('g4e7ao-baseline-first-road-not-human.png')});
});
for(const road of ['true-pinch','pinch-switch']){
 test('AO '+road+' real B48 off-road visual stations do not change manual 240Hz runner',async({page},info)=>{
  test.setTimeout(110000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url(true)+'&stage='+stage(road));
  await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:85000});
  if(road==='pinch-switch'){
   // Actual initial manual run, not UI injection or P96 teleport.
   await page.keyboard.down('KeyD');await page.waitForTimeout(400);
   await page.keyboard.up('KeyD');await page.locator('#g4e7alNext').click();
   await expect(page.locator('#stage')).toHaveValue(stage(road));
   await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:85000});
  }
  const canvas=page.locator('#view');
  await expect(canvas).toHaveAttribute('data-g4e7ao-mode','real-b51-approach');
  await expect(canvas).toHaveAttribute('data-g4e7ao-hazards','2');
  await expect(canvas).toHaveAttribute('data-g4e7ao-stations',/[4-6]/);
  await expect(canvas).toHaveAttribute('data-g4e7ao-off-road-only','true');
  await expect(canvas).toHaveAttribute('data-g4e7ao-certified-meters','0');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(canvas).toHaveAttribute('data-run-mode','private-real-B48-B51-AL-manual-HOLD');
  const first=await canvas.evaluate(el=>({
   u:Number(el.dataset.g4e7aoFirstU),width:el.width,height:el.height
  }));
  expect(first.u).toBeGreaterThan(0);
  expect(first.u).toBeLessThan(.32);
  expect(first.width*first.height).toBeGreaterThan(100000);
  await canvas.screenshot({path:info.outputPath('g4e7ao-'+road+'-actual-shore-prewarning-not-human.png')});
  expect(errors).toEqual([]);
 });
}
