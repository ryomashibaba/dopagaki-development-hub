import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7tNativeMatrix} from '../scripts/p101-w9c2-g4e7t-native-matrix.mjs';
test('G4E-7T 240Hz native matrix reports honest early and late gap effects without approval',()=>{
 const m=g4e7tNativeMatrix();
 assert.equal(m.physicsHz,240);assert.equal(m.start00,true);
 assert.equal(m.startSpeedMps,52);
 assert(m.controls.goldSeconds>40);assert(m.controls.glideSeconds>40);
 assert.deepEqual(m.candidates.map(x=>x.variant),['solid','early','late']);
 for(const c of m.candidates){
  assert.equal(c.realRoadCount,7);assert.equal(c.movingMachines,28);
  assert.equal(c.certifiedSlope2Meters,0);assert.equal(c.humanFairness,'HOLD');
  assert(c.timeSeconds>5);
  assert(c.maxSpeedMps>=52);
 }
 for(const name of ['early','late']){
  const v=m.relativeGapCausality[name];
  assert(v.extraAirTicks>=0);assert(v.maxPositionDivergence>=0);
 }
 assert.equal(m.certifiedSlope2Meters,0);
});
