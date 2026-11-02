/**
 * R15A: Read-only native game experiential evidence (not a new game or art pass).
 * Based on the unchanged original R1 240Hz start00 P96 camera/physics replay.
 * Projection checks obstacle CENTER only: no mesh occlusion, player reaction,
 * path-following future prediction or human fairness certification.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildEarlyTimeline} from './p101-w9c2-g4e7dz-r6d-r1-early-native.mjs';

const SOURCE='af076d67492a677d2235e4730aef8cdf4808e106';
const norm=v=>Math.hypot(...v);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>a.map(x=>x/(norm(a)||1));
const round=(x,n=4)=>Number(x.toFixed(n));

export function centerProjection(frame,world){
 const forward=unit(frame.front),right=unit(cross(forward,[0,1,0])),up=unit(cross(right,forward));
 const d=sub(world,frame.eye),depth=dot(d,forward);
 if(!Number.isFinite(depth)||depth<=0.001)return null;
 const x=1.35*dot(d,right)/(depth*(1360/860));
 const y=1.35*dot(d,up)/depth;
 return {x:round(x,5),y:round(y,5),depthMeters:round(depth,3)};
}
export function inspectMover(frame,mover){
 const center=mover.center,half=mover.halfSize;
 if(!Array.isArray(center)||center.length!==3||!center.every(Number.isFinite)||
  !Array.isArray(half)||half.length!==3||!half.every(x=>Number.isFinite(x)&&x>0))
  throw Error('R15A nonfinite or invalid original mover dimensions');
 const distance=norm(sub(center,frame.playerPosition));
 const radius=norm(half); // conservative AABB half-diagonal, NOT collider clearance
 const approxSurfaceDistance=Math.max(0,distance-radius);
 const speed=frame.speedMps;
 const equivalent=Number.isFinite(speed)&&speed>0?approxSurfaceDistance/speed:null;
 const projection=centerProjection(frame,center);
 const centerOnScreen=projection!==null&&Math.abs(projection.x)<=1&&Math.abs(projection.y)<=1;
 const active=mover.enabled!==false;
 return {id:mover.id,type:mover.type,active,
  centerDistanceMeters:round(distance,3),boundingHalfDiagonalMeters:round(radius,3),
  straightLineSpeedEquivalentSeconds:equivalent===null?null:round(equivalent,4),
  projection,
  projectedCenterInFrustum:active&&centerOnScreen,
  withinTwoSecondDistanceEquivalent:active&&equivalent!==null&&equivalent<=2,
  potentialVisibleTwoSecondCandidate:active&&centerOnScreen&&equivalent!==null&&equivalent<=2};
}
export function auditNativeTimeline(timeline){
 if(timeline.sourceCXBlob!==SOURCE || timeline.originalCX!==18 ||
  timeline.originalB48!==7 || timeline.originalB51!==28 ||
  timeline.originalCameras!==5 || timeline.physicsHz!==240 || timeline.sourceGameChanged ||
  timeline.newGameColliders!==0 || timeline.officialArt!==0 ||
  timeline.officialSlope2Meters!==0 || timeline.frames.length!==13 ||
  timeline.originalTrajectoryParity.length!==7)
  throw Error('R15A original-source contract not met');
 const frames=timeline.frames.map(f=>{
  if(f.moving.length!==28||f.originalSource!=='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN')
   throw Error('R15A expected 28 original dynamic machine poses');
  const movers=f.moving.map(m=>inspectMover(f,m));
  const visible=movers.filter(m=>m.projectedCenterInFrustum);
  const candidates=movers.filter(m=>m.potentialVisibleTwoSecondCandidate);
  const nearest=movers.filter(m=>m.active).sort((a,b)=>a.centerDistanceMeters-b.centerDistanceMeters)[0];
  return {id:f.id,seconds:f.seconds,sourcePhysicsTick:f.tick,originalRoad:f.physicalRoad,
    sourceSpeedMps:f.speedMps,grounded:f.grounded,observedCollisionCount:f.collisions,
    activeMoverCount:movers.filter(m=>m.active).length,
    originalMoverCount:movers.length,projectedCenterInFrustumCount:visible.length,
    twoSecondStraightLineAndFrustumCandidateCount:candidates.length,
    candidateMoverIds:candidates.map(m=>m.id),nearestActiveMover:nearest||null,
    originalMoverReadOnlyProjection:movers};
 });
 const n=frames.length;
 const speeds=frames.map(x=>x.sourceSpeedMps);
 return {schema:'dopagaki.r15a-native-kinematic-hazard-visibility-readonly/1',
  road:timeline.road,sourceCXBlob:SOURCE,sourcePhysicsHz:240,originalCX:18,originalB48:7,
  originalB51:28,originalCameras:5,originalGap52:true,
  actualSource:'ORIGINAL_START00_P96_240HZ_FIXED_SCRIPT_NOT_HUMAN',
  sourceGameChanged:false,newGameColliders:0,newCityMeshes:0,
  originalCameraHalfSecondFrames:n,sampledOriginalTimesSeconds:timeline.sampleTimesSeconds,
  trajectoryParityWithPreviousR1:timeline.originalTrajectoryParity,
  tickWindowAggregate:timeline.sampledTickWindow,observedFrames:frames,
  summary:{minSampledSpeedMps:round(Math.min(...speeds),3),
   maxSampledSpeedMps:round(Math.max(...speeds),3),
   sourceFramesWithProjectedMoverCenters:frames.filter(x=>x.projectedCenterInFrustumCount>0).length,
   sourceFramesWithTwoSecondGeometricCandidates:frames.filter(x=>x.twoSecondStraightLineAndFrustumCandidateCount>0).length,
   groundedFrames:frames.filter(x=>x.grounded).length,sampledFrameCount:n},
  interpretation:'Camera-center projection and straight-line speed-equivalent distance ONLY. NOT a visible mesh, no occlusion, no future mover prediction, no route-equivalent lead time, no human reaction or safety test. 0.5s snapshots can miss intermediate hazards. Grounded frame != playable route.',
  actualBrowserWebGL:'NOT_RUN',sourceOriginalBlenderArt:'NOT_RE-RENDERED',
  validatedContinuousTimeColliderSafety:'NOT_CERTIFIED',
  actualJumpRecovery:'NOT_TESTED',road10To16mFairness:'NOT_TESTED',
  actualPlayerObstruction:'NOT_TESTED',humanSteering:'NOT_TESTED',
  artDecision:'NO_NEW_ART_RETAIN_R14_REJECT',officialArt:0,officialSlope2Meters:0,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
  INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const outDir='test-results/r15a-native-game-audit';
 fs.mkdirSync(outDir,{recursive:true});
 for(const road of ['true-pinch','pinch-switch']){
  const d=auditNativeTimeline(buildEarlyTimeline(road));
  fs.writeFileSync(path.join(outDir,road+'.json'),JSON.stringify(d,null,2)+'\n');
  console.log('R15A_NATIVE_READONLY_SOURCE_EVIDENCE',JSON.stringify({road,...d.summary,
   ART:d.ART,GAMEPLAY:d.GAMEPLAY,WebGL:d.actualBrowserWebGL}));
 }
}