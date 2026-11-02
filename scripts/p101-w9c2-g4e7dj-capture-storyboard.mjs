/** G4E-7DJ: true continuous PRIVATE WebGL storyboard (20 images).
 * All source substitutions are browser routes, NEVER persisted to game.
 * Default CX city remains byte-for-byte original.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {g4e7djNativeStoryboard,BG_SHOTS} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';
const root=path.resolve('test-results/g4e7dj-storyboard');
fs.mkdirSync(root,{recursive:true});
const native=g4e7djNativeStoryboard(),frozen=g4e7bgNativeFrames();
for(const road of ['true-pinch','pinch-switch'])
 assert.deepEqual(native.stages[road].frames.slice(0,3),frozen.stages[road].frames,
 'DJ storyboard MUST NOT alter canonical 15/17/18.5s physics/camera state');
const code=fs.readFileSync('web/drive3d.mjs','utf8');
const originalPointSet="['t1500','t1700','t1850'].includes";
const newPointSet='['+BG_SHOTS.map(x=>JSON.stringify(x.id)).join(',')+'].includes';
if(code.split(originalPointSet).length!==2)throw Error('Unrecognized game source: refuse DJ browser override');
const browserOnlyCode=code.replace(originalPointSet,newPointSet);
if(browserOnlyCode.length<=code.length||browserOnlyCode===code)throw Error('DJ override not made');
const result={id:'G4E7DJ_PRIVATE_NATIVE_STORYBOARD',physical:'UNMODIFIED',
 coreNativeFramesMatched:true,original7B48:true,original28B51:true,gap52:true,
 camera:'ORIGINAL_BALL_RELATIVE_BG_240HZ_NOT_HUMAN',art:'HOLD',human:'HOLD',
 publish:'HOLD',merge:'HOLD',ready:'HOLD',officialSlope2Meters:0,frames:[],
 note:'18.5s is an off-road camera and not ordinary play; these are exact game WebGL canvas PNGs'};
let browser;
await new Promise((yes,no)=>server.once('error',no).listen(0,'127.0.0.1',yes));
const home='http://127.0.0.1:'+server.address().port+'/drive3d/';
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle',
  '--use-angle=swiftshader','--enable-webgl','--disable-dev-shm-usage']});
 for(const road of ['true-pinch','pinch-switch']){
  for(const {id,seconds} of BG_SHOTS){
   const page=await browser.newPage({viewport:{width:1360,height:860},deviceScaleFactor:1});
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   let gameSourceOverridden=0,nativeJsonOverridden=0;
   await page.route('**/drive3d.mjs',async route=>{
    gameSourceOverridden++;
    await route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',
     body:browserOnlyCode});
   });
   await page.route('**/P101_A13_W9C2_G4E7BG_240HZ_FRAMES_LOCAL.json',async route=>{
    nativeJsonOverridden++;
    await route.fulfill({status:200,contentType:'application/json; charset=utf-8',
     body:JSON.stringify(native)});
   });
   const params=new URLSearchParams({g4e7al:'manual',g4e7be:'roll-deck',
    g4e7bg:'inspect',g4e7bgFrame:'hold',g4e7bgRoad:road,
    g4e7bgPoint:id,g4e7ci:'streetscape'});
   await page.goto(home+'?'+params.toString(),{waitUntil:'domcontentloaded'});
   await page.waitForFunction(expected=>{
    const c=document.getElementById('view');
    return c?.dataset.g4e7bgMode==='SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN'&&
     c.dataset.g4e7bgPoint===expected;
   },id,{timeout:75000});
   await page.waitForTimeout(350);
   const data=await page.evaluate(()=>{
    const c=document.getElementById('view');
    return {road:c.dataset.g4e7bgNativeRoad,point:c.dataset.g4e7bgPoint,
     physicsUntouched:c.dataset.g4e7ciPhysicsUntouched,
     scene:c.dataset.g4e7ciScene,dgScene:c.dataset.g4e7dgScene,
     eye:c.dataset.g4e7cjEye,front:c.dataset.g4e7cjForward,
     speed:c.dataset.g4e7bgSpeed,time:c.dataset.g4e7bgTime,
     tris:c.dataset.g4e7ciTriangles,width:c.width,height:c.height};
   });
   const original=native.stages[road].frames.find(f=>f.id===id);
   assert.equal(data.point,id);
   assert.equal(data.scene,'INTEGRATED_PRIVATE_HOLD');
   assert.equal(data.dgScene,'off');
   assert.equal(data.physicsUntouched,'true');
   assert.equal(Number(data.time),original.timeSeconds);
   assert.equal(Number(data.speed),original.speedMps);
   assert.ok(Number(data.tris)>1000);
   assert.equal(gameSourceOverridden,1);
   assert.equal(nativeJsonOverridden,1);
   assert.equal(errors.length,0,errors.join('\n'));
   const file=road+'-'+id+'-CX.png';
   const bytes=await page.locator('#view').screenshot({path:path.join(root,file)});
   result.frames.push({road,id,seconds,actualTime:original.timeSeconds,
    originalSpeed:original.speedMps,originalEye:original.eye,
    originalFront:original.front,viewport:{w:data.width,h:data.height},
    file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
    webglScene:data.scene,cityTriangles:Number(data.tris),
    nativeCameraIdentity:true});
   console.log('G4E7DJ_AUTHENTIC_WEBGL_FRAME',road,id,seconds,data.tris);
   await page.close();
  }
 }
 assert.equal(result.frames.length,20);
 fs.writeFileSync(path.join(root,'G4E7DJ_TRUE_WEBGL_STORYBOARD_HOLD.json'),
  JSON.stringify(result,null,2)+'\n');
 console.log('G4E7DJ_20_TRUE_NATIVE_WEBGL_ART_HOLD',JSON.stringify({
  count:result.frames.length,coreNativeFramesMatched:result.coreNativeFramesMatched,
  art:result.art,publish:result.publish}));
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
