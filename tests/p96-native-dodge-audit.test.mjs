import test from 'node:test';
import assert from 'node:assert/strict';
import {generateVoidHazardCandidate} from '../scripts/p95-void-hazard-build.mjs';
import {generateVoidBreaker} from '../scripts/p93-void-breaker-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';
import {makeP96RoutePlan,p96DodgeSteer,P96_PROFILES} from '../scripts/p96-avoidance-controller.mjs';
import {probeP96} from '../scripts/p96-native-dodge-probe.mjs';

test('P96 plan samples the original seven B48 surface guides and twelve B51-C machines without mutations',()=>{
 const doc=generateVoidHazardCandidate(),before=JSON.stringify(doc);
 const r=new Runner(doc,compile(doc),0,44),plan=makeP96RoutePlan(doc,r);
 assert.equal(DT,1/240);assert.equal(plan.lengths.length,7);
 assert.equal(plan.stations.length,12);
 assert(plan.totalDistance>3400&&plan.totalDistance<4500);
 assert(plan.stations.every((s,i)=>s.id===doc.movingObstacles[i].id));
 assert(plan.stations.every((s,i)=>i===0||s.at>plan.stations[i-1].at));
 assert.equal(JSON.stringify(doc),before);
 assert.throws(()=>makeP96RoutePlan(generateVoidBreaker(),r),/P95 candidate only/);
});
test('P96 controller gives bounded real manual-compatible steer commands; unchanged physics and untouched PB',()=>{
 const doc=generateVoidHazardCandidate(),r=new Runner(doc,compile(doc),0,44);
 const plan=makeP96RoutePlan(doc,r),before=JSON.stringify(doc);
 for(const profile of P96_PROFILES){
  for(let i=0;i<480;i++){
   const decision=p96DodgeSteer(r,plan,profile);
   assert(Number.isFinite(decision.input)&&Math.abs(decision.input)<=1);
   assert(Number.isFinite(decision.leadDistance)||decision.leadDistance===null);
   r.step(decision.input);
   if(r.status==='failed')break;
  }
 }
 assert.equal(JSON.stringify(doc),before);
 assert.equal(doc.stageForge.humanPlaytest,'NOT_RUN');
 assert.equal(doc.stageForge.fullStartToFinish,'SCRIPTED_240HZ_12_ACTIVE_7_OF_7_PASS_P96');
});
test('P96 bounded partial native route cannot ever be falsely accepted as full win',()=>{
 const doc=generateVoidHazardCandidate(),world=compile(doc);
 const out=probeP96('early-soft',{doc,world,limitSeconds:2});
 assert.equal(out.status,'HOLD_NOT_FULLY_TRAVERSED');
 assert.equal(out.physicsHz,240);
 assert.equal(out.finishEvent,false);
 assert(out.visited.length<7);
 assert.equal(out.machineContacts.length,0);
 assert.throws(()=>probeP96('early-soft',{limitSeconds:101}),/Unbounded/);
});
