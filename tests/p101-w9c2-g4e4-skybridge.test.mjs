import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E4Skybridge} from '../scripts/p101-w9c2-g4e4-skybridge-receiver.mjs';
import {generateG4E3PhysicalGap} from '../scripts/p101-w9c2-g4e3-geometry-preserving-gap.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
import {compile,contacts} from '../private/reference_only/director/collision.js';
test('G4E-4 real skybridge is independent fixed collision road, no fake gap floor, all originals byte identical',()=>{
 const base=generateG4E3PhysicalGap({cells:1,centerU:.59});
 for(const elevation of [119,123,127]){
  const doc=generateG4E4Skybridge({elevation}),receiver=doc.surfaces[7];
  assert.equal(doc.surfaces.length,8);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces.slice(0,7),base.surfaces);
  assert.deepEqual(doc.movingObstacles,base.movingObstacles);
  assert.deepEqual(doc.route,base.route);
  assert.deepEqual(doc.routeSegments,base.routeSegments);
  assert.deepEqual(doc.spawns,base.spawns);
  assert.equal(receiver.rows,31);
  assert.equal(receiver.cols,5);
  assert.equal(receiver.rideable,true);
  assert.equal(receiver.collidable,true);
  assert.equal(tessellate(receiver).degenerate,0);
  assert.equal(doc.stageForge.g4e4Receiver.noDynamicCatch,true);
  assert.equal(doc.stageForge.g4e4Receiver.approvedSlopeDNAMeters,0);
  assert.equal(doc.stageForge.productionPromoted,false);
  const gap=doc.stageForge.g4e3PhysicalGap,source=doc.surfaces[3],
   mid=sample(source,(gap.uTakeoff+gap.uLanding)/2,.5);
  assert.equal(contacts(compile(doc),[mid[0],mid[1]+.65,mid[2]],.65)
   .filter(c=>c.triangle.rideable).length,0);
 }
});
test('G4E-4 rejects unreviewed receiver elevations',()=>{
 assert.throws(()=>generateG4E4Skybridge({elevation:110}));
});
