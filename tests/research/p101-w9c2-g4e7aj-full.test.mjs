import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AJ} from '../../scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs';
test('AJ full 7-road proof inputs physically equal roads, exact 26 unchanged real B51 machines',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const original=generateG4E7AJ(road,'original'),moved=generateG4E7AJ(road,'reanchor');
  assert.deepEqual(original.surfaces,moved.surfaces);
  assert.deepEqual(original.route,moved.route);
  assert.deepEqual(original.movingObstacles.slice(0,12),moved.movingObstacles.slice(0,12));
  assert.deepEqual(original.movingObstacles.slice(14),moved.movingObstacles.slice(14));
  assert.equal(moved.movingObstacles.length,28);
  assert.deepEqual(moved.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(moved.stageForge.productionPromoted,false);
  assert.equal(moved.stageForge.g4e7ajStudy.certifiedSlope2Meters,0);
 }
});
