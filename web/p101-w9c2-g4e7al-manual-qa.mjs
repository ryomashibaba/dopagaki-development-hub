/** G4E-7AL: voluntary real-keyboard local QA on genuine 7AJ reanchored B48.
 * Read-only instrumentation; no driver automation, persistence or upload.
 * QA browser scripts are NOT evidence of human playability.
 */
import {g4e7oReadRoad,observeG4E7OFrame} from './p101-w9c2-g4e7o-manual-qa.mjs';
const ids=['a13-machine-01','a13-machine-02'];
export const G4E7AL_ROADS=Object.freeze(['true-pinch','pinch-switch']);
const num=x=>Number.isFinite(x);
const round=(v,n=3)=>num(v)?Number(v.toFixed(n)):null;
export function createG4E7ALTrial(doc,runner){
 const aj=doc?.stageForge?.g4e7ajStudy,ah=doc?.stageForge?.g4e7ahStudy;
 if(!aj||aj.id!=='reanchor'||!G4E7AL_ROADS.includes(aj.road)||
    aj.originalMovingObjects!==28||aj.unchangedMovingObjects!==26||
    aj.reanchoredOriginalIds?.join(',')!==ids.join(',')||
    aj.publish!=='HOLD'||aj.certifiedSlope2Meters!==0||
    doc.stageForge.productionPromoted!==false||!ah?.realMissingLongitudinalCell52||
    ah.widthMinMeters<10||ah.widthMinMeters>13.5||
    doc.surfaces.length!==7||doc.movingObstacles.length!==28||
    doc.surfaces[0].voidLongitudinalCells?.join(',')!=='52'||
    runner.spawnIndex!==0||runner.startSpeed!==52||
    ids.some(id=>!doc.movingObstacles.some(o=>o.id===id)))
  throw Error('G4E7AL requires original start00 genuine reanchored 7AJ B48/B51');
 return {road:aj.road,stageId:doc.stageForge.recordStageId,
  steps:0,inputSteps:0,inputTransitions:[],previousInput:0,
  samples:[],lastSample:-Infinity,lastSupported:null,
  eventsSeen:0,contacts:[],peakMps:52,minRoadWidthM:Infinity,minEdgeM:Infinity,
  minSeparation:Object.fromEntries(ids.map(id=>[id,Infinity])),
  separationSamples:0,lastSeparation:[],lastSeparationAt:null,
  frame:{raf:[],rafFrames:0,physicsOverloadFrames:0,maxCameraHeadingLagDeg:0},
  stopped:null};
}
export function observeG4E7ALStep(t,doc,runner,steer,surfaceSample,radius,movingObstaclePose,sphereBoxSeparation){
 if(!t||![-1,0,1].includes(steer)||typeof movingObstaclePose!=='function'||typeof sphereBoxSeparation!=='function')throw Error('G4E7AL requires unassisted physical A/D direction');
 t.steps++;if(steer)t.inputSteps++;
 if(steer!==t.previousInput){
  t.previousInput=steer;
  if(t.inputTransitions.length<3000)t.inputTransitions.push({t:round(runner.time,5),steer});
 }
 t.peakMps=Math.max(t.peakMps,Math.hypot(...runner.v));
 const road=g4e7oReadRoad(doc,runner,surfaceSample,radius);
 if(road){
  t.minRoadWidthM=Math.min(t.minRoadWidthM,road.widthMeters);
  t.minEdgeM=Math.min(t.minEdgeM,road.signedEdgeMarginMeters);
 }
 if(runner.grounded&&runner.surface)t.lastSupported={
  timeSeconds:round(runner.time,5),roadId:runner.surface,
  position:runner.p.map(n=>round(n)),speedMps:round(Math.hypot(...runner.v))};
 // Auxiliary clearance sampling at <=20Hz, not a collider or native contact test.
 // Actual moving-contact CCD and physics still execute at 240Hz in Runner.
 // Avoid revalidating B51-C descriptors 480x/second while benchmarking FPS.
 if(t.steps===1||t.steps%12===0||['failed','finished'].includes(runner.status)){
  const poses=ids.map(id=>movingObstaclePose(doc.movingObstacles.find(o=>o.id===id),runner.time));
  t.lastSeparation=poses.map(p=>({id:p.id,
   meters:round(sphereBoxSeparation(runner.p,radius,p).separation)}));
  t.lastSeparationAt=runner.time;t.separationSamples++;
  for(const p of t.lastSeparation)if(num(p.meters))
   t.minSeparation[p.id]=Math.min(t.minSeparation[p.id],p.meters);
 }
 const separation=t.lastSeparation;
 for(const e of runner.events.slice(t.eventsSeen))if(e.type==='moving-contact'||
   e.type==='static-fatal-contact'||e.type==='failure')t.contacts.push({
  type:e.type,id:e.id??null,mode:e.mode??null,timeSeconds:round(e.t??runner.time,5)});
 t.eventsSeen=runner.events.length;
 if((runner.time-t.lastSample>=.1||['failed','finished'].includes(runner.status))&&t.samples.length<1200){
  t.lastSample=runner.time;
  t.samples.push({seconds:round(runner.time,4),steer,position:runner.p.map(n=>round(n)),
   speedMps:round(Math.hypot(...runner.v)),grounded:runner.grounded,
   roadId:runner.surface||runner.lastSurface,road,separation,
   separationSampleSeconds:round(t.lastSeparationAt,4),status:runner.status});
 }
 if(['failed','finished'].includes(runner.status)&&!t.stopped)t.stopped={
  seconds:round(runner.time,5),reason:runner.failure?.reason??null,
  lastSupported:t.lastSupported,
  unsupportedSeconds:t.lastSupported?round(runner.time-t.lastSupported.timeSeconds,5):null};
}
export function observeG4E7ALFrame(t,elapsed,headingRadians,overloaded=false){
 if(!t)return;
 observeG4E7OFrame(t.frame,elapsed,headingRadians,overloaded);
}
function q(sorted,f){return sorted.length?sorted[Math.floor((sorted.length-1)*f)]:null;}
export function exportG4E7ALTrial(t,runner,{noticed='unsure',fairness='unsure',enjoyment=null,note=''}={}){
 if(!t||!runner||!['yes','no','unsure'].includes(noticed)||
  !['yes','no','unsure'].includes(fairness)||
  (enjoyment!==null&&(!Number.isInteger(enjoyment)||enjoyment<1||enjoyment>5))||
  typeof note!=='string')throw Error('G4E7AL invalid voluntary feedback');
 const ordered=[...t.frame.raf].sort((a,b)=>a-b),
  middle=q(ordered,.5),slow=q(ordered,.9);
 return {schema:'dopagaki.w9c2.g4e7al-reanchor-manual/1',
  road:t.road,stageId:t.stageId,source:'LOCAL_MANUAL_INPUT_NO_P96',
  comparisonPhysicsHz:240,originalStart00:runner.spawnIndex===0,
  startSpeedMps:runner.startSpeed,
  physicalCourse:{realB48Surfaces:7,realMovingB51:28,reanchoredOriginalB51:2,
   unchangedOriginalB51:26,gapCell52:true},
  status:['failed','finished'].includes(runner.status)?runner.status:'INTERRUPTED_NOT_A_CLEAR',
  seconds:round(runner.time,5),
  failure:runner.failure?{...runner.failure}:null,
  lastSupported:t.lastSupported,stopped:t.stopped,
  metrics:{physicsSteps:t.steps,activeDirectionalSteps:t.inputSteps,
   peakSpeedMps:round(t.peakMps),
   minPhysicalRoadWidthMeters:round(t.minRoadWidthM),
   minSignedRoadEdgeMarginMeters:round(t.minEdgeM),
   minimumBallBoxSeparationMeters:Object.fromEntries(Object.entries(t.minSeparation).map(([id,v])=>[id,round(v)])),
   movingSeparationSamples:t.separationSamples,movingSeparationSamplingHz:20,
   movingSeparationNotContinuousCCD:true,
   movingContacts:t.contacts.filter(e=>e.type==='moving-contact').length},
  sampledPhysicalSteps:t.samples,steerTransitions:t.inputTransitions,contacts:t.contacts,
  render:{rafFrames:t.frame.rafFrames,
   medianRafFps:middle?round(1/middle,1):null,
   p10RafFps:slow?round(1/slow,1):null,
   physicsOverloadedFrames:t.frame.physicsOverloadFrames,
   maximumHeadingLagDegrees:round(t.frame.maxCameraHeadingLagDeg)},
  voluntaryReport:{hazardRecognizedBeforeApproach:noticed,avoidableByAorD:fairness,
   enjoymentOneToFive:enjoyment,note:note.slice(0,450),notEyeTracking:true},
  automatedBrowserCanOnlyVerifyUI:true,actualHumanRunNotAutomaticallyProven:true,
  automatedUpload:false,normalGameLeaderboardWrites:false,
  certifiedSlope2Meters:0,humanFairness:'HOLD',artQuality:'HOLD',publish:'HOLD'};
}
export function newG4E7ALSession(){return {schema:'dopagaki.w9c2.g4e7al-paired-manual/1',
 index:0,runs:[],restartedAttempts:[],olderAttemptsDropped:0};}
