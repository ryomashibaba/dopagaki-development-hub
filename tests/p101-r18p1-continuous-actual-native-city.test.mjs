import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR18P1City,DESIGNS} from '../scripts/p101-r18p1-temporal-inhabited-city-architecture.mjs';

test('R18P1 temporal source city uses five real original camera sites, not repeated two-city shell',()=>{
 const outcome=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE');
  const frozen=JSON.stringify(doc),generated=[];
  for(const mode of DESIGNS){
   const r=buildR18P1City(doc,sample,{mode});
   assert.equal(r.episodes,5);
   assert.deepEqual(r.sites.map(x=>[x.road,x.u,x.offset,x.up,x.time]),[
    [5,.18,240,100,54],[5,.48,-120,100,58],
    [5,.91,-120,100,61],[6,.30,-240,100,64],
    [6,.78,-120,100,67]]);
   assert.equal(r.sourceRightDefinition,'[-forward.z,0,forward.x]');
   assert.equal(r.roadB48,7);assert.equal(r.movingB51,28);
   assert.equal(r.physicsCollidersAdded,0);
   assert.ok(r.sourceLandmarks>=2);
   assert.ok(r.openAirCivicVoids>=1);
   assert.ok(r.occupiedTowerVolumes>=7);
   assert.ok(r.transitConnectors>=1);
   assert.equal(r.ART,'HOLD');
   assert.equal(r.GAMEPLAY,'HOLD');
   assert.equal(r.HUMAN,'HOLD');
   assert.equal(r.PERFORMANCE,'HOLD');
   assert.equal(r.RELEASE,'HOLD');
   assert.equal(r.MERGE,'HOLD');
   assert.ok(r.triangles>1800&&r.triangles<90000);
   assert.equal(r.vertices.length,r.triangles*18);
   assert.ok(r.vertices.every(Number.isFinite));
   generated.push(r.vertices);
   assert.equal(JSON.stringify(doc),frozen,'must never touch original 7 B48 or 28 B51');
   outcome.push({world,mode,triangles:r.triangles,spatialEpisodes:r.episodes,
    towers:r.occupiedTowerVolumes,trueOpenAirCourts:r.openAirCivicVoids,
    visibleCandidateSource:'R18_P0_REAL_NATIVE_10_CAMERA_FRAMES'});
  }
  assert.notDeepEqual(generated[0],generated[1],'A/B require structurally independent actual 3D');
 }
 console.log('R18P1_REAL_FIVE_TIME_TWO_WORLD_PHYSICAL_SOURCE_STAGE',JSON.stringify(outcome));
});
test('R18P1 rejects unapproved production stages, fake styles and missing moving hazard',()=>{
 const doc=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR18P1City(doc,sample,{mode:'R17_RECOLOR'}));
 const prod=structuredClone(doc);prod.stageForge.productionPromoted=true;
 assert.throws(()=>buildR18P1City(prod,sample));
 const missing=structuredClone(doc);missing.movingObstacles.pop();
 assert.throws(()=>buildR18P1City(missing,sample));
 const wrong=structuredClone(doc);wrong.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR18P1City(wrong,sample));
});
