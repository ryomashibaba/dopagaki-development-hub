/**
 * G4E-7AB true causal physical contour matrix. Each new REAL B48 shape
 * runs twice: one genuine 1-strip void, one IDENTICAL intact B48.
 * Native 240Hz start00 P96 research, 9 sec LOCAL SCREEN ONLY.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {AC_R2_FORMS,generateG4E7ACR2} from './p101-w9c2-g4e7ac-r2-physical.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';
const f=(v,n=4)=>Number(v.toFixed(n));
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const len=(a,b)=>Math.hypot(...sub(a,b));
function nearest(line,p){
 let best={dist:Infinity,u:0};
 for(let i=0;i<line.length-1;i++){
  const a=line[i],v=sub(line[i+1],a),d=sub(p,a),
    q=Math.max(0,Math.min(1,dot(v,d)/(dot(v,v)||1))),
    distance=Math.hypot(...d.map((x,j)=>x-q*v[j]));
  if(distance<best.dist)best={dist:distance,u:(i+q)/(line.length-1)};
 }
 return best;
}
function start(doc){
 const r=new Runner(doc,compile(doc),0,52);
 return {r,plan:makeP96RoutePlan(doc,r),surge:createA13SurgeState(),
  camera:createCameraState(r.forward),firstAir:null,rejoin:null,
  minAfter:Infinity,approachGround:0,approachAir:0,postGapGround:0,
  views:[]};
}
function step(x){
 const r=x.r;if(!['ready','running'].includes(r.status))return;
 const input=p96DodgeSteer(r,x.plan,'early-soft',movingObstaclePose).input/4.8;
 p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,x.surge),collisionRecovery:false});
 x.camera=advanceCamera(x.camera,r.forward,DT);
}
function perspective(eye,view,target){
 const v=sub(target,eye),z=dot(v,view.front),u=dot(v,view.right),h=dot(v,view.up);
 return {forwardMeters:f(z,2),ndcX:z>0?f(1.35*u/(16/9*z),3):null,
  ndcY:z>0?f(1.35*h/z,3):null,eyeDistanceMeters:f(Math.hypot(...v),2),
  withinApproxFrame:z>0&&Math.abs(1.35*u/(16/9*z))<.98&&Math.abs(1.35*h/z)<.95};
}
function run(variant){
 const gapDoc=generateG4E7ACR2(variant),intact=structuredClone(gapDoc);
 delete intact.surfaces[0].voidLongitudinalCells;
 const solid=start(intact),cut=start(gapDoc),road=gapDoc.surfaces[0],
  gap=gapDoc.stageForge.g4e7acR2Study.gap,
  line=Array.from({length:97},(_,i)=>sample(road,i/96,.5)),
  checkpoints=[3.15,3.65,4.15,4.5];
 let checked=0,extraAir=0,maxDelta=0,firstCausal=null,
  beforeGround=0,beforeAir=0,near=0;
 for(let tick=1;tick<=9/DT;tick++){
  step(solid);step(cut);
  const a=solid.r,b=cut.r,p=nearest(line,a.p),q=nearest(line,b.p);
  if(p.dist<27&&q.dist<27&&a.status==='running'&&b.status==='running'){
   if(p.u>=gap.uTakeoff-.025&&p.u<gap.uTakeoff-.005){
    if(a.grounded&&b.grounded)beforeGround++;
    if(!a.grounded||!b.grounded)beforeAir++;
   }
   if(p.u>=gap.uTakeoff-.03&&p.u<=gap.uLanding+.1){
    near++;
    const delta=len(a.p,b.p);maxDelta=Math.max(maxDelta,delta);
    if(a.grounded&&!b.grounded){
     extraAir++;
     if(!firstCausal)firstCausal={t:f(b.time,5),u:f(p.u,6),speedMps:f(Math.hypot(...b.v),2)};
    }
   }
  }
  if(b.status==='running'&&q.dist<30){
   if(q.u>=gap.uTakeoff&&q.u<=gap.uLanding+.12&&!b.grounded&&!cut.firstAir)
    cut.firstAir={t:f(b.time,5),u:f(q.u,6)};
   if(cut.firstAir&&!cut.rejoin&&q.u>gap.uLanding&&b.grounded&&b.surface===road.id)
    cut.rejoin={t:f(b.time,5),u:f(q.u,6),speedMps:f(Math.hypot(...b.v),2)};
   if(q.u>=gap.uLanding&&q.u<=.92){
    cut.minAfter=Math.min(cut.minAfter,Math.hypot(...b.v));
    if(b.grounded)cut.postGapGround++;
   }
  }
  if(checked<checkpoints.length&&b.time>=checkpoints[checked]){
   const pose=capturePose(b),view=viewForPose(pose,cut.camera);
   cut.views.push({time:f(b.time,5),targetTime:checkpoints[checked],
    camera: [...view.eye],speedMps:f(Math.hypot(...b.v),2),
    firstRoadGapVisibleByProjection:perspective(view.eye,view,sample(road,gap.uTakeoff,.5)),
    landingVisibleByProjection:perspective(view.eye,view,sample(road,gap.uLanding,.5)),
    noOcclusionAssumed:true});
   checked++;
  }
  if(['finished','failed'].includes(a.status)&&['finished','failed'].includes(b.status))break;
 }
 return {variant,alpha:.7,realLipWidthMeters:gap.lipWidthMeters,
  realGapLengthMeters:gap.gapMeters,actualMacroHorizontalMeters:gapDoc.stageForge.g4e7acR2Study.maxHorizontalMeters,
  actualMacroVerticalMeters:gapDoc.stageForge.g4e7acR2Study.maxVerticalMeters,
  actual240Hz:1/DT,localScreenOnlySeconds:9,
  groundBeforeLipTicks:beforeGround,anyAirBeforeLipTicks:beforeAir,
  solidGroundGapAirTicks:extraAir,actualCausalPositionDeltaMeters:f(maxDelta,4),
  nearGapMatchedTicks:near,firstCausal,firstAir:cut.firstAir,
  genuineSameRoadRejoin:cut.rejoin,
  minPostGapSpeedMps:Number.isFinite(cut.minAfter)?f(cut.minAfter,2):null,
  afterGapGroundedTicks:cut.postGapGround,
  nativeCameraEarlyProjection:cut.views,
  trueGapStatus:cut.r.status,solidStatus:solid.r.status,
  recommendLongRun:beforeGround>=5&&beforeAir<=4&&extraAir>=6&&maxDelta>.3&&
   Boolean(cut.rejoin)&&cut.rejoin.speedMps>65&&cut.r.status!=='failed',
  fullSevenRoadsProven:false,manualFairness:'HOLD',officialSlope2Meters:0};
}
export function g4e7acR2ContourScreen(){
 const results=[];
 for(const variant of AC_R2_FORMS)results.push(run(variant.id));
 return {schema:'dopagaki.g4e7ac-r2-preserved-lip-macro-true-B48-240hz-screen/1',
  physicsHz:1/DT,start00:true,initialSpeedMps:52,
  originalMovingMachines:28,originalRoads:7,
  actual239PointHzGuard:DT,results,
  shortlist:results.filter(x=>x.recommendLongRun).map(x=>x.variant),
  nextRequirement:'REAL_NATIVE_7OF7_AND_BROWSER_WEBGL',
  officialSlope2Meters:0,publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const result=g4e7acR2ContourScreen();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
 console.log('G4E7AC_R2_SCREEN '+JSON.stringify(result.results.map(x=>({
  variant:x.variant,alpha:x.alpha,ground:x.groundBeforeLipTicks,
  airBefore:x.anyAirBeforeLipTicks,extra:x.solidGroundGapAirTicks,
  delta:x.actualCausalPositionDeltaMeters,
  rejoin:x.genuineSameRoadRejoin,minSpeed:x.minPostGapSpeedMps,
  early:x.nativeCameraEarlyProjection.map(y=>({t:y.time,lip:y.firstRoadGapVisibleByProjection})),
  candidate:x.recommendLongRun}))));
}
