/** G4E-7AI: actual B48 triangle occlusion at the ORIGINAL native 240Hz
 * trajectory for physical 14.8m versus true 11m B48 narrower courses.
 * Does NOT infer pixel readability or human success from geometry alone.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7AH} from './p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {g4e7aiNativeFrames,AI_VARIANTS} from './p101-w9c2-g4e7ai-native-frames.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {viewForPose} from '../web/drive3d-camera.mjs';
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const length=v=>Math.hypot(...v);
const fix=(n,k=2)=>Number(n.toFixed(k));
function rayHit(eye,dir,a,b,c){
 const ab=sub(b,a),ac=sub(c,a),p=cross(dir,ac),d=dot(ab,p);
 if(Math.abs(d)<1e-9)return null;
 const inv=1/d,t=sub(eye,a),u=dot(t,p)*inv;
 if(u<-.00001||u>1.00001)return null;
 const q=cross(t,ab),v=dot(dir,q)*inv;
 if(v<-.00001||u+v>1.00001)return null;
 const h=dot(ac,q)*inv;
 return h>.005?h:null;
}
function occludes(eye,target,triangles){
 const vec=sub(target,eye),distance=length(vec),dir=vec.map(x=>x/distance);
 let blocker=Infinity,triangle=null;
 for(let i=0;i<triangles.length;i++){
  const h=rayHit(eye,dir,...triangles[i]);
  if(h!==null&&h<distance-.80&&h<blocker){blocker=h;triangle=i;}
 }
 return {blocked:triangle!==null,triangle,
  blockerMeters:Number.isFinite(blocker)?fix(blocker):null};
}
function trianglesOf(surf){
 const m=tessellate(surf),list=[];
 for(let i=0;i<m.indices.length;i+=3)
  list.push(m.indices.slice(i,i+3).map(j=>m.positions.slice(j*3,j*3+3)));
 return list;
}
function nearestU(road,pt){
 let best=Infinity,u=0;
 for(let i=0;i<=192;i++){
  const v=i/192,pos=sample(road,v,.5),dist=length(sub(pos,pt));
  if(dist<best){best=dist;u=v;}
 }
 return {u:fix(u,5),centerDistanceMeters:fix(best)};
}
export function g4e7aiRealB48Sightlines(){
 const proof=g4e7aiNativeFrames(),out=[];
 for(const id of AI_VARIANTS){
  const doc=generateG4E7AH(id),road=doc.surfaces[0],m=doc.stageForge.g4e7ahStudy,
   frames=proof.stages[id],triangles=trianglesOf(road),results=[];
  if(frames.stageId!==doc.stageForge.recordStageId||
     road.voidLongitudinalCells?.join(',')!=='52'||
     doc.surfaces.length!==7||doc.movingObstacles.length!==28||
     !m.originalLipLandingExact||m.certifiedSlope2Meters!==0)
    throw Error('G4E-7AI ray source must preserve actual 7AH B48 and 28 hazards');
  for(const shot of frames.frames){
   const view=viewForPose(shot.pose,{yaw:shot.yaw}),station=nearestU(road,shot.pose.position),
    probes={},targets=[
     ['lipCenter',m.gap.uTakeoff,.5],['lipLeft',m.gap.uTakeoff,0],['lipRight',m.gap.uTakeoff,1],
     ['landingCenter',m.gap.uLanding,.5],['landingLeft',m.gap.uLanding,0],['landingRight',m.gap.uLanding,1],
     ['entryNarrowLeft',.325,0],['entryNarrowRight',.325,1],
     ['exitNarrowLeft',.80,0],['exitNarrowRight',.80,1]
    ];
   for(const [name,u,v] of targets){
    const p=sample(road,u,v),vec=sub(p,view.eye),forward=dot(vec,view.front),
     x=forward>0?1.35*dot(vec,view.right)/((16/9)*forward):null,
     y=forward>0?1.35*dot(vec,view.up)/forward:null;
    probes[name]={distanceMeters:fix(length(vec)),forwardMeters:fix(forward),
     ndcX:x===null?null:fix(x,4),ndcY:y===null?null:fix(y,4),
     inApproxFrame:forward>0&&Math.abs(x)<.98&&Math.abs(y)<.95,
     roadB48:occludes(view.eye,p,triangles)};
   }
   results.push({id:shot.id,seconds:shot.timeSeconds,speedMps:shot.speedMps,
    nearestRoad:station,physicalWidthMeters:fix(length(sub(
     sample(road,station.u,0),sample(road,station.u,1))),3),
    lipEyeMeters:probes.lipCenter.distanceMeters,
    lipAndLandingBlocked:Object.values(probes).slice(0,6).filter(v=>v.roadB48.blocked).length,
    narrowBandEdgeBlocked:Object.values(probes).slice(6).filter(v=>v.roadB48.blocked).length,
    lipAndLandingOutOfFrame:Object.values(probes).slice(0,6).filter(v=>!v.inApproxFrame).length,
    probes});
  }
  out.push({id,originalRealRoads:7,originalRealMovingHazards:28,
   trueMissingCell52:true,originalLipLandingUnchanged:true,
   minNarrowRoadMeters:m.widthMinMeters,
   proofStageId:frames.stageId,shots:results,visualFairness:'HOLD',humanFairness:'HOLD'});
 }
 return {schema:'dopagaki.g4e7ai-real-native-240Hz-B48-narrow-geometry-ray/1',
  actual240Hz:240,roadChoices:out,
  nonhumanP96:true,visualGeometryOnly:true,
  officialSlope2Meters:0,artQuality:'HOLD',humanPlayability:'HOLD',publish:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const r=g4e7aiRealB48Sightlines();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(r,null,2)+'\n');
 console.log('G4E7AI_ACTUAL_NARROW_RAYS '+JSON.stringify(r.roadChoices.map(x=>({
   id:x.id,width:x.minNarrowRoadMeters,
   frames:x.shots.map(f=>({t:f.id,lipDist:f.lipEyeMeters,
    speed:f.speedMps,edgeRoadBlock:f.lipAndLandingBlocked,
    edgeOffscreen:f.lipAndLandingOutOfFrame,sideBlocked:f.narrowBandEdgeBlocked}))}))));
}
