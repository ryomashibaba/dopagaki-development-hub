import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7aiRealB48Sightlines} from '../../scripts/p101-w9c2-g4e7ai-real-sightlines.mjs';
test('AI original 240Hz camera vs original B48 real triangle ray for 14.8m and 11m roads',()=>{
 const r=g4e7aiRealB48Sightlines();
 assert.equal(r.actual240Hz,240);assert.equal(r.officialSlope2Meters,0);
 assert.equal(r.publish,'HOLD');assert.equal(r.roadChoices.length,3);
 for(const x of r.roadChoices){
  assert.equal(x.originalRealRoads,7);assert.equal(x.originalRealMovingHazards,28);
  assert.equal(x.trueMissingCell52,true);assert.equal(x.originalLipLandingUnchanged,true);
  assert.equal(x.shots.length,6);
  assert(x.minNarrowRoadMeters>=10&&x.minNarrowRoadMeters<=15);
  for(const f of x.shots){
   assert(f.speedMps>52);assert.equal(Object.keys(f.probes).length,10);
   for(const p of Object.values(f.probes)){
    assert(p.distanceMeters>0);assert.equal(typeof p.roadB48.blocked,'boolean');
   }
  }
 }
});
