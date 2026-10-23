/**
 * G4E-7Y geometry truth: ray-test the actual 31x5 B48 tessellated road
 * (including a real 1-cell void) from native 240Hz camera to takeoff/landing.
 * This DOES NOT infer visibility from a screenshot or generated image.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {generateG4E7WBlend} from './p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {g4e7wNativeCameraFrames} from './p101-w9c2-g4e7w-camera-frames.mjs';
import {viewForPose} from '../web/drive3d-camera.mjs';
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const norm=a=>{const k=Math.hypot(...a)||1;return a.map(x=>x/k);};
const r=(x,p=4)=>Number(x.toFixed(p));
function strike(eye,d,a,b,c){
 // Moller-Trumbore with no face culling. Return positive ray distance.
 const ab=sub(b,a),ac=sub(c,a),p=cross(d,ac),det=dot(ab,p);
 if(Math.abs(det)<1e-8)return null;
 const inv=1/det,t=sub(eye,a),u=dot(t,p)*inv;
 if(u<-1e-6||u>1+1e-6)return null;
 const q=cross(t,ab),v=dot(d,q)*inv;
 if(v<-1e-6||u+v>1+1e-6)return null;
 const dist=dot(ac,q)*inv;
 return dist>0?dist:null;
}
function physicalSightline(mesh,view,target){
 const sight=sub(target,view.eye),dist=Math.hypot(...sight),d=norm(sight);
 let closest=Infinity,hitType=null,hitTriangle=null;
 const {indices,positions,topIndexCount,bottomIndexCount}=mesh;
 for(let k=0;k<indices.length;k+=3){
  const pts=indices.slice(k,k+3).map(n=>positions.slice(n*3,n*3+3));
  const at=strike(view.eye,d,...pts);
  if(at!==null&&at<dist-.80&&at<closest){
   closest=at;hitTriangle=k/3;
   hitType=k<topIndexCount?'top':k<topIndexCount+bottomIndexCount?'underside':'side/endcap';
  }
 }
 const x=dot(sight,view.right),y=dot(sight,view.up),z=dot(sight,view.front);
 const ndcX=1.35*x/(16/9*z),ndcY=1.35*y/z;
 return {forwardMeters:r(z,2),straightMeters:r(dist,2),
   projected:[r(ndcX,3),r(ndcY,3)],
   insideApprox16By9Frame:z>0&&Math.abs(ndcX)<.98&&Math.abs(ndcY)<.95,
   physicallyUnblocked:!Number.isFinite(closest),
   firstBlockingTriangle:hitTriangle,
   blockerType:hitType,
   blockerDistanceMeters:Number.isFinite(closest)?r(closest,2):null,
   physicalRoadOnly:true};
}
export function g4e7yRealSightline(){
 const v=g4e7wNativeCameraFrames(),comparison=[];
 for(const [key,alpha] of [['A065',.65],['A070',.7]]){
  const doc=generateG4E7WBlend(alpha),road=doc.surfaces[0],
   mesh=tessellate(road),gap=doc.stageForge.g4e7wStudy.gap;
  if(road.voidLongitudinalCells.join(',')!=='52'||doc.movingObstacles.length!==28)throw Error('not true research B48');
  for(const frame of v.stages[key].frames){
   const view=viewForPose(frame.pose,{yaw:frame.yaw});
   const targets={};
   for(const [label,u,v] of [
    ['takeoffCenter',gap.uTakeoff,.5],
    ['landingCenter',gap.uLanding,.5],
    ['takeoffLeft',gap.uTakeoff,.15],
    ['takeoffRight',gap.uTakeoff,.85],
    ['landingLeft',gap.uLanding,.15],
    ['landingRight',gap.uLanding,.85]
   ])targets[label]=physicalSightline(mesh,view,sample(road,u,v));
   comparison.push({variant:key,alpha,point:frame.id,
    realCameraSpeedMps:frame.speedMps,realCameraSeconds:frame.timeSeconds,
    eye:frame.eye,physicsStatus:frame.grounded?'grounded':'airborne',
    targets,blockedLipOrLanding:Object.values(targets).filter(x=>!x.physicallyUnblocked).length,
    outOfForwardView:Object.values(targets).filter(x=>!x.insideApprox16By9Frame).length});
  }
 }
 return {schema:'dopagaki.g4e7y-actual-B48-camera-ray-occlusion/1',
  physicsHz:240,start00:true,full7RoadScriptedBothTrue:true,
  nativeMovingMachines:28,allPhysicalRoads:7,
  sceneDoesNotAffectTheseRays:true,comparison,
  humanVisibility:'HOLD',actualViewportScreenshotStillRequired:true,
  officialSlope2Meters:0};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const data=g4e7yRealSightline();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(data,null,2)+'\n');
 console.log('G4E7Y_RAY '+JSON.stringify(data.comparison.map(x=>({
  variant:x.variant,point:x.point,blocked:x.blockedLipOrLanding,
  outOfFrame:x.outOfForwardView,
  takeoff:x.targets.takeoffCenter,landing:x.targets.landingCenter}))));
}
