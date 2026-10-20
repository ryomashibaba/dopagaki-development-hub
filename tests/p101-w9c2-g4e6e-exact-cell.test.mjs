import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E6EMicroGap,G4E6E_CELLS,G4E6E_REFERENCE_CELL,g4e6eId} from '../scripts/p101-w9c2-g4e6e-micro-gap-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
test('G4E-6E six distinct true floor-free B48 one-cell gaps; frozen Gold geometry/route/28 bodies never changed',()=>{
 const gold=generateP101A13W7Candidate();
 assert.equal(G4E6E_CELLS.length,6);
 assert.equal(new Set(G4E6E_CELLS).size,6);
 assert.ok(G4E6E_CELLS.every(x=>Math.abs(x-G4E6E_REFERENCE_CELL)<=4));
 const goldPoints=gold.surfaces.map(s=>s.points),ids=gold.surfaces.map(s=>s.id);
 for(const cell of G4E6E_CELLS){
  const doc=generateG4E6EMicroGap(cell),gap=doc.stageForge.g4e6EarlyGap,
   road=doc.surfaces[0];
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
  assert.equal(gap.id,g4e6eId(cell));
  assert.equal(gap.section,0);
  assert.deepEqual(road.voidLongitudinalCells,[cell]);
  assert.deepEqual(doc.surfaces.map(s=>s.points),goldPoints);
  assert.deepEqual(doc.surfaces.map(s=>s.id),ids);
  assert.deepEqual(doc.route,gold.route);
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  assert.deepEqual(doc.spawns,gold.spawns);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.equal(tessellate(road).degenerate,0);
  const point=sample(road,(gap.uTakeoff+gap.uLanding)/2,.5);
  assert.equal(contacts(compile(doc),[point[0],point[1]+.65,point[2]],.65)
   .filter(x=>x.triangle.rideable).length,0,'No invisible landing collider in genuine gap');
  assert.ok(gap.gapMeters>5&&gap.gapMeters<10);
  assert.equal(gap.approvedSlopeDNAMeters,0);
 }
 assert.deepEqual(gold.surfaces.map(s=>s.points),goldPoints);
});
test('Unapproved G4E-6E strip fails closed',()=>{
 for(const input of [-1,0,98,102,2.5,null,'97'])assert.throws(
  ()=>generateG4E6EMicroGap(input));
});
