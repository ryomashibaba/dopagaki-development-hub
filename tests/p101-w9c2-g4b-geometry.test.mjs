import test from 'node:test';
import assert from 'node:assert/strict';
import {generateW9C2G4MacroArc,G4B_OFFLINE_VARIANTS} from '../scripts/p101-w9c2-g4-macro-arc-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {sample,tessellate} from '../private/reference_only/director/surface.js';
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
test('G4B isolated wide true B48 long arcs preserve all 28 machine mechanics',()=>{
 const gold=generateP101A13W7Candidate(),original=JSON.stringify(gold);
 const first=JSON.stringify(generateW9C2G4MacroArc('sweep')),
  second=JSON.stringify(generateW9C2G4MacroArc('skyline'));
 for(const [kind,plan] of Object.entries(G4B_OFFLINE_VARIANTS)){
  const doc=generateW9C2G4MacroArc(kind);
  assert.equal(doc.stageForge.g4MacroArcStudy.g4bDerivedCandidate,true);
  assert.equal(doc.stageForge.recordStageId,plan.recordStageId);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.nativeScriptedProof,null);
  assert.equal(doc.movingObstacles.length,28);
  assert.equal(doc.stageForge.g4MacroArcStudy.reanchoredNativeMachineIds.length,6);
  assert.equal(tessellate(doc.surfaces[3]).degenerate,0);
  assert.equal(doc.spawns.length,gold.spawns.length);
  assert(doc.surfaces.every(s=>s.points.every(p=>p.every(Number.isFinite))));
  assert(doc.movingObstacles.every((o,i)=>o.type===gold.movingObstacles[i].type&&
   o.period===gold.movingObstacles[i].period&&o.phase===gold.movingObstacles[i].phase&&
   JSON.stringify(o.collision)===JSON.stringify(gold.movingObstacles[i].collision)));
  assert(dist(sample(doc.surfaces[3],.28,.5),sample(gold.surfaces[3],.28,.5))>12);
 }
 assert.equal(JSON.stringify(gold),original);
 assert.equal(JSON.stringify(generateW9C2G4MacroArc('sweep')),first);
 assert.equal(JSON.stringify(generateW9C2G4MacroArc('skyline')),second);
});
