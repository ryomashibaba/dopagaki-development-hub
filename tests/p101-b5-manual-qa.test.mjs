import test from 'node:test';
import assert from 'node:assert/strict';
import {createB5ManualAudit,recordB5ManualSample,recordB5ManualFrame,finalizeB5ManualAudit,exportB5ManualAudit,B5_MANUAL_SCHEMA} from '../web/p101-b5-manual-qa.mjs';

const fake=(time,input=0)=>({time,speed:52+time*3,fps:time===1?26:60,frameDelta:time===1?.05:.016,
 input,surface:'p93-void-breaker-01',grounded:true,hazard:time===1?'p95-hazard-01':'none',
 urgency:time===1?'immediate':'none',edge:time===2?'danger':'safe'});

test('A11 manual QA: real B5 only, privacy-safe 2Hz observability, quantiles and user-opinion separate from facts',()=>{
 assert.throws(()=>createB5ManualAudit({stageId:'VB-P100'}));
 const a=createB5ManualAudit({stageId:'VB-P101-B5',profile:'OVERDRIVE'});
 assert.equal(a.schema,B5_MANUAL_SCHEMA);
 assert(recordB5ManualSample(a,fake(0)));
 assert(!recordB5ManualSample(a,fake(.1)));
 recordB5ManualFrame(a,.016);
 recordB5ManualFrame(a,.05);
 assert(recordB5ManualSample(a,fake(1,-1)));
 assert(recordB5ManualSample(a,fake(2,1)));
 assert.equal(a.samples.length,3);
 assert.equal(a.hazards.visibleSamples,1);
 assert.equal(a.hazards.steeringWhileVisibleSamples,1);
 const result=finalizeB5ManualAudit(a,{status:'failed',time:2.4,surface:'p93-void-breaker-01',contacts:1,nearMisses:2,failure:'コースから落下'});
 assert.equal(result.contacts,1);
 assert.equal(result.fpsP10,26);
 assert.equal(result.fpsMedian,60);
 assert.equal(result.fpsSlowFrameSampleShare,.5);
 assert.equal(result.peakSpeedMps,58);
 assert.equal(result.physicsHz,240);
 assert(!recordB5ManualSample(a,fake(3)));
 assert.deepEqual(finalizeB5ManualAudit(a,{status:'finished',time:15}),result,'must never overwrite a failed run with invented finish');
 const json=JSON.parse(exportB5ManualAudit(a,{speedFeel:4,steeringFeel:2,hazardLegibility:1,note:'Uターンで横移動が困難'}));
 assert.equal(json.summary.status,'failed');
 assert.deepEqual(json.survey,{speedFeel:4,steeringFeel:2,hazardLegibility:1,note:'Uターンで横移動が困難'});
 for(const forbidden of ['userAgent','deviceId','ipAddress','username','location','accountId'])
  assert(!JSON.stringify(json).includes(forbidden));
 assert.equal(json.samples.length,3);
 assert.throws(()=>exportB5ManualAudit(a,{steeringFeel:6}));
 const clear=createB5ManualAudit({stageId:'VB-P101-B5'});
 assert(recordB5ManualSample(clear,{...fake(0),edge:'clear'}));
 assert.equal(clear.samples[0].edge,'safe','P81 clear was incorrectly exported as unavailable');
});
test('A11 manual QA: short or interrupted report never claims full completion or human certification',()=>{
 const a=createB5ManualAudit({stageId:'VB-P101-B5',profile:'HYPER',startSpeed:52});
 const partial=JSON.parse(exportB5ManualAudit(a));
 assert.equal(partial.summary,null);
 assert.equal(partial.survey.speedFeel,null);
 assert.equal(partial.samples.length,0);
 assert.equal(partial.source.includes('NOT_HUMAN'),true);
 const final=finalizeB5ManualAudit(a,{status:'interrupted',time:0,contacts:0,nearMisses:0});
 assert.equal(final.status,'interrupted');
 assert.equal(final.fpsP10,null);
 assert.equal(final.observedSteeringFraction,null);
});

