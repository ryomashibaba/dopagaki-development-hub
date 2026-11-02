import test from 'node:test';
import assert from 'node:assert/strict';
import {g4e7wNativeCameraFrames,G4E7Y_EARLY_SHOTS} from '../scripts/p101-w9c2-g4e7w-camera-frames.mjs';
test('G4E-7Y records earlier actual 240Hz distance-to-gap, no fake 195m timing',()=>{
 const a=g4e7wNativeCameraFrames(G4E7Y_EARLY_SHOTS);
 assert.equal(a.real240Hz,240);assert.equal(a.officialSlope2Meters,0);
 assert.deepEqual(G4E7Y_EARLY_SHOTS.map(x=>x.id),['t265','t315','t365','t415','t450']);
 for(const key of ['A065','A070']){
  const s=a.stages[key];assert(s.frames.length===5);assert(s.movingMachines===28);
  for(let i=0;i<5;i++){
   const q=s.frames[i],label=G4E7Y_EARLY_SHOTS[i];
   assert.equal(q.id,label.id);
   assert(Math.abs(q.timeSeconds-label.seconds)<1e-4);
   assert(q.eyeToActualTakeoffMeters>0);
   assert(q.source==='TRUE_START00_240HZ_P96_NOT_HUMAN');
   if(i>0)assert(q.eyeToActualTakeoffMeters<s.frames[i-1].eyeToActualTakeoffMeters);
  }
  assert(s.frames[0].eyeToActualTakeoffMeters>100);
 }
});
