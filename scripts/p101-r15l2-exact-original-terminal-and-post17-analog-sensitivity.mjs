/**
 * R15L2: causality of ORIGINAL P96 fixed-script 19s failure; three isolated
 * after-17-second analog input variations only, not a gameplay/physics patch.
 * Preserve exact original R15L source-native snapshots through t17.0.
 * Failure reason is read directly from untouched Runner.failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';

const SRC='af076d67492a677d2235e4730aef8cdf4808e106';
const ROAD_NAMES=['true-pinch','pinch-switch'];
const VARIANTS=[['ORIGINAL',0],['AFTER17_LEFT_ANALOG_MINUS_0P35',-.35],['AFTER17_RIGHT_ANALOG_PLUS_0P35',.35]];
const r6=x=>Number(x.toFixed(6));
const maxVecDiff=(a,b)=>Math.max(...a.map((z,i)=>Math.abs(z-b[i])));
const roundPos=p=>p.map(r6);
function runSourceVariant(road,scenario,delta,ref){
 const doc=generateG4E7BC(road,'rollDeck');
 const before=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.equal(doc.stageForge.productionPromoted,false);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 const r=new Runner(doc,compile(doc),0,52);
 const plan=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
 let cam=createCameraState(r.forward),lastGroundTime=0,firstAfter17AirTime=null;
 let capturedR1At17=null;
 const endAt=24;
 const samples=[];
 for(let tick=1;tick<=Math.round(endAt/DT);tick++){
  if(r.status==='failed'||r.status==='finished')break;
  const original=p96DodgeSteer(r,plan,'early-soft',movingObstaclePose).input/4.8;
  // Original through 17.0 inclusive; trial only changes the input for t>17.
  const input=Math.max(-1,Math.min(1,original+(tick*DT>17+1e-7?delta:0)));
  p101Step(r,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  cam=advanceCamera(cam,r.forward,DT);
  if(r.grounded&&r.surface)lastGroundTime=r.time;
  if(r.time>17&&(!r.grounded||!r.surface)&&firstAfter17AirTime===null)firstAfter17AirTime=r.time;
  if(tick===Math.round(17/DT)){
   const pose=capturePose(r),view=viewForPose(pose,cam);
   const old=ref.originalFullTimelineFrames.find(x=>x.id==='t1700');
   assert.ok(old&&old.tick===tick);
   assert.ok(maxVecDiff(pose.position,old.playerPosition)<.00001);
   assert.ok(maxVecDiff(view.eye,old.eye)<.00001);
   assert.ok(maxVecDiff(view.front,old.front)<.00001);
   assert.equal(r.surface||r.lastSurface,old.physicalRoad);
   capturedR1At17={tick,
     original17CameraAndPhysicsPositionParity:true,
     originalStatusAt17:r.status,
     originalRoad:r.surface||r.lastSurface,
     playerPosition:roundPos(pose.position),
     originalSourceEye:roundPos(view.eye),
     originalSpeedMps:r6(Math.hypot(...r.v))};
  }
  if(tick>=Math.round(16/DT)&&(tick%60===0||r.status==='failed'||r.status==='finished')){
   samples.push({tick,seconds:r6(r.time),grounded:r.grounded,
     road:r.surface||r.lastSurface,
     airTimeSeconds:r6(r.airTime),
     position:roundPos(r.p),
     speedMps:r6(Math.hypot(...r.v)),
     collisions:r.collisions,actualUserAnalogScenarioInput:r6(input),
     runnerStatus:r.status});
  }
 }
 assert.ok(capturedR1At17);
 assert.equal(JSON.stringify(doc),before);
 assert.ok(r.time<=24.01);
 const outcome={
  sourceRoad:road,scenario,post17InputDelta:delta,
  exactOriginalCameraAndPhysicalRoadAt17:capturedR1At17,
  originalP96InputPreservedUntil17Seconds:true,
  actualSourceFixedScriptFailure:r.failure?
     {t:r6(r.failure.t),reason:r.failure.reason,
      worldXYZ:roundPos(r.failure.position),speedMps:r6(r.failure.speed),
      surface:r.failure.surface}:null,
  trueOriginalEngineStatus:r.status,
  simulationStoppedAtSeconds:r6(r.time),
  lastGroundedWithOriginalB48WorldAtSeconds:r6(lastGroundTime),
  firstAirOrNoB48SupportAfter17Seconds:firstAfter17AirTime===null?null:r6(firstAfter17AirTime),
  endTruncatedAt24SecondsNoFinishCertification:r.status==='running',
  originalRunnerCollisionCount:r.collisions,
  originalRunnerAirTimeAtEnd:r6(r.airTime),
  originalEngineRecentFailureOrContactEvents:r.events.filter(e=>['failure','air','contact','finish','moving-unsafe'].includes(e.type)).slice(-12),
  actualNativeLastEightSecondsQuarterSecondSamples:samples,
  humanKeyboardSteeringTested:false,
  gameInputOrPhysicsModified:false,
  collisionSourceGeometryReplaced:false,
  gameplayOriginal52SecondCompletionCertified:false,
  gameplaySafetyApproved:false
 };
 if(delta===0){
  assert.equal(r.status,ref.actualRunnerStatus);
  assert.ok(Math.abs(r.time-ref.actualRunnerTimeSeconds)<.001);
  assert.ok(outcome.actualSourceFixedScriptFailure);
 }
 console.log('R15L2_ACTUAL_ORIGINAL_RUNNER_TERMINAL',JSON.stringify({
    road,scenario,status:r.status,t:r6(r.time),
    lastGrounded:outcome.lastGroundedWithOriginalB48WorldAtSeconds,
    reason:r.failure?.reason||null,delta}),);
 return outcome;
}
export function diagnose(f1,f2){
 const refs={'true-pinch':JSON.parse(fs.readFileSync(f1,'utf8')),
             'pinch-switch':JSON.parse(fs.readFileSync(f2,'utf8'))};
 for(const road of ROAD_NAMES){
  const r=refs[road];
  assert.equal(r.sourceBlob,SRC);
  assert.equal(r.actualRunnerStatus,'failed');
  assert.equal(r.originalR1OverlappingTrue13FramesParity.length,13);
 }
 const cases={};
 for(const road of ROAD_NAMES){
  cases[road]=VARIANTS.map(([name,delta])=>runSourceVariant(road,name,delta,refs[road]));
 }
 const reports={schema:'dopagaki.r15l2-native-original-failure-reason-and-after17-analog-sensitivity/1',
   sourceBlob:SRC,
   originalPhysicsHz:240,
   originalWorldCX:18,originalWorldB48:7,originalWorldB51:28,
   sourceNativeReplayFromR15LOriginalArtifact:true,
   twoOriginalRoads:[...ROAD_NAMES],
   isolatedPost17AnalogAlternativesPerRoad:3,
   originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials:cases,
   originalSourceScriptChanged:false,
   genuineHumanPlaySession:false,
   actualGameBrowserWebGL:false,
   newGameColliders:0,
   originalArtAccepted:0,
   officialSlope2Meters:0,
   ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
   INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
 return reports;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);const get=k=>{const i=args.indexOf(k);assert.ok(i>=0,'missing '+k);return args[i+1]};
 const result=diagnose(get('--native-true-pinch'),get('--native-pinch-switch'));
 const out=get('--out');fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'R15L2_TRUE_SOURCE_RUNNER_TERMINAL_REASON_AND_AFTER17_INPUT_SWEEP.json'),
    JSON.stringify(result,null,2)+'\n');
 console.log('R15L2_REPLAY_ALL_SIX_ORIGINAL_SOURCE_STUDIES',
   Object.fromEntries(ROAD_NAMES.map(r=>[r,result.originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials[r]
    .map(x=>[x.scenario,x.trueOriginalEngineStatus,x.simulationStoppedAtSeconds,x.actualSourceFixedScriptFailure?.reason||null])])),
   'NO HUMAN / GAMEPLAY / ART CERTIFICATION');
}
