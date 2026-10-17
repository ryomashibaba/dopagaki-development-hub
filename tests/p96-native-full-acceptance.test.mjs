import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidHazardCandidate} from '../scripts/p95-void-hazard-build.mjs';
import {generateVoidBreaker} from '../scripts/p93-void-breaker-build.mjs';
import {generateP96DodgeEvidence} from '../scripts/p96-acceptance-evidence.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {createNativeDemoState,nativeDemoSteer,isDemoEligible} from '../web/p78-demo.mjs';

test('P96 actual 7/7 B48+B51-C full run: 12 colliders stay enabled, original P94/P95 surfaces unchanged',()=>{
 const d=generateVoidHazardCandidate(),before=JSON.stringify(d);
 const evidence=generateP96DodgeEvidence(d);
 assert.equal(evidence.stageId,'VB-P95');
 assert.equal(evidence.activeCollidingMachines,12);
 assert.equal(evidence.scriptedFullPass,true);
 assert.equal(evidence.humanPlaytest,'NOT_RUN');
 assert.equal(evidence.difficultyAndFairness,'HOLD');
 assert.equal(evidence.best.status,'SCRIPTED_NATIVE_FULL_PASS');
 assert.equal(evidence.best.visited.length,7);
 assert.deepEqual(evidence.best.missing,[]);
 assert.equal(evidence.best.finishEvent,true);
 assert.deepEqual(evidence.best.machineContacts,[]);
 assert.equal(evidence.best.decisionStations.length,12);
 assert(evidence.best.elapsed>35&&evidence.best.elapsed<50);
 assert(evidence.unsafe.status!=='SCRIPTED_NATIVE_FULL_PASS');
 assert.equal(d.stageForge.fullStartToFinish,'SCRIPTED_240HZ_12_ACTIVE_7_OF_7_PASS_P96');
 assert.equal(d.stageForge.inheritedP94Evidence,false);
 assert.equal(JSON.stringify(d),before);
 assert.deepEqual(d.surfaces,generateVoidBreaker().surfaces);
 assert.equal(DT,1/240);
});
test('P96 spectator itself reaches finish on native 240Hz physics with 12 real moving obstacles (never writes PB)',()=>{
 const course=generateVoidHazardCandidate(),runner=new Runner(course,compile(course),0,44);
 const state=createNativeDemoState(),reached=new Set([runner.surface]);
 assert.equal(isDemoEligible(course),true);
 for(let k=0;k<240*60&&!['failed','finished'].includes(runner.status);k++){
  const input=nativeDemoSteer(state,runner,movingObstaclePose);
  assert(Number.isFinite(input)&&Math.abs(input)<=1,'input must remain legal manual steering');
  runner.step(input);
  if(runner.surface)reached.add(runner.surface);
 }
 assert.equal(runner.status,'finished','real physical spectator never completed all 12 active hazards');
 assert.equal(reached.size,7);
 assert(runner.events.some(e=>e.type==='finish'));
 assert.equal(runner.events.filter(e=>e.type==='moving-contact').length,0);
 assert(Math.abs(runner.time-39.904)<.25,'real 240Hz spectator timing drift');
 assert.equal(course.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(isDemoEligible({stageForge:{id:'EP-001'}}),false);
});
