import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {buildR15S3D14City,DESIGNS} from '../scripts/p101-r15s3d14-monumental-inhabited-hollow-crescents.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('two genuinely different enormous hollow landmark megacities are constructed on 2 real B48 worlds with ZERO original physics edits',()=>{
 const records=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE'),frozen=JSON.stringify(doc),r=[];
  for(const mode of DESIGNS){
   const x=buildR15S3D14City(doc,sample,{mode});r.push(x);
   assert.equal(x.actualOriginalB48,7);assert.equal(x.actualOriginalB51,28);
   assert.deepEqual(x.sourceRoads,[5,6]);
   assert.equal(x.districtCount,3);
   assert.equal(x.greatVoids,3);
   assert.equal(x.publicDecks,12);
   assert.ok(x.shellCells>=1000);
   assert.ok(x.centralVoidWidthM>120);
   assert.ok(x.minSideDistance>55);
   assert.ok(x.highestM>250&&x.lowestM< -100);
   assert.equal(x.realRoadRemodelMeters,0);
   assert.equal(x.addedPhysicsColliders,0);
   assert.ok(x.triangles>2300&&x.triangles<80000);
   assert.equal(x.vertices.length,x.triangles*18);
   assert.ok(x.vertices.every(Number.isFinite));
   assert.equal(x.noSideWallsCopyFromD13R1,true);
   assert.equal(x.centralAtriumHasNoOpaqueFill,true);
   assert.equal(x.officialArtAccepted,0);
   assert.equal(x.ART,'HOLD');
   assert.equal(x.GAMEPLAY,'HOLD');
   assert.equal(x.HUMAN,'HOLD');
   assert.equal(x.RELEASE,'HOLD');
   assert.equal(JSON.stringify(doc),frozen,'original game source data moved by ART');
   records.push({world,mode,triangles:x.triangles,monuments:x.districtCount,
    atriumMinWidthM:x.centralVoidWidthM,minRoadSetbackM:x.minSideDistance,
    sourceMovingHazards:x.actualOriginalB51});
  }
  assert.notDeepEqual(r[0].vertices,r[1].vertices,'different designed spatial strategies not recolors');
 }
 console.log('R15S3D14_SOURCE_REAL_CURVED_HOLLOW_MONUMENTS',JSON.stringify(records));
});
test('source integrity veto Gold, unknown mode, missing hazard, and collision-changing stage',()=>{
 const doc=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D14City(doc,sample,{mode:'REPEATED_PORTAL_CITY'}));
 const noMachines=structuredClone(doc);noMachines.movingObstacles.pop();
 assert.throws(()=>buildR15S3D14City(noMachines,sample));
 const promoted=structuredClone(doc);promoted.stageForge.productionPromoted=true;
 assert.throws(()=>buildR15S3D14City(promoted,sample));
 const wrongB51=structuredClone(doc);wrongB51.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR15S3D14City(wrongB51,sample));
});
