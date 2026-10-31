import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7dgCanyonCandidate as DN} from '../web/p101-w9c2-g4e7dn-negative-space.mjs';
test('DN PRIVATE UNROOF/REVEAL subtracts only known CX sources without altered gameplay',()=>{
 const native=g4e7djNativeStoryboard();
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),before=JSON.stringify(doc);
  const shots=native.stages[road].frames,cx=CX(doc,sample,{enabled:true,shots});
  const A=DN(doc,sample,{enabled:true,shots,mode:'UNROOF'});
  const B=DN(doc,sample,{enabled:true,shots,mode:'REVEAL'});
  assert.equal(DN(doc,sample,{enabled:false}).active,false);
  assert.ok(A.triangles<cx.triangles&&B.triangles<A.triangles);
  assert.ok(A.dg.removed.every(s=>s.kind==='distant-folded-roofline'));
  assert.equal(B.dg.removed.filter(s=>s.kind==='roadbank-promenade').length,1);
  for(const v of [A,B]){
   assert.equal(v.dg.addedTriangles,0);
   assert.equal(v.dg.untouchedHeroCount,2);
   for(const h of cx.sources.filter(s=>s.kind==='anchored-civic-crescent')){
    const match=v.sources.find(s=>s.kind===h.kind&&s.slot===h.slot);
    assert.ok(match);
    assert.deepEqual(v.vertices.slice(match.firstTriangle*18,(match.firstTriangle+match.triangleCount)*18),
     cx.vertices.slice(h.firstTriangle*18,(h.firstTriangle+h.triangleCount)*18));
   }
   assert.equal(v.sources.reduce((n,s)=>n+s.triangleCount,0),v.triangles);
   assert.equal(v.newRoads,0);assert.equal(v.newColliders,0);
   assert.equal(v.newMovingHazards,0);assert.equal(v.physicalChanged,false);
   assert.equal(v.officialSlope2Meters,0);
   assert.equal(v.art,'HOLD');assert.equal(v.publish,'HOLD');
  }
  assert.equal(JSON.stringify(doc),before);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.throws(()=>DN(doc,sample,{enabled:true,shots,mode:'INVALID'}),/invalid PRIVATE/);
 }
});
