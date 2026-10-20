import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e5bCurvatureScreen} from '../scripts/p101-w9c2-g4e5b-curvature-screen.mjs';
test('G4E-5B real road V bounded cubic screen returns truthful geometry and high-speed loads',()=>{
 const d=g4e5bCurvatureScreen();
 assert.equal(d.results.length,3);
 assert.equal(d.noPhysicalRoadAdded,true);
 assert.equal(d.notGlobalImpossibilityProof,true);
 assert.ok(d.results.every(x=>x.evaluatedCurves===1352));
 for(const r of d.results){
  assert.ok(r.withinBounds>0);
  assert.ok(r.bestSingleCubic.minRadiusMeters>0);
  assert.ok(Number.isFinite(r.bestSingleCubic.lateralAccelerationAt170));
  assert.ok(r.bestSingleCubic.maxAbsCoordinate<=1950);
  assert.ok(r.bestSingleCubic.lengthMeters>100);
  assert.ok(r.topCandidates.every(x=>x.lateralAccelerationAt205>=x.lateralAccelerationAt170));
 }
});