test('A12 read-only full-frame FPS and physics backlog: full-run evidence needs spawn 00',()=>{
 assert.throws(()=>createB5ManualAudit({stageId:'VB-P101-B5',spawnIndex:-1}));
 const a=createB5ManualAudit({stageId:'VB-P101-B5',spawnIndex:3});
 for(let i=0;i<8;i++)assert(recordB5ManualFrame(a,1/60));
 assert(recordB5ManualFrame(a,1/20,{physicsOverloaded:true}));
 assert(recordB5ManualFrame(a,1/20));
 assert(recordB5ManualSample(a,fake(0)));
 const final=finalizeB5ManualAudit(a,{status:'finished',time:10,contacts:0,nearMisses:0});
 assert.equal(final.fullCourseCompletionFromStart00,false);
 assert.equal(final.renderFrameFpsP10,20);
 assert.equal(final.renderFrameFpsMedian,59.7);
 assert.equal(final.physicsOverloadedAnimationFrames,1);
 assert.equal(final.physicsOverloadedFrameShare,.1);
 const saved=JSON.parse(exportB5ManualAudit(a));
 assert.equal(saved.spawnIndex,3);
 assert.equal(saved.summary.fullCourseCompletionFromStart00,false);
 const control=createB5ManualAudit({stageId:'VB-P101-B5',spawnIndex:0});
 assert.equal(finalizeB5ManualAudit(control,{status:'finished',time:12,contacts:0,nearMisses:0}).fullCourseCompletionFromStart00,true);
 assert.equal(control.final.renderFrameFpsP10,null);
 assert.equal(control.final.physicsOverloadedFrameShare,null);
});

test('A13 isolated manual QA records real edge state and no inherited scripted finish',()=>{
 const a=createB5ManualAudit({stageId:'VB-P101-A13',profile:'OVERDRIVE',startSpeed:52,spawnIndex:0});
 assert.equal(a.schema,'dopagaki.a13-manual-qa/1');
 assert(recordB5ManualSample(a,{...fake(0),edge:'clear'}));
 assert.equal(a.samples[0].edge,'safe');
 const summary=finalizeB5ManualAudit(a,{status:'failed',time:.5,contacts:0,nearMisses:0});
 assert.equal(summary.fullCourseCompletionFromStart00,false);
 assert.equal(JSON.parse(exportB5ManualAudit(a)).stageId,'VB-P101-A13');
 const w7=createB5ManualAudit({stageId:'VB-P101-A13-W7F',profile:'OVERDRIVE',startSpeed:52,spawnIndex:0});
 assert.equal(w7.schema,'dopagaki.a13-manual-qa/1');
 assert.equal(JSON.parse(exportB5ManualAudit(w7)).stageId,'VB-P101-A13-W7F');
 const w9=createB5ManualAudit({stageId:'VB-P101-A13-W9X-B1',profile:'OVERDRIVE',startSpeed:52,spawnIndex:3});
 assert.equal(w9.schema,'dopagaki.a13-manual-qa/1');
 assert.equal(w9.stageId,'VB-P101-A13-W9X-B1');
 assert(recordB5ManualSample(w9,{...fake(0),edge:'caution'}));
 assert.equal(JSON.parse(exportB5ManualAudit(w9)).stageId,'VB-P101-A13-W9X-B1');
 assert.equal(finalizeB5ManualAudit(w9,{status:'finished',time:2.3,contacts:0,nearMisses:0}).fullCourseCompletionFromStart00,false);
 for(const id of ['VB-P101-A13-W9C1-CONTROL','VB-P101-A13-W9C1-ULTRA']){
  const c1=createB5ManualAudit({stageId:id,profile:'OVERDRIVE',startSpeed:52,spawnIndex:7});
  assert.equal(c1.stageId,id);assert.equal(JSON.parse(exportB5ManualAudit(c1)).stageId,id);
 }
 assert.throws(()=>createB5ManualAudit({stageId:'VB-P101-A13-W9X-B2'}),'unapproved stage ID must remain blocked');
});

