import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7SNativeCamera,G4E7S_TARGETS} from '../scripts/p101-w9c2-g4e7s-native-camera.mjs';
import {generateG4E7RPhysical} from '../scripts/p101-w9c2-g4e7r-grade-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {createCameraState,viewForPose} from '../web/drive3d-camera.mjs';
test('G4E-7S genuinely records 4 canonical 240Hz speed poses and same ball locked camera',()=>{
 const old=JSON.stringify(generateG4E7RPhysical('cut')),
  gold=JSON.stringify(generateP101A13W7Candidate());
 const d=generateG4E7SNativeCamera();
 assert.equal(d.physicsHz,240);assert.equal(d.spawnIndex,0);
 assert.equal(d.startSpeedMps,52);assert.equal(d.steering,'P96_DIV_4_8_SCRIPTED_NOT_HUMAN');
 assert.equal(d.frames.length,G4E7S_TARGETS.length);
 assert.equal(d.observedAir,true);assert.equal(d.observedRejoin,true);
 assert.equal(d.originalMovingCount,28);assert.equal(d.realRoads,7);
 assert.equal(d.officialSlopeDnaMeters,0);
 assert(d.frames.some(f=>f.grounded===false));
 for(const [i,f] of d.frames.entries()){
  assert.equal(f.id,G4E7S_TARGETS[i].id);
  assert(f.speedMps>70&&f.speedMps<210);
  assert(f.timeSeconds>0&&f.roadU>0&&f.roadU<1);
  assert(f.pose.position.every(Number.isFinite));
  const view=viewForPose(f.pose,{yaw:f.yaw});
  assert.deepEqual(view.eye,f.eye);
  assert.deepEqual(view.front,f.front);
 }
 assert.equal(JSON.stringify(generateG4E7RPhysical('cut')),old);
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),gold);
});
