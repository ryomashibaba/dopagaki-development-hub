import {test,expect} from '@playwright/test';
// Explicit local-only inspection spawn with genuine 28 moving solids. This is
// not start00, racing completion, auto-steering or certified fair play.
for(const [road,point,speed] of [['true-pinch','crown','105'],['pinch-switch','chasm','165']]){
 test('AU '+road+' '+point+' private physically real second-road manual view',async({page},info)=>{
  test.setTimeout(120000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/drive3d/?g4e7au=inspect&g4e7auPoint='+point+'&g4e7auSpeed='+speed);
  await expect(page.locator('#appStatus')).toContainText('G4E-7AU',{timeout:90000});
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7AU-'+road.toUpperCase());
  const spawn=page.locator('#spawn');
  await expect(spawn.locator('option:checked')).toContainText(point==='crown'?'CROWN THREAD':'CHASM SWEEP');
  await expect(spawn).toBeEnabled();
  const canvas=page.locator('#view');
  await expect(canvas).toHaveAttribute('data-g4e7au-mode','second-b48-native-manual-inspection-not-start00');
  await expect(canvas).toHaveAttribute('data-g4e7au-launch-mps',speed);
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await canvas.screenshot({path:info.outputPath('g4e7au-'+road+'-'+point+'-road2-REAL-LOCAL.png')});
  expect(errors).toEqual([]);
 });
}
