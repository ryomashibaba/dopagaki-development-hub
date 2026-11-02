import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7dgCanyonCandidate as DL} from '../web/p101-w9c2-g4e7dl-aperture-city.mjs';
test('DL one camera-selected deep inhabited open atrium remains strictly PRIVATE',()=>{
 const stages=g4e7djNativeStoryboard().stages;
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),before=JSON.stringify(doc);
  const shots=stages[road].frames,cx=CX(doc,sample,{enabled:true,shots});
  const dl=DL(doc,sample,{enabled:true,shots});
  assert.equal(DL(doc,sample,{enabled:false}).active,false);
  assert.equal(dl.dg.design,'APERTURE_CITY_DEEP_TRANSIT_V1');
  assert.equal(dl.dg.realAperture,true);
  assert.equal(dl.dg.openFront,true);
  assert.equal(dl.dg.recessedRoomVolumes,6);
  assert.equal(dl.dg.originalGameCollidersAdded,0);
  assert.equal(dl.sources.filter(s=>s.kind==='dl-inhabited-aperture').length,1);
  assert.equal(dl.sources.filter(s=>s.kind==='anchored-civic-crescent').length,2);
  assert.equal(dl.dg.projectionCandidates.length,10);
  assert.ok(dl.dg.selectedSite.score>=0);
  for(const hero of cx.sources.filter(x=>x.kind==='anchored-civic-crescent')){
   const same=dl.sources.find(x=>x.slot===hero.slot&&x.kind===hero.kind);
   assert.ok(same);
   assert.deepEqual(dl.vertices.slice(same.firstTriangle*18,(same.firstTriangle+same.triangleCount)*18),
    cx.vertices.slice(hero.firstTriangle*18,(hero.firstTriangle+hero.triangleCount)*18));
  }
  assert.equal(dl.sources.reduce((n,s)=>n+s.triangleCount,0),dl.triangles);
  assert.ok(dl.triangles>1000&&dl.triangles<50000);
  assert.equal(JSON.stringify(doc),before);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(dl.newRoads,0);assert.equal(dl.newColliders,0);
  assert.equal(dl.newMovingHazards,0);assert.equal(dl.physicalChanged,false);
  assert.equal(dl.officialSlope2Meters,0);
  assert.equal(dl.art,'HOLD');assert.equal(dl.human,'HOLD');assert.equal(dl.publish,'HOLD');
  assert.throws(()=>DL(doc,sample,{enabled:true,shots:[{id:'fake'},shots[1]]}),/genuine 240Hz/);
 }
});
