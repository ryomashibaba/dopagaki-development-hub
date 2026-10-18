import test from 'node:test';
import assert from 'node:assert/strict';
import {makeW6DiagnosticDoc,W6_CASES} from '../scripts/p101-a13-ablation.mjs';
import {generateP101A13RoadCandidate} from '../scripts/p101-a13-road-build.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('W6 2x2 diagnostics preserve exact real width/12+16 original native moving-collider choices',()=>{
 const official=generateP101A13RoadCandidate(),b5=generateP101B5Speedway({lowerReversalLength:1800});
 const untouched=JSON.stringify(official);
 for(const spec of W6_CASES){
  const doc=makeW6DiagnosticDoc(spec);
  assert.equal(doc.stageForge.variant,'A13_GAMEPLAY_ISOLATED');
  assert.equal(doc.stageForge.fullStartToFinish,'NOT_VERIFIED_A13');
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.spawns.length,official.spawns.length);
  assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,spec.additional16?28:12);
  assert.deepEqual(doc.movingObstacles.slice(0,12),b5.movingObstacles);
  assert.deepEqual(doc.surfaces,spec.road==='B5_WIDE_IN_MEMORY'?b5.surfaces:official.surfaces);
  const width=Math.hypot(...sample(doc.surfaces[1],.5,1).map((x,k)=>x-sample(doc.surfaces[1],.5,0)[k]));
  assert(width>(spec.road==='B5_WIDE_IN_MEMORY'?100:60));
  assert(width<(spec.road==='B5_WIDE_IN_MEMORY'?135:90));
 }
 assert.equal(JSON.stringify(official),untouched,'A13 on-disk source is never mutated by W6 experiment');
});
