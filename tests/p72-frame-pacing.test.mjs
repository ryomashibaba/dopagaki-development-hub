import test from 'node:test';
import assert from 'node:assert/strict';
import {stepFixedClock,FRAME_LIMIT_SECONDS,MAX_STEPS_PER_RENDER} from '../web/drive3d-loop.mjs';

const DT=1/240;
test('P72 true 240Hz catches up at 10, 15, 30, 60 and 120 rendering fps without artificial slowdown',()=>{
 for(const fps of [10,15,30,60,120]){
  let accumulator=0,steps=0,warnings=0;
  for(let i=0;i<fps*8;i++){
   const r=stepFixedClock(accumulator,1/fps,DT,()=>{steps++;return true;});
   accumulator=r.accumulator;warnings+=Number(r.overloaded);
  }
  assert(Math.abs(steps-1920)<=1,'8 seconds should consume 1920 steps at '+fps+' fps but got '+steps);
  assert.equal(warnings,0,'normal '+fps+' fps must not discard physics time');
 }
});
test('P72 exact 10fps frame performs 24 steps rather than old 12-step half-speed cap',()=>{
 let calls=0;
 const r=stepFixedClock(0,.1,DT,()=>{calls++;return true;});
 assert.equal(calls,24);
 assert.equal(r.steps,24);
 assert.equal(r.overloaded,false);
 assert(r.accumulator<1e-9);
});
test('P72 extreme 500ms stall caps work and explicitly marks lost simulation time',()=>{
 let calls=0;
 const r=stepFixedClock(0,.5,DT,()=>{calls++;return true;});
 assert.equal(calls,MAX_STEPS_PER_RENDER);
 assert.equal(r.overloaded,true);
 assert.equal(r.elapsed,FRAME_LIMIT_SECONDS);
 assert(r.accumulator<DT);
});
test('P72 failed/completed runner halts physical callback without running remaining steps',()=>{
 let calls=0;
 const r=stepFixedClock(0,.08,DT,()=>{calls++;return calls!==3;});
 assert.equal(calls,3);
 assert.equal(r.halted,true);
 assert.equal(r.steps,3);
 assert.equal(r.overloaded,false);
});
test('P72 physics-only helper leaves malformed intervals clamped and keeps budget finite',()=>{
 let steps=0;
 const r=stepFixedClock(-5,Number.NaN,DT,()=>{steps++;return true;});
 assert.equal(steps,0);
 assert.equal(r.accumulator,0);
 assert.throws(()=>stepFixedClock(0,1/30,0,()=>true),/fixed physics step/);
 let budget=0;
 const limited=stepFixedClock(0,.1,DT,()=>{budget++;return true;},5);
 assert.equal(budget,5);
 assert(limited.overloaded);
 assert(limited.accumulator<=DT);
});
