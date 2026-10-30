/**
 * Truth-based R15S3D15 visual planning: ORIGINAL viewForPose() recorded
 * inside the unchanged source WebGL2 renderer. Screen projection is the
 * original GLSL: gl_Position=(1.35*x/aspect,1.35*y,...,z).
 * Calculate candidates on ACTUAL frozen B48 surface and label screen
 * visibility; never pretend these points are built city or collisions.
 */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {sample} from '../private/reference_only/director/surface.js';
const root=process.cwd(),out=path.join(root,'test-results/r15s3d15-real-camera-projection');
fs.mkdirSync(out,{recursive:true});
const versions=[
 {world:'true-pinch',stage:'R15S3D14R1-TRUE-PINCH-HABITAT',base:'R15S3D11_TRUE_PINCH_A_EDGE_READABLE_PRIVATE.json'},
 {world:'pinch-switch',stage:'R15S3D14R1-PINCH-SWITCH-HABITAT',base:'R15S3D11_PINCH_SWITCH_A_EDGE_READABLE_PRIVATE.json'}
];
const sites=[];
for(const road of [5,6]){
 const steps=road===5?[.18,.33,.48,.62,.78,.91]:[.16,.30,.44,.62,.78];
 for(const u of steps)for(const offset of [-240,-120,0,120,240])for(const up of [0,100,200,330])
 sites.push({road,u,offset,up});
}
const original=fs.readFileSync(path.join(root,'web/p101-w9c2-g4e7ci-integrated-streetscape.mjs'));
const hash=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+original.length+'\0'),original])).digest('hex');
assert.equal(hash,'af076d67492a677d2235e4730aef8cdf4808e106');
await new Promise((res,rej)=>server.once('error',rej).listen(0,'127.0.0.1',res));
const url='http://127.0.0.1:'+server.address().port,record={schema:'r15s3d15-true-original-webgl2-240hz-camera-projection/1',
 sourceBlob:hash,allB48:7,originalB51:28,perWorld:[],humanTested:false,
 candidateSiteIsRealConstructedArt:false,realGLSLEyeProjection:true,ART:'HOLD',RELEASE:'HOLD'};
