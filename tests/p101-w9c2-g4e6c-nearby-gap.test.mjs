import test from 'node:test';
import assert from 'node:assert/strict';
import {G4E6C_SITES,generateG4E6EarlyGap} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
test('G4E6C all five speed candidate gaps are floor-free real Gold B48 gaps with unmodified physics controls',()=>{
 const gold=generateP101A13W7Candidate();
 for(const site of G4E6C_SITES){
  const doc=generateG4E6EarlyGap(site.id),gap=doc.stageForge.g4e6EarlyGap;
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces.map(s=>s.points),gold.surfaces.map(s=>s.points));
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  assert.deepEqual(doc.route,gold.route);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.deepEqual(doc.spawns,gold.spawns);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(gap.physicsLawUnchanged,true);
  assert.equal(gap.continuationOnSameOriginalRoad,true);
  assert.equal(gap.approvedSlopeDNAMeters,0);
  assert.equal(gap.section,0);
  assert.ok(gap.gapMeters>3&&gap.gapMeters<10);
  assert.equal(tessellate(doc.surfaces[0]).degenerate,0);
  const m=sample(doc.surfaces[0],(gap.uTakeoff+gap.uLanding)/2,.5);
  assert.equal(contacts(compile(doc),[m[0],m[1]+.65,m[2]],.65)
   .filter(c=>c.triangle.rideable).length,0);
 }
});
