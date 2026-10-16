import test from 'node:test';
import assert from 'node:assert/strict';
import {
 capturePose,resolveDisplayPose,createCameraState,advanceCamera,viewForPose,
 projectBallRelative,cameraYawErrorRadians
} from '../web/drive3d-camera.mjs';
const eps=(a,b,tolerance=1e-6)=>assert(Math.abs(a-b)<tolerance,String(a)+' differs from '+String(b));
const heading=rad=>[Math.sin(rad),0,Math.cos(rad)];

test('P71 pause / failure show latest committed 240Hz pose, not an interpolated historic pose',()=>{
 const previous={position:[0,2,0],forward:heading(0),time:1};
 const current={position:[10,8,25],forward:heading(1.2),time:1+1/240};
 const active=resolveDisplayPose(previous,current,1/480,1/240,true);
 assert.deepEqual(active.position,[5,5,12.5]);
 assert.deepEqual(resolveDisplayPose(previous,current,1/480,1/240,false).position,current.position);
 assert.deepEqual(resolveDisplayPose(previous,current,Infinity,1/240,true).position,current.position);
 assert.deepEqual(resolveDisplayPose(previous,current,-Infinity,1/240,true).position,previous.position);
 assert.deepEqual(resolveDisplayPose(null,current,0,1/240,true).position,current.position);
});
test('P71 real camera A/B never edits physics snapshots, simulation clock or ball screen location',()=>{
 const mock={p:[18,74,-800],forward:heading(1.3),time:23.25};
 const pose=capturePose(mock);
 const physicsBefore=JSON.stringify(mock);
 let stable=createCameraState(heading(0));
 stable=advanceCamera(stable,pose.forward,1/60);
 const raw=createCameraState(pose.forward);
 assert(cameraYawErrorRadians(stable,pose.forward)>cameraYawErrorRadians(raw,pose.forward));
 for(const state of [stable,raw]){
  const view=viewForPose(pose,state);
  eps(projectBallRelative(view)[0],0,1e-10);
  assert(view.ballPosition.every((x,i)=>x===mock.p[i]));
 }
 assert.equal(JSON.stringify(mock),physicsBefore);
});
test('P71 long frame jumps do not cause unbounded camera yaw rotation or screen displacement',()=>{
 const p={position:[230,88,-500],forward:heading(Math.PI/2),time:2};
 const start=createCameraState(heading(0));
 const a=advanceCamera(start,p.forward,1/60);
 const delayed=advanceCamera(start,p.forward,.5);
 assert(Math.abs(delayed.yaw-start.yaw) > Math.abs(a.yaw-start.yaw));
 assert(Math.abs(delayed.yaw-start.yaw)<Math.PI/2);
 eps(projectBallRelative(viewForPose(p,delayed))[0],0);
 const pause=advanceCamera(delayed,heading(-2),0);
 assert.deepEqual(pause,delayed);
});
test('P71 actual camera ball lock survives 80–140 m/s curve progression across frame rates',()=>{
 for(const fps of [15,30,60,120]){
  let state=createCameraState(heading(0));
  let x=0,z=0;
  for(let i=0;i<fps*4;i++){
   const t=i/fps,angle=.7*t,velocity=110;
   x+=velocity*Math.sin(angle)/fps;z+=velocity*Math.cos(angle)/fps;
   const p={position:[x,120+18*Math.sin(t),z],forward:heading(angle),time:t};
   state=advanceCamera(state,p.forward,1/fps);
   const view=viewForPose(p,state);
   const ball=projectBallRelative(view);
   eps(ball[0],0,1e-8);
   eps(ball[1],projectBallRelative(viewForPose({position:[0,0,0],forward:heading(0),time:0},state))[1],1e-8);
  }
 }
});
