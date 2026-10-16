import {test,expect} from '@playwright/test';

test('P65 WebGL2 drives frozen P62 with actual B48 Runner on two stages',async({page})=>{
 test.setTimeout(110000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().includes('/generated/')&&!r.ok())errors.push('JSON '+r.status())});
 await page.goto('/drive3d/');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#spawn option').first()).toBeAttached();
 await expect(page.locator('#speed')).not.toHaveText('--');
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(350);await page.keyboard.up('ArrowRight');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 await page.getByRole('button',{name:'再スタート'}).click();
 await expect(page.locator('#appStatus')).toContainText('3D ready');
 await page.locator('#stage').selectOption('HS-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#spawn option').first()).toBeAttached();
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('再開');
 expect(errors).toEqual([]);
});
