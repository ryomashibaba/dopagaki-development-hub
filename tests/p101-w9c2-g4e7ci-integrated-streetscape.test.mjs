import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7ciIntegratedStreetscape} from '../web/p101-w9c2-g4e7ci-integrated-streetscape.mjs';
import {g4e7bgNativeFrames} from '../scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs';
test('CI genuine 7 B48 / 28 B51 / gap52 road and physics preserved',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
  const shots=g4e7bgNativeFrames().stages[road].frames;
  const art=g4e7ciIntegratedStreetscape(doc,sample,{enabled:true,shots});
  assert.equal(JSON.stringify(doc),frozen);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.ok(art.triangles>=1000&&art.triangles<50000);
  assert.equal(art.stations,12);assert.equal(art.layers,3);
  assert.equal(art.landmarks,2);assert.equal(art.macroSilhouette,'LOW_OPEN_CONCOURSE_WITH_SPACED_ANCHORED_DISTRICTS');
  assert.equal(art.cameraEvidence,'BG240HZ_BOTH_15_AND_17_NOT_HUMAN');
  assert.equal(art.landmarksQA.length,2);
  assert.equal(art.carvedFacades,true);assert.equal(art.openRearFacades,true);
  assert.equal(art.districtLinks,10);assert.ok(art.farRoofBays>=0&&art.farRoofBays<=10);
  console.log('G4E7CP_CONNECTED_SILHOUETTE_READ_ONLY',road,art.districtLinks,art.farRoofBays);
  assert.equal(art.clippedCellReliefs+art.fullDistrictCells,art.stations);
  assert.ok(art.fullDistrictCells>=1,'at least one occupied distant district should survive camera protection');
  console.log('G4E7CO_RETAINED_VS_RELIEVED',road,art.fullDistrictCells,art.clippedCellReliefs);
  assert.ok(art.landmarksQA.every(x=>x.road===0||x.road===1));
  assert.ok(art.landmarksQA.every(x=>x.score>=0&&Number.isFinite(x.score)&&x.framesVisible>=1&&x.framesVisible<=2&&x.score>=.12));
  console.log('G4E7CM_READ_ONLY_CAMERA_SITE_EVIDENCE',road,JSON.stringify(art.landmarksQA));
  assert.equal(art.newRoads,0);assert.equal(art.newColliders,0);assert.equal(art.newMovingHazards,0);
  assert.equal(art.art,'HOLD');assert.equal(art.officialSlope2Meters,0);
 }
});
test('CI opt-in only, wrong physics denied',()=>{
 const doc=generateG4E7BC('true-pinch','rollDeck');
 assert.equal(g4e7ciIntegratedStreetscape(doc,sample,{enabled:false}).vertices.length,0);
 assert.throws(()=>g4e7ciIntegratedStreetscape(doc,sample,{enabled:true}),/CO requires both unchanged native cameras/);
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
