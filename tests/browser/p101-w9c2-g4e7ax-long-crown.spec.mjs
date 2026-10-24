import {test,expect} from '@playwright/test';
// Real native 240Hz stage, user A/D trial from start00; no P96 steering or fairness certification.
for(const road of ['true-pinch','pinch-switch']){
 test('AX '+road+' real long-CROWN private localhost A/D and valid 28 moving colliders',async({page},info)=>{
  test.setTimeout(120000);const errs=[];
  page.on('pageerror',e=>errs.push(e.message));
  await page.goto('/drive3d/?g4e7al=manual&g4e7ax=long-crown');
  // Wait for the true native stage and camera to finish loading, not merely the DOM.
  await expect(page.locator('#stage')).toBeEnabled({timeout:90000});
  await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28',{timeout:90000});
  if(road==='pinch-switch'){
   await page.keyboard.down('KeyD');await page.waitForTimeout(450);
   await page.keyboard.up('KeyD');
   await page.locator('#g4e7alNext').click();
  }
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7AX-'+road.toUpperCase()+'-LONGLEAD');
  const view=page.locator('#view');
  await expect(view).toHaveAttribute('data-g4e7ax-mode','real-long-crown-road2-physical');
  await expect(view).toHaveAttribute('data-machine-count','28');
  await expect(view).toHaveAttribute('data-run-mode','private-real-B48-B51-AL-manual-HOLD');
  await view.screenshot({path:info.outputPath('g4e7ax-'+road+'-real-road2-physical-native.png')});
  expect(errs).toEqual([]);
 });
}
