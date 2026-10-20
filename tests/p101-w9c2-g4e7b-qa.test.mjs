import test from 'node:test';
import assert from 'node:assert/strict';
import {generateP101A13W7Candidate} from '../scripts/p101-a13-w7-gameplay-build.mjs';
import {generateG4E6EarlyGap} from '../scripts/p101-w9c2-g4e6-early-gap-build.mjs';
import {Runner} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {createGapQa,qaSteer,qaStep,qaObservation} from '../web/p101-w9c2-g4e7b-qa.mjs';
test('G4E7B only permits genuine private 7-road scripted P96 evidence, not Gold',()=>{
 const gold=generateP101A13W7Candidate();
 assert.equal(createGapQa(gold,new Runner(gold,compile(gold),0,52),true),null);
 for(const id of ['C0-55-1','B0-65-1']){
  const doc=generateG4E6EarlyGap(id),r=new Runner(doc,compile(doc),0,52);
  assert.equal(createGapQa(doc,r,false),null);
  const qa=createGapQa(doc,r,true);
  assert.equal(qa.route.lengths.length,7);
  assert.ok(Math.abs(qaSteer(qa,r))<=1/4.8);
  qaStep(qa,r);
  assert.equal(qaObservation(qa,r).airSeen,false);
  assert.equal(doc.stageForge.productionPromoted,false);
 }
});
