import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E3PhysicalGap} from '../scripts/p101-w9c2-g4e3-geometry-preserving-gap.mjs';
import {generateW9C2G4ENarrow} from '../scripts/p101-w9c2-g4e-narrow-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
const eq=(a,b)=>assert.deepEqual(a,b);
test('G4E-3 true gap removes entire physical top and underside cells while preserving every Gold spline control',()=>{
 const gold=generateW9C2G4ENarrow('shoulder'),source=gold.surfaces[3],goldMesh=tessellate(source);
 for(const cells of [1,2,3]){
  const candidate=generateG4E3PhysicalGap({cells}),road=candidate.surfaces[3],
   meta=candidate.stageForge.g4e3PhysicalGap,mesh=tessellate(road);
  eq(road.points,source.points);
  eq(candidate.route,gold.route);eq(candidate.routeSegments,gold.routeSegments);
  eq(candidate.movingObstacles,gold.movingObstacles);eq(candidate.spawns,gold.spawns);
  assert.equal(candidate.surfaces.length,7);
  assert.equal(candidate.movingObstacles.length,28);
  assert.equal(mesh.degenerate,0);
  const nv=(road.cols-1)*road.resolution;
  assert.equal(goldMesh.topIndexCount-mesh.topIndexCount,6*cells*nv);
  assert.equal(goldMesh.bottomIndexCount-mesh.bottomIndexCount,6*cells*nv);
  assert.equal(mesh.sideIndexCount-goldMesh.sideIndexCount,12*nv-12*cells);
  for(const u of [.02,.21,.42,.5,.56,.72,.93]){
   eq(sample(road,u,.5),sample(source,u,.5));
   eq(sample(road,u,0),sample(source,u,0));
   eq(sample(road,u,1),sample(source,u,1));
  }
  const mid=sample(road,(meta.uTakeoff+meta.uLanding)/2,.5);
  const hits=contacts(compile(candidate),[mid[0],mid[1]+.65,mid[2]],.65)
   .filter(x=>x.triangle.rideable);
  assert.equal(hits.length,0,'Actual missing physical floor at midpoint');
  assert.equal(meta.realB48ColliderCutout,true);
  assert.equal(meta.approvedSlopeDNAMeters,0);
  assert.equal(candidate.stageForge.productionPromoted,false);
 }
});
test('invalid physical gap metadata fails closed, not silently ignored',()=>{
 const doc=generateW9C2G4ENarrow('shoulder');
 const nu=(doc.surfaces[3].rows-1)*doc.surfaces[3].resolution;
 for(const invalid of [[-1],[nu],[12,12],[18,17],[],[.5]]){
  doc.surfaces[3].voidLongitudinalCells=invalid;
  assert.throws(()=>validate(doc));
 }
});
