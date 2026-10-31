/**
 * W5 first real 240 Hz FULL-COURSE diagnostic for altered A13 geometry
 * + all 28 B51-C moving colliders. Retains exact B5 native initial speed
 * and thrust law but MUST NOT inherit any B5 finish certificate.
 * Steering is P96's old 12-machine SCRIPTED reference, not human input
 * and not an A13-optimized 28-machine avoidance controller.
 */
import {generateP101A13RoadCandidate} from './p101-a13-road-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(x,n=2)=>Number(x.toFixed(n));
export function a13NativePilot({maxSeconds=75}={}){
 if(!Number.isFinite(maxSeconds)||maxSeconds<30||maxSeconds>80)
  throw Error('A13 needs 30–80 seconds bounded TRUE native 240Hz simulation');
 const doc=generateP101A13RoadCandidate(),world=compile(doc);
 const r=new Runner(doc,world,0,52),plan=makeP96RoutePlan(doc,r);
 const state=createA13SurgeState(),visited=new Set(),trace=[];
 let topSpeed=52,airStart=null,longestAir=0,airDuration=0,steerTicks=0;
 for(let tick=0;tick<Math.round(maxSeconds/DT)&&!['failed','finished'].includes(r.status);tick++){
  const p=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
  // The scripted controller already supplies effective acceleration; only
  // scale back input to preserve actual human 4.8× authority in p101Step.
  const steering=p.input/4.8;
  if(Math.abs(steering)>.01)steerTicks++;
  p101Step(r,steering,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,state)});
  const speed=Math.hypot(...r.v);
  topSpeed=Math.max(topSpeed,speed);
  if(r.surface){visited.add(r.surface);airDuration=0;}
  else{if(airStart===null)airStart=r.time;airDuration+=DT;longestAir=Math.max(longestAir,airDuration);}
  if(tick%240===0)trace.push({
   t:round(r.time),speed:round(speed),road:r.surface||'AIR',
   grounded:Boolean(r.grounded),section:state.section,input:round(steering,3)
  });
 }
 return {schema:'dopagaki.a13-native-pilot/1',variant:doc.stageForge.variant,
  baseline:'B5_SCRIPTED_CONTROLLER_FOR_ORIGINAL_12_MACHINES_ONLY',
  humanFairness:'NOT_TESTED',nativeHz:1/DT,launchSpeed:52,
  physicalRoadCount:doc.surfaces.length,activeNativeMachineCount:doc.movingObstacles.length,
  status:r.status,finished:r.status==='finished'&&visited.size===7&&!r.failure,
  sectionsVisited:[...visited],realTimeSeconds:round(r.time,3),
  peakSpeedMps:round(topSpeed),longestAirSeconds:round(longestAir,3),
  firstAirSeconds:airStart===null?null:round(airStart,3),
  steeringTickFraction:round(steerTicks/(Math.max(r.time/DT,1)),3),
  movingContacts:r.events.filter(x=>x.type==='moving-contact').length,
  failure:r.failure?{reason:r.failure.reason,time:round(r.failure.t,3),position:r.failure.position.map(x=>round(x))}:null,
  trace};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const result=a13NativePilot();
 console.log('A13_NATIVE_TRIAL '+JSON.stringify({...result,trace:undefined}));
 console.log('A13_NATIVE_TRACE '+JSON.stringify(result.trace));
 if(result.physicalRoadCount!==7||result.activeNativeMachineCount!==28||result.nativeHz!==240)
  throw Error('A13 integrity failure: wrong physical road/hazard count or physics frequency');
}
