/**
 * R15S3B three trajectory-informed real SCISSOR macro geometries x two original worlds x two
 * legal input policies. True native 240Hz/CCD/B51, from real 0-second spawn.
 * No input policy may change player physics or original source files.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {buildR15S3B,R15S3B} from './p101-r15s3b-isolated-source-trail-aware-scissor-macro-candidates.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {p96DodgeSteer,makeP96RoutePlan} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const worlds=['true-pinch','pinch-switch'];
const modes=Object.keys(R15S3B);
const controls=['P96_ORIGINAL','P94_FULL_AFTER_21P5'];
const switchTick=Math.round(21.5/DT),maxTick=Math.round(34/DT);
const round=(x,n=6)=>Number(x.toFixed(n));
const distance=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const arg=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1],k);return process.argv[i+1]};
const saved=JSON.parse(fs.readFileSync(arg('--r15q'),'utf8'));
assert.equal(saved.originalGameSourceBlob,SHA);
const output={schema:'dopagaki.r15s3b-crown-frozen-trail-aware-scissor-macro-3design-2world-2controls-240hz/1',
 sourceGameBlob:SHA,source240Hz:true,sourceBallRadiusM:.65,
 actualSourceRealPhysicsTrials:12,roadWorlds:worlds,macroPhysicalDesigns:modes,
 controllers:controls,controllerSwitchSecond:21.5,
 samePhysicalRoadWithinEachControllerComparison:true,
 originalGameCodeModified:false,originalCrownB16EntirePhysicalRoadFrozen:true,baselineOriginalR15QBeforeSwitchWitnessTicks:[Math.round(17/DT),switchTick],originalGameCollidersAdded:0,
 originalB51MovingObstaclesEnabledAndUnmodified:true,
 originalCameraOrPhysicsModified:false,hiddenSupportOrVelocityClamp:false,
 sourceRealGameWebGLRendered:false,humanFairnessProven:false,
 officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 actualCases:{}};
for(const world of worlds){
 output.actualCases[world]={};
 for(const mode of modes){
  output.actualCases[world][mode]={};
  const reference=buildR15S3B(world,mode);
  const geometryHash=hash(reference.surfaces.map(s=>s.points));
  let firstPreSwitch=null;
  const genuineReference=new Map(saved.nativeScissorRealEditableSurfaceGeometryTrials[world].B16_ONLY_REFERENCE.true240HzOriginalSourcePhysics.nativeQuarterSecondSourcePhysicsTrace.map(x=>[x.tick,x]));
  for(const control of controls){
   const doc=buildR15S3B(world,mode);
   const frozen=JSON.stringify(doc);
   assert.equal(hash(doc.surfaces.map(s=>s.points)),geometryHash);
   assert.equal(doc.movingObstacles.length,28);
   const player=new Runner(doc,compile(doc),0,52);
   const plan=makeP96RoutePlan(doc,player),surge=createA13SurgeState();
   const scissor=doc.surfaces[2].id;
   let lastGrounded=null,firstScissorGrounded=null,maxScissorUProxy=-1,scissorSupportedTicks=0;
   let airborneTicks=0,groundedTicks=0,changes=0,preSwitch=[];
   let previousGround=Boolean(player.grounded&&player.surface),maxAirTicks=0,airStreak=0;
   const trajectory=[],sourceMovingContacts=[];
   for(let tick=1;tick<=maxTick;tick++){
    if(player.status==='failed'||player.status==='finished')break;
    const input=control===controls[0]||tick<=switchTick
      ?p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8
      :p94NativeSteer(player,'corrective');
    assert.ok(Number.isFinite(input)&&input>=-1&&input<=1,'legal native [-1,1] input');
    p101Step(player,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
    const onRoad=Boolean(player.grounded&&player.surface);
    if(onRoad){
     groundedTicks++;airStreak=0;
     lastGrounded={tick,timeSeconds:round(player.time),physicalRoadId:player.surface,
       ballPositionXYZ:player.p.map(x=>round(x))};
     if(player.surface===scissor){
      scissorSupportedTicks++;
      if(firstScissorGrounded===null)firstScissorGrounded={tick,timeSeconds:round(player.time)};
      const guide=player.guides?.find(g=>g.surface===scissor);
      if(guide){
       let nearest=-1,d=Infinity;
       guide.points.forEach((pt,i)=>{const dd=distance(pt,player.p);if(dd<d){d=dd;nearest=i;}});
       maxScissorUProxy=Math.max(maxScissorUProxy,nearest/64);
      }
     }
    }else{airborneTicks++;airStreak++;maxAirTicks=Math.max(maxAirTicks,airStreak);}
    if(previousGround!==onRoad)changes++;
    previousGround=onRoad;
    if([Math.round(13/DT),Math.round(17/DT),Math.round(21.25/DT),switchTick].includes(tick)){
     preSwitch.push({tick,xyz:player.p.map(x=>round(x)),velocityXYZ:player.v.map(x=>round(x)),
       grounded:onRoad,road:player.surface,steer:round(input)});
     if(tick===Math.round(17/DT)||tick===switchTick){
      const ref=genuineReference.get(tick);
      assert.ok(ref,'R15Q exact original unchanged CROWN baseline tick missing');
      assert.ok(distance(player.p,ref.playerWorldXYZ)<1e-5,'R15S3B preserved actual original CROWN source path');
      assert.equal(onRoad,ref.engineGrounded);
      assert.equal(player.surface,ref.sourceRoad);
      assert.ok(Math.abs(Math.hypot(...player.v)-ref.speedMps)<.00011);
      assert.ok(Math.abs(input-ref.steer)<.00011);
     }
    }
    if(tick%60===0||player.status==='failed'||player.status==='finished'){
     trajectory.push({tick,t:round(player.time),status:player.status,
       xyz:player.p.map(x=>round(x)),grounded:onRoad,physicalRoad:player.surface,
       speedMps:round(Math.hypot(...player.v)),steer:round(input)});
    }
   }
   assert.equal(JSON.stringify(doc),frozen);
   const moved=player.events.filter(e=>['moving-contact','moving-crush','moving-unsafe'].includes(e.type));
   for(const ev of moved)sourceMovingContacts.push({type:ev.type,time:round(ev.t),id:ev.id??null});
   if(firstPreSwitch===null){firstPreSwitch=preSwitch;}
   else {
    assert.deepEqual(preSwitch,firstPreSwitch,'same actual physical road and early controls must match PRE 21.5s');
   }
   const result={originalGameUnchanged:true,originalB51Count:doc.movingObstacles.length,
     physicalSourceRoadCount:doc.surfaces.length,physicsHz:240,controller:control,
     sameRoadGeometrySHA256:geometryHash,sourceMacroDesign:doc.stageForge.r15s3bStudy,
     originalSourceStatus:player.status,trueRunnerFailureReason:player.failure?.reason??null,
     trueTerminalSeconds:round(player.time),actualFirstSCISSORGroundContact:firstScissorGrounded,
     actualLastB48Contact:lastGrounded,actualSCISSORGroundedDurationSeconds:round(scissorSupportedTicks*DT),
     approximateMaximumScissorGuideU:maxScissorUProxy<0?null:round(maxScissorUProxy),
     actualNativeAllRoadGroundedDurationSeconds:round(groundedTicks*DT),
     actualNativeAirborneDurationSeconds:round(airborneTicks*DT),
     longestContinuousAirborneSeconds:round(maxAirTicks*DT),
     groundStateTransitions:changes,originalSourceB51MovingContactEvents:sourceMovingContacts,
     inputLegalityEnforced:true,preSwitchTruePhysicalCheckpoints:preSwitch,
     checkpointAndQuarterSecondSourceTrajectory:trajectory,
     originalSourceGameWebGLRendered:false,humanGameplayProven:false,
     sourceActualFinished:player.status==='finished'};
   output.actualCases[world][mode][control]=result;
   console.log('R15S3B_GENUINE_MACRO_240HZ',JSON.stringify({world,mode,control,
     status:result.originalSourceStatus,terminal:result.trueTerminalSeconds,
     lastGrounded:lastGrounded?.timeSeconds,scissorDuration:result.actualSCISSORGroundedDurationSeconds,
     maxSCISSORU:result.approximateMaximumScissorGuideU,
     collisions:moved.length}));
  }
 }
}
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15S3B_12_REAL_240HZ_SOURCE_TRAIL_AWARE_SCISSOR_RUNS.json',JSON.stringify(output,null,2)+'\n');
