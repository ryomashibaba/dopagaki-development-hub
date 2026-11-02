/**
 * G4E-2 actual 240Hz full start00 and honest airborne/landing telemetry.
 * The existing P96 script is a reference trajectory, NOT human control.
 */
import {generateG4E2TrueGap} from './p101-w9c2-g4e2-true-gap-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(n,p=3)=>Number(n.toFixed(p));
export function g4e2NativeGapRun({maxSeconds=68}={}){
 if(maxSeconds<10||maxSeconds>75)throw Error('G4E2 bounded start00 only');
 const doc=generateG4E2TrueGap(),r=new Runner(doc,compile(doc),0,52);
 const plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
 const first=doc.surfaces[3].id,landing=doc.surfaces.at(-1).id;
 const takeoff=sample(doc.surfaces[3],1,.5);
 const dist=p=>Math.hypot(...p.map((x,k)=>x-takeoff[k]));
 let airAtGap=false,landedAfterGap=false,airDuration=0,airStart=null,
  takeoffArmed=false,closestTakeoffMeters=Infinity,events=[],maxSpeed=52;
 const visited=new Set(),trace=[];
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const target=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
  p101Step(r,target.input/4.8,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  if(r.surface)visited.add(r.surface);
  maxSpeed=Math.max(maxSpeed,Math.hypot(...r.v));
  if(r.surface===first){
   closestTakeoffMeters=Math.min(closestTakeoffMeters,dist(r.p));
   if(dist(r.p)<25)takeoffArmed=true;
  }
  if(!r.surface&&takeoffArmed&&!airAtGap&&dist(r.p)<45){
   airAtGap=true;airStart=r.time;
   events.push({type:'candidate-gap-airborne',t:round(r.time),
    distanceFromTakeoffMeters:round(dist(r.p))});
  }
  if(airAtGap&&!landedAfterGap&&r.surface===landing){
   landedAfterGap=true;airDuration=r.time-airStart;
   events.push({type:'candidate-gap-real-landing',t:round(r.time),
    airborneSeconds:round(airDuration),speedMps:round(Math.hypot(...r.v),1)});
  }
  if(tick%480===0)trace.push({t:round(r.time),surface:r.surface||'AIR',
   section:surge.section,speed:round(Math.hypot(...r.v),1)});
 }
 const finished=r.status==='finished'&&!r.failure;
 return {schema:'dopagaki.w9c2.g4e2-true-gap-native/1',
  status:r.status,finished,actualHz:1/DT,fromRealStart00:true,
  initialSpeedMps:52,actual28MovingBodies:doc.movingObstacles.length,
  realPhysicalGap:doc.stageForge.g4e2TrueGap.actualCenterlineEdgeDistanceMeters,
  noMidpointFloor:doc.stageForge.g4e2TrueGap.noRideableSupportAtGapMidpoint,
  gapAirborneObserved:airAtGap,landedOnNewPhysicalRoad:landedAfterGap,
  closestGroundedTakeoffMeters:Number.isFinite(closestTakeoffMeters)?round(closestTakeoffMeters):null,
  gapAirSeconds:landedAfterGap?round(airDuration):null,
  peakSpeedMps:round(maxSpeed,1),elapsed:round(r.time),
  visitedSurfaces:[...visited],failure:r.failure?{reason:r.failure.reason,
   time:round(r.failure.t),surface:r.failure.surface}:null,
  scriptedInput:'P96_EARLY_SOFT_NOT_HUMAN',events,trace,
  humanFairness:'HOLD',productionApproved:false};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E2_GAP_NATIVE '+JSON.stringify(g4e2NativeGapRun()));
