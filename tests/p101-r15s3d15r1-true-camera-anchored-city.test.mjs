import test from 'node:test';import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR15S3D15R1City,DESIGNS} from '../scripts/p101-r15s3d15r1-real-camera-anchored-delta-city.mjs';
test('two genuinely unique enormous 3D inhabited city cores using measured source camera road anchors in two true worlds',()=>{
 const records=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE'),original=JSON.stringify(doc),modes=[];
  for(const mode of DESIGNS){
   const v=buildR15S3D15R1City(doc,sample,{mode});modes.push(v);
   assert.deepEqual(v.sourceCameraAnchors,[{road:5,u:.78},{road:6,u:.62}]);
   assert.equal(v.cityDistricts,2);
   assert.equal(v.originalB48RoadCount,7);
   assert.equal(v.originalB51Hazards,28);
   assert.ok(v.thickUnifiedRoofCells>200);
   assert.ok(v.realPublicDeckCells>180);
   assert.ok(v.actualAirCourtCells>80);
   assert.ok(v.continuousStructuralMembers>45);
   assert.equal(v.addedPhysicsColliders,0);
   assert.equal(v.officialArtAccepted,0);
   assert.ok(v.triangles>1500);
   assert.equal(v.vertices.length,v.triangles*18);
   assert.ok(v.vertices.every(Number.isFinite));
   assert.equal(v.ART,'HOLD');
   assert.equal(v.HUMAN,'HOLD');
   assert.equal(v.RELEASE,'HOLD');
   assert.equal(JSON.stringify(doc),original,'art cannot modify original physics');
   records.push({world,mode,triangles:v.triangles,thickRoof:v.thickUnifiedRoofCells,
     actualCivicDeckCells:v.realPublicDeckCells,trueAirCourts:v.actualAirCourtCells,
     cameraEvidence:v.screenPositionSource});
  }
  assert.notDeepEqual(modes[0].vertices,modes[1].vertices,'two modes must be different geometry');
 }
 console.log('R15S3D15R1_ORIGINAL_CAMERA_GROUNDED_CITY_MESH_TEST',JSON.stringify(records));
});
test('veto production, missing original moving machine, or fake finished state',()=>{
 const doc=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D15R1City(doc,sample,{mode:'OLD_R14_WALL_REPEAT'}));
 const promoted=structuredClone(doc);promoted.stageForge.productionPromoted=true;
 assert.throws(()=>buildR15S3D15R1City(promoted,sample));
 const hazards=structuredClone(doc);hazards.movingObstacles.pop();
 assert.throws(()=>buildR15S3D15R1City(hazards,sample));
 const failing=structuredClone(doc);failing.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR15S3D15R1City(failing,sample));
});