test('W9-C1 G4 separate opt-in human perception and precise HUD telemetry, B5 unchanged',async()=>{
 const {observeW9C1ManualCue}=await import('../web/p101-b5-manual-qa.mjs');
 const c1=createB5ManualAudit({stageId:'VB-P101-A13-W9C1-CONTROL',spawnIndex:0});
 assert.equal(observeW9C1ManualCue(c1,{phase:'approach'},1.2),true);
 assert.equal(observeW9C1ManualCue(c1,{phase:'approach'},1.3),true);
 assert.equal(observeW9C1ManualCue(c1,{phase:'core',speedMps:85},4.6),true);
 assert.equal(observeW9C1ManualCue(c1,{phase:'exit'},5.3),true);
 assert.equal(observeW9C1ManualCue(c1,{phase:'bad'},5.5),false);
 assert.equal(recordB5ManualSample(c1,{...fake(1),w9c1NoticePhase:'approach',w9c1NoticeEtaSeconds:3.4,w9c1NoticeNominalMeters:110}),true);
 const result=finalizeB5ManualAudit(c1,{status:'failed',time:6.1,contacts:0,nearMisses:0,failure:'コースから落下'});
 assert.equal(result.w9c1G4Telemetry.observedHudLeadSeconds,3.4);
 assert.equal(result.w9c1G4Telemetry.fairnessCertified,false);
 const report=JSON.parse(exportB5ManualAudit(c1,{
  w9c1Feedback:{warningSeenEarly:4,edgeReadability:3,failureFairness:2,failureAttribution:'edge-unreadable'}
 }));
 assert.equal(report.w9c1G4.selfReport.warningSeenEarly,4);
 assert.equal(report.w9c1G4.selfReport.failureAttribution,'edge-unreadable');
 assert.equal(report.w9c1G4.humanApproval,'HOLD_NO_AUTOMATIC_PASS');
 assert.equal(report.w9c1G4.actualEntrySpeedProven,true);
 assert.equal(report.w9c1G4.observedCoreSpeedMps,85);
 assert.throws(()=>exportB5ManualAudit(c1,{w9c1Feedback:{warningSeenEarly:7}}));
 assert.throws(()=>exportB5ManualAudit(c1,{w9c1Feedback:{failureAttribution:'undefined-option'}}));
 const ultra=createB5ManualAudit({stageId:'VB-P101-A13-W9C1-ULTRA',spawnIndex:7});
 assert.equal(JSON.parse(exportB5ManualAudit(ultra)).w9c1G4.actualEntrySpeedProven,false);
 const early=createB5ManualAudit({stageId:'VB-P101-A13-W9C1-CONTROL',spawnIndex:0});
 assert.equal(JSON.parse(exportB5ManualAudit(early)).w9c1G4.actualEntrySpeedProven,false,
  'starting at 00 alone is not evidence of reaching ABYSS core');
 assert.equal(finalizeB5ManualAudit(ultra,{status:'interrupted',time:1.1}).w9c1G4Telemetry.observedHudLeadSeconds,null);
 const b5=createB5ManualAudit({stageId:'VB-P101-B5'});
 assert.equal(observeW9C1ManualCue(b5,{phase:'approach'},1),false);
 assert.equal('w9c1G4' in JSON.parse(exportB5ManualAudit(b5)),false);
 assert.throws(()=>exportB5ManualAudit(b5,{w9c1Feedback:{warningSeenEarly:4}}));
});


test('W9-C1 G5-A exported diagnostic is read-only, bounded, direction-aware and cannot certify play',()=>{
 const c1=createB5ManualAudit({stageId:'VB-P101-A13-W9C1-CONTROL',spawnIndex:0});
 const collisionEvents=[
  {type:'moving-contact',t:20.65,id:'a13-machine-05',obstacleType:'piston',mode:'push',
   normal:[0,0,-1],position:[1,2,3],velocityBefore:[0,2,140],velocityAfter:[5,15,-91],
   forward:[0,0,1],forwardBeforeMps:140,forwardAfterMps:-91,
   deltaVelocity:[5,13,-231],surfaceVelocity:[0,0,-15]},
  {type:'air',t:20.97,position:[2,3,4],surface:null},
  {type:'static-fatal-contact',t:22.533,surface:'p93-SCISSOR_RISE-01',
   part:'barrier',normal:[0,0,1],position:[4,5,6],velocityBefore:[3,-10,-79],
   forward:[0,0,1],forwardBeforeMps:-79,inwardNormalMps:-79}
 ];
 finalizeB5ManualAudit(c1,{status:'failed',time:22.533,contacts:123,
  failure:'衝突専用面へ衝突',collisionEvents});
 const saved=JSON.parse(exportB5ManualAudit(c1));
 assert.equal(saved.summary.w9c1G5Diagnostics.version,'W9-C1-G5-A-READONLY/1');
 assert.equal(saved.summary.w9c1G5Diagnostics.matchingEventCount,3);
 assert.equal(saved.summary.w9c1G5Diagnostics.events[0].forwardAfterMps,-91);
 assert.equal(saved.summary.w9c1G5Diagnostics.events[2].surface,'p93-SCISSOR_RISE-01');
 assert.equal(saved.w9c1G4.humanApproval,'HOLD_NO_AUTOMATIC_PASS');
 const many=createB5ManualAudit({stageId:'VB-P101-A13-W9C1-ULTRA'});
 finalizeB5ManualAudit(many,{status:'interrupted',time:3,
  collisionEvents:Array.from({length:100},(_,i)=>({type:'air',t:i/10,position:[0,1,2]}))});
 assert.equal(many.final.w9c1G5Diagnostics.events.length,64);
 assert.equal(many.final.w9c1G5Diagnostics.truncated,true);
 const b5=createB5ManualAudit({stageId:'VB-P101-B5'});
 finalizeB5ManualAudit(b5,{status:'failed',time:1,collisionEvents});
 assert.equal('w9c1G5Diagnostics' in b5.final,false,
  'legacy B5 exports must not receive W9-C1-only telemetry');
});
