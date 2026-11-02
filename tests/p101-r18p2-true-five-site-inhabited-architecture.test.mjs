import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR18P2City,DESIGNS,SOURCE_CAMERA_SITES} from '../scripts/p101-r18p2-sculpted-inhabited-megacity-source.mjs';
test('R18P2 original actual world 5-scene visually massive inhabited megacity A/B geometry',()=>{
 const evidence=[];
 for(const world of ['true-pinch','pinch-switch']){
  const src=buildR15S3D11(world,'A_EDGE_READABLE'),original=JSON.stringify(src),geoms=[];
  assert.deepEqual(SOURCE_CAMERA_SITES.map(s=>[s.road,s.u,s.offset,s.up,s.time]),[
   [5,.18,240,100,54],[5,.48,-120,100,58],[5,.91,-120,100,61],
   [6,.30,-240,100,64],[6,.78,-120,100,67]]);
  for(const mode of DESIGNS){
   const r=buildR18P2City(src,sample,{mode});geoms.push(r.vertices);
   assert.equal(JSON.stringify(src),original,'no original physics or camera-stage mutation');
   assert.equal(r.originalB48,7);assert.equal(r.originalB51,28);
   assert.equal(r.newCollisionMeshes,0);
   assert.equal(r.temporalEpisodes,5);
   assert.ok(r.occupiedVolumes>=20);
   assert.ok(r.realOpenFacadeBays>=60);
   assert.ok(r.trueVoidAtriums>=5);
   assert.ok(r.triangles>6000&&r.triangles<130000);
   assert.equal(r.vertices.length,r.triangles*18);
   assert.ok(r.vertices.every(Number.isFinite));
   if(mode===DESIGNS[0]){
    assert.equal(r.majorSolidCityMasses,5);
    assert.equal(r.sculptedHollowShells,0);
   }else{
    assert.equal(r.majorSolidCityMasses,0);
    assert.equal(r.sculptedHollowShells,5);
   }
   assert.equal(r.ART,'HOLD');
   assert.equal(r.GAMEPLAY,'HOLD');
   assert.equal(r.HUMAN,'HOLD');
   assert.equal(r.PERFORMANCE,'HOLD');
   assert.equal(r.RELEASE,'HOLD');
   evidence.push({world,mode,source7B48:true,source28B51:true,
    triangles:r.triangles,trueCourtyards:r.trueVoidAtriums,
    occupied:r.occupiedVolumes,facadeHoles:r.realOpenFacadeBays});
  }
  assert.notDeepEqual(geoms[0],geoms[1],'architectures are NOT superficial recolors');
 }
 console.log('R18P2_TRUE_SOURCE_3D_INHABITED_VOLUMETRIC',JSON.stringify(evidence));
});
test('reject fake candidate, production stage, tampered original B51 or invalid source mode',()=>{
 const src=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR18P2City(src,sample,{mode:'R18P1_REPAINT'}));
 const published=structuredClone(src);published.stageForge.productionPromoted=true;
 assert.throws(()=>buildR18P2City(published,sample));
 const noB51=structuredClone(src);noB51.movingObstacles.pop();
 assert.throws(()=>buildR18P2City(noB51,sample));
 const wrongD11=structuredClone(src);wrongD11.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR18P2City(wrongD11,sample));
});