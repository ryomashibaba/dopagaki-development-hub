/** G4E-7AR — independently controlled actual B51 rotor impact + narrow-road A/D reachability probes.
 * The local 240Hz Runner, moving OBB CCD kernel, and unchanged B48 roads are real.
 * Injection checkpoints and the P96 scripted input are NOT human gameplay.
 * No original AJ/AP, Gold, physics engine, scores or public assets are mutated.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateG4E7AJ,AJ_ROADS} from './p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {generateG4E7AP} from './p101-w9c2-g4e7ap-temporal-slalom.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,movingContactResponse,sweepSphereMovingObstacle} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step,p101RoadProgress} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

const ID='a13-machine-02',clamp=x=>Math.max(-1,Math.min(1,x));
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const norm=a=>a.map(x=>x/(Math.hypot(...a)||1));
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const add=(a,b,k)=>a.map((x,i)=>x+b[i]*k);
const fix=(x,n=4)=>Number.isFinite(x)?Number(x.toFixed(n)):null;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const PULSES=Object.freeze([
 {id:'early-left-soft',from:1.85,to:2.65,delta:-.22},
 {id:'early-right-soft',from:1.85,to:2.65,delta:.22},
 {id:'late-left-soft',from:3.15,to:3.90,delta:-.22},
 {id:'late-right-soft',from:3.15,to:3.90,delta:.22}
]);
function verify(aj,ap){
 const ignored=o=>o.filter(x=>!['a13-machine-01',ID].includes(x.id));
 if(aj.stageForge.g4e7ajStudy.id!=='reanchor'||ap.stageForge.g4e7apStudy.id!=='temporal-slalom'||
  !eq(aj.surfaces,ap.surfaces)||!eq(aj.route,ap.route)||!eq(aj.spawns,ap.spawns)||
  !eq(aj.routeSegments,ap.routeSegments)||!eq(ignored(aj.movingObstacles),ignored(ap.movingObstacles))||
  aj.surfaces.length!==7||aj.movingObstacles.length!==28||ap.movingObstacles.length!==28||
  aj.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
  aj.stageForge.productionPromoted!==false||ap.stageForge.productionPromoted!==false||
  ap.stageForge.g4e7apStudy.certifiedSlope2Meters!==0)
  throw Error('AR protected physical AJ/AP source changed');
}
function originalRotor(doc){
 const ob=doc.movingObstacles.find(o=>o.id===ID);
 if(!ob||ob.type!=='rotator')throw Error('AR requires actual rotator 02');
 return ob;
}
function launchGeometry(ob,side){
 const pose=movingObstaclePose(ob,0);
 const out=norm([Math.sin(pose.yawRadians)*side,0,Math.cos(pose.yawRadians)*side]);
 const center=add(pose.center,out,pose.halfSize[2]+RADIUS+2);
 return {pose,start:center,velocity:out.map(x=>-x*52)};
}
function tangent(road){
 const a=sample(road,.797,.5),b=sample(road,.803,.5);
 return norm([b[0]-a[0],0,b[2]-a[2]]);
}
function modeOnlyStage(doc,mode){
 const clone=structuredClone(doc),index=clone.movingObstacles.findIndex(o=>o.id===ID);
 clone.movingObstacles[index]={...clone.movingObstacles[index],
  collision:mode==='bounce'?{mode:'bounce',restitution:.8}:{mode:'push',pushStrength:1}};
 return clone;
}
function kernelImpact(ob,road,side){
 const launch=launchGeometry(ob,side),t1=.12,
  end=add(launch.start,launch.velocity,t1);
 const hit=sweepSphereMovingObstacle(ob,launch.start,end,RADIUS,0,t1);
 if(!hit.hit)return {hit:false,status:hit.status,side};
 const push=movingContactResponse({...ob,collision:{mode:'push',pushStrength:1}},
  launch.velocity,hit);
 const bounce=movingContactResponse({...ob,collision:{mode:'bounce',restitution:.8}},
  launch.velocity,hit);
 const along=tangent(road);
 return {hit:true,side,physicalContactSeconds:fix(hit.time,6),
  sweptOBBStatus:hit.status,contactNormal:hit.normal.map(v=>fix(v)),
  actualRotorPointVelocity:push.surfaceVelocity.map(v=>fix(v)),
  referenceForwardMps:fix(dot(launch.velocity,along)),
  modes:[push,bounce].map(x=>({
   mode:x.mode,normalClosingMps:fix(x.incomingNormalVelocity),
   deltaVelocityMps:fix(Math.hypot(...x.deltaVelocity)),
   forwardAfterMps:fix(dot(x.velocity,along)),
   reversedRelativeRoadTangent:dot(launch.velocity,along)*dot(x.velocity,along)<0,
   responseKernelOnly:true
  }))};
}
function injectedRunner(doc,side){
 const ob=originalRotor(doc),start=launchGeometry(ob,side),
  velocity=[...start.velocity],forward=norm(velocity);
 const runner=new Runner(doc,compile(doc),0,52);
 runner.resumeAt({position:start.start,velocity,forward,normal:[0,1,0],
  surface:doc.surfaces[0].id,speed:52});
 runner.assist=false;
 for(let k=0;k<Math.round(.24/DT)&&['ready','running'].includes(runner.status);k++){
  runner.step(0);
  if(runner.events.some(e=>e.type==='moving-contact'&&e.id===ID))break;
 }
 const hit=runner.events.find(e=>e.type==='moving-contact'&&e.id===ID);
 const along=tangent(doc.surfaces[0]);
 return {side,status:runner.status,simulatedSeconds:fix(runner.time,6),
  physicalContactObserved:Boolean(hit),actualContactMode:hit?.mode??null,
  contactTimeSeconds:fix(hit?.t),velocityBefore:hit?.velocityBefore?.map(v=>fix(v))??null,
  velocityAfter:hit?.velocityAfter?.map(v=>fix(v))??null,
  forwardAlongRoadBeforeMps:hit?fix(dot(hit.velocityBefore,along)):null,
  forwardAlongRoadAfterMps:hit?fix(dot(hit.velocityAfter,along)):null,
  reverseAtActualRunnerContact:hit?dot(hit.velocityBefore,along)*dot(hit.velocityAfter,along)<0:null,
  firstCollisionId:runner.events.find(e=>e.type==='moving-contact')?.id??null,
  failureReason:runner.failure?.reason??null,
  method:'INJECTED_CHECKPOINT_WITH_REAL_240HZ_FULL_WORLD_NOT_NORMAL_START00_OR_HUMAN'};
}
function contactEvidence(doc){
 const rotor=originalRotor(doc),snapshot=JSON.stringify(doc);
 const kernel=[1,-1].map(side=>kernelImpact(rotor,doc.surfaces[0],side));
 // Same AP geometry, only B51 collision response swapped; a controlled
 // counterfactual, not a published third stage or a new engine.
 const modes=['push','bounce'].map(mode=>{
  const trial=modeOnlyStage(doc,mode);
  return {counterfactualMode:mode,launches:[1,-1].map(side=>injectedRunner(trial,side))};
 });
 if(JSON.stringify(doc)!==snapshot)throw Error('AR changed actual stage source');
 return {rotorId:ID,originalActualCollision:rotor.collision??{mode:'fail'},
  phaseAtTimeZero:rotor.phase,actualPoseAtTimeZero:movingObstaclePose(rotor,0),
  kernel,modes,
  limitation:'KERNEL_IMPACT_NOT_A_NORMAL_DRIVE;_INJECTED_RUNNER_NOT_REACHABLE_FROM_START00'};
}
function baseline(doc,ticks){
 const r=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,r),
  surge=createA13SurgeState(),inputs=[];
 for(let k=0;k<ticks;k++){
  if(!['ready','running'].includes(r.status)){inputs.push(0);continue;}
  const input=clamp(p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8);
  inputs.push(input);
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
 }
 return {inputs,endedSeconds:fix(r.time),status:r.status};
}
function marginAt(doc,r){
 if((r.surface||r.lastSurface)!==doc.surfaces[0].id)return null;
 const u=Math.max(0,Math.min(1,p101RoadProgress(r).u)),
  left=sample(doc.surfaces[0],u,0),right=sample(doc.surfaces[0],u,1),
  edge=minus(right,left),width=Math.hypot(...edge);
 if(width<9)throw Error('AR real B48 cross section invalid');
 const v=dot(minus(r.p,left),edge)/(width*width);
 return {u,v,width,edgeMargin:Math.min(v,1-v)*width-RADIUS,
  lateralMeters:(v-.5)*width};
}
function reachablePulse(doc,inputs,pulse){
 const r=new Runner(doc,compile(doc),0,52),surge=createA13SurgeState();
 let firstNegative=null,minMargin=Infinity,atPulseEnd=null,offRoadSamples=0,
  physicalSamples=0,closestToShoulder=Infinity;
 for(let k=0;k<inputs.length&&['ready','running'].includes(r.status);k++){
  const t=k*DT,delta=t>=pulse.from&&t<pulse.to?pulse.delta:0;
  p101Step(r,clamp(inputs[k]+delta),'OVERDRIVE',{
   forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  if(k%12===0||!['ready','running'].includes(r.status)){
   const m=marginAt(doc,r);
   if(m){
    physicalSamples++;
    minMargin=Math.min(minMargin,m.edgeMargin);
    closestToShoulder=Math.min(closestToShoulder,Math.abs(m.edgeMargin));
    if(m.edgeMargin<0){offRoadSamples++;if(!firstNegative)firstNegative={seconds:fix(r.time),u:fix(m.u),edgeMarginMeters:fix(m.edgeMargin)};}
    if(t>=pulse.to&&atPulseEnd===null)atPulseEnd={seconds:fix(r.time),u:fix(m.u),lateralMeters:fix(m.lateralMeters),signedMarginMeters:fix(m.edgeMargin)};
   }
  }
 }
 return {id:pulse.id,delta:pulse.delta,windowSeconds:[pulse.from,pulse.to],
  actualPhysicsHz:240,sameAjBaselineInput:true,status:r.status,
  durationSeconds:fix(r.time),failureReason:r.failure?.reason??null,
  firstNegativeSignedMargin:firstNegative,minimumSampledSignedMarginMeters:fix(minMargin),
  offRoadSampleCount:offRoadSamples,roadSamples:physicalSamples,
  minimumAbsoluteShoulderMarginMeters:fix(closestToShoulder),atPulseEnd,
  actualMovingContactIds:r.events.filter(e=>e.type==='moving-contact').map(e=>e.id),
  limitation:'SAMPLED_EDGE_PROJECTION_NOT_A_PROOF_OF_AVAILABLE_LANE_OR_HUMAN_FAIRNESS'};
}
export function g4e7arEvidence({seconds=6.7}={}){
 if(!Number.isFinite(seconds)||seconds<5||seconds>8)throw Error('AR time bound invalid');
 const out=[];
 for(const road of AJ_ROADS){
  const aj=generateG4E7AJ(road,'reanchor'),ap=generateG4E7AP(road),
   frozenAJ=JSON.stringify(aj),frozenAP=JSON.stringify(ap);
  verify(aj,ap);
  const clock=baseline(aj,Math.round(seconds/DT));
  const results=[['AJ_REANCHOR',aj],['AP_TEMPORAL_SLALOM',ap]].map(([name,doc])=>({
   name,recordStageId:doc.stageForge.recordStageId,
   trueCollisionRotor:contactEvidence(doc),
   edgeReachability:PULSES.map(p=>reachablePulse(doc,clock.inputs,p))
  }));
  if(JSON.stringify(aj)!==frozenAJ||JSON.stringify(ap)!==frozenAP)
   throw Error('AR mutated original AJ/AP stage');
  out.push({road,baselineStatus:clock.status,baselineEndedSeconds:clock.endedSeconds,results});
 }
 return {schema:'dopagaki.g4e7ar-native-rotor-contact-road-edge-reachability/1',
  originalStartSpeedMps:52,actualPhysicsHz:1/DT,physicsRoads:7,movingB51:28,
  preservedOtherB51:26,contactMethod:'ACTUAL_OBB_SWEEP_AND_NATIVE_RUNNER_INJECTED_CHECKPOINT',
  realStart00ReachabilityMethod:'SAME_AJ_P96_SCRIPT_PLUS_FIXED_LR_240HZ_NONHUMAN',
  comparisons:out,formalSlope2Meters:0,humanQA:'HOLD',artQA:'HOLD',promote:'HOLD',publish:'HOLD'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const x=g4e7arEvidence();
 if(process.argv[2]){fs.mkdirSync(path.dirname(process.argv[2]),{recursive:true});
  fs.writeFileSync(process.argv[2],JSON.stringify(x,null,2)+'\n');}
 console.log('G4E7AR_RESULT '+JSON.stringify(x.comparisons.map(g=>({
  road:g.road,results:g.results.map(v=>({name:v.name,
   kernel:v.trueCollisionRotor.kernel.map(k=>({side:k.side,hit:k.hit,results:k.modes})),
   runner:v.trueCollisionRotor.modes.map(m=>({mode:m.counterfactualMode,
    contacts:m.launches.map(c=>({side:c.side,hit:c.physicalContactObserved,reverse:c.reverseAtActualRunnerContact,reason:c.failureReason}))})),
   edge:v.edgeReachability.map(p=>({id:p.id,status:p.status,time:p.durationSeconds,margin:p.minimumSampledSignedMarginMeters,reason:p.failureReason}))
  }))
 }))));
}