let browser;
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),minus=(a,b)=>a.map((v,i)=>v-b[i]),length=v=>Math.hypot(...v);
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-dev-shm-usage']});
 for(const spec of versions){
  const doc=JSON.parse(fs.readFileSync(path.join(root,'dist-private/generated',spec.base),'utf8'));
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  const siteWorld=sites.map(a=>{
   const road=doc.surfaces[a.road],center=sample(road,a.u,.5);
   const before=sample(road,Math.max(.0001,a.u-.003),.5),after=sample(road,Math.min(.9999,a.u+.003),.5);
   const dr=minus(after,before),t=[dr[0],0,dr[2]],tm=length(t),forward=t.map(x=>x/tm),
    normal=[-forward[2],0,forward[0]];
   return {...a,p:[center[0]+normal[0]*a.offset,center[1]+a.up,center[2]+normal[2]*a.offset]};
  });
  const context=await browser.newContext({viewport:{width:1365,height:930},deviceScaleFactor:1});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(url+'/r15s3d15/?r15s3d14r1=on&stage='+encodeURIComponent(spec.stage),{waitUntil:'domcontentloaded',timeout:45000});
   await page.waitForFunction(stage=>document.querySelector('#stage')?.value===stage&&document.querySelector('#view')?.dataset?.r15s3d10OriginalGame==='REAL_WEBGL2_SOURCE_240HZ',spec.stage,{timeout:120000});
   await page.locator('#cameraCompare').click();
   await page.waitForFunction(()=>document.querySelector('#view')?.dataset.cameraMode==='ball-lock-unfiltered-heading');
   await page.locator('#demoSpeed').selectOption('2');
   const shots=[];
   for(const when of [54,58,61,64,67]){
    await page.evaluate(t=>{window.__r15s3d10PauseAt=t},when);
    if(shots.length===0)await page.locator('#demoRun').click();
    else await page.locator('#pause').click();
    await page.waitForFunction(t=>{
     const c=document.getElementById('view');return Math.abs(Number(c?.dataset?.r15s3d10PausedAt)-t)<.0085;
    },when,{timeout:120000,polling:40});
    const v=await page.evaluate(()=>{
     const c=document.getElementById('view'),d=c.dataset;
     return {eye:JSON.parse(d.r15s3d15ActualCameraEye),
      front:JSON.parse(d.r15s3d15ActualCameraFront),
      right:JSON.parse(d.r15s3d15ActualCameraRight),
      up:JSON.parse(d.r15s3d15ActualCameraUp),
      nativePose:JSON.parse(d.r15s3d15ActualNativePose),
      currentRoad:d.r15s3d10Road,nativeTicks:Number(d.r15s3d10NativeTicks),
      nativeStatus:d.r15s3d10Status,width:c.width,height:c.height,
      actualWebGL2:c.getContext('webgl2') instanceof WebGL2RenderingContext,
      cameraMode:d.cameraMode,sourceB48:Number(d.r15s3d14r1PrivateOriginalB48),
      sourceB51:Number(d.r15s3d14r1PrivateOriginalB51)};
    });
    assert.equal(v.nativeTicks,when*240);assert.equal(v.nativeStatus,'running');
    assert.ok(v.actualWebGL2);assert.equal(v.cameraMode,'ball-lock-unfiltered-heading');
    assert.equal(v.sourceB48,7);assert.equal(v.sourceB51,28);
    for(const a of [v.front,v.right,v.up])assert.ok(Math.abs(length(a)-1)<.01);
    assert.ok(Math.abs(dot(v.front,v.right))<.01&&Math.abs(dot(v.up,v.front))<.01);
    const aspect=v.width/v.height;
    const projections=siteWorld.map(site=>{
     const w=minus(site.p,v.eye),z=dot(w,v.front);
     const sx=z>0?1.35*dot(w,v.right)/aspect/z:null,
      sy=z>0?1.35*dot(w,v.up)/z:null;
     const visible=z>1&&Math.abs(sx)<.85&&Math.abs(sy)<.78;
     return {road:site.road,u:site.u,offset:site.offset,height:site.up,
      distanceToCamera:Number(length(w).toFixed(1)),frontDepthM:Number(z.toFixed(1)),
      screenX:sx===null?null:Number(sx.toFixed(4)),
      screenY:sy===null?null:Number(sy.toFixed(4)),inMainVisibleArea:visible,
      nearHorizon:visible&&Math.abs(sy)<.48};
    });
    const centered=projections.filter(p=>p.nearHorizon);
    const screenshot=spec.world+'_'+when+'s_REAL_ORIGINAL_WEBGL2_CAMERA.png';
    await page.locator('#view').screenshot({path:path.join(out,screenshot)});
    shots.push({time:when,...v,screenshot,projectedPositions:projections,
     countInsideCentralCamera:projections.filter(p=>p.inMainVisibleArea).length,
     horizonVisibleAnchors:centered.length,preferredFrontalPositions:centered
      .filter(p=>p.frontDepthM>100&&p.frontDepthM<2200)
      .sort((a,b)=>Math.abs(a.screenX)+Math.abs(a.screenY)-Math.abs(b.screenX)-Math.abs(b.screenY))
      .slice(0,18)});
    console.log('R15S3D15_REAL_ORIGINAL_CAMERA_FRUSTUM',JSON.stringify({world:spec.world,t:when,eye:v.eye,forward:v.front,
      sourceRoad:v.currentRoad,nativeTicks:v.nativeTicks,
      visible:centered.length,central:shots.at(-1).preferredFrontalPositions.slice(0,8)}));
   }
   assert.equal(errors.length,0,errors.join('; '));
   record.perWorld.push({world:spec.world,shots});
  }finally{await context.close()}
 }
}finally{
 if(browser)await browser.close();
 await new Promise(res=>server.close(res));
 fs.writeFileSync(path.join(out,'R15S3D15_ACTUAL_SOURCE_CAMERA_FRUSTUM_AND_VISIBLE_B48_ANCHORS.json'),JSON.stringify(record,null,2)+'\n');
}
assert.equal(record.perWorld.length,2);assert.ok(record.perWorld.every(x=>x.shots.length===5));
assert.ok(record.perWorld.flatMap(x=>x.shots).every(x=>x.horizonVisibleAnchors>=1),'source camera frames cannot see any candidate city');
console.log('R15S3D15_REAL_NATIVE_CAMERA_PLACEMENT_GATE',JSON.stringify({
 sourceCameraShots:10,realWebGL2:true,trueTwoWorlds:true,
 movingB51Untouched:28,roadObjectsUntouched:7,
 actualVisibleCoordinateProjections:true,notOcclusionProof:true,
 artistApproval:'HOLD'}));
