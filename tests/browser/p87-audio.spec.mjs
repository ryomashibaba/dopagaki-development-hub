import {test,expect} from '@playwright/test';

test('P87 real WebGL2 player explicitly opts in to original audio and can mute without physics changes',async({page})=>{
 test.setTimeout(110000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#soundToggle')).toContainText('OFF');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 const elapsedBefore=parseFloat(await page.locator('#simTime').textContent());
 await page.locator('#soundToggle').click();
 await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed','true',{timeout:15000});
 await expect(page.locator('#view')).toHaveAttribute('data-audio-mode','enabled');
 await page.waitForTimeout(500);
 expect(parseFloat(await page.locator('#simTime').textContent())).toBeGreaterThan(elapsedBefore);
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('再開');
 await page.waitForTimeout(250);
 const pausedTime=await page.locator('#simTime').textContent();
 await page.waitForTimeout(350);
 expect(await page.locator('#simTime').textContent()).toBe(pausedTime);
 await page.locator('#pause').click();
 await page.locator('#restart').click();
 await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed','true');
 await page.locator('#soundToggle').click();
 await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#view')).toHaveAttribute('data-audio-mode','muted');
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:75000});
 await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed','false');
 expect(errors).toEqual([]);
});

test('P87 audio is optional and missing browser AudioContext does not break B48 game or render',async({page})=>{
 test.setTimeout(100000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  Object.defineProperty(window,'AudioContext',{configurable:true,value:undefined});
  Object.defineProperty(window,'webkitAudioContext',{configurable:true,value:undefined});
 });
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await page.locator('#soundToggle').click();
 await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#audioInfo')).toContainText('音声利用不可');
 await expect(page.locator('#view')).toHaveAttribute('data-audio-mode','muted');
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);await page.keyboard.up('ArrowRight');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 expect(errors).toEqual([]);
});
