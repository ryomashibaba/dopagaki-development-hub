import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {buildR15S3D14R2City,SCHEMES} from '../scripts/p101-r15s3d14r2-source-real-visible-civic-pavilions.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('source-road A and B: actual five new visible civic clusters do not mutate the REAL 7 B48, 28 B51 or Runner',()=>{
 const data=[];
 for(const world of ['true-pinch','pinch-switch']){
  const doc=buildR15S3D11(world,'A_EDGE_READABLE');
  const frozen=JSON.stringify(doc),variants=[];
  for(const mode of SCHEMES){
   const r=buildR15S3D14R2City(doc,sample,{mode});
   variants.push(r);
   assert.equal(r.mode,mode);assert.equal(r.realOriginalB48,7);assert.equal(r.realMovingB51,28);
   assert.equal(r.addedOriginalCollisionBodies,0);
   assert.equal(r.officialArtCount,0);assert.equal(r.ART,'HOLD');
   assert.equal(r.GAMEPLAY,'HOLD');assert.equal(r.HUMAN,'HOLD');
   assert.equal(r.RELEASE,'HOLD');
   assert.ok(r.triangles>r.sourceArchitectureTriangles+2500);
   assert.equal(r.vertices.length,r.triangles*18);
   assert.ok(r.vertices.every(Number.isFinite));
   assert.equal(r.sites.length,5);
   assert.equal(r.bigPublicCanopies,10);
   assert.ok(r.realOpenCivicCourts>=100);
   assert.ok(r.inhabitedSurfaceSections>180);
   assert.ok(r.continuousCanopyCells>300);
   assert.ok(r.multilevelPublicTerraces>=15);
   assert.ok(r.minRealRoadShoulderVisualSetbackM>=45);
   assert.ok(r.sites.some(s=>s.road===6&&Math.abs(s.u-.205)<.001));
   assert.equal(JSON.stringify(doc),frozen);
   data.push({world,mode,triangles:r.triangles,courtyards:r.realOpenCivicCourts,
    civicSections:r.inhabitedSurfaceSections,canopies:r.bigPublicCanopies});
  }
  assert.notDeepEqual(variants[0].vertices,variants[1].vertices,'true geometry alternatives not recolors');
  assert.ok(variants[1].realOpenCivicCourts>variants[0].realOpenCivicCourts,'open sky design must have more actual open space');
 }
 console.log('R15S3D14R2_TRUE_VISIBLE_CITY_GEOMETRY',JSON.stringify(data));
});
test('veto production, missing hazards, rejected B51 lane config, arbitrary bogus city',()=>{
 const d=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR15S3D14R2City(d,sample,{mode:'PAINTED_FAKE_TOWERS'}));
 const x=structuredClone(d);x.stageForge.productionPromoted=true;
 assert.throws(()=>buildR15S3D14R2City(x,sample));
 const y=structuredClone(d);y.movingObstacles.pop();
 assert.throws(()=>buildR15S3D14R2City(y,sample));
 const z=structuredClone(d);z.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR15S3D14R2City(z,sample));
});
