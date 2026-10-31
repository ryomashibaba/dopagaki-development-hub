/**
 * R15S3D5: actual original Runner 240Hz four-case replay and observational
 * drive-frame/route/ground-contact decomposition. Nothing is injected into
 * the protected physics, routes, or physical B48/B51 geometry.
 *
 * IMPORTANT: forward changes and guide alignment are observations, not a
 * causal partition of the unexposed CCD collision impulse.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D3,FLIGHT_DESIGNS} from './p101-r15s3d3-physical-westward-recontact-candidates.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT,routeFrame} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';

const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const worlds=['true-pinch','pinch-switch'];
const modes=Object.keys(FLIGHT_DESIGNS);
const get=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1],'missing '+k);return process.argv[i+1];};
const old=JSON.parse(fs.readFileSync(get('--r15s3d4'),'utf8'));
const prefix=JSON.parse(fs.readFileSync(get('--r15s3b'),'utf8'));
assert.equal(old.sourceGameBlob,SHA);
assert.equal(old.sourcePhysicsHz,240);
assert.equal(prefix.sourceGameBlob,SHA);
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const mag=a=>Math.hypot(...a);
const minus=(a,b)=>a.map((v,i)=>v-b[i]);
const round=v=>Number(v.toFixed(6));
const vec=a=>a.map(round);
const horizontal=v=>[v[0],v[2]];
function angle(a,b) {
 const x=horizontal(a),y=horizontal(b),den=mag(x)*mag(y);
 if(den<1e-9)return null;
 return round(Math.acos(Math.max(-1,Math.min(1,dot(x,y)/den)))*180/Math.PI);
}
function bearing(p,guide) {
 const candidate=p.guides?.filter(x=>x.surface===guide?.road)
   .map(g=>({g,f:routeFrame(g.points,p.p)}))
   .sort((a,b)=>a.f.distance-b.f.distance)[0];
 const result=routeFrame(candidate?.g.points??p.doc.route,p.p);
 return {guideForwardXYZ:vec(result.forward),guideDistanceM:round(result.distance),
   guideIndex:result.index,guideSource:candidate?'generated-surface':'original-route'};
}
function near(a,b,tol=3e-6){return mag(minus(a,b))<=tol;}
const result={
 schema:'dopagaki.r15s3d5-four-original-source-guide-drive-frame-replay/1',
 sourceGameBlob:SHA,sourcePhysicsHz:240,sourceBallRadiusM:.65,
 sourceReference:'R15S3D4 genuine every-tick artifact plus R15S3B prefix artifact',
 observationalOnly:true,originalSourceModified:false,
 originalB48SevenPreserved:true,originalMovingB51Count:28,extraPhysicalColliders:0,
 originalRunnerRouteGuideAndSteeringUnchanged:true,
 ccdInstantaneousImpactNormalDirectlyMeasured:false,
 individualCollisionImpulseSeparated:false,
 sourceWebGLTested:false,humanFairnessEstablished:false,
 analysisMeaning:'Original Runner.forward and original guide frame from actual original 240Hz replay; per-tick velocity observations. Not a causal CCD collision impulse decomposition.',
 GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
 INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',
 officialArt:0,officialSlope2Meters:0,
 caseCount:4,cases:{}
};
for(const world of worlds){
 result.cases[world]={};
 const fixed=new Map(prefix.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory.map(v=>[v.tick,v]));
 for(const mode of modes){
  const doc=buildR15S3D3(world,mode);
  const immutable=JSON.stringify(doc);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  const player=new Runner(doc,compile(doc),0,52),plan=makeP96RoutePlan(doc,player);
  const surge=createA13SurgeState();
  const ref=old.cases[world][mode];
  const reference=new Map(ref.native240HzWindowSamples.map(s=>[s.tick,s]));
  const samples=[];
  let prefixes=0,sourceMatches=0,nextTicks=0,scissorTicks=0;
  const first=Math.round(30.75/DT),last=Math.round(33.4/DT);
  const next=doc.surfaces[3].id,scissor=doc.surfaces[2].id;
  for(let tick=1;tick<=Math.round(45/DT);tick++){
   if(player.status==='failed'||player.status==='finished')break;
   const input=tick<=Math.round(21.5/DT)
     ?p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8
     :p94NativeSteer(player,'corrective');
   assert.ok(Number.isFinite(input)&&input>=-1&&input<=1);
   const prePosition=[...player.p],preVelocity=[...player.v],preForward=[...player.forward];
   const preCollisions=player.collisions;
   const source=reference.get(tick);
   const guide=source?bearing(player,{road:source.nativePreStepRideableSupport?.road??null}):null;
   p101Step(player,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
   if(player.grounded&&player.surface===next)nextTicks++;
   if(player.grounded&&player.surface===scissor)scissorTicks++;
   if(fixed.has(tick)&&[Math.round(17/DT),Math.round(21.5/DT)].includes(tick)){
    const expectation=fixed.get(tick);
    assert.ok(near(player.p,expectation.xyz,1e-5),'protected B16 XYZ prefix');
    assert.ok(Math.abs(mag(player.v)-expectation.speedMps)<.000003,'protected prefix speed');
    assert.ok(Math.abs(input-expectation.steer)<.000003,'protected prefix steer');
    assert.equal(player.surface,expectation.physicalRoad);
    assert.equal(player.grounded,expectation.grounded);
    prefixes++;
   }
   if(tick>=first&&tick<=last){
    assert.ok(source,'original 240Hz R15S3D4 sample missing');
    assert.ok(near(prePosition,source.prePositionXYZ),'native pre XYZ mismatch');
    assert.ok(near(preVelocity,source.preVelocityXYZ),'native pre velocity mismatch');
    assert.ok(near(player.p,source.postPositionXYZ),'native post XYZ mismatch');
    assert.ok(near(player.v,source.postVelocityXYZ),'native post velocity mismatch');
    assert.ok(Math.abs(input-source.legalSteer)<.000001,'original legal steering mismatch');
    assert.equal(player.collisions-preCollisions,source.runnerCollisionCountDelta);
    assert.equal(player.status,source.runnerStatus);
    assert.equal(player.grounded,source.nativeRunnerGroundedFromPreStep);
    assert.equal(player.surface,source.nativeRunnerRoadFromPreStep);
    sourceMatches++;
    const postForward=[...player.forward];
    const support=source.nativePreStepRideableSupport;
    const postSupport=source.nativePostStepProspectiveRideableSupport;
    samples.push({
     tick,timeSeconds:round(player.time),legalNativeInput:round(input),
     preVelocityXYZ:vec(preVelocity),postVelocityXYZ:vec(player.v),
     actualOriginalForwardBeforeXYZ:vec(preForward),
     actualOriginalForwardAfterXYZ:vec(postForward),
     nativePreStepGrounded:player.grounded,nativePreStepRoad:player.surface,
     nativePreStepSupportNormalXYZ:support?.normalXYZ??null,
     nativePostStepProspectiveNormalXYZ:postSupport?.normalXYZ??null,
     nativeGuideForwardXYZ:guide.guideForwardXYZ,
     nativeGuideDistanceM:guide.guideDistanceM,
     nativeGuideIndex:guide.guideIndex,
     nativeGuideSource:guide.guideSource,
     nativeOriginalSteeringInput:round(input),
     sourceFixedCollisionCountDelta:source.runnerCollisionCountDelta,
     horizontalVelocityDirectionChangeOneTickDegrees:angle(preVelocity,player.v),
     horizontalForwardDirectionChangeOneTickDegrees:angle(preForward,postForward),
     velocityGuideAngleBeforeDegrees:angle(preVelocity,guide.guideForwardXYZ),
     forwardGuideAngleBeforeDegrees:angle(preForward,guide.guideForwardXYZ),
     nativeSignedForwardVelocityMps:round(dot(player.v,postForward)),
     nativeSignedGuideVelocityMps:round(dot(player.v,guide.guideForwardXYZ)),
     originalR15S3D4PositionVelocityParity:true
    });
   }
  }
  assert.equal(prefixes,2);
  assert.equal(sourceMatches,ref.native240HzWindowSamples.length);
  assert.equal(JSON.stringify(doc),immutable);
  assert.equal(player.status,ref.trueNativeStatus);
  assert.ok(Math.abs(player.time-ref.terminalSeconds)<.000003);
  assert.ok(Math.abs(nextTicks*DT-ref.nextRoadGroundedSeconds)<.000003);
  assert.ok(Math.abs(scissorTicks*DT-ref.scissorGroundedSeconds)<.000003);
  const checkpoints=[Math.round(31.4/DT),Math.round(31.6/DT)];
  const a=samples.find(s=>s.tick===checkpoints[0]),b=samples.find(s=>s.tick===checkpoints[1]);
  assert.ok(a&&b);
  const summary={
   horizontalBallVelocityRotation31p4To31p6Degrees:angle(a.postVelocityXYZ,b.postVelocityXYZ),
   horizontalPlayerForwardRotation31p4To31p6Degrees:angle(a.actualOriginalForwardAfterXYZ,b.actualOriginalForwardAfterXYZ),
   horizontalGuideRotation31p4To31p6Degrees:angle(a.nativeGuideForwardXYZ,b.nativeGuideForwardXYZ),
   sourcePreStepRoadAt31p4:a.nativePreStepRoad,
   sourcePreStepRoadAt31p6:b.nativePreStepRoad,
   guideDistanceMAt31p4:a.nativeGuideDistanceM,
   guideDistanceMAt31p6:b.nativeGuideDistanceM,
   originalCollisionCountAt31p4:a.sourceFixedCollisionCountDelta,
   originalCollisionCountAt31p6:b.sourceFixedCollisionCountDelta,
   noCcdCausalAttribution:true
  };
  result.cases[world][mode]={
   world,mode,actualSourcePrefixChecks:prefixes,originalR15S3D4EveryWindowTickMatched:sourceMatches,
   nativeActualStatus:player.status,terminalOrCapSeconds:round(player.time),
   actualScissorGroundedSeconds:round(scissorTicks*DT),
   actualNextRoadGroundedSeconds:round(nextTicks*DT),
   sourceR15S3D4TerminalAndSupportParity:true,
   countNative240HzSamples:samples.length,
   intervalSummary:summary,native240HzGuidanceObservations:samples
  };
  console.log('R15S3D5_ORIGINAL_DRIVE_FRAME',JSON.stringify({world,mode,matched:sourceMatches,status:player.status,summary}));
 }
}
fs.mkdirSync(get('--out'),{recursive:true});
fs.writeFileSync(get('--out')+'/R15S3D5_FOUR_CASE_ORIGINAL_GUIDANCE_DRIVE_FRAME.json',
 JSON.stringify(result,null,2)+'\n');