/** Preserve unsaved in-memory retries without writing storage or contacting a server.
 * A bounded queue avoids unbounded state; after 12 the oldest is explicitly counted.
 */
export function archiveG4E7ALRetry(session,report){
 if(!session||!Array.isArray(session.restartedAttempts)||
   !report||report.road!==G4E7AL_ROADS[session.index]||
   report.certifiedSlope2Meters!==0||report.humanFairness!=='HOLD'||
   report.normalGameLeaderboardWrites!==false)
  throw Error('G4E7AL retry provenance/HOLD mismatch');
 if(session.restartedAttempts.length===12){session.restartedAttempts.shift();session.olderAttemptsDropped++;}
 session.restartedAttempts.push({...report,restartedBeforeNextRun:true});
 return session.restartedAttempts.length;
}
export function appendG4E7ALTrial(session,report){
 if(!session||session.index>=G4E7AL_ROADS.length||
  report?.road!==G4E7AL_ROADS[session.index]||report?.certifiedSlope2Meters!==0||
  report?.humanFairness!=='HOLD'||report?.normalGameLeaderboardWrites!==false)
  throw Error('G4E7AL pair provenance/order invalid');
 session.runs.push(report);session.index++;return session.index;
}
export function exportG4E7ALSession(session){
 if(!session||!Array.isArray(session.runs))throw Error('G4E7AL missing in-memory session');
 return {schema:session.schema,index:session.index,runs:session.runs,
  restartedAttempts:session.restartedAttempts,olderAttemptsDropped:session.olderAttemptsDropped,
  completedBoth:session.index===2,automaticallySubmitted:false,
  normalGameLeaderboardWrites:false,realHumanTrial:'UNVERIFIED_UNTIL_ACTUAL_USER_PLAY',
  humanFairness:'HOLD',artQuality:'HOLD',certifiedSlope2Meters:0,publish:'HOLD'};
}
