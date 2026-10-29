/** R15S3D6R1: 1 actual B48 downstream runout x 2 original worlds. TRUE original 240Hz
 * Runner, collision, guides, A13, P96/P94 legal input and all 28 B51 machines.
 * Recording gameplay failure is legitimate; no simulation success implied.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D6R1} from './p101-r15s3d6r1-real-lower-b48-runout-candidate.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,routeFrame} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const args=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1],k);return process.argv[i+1];};
const prefix=JSON.parse(fs.readFileSync(args('--r15s3b'),'utf8'));
const d4=JSON.parse(fs.readFileSync(args('--r15s3d6'),'utf8'));
assert.equal(prefix.sourceGameBlob,SHA);
assert.equal(d4.sourceGameBlob,SHA);
const worlds=['true-pinch','pinch-switch'];
const modes=['B_RUNOUT_SUPPORT'];
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mag=a=>Math.hypot(...a);
const round=x=>Number(x.toFixed(6));
const vec=a=>a.map(round);
function angle(a,b){
 const va=[a[0],a[2]],vb=[b[0],b[2]],den=mag(va)*mag(vb);
 return den<1e-9?null:round(180/Math.PI*Math.acos(Math.max(-1,Math.min(1,dot(va,vb)/den))));
}
function tangent(track,p){
 let best=null;
 for(let i=0;i<track.length-1;i++){
  const a=track[i],b=track[i+1],d=sub(b,a),ll=dot(d,d);
  const t=Math.max(0,Math.min(1,dot(sub(p,a),d)/(ll||1)));
  const q=a.map((x,k)=>x+t*d[k]),dist=mag(sub(p,q));
  if(!best||dist<best.distance)best={distance:dist,u:(i+t)/(track.length-1),dir:d.map(x=>x/(mag(d)||1))};
 }
 return best;
}
const output={
 schema:'dopagaki.r15s3d6r1-genuine-B48-downstream-two-original-240hz-trials/1',
 originalSourceBlob:SHA,sourceRunnerHz:240,sourceRadiusM:.65,actualNativeCases:2,
 genuinePhysicalB48Changed:true,sourceOriginalPhysicalRunnerUnchanged:true,
 noHiddenCollisionOrTeleport:true,roadCount:7,movingB51Count:28,
 reusedOriginal17And21p5Prefix:true,
 R15S3D6BaselineBUsedOnlyAsComparison:true,
 standardActualCameraRendered:false,actualBrowserWebGLTested:false,humanFairnessEstablished:false,
 sourceTechnicalExecution:'PENDING',officialArt:0,officialSlope2Meters:0,
 GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
 INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',cases:{}
};
for(const world of worlds){
 output.cases[world]={};
 const before=new Map(prefix.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory.map(x=>[x.tick,x]));
 for(const mode of modes){
  const course=buildR15S3D6R1(world),snapshot=JSON.stringify(course);
  assert.equal(course.surfaces.length,7);
  assert.equal(course.movingObstacles.length,28);
  const player=new Runner(course,compile(course),0,52),plan=makeP96RoutePlan(course,player),surge=createA13SurgeState();
  const scissor=course.surfaces[2].id,lower=course.surfaces[3].id;
  const tracks=[2,3].map(i=>Array.from({length:151},(_,j)=>sample(course.surfaces[i],j/150,.5)));
  let prefixPass=0,scissorGroundTicks=0,nextGroundTicks=0;
  let below25=0,reverseForward=0,nextRoadReverseTicks=0,lateGroundTicks=0;
  let firstNext=null,lastNext=null,lastScissor=null,previousContact=null,firstAirAfter26=null;
  let maxV=0,largestChange={deltaVelocityMps:0,tick:null,collisionDelta:null,sourceRoad:null};
  let largestHorizontalDirectionChange={degrees:0,tick:null};
  let signedNextTotal=0,nextGroundSignedSamples=0,negativeNextTangentSamples=0;
  let maxNextU=-1,transitions=[],timeline=[],windowSamples={};
  for(let tick=1;tick<=Math.round(45/DT);tick++){
   if(player.status==='failed'||player.status==='finished')break;
   const steer=tick<=Math.round(21.5/DT)
    ?p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8
    :p94NativeSteer(player,'corrective');
   assert.ok(Number.isFinite(steer)&&steer>=-1&&steer<=1);
   const priorV=[...player.v],priorForward=[...player.forward],priorPosition=[...player.p],collisionBefore=player.collisions;
   p101Step(player,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
   const grounded=Boolean(player.grounded&&player.surface),key=grounded?player.surface:null;
   const speed=mag(player.v),forward=dot(player.v,player.forward);
   maxV=Math.max(maxV,speed);
   if([Math.round(17/DT),Math.round(21.5/DT)].includes(tick)){
    const ref=before.get(tick);
    assert.ok(ref,'missing actual original B16 reference');
    assert.ok(mag(sub(player.p,ref.xyz))<1e-5,'original CROWN B16 prefix XYZ regression');
    assert.ok(Math.abs(speed-ref.speedMps)<.000003,'original B16 speed regression');
    assert.ok(Math.abs(steer-ref.steer)<.000003,'original B16 legal input regression');
    assert.equal(player.surface,ref.physicalRoad);
    assert.equal(grounded,ref.grounded);
    prefixPass++;
   }
   if(grounded){
    if(player.surface===scissor){scissorGroundTicks++;lastScissor={tick,timeSeconds:round(player.time),xyz:vec(player.p)};}
    if(player.surface===lower){
     nextGroundTicks++;
     const nearest=tangent(tracks[1],player.p),signed=dot(player.v,nearest.dir);
     signedNextTotal+=signed;nextGroundSignedSamples++;
     if(signed<0)negativeNextTangentSamples++;
     maxNextU=Math.max(maxNextU,nearest.u);
     if(forward<0)nextRoadReverseTicks++;
     const spot={tick,timeSeconds:round(player.time),xyz:vec(player.p),nativeTotalSpeedMps:round(speed),
      nativeForwardSpeedMps:round(forward),realRoadSignedTangentSpeedMps:round(signed),
      nearestRoadUProxy:round(nearest.u),nearestCenterline3dDistanceM:round(nearest.distance)};
     if(!firstNext)firstNext=spot;
     lastNext=spot;
    }
    if(player.time>=23&&forward<25)below25++;
    if(player.time>=23&&forward<0)reverseForward++;
    if(player.time>=23)lateGroundTicks++;
   }
   if(tick>=Math.round(26/DT)&&previousContact!==null&&key===null&&!firstAirAfter26){
    firstAirAfter26={tick,timeSeconds:round(player.time)};
   }
   if(tick>=Math.round(23/DT)){
    const dv=mag(sub(player.v,priorV)),a=angle(priorV,player.v);
    if(dv>largestChange.deltaVelocityMps)largestChange={
      deltaVelocityMps:round(dv),tick,timeSeconds:round(player.time),
      collisionDelta:player.collisions-collisionBefore,sourceRoad:player.surface};
    if(a!==null&&a>largestHorizontalDirectionChange.degrees)largestHorizontalDirectionChange={degrees:a,tick};
    if(previousContact!==key){
     transitions.push({tick,timeSeconds:round(player.time),from:previousContact,to:key,
      positionXYZ:vec(player.p),nativeVelocityXYZ:vec(player.v),nativeSpeedMps:round(speed),
      originalForwardXYZ:vec(player.forward),fixedCollisionDelta:player.collisions-collisionBefore});
    }
    if(tick%24===0||previousContact!==key||player.status!=='running'){
     let nearest=null;
     if(key===scissor||key===lower)nearest=tangent(tracks[key===scissor?0:1],player.p);
     timeline.push({tick,timeSeconds:round(player.time),status:player.status,sourceGroundRoad:key,
      positionXYZ:vec(player.p),velocityXYZ:vec(player.v),forwardXYZ:vec(player.forward),
      actualNativeSpeedMps:round(speed),signedNativeForwardSpeedMps:round(forward),
      legalInput:round(steer),trueB48NearestCenterlineUProxy:nearest?round(nearest.u):null,
      signedSourceRoadTangentMps:nearest?round(dot(player.v,nearest.dir)):null,
      horizontalBallHeadingChangeOneTickDegrees:a,
      nativeFixedCollisionCountDelta:player.collisions-collisionBefore});
    }
   }
   if([Math.round(31.4/DT),Math.round(31.6/DT)].includes(tick)){
    const local=player.guides?.filter(g=>g.surface===player.surface).map(g=>({g,f:routeFrame(g.points,player.p)}))
      .sort((a,b)=>a.f.distance-b.f.distance)[0];
    const guide=routeFrame(local?.g.points??course.route,player.p);
    windowSamples[tick]={tick,timeSeconds:round(player.time),sourceGroundRoad:key,
      velocityXYZ:vec(player.v),nativeForwardXYZ:vec(player.forward),
      nativeGuideForwardXYZ:vec(guide.forward),nativeGuideSource:local?'generated-surface':'original-route',
      guideDistanceM:round(guide.distance)};
   }
   previousContact=key;
  }
  assert.equal(prefixPass,2);
  assert.equal(JSON.stringify(course),snapshot,'original trial course mutated');
  const terminal=player.status;
  const b51=player.events.filter(x=>['moving-contact','moving-crush','moving-unsafe'].includes(x.type)).length;
  const a=windowSamples[Math.round(31.4/DT)],b=windowSamples[Math.round(31.6/DT)];
  const orientation=a&&b?{
   ballHorizontalDirection31p4To31p6Degrees:angle(a.velocityXYZ,b.velocityXYZ),
   actualForwardHorizontal31p4To31p6Degrees:angle(a.nativeForwardXYZ,b.nativeForwardXYZ),
   guideHorizontalDirection31p4To31p6Degrees:angle(a.nativeGuideForwardXYZ,b.nativeGuideForwardXYZ),
   samples:[a,b]
  }:null;
  const baseline=d4.cases[world].B_LOW_ANGLE_RECONTACT;
  const compared=baseline.maximumTotalOne240HzTickVelocityChangeAfter23Seconds.deltaVelocityMps;
  const current={
   world,mode,originalPrefixChecks:prefixPass,
   geometry:course.stageForge.r15s3d6r1,
   trueNativeTerminalState:terminal,terminalOrCapSeconds:round(player.time),
   trueFinishedAllSevenRoads:terminal==='finished',
   nativeFailureReason:player.failure?.reason??null,
   nativeActualMaxSpeedMps:round(maxV),
   actualScissorGroundedSeconds:round(scissorGroundTicks*DT),
   actualNextRoadGroundedSeconds:round(nextGroundTicks*DT),
   actualNextRoadFirstContact:firstNext,actualNextRoadLastContact:lastNext,
   lastScissorContact:lastScissor,firstFreeFlightAfter26:firstAirAfter26,
   lateGroundedTicks:lateGroundTicks,
   lateGroundedNativeForwardBelow25Ticks:below25,
   lateGroundedNativeForwardNegativeTicks:reverseForward,
   actualNextRoadNativeForwardNegativeTicks:nextRoadReverseTicks,
   nextRoadMeanSignedGeometricTangentSpeedMps:nextGroundSignedSamples?round(signedNextTotal/nextGroundSignedSamples):null,
   nextRoadNegativeGeometricTangentTicks:negativeNextTangentSamples,
   nextRoadAdvancedUProjectionProxy:maxNextU>=0?round(maxNextU):null,
   originalMovingB51ContactEvents:b51,
   maximumTotalOne240HzTickVelocityChangeAfter23Seconds:largestChange,
   largestHorizontalVelocityHeadingChangeOne240HzTickAfter23Seconds:largestHorizontalDirectionChange,
   R15S3D6BaselineBMaxVelocityDeltaForReferenceMps:round(compared),
   comparisonOnly_CannotClaimImpactBetterIfFirstLandingTimeDifferent:true,
   compare31p4To31p6:orientation,
   sourceContactTransitions:transitions,actualNativeTenHzPlusTransitionTimeline:timeline,
   standardGameWebGLTested:false,humanGameplayPassed:false,officialArtAdopted:false
  };
  output.cases[world][mode]=current;
  console.log('R15S3D6R1_NATIVE_REAL',JSON.stringify({world,mode,status:terminal,end:current.terminalOrCapSeconds,
    scissorContactSeconds:current.actualScissorGroundedSeconds,
    nextContactSeconds:current.actualNextRoadGroundedSeconds,
    nextSignedMps:current.nextRoadMeanSignedGeometricTangentSpeedMps,
    maxDelta:largestChange,angle:orientation?.ballHorizontalDirection31p4To31p6Degrees??null,
    movingB51Events:b51}));
 }
}
output.sourceTechnicalExecution='TWO_NATIVE_REPLAY_COMPLETED_UNDER_SOURCE_ONLY_REQUIREMENTS';
fs.mkdirSync(args('--out'),{recursive:true});
fs.writeFileSync(args('--out')+'/R15S3D6R1_TWO_GENUINE_NATIVE_B48_DOWNSTREAM_RUNOUT.json',
 JSON.stringify(output,null,2)+'\n');
