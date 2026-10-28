/**
 * G4E-7DZ R6D-R1: PRIVATE 11.0–17.0s native 240Hz scripted 3D references.
 * Repeat the unmodified P96 input/step/camera path from DJ; require exact
 * overlap parity with DJ at 14–17s. No game or physical asset modifications.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {generateG4E7BC} from './p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {makeP96RoutePlan,p96DodgeSteer} from '../web/p96-avoidance-steer.mjs';
import {p101Step} from '../web/p101-overdrive.mjs';
import {createA13SurgeState,p101A13ForwardScale} from '../web/p101-a13-forward.mjs';
import {capturePose,createCameraState,advanceCamera,viewForPose} from '../web/drive3d-camera.mjs';

const ROADS=['true-pinch','pinch-switch'];
const TIMES=Array.from({length:13},(_,i)=>11+i*.5);
const round=(x,n=7)=>Number(x.toFixed(n));
const near=(a,b,eps=1e-7)=>Math.abs(a-b)<=eps;
const diff=(a,b)=>Math.max(...a.map((x,i)=>Math.abs(x-b[i])));
export function buildEarlyTimeline(road,native=g4e7djNativeStoryboard()){
 assert.ok(ROADS.includes(road));
 assert.ok(near(1/DT,240,1e-6));
 const doc=generateG4E7BC(road,'rollDeck');
 const frozen=JSON.stringify(doc);
 assert.equal(doc.surfaces.length,7);
 assert.equal(doc.movingObstacles.length,28);
 assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
 assert.equal(doc.stageForge.productionPromoted,false);
 const runner=new Runner(doc,compile(doc),0,52);
 const plan=makeP96RoutePlan(doc,runner),surge=createA13SurgeState();
 let cam=createCameraState(runner.forward),idx=0;
 const out=[];
 let transientOffRoad=0,firstTransient=null,maxCollisionCount=0;
 const tickStart=Math.round(11/DT),tickEnd=Math.round(17/DT);
 // Source game runs from t0. Only *observations* within the study window
 // are counted; this does not alter how the runner is stepped.
 for(let tick=1;tick<=tickEnd;tick++){
  if(runner.status==='failed'||runner.status==='finished')break;
  const steer=p96DodgeSteer(runner,plan,'early-soft',movingObstaclePose).input/4.8;
  p101Step(runner,steer,'OVERDRIVE',{forwardScale:p101A13ForwardScale(runner,surge),collisionRecovery:false});
  cam=advanceCamera(cam,runner.forward,DT);
  if(tick>=tickStart){
   maxCollisionCount=Math.max(maxCollisionCount,runner.collisions);
   if(!runner.grounded || !(runner.surface||runner.lastSurface)) {
    transientOffRoad++;
    if(firstTransient===null)firstTransient=round(runner.time,5);
   }
  }
  if(idx>=TIMES.length || runner.time+1e-6<TIMES[idx])continue;
  const pose=capturePose(runner),view=viewForPose(pose,cam);
  const id='t'+String(Math.round(TIMES[idx]*100)).padStart(4,'0');
  const movers=doc.movingObstacles.map(ob=>{
   const p=movingObstaclePose(ob,runner.time);
   assert.ok(p.center.every(Number.isFinite)&&p.halfSize.every(x=>Number.isFinite(x)&&x>0));
   return {id:p.id,type:p.type,center:p.center,halfSize:p.halfSize,yawRadians:p.yawRadians,enabled:p.enabled};
  });
  assert.equal(movers.length,28);
  out.push({id,tick,seconds:round(runner.time,7),eye:[...view.eye],front:[...view.front],
   playerPosition:[...pose.position],speedMps:round(Math.hypot(...runner.v),5),
   grounded:runner.grounded,physicalRoad:runner.surface||runner.lastSurface,
   collisions:runner.collisions,steer:round(steer,7),moving:movers,
   originalSource:'ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN'});
  idx++;
 }
 assert.equal(out.length,TIMES.length,'Original start00 failed before 17 seconds');
 assert.deepEqual(out.map(x=>x.id),TIMES.map(s=>'t'+String(Math.round(s*100)).padStart(4,'0')));
 // Overlap with existing DJ must agree, including native pose, camera,
 // physical road, ground state and speed. No new trajectory is allowed.
 const anchors=native.stages[road].frames.filter(s=>s.timeSeconds>=14-1e-6&&s.timeSeconds<=17+1e-6);
 assert.equal(anchors.length,7);
 const parity=anchors.map(prev=>{
   const cur=out.find(x=>x.id===prev.id);
   assert.ok(cur,prev.id);
   const errors={eye:diff(cur.eye,prev.eye),front:diff(cur.front,prev.front),
     player:diff(cur.playerPosition,prev.pose.position),speed:Math.abs(cur.speedMps-prev.speedMps)};
   assert.equal(cur.tick,prev.tick);
   assert.equal(cur.grounded,prev.grounded);
   assert.equal(cur.physicalRoad,prev.physicalRoad);
   assert.ok(errors.eye<1e-6&&errors.front<1e-6&&errors.player<1e-6&&errors.speed<.001,
    'Native DJ anchor drift '+JSON.stringify({id:cur.id,errors}));
   return {id:cur.id,errors};
 });
 assert.equal(JSON.stringify(doc),frozen);
 return {schema:'dopagaki.g4e7dz-r6d-r1-original-early-native/1',road,
  sourceCXBlob:'af076d67492a677d2235e4730aef8cdf4808e106',
  originalCX:18,originalB48:7,originalB51:28,originalCameras:5,gap52:true,physicsHz:240,
  reference:'UNCHANGED_P96_STEP_CAMERA_ACTUAL_240HZ_NOT_HUMAN',
  sourceGameChanged:false,originalTrajectoryParity:parity,
  sampleTimesSeconds:TIMES,frames:out,
  sampledTickWindow:{from:tickStart,to:tickEnd,count:tickEnd-tickStart+1,
   ungroundedOrNoRoadTicks:transientOffRoad,firstUngroundedOrNoRoadSecond:firstTransient,
   maximumCollisionCount:maxCollisionCount,
   note:'UNGROUNDED is not automatically FAIL; requires genuine motion and jump review'},
  fourBeats:{intro:'UNASSIGNED',activity:'UNASSIGNED',crossing:'UNASSIGNED',exit:'UNASSIGNED'},
  passageCertification:'NOT_TESTED',dangerPrewarning:'NOT_CERTIFIED',
  newCityMeshes:0,newGameColliders:0,originalCityConnected:'NOT_TESTED',
  trueGameWebGL:'NOT_RENDERED',officialArt:0,officialSlope2Meters:0,
  TECH:'SOURCE_PARITY_PENDING_CI',ART:'HOLD',GAMEPLAY:'HOLD',HUMAN:'HOLD',
  PERFORMANCE:'HOLD',INTEGRATION:'HOLD',RELEASE:'HOLD',MERGE:'HOLD'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir='test-results/g4e7dz-r6d-r1/source';fs.mkdirSync(dir,{recursive:true});
 const native=g4e7djNativeStoryboard();
 for(const road of ROADS){
  const d=buildEarlyTimeline(road,native);
  fs.writeFileSync(path.join(dir,road+'.json'),JSON.stringify(d,null,2)+'\n');
  console.log('R6D_R1_AUTHENTIC_EARLIER_NATIVE',JSON.stringify({road,frames:d.frames.length,
    anchors:d.originalTrajectoryParity.length,ungroundedTicks:d.sampledTickWindow.ungroundedOrNoRoadTicks,
    safety:'NOT_CERTIFIED',art:'HOLD'}));
 }
}
