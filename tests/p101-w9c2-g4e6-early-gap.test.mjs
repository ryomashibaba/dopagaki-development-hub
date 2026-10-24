import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E6EarlyGap,G4E6_SITES} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate,validate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
test('G4E6 all early true gaps preserve frozen Gold 7 physical roads, spline, machines and route',()=>{
 const gold=generateP101A13W7Candidate();
 assert.equal(G4E6_SITES.length,6);
 for(const site of G4E6_SITES){
  const doc=generateG4E6EarlyGap(site.id);
  const s=doc.surfaces[site.section],base=gold.surfaces[site.section],
   g=doc.stageForge.g4e6EarlyGap;
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(g.continuationOnSameOriginalRoad,true);
  assert.equal(g.approvedSlopeDNAMeters,0);
  assert.ok(g.gapMeters>2);
  assert.deepEqual(doc.route,gold.route);
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.deepEqual(doc.spawns,gold.spawns);
  assert.deepEqual(doc.surfaces.map(x=>x.id),gold.surfaces.map(x=>x.id));
  assert.deepEqual(doc.surfaces.map(x=>x.points),gold.surfaces.map(x=>x.points));
  for(let i=0;i<7;i++)if(i!==site.section)
   assert.deepEqual(doc.surfaces[i],gold.surfaces[i]);
  const mesh=tessellate(s),originalMesh=tessellate(base);
  const nv=(s.cols-1)*s.resolution;
  assert.equal(mesh.degenerate,0);
  assert.equal(originalMesh.topIndexCount-mesh.topIndexCount,6*site.cells*nv);
  assert.equal(originalMesh.bottomIndexCount-mesh.bottomIndexCount,6*site.cells*nv);
  const mid=sample(s,(g.uTakeoff+g.uLanding)/2,.5);
  assert.equal(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
   .filter(c=>c.triangle.rideable).length,0,'No physical rideable floor at gap');
 }
});
test('G4E6 unknown and unsafe gap IDs fail closed',()=>{
 assert.throws(()=>generateG4E6EarlyGap('A0-35-3'));
 assert.throws(()=>generateG4E6EarlyGap(''));
});
