import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR15S3D17City,DESIGNS} from '../scripts/p101-r15s3d17-roadside-civic-architecture.mjs';

test('R15S3D17 genuine physical-world geometry, two distinct construction typologies',()=>{
 const records=[];
 for(const world of ['true-pinch','pinch-switch']){
  const stage=buildR15S3D11(world,'A_EDGE_READABLE');
  const frozen=JSON.stringify(stage),samples=[];
  for(const mode of DESIGNS){
   const art=buildR15S3D17City(stage,sample,{mode});
   assert.equal(art.originalRoads,7);
   assert.equal(art.originalMovingHazards,28);
   assert.equal(art.addedOriginalPhysicsObjects,0);
   assert.equal(art.collisionAdded,0);
   assert.deepEqual(art.realAnchors,[{road:5,u:.78},{road:6,u:.62}]);
   assert.equal(art.districts,2);
   assert.ok(art.occupiedVolumes>=4);
   assert.ok(art.trueOpenCourts>=4);
   assert.ok(art.structuralMembers>=6);
   assert.ok(art.triangles>1500);
   assert.ok(art.triangles<65000);
   assert.equal(art.vertices.length,art.triangles*18);
   assert.ok(art.vertices.every(Number.isFinite));
   assert.equal(art.ART,'HOLD');
   assert.equal(art.GAMEPLAY,'HOLD');
   assert.equal(art.HUMAN,'HOLD');
   assert.equal(art.PERFORMANCE,'HOLD');
   assert.equal(art.RELEASE,'HOLD');
   if(mode===DESIGNS[0]){
    assert.equal(art.sourceAlignedThresholds,2);
    assert.equal(art.stationCourts,0);
   }else{
    assert.equal(art.sourceAlignedThresholds,0);
    assert.equal(art.stationCourts,4);
   }
   samples.push(art.vertices);
   assert.equal(JSON.stringify(stage),frozen,
    'art may not mutate any original stage property');
   records.push({world,mode,triangles:art.triangles,openCourts:art.trueOpenCourts,
    volumes:art.occupiedVolumes,sourceCollidersAdded:art.collisionAdded});
  }
  assert.notDeepEqual(samples[0],samples[1],
   'new modes require actual distinct geometry not palette changes');
 }
 console.log('R15S3D17_SOURCE_REAL_GEOMETRY_NONCOLLIDING',JSON.stringify(records));
});

test('Reject production, missing B51, unsupported modes and wrong frozen D11 baseline',()=>{
 const source=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D17City(source,sample,{mode:'D16_RECOLOR'}));
 const prod=structuredClone(source);prod.stageForge.productionPromoted=true;
 assert.throws(()=>buildR15S3D17City(prod,sample));
 const bad=structuredClone(source);bad.movingObstacles.pop();
 assert.throws(()=>buildR15S3D17City(bad,sample));
 const prev=structuredClone(source);prev.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR15S3D17City(prev,sample));
});