import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E6FSubcellGap,G4E6F_VARIANTS} from '../scripts/p101-w9c2-g4e6f-subcell-gap-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
test('G4E-6F physical 3.5–7m subcells are genuinely unsupported, original Gold preserved, re-tessellation candidly reported',()=>{
 const gold=generateP101A13W7Candidate(),base=JSON.stringify(gold);
 assert.equal(gold.surfaces[0].resolution,3);
 assert.equal(G4E6F_VARIANTS.length,5);
 for(const cfg of G4E6F_VARIANTS){
  const doc=generateG4E6FSubcellGap(cfg.id),g=doc.stageForge.g4e6EarlyGap,
   road=doc.surfaces[0];
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.equal(road.resolution,cfg.resolution);
  assert.equal(g.sourceResolution,3);
  assert.equal(g.candidateResolution,cfg.resolution);
  assert.equal(g.collisionMeshChangedOnRoadI,true);
  assert.equal(gapFloor(g,doc),false);
  assert.deepEqual(doc.surfaces.map(x=>x.points),gold.surfaces.map(x=>x.points));
  assert.deepEqual(doc.surfaces.map(x=>x.id),gold.surfaces.map(x=>x.id));
  assert.deepEqual(doc.surfaces.slice(1),gold.surfaces.slice(1));
  assert.deepEqual(doc.route,gold.route);
  assert.deepEqual(doc.routeSegments,gold.routeSegments);
  assert.deepEqual(doc.spawns,gold.spawns);
  assert.deepEqual(doc.movingObstacles,gold.movingObstacles);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
  assert.equal(g.approvedSlopeDNAMeters,0);
  assert.ok(g.gapMeters>2&&g.gapMeters<10);
  const mesh=tessellate(road),uncut=tessellate({...road,voidLongitudinalCells:undefined});
  assert.equal(mesh.degenerate,0);
  assert.equal(uncut.topIndexCount-mesh.topIndexCount,6*cfg.cells*(road.cols-1)*cfg.resolution);
  assert.equal(uncut.bottomIndexCount-mesh.bottomIndexCount,6*cfg.cells*(road.cols-1)*cfg.resolution);
 }
 assert.equal(JSON.stringify(gold),base);
});
function gapFloor(g,doc){
 const p=sample(doc.surfaces[0],(g.uTakeoff+g.uLanding)/2,.5);
 return contacts(compile(doc),[p[0],p[1]+.65,p[2]],.65)
  .some(x=>x.triangle.rideable);
}
test('G4E-6F unknown site rejected',()=>{
 assert.throws(()=>generateG4E6FSubcellGap('F9-147-1'));
});
