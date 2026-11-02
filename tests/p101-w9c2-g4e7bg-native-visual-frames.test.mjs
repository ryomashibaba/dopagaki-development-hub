import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7bgNativeFrames,BG_SHOTS} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
const proof=g4e7bgNativeFrames();
test('BG 240Hz both actual BC rollDeck tracks keep source, camera and 28 B51 moving hazards',()=>{
 assert.equal(proof.physicsHz,240);
 assert.equal(proof.initialSpeedMps,52);
 assert.equal(proof.certifiedSlope2Meters,0);
 assert.equal(proof.publication,'HOLD');
 assert.deepEqual(proof.shots.map(s=>s.id),['t1500','t1700','t1850']);
 for(const road of ['true-pinch','pinch-switch']){
  const stage=generateG4E7BC(road,'rollDeck');
  const entry=proof.stages[road];
  assert.equal(entry.stageId,stage.stageForge.recordStageId);
  assert.equal(entry.actualB48,7);assert.equal(entry.actualMovingB51,28);
  assert.equal(entry.originalGapCell52,true);
  assert.equal(entry.originalStart00,true);
  assert.equal(entry.frames.length,BG_SHOTS.length);
  for(let i=0;i<entry.frames.length;i++){
   const f=entry.frames[i];
   assert.equal(f.id,BG_SHOTS[i].id);
   assert(Math.abs(f.timeSeconds-BG_SHOTS[i].seconds)<=1/240+.00002);
   assert(f.speedMps>52);assert(f.tick>0);
   assert(f.eye.every(Number.isFinite)&&f.front.every(Number.isFinite));
   assert.equal(f.source,'ACTUAL_240HZ_START00_P96_FIXED_SCRIPT_NOT_HUMAN');
   assert.equal(f.pose.position.length,3);
   assert(Number.isFinite(f.yaw));
   assert.equal(f.nativeCollisionCount>=0,true);
  }
 }
});
