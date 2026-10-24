import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7aeRayReport} from '../../scripts/p101-w9c2-g4e7ae-real-sightlines.mjs';
test('AE casts original real B48 plus independent GPU-city visibility from 240Hz camera',()=>{
 const d=g4e7aeRayReport();
 assert.equal(d.realPhysicsHz,240);
 assert.equal(d.originalRoads,7);assert.equal(d.movingHazards,28);
 assert.equal(d.actualVoidCell52,true);
 assert.equal(d.newCityOnlyGPU,true);
 assert.equal(d.certifiedSlope2Meters,0);
 assert.equal(d.publication,'HOLD');
 assert.equal(d.report.length,6);
 for(const f of d.report){
  assert(f.realSpeedMps>52);
  assert.equal(Object.keys(f.points).length,6);
  for(const p of Object.values(f.points)){
   assert(p.distanceMeters>0);
   assert(typeof p.physical.blocked==='boolean');
   assert(typeof p.newCity.blocked==='boolean');
  }
 }
});
