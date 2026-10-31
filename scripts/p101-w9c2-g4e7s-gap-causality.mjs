/**
 * G4E-7S causal 240Hz control: same geometry, remove only the actual B48 strip.
 * A ball already airborne BEFORE the missing strip cannot establish that
 * the gap caused its jump. Never claim artificial gameplay value from mere void.
 */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateG4E7RPhysical} from './p101-w9c2-g4e7r-grade-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const dot=(a,b)=>a.reduce((sum,v,k)=>sum+v*b[k],0);
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
function roadPosition(line,p){
 let d=Infinity,u=0;
 for(let i=0;i<line.length-1;i++){
  const a=line[i],v=a.map((x,k)=>line[i+1][k]-x),
   f=Math.max(0,Math.min(1,dot(p.map((x,k)=>x-a[k]),v)/(dot(v,v)||1))),
   n=a.map((x,k)=>x+f*v[k]),sep=dist(p,n);
  if(sep<d){d=sep;u=(i+f)/(line.length-1);}
 }
 return {u,distance:d};
}
const round=(x,n=4)=>Number(x.toFixed(n));
export function g4e7sGapCausality(){
 const baseline=generateG4E7RPhysical('sweep'),cut=generateG4E7RPhysical('cut');
 if(JSON.stringify(baseline.surfaces.map(s=>s.points))!==JSON.stringify(cut.surfaces.map(s=>s.points))||
    JSON.stringify(baseline.movingObstacles)!==JSON.stringify(cut.movingObstacles))
  throw Error('Causal 240Hz test requires same real B48 lattice and 28 native machines');
 const a=new Runner(baseline,compile(baseline),0,52),b=new Runner(cut,compile(cut),0,52),
  planA=makeP96RoutePlan(baseline,a),planB=makeP96RoutePlan(cut,b),
  surgeA=createA13SurgeState(),surgeB=createA13SurgeState(),
  line=Array.from({length:129},(_,i)=>sample(cut.surfaces[0],i/128,.5)),
  gap=cut.stageForge.g4e7rStudy.gap;
 let maxDelta=0,groundedMismatchTicks=0,cutAirSweepGroundTicks=0,
  bothAirBeforeGapTicks=0,cutAirInGapTicks=0,enteredGap=false,exitedGap=false,
  firstDivergence=null,matchedTicks=0,firstGap=null;
 const samples=[];
 for(let tick=1;tick<=9/DT;tick++){
  if(['failed','finished'].includes(a.status)||['failed','finished'].includes(b.status))break;
  const sa=p96DodgeSteer(a,planA,'early-soft',movingObstaclePose).input/4.8,
   sb=p96DodgeSteer(b,planB,'early-soft',movingObstaclePose).input/4.8;
  p101Step(a,sa,'OVERDRIVE',{forwardScale:p101A13ForwardScale(a,surgeA),collisionRecovery:false});
  p101Step(b,sb,'OVERDRIVE',{forwardScale:p101A13ForwardScale(b,surgeB),collisionRecovery:false});
  matchedTicks++;
  const delta=dist(a.p,b.p);
  maxDelta=Math.max(maxDelta,delta);
  if(a.grounded!==b.grounded)groundedMismatchTicks++;
  if(a.grounded&&!b.grounded)cutAirSweepGroundTicks++;
  if(delta>.05&&!firstDivergence)
   firstDivergence={tick,t:round(b.time),deltaMeters:round(delta,5)};
  const p=roadPosition(line,b.p);
  if(p.distance<22&&p.u>=.72&&p.u<=.95){
   if(p.u<gap.uTakeoff&&!a.grounded&&!b.grounded)bothAirBeforeGapTicks++;
   if(p.u>=gap.uTakeoff&&p.u<=gap.uLanding){
    enteredGap=true;
    if(!firstGap)firstGap={tick,t:round(b.time),baselineGrounded:a.grounded,
     cutGrounded:b.grounded,cutRoadU:round(p.u,5)};
    if(!b.grounded)cutAirInGapTicks++;
   }
   if(enteredGap&&p.u>gap.uLanding)exitedGap=true;
   if(tick%24===0)samples.push({tick,time:round(b.time),u:round(p.u,5),
    deltaMeters:round(delta,5),baselineGrounded:a.grounded,
    cutGrounded:b.grounded,baselineSpeed:round(Math.hypot(...a.v),3),
    cutSpeed:round(Math.hypot(...b.v),3)});
  }
  if(p.u>.94&&exitedGap)break;
 }
 if(!enteredGap||!exitedGap||!matchedTicks||!bothAirBeforeGapTicks)
  throw Error('Causal evidence failed to sample genuine pre-gap airborne and actual void');
 return {schema:'dopagaki.g4e7s-B48-gap-causality/1',
  baseline:'G4E7R-SWEEP',experimental:'G4E7R-CUT',
  sameB48ControlPoints:true,same28MovingObstacles:true,
  realGapMeters:gap.gapMeters,hz:1/DT,start00:true,startSpeedMps:52,
  steer:'P96_SCRIPTED_DIV_4_8_NOT_HUMAN',matchedTicks,
  maxPositionDeltaMeters:round(maxDelta,6),groundedMismatchTicks,
  cutAirWhileIntactGroundedTicks:cutAirSweepGroundTicks,
  bothAlreadyAirborneBeforeGapTicks:bothAirBeforeGapTicks,
  cutAirInRealGapTicks:cutAirInGapTicks,
  firstDivergence,firstGap,samples,
  gapCausallyCausedExtraAirborne:cutAirSweepGroundTicks>0,
  fullCourseCertification:'NOT_INFERRED_FROM_LOCAL_COMPARISON',
  humanFairness:'HOLD',officialSlope2Meters:0,release:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const v=g4e7sGapCausality();
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(v,null,2)+'\n');
 console.log('G4E7S_CAUSAL '+JSON.stringify({
  maxDelta:v.maxPositionDeltaMeters,baselineAirBeforeGap:v.bothAlreadyAirborneBeforeGapTicks,
  extraCutAir:v.cutAirWhileIntactGroundedTicks,groundedMismatch:v.groundedMismatchTicks,
  gapCausedExtraAir:v.gapCausallyCausedExtraAirborne,release:v.release}));
}
