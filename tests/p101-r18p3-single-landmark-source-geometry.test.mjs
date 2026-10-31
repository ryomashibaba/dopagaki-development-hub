import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR18P3City,DESIGNS} from '../scripts/p101-r18p3-single-landmark-city-architecture.mjs';
test('R18P3 single dominant focal architecture, exactly four truly supporting quarters in each real world',()=>{
 const records=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE'),orig=JSON.stringify(doc),meshes=[];
  for(const mode of DESIGNS){
   const r=buildR18P3City(doc,sample,{mode});
   assert.equal(JSON.stringify(doc),orig,'source stage mutation prohibited');
   assert.equal(r.sourceOriginalB48,7);assert.equal(r.sourceOriginalB51,28);
   assert.equal(r.addedPhysicsColliders,0);
   assert.equal(r.dominantCityLandmarks,1);
   assert.equal(r.trueCentralVoids,1);
   assert.equal(r.supportingQuarters,4);
   assert.equal(r.exitSilhouettes,1);
   assert.ok(r.buildingVolumes>=9);assert.ok(r.courtyards>=4);
   assert.ok(r.triangles>1200&&r.triangles<40000);
   assert.ok(r.vertices.every(Number.isFinite));
   assert.equal(r.vertices.length,r.triangles*18);
   assert.deepEqual(Object.values(r.temporalCameraConstraints).map(s=>[
    s.road,s.u,s.offset,s.up,s.time]),[
     [5,.18,240,100,54],[5,.48,-120,100,58],
     [5,.91,-120,100,61],[6,.30,-240,100,64],
     [6,.78,-120,100,67]]);
   for(const field of ['ART','GAMEPLAY','HUMAN','PERFORMANCE','RELEASE','MERGE'])
    assert.equal(r[field],'HOLD');
   meshes.push(r.vertices);
   records.push({world,mode,triangleCount:r.triangles,
    heroCount:r.dominantCityLandmarks,minorCityQuarters:r.supportingQuarters,
    original7RoadsAnd28B51Unchanged:true,addedColliders:0});
  }
  assert.notDeepEqual(meshes[0],meshes[1],
   'two R18P3 architectures must differ in real XYZ geometry');
 }
 console.log('R18P3_SINGLE_LANDMARK_TRUE_SOURCE_3D',JSON.stringify(records));
});
test('R18P3 refuses production, invalid B51 count, nonfrozen source, fake art',()=>{
 const s=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR18P3City(s,sample,{mode:'P2_RECOLOR'}));
 const prod=structuredClone(s);prod.stageForge.productionPromoted=true;
 assert.throws(()=>buildR18P3City(prod,sample));
 const hazard=structuredClone(s);hazard.movingObstacles.pop();
 assert.throws(()=>buildR18P3City(hazard,sample));
 const stage=structuredClone(s);stage.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR18P3City(stage,sample));
});