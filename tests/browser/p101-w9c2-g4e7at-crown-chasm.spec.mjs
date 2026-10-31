import {test,expect} from '@playwright/test';
// CROWN THREAD + CHASM SWEEP on 2 true B48 roads, local-only; no human certification.
for(const road of ['true-pinch','pinch-switch']){
 test('AT '+road+' private true two-road crown/chasm 28 B51 240Hz manual',async({page},info)=>{
  test.setTimeout(120000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/drive3d/?g4e7al=manual&g4e7at=crown-chasm');
  await expect(page.locator('#appStatus')).toContainText('G4E-7AT',{timeout:90000});
  if(road==='pinch-switch'){
   await page.keyboard.down('KeyD');await page.waitForTimeout(450);
   await page.keyboard.up('KeyD');await page.locator('#g4e7alNext').click();
  }
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7AT-'+road.toUpperCase());
  const canvas=page.locator('#view');
  await expect(canvas).toHaveAttribute('data-g4e7at-mode','real-two-road-crown-chasm');
  await expect(canvas).toHaveAttribute('data-g4e7as-mode','off');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(canvas).toHaveAttribute('data-run-mode','private-real-B48-B51-AL-manual-HOLD');
  await canvas.screenshot({path:info.outputPath('g4e7at-'+road+'-two-real-roads-not-human.png')});
  expect(errors).toEqual([]);
 });
}
