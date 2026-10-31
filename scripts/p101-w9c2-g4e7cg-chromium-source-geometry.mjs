import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {chromium} from '@playwright/test';
import {nativeAssetPreflight} from './p101-w9c2-g4e7cb-native-asset-preflight.mjs';
import {g4e7bgNativeFrames} from './p101-w9c2-g4e7bg-native-visual-frames.mjs';
const input=process.argv[2],out=process.argv[3]||'test-results/g4e7cg-geometry';
if(!input)throw Error('GLB input missing');
const bytes=fs.readFileSync(input),sha=crypto.createHash('sha256').update(bytes).digest('hex');
if(sha!=='6137dfaf678785a2f4e4226d0cddc3032086f68a99e2c2793491058d64291c57')throw Error('INVALID_ORIGINAL_SOURCE_SHA');
const native=g4e7bgNativeFrames(),proposals=[
 {name:'left200',anchorDepth:200,xField:-.65,yField:.1},
 {name:'left320',anchorDepth:320,xField:-.55,yField:.15}
];
const samples=[];
for(const p of proposals){
 const pre=nativeAssetPreflight(bytes,native,p);
 for(const road of ['true-pinch','pinch-switch'])
  for(const f of native.stages[road].frames)
   samples.push({name:p.name+'-'+road+'-'+f.id,eye:f.eye,front:f.front,offset:pre.proposalOnly.translation,timeSeconds:f.timeSeconds,speedMps:f.speedMps});
}
const root=path.resolve('.'),html=fs.readFileSync('scripts/p101-w9c2-g4e7cg-source-geometry.html');
const server=http.createServer((req,res)=>{
 const p=new URL(req.url,'http://localhost').pathname;
 if(p==='/view'){res.writeHead(200,{'Content-Type':'text/html'});res.end(html);return;}
 if(p==='/original.glb'){res.writeHead(200,{'Content-Type':'model/gltf-binary'});res.end(bytes);return;}
 if(p.startsWith('/three/')){
  const fp=path.resolve(root,'node_modules',p.substring(1));
  if(!fp.startsWith(path.resolve(root,'node_modules/three')+path.sep)||!fs.existsSync(fp)){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':'text/javascript'});res.end(fs.readFileSync(fp));return;
 }
 res.writeHead(404).end();
});
await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
fs.mkdirSync(out,{recursive:true});
const report={schema:'dopagaki.g4e7cg-independent-original-mesh-chromium-webgl/1',sourceSha256:sha,
 srcOriginalCommitted:false,originalTexturesRendered:false,
 camera:'G4E7BG_REAL_240HZ_SCRIPTED_POSE_NOT_HUMAN',
 actualGameWebgl:'NOT_TESTED',renderedRoad:false,
 isolatedWebgl:'NOT_RUN',art:'NOT_TESTED',rights:'THIRD_PARTY_TEXTURE_EXCEPTION_HOLD',
 human:'HOLD',publish:'FORBIDDEN',ready:'HOLD',merge:'HOLD',slope2Meters:0,
 gamePhysics:'UNCHANGED_B48_7_B51C_28_GAP52',samples:[]};
let browser;
try{
 browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:928,height:540},deviceScaleFactor:1});
 page.on('pageerror',x=>console.error('PAGE_ERROR',String(x)));
 await page.goto('http://127.0.0.1:'+server.address().port+'/view',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__ready||window.__loadError,null,{timeout:50000});
 const error=await page.evaluate(()=>window.__loadError||null);if(error)throw Error('GLTF_LOADER_ERROR '+error);
 report.meshes=await page.evaluate(()=>window.__loadedMeshes);
 for(const x of samples){
  const stats=await page.evaluate(s=>window.__sample(s),x);
  report.samples.push({...stats,timeSeconds:x.timeSeconds,speedMps:x.speedMps});
  await page.screenshot({path:path.join(out,x.name+'.png')});
 }
 report.isolatedWebgl='CHROMIUM_REAL_PIXEL_RENDERED_GEOMETRY_ONLY';
 report.sampleCount=report.samples.length;
 report.nonBlank=report.samples.some(x=>x.changedPixels>100);
 if(report.sampleCount!==12||!report.nonBlank)throw Error('NO_MEANINGFUL_WEBGL_PIXELS');
 fs.writeFileSync(path.join(out,'G4E7CG_GEOMETRY_PIXELS_NOT_GAME_ART.json'),JSON.stringify(report,null,2)+'\n');
 console.log('G4E7CG_ACTUAL_CHROMIUM_GEOMETRY_ONLY',JSON.stringify({meshes:report.meshes,samples:report.samples,rights:report.rights,art:report.art}));
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}