/** DZ R1: projected EMPTY city-aperture siting on unchanged genuine DJ WebGL screenshots.
 * DO NOT interpret overlays as rendered buildings, physical clearance, or approved game art.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const W=1008,H=645, F=H*24.3/36; // frozen DO native camera lens, vertical sensor
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const mul=(a,k)=>a.map(v=>v*k);
const dot=(a,b)=>a.reduce((t,v,i)=>t+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const n=Math.hypot(...a);if(n<1e-8)throw Error('Degenerate direction');return a.map(v=>v/n)};
export const PROFILES=Object.freeze([
 {id:'LEFT_MIDPASS',anchor:'t1650',side:-1,offset:90,width:110,base:8,height:92,frames:['t1500','t1550','t1600','t1650']},
 {id:'RIGHT_NEXT',anchor:'t1700',side:1,offset:115,width:120,base:18,height:115,frames:['t1550','t1600','t1650','t1700']},
 {id:'LEFT_DOWNSTREAM',anchor:'t1750',side:-1,offset:105,width:135,base:11,height:105,frames:['t1600','t1650','t1700','t1750']}
]);
export function aperture(anchor,p){
 const forward=unit([anchor.pose.forward[0],0,anchor.pose.forward[2]]);
 const right=unit(cross(forward,[0,1,0]));
 const center=add(anchor.pose.position,mul(right,p.side*p.offset));
 return [[-1,0],[1,0],[1,1],[-1,1]].map(([s,t])=>
   add(add(center,mul(right,s*p.width/2)),[0,p.base+t*p.height,0]));
}
export function project(frame,point){
 const front=unit(frame.front),right=unit(cross(front,[0,1,0])),up=unit(cross(right,front));
 const diff=point.map((v,i)=>v-frame.eye[i]),depth=dot(diff,front);
 return depth>1.4?{x:W/2+F*dot(diff,right)/depth,y:H/2-F*dot(diff,up)/depth,depth}:null;
}
export function projection(frame,corners){
 const pts=corners.map(p=>project(frame,p));
 if(pts.some(p=>!p))return {visible:false,reason:'BEHIND_NATIVE_CAMERA',points:pts};
 const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
 const bounds={left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
 const width=Math.max(0,Math.min(W,bounds.right)-Math.max(0,bounds.left));
 const height=Math.max(0,Math.min(H,bounds.bottom)-Math.max(0,bounds.top));
 return {visible:width>0&&height>0,reason:width&&height?'ON_SCREEN_NOT_OCCLUSION_TESTED':'OUTSIDE_NATIVE_FRAME',
  points:pts,bounds,visibleWidthPx:width,visibleHeightPx:height};
}
export function verifyBaseline(m,read){
 if(m.id!=='G4E7DJ_PRIVATE_NATIVE_STORYBOARD'||m.frames?.length!==20||
 m.coreNativeFramesMatched!==true||m.original7B48!==true||m.original28B51!==true||
 m.gap52!==true||m.art!=='HOLD'||m.human!=='HOLD'||m.publish!=='HOLD'||
 m.officialSlope2Meters!==0)throw Error('Frozen DJ WebGL baseline rejected');
 const seen=new Set();
 for(const x of m.frames){
  if(!['true-pinch','pinch-switch'].includes(x.road)||seen.has(x.file)||
     x.nativeCameraIdentity!==true)throw Error('DJ original identity changed');
  seen.add(x.file);
  const hash=crypto.createHash('sha256').update(read(x.file)).digest('hex');
  if(hash!==x.sha256)throw Error('DJ screenshot SHA256 mismatch '+x.file);
 }
 return true;
}
const xml=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function svg(original,road,p,f,q){
 const outline=q.points.every(Boolean)?
  '<polygon points="'+q.points.map(v=>v.x.toFixed(2)+','+v.y.toFixed(2)).join(' ')+
  '" fill="none" stroke="#f3d379" stroke-width="4" stroke-dasharray="13 8"/>':'';
 const labels=['REAL ORIGINAL DJ WEBGL PIXELS + HYPOTHETICAL EMPTY VOID OUTLINE',
  road+' / '+p.id+' / '+f.id+' / '+f.timeSeconds+' s',
  'SCHEMATIC LOCATION GUIDE. NO NEW GAME CONTENT. ART / HUMAN HOLD.',
  q.reason];
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+
  '<image href="data:image/png;base64,'+original.toString('base64')+'" width="'+W+'" height="'+H+'"/>'+
  outline+'<rect width="'+W+'" height="108" fill="#071421" opacity=".85"/>'+
  labels.map((v,i)=>'<text x="16" y="'+(25+i*25)+'" font-family="sans-serif" font-size="17" fill="white">'+xml(v)+'</text>').join('')+
  '</svg>';
}
export async function run(input,output){
 const {g4e7djNativeStoryboard}=await import('./p101-w9c2-g4e7dj-native-storyboard.mjs');
 const {g4e7dzR1CameraWindows}=await import('./p101-w9c2-g4e7dz-r1-camera-windows.mjs');
 const native=g4e7djNativeStoryboard(),windows=g4e7dzR1CameraWindows(native);
 if(native.physicsHz!==240||native.certifiedSlope2Meters!==0||
 native.camera!=='UNCHANGED_ORIGINAL_BALL_RELATIVE_NATIVE')throw Error('240Hz original drift');
 const base=JSON.parse(fs.readFileSync(path.join(input,'G4E7DJ_TRUE_WEBGL_STORYBOARD_HOLD.json'),'utf8'));
 verifyBaseline(base,file=>fs.readFileSync(path.join(input,file)));
 fs.mkdirSync(output,{recursive:true});
 const audit={schema:'dopagaki.g4e7dz-r1-native-webgl-aperture-placement/1',
  originalWebGL:'DJ_20_GENUINE_IMAGES_SHA256_VERIFIED',originalGameModified:false,
  nativePhysicsHz:240,physicalRoads:7,originalMovingObstacles:28,originalGap52:true,
  newMeshes:0,newColliders:0,art:'HOLD',human:'HOLD',gameplay:'NOT_RUN',
  performance:'NOT_RUN',release:'HOLD',officialSlope2Meters:0,records:[]};
 const html=['<!doctype html><meta charset="utf-8"><title>PRIVATE DZ R1</title>',
  '<style>body{background:#101a29;color:#f5f5f5;font:16px system-ui;margin:24px}section{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}img{width:100%}</style>',
  '<h1>G4E-7DZ R1 / Real WebGL camera-first candidate placement</h1>',
  '<p>These are untouched genuine DJ WebGL frames with overlaid MATHEMATICAL VOID OUTLINES. This is NOT rendered candidate art, a Blender result, safety clearance or playable game implementation. Rejection or selection requires visual review.</p>'];
 for(const road of ['true-pinch','pinch-switch']){
  const stage=native.stages[road],byId=Object.fromEntries(stage.frames.map(f=>[f.id,f]));
  if(stage.actualB48!==7||stage.actualMovingB51!==28||stage.originalGapCell52!==true)
   throw Error('Protected road baseline drift');
  for(const p of PROFILES){
   if(!windows.result[road].windows.some(w=>w.id===p.frames.join('_')))
    throw Error('Missing original four-stage time window');
   const corners=aperture(byId[p.anchor],p);
   html.push('<h2>'+road+' / '+p.id+'</h2><section>');
   for(const id of p.frames){
    const f=byId[id],reference=base.frames.find(v=>v.road===road&&v.id===id);
    if(!reference||Math.abs(reference.actualTime-f.timeSeconds)>1e-6)
     throw Error('Incorrect original WebGL-to-240Hz pairing');
    const q=projection(f,corners),out=road+'-'+p.id+'-'+id+'-GUIDE.svg';
    fs.writeFileSync(path.join(output,out),svg(fs.readFileSync(path.join(input,reference.file)),road,p,f,q));
    audit.records.push({road,profile:p.id,frame:id,authenticWebGLFile:reference.file,
     authenticWebGLSHA256:reference.sha256,guide:out,...q});
    html.push('<img alt="original WebGL overlaid conceptual void" src="'+out+'">');
   }
   html.push('</section>');
  }
 }
 if(audit.records.length!==24)throw Error('24 native-camera guides required');
 html.push('</html>');
 fs.writeFileSync(path.join(output,'REVIEW_FOUR_STAGE_NATIVE_WEBGL.html'),html.join('\n'));
 fs.writeFileSync(path.join(output,'DZ_R1_NATIVE_PLACEMENT_AUDIT.json'),JSON.stringify(audit,null,2)+'\n');
 console.log('DZ_R1_PRIVATE_SITE_PROJECTIONS',JSON.stringify({
   images:audit.records.length,
   visible:audit.records.filter(r=>r.visible).length,
   byCandidate:PROFILES.map(p=>({id:p.id,onScreen:audit.records.filter(r=>r.profile===p.id&&r.visible).length})),
   genuineBaselineShaVerified:true,art:'HOLD',officialSlope2Meters:0}));
 return audit;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)
 run(process.argv[2],process.argv[3]).catch(e=>{console.error(e);process.exitCode=1});
