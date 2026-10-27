import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {g4e7djNativeStoryboard} from '../scripts/p101-w9c2-g4e7dj-native-storyboard.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape as CX} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7dgCanyonCandidate as DM} from '../web/p101-w9c2-g4e7dm-living-confluence.mjs';
test('DM six genuine outboard neighborhoods and four transit links retain native physics and CX heroes',()=>{
 const native=g4e7djNativeStoryboard();
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),original=JSON.stringify(doc),
   shots=native.stages[road].frames,cx=CX(doc,sample,{enabled:true,shots});
  const dm=DM(doc,sample,{enabled:true,shots});
  assert.equal(DM(doc,sample,{enabled:false}).active,false);
  assert.equal(dm.dg.design,'LIVING_CONFLUENCE_INHABITED_TRANSIT_V1');
  assert.equal(dm.dg.districts.length,6);
  assert.equal(dm.dg.links.length,4);
  assert.equal(dm.dg.occupiedRooms,36);
  assert.ok(dm.dg.districts.every(d=>d.openCourts===1&&d.frontOpen));
  assert.ok(dm.dg.links.every(l=>l.nonPhysical));
  assert.equal(dm.sources.filter(s=>s.kind==='dm-occupied-quarter').length,6);
  assert.equal(dm.sources.filter(s=>s.kind==='dm-confluence-transit').length,4);
  assert.equal(dm.sources.filter(s=>s.kind==='anchored-civic-crescent').length,2);
  for(const old of cx.sources.filter(s=>s.kind==='anchored-civic-crescent')){
   const source=dm.sources.find(s=>s.kind===old.kind&&s.slot===old.slot);
   assert.ok(source);
   assert.deepEqual(dm.vertices.slice(source.firstTriangle*18,(source.firstTriangle+source.triangleCount)*18),
    cx.vertices.slice(old.firstTriangle*18,(old.firstTriangle+old.triangleCount)*18));
  }
  assert.equal(dm.sources.reduce((n,s)=>n+s.triangleCount,0),dm.triangles);
  assert.equal(JSON.stringify(doc),original);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(dm.newRoads,0);assert.equal(dm.newColliders,0);
  assert.equal(dm.newMovingHazards,0);assert.equal(dm.physicalChanged,false);
  assert.equal(dm.officialSlope2Meters,0);
  assert.equal(dm.art,'HOLD');assert.equal(dm.human,'HOLD');assert.equal(dm.publish,'HOLD');
  assert.throws(()=>DM(doc,sample,{enabled:true,shots:[{id:'fake'},shots[1]]}),/native 240Hz/);
 }
});
