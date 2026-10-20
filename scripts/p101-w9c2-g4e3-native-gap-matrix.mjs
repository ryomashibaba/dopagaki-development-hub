/**
 * Actual 240Hz, real start00, unchanged P96 scripted steering, native B48 CCD.
 * Gold/SHOULDER controls and 1/2/3 physical-cell voids. All results, including
 * failures, are emitted as evidence; no teleport, jump force, fake landing.
 */
import {generateG4E3PhysicalGap} from './p101-w9c2-g4e3-geometry-preserving-gap.mjs';
import {generateW9C2G4ENarrow} from './p101-w9c2-g4e-narrow-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
const round=(v,p=3)=>Number(v.toFixed(p));
export function g4e3NativeRun(cells=2,{maxSeconds=68}={}){
 if(maxSeconds<20||maxSeconds>75)throw Error('Bounded full start00 test only');
 const doc=cells===0?generateW9C2G4ENarrow('shoulder'):generateG4E3PhysicalGap({cells});
 const road=doc.surfaces[3],gap=doc.stageForge.g4e3PhysicalGap;
 const takeoff=gap?sample(road,gap.uTakeoff,.5):null;
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState(),trace=[],events=[],visited=new Set();
 let closestTakeoff=Infinity,air=false,landed=false,airAt=null,landingAt=null,
  armed=false,peakSpeed=52,lastRoad=null,firstNear=null,firstAir=null;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),
   collisionRecovery:false});
  if(r.surface)visited.add(r.surface);
  peakSpeed=Math.max(peakSpeed,Math.hypot(...r.v));
  if(gap&&r.surface===road.id){
   const d=dist(r.p,takeoff);
   closestTakeoff=Math.min(closestTakeoff,d);
   if(d<45){armed=true;if(firstNear===null)firstNear=round(r.time);}
  }
  if(gap&&armed&&!r.surface&&!air&&dist(r.p,takeoff)<50){
   air=true;airAt=r.time;firstAir=round(r.time);
   events.push({type:'physical-gap-airborne',t:firstAir,
    takeoffDistanceMeters:round(dist(r.p,takeoff)),
    speedMps:round(Math.hypot(...r.v),1)});
  }
  if(gap&&air&&!landed&&r.surface===road.id&&r.time>airAt+.015){
   const landedPosition=sample(road,gap.uLanding,.5);
   if(dist(r.p,landedPosition)<100){
    landed=true;landingAt=r.time;
    events.push({type:'physical-gap-landing',t:round(r.time),
     airSeconds:round(landingAt-airAt),distanceToLandingMeters:round(dist(r.p,landedPosition))});
   }
  }
  if(tick%240===0||gap&&armed&&tick%48===0)trace.push({
   t:round(r.time),road:r.surface||'AIR',speedMps:round(Math.hypot(...r.v),1),
   distanceToTakeoff:gap?round(dist(r.p,takeoff)):null,
   grounded:r.grounded,position:r.p.map(v=>round(v,2))});
  if(r.surface)lastRoad=r.surface;
 }
 return {schema:'dopagaki.w9c2.g4e3-native-physical-matrix/1',
  cells,actualHz:1/DT,realStart00:true,initialSpeedMps:52,
  status:r.status,finished:r.status==='finished'&&!r.failure,
  realMovingBodies:doc.movingObstacles.length,
  fullGuideSegments:r.guides?.length,realGapMeters:gap?.actualGapMeters??0,
  originalSplinePreserved:gap?.exactOriginalControlPoints??true,
  realGapAirObserved:air,realGapLandingObserved:landed,
  gapAirSeconds:landed?round(landingAt-airAt):null,
  closestGroundedTakeoffMeters:Number.isFinite(closestTakeoff)?round(closestTakeoff):null,
  peakSpeedMps:round(peakSpeed,1),elapsedSeconds:round(r.time),
  visitedRoads:[...visited],firstNear,firstAir,events,trace,
  failure:r.failure?{reason:r.failure.reason,t:round(r.failure.t),
   position:r.failure.position.map(v=>round(v,2))}:null,
  steering:'P96_EARLY_SOFT_SCRIPTED_NOT_HUMAN',humanFairness:'HOLD',
  productionPromoted:false};
}
export function runG4E3Matrix(){
 const results=[0,1,2,3].map(cells=>g4e3NativeRun(cells));
 return {schema:'dopagaki.w9c2.g4e3-comparison/1',results,
  controlFinish:results[0].finished,
  candidateVerdicts:results.slice(1).map(x=>({
   cells:x.cells,fullStart00:x.finished,actualGapFlight:x.realGapAirObserved,
   landing:x.realGapLandingObserved,reason:x.failure?.reason??null})),
  release:'HOLD',human:'NOT_TESTED'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E3_MATRIX '+JSON.stringify(runG4E3Matrix()));
