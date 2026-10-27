/**
 * G4E-7DK. Paired genuine #view WebGL at 14.5–17s, two actual BC roads.
 * PRIVATE page.route only, original drive3d and CX city remain unchanged.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {server} from './serve.mjs';
import {g4e7djNativeStoryboard,BG_SHOTS} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';
const out=path.resolve('test-results/g4e7dn-negative-space');
fs.mkdirSync(out,{recursive:true});
const native=g4e7djNativeStoryboard(),frozen=g4e7bgNativeFrames();
for(const road of ['true-pinch','pinch-switch'])
 assert.deepEqual(native.stages[road].frames.slice(0,3),frozen.stages[road].frames);
const ids=['t1500','t1550','t1600','t1650','t1700'];
const originalHashes={
 "true-pinch-t1450": "7b0e163957573aa7c3d029ac44e45a375f8d8457d0cb831e5ff2aaa0560bdd82",
 "true-pinch-t1500": "bce2777cdb665ed9b2624f2e508d2e441b4a13f76687fb70edff77ce51c183e1",
 "true-pinch-t1550": "3265ebb72612280898e9accf13225b3ecf3f9a8df96b147598d2caaec1afa65b",
 "true-pinch-t1600": "920d53b8a7b786df1f094acdcba0265159efce906c916a77808a97b2e2ea3948",
 "true-pinch-t1650": "3f920d582f231f253de74bc6e64a4717b7e90cae0d4201b8c52707dcc04bd1ea",
 "true-pinch-t1700": "9b21ef97a65ea8163e2fc29c6f4571f5584c3e4e05cf13793154433d56acfdc3",
 "pinch-switch-t1450": "e205e8d95f90b8248fd8d5f098e931bff0615a3e755e347162b8de6815d7ca99",
 "pinch-switch-t1500": "ab72d3ecf7f0da5d139cce0eaaffb66543e905662dabdb92b259f6e22c4a7fc7",
 "pinch-switch-t1550": "98a4e3ae1ae7ff06a56ce7b0d3f19180444f9917689096a81d2664b6e9c5f936",
 "pinch-switch-t1600": "097d9baf2a7683d977983d4473498404a5c4b70b1e37e6b532e7c3bd101ee5c0",
 "pinch-switch-t1650": "f8d19c31f51443306d97e26892349f632b97b5635fa27dd42536db7ee6e383ed",
 "pinch-switch-t1700": "7cbe537b4d2d0869397045287889d2a2494d193b95d0c10c0ba630bb969a5c73"
};
const originalGame=fs.readFileSync('web/drive3d.mjs','utf8');
const token="['t1500','t1700','t1850'].includes";
if(originalGame.split(token).length!==2)throw Error('DM game camera allowlist unexpectedly modified');
const game=originalGame.replace(token,
 '['+BG_SHOTS.map(s=>JSON.stringify(s.id)).join(',')+'].includes');
const source=fs.readFileSync('web/p101-w9c2-g4e7dn-negative-space.mjs','utf8');
function sourceFor(mode){
 const token="const DEFAULT_DN_MODE = 'UNROOF';";
 assert.equal(source.split(token).length,2);
 return source.replace(token,"const DEFAULT_DN_MODE = '"+mode+"';");
}
const report={id:'G4E7DN_PRIVATE_REAL_240HZ_URBAN_COMPOSITION',roadCount:2,
 nativePhysics:'ORIGINAL_B48x7_B51x28_GAP52',camera:'UNMODIFIED_BG240HZ',
 source:'TRUE_ORIGINAL_GAME_WEBGL2_CANVAS_NOT_CPU_PROJECTION',
 originalCX:'UNCHANGED_ORIGINAL_GAME_GENERATOR',originalDJHashes:originalHashes,
 art:'HOLD',human:'HOLD',ready:'HOLD',publish:'HOLD',merge:'HOLD',
 officialSlope2Meters:0,frames:[],pairs:[]};
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
async function pixelDiff(page,a,b){
 const data={a:a.toString('base64'),b:b.toString('base64')};
 return page.evaluate(async ({a,b})=>{
  const load=src=>new Promise((yes,no)=>{const i=new Image();
   i.onload=()=>yes(i);i.onerror=()=>no(Error('WebGL screenshot decoder failed'));
   i.src='data:image/png;base64,'+src;});
  const [x,y]=await Promise.all([load(a),load(b)]);
  if(x.width!==y.width||x.height!==y.height)throw Error('Image shape mismatch');
  const c=document.createElement('canvas');c.width=x.width;c.height=x.height;
  const ctx=c.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(x,0,0);const A=ctx.getImageData(0,0,c.width,c.height).data;
  ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(y,0,0);
  const B=ctx.getImageData(0,0,c.width,c.height).data;
  let n=0,roadN=0,skyN=0,minX=c.width,maxX=-1,minY=c.height,maxY=-1;
  for(let py=0;py<c.height;py++)for(let px=0;px<c.width;px++){
   const k=(py*c.width+px)*4;
   if(Math.abs(A[k]-B[k])+Math.abs(A[k+1]-B[k+1])+Math.abs(A[k+2]-B[k+2])<=48)continue;
   n++;if(px>c.width*.38&&px<c.width*.66&&py>c.height*.44&&py<c.height*.89)roadN++;
   if(py<c.height*.46)skyN++;
   minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);
  }
  return {changedPixels:n,changedFraction:Number((n/(c.width*c.height)).toFixed(6)),
   centerRoadChangedPixels:roadN,upperViewChangedPixels:skyN,
   boundingBox:n?[minX,minY,maxX,maxY]:null};
 },data);
}
let browser;const baselineMismatch=[];
await new Promise((yes,no)=>server.once('error',no).listen(0,'127.0.0.1',yes));
const url='http://127.0.0.1:'+server.address().port+'/drive3d/';
try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-dev-shm-usage']});
 for(const road of ['true-pinch','pinch-switch'])for(const id of ids){
  let original=null,control=null;
  for(const mode of ['CX','UNROOF','REVEAL']){
   const page=await browser.newPage({viewport:{width:1360,height:860},deviceScaleFactor:1});
   let routeGame=0,routeJson=0,routeCity=0;const errors=[];
   page.on('pageerror',e=>errors.push(String(e)));
   await page.route('**/drive3d.mjs',async route=>{
    routeGame++;await route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:game});
   });
   await page.route('**/P101_A13_W9C2_G4E7BG_240HZ_FRAMES_LOCAL.json',async route=>{
    routeJson++;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(native)});
   });
   if(mode!=='CX')await page.route('**/p101-w9c2-g4e7dg-canyon-city.mjs',async route=>{
    routeCity++;await route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:sourceFor(mode)});
   });
   const params=new URLSearchParams({g4e7al:'manual',g4e7be:'roll-deck',
    g4e7bg:'inspect',g4e7bgFrame:'hold',g4e7bgRoad:road,g4e7bgPoint:id,g4e7ci:'streetscape'});
   if(mode!=='CX')params.set('g4e7dg','canyon-city');
   await page.goto(url+'?'+params,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(id=>{
    const c=document.getElementById('view');
    return c?.dataset.g4e7bgMode==='SCRIPTED_NATIVE_240HZ_STILL_NOT_HUMAN'&&
     c.dataset.g4e7bgPoint===id;
   },id,{timeout:75000});
   await page.waitForTimeout(350);
   const info=await page.evaluate(()=>{
    const c=document.getElementById('view');
    return {id:c.dataset.g4e7bgPoint,scene:c.dataset.g4e7ciScene,
     dgScene:c.dataset.g4e7dgScene,eye:c.dataset.g4e7cjEye,
     forward:c.dataset.g4e7cjForward,time:c.dataset.g4e7bgTime,
     speed:c.dataset.g4e7bgSpeed,physics:c.dataset.g4e7ciPhysicsUntouched,
     road:c.dataset.g4e7bgNativeRoad,triangles:c.dataset.g4e7ciTriangles};
   });
   assert.equal(errors.length,0,errors.join('\n'));
   assert.equal(routeGame,1);assert.equal(routeJson,1);
   assert.equal(routeCity,mode==='CX'?0:1);
   assert.equal(info.scene,'INTEGRATED_PRIVATE_HOLD');assert.equal(info.physics,'true');
   assert.equal(info.dgScene,mode==='CX'?'off':'DN_TEMPORAL_NEGATIVE_SPACE_'+mode);
   const nativeFrame=native.stages[road].frames.find(f=>f.id===id);
   assert.equal(Number(info.time),nativeFrame.timeSeconds);
   assert.equal(Number(info.speed),nativeFrame.speedMps);
   assert.ok(Number(info.triangles)>1000);
   const png=await page.locator('#view').screenshot({path:path.join(out,road+'-'+id+'-'+mode+'.png')});
   const hash=digest(png);
   if(mode==='CX'){
    if(hash!==originalHashes[road+'-'+id]){
      const item={road,id,expected:originalHashes[road+'-'+id],actual:hash};
      baselineMismatch.push(item);
      console.error('DN_STRICT_CX_SHA_MISMATCH',JSON.stringify(item));
     }
    original=png;control=info;
   }else{
    for(const key of ['id','scene','eye','forward','time','speed','physics','road'])
     assert.equal(info[key],control[key],'DM real native camera mismatch '+key);
    const delta=await pixelDiff(page,original,png);
    report.pairs.push({road,id,mode,...delta,art:'NOT_GRADED_BY_PIXEL_DIFF'});
   }
   report.frames.push({road,id,mode,...info,file:road+'-'+id+'-'+mode+'.png',
    sha256:hash,privateSourceOverride:mode!=='CX'});
   console.log('G4E7DN_TRUE_WEBGL',road,id,mode,hash);
   await page.close();
  }
 }
 assert.equal(report.frames.length,30);assert.equal(report.pairs.length,20);
 if(!report.pairs.some(p=>p.changedFraction>.0001))
  throw Error('DM candidate invisible in all 12 authentic original game frame comparisons');
 report.baselineMismatch=baselineMismatch;
 report.strictCXDJHashSuccess=baselineMismatch.length===0;
 report.experimentalVariantsAreNotApproved=true;
 fs.writeFileSync(path.join(out,'G4E7DN_REAL_GAME_20_PAIRS_ART_HOLD.json'),
  JSON.stringify(report,null,2)+'\n');
 if(baselineMismatch.length)throw Error('DN strict CX SHA failed for '+baselineMismatch.length+' images; evidence captured but entire CI FAIL');
 console.log('G4E7DN_WEBGL_20_PAIRS_FINISHED_ART_HOLD',report.pairs.map(p=>[p.road,p.id,p.changedFraction]));
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
