import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7ACR2} from '../../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
test('R2 two full native research cases retain true road/28 machines/zero adoption',()=>{
 for(const id of ['approach-arc','landing-crescent']){
  const d=generateG4E7ACR2(id);
  assert.equal(d.surfaces.length,7);
  assert.equal(d.movingObstacles.length,28);
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(d.stageForge.g4e7acR2Study.certifiedSlope2Meters,0);
  assert.equal(d.stageForge.g4e7acR2Study.publish,'HOLD');
 }
});
