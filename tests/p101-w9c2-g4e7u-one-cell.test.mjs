import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7UPhysical,G4E7U_CHOICES} from '../scripts/p101-w9c2-g4e7u-single-cell-build.mjs';
import {generateG4E7TPhysical} from '../scripts/p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
test('G4E-7U true one-cell gaps ONLY, actual narrow B48, all 28 B51-C same',()=>{
 const control=generateG4E7TPhysical('solid'),signature=JSON.stringify(control);
 for(const choice of G4E7U_CHOICES){
  const d=generateG4E7UPhysical(choice.id),s=d.stageForge.g4e7uStudy;
  assert.equal(d.surfaces.length,7);assert.equal(d.movingObstacles.length,28);
  assert.deepEqual(d.surfaces[0].points,control.surfaces[0].points);
  assert.deepEqual(d.route,control.route);assert.deepEqual(d.spawns,control.spawns);
  assert.deepEqual(d.surfaces.slice(1),control.surfaces.slice(1));
  assert.deepEqual(d.movingObstacles,control.movingObstacles);
  assert.equal(s.officialSlope2Meters,0);assert.equal(s.publish,'HOLD');
  if(choice.cell!==null){
   assert.deepEqual(d.surfaces[0].voidLongitudinalCells,[choice.cell]);
   assert(s.gap.gapMeters>2.5&&s.gap.gapMeters<13);
   assert(s.gap.noInvisibleBridge);
   assert(tessellate(d.surfaces[0]).topIndexCount<tessellate(control.surfaces[0]).topIndexCount);
  }else assert.equal(d.surfaces[0].voidLongitudinalCells?.length??0,0);
 }
 assert.equal(JSON.stringify(generateG4E7TPhysical('solid')),signature);
 assert.throws(()=>generateG4E7UPhysical('bogus'),/enumerated/);
});
