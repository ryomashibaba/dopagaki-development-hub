import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e5bFeasibility} from '../scripts/p101-w9c2-g4e5b-rejoin-feasibility.mjs';
test('G4E-5B real Gold road-V feasibility measures finite endpoints, grade and high-speed radius',()=>{
 const d=g4e5bFeasibility();
 assert.equal(d.candidates.length,3);
 assert.deepEqual(d.candidates.map(x=>x.lengthMeters),[400,650,900]);
 assert.equal(d.originalRoads,7);
 assert.equal(d.realMachines,28);
 assert.equal(d.noPhysicalEdits,true);
 assert.ok(d.turnRadiusReference.every(x=>x.minimumTurnRadiusMeters>1000));
 for(const c of d.candidates){
  assert.equal(c.closest.length,6);
  assert.ok(c.closest.every(x=>Number.isFinite(x.distanceXZ)&&
   Number.isFinite(x.verticalMeters)&&Number.isFinite(x.turnDegrees)));
  assert.ok(c.runwayEnd.every(Number.isFinite));
  assert.ok(c.roadVStart.every(Number.isFinite));
  assert.ok(c.roadVEnd.every(Number.isFinite));
  assert.equal(c.roadVStartDistanceXZ>=0,true);
 }
});
