import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7UMicroLanding,G4E7U_GRADES} from '../scripts/p101-w9c2-g4e7u-micro-landing-build.mjs';
import {generateG4E7UPhysical} from '../scripts/p101-w9c2-g4e7u-single-cell-build.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
test('G4E-7U E only adjusts real narrow B48 0.8–2.4m; original one53 intact',()=>{
 const original=generateG4E7UPhysical('one53'),src=JSON.stringify(original);
 const docs=G4E7U_GRADES.map(({id})=>generateG4E7UMicroLanding(id));
 assert.deepEqual(docs[0].surfaces,original.surfaces);
 for(const doc of docs){
  const s=doc.stageForge.g4e7uLanding;
  assert(s.minTrueRoadWidthMeters>11&&s.minTrueRoadWidthMeters<22);
  assert(s.realGap.realCollisionGap);assert(s.realGap.noInvisibleBridge);
  assert(s.actualShiftMeters<=2.5);assert(s.modifiedControlRows<=5);
  assert.equal(s.officialSlope2Meters,0);assert.equal(s.humanFairness,'HOLD');
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.movingObstacles,original.movingObstacles);
  assert.deepEqual(doc.surfaces.slice(1),original.surfaces.slice(1));
  assert.equal(tessellate(doc.surfaces[0]).degenerate,0);
 }
 assert.equal(JSON.stringify(generateG4E7UPhysical('one53')),src);
 assert.throws(()=>generateG4E7UMicroLanding('wild'),/enum/);
});
