/**
 * G4E-7DQ read-only site of the existing, detailed Blender BW R3 architecture
 * in the original G4E-7DO camera and BC-road coordinate system.
 * Coordinates are NEVER sent to the game renderer or physics.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDoReference} from './p101-w9c2-g4e7do-master-export.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const unit=a=>{const n=Math.hypot(...a);if(n<1)throw Error('DQ no real BC tangent');return a.map(x=>x/n);};
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const times=(a,t)=>a.map(x=>x*t);
const PROOF_BOX={min:[-257,-321,-91],max:[265,217,302]}; // BW R3 source Blender Z-UP, NOT glTF Y-UP
export function g4e7dqNativePlacement(road,native=g4e7djNativeStoryboard()){
 const data=buildDoReference(road,native);
 const edge=data.lineGuides[1].tracks[0].points;
 const mid=data.lineGuides[1].tracks[1].points;
 const station=39,distance=240,scale=.38;
 const outward=unit(sub(edge[station],mid[station]).map((v,i)=>i===1?0:v));
 const along=unit(sub(edge[station+1],edge[station-1]).map((v,i)=>i===1?0:v));
 const origin=plus(plus(edge[station],times(outward,distance)),[0,35,0]);
 const transform=p=>plus(origin,plus(plus(times(outward,p[0]*scale),times(along,p[1]*scale)),[0,p[2]*scale,0]));
 const corners=[];
 for(const x of [PROOF_BOX.min[0],PROOF_BOX.max[0]])
  for(const y of [PROOF_BOX.min[1],PROOF_BOX.max[1]])
   for(const z of [PROOF_BOX.min[2],PROOF_BOX.max[2]])corners.push(transform([x,y,z]));
 const projections=data.cameras.map(cam=>{
  const points=[];
  for(const p of corners){
   const v=sub(p,cam.eye),depth=dot(v,cam.front);
   if(depth<=2)throw Error('DQ source asset crosses protected actual game camera');
   points.push([.5+.5*1.35*dot(v,cam.right)/(depth*(1008/645)),
    .5-.5*1.35*dot(v,cam.up)/depth]);
  }
  const min=[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1]))],
   max=[Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];
  const visibleArea=Math.max(0,Math.min(1,max[0])-Math.max(0,min[0]))*
    Math.max(0,Math.min(1,max[1])-Math.max(0,min[1]));
  return {id:cam.id,min,max,visibleArea,center:[(min[0]+max[0])/2,(min[1]+max[1])/2]};
 });
 if(projections.length!==5||projections.some(p=>p.visibleArea<.016||p.visibleArea>.45||
   p.center[0]<.20||p.center[0]>.92||p.center[1]<.07||p.center[1]>.81))
  throw Error('DQ source BW R3 would be unreadably framed by actual 240Hz view');
 return {schema:'dopagaki.g4e7dq-readonly-original-bw-r3-site/1',
  road,asset:'G4E7BW_HALOCUT_CONCOURSE_SOURCE.blend',
  assetSource:'EXISTING_R3_ALREADY_UNADOPTED_NOT_NEW_DESIGN',
  projection:'REAL_UNCHANGED_240HZ_CAMERA_NOT_IN_GAME',
  worldOrigin:origin,worldBasis:{sourceX:outward,sourceY:along,sourceZ:[0,1,0]},
  scale,proofSourceBlenderZUpAABB:PROOF_BOX,projections,
  newRoads:0,newColliders:0,newMovers:0,art:'HOLD',human:'HOLD',publish:'HOLD',
  officialSlope2Meters:0,cxVertexSha256:data.cxVertexSha256};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const native=g4e7djNativeStoryboard(),dir=path.resolve('test-results/g4e7dq-bw-reframe/sites');
 fs.mkdirSync(dir,{recursive:true});
 for(const road of ['true-pinch','pinch-switch']){
  const report=g4e7dqNativePlacement(road,native);
  fs.writeFileSync(path.join(dir,road+'.json'),JSON.stringify(report,null,2)+'\n');
  console.log('DQ_REAL_NATIVE_CAMERA_BW_SITE',road,report.projections);
 }
}
