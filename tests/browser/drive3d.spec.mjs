import {test,expect} from '@playwright/test';

test('P65 WebGL2 drives frozen P62 with actual B48 Runner on two stages',async({page})=>{
 test.setTimeout(110000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().includes('/generated/')&&!r.ok())errors.push('JSON '+r.status())});
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('EP-001');
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


test('P75: survival scoring and per-spawn best coexist with real 3D machinery',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',response=>{if(response.url().includes('P66_ECHO_RUSH')&&!response.ok())errors.push('P66 JSON HTTP '+response.status())});
 await page.goto('/drive3d/');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#stage option:checked')).toContainText('P75 ECHO PIPE');
 await expect(page.locator('#spawn option')).toHaveCount(7);
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','6');
 await expect(page.locator('#nearMissCount')).toHaveText('0');
 await expect(page.locator('#runScore')).toHaveText('0');
 await expect(page.locator('#bestSurvival')).toBeVisible();
 await expect(page.locator('#runResult')).toBeHidden();
 await expect(page.locator('#nearMissBurst')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-near-miss-count','0');
 await expect(page.locator('#view')).toBeVisible();
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 expect(await page.locator('#view').evaluate(c=>Boolean(c.getContext('webgl2')))).toBe(true);
 await page.locator('#spawn').selectOption('2');
 await expect(page.locator('#appStatus')).toContainText('P75 EXPERIMENTAL');
 // The real P69 machine chamber includes three physical movement mechanisms.
 // Heads-up cues are derived from sampled B51 motion, not a fake preset label.
 await page.locator('#spawn').selectOption('4');
 await expect(page.locator('#machineCue')).toBeVisible({timeout:10000});
 await expect(page.locator('#machineCue')).toContainText(/SLIDER|ROTATOR|PISTON/);
 await expect(page.locator('#machineCue')).toHaveAttribute('data-mode',/fail|bounce|push/);
 // Compare raw and filtered heading without restarting or touching B48 Runner.
 await expect(page.locator('#cameraCompare')).toHaveAttribute('aria-pressed','false');
 await page.locator('#cameraCompare').click();
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-unfiltered-heading');
 await expect(page.locator('#cameraCompare')).toHaveAttribute('aria-pressed','true');
 await page.locator('#cameraCompare').click();
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 await expect(page.locator('#cameraCompare')).toHaveAttribute('aria-pressed','false');
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('再開');
 await page.waitForTimeout(650);
 const stopped=await page.locator('#simTime').textContent();
 await page.waitForTimeout(650);
 expect(await page.locator('#simTime').textContent()).toBe(stopped);
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 await expect(page.locator('#cameraInfo')).toBeVisible();
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('一時停止');
 await page.locator('#spawn').selectOption('5');
 await expect(page.locator('#nearMissCount')).toHaveText('0');
 await expect(page.locator('#nearMissBurst')).toBeHidden();
 await expect(page.locator('#runResult')).toBeHidden();
 await page.keyboard.down('KeyA');await page.waitForTimeout(500);await page.keyboard.up('KeyA');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 expect(errors).toEqual([]);
});
