/**
 * P101 A13 W6B — QA-ONLY 28-machine lookahead experiment.
 * Contrasts with W6A's existing 12-machine P96 scripted pilot; DOES NOT
 * enable steering assistance in the shipped game. Human fairness stays HOLD.
 */
import {generateP101A13RoadCandidate} from './p101-a13-road-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p96DodgeSteer,makeP96RoutePlan} from '../web/p96-avoidance-steer.mjs';
import {makeHazardRoadPlan,nextRoadHazardCue} from '../web/p97-roadplay-gates.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

const clamp=(x,a,b)=>Math.max(a,Math.min(x,b));
const round=(x,n=3)=>Number(x.toFixed(n));
export const W6_AWARE_PROFILES=Object.freeze([
 Object.freeze({name:'28-lookahead-soft',range:440,laneOffsetMeters:24,offsetGain:.045,rampMeters:220}),
 Object.freeze({name:'28-lookahead-strong',range:570,laneOffsetMeters:28,offsetGain:.058,rampMeters:300})
]);
/** Read-only scripted planner. It knows every true B51-C position/period/size,
 * but cannot promise that the opposite lane is free or human-reachable. */
export function a13W6AuditSteer(r,fullPlan,legacyPlan,profile,movingPose=movingObstaclePose){
 if(!W6_AWARE_PROFILES.includes(profile)||!fullPlan||fullPlan.stations.length!==28)
  throw Error('W6B requires real 28 obstacle physical-road plan');
 const old=p96DodgeSteer(r,legacyPlan,'early-soft',movingPose);
 const cue=nextRoadHazardCue(r.doc,r,fullPlan,movingPose,{range:profile.range});
 if(!cue||!cue.id.startsWith('a13-machine-'))
  return {input:old.input/4.8,target:old.station||null,source:'P96_FIRST12'};
 const lateral=cue.predictedLateralMeters;
 // No fabricated safe lane; this is one *candidate* steering choice.
 const direction=lateral>0?-1:1;
 const lead=clamp((profile.range-cue.meters)/profile.rampMeters,0,1);
 const raw=p94NativeSteer(r,'corrective')+
   direction*profile.laneOffsetMeters*profile.offsetGain*lead;
 return {input:clamp(raw,-1,1)/4.8,target:cue.id,source:'A13_EXTRA16',
  meters:cue.meters,eta:cue.etaSeconds,predictedLateral:lateral};
}
export function runA13W6Aware(profile,{seconds=72}={}){
 if(!W6_AWARE_PROFILES.includes(profile)||!Number.isFinite(seconds)||seconds<40||seconds>80)
  throw Error('W6B bounded declared audit only');
 const doc=generateP101A13RoadCandidate();
 const r=new Runner(doc,compile(doc),0,52),state=createA13SurgeState();
 const fullPlan=makeHazardRoadPlan(doc,sample),legacyPlan=makeP96RoutePlan(doc,r);
 if(fullPlan.stations.length!==28||r.doc.movingObstacles.length!==28)
  throw Error('W6B native body count drift');
 const trace=[],vis=new Set(),contacts=[];
 let peak=52,air=0,longestAir=0,firstAir=null,read=0,extrasUsed=0;
 for(let tick=0;tick<Math.round(seconds/DT)&&!['failed','finished'].includes(r.status);tick++){
  const guide=a13W6AuditSteer(r,fullPlan,legacyPlan,profile);
  if(guide.source==='A13_EXTRA16')extrasUsed++;
  p101Step(r,guide.input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,state)});
  peak=Math.max(peak,Math.hypot(...r.v));
  if(r.surface){vis.add(r.surface);air=0;}
  else{if(firstAir===null)firstAir=r.time;air+=DT;longestAir=Math.max(longestAir,air);}
  for(;read<r.events.length;read++){
   const ev=r.events[read];
   if(ev.type==='moving-contact')
    contacts.push({id:ev.id,mode:ev.mode,t:round(ev.t),xyz:ev.position.map(x=>round(x,1))});
  }
  if(tick%480===0)trace.push({t:round(r.time),speed:round(Math.hypot(...r.v),1),
   road:r.surface||'AIR',section:state.section,steer:round(guide.input,2),
   target:guide.target,controller:guide.source});
 }
 return {schema:'dopagaki.a13-w6b-all28-scripted-audit/1',
  profile:profile.name,humanTested:false,gameplayAutoSteering:false,
  physicsHz:1/DT,activeMoving:doc.movingObstacles.length,
  ellowOriginal12Path:'P96',completionCertified:false,
  status:r.status,elapsed:round(r.time),sevenRoads:vis.size===7,
  sectionsVisited:[...vis],peakSpeed:round(peak,1),
  firstAir:firstAir===null?null:round(firstAir),longestAir:round(longestAir),
  awareSteeringFraction:round(extrasUsed/Math.max(1,Math.round(r.time/DT))),
  contacts,failure:r.failure?{reason:r.failure.reason,t:round(r.failure.t),
   xyz:r.failure.position.map(x=>round(x,1))}:null,trace};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 const all=W6_AWARE_PROFILES.map(p=>runA13W6Aware(p));
 for(const a of all)console.log('A13_W6B_AWARE '+JSON.stringify({...a,trace:undefined}));
 console.log('A13_W6B_TRACE '+JSON.stringify(Object.fromEntries(all.map(a=>[a.profile,a.trace]))));
 if(all.some(a=>a.physicsHz!==240||a.activeMoving!==28))
  throw Error('W6B actual native physics input drift');
}
