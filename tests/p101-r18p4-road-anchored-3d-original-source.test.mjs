import test from 'node:test';
import assert from 'node:assert/strict';
import {buildR15S3D11} from '../scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs';
import {sample} from '../private/reference_only/director/surface.js';
import {buildR18P4City,DESIGNS} from '../scripts/p101-r18p4-original-road-grounded-urban-fabric.mjs';

test('R18P4 actual source road aligned city uses real B48 road Y, no +41m floating base',()=>{
 const study=[];
 for(const world of ['true-pinch','pinch-switch']){
  const stage=buildR15S3D11(world,'A_EDGE_READABLE'),frozen=JSON.stringify(stage);
  const geometries=[];
  for(const mode of DESIGNS){
   const result=buildR18P4City(stage,sample,{mode});
   assert.equal(JSON.stringify(stage),frozen);
   assert.equal(result.sourceB48,7);
   assert.equal(result.sourceB51,28);
   assert.equal(result.addedColliders,0);
   assert.equal(result.artOnly,true);
   assert.deepEqual(result.groundAlignedOriginalRoadSections,[5,6]);
   assert.equal(result.actualHeroRoad,5);
   assert.equal(result.actualHeroU,.57);
   assert.equal(result.heroStructures,1);
   assert.equal(result.sourceRoadNeighborhoods,16);
   assert.ok(result.trueOpenCourts>=10);
   assert.ok(result.roadLevelVolumes>=44);
   assert.equal(result.groundedFoundations,result.roadLevelVolumes);
   assert.equal(result.lowestFoundationOffsetY,-2);
   assert.equal(result.highestFoundationOffsetY,-2);
   assert.equal(result.roadCenterNoNoncollidingFakeSurface,true);
   assert.equal(result.sourceRoadUnchanged,true);
   assert.ok(result.triangles>3000&&result.triangles<30000);
   assert.equal(result.vertices.length,result.triangles*18);
   assert.ok(result.vertices.every(Number.isFinite));
   for(const k of ['ART','GAMEPLAY','HUMAN','PERFORMANCE','RELEASE','MERGE'])
    assert.equal(result[k],'HOLD');
   geometries.push(result.vertices);
   study.push({world,mode,triangles:result.triangles,
    roadB48:result.sourceB48,b51:result.sourceB51,
    streetfront:result.sourceRoadNeighborhoods,
    trueSourceRoadGroundY:result.lowestFoundationOffsetY});
  }
  assert.notDeepEqual(geometries[0],geometries[1],
    'A and B must be different actual noncolliding XYZ meshes');
 }
 console.log('R18P4_ACTUAL_B48_GROUNDING_TWO_WORLD_NO_FAKE_ROAD',JSON.stringify(study));
});
test('R18P4 rejects fake art styles, production promotion, and source B51 tampering',()=>{
 const x=buildR15S3D11('true-pinch','A_EDGE_READABLE');
 assert.throws(()=>buildR18P4City(x,sample,{mode:'R18P3_RECOLOR'}));
 const p=structuredClone(x);p.stageForge.productionPromoted=true;
 assert.throws(()=>buildR18P4City(p,sample));
 const b=structuredClone(x);b.movingObstacles.pop();
 assert.throws(()=>buildR18P4City(b,sample));
 const d=structuredClone(x);d.stageForge.r15s3d11.mode='B_INNER_CROSSING';
 assert.throws(()=>buildR18P4City(d,sample));
});