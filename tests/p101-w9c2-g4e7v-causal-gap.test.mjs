import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7vGapCause} from '../scripts/p101-w9c2-g4e7v-causal-gap.mjs';
test('G4E-7V baseline/exit6/slope6 compare real gap against EXACT solid B48 at 240Hz',()=>{
 const v=g4e7vGapCause();
 assert.equal(v.physicsHz,240);assert.equal(v.start00,true);
 assert.deepEqual(v.comparisons.map(x=>x.variant),['original','exit6','slope6']);
 for(const x of v.comparisons){
  assert.equal(x.samePhysicalRoadSkin,true);
  assert.equal(x.originalMovingMachines,28);assert.equal(x.actualRoads,7);
  assert(x.nearGapComparedTicks>10);
  assert(x.maxPositionDeltaMeters>=0);
  assert.equal(x.genuineAdditionalGapAirObserved,x.solidGroundGapAirTicks>0);
  assert.equal(x.humanFairness,'HOLD');
 }
 assert.equal(v.officialSlope2Meters,0);
});
