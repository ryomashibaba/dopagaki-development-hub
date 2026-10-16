import test from 'node:test';
import assert from 'node:assert/strict';
import {stepFixedClock} from '../web/drive3d-loop.mjs';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {compile} from '../private/reference_only/director/collision.js';
import {Runner,DT} from '../private/reference_only/director/physics.js';

test('P72 identical real B48 240Hz physics at 10/15/30/60/120 render FPS on a 6-second giant intake',()=>{
 const doc=generateEchoRush(),world=compile(doc);
 function trial(fps){
  const ball=new Runner(doc,world,0,44);
  let accumulator=0,slowFrames=0,count=0;
  for(let i=0;i<fps*6;i++){
   const result=stepFixedClock(accumulator,1/fps,DT,()=>{
    ball.step(0);count++;
    return ball.status!=='failed'&&ball.status!=='finished';
   });
   accumulator=result.accumulator;slowFrames+=+result.overloaded;
  }
  return {fps,status:ball.status,reason:ball.failure?.reason??null,
   time:ball.time,position:[...ball.p],speed:Math.hypot(...ball.v),count,slowFrames};
 }
 const baseline=trial(60);
 for(const fps of [10,15,30,120]){
  const attempt=trial(fps);
  assert.equal(attempt.status,baseline.status,'physics status at '+fps);
  assert.equal(attempt.reason,null,'unexpected physics failure at '+fps);
  assert.equal(attempt.count,baseline.count,'fixed physics step count at '+fps);
  assert.equal(attempt.slowFrames,0,'false overload warnings at '+fps);
  assert(Math.abs(attempt.time-baseline.time)<1e-9,'physics clock at '+fps);
  for(let k=0;k<3;k++)
   assert(Math.abs(attempt.position[k]-baseline.position[k])<1e-8,'physical world position drift at '+fps);
  assert(Math.abs(attempt.speed-baseline.speed)<1e-8,'non-deterministic velocity at '+fps);
 }
 assert.equal(baseline.count,1440);
 console.log('P72_REAL_RUNNER_FRAME_INVARIANCE '+JSON.stringify({seconds:6,fps:[10,15,30,60,120],steps:baseline.count,finalSurface:'p66-PIPE_DIVE_A',speed:Number(baseline.speed.toFixed(2))}));
});
