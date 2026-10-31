import test from 'node:test';
import assert from 'node:assert/strict';
import {createP101B5SurgeState,p101B5ForwardScale,P101_B5_PROVEN_LAW,p101B5RecordStageId} from '../web/p101-b5-forward.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner} from '../private/reference_only/director/physics.js';
import {runRecordKey} from '../web/p75-survival.mjs';
import {generateP100TerrainPulseCandidate} from '../scripts/p100-terrain-pulse-build.mjs';

test('B5 real 7.28km only gets positive .12→.25 thrust AFTER IV, never brakes or changes road/velocity',()=>{
 const doc=generateP101B5Speedway({lowerReversalLength:1800}),r=new Runner(doc,compile(doc),0,52);
 assert.equal(doc.stageForge.fullStartToFinish,'P101_B5_A9_NATIVE_240HZ_12_MOVING_ENABLED_52MPS_START_206_28MPS_7_OF_7_SCRIPTED_ONLY');
 const state=createP101B5SurgeState(),p=[...r.p],v=[...r.v];
 assert.equal(p101B5ForwardScale(r,state),.12);
 // Physically airborne frame retains last legitimate grounded progress.
 r.surface=null;state.section=4;state.u=0;
 assert.equal(p101B5ForwardScale(r,state),.12);
 state.u=.45;
 assert.equal(p101B5ForwardScale(r,state),.25);
 state.section=5;state.u=0;
 assert.equal(p101B5ForwardScale(r,state),.25);
 assert.deepEqual(r.p,p);
 assert.deepEqual(r.v,v);
 assert.equal(P101_B5_PROVEN_LAW.humanApproval,'NOT_RUN');
 assert.equal(P101_B5_PROVEN_LAW.nativeStartSpeedMps,52);
 assert.equal(P101_B5_PROVEN_LAW.verifiedNativePeakSpeedMps,206.28);
});
test('P101 B5 proven late surge cannot be reused on unverified B5 length or P100',()=>{
 const unproven=generateP101B5Speedway(),r=new Runner(unproven,compile(unproven),0,44);
 assert.throws(()=>p101B5ForwardScale(r,createP101B5SurgeState()),/7.28km/);
});

test('P101 B5 survival personal best uses a different persistent stage key from B4E, P100 and older stages',()=>{
 const b5=generateP101B5Speedway({lowerReversalLength:1800});
 const baseline=generateP100TerrainPulseCandidate();
 const b4={stageForge:{id:'VB-P101',variant:'B4E_ISOLATED'}};
 const b5id=p101B5RecordStageId(b5);
 assert.equal(b5id,'VB-P101-B5');
 assert.equal(p101B5RecordStageId(b4),'VB-P101');
 assert.equal(p101B5RecordStageId(baseline),'VB-P100');
 assert.notEqual(runRecordKey(b5id,0),runRecordKey(p101B5RecordStageId(b4),0));
 assert.notEqual(runRecordKey(b5id,0),runRecordKey('VB-P100',0));
 assert.equal(b5.stageForge.genuineFastLaw.provenStartSpeedMps,52);
});
