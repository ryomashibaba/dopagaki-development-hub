import test from 'node:test';import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {buildR15S3D13City,DESIGNS} from '../scripts/p101-r15s3d13-real-continuous-civic-spine-3d.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('TRUE source two-world road5/6 long coherent continuous true 3D city; two spatial hypotheses without old D12 fragments',()=>{
 const cases=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE');
  const before=JSON.stringify(doc),a=[];
  for(const mode of DESIGNS){
   const result=buildR15S3D13City(doc,sample,{mode});a.push(result);
   assert.equal(result.mode,mode);
   assert.equal(result.actualRoads,7);assert.equal(result.actualMovingBodies,28);
   assert.equal(result.roadSections,2);
   assert.ok(result.chainStations>120);
   assert.ok(result.connectedSpineSegments>170);
   assert.ok(result.undercitySegments>280);
   assert.ok(result.openSurfaceCells>100);
   assert.ok(result.communityCourtCells>100);
   assert.ok(result.publicDeckCells>750);
   assert.ok(result.minTrueRoadLateralSetback>=36);
   assert.ok(result.maxRiseM>240);
   assert.ok(result.minLowerDepthM< -130);
   assert.ok(result.triangles>5000&&result.triangles<160000);
   assert.equal(result.vertices.length,result.triangles*18);
   assert.ok(result.vertices.every(Number.isFinite));
   assert.equal(result.addedPhysicsColliders,0);
   assert.equal(result.officialArtAdopted,0);
   assert.equal(result.ART,'HOLD');
   assert.equal(result.GAMEPLAY,'HOLD');
   assert.equal(result.RELEASE,'HOLD');
   assert.equal(JSON.stringify(doc),before);
   cases.push({world,mode,triangleCount:result.triangles,
    continuous:result.connectedSpineSegments,skyVoids:result.hollowSkyCells,
    civicOpenings:result.openSurfaceCells,undercity:result.undercitySegments,
    civicDecks:result.publicDeckCells,maxRiseM:result.maxRiseM});
  }
  assert.notDeepEqual(a[0].vertices,a[1].vertices,'repainting the same city is forbidden');
  assert.ok(a[1].communityCourtCells>a[0].communityCourtCells,'caldera must have truly more cut-out deck openings');
 }
 console.log('R15S3D13_ACTUAL_TWO_WORLD_CONTINUOUS_CIVIC_ARCHITECTURE',JSON.stringify(cases));
});
test('not permitted on Gold, B inner-crossing, fake hazard counts or unknown city',()=>{
 const doc=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D13City(doc,sample,{mode:'D12_FLOATING_FRAGMENTS'}));
 const promoted=structuredClone(doc);promoted.stageForge.productionPromoted=true;
 assert.throws(()=>buildR15S3D13City(promoted,sample));
 const failure=structuredClone(doc);failure.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR15S3D13City(failure,sample));
 const machineLoss=structuredClone(doc);machineLoss.movingObstacles.pop();
 assert.throws(()=>buildR15S3D13City(machineLoss,sample));
});
