
import {test,expect} from '@playwright/test';

test('P101 actual selectable 240Hz faster lateral driving is opt-in and leaves P100 intact',async({page})=>{
 test.setTimeout(90000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P101');
 await expect(page.locator('#appStatus')).toContainText('P101 VELOCITY OVERDRIVE',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#view')).toHaveAttribute('data-arch-portal-count','28');
 await expect(page.locator('#view')).toHaveAttribute('data-road-read-stripes','1456');
 await expect(page.locator('#p101Controls')).toBeVisible();
 await expect(page.locator('#demoRun')).toBeDisabled();
 await expect(page.locator('#practiceRun')).toBeDisabled();
 await expect(page.locator('#view')).toHaveAttribute('data-overdrive-profile','OVERDRIVE');
 await page.locator('#p101Profile').selectOption('HYPER');
 await expect(page.locator('#view')).toHaveAttribute('data-overdrive-profile','HYPER');
 await page.keyboard.down('ArrowRight');
 await page.waitForFunction(()=>Number.parseFloat(document.querySelector('#simTime')?.textContent||'0')>1.5,null,{timeout:45000});
 await page.keyboard.up('ArrowRight');
 await expect(page.locator('#speed')).not.toHaveText('44.0');
 await page.locator('#view').screenshot({path:'test-results/p101-real-physical-strong-lateral.png'});
 await page.locator('#stage').selectOption('VB-P100');
 await expect(page.locator('#p101Controls')).toBeHidden();
 await expect(page.locator('#demoRun')).toBeEnabled();
 await expect(page.locator('#view')).toHaveAttribute('data-overdrive-profile','off');
 expect(errors).toEqual([]);
});
