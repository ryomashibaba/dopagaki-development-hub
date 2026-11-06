/** K4CT R16 private-only genuine viewForPose read-only physical placement study.
 * Source camera and 240Hz physics are never overwritten. Screenshots of source
 * game WITHOUT Blender scenery are not ART evidence. Candidate cuboids are
 * analytic projection envelopes, never rendered mesh/collider or fake hazards.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
const OUT=path.resolve('test-results/k4ct-r16-camera-sites');
fs.mkdirSync(OUT,{recursive:true});
const source=fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs');
const blobSHA=crypto.createHash('sha1').update(Buffer.concat([
 Buffer.from('blob '+source.length+'\0'),source])).digest('hex');
assert.equal(blobSHA,'af076d67492a677d2235e4730aef8cdf4808e106');
const site=JSON.parse(fs.readFileSync('test-results/k4ct-contact-retry/K4CT_DCC_AUTHENTIC_SITE.json'));
assert.equal(site.originalB48Count,7);assert.equal(site.originalB51Count,28);
assert.equal(site.researchPhysicalRoad5SHA256,
 '4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b');
const file='dist-private/k4ct/drive3d.mjs',raw=fs.readFileSync(file,'utf8');
const anchor=' const view=viewForPose(pose,cameraState);';
assert.equal(raw.split(anchor).length,2);
const injection=[
 ' // R16 observation ONLY: actual original viewForPose used by source WebGL2.',
 ' if(doc?.stageForge?.k4ctPrivate&&view&&runner){',
 ' window.__k4ctR16SourceView={eye:[...view.eye],right:[...view.right],',
 ' up:[...view.up],front:[...view.front],ball:[...view.ballPosition],',
 ' nativeTick:r15s3d10NativeTicks,sourceTime:runner.time,w,h,original:true};',
 ' }'
].join('\n');
fs.writeFileSync(file,raw.replace(anchor,anchor+'\n'+injection));
assert(!fs.readFileSync('web/p101-w9c2-g4e7ci-integrated-streetscape.mjs','utf8').includes('__k4ctR16SourceView'));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const scale=(a,k)=>a.map(x=>x*k);
const unit=v=>scale(v,1/(Math.hypot(...v)||1));
const round=(v,n=4)=>Number(v.toFixed(n));
function roadFrame(road,u){
 const r=site.roads.find(x=>x.index===road);assert(r);
 const val=(u,k)=>{
  let f=Math.max(0,Math.min(1,u))*128,i=Math.min(127,Math.floor(f)),t=f-i;
  return r.samples[i][k].map((v,j)=>v*(1-t)+r.samples[i+1][k][j]*t);
 };
 const left=val(u,'left'),right=val(u,'right');
 const before=val(u-.012,'center'),after=val(u+.012,'center');
 return {left,right,forward:unit([after[0]-before[0],0,after[2]-before[2]]),
  lateral:unit([right[0]-left[0],0,right[2]-left[2]])};
}
function worldPlace(index,u,side,distance,h){
 const f=roadFrame(index,u),sgn=side==='R'?1:-1;
 const edge=sgn===1?f.right:f.left;
 return {p:add(add(edge,scale(f.lateral,sgn*distance)),[0,h,0]),f};
}
function project(v,p){
 const rel=sub(p,v.eye),z=dot(rel,v.front);
 if(z<=1.4)return null;
 return {x:1.35*dot(rel,v.right)/((v.w/v.h)*z),
  y:1.35*dot(rel,v.up)/z,z};
}
const grid=[];
for(const [road,lo,hi,step] of [[5,.68,.99,.03],[6,.12,.90,.04]])
 for(let u=lo;u<=hi+.000001;u+=step)
  for(const side of ['L','R'])for(const dist of [55,85,115,155])
   for(const elev of [-25,0,25,45]){
    const {p,f}=worldPlace(road,u,side,dist,elev);
    grid.push({road,u:round(u,3),side,dist,elev,p,f});
   }
function screenAnalysis(v,sec){
 assert(v?.original&&Number.isFinite(v.nativeTick));
 const target=sec===65.25?[-.48,.16]:sec===66.35?[.48,.13]:[-.45,.22];
 const result=[];
 for(const s of grid){
  const c=project(v,s.p);if(!c)continue;
  const corners=[];
  for(const a of [-24,24])for(const b of [-14,14])for(const h of [0,62])
   corners.push(project(v,add(s.p,add(scale(s.f.forward,a),
    add(scale(s.f.lateral,b),[0,h,0])))));
  if(corners.some(x=>!x))continue;
  const xmin=Math.min(...corners.map(x=>x.x)),xmax=Math.max(...corners.map(x=>x.x)),
   ymin=Math.min(...corners.map(x=>x.y)),ymax=Math.max(...corners.map(x=>x.y));
  const area=Math.max(0,Math.min(1,xmax)-Math.max(-1,xmin))*
   Math.max(0,Math.min(1,ymax)-Math.max(-1,ymin))/4;
  if(!(Math.abs(c.x)<.83&&c.y>-.36&&c.y<.70&&c.z>100&&c.z<1100&&area>.006&&area<.24))continue;
  const central=(xmin<.24&&xmax>-.24&&ymin<.25&&ymax>-.55);
  if(central)continue; // conservative screen-core priority; NOT actual hazard clearance
  result.push({road:s.road,u:s.u,side:s.side,outboardM:s.dist,
   heightAboveRealEdgeM:s.elev,world:s.p.map(x=>round(x,3)),
   centerNDC:[round(c.x),round(c.y)],depthM:round(c.z,1),
   bboxNDC:[xmin,ymin,xmax,ymax].map(x=>round(x,4)),
   screenAreaFraction:round(area,5),
   heuristicOffAxis:round(Math.abs(c.x-target[0])+Math.abs(c.y-target[1])+
     (c.z<220?(220-c.z)/300:0)+(s.road===(sec===65.25?5:6)?0:.4),5)});
 }
 result.sort((a,b)=>a.heuristicOffAxis-b.heuristicOffAxis);
 return {time:sec,actualNativeTick:v.nativeTick,sourceCamera:{
  eye:v.eye,front:v.front,right:v.right,up:v.up,ball:v.ball,
  framebuffer:[v.w,v.h]},
  candidateCount:result.length,topSites:result.slice(0,16),
  notActuallyDrawn:true,notRealOcclusion:true,notArtOrSafetyCertificate:true};
}
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader',
  '--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 const ctx=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE',
  {waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.getElementById('view')?.dataset.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ'&&
  window.__k4ctR16SourceView?.original,undefined,{timeout:90000});
 assert(await page.evaluate(()=>document.getElementById('view').getContext('webgl2') instanceof WebGL2RenderingContext));
 await page.locator('#cameraCompare').click();
 await page.locator('#demoSpeed').selectOption('2');
 await page.evaluate(()=>window.__r15s3d10PauseAt=63.70);
 await page.locator('#demoRun').click();
 async function paused(t){
  await page.waitForFunction(t=>{const c=document.getElementById('view');
   return (Number(c.dataset.r15s3d10NativeTicks)>=Math.floor(t*240)-2&&
    Math.abs(Number(c.dataset.r15s3d10PausedAt)-t)<.009&&c.dataset.r15s3d10Status==='running')||
    ['failed','finished'].includes(c.dataset.r15s3d10Status);
  },t,{timeout:120000,polling:50});
  assert.equal(await page.locator('#view').getAttribute('data-r15s3d10-status'),'running');
 }
 await paused(63.70);
 await page.locator('#takeoverRun').click();
 await page.waitForFunction(()=>document.getElementById('view').dataset.k4csControlMode==='ORIGINAL_MANUAL_UNCERTIFIED',
  undefined,{timeout:15000});
 async function step(t,resume=true){
  await page.evaluate(x=>window.__r15s3d10PauseAt=x,t);
  if(resume)await page.locator('#pause').click();
  await paused(t);
 }
 const readings=[];
 async function capture(sec){
  await page.waitForFunction(()=>{
   const c=document.getElementById('view');
   return window.__k4ctR16SourceView?.nativeTick===Number(c.dataset.r15s3d10NativeTicks);
  },undefined,{timeout:15000,polling:50});
  const v=await page.evaluate(()=>window.__k4ctR16SourceView);
  assert(Math.abs(v.nativeTick-sec*240)<=2);
  const analysis=screenAnalysis(v,sec);
  const name='K4CT_R16_ORIGINAL_SOURCE_NO_DCC_T'+String(sec).replace('.','_')+'.png';
  await page.screenshot({path:path.join(OUT,name)});
  analysis.nativeNoDCCRaw=name;readings.push(analysis);
  assert(analysis.candidateCount>0,'no geometrically visible candidate at '+sec);
 }
 await step(65.25);await capture(65.25);
 await page.keyboard.down('KeyD');await step(65.36);await page.keyboard.up('KeyD');
 await step(65.79);await page.keyboard.down('KeyD');await step(65.91);
 await page.keyboard.up('KeyD');await step(66.35);await capture(66.35);
 await step(68.05);await capture(68.05);
 assert.equal(errors.length,0,'actual Chromium error: '+errors.join(';'));
 const output={schema:'k4ct-r16-real-original-camera-physical-site-projection-v1',
  originalGameGitBlobSHA1:blobSHA,sourceRoad5SHA256:site.researchPhysicalRoad5SHA256,
  actualOriginalSourceViewForPose:true,actualNativeWebGL2:true,actual240Hz:true,
  nativeOriginalB48Count:7,nativeOriginalB51Count:28,
  sourceCameraUnmodified:true,actualInputOriginalKeyD:true,
  siteEnvelopesAnalyticNotMeshes:true,actualDccGeometry:'ABSENT_IN_THIS_LIGHTWEIGHT_PROBE',
  notGLDepthOcclusionProven:true,noAdditionalColliders:true,
  officialARTAdopted:0,slope2DNAmeters:0,ART:'HOLD',HUMAN:'HOLD',
  SAT:'HOLD',CCD:'HOLD',FPS:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
  readings,fullOriginalCameraSourceFrameCount:3,
  caution:'This is genuine source-camera projection from private WebGL2 and original 240Hz. Concept bbox does NOT prove raster visibility or aesthetic quality; actual source scene raw lacks the authored Blender overlay.'};
 fs.writeFileSync(path.join(OUT,'K4CT_R16_TRUE_CAMERA_PLACEMENT_PREFLIGHT.json'),
  JSON.stringify(output,null,2)+'\n');
 console.log('K4CT_R16_SOURCE_CAMERA_PLACEMENT_PASS',
  JSON.stringify(readings.map(r=>({t:r.time,tick:r.actualNativeTick,
   candidates:r.candidateCount,top:r.topSites.slice(0,2)}))));
 await ctx.close();
}finally{
 await browser?.close().catch(()=>{});
 await new Promise(resolve=>server.close(resolve));
}
