import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7dgCanyonCandidate as DK} from '../web/p101-w9c2-g4e7dk-civic-estuary.mjs';
test('DK optional civic terrain preserves exact B48/B51 native cameras and CX heroes',()=>{
 const stages=g4e7djNativeStoryboard().stages;
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),before=JSON.stringify(doc);
  const shots=stages[road].frames,cx=CX(doc,sample,{enabled:true,shots});
  const dk=DK(doc,sample,{enabled:true,shots});
  assert.equal(DK(doc,sample,{enabled:false}).active,false);
  assert.equal(dk.dg.design,'CIVIC_ESTUARY_INHABITED_TERRAIN_V1');
  assert.equal(dk.dg.urbanDetails.length,4);
  assert.ok(dk.dg.urbanDetails.every(x=>x.inhabitedChambers===6&&x.courts===6&&x.skyOpen));
  assert.ok(dk.dg.bankLinks>=8);
  assert.equal(dk.sources.filter(x=>x.kind==='dk-inhabited-estuary').length,4);
  assert.equal(dk.sources.filter(x=>x.kind==='anchored-civic-crescent').length,2);
  for(const oldHero of cx.sources.filter(x=>x.kind==='anchored-civic-crescent')){
   const same=dk.sources.find(x=>x.slot===oldHero.slot&&x.kind===oldHero.kind);
   assert.ok(same,'Original unchanged CX silhouette must remain');
   assert.deepEqual(dk.vertices.slice(same.firstTriangle*18,(same.firstTriangle+same.triangleCount)*18),
     cx.vertices.slice(oldHero.firstTriangle*18,(oldHero.firstTriangle+oldHero.triangleCount)*18));
  }
  assert.equal(dk.sources.reduce((sum,x)=>sum+x.triangleCount,0),dk.triangles);
  assert.ok(dk.triangles>1000&&dk.triangles<50000);
  assert.equal(JSON.stringify(doc),before);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(dk.newRoads,0);assert.equal(dk.newColliders,0);
  assert.equal(dk.newMovingHazards,0);assert.equal(dk.physicalChanged,false);
  assert.equal(dk.officialSlope2Meters,0);
  assert.equal(dk.art,'HOLD');assert.equal(dk.human,'HOLD');assert.equal(dk.publish,'HOLD');
  assert.throws(()=>DK(doc,sample,{enabled:true,shots:[{id:'fake'},shots[1]]}),/actual 15\/17s native 240Hz/);
 }
});
