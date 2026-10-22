import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7TPhysical,G4E7T_VARIANTS} from '../scripts/p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {generateG4E7RPhysical} from '../scripts/p101-w9c2-g4e7r-grade-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {tessellate,sample} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
test('G4E-7T creates an actual 13-22m EARLY B48 narrow neck and two-cell gaps',()=>{
 const gold=JSON.stringify(generateP101A13W7Candidate()),r=generateG4E7RPhysical('sweep'),
  rSig=JSON.stringify(r),docs=G4E7T_VARIANTS.map(v=>generateG4E7TPhysical(v));
 const [solid,early,late]=docs;
 assert.deepEqual(early.surfaces[0].points,solid.surfaces[0].points);
 assert.deepEqual(late.surfaces[0].points,solid.surfaces[0].points);
 assert.notDeepEqual(r.surfaces[0].points,solid.surfaces[0].points);
 for(const d of docs){
  const m=d.stageForge.g4e7tStudy;
  assert.equal(m.certifiedSlope2Meters,0);assert.equal(m.realRoads,7);
  assert.equal(m.movingMachines,28);assert(m.extraNeckRows>=7);
  assert(m.actualNarrowWidthMeters>11&&m.actualNarrowWidthMeters<22);
  assert.deepEqual(d.surfaces.slice(1),r.surfaces.slice(1));
  assert.deepEqual(d.movingObstacles,r.movingObstacles);
  assert.deepEqual(d.spawns,r.spawns);
  assert.equal(tessellate(d.surfaces[0]).degenerate,0);
 }
 assert(!solid.stageForge.g4e7tStudy.gap);
 for(const d of [early,late]){
  const g=d.stageForge.g4e7tStudy.gap,road=d.surfaces[0];
  assert.equal(road.voidLongitudinalCells.length,2);
  assert(g.gapMeters>3&&g.gapMeters<22);
  assert(g.widthAtLipMeters>10);
  const mid=sample(road,(g.uTakeoff+g.uLanding)/2,.5);
  assert.equal(contacts(compile(d),[mid[0],mid[1]+.65,mid[2]],.65)
   .filter(c=>c.triangle.rideable).length,0);
  assert(tessellate(road).topIndexCount<tessellate(solid.surfaces[0]).topIndexCount);
 }
 assert.equal(JSON.stringify(generateP101A13W7Candidate()),gold);
 assert.equal(JSON.stringify(generateG4E7RPhysical('sweep')),rSig);
 assert.throws(()=>generateG4E7TPhysical('arbitrary'),/enumerated/);
});
