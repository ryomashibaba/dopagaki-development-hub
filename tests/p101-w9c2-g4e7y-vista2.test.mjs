import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WBlend} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {megastructureGeometry} from '../web/p82-megastructure.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('G4E-7Y R4 two staggered chapters avoid both 4+4 visual overhead portals; preserve 7 B48/28 B51-C',()=>{
 for(const alpha of [.65,.7]){
  const doc=generateG4E7WBlend(alpha),frozen=JSON.stringify(doc),
   base=megastructureGeometry(doc,sample),
   v1=megastructureGeometry(doc,sample,{firstChapterVista:true}),
   v2=megastructureGeometry(doc,sample,{firstChapterVista:true,vistaChapters:2});
  assert.equal(base.sections[0].portalCount,4);
  assert.equal(base.sections[1].portalCount,4);
  assert.equal(v1.sections[1].portalCount,4);
  assert.equal(v2.sections[0].portalCount,0);
  assert.equal(v2.sections[1].portalCount,0);
  assert.equal(v2.sections[0].nonblockingWings,10);
  assert.equal(v2.sections[1].nonblockingWings,10);
  assert.equal(v2.sections[0].noOverheadCrossbeam,true);
  assert.equal(v2.sections[1].noOverheadCrossbeam,true);
  assert.deepEqual(v2.sections.slice(2),base.sections.slice(2));
  assert(v2.sections[0].exteriorClearanceMeters>=94);
  assert(v2.sections[1].exteriorClearanceMeters>=94);
  assert(v2.vertices.every(Number.isFinite));
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.equal(JSON.stringify(doc),frozen);
 }
});
