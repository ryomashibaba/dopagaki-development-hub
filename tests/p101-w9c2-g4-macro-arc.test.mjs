import test from 'node:test';
import assert from 'node:assert/strict';
import {generateW9C2G4MacroArc,G4_MACRO_VARIANTS,G4_SECTION,g4Shape} from '../scripts/p101-w9c2-g4-macro-arc-build.mjs';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {tessellate,sample} from '../private/reference_only/director/surface.js';
import {g4NativePass} from '../scripts/p101-w9c2-g4-native-matrix.mjs';
const dist=(a,b)=>Math.hypot(...a.map((x,i)=>x-b[i]));
test('G4 independent 1.8km genuine B48 physical S and crest, 6 actual machines retargeted',()=>{
 const gold=generateP101A13W7Candidate(),frozen=JSON.stringify(gold);
 for(const [kind,plan] of Object.entries(G4_MACRO_VARIANTS)){
  const doc=generateW9C2G4MacroArc(kind),s=doc.surfaces[G4_SECTION];
  assert.equal(doc.stageForge.recordStageId,plan.recordStageId);
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.stageForge.nativeScriptedProof,null);
  assert.equal(doc.stageForge.g4MacroArcStudy.nominalSectionLengthMeters,1800);
  assert.equal(doc.stageForge.g4MacroArcStudy.reanchoredNativeMachineIds.length,6);
  assert.equal(doc.stageForge.g4MacroArcStudy.originalRouteOutsideChapterPreserved,true);
  assert.equal(doc.movingObstacles.length,28);
  assert.equal(doc.spawns.length,gold.spawns.length);
  assert.equal(tessellate(s).degenerate,0);
  assert.deepEqual(doc.surfaces.filter((x,i)=>i!==G4_SECTION),
   gold.surfaces.filter((x,i)=>i!==G4_SECTION));
  const moves=doc.movingObstacles.map((x,i)=>dist(x.position,gold.movingObstacles[i].position));
  assert.equal(moves.filter(x=>x>1e-5).length,6);
  for(let i=0;i<28;i++){
   const a=doc.movingObstacles[i],b=gold.movingObstacles[i];
   assert.equal(a.type,b.type);assert.equal(a.period,b.period);assert.equal(a.phase,b.phase);
   assert.deepEqual(a.collision,b.collision);assert.deepEqual(a.size,b.size);
  }
  const diff=u=>{
   const a=sample(s,u,.5),b=sample(gold.surfaces[G4_SECTION],u,.5);
   return dist(a,b);
  };
  assert(diff(.3)>15&&diff(.7)>15,'G4 must have monumental true displacement');
  assert(Math.abs(sample(s,.5,.5)[1]-sample(gold.surfaces[G4_SECTION],.5,.5)[1])>7);
  assert.deepEqual(s.points.slice(0,5),gold.surfaces[G4_SECTION].points.slice(0,5));
  assert.deepEqual(s.points.slice(-5),gold.surfaces[G4_SECTION].points.slice(-5));
 }
 assert.equal(JSON.stringify(gold),frozen);
});
test('G4 controls are opt-in only and cannot silently select unknown stage',()=>{
 assert.equal(g4Shape(0,'sweep').active,false);
 assert.equal(g4Shape(.4,'sweep').active,true);
 assert.throws(()=>g4Shape(.4,'invalid'));
 assert.throws(()=>generateW9C2G4MacroArc('invalid'));
 assert.throws(()=>g4NativePass('invalid',205));
});
test('G4 real 240Hz native run is explicitly local and not human proof',()=>{
 const r=g4NativePass('sweep',150,{maxSeconds:5.2});
 assert.equal(r.nativeHz,240);
 assert.equal(r.realMachines,28);
 assert.equal(r.syntheticLocalStart,true);
 assert.equal(r.fullCourseStart,false);
 assert.equal(r.scriptedInput,'P94_CORRECTIVE_NOT_HUMAN');
 assert.equal(r.productionApproved,false);
 assert(r.elapsed>0);
});
