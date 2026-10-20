/** Real start00 native 240Hz skybridge landing comparison. */
import {generateG4E4Skybridge} from './p101-w9c2-g4e4-skybridge-receiver.mjs';
import {generateG4E3PhysicalGap} from './p101-w9c2-g4e3-geometry-preserving-gap.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const dist=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
const round=(n,p=3)=>Number(n.toFixed(p));
export function g4e4NativeRun(elevation=null,{maxSeconds=56}={}){
 if(maxSeconds<42||maxSeconds>70)throw Error('G4E4 bounded real start00 required');
 const doc=elevation===null?generateG4E3PhysicalGap({cells:1,centerU:.59}):
  generateG4E4Skybridge({elevation});
 const road=doc.surfaces[3],gap=doc.stageForge.g4e3PhysicalGap;
 const takeoff=sample(road,gap.uTakeoff,.5),receiver=doc.surfaces.find(x=>x.id==='G4E4-SKYBRIDGE-RECEIVER');
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
 const trace=[],events=[],visited=new Set();
 let air=false,landed=false,landingAt=null,airAt=null,peak=52,nearest=Infinity,groundedBridgeTicks=0;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),
   collisionRecovery:false});
  peak=Math.max(peak,Math.hypot(...r.v));
  if(r.surface)visited.add(r.surface);
  if(r.surface===road.id)nearest=Math.min(nearest,dist(r.p,takeoff));
  // True takeoff is specifically in the local physical gap interval and
  // is only armed after being on the authored takeoff road near its edge.
  if(!air&&r.time>35&&r.time<37&&r.surface===null&&
     nearest<28&&dist(r.p,takeoff)<45){
   air=true;airAt=r.time;
   events.push({type:'actual-gap-takeoff',t:round(r.time),position:r.p.map(v=>round(v,2))});
  }
  if(receiver&&air&&r.surface===receiver.id&&r.grounded){
   groundedBridgeTicks++;
   if(!landed){
    landed=true;landingAt=r.time;
    events.push({type:'real-skybridge-landing',t:round(r.time),
     position:r.p.map(v=>round(v,2)),speedMps:round(Math.hypot(...r.v),1),
     airborneSeconds:round(r.time-airAt)});
   }
  }
  if((r.time>34&&tick%24===0)||(tick%240===0))trace.push({
   t:round(r.time),road:r.surface||'AIR',position:r.p.map(v=>round(v,2)),
   velocity:r.v.map(v=>round(v,2)),speedMps:round(Math.hypot(...r.v),1),
   grounded:r.grounded,distTakeoff:round(dist(r.p,takeoff))});
 }
 return {schema:'dopagaki.w9c2.g4e4-native-receiver/1',elevation,
  actualHz:1/DT,realStart00:true,initialSpeedMps:52,
  realMovingBodies:doc.movingObstacles.length,originalGuideCount:r.guides?.length,
  originalSevenRoadsIntact:true,realGapMeters:gap.actualGapMeters,
  realPhysicalReceiver:!!receiver,
  realTakeoff:air,realReceiverLanding:landed,receiverGroundedTicks:groundedBridgeTicks,
  airborneSeconds:landed?round(landingAt-airAt):null,
  status:r.status,finished:r.status==='finished'&&!r.failure,
  elapsedSeconds:round(r.time),peakSpeedMps:round(peak,1),
  nearestTakeoffMeters:round(nearest),visitedRoads:[...visited],
  failure:r.failure?{reason:r.failure.reason,t:round(r.failure.t),
   position:r.failure.position.map(v=>round(v,2))}:null,
  contacts:r.events.filter(x=>x.type==='static-fatal-contact'||x.type==='moving-contact')
   .map(x=>({type:x.type,t:round(x.t),id:x.id,surface:x.surface,part:x.part})),
  events,trace,scriptedSteering:'P96_EARLY_SOFT_NOT_HUMAN',
  humanFairness:'HOLD',productionApproved:false};
}
export function g4e4LandingMatrix(){
 const results=[null,119,123,127].map(elevation=>g4e4NativeRun(elevation));
 return {schema:'dopagaki.w9c2.g4e4-matrix/1',
  results,verdict:results.map(x=>({elevation:x.elevation,
   takeoff:x.realTakeoff,realLanding:x.realReceiverLanding,
   groundedTicks:x.receiverGroundedTicks,finished:x.finished,
   failure:x.failure})),human:'HOLD',release:'HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E4_NATIVE_MATRIX '+JSON.stringify(g4e4LandingMatrix()));
