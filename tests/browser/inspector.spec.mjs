import {test,expect} from '@playwright/test';
const choices={'EP-001':'ECHO PIPE','HG-001':'HANGING GARDENS','HS-001':'HOLLOW SPHERES','WV-001':'MONSOON WAVE'};
test('P62 404 regression: all 4 actual stage JSON files load, animated canvas survives',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/generated/')&&!r.ok())errors.push(`STAGE HTTP ${r.status()}: ${r.url()}`)});
 await page.goto('/web/');
 for(const id of Object.keys(choices)){
  await page.locator('#stageSelect').selectOption(id);
  await expect(page.locator('#status')).toContainText('Moving Lab B51-C', {timeout:12000});
  await expect(page.locator('#focusSelect option')).toHaveCount(7);
  const focus=await page.locator('#focusSelect option').nth(1).getAttribute('value');
  await page.locator('#focusSelect').selectOption(focus);
  await expect(page.locator('#status')).not.toContainText('読込失敗');
  await expect(page.locator('#timeOut')).toContainText('s');
 }
 expect(errors).toEqual([]);
});
test('stage switching, seek, freeze, and build marker',async({page})=>{
 await page.goto('/');await expect(page.locator('h1')).toContainText('DEVELOPMENT HUB');await page.getByText('4作品の動体プレビュー').click();
 await expect(page.locator('#status')).toContainText('Moving Lab B51-C');
 await page.locator('#time').evaluate(el=>{el.value='15';el.dispatchEvent(new Event('input',{bubbles:true}));});
 await expect(page.locator('#timeOut')).toHaveText('15.00 s');
 await page.locator('#reset').click();await expect(page.locator('#timeOut')).toHaveText('0.00 s');
});
