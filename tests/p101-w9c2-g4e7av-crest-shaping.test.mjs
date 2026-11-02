import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AV,AV_GRADES} from '../scripts/p101-w9c2-g4e7av-crest-shaping.mjs';
import {generateG4E7AT} from '../scripts/p101-w9c2-g4e7at-crown-chasm.mjs';

const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
test('AV real first B48 crest variants preserve downstream, void cell and 28 moving B51',()=>{
 for(const road of ['true-pinch','pinch-switch']){
  const baseline=generateG4E7AT(road),frozen=JSON.stringify(baseline);
  for(const variant of Object.keys(AV_GRADES)){
   const d=generateG4E7AV(road,variant),study=d.stageForge.g4e7avStudy;
   assert.equal(study.real7Roads,true);assert.equal(study.real28Moving,true);
   assert.equal(study.physicalGapCell52StillOpen,true);
   assert.equal(study.formalSlope2Meters,0);assert.equal(study.humanFairness,'HOLD');
   assert(eq(d.surfaces.slice(1),baseline.surfaces.slice(1)));
   assert(eq(d.route.slice(22),baseline.route.slice(22)));
   assert(eq(d.spawns,baseline.spawns));
   assert.equal(d.stageForge.productionPromoted,false);
  }
  assert.equal(JSON.stringify(baseline),frozen);
 }
});
test('AV fixed variant definitions include two genuine lateral route easements',()=>{
 assert.equal(Object.keys(AV_GRADES).length,5);
 assert.equal(AV_GRADES.lineLevel.lateralEase,1);
 assert.equal(AV_GRADES.lineSoft.lateralEase,.7);
});
test('AV rejects unsupported stage',()=>assert.throws(()=>generateG4E7AV('control','crestSoft'),/unknown protected/));
