import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

// Baseline is the identical renderer with only the new edge strips disabled
// at the module response. No production switch, physics or camera override.
test('W9-C1 matched Chromium edge visibility comparison and frozen-stage isolation',async({context},info)=>{
 test.setTimeout(180000);
 const evidence=[],errors=[];
 for(const kind of ['CONTROL','ULTRA']){
  const shots={};
  for(const mode of ['baseline','edges']){
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   await page.clock.install({time:new Date('2026-10-19T00:00:00Z')});
   await page.clock.pauseAt(new Date('2026-10-19T00:00:01Z'));
   if(mode==='baseline')await page.route('**/p101-w9c1-approach-cue.mjs',async route=>{
    const response=await route.fetch();
    const source=await response.text();
    expect(source).toContain('{includeEdges=true}={}');
    await route.fulfill({response,body:source.replace('{includeEdges=true}={}','{includeEdges=false}={}')});
   });
   await page.goto('/drive3d/?stage=VB-P101-A13-W9C1-'+kind);
   for(let i=0;i<150;i++){
    await page.clock.runFor(100);
    if((await page.locator('#appStatus').textContent()).includes('W9-C1 ABYSS DIVE'))break;
   }
   await expect(page.locator('#appStatus')).toContainText('W9-C1 ABYSS DIVE');
   await expect(page.locator('#view')).toHaveAttribute('data-w9c1-edge-segments',mode==='edges'?'124':'0');
   for(const [spawn,label] of [['6','approach-200m'],['7','core-320m']]){
    // Authored local previews, 52m/s launch reset: NOT actual entry-speed
    // or a claim of two seconds of continuous human-visible warning.
    await page.evaluate(spawn=>{
     const el=document.querySelector('#spawn');el.value=spawn;
     el.dispatchEvent(new Event('change',{bubbles:true}));
     document.querySelector('#pause').click();
    },spawn);
    await page.clock.runFor(32);
    expect(await page.locator('#simTime').textContent()).toBe('0.00 s');
    await expect(page.locator('#view')).toHaveAttribute('data-machine-count','28');
    const name='w9c1-'+kind.toLowerCase()+'-'+label+'-'+mode+'.png';
    const buffer=await page.locator('#view').screenshot({path:info.outputPath(name)});
    shots[mode+'-'+label]=buffer.toString('base64');
   }
   if(mode==='edges'){
    // Shared render integration must completely clear C1 strips when switching.
    for(const id of ['VB-P101-A13','VB-P101-A13-W9X-B1','VB-P101-B5']){
     await page.locator('#stage').selectOption(id);
     for(let i=0;i<150;i++){
      await page.clock.runFor(100);
      if(await page.locator('#view').getAttribute('data-w9c1-edge-segments')==='0')break;
     }
     await expect(page.locator('#view')).toHaveAttribute('data-w9c1-edge-segments','0');
    }
   }
   await page.close();
  }
  const reader=await context.newPage();
  for(const label of ['approach-200m','core-320m']){
   const pixels=await reader.evaluate(async({a,b})=>{
    const decode=async data=>{
     const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+data)).blob());
     const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
     const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
     return {width:canvas.width,height:canvas.height,p:ctx.getImageData(0,0,canvas.width,canvas.height).data};
    };
    const x=await decode(a),y=await decode(b);
    if(x.width!==y.width||x.height!==y.height)throw Error('comparison resolution mismatch');
    let changedPixels=0,forwardChangedPixels=0,channelDelta=0;
    for(let i=0;i<x.p.length;i+=4){
     const d=Math.max(...[0,1,2].map(k=>Math.abs(x.p[i+k]-y.p[i+k])));
     if(d>20){
      changedPixels++;
      const row=Math.floor(i/4/x.width);
      if(row<x.height*.75)forwardChangedPixels++;
     }
     channelDelta+=d;
    }
    return {width:x.width,height:x.height,changedPixels,forwardChangedPixels,channelDelta};
   },{a:shots['baseline-'+label],b:shots['edges-'+label]});
   expect(pixels.changedPixels).toBeGreaterThan(10);
   expect(pixels.forwardChangedPixels).toBeGreaterThan(5);
   evidence.push({kind,preview:label,simulationSeconds:0,...pixels,
    inference:'rendered edge difference only; not visibility duration or human fairness'});
  }
  await reader.close();
 }
 await fs.writeFile(info.outputPath('w9c1-edge-visibility-audit.json'),JSON.stringify({
  schema:'dopagaki.w9c1-edge-visibility/1',evidence,errors,
  actualEntrySpeedTest:false,humanVisibilityConfirmed:false,humanFairness:'HOLD'
 },null,2));
 expect(errors).toEqual([]);
});
