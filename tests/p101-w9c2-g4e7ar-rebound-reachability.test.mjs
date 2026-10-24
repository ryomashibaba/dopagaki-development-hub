import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {g4e7arEvidence} from '../scripts/p101-w9c2-g4e7ar-rebound-reachability.mjs';

test('AR actual B51 rotor sweep contact / counterfactual PUSH vs BOUNCE and 240Hz edge maneuver',()=>{
 const x=g4e7arEvidence();
 assert.equal(x.actualPhysicsHz,240);
 assert.equal(x.physicsRoads,7);
 assert.equal(x.movingB51,28);
 assert.equal(x.preservedOtherB51,26);
 assert.equal(x.formalSlope2Meters,0);
 assert.equal(x.humanQA,'HOLD');assert.equal(x.promote,'HOLD');
 assert.deepEqual(x.comparisons.map(g=>g.road),['true-pinch','pinch-switch']);
 let kernelContacts=0,fullRunnerContacts=0;
 for(const group of x.comparisons){
  assert.equal(group.results.length,2);
  assert.equal(group.results[0].name,'AJ_REANCHOR');
  assert.equal(group.results[1].name,'AP_TEMPORAL_SLALOM');
  assert(group.baselineEndedSeconds>0);
  for(const trial of group.results){
   const rotor=trial.trueCollisionRotor;
   assert.equal(rotor.rotorId,'a13-machine-02');
   assert.equal(rotor.kernel.length,2);
   assert.deepEqual(rotor.modes.map(x=>x.counterfactualMode),['push','bounce']);
   for(const hit of rotor.kernel){
    if(!hit.hit)continue;
    kernelContacts++;
    assert.deepEqual(hit.modes.map(x=>x.mode),['push','bounce']);
    assert(hit.modes[1].deltaVelocityMps>=hit.modes[0].deltaVelocityMps-0.02);
    assert(hit.modes[0].responseKernelOnly);
   }
   for(const mode of rotor.modes){
    for(const attempt of mode.launches){
     assert(attempt.simulatedSeconds>0&&attempt.simulatedSeconds<=.245);
     assert.match(attempt.method,/INJECTED_CHECKPOINT/);
     if(attempt.physicalContactObserved){
      fullRunnerContacts++;
      assert.equal(attempt.actualContactMode,mode.counterfactualMode);
      assert(Number.isFinite(attempt.forwardAlongRoadAfterMps));
     }
    }
   }
   assert.equal(trial.edgeReachability.length,4);
   for(const p of trial.edgeReachability){
    assert.equal(p.actualPhysicsHz,240);
    assert.equal(p.sameAjBaselineInput,true);
    assert(p.durationSeconds>0&&p.durationSeconds<=6.71);
    assert(p.roadSamples>0);
    assert(Number.isFinite(p.minimumSampledSignedMarginMeters));
    assert(['running','failed','finished','ready'].includes(p.status));
    assert.match(p.limitation,/NOT_A_PROOF/);
   }
  }
 }
 assert(kernelContacts>0,'AR did not find real swept-OBB geometry contact');
 assert(fullRunnerContacts>0,'AR controlled native Runner did not register a true B51 contact');
 if(process.env.DOPAGAKI_G4E7AR_EVIDENCE){
  const file=process.env.DOPAGAKI_G4E7AR_EVIDENCE;
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,JSON.stringify(x,null,2)+'\n');
 }
 console.log('G4E7AR_NATIVE_GATE '+JSON.stringify({kernelContacts,fullRunnerContacts,
  groups:x.comparisons.map(g=>({road:g.road,
   modes:g.results.map(y=>({name:y.name,
    contacts:y.trueCollisionRotor.modes.map(z=>({mode:z.counterfactualMode,
     hits:z.launches.filter(a=>a.physicalContactObserved).length,
     reversed:z.launches.filter(a=>a.reverseAtActualRunnerContact===true).length})),
    edges:y.edgeReachability.map(e=>({id:e.id,status:e.status,t:e.durationSeconds,minMargin:e.minimumSampledSignedMarginMeters,reason:e.failureReason}))}))
  }))}));
});
test('AR protects original research from input outside validated time',()=>{
 assert.throws(()=>g4e7arEvidence({seconds:1}),/time bound/);
});
