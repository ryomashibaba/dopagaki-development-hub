/**
 * G4E-1 actual start00 52m/s / native 240Hz full-course risk test.
 * Scripted steering is only a regression gate, never human certification.
 */
import {generateW9C2G4ENarrow} from './p101-w9c2-g4e-narrow-build.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(n,p=3)=>Number(n.toFixed(p));
export function g4eFullNativeRun(kind,{maxSeconds=68}={}){
 if(!['gold','shoulder','razor'].includes(kind)||
    !Number.isFinite(maxSeconds)||maxSeconds<5||maxSeconds>75)
  throw Error('G4E-1 only bounded native start00 trial');
 const doc=kind==='gold'?generateP101A13W7Candidate():generateW9C2G4ENarrow(kind);
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r);
 const surge=createA13SurgeState(),visited=new Set(),trace=[];
 let peak=52,longestAir=0,air=0,movingContacts=0,eventIndex=0;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const target=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
  p101Step(r,target.input/4.8,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  if(r.surface){visited.add(r.surface);air=0;}
  else{air+=DT;longestAir=Math.max(longestAir,air);}
  peak=Math.max(peak,Math.hypot(...r.v));
  for(;eventIndex<r.events.length;eventIndex++)
   if(r.events[eventIndex].type==='moving-contact')movingContacts++;
  if(tick%480===0)trace.push({time:round(r.time),section:surge.section,
   surface:r.surface||'AIR',speed:round(Math.hypot(...r.v),1)});
 }
 return {schema:'dopagaki.w9c2.g4e1-start00-native/1',kind,
  startIndex:0,startSpeedMps:52,actualNativeHz:1/DT,
  physicsLawUnchanged:true,movingBodies:doc.movingObstacles.length,
  scriptedSteering:'P96_EARLY_SOFT_DIVIDED_4_8_NOT_HUMAN',
  status:r.status,finished:r.status==='finished'&&visited.size===7&&!r.failure,
  sectionsVisited:visited.size,elapsedSeconds:round(r.time),
  peakSpeedMps:round(peak,1),longestAirSeconds:round(longestAir),
  movingContacts,failure:r.failure?{reason:r.failure.reason,
   t:round(r.failure.t),surface:r.failure.surface}:null,trace,
  actualGap:false,naturalJumpCertified:false,
  humanFairness:'HOLD',productionApproved:false};
}
export function g4eFullMatrix(){
 const runs=['gold','shoulder','razor'].map(kind=>g4eFullNativeRun(kind));
 return {schema:'dopagaki.w9c2.g4e1-three-full-runs/1',runs,
  stageRegistered:false,allHumanApproval:'HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('W9C2_G4E1_NATIVE_MATRIX '+JSON.stringify(g4eFullMatrix()));
