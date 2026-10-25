import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
test('CI genuine 7 B48 / 28 B51 / gap52 road and physics preserved',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
  const art=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true});
  assert.equal(JSON.stringify(doc),frozen);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.ok(art.triangles>=2500&&art.triangles<50000);
  assert.equal(art.stations,16);assert.equal(art.layers,3);
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);assert.equal(art.newMovingHazards,0);
  assert.equal(art.art,'HOLD');assert.equal(art.officialSlope2Meters,0);
 }
});
test('CI opt-in only, wrong physics denied',()=>{
 const doc=generateG4E7BC('true-pinch','rollDeck');
 assert.equal(g4e7ciIntegratedStreetscape(doc,sample,{enabled:false}).vertices.length,0);
 doc.movingObstacles.pop();
 assert.throws(()=>g4e7ciIntegratedStreetscape(doc,sample,{enabled:true}),/exact protected/);
});
test('CI native BG 240 Hz frames never misrepresented as human',()=>{
 const data=g4e7bgNativeFrames();
 for(const road of ['true-pinch','pinch-switch']){
  const r=data.stages[road];
  assert.equal(r.frames.length,3);assert.equal(r.actualB48,7);assert.equal(r.actualMovingB51,28);
  assert.ok(r.frames.every(x=>x.speedMps>90&&x.source.includes('NOT_HUMAN')));
 }
});
