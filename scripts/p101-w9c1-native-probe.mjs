/** Native 240Hz / 28-body C1 diagnostic, not a human victory test. */
import {generateP101W9C1AbyssCandidate,W9C1_VARIANTS} from './p101-w9c1-abyss-narrow.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {locateRoadLateral} from '../web/p81-edge-radar.mjs';
import {makeW9C1CueProfile,readW9C1Cue} from '../web/p101-w9c1-approach-cue.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const round=(n,p=2)=>Number(n.toFixed(p));
function localRoadMeter(s,point){
 let best={distance:Infinity,meters:0};
 for(let row=0;row<31;row++){
  const c=s.points[row*5+2],d=Math.hypot(...point.map((v,k)=>v-c[k]));
  if(d<best.distance)best={distance:d,meters:row*20};
 }
 return best.meters;
}
export function runW9C1Native(kind,{maxSeconds=65}={}){
 if(!W9C1_VARIANTS[kind]||!Number.isFinite(maxSeconds)||maxSeconds<50||maxSeconds>80)
   throw Error('W9-C1 native bounded variant/time required');
 const doc=generateP101W9C1AbyssCandidate(kind);
 const runner=new Runner(doc,compile(doc),0,52);
 const plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState();
 const cueProfile=makeW9C1CueProfile(doc,sample);
 let cueFirstTime=null,coreEnterTime=null,firstCueEta=null;
 const visited=new Set(),trace=[];let peakMps=52,air=0,longestAir=0,contacts=0,index=0;
 for(let tick=0;tick<Math.ceil(maxSeconds/DT)&&!['failed','finished'].includes(runner.status);tick++){
  const steer=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose);
  p101Step(runner,steer.input/4.8,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge)});
  if(runner.surface){visited.add(runner.surface);air=0;}else{air+=DT;longestAir=Math.max(longestAir,air);}
  const speed=Math.hypot(...runner.v);peakMps=Math.max(peakMps,speed);
  if(tick%6===0&&runner.surface===cueProfile.roadId&&coreEnterTime===null){
   const edge=locateRoadLateral(doc,runner.surface,runner.p,sample,frame,{grounded:runner.grounded});
   const cue=readW9C1Cue(cueProfile,{surfaceId:runner.surface,u:edge?.u,
     grounded:runner.grounded,speedMps:speed});
   if(cue?.phase==='approach'&&cueFirstTime===null){cueFirstTime=runner.time;firstCueEta=cue.instantaneousEtaSeconds;}
   if(cue?.phase==='core')coreEnterTime=runner.time;
  }
  for(;index<runner.events.length;index++)if(runner.events[index].type==='moving-contact')contacts++;
  if(tick%60===0&&runner.surface===doc.surfaces[0].id){
   const meters=localRoadMeter(doc.surfaces[0],runner.p);
   if(meters>=120&&meters<=470)
    trace.push({t:round(runner.time,3),meterApprox:meters,
      speedMps:round(speed,1),grounded:runner.grounded,
      roadWidthMeters:round(Math.hypot(...sample(doc.surfaces[0],meters/600,0).map((v,k)=>v-sample(doc.surfaces[0],meters/600,1)[k])),1)});
  }
 }
 return {schema:'dopagaki.w9c1.native-physical-candidate/1',
  kind,recordStageId:doc.stageForge.recordStageId,
  physicsHz:1/DT,ballRadiusMeters:.65,movingBodies:doc.movingObstacles.length,
  initialMps:52,maximumMps:round(peakMps,1),seconds:round(runner.time,3),
  status:runner.status,sectionsVisited:visited.size,
  scriptedFinished:runner.status==='finished'&&visited.size===7&&!runner.failure,
  longestAirSeconds:round(longestAir,3),movingContacts:contacts,
  scriptedFirstNoticeSeconds:cueFirstTime===null?null:round(cueFirstTime,3),
  scriptedCoreEntrySeconds:coreEnterTime===null?null:round(coreEnterTime,3),
  scriptedCueLeadSeconds:cueFirstTime===null||coreEnterTime===null?null:round(coreEnterTime-cueFirstTime,3),
  firstCueCurrentSpeedEtaSeconds:firstCueEta===null?null:round(firstCueEta,3),
  cueIsHUDNotVisibilityProof:true,
  failure:runner.failure?{reason:runner.failure.reason,time:round(runner.failure.t,3),position:runner.failure.position.map(x=>round(x,1))}:null,
  note:'P96 CORRECTIVE SCRIPT ONLY: NOT human fairness, legibility or fun proof',
  trace};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 for(const kind of Object.keys(W9C1_VARIANTS)){
  const result=runW9C1Native(kind);
  console.log('W9C1_NATIVE_RESULT '+JSON.stringify({...result,trace:undefined}));
  console.log('W9C1_NATIVE_TRACE '+JSON.stringify({kind,trace:result.trace}));
  if(result.physicsHz!==240||result.movingBodies!==28||result.scriptedCueLeadSeconds===null||result.scriptedCueLeadSeconds<2)
    throw Error('W9-C1 cannot weaken original physics or moving hazards');
 }
}
