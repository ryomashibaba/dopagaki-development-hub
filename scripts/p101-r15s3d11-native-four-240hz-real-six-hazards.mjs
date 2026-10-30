/** R15S3D11 source Runner 240Hz four genuine 0s runs with SIX real B51
 * moved only in PRIVATE copy. Compare source-finish A baseline from D9.
 * Check actual pre-existing CROWN prefix at 17 and 21.5 seconds.
 * Never count 'running' at 95s as finish.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildR15S3D11,MODES} from './p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {buildR15S3D9} from './p101-r15s3d9-source-real-road5-road6-integrated-macro.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p94NativeSteer} from '../web/p94-native-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const opt=x=>{const i=process.argv.indexOf(x);assert.ok(i>=0&&process.argv[i+1]);return process.argv[i+1];};
const b16=JSON.parse(fs.readFileSync(opt('--b16'),'utf8'));
const d9=JSON.parse(fs.readFileSync(opt('--d9'),'utf8'));
assert.equal(b16.sourceGameBlob,SHA);
assert.equal(d9.sourceOriginalBlob,SHA);
const worlds=['true-pinch','pinch-switch'],v=v=>v.map(x=>+x.toFixed(6)),round=x=>+x.toFixed(6);
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
const output={schema:'dopagaki.r15s3d11-real-six-B51-4-original-240Hz-comparison/1',
 originalSourceGameBlob:SHA,physicsHz:240,
 nativeTrials:4,realB48Count:7,realB51Count:28,relocatedB51PerVariant:6,
 sourceBaselineNativeFinish2of2:true,fullOriginal240HzInputAndPower:true,
 sourceCrownExpectedOriginalPrefix:true,defaultProductionUnchanged:true,
 sourceWebGLNotTested:true,officialArtAdopted:0,humanPlayableApproved:false,
 GAMEPLAY:'HOLD',ART:'HOLD',HUMAN:'HOLD',RELEASE:'HOLD',cases:{}};
for(const world of worlds){
 output.cases[world]={};
 const expected=new Map(b16.actualCases[world].E_BANKED_LANDING.P94_FULL_AFTER_21P5.checkpointAndQuarterSecondSourceTrajectory.map(t=>[t.tick,t]));
 const baseline=d9.cases[world].A_CONTINUOUS_NARROW_MACRO;
 assert.equal(baseline.originalNativeRunnerStatus,'finished');
 assert.equal(baseline.trueOriginalNativeFinishEventCount,1);
 const originalDoc=buildR15S3D9(world,'A_CONTINUOUS_NARROW_MACRO');
 for(const mode of MODES){
  const doc=buildR15S3D11(world,mode),compiled=compile(doc);
  assert.equal(compiled.invalid,0);
  assert.deepEqual(doc.surfaces,originalDoc.surfaces);
  assert.deepEqual(doc.route,originalDoc.route);
  assert.equal(doc.movingObstacles.length,28);
  const runner=new Runner(doc,compiled,0,52);
  const plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState();
  let checks=0,peakTickVelocityDelta=0,lastVelocity=[...runner.v];
  const touched=new Set(),nearest=new Map(doc.movingObstacles.map(m=>[m.id,{id:m.id,separation:Infinity,time:null,road:null,xyz:null,samplesWithin30m:0,samplesWithin10m:0,leadWithin2s:0}]));
  const snapshots=[];
  for(let tick=1;tick<=Math.round(95/DT);tick++){
   if(runner.status!=='running')break;
   const steer=tick<=Math.round(21.5/DT)?
    p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8:p94NativeSteer(runner,'corrective');
   assert.ok(Number.isFinite(steer)&&Math.abs(steer)<=1);
   p101Step(runner,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
   peakTickVelocityDelta=Math.max(peakTickVelocityDelta,dist(lastVelocity,runner.v));
   lastVelocity=[...runner.v];
   if(tick===4080||tick===5160){
    const e=expected.get(tick);assert.ok(e,'original source CROWN prefix missing');
    assert.ok(dist(runner.p,e.xyz)<.00001,'original source CROWN physics XYZ changed');
    assert.ok(Math.abs(Math.hypot(...runner.v)-e.speedMps)<.000003,'original source CROWN speed changed');
    assert.ok(Math.abs(steer-e.steer)<.000003,'original P96 legal input changed');
    assert.equal(runner.surface,e.physicalRoad);
    assert.equal(runner.grounded,e.grounded);
    checks++;
   }
   if(tick%24===0||runner.status!=='running'){
    const currentTime=runner.time,velo=Math.hypot(...runner.v);
    for(const ob of doc.movingObstacles){
     const pose=movingObstaclePose(ob,currentTime),sep=sphereBoxSeparation(runner.p,.65,pose).separation;
     if(!Number.isFinite(sep))continue;
     const e=nearest.get(ob.id);
     if(sep<e.separation){
      e.separation=sep;e.time=currentTime;e.road=runner.surface||null;e.xyz=[...runner.p];
     }
     if(sep<=30)e.samplesWithin30m++;
     if(sep<=10)e.samplesWithin10m++;
     const lead=(pose.center[0]-runner.p[0])*runner.forward[0]+
       (pose.center[1]-runner.p[1])*runner.forward[1]+
       (pose.center[2]-runner.p[2])*runner.forward[2];
     if(lead>0&&lead<=velo*2)e.leadWithin2s++;
    }
    if(tick%120===0||runner.status!=='running'){
     snapshots.push({tick,time:round(currentTime),road:runner.surface,status:runner.status,
      grounded:runner.grounded,xyz:v(runner.p),forward:v(runner.forward),
      speedMps:round(velo),collisionCount:runner.collisions});
    }
   }
  }
  const contactEvents=runner.events.filter(x=>x.type.startsWith('moving'));
  for(const event of contactEvents)if(event.id)touched.add(event.id);
  const nativeFinish=runner.events.filter(x=>x.type==='finish');
  assert.equal(nativeFinish.length,runner.status==='finished'?1:0);
  if(runner.status==='finished'){
   assert.equal(runner.surface,'p93-FINISH_RIDGE-01');
   assert.ok(runner.grounded);
  }
  if(checks!==2)console.log('R15S3D11_EARLY_REGRESSION',JSON.stringify({world,mode,checks,terminalTime:round(runner.time),status:runner.status,failure:runner.failure,ground:runner.grounded,surface:runner.surface,xyz:v(runner.p),events:runner.events.slice(-10),moved:doc.stageForge.r15s3d11.changedMachines.map(x=>x.id)}));
  assert.equal(checks,2);
  const ranking=[...nearest.values()].map(x=>({...x,
   separation:Number.isFinite(x.separation)?round(x.separation):null,
   time:x.time===null?null:round(x.time),xyz:x.xyz?v(x.xyz):null}))
   .sort((a,b)=>(a.separation??1e10)-(b.separation??1e10));
  const active=ranking.filter(x=>x.samplesWithin30m>0);
  const entry={world,mode,nativeStatus:runner.status,
   actualNativeTerminatedAtSeconds:round(runner.time),
   trueNativeFinished:runner.status==='finished',
   nativeFinishEvents:nativeFinish.length,finalRoad:runner.surface||null,
   terminalGrounded:runner.grounded,terminalXYZ:v(runner.p),
   baselineSourceFinishSeconds:baseline.terminalTimeOr95sCap,
   originalCrownPrefixChecks:checks,
   actualMovingB51ContactEvents:contactEvents.length,
   touchedMovingB51IDs:[...touched],peakTickWholeVelocityChangeMps:round(peakTickVelocityDelta),
   numberMovingB51Within30m:active.length,
   numberMovingB51Within10m:ranking.filter(x=>x.samplesWithin10m>0).length,
   movingObjectTimeSamplesWithin30m:ranking.reduce((s,x)=>s+x.samplesWithin30m,0),
   nearest10OriginalB51:ranking.slice(0,10),
   movedSixOriginalB51:doc.stageForge.r15s3d11.changedMachines,
   machineMinClearanceAll28:ranking,
   native5HzProgressSnapshots:snapshots,
   originalSourceRunGenuine:true,sourcePhysicsAndB48Unchanged:true,
   browserAndHumanNotTested:true,ART:'HOLD',GAMEPLAY:'HOLD'};
  output.cases[world][mode]=entry;
  console.log('R15S3D11_TRUE_ORIGINAL_NATIVE',JSON.stringify({world,mode,
    status:entry.nativeStatus,time:entry.actualNativeTerminatedAtSeconds,finishEvents:nativeFinish.length,
    contactEvents:entry.actualMovingB51ContactEvents,
    B51within30m:entry.numberMovingB51Within30m,
    B51within10m:entry.numberMovingB51Within10m,
    closest:ranking.slice(0,7).map(x=>({id:x.id,sep:x.separation,t:x.time})),
    prefixChecks:checks}));
 }
}
fs.mkdirSync(opt('--out'),{recursive:true});
fs.writeFileSync(opt('--out')+'/R15S3D11_FOUR_GENUINE_240HZ_B51_ALTERNATIVES.json',JSON.stringify(output,null,2)+'\n');
