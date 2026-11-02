import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E6EarlyGap} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner} from '../private/reference_only/director/physics.js';
import {G4E7D_PROTOCOL,createG4E7DTrial,observeG4E7DStep,observeG4E7DFrame,
 exportG4E7DTrial,createG4E7DSession,completeG4E7DSession,exportG4E7DSession}
 from '../web/p101-w9c2-g4e7d-human-qa.mjs';

test('G4E7D human QA uses real original B48 and never modifies Gold or records fake landing',()=>{
 const gold=generateP101A13W7Candidate(),snapshot=JSON.stringify(gold);
 const session=createG4E7DSession();
 assert.throws(()=>createG4E7DTrial(gold,new Runner(gold,compile(gold),0,52),
  G4E7D_PROTOCOL[0]),/private original/);
 for(const step of G4E7D_PROTOCOL){
  const doc=generateG4E6EarlyGap(step.id),immutable=JSON.stringify(doc);
  const runner=new Runner(doc,compile(doc),0,52);
  const trial=createG4E7DTrial(doc,runner,step);
  observeG4E7DFrame(trial,1/60,0,false);
  observeG4E7DFrame(trial,1/40,0.04,true);
  observeG4E7DStep(trial,runner,0);
  const report=exportG4E7DTrial(trial,runner,{visibility:'unsure'});
  assert.equal(report.physics.observedOriginalRoadLanding18Ticks,false);
  assert.equal(report.physics.observedAirAfterArm,false);
  assert.equal(report.status,'RUNNING_SNAPSHOT_NOT_TERMINAL');
  assert.equal(report.render.frameCount,2);
  assert.equal(report.input,'HUMAN_KEYBOARD_OR_TOUCH_NOT_P96');
  assert.equal(report.approvedSlopeDnaMeters,0);
  assert.equal(JSON.stringify(doc),immutable);
  completeG4E7DSession(session,report);
 }
 assert.equal(JSON.stringify(gold),snapshot);
 const done=JSON.parse(exportG4E7DSession(session));
 assert.equal(done.completedPairs,true);
 assert.deepEqual(done.runs.map(x=>x.nonCollisionCue),['OFF','ON','OFF','ON']);
 assert.equal(done.runs.length,4);
 assert.equal(done.humanFairness,'HOLD_UNTIL_INDEPENDENT_REVIEW');
 assert.throws(()=>completeG4E7DSession(session,done.runs[0]),/sequence mismatch/);
});
