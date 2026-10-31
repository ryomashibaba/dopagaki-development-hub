/**
 * W9-C2 G4E-7D / strictly LOCAL, voluntary HUMAN manual QA.
 * Only observes original B48 physics and native camera/render frames.
 * No fake gap, replay autopilot, steering aid, positional jump, data upload,
 * user-agent/device identifiers, localStorage writes, or human PASS claim.
 */
import {p101RoadProgress} from './p101-overdrive.mjs';

export const G4E7D_PROTOCOL=Object.freeze([
 Object.freeze({id:'C0-55-1',cue:false}),
 Object.freeze({id:'C0-55-1',cue:true}),
 Object.freeze({id:'B0-65-1',cue:false}),
 Object.freeze({id:'B0-65-1',cue:true})
]);
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const round=(n,p=3)=>finite(n)?Number(n.toFixed(p)):null;
const validVisibility=new Set(['yes','no','unsure']);
function check(stage,r,choice){
 const g=stage?.stageForge?.g4e6EarlyGap;
 if(!g||g.id!==choice?.id||!['C0-55-1','B0-65-1'].includes(g.id)||
   stage.stageForge.recordStageId!=='VB-P101-A13-W9C2-G4E6-'+g.id||
   stage.stageForge.productionPromoted!==false||!g.actualOpenB48Collision||
   !g.noMidpointRideableSupport||stage.surfaces?.length!==7||
   stage.movingObstacles?.length!==28||stage.surfaces[g.section]?.id!==g.surfaceId||
   r.spawnIndex!==0||r.startSpeed!==52)
   throw Error('G4E7D human QA requires untouched private original B48 start00 and 28 machines');
 return g;
}
export function createG4E7DTrial(stage,runner,choice){
 if(!choice||typeof choice.cue!=='boolean')throw Error('G4E7D explicit comparison choice required');
 const gap=check(stage,runner,choice);
 return {id:choice.id,cue:choice.cue,gap,steps:0,armed:false,air:false,
  landingTicks:0,landed:false,firstApproachAt:null,firstAirAt:null,
  firstLandingAt:null,samples:[],lastSampleAt:-Infinity,
  frameDurations:[],frameCount:0,physicsOverloads:0,maxSpeed:52,
  peakCameraHeadingLagDeg:0,steerTicks:0};
}
export function observeG4E7DStep(qa,runner,steer){
 if(!qa||runner.status==='ready')return;
 const g=qa.gap,progress=p101RoadProgress(runner);
 const sameOriginalRoad=progress.section===g.section&&
  (runner.surface||runner.lastSurface)===g.surfaceId;
 const u=progress.u,speed=Math.hypot(...runner.v);
 qa.steps++;qa.maxSpeed=Math.max(qa.maxSpeed,speed);
 if(steer!==0)qa.steerTicks++;
 if(!qa.armed&&sameOriginalRoad&&runner.grounded&&
   u>=g.uTakeoff-.035&&u<=g.uTakeoff+.003){
  qa.armed=true;qa.firstApproachAt=runner.time;
 }
 const distanceToTakeoff=Math.hypot(...runner.p.map((v,i)=>v-g.takeoffXYZ[i]));
 if(qa.armed&&!qa.air&&!runner.grounded&&distanceToTakeoff<220){
  qa.air=true;qa.firstAirAt=runner.time;
 }
 if(qa.air&&sameOriginalRoad&&runner.grounded&&runner.surface===g.surfaceId&&
  u>=g.uLanding+.006){
  qa.landingTicks++;
  if(qa.landingTicks>=18&&!qa.landed){
   qa.landed=true;qa.firstLandingAt=runner.time;
  }
 }else if(!qa.landed)qa.landingTicks=0;
 if(runner.time-qa.lastSampleAt>=.45&&qa.samples.length<280){
  qa.lastSampleAt=runner.time;
  qa.samples.push({t:round(runner.time),u:sameOriginalRoad?round(u,5):null,
   grounded:Boolean(runner.grounded),speedMps:round(speed,2),
   input:Math.max(-1,Math.min(1,Math.sign(steer))),
   surface:typeof runner.surface==='string'?runner.surface:null});
 }
}
export function observeG4E7DFrame(qa,deltaSeconds,headingLagRadians,physicsOverloaded=false){
 if(!qa||!finite(deltaSeconds)||deltaSeconds<=0||deltaSeconds>1)return;
 qa.frameCount++;if(physicsOverloaded)qa.physicsOverloads++;
 if(qa.frameDurations.length<28000)qa.frameDurations.push(deltaSeconds);
 if(finite(headingLagRadians)){
  qa.peakCameraHeadingLagDeg=Math.max(qa.peakCameraHeadingLagDeg,
    headingLagRadians*180/Math.PI);
 }
}
function percent(sorted,quantile){
 if(!sorted.length)return null;
 return sorted[Math.floor((sorted.length-1)*quantile)];
}
export function exportG4E7DTrial(qa,runner,{visibility='unsure',rating=null,note=''}={}){
 if(!qa||!runner||!validVisibility.has(visibility)||
  (rating!==null&&(!Number.isInteger(rating)||rating<1||rating>5))||
  typeof note!=='string')throw Error('G4E7D voluntary human feedback invalid');
 const duration=qa.frameDurations.slice().sort((a,b)=>a-b);
 const tenth=percent(duration,.9),median=percent(duration,.5);
 return {
  schema:'dopagaki.w9c2.g4e7d-human-manual/1',candidateId:qa.id,
  nonCollisionCue:qa.cue?'ON':'OFF',input:'HUMAN_KEYBOARD_OR_TOUCH_NOT_P96',
  realB48Physics:true,fullOriginalRoads:7,movingMachines:28,spawnIndex:runner.spawnIndex,
  initialSpeedMps:runner.startSpeed,
  status:runner.status==='failed'||runner.status==='finished'?
   runner.status:'RUNNING_SNAPSHOT_NOT_TERMINAL',
  recordedTimeSeconds:round(runner.time),
  physics:{armedNearActualGap:qa.armed,firstApproachSeconds:round(qa.firstApproachAt),
   observedAirAfterArm:qa.air,airAtSeconds:round(qa.firstAirAt),
   observedOriginalRoadLanding18Ticks:qa.landed,
   landingAtSeconds:round(qa.firstLandingAt),
   lastFailureReason:runner.failure?.reason||null,
   maxSpeedMps:round(qa.maxSpeed,2),steeringInputTicks:qa.steerTicks,
   physicsStepsObserved:qa.steps},
  render:{frameCount:qa.frameCount,
   realRafFpsMedian:median?round(1/median,1):null,
   realRafFpsP10:tenth?round(1/tenth,1):null,
   physicsOverloadedFrames:qa.physicsOverloads,
   peakHeadingLagDegrees:round(qa.peakCameraHeadingLagDeg,2),
   deviceFpsIsNot240Hz:true},
  voluntaryHumanReport:{gapVisibleAtLeastTwoSecondsBeforeTakeoff:visibility,
   enjoymentOneToFive:rating,note:note.slice(0,450),
   'twoSecondVisibilityIsSelfReportNotEyeTracking':true},
  samples:qa.samples.slice(),fairnessCertified:false,
  approvedSlopeDnaMeters:0,privateOnly:true,automaticSubmission:false
 };
}
export function createG4E7DSession(){return {schema:'dopagaki.w9c2.g4e7d-paired-manual/1',index:0,runs:[]};}
export function completeG4E7DSession(session,trial){
 if(!session||session.index>=G4E7D_PROTOCOL.length||!trial||
  trial.candidateId!==G4E7D_PROTOCOL[session.index].id||
  trial.nonCollisionCue!==(G4E7D_PROTOCOL[session.index].cue?'ON':'OFF'))
  throw Error('G4E7D paired experiment sequence mismatch');
 session.runs.push(trial);session.index++;return session.index;
}
export function exportG4E7DSession(session){
 if(!session||!Array.isArray(session.runs))throw Error('G4E7D session missing');
 return JSON.stringify({
  schema:session.schema,completedPairs:session.index===G4E7D_PROTOCOL.length,
  completedTrials:session.runs.length,
  designedComparisons:'C0 OFF/ON then B0 OFF/ON, human steering differs across trials',
  identicalPhysicsAndSpawnButNotMatchedHumanInputs:true,
  hardwareFpsOnlyWhenActuallyRunOnUserDevice:true,
  humanFairness:'HOLD_UNTIL_INDEPENDENT_REVIEW',
  publish:'HOLD',approvedSlopeDnaMeters:0,
  runs:session.runs
 },null,2)+'\n';
}
