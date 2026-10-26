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
  let changed=0,central=0,roiChanged=0,roiPixels=0,minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const k=(y*w+x)*4;
   const diff=Math.abs(p[k]-q[k])+Math.abs(p[k+1]-q[k+1])+Math.abs(p[k+2]-q[k+2]);
   if(x>=190&&x<440&&y>=205&&y<340){roiPixels++;if(diff>48)roiChanged++;}
   if(diff<=48)continue;
   changed++;minX=Math.min(minX,x);minY=Math.min(minY,y);
   maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
   if(x>w*.38&&x<w*.66&&y>h*.44&&y<h*.89)central++;
  }
  return {w,h,pixelDifferenceCount:changed,changedFraction:Number((changed/(w*h)).toFixed(6)),
   centralWindowFraction:Number((central/(w*h)).toFixed(6)),
   provenanceRoi:{xyxy:[190,205,439,339],changedPixels:roiChanged,totalPixels:roiPixels,
    changedFraction:Number((roiChanged/(roiPixels||1)).toFixed(6))},
   changedBoundingBox:maxX<0?null:[minX,minY,maxX,maxY],
   source:'TWO_DIFFERENT_SCREENSHOTS_FROM_SAME_ACTUAL_GAME_WEBGL_CANVAS',
   roadGeometryNotInferredFromPixelDiff:true,visualApproval:'NOT_TESTED'};
 },inputs);
}
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-dev-shm-usage']});
 for(const road of ['true-pinch','pinch-switch'])for(const frame of ['t1500','t1700','t1850']){
  let baselineImage=null,baselineInfo=null,integratedImage=null,integratedInfo=null;
  // Preserve 12 reference frames and two CR source-ID frames. CT adds only
  // three true-pinch/17s diagnostic frames, never changes baseline or camera.
  const variants=frame!=='t1700'?['baseline','integrated']:
   road==='true-pinch'?['baseline','integrated','source-id','ct-floor','ct-transit','ct-concourse']:
   ['baseline','integrated','source-id'];
  variants.push('dg','dh','di'); // frozen rejects + isolated DI spatial-depth pilot, core 17 unchanged
  for(const mode of variants){
  const page=await browser.newPage({viewport:{width:1360,height:860},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  if(mode==='di'){
   await page.route('**/p101-w9c2-g4e7dg-canyon-city.mjs',async route=>{
    await route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',
     body:fs.readFileSync(path.resolve('web/p101-w9c2-g4e7di-sky-fjord.mjs'),'utf8')});
   });
  }
  if(mode==='dh'){
   // Explicit PRIVATE-only source-route override of an existing experimental
   // module URL. No shared build/drive3d source change, no fake renderer.
   // The original WebGL engine + authentic BG240Hz camera still render it.
   await page.route('**/p101-w9c2-g4e7dg-canyon-city.mjs',async route=>{
    await route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',
     body:fs.readFileSync(path.resolve('web/p101-w9c2-g4e7dh-harbor-crescent.mjs'),'utf8')});
   });
  }
  const params=new URLSearchParams({g4e7al:'manual',g4e7be:'roll-deck',g4e7bg:'inspect',g4e7bgFrame:'hold',g4e7bgRoad:road,g4e7bgPoint:frame});
  if(mode!=='baseline')params.set('g4e7ci','streetscape');
  if(mode==='integrated'&&frame==='t1700')params.set('g4e7cq','trace');
  if(mode==='source-id')params.set('g4e7cr','station2-left-id');
  if(['dg','dh','di'].includes(mode))params.set('g4e7dg','canyon-city');
  const ctMode={'ct-floor':'promenade-floor','ct-transit':'promenade-transit',
   'ct-concourse':'civic-concourse-left'}[mode];
  if(ctMode)params.set('g4e7ct',ctMode);
  await page.goto(home+'?'+params,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{
   const c=document.getElementById('view');
   return c?.dataset?.g4e7bgMode==='SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN';
  },null,{timeout:75000});
  await page.waitForTimeout(350);
  const info=await page.evaluate(()=>{
   const c=document.getElementById('view'),s=document.getElementById('appStatus');
   return {point:c.dataset.g4e7bgPoint,road:c.dataset.g4e7bgNativeRoad,
    mode:c.dataset.g4e7bgMode,scene:c.dataset.g4e7ciScene,dgScene:c.dataset.g4e7dgScene||'off',
    cameraTime:c.dataset.g4e7bgTime,cameraSpeed:c.dataset.g4e7bgSpeed,
    eye:c.dataset.g4e7cjEye,forward:c.dataset.g4e7cjForward,
    triangles:c.dataset.g4e7ciTriangles,
    landmarksQA:c.dataset.g4e7cmLandmarksQA,
    cqTrace:c.dataset.g4e7cqTrace||null,
    g4e7crTriangles:c.dataset.g4e7crTriangles||'0',
    g4e7crKind:c.dataset.g4e7crKind||'off',
    g4e7ctTriangles:c.dataset.g4e7ctTriangles||'0',
    g4e7ctKind:c.dataset.g4e7ctKind||'off',
    physicsUntouched:c.dataset.g4e7ciPhysicsUntouched,
    width:c.width,height:c.height,status:s?.textContent??''};
  });
  if(errors.length||info.point!==frame||info.mode!=='SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN'||
    !info.eye||info.eye==='off'||!info.forward||info.forward==='off'||
    !Number.isFinite(Number(info.cameraTime))||Number(info.cameraTime)<14||
    !Number.isFinite(Number(info.cameraSpeed))||Number(info.cameraSpeed)<52||
    (mode==='baseline'&&info.scene!=='off')||
    (mode!=='baseline'&&(info.scene!=='INTEGRATED_PRIVATE_HOLD'||info.physicsUntouched!=='true'||
      !info.landmarksQA||info.landmarksQA==='off'||JSON.parse(info.landmarksQA).length!==2)))
   throw Error('SAME_GAME_CAMERA_REQUIRED '+JSON.stringify({road,frame,mode,info,errors}));
  const name=road+'-'+frame+'-'+mode+'.png';
  const image=await page.locator('#view').screenshot({path:path.join(out,name)});
  if(mode==='integrated'&&frame==='t1700'){
   if(!info.cqTrace)throw Error('CQ missing actual in-game camera triangle trace');
   const trace=JSON.parse(info.cqTrace);
   if(trace.width!==Number(info.width)||trace.height!==Number(info.height)||
      trace.probes.length!==15||trace.probes.every(x=>!x.candidate))
    throw Error('CQ incomplete candidate provenance '+JSON.stringify(trace));
   report.cqPixelTraces??={};report.cqPixelTraces[road]=trace;
   console.log('G4E7CQ_GL_PROJECTION_PIXEL_SOURCES',road,JSON.stringify(trace.probes));
  }
  // info.mode is the physical screenshot camera mode, NOT the capture variant.
  // Preserve both fields; spreading info previously overwrote mode.
  report.frames.push({road,frame,mode,file:name,...info,captureMode:mode});
  if(mode==='baseline'){
   baselineImage=image;baselineInfo=info;
  }else if(mode==='integrated'){
   integratedImage=image;integratedInfo=info;
   if(road==='true-pinch'&&frame==='t1700'){
    // From CQ's genuine framebuffer: 10,720 exact C.glass pixels in this ROI.
    // Require the three known giant panels to be gone without using fake renders.
    const teal=await page.evaluate(async (bytes)=>{
     const img=new Image();img.src='data:image/png;base64,'+bytes;
     await img.decode();
     const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
     const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
     const data=ctx.getImageData(0,0,c.width,c.height).data;
     let count=0;
     for(let y=205;y<Math.min(340,c.height);y++)for(let x=190;x<Math.min(440,c.width);x++){
      const i=(y*c.width+x)*4;
      if(data[i]===41&&data[i+1]===135&&data[i+2]===163)count++;
     }
     return {count,roi:[190,205,439,339],color:[41,135,163]};
    },image.toString('base64'));
    report.truePinchGlassRoi=teal;
    console.log('G4E7CS_PROVEN_GLASS_WALL_REMOVAL',JSON.stringify(teal));
    if(teal.count>1500)
     throw Error('CS known flat C.glass wall remains visible '+JSON.stringify(teal));
   }
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
  }else if(mode==='di'){
   if(!integratedImage||info.dgScene!=='SKY_FJORD_DEPTH_CITY_V1')
    throw Error('DI private true WebGL scene was not loaded '+JSON.stringify({road,frame,info}));
   for(const key of ['cameraTime','cameraSpeed','road','point','mode','width','height','eye','forward']){
    if(integratedInfo[key]!==info[key])
     throw Error('DI_NATIVE_CAMERA_MISMATCH '+JSON.stringify({road,frame,key}));
   }
   const pixel=await compareTrueCanvasPixels(page,integratedImage,image);
   report.diComparisons??=[];
   report.diComparisons.push({road,frame,from:'UNMODIFIED_CX',
    to:'DI_SKY_FJORD_PRIVATE',...pixel,art:'HOLD',human:'HOLD',
    provenance:'ACTUAL_UNCHANGED_GAME_WEBGL_PRIVATE_MODULE_OVERRIDE'});
   console.log('G4E7DI_ACTUAL_NATIVE_GAME_AB',JSON.stringify({road,frame,
    changedFraction:pixel.changedFraction,
    centralWindowFraction:pixel.centralWindowFraction}));
  }else if(mode==='dh'){
   if(!integratedImage||info.dgScene!=='HARBOR_CRESCENT_INHABITED_V1')
    throw Error('DH injected private game render missing '+JSON.stringify({road,frame,info}));
   for(const key of ['cameraTime','cameraSpeed','road','point','mode','width','height','eye','forward']){
    if(integratedInfo[key]!==info[key])
     throw Error('DH_NATIVE_CAMERA_MISMATCH '+JSON.stringify({road,frame,key}));
   }
   const pixel=await compareTrueCanvasPixels(page,integratedImage,image);
   report.dhComparisons??=[];
   report.dhComparisons.push({road,frame,from:'UNMODIFIED_CX',to:'DH_HARBOR_CRESCENT_PRIVATE',
    ...pixel,art:'HOLD',human:'HOLD',
    provenance:'PRIVATE_ROUTE_MODULE_SUBSTITUTION_ACTUAL_GAME_WEBGL_NOT_PRODUCTION'});
   console.log('G4E7DH_ACTUAL_GAME_WEBGL_A_B',JSON.stringify({road,frame,
    changedFraction:pixel.changedFraction,changedPixels:pixel.pixelDifferenceCount,
    centralWindowFraction:pixel.centralWindowFraction}));
  }else if(mode==='dg'){
   if(!integratedImage||info.dgScene!=='CANYON_CITY_INHABITED_VOLUME_V1')
     throw Error('DG actual game render missing pilot mesh '+JSON.stringify({road,frame,info}));
   for(const key of ['cameraTime','cameraSpeed','road','point','mode','width','height','eye','forward']){
    if(integratedInfo[key]!==info[key])
     throw Error('DG_NATIVE_CAMERA_MISMATCH '+JSON.stringify({road,frame,key}));
   }
   const pixel=await compareTrueCanvasPixels(page,integratedImage,image);
   report.dgComparisons??=[];
   report.dgComparisons.push({road,frame,from:'CX',to:'DG_PRIVATE_CANDIDATE',
     ...pixel,art:'HOLD',human:'HOLD',source:'ACTUAL_GAME_WEBGL_NOT_CPU'});
   console.log('G4E7DG_ACTUAL_GAME_COMPARISON',JSON.stringify({road,frame,
     changedFraction:pixel.changedFraction,changedPixels:pixel.pixelDifferenceCount,
     centralWindowFraction:pixel.centralWindowFraction}));
  }else if(ctMode){
   if(!integratedImage||Number(info.g4e7ctTriangles)<=0||info.g4e7ctKind!==ctMode)
    throw Error('CT missing authored source part '+JSON.stringify({road,frame,mode,info}));
   for(const key of ['cameraTime','cameraSpeed','road','point','mode','width','height','eye','forward']){
    if(integratedInfo[key]!==info[key])
     throw Error('CT_SOURCE_ID_CAMERA_MISMATCH '+JSON.stringify({road,frame,key}));
   }
   const pixel=await compareTrueCanvasPixels(page,integratedImage,image);
   report.ctSourceChecks??=[];
   report.ctSourceChecks.push({road,frame,kind:ctMode,
    sourceTriangles:Number(info.g4e7ctTriangles),
    comparedTo:'same-game-integrated-original',...pixel,
    sourceIdOnly:true,art:'HOLD'});
   console.log('G4E7CT_GPU_PART_COLOR_AB',JSON.stringify({road,frame,
    kind:ctMode,sourceTriangles:info.g4e7ctTriangles,roi:pixel.provenanceRoi}));
  }else{
   if(!integratedImage||Number(info.g4e7crTriangles)<=0)
    throw Error('CR missing genuine PRIVATE station2 left source '+JSON.stringify({road,frame,info}));
   for(const key of ['cameraTime','cameraSpeed','road','point','mode','width','height','eye','forward']){
    if(integratedInfo[key]!==info[key])
     throw Error('CR_SOURCE_ID_CAMERA_MISMATCH '+JSON.stringify({road,frame,key}));
   }
   const pixel=await compareTrueCanvasPixels(page,integratedImage,image);
   report.sourceIdChecks??=[];
   report.sourceIdChecks.push({road,frame,kind:info.g4e7crKind,
    sourceTriangles:Number(info.g4e7crTriangles),comparedTo:'same-game-integrated-original',
    ...pixel,sourceIdOnly:true,art:'HOLD'});
   if(pixel.provenanceRoi.changedFraction<.005)
    throw Error('CR source ID does not alter expected wall region '+JSON.stringify({road,pixel}));
   if(road==='pinch-switch'&&frame==='t1700'){
    // CX real GPU source-ID had 109,914 opaque magenta pixels in the
    // near-road left half BEFORE the camera-screen clearance rule and
    // 13,423 AFTER it. This protects high-speed sightlines from relapse.
    // Diagnostic-only vertex recolor; actual road and camera untouched.
    const clearance=await page.evaluate(async bytes=>{
     const img=new Image();img.src='data:image/png;base64,'+bytes;await img.decode();
     const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
     const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
     const p=ctx.getImageData(0,0,c.width,c.height).data;
     const x0=0,y0=25,x1=Math.min(502,c.width),y1=Math.min(437,c.height);
     let sourcePixels=0;
     for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
      const k=(y*c.width+x)*4;
      if(p[k]===255&&p[k+1]===0&&p[k+2]===255)sourcePixels++;
     }
     const total=(x1-x0)*(y1-y0);
     return {sourcePixels,total,leftNearScreenFraction:Number((sourcePixels/total).toFixed(6)),
      roi:[x0,y0,x1-1,y1-1],source:'PRIVATE_ACTUAL_GPU_SOURCE_ID_MAGENTA_NOT_ART'};
    },image.toString('base64'));
    report.cxOpenVisibility=clearance;
    console.log('G4E7CX_TRUE_GPU_NEAR_ROAD_VISIBILITY',JSON.stringify(clearance));
    if(clearance.leftNearScreenFraction>=.18)
     throw Error('CX near-bank giant inhabited building obscures highway sightline '+JSON.stringify(clearance));
   }
   console.log('G4E7CR_GPU_SOURCE_COLOR_AB',JSON.stringify({road,frame,kind:info.g4e7crKind,
    sourceTriangles:info.g4e7crTriangles,roi:pixel.provenanceRoi}));
  }
  if(mode==='integrated')console.log('G4E7CM_CAMERA_SITES_REAL_FRAME',road,frame,info.landmarksQA);
  console.log('G4E7CI_REAL_GAME_FRAME',name,info.triangles);
  await page.close();
 }
 }
 report.actualGameWebGL='TRUE_GAME_CANVAS_WEBGL2_SAME_ORIGINAL_B48_AND_B51';
 report.screenshots=report.frames.filter(x=>['baseline','integrated'].includes(x.captureMode)).length;
 report.provenanceDiagnosticScreenshots=report.frames.filter(x=>x.captureMode==='source-id').length;
 report.ctDiagnosticScreenshots=report.frames.filter(x=>x.captureMode.startsWith('ct-')).length;
 if(report.screenshots!==12||report.provenanceDiagnosticScreenshots!==2||
    report.ctDiagnosticScreenshots!==3||report.ctSourceChecks?.length!==3||
    report.sourceIdChecks?.length!==2||report.dgComparisons?.length!==6||
    report.dhComparisons?.length!==6||report.diComparisons?.length!==6||
    !report.cxOpenVisibility||report.pairs.length!==6||
    !report.pairs.some(x=>x.changedFraction>.001)||
    report.frames.filter(x=>x.captureMode==='integrated').some(x=>Number(x.triangles)<1000))
  throw Error('INCOMPLETE_PRIVATE_NATIVE_GAME_ART');
 fs.writeFileSync(path.join(out,'G4E7CI_REAL_GAME_SCREENSHOT_AUDIT_HOLD.json'),JSON.stringify(report,null,2)+'\n');
 console.log('G4E7CJ_REAL_GAME_PIXEL_AUDIT_ART_STILL_HOLD',JSON.stringify({screenshots:report.screenshots,pairs:report.pairs.length,warnings:report.warnings,
  triangles:report.frames.find(x=>x.captureMode==='integrated')?.triangles,
  ctSources:report.ctSourceChecks?.map(x=>({kind:x.kind,roi:x.provenanceRoi})),
  art:report.art}));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
