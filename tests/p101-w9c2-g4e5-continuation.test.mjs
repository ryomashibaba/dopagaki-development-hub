import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E5Continuation,G4E5_POLICY} from '../scripts/p101-w9c2-g4e5-physical-continuation.mjs';
import {generateG4E4Skybridge} from '../scripts/p101-w9c2-g4e4-skybridge-receiver.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
test('G4E5 real continuation has exact collidable bridge seam, preserved 8 physical roads and 28 hazards',()=>{
 const baseline=generateG4E4Skybridge({elevation:123});
 for(const lengthMeters of G4E5_POLICY.runwayLengths){
  const doc=generateG4E5Continuation({lengthMeters});
  assert.deepEqual(doc.surfaces.slice(0,8),baseline.surfaces);
  assert.deepEqual(doc.routeSegments,baseline.routeSegments);
  assert.deepEqual(doc.route,baseline.route);
  assert.deepEqual(doc.spawns,baseline.spawns);
  assert.deepEqual(doc.movingObstacles,baseline.movingObstacles);
  assert.equal(doc.surfaces.length,9);
  assert.equal(doc.movingObstacles.length,28);
  const road=doc.surfaces[8],p=sample(road,0,.5),
   bridgeEnd=sample(doc.surfaces[7],1,.5);
  assert.equal(road.id,G4E5_POLICY.roadId);
  assert.equal(road.rows,31);
  assert.equal(road.cols,5);
  assert.equal(road.rideable,true);
  assert.equal(road.collidable,true);
  assert.equal(tessellate(road).degenerate,0);
  assert.ok(Math.hypot(...p.map((v,k)=>v-bridgeEnd[k]))<1e-6);
  assert.ok(doc.stageForge.g4e5Continuation.elevationDropMeters>15);
  assert.equal(doc.stageForge.g4e5Continuation.roadVConnected,false);
  assert.equal(doc.stageForge.g4e5Continuation.approvedSlopeDNAMeters,0);
  assert.equal(doc.stageForge.productionPromoted,false);
 }
});
test('G4E5 rejects unapproved runway dimensions',()=>{
 assert.throws(()=>generateG4E5Continuation({lengthMeters:1000}));
});
