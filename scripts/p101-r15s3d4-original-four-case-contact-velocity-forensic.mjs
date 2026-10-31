/** R15S3D4: observational 240Hz forensic replay of R15S3D3's four exact cases.
 * No edits to physical geometry, Runner, B51, input or original game source.
 * Distinguish sampled rideable pre-step contact normals from CCD impact normals:
 * the latter are NOT exposed through the unmodified Runner API.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D3,FLIGHT_DESIGNS} from './p101-r15s3d3-physical-westward-recontact-candidates.mjs';
import {compile,contacts} from '../private/reference_only/director/collision.js';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const worlds=['true-pinch','pinch-switch'], modes=Object.keys(FLIGHT_DESIGNS);
const arg=k=>{const i=process.argv.indexOf(k);assert.ok(i>=0&&process.argv[i+1],k);return process.argv[i+1]};
const old=JSON.parse(fs.readFileSync(arg('--r15s3d3'),'utf8'));
const ref=JSON.parse(fs.readFileSync(arg('--r15s3b'),'utf8'));
assert.equal(old.sourceGameBlob,SHA);assert.equal(ref.sourceGameBlob,SHA);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const len=a=>Math.hypot(...a);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const round=(v)=>Number(v.toFixed(6));
const vec=a=>a.map(round);
const same=(a,b,tol=1e-5)=>len(sub(a,b))<=tol;
const WINDOW_START=Math.round(30.75/DT),WINDOW_END=Math.round(33.40/DT);
const selectSupport=(world,p)=>contacts(world,p,RADIUS).filter(c=>c.triangle.rideable&&c.normal[1]>.15).sort((a,b)=>b.normal[1]-a.normal[1])[0]??null;
const represent=c=>c?{road:c.triangle.surface,part:c.triangle.part,
 normalXYZ:vec(c.normal),triangleNormalXYZ:vec(c.triangle.normal),
 distanceM:round(c.distance),pointXYZ:vec(c.point)}:null;
const output={schema:'dopagaki.r15s3d4-observational-prestep-support-velocity-discontinuity/1',
 sourceGameBlob:SHA,sourcePhysicsHz:240,sourceBallRadiusM:RADIUS,
 sameFourR15S3D3GeometryAndOriginalLegalInput:true,originalSourceChanged:false,
 trueCrownAndEarlyScissorFrozen:true,originalB51Unmodified:28,extraGameColliders:0,
 observationalOnly:true,runnerCcdImpactNormalDirectlyAvailable:false,
 measuredNormalMeaning:'preStepRideableSupportNormal from original contacts(world,player.p,RADIUS), same pre-step selection as Runner; NOT CCD impact normal',
 measuredVelocityChangeMeaning:'total per-tick native velocity difference after full Runner step, including gravity, steering, contact and other forces; NOT an isolated collision impulse',
 sampleWindowSeconds:[30.75,33.4],
 sourceActualBrowserWebGL:false,humanFairnessEstablished:false,officialArt:0,officialSlope2Meters:0,
 GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD',cases:{}};
for(const world of worlds){
 output.cases[world]={};
 const baseline=new Map(ref.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory.map(x=>[x.tick,x]));
 for(const mode of modes){
  const doc=buildR15S3D3(world,mode),frozen=JSON.stringify(doc),compiled=compile(doc);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  const player=new Runner(doc,compiled,0,52),plan=makeP96RoutePlan(doc,player),surge=createA13SurgeState();
  const samples=[];let prefixChecks=0,actualNextTicks=0,actualScissorTicks=0;
  let peakDelta={deltaVelocityMps:0,tick:null},peakHeading={degrees:0,tick:null};
  const nextRoad=doc.surfaces[3].id,scissor=doc.surfaces[2].id;
  for(let tick=1;tick<=Math.round(45/DT);tick++){
   if(player.status==='failed'||player.status==='finished')break;
   const input=tick<=Math.round(21.5/DT)
    ?p96DodgeSteer(player,plan,'early-soft',movingObstaclePose).input/4.8
    :p94NativeSteer(player,'corrective');
   assert.ok(Number.isFinite(input)&&input>=-1&&input<=1);
   const inWindow=tick>=WINDOW_START&&tick<=WINDOW_END;
   const beforeP=[...player.p],beforeV=[...player.v],beforeCollisions=player.collisions;
   const preSupport=inWindow?selectSupport(compiled,beforeP):null;
   p101Step(player,input,'OVERDRIVE',{forwardScale:p101A13ForwardScale(player,surge),collisionRecovery:false});
   const grounded=Boolean(player.grounded&&player.surface);
   if(grounded&&player.surface===nextRoad)actualNextTicks++;
   if(grounded&&player.surface===scissor)actualScissorTicks++;
   if([Math.round(17/DT),Math.round(21.5/DT)].includes(tick)){
    const expected=baseline.get(tick);assert.ok(expected,'frozen original B16 checkpoint missing');
    assert.ok(same(player.p,expected.xyz),'original prefix position regression');
    assert.ok(Math.abs(len(player.v)-expected.speedMps)<.000003,'original speed regression');
    assert.ok(Math.abs(input-expected.steer)<.000003,'original input regression');
    assert.equal(player.surface,expected.physicalRoad);assert.equal(grounded,expected.grounded);
    prefixChecks++;
   }
   if(inWindow){
    const deltaV=len(sub(player.v,beforeV)),normV=len(beforeV)*len(player.v);
    const headingDeg=normV>1e-8?Math.acos(Math.max(-1,Math.min(1,dot(beforeV,player.v)/normV)))*180/Math.PI:0;
    if(deltaV>peakDelta.deltaVelocityMps)peakDelta={deltaVelocityMps:round(deltaV),tick};
    if(headingDeg>peakHeading.degrees)peakHeading={degrees:round(headingDeg),tick};
    samples.push({tick,timeSeconds:round(player.time),legalSteer:round(input),
     prePositionXYZ:vec(beforeP),postPositionXYZ:vec(player.p),
     preVelocityXYZ:vec(beforeV),postVelocityXYZ:vec(player.v),
     nativePreStepRideableSupport:represent(preSupport),
     nativePostStepProspectiveRideableSupport:represent(selectSupport(compiled,player.p)),
     nativeRunnerGroundedFromPreStep:grounded,nativeRunnerRoadFromPreStep:player.surface,
     velocityChangeMps:round(deltaV),wholeStepVelocityChangePerSecondMps2:round(deltaV/DT),
     headingVelocityChangeDegrees:round(headingDeg),
     runnerCollisionCountDelta:player.collisions-beforeCollisions,runnerStatus:player.status});
   }
  }
  assert.equal(prefixChecks,2);assert.equal(JSON.stringify(doc),frozen);
  const prior=old.cases[world][mode];
  assert.equal(player.status,prior.trueNativeStatusAtEnd,'replay terminal status parity');
  assert.ok(Math.abs(player.time-prior.trueTerminalOrCapSeconds)<.000003,'replay terminal time parity');
  assert.ok(Math.abs(actualNextTicks*DT-prior.actualNextRoadGroundedSeconds)<.000003,'next road support parity');
  assert.ok(Math.abs(actualScissorTicks*DT-prior.actualSCISSORGroundedSeconds)<.000003,'scissor support parity');
  const b51=player.events.filter(e=>['moving-contact','moving-crush','moving-unsafe'].includes(e.type)).length;
  assert.equal(b51,prior.originalB51MovingContactEvents,'original dynamic B51 event parity');
  output.cases[world][mode]={world,mode,originalPrefixParityCount:prefixChecks,
   sourceR15S3D3StatusParity:true,sourceR15S3D3TerminalTimeParity:true,
   sourceR15S3D3RoadSupportParity:true,sourceR15S3D3B51ContactParity:true,
   trueNativeStatus:player.status,terminalSeconds:round(player.time),
   scissorGroundedSeconds:round(actualScissorTicks*DT),
   nextRoadGroundedSeconds:round(actualNextTicks*DT),
   originalB51ContactEvents:b51,windowSampleCount:samples.length,
   peakWholeStepVelocityDelta:peakDelta,peakWholeStepHeadingDelta:peakHeading,
   native240HzWindowSamples:samples};
  console.log('R15S3D4_SOURCE_FORENSIC',JSON.stringify({world,mode,status:player.status,
   supportedNextSeconds:round(actualNextTicks*DT),peakDelta,peakHeading,windowTicks:samples.length}));
 }
}
fs.mkdirSync(arg('--out'),{recursive:true});
fs.writeFileSync(arg('--out')+'/R15S3D4_ORIGINAL_FOUR_CASE_SUPPORT_AND_VELOCITY_FORENSIC.json',JSON.stringify(output,null,2)+'\n');
