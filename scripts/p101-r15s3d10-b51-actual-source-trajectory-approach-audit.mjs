/** R15S3D10: quantify EVERY ORIGINAL 28 moving B51 on true full-finish
 * trajectory from archived real original Runner, by original time and pose.
 * Original moving solids are not edited or relocated.
 * Projected screen angles are static-pose camera ESTIMATES, not actual rendered
 * or occlusion-tested WebGL pixels (real WebGL captured separately).
 */
import fs from 'node:fs';import assert from 'node:assert/strict';
import {buildR15S3D9} from './p101-r15s3d9-source-real-road5-road6-integrated-macro.mjs';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {createCameraState,viewForPose} from '../web/drive3d-camera.mjs';
const get=x=>{const i=process.argv.indexOf(x);assert.ok(i>=0&&process.argv[i+1],x);return process.argv[i+1];};
const archive=JSON.parse(fs.readFileSync(get('--source'),'utf8'));
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
assert.equal(archive.sourceOriginalBlob,SHA);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),sub=(a,b)=>a.map((x,i)=>x-b[i]),mag=x=>Math.hypot(...x);
const round=x=>Number(x.toFixed(6));
const summary={schema:'dopagaki.r15s3d10-28-original-B51-relative-to-true-native-finish-traces/1',
 originalGameSourceBlob:SHA,realMovingB51:28,realB48:7,
 originalNativeTrueFinishedCases:2,oldMovingB51DescriptorsUnchanged:true,
 reference:'R15S3D9 original P96 early-soft 0-21.5s then P94 corrective 240Hz stored 10Hz+transitions',
 poseSamplingIsNativeTimeTrue:true,screenAnglesApproximateNotWebGL:true,
 cameraStateForProjectionIsImmediateNotOriginalFiltered:true,
 cameraOcclusionNotMeasured:true,physicalSweptNearMissBetweenSamplesNotMeasured:true,
 humanFairnessNotCertified:true,gameplayArtHOLD:true,worlds:{}};
for(const world of ['true-pinch','pinch-switch']){
 const r=archive.cases[world].A_CONTINUOUS_NARROW_MACRO;
 assert.equal(r.originalNativeRunnerStatus,'finished');
 assert.equal(r.trueOriginalNativeFinishEventCount,1);
 const doc=buildR15S3D9(world,'A_CONTINUOUS_NARROW_MACRO');
 assert.equal(doc.movingObstacles.length,28);
 const track=r.genuineNative10HzAndContactTimeline;
 const byId=doc.movingObstacles.map(ob=>({id:ob.id,name:ob.name,type:ob.type,enabled:ob.enabled,
  staticPositionXYZ:ob.position,closestActualSampledBallSurfaceSeparationM:Infinity,
  nearestTimeSeconds:null,nearestRoad:null,
  nearestCentreDistanceM:Infinity,closestForwardApproachMetres:Infinity,
  frontWithin2SecondsSamples:0,estimatedOnScreenSamples:0,
  within30mOfActualBallSamples:0,examples:[]}));
 let forwardPotential=0,overlapPotential=0,minClearance=Infinity;
 for(const record of track){
  const position=record.xyz,time=record.t,heading=record.forwardXYZ;
  const view=viewForPose({position,forward:heading,time},createCameraState(heading));
  const speed=mag(record.velocityXYZ);
  for(let i=0;i<doc.movingObstacles.length;i++){
   const ob=doc.movingObstacles[i],p=movingObstaclePose(ob,time),entry=byId[i];
   const sep=sphereBoxSeparation(position,.65,p).separation;
   const centreD=mag(sub(p.center,position));
   const rel=sub(p.center,view.eye);
   const depth=dot(rel,view.front);
   const viewX=depth>0?1.35*dot(rel,view.right)/(1.55*depth):null;
   const viewY=depth>0?1.35*dot(rel,view.up)/depth:null;
   const estimatedScreen=depth>0&&Math.abs(viewX)<1.25&&Math.abs(viewY)<1.25;
   const lead=dot(sub(p.center,position),heading);
   const forwardSeconds=lead/Math.max(speed,1);
   if(Number.isFinite(sep)&&sep<entry.closestActualSampledBallSurfaceSeparationM){
    entry.closestActualSampledBallSurfaceSeparationM=sep;
    entry.nearestTimeSeconds=time;entry.nearestRoad=record.road;
    entry.closestForwardApproachMetres=lead;entry.nearestCentreDistanceM=centreD;
   }
   if(lead>0&&forwardSeconds<=2.0&&forwardSeconds>=0){
    entry.frontWithin2SecondsSamples++;forwardPotential++;
   }
   if(estimatedScreen)entry.estimatedOnScreenSamples++;
   if(sep<=30){entry.within30mOfActualBallSamples++;overlapPotential++;}
   if(estimatedScreen&&lead>=0&&forwardSeconds<=3&&entry.examples.length<3){
    entry.examples.push({t:time,road:record.road,forwardSeconds:round(forwardSeconds),
     approximateNormalizedScreenXY:[round(viewX),round(viewY)],ballSurfaceSeparationM:round(sep)});
   }
   if(Number.isFinite(sep))minClearance=Math.min(minClearance,sep);
  }
 }
 for(const p of byId)if(Number.isFinite(p.closestActualSampledBallSurfaceSeparationM))
   p.closestActualSampledBallSurfaceSeparationM=round(p.closestActualSampledBallSurfaceSeparationM);
 const sorted=byId.toSorted((a,b)=>a.closestActualSampledBallSurfaceSeparationM-b.closestActualSampledBallSurfaceSeparationM);
 const result={world,originalRunnerStatus:r.originalNativeRunnerStatus,
  originalNativeFinishEventCount:r.trueOriginalNativeFinishEventCount,
  originalMovingB51ContactEvents:r.originalNativeMovingContactEvents,
  samples10HzPlusTransitions:track.length,
  all28B51:sorted,closestBallSurfaceClearanceOfAllMachinesM:round(minClearance),
  individualMachinesEverWithin30m:sorted.filter(x=>x.within30mOfActualBallSamples>0).length,
  machinesEverEstimatedInImmediateCameraFov:sorted.filter(x=>x.estimatedOnScreenSamples>0).length,
  machinesEverAheadWithin2s:sorted.filter(x=>x.frontWithin2SecondsSamples>0).length,
  totalTimeSamplesAheadWithin2s:forwardPotential,
  totalTimeSamplesWithin30m:overlapPotential,
  cameraNoOcclusionData:true};
 summary.worlds[world]=result;
 console.log('R15S3D10_TRUE_B51_HAZARD_SPATIAL',JSON.stringify({world,
  nativeFinished:r.originalNativeRunnerStatus,
  movingCount:sorted.length,originalContactEvents:result.originalMovingB51ContactEvents,
  nearestBallSurfaceM:result.closestBallSurfaceClearanceOfAllMachinesM,
  individualMachinesWithin30m:result.individualMachinesEverWithin30m,
  estimatedFOV:result.machinesEverEstimatedInImmediateCameraFov,
  aheadWithin2s:result.machinesEverAheadWithin2s,
  closestTen:sorted.slice(0,7).map(x=>({id:x.id,sep:x.closestActualSampledBallSurfaceSeparationM,t:x.nearestTimeSeconds}))}));
}
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15S3D10_ACTUAL_B51_28_TRAJECTORY_AND_CAMERA_APPROACH.json',JSON.stringify(summary,null,2)+'\n');
