import {test,expect} from '@playwright/test';
for(const road of ['true-pinch','pinch-switch']){
 test('AY '+road+' native real CROWN banked bridge in private manual 240Hz A/D',async({page},info)=>{
  test.setTimeout(120000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/drive3d/?g4e7al=manual&g4e7ay=banked-bridge');
  const view=page.locator('#view');
  await expect(view).toHaveAttribute('data-machine-count','28',{timeout:90000});
  await expect(view).toHaveAttribute('data-g4e7ay-mode','real-banked-14m-crown-bridge');
  if(road==='pinch-switch'){
   await page.keyboard.down('KeyD');await page.waitForTimeout(500);
   await page.keyboard.up('KeyD');
   await page.locator('#g4e7alNext').click();
  }
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7AY-'+road.toUpperCase()+'-BANKEDSWEEP');
  await expect(view).toHaveAttribute('data-run-mode','private-real-B48-B51-AL-manual-HOLD');
  await view.screenshot({path:info.outputPath('g4e7ay-'+road+'-native-real-CROWN-bank.png')});
  expect(errors).toEqual([]);
 });
}
