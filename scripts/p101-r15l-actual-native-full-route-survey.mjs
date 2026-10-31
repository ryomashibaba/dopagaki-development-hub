/**
 * R15L: full available ORIGINAL 240Hz start-00 P96 camera source replay.
 *
 * Extends observations outward beyond R1's 11-17s WITHOUT altering
 * collision, steering, dynamics, camera, sources or any production output.
 * Actual runner terminal state is recorded, never fabricate 52s completion.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {buildEarlyTimeline} from './p101-w9c2-g4e7dz-r6d-r1-early-native.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';

const SHA='af076d67492a677d2235e4730aef8cdf4808e106';
const ROADS=['true-pinch','pinch-switch'];
const hz=240,MAX_SECONDS=52;
const times=Array.from({length:MAX_SECONDS*2},(_,i)=>(i+1)/2);
const round=(v,n=6)=>Number(v.toFixed(n));
const diff=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
const identity=(s)=>'t'+String(Math.round(s*100)).padStart(4,'0');

export function replayFullActualNative(road){
 assert.ok(ROADS.includes(road));
 assert.ok(Math.abs(1/DT-hz)<1e-6);
 const doc=generateG4E7BC(road,'rollDeck');
 const frozen=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);
 assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 assert.equal(doc.stageForge.productionPromoted,false);
 const r=new Runner(doc,compile(doc),0,52);
 const p=makeP96RoutePlan(doc,r),surge=createA13SurgeState();
 let camera=createCameraState(r.forward);
 let next=0,firstOffroad=null,offroadTicks=0,maximumCollisionCount=0;
 let terminalAt=null,terminationReason='MAX_52S_OBSERVATION_LIMIT_NOT_CERTIFIED_FINISH';
 const frames=[];
 for(let tick=1;tick<=Math.round(MAX_SECONDS/DT);tick++){
  if(r.status==='failed'||r.status==='finished'){
   terminationReason='ORIGINAL_RUNNER_'+r.status.toUpperCase();
   terminalAt=round(r.time);
   break;
  }
  const steer=p96DodgeSteer(r,p,'early-soft',movingObstaclePose).input/4.8;
  p101Step(r,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(r,surge),collisionRecovery:false});
  camera=advanceCamera(camera,r.forward,DT);
  const activeRoad=Boolean(r.surface||r.lastSurface);
  if(!r.grounded||!activeRoad){
   offroadTicks++;
   if(firstOffroad===null)firstOffroad=round(r.time);
  }
  maximumCollisionCount=Math.max(maximumCollisionCount,r.collisions);
  if(next>=times.length||r.time+1e-6<times[next])continue;
  const pose=capturePose(r),view=viewForPose(pose,camera);
  const movers=doc.movingObstacles.map(ob=>{
   const m=movingObstaclePose(ob,r.time);
   assert.ok(m.center.every(Number.isFinite)&&m.halfSize.every(z=>Number.isFinite(z)&&z>0));
   return {id:m.id,type:m.type,center:[...m.center],halfSize:[...m.halfSize],yawRadians:m.yawRadians,enabled:m.enabled};
  });
  assert.equal(movers.length,28);
  frames.push({id:identity(times[next]),tick,seconds:round(r.time),
   eye:[...view.eye],front:[...view.front],
   playerPosition:[...pose.position],speedMps:round(Math.hypot(...r.v),5),
   grounded:r.grounded,physicalRoad:r.surface||r.lastSurface,
   collisions:r.collisions,steer:round(steer,7),moving:movers,
   originalSource:'ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'});
  next++;
 }
 // Genuine reference: same P96 path/camera ticks at 11.0, 11.5 ... 17.0.
 const prior=buildEarlyTimeline(road);
 const overlap=[];
 for(const old of prior.frames){
  const cur=frames.find(f=>f.id===old.id);
  assert.ok(cur,'R15L original end before R1 proven camera '+old.id);
  for(const key of ['eye','front','playerPosition']){
   assert.ok(diff(cur[key],old[key])<1e-5,['native-camera-drift',road,old.id,key]);
  }
  assert.equal(cur.grounded,old.grounded);
  assert.equal(cur.physicalRoad,old.physicalRoad);
  assert.equal(cur.collisions,old.collisions);
  assert.ok(Math.abs(cur.speedMps-old.speedMps)<.01);
  assert.equal(cur.tick,old.tick);
  assert.equal(cur.moving.length,28);
  overlap.push(old.id);
 }
 assert.equal(overlap.length,13);
 assert.equal(JSON.stringify(doc),frozen,'R15L must not mutate native surface document');
 assert.ok(frames.length>=13);
 assert.equal(new Set(frames.map(x=>x.id)).size,frames.length);
 assert.ok(frames.every(x=>x.moving.length===28));
 assert.ok(frames.every(x=>x.originalSource==='ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'));
 // Do not assert the runner ever completed at 52s. The failure is evidence.
 return {schema:'dopagaki.r15l-actual-native-full-available-start00-two-road-screen-replay/1',
  sourceBlob:SHA,road,originalCX:18,originalB48:7,originalB51:28,
  originalCameras:5,physicsHz:hz,
  originalGameSourceEdited:false,newSourceGameColliders:0,officialArt:0,officialSlope2Meters:0,
  actualRunnerStatus:r.status,actualRunnerTimeSeconds:round(r.time),
  firstOffRoadOrAirTickSeconds:firstOffroad,offRoadOrAirTicks:offroadTicks,
  maxOriginalCollisionCount:maximumCollisionCount,
  terminationReason,terminalAt,observedToTimeSeconds:frames.at(-1).seconds,
  originalR1OverlappingTrue13FramesParity:overlap,
  originalFullTimelineFrames:frames,sourceP96FixedSteeringUnmodified:true,
  humanControlActuallyTested:false,actualWebGLRendered:false,sourceNoNewMacro3DMesh:true,
  originalGameplayFullRunCertified:false,
  ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',PERFORMANCE:'HOLD',
  INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir='test-results/r15l/native';fs.mkdirSync(dir,{recursive:true});
 for(const road of ROADS){
  const data=replayFullActualNative(road);
  fs.writeFileSync(path.join(dir,road+'.json'),JSON.stringify(data,null,2)+'\n');
  console.log('R15L_FULL_ACTUAL_NATIVE_REPLAY',JSON.stringify({road,
    genuineFrames:data.originalFullTimelineFrames.length,until:data.observedToTimeSeconds,
    time:data.actualRunnerTimeSeconds,status:data.actualRunnerStatus,
    terminal:data.terminationReason,R1Parity:data.originalR1OverlappingTrue13FramesParity.length,
    firstOffRoad:data.firstOffRoadOrAirTickSeconds,noGameMutation:true}));
 }
}
