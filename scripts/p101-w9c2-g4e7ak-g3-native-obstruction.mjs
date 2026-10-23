/**
 * G4E-7AK gate 3: actually replay native 240Hz start00 P96 against original
 * reanchored B48 + B51-C and measure geometry-only warning opportunities.
 * All view rays use the ORIGINAL ball-relative camera and the actual B48
 * tessellated triangles / moving B51-C OBB poses. Not pixel visibility or
 * human reaction proof: scenery, light, color and readability are untested.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7AJ,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';

export const AK3_FOCUS_IDS=Object.freeze(['a13-machine-01','a13-machine-02']);
export const AK3_SAMPLE_TICKS=48;  // .2 s between sampled rendered warning states
const fix=(n,k=4)=>Number(n.toFixed(k));
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const mag=v=>Math.hypot(...v);
const unit=v=>v.map(x=>x/(mag(v)||1));
function tris(road){
 const mesh=tessellate(road),list=[];
 for(let i=0;i<mesh.indices.length;i+=3){
  const p=mesh.indices.slice(i,i+3).map(k=>mesh.positions.slice(3*k,3*k+3));
  list.push(p);
 }
 return list;
}
function intersectTriangle(eye,ray,[a,b,c]){
 const e1=minus(b,a),e2=minus(c,a),p=cross(ray,e2),det=dot(e1,p);
 if(Math.abs(det)<1e-10)return Infinity;
 const inv=1/det,s=minus(eye,a),u=dot(s,p)*inv;
 if(u<0||u>1)return Infinity;
 const q=cross(s,e1),v=dot(ray,q)*inv;
 if(v<0||u+v>1)return Infinity;
 const t=dot(e2,q)*inv;
 return t>.004?t:Infinity;
}
function transformLocal(pose,local){
 const c=Math.cos(pose.yawRadians),s=Math.sin(pose.yawRadians);
 return [pose.center[0]+c*local[0]+s*local[2],
         pose.center[1]+local[1],
         pose.center[2]-s*local[0]+c*local[2]];
}
function localFromWorld(pose,world,isVector=false){
 const d=isVector?world:minus(world,pose.center);
 const c=Math.cos(pose.yawRadians),s=Math.sin(pose.yawRadians);
 return [c*d[0]-s*d[2],d[1],s*d[0]+c*d[2]];
}
function nearestOBBHit(eye,ray,pose){
 if(!pose.enabled)return Infinity;
 const o=localFromWorld(pose,eye),d=localFromWorld(pose,ray,true);
 let entry=-Infinity,exit=Infinity;
 for(let k=0;k<3;k++){
  if(Math.abs(d[k])<1e-10){if(Math.abs(o[k])>pose.halfSize[k])return Infinity;continue;}
  const t1=(-pose.halfSize[k]-o[k])/d[k],t2=(pose.halfSize[k]-o[k])/d[k];
  entry=Math.max(entry,Math.min(t1,t2));
  exit=Math.min(exit,Math.max(t1,t2));
  if(entry>exit)return Infinity;
 }
 return exit>.004?Math.max(0,entry):Infinity;
}
export function ak3ExactOBBProbes(pose){
 const h=pose.halfSize;
 return [[0,0,0],
  ...[-1,1].flatMap(x=>[-1,1].flatMap(y=>[-1,1].map(z=>[x*h[0],y*h[1],z*h[2]]))),
  [h[0],0,0],[-h[0],0,0],[0,0,h[2]],[0,0,-h[2]]
 ].map(p=>transformLocal(pose,p));
}
export function ak3Visibility(view,target,allPoses,triangles){
 let inFrame=0,roadOccluded=0,otherHazardOccluded=0,clear=0;
 const corners=[],clearCorners=[],objects=ak3ExactOBBProbes(target);
 for(const world of objects){
  const d=minus(world,view.eye),distance=mag(d);
  const depth=dot(d,view.front);
  if(depth<=.01){corners.push({frame:false});continue;}
  const x=1.35*dot(d,view.right)/((16/9)*depth);
  const y=1.35*dot(d,view.up)/depth;
  const frame=Math.abs(x)<=.98&&Math.abs(y)<=.95;
  corners.push({frame,x,y,depth});
  if(!frame)continue;
  inFrame++;
  const ray=unit(d);
  const blockedRoad=triangles.some(t=>intersectTriangle(view.eye,ray,t)<distance-.12);
  if(blockedRoad){roadOccluded++;continue;}
  const other=allPoses.some(p=>p.id!==target.id&&
    nearestOBBHit(view.eye,ray,p)<distance-.12);
  if(other){otherHazardOccluded++;continue;}
  clear++;clearCorners.push({x,y});
 }
 const valid=corners.filter(c=>c.frame);
 const xs=valid.map(c=>c.x),ys=valid.map(c=>c.y);
 const freeX=clearCorners.map(c=>c.x),freeY=clearCorners.map(c=>c.y);
 const apparent1080=clearCorners.length>1?{
  widthPx:fix(960*(Math.max(...freeX)-Math.min(...freeX)),1),
  heightPx:fix(540*(Math.max(...freeY)-Math.min(...freeY)),1)}:null;
 // Approximate 1920x1080 projective screen footprint; not actual WebGL pixels.
 const sizeSupported=clear>=3&&apparent1080?.widthPx>=16&&apparent1080?.heightPx>=12;
 const d=minus(target.center,view.eye),centerDepth=dot(d,view.front);
 const projection=centerDepth>.01?{
  xNdc:fix(1.35*dot(d,view.right)/((16/9)*centerDepth)),
  yNdc:fix(1.35*dot(d,view.up)/centerDepth)}:null;
 return {pointCount:objects.length,pointsInApproxFrame:inFrame,
  pointsRoadOccluded:roadOccluded,pointsOtherB51Occluded:otherHazardOccluded,
  pointsApproxClear:clear,geometryCue:clear>=3,
  largeEnoughApproxCue1080p:Boolean(sizeSupported),
  sampledUnblockedScreenFootprint1080p:apparent1080,
  centerDistanceM:fix(mag(d)),centerDepthM:fix(centerDepth),
  centerProjection:projection,
  sampledProjectedBoxNdc:valid.length?{width:fix(Math.max(...xs)-Math.min(...xs)),
   height:fix(Math.max(...ys)-Math.min(...ys))}:null,
  caveat:'SPARSE_OBB_SURFACE_PROBES_NOT_TRUE_PIXEL_VISIBILITY'};
}
function nearestRoad(road,point){
 let best={dist:Infinity,u:0,lateralMeters:null,widthMeters:null};
 for(let i=0;i<=160;i++){
  const u=i/160,p=sample(road,u,.5),d=mag(minus(p,point));
  if(d<best.dist){
   const l=sample(road,u,0),r=sample(road,u,1),dir=unit(minus(r,l));
   best={dist:d,u,lateralMeters:dot(minus(point,p),dir),widthMeters:mag(minus(r,l))};
  }
 }
 return {u:fix(best.u,5),centerDistanceM:fix(best.dist),
  lateralMeters:fix(best.lateralMeters),realWidthAtSampleM:fix(best.widthMeters),
  outsideWidth2DProxy:Math.abs(best.lateralMeters)>best.widthMeters/2-RADIUS};
}
function advance(r,plan,surge,probe){
 const baseline=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
 const pulse=probe&&r.time>=probe.from&&r.time<probe.to?probe.delta:0;
 p101Step(r,Math.max(-1,Math.min(1,baseline+pulse)),'OVERDRIVE',{
  forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
}
function visibilityRun(roadId){
 const doc=generateG4E7AJ(roadId,'reanchor'),road=doc.surfaces[0];
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState(),triangleList=tris(road);
 const obstacles=AK3_FOCUS_IDS.map(id=>doc.movingObstacles.find(o=>o.id===id));
 const minima=Object.fromEntries(obstacles.map(o=>[o.id,{separationM:Infinity,seconds:null}]));
 const samples=[],events=[];let camera=createCameraState(r.forward);
 for(let tick=1;tick<=Math.round(9/DT)&&['ready','running'].includes(r.status);tick++){
  const prior=r.events.length;
  advance(r,plan,surge,null);camera=advanceCamera(camera,r.forward,DT);
  for(const e of r.events.slice(prior))if(e.type==='moving-contact')
   events.push({type:e.type,id:e.id,mode:e.mode,seconds:fix(e.t,5)});
  for(const ob of obstacles){
   const distance=sphereBoxSeparation(r.p,RADIUS,movingObstaclePose(ob,r.time)).separation;
   if(distance<minima[ob.id].separationM)minima[ob.id]={separationM:distance,seconds:r.time};
  }
  if(tick%AK3_SAMPLE_TICKS!==0)continue;
  const view=viewForPose(capturePose(r),camera),
    allPoses=doc.movingObstacles.map(o=>movingObstaclePose(o,r.time));
  const cues=obstacles.map(ob=>{
   const pose=allPoses.find(p=>p.id===ob.id);
   const result=ak3Visibility(view,pose,allPoses,triangleList);
   return {id:ob.id,...result};
  });
  samples.push({seconds:fix(r.time,4),speedMps:fix(mag(r.v),2),
   actual240HzTick:tick,surface:r.surface||r.lastSurface,
   actualRunnerStatus:r.status,realGapCell52:true,cues});
 }
 if(r.status!=='running'||samples.length<30)throw Error('AK3 9s P96 baseline unexpectedly failed');
 const warnings=obstacles.map(o=>{
  const a=samples.map(s=>({time:s.seconds,record:s.cues.find(c=>c.id===o.id)}));
  // "sustained" means 3 sampled camera states at 0.2s spacing;
  // an observational geometric proxy, NEVER certified human response time.
  const first=a.findIndex((v,i)=>i+2<a.length&&a.slice(i,i+3).every(
   p=>p.record.geometryCue));
  const sized=a.findIndex((v,i)=>i+2<a.length&&a.slice(i,i+3).every(
   p=>p.record.largeEnoughApproxCue1080p));
  const near=minima[o.id];
  const firstSeconds=first<0?null:a[first].time;
  const sizeSeconds=sized<0?null:a[sized].time;
  return {id:o.id,firstThreeConsecutiveSizeSupportedCueSeconds:sizeSeconds,
   sizeSupportedProxyLeadSeconds:sizeSeconds===null?null:fix(near.seconds-sizeSeconds),nearestNativeBallBoxSeparationM:fix(near.separationM),
   nearestNativeTimeSeconds:fix(near.seconds,5),
   firstThreeConsecutiveGeometricCueSeconds:firstSeconds,
   proxyLeadToClosestApproachSeconds:firstSeconds===null?null:fix(near.seconds-firstSeconds),
   hasPositiveProxyLead:firstSeconds!==null&&near.seconds-firstSeconds>0,
   caveat:'GEOMETRY_PROXY_NOT_HUMAN_REACTION_TIME'};
 });
 if(doc.surfaces.length!==7||doc.movingObstacles.length!==28||
  road.voidLongitudinalCells?.join(',')!=='52'||
  doc.stageForge.productionPromoted!==false||doc.stageForge.g4e7ajStudy.unchangedMovingObjects!==26)
  throw Error('AK3 real protected B48/B51 provenance mismatch');
 return {road:roadId,stageId:doc.stageForge.recordStageId,
  exactB48TriangleCount:triangleList.length,
  genuineB51Count:doc.movingObstacles.length,
  realFirstRoadWidthM:doc.stageForge.g4e7ahStudy.widthMinMeters,
  sourceHumanSteer:false,events,status:r.status,warnings,samples};
}
function earlyRightFailure(roadId){
 const doc=generateG4E7AJ(roadId,'reanchor'),r=new Runner(doc,compile(doc),0,52),
  plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState(),
  key={from:2.05,to:2.8,delta:.38},timeline=[];
 const road=doc.surfaces[0],eventCounts={movingContact:0,staticFatal:0,air:0};
 let lastSupported=null;
 for(let tick=1;tick<=Math.round(9/DT)&&['ready','running'].includes(r.status);tick++){
  const start=r.events.length;advance(r,plan,surge,key);
  if(r.grounded&&r.surface)lastSupported={seconds:fix(r.time,5),surface:r.surface,
   position:r.p.map(x=>fix(x,3)),speedMps:fix(mag(r.v),3)};
  for(const e of r.events.slice(start)){
   if(e.type==='moving-contact')eventCounts.movingContact++;
   if(e.type==='static-fatal-contact')eventCounts.staticFatal++;
   if(e.type==='air')eventCounts.air++;
  }
  if(tick%48===0||r.status==='failed'){
   timeline.push({seconds:fix(r.time,5),heightM:fix(r.p[1]),
    speedMps:fix(mag(r.v)),grounded:r.grounded,
    currentSurface:r.surface||r.lastSurface,nearestRoad:nearestRoad(road,r.p)});
  }
 }
 if(r.status!=='failed'||r.events.some(e=>e.type==='moving-contact')||
  Math.abs(r.time-(roadId==='true-pinch'?6.45833:6.57083))>.06)
  throw Error('AK3 early-right native failure no longer matches Gate 1');
 return {road:roadId,profile:'P96_FIXED_RIGHT_2_05_TO_2_80_NONHUMAN',
  status:r.status,seconds:fix(r.time,5),
  authoritativeRunnerFailure:r.failure,lastNativeGroundedSupport:lastSupported,
  secondsWithoutSupportAtFall:lastSupported?fix(r.time-lastSupported.seconds,5):null,
  physicsEventCounts:eventCounts,timeline,
  caveat:'REAL_RUNNER_FAILURE_WITH_APPROX_NEAREST_ROAD_NOT_HUMAN_FAIRNESS'};
}
export function g4e7akGate3VisibilityAndFailure(){
 const proof=AJ_ROADS.map(visibilityRun),failures=AJ_ROADS.map(earlyRightFailure);
 return {schema:'dopagaki.g4e7ak-native-240hz-B48-triangles-B51-OBB-visibility/1',
  actualNativePhysicsHz:1/DT,physicalRoads:7,physicalMovingB51:28,
  source:'G4E7AJ_REANCHOR_UNMODIFIED',
  technique:'ORIGINAL_BALL_RELATIVE_CAMERA_PLUS_NATIVE_RAY_TO_13_OBB_PROBES',
  limits:'GEOMETRY_SAMPLES_NO_SCENERY_MATERIAL_PIXEL_CONTRAST_OR_REAL_HUMAN_REACTION',
  results:proof,earlyRightFailures:failures,formalSlope2Meters:0,
  humanFairness:'HOLD',visualQuality:'HOLD',artQuality:'HOLD',
  productionPromoted:false,publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const r=g4e7akGate3VisibilityAndFailure();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(r,null,2)+'\n');
 console.log('AK3_HAZARD_PROXIES '+JSON.stringify(r.results.map(x=>({road:x.road,
  triangles:x.exactB48TriangleCount,
  summary:x.warnings,
  samples:x.samples.length}))));
 console.log('AK3_RIGHT_FAIL_CAUSES '+JSON.stringify(r.earlyRightFailures.map(f=>({
  road:f.road,seconds:f.seconds,reason:f.authoritativeRunnerFailure?.reason,
  lastNativeSupport:f.lastNativeGroundedSupport,
  secondsWithoutSupportAtFall:f.secondsWithoutSupportAtFall,
  counts:f.physicsEventCounts,last:f.timeline.at(-1)}))));
}
