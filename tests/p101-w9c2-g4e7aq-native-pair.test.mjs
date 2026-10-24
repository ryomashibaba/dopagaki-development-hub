import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {makeG4E7AQEvidence} from '../scripts/p101-w9c2-g4e7aq-native-pair.mjs';

test('AQ actual 240Hz AJ vs AP same-input A/B with real OBB lanes, no human-claim',()=>{
 const x=makeG4E7AQEvidence();
 assert.equal(x.schema,'dopagaki.w9c2.g4e7aq-real-B48-B51-temporal-AB/1');
 assert.equal(x.physicsHz,240);
 assert.equal(x.genuineB48Surfaces,7);assert.equal(x.realB51Machines,28);
 assert.equal(x.untouchedOriginalB51,26);
 assert.equal(x.formalSlope2Meters,0);assert.equal(x.manualFairness,'HOLD');
 assert.equal(x.visualQuality,'HOLD');assert.equal(x.publication,'HOLD');
 assert.deepEqual(x.comparison.map(c=>c.road),['true-pinch','pinch-switch']);
 for(const group of x.comparison){
  assert.deepEqual(group.cases.map(c=>c.candidate),['AJ_REANCHOR','AP_TEMPORAL_SLALOM']);
  assert(group.sharedSteering.baselineValidTicks>0);
  assert.equal(group.sharedSteering.plannedTicks,Math.round(7.2*240));
  for(const c of group.cases){
   assert.deepEqual(c.probes.map(p=>p.id),['replayed-p96','early-left','early-right']);
   assert.deepEqual(c.hazards.map(h=>h.id),['a13-machine-01','a13-machine-02']);
   for(const h of c.hazards){
    assert(h.widthMeters>=9);
    assert.equal(h.sampledInstants,121);
    assert(h.centerBlockedSamples>=0&&h.centerBlockedSamples<=121);
    assert(h.oneEdgeUnblockedSamples>=0&&h.oneEdgeUnblockedSamples<=121);
    assert.match(h.claim,/NOT_A_CONNECTED/);
   }
   for(const p of c.probes){
    assert.equal(p.actualNativePhysicsHz,240);
    assert(p.durationSeconds>0&&p.durationSeconds<=7.21);
    assert(['running','failed','finished','ready'].includes(p.status));
    assert(p.finalPosition.every(Number.isFinite));
    assert.equal(p.humanClearance,'HOLD');
    assert.equal(p.sampledMovingOBB10HzOnly,true);
    assert(p.OBBSamples>0);
    for(const id of ['a13-machine-01','a13-machine-02']){
     assert(Object.hasOwn(p.minimumSampledB51Clearance,id));
    }
   }
  }
  // An identical script driving a different physical hazard is a causal A/B
  // for THAT script only, not a statement of human reachable route.
  assert(group.sharedSteering.generation.includes('same 240Hz'));
 }
 if(process.env.DOPAGAKI_G4E7AQ_EVIDENCE){
  const file=process.env.DOPAGAKI_G4E7AQ_EVIDENCE;
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,JSON.stringify(x,null,2)+'\n');
 }
 console.log('G4E7AQ_AB_METRICS '+JSON.stringify(x.comparison.map(c=>({
  road:c.road,refTicks:c.sharedSteering.baselineValidTicks,
  cases:c.cases.map(v=>({kind:v.candidate,
   spatial:v.hazards.map(h=>({id:h.id,center:h.centerBlockedSamples,freeEdge:h.oneEdgeUnblockedSamples})),
   runs:v.probes.map(p=>({id:p.id,stat:p.status,t:p.durationSeconds,contacts:p.actualRunnerMovingContacts,reason:p.failureReason}))}))
 }))));
});
