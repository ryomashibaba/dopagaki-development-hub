import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {buildDrPhysicalReference} from '../scripts/p101-w9c2-g4e7dr-physical-export.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {DT} from '../private/reference_only/director/physics.js';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
test('DR exports untouched exact seven B48 solids, genuine cell52 cut and 28 B51 pose boxes at five original 240Hz frames on both roads',()=>{
 const native=g4e7djNativeStoryboard();
 for(const road of ['true-pinch','pinch-switch']){
  const original=generateG4E7BC(road,'rollDeck'),untouched=JSON.stringify(original);
  const {metadata:m,binary}=buildDrPhysicalReference(road,native);
  assert.equal(m.surfaces,7);assert.equal(m.movers,28);
  assert.equal(m.gap52Confirmed,true);assert.equal(m.b48.length,7);
  assert.equal(m.shots.length,5);assert.equal(sha(binary),m.binarySha256);
  assert.deepEqual(m.shots.map(s=>s.id),['t1500','t1550','t1600','t1650','t1700']);
  assert.equal(m.b48[0].gapProof.topSlot52Absent,true);
  assert.equal(m.b48[0].gapProof.topSlot51Present,true);
  assert.equal(m.b48[0].gapProof.topSlot53Present,true);
  let bytes=0;
  for(const v of m.b48){
   assert.equal(v.fileByteOffset,bytes);
   assert.equal(v.positionsScalarCount%3,0);assert.equal(v.indexCount%3,0);
   assert.equal(v.topIndexCount+v.bottomIndexCount+v.sideIndexCount,v.indexCount);
   assert.equal(v.fileByteLength,v.positionsScalarCount*8+v.indexCount*4);
   assert.equal(sha(binary.subarray(bytes,bytes+v.fileByteLength)),v.sha256);
   bytes+=v.fileByteLength;
  }
  assert.equal(bytes,binary.byteLength);
  for(const s of m.shots){
   assert.ok(Math.abs(s.tick*DT-s.timeSeconds)<1e-10);
   assert.equal(s.moving.length,28);
   for(let i=0;i<28;i++){
    const originalPose=movingObstaclePose(original.movingObstacles[i],s.tick*DT),v=s.moving[i];
    assert.deepEqual(v.center,originalPose.center);
    assert.deepEqual(v.halfSize,originalPose.halfSize);
    assert.equal(v.yawRadians,originalPose.yawRadians);
    assert.equal(v.id,originalPose.id);
   }
  }
  assert.equal(JSON.stringify(original),untouched);
  assert.equal(m.materials,'BLENDER_ONLY_NOT_GAME_MATERIALS');
  assert.equal(m.originalGameWebGL,'NOT_RENDERED');
  assert.equal(m.officialSlope2Meters,0);
  assert.equal(m.art,'HOLD');
 }
 assert.throws(()=>buildDrPhysicalReference('third-road',native),/unsupported BC road/);
});