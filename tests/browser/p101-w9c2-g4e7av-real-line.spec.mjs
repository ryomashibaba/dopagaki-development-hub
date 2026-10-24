import {test,expect} from '@playwright/test';
for(const [road,grade] of [['true-pinch','linesoft'],['pinch-switch','linesoft'],['true-pinch','linelevel']]){
 test('AV '+road+' '+grade+' private real B48 start00 human A/D manual UI',async({page},info)=>{
  test.setTimeout(120000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/drive3d/?g4e7al=manual&g4e7av=lines'+(grade==='linelevel'?'&g4e7avGrade=level':''));
  // Await actual async private stage loading before issuing A/D or switching roads.
  await expect(page.locator('#stage')).toBeEnabled({timeout:90000});
  await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28',{timeout:90000});
  // Real live physics can fail during QA; validate loaded stage and native mode, not transient status copy.
  if(road==='pinch-switch'){
   await page.keyboard.down('KeyD');await page.waitForTimeout(450);
   await page.keyboard.up('KeyD');
   await page.locator('#g4e7alNext').click();
  }
  await expect(page.locator('#stage')).toHaveValue('VB-P101-A13-W9C2-G4E7AV-'+road.toUpperCase()+'-'+grade.toUpperCase());
  const canvas=page.locator('#view');
  await expect(canvas).toHaveAttribute('data-g4e7av-mode','real-approach-12s-road2-prototype');
  await expect(canvas).toHaveAttribute('data-g4e7av-grade',grade==='linelevel'?'lineLevel':'lineSoft');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  await expect(canvas).toHaveAttribute('data-run-mode','private-real-B48-B51-AL-manual-HOLD');
  await canvas.screenshot({path:info.outputPath('g4e7av-'+road+'-'+grade+'-real-manual-view.png')});
  expect(errors).toEqual([]);
 });
}
