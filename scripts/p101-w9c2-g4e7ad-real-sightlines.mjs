/** G4E-7AD real 240Hz R2 camera visibility: actual B48 triangles AND
 * optional GPU-only monumental canyon triangles. No inferred human fairness.
 * Physical road occlusion and city occlusion are measured INDEPENDENTLY.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7ACR2} from './p101-w9c2-g4e7ac-r2-physical.mjs';
import {g4e7adNativeFrames,AD_VARIANTS} from './p101-w9c2-g4e7ad-native-frames.mjs';
import {g4e7adCity} from '../web/p101-w9c2-g4e7ad-city.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {viewForPose} from '../web/drive3d-camera.mjs';
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((t,x,i)=>t+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const mag=x=>Math.hypot(...x);
const norm=x=>x.map(v=>v/(mag(x)||1));
const round=(x,n=3)=>Number(x.toFixed(n));
function hit(eye,dir,a,b,c){
 const ab=sub(b,a),ac=sub(c,a),p=cross(dir,ac),d=dot(ab,p);
 if(Math.abs(d)<1e-9)return null;
 const inv=1/d,t=sub(eye,a),u=dot(t,p)*inv;
 if(u<-.00001||u>1.00001)return null;
 const q=cross(t,ab),v=dot(dir,q)*inv;
 if(v<-.00001||u+v>1.00001)return null;
 const n=dot(ac,q)*inv;
 return n>.005?n:null;
}
function occlusion(eye,target,triangles){
 const v=sub(target,eye),limit=mag(v),dir=norm(v);
 let closest=Infinity,index=null;
 for(let i=0;i<triangles.length;i++){
  const [a,b,c]=triangles[i],d=hit(eye,dir,a,b,c);
  if(d!==null&&d<limit-.80&&d<closest){closest=d;index=i;}
 }
 return {blocked:index!==null,firstTriangle:index,
  blockerDistanceMeters:index!==null?round(closest,2):null};
}
function roadTriangles(mesh){
 const {positions,indices}=mesh,out=[];
 for(let i=0;i<indices.length;i+=3)
  out.push(indices.slice(i,i+3).map(j=>positions.slice(j*3,j*3+3)));
 return out;
}
function cityTriangles(vertices){
 const t=[];
 for(let k=0;k<vertices.length;k+=18)
  t.push([vertices.slice(k,k+3),vertices.slice(k+6,k+9),vertices.slice(k+12,k+15)]);
 return t;
}
export function g4e7adRealSightlines(){
 const proof=g4e7adNativeFrames(),pairs=[];
 for(const id of AD_VARIANTS){
  const doc=generateG4E7ACR2(id),road=doc.surfaces[0],
   gap=doc.stageForge.g4e7acR2Study.gap,
   p=roadTriangles(tessellate(road)),
   city=g4e7adCity(doc,sample,{enabled:true}),
   c=cityTriangles(city.vertices);
  if(road.voidLongitudinalCells?.join(',')!=='52'||
   doc.movingObstacles.length!==28||doc.surfaces.length!==7||
   !city.nonCollision||!city.actualB48Unchanged||city.spires!==12||
   proof.stages[id].stageId!==doc.stageForge.recordStageId)
   throw Error('G4E-7AD physical / visual authentic geometry mismatch');
  const frames=[];
  for(const shot of proof.stages[id].frames){
   const view=viewForPose(shot.pose,{yaw:shot.yaw}),targets={};
   for(const [name,u,v] of [
    ['takeoffCenter',gap.uTakeoff,.5],
    ['landingCenter',gap.uLanding,.5],
    ['takeoffLeft',gap.uTakeoff,.15],
    ['takeoffRight',gap.uTakeoff,.85],
    ['landingLeft',gap.uLanding,.15],
    ['landingRight',gap.uLanding,.85]
   ]){
    const pt=sample(road,u,v),vec=sub(pt,view.eye),z=dot(vec,view.front),
     px=z>0?1.35*dot(vec,view.right)/(z*16/9):null,
     py=z>0?1.35*dot(vec,view.up)/z:null;
    targets[name]={distanceMeters:round(mag(vec),2),
     forwardMeters:round(z,2),
     ndcX:px===null?null:round(px),ndcY:py===null?null:round(py),
     insideApproxFrame:z>0&&Math.abs(px)<.98&&Math.abs(py)<.95,
     physicalRoad:occlusion(view.eye,pt,p),
     gpuCity:occlusion(view.eye,pt,c)};
   }
   frames.push({frame:shot.id,timeSeconds:shot.timeSeconds,speedMps:shot.speedMps,
    distanceToLip:targets.takeoffCenter.distanceMeters,
    physicalOcclusionCount:Object.values(targets).filter(t=>t.physicalRoad.blocked).length,
    gpuCityOcclusionCount:Object.values(targets).filter(t=>t.gpuCity.blocked).length,
    outsideApproxFrameCount:Object.values(targets).filter(t=>!t.insideApproxFrame).length,
    targets});
  }
  pairs.push({variant:id,realRoads:7,originalHazards:28,
   cityTriangles:city.triangles,cityMinOutboardMeters:city.minClearanceMeters,
   frames,visualHumanApproval:'HOLD'});
 }
 return {schema:'dopagaki.g4e7ad-true-R2-B48-240Hz-ray-and-city/1',
  physicsHz:240,method:'EXACT_TRIANGLE_RAY_FROM_ACTUAL_NATIVE_CAMERA_NOT_SCREEN_PIXELS',
  scene:'CITY_COMPARE_TO_BASELINE_CLEAR_PHYSICAL_ROAD',
  fieldOfView:'APPROX_16_BY_9_FRAME_NEEDS_WEBGL_SCREENSHOT',
  pairs,originalStageUnchanged:true,certifiedSlope2Meters:0,
  visibilityApproval:'HOLD',humanFairness:'HOLD',publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const x=g4e7adRealSightlines();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(x,null,2)+'\n');
 console.log('G4E7AD_RAY '+JSON.stringify(x.pairs.map(p=>({variant:p.variant,
  frames:p.frames.map(f=>({id:f.frame,meters:f.distanceToLip,
   speed:f.speedMps,physicalBlocked:f.physicalOcclusionCount,
   cityBlocked:f.gpuCityOcclusionCount,outOfFrame:f.outsideApproxFrameCount}))}))));
}
