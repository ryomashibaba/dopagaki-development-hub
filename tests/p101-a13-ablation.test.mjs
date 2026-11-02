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
  // Compare canonical authored 31x5 physical control-point widths at row 15.
  // The Catmull-Rom sampler's v=0/1 extrapolation is not a reliable width metric.
  const span=s=>Math.hypot(...s.points[75].map((x,k)=>x-s.points[79][k]));
  const wide=span(b5.surfaces[1]),narrow=span(official.surfaces[1]);
  assert(wide>narrow+20,'the physical 5-column lattice must genuinely narrow');
  assert(Math.abs(span(doc.surfaces[1])-(spec.road==='B5_WIDE_IN_MEMORY'?wide:narrow))<1e-8);
 }
 assert.equal(JSON.stringify(official),untouched,'A13 on-disk source is never mutated by W6 experiment');
});
