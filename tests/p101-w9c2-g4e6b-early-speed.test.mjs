import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E6EarlyGap,G4E6B_SITES} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
test('G4E6B short and long cutouts are true physical voids on exact Gold first road',()=>{
 const gold=generateP101A13W7Candidate();
 for(const site of G4E6B_SITES){
  const doc=generateG4E6EarlyGap(site.id),gap=doc.stageForge.g4e6EarlyGap;
  assert.equal(doc.surfaces.length,7);
  assert.deepEqual(doc.surfaces.map(x=>x.points),gold.surfaces.map(x=>x.points));
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.deepEqual(doc.spawns,gold.spawns);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(gap.section,0);
  assert.equal(doc.surfaces[0].voidLongitudinalCells.length,site.cells);
  assert.equal(tessellate(doc.surfaces[0]).degenerate,0);
  const mid=sample(doc.surfaces[0],(gap.uTakeoff+gap.uLanding)/2,.5);
  assert.equal(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
    .filter(x=>x.triangle.rideable).length,0);
  assert.equal(gap.approvedSlopeDNAMeters,0);
 }
});
