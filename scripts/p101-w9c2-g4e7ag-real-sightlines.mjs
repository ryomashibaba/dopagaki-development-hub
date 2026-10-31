/** AE real B48/city ray sightlines, from actual native 240Hz R2 camera.
 * Reports physical blocking separately from new noncollision scenery.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7ACR2} from './p101-w9c2-g4e7ac-r2-physical.mjs';
import {g4e7adNativeFrames} from './p101-w9c2-g4e7ad-native-frames.mjs';
import {g4e7agOpenCitadel} from '../web/p101-w9c2-g4e7ag-open-citadel.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {viewForPose} from '../web/drive3d-camera.mjs';
const diff=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((r,v,i)=>r+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const round=(x,n=3)=>Number(x.toFixed(n));
function hit(eye,dir,a,b,c){
 const ab=diff(b,a),ac=diff(c,a),p=cross(dir,ac),det=dot(ab,p);
 if(Math.abs(det)<1e-8)return null;
 const inv=1/det,t=diff(eye,a),u=dot(t,p)*inv;
 if(u<-.00001||u>1.00001)return null;
 const q=cross(t,ab),v=dot(dir,q)*inv;
 if(v<-.00001||u+v>1.00001)return null;
 const z=dot(ac,q)*inv;return z>.005?z:null;
}
function occluded(eye,target,triangles){
 const vector=diff(target,eye),distance=Math.hypot(...vector),dir=vector.map(x=>x/distance);
 let closest=Infinity,id=null;
 for(let k=0;k<triangles.length;k++){
  const h=hit(eye,dir,...triangles[k]);
  if(h!==null&&h<distance-.80&&h<closest){closest=h;id=k;}
 }
 return {blocked:id!==null,triangle:id,blockDistanceMeters:id===null?null:round(closest,2)};
}
function trianglesFromMesh(mesh){
 const out=[],p=mesh.positions,i=mesh.indices;
 for(let k=0;k<i.length;k+=3)
  out.push([0,1,2].map(n=>p.slice(i[k+n]*3,i[k+n]*3+3)));
 return out;
}
function trianglesFromRGB(v){
 const out=[];for(let i=0;i<v.length;i+=18)
  out.push([v.slice(i,i+3),v.slice(i+6,i+9),v.slice(i+12,i+15)]);
 return out;
}
export function g4e7agRayReport(){
 const doc=generateG4E7ACR2('approach-arc'),road=doc.surfaces[0],
  native=g4e7adNativeFrames().stages['approach-arc'],
  city=g4e7agOpenCitadel(doc,sample,{enabled:true}),
  actualB48=trianglesFromMesh(tessellate(road)),
  noncollision=trianglesFromRGB(city.vertices),
  gap=doc.stageForge.g4e7acR2Study.gap,report=[];
 if(road.voidLongitudinalCells.join(',')!=='52'||doc.movingObstacles.length!==28||
    doc.surfaces.length!==7||native.stageId!==doc.stageForge.recordStageId||
    city.physicalChanges||city.addedCollision!==0||city.openCenters!==5)throw Error('AE only authentic R2 visual research');
 for(const shot of native.frames){
  const view=viewForPose(shot.pose,{yaw:shot.yaw}),points={};
  for(const [label,u,v] of [
   ['lipCenter',gap.uTakeoff,.5],['landingCenter',gap.uLanding,.5],
   ['lipLeft',gap.uTakeoff,.15],['lipRight',gap.uTakeoff,.85],
   ['landingLeft',gap.uLanding,.15],['landingRight',gap.uLanding,.85]]){
    const p=sample(road,u,v),delta=diff(p,view.eye),z=dot(delta,view.front),
     x=z>0?1.35*dot(delta,view.right)/(16/9*z):null,
     y=z>0?1.35*dot(delta,view.up)/z:null;
    points[label]={distanceMeters:round(Math.hypot(...delta),2),
     forwardMeters:round(z,2),
     insideApproxFrame:z>0&&Math.abs(x)<.98&&Math.abs(y)<.95,
     physical:occluded(view.eye,p,actualB48),
     newCity:occluded(view.eye,p,noncollision)};
  }
  report.push({frame:shot.id,realTimeSeconds:shot.timeSeconds,
   realSpeedMps:shot.speedMps,points,
   realB48Blocked:Object.values(points).filter(x=>x.physical.blocked).length,
   newCityBlocked:Object.values(points).filter(x=>x.newCity.blocked).length,
   outsideApproxFrame:Object.values(points).filter(x=>!x.insideApproxFrame).length});
 }
 return {schema:'dopagaki.g4e7ag-native-real-B48-split-horizon-ray/1',
  realPhysicsHz:240,originalRoads:7,movingHazards:28,
  actualVoidCell52:true,newCityOnlyGPU:true,
  cityTriangles:city.triangles,cityOpenCenters:city.openCenters,report,
  noScreenshotInference:true,quality:'HOLD',
  humanApproval:'HOLD',certifiedSlope2Meters:0,publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const r=g4e7agRayReport();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(r,null,2)+'\n');
 console.log('G4E7AG_RAY '+JSON.stringify(r.report.map(f=>({
  frame:f.frame,dist:f.points.lipCenter.distanceMeters,
  speed:f.realSpeedMps,oldRoadBlocked:f.realB48Blocked,
  newCityBlocked:f.newCityBlocked,outside:f.outsideApproxFrame}))));
}
