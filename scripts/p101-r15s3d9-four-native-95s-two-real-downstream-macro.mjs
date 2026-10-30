/** R15S3D9: Original physical Runner, two original worlds × two REAL
 * B48 downstream 5/6 plans, from original t=0 at genuine 240Hz until 95s max.
 * Never certify finished from status="running" or 95s cap.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D9,MODES} from './p101-r15s3d9-source-real-road5-road6-integrated-macro.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const arg=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1],k);return process.argv[i+1];};
const b16=JSON.parse(fs.readFileSync(arg('--b16'),'utf8'));
const r1=JSON.parse(fs.readFileSync(arg('--r1'),'utf8'));
const originalStatic=JSON.parse(fs.readFileSync(arg('--static'),'utf8'));
assert.equal(b16.sourceGameBlob,SHA);assert.equal(r1.sourceOriginalBlob,SHA);
assert.equal(originalStatic.originalSourceGameBlob,SHA);
const worlds=['true-pinch','pinch-switch'],modes=MODES;
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),mag=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]);
const vec=v=>v.map(x=>Number(x.toFixed(6))),round=x=>Number(x.toFixed(6));
function closestRoad(track,p){
 let best=null;
 for(let i=1;i<track.length;i++){
  const a=track[i-1],b=track[i],v=sub(b,a),len=dot(v,v),t=Math.max(0,Math.min(1,dot(sub(p,a),v)/(len||1)));
  const q=a.map((x,j)=>x+t*v[j]),distance=mag(sub(p,q));
  if(!best||distance<best.distanceM)best={u:(i-1+t)/(track.length-1),distanceM:distance,tangent:v.map(x=>x/(mag(v)||1))};
 }
 return best;
}
const output={
 schema:'dopagaki.r15s3d9-physically-paired-road5-road6-4-world-modes-native-95s/1',
 sourceOriginalBlob:SHA,physicsHz:240,sourceBallRadius:.65,
 oldNativeR15S3D8R1TwoWorldReference:true,extendedNativeCapSeconds:95,
 staticRealB48GateAllFourPassed:true,
 sourceGeometryChangedOnlyInPrivateB48:[5,6],originalB48Count:7,originalB51Count:28,
 nativeFourCases:4,originalP96P94InputAndA13Unmodified:true,
 originalPhysicsRouteCameraSteeringUnmodified:true,extraHiddenColliders:0,
 noAutomaticPlayerSnapping:true,sourceFullBrowserWebGL:false,humanControlPassed:false,
 officialArtCount:0,officialSlope2Meters:0,actualNativeRunCompleted:false,
 GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',cases:{}
};
for(const world of worlds){
 output.cases[world]={};
 const prefix=new Map(b16.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory.map(e=>[e.tick,e]));
 const baseline=r1.cases[world].A_ROAD4_WINDING_REPAIRED;
 for(const mode of modes){
  assert.equal(originalStatic.cases[world][mode].staticResult,'PASS_STATIC_ONLY');
  const doc=buildR15S3D9(world,mode),snapshot=JSON.stringify(doc),compiled=compile(doc);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.equal(compiled.invalid,0);
  const runner=new Runner(doc,compiled,0,52),plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState();
  const tracks=[2,3,4,5,6].map(i=>Array.from({length:151},(_,j)=>sample(doc.surfaces[i],j/150,.5)));
  const roadNames=[2,3,4,5,6].map(i=>doc.surfaces[i].id);
  let checks=0,roadCounts=[0,0,0,0,0],cumulativeProgress=[0,0,0,0,0],negativeForwardTicks=0,movingEvents=0;
  let peakDelta={valueMps:0,tick:null,collisionChange:null,road:null},
   firstRoad4=null,firstRoad5=null,firstRoad6=null,lastGround=null,firstRoad3=null,firstScissor=null;
  const events=[],timeline=[];
  let previousKey=null,unseen=false;
  for(let tick=1;tick<=Math.round(95/DT);tick++){
   if(runner.status==='failed'||runner.status==='finished')break;
   const input=tick<=Math.round(21.5/DT)
    ?p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8
    :p94NativeSteer(runner,'corrective');
   assert.ok(input>=-1&&input<=1&&Number.isFinite(input));
   const oldVelocity=[...runner.v],oldCollision=runner.collisions;
   p101Step(runner,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
   const ground=!!runner.grounded&&!!runner.surface,road=ground?runner.surface:null;
   const speed=mag(runner.v),signed=dot(runner.v,runner.forward),fixedDelta=runner.collisions-oldCollision;
   const delta=mag(sub(runner.v,oldVelocity));
   if(delta>peakDelta.valueMps&&runner.time>23)peakDelta={valueMps:round(delta),tick,collisionChange:fixedDelta,road};
   if([4080,5160].includes(tick)){
    const ref=prefix.get(tick);assert.ok(ref,'missing original CROWN evidence');
    assert.ok(mag(sub(runner.p,ref.xyz))<.00001,'original source CROWN XYZ');
    assert.ok(Math.abs(speed-ref.speedMps)<.000003,'original source speed');
    assert.ok(Math.abs(input-ref.steer)<.000003,'original legal input');
    assert.equal(runner.surface,ref.physicalRoad);
    assert.equal(ground,ref.grounded);checks++;
   }
   if(ground){
    lastGround={tick,t:round(runner.time),road,xyz:vec(runner.p)};
    if(signed<0&&runner.time>=23)negativeForwardTicks++;
    const idx=roadNames.indexOf(road);
    if(idx>=0){
     roadCounts[idx]++;
     const projection=closestRoad(tracks[idx],runner.p);
     cumulativeProgress[idx]=Math.max(cumulativeProgress[idx],projection.u);
     const data={tick,t:round(runner.time),xyz:vec(runner.p),signedNativeForwardMps:round(signed),
      signedGeometryTangentMps:round(dot(runner.v,projection.tangent)),
      roadUProxy:round(projection.u),centreDistanceM:round(projection.distanceM)};
     if(idx===0&&!firstScissor)firstScissor=data;
     if(idx===1&&!firstRoad3)firstRoad3=data;
     if(idx===2&&!firstRoad4)firstRoad4=data;
     if(idx===3&&!firstRoad5)firstRoad5=data;
     if(idx===4&&!firstRoad6)firstRoad6=data;
    }
   }
   if(tick>=Math.round(23/DT)){
    if(road!==previousKey){
     events.push({tick,t:round(runner.time),previousRoad:previousKey,currentRoad:road,
      xyz:vec(runner.p),velocityXYZ:vec(runner.v),forwardXYZ:vec(runner.forward),
      originalCollisionCountDelta:fixedDelta});
    }
    if(tick%24===0||runner.status!=='running'||road!==previousKey){
     const ridx=roadNames.indexOf(road),nearest=ridx<0?null:closestRoad(tracks[ridx],runner.p);
     timeline.push({tick,t:round(runner.time),status:runner.status,road,grounded:ground,
      xyz:vec(runner.p),velocityXYZ:vec(runner.v),forwardXYZ:vec(runner.forward),
      signedNativeForwardMps:round(signed),nativeTrueSpeedMps:round(speed),
      actualLegalSteeringInput:round(input),
      originalFixedCollisionCountDelta:fixedDelta,
      onRoadUProxy:nearest?round(nearest.u):null,
      signedPhysicalRoadTangentMps:nearest?round(dot(runner.v,nearest.tangent)):null});
    }
   }
   previousKey=road;
  }
  assert.equal(checks,2);assert.equal(JSON.stringify(doc),snapshot);
  const moving=runner.events.filter(e=>['moving-contact','moving-crush','moving-unsafe'].includes(e.type));
  movingEvents=moving.length;
  const result={
   world,mode,originalSourcePrefixChecks:checks,
   actualGeometry:doc.stageForge.r15s3d9,
   originalNativeRunnerStatus:runner.status,terminalTimeOr95sCap:round(runner.time),
   actualFinishedAllSevenRoads:runner.status==='finished',
   terminalFailureReason:runner.failure?.reason??null,
   priorR15S3D8R1Original65sStatus:baseline.originalNativeRunnerStatus,
   priorR15S3D8R1Original65sRoad4SupportedSeconds:baseline.trueFollowingB48GroundSeconds,
   priorR15S3D8R1TerminalSeconds:baseline.terminalTimeOr95sCap,
   actualPhysicalRoads:7,originalPhysicalB51:28,
   trueSCISSORGroundSeconds:round(roadCounts[0]*DT),
   trueLOWERGroundSeconds:round(roadCounts[1]*DT),
   trueFollowingB48GroundSeconds:round(roadCounts[2]*DT),
   trueOriginalRoad5GroundSeconds:round(roadCounts[3]*DT),
   trueOriginalRoad6GroundSeconds:round(roadCounts[4]*DT),
   firstSCISSORTrueContact:firstScissor,firstLOWERTrueContact:firstRoad3,
   firstFollowingB48TrueContact:firstRoad4,
   firstOriginalRoad5TrueContact:firstRoad5,
   firstOriginalRoad6TrueContact:firstRoad6,
   lastActualNativeGround:lastGround,
   largestRoadUProjectionProxy:cumulativeProgress.map(round),
   originalNativeMovingContactEvents:movingEvents,
   actualNegativeForwardGroundedTicksAfter23:negativeForwardTicks,
   largestWhole240HzTickVelocityChangeAfter23:peakDelta,
   originalRoadContactEvents:events,
   genuineNative10HzAndContactTimeline:timeline,
   genuineRunnerClockWasNotAltered:true,
   originalSourceGameOrEngineModified:false,
   humanGameplayOrVisualArtAccepted:false
  };
  output.cases[world][mode]=result;
  console.log('R15S3D9_REAL_NATIVE_RESULT',JSON.stringify({world,mode,
   status:runner.status,end:result.terminalTimeOr95sCap,road3S:result.trueLOWERGroundSeconds,
   road4S:result.trueFollowingB48GroundSeconds,road4First:result.firstFollowingB48TrueContact,
   maxTickDelta:peakDelta,road4To5Continuity:result.actualGeometry.realRoad4ToRoad5FiveVertexSeamDistancesM,
   road5To6Continuity:result.actualGeometry.realRoad5ToRoad6FiveVertexSeamDistancesM,
   road5S:result.trueOriginalRoad5GroundSeconds,
   road6S:result.trueOriginalRoad6GroundSeconds,
   realOriginalFinished:runner.status==='finished',
   CROWNchecks:checks,movingEvents}));
 }
}
output.actualNativeRunCompleted=true;
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15S3D9_FOUR_95S_GENUINE_NATIVE_ROAD5_ROAD6.json',JSON.stringify(output,null,2)+'\n');
