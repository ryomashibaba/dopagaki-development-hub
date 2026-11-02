import test from 'node:test';import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR15S3D14R1City,DESIGNS} from '../scripts/p101-r15s3d14r1-real-inhabited-hollow-city-districts.mjs';
test('two genuinely distinct inhabited floating districts around three monumental hollow focal megastructures; no original physical edits',()=>{
 const results=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE'),before=JSON.stringify(doc),shapes=[];
  for(const mode of DESIGNS){
   const o=buildR15S3D14R1City(doc,sample,{mode});shapes.push(o);
   assert.equal(o.originalRealB48,7);assert.equal(o.originalMovingB51,28);
   assert.equal(o.realCrescentStructures,3);
   assert.equal(o.realPublicTerraceLevels,15);
   assert.equal(o.suspendedNeighborhoodShells,18);
   assert.ok(o.habitableDeckSurfaceCells>150);
   assert.ok(o.trueAirCourtyards>15);
   assert.equal(o.addedPhysicalCollisionObjects,0);
   assert.ok(o.triangles>o.referenceCrescentTriangleCount+1500);
   assert.equal(o.vertices.length,o.triangles*18);
   assert.ok(o.vertices.every(Number.isFinite));
   assert.equal(o.officialArtAccepted,0);
   assert.equal(o.ART,'HOLD');
   assert.equal(o.GAMEPLAY,'HOLD');assert.equal(o.RELEASE,'HOLD');
   assert.equal(JSON.stringify(doc),before);
   results.push({world,mode,triangles:o.triangles,originalIconicTriangles:o.referenceCrescentTriangleCount,
    habitableSurfaceCells:o.habitableDeckSurfaceCells,authenticEmptyCourtyards:o.trueAirCourtyards});
  }
  assert.notDeepEqual(shapes[0].vertices,shapes[1].vertices,'two hypotheses cannot be same mesh recolors');
 }
 console.log('R15S3D14R1_ACTUAL_INHABITED_3D_HOLLOW_CIVIC_DISTRICTS',JSON.stringify(results));
});
test('veto production, missing real moving body, unrelated road geometry, unknown fake city variant',()=>{
 const d=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D14R1City(d,sample,{mode:'FAKE_ENDLESS_GATES'}));
 const p=structuredClone(d);p.stageForge.productionPromoted=true;assert.throws(()=>buildR15S3D14R1City(p,sample));
 const q=structuredClone(d);q.movingObstacles.pop();assert.throws(()=>buildR15S3D14R1City(q,sample));
 const r=structuredClone(d);r.stageForge.r15s3d11.mode='B_INNER_CROSSING';assert.throws(()=>buildR15S3D14R1City(r,sample));
});
