import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7WBlend} from '../scripts/p101-w9c2-g4e7w-takeoff-blend-build.mjs';
import {sample,frame} from '../private/reference_only/director/surface.js';
import {g4e7zLowProfileSignals} from '../web/p101-w9c2-g4e7x-gap-reading.mjs';
test('G4E-7Z 14 exterior narrow signal blades anchored outside real missing B48 cell',()=>{
 for(const alpha of [.65,.7]){
  const doc=generateG4E7WBlend(alpha),before=JSON.stringify(doc),
   v=g4e7zLowProfileSignals(doc,sample,frame,{enabled:true}),
   gap=doc.stageForge.g4e7wStudy.gap;
  assert.equal(v.triangles,56);assert.equal(v.stations.length,14);
  assert(v.stations.every(x=>x.edgeClearanceMeters>=5.4));
  assert(v.stations.every(x=>x.zone==='before'?x.roadU<gap.uTakeoff:x.roadU>gap.uLanding));
  assert(v.stations.some(x=>x.role==='preview165'));
  assert(v.stations.some(x=>x.role==='takeoff4'));
  assert(v.stations.some(x=>x.role==='landing4'));
  assert.equal(v.nonCollision,true);assert.equal(v.noFakeFloor,true);
  assert.equal(v.physicalB48Unchanged,true);assert.equal(v.officialSlope2Meters,0);
  assert.equal(JSON.stringify(doc),before);
 }
 assert.equal(g4e7zLowProfileSignals(null,null,null).enabled,false);
});
