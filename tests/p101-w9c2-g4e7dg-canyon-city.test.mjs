import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7dgCanyonCandidate as DG} from '../web/p101-w9c2-g4e7dg-canyon-city.mjs';
test('DG architecture is explicit opt-in, uses exact 240Hz camera and preserves CX / real roads',()=>{
 const frame=g4e7bgNativeFrames().stages;
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),unchanged=JSON.stringify(doc);
  const shots=frame[road].frames;
  const cx=CX(doc,sample,{enabled:true,shots});
  assert.equal(DG(doc,sample,{enabled:false}).active,false);
  const dg=DG(doc,sample,{enabled:true,shots});
  assert.equal(dg.active,true);
  assert.equal(dg.dg.design,'CANYON_CITY_INHABITED_VOLUME_V1');
  assert.equal(dg.dg.landmarkDetails.length,2);
  assert.deepEqual(dg.dg.landmarkDetails.map(x=>x.occupiedVolumes),[6,6]);
  assert.equal(dg.landmarksQA.length,2);
  assert.equal(dg.sources.filter(s=>s.kind==='dg-inhabited-canyon').length,2);
  assert.equal(dg.sources.filter(s=>s.kind==='anchored-civic-crescent').length,0);
  assert.equal(dg.sources.reduce((a,s)=>a+s.triangleCount,0),dg.triangles);
  assert.ok(dg.triangles>1000&&dg.triangles<50000);
  assert.notDeepEqual(dg.vertices,cx.vertices);
  assert.equal(JSON.stringify(doc),unchanged);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(dg.newRoads,0);assert.equal(dg.newColliders,0);
  assert.equal(dg.newMovingHazards,0);assert.equal(dg.officialSlope2Meters,0);
  assert.equal(dg.art,'HOLD');assert.equal(dg.human,'HOLD');
  assert.equal(dg.publish,'HOLD');
  assert.throws(()=>DG(doc,sample,{enabled:true,shots:[{id:'fake'},shots[1]]}),/actual native 240Hz/);
 }
});
