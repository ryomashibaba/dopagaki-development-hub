/**
 * Native B48 240Hz whole-course start00 comparison, six early actual gaps
 * plus frozen unedited W7F Gold. Read-only scripted P96 steering, NOT human.
 * Airborne and landing are separate spatial/time gates; a brief collision
 * on the takeoff side must NOT be called a genuine downstream landing.
 */
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {generateG4E6EarlyGap,G4E6_SITES} from './p101-w9c2-g4e6-early-gap-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step,p101RoadProgress} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,n=3)=>Number(x.toFixed(n));
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
function nearGuide(guide,pos){
 let result={distance:Infinity,u:0};
 for(let i=0;i<guide.length-1;i++){
  const a=guide[i],b=guide[i+1],ab=b.map((v,k)=>v-a[k]);
  const sq=ab.reduce((sum,v)=>sum+v*v,0)||1;
  const t=Math.min(1,Math.max(0,ab.reduce((sum,v,k)=>sum+v*(pos[k]-a[k]),0)/sq));
  const point=a.map((v,k)=>v+ab[k]*t),d=distance(point,pos);
  if(d<result.distance)result={distance:d,u:(i+t)/(guide.length-1)};
 }
 return result;
}
export function g4e6NativeRun(id='GOLD',{maxSeconds=65,docOverride=null}={}){
 if(maxSeconds<45||maxSeconds>72)throw Error('G4E6 bounded real start00 run only');
 // An explicit offline-authored physical variant can reuse the EXACT native
 // Gold controller/finish instrumentation. This has no effect on existing calls.
 if(docOverride&&(id==='GOLD'||docOverride.stageForge?.g4e6EarlyGap?.id!==id||
  docOverride.stageForge.productionPromoted!==false))
  throw Error('G4E6 offline physical document identity/approval mismatch');
 const doc=docOverride??(id==='GOLD'?generateP101A13W7Candidate():generateG4E6EarlyGap(id));
 const gap=doc.stageForge.g4e6EarlyGap??null;
 const activeRoad=gap?doc.surfaces[gap.section]:null;
 const center=activeRoad?Array.from({length:129},(_,i)=>sample(activeRoad,i/128,.5)):null;
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
 const visited=new Set(),ordered=[],events=[],trace=[];
 let maxSpeed=52,armed=false,air=false,landing=false,
  landingCandidateTicks=0,landingTick=null,airAt=null,landingAt=null,
  nearestTakeoff=Infinity,maximumProgress=0,flightNearest=Infinity,
  flightAfterEdge=false,firstArrivalOnGapRoad=null,landingCandidateAt=null;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const steer=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  const speed=Math.hypot(...r.v);
  maxSpeed=Math.max(maxSpeed,speed);
  if(r.surface){
   if(!visited.has(r.surface))ordered.push(r.surface);
   visited.add(r.surface);
  }
  const pos=r.p;
  let near=null;
  if(gap){
   near=nearGuide(center,pos);
   const dTake=distance(pos,gap.takeoffXYZ);
   if(r.surface===gap.surfaceId&&r.grounded){
    nearestTakeoff=Math.min(nearestTakeoff,dTake);
    if(firstArrivalOnGapRoad===null)firstArrivalOnGapRoad=round(r.time);
    if(near.distance<70&&near.u>=gap.uTakeoff-.035&&near.u<=gap.uTakeoff+.003)
     armed=true;
   }
   if(near.distance<100)maximumProgress=Math.max(maximumProgress,near.u);
   if(armed&&!air&&!r.grounded&&near.distance<100&&
       near.u>=gap.uTakeoff-.003&&near.u<=gap.uLanding+.022){
    air=true;airAt=r.time;
    events.push({type:'true-gap-air',time:round(r.time),u:round(near.u,5),
     speed:round(speed,1),gapMeters:round(gap.gapMeters,2)});
   }
   if(air&&!landing){
    if(near.u>=gap.uLanding+.002)flightAfterEdge=true;
    flightNearest=Math.min(flightNearest,near.distance);
    if(r.grounded&&r.surface===gap.surfaceId&&
       near.distance<50&&near.u>=gap.uLanding+.006){
      landingCandidateTicks++;
      if(landingCandidateAt===null)landingCandidateAt=r.time;
      if(landingCandidateTicks>=18){
       landing=true;landingTick=tick;landingAt=r.time;
       events.push({type:'true-original-road-landing',
        time:round(r.time),u:round(near.u,5),
        physicalGroundedTicks:landingCandidateTicks});
      }
    }else{
     landingCandidateTicks=0;landingCandidateAt=null;
    }
   }
   // Read-only forensic trace limited to the gap neighborhood or one sample/sec.
   if((armed&&tick%24===0)||tick%240===0){
    trace.push({time:round(r.time),surface:r.surface||'AIR',
     u:round(near.u,5),centerlineDistance:round(near.distance,2),
     grounded:r.grounded,speed:round(speed,1),
     xyz:pos.map(x=>round(x,2))});
   }
  }else if(tick%480===0){
   trace.push({time:round(r.time),surface:r.surface||'AIR',
    speed:round(speed,1),xyz:pos.map(x=>round(x,2))});
  }
 }
 const actualSequence=doc.surfaces.slice(0,7).map(s=>s.id);
 const allOriginalRoadsVisited=actualSequence.every(s=>visited.has(s));
 const inOrder=actualSequence.every((s,i)=>i===0||
   ordered.indexOf(actualSequence[i-1])<ordered.indexOf(s));
 const trueLanding=air&&landing&&flightAfterEdge;
 const completed=r.status==='finished'&&!r.failure;
 return {schema:'dopagaki.w9c2.g4e6-native/1',
  id,realStart00:true,initialSpeedMps:52,hz:1/DT,
  originalRoads:7,originalMovingBodies:doc.movingObstacles.length,
  originalGuideCount:plan.lengths.length,physicalGapMeters:gap?.gapMeters??0,
  gapSection:gap?.section??null,
  trueGap:!!gap&&gap.actualOpenB48Collision&&gap.noMidpointRideableSupport,
  firstRoadArrivalSeconds:firstArrivalOnGapRoad,
  genuineAirborneAtGap:air,airAtSeconds:air?round(airAt):null,
  crossedLandingEdge:flightAfterEdge,genuineLandingOnSameOriginalRoad:trueLanding,
  firstGroundingAfterLandingSeconds:landingCandidateAt===null?null:round(landingCandidateAt),
  landingConfirmedSeconds:trueLanding?round(landingAt):null,
  closestGroundedTakeoffMeters:Number.isFinite(nearestTakeoff)?round(nearestTakeoff):null,
  maximumObservedRoadU:gap?round(maximumProgress,4):null,
  nearestGuideDistanceDuringFlightMeters:Number.isFinite(flightNearest)?round(flightNearest):null,
  visitedOriginalRoadsInOrder:allOriginalRoadsVisited&&inOrder,
  visitedOriginalCount:actualSequence.filter(s=>visited.has(s)).length,
  visitedOrder:ordered,
  completed,elapsedSeconds:round(r.time),peakSpeedMps:round(maxSpeed,1),
  failure:r.failure?{reason:r.failure.reason,time:round(r.failure.t),
   position:r.failure.position.map(x=>round(x,2)),
   speed:round(r.failure.speed,1),surface:r.failure.surface}:null,
  nativeMovingContacts:r.events.filter(e=>e.type==='moving-contact').length,
  nativeStaticFatalContacts:r.events.filter(e=>e.type==='static-fatal-contact')
    .map(e=>({time:round(e.t),surface:e.surface,part:e.part,
      inwardNormalMps:round(e.inwardNormalMps,1)})),
  events,trace,scriptedInput:'P96_EARLY_SOFT_NOT_HUMAN',
  humanFairness:'HOLD',productionApproved:false,
  approvedSlopeDNAMeters:0};
}
export function g4e6NativeMatrix(){
 const results=['GOLD',...G4E6_SITES.map(x=>x.id)].map(id=>g4e6NativeRun(id));
 return {schema:'dopagaki.w9c2.g4e6-native-matrix/1',
  controlGoldFinished:results[0].completed,
  results,
  verdict:results.map(x=>({id:x.id,openGap:x.trueGap,
   airborne:x.genuineAirborneAtGap,originalLanding:x.genuineLandingOnSameOriginalRoad,
   visitedAll7InOrder:x.visitedOriginalRoadsInOrder,finished:x.completed,
   elapsed:x.elapsedSeconds,reason:x.failure?.reason??null})),
  allHumanFairness:'HOLD',publish:'HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E6_NATIVE '+JSON.stringify(g4e6NativeMatrix()));
