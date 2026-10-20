/**
 * A11 local, opt-in human-manual evaluation data. Read-only observational
 * samples; NEVER passed into B48 Runner, B51-C obstacle pose, p101Step,
 * camera or survival scoring.
 *
 * No network transmission, no credentials/device identifiers, no recording
 * of keyboard text; JSON is exported only via explicit user interaction.
 */
export const B5_MANUAL_SCHEMA='dopagaki.b5-manual-qa/1';
export const A13_MANUAL_SCHEMA='dopagaki.a13-manual-qa/1';
const validAudit=a=>Boolean(a&&(a.schema===B5_MANUAL_SCHEMA||a.schema===A13_MANUAL_SCHEMA));
const isW9C1=a=>Boolean(a&&['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA'].includes(a.stageId));
const number=n=>typeof n==='number'&&Number.isFinite(n);
const rounded=(n,d=2)=>Number(n.toFixed(d));
const quantile=(sorted,q)=>sorted.length?sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*q))]:null;
// G5-A: bounded, allowlisted, observational collision records for W9-C1 only.
const G5_COLLISION_TYPES=new Set(['moving-contact','static-fatal-contact','moving-crush','air','contact','rebound-recovery-start','rebound-recovery-end']);
const g5Vector=v=>Array.isArray(v)&&v.length===3&&v.every(number)?v.map(n=>rounded(n,4)):null;
const g5Scalar=n=>number(n)?rounded(n,4):null;
const g5Text=s=>typeof s==='string'?s.slice(0,80):null;
function g5DiagnosticEvent(e){
 return {type:e.type,timeSeconds:g5Scalar(e.t),obstacleId:g5Text(e.id),
  obstacleType:g5Text(e.obstacleType),mode:g5Text(e.mode),
  surface:g5Text(e.surface),part:g5Text(e.part),position:g5Vector(e.position),
  normal:g5Vector(e.normal),velocityBefore:g5Vector(e.velocityBefore),
  velocityAfter:g5Vector(e.velocityAfter),forwardAxis:g5Vector(e.forward),
  forwardBeforeMps:g5Scalar(e.forwardBeforeMps),forwardAfterMps:g5Scalar(e.forwardAfterMps),
  inwardNormalMps:g5Scalar(e.inwardNormalMps),
  surfaceVelocity:g5Vector(e.surfaceVelocity),deltaVelocity:g5Vector(e.deltaVelocity),
  recoveryReason:g5Text(e.reason),peakAppliedAccelMps2:g5Scalar(e.peakAppliedAccelMps2),
  crushIds:Array.isArray(e.ids)?e.ids.slice(0,8).map(g5Text):null};
}
// A12: 0.25ms animation-frame duration histogram, bounded memory, no game physics coupling.
// The 90th percentile frame duration corresponds to the ~10th percentile frame FPS.
const frameDurationBin=(bins,count,q)=>{
 if(!count)return null;
 const rank=Math.floor((count-1)*q);
 let cumulative=0;
 for(let i=1;i<bins.length;i++){cumulative+=bins[i];if(cumulative>rank)return i;}
 return null;
};
export function createB5ManualAudit({stageId,profile='OVERDRIVE',startSpeed=52,spawnIndex=0}={}){
 if(!['VB-P101-B5','VB-P101-A13','VB-P101-A13-W7F','VB-P101-A13-W9X-B1','VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA','VB-P101-A13-W9C2-RIBBON','VB-P101-A13-W9C2-EDGE','VB-P101-A13-W9C2-G4E-SHOULDER','VB-P101-A13-W9C2-G4E-RAZOR','VB-P101-A13-W9C2-G4E6-C0-55-1','VB-P101-A13-W9C2-G4E6-B0-65-1'].includes(stageId)||!['OVERDRIVE','RAPID','HYPER'].includes(profile)||
    !number(startSpeed)||startSpeed<1||startSpeed>200||
    !Number.isInteger(spawnIndex)||spawnIndex<0)throw Error('Manual audit must use allowlisted actual A13/B5 stage and valid controls');
 return {
  schema:stageId.startsWith('VB-P101-A13')?A13_MANUAL_SCHEMA:B5_MANUAL_SCHEMA,stageId,profile,startSpeed,spawnIndex,
  source:'ACTUAL_MANUAL_BROWSER_RUN_NOT_SCRIPTED_NOT_HUMAN_FAIRNESS_CERTIFIED',
  samples:[],maxSpeed:startSpeed,inputs:{leftSamples:0,rightSamples:0,neutralSamples:0},
  hazards:{visibleSamples:0,immediateSamples:0,steeringWhileVisibleSamples:0},
  performance:{slowFrames:0,measuredFrames:0,physicsOverloadedFrames:0,frameMsBins:new Uint32Array(4001)},firstContactTime:null,
  // G4: sampling is observational only. It never claims the user saw a cue.
  w9c1Observed:stageId.includes('W9C1-')?{
   firstHudApproachSeconds:null,firstHudCoreSeconds:null,firstHudCoreSpeedMps:null,lastHudExitSeconds:null,
   approachUpdates:0,coreUpdates:0,exitUpdates:0
  }:null,
  final:null,lastSampleAt:-Infinity
 };
}
export function recordB5ManualFrame(a,seconds,{physicsOverloaded=false}={}){
 if(!a||!validAudit(a)||a.final)return false;
 if(!number(seconds)||seconds<=0||seconds>1)return false;
 a.performance.measuredFrames++;
 if(seconds>1/30)a.performance.slowFrames++;
 if(physicsOverloaded)a.performance.physicsOverloadedFrames++;
 // Real animation-frame spacing (wall time), never simulated 240Hz time.
 const bin=Math.max(1,Math.min(4000,Math.round(seconds*4000)));
 a.performance.frameMsBins[bin]++;
 return true;
}
export function recordB5ManualSample(a,x){
 if(!a||!validAudit(a)||a.final)return false;
 if(!x||![x.time,x.speed,x.fps,x.frameDelta].every(number)||
    x.time<0||x.speed<0||x.fps<0||x.frameDelta<0||x.frameDelta>2||
    ![-1,0,1].includes(x.input))throw Error('A11 requires finite legitimate browser sample');
 if(x.time<a.lastSampleAt)return false;
 if(x.time-a.lastSampleAt<.48)return false; // cap data volume, ~2Hz
 if(a.samples.length>=300)return false;
 a.lastSampleAt=x.time;
 const sample={time:rounded(x.time),speed:rounded(x.speed),fps:rounded(x.fps),
   frameDeltaMs:rounded(x.frameDelta*1000),input:x.input,
   surface:typeof x.surface==='string'?x.surface.slice(0,80):null,
   grounded:Boolean(x.grounded),hazard:typeof x.hazard==='string'?x.hazard.slice(0,32):'none',
   urgency:['none','advance','approaching','immediate'].includes(x.urgency)?x.urgency:'none',
   edge:x.edge==='clear'||x.edge==='safe'?'safe':['caution','danger'].includes(x.edge)?x.edge:'unavailable'};
 // Read-only HUD telemetry for W9-C1; never used as steering or physics feedback.
 if(a.stageId.endsWith('W9C1-CONTROL')||a.stageId.endsWith('W9C1-ULTRA')){
  sample.w9c1NoticePhase=['approach','core','exit'].includes(x.w9c1NoticePhase)?x.w9c1NoticePhase:'none';
  sample.w9c1EtaAtCurrentSpeedSeconds=number(x.w9c1NoticeEtaSeconds)&&x.w9c1NoticeEtaSeconds>=0
   ?rounded(x.w9c1NoticeEtaSeconds):null;
  sample.w9c1NominalRoadMeters=number(x.w9c1NoticeNominalMeters)&&x.w9c1NoticeNominalMeters>=0
   ?rounded(x.w9c1NoticeNominalMeters):null;
 }
 a.samples.push(sample);
 a.maxSpeed=Math.max(a.maxSpeed,x.speed);
 if(x.input<0)a.inputs.leftSamples++;
 else if(x.input>0)a.inputs.rightSamples++;
 else a.inputs.neutralSamples++;
 if(sample.hazard!=='none'){
  a.hazards.visibleSamples++;
  if(sample.urgency==='immediate')a.hazards.immediateSamples++;
  if(sample.input!==0)a.hazards.steeringWhileVisibleSamples++;
 }
 return true;
}
export function observeW9C1ManualCue(a,cue,physicsSeconds){
 if(!isW9C1(a)||!validAudit(a)||a.final||!number(physicsSeconds)||physicsSeconds<0)return false;
 if(!cue||!['approach','core','exit'].includes(cue.phase))return false;
 const obj=a.w9c1Observed,phase=cue.phase;
 obj[phase+'Updates']++;
 if(phase==='approach'&&obj.firstHudApproachSeconds===null)obj.firstHudApproachSeconds=rounded(physicsSeconds,3);
 if(phase==='core'&&obj.firstHudCoreSeconds===null){
  obj.firstHudCoreSeconds=rounded(physicsSeconds,3);
  if(number(cue.speedMps)&&cue.speedMps>=0)obj.firstHudCoreSpeedMps=rounded(cue.speedMps);
 }
 if(phase==='exit')obj.lastHudExitSeconds=rounded(physicsSeconds,3);
 return true;
}
export function finalizeB5ManualAudit(a,{status,time,surface=null,contacts=0,nearMisses=0,failure=null,collisionEvents=[]}={}){
 if(!a||!validAudit(a))throw Error('Invalid B5 observation');
 if(a.final)return a.final;
 if(!['failed','finished','interrupted'].includes(status)||!number(time)||time<0||
  !Number.isInteger(contacts)||contacts<0||!Number.isInteger(nearMisses)||nearMisses<0)
  throw Error('B5 audit needs exact native physics outcome');
 const fps=a.samples.map(x=>x.fps).filter(x=>x>0).sort((x,y)=>x-y);
 const inputCount=a.samples.length;
 const frameCount=a.performance.measuredFrames;
 const p90FrameBin=frameDurationBin(a.performance.frameMsBins,frameCount,.9);
 const medianFrameBin=frameDurationBin(a.performance.frameMsBins,frameCount,.5);
 a.final={
  status,physicsSeconds:rounded(time,3),
  fullCourseCompletionFromStart00:status==='finished'&&a.spawnIndex===0,
  lastSurface:typeof surface==='string'?surface.slice(0,80):null,
  contacts,nearMisses,failureReason:typeof failure==='string'?failure.slice(0,120):null,
  peakSpeedMps:rounded(a.maxSpeed),framesSampled:inputCount,
  fpsP10:quantile(fps,.1),fpsMedian:quantile(fps,.5),
  // A11 snapshot FPS (above) is ~2Hz; below values use every visible running animation frame.
  renderFrameFpsP10:p90FrameBin?rounded(4000/p90FrameBin):null,
  renderFrameFpsMedian:medianFrameBin?rounded(4000/medianFrameBin):null,
  renderFrameTiming:'REAL_RAF_INTERVAL_0_25MS_BINS_NOT_240HZ_PHYSICS_PROOF',
  physicsOverloadedAnimationFrames:a.performance.physicsOverloadedFrames,
  physicsOverloadedFrameShare:frameCount?
   rounded(a.performance.physicsOverloadedFrames/frameCount,3):null,
  fpsSlowFrameSampleShare:a.performance.measuredFrames?
   rounded(a.performance.slowFrames/a.performance.measuredFrames,3):null,
  observedSteeringFraction:inputCount?rounded((a.inputs.leftSamples+a.inputs.rightSamples)/inputCount,3):null,
  hazardVisibleSamples:a.hazards.visibleSamples,
  steeringWhileHazardVisibleSamples:a.hazards.steeringWhileVisibleSamples,
  warningAssessment:'VISIBILITY_SAMPLES_ONLY_NOT_REACTION_TIME_OR_FAIRNESS_PROOF',
  renderFpsIsNotPhysicsHz:true,physicsHz:240
 };
 // Only actual emitted recovery events enter the voluntary local JSON.
 // No machine has been hit merely because the option was enabled.
 if(Array.isArray(collisionEvents)){
  const rebound=collisionEvents.filter(e=>e&&
   ['rebound-recovery-start','rebound-recovery-end'].includes(e.type)&&number(e.t));
  if(rebound.length)a.final.nonlethalReboundRecovery={
   schema:'dopagaki.nonlethal-rebound-recovery/1',
   observedEvents:rebound.slice(-24).map(g5DiagnosticEvent),
   truncated:rebound.length>24,automaticFairnessApproval:false
  };
 }
 if(isW9C1(a)){
  const h=a.w9c1Observed;
  a.final.w9c1G4Telemetry={
   ...h,
   observedHudLeadSeconds:h.firstHudApproachSeconds!==null&&h.firstHudCoreSeconds!==null
    ?rounded(Math.max(0,h.firstHudCoreSeconds-h.firstHudApproachSeconds),3):null,
   sampling:'HUD_STATE_AT_RENDER_INTERVAL; NOT USER_EYE_TRACKING; NOT HUMAN_REACTION_TIME',
   fairnessCertified:false
  };
  const selected=Array.isArray(collisionEvents)
   ?collisionEvents.filter(e=>e&&G5_COLLISION_TYPES.has(e.type)&&number(e.t)): [];
  a.final.w9c1G5Diagnostics={
   version:'W9-C1-G5-A-READONLY/1',
   matchingEventCount:selected.length,truncated:selected.length>64,
   events:selected.slice(-64).map(g5DiagnosticEvent),
   note:'Only observed physics events. A collision chain or human fairness is not proven by this trace.'
  };
 }
 return a.final;
}
export function exportB5ManualAudit(a,{speedFeel=null,steeringFeel=null,hazardLegibility=null,note='',w9c1Feedback=null,snapshot=null}={}){
 if(!a||!validAudit(a))throw Error('B5 audit not initialized');
 for(const [name,v] of Object.entries({speedFeel,steeringFeel,hazardLegibility}))
  if(v!==null&&(!Number.isInteger(v)||v<1||v>5))throw Error('Invalid voluntary player rating: '+name);
 if(typeof note!=='string')throw Error('Player note must be text');
 // Explicitly exporting an in-progress run produces a truthful observation
 // endpoint without mutating the ongoing audit or terminating real physics.
 let observedSnapshot=null;
 if(!a.final&&snapshot!==null){
  if(!snapshot||!number(snapshot.time)||snapshot.time<0||
     !Number.isInteger(snapshot.contacts)||snapshot.contacts<0||
     !Number.isInteger(snapshot.nearMisses)||snapshot.nearMisses<0)
    throw Error('G5-C3 live snapshot requires observed time and collision counts');
  observedSnapshot=finalizeB5ManualAudit({...a,final:null},{
   status:'interrupted',time:snapshot.time,surface:snapshot.surface??null,
   contacts:snapshot.contacts,nearMisses:snapshot.nearMisses,
   failure:null,collisionEvents:snapshot.collisionEvents??[]
  });
 }
 // No local storage keys, absolute file paths, user agent or identifying details.
 const result={schema:a.schema,stageId:a.stageId,profile:a.profile,
  startSpeed:a.startSpeed,spawnIndex:a.spawnIndex,source:a.source,
  survey:{speedFeel,steeringFeel,hazardLegibility,note:note.slice(0,900)},
  captureStatus:a.final?'TERMINAL_OBSERVATION':observedSnapshot?'RUNNING_SNAPSHOT_NOT_TERMINAL':'UNFINALIZED_NO_SNAPSHOT',
  summary:a.final??observedSnapshot,samples:a.samples.map(x=>({...x}))};
 if(isW9C1(a)){
  const fb=w9c1Feedback??{};
  const ratings=['warningSeenEarly','edgeReadability','failureFairness'];
  for(const key of ratings){
   const value=fb[key]??null;
   if(value!==null&&(!Number.isInteger(value)||value<1||value>5))throw Error('Invalid G4 rating '+key);
  }
  const causes=['unrated','no-failure','own-input','late-warning','edge-unreadable','steering-insufficient','machine','other'];
  const failureAttribution=fb.failureAttribution??'unrated';
  if(!causes.includes(failureAttribution))throw Error('Invalid G4 failure attribution');
  result.w9c1G4={
   version:'W9-C1-G4-HUMAN-SURVEY/1',
   selfReport:{
    warningSeenEarly:fb.warningSeenEarly??null,
    edgeReadability:fb.edgeReadability??null,
    failureFairness:fb.failureFairness??null,
    failureAttribution
   },
   observedHud:a.w9c1Observed?{...a.w9c1Observed}:null,
   // A start-00 selection does not prove this run survived to the narrow core.
   fullStartSpawnSelected:a.spawnIndex===0,
   observedCoreSpeedMps:a.w9c1Observed?.firstHudCoreSpeedMps??null,
   actualEntrySpeedProven:a.spawnIndex===0&&number(a.w9c1Observed?.firstHudCoreSpeedMps),
   humanApproval:'HOLD_NO_AUTOMATIC_PASS',
   note:'Ratings require an actual person. Missing ratings are NOT a passing score.'
  };
 }else if(w9c1Feedback!==null){
  throw Error('G4 feedback is exclusive to W9-C1');
 }
 return JSON.stringify(result,null,2)+'\n';
}
