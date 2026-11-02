/** G4E-7AQ: read-only temporal collision and actual 240Hz A/B for AJ vs AP.
 * A shared P96 reference is computed ONLY from AJ, and the identical input
 * timeline is replayed on both physical stages with fixed A/D perturbations.
 * P96 is experimental non-human steering; no fair gameplay is certified.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7AJ,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {generateG4E7AP} from './p101-w9c2-g4e7ap-temporal-slalom.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

const HAZARDS=Object.freeze([['a13-machine-01',.32],['a13-machine-02',.80]]);
const PULSES=Object.freeze([
 Object.freeze({id:'replayed-p96',delta:0,from:0,to:0}),
 Object.freeze({id:'early-left',delta:-.38,from:2.05,to:2.80}),
 Object.freeze({id:'early-right',delta:.38,from:2.05,to:2.80})
]);
const clamp=x=>Math.max(-1,Math.min(1,x));
const fix=(x,n=3)=>Number.isFinite(x)?Number(x.toFixed(n)):null;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
function integrity(aj,ap){
 if(aj.stageForge.g4e7ajStudy.id!=='reanchor'||
   ap.stageForge.g4e7apStudy.id!=='temporal-slalom'||
   !same(aj.surfaces,ap.surfaces)||!same(aj.route,ap.route)||
   !same(aj.spawns,ap.spawns)||!same(aj.routeSegments,ap.routeSegments)||
   aj.surfaces.length!==7||ap.surfaces.length!==7||
   aj.movingObstacles.length!==28||ap.movingObstacles.length!==28||
   aj.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
   !same(aj.movingObstacles.filter(o=>!HAZARDS.some(h=>h[0]===o.id)),
         ap.movingObstacles.filter(o=>!HAZARDS.some(h=>h[0]===o.id)))||
   aj.stageForge.productionPromoted!==false||ap.stageForge.productionPromoted!==false||
   ap.stageForge.g4e7apStudy.certifiedSlope2Meters!==0)
  throw Error('AQ requires independent genuine AJ/AP 7-road, 26-mover protected origin');
}
function crossSection(doc,seconds){
 const positions=HAZARDS.map(([id,u])=>({
  id,u,points:[.08,.29,.5,.71,.92].map(v=>{
   const p=sample(doc.surfaces[0],u,v);
   return [p[0],p[1]+RADIUS,p[2]];
  }),
  widthMeters:fix(distance(sample(doc.surfaces[0],u,0),sample(doc.surfaces[0],u,1)))
 }));
 return positions.map(h=>{
  const ob=doc.movingObstacles.find(o=>o.id===h.id);
  if(!ob)throw Error('AQ missing original moving physical object');
  let middleBlocked=0,allFiveBlocked=0,bothEdgeBlocked=0,edgeAlternativeFrames=0;
  let minimumRealOBBGapMeters=Infinity;
  const count=120;
  for(let k=0;k<=count;k++){
   const t=seconds*k/count,pose=movingObstaclePose(ob,t);
   const sep=h.points.map(p=>sphereBoxSeparation(p,RADIUS,pose).separation);
   minimumRealOBBGapMeters=Math.min(minimumRealOBBGapMeters,...sep);
   if(sep[2]<=0)middleBlocked++;
   if(sep.every(v=>v<=0))allFiveBlocked++;
   if(sep[0]<=0&&sep[4]<=0)bothEdgeBlocked++;
   if(sep[0]>0||sep[4]>0)edgeAlternativeFrames++;
  }
  return {id:h.id,u:h.u,widthMeters:h.widthMeters,
   sampledInstants:count+1,sampledPeriodSeconds:seconds,
   centerBlockedSamples:middleBlocked,allFiveBlockedSamples:allFiveBlocked,
   bothEdgeBlockedSamples:bothEdgeBlocked,oneEdgeUnblockedSamples:edgeAlternativeFrames,
   minimumSignedSphereBoxGapMeters:fix(minimumRealOBBGapMeters),
   claim:'STATIONARY_LANE_SAMPLES_ONLY_NOT_A_CONNECTED_REACHABLE_TRAJECTORY'};
 });
}
function advance(r,input,surge){
 p101Step(r,input,'OVERDRIVE',{
  forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false
 });
}
function referenceTimeline(doc,ticks){
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r);
 const surge=createA13SurgeState(),inputs=[];
 let activeTicks=0;
 for(let k=0;k<ticks;k++){
  if(!['ready','running'].includes(r.status)){inputs.push(0);continue;}
  const input=clamp(p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8);
  inputs.push(input);activeTicks++;
  advance(r,input,surge);
 }
 return {inputs,activeTicks,status:r.status,
  untilSeconds:fix(r.time,5),failure:r.failure?.reason??null};
}
function replay(doc,inputs,pulse){
 const r=new Runner(doc,compile(doc),0,52),surge=createA13SurgeState();
 const moving=HAZARDS.map(([id])=>doc.movingObstacles.find(o=>o.id===id));
 const minimum=Object.fromEntries(HAZARDS.map(([id])=>[id,{meters:Infinity,t:null}]));
 let cursor=0,events=[],samples=0,firstImpact=null;
 for(let k=0;k<inputs.length&&['ready','running'].includes(r.status);k++){
  const time=k*DT,delta=time>=pulse.from&&time<pulse.to?pulse.delta:0;
  advance(r,clamp(inputs[k]+delta),surge);
  // 10Hz auxiliary OBB sampling; native swept-contact solver is still 240Hz.
  if(k%24===0||!['ready','running'].includes(r.status)){
   samples++;
   for(let i=0;i<moving.length;i++){
    const id=HAZARDS[i][0],pose=movingObstaclePose(moving[i],r.time),
     gap=sphereBoxSeparation(r.p,RADIUS,pose).separation;
    if(gap<minimum[id].meters)minimum[id]={meters:gap,t:fix(r.time,5)};
   }
  }
  for(const event of r.events.slice(cursor)){
   if(['moving-contact','static-fatal-contact','failure'].includes(event.type)){
    const e={type:event.type,id:event.id??null,mode:event.mode??null,seconds:fix(event.t??r.time,5)};
    events.push(e);
    if(!firstImpact&&e.type==='moving-contact')firstImpact=e;
   }
  }
  cursor=r.events.length;
 }
 return {id:pulse.id,delta:pulse.delta,windowSeconds:pulse.delta?[pulse.from,pulse.to]:null,
  actualNativePhysicsHz:1/DT,inputSource:'SAME_JA_BASELINE_P96_TIMELINE_PLUS_FIXED_AD_NOT_HUMAN',
  durationSeconds:fix(r.time,5),status:r.status,
  failureReason:r.failure?.reason??null,
  actualRunnerMovingContacts:events.filter(e=>e.type==='moving-contact').length,
  firstPhysicalMovingContact:firstImpact,
  nativeEvents:events.slice(0,20),
  sampledMovingOBB10HzOnly:true,OBBSamples:samples,
  minimumSampledB51Clearance:Object.fromEntries(Object.entries(minimum).map(([id,v])=>
   [id,{meters:fix(v.meters),seconds:v.t}])),
  finalSpeedMps:fix(Math.hypot(...r.v)),finalPosition:r.p.map(v=>fix(v)),
  humanClearance:'HOLD'};
}
export function makeG4E7AQEvidence({seconds=7.2}={}){
 if(!Number.isFinite(seconds)||seconds<6||seconds>12)throw Error('AQ invalid time horizon');
 const ticks=Math.round(seconds/DT),comparison=[];
 for(const road of AJ_ROADS){
  const aj=generateG4E7AJ(road,'reanchor'),ap=generateG4E7AP(road),
   frozenAJ=JSON.stringify(aj),frozenAP=JSON.stringify(ap);
  integrity(aj,ap);
  const reference=referenceTimeline(aj,ticks);
  const cases=[['AJ_REANCHOR',aj],['AP_TEMPORAL_SLALOM',ap]].map(([name,doc])=>({
   candidate:name,recordStageId:doc.stageForge.recordStageId,
   hazards:crossSection(doc,seconds),
   probes:PULSES.map(p=>replay(doc,reference.inputs,p))
  }));
  if(JSON.stringify(aj)!==frozenAJ||JSON.stringify(ap)!==frozenAP)
   throw Error('AQ read-only origin mutation');
  comparison.push({road,sharedSteering:{
   generation:'AJ native P96 once; same 240Hz per-tick control replay on AJ/AP',
   baselineValidTicks:reference.activeTicks,plannedTicks:ticks,
   baselineStatus:reference.status,baselineUntilSeconds:reference.untilSeconds,
   baselineFailure:reference.failure,probeIds:PULSES.map(p=>p.id)},
   cases});
 }
 return {schema:'dopagaki.w9c2.g4e7aq-real-B48-B51-temporal-AB/1',
  durationSeconds:seconds,physicsHz:1/DT,startingSpeedMps:52,
  genuineB48Surfaces:7,realB51Machines:28,untouchedOriginalB51:26,
  measuredMethod:'ACTUAL_NATIVE_240HZ_SHARED_SCRIPT_INPUT_AND_REAL_MOVING_OBB',
  limitation:'NONHUMAN_FIXED_INPUT_AND_STATIONARY_LANE_SAMPLES_ARE_NOT_FAIRNESS_OR_TRAJECTORY_PROOF',
  comparison,formalSlope2Meters:0,manualFairness:'HOLD',
  visualQuality:'HOLD',promotion:'HOLD',publication:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const evidence=makeG4E7AQEvidence();
 if(process.argv[2]){fs.mkdirSync(path.dirname(process.argv[2]),{recursive:true});
  fs.writeFileSync(process.argv[2],JSON.stringify(evidence,null,2)+'\n');}
 console.log('G4E7AQ_NATIVE_REAL_AB '+JSON.stringify(evidence.comparison.map(x=>({
  road:x.road,reference:x.sharedSteering,
  cases:x.cases.map(y=>({candidate:y.candidate,
   hazardWindows:y.hazards.map(h=>({id:h.id,center:h.centerBlockedSamples,edge:h.oneEdgeUnblockedSamples})),
   probes:y.probes.map(p=>({id:p.id,status:p.status,seconds:p.durationSeconds,
    contacts:p.actualRunnerMovingContacts,reason:p.failureReason}))}))
 }))));
}
