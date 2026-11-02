import test from 'node:test';import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR15S3D16City,DESIGNS} from '../scripts/p101-r15s3d16-true-camera-city-heart-architecture.mjs';
test('two true original camera 3D civic cities, full physical 7 B48/28 B51 immutable',()=>{
 const results=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE'),frozen=JSON.stringify(doc),geometries=[];
  for(const mode of DESIGNS){
   const r=buildR15S3D16City(doc,sample,{mode});geometries.push(r.vertices);
   assert.equal(r.majorDistricts,2);
   assert.deepEqual(r.realAnchors,[{road:5,u:.78},{road:6,u:.62}]);
   assert.equal(r.originalRoads,7);assert.equal(r.originalMovingHazards,28);
   assert.equal(r.addedOriginalPhysicsObjects,0);
   assert.equal(r.collisionAdded,0);
   assert.ok(r.triangles>6500);
   assert.ok(r.realBuildingVolumes>=65);
   assert.ok(r.realThickUrbanDecks>150);
   assert.ok(r.courtyardOpenSectors>=20);
   assert.ok(r.realArchitecturalOpenings>25);
   assert.ok(r.majorConnectedMembers>=40);
   assert.ok(r.spineLightWells>10);
   assert.equal(r.vertices.length,r.triangles*18);
   assert.ok(r.vertices.every(Number.isFinite));
   assert.equal(r.ART,'HOLD');
   assert.equal(r.HUMAN,'HOLD');
   assert.equal(r.RELEASE,'HOLD');
   assert.equal(JSON.stringify(doc),frozen,'no mutation of source physical stage');
   results.push({world,mode,triangles:r.triangles,occupiedVolumes:r.realBuildingVolumes,skySpine:r.majorConnectedMembers,openCourtyards:r.courtyardOpenSectors});
  }
  assert.notDeepEqual(geometries[0],geometries[1],'alternate city must be actual 3D geometry distinct, not recolor');
 }
 console.log('R15S3D16_REAL_CAMERA_CITY_GEOMETRY',JSON.stringify(results));
});
test('reject fake certified art, wrong or production source and failed hazard mode',()=>{
 const real=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D16City(real,sample,{mode:'REPAINT_OLD_WALL'}));
 const promoted=structuredClone(real);promoted.stageForge.productionPromoted=true;
 assert.throws(()=>buildR15S3D16City(promoted,sample));
 const missing=structuredClone(real);missing.movingObstacles.pop();
 assert.throws(()=>buildR15S3D16City(missing,sample));
 const failed=structuredClone(real);failed.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR15S3D16City(failed,sample));
});
