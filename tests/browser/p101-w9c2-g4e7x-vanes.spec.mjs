import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
test('G4E-7X V2 outboard road-side tall shards vs unmodified actual 240Hz camera',async({page},info)=>{
 test.setTimeout(320000);const evidence=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const [name,suffix] of [['A065','0-65'],['A070','0-7']])
  for(const point of ['approach','lip','flight'])
   for(const mode of ['baseline','vanes']){
    const stage='VB-P101-A13-W9C2-G4E7W-BLEND-'+suffix;
    const qs='/drive3d/?g4e7w=on&g4e7wFrame=hold&g4e7wPoint='+point+
     (mode==='vanes'?'&g4e7xGuide=vanes':'')+'&stage='+stage;
    await page.goto(qs);
    const canvas=page.locator('#view');
    await expect(page.locator('#appStatus')).toContainText('G4E-7W LOCAL',{timeout:45000});
    await expect(canvas).toHaveAttribute('data-g4e7x-guide',mode==='vanes'?
      'REAL_OUTBOARD_FINS_NONCOLLISION':'off');
    const q=await page.evaluate(()=>{const d=document.querySelector('#view').dataset;
     return {speed:Number(d.g4e7wSpeedMps),time:Number(d.g4e7wTime),
      markerCount:Number(d.g4e7xOutboardVanes),
      triangles:Number(d.g4e7xGuideTriangles),
      minOutboard:Number(d.g4e7xMinimumOutboardMeters),
      noDeck:d.g4e7xNoFakeBridge,machineCount:Number(d.machineCount),
      source:d.g4e7wMode};
    });
    expect(q.source).toBe('ACTUAL_B48_240HZ_NOT_HUMAN');
    expect(q.speed).toBeGreaterThan(75);
    expect(q.machineCount).toBe(28);
    expect(q.noDeck).toBe('true');
    if(mode==='vanes'){
     expect(q.markerCount).toBe(10);expect(q.triangles).toBe(60);
     expect(q.minOutboard).toBe(3.2);
    }else{expect(q.markerCount).toBe(0);expect(q.triangles).toBe(0);}
    const file='g4e7x-v2-'+name.toLowerCase()+'-'+point+'-'+mode+'.png';
    await canvas.screenshot({path:info.outputPath(file)});
    evidence.push({file,name,point,mode,q});
   }
 expect(errors).toEqual([]);
 for(const name of ['A065','A070'])for(const point of ['approach','lip','flight']){
  const records=evidence.filter(x=>x.name===name&&x.point===point);
  expect(records.length).toBe(2);
  expect(records[0].q.speed).toBe(records[1].q.speed);
  expect(records[0].q.time).toBe(records[1].q.time);
 }
 await fs.writeFile(info.outputPath('g4e7x-v2-real-240hz-outboard.json'),JSON.stringify({
  schema:'dopagaki.g4e7x-v2-real-B48-outboard-GPU/1',evidence,
  humanApproval:'HOLD',publicRelease:false,officialSlope2Meters:0},null,2));
});
