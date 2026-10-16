import test from 'node:test';
import assert from 'node:assert/strict';
import {capturePose,interpolatePose,createCameraState,advanceCamera,viewForPose,projectBallRelative,cameraTuning} from '../web/drive3d-camera.mjs';

const close=(a,b,tol=1e-6)=>assert(Math.abs(a-b)<tol,'Expected '+a+' ≈ '+b);
const yaw=(a)=>[Math.sin(a),0,Math.cos(a)];
test('P70 interpolation stays strictly between adjacent 240Hz committed positions',()=>{
 const runner={p:[0,10,20],forward:[0,0,1],time:1};
 const old=capturePose(runner);
 runner.p=[4,8,24];runner.forward=[1,0,0];runner.time=1+1/240;
 const current=capturePose(runner);
 assert.deepEqual(old.position,[0,10,20],'snapshots must not alias mutable B48 state');
 const halfway=interpolatePose(old,current,.5);
 assert.deepEqual(halfway.position,[2,9,22]);
 close(halfway.time,1+1/480);
 close(halfway.forward[0],Math.SQRT1_2);
 close(halfway.forward[2],Math.SQRT1_2);
 for(const v of [-3,2]){const result=interpolatePose(old,current,v);assert.deepEqual(result.position,v<0?old.position:current.position);}
});
test('P70 static ball center for abrupt curves, pitches and even high-speed jumps',()=>{
 const poses=[
 {position:[0,5,0],forward:yaw(0),time:0},
 {position:[110,180,-205],forward:yaw(1.3),time:1},
 {position:[900,-6,1050],forward:yaw(-2.2),time:2},
 {position:[-1400,360,70],forward:[0,.999,.02],time:3}
 ];
 let state=createCameraState(poses[0].forward);
 const stable=null;
 for(const pose of poses){
  for(let frame=0;frame<30;frame++){
   state=advanceCamera(state,pose.forward,1/60);
   const view=viewForPose(pose,state);
   const screen=projectBallRelative(view);
   close(screen[0],0,1e-9);
   // Ball height and distance relative to eye must remain exactly unchanged
   close(screen[1],-4.4739247607845,.05);
   assert(Number.isFinite(screen[2])&&screen[2]>0);
   close(Math.hypot(...view.right),1,1e-10);
   close(Math.hypot(...view.up),1,1e-10);
  }
 }
 assert.equal(stable,null);
});
test('P70 yaw filter is time-based and frame-rate independent at 30/60/120 fps',()=>{
 const run=fps=>{
  let state=createCameraState(yaw(0));
  for(let i=0;i<fps;i++)state=advanceCamera(state,yaw(Math.PI/2),1/fps);
  return state.yaw;
 };
 close(run(30),run(60),.0001);
 close(run(60),run(120),.0001);
 assert(run(60)>Math.PI/2*.95&&run(60)<Math.PI/2);
});
test('P70 180-degree flip is smooth, wrap-safe and reset snaps to new spawn',()=>{
 let state=createCameraState(yaw(179*Math.PI/180));
 for(let i=0;i<20;i++){
  const next=advanceCamera(state,yaw(-179*Math.PI/180),1/60);
  assert(Math.abs(next.yaw-state.yaw)<.015,'wrap caused one-frame camera jerk');
  state=next;
 }
 const reset=createCameraState(yaw(-Math.PI/2));
 close(reset.yaw,-Math.PI/2);
 const view=viewForPose({position:[200,50,-300],forward:yaw(0),time:0},reset);
 close(projectBallRelative(view)[0],0);
});
test('P70 zero-step pause and unusual vertical forward remain finite',()=>{
 const p={position:[5,6,7],forward:[0,1,0],time:0};
 let state=createCameraState([0,0,1]);
 state=advanceCamera(state,p.forward,0);
 close(state.yaw,0);
 const view=viewForPose(p,state);
 assert([...view.eye,...view.front,...view.right,...view.up].every(Number.isFinite));
 assert.equal(cameraTuning.followDistance,14);
});
