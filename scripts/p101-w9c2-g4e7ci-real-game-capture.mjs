/** G4E-7CI: true PRIVATE in-game WebGL screenshots, real BG 240Hz frozen snapshots. */
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const out=path.resolve('test-results/g4e7ci-real-game');fs.mkdirSync(out,{recursive:true});
await new Promise((yes,no)=>server.once('error',no).listen(0,'127.0.0.1',yes));
const home='http://127.0.0.1:'+server.address().port+'/drive3d/';
const report={schema:'dopagaki.g4e7ci-genuine-game-WebGL-nativeBG-private/1',
 actualGameWebGL:'NOT_RUN',camera:'G4E7BG_REAL_240HZ_SCRIPTED_NOT_HUMAN',
 comparison:'EXACT_SAME_B48_B51_NATIVE_CAMERA_BASELINE_VS_INTEGRATED',
 originalB48:7,originalB51:28,gap52:true,physicsHz:240,
 human:'HOLD',art:'NOT_TESTED',publish:'FORBIDDEN',ready:'HOLD',merge:'HOLD',
 certifiedSlope2Meters:0,frames:[]};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-dev-shm-usage']});
 for(const road of ['true-pinch','pinch-switch'])for(const frame of ['t1500','t1700','t1850'])for(const mode of ['baseline','integrated']){
  const page=await browser.newPage({viewport:{width:1360,height:860},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const params=new URLSearchParams({g4e7al:'manual',g4e7be:'roll-deck',g4e7bg:'inspect',g4e7bgFrame:'hold',g4e7bgRoad:road,g4e7bgPoint:frame});
  if(mode==='integrated')params.set('g4e7ci','streetscape');
  await page.goto(home+'?'+params,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{
   const c=document.getElementById('view');
   return c?.dataset?.g4e7bgMode==='SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN';
  },null,{timeout:75000});
  await page.waitForTimeout(350);
  const info=await page.evaluate(()=>{
   const c=document.getElementById('view'),s=document.getElementById('appStatus');
   return {point:c.dataset.g4e7bgPoint,road:c.dataset.g4e7bgNativeRoad,
    mode:c.dataset.g4e7bgMode,scene:c.dataset.g4e7ciScene,
    triangles:c.dataset.g4e7ciTriangles,
    physicsUntouched:c.dataset.g4e7ciPhysicsUntouched,
    width:c.width,height:c.height,status:s?.textContent??''};
  });
  if(errors.length||info.point!==frame||info.mode!=='SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN'||
    (mode==='integrated'&&(info.scene!=='INTEGRATED_PRIVATE_HOLD'||info.physicsUntouched!=='true')))
   throw Error('SAME_GAME_CAMERA_REQUIRED '+JSON.stringify({road,frame,mode,info,errors}));
  const name=road+'-'+frame+'-'+mode+'.png';
  await page.locator('#view').screenshot({path:path.join(out,name)});
  report.frames.push({road,frame,mode,file:name,...info});
  console.log('G4E7CI_REAL_GAME_FRAME',name,info.triangles);
  await page.close();
 }
 report.actualGameWebGL='TRUE_GAME_CANVAS_WEBGL2_SAME_ORIGINAL_B48_AND_B51';
 report.screenshots=report.frames.length;
 if(report.screenshots!==12||report.frames.filter(x=>x.mode==='integrated').some(x=>Number(x.triangles)<2500))
  throw Error('INCOMPLETE_PRIVATE_NATIVE_GAME_ART');
 fs.writeFileSync(path.join(out,'G4E7CI_REAL_GAME_SCREENSHOT_AUDIT_HOLD.json'),JSON.stringify(report,null,2)+'\n');
 console.log('G4E7CI_GENUINE_PRIVATE_GAME_ART_STILL_HOLD',JSON.stringify({screenshots:report.screenshots,
  triangles:report.frames.find(x=>x.mode==='integrated')?.triangles,art:report.art}));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
