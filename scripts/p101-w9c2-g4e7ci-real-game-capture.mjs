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
 certifiedSlope2Meters:0,frames:[],pairs:[],warnings:[]};
// Two real PNG images from the same WebGL canvas, compared by Chromium's
// own 2D image decoder. This is not a subjective visual/ART grade.
async function compareTrueCanvasPixels(page,base,change){
 const inputs={a:base.toString('base64'),b:change.toString('base64')};
 return page.evaluate(async ({a,b})=>{
  const load=bytes=>new Promise((yes,no)=>{
   const i=new Image();i.onload=()=>yes(i);i.onerror=()=>no(Error('PNG image decode failed'));
   i.src='data:image/png;base64,'+bytes;
  });
  const [one,two]=await Promise.all([load(a),load(b)]);
  if(one.width!==two.width||one.height!==two.height)throw Error('PNG dimension mismatch');
  const w=one.width,h=one.height,c=document.createElement('canvas');c.width=w;c.height=h;
  const ctx=c.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(one,0,0);const p=ctx.getImageData(0,0,w,h).data;
  ctx.clearRect(0,0,w,h);ctx.drawImage(two,0,0);
  const q=ctx.getImageData(0,0,w,h).data;
  let changed=0,central=0,minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const k=(y*w+x)*4;
   const diff=Math.abs(p[k]-q[k])+Math.abs(p[k+1]-q[k+1])+Math.abs(p[k+2]-q[k+2]);
   if(diff<=48)continue;
   changed++;minX=Math.min(minX,x);minY=Math.min(minY,y);
   maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
   if(x>w*.38&&x<w*.66&&y>h*.44&&y<h*.89)central++;
  }
  return {w,h,pixelDifferenceCount:changed,changedFraction:Number((changed/(w*h)).toFixed(6)),
   centralWindowFraction:Number((central/(w*h)).toFixed(6)),
   changedBoundingBox:maxX<0?null:[minX,minY,maxX,maxY],
   source:'TWO_DIFFERENT_SCREENSHOTS_FROM_SAME_ACTUAL_GAME_WEBGL_CANVAS',
   roadGeometryNotInferredFromPixelDiff:true,visualApproval:'NOT_TESTED'};
 },inputs);
}
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-dev-shm-usage']});
 for(const road of ['true-pinch','pinch-switch'])for(const frame of ['t1500','t1700','t1850']){
  let baselineImage=null,baselineInfo=null;
  for(const mode of ['baseline','integrated']){
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
    cameraTime:c.dataset.g4e7bgTime,cameraSpeed:c.dataset.g4e7bgSpeed,
    eye:c.dataset.g4e7cjEye,forward:c.dataset.g4e7cjForward,
    triangles:c.dataset.g4e7ciTriangles,
    physicsUntouched:c.dataset.g4e7ciPhysicsUntouched,
    width:c.width,height:c.height,status:s?.textContent??''};
  });
  if(errors.length||info.point!==frame||info.mode!=='SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN'||
    !info.eye||info.eye==='off'||!info.forward||info.forward==='off'||
    !Number.isFinite(Number(info.cameraTime))||Number(info.cameraTime)<14||
    !Number.isFinite(Number(info.cameraSpeed))||Number(info.cameraSpeed)<52||
    (mode==='baseline'&&info.scene!=='off')||
    (mode==='integrated'&&(info.scene!=='INTEGRATED_PRIVATE_HOLD'||info.physicsUntouched!=='true')))
   throw Error('SAME_GAME_CAMERA_REQUIRED '+JSON.stringify({road,frame,mode,info,errors}));
  const name=road+'-'+frame+'-'+mode+'.png';
  const image=await page.locator('#view').screenshot({path:path.join(out,name)});
  report.frames.push({road,frame,mode,file:name,...info});
  if(mode==='baseline'){
   baselineImage=image;baselineInfo=info;
  }else{
   for(const key of ['cameraTime','cameraSpeed','road','point','mode','width','height','eye','forward']){
    if(baselineInfo[key]!==info[key])
     throw Error('NATIVE_CAMERA_PAIR_NOT_IDENTICAL '+JSON.stringify({road,frame,key,baseline:baselineInfo[key],integrated:info[key]}));
   }
   const pixel=await compareTrueCanvasPixels(page,baselineImage,image);
   report.pairs.push({road,frame,...pixel});
   if(pixel.changedFraction<.001)
    report.warnings.push('CITY_VANISHES_OR_NEAR_INVISIBLE_IN_FRAME '+road+' '+frame);
   if(pixel.centralWindowFraction>.13)
    report.warnings.push('POSSIBLE_ROAD_CENTER_SCREEN_CLUTTER '+road+' '+frame);
   console.log('G4E7CJ_VERIFIED_PIXEL_PAIR',JSON.stringify({road,frame,changedFraction:pixel.changedFraction,centralWindowFraction:pixel.centralWindowFraction}));
  }
  console.log('G4E7CI_REAL_GAME_FRAME',name,info.triangles);
  await page.close();
 }
 }
 report.actualGameWebGL='TRUE_GAME_CANVAS_WEBGL2_SAME_ORIGINAL_B48_AND_B51';
 report.screenshots=report.frames.length;
 if(report.screenshots!==12||report.pairs.length!==6||
    !report.pairs.some(x=>x.changedFraction>.001)||
    report.frames.filter(x=>x.mode==='integrated').some(x=>Number(x.triangles)<2500))
  throw Error('INCOMPLETE_PRIVATE_NATIVE_GAME_ART');
 fs.writeFileSync(path.join(out,'G4E7CI_REAL_GAME_SCREENSHOT_AUDIT_HOLD.json'),JSON.stringify(report,null,2)+'\n');
 console.log('G4E7CJ_REAL_GAME_PIXEL_AUDIT_ART_STILL_HOLD',JSON.stringify({screenshots:report.screenshots,pairs:report.pairs.length,warnings:report.warnings,
  triangles:report.frames.find(x=>x.mode==='integrated')?.triangles,art:report.art}));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
