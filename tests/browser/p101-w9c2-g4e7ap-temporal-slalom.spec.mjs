import {test,expect} from '@playwright/test';
// AP is NOT a release stage; explicit localhost opt-in to the original AL manual Runner.
for(const road of ['true-pinch','pinch-switch']){
 test('AP '+road+' actual manual 240Hz runner exposes TWO reauthored B51 only privately',async({page},info)=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/drive3d/?g4e7al=manual&g4e7ap=duel');
  await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:90000});
  if(road==='pinch-switch'){
   await page.keyboard.down('KeyD');await page.waitForTimeout(450);
   await page.keyboard.up('KeyD');
   await page.locator('#g4e7alNext').click();
  }
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7AP-'+road.toUpperCase());
  const canvas=page.locator('#view');
  await expect(canvas).toHaveAttribute('data-g4e7ap-mode','true-b51-temporal-slalom');
  await expect(canvas).toHaveAttribute('data-g4e7ao-mode','off');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(canvas).toHaveAttribute('data-run-mode','private-real-B48-B51-AL-manual-HOLD');
  await canvas.screenshot({path:info.outputPath('g4e7ap-'+road+'-real-webgl-not-human.png')});
  expect(errors).toEqual([]);
 });
}
