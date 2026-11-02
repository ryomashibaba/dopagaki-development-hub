import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7BC} from '../scripts/p101-w9c2-g4e7bc-bank-contour.mjs';
import {generateG4E7AY} from '../scripts/p101-w9c2-g4e7ay-tangent-bridge.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,RADIUS} from '../private/reference_only/director/physics.js';
import {sample} from '../private/reference_only/director/surface.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {createG4E7ALTrial,observeG4E7ALStep,exportG4E7ALTrial,newG4E7ALSession,appendG4E7ALTrial,exportG4E7ALSession} from '../web/p101-w9c2-g4e7al-manual-qa.mjs';
const roads=['true-pinch','pinch-switch'];
test('BE actual BC rollDeck preserves real native B48 & moving B51 in BOTH private manual runs',()=>{
 const session=newG4E7ALSession();
 for(const road of roads){
  const doc=generateG4E7BC(road,'rollDeck'),frozen=JSON.stringify(doc);
  assert.equal(doc.surfaces.length,7);assert.equal(doc.movingObstacles.length,28);
  assert.deepEqual(doc.surfaces[0].voidLongitudinalCells,[52]);
  assert.equal(doc.stageForge.productionPromoted,false);
  const r=new Runner(doc,compile(doc),0,52);
  const t=createG4E7ALTrial(doc,r);
  assert.equal(t.physicalCandidate,'G4E7BC_ROLLDECK_PRIVATE_REAL_CROWN_CHASM');
  r.step(1);
  observeG4E7ALStep(t,doc,r,1,sample,RADIUS,movingObstaclePose,sphereBoxSeparation);
  const report=exportG4E7ALTrial(t,r);
  assert.equal(report.source,'LOCAL_MANUAL_INPUT_NO_P96');
  assert.equal(report.physicalCourse.researchBCRealContour,true);
  assert.equal(report.metrics.activeDirectionalSteps,1);
  assert.equal(report.automatedUpload,false);
  assert.equal(report.normalGameLeaderboardWrites,false);
  assert.equal(report.humanFairness,'HOLD');
  assert.equal(report.certifiedSlope2Meters,0);
  appendG4E7ALTrial(session,report);
  assert.equal(JSON.stringify(doc),frozen);
 }
 const summary=exportG4E7ALSession(session);
 assert.equal(summary.completedBoth,true);
 assert.deepEqual(summary.runs.map(x=>x.road),roads);
 assert.equal(summary.realHumanTrial,'UNVERIFIED_UNTIL_ACTUAL_USER_PLAY');
});
test('BE refuses wrong BC design, manipulated production flags and forged real moving objects',()=>{
 const reject=doc=>assert.throws(()=>createG4E7ALTrial(doc,new Runner(doc,compile(doc),0,52)),/BC|requires/);
 reject(generateG4E7BC('true-pinch','skylineSaddle'));
 const published=generateG4E7BC('true-pinch','rollDeck');
 published.stageForge.productionPromoted=true;reject(published);
 const altered=generateG4E7BC('true-pinch','rollDeck');
 altered.stageForge.g4e7bcStudy.movedB51=[];reject(altered);
 // Existing AY manual route is unaffected by the stricter optional BC validation.
 const old=generateG4E7AY('true-pinch','bankedSweep');
 assert.equal(createG4E7ALTrial(old,new Runner(old,compile(old),0,52)).physicalCandidate,
  'G4E7AY_BANKED_TANGENT_REAL_CROWN');
});
