import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7vRealCameraFrames,G4E7V_FRAMES,G4E7V_VISUAL_IDS} from '../scripts/p101-w9c2-g4e7v-camera-frames.mjs';
import {viewForPose} from '../web/drive3d-camera.mjs';
test('G4E-7V A/B/C 12 actual native 240Hz camera frames and original velocity HUD proof',()=>{
 const r=g4e7vRealCameraFrames();
 assert.equal(r.physicsHz,240);assert.equal(r.officialSlope2Meters,0);
 assert.deepEqual(Object.keys(r.stages),[...G4E7V_VISUAL_IDS]);
 assert(r.normalPlayUnchanged);assert.equal(r.publication,'HOLD');
 for(const key of G4E7V_VISUAL_IDS){
  const stage=r.stages[key];assert.equal(stage.frames.length,4);
  assert.equal(stage.realRoads,7);assert.equal(stage.movingMachines,28);
  for(let i=0;i<stage.frames.length;i++){
   const f=stage.frames[i];
   assert.equal(f.id,G4E7V_FRAMES[i].id);
   assert(f.speedMps>50&&f.speedMps<140);
   assert(Math.abs(f.timeSeconds-G4E7V_FRAMES[i].timeSeconds)<1e-4);
   const view=viewForPose(f.pose,{yaw:f.yaw});
   assert.deepEqual(view.eye,f.eye);assert.deepEqual(view.front,f.front);
  }
 }
});
