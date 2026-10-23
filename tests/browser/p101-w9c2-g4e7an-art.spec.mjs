import {test,expect} from '@playwright/test';
const stage=road=>'VB-P101-A13-W9C2-G4E7AK-'+road.toUpperCase();
const url=(mode='',road='true-pinch')=>
 '/drive3d/?g4e7al=manual'+(mode?'&g4e7an='+mode:'')+'&stage='+stage(road);

test('AN stays off for default manual mode and does not change 28 machines',async({page},info)=>{
 test.setTimeout(100000);
 await page.goto(url());
 await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:85000});
 const canvas=page.locator('#view');
 await expect(canvas).toHaveAttribute('data-g4e7an-scene','off');
 await expect(canvas).toHaveAttribute('data-g4e7an-monuments','0');
 await expect(canvas).toHaveAttribute('data-machine-count','28');
 await canvas.screenshot({path:info.outputPath('g4e7an-old-private-road-canvas-not-human.png')});
});
for(const road of ['true-pinch','pinch-switch']){
 test('AN four distinct real WebGL architecture objects on '+road+' without touching B48 or A/D',async({page},info)=>{
  test.setTimeout(120000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url('archipelago',road));
  await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:85000});
  const canvas=page.locator('#view');
  if(road==='pinch-switch'){
   await page.keyboard.down('KeyD');
   await page.waitForTimeout(420);
   await page.keyboard.up('KeyD');
   await page.locator('#g4e7alNext').click();
   await expect(page.locator('#stage')).toHaveValue(stage('pinch-switch'));
   await expect(page.locator('#appStatus')).toContainText('G4E-7AL LOCAL MANUAL',{timeout:85000});
  }
  await expect(canvas).toHaveAttribute('data-g4e7an-scene','archipelago');
  await expect(canvas).toHaveAttribute('data-g4e7an-monuments','4');
  await expect(canvas).toHaveAttribute('data-g4e7an-crown','1');
  await expect(canvas).toHaveAttribute('data-g4e7an-prongs','2');
  await expect(canvas).toHaveAttribute('data-g4e7an-decks','3');
  await expect(canvas).toHaveAttribute('data-g4e7an-branches','3');
  await expect(canvas).toHaveAttribute('data-g4e7an-non-collision','true');
  await expect(canvas).toHaveAttribute('data-g4e7am-scene','off');
  await expect(canvas).toHaveAttribute('data-machine-count','28');
  const data=await canvas.evaluate(el=>({
   triangles:Number(el.dataset.g4e7anTriangles),
   setback:Number(el.dataset.g4e7anSetback),
   runMode:el.dataset.runMode,
   stage:document.querySelector('#stage').value,
   pixelWidth:el.width,pixelHeight:el.height,
  }));
  expect(data.triangles).toBeGreaterThan(450);
  expect(data.setback).toBeGreaterThanOrEqual(250);
  expect(data.pixelWidth*data.pixelHeight).toBeGreaterThan(100000);
  expect(data.runMode).toBe('private-real-B48-B51-AL-manual-HOLD');
  expect(data.stage).toBe(stage(road));
  await page.waitForTimeout(450);
  await canvas.screenshot({path:info.outputPath('g4e7an-sky-archipelago-'+road+'-real-webgl-not-human.png')});
  expect(errors).toEqual([]);
 });
}
