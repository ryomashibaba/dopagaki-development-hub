import test from 'node:test';
import assert from 'node:assert/strict';
import {createP101B5SurgeState,p101B5ForwardScale,P101_B5_PROVEN_LAW} from '../web/p101-b5-forward.mjs';
import {generateP101B5Speedway} from '../scripts/p101-b5-speedway-build.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner} from '../private/reference_only/director/physics.js';

test('B5 real 7.28km only gets positive .12→.25 thrust AFTER IV, never brakes or changes road/velocity',()=>{
 const doc=generateP101B5Speedway({lowerReversalLength:1800}),r=new Runner(doc,compile(doc),0,44);
 assert.equal(doc.stageForge.fullStartToFinish,'P101_B5_A6_NATIVE_240HZ_12_MOVING_ENABLED_205_26MPS_7_OF_7_SCRIPTED_ONLY');
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
});
test('P101 B5 proven late surge cannot be reused on unverified B5 length or P100',()=>{
 const unproven=generateP101B5Speedway(),r=new Runner(unproven,compile(unproven),0,44);
 assert.throws(()=>p101B5ForwardScale(r,createP101B5SurgeState()),/7.28km/);
});
