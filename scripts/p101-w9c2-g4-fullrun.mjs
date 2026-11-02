/**
 * W9-C2 G4C: real start00 52m/s, 7-road 240Hz scripted reference.
 * This does NOT certify a human completion, visuals, input fairness or
 * real gameplay. Uses the same original W7F P96 early-soft / 4.8 controller.
 * No road, machine, collision, speed or gravity hacks.
 */
import {generateW9C2G4MacroArc} from './p101-w9c2-g4-macro-arc-build.mjs';
import {generateP101A13W7Candidate} from './p101-a13-w7-gameplay-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(n,p=3)=>Number(n.toFixed(p));
export function g4FullScriptedRun(kind,{maxSeconds=68}={}){
 if(!['gold','glide','horizon'].includes(kind)||!Number.isFinite(maxSeconds)||
  maxSeconds<5||maxSeconds>75)throw Error('G4C bounded actual-start QA only');
 const doc=kind==='gold'?generateP101A13W7Candidate():generateW9C2G4MacroArc(kind);
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r);
 const surge=createA13SurgeState(),visited=new Set(),trace=[],events=[];
 let air=0,longestAir=0,peak=52,evIndex=0,sectionIVSamples=0;
 for(let tick=0;tick<maxSeconds/DT&&r.status!=='failed'&&r.status!=='finished';tick++){
  const target=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose);
  p101Step(r,target.input/4.8,'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  if(r.surface){visited.add(r.surface);air=0;}else{air+=DT;longestAir=Math.max(longestAir,air);}
  peak=Math.max(peak,Math.hypot(...r.v));
  for(;evIndex<r.events.length;evIndex++){
   const e=r.events[evIndex];
   if(e.type==='moving-contact')events.push({id:e.id,mode:e.mode,t:round(e.t)});
  }
  if(surge.section===3)sectionIVSamples++;
  if(tick%240===0)trace.push({t:round(r.time),section:surge.section,
   surface:r.surface||'AIR',speed:round(Math.hypot(...r.v),1),
   input:round(target.input/4.8,3)});
 }
 return {schema:'dopagaki.w9c2.g4c-start00-native-scripted/1',kind,
  startIndex:0,startSpeedMps:52,actualNativeHz:1/DT,
  machines:doc.movingObstacles.length,physicsUntouched:true,
  humanController:false,steering:'P96_EARLY_SOFT_SCRIPT_DIVIDED_4_8',
  status:r.status,finished:r.status==='finished'&&visited.size===7&&!r.failure,
  sectionsVisited:visited.size,sectionIVSeconds:round(sectionIVSamples*DT),
  peakSpeedMps:round(peak,1),elapsedSeconds:round(r.time),
  longestAirSeconds:round(longestAir),movingContacts:events,
  failure:r.failure?{reason:r.failure.reason,time:round(r.failure.t),
   surface:r.failure.surface}:null,trace,
  humanFairness:'HOLD',productionApproved:false};
}
export function g4FullMatrix(){
 const runs=['gold','glide','horizon'].map(kind=>g4FullScriptedRun(kind));
 return {schema:'dopagaki.w9c2.g4c-three-actual-start-runs/1',runs,
  noHumanPlaytest:true,gameSelection:'OFF',humanApproval:'HOLD'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)
 console.log('W9C2_G4C_FULL_RUN '+JSON.stringify(g4FullMatrix()));
