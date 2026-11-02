import {test,expect} from '@playwright/test';
// Genuine private local manual A/D; automation does not certify human enjoyment.
for(const road of ['true-pinch','pinch-switch']){
 test('AS '+road+' actual B48 banked serpent 28 B51 local manual stage',async({page},info)=>{
  test.setTimeout(120000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/drive3d/?g4e7al=manual&g4e7as=bank');
  await expect(page.locator('#appStatus')).toContainText('G4E-7AS',{timeout:90000});
  if(road==='pinch-switch'){
   await page.keyboard.down('KeyD');await page.waitForTimeout(450);
   await page.keyboard.up('KeyD');await page.locator('#g4e7alNext').click();
  }
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7AS-'+road.toUpperCase());
  const canvas=page.locator('#view');
  await expect(canvas).toHaveAttribute('data-g4e7as-mode','real-b48-banked-serpent');
  await expect(canvas).toHaveAttribute('data-g4e7ap-mode','off');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(canvas).toHaveAttribute('data-run-mode','private-real-B48-B51-AL-manual-HOLD');
  await canvas.screenshot({path:info.outputPath('g4e7as-'+road+'-real-webgl-not-human.png')});
  expect(errors).toEqual([]);
 });
}
