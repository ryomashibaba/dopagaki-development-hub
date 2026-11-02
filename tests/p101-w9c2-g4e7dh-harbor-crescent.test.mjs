import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7dgCanyonCandidate as DH} from '../web/p101-w9c2-g4e7dh-harbor-crescent.mjs';
test('DH private gallery keeps original CX crescents, roads, moving hazards and authentic cameras',()=>{
 const stages=g4e7bgNativeFrames().stages;
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),before=JSON.stringify(doc);
  const shots=stages[road].frames;
  const cx=CX(doc,sample,{enabled:true,shots});
  const dh=DH(doc,sample,{enabled:true,shots});
  assert.equal(DH(doc,sample,{enabled:false}).active,false);
  assert.equal(JSON.stringify(doc),before);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(dh.dg.design,'HARBOR_CRESCENT_INHABITED_V1');
  assert.equal(dh.triangles>cx.triangles,true);
  assert.deepEqual(dh.sources.slice(0,cx.sources.length),cx.sources);
  assert.deepEqual(dh.vertices.slice(0,cx.vertices.length),cx.vertices);
  assert.equal(dh.sources.filter(x=>x.kind==='dh-inhabited-harbor').length,2);
  assert.deepEqual(dh.dg.landmarkDetails.map(x=>x.occupiedGalleries),[2,2]);
  assert.equal(dh.sources.reduce((n,s)=>n+s.triangleCount,0),dh.triangles);
  assert.equal(dh.newRoads,0);assert.equal(dh.newColliders,0);
  assert.equal(dh.newMovingHazards,0);assert.equal(dh.physicalChanged,false);
  assert.equal(dh.art,'HOLD');assert.equal(dh.human,'HOLD');
  assert.equal(dh.publish,'HOLD');assert.equal(dh.officialSlope2Meters,0);
  assert.throws(()=>DH(doc,sample,{enabled:true,shots:[{id:'fake'},shots[1]]}),/authentic 240Hz/);
 }
});
