import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7wFullNative} from '../scripts/p101-w9c2-g4e7w-full-native.mjs';
test('G4E-7W full 240Hz does NOT promote prior 9-second local-only results',()=>{
 const m=g4e7wFullNative();
 assert.equal(m.physicsHz,240);assert.equal(m.start00,true);
 assert.equal(m.initialSpeedMps,52);assert.equal(m.pairs.length,2);
 assert.equal(m.verifiedGenuineNarrowRoads,7);
 assert.equal(m.originalMovingMachines,28);
 for(const x of m.pairs){
  assert.equal(x.solidControl.hasRealGap,false);
  assert.equal(x.trueGap.hasRealGap,true);
  assert(x.trueGap.stopTimeSeconds>9);
  assert.equal(x.neverAutomaticallyHumanApproved,true);
  assert.equal(x.trueGap.officialSlope2Meters,0);
  assert.equal(x.trueGap.humanApproval,'NOT_TESTED');
  if(x.trueGap.allSevenInOrder)assert.equal(x.trueGap.state,'finished');
 }
 assert.equal(m.officialSlope2Meters,0);assert.equal(m.humanFairness,'HOLD');
});
