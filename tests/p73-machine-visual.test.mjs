import test from 'node:test';
import assert from 'node:assert/strict';
import {generateEchoRush} from '../scripts/p66-echo-rebuild.mjs';
import {movingObstaclePose} from '../private/reference_only/director/moving/moving-obstacles.mjs';
import {
 obstacleBodyVertices,obstacleGuideVertices,makeMachineMeshes,nearestMachineCue,visualMode
} from '../web/p73-machine-visual.mjs';

const course=generateEchoRush();
const modeSet=new Set(['fail','bounce','push']);
test('P73 six independent real machine hazards are represented without changing course physics',()=>{
 const original=course.movingObstacles.map(o=>structuredClone(o));
 const originalSurfaces=JSON.stringify(course.surfaces);
 const models=makeMachineMeshes(course.movingObstacles);
 assert.equal(models.length,6);
 assert.deepEqual(new Set(models.map(m=>m.id)),new Set(original.map(o=>o.id)));
 assert.deepEqual(new Set(models.map(m=>m.type)),new Set(['slider','rotator','piston']));
 assert.deepEqual(new Set(models.map(m=>m.mode)),modeSet);
 for(const model of models){
  assert(model.body.length>400&&model.body.length%6===0);
  assert(model.guide.length>0&&model.guide.length%6===0);
 }
 assert.deepEqual(course.movingObstacles,original);
 assert.equal(JSON.stringify(course.surfaces),originalSurfaces);
});
test('P73 machine housing respects collision size/shape for all 3 × 3 combinations',()=>{
 for(const type of ['slider','rotator','piston'])for(const mode of modeSet){
  const positions=obstacleBodyVertices(type,mode);
  assert(positions.length%18===0);
  for(let i=0;i<positions.length;i+=6){
   for(let j=0;j<3;j++)assert(Math.abs(positions[i+j])<=.501,
    'decorative moving machine mesh protrudes beyond physical OBB '+type+'/'+mode);
   for(let j=3;j<6;j++)assert(positions[i+j]>=0&&positions[i+j]<=1);
  }
  assert.equal(visualMode({collision:{mode}}),mode);
 }
 assert.equal(visualMode({}), 'fail');
});
test('P73 actual B51-C sampled 3D OBB center, size and yaw remain the render source of truth',()=>{
 const models=makeMachineMeshes(course.movingObstacles);
 for(let i=0;i<course.movingObstacles.length;i++){
  const o=course.movingObstacles[i],model=models[i];
  const pose=movingObstaclePose(o,2.73+i*.19);
  assert.deepEqual(pose.halfSize.map(x=>x*2),o.size);
  assert.equal(model.id,pose.id);
  assert.equal(model.type,pose.type);
  assert(Number.isFinite(pose.yawRadians));
  assert(pose.center.every(Number.isFinite));
 }
});
test('P73 guide trajectories are visual only, independent of snapshot frame time',()=>{
 const visual=course.movingObstacles.map(obstacleGuideVertices);
 for(const mesh of visual)assert(mesh.every(Number.isFinite));
 const before=JSON.stringify(visual);
 // The trajectory is a static reference, not a misleading instantaneous
 // collision box or a time-dependent gameplay prediction.
 for(const t of [0,1,2,15])course.movingObstacles.forEach(o=>movingObstaclePose(o,t));
 assert.equal(JSON.stringify(course.movingObstacles.map(obstacleGuideVertices)),before);
});
test('P73 nearest upcoming moving machine cue is genuinely forward-facing, mode-correct and non-predictive',()=>{
 const first=course.movingObstacles[0];
 const p=movingObstaclePose(first,0);
 const ahead=[p.center[0]-60,p.center[1],p.center[2]];
 const cue=nearestMachineCue([first],ahead,[1,0,0],0,220,movingObstaclePose);
 assert.equal(cue.id,first.id);
 assert.equal(cue.typeLabel,'SLIDER');
 assert.equal(cue.mode,'fail');
 assert.equal(cue.modeLabel,'接触で失敗');
 assert(cue.distance>=50&&cue.distance<=80);
 assert.equal(nearestMachineCue([first],ahead,[-1,0,0],0,220,movingObstaclePose),null);
 assert.equal(nearestMachineCue([first],ahead,[1,0,0],0,10,movingObstaclePose),null);
 assert.equal(nearestMachineCue([],ahead,[1,0,0],0,220,movingObstaclePose),null);
 for(const ob of course.movingObstacles){
  const state=movingObstaclePose(ob,1.2);
  const hint=nearestMachineCue([ob],[state.center[0]-30,state.center[1],state.center[2]],[1,0,0],1.2,220,movingObstaclePose);
  assert(hint&&modeSet.has(hint.mode));
 }
});
