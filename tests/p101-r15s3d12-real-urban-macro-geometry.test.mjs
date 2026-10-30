import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {buildR15S3D12City,CITY_MODES} from '../scripts/p101-r15s3d12-two-real-camera-urban-macro-scenes.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('2 real distinct major three-dimensional architectural proposals x 2 native finished worlds, with source B48/B51 unchanged',()=>{
 const all=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE'),frozen=JSON.stringify(doc);
  const [A,B]=CITY_MODES.map(mode=>buildR15S3D12City(doc,sample,{mode}));
  for(const r of [A,B]){
   assert.equal(r.sourceRoads,7);assert.equal(r.sourceMovingB51,28);
   assert.deepEqual(r.actualSourceRoadSegments,[5,6]);
   assert.ok(r.triangles>1100);
   assert.ok(r.voidCells>30);
   assert.ok(r.habitableUnits>130);
   assert.equal(r.sourceB48B51RunnerCameraInputUnchanged,true);
   assert.equal(r.addedRealCollisionObjects,0);
   assert.equal(r.officialArtAdopted,0);
   assert.equal(r.ART,'HOLD');
   assert.equal(r.RELEASE,'HOLD');
   assert.equal(r.vertices.length,r.triangles*18);
   assert.ok(r.vertices.every(Number.isFinite));
   all.push({mode:r.mode,triangles:r.triangles,voids:r.voidCells,units:r.habitableUnits});
  }
  assert.equal(JSON.stringify(doc),frozen,'city cannot mutate real game source data');
  assert.notDeepEqual(A.vertices,B.vertices,'two competing city schemes cannot be recolors');
  assert.equal(A.openPublicCourts,0);
  assert.ok(B.openPublicCourts>=20);
  assert.ok(A.undersideTrusses>10);
  assert.ok(B.skyRibs>=40);
 }
 console.log('R15S3D12_ACTUAL_SOURCE_MESH_COMPARISON',JSON.stringify(all));
});
test('reject invalid stage/unknown modes, never silently draw on public Gold',()=>{
 const doc=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D12City(doc,sample,{mode:'EXISTING_GATE_REPAINT'}));
 const broken=structuredClone(doc);
 broken.stageForge.productionPromoted=true;
 assert.throws(()=>buildR15S3D12City(broken,sample,{mode:CITY_MODES[0]}));
 const altered=structuredClone(doc);
 altered.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR15S3D12City(altered,sample,{mode:CITY_MODES[1]}));
});
