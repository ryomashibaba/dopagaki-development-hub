import {test,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';

/**
 * P98 real rendered-output audit. Not a fake static mock screenshot:
 * samples the live WebGL2 canvas, true B48/B51-C moving hazard course,
 * native 240Hz spectator (same browser path as the actual game), performance,
 * and stable heading lag at representative real physical run times.
 *
 * This is automated visual EVIDENCE, NOT a human enjoyment PASS.
 */
test('P98 real browser frame evidence from live P97 12-machine VOID BREAKER run',async({page},testInfo)=>{
 test.setTimeout(165000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P95');
 await expect(page.locator('#view')).toHaveAttribute('data-hazard-gate-count','36',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await page.locator('#demoSpeed').selectOption('2');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 // This was a real P98 failure mode: clicking the lower setup controls used
 // to leave the actual ball/road canvas above the viewport.
 await page.waitForFunction(()=>{
  const box=document.querySelector('#view')?.getBoundingClientRect();
  return box&&box.top>=-3&&box.top<window.innerHeight/5&&box.bottom<=window.innerHeight+3;
 },null,{timeout:5000});
 const results=[];
 for(const [target,label] of [[3,'opening'],[12,'crown'],[23,'underpass'],[33,'surge']]){
  await page.waitForFunction(t=>(parseFloat(document.querySelector('#simTime')?.textContent)||0)>=t,target,{timeout:75000});
  const data=await page.evaluate(()=>{
   const cv=document.querySelector('#view');
   const gl=cv.getContext('webgl2');
   let rgba=[0,0,0,0];
   if(gl){
    const pixel=new Uint8Array(4);
    gl.readPixels(Math.floor(cv.width/2),Math.floor(cv.height/2),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
    rgba=Array.from(pixel);
   }
   const box=cv.getBoundingClientRect();
   return {
    viewportCanvasTop:Number(box.top.toFixed(1)),
    viewportCanvasBottom:Number(box.bottom.toFixed(1)),
    pageScrollY:Math.round(window.scrollY),
    simSeconds:parseFloat(document.querySelector('#simTime')?.textContent)||0,
    fps:parseFloat(document.querySelector('#fps')?.textContent)||0,
    cameraHeadingLagDegrees:parseFloat(cv.dataset.cameraHeadingLagDegrees)||0,
    cameraMode:cv.dataset.cameraMode,
    runMode:cv.dataset.runMode,
    resolution:[cv.width,cv.height],
    movingMachineCount:Number(cv.dataset.machineCount),
    hazardGateCount:Number(cv.dataset.hazardGateCount),
    hazardUrgency:cv.dataset.hazardUrgency,
    hazardTarget:cv.dataset.hazardTarget,
    hazardEta:cv.dataset.hazardEta,
    renderScale:parseFloat(cv.dataset.renderScale)||0,
    centerPixel:rgba
   };
  });
  const screenshot=testInfo.outputPath('p98-'+label+'-'+target+'s.png');
  await page.screenshot({path:screenshot,fullPage:false,animations:'disabled'});
  await page.locator('#view').screenshot({path:testInfo.outputPath('p98-'+label+'-'+target+'s-canvas.png'),animations:'disabled'});
  results.push({label,target,...data});
 }
 await expect(page.locator('#resultTitle')).toHaveText('DEMO COMPLETE',{timeout:85000});
 await expect(page.locator('#view')).toHaveAttribute('data-run-outcome','finished');
 const report={schema:'dopagaki.p98.real-webgl2-snapshot/1',
  environment:'GitHub Actions Chromium software-rendered; NOT owner PC or iPhone',
  stage:'VB-P95',simulatedFullRun:true,humanVisualReview:'NOT_RUN',
  developerMeasurementsAreHumanFPS:false,samples:results,pageErrors:errors};
 await writeFile(testInfo.outputPath('p98-playfeel-report.json'),JSON.stringify(report,null,2)+'\n');
 expect(errors).toEqual([]);
 expect(results).toHaveLength(4);
 expect(results.every(s=>s.runMode==='spectator-demo'&&s.movingMachineCount===12&&s.hazardGateCount===36)).toBe(true);
 expect(results.every(s=>s.fps>0&&s.resolution[0]>0&&s.resolution[1]>0)).toBe(true);
 expect(results.every(s=>s.cameraMode==='ball-lock-interpolated')).toBe(true);
 expect(results.every(s=>s.viewportCanvasTop>=-3&&s.viewportCanvasBottom<=903)).toBe(true);
});
