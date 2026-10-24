import test from 'node:test';
import assert from 'node:assert/strict';
import {generateG4E7ACR2} from '../scripts/p101-w9c2-g4e7ac-r2-physical.mjs';
import {g4e7adNativeFrames,AD_VARIANTS} from '../scripts/p101-w9c2-g4e7ad-native-frames.mjs';
import {g4e7adCity} from '../web/p101-w9c2-g4e7ad-city.mjs';
import {sample} from '../private/reference_only/director/surface.js';
test('AD city modifies GPU only; zero real stage changes',()=>{
 for(const id of AD_VARIANTS){
  const d=generateG4E7ACR2(id),str=JSON.stringify(d);
  const off=g4e7adCity(d,sample,{enabled:false});
  assert.equal(off.active,false);
  const on=g4e7adCity(d,sample,{enabled:true});
  assert.equal(on.active,true);assert.equal(on.spires,12);
  assert.equal(on.windows,24);assert(on.minClearanceMeters>=60);
  assert.equal(on.physicalGapBridged,false);
  assert.equal(on.addedRoads,0);assert.equal(on.addedMachines,0);
  assert.equal(on.formalSlope2Meters,0);
  assert.equal(JSON.stringify(d),str);
 }
});
test('AD native frames use authentic 240Hz start00 and actual stage ID',()=>{
 const proof=g4e7adNativeFrames();
 assert.equal(proof.physicsHz,240);assert.equal(proof.certifiedSlope2Meters,0);
 for(const id of AD_VARIANTS){
  const d=generateG4E7ACR2(id),entry=proof.stages[id];
  assert.equal(entry.stageId,d.stageForge.recordStageId);
  assert.equal(entry.originalRoads,7);
  assert.equal(entry.originalMovingMachines,28);
  assert.equal(entry.frames.length,6);
  assert(entry.frames.every(f=>f.source==='ACTUAL_240HZ_START00_P96_NOT_HUMAN'&&
    f.speedMps>52&&Number.isFinite(f.yaw)));
 }
});
