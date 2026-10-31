import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AH} from '../../scripts/p101-w9c2-g4e7ah-narrow-real-b48.mjs';
import {generateG4E7ACR2} from '../../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
test('full 240Hz targets two real narrow-road layouts without changing B48 gap, 7 roads or 28 hazards',()=>{
 const baseline=generateG4E7ACR2('approach-arc'),original=JSON.stringify(baseline);
 for(const id of ['true-pinch','pinch-switch']){
  const doc=generateG4E7AH(id);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.deepEqual(doc.movingObstacles,baseline.movingObstacles);
  assert.deepEqual(doc.surfaces.slice(1),baseline.surfaces.slice(1));
  assert.deepEqual(doc.surfaces[0].points.slice(15*5,22*5),baseline.surfaces[0].points.slice(15*5,22*5));
  assert(doc.stageForge.g4e7ahStudy.widthMinMeters>=10);
  assert(doc.stageForge.g4e7ahStudy.widthMinMeters<=13.5);
  assert.equal(doc.stageForge.g4e7ahStudy.certifiedSlope2Meters,0);
  assert.equal(doc.stageForge.g4e7ahStudy.publish,'HOLD');
 }
 assert.equal(JSON.stringify(baseline),original);
});
