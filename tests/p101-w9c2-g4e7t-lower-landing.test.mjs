import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7TRejoin,G4E7T_REJOIN} from '../scripts/p101-w9c2-g4e7t-lower-landing-build.mjs';
import {generateG4E7TPhysical} from '../scripts/p101-w9c2-g4e7t-real-early-gap-build.mjs';
import {g4e7tLandingMatrix} from '../scripts/p101-w9c2-g4e7t-lower-landing-native.mjs';
import {tessellate} from '../private/reference_only/director/surface.js';
test('G4E-7T R2 has TRUE lower real B48 landing and unchanged moving machines',()=>{
 const base=generateG4E7TPhysical('solid'),signature=JSON.stringify(base);
 const docs=G4E7T_REJOIN.map(x=>generateG4E7TRejoin(x.id));
 for(const d of docs){
  const m=d.stageForge.g4e7tRejoin;
  assert(m.shapedRows>=7);assert(m.maxDropMeters>8);
  assert(m.measuredNarrowWidthMeters>11&&m.measuredNarrowWidthMeters<22);
  assert.equal(m.originalMovingObstacles,28);assert.equal(m.actualRoads,7);
  assert.equal(tessellate(d.surfaces[0]).degenerate,0);
  assert.deepEqual(d.movingObstacles,base.movingObstacles);
  assert.deepEqual(d.surfaces.slice(1),base.surfaces.slice(1));
  assert.equal(m.officiallyApprovedSlope2Meters,0);
  if(m.gap){assert(m.gap.realAbsentB48Cells);assert(m.gap.noInvisibleCollisionFloor);}
 }
 assert.deepEqual(docs[0].surfaces[0].points,docs[1].surfaces[0].points);
 assert.deepEqual(docs[0].surfaces[0].points,docs[2].surfaces[0].points);
 assert.equal(JSON.stringify(generateG4E7TPhysical('solid')),signature);
});
test('G4E-7T R2 native 240Hz reports landing without inventing approval',()=>{
 const d=g4e7tLandingMatrix();
 assert.equal(d.physicsHz,240);assert.equal(d.start00,true);
 assert.equal(d.candidateRuns.length,4);
 for(const x of d.candidateRuns){
  assert(x.timeSeconds>3);assert(x.peakMps>=52);
  assert.equal(x.officialSlope2Meters,0);assert.equal(x.humanFairness,'HOLD');
 }
});
