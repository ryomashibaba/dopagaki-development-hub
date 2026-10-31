import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AB} from '../scripts/p101-w9c2-g4e7ab-physical.mjs';
test('G4E-7AB native full run candidates remain private real collider stage',()=>{
 for(const variant of ['reference','crest-ease-025','crest-ease-050','crest-lift-025']){
  const d=generateG4E7AB(variant);
  assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
  assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(d.stageForge.g4e7abStudy.fullSevenRoads,'UNTESTED');
  assert.equal(d.stageForge.g4e7abStudy.certifiedSlope2Meters,0);
  assert.equal(d.stageForge.productionPromoted,false);
 }
});
