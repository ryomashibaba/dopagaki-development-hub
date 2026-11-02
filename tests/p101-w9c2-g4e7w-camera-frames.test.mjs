import test from 'node:test';
import assert from 'node:assert/strict';
import {G4E7W_VISUAL_PROFILES,G4E7W_SHOTS,g4e7wNativeCameraFrames} from '../scripts/p101-w9c2-g4e7w-camera-frames.mjs';
import {viewForPose} from '../web/drive3d-camera.mjs';
test('G4E-7W native camera uses actual nonhuman 240Hz Runner speed/position',()=>{
 const a=g4e7wNativeCameraFrames();
 assert.equal(a.real240Hz,240);assert.equal(a.officialSlope2Meters,0);
 assert.deepEqual(Object.keys(a.stages),['A065','A070']);
 for(const q of G4E7W_VISUAL_PROFILES){
  const s=a.stages[q.name];assert.equal(s.frames.length,5);
  assert.equal(s.actualRoads,7);assert.equal(s.movingMachines,28);
  assert(s.physicalGap.realCollisionGap);
  for(let i=0;i<s.frames.length;i++){
   const f=s.frames[i],t=G4E7W_SHOTS[i];
   assert.equal(f.id,t.id);assert(Math.abs(f.timeSeconds-t.seconds)<1e-4);
   assert(f.speedMps>0&&f.speedMps<150);
   const view=viewForPose(f.pose,{yaw:f.yaw});
   assert.deepEqual(view.eye,f.eye);
  }
 }
});
