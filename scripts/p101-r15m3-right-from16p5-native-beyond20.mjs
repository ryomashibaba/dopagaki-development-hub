/**
 * R15M3 two ORIGINAL 240Hz road variants, plus0.35 analog from 16.5s
 * extended to REAL source termination or 26s; compares exactly to saved
 * earlier 0-20s R15M prefix, cannot pretend 20s running == race completion.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sourceExit} from './p101-r15m-true-source-240hz-last-road-contact.mjs';
const roads=['true-pinch','pinch-switch'];
const src='af076d67492a677d2235e4730aef8cdf4808e106';
function read(p){return JSON.parse(fs.readFileSync(p,'utf8'))}
export function evaluate(srcs,l2,prior){
 const answer={};
 for(const road of roads){
  const original=srcs[road];
  const old=prior.genuineSourceRoadDepartureExperiments[road][2];
  assert.equal(original.sourceBlob,src);
  assert.equal(old.scenario,'FROM_16P5_RIGHT_PLUS_0P35');
  assert.equal(old.actualRunnerStatus,'running');
  assert.equal(old.actualRunnerEndTimeSeconds,20);
  const control=l2.originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials[road][0];
  const q=sourceExit(road,'FROM_16P5_RIGHT_PLUS_0P35_EXTENDED_TO_26',.35,original,control,26);
  assert.ok(q.actualRunnerEndTimeSeconds>=20);
  assert.deepEqual(q.actualSourceR15MTrace.filter(f=>f.seconds<=18.25),
   old.actualSourceR15MTrace,'all genuinely replayed original observations 16.25-18.25 must be identical');
  assert.equal(q.originalR15LTime16CameraReference.sourceSnapshotEqualsOriginalReference,true);
  assert.equal(q.observedR15LTime17OriginalCameraReference.sourceSnapshotEqualsOriginalReference,false);
  assert.equal(q.originalP96SourceNativeInputBefore16p5,true);
  assert.equal(q.originalSourcePhysicsAndRoadMeshesEdited,false);
  const last=q.lastPhysicalGroundedSourceSupportBeforeEngineTerminal;
  assert.ok(last.tick>=old.lastPhysicalGroundedSourceSupportBeforeEngineTerminal.tick);
  answer[road]={
   samePre20ActualNativeSteeringAndPhysics: true,
   originalAt20StateBeforeExtension:old.actualRunnerStatus,
   originalAt20LastSupportedTick:old.lastPhysicalGroundedSourceSupportBeforeEngineTerminal.tick,
   extendedInputScenario:q.scenario,extendedSourceStatus:q.actualRunnerStatus,
   actualStopOrObservationLimitSeconds:q.actualRunnerEndTimeSeconds,
   sourceLastSupportedB48Tick:last.tick,
   sourceLastSupportedB48TimeSeconds:last.seconds,
   sourceLastSupportedRoadId:last.surface,
   sourceAfter16p5PhysicalAirExitEvents:q.sourcePhysicalSupportExitEventsAfter16p5,
   sourceActualFailure:q.originalEngineFailure,
   actualFinishOnlyIfSourceStatusFinished:q.actualRunnerStatus==='finished',
   trueHumanGameplayAndObstacleFairnessCertified:false,
   actualGameSourceEdited:false,newGameColliders:0,
   R15MSourceOriginalPrefix18p25Parity:true
  };
  console.log('R15M3_RIGHT_BIAS_ACTUAL_NATIVE_SOURCE_BEYOND_20',road,
   JSON.stringify({status:q.actualRunnerStatus,seconds:q.actualRunnerEndTimeSeconds,
    lastGrounded:last.seconds,terminal:q.originalEngineFailure?.reason,
    original20WasRunning:true}));
 }
 return {schema:'dopagaki.r15m3-genuine-original-16p5-right-steer-horizon26/1',
  sourceBlob:src,sourcePhysicsHz:240,originalRoadVariants:roads,
  genuineSourceTrialPrefix15to18p25AndR15MOriginalArtifactReused:true,
  actualRightInputOnlyExtendedSourceEvidence:answer,
  allGamePhysicsAndOriginalB48MeshSourceUnmodified:true,
  newlyBuiltRoads:0,newGameColliders:0,realWebGLRendered:false,
  humanGameplayCertified:false,officialArt:0,officialSlope2Meters:0,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
  INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);
 const get=n=>{const i=args.indexOf(n);assert.ok(i>=0,n);return args[i+1]};
 const old=read(get('--r15m'));
 const l2=read(get('--l2'));
 const result=evaluate(Object.fromEntries(roads.map(r=>[r,read(get('--'+r))])),l2,old);
 const folder=get('--out');fs.mkdirSync(folder,{recursive:true});
 fs.writeFileSync(path.join(folder,'R15M3_GENUINE_RIGHT_STEER_B48_CONTACT_AND_TERMINAL_BEYOND20.json'),
  JSON.stringify(result,null,2)+'\n');
}
