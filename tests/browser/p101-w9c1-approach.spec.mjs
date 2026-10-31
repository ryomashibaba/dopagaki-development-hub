import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('W9-C1 real road preview is visible before narrow section without steering or collider hacks',async({page},info)=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const evidence=[];
 for(const [kind,width] of [['CONTROL',28],['ULTRA',14]]){
  await page.goto('/drive3d/?stage=VB-P101-A13-W9C1-'+kind);
  await expect(page.locator('#appStatus')).toContainText('W9-C1 ABYSS DIVE',{timeout:80000});
  await expect(page.locator('#view')).toHaveAttribute('data-w9c1-notice-markers','5');
  await expect(page.locator('#view')).toHaveAttribute('data-w9c1-notice-non-collision','true');
  await expect(page.locator('#w9c1Notice')).toBeHidden();
  await page.waitForFunction(()=>Number.parseFloat(document.querySelector('#simTime')?.textContent||'0')>2.0,null,{timeout:60000});
  await expect(page.locator('#w9c1Notice')).toBeVisible({timeout:12000});
  await expect(page.locator('#view')).toHaveAttribute('data-w9c1-notice-phase','approach');
  await expect(page.locator('#w9c1NoticeTitle')).toContainText(String(width)+'m');
  const attrs=await page.locator('#view').evaluate(el=>({
   phase:el.dataset.w9c1NoticePhase,
   currentEta:Number(el.dataset.w9c1NoticeEta),
   physicalDistance:Number(el.dataset.w9c1NoticeDistance),
   nominalPosition:Number(el.dataset.w9c1NoticePosition),
   movingBodies:Number(el.dataset.machineCount),
   fixedHz:240,notHumanProof:true
  }));
  expect(attrs.currentEta).toBeGreaterThan(0);
  expect(attrs.physicalDistance).toBeGreaterThan(0);
  expect(attrs.movingBodies).toBe(28);
  expect(attrs.nominalPosition).toBeGreaterThan(90);
  expect(attrs.nominalPosition).toBeLessThan(310);
  const hud=await page.locator('#w9c1Notice').boundingBox();
  const chapter=await page.locator('#chapterHud').boundingBox();
  expect(hud.y).toBeGreaterThan(chapter.y+chapter.height);
  await page.locator('.viewport').screenshot({path:info.outputPath('w9c1-approach-'+kind.toLowerCase()+'-real-webgl.png')});
  evidence.push({kind,width,...attrs});
 }
 await page.locator('#stage').selectOption('VB-P101-A13');
 await expect(page.locator('#appStatus')).toContainText('W7F');
 await expect(page.locator('#view')).toHaveAttribute('data-w9c1-notice-markers','0');
 await expect(page.locator('#w9c1Notice')).toBeHidden();
 await fs.writeFile(info.outputPath('w9c1-approach-browser-audit.json'),
  JSON.stringify({schema:'dopagaki.w9c1-approach-browser/1',
   evidence,notAHumanReactionTimeTest:true,cameraOrPhysicsUnaffected:true},null,2));
 expect(errors).toEqual([]);
});
