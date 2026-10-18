import test from 'node:test';
import assert from 'node:assert/strict';
import {W7_TRIALS,makeW7TrialDoc} from '../scripts/p101-a13-w7-candidate-matrix.mjs';
import {generateP101A13RoadCandidate} from '../scripts/p101-a13-road-build.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('W7 only repositions additional moving colliders and interpolates real road width; exact frozen original 12 + centerlines/seams remain',()=>{
 const original=generateP101A13RoadCandidate(),b5=generateP101B5Speedway({lowerReversalLength:1800});
 const snap=JSON.stringify(original);
 for(const trial of W7_TRIALS){
  const doc=makeW7TrialDoc(trial);
  assert.equal(doc.stageForge.studyOnly,'W7_MATRIX_IN_MEMORY_NOT_BUILT');
  assert.equal(doc.stageForge.productionPromoted,false);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.movingObstacles.slice(0,12),original.movingObstacles.slice(0,12));
  assert.deepEqual(doc.spawns,original.spawns);
  for(let sec=0;sec<7;sec++){
   const s=doc.surfaces[sec],n=original.surfaces[sec],w=b5.surfaces[sec];
   assert.deepEqual(s.points.slice(0,5),n.points.slice(0,5));
   assert.deepEqual(s.points.slice(-5),n.points.slice(-5));
   for(const row of [0,8,15,23,30]){
    assert.deepEqual(s.points[row*5+2],n.points[row*5+2]);
    const expected=w.points[row*5].map((x,k)=>x+(n.points[row*5][k]-x)*trial.widths[sec]);
    for(let k=0;k<3;k++)assert(Math.abs(expected[k]-s.points[row*5][k])<1e-8);
   }
  }
  for(let i=12;i<28;i++){
   const o=doc.movingObstacles[i],base=original.movingObstacles[i];
   assert.equal(o.id,base.id);assert.equal(o.type,base.type);
   assert.deepEqual(o.size,base.size);assert.deepEqual(o.motion,base.motion);
   assert.deepEqual(o.collision,base.collision);
   if(![13,14].includes(i))assert.deepEqual(o,base);
  }
 }
 assert.equal(JSON.stringify(original),snap);
});
