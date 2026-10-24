import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AJ} from '../scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {g4e7anSkyArchipelago} from '../web/p101-w9c2-g4e7an-sky-archipelago.mjs';

for(const road of ['true-pinch','pinch-switch']){
 test('AN '+road+' is independent 4-object architecture on real AJ B48, zero physics changes',()=>{
  const doc=generateG4E7AJ(road,'reanchor'),frozen=JSON.stringify(doc);
  const art=g4e7anSkyArchipelago(doc,sample,{enabled:true});
  assert.equal(art.active,true);
  assert.equal(art.monuments,4);
  assert.equal(art.hollowCrowns,1);
  assert.equal(art.crownHoles,1);
  assert(art.crownShellSegments>=25);
  assert.equal(art.splitCitadelProngs,2);
  assert.equal(art.floatingDecks,3);
  assert.equal(art.harpoonBranches,3);
  assert(art.triangles>=450&&art.triangles<16000);
  assert(art.vertices.every(Number.isFinite));
  assert(art.maximumRiseMeters>=800);
  assert(art.minimumOutboardMeters>=50);
  assert.equal(art.nonCollision,true);
  assert.equal(art.addedCollision,0);
  assert.equal(art.addedRoads,0);
  assert.equal(art.addedMachines,0);
  assert.equal(art.certifiedSlope2Meters,0);
  assert.equal(art.publish,'HOLD');
  assert.equal(doc.movingObstacles.length,28);
  assert.equal(doc.surfaces.length,7);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(JSON.stringify(doc),frozen);
  assert.equal(g4e7anSkyArchipelago(doc,sample).active,false);
  assert.equal(JSON.stringify(doc),frozen);
 });
}
test('AN prevents normal-source, simulated-provenance or production promoted stage',()=>{
 const original=generateG4E7AJ('true-pinch','original');
 assert.throws(()=>g4e7anSkyArchipelago(original,sample,{enabled:true}),/requires genuine private/);
 const promoted=generateG4E7AJ('true-pinch','reanchor');
 promoted.stageForge.productionPromoted=true;
 assert.throws(()=>g4e7anSkyArchipelago(promoted,sample,{enabled:true}),/requires genuine private/);
 const tampered=generateG4E7AJ('true-pinch','reanchor');
 tampered.stageForge.g4e7ajStudy.reanchoredOriginalIds=['not-original'];
 assert.throws(()=>g4e7anSkyArchipelago(tampered,sample,{enabled:true}),/requires genuine private/);
});
