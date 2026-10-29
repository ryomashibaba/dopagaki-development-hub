/** R15M original 240Hz B48 road support exit. No game/geometry edits. */
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

const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const roads=['true-pinch','pinch-switch'];
const modes=[['ORIGINAL',0],['FROM_16P5_LEFT_MINUS_0P35',-.35],['FROM_16P5_RIGHT_PLUS_0P35',.35]];
const rounded=(x,n=7)=>Number(x.toFixed(n));
const coord=v=>v.map(x=>rounded(x,7));
const maxDiff=(x,y)=>Math.max(...x.map((v,i)=>Math.abs(v-y[i])));
export function sourceExit(road,scenario,bias,reference,oldL2){
 assert.ok(roads.includes(road));
 const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
 assert.equal(doc.stageForge.productionPromoted,false);
 assert.equal(doc.surfaces[0].voidLongitudinalCells.join(','),'52');
 const player=new Runner(doc,compile(doc),0,52);
 const route=makeP96RoutePlan(doc,player),surge=createA13SurgeState();
 let cam=createCameraState(player.forward);
 let lastPhysicalSupport=null,previousSupport=true,exits=[];
 let refAt16=null,refAt17=null;
 const samples=[];
 for(let tick=1;tick<=Math.round(20/DT);tick++){
  if(player.status==='failed'||player.status==='finished')break;
  const raw=p96DodgeSteer(player,route,'early-soft',movingObstaclePose).input/4.8;
  // The same original input up to 16.5 seconds in every scenario.
  const steer=Math.max(-1,Math.min(1,raw+(player.time>=16.5?bias:0)));
  p101Step(player,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
  cam=advanceCamera(cam,player.forward,DT);
  const grounded=Boolean(player.grounded&&player.surface);
  if(grounded)lastPhysicalSupport={tick,seconds:rounded(player.time),
    surface:player.surface,position:coord(player.p),velocity:coord(player.v)};
  if(previousSupport&&!grounded){
   exits.push({tick,seconds:rounded(player.time),
     sourceGameRoad:player.surface||player.lastSurface,
     playerCentreXYZ:coord(player.p),playerVelocityXYZ:coord(player.v)});
  }
  previousSupport=grounded;
  if(tick===Math.round(16/DT)||tick===Math.round(17/DT)){
   const pose=capturePose(player),view=viewForPose(pose,cam);
   const old=reference.originalFullTimelineFrames.find(x=>x.id==='t'+(tick===Math.round(16/DT)?'1600':'1700'));
   if(bias===0||tick===Math.round(16/DT)){
    assert.ok(old);
    assert.ok(maxDiff(pose.position,old.playerPosition)<1e-5);
    assert.ok(maxDiff(view.eye,old.eye)<1e-5);
    assert.ok(maxDiff(view.front,old.front)<1e-5);
    assert.equal(player.surface||player.lastSurface,old.physicalRoad);
   }
   const record={tick,position:coord(pose.position),eye:coord(view.eye),front:coord(view.front),
    physicalRoad:player.surface||player.lastSurface,
    sourceSnapshotEqualsOriginalReference:bias===0||tick===Math.round(16/DT)};
   if(tick===Math.round(16/DT))refAt16=record;else refAt17=record;
  }
  // Every tick around departure 16.9-17.4, otherwise 0.05s intervals.
  const observe=tick>=Math.round(16.25/DT)&&tick<=Math.round(18.25/DT)&&
    (tick%12===0||(tick>=Math.round(16.9/DT)&&tick<=Math.round(17.4/DT)));
  if(observe||player.status==='failed'||player.status==='finished'){
   samples.push({tick,seconds:rounded(player.time),
    positionXYZ:coord(player.p),velocityXYZ:coord(player.v),
    speedMps:rounded(Math.hypot(...player.v),5),
    grounded:player.grounded,sourcePhysicalB48Road:player.surface,
    lastSourcePhysicalB48Road:player.lastSurface,
    input:rounded(steer),airTimeSeconds:rounded(player.airTime),
    collisionCount:player.collisions,
    originalEngineStatus:player.status});
  }
 }
 assert.ok(refAt16&&refAt17);
 assert.equal(JSON.stringify(doc),frozen);
 if(bias===0){
  assert.equal(player.status,reference.actualRunnerStatus);
  assert.ok(Math.abs(player.time-reference.actualRunnerTimeSeconds)<.001);
  assert.equal(player.failure.reason,oldL2.actualSourceFixedScriptFailure.reason);
  assert.ok(Math.abs(lastPhysicalSupport.seconds-oldL2.lastGroundedWithOriginalB48WorldAtSeconds)<1e-5);
 }
 return {scenario,inputAfter16p5Bias:bias,originalP96SourceNativeInputBefore16p5:true,
  originalR15LTime16CameraReference:refAt16,
  observedR15LTime17OriginalCameraReference:refAt17,
  actualSourceR15MTrace:samples,
  lastPhysicalGroundedSourceSupportBeforeEngineTerminal:lastPhysicalSupport,
  sourcePhysicalSupportExitEventsAfter16p5:exits.filter(x=>x.seconds>=16.5),
  originalEngineFailure:player.failure?
   {seconds:rounded(player.failure.t),reason:player.failure.reason,
    positionXYZ:coord(player.failure.position),sourceRoad:player.failure.surface}:null,
  actualRunnerEndTimeSeconds:rounded(player.time),actualRunnerStatus:player.status,
  originalSourcePhysicsAndRoadMeshesEdited:false,humanGameplayCertified:false,
  realBuiltRoadRepair:false,actualWebGLRendered:false};
}
export function build(nativePaths,l2Path){
 const source=Object.fromEntries(roads.map((r,i)=>[r,JSON.parse(fs.readFileSync(nativePaths[i],'utf8'))]));
 const l2=JSON.parse(fs.readFileSync(l2Path,'utf8'));assert.equal(l2.sourceBlob,SHA);
 const result={};
 for(const road of roads){
  assert.equal(source[road].sourceBlob,SHA);
  assert.equal(source[road].originalR1OverlappingTrue13FramesParity.length,13);
  const baseline=l2.originalSourceScenarioAndTwoAfter17UserInputSensitivityTrials[road][0];
  result[road]=modes.map(([scenario,bias])=>sourceExit(road,scenario,bias,source[road],baseline));
  console.log('R15M_REAL_SOURCE_240HZ_B48_EDGE_EXIT',road,JSON.stringify(result[road].map(v=>({
   scenario:v.scenario,lastSupport:v.lastPhysicalGroundedSourceSupportBeforeEngineTerminal?.seconds,
   exit:v.sourcePhysicalSupportExitEventsAfter16p5[0]?.seconds,
   failure:v.originalEngineFailure?.seconds,reason:v.originalEngineFailure?.reason}))));
 }
 return {schema:'dopagaki.r15m-actual-source-b48-240hz-exit-and-before17-analog/1',
  originalSourceGameBlob:SHA,sourceGeometrySourceCounts:{CX:18,B48:7,B51:28,hz:240},
  originalR15L2NativeInputSourceMatched:true,
  scenarioDescription:'original and ±0.35 analog bias ONLY from 16.5s, source-unchanged',
  genuineSourceRoadDepartureExperiments:result,
  originalGameSourceEdited:false,newGameColliders:0,actualRealSourceBlenderBuildingsAdded:false,
  humanGameplayCertified:false,originalGameWebGLRendered:false,officialArt:0,officialSlope2Meters:0,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const argv=process.argv.slice(2);
 const flag=k=>{const i=argv.indexOf(k);assert.ok(i>=0,k);return argv[i+1]};
 const r=build([flag('--true-pinch'),flag('--pinch-switch')],flag('--l2'));
 const dest=flag('--out');fs.mkdirSync(dest,{recursive:true});
 fs.writeFileSync(path.join(dest,'R15M_ACTUAL_ORIGINAL_B48_240HZ_EXIT_TRAJECTORIES.json'),JSON.stringify(r,null,2)+'\n');
}
