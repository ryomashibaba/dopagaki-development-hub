import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7dgCanyonCandidate as DI} from '../web/p101-w9c2-g4e7di-sky-fjord.mjs';
test('DI open-depth city is PRIVATE, preserves CX exactly and cannot alter true road/physics',()=>{
 const stages=g4e7bgNativeFrames().stages;
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),old=JSON.stringify(doc),
   shots=stages[road].frames,cx=CX(doc,sample,{enabled:true,shots});
  const di=DI(doc,sample,{enabled:true,shots});
  assert.equal(DI(doc,sample,{enabled:false}).active,false);
  assert.equal(di.dg.design,'SKY_FJORD_DEPTH_CITY_V1');
  assert.equal(di.dg.landmarkDetails.length,2);
  assert.ok(di.dg.landmarkDetails.every(x=>x.openCentralGorge&&x.terraceCount===8));
  assert.equal(di.sources.filter(x=>x.kind==='di-inhabited-sky-fjord').length,2);
  assert.deepEqual(di.vertices.slice(0,cx.vertices.length),cx.vertices);
  assert.deepEqual(di.sources.slice(0,cx.sources.length),cx.sources);
  assert.equal(di.triangles,di.sources.reduce((a,s)=>a+s.triangleCount,0));
  assert.ok(di.triangles>cx.triangles&&di.triangles<50000);
  assert.equal(JSON.stringify(doc),old);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(di.newRoads,0);assert.equal(di.newColliders,0);
  assert.equal(di.newMovingHazards,0);assert.equal(di.physicalChanged,false);
  assert.equal(di.art,'HOLD');assert.equal(di.human,'HOLD');
  assert.equal(di.publish,'HOLD');assert.equal(di.officialSlope2Meters,0);
  assert.throws(()=>DI(doc,sample,{enabled:true,shots:[{id:'fake'},shots[1]]}),/authentic 240Hz/);
 }
});
