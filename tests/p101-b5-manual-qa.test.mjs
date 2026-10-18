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
