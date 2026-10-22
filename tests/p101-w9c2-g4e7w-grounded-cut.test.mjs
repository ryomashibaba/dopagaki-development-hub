import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WPhysical,g4e7wProfileWidth,W_PROFILES,W_GAP_CELLS} from '../scripts/p101-w9c2-g4e7w-grounded-cut-build.mjs';
import {generateG4E7VExit} from '../scripts/p101-w9c2-g4e7v-exit-build.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
test('G4E-7W only removes real B48 longitudinal cells on actual narrow road, no original edits',()=>{
 let checked=0;
 for(const profile of W_PROFILES){
  const original=generateG4E7VExit(profile),frozen=JSON.stringify(original);
  for(const cell of W_GAP_CELLS){
   if(g4e7wProfileWidth(profile,cell)>22)continue;
   const d=generateG4E7WPhysical(profile,cell),m=d.stageForge.g4e7wStudy;
   assert.equal(m.cell,cell);assert.equal(m.originalMachines,28);
   assert.equal(m.realRoads,7);assert.equal(m.officialSlope2Meters,0);
   assert.equal(d.surfaces[0].voidLongitudinalCells.length,1);
   assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[cell]);
   assert.deepEqual(d.surfaces[0].points,original.surfaces[0].points);
   assert.deepEqual(d.surfaces.slice(1),original.surfaces.slice(1));
   assert.deepEqual(d.movingObstacles,original.movingObstacles);
   assert.deepEqual(d.spawns,original.spawns);
   assert(tessellate(d.surfaces[0]).topIndexCount<tessellate(original.surfaces[0]).topIndexCount);
   assert(m.gap.lipWidthMeters<=22&&m.gap.lipWidthMeters>=10);
   checked++;
  }
  assert.equal(JSON.stringify(generateG4E7VExit(profile)),frozen);
 }
 assert(checked>=9);
 assert.throws(()=>generateG4E7WPhysical('unknown',52),/enumerated/);
 assert.throws(()=>generateG4E7WPhysical('exit6',88),/enumerated/);
});
