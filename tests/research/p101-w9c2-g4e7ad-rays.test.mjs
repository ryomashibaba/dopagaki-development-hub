import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7adRealSightlines} from '../../scripts/p101-w9c2-g4e7ad-real-sightlines.mjs';
test('G4E-7AD reports physical road and GPU art occlusion separately for original 240Hz camera',()=>{
 const r=g4e7adRealSightlines();
 assert.equal(r.physicsHz,240);
 assert.equal(r.certifiedSlope2Meters,0);
 assert.equal(r.publication,'HOLD');
 assert.equal(r.pairs.length,2);
 for(const p of r.pairs){
  assert.equal(p.frames.length,6);
  assert(p.cityMinOutboardMeters>=60);
  assert(p.cityTriangles>0);
  assert.equal(p.realRoads,7);
  assert.equal(p.originalHazards,28);
  for(const f of p.frames){
   assert(f.speedMps>52);
   assert.equal(Object.keys(f.targets).length,6);
   for(const target of Object.values(f.targets)){
    assert(target.distanceMeters>0);
    assert(typeof target.physicalRoad.blocked==='boolean');
    assert(typeof target.gpuCity.blocked==='boolean');
   }
  }
 }
});
