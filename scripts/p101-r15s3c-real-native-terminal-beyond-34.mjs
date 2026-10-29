/**
 * R15S3C: continue the two authentic R15S3B E_BANKED_LANDING P94 cases,
 * with strict 0-34s full native trace parity, to real terminal (max 50s).
 * "running" at 34s is NOT a completed course nor proof of ground support.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3B} from './p101-r15s3b-isolated-source-trail-aware-scissor-macro-candidates.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const arg=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1],'missing '+k);return process.argv[i+1]};
const ref=JSON.parse(fs.readFileSync(arg('--r15s3b'),'utf8'));
assert.equal(ref.sourceGameBlob,SHA);
assert.equal(ref.actualSourceRealPhysicsTrials,12);
const worlds=['true-pinch','pinch-switch'],TICK34=Math.round(34/DT),TICKMAX=Math.round(50/DT);
const round=(v,n=6)=>Number(v.toFixed(n));
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const out={schema:'dopagaki.r15s3c-real-240hz-34-second-extended-to-native-terminal/1',
 sourceBlob:SHA,sourcePhysicsHz:240,fullActualNativeContinuationTrials:2,
 originalCourseAndCameraUnmodified:true,originalB51Preserved:true,sourceNewColliders:0,
 standardP94LegalInputOnly:true,source34SecondsRunningNotFinish:true,
 comparisonR15S3BRunId:40866341059,
 webGLRendered:false,humanOrArtCertified:false,officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 cases:{}};
for(const world of worlds){
 const original=ref.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5;
 assert.equal(original.originalSourceStatus,'running');
 assert.equal(original.trueTerminalSeconds,34);
 assert.equal(original.originalB51Count,28);
 const expected=new Map(original.checkpointAndQuarterSecondSourceTrajectory.map(x=>[x.tick,x]));
 const doc=buildR15S3B(world,'E_BANKED_LANDING'),frozen=JSON.stringify(doc);
 const player=new Runner(doc,compile(doc),0,52);
 const p96=makeP96RoutePlan(doc,player),surge=createA13SurgeState();
 const crossedRoads=new Set(),records=[];
 let parityChecks=0,lastGrounded=null,post34GroundedTicks=0,maxAirStreak=0,airStreak=0;
 for(let tick=1;tick<=TICKMAX;tick++){
  if(player.status==='failed'||player.status==='finished')break;
  const input=tick<=Math.round(21.5/DT)
   ?p96DodgeSteer(player,p96,'early-soft',movingObstaclePose).input/4.8
   :p94NativeSteer(player,'corrective');
  assert.ok(Number.isFinite(input)&&input>=-1&&input<=1);
  p101Step(player,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
  const onRoad=Boolean(player.grounded&&player.surface);
  if(onRoad){
   crossedRoads.add(player.surface);
   lastGrounded={tick,timeSeconds:round(player.time),road:player.surface,xyz:player.p.map(x=>round(x))};
   if(tick>TICK34)post34GroundedTicks++;
   airStreak=0;
  }else{airStreak++;maxAirStreak=Math.max(maxAirStreak,airStreak);}
  if(tick%60===0||player.status==='failed'||player.status==='finished'){
   const record={tick,seconds:round(player.time),nativeStatus:player.status,
     xyz:player.p.map(x=>round(x)),trueGrounded:onRoad,
     physicalSurface:player.surface,speedMps:round(Math.hypot(...player.v)),steer:round(input)};
   if(tick<=TICK34){
    const old=expected.get(tick);
    assert.ok(old,'missing genuine R15S3B 240Hz quarter trace '+world+' tick '+tick);
    assert.ok(dist(player.p,old.xyz)<.00001,'source XYZ prefix mismatch');
    assert.ok(Math.abs(record.speedMps-old.speedMps)<.000003,'source SPEED prefix mismatch');
    assert.ok(Math.abs(record.steer-old.steer)<.000003,'source STEER prefix mismatch');
    assert.equal(record.trueGrounded,old.grounded);
    assert.equal(record.physicalSurface,old.physicalRoad);
    assert.equal(record.nativeStatus,old.status);
    parityChecks++;
   }
   records.push(record);
  }
  if(tick===TICK34){
   assert.equal(parityChecks,expected.size,'all true 0-34s previously saved native samples matched');
   assert.equal(player.status,'running','source actual 34 seconds running but not finished');
  }
 }
 assert.equal(parityChecks,expected.size);
 assert.equal(JSON.stringify(doc),frozen);
 const events=player.events.filter(e=>['moving-contact','moving-crush','moving-unsafe'].includes(e.type)).map(e=>({type:e.type,time:round(e.t),id:e.id??null}));
 const caseResult={world,source34sPreviousStatus:'running',source34sPrefixChecks:parityChecks,
   realTerminalStatus:player.status,realTerminalSeconds:round(player.time),
   nativeFailureReason:player.failure?.reason??null,trueFinished:player.status==='finished',
   lastActualRoadGrounding:lastGrounded,actualGroundedTicksAfter34:post34GroundedTicks,
   maxObservedContinuousAirSeconds:round(maxAirStreak*DT),
   actuallyVisitedRealGroundedRoads:[...crossedRoads],
   original28B51MovingContactEvents:events,
   actualNativeTracePost34:records.filter(x=>x.tick>TICK34),
   sourceFullActualRunner:true,originalGameCodeEdited:false,
   simulatedEndpointIsAuthoritative:player.status!=='running'};
 out.cases[world]=caseResult;
 console.log('R15S3C_NATIVE_REAL_TERMINAL_AFTER_34',JSON.stringify({world,status:caseResult.realTerminalStatus,
  terminal:caseResult.realTerminalSeconds,lastGrounded,
  post34SupportedSeconds:round(post34GroundedTicks*DT),
  visitedRoads:caseResult.actuallyVisitedRealGroundedRoads,
  failure:caseResult.nativeFailureReason}));
}
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15S3C_2_REAL_NATIVE_240HZ_BEYOND_34_TERMINAL.json',JSON.stringify(out,null,2)+'\n');
