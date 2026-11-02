import test from 'node:test';
import assert from 'node:assert/strict';
import {createB5ManualAudit,recordB5ManualSample,recordB5ManualFrame,
 observeW9C1ManualCue,exportB5ManualAudit,finalizeB5ManualAudit} from '../web/p101-b5-manual-qa.mjs';
import {compareW9C1HumanReports} from '../web/p101-w9c1-pair-qa.mjs';

const make=(kind)=>createB5ManualAudit({
 stageId:'VB-P101-A13-W9C1-'+kind,profile:'OVERDRIVE',spawnIndex:0,startSpeed:52
});
const sample=(audit,time)=>recordB5ManualSample(audit,{
 time,speed:52+time,fps:60,frameDelta:.016,input:0,
 surface:'p93-void-breaker-01',grounded:true,hazard:'none',urgency:'none',edge:'safe'
});
test('G5-C3 live export records a measured snapshot without freezing the real manual audit',()=>{
 const audit=make('CONTROL');sample(audit,0);recordB5ManualFrame(audit,.016);
 observeW9C1ManualCue(audit,{phase:'approach'},1);
 const before=audit.samples.length,frameCount=audit.performance.measuredFrames;
 const json=exportB5ManualAudit(audit,{snapshot:{
  time:2.75,surface:'p93-void-breaker-01',contacts:7,nearMisses:1,
  collisionEvents:[{type:'rebound-recovery-start',t:2,id:'native-001',forwardAfterMps:-22}]
 }});
 const obj=JSON.parse(json);
 assert.equal(obj.captureStatus,'RUNNING_SNAPSHOT_NOT_TERMINAL');
 assert.equal(obj.summary.physicsSeconds,2.75);
 assert.equal(obj.summary.status,'interrupted');
 assert.equal(obj.summary.contacts,7);
 assert.equal(obj.summary.nonlethalReboundRecovery.observedEvents.length,1);
 assert.equal(audit.final,null,'export must not end or mutate original 240Hz audit');
 assert.equal(audit.samples.length,before);
 assert.equal(audit.performance.measuredFrames,frameCount);
 assert(sample(audit,3),'subsequent samples still accepted after a running snapshot');
 recordB5ManualFrame(audit,.017);
 const finished=finalizeB5ManualAudit(audit,{
  status:'failed',time:3.4,contacts:9,nearMisses:1,failure:'コースから落下'});
 assert.equal(finished.status,'failed','real final outcome must supersede temporary snapshot');
 const terminal=JSON.parse(exportB5ManualAudit(audit));
 assert.equal(terminal.captureStatus,'TERMINAL_OBSERVATION');
 assert.equal(terminal.summary.physicsSeconds,3.4);
});
test('G5-C3 snapshot is NOT misidentified as true terminal or automatic 28m winner',()=>{
 const a=make('CONTROL'),b=make('ULTRA');sample(a,0);sample(b,0);
 const control=JSON.parse(exportB5ManualAudit(a,{snapshot:{
  time:13.6,contacts:100,nearMisses:0
 }}));
 observeW9C1ManualCue(b,{phase:'approach'},1.1);
 observeW9C1ManualCue(b,{phase:'core',speedMps:93},4.2);
 finalizeB5ManualAudit(b,{status:'failed',time:17.717,contacts:2756,nearMisses:0,failure:'コースから落下'});
 const comparison=compareW9C1HumanReports(control,JSON.parse(exportB5ManualAudit(b)));
 assert.equal(comparison.control.physicsSeconds,13.6);
 assert.equal(comparison.control.finalStatus,'running-snapshot');
 assert.equal(comparison.ultra.finalStatus,'failed');
 assert.equal(comparison.comparability.matchedStartConditions,true);
 assert.equal(comparison.comparability.bothTerminated,false);
 assert.equal(comparison.comparability.pairedObservedCore,false);
 assert.equal(comparison.winner,'UNDETERMINED');
 assert.equal(comparison.approvedForProduction,false);
});
test('G5-C3 missing/invalid snapshot cannot invent real time and keeps legacy unresolved case',()=>{
 const audit=make('CONTROL');
 assert.throws(()=>exportB5ManualAudit(audit,{snapshot:{time:NaN,contacts:0,nearMisses:0}}),
  /snapshot requires observed/);
 assert.throws(()=>exportB5ManualAudit(audit,{snapshot:{time:2,contacts:-1,nearMisses:0}}),
  /snapshot requires observed/);
 assert.equal(audit.final,null);
 const plain=JSON.parse(exportB5ManualAudit(audit));
 assert.equal(plain.captureStatus,'UNFINALIZED_NO_SNAPSHOT');
 assert.equal(plain.summary,null);
});
