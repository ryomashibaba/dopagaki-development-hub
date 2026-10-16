import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {Runner,DT,RADIUS} from '../private/reference_only/director/physics.js';
import {compile} from '../private/reference_only/director/collision.js';
import {movingObstaclePose,sphereBoxSeparation} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {createNearMissTracker,stepNearMiss,nearMissDisplay} from '../web/p74-nearmiss.mjs';

const ob={id:'testSlider',name:'static-test-sleeve',type:'slider',
 position:[0,0,0],size:[4,4,4],period:4,phase:0,
 motion:{axis:[0,0,1],amplitude:0},enabled:true,collision:{mode:'fail'}};
const sample=(state,runner,obstacles=[ob])=>stepNearMiss(state,obstacles,runner,movingObstaclePose,sphereBoxSeparation,RADIUS);
function runPass(z,contactAt=null,renderFps=60){
 const tracker=createNearMissTracker(),runner={
  p:[-80,0,z],forward:[1,0,0],v:[45,0,0],time:0,
  events:[],status:'running'
 };
 const messages=[];const samples=[];
 for(let i=0;i<2.3/DT;i++){
  runner.time=(i+1)*DT;runner.p=[-80+45*runner.time,0,z];
  if(contactAt!==null&&runner.time>=contactAt&&!runner.events.length)
   runner.events.push({type:'moving-contact',id:ob.id,mode:'bounce',t:runner.time});
  const e=sample(tracker,runner);if(e)messages.push(e);
  if(i%Math.max(1,Math.floor(240/renderFps))===0)samples.push(nearMissDisplay(tracker,runner.time)?.id||null);
 }
 return {tracker,messages,samples};
}
test('P74 240Hz actual physical box near miss is awarded exactly once after complete clean pass',()=>{
 const {tracker,messages}=runPass(4.4);
 assert.equal(messages.length,1);
 assert.equal(messages[0].id,'testSlider');
 assert.equal(messages[0].total,1);
 assert(messages[0].clearance>1&&messages[0].clearance<2.4);
 assert.equal(tracker.total,1);
 assert.equal(tracker.byId.get('testSlider').completed,true);
 assert.equal(nearMissDisplay(tracker,messages[0].time+1.7)?.id,'testSlider');
 assert.equal(nearMissDisplay(tracker,messages[0].time+1.81),null);
});
test('P74 real contact cancels a near miss even if visual clearance later becomes positive',()=>{
 for(const z of [0,2.3]){
  const {messages,tracker}=runPass(z);
  assert.equal(messages.length,0,'overlapping physical collider cannot earn near miss');
  assert.equal(tracker.total,0);
 }
 const bounced=runPass(4.4,.8);
 assert.equal(bounced.messages.length,0,'B51-C bounce event must cancel near miss even when final pose is clear');
});
test('P74 far clearance, opposite-direction and failure never generate awards',()=>{
 assert.equal(runPass(25).messages.length,0);
 const tracker=createNearMissTracker();
 const runner={p:[-40,0,4.4],forward:[-1,0,0],v:[-45,0,0],time:0,events:[],status:'running'};
 for(let i=0;i<300;i++){
  runner.time=i*DT;runner.p[0]-=.3;
  assert.equal(sample(tracker,runner),null);
 }
 assert.equal(tracker.total,0);
 runner.status='failed';runner.p=[10,0,4.4];
 assert.equal(sample(tracker,runner),null);
});
test('P74 award count and clearance invariant at 10, 30, 60 and 120 render fps',()=>{
 const attempts=[10,30,60,120].map(fps=>runPass(4.4,null,fps));
 const event=attempts[0].messages[0];
 for(const attempt of attempts){
  assert.equal(attempt.tracker.total,1);
  assert.equal(attempt.messages[0].time,event.time);
  assert.equal(attempt.messages[0].clearance,event.clearance);
 }
});
test('P74 flight-simulator integration has no effect on real B48 velocity, road contacts or points',()=>{
 const stage=generateEchoRush(),world=compile(stage);
 const a=new Runner(stage,world,3,44),b=new Runner(stage,world,3,44);
 const tracker=createNearMissTracker();
 for(let i=0;i<240;i++){
  a.step(0);b.step(0);
  sample(tracker,b,stage.movingObstacles);
 }
 assert.deepEqual(a.p,b.p);
 assert.deepEqual(a.v,b.v);
 assert.equal(a.status,b.status);
 assert.equal(a.points,b.points);
 assert.equal(a.collisions,b.collisions);
 assert.deepEqual(a.events,b.events);
 assert.equal(tracker.total,0);
});
test('P74 absent required canonical collision samplers and invalid radius fail closed',()=>{
 const t=createNearMissTracker(),r={p:[0,0,0],time:0,forward:[1,0,0],v:[44,0,0],status:'running',events:[]};
 assert.throws(()=>stepNearMiss(t,[ob],r,null,sphereBoxSeparation,RADIUS),/required/);
 assert.throws(()=>stepNearMiss(t,[ob],r,movingObstaclePose,sphereBoxSeparation,0),/radius/);
});
