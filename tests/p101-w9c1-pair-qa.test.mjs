import test from 'node:test';
import assert from 'node:assert/strict';
import {createB5ManualAudit,finalizeB5ManualAudit,exportB5ManualAudit,
 observeW9C1ManualCue,recordB5ManualSample} from '../web/p101-b5-manual-qa.mjs';
import {compareW9C1HumanReports,validateW9C1HumanReport,W9C1_PAIR_SCHEMA} from '../web/p101-w9c1-pair-qa.mjs';

function fake(kind,{spawnIndex=0,profile='OVERDRIVE',core=true,seconds=12,notes='private message'}={}){
 const id='VB-P101-A13-W9C1-'+(kind==='control'?'CONTROL':'ULTRA');
 const a=createB5ManualAudit({stageId:id,spawnIndex,profile,startSpeed:52});
 recordB5ManualSample(a,{time:0,speed:52,fps:60,frameDelta:.016,input:0,
  surface:'p93-void-breaker-01',grounded:true,hazard:'none',urgency:'none',edge:'safe'});
 observeW9C1ManualCue(a,{phase:'approach'},1);
 if(core)observeW9C1ManualCue(a,{phase:'core',speedMps:90},3.5);
 const c=[{type:'rebound-recovery-start',t:3.9,id:'machine-A',forwardAfterMps:-20},
  {type:'rebound-recovery-end',t:4.9,id:'machine-A',reason:'forward-restored',forwardAfterMps:28,
   peakAppliedAccelMps2:250}];
 finalizeB5ManualAudit(a,{status:'failed',time:seconds,surface:'p93-void-breaker-01',
  contacts:2,nearMisses:1,failure:'コースから落下',collisionEvents:c});
 return JSON.parse(exportB5ManualAudit(a,{
  speedFeel:4,steeringFeel:3,hazardLegibility:4,note:notes,
  w9c1Feedback:{edgeReadability:3,failureFairness:2,warningSeenEarly:4,failureAttribution:'edge-unreadable'}
 }));
}
test('G5-C2 extracts only allowlisted paired human metrics, never free-form notes',()=>{
 const left=fake('control',{seconds:12.1}),right=fake('ultra',{seconds:10.2});
 const leftRaw=JSON.stringify(left),rightRaw=JSON.stringify(right);
 const out=compareW9C1HumanReports(left,right);
 assert.equal(out.schema,W9C1_PAIR_SCHEMA);
 assert.equal(out.comparability.matchedStartConditions,true);
 assert.equal(out.comparability.pairedObservedCore,true);
 assert.equal(out.indicators.durationDifferenceUltraMinusControlSeconds,-1.9);
 assert.equal(out.control.nominalCoreWidthMeters,28);
 assert.equal(out.ultra.nominalCoreWidthMeters,14);
 assert.equal(out.control.reboundRecoveryStarted,1);
 assert.equal(out.ultra.reboundRecoveryEnded,1);
 assert.equal(out.control.reportedEdgeReadability,3);
 assert.equal(out.humanFairness,'HOLD');
 assert.equal(out.winner,'UNDETERMINED');
 assert.equal(out.approvedForProduction,false);
 assert.equal(JSON.stringify(out).includes('private message'),false);
 assert.equal(JSON.stringify(left),leftRaw);
 assert.equal(JSON.stringify(right),rightRaw);
});
test('G5-C2 cannot claim equal test conditions with local checkpoint spawn or missing core',()=>{
 const out=compareW9C1HumanReports(fake('control',{spawnIndex:7}),
  fake('ultra',{spawnIndex:0,profile:'HYPER',core:false}));
 assert.equal(out.comparability.bothStart00,false);
 assert.equal(out.comparability.sameProfile,false);
 assert.equal(out.comparability.bothHaveCoreHud,false);
 assert.equal(out.comparability.pairedObservedCore,false);
 assert.equal(out.humanEnjoyment,'HOLD');
 assert(out.limitations.length>=5);
});
test('G5-C2 strict variant, profile and fabricated source rejection',()=>{
 const left=fake('control'),right=fake('ultra');
 assert.throws(()=>compareW9C1HumanReports(right,left),/wrong trial JSON/);
 const bad=structuredClone(left);bad.source='SCRIPTED_NATIVE_AUTOPILOT';
 assert.throws(()=>compareW9C1HumanReports(bad,right),/not a W9-C1 manual/);
 bad.source=left.source;bad.summary.status='victory';
 assert.throws(()=>validateW9C1HumanReport(bad,'control'),/invalid terminal/);
 assert.throws(()=>validateW9C1HumanReport(left,'unknown'),/Unknown W9-C1/);
});
test('G5-C2 ongoing or incomplete records remain HOLD without fabricating seconds',()=>{
 const left=fake('control');
 const a=createB5ManualAudit({stageId:'VB-P101-A13-W9C1-ULTRA',spawnIndex:0});
 const right=JSON.parse(exportB5ManualAudit(a));
 const out=compareW9C1HumanReports(left,right);
 assert.equal(out.ultra.physicsSeconds,null);
 assert.equal(out.indicators.durationDifferenceUltraMinusControlSeconds,null);
 assert.equal(out.comparability.bothTerminated,false);
 assert.equal(out.comparability.pairedObservedCore,false);
 assert.equal(out.approvedForProduction,false);
});
