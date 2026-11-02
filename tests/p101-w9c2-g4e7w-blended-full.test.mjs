import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WBlend} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
test('G4E-7W full candidate real 15m B48 and original moving machines guardrails',()=>{
 for(const a of [.4,.6,.8]){
  const d=generateG4E7WBlend(a);
  assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert(d.stageForge.g4e7wStudy.laneWidthMeters>11);
  assert(d.stageForge.g4e7wStudy.laneWidthMeters<16);
  assert.equal(d.stageForge.g4e7wStudy.publish,'HOLD');
  assert.equal(d.stageForge.g4e7wStudy.officialSlope2Meters,0);
 }
});
