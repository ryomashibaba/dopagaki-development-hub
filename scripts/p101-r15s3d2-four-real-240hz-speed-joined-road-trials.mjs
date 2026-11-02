/** R15S3D2 genuine 240Hz source CCD/7 B48/28 B51, three physical
 * SCISSOR late geometry candidates x two worlds, same P94 legal input.
 * Crucially distinguish actual forward speed on the current road from
 * total v magnitude, airborne fall, stagnant road time, and real next-road contact.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {buildR15S3D2,GRADE_DESIGNS} from './p101-r15s3d2-scissor-and-next-real-longitudinal-physical-regrade.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const worlds=['true-pinch','pinch-switch'],modes=Object.keys(GRADE_DESIGNS);
const tickLimit=Math.round(45/DT),switchTick=Math.round(21.5/DT);
const get=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1],'missing '+k);return process.argv[i+1]};
const ref=JSON.parse(fs.readFileSync(get('--r15s3b'),'utf8'));
assert.equal(ref.sourceGameBlob,SHA);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mag=a=>Math.hypot(...a),round=(x,n=6)=>Number(x.toFixed(n));
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const stages=(doc,index)=>{const s=doc.surfaces[index];const pts=Array.from({length:151},(_,i)=>sample(s,i/150,.5));
 return {id:s.id,pts};};
function tangentAt(track,p){
 let best=null;
 for(let i=0;i<track.pts.length-1;i++){
  const a=track.pts[i],b=track.pts[i+1],d=sub(b,a);
  const step=Math.max(0,Math.min(1,dot(sub(p,a),d)/(dot(d,d)||1)));
  const q=a.map((x,j)=>x+step*d[j]),dist=mag(sub(p,q));
  if(!best||dist<best.distance){
   const n=mag(d);best={u:(i+step)/150,direction:d.map(x=>x/n),distance:dist};
  }
 }
 return best;
}
const output={schema:'dopagaki.r15s3d2-source-real-two-road-longitudinal-crest-and-next-entry-2x2-240hz/1',
 sourceGameBlob:SHA,sourcePhysicsHz:240,trueNativeTrialCount:4,
 trueSourceCrownPreserved:true,originalB51DefinitionsPreserved:true,longitudinalMacroscopicTwoRoadRealColliderRedesign:true,
 sourcePhysicsOrCameraModified:false,extraGameColliders:0,
 speedDefinitions:'totalSpeed=abs(native velocity), localForward=dot(velocity, native forward), signedRoadTangent=dot(velocity, nearest SOURCE B48 interpolated centerline tangent), progress u is source geometry projection PROXY, NOT engine contact param',
 originalSourceScriptInput:'P96 early-soft / 4.8 until 21.5 seconds, then P94 corrective full legal [-1,1]; real Runner.step every 1/240 sec',
 earlyNativeR15S3BPrefixVerifiedAgainstSavedOriginal:true,
 sourceWebGLRendered:false,humanFairnessEstablished:false,officialArt:0,officialSlope2Meters:0,
 ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',cases:{}};
for(const world of worlds){
 output.cases[world]={};
 const baseline=new Map(ref.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory.map(x=>[x.tick,x]));
 for(const mode of modes){
  const doc=buildR15S3D2(world,mode),frozen=JSON.stringify(doc);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  const player=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,player);
  const surge=createA13SurgeState(),tracks=[2,3].map(i=>stages(doc,i));
  const scissor=tracks[0].id,next=tracks[1].id;
  let checkpoints=0,lastGrounded=null,scissorGroundedTicks=0,nextRoadGroundedTicks=0;
  let lowEngineForwardGroundedTicks=0,negativeEngineForwardGroundedTicks=0;
  let negativeRoadForwardSCISSORsamples=0,roadForwardSamples=0;
  let scissorSignedForwardSpeedTotal=0,scissorUmax=-1,scissorUmin=Infinity;
  let lastScissor=null,firstNext=null;
  let maxSpeed=0,sourceB51Contacts=0;
  const timeline=[];
  for(let tick=1;tick<=tickLimit;tick++){
   if(player.status==='failed'||player.status==='finished')break;
   const input=tick<=switchTick?p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8
    :p94NativeSteer(player,'corrective');
   assert.ok(input>=-1&&input<=1&&Number.isFinite(input));
   p101Step(player,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
   const grounded=Boolean(player.grounded&&player.surface);
   const totalSpeed=mag(player.v);
   const localForwardSpeed=dot(player.v,player.forward);
   maxSpeed=Math.max(maxSpeed,totalSpeed);
   if(grounded){
    lastGrounded={timeSeconds:round(player.time),road:player.surface,xyz:player.p.map(v=>round(v))};
    if(localForwardSpeed<25)lowEngineForwardGroundedTicks++;
    if(localForwardSpeed<0)negativeEngineForwardGroundedTicks++;
    if(player.surface===scissor){scissorGroundedTicks++;lastScissor={timeSeconds:round(player.time),xyz:player.p.map(v=>round(v))};}
    if(player.surface===next){nextRoadGroundedTicks++;if(!firstNext)firstNext={timeSeconds:round(player.time),xyz:player.p.map(v=>round(v))};}
   }
   if([Math.round(17/DT),switchTick].includes(tick)){
    const expected=baseline.get(tick);
    assert.ok(expected,'saved R15S3B true source prefix missing');
    assert.ok(mag(sub(player.p,expected.xyz))<.00001,'frozen source B16 prefix XYZ parity');
    assert.ok(Math.abs(totalSpeed-expected.speedMps)<.000003,'frozen source speed parity');
    assert.ok(Math.abs(input-expected.steer)<.000003,'frozen source input parity');
    assert.equal(player.surface,expected.physicalRoad);
    assert.equal(grounded,expected.grounded);
    checkpoints++;
   }
   if(tick%60===0||player.status==='failed'||player.status==='finished'){
    let sourceGeometry=null;
    if(player.surface===scissor||player.surface===next){
     sourceGeometry=tangentAt(tracks[player.surface===scissor?0:1],player.p);
     if(player.surface===scissor&&grounded){
      scissorUmax=Math.max(scissorUmax,sourceGeometry.u);
      scissorUmin=Math.min(scissorUmin,sourceGeometry.u);
      const signed=dot(player.v,sourceGeometry.direction);
      scissorSignedForwardSpeedTotal+=signed;
      roadForwardSamples++;
      if(signed<0)negativeRoadForwardSCISSORsamples++;
     }
    }
    timeline.push({tick,timeSeconds:round(player.time),realEngineStatus:player.status,
     actualEngineGrounded:grounded,actualPhysicalRoad:player.surface,
     positionXYZ:player.p.map(v=>round(v)),totalSpeedMps:round(totalSpeed),
     trueNativeHeadingForwardSpeedMps:round(localForwardSpeed),
     sourceRoadTangentSignedSpeedMps:sourceGeometry?round(dot(player.v,sourceGeometry.direction)):null,
     nearestSourceCenterlineUProxy:sourceGeometry?round(sourceGeometry.u):null,
     sourceCenterlineDistance3DProxyM:sourceGeometry?round(sourceGeometry.distance):null,
     legalNativeSteeringInput:round(input)});
   }
  }
  assert.equal(checkpoints,2);
  assert.equal(JSON.stringify(doc),frozen,'source study doc mutated');
  const moving=player.events.filter(x=>['moving-contact','moving-crush','moving-unsafe'].includes(x.type));
  sourceB51Contacts=moving.length;
  const result={world,mode,originalTrueB16SourcePrefixParityChecks:checkpoints,
   realSourceOriginalProtected:true,sourceB48Surfaces:7,original28MovingB51:28,
   trueNativeStatusAtEnd:player.status,trueTerminalOrCapSeconds:round(player.time),
   actualFinishedEntireCourse:player.status==='finished',
   nativeFailureReason:player.failure?.reason??null,
   trueLastRoadContact:lastGrounded,
   actualSCISSORGroundedSeconds:round(scissorGroundedTicks*DT),
   sourceSCISSORLastGrounding:lastScissor,
   nativeNextRoadContactEntered:firstNext,
   actualNextRoadGroundedSeconds:round(nextRoadGroundedTicks*DT),
   actualGroundedTicksBelow25MpsNativeForward:lowEngineForwardGroundedTicks,
   actualNegativeNativeHeadingForwardGroundedTicks:negativeEngineForwardGroundedTicks,
   sampledSignedScissorRoadTangentSpeedMeanMps:roadForwardSamples?round(scissorSignedForwardSpeedTotal/roadForwardSamples):null,
   signedSCISSORRoadTangentSampleCount:roadForwardSamples,
   negativeSCISSORTangentSpeedSamples:negativeRoadForwardSCISSORsamples,
   sourceSCISSORMostAdvancedGroundedUProxy:scissorUmax<0?null:round(scissorUmax),
   sourceSCISSORLeastGroundedUProxy:scissorUmin===Infinity?null:round(scissorUmin),
   originalB51MovingContactEvents:sourceB51Contacts,
   sourcePhysicalDesignMetadata:doc.stageForge.r15s3d2PhysicalStudy,
   true240HzQuarterSecondSampledTelemetry:timeline,
   sourceActualBrowserWebGL:false,humanControlSuccessCertified:false,
   artOrGameplayAdopted:false};
  output.cases[world][mode]=result;
  console.log('R15S3D2_TRUE_NATIVE_240HZ_FORWARD_SUPPORT',JSON.stringify({world,mode,
    status:result.trueNativeStatusAtEnd,end:result.trueTerminalOrCapSeconds,
    scissorSupportedS:result.actualSCISSORGroundedSeconds,
    nextRoadContact:result.nativeNextRoadContactEntered,
    nextRoadSupportedS:result.actualNextRoadGroundedSeconds,
    scissorU:result.sourceSCISSORMostAdvancedGroundedUProxy,
    meanRoadForwardMps:result.sampledSignedScissorRoadTangentSpeedMeanMps,
    negativeScissorSamples:result.negativeSCISSORTangentSpeedSamples,
    lowNativeHeadingSeconds:round(lowEngineForwardGroundedTicks*DT)}));
 }
}
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15S3D2_4_REAL_240HZ_TWO_ROAD_GRADE_PROGRESS_STUDIES.json',JSON.stringify(output,null,2)+'\n');
