import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WBlend} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {megastructureGeometry} from '../web/p82-megastructure.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('G4E-7Y R3 private asymmetric exterior first-road skyline replaces overhead visual portals only',()=>{
 for(const alpha of [.65,.7]){
  const stage=generateG4E7WBlend(alpha),frozen=JSON.stringify(stage);
  const original=megastructureGeometry(stage,sample);
  const vista=megastructureGeometry(stage,sample,{firstChapterVista:true});
  assert.equal(original.sections.length,7);assert.equal(vista.sections.length,7);
  assert.equal(original.sections[0].portalCount,4);
  assert.equal(vista.sections[0].portalCount,0);
  assert.equal(vista.sections[0].nonblockingWings,10);
  assert.equal(vista.sections[0].noOverheadCrossbeam,true);
  assert.equal(vista.sections[0].physicalGapUnaffected,true);
  assert(vista.sections[0].exteriorClearanceMeters>=94);
  assert(vista.vertices.length<original.vertices.length);
  assert.deepEqual(vista.sections.slice(1),original.sections.slice(1));
  assert.equal(vista.vertices.length%18,0);
  assert(vista.vertices.every(Number.isFinite));
  assert.equal(stage.surfaces.length,7);
  assert.deepEqual(stage.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(stage.movingObstacles.length,28);
  assert.equal(JSON.stringify(stage),frozen);
 }
});
