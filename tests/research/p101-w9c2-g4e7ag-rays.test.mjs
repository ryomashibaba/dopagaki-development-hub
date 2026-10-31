import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7agRayReport} from '../../scripts/p101-w9c2-g4e7ag-real-sightlines.mjs';
test('AG genuine native camera rays separate 5 hollow GPU landmarks from real B48 hazards',()=>{
 const x=g4e7agRayReport();
 assert.equal(x.realPhysicsHz,240);assert.equal(x.originalRoads,7);
 assert.equal(x.movingHazards,28);assert.equal(x.actualVoidCell52,true);
 assert.equal(x.newCityOnlyGPU,true);assert.equal(x.cityOpenCenters,5);
 assert.equal(x.certifiedSlope2Meters,0);assert.equal(x.publication,'HOLD');
 assert.equal(x.report.length,6);
 for(const f of x.report){
  assert(f.realSpeedMps>52);
  assert.equal(Object.keys(f.points).length,6);
  for(const v of Object.values(f.points)){
   assert(v.distanceMeters>0);
   assert.equal(typeof v.physical.blocked,'boolean');
   assert.equal(typeof v.newCity.blocked,'boolean');
  }
 }
});
