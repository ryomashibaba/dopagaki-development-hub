/** G4E-5A: genuine start00 240Hz 28-machine run, with extra authored
 * road guides only in the offline QA runner (never an in-game auto-assist).
 */
import {generateG4E5Continuation,G4E5_POLICY} from './p101-w9c2-g4e5-physical-continuation.mjs';
import {generateG4E4Skybridge} from './p101-w9c2-g4e4-skybridge-receiver.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(v,p=3)=>Number(v.toFixed(p));
export function g4e5NativeRun(lengthMeters=0,{maxSeconds=55}={}){
 if(maxSeconds<43||maxSeconds>65)throw Error('G4E5 full start00 bounded QA');
 const doc=lengthMeters===0?generateG4E4Skybridge({elevation:123}):
  generateG4E5Continuation({lengthMeters});
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState();
 // Original seven guides and original P96 hazard stations are constructed first.
 // Insert physically authored new-surface guides into native Runner to test
 // its existing route-following response on these genuine road colliders.
 // No player position/velocity/acceleration changes and no dynamic catch.
 const added=doc.surfaces.slice(7).map(s=>({
  surface:s.id,points:Array.from({length:65},(_,i)=>sample(s,i/64,.5))
 }));
 r.guides.splice(4,0,...added);
 const events=[],trace=[],visited=new Set(),groundedTicks={};
 let peak=52,firstRunway=null,firstBridge=null,lastRunway=null;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const input=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),
   collisionRecovery:false});
  peak=Math.max(peak,Math.hypot(...r.v));
  if(r.surface){visited.add(r.surface);if(r.grounded)groundedTicks[r.surface]=(groundedTicks[r.surface]??0)+1;}
  if(r.surface==='G4E4-SKYBRIDGE-RECEIVER'&&r.grounded&&firstBridge===null){
   firstBridge=round(r.time);events.push({type:'bridge-landing',t:firstBridge,position:r.p.map(v=>round(v,2))});
  }
  if(r.surface===G4E5_POLICY.roadId&&r.grounded){
   lastRunway=round(r.time);
   if(firstRunway===null){
    firstRunway=round(r.time);
    events.push({type:'actual-physical-seam-crossing',t:firstRunway,
     position:r.p.map(v=>round(v,2)),speedMps:round(Math.hypot(...r.v),1)});
   }
  }
  if(tick%240===0||r.time>39&&tick%48===0)
   trace.push({t:round(r.time),road:r.surface||'AIR',grounded:r.grounded,
    position:r.p.map(v=>round(v,2)),velocity:r.v.map(v=>round(v,2)),
    speedMps:round(Math.hypot(...r.v),1)});
 }
 return {schema:'dopagaki.w9c2.g4e5a-true-continuation/1',
  lengthMeters,realStart00:true,physicsHz:1/DT,startSpeedMps:52,
  movingMachines:doc.movingObstacles.length,
  originalGuideCount:plan.lengths.length,
  addedPhysicalGuideCount:added.length,
  physicalSurfaceCount:doc.surfaces.length,
  gapMeters:doc.stageForge.g4e3PhysicalGap.actualGapMeters,
  bridgeLanding:firstBridge!==null,firstBridge,
  actualRunwaySeamCrossed:firstRunway!==null,firstRunway,lastRunway,
  runwayGroundedTicks:groundedTicks[G4E5_POLICY.roadId]??0,
  bridgeGroundedTicks:groundedTicks['G4E4-SKYBRIDGE-RECEIVER']??0,
  visitedRoads:[...visited],events,trace,
  peakSpeedMps:round(peak,1),elapsedSeconds:round(r.time),
  status:r.status,finished:r.status==='finished'&&!r.failure,
  failure:r.failure?{reason:r.failure.reason,t:round(r.failure.t),
   position:r.failure.position.map(v=>round(v,2))}:null,
  fatalStaticContacts:r.events.filter(x=>x.type==='static-fatal-contact')
   .map(x=>({t:round(x.t),surface:x.surface,part:x.part})),
  scriptedOnly:true,humanFairness:'HOLD',productionPromoted:false};
}
export function g4e5Matrix(){
 const results=[0,...G4E5_POLICY.runwayLengths].map(lengthMeters=>g4e5NativeRun(lengthMeters));
 return {schema:'dopagaki.w9c2.g4e5a-matrix/1',results,
  verdict:results.map(x=>({lengthMeters:x.lengthMeters,
   bridgeLanding:x.bridgeLanding,physicalSeam:x.actualRunwaySeamCrossed,
   groundedTicks:x.runwayGroundedTicks,finished:x.finished,
   failure:x.failure})),release:'HOLD',human:'NOT_TESTED'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('G4E5_NATIVE '+JSON.stringify(g4e5Matrix()));
