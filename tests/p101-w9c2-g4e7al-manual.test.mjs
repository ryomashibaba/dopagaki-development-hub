import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7AJ} from '../scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,RADIUS} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {createG4E7ALTrial,observeG4E7ALStep,observeG4E7ALFrame,exportG4E7ALTrial,
 newG4E7ALSession,appendG4E7ALTrial,archiveG4E7ALRetry,exportG4E7ALSession,G4E7AL_ROADS} from '../web/p101-w9c2-g4e7al-manual-qa.mjs';
test('AL two real AJ B48/B51 candidate stage originals are never mutated by manual probes',()=>{
 const session=newG4E7ALSession();
 for(const road of G4E7AL_ROADS){
  const doc=generateG4E7AJ(road,'reanchor'),frozen=JSON.stringify(doc);
  const runner=new Runner(doc,compile(doc),0,52);
  const t=createG4E7ALTrial(doc,runner);
  assert.equal(t.road,road);assert.equal(doc.surfaces.length,7);
  assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  runner.step(.1);
  observeG4E7ALStep(t,doc,runner,1,sample,RADIUS,movingObstaclePose,sphereBoxSeparation);
  observeG4E7ALStep(t,doc,runner,-1,sample,RADIUS,movingObstaclePose,sphereBoxSeparation);
  observeG4E7ALFrame(t,1/60,.01);
  const report=exportG4E7ALTrial(t,runner,{noticed:'no',fairness:'unsure',note:'test only'});
  assert.equal(report.source,'LOCAL_MANUAL_INPUT_NO_P96');
  assert.equal(report.metrics.physicsSteps,2);
  assert.equal(report.metrics.activeDirectionalSteps,2);
  assert.equal(report.steerTransitions.length,2);
  assert.equal(report.render.medianRafFps,60);
  assert.equal(report.status,'INTERRUPTED_NOT_A_CLEAR');
  assert.equal(report.automatedUpload,false);
  assert.equal(report.humanFairness,'HOLD');
  assert.equal(report.certifiedSlope2Meters,0);
  assert.equal(report.physicalCourse.reanchoredOriginalB51,2);
  assert.equal(JSON.stringify(doc),frozen);
  archiveG4E7ALRetry(session,report);
  appendG4E7ALTrial(session,report);
 }
 const summary=exportG4E7ALSession(session);
 assert.equal(summary.completedBoth,true);
 assert.equal(summary.restartedAttempts.length,2);
 assert.equal(summary.olderAttemptsDropped,0);
 assert.equal(summary.automaticallySubmitted,false);
 assert.equal(summary.humanFairness,'HOLD');
 assert.deepEqual(summary.runs.map(r=>r.road),G4E7AL_ROADS);
 assert.throws(()=>appendG4E7ALTrial(session,summary.runs[0]),/provenance/);
});
test('AL forbids rejected moving layout and non-original spawn',()=>{
 const doc=generateG4E7AJ('true-pinch','original');
 const runner=new Runner(doc,compile(doc),0,52);
 assert.throws(()=>createG4E7ALTrial(doc,runner),/requires original start00/);
 const correct=generateG4E7AJ('true-pinch','reanchor');
 correct.stageForge.productionPromoted=true;
 assert.throws(()=>createG4E7ALTrial(correct,new Runner(correct,compile(correct),0,52)),/requires original start00/);
});

test('AL restart history caps itself at 12 and refuses ordering drift',()=>{
 const s=newG4E7ALSession(),doc=generateG4E7AJ('true-pinch','reanchor');
 const r=new Runner(doc,compile(doc),0,52),t=createG4E7ALTrial(doc,r);
 const report=exportG4E7ALTrial(t,r);
 for(let i=0;i<14;i++)archiveG4E7ALRetry(s,report);
 const out=exportG4E7ALSession(s);
 assert.equal(out.restartedAttempts.length,12);
 assert.equal(out.olderAttemptsDropped,2);
 assert(out.restartedAttempts.every(x=>x.restartedBeforeNextRun===true));
 assert.throws(()=>archiveG4E7ALRetry(s,{...report,road:'pinch-switch'}),/provenance/);
 assert.equal(out.automaticallySubmitted,false);
});
